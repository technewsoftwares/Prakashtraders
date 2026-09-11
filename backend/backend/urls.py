from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

from django.conf import settings
from django.conf.urls.static import static


def health_check(request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path("admin/", admin.site.urls),

    # Lightweight health check for Render/UptimeRobot
    path("api/health/", health_check),

    path("api/", include("orders.urls")),
    path("", include("orders.urls")),
    path("api/auth/", include("accounts.urls")),
    path("api/products/", include("products.urls")),
]
 

