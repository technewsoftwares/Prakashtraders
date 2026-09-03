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
            qs = qs.filter(brand__iexact=brand.strip())

        if category:
            qs = qs.filter(category__iexact=category.strip())

        return qs

    # 🔹 RANDOM PRODUCTS
    @action(detail=False, methods=["get"], url_path="random")
    def random_products(self, request):
        qs = Product.objects.all()

        category = request.query_params.get("category")

        if category:
            qs = qs.filter(category__iexact=category.strip())

        # Get only IDs instead of loading every Product object
        product_ids = list(qs.values_list("id", flat=True))

        if not product_ids:
            return Response([])

        selected_ids = random.sample(
            product_ids,
            min(10, len(product_ids))
        )

        products = qs.filter(id__in=selected_ids)

        serializer = self.get_serializer(products, many=True)

        return Response(serializer.data)

    # ⭐ BEST PRODUCTS
    @action(detail=False, methods=["get"], url_path="best")
    def best_products(self, request):
        qs = Product.objects.filter(
            is_best_product=True,
            is_active=True
        )

        # Get only IDs instead of loading/shuffling all products
        product_ids = list(qs.values_list("id", flat=True))

        if not product_ids:
            return Response([])

        selected_ids = random.sample(
            product_ids,
            min(10, len(product_ids))
        )

        products = qs.filter(id__in=selected_ids)

        serializer = self.get_serializer(products, many=True)

        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="debug-count")
    def debug_count(self, request):
       return Response({
          "total_products": Product.objects.count(),
          "active_products": Product.objects.filter(is_active=True).count(),
          "inactive_products": Product.objects.filter(is_active=False).count(),
      })
