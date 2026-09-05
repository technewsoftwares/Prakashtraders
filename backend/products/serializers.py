from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


class ProductListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "description",
            "category",
            "brand",
            "original_price",
            "price",
            "discount_price",
            "stock",
            "rating",
            "reviews_count",
            "image_1",
            "image_2",
            "image_3",
        ]
