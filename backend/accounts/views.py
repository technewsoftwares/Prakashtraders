import random
from django.core.mail import send_mail
from django.contrib.auth.models import User
from django.conf import settings
from django.contrib.auth import authenticate

# Rest Framework Imports
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status, generics, viewsets
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication

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
            
            send_mail(
                subject=owner_subject,
                message=owner_message,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[settings.EMAIL_HOST_USER], 
                fail_silently=False,
            )

            # 2. Send Acknowledgement Email to USER
            user_subject = "We received your message - Prakash Traders"
            user_message = f"Dear {name},\n\nThank you for contacting Prakash Traders. We have received your inquiry regarding:\n'{message}'\n\nOur team will get back to you shortly.\n\nBest Regards,\nPrakash Traders Team"

            send_mail(
                subject=user_subject,
                message=user_message,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[user_email], 
                fail_silently=False,
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
            return Response({"success": False, "message": "Email is required"})

        otp = str(random.randint(100000, 999999))

        OTP.objects.create(email=email, otp=otp)

        send_mail(
            subject="Your Login OTP - Prakash Traders",
            message=f"""
Welcome to Prakash Traders! 🎉

Your secure OTP is:
{otp}

Enter this code to continue.
Stay safe — never share your OTP.

Thank you for choosing us!
""",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            fail_silently=False,
        )

        return Response({
            "success": True,
            "message": "OTP sent successfully"
        })


class VerifyOTP(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")

        if not email or not otp:
            return Response({
                "success": False,
                "message": "Email and OTP are required"
            })

        record = OTP.objects.filter(email=email, otp=otp).last()

        if not record:
            return Response({
                "success": False,
                "message": "Invalid OTP"
            })

        user, created = User.objects.get_or_create(
            username=email,
            defaults={"email": email}
        )

        refresh = RefreshToken.for_user(user)

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
    

class AdminCustomerListView(generics.ListAPIView):
    permission_classes = [AllowAny] 
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

    
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-id')
    serializer_class = ProductSerializer
