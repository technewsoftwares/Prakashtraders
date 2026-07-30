from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, UserAddress, Product

# 1. USER PROFILE SERIALIZER
# Used for: The User's "My Profile" page
class UserProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True) # Added email for convenience
    
    class Meta:
        model = UserProfile
        fields = [
            'user_id', 'email', 'title', 'first_name', 'middle_name', 'last_name', 
            'gender', 'mobile', 'dob', 'anniversary'
        ]

# 2. ADMIN USER LIST SERIALIZER (NEW)
# Used for: The Admin Dashboard "Customers" Table
class AdminUserListSerializer(serializers.ModelSerializer):
    # We fetch these details safely. If the user has no profile, it returns default strings.
    title = serializers.CharField(source='userprofile.title', default="")
    first_name = serializers.CharField(source='userprofile.first_name', default="")
    middle_name = serializers.CharField(source='userprofile.middle_name', default="")
    last_name = serializers.CharField(source='userprofile.last_name', default="")
    gender = serializers.CharField(source='userprofile.gender', default="")
    mobile = serializers.CharField(source='userprofile.mobile', default="")
    dob = serializers.DateField(source='userprofile.dob', default=None)
    anniversary = serializers.DateField(source='userprofile.anniversary', default=None)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'username',  # From Auth User Table
            'title', 'first_name', 'middle_name', 'last_name', # From Profile Table
            'gender', 'mobile', 'dob', 'anniversary'
        ]

# 3. ADDRESS SERIALIZER
class UserAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAddress
        fields = "__all__"
        read_only_fields = ["user"]

# 4. REGISTER SERIALIZER
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

# 5. PRODUCT SERIALIZER
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"

        