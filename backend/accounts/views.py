import random
import traceback
import os
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.conf import settings
from .brevo import send_brevo_email
from django.db.models import Sum
# Rest Framework Imports
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework import status, generics, viewsets
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from accounts.brevo import send_brevo_email

# Local Imports
from .models import OTP, UserProfile, UserAddress, Product
from .serializers import (
    UserProfileSerializer, 
    UserAddressSerializer, 
    ProductSerializer, 
    AdminUserListSerializer
)

# ---------------------------------------------------------
#  CONTACT SUPPORT VIEW (NEW ADDITION)
# ---------------------------------------------------------

class ContactSupportView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        name = data.get('name')
        user_email = data.get('email')
        message = data.get('message')

        # Validation
        if not name or not user_email or not message:
            return Response({'success': False, 'message': 'All fields are required'}, status=400)

        try:
            # 1. Send Email to OWNER (You)
            owner_subject = f"New Inquiry from {name}"
            owner_message = f"Name: {name}\nEmail: {user_email}\n\nMessage:\n{message}"
            
            
            send_brevo_email(
                to_email=settings.EMAIL_HOST_USER,
                subject=owner_subject,
                message=owner_message
            )
            # 2. Send Acknowledgement Email to USER
                        # 2. Send Acknowledgement Email to USER
            user_subject = "We received your message - Prakash Traders"
            user_message = (
                f"Dear {name},\n\n"
                f"Thank you for contacting Prakash Traders. "
                f"We have received your inquiry regarding:\n"
                f"'{message}'\n\n"
                f"Our team will get back to you shortly.\n\n"
                f"Best Regards,\n"
                f"Prakash Traders Team"
            )

            send_brevo_email(
                to_email=user_email,
                subject=user_subject,
                message=user_message
            )
            return Response({'success': True, 'message': 'Message sent successfully!'})

        except Exception as e:
            print(f"Contact API Error: {str(e)}")
            return Response({'success': False, 'message': 'Something went wrong. Please try again.'}, status=500)

# ---------------------------------------------------------
#  EXISTING VIEWS
# ---------------------------------------------------------

class UserAddressView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        addresses = UserAddress.objects.filter(user=request.user)
        serializer = UserAddressSerializer(addresses, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UserAddressSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({"success": True})
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        try:
            address = UserAddress.objects.get(id=pk, user=request.user)
            address.delete()
            return Response({"success": True})
        except UserAddress.DoesNotExist:
            return Response({"success": False, "message": "Address not found"}, status=404)

class UserProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)

    def post(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({"success": True})

        return Response(serializer.errors, status=400)



class SendOTP(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response(
                {
                    "success": False,
                    "message": "Email required"
                },
                status=400
            )

        otp = str(random.randint(100000, 999999))

        OTP.objects.create(email=email, otp=otp)

        try:
            send_brevo_email(
                to_email=email,
                subject="Your OTP - Prakash Traders",
                message=f"Your OTP is {otp}"
            )

            return Response(
                {
                    "success": True,
                    "message": "OTP sent successfully"
                }
            )

        except Exception as e:
            traceback.print_exc()

            print("ERROR TYPE:", type(e).__name__)
            print("ERROR MESSAGE:", str(e))

            return Response(
                {
                    "success": False,
                    "error": type(e).__name__,
                    "message": str(e),
                },
                status=500,
            )

class VerifyOTP(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")

        if not email or not otp:
            return Response({
                "success": False,
                "message": "Email and OTP are required"
            }, status=400)

        record = OTP.objects.filter(email=email, otp=otp).last()

        if not record:
            return Response({
                "success": False,
                "message": "Invalid OTP"
            }, status=400)

        # Create user if doesn't exist
        user, created = User.objects.get_or_create(
            username=email,
            defaults={"email": email}
        )

        # Create profile if doesn't exist
        UserProfile.objects.get_or_create(user=user)

        # Create JWT tokens
        refresh = RefreshToken.for_user(user)

        # Optional: delete OTP after successful login
        record.delete()

        return Response({
            "success": True,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "email": user.email,
                "username": user.username,
            }
        })


class AdminLogin(APIView):
    permission_classes = [AllowAny]  # Allow anyone

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if user and user.is_staff:
            refresh = RefreshToken.for_user(user)

            return Response({
                "success": True,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }, status=status.HTTP_200_OK)

        return Response({
            "success": False,
            "message": "Invalid admin credentials"
        }, status=status.HTTP_401_UNAUTHORIZED)
    

class AdminCustomerListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUser]

    def get(self, request):
        users = User.objects.all().order_by("-id")
        data = []

        for user in users:
            profile = UserProfile.objects.filter(user=user).first()

            full_name = user.username

            if profile:
                name_parts = [
                    profile.first_name,
                    profile.middle_name,
                    profile.last_name,
                ]
                full_name = " ".join(filter(None, name_parts))

                if not full_name:
                    full_name = user.username

            data.append({
                "id": user.id,
                "name": full_name,
                "email": user.email,
                "mobile": profile.mobile if profile else "",
                "gender": profile.gender if profile else "",
                "dob": profile.dob if profile else "",
            })

        return Response(data)

    
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-id')
    serializer_class = ProductSerializer
    
class DeleteCustomerView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUser]

    def delete(self, request, pk):
        try:
            user = User.objects.get(id=pk)

            # Don't allow deleting yourself
            if user == request.user:
                return Response(
                    {"success": False, "message": "You cannot delete your own account."},
                    status=400,
                )

            user.delete()

            return Response({
                "success": True,
                "message": "Customer deleted successfully."
            })

        except User.DoesNotExist:
            return Response({
                "success": False,
                "message": "Customer not found."
            }, status=404)


from orders.models import Order

class AdminDashboardStats(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUser]

    def get(self, request):

        total_users = User.objects.count()

        # Count all orders
        active_orders = Order.objects.count()

        # Sum all order amounts
        total_revenue = (
            Order.objects.aggregate(total=Sum("total_amount"))["total"] or 0
        )

        stock_units = (
            Product.objects.aggregate(total=Sum("stock"))["total"] or 0
        )

        return Response({
            "total_users": total_users,
            "active_orders": active_orders,
            "total_revenue": total_revenue,
            "stock_units": stock_units,
        })
