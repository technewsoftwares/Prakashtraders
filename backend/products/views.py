import random
import requests

from .price_comparison import get_price_comparison

from django.db.models import Q
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import Product
from .serializers import ProductSerializer, ProductListSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = Product.objects.filter(is_active=True)

        brand = self.request.query_params.get("brand")
        category = self.request.query_params.get("category")
        search = self.request.query_params.get("q")

        if brand:
            qs = qs.filter(
                brand__iexact=brand.strip()
            )

        if category:
            qs = qs.filter(
                category__iexact=category.strip()
            )

        if search:
            qs = qs.filter(
                Q(name__icontains=search) |
                Q(category__icontains=search) |
                Q(brand__icontains=search)
            )

        return qs.order_by("id")

    def get_serializer_class(self):
        # Use a smaller response for normal category/search listing
        if self.action == "list":
            return ProductListSerializer

        return ProductSerializer

    @action(detail=False, methods=["get"], url_path="random")
    def random_products(self, request):
        qs = Product.objects.filter(is_active=True)

        category = request.query_params.get("category")

        if category:
            qs = qs.filter(
                category__iexact=category.strip()
            )

        product_ids = list(
            qs.values_list("id", flat=True)
        )

        if not product_ids:
            return Response([])

        selected_ids = random.sample(
            product_ids,
            min(10, len(product_ids))
        )

        products = qs.filter(id__in=selected_ids)

        serializer = ProductSerializer(
            products,
            many=True,
            context={"request": request}
        )

        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="best")
    def best_products(self, request):
        qs = Product.objects.filter(
            is_best_product=True,
            is_active=True
        )

        product_ids = list(
            qs.values_list("id", flat=True)
        )

        if not product_ids:
            return Response([])

        selected_ids = random.sample(
            product_ids,
            min(10, len(product_ids))
        )

        products = qs.filter(id__in=selected_ids)

        serializer = ProductSerializer(
            products,
            many=True,
            context={"request": request}
        )

        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="debug-count")
    def debug_count(self, request):
        return Response({
            "total_products": Product.objects.count(),
            "active_products": Product.objects.filter(
                is_active=True
            ).count(),
            "inactive_products": Product.objects.filter(
                is_active=False
            ).count(),
        })
        @action(
            detail=True,
            methods=["get"],
            url_path="price-comparison"
        )
        def price_comparison(self, request, pk=None):
        
            product = self.get_object()
        
            try:
                results = get_price_comparison(product)
        
                return Response({
                    "product_id": product.id,
                    "product_name": product.name,
                    "comparison": results,
                    "total_results": len(results),
                })
        
            except requests.RequestException:
                return Response({
                    "error": "Unable to fetch shopping prices",
                    "comparison": []
                }, status=502)
        
            except Exception:
                return Response({
                    "error": "Price comparison is temporarily unavailable",
                    "comparison": []
                }, status=500)
