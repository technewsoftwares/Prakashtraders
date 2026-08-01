from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SendOTP, 
    VerifyOTP, 
    UserProfileView, 
    UserAddressView, 
    AdminLogin, 
    ProductViewSet, 
    AdminCustomerListView,
    DeleteCustomerView,
    AdminDashboardStats,
    ContactSupportView  # <--- ✅ IMPORT ADDED
)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='products')

urlpatterns = [
    path("send-otp/", SendOTP.as_view(), name="send-otp"),
    path("verify-otp/", VerifyOTP.as_view(), name="verify-otp"),
    path("profile/", UserProfileView.as_view()),
    path("admin-login/", AdminLogin.as_view(), name="admin-login"),
    path("addresses/", UserAddressView.as_view()),
    path("addresses/<int:pk>/", UserAddressView.as_view()),
    path('admin-customers/', AdminCustomerListView.as_view(), name='admin-customers'),
    path("admin-customers/<int:pk>/", DeleteCustomerView.as_view(), name="delete-customer"),
    path("admin-dashboard/", AdminDashboardStats.as_view(), ),
    # ✅ ADD THIS LINE
    path("contact/", ContactSupportView.as_view(), name="contact-support"),
    
    path("", include(router.urls)),   # <-- product API
]