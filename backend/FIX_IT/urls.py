"""
URL configuration for FIX_IT project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter

from shops import views as shop_views
from request import views as request_views
from review import views as review_views

router = DefaultRouter()
router.register(r'shops', shop_views.ShopViewSet, basename='shop')
router.register(r'list-shops', shop_views.ListShopViewSet, basename='listshop')
router.register(r'reviews', review_views.ReviewViewSet, basename='review')
router.register(r'saved-shops', shop_views.SaveShopViewSet, basename='savedshop')

router.register(r'device-types', shop_views.DeviceTypeViewSet, basename='devicetype')
router.register(r'portfolio-images', shop_views.PortfolioImageViewSet, basename='portfolioimage')
router.register(r'repair_requests', request_views.RepairRequestViewSet, basename='repair_requests')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('accounts/', include('accounts.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

