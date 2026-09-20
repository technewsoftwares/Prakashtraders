from django.urls import path
from .views import create_order, verify_payment, payment_webhook, admin_orders, delete_order, UserOrdersView, track_order, update_order_tracking

urlpatterns = [
    path("create-order/", create_order),
    path("verify-payment/", verify_payment),
    path("webhook/", payment_webhook, name="payment-webhook"),
    path("admin-orders/", admin_orders),
    path("admin-orders/delete/<str:order_id>/", delete_order),
    path("my-orders/", UserOrdersView.as_view()),
    path("track/<str:order_id>/", track_order, name="track-order"),
    path("admin/update-tracking/<str:order_id>/", update_order_tracking, name="admin-update-order-tracking"),
]
