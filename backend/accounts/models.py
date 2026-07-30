from django.db import models
from django.contrib.auth.models import User


class Product(models.Model):
    CATEGORY_CHOICES = (
        ("refrigerator", "Refrigerator"),
        ("washing_machine", "Washing Machine"),
        ("microwave", "Microwave"),
        ("mixer", "Mixer"),
        ("grinder", "Grinder"),
        ("power_hob", "Power Hob"),
        ("chimney", "Chimney"),
        ("tower_fan", "Tower Fan"),
        ("rice_cooker", "E-Rice Cooker"),
        ("kettle", "E-Kettle"),
    )

    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    category = models.CharField(
        max_length=30,
        choices=CATEGORY_CHOICES
    )

    brand = models.CharField(max_length=100)

    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    discount_price = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True, 
        blank=True
    )

    stock = models.PositiveIntegerField(default=0)

    rating = models.FloatField(default=0)
    reviews_count = models.PositiveIntegerField(default=0)

    # --- CHANGED: Use ImageFields to handle file uploads from React ---
    image_1 = models.ImageField(upload_to='products/', null=True, blank=True)
    image_2 = models.ImageField(upload_to='products/', null=True, blank=True)
    image_3 = models.ImageField(upload_to='products/', null=True, blank=True)

    # --- ADDED: To support the "Best Product" checkbox in Dashboard ---
    is_best_product = models.BooleanField(default=False)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
class OTP(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.email} - {self.otp}"


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    title = models.CharField(max_length=10, blank=True)
    first_name = models.CharField(max_length=50, blank=True)
    middle_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)

    gender = models.CharField(max_length=30, blank=True)
    mobile = models.CharField(max_length=20, blank=True)

    dob = models.DateField(null=True, blank=True)
    anniversary = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.user.email

class UserAddress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="addresses")

    full_name = models.CharField(max_length=100)
    mobile = models.CharField(max_length=15)
    pincode = models.CharField(max_length=10)

    address = models.TextField()
    landmark = models.CharField(max_length=100, blank=True)
    locality = models.CharField(max_length=100)

    state = models.CharField(max_length=50)
    city = models.CharField(max_length=50)

    address_type = models.CharField(
        max_length=10,
        choices=[("home", "Home"), ("work", "Work"), ("other", "Other")]
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.city}"