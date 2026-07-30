from django.urls import path
from .views import create_order, verify_payment, admin_orders

urlpatterns = [
    path("create-order/", create_order),
    path("verify-payment/", verify_payment),
    path("admin-orders/", admin_orders),
]
