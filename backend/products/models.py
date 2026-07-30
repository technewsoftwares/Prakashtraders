from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=100)
    brand = models.CharField(max_length=100, blank=True)

    # ✅ NEW FIELD (MRP / Original Price)
    original_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True
    )

    # Selling Price
    price = models.DecimalField(max_digits=10, decimal_places=2)

    discount_price = models.DecimalField(
        max_digits=10, decimal_places=2,
        blank=True,
        null=True
    )

    stock = models.IntegerField()
    rating = models.FloatField(default=0)
    reviews_count = models.IntegerField(default=0)

    is_active = models.BooleanField(default=True)
    is_best_product = models.BooleanField(default=False)

    created_at = models.DateField(auto_now_add=True)

    image_1 = models.ImageField(upload_to="products/", blank=True, null=True)
    image_2 = models.ImageField(upload_to="products/", blank=True, null=True)
    image_3 = models.ImageField(upload_to="products/", blank=True, null=True)

    def __str__(self):
        return self.name
