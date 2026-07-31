from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "category",
        "price",
        "stock",
        "is_active",
    )

    search_fields = (
        "name",
        "category",
        "brand",
    )

    list_filter = (
        "category",
        "is_active",
        "is_best_product",
    )