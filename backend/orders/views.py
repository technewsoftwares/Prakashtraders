import json
import uuid
import requests
import os
import base64
import hashlib
import hmac
import traceback
from django.conf import settings
from django.http import JsonResponse
from .models import Order, Transaction
from rest_framework.views import APIView
from django.contrib.auth.models import User
from accounts.brevo import send_brevo_email
from rest_framework.response import Response
from .models import Order, OrderItem, Transaction
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.decorators import login_required
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes

# CREATE ORDER

import traceback

@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def create_order(request):
    try:
        data = json.loads(request.body)
        items = data.get("items", [])
        print("REQUEST DATA:", data)

        amount = float(data.get("amount", 0))
        customer_email = data.get("email") or request.user.email or ""

        order_id = f"ORD_{uuid.uuid4().hex[:10]}"

           payload = {
                "order_id": order_id,
                "order_amount": amount,
                "order_currency": "INR",
            
                "customer_details": {
                    "customer_id": order_id,
                    "customer_name": data.get("name", "Customer"),
                    "customer_email": customer_email,
                    "customer_phone": data.get("mobile", "")
                },
            
                "order_meta": {
                    "notify_url": "https://backend-yprm.onrender.com/api/webhook/"
                }
            }
    
            print("CASHFREE PAYLOAD:", payload)
    
            headers = {
                "x-client-id": settings.CASHFREE_CLIENT_ID,
                "x-client-secret": settings.CASHFREE_CLIENT_SECRET,
                "x-api-version": "2023-08-01",
                "Content-Type": "application/json"
            }
    
            # ================= ADMIN EMAIL =================
            
            items_html = ""
            
            for item in items:
                items_html += f"""
                • {item.get('name')}<br>
                Qty : {item.get('qty', 1)}<br>
                Price : ₹{item.get('price')}<br><br>
                """
            
            admin_message = f"""
            <h2>🛒 New Order Received</h2>
            
            <b>Name:</b> {data.get("name")}<br>
            <b>Mobile:</b> {data.get("mobile")}<br>
            <b>Email:</b> {data.get("email")}<br><br>
            
            <b>Address</b><br>
            
            {data.get("address")}<br>
            {data.get("city")}<br>
            {data.get("district")}<br>
            {data.get("state")}<br>
            {data.get("pincode")}<br><br>
            
            <h3>Products</h3>
            
            {items_html}
            
            <hr>
            
            <h3>Total : ₹{amount}</h3>
            """
            
            try:
                send_brevo_email(
                    to_email="kabilandina11@gmail.com",
                    subject="🛒 New Order Received",
                    message=admin_message
                )
                print("ADMIN EMAIL SENT SUCCESSFULLY")
    
            except Exception as email_error:
                print("⚠️ ADMIN EMAIL FAILED:", email_error)
                traceback.print_exc()       
    
            response = requests.post(
                "https://api.cashfree.com/pg/orders",
                json=payload,
                headers=headers,
                timeout=30
            )
    
            print("CASHFREE STATUS:", response.status_code)
            print("CASHFREE RESPONSE:", response.text)
    
            result = response.json()
    
            if response.status_code != 200:
                return JsonResponse(result, status=response.status_code)
    
            order = Order.objects.create(
                user=request.user,
                order_id=order_id,
                cashfree_order_id=order_id,
                name=data.get("name", ""),
                email=customer_email,  # 👈 ADD
                mobile=data.get("mobile", ""),
                address=data.get("address", ""),
                pincode=data.get("pincode", ""),
                total_amount=amount,
                status="PENDING"
            )
            for item in items:
                OrderItem.objects.create(
                    order=order,
                    product_name=item.get("name", ""),
                    price=item.get("price", 0),
                    quantity=item.get("qty", 1),
                )
    
            return JsonResponse({
                "order_id": order_id,
                "payment_session_id": result["payment_session_id"]
            })
    
        except Exception as e:
            print("========== CREATE ORDER ERROR ==========")
            traceback.print_exc()
            print("ERROR TYPE:", type(e).__name__)
            print("ERROR:", str(e))
    
            return JsonResponse({
                "error": str(e)
            }, status=500)
    
    

# VERIFY PAYMENT
@csrf_exempt
def verify_payment(request):

    try:

        if request.method != "POST":
            return JsonResponse(
                {"error": "POST required"},
                status=405
            )

        data = json.loads(request.body)

        order_id = data.get("order_id")

        if not order_id:
            return JsonResponse(
                {"error": "order_id required"},
                status=400
            )

        headers = {
            "x-client-id": settings.CASHFREE_CLIENT_ID,
            "x-client-secret": settings.CASHFREE_CLIENT_SECRET,
            "x-api-version": "2023-08-01"
        }

        response = requests.get(
            f"https://api.cashfree.com/pg/orders/{order_id}/payments",
            headers=headers,
            timeout=30
        )

        print("VERIFY CASHFREE STATUS:", response.status_code)
        print("VERIFY CASHFREE RESPONSE:", response.text)

        payments = response.json()

        # Find successful payment
        successful_payment = next(
            (
                payment
                for payment in payments
                if payment.get("payment_status") == "SUCCESS"
            ),
            None
        )

        if not successful_payment:

            return JsonResponse({
                "status": "PENDING"
            })

        order = Order.objects.get(
            order_id=order_id
        )

        # Create transaction only once
        Transaction.objects.update_or_create(
            order=order,
            defaults={
                "transaction_id": successful_payment.get(
                    "cf_payment_id"
                ),
                "amount": order.total_amount,
                "status": "PAID"
            }
        )

        # Update order
        order.status = "PAID"
        order.save()

        return JsonResponse({
            "status": "PAID",
            "order_id": order_id
        })

    except Order.DoesNotExist:

        return JsonResponse({
            "error": "Order not found"
        }, status=404)

    except Exception as e:

        print("VERIFY PAYMENT ERROR:", e)
        traceback.print_exc()

        return JsonResponse({
            "error": str(e)
        }, status=500)

def admin_orders(request):
    if request.method != "GET":
        return JsonResponse({"error": "GET required"}, status=400)

    orders = Order.objects.all().order_by("-created_at")
    response = []

    for order in orders:
        items = OrderItem.objects.filter(order=order)
        transaction = Transaction.objects.filter(order=order).first()

        response.append({
            "order_id": order.order_id,
            "name": order.name,
            "mobile": order.mobile, 
            "address": order.address,
             "pincode": order.pincode, 
            "total_amount": float(order.total_amount),
            "status": order.status,
            "created_at": order.created_at.isoformat(),

            "items": [
                {
                    "product_name": i.product_name,
                    "price": float(i.price),
                    "quantity": i.quantity
                } for i in items
            ],
            "transaction": {
                "transaction_id": transaction.transaction_id if transaction else None,
                "status": transaction.status if transaction else "COD"
            }
        })

    return JsonResponse(response, safe=False)

@csrf_exempt
def payment_webhook(request):

    try:

       
        # ONLY POST
       

        if request.method != "POST":
            return JsonResponse(
                {"error": "POST required"},
                status=405
            )

       
        # CASHFREE WEBHOOK HEADERS
       

        signature = request.headers.get(
            "x-webhook-signature"
        )

        timestamp = request.headers.get(
            "x-webhook-timestamp"
        )

        if not signature or not timestamp:
            return JsonResponse(
                {"error": "Missing webhook signature"},
                status=400
            )

       
        # VERIFY CASHFREE SIGNATURE
       

        raw_body = request.body

        signature_data = (
            timestamp +
            raw_body.decode("utf-8")
        )

        expected_signature = base64.b64encode(
            hmac.new(
                settings.CASHFREE_CLIENT_SECRET.encode("utf-8"),
                signature_data.encode("utf-8"),
                hashlib.sha256
            ).digest()
        ).decode("utf-8")

        if not hmac.compare_digest(
            expected_signature,
            signature
        ):
            print("❌ INVALID CASHFREE WEBHOOK SIGNATURE")

            return JsonResponse(
                {"error": "Invalid signature"},
                status=401
            )

        print("✅ CASHFREE WEBHOOK SIGNATURE VERIFIED")

       
        # READ WEBHOOK DATA
       

        data = json.loads(raw_body)

        print("========== CASHFREE WEBHOOK ==========")
        print(json.dumps(data, indent=2))

        event_type = data.get("type")

        print("EVENT TYPE:", event_type)

       
        # PAYMENT SUCCESS
       

        if event_type == "PAYMENT_SUCCESS_WEBHOOK":

            webhook_data = data.get("data", {})

            order_data = webhook_data.get(
                "order",
                {}
            )

            payment_data = webhook_data.get(
                "payment",
                {}
            )

            order_id = order_data.get(
                "order_id"
            )

            payment_status = payment_data.get(
                "payment_status"
            )

            cf_payment_id = payment_data.get(
                "cf_payment_id"
            )

            print("ORDER ID:", order_id)
            print("PAYMENT STATUS:", payment_status)
            print("PAYMENT ID:", cf_payment_id)

           
            # CHECK PAYMENT STATUS
           

            if payment_status != "SUCCESS":

                print(
                    "PAYMENT NOT SUCCESS:",
                    payment_status
                )

                return JsonResponse({
                    "status": "ignored"
                })

           
            # FIND ORDER
           

            try:

                order = Order.objects.get(
                    order_id=order_id
                )

            except Order.DoesNotExist:

                print(
                    "❌ ORDER NOT FOUND:",
                    order_id
                )

                return JsonResponse(
                    {"error": "Order not found"},
                    status=404
                )

           
            # CHECK WHETHER ALREADY PAID
           

            was_already_paid = (
                order.status == "PAID"
            )

           
            # CREATE / UPDATE TRANSACTION
           

            Transaction.objects.update_or_create(
                order=order,
                defaults={
                    "transaction_id": cf_payment_id,
                    "amount": order.total_amount,
                    "status": "PAID"
                }
            )

           
            # UPDATE ORDER
           

            order.status = "PAID"
            order.save()

            print(
                "✅ ORDER UPDATED TO PAID:",
                order_id
            )

           
            # SEND CUSTOMER EMAIL
           

            if not was_already_paid:

                customer_email = (
                    order.email
                    or (
                        order.user.email
                        if order.user
                        else ""
                    )
                )

                print(
                    "CUSTOMER EMAIL:",
                    customer_email
                )

                if customer_email:

                    customer_message = f"""
                    <h2>🎉 Payment Successful!</h2>

                    <p>Dear {order.name},</p>

                    <p>
                    Your payment has been successfully received.
                    </p>

                    <hr>

                    <b>Order ID:</b> {order.order_id}<br>
                    <b>Amount Paid:</b> ₹{order.total_amount}<br>
                    <b>Payment ID:</b> {cf_payment_id}<br>
                    <b>Status:</b> PAID

                    <br><br>

                    Your order is now being processed.

                    <br><br>

                    Thank you for shopping with
                    <b>Prakash Traders</b> ❤️
                    """

                    try:

                        send_brevo_email(
                            to_email=customer_email,
                            subject="🎉 Payment Successful - Prakash Traders",
                            message=customer_message
                        )

                        print(
                            "✅ CUSTOMER PAYMENT EMAIL SENT"
                        )

                    except Exception as email_error:

                        print(
                            "❌ CUSTOMER EMAIL FAILED:",
                            email_error
                        )

                        traceback.print_exc()

                else:

                    print(
                        "⚠️ CUSTOMER EMAIL NOT FOUND"
                    )

            return JsonResponse({
                "status": "PAID",
                "order_id": order_id
            })

       
        # OTHER CASHFREE EVENTS
       

        print(
            "WEBHOOK RECEIVED:",
            event_type
        )

        return JsonResponse({
            "status": "received",
            "event": event_type
        })

    except Exception as e:

        print("========== WEBHOOK ERROR ==========")
        print("ERROR:", str(e))

        traceback.print_exc()

        return JsonResponse({
            "error": str(e)
        }, status=500)

@csrf_exempt
def delete_order(request, order_id):
    if request.method != "DELETE":
        return JsonResponse({"error": "DELETE required"}, status=400)

    try:
        order = Order.objects.get(order_id=order_id)
        order.delete()

        return JsonResponse({
            "success": True,
            "message": "Order deleted successfully"
        })

    except Order.DoesNotExist:
        return JsonResponse({
            "error": "Order not found"
        }, status=404)

    except Exception as e:
        return JsonResponse({
            "error": str(e)
        }, status=500)

class UserOrdersView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):

        orders = Order.objects.filter(user=request.user).order_by("-created_at")

        data = []

        for order in orders:
            items = OrderItem.objects.filter(order=order)

            data.append({
                "order_id": order.order_id,
                "status": order.status,
                "total_amount": float(order.total_amount),
                "created_at": order.created_at,
                "items": [
                    {
                        "product_name": item.product_name,
                        "price": float(item.price),
                        "quantity": item.quantity,
                    }
                    for item in items
                ]
            })

        return Response(data)
