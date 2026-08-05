import json
import uuid
import requests
import os
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

# CREATE ORDER

import traceback

@csrf_exempt
def create_order(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=400)

    try:
        data = json.loads(request.body)
        items = data.get("items", [])
        print("REQUEST DATA:", data)

        amount = float(data.get("amount", 0))

        order_id = f"ORD_{uuid.uuid4().hex[:10]}"

        payload = {
            "order_id": order_id,
            "order_amount": amount,
            "order_currency": "INR",
            "customer_details": {
                "customer_id": order_id,
                "customer_name": data.get("name", "Customer"),
                "customer_email": data.get("email", "customer@example.com"),
                "customer_phone": data.get("phone", "9999999999")
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
        
        send_brevo_email(
            to_email="kabilandina11@gmail.com",   # Your admin email
            subject="🛒 New Order Received",
            message=admin_message
        )
                

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
            name=data.get("name", ""),
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
        data = json.loads(request.body)

        order_id = data.get("order_id")

        headers = {
            "x-client-id": settings.CASHFREE_CLIENT_ID,
            "x-client-secret": settings.CASHFREE_CLIENT_SECRET,
            "x-api-version": "2023-08-01"
        }

        response = requests.get(
            f"https://api.cashfree.com/pg/orders/{order_id}/payments",
            headers=headers
        )

        payments = response.json()

        if payments and payments[0]["payment_status"] == "SUCCESS":

            order = Order.objects.get(order_id=order_id)

            Transaction.objects.create(
                order=order,
                transaction_id=payments[0]["cf_payment_id"],
                amount=order.total_amount,
                status="PAID"
            )

            order.status = "PAID"
            order.save()

            return JsonResponse({"status": "PAID"})

        return JsonResponse({"status": "FAILED"})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

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
    return JsonResponse({
        "status": "Webhook received"
    })

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
