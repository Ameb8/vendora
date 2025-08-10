from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'page-text', views.SingletonPageDesignViewSet, basename='pagedesign')
router.register(r'image-in-list', views.ImageInListViewSet, basename='image-in-list')

urlpatterns = [
    path('', include(router.urls)),
]

