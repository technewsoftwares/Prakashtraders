import json
import uuid
import requests
import os
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Order, Transaction
from django.http import JsonResponse
from .models import Order, OrderItem, Transaction
from django.contrib.auth.models import User


# CREATE ORDER

import traceback

@csrf_exempt
def create_order(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=400)

    try:
        data = json.loads(request.body)
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

        Order.objects.create(
            order_id=order_id,
            name=data.get("name", ""),
            mobile=data.get("mobile", ""),
            address=data.get("address", ""),
            pincode=data.get("pincode", ""),
            total_amount=amount,
            status="PENDING"
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

