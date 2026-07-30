import random
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import Product
from .serializers import ProductSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = Product.objects.all()

        brand = self.request.query_params.get("brand")
        category = self.request.query_params.get("category")

        if brand:
            qs = qs.filter(brand__iexact=brand)

        if category:
            qs = qs.filter(category__iexact=category)

        return qs

    # 🔹 RANDOM PRODUCTS
    @action(detail=False, methods=["get"], url_path="random")
    def random_products(self, request):
        qs = Product.objects.all()

        category = request.query_params.get("category")
        if category:
            qs = qs.filter(category__iexact=category)

        products = list(qs)
        random.shuffle(products)

        serializer = self.get_serializer(products[:10], many=True)
        return Response(serializer.data)

    # ⭐ BEST PRODUCTS (FIXED)
    @action(detail=False, methods=["get"], url_path="best")
    def best_products(self, request):
        qs = Product.objects.filter(
            is_best_product=True,
            is_active=True
        )

        products = list(qs)
        random.shuffle(products)

        serializer = self.get_serializer(products[:10], many=True)
        return Response(serializer.data)
