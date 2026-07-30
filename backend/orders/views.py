import json
import razorpay
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Order, Transaction
from django.http import JsonResponse
from .models import Order, OrderItem, Transaction
from django.contrib.auth.models import User




client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)


# CREATE ORDER

@csrf_exempt
def create_order(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=400)

    data = json.loads(request.body)

    amount_rupees = int(data["amount"])
    payment_mode = data.get("payment_mode", "ONLINE")
    items = data.get("items", [])

    user = None
    if data.get("user_id"):
       user = User.objects.filter(id=data["user_id"]).first()


    # 🔹 CREATE ORDER ID
    if payment_mode == "ONLINE":
        razorpay_order = client.order.create({
            "amount": amount_rupees * 100,
            "currency": "INR",
            "payment_capture": 1
        })
        order_id = razorpay_order["id"]
    else:
        order_id = f"COD-{Order.objects.count()+1}"

    # 🔹 SAVE ORDER
    order = Order.objects.create(
    user=user,              # 👈 ADD THIS LINE
    order_id=order_id,
    name=data["name"],
    mobile=data["mobile"], 
    address=data["address"],
    pincode=data["pincode"],
    total_amount=amount_rupees,
    status="PENDING"
)


    # 🔹 SAVE ORDER ITEMS (THIS WAS MISSING ❗)
    for item in items:
        OrderItem.objects.create(
            order=order,
            product_name=item.get("name", "Product"),
            price=item.get("price", amount_rupees),
            quantity=item.get("qty", 1)
        )

    # 🔹 IF COD → RETURN DIRECTLY
    if payment_mode == "COD":
        return JsonResponse({
            "status": "COD_PLACED",
            "order_id": order.order_id
        })

    # 🔹 ONLINE PAYMENT RESPONSE
    return JsonResponse({
        "razorpay_order_id": order_id,
        "amount": amount_rupees * 100
    })



# VERIFY PAYMENT

@csrf_exempt
def verify_payment(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=400)

    data = json.loads(request.body)

    try:
        client.utility.verify_payment_signature(data)
    except razorpay.errors.SignatureVerificationError:
        return JsonResponse({"status": "FAILED"})

    order = Order.objects.get(order_id=data["razorpay_order_id"])

    Transaction.objects.create(
        order=order,
        transaction_id=data["razorpay_payment_id"],
        amount=order.total_amount,
        status="PAID"
    )

    order.status = "PAID"
    order.save()

    return JsonResponse({
        "status": "PAID",
        "order_id": order.order_id
    })

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

