from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.db import transaction
from django.db.models import Max, F
from django.contrib.auth.decorators import user_passes_test
from django.views.decorators.http import require_POST
# from .permissions import IsAdminOrReadOnly
from .models import PageDesign, DesignImage, ImageList, ImageInList
from .serializers import (
    PageDesignSerializer,
    ImageInListSerializer,
    ImageInListCreateSerializer
)



class IsStaffOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        # Allow GET for anyone
        if request.method in permissions.SAFE_METHODS:
            return True
        # Allow POST/PATCH only for staff
        return request.user and request.user.is_authenticated and request.user.is_staff


class SingletonPageDesignViewSet(viewsets.ViewSet):
    permission_classes = [IsStaffOrReadOnly]

    def get_object(self):
        obj, created = PageDesign.objects.get_or_create(id=1, defaults={
            'about_us_title': '',
            'about_us_body': '',
            'contact_num': '',
            'contact_mail': ''
        })
        return obj

    def list(self, request):
        obj = PageDesign.objects.first()
        if not obj:
            return Response({'detail': 'No design yet.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = PageDesignSerializer(obj)
        return Response(serializer.data)

    def create(self, request):
        if PageDesign.objects.exists():
            return Response({'detail': 'PageDesign already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = PageDesignSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, pk=None):
        # Ignore the PK, always update the singleton
        try:
            obj = self.get_object()
        except PageDesign.DoesNotExist:
            return Response({'detail': 'No PageDesign exists.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = PageDesignSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["patch"])
    def update_text(self, request):
        obj = self.get_object()
        serializer = PageDesignSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ImageInListViewSet(viewsets.ModelViewSet):
    queryset = ImageInList.objects.select_related('image', 'image_list')
    permission_classes = [IsStaffOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.action == 'list':
            list_name = self.request.query_params.get('list_name')
            if self.request.method == 'GET' and list_name in ['about', 'contact']:
                return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ImageInListCreateSerializer
        return ImageInListSerializer

    def get_queryset(self):
        list_name = self.request.query_params.get('list_name')
        qs = self.queryset
        if list_name:
            qs = qs.filter(image_list__name=list_name)
        return qs.order_by('order')

    @action(detail=True, methods=['post'])
    def move_up(self, request, pk=None):
        obj = self.get_object()
        obj.up()
        return Response({'status': 'moved up'})

    @action(detail=True, methods=['post'])
    def move_down(self, request, pk=None):
        obj = self.get_object()
        obj.down()
        return Response({'status': 'moved down'})

    @action(detail=True, methods=['post'])
    def move_to(self, request, pk=None):
        obj = self.get_object()
        new_position = request.data.get('position')
        if new_position is None:
            return Response({'error': 'Missing position'}, status=400)
        obj.to(int(new_position))
        return Response({'status': f'moved to {new_position}'})

    @action(
        detail=False,
        methods=['post'],
        permission_classes=[permissions.IsAdminUser],
        parser_classes=[JSONParser]
    )
    def reorder(self, request):
        ordered_ids = request.data
        if not ordered_ids:
            return Response({'error': 'No ordered_ids provided'}, status=400)

        with transaction.atomic():
            objs = list(ImageInList.objects.filter(id__in=ordered_ids))
            id_to_obj = {obj.id: obj for obj in objs}

            for i, id in enumerate(ordered_ids):
                obj = id_to_obj.get(id)
                if obj:
                    obj.order = i
            ImageInList.objects.bulk_update(objs, ['order'])

        return Response({'status': 'reordered'})

    @action(
        detail=False,
        methods=['post'],
        permission_classes=[permissions.IsAdminUser],
        parser_classes=[MultiPartParser, FormParser]
    )
    def add_image_to_list(self, request):
        # Expect 'image' (file) and 'list_name' (str) in request.FILES and request.data
        image_file = request.FILES.get('image')
        list_name = request.data.get('list_name')

        if not image_file or not list_name:
            return Response({'error': 'Both image file and list_name are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            image_list = ImageList.objects.get(name=list_name)
        except ImageList.DoesNotExist:
            return Response({'error': f'List with name "{list_name}" not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Create DesignImage
        design_image = DesignImage.objects.create(image=image_file)

        # Create ImageInList to add image to the list
        image_in_list = ImageInList.objects.create(image=design_image, image_list=image_list)

        serializer = ImageInListSerializer(image_in_list)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


