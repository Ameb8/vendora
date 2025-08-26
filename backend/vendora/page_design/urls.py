from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'page-text', views.SingletonPageDesignViewSet, basename='pagedesign')
router.register(r'image-in-list', views.ImageInListViewSet, basename='image-in-list')

pagedesign_view = views.PageDesignViewSet.as_view({
    'get': 'retrieve',
    'post': 'create',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy',
})

urlpatterns = [
    path('', include(router.urls)),
path('page/<slug:tenant_slug>/', pagedesign_view, name='tenant-pagedesign')
]

