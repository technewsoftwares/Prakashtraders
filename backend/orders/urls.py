from django.urls import path
from .views import create_order, verify_payment, payment_webhook, admin_orders

urlpatterns = [
    path("create-order/", create_order),
    path("verify-payment/", verify_payment),
    path("webhook/", payment_webhook, name="payment-webhook"),
    path("admin-orders/", admin_orders),
]
