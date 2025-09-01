from django.contrib.auth import authenticate, login, get_user_model
from django.contrib.auth.models import User
from django.utils import timezone

from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework import viewsets, status, permissions
from rest_framework.permissions import IsAdminUser, AllowAny

import requests

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from cloudinary.uploader import upload as cloudinary_upload
from cloudinary.exceptions import Error as CloudinaryError

from addresses.serializers import AddressSerializer

from .models import AdminAccessRequest, UserAddress
from .serializers import UserSerializer, AdminAccessRequestSerializer, UserAddressSerializer


class GoogleLogin(APIView):
    def post(self, request):
        id_token = request.data.get('id_token')

        if not id_token:
            return Response({'error': 'Missing id_token'}, status=400)

        # Verify token with Google
        response = requests.get(f'https://oauth2.googleapis.com/tokeninfo?id_token={id_token}')
        if response.status_code != 200:
            return Response({'error': 'Invalid ID token'}, status=400)

        data = response.json()
        email = data.get('email')
        picture_url = data.get('picture')

        if not email:
            return Response({'error': 'No email in token'}, status=400)

        # Get or create the user
        User = get_user_model()
        user, created = User.objects.get_or_create(email=email, defaults={'username': email})

        token, _ = Token.objects.get_or_create(user=user)

        # # Save Google profile picture to account
        if created and picture_url:
            try:
                upload_result = cloudinary_upload(picture_url)
                user.profile.profile_picture = upload_result['public_id']  # or 'secure_url' for full URL
                user.profile.save()
            except CloudinaryError as e:
                print(f"Cloudinary upload failed: {e}")

        return Response({'key': token.key})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

'''
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    user = request.user

    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'is_staff': user.is_staff,
    })
'''

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            token, _ = Token.objects.get_or_create(user=user)

            return Response({'token': token.key, 'is_staff': user.is_staff})
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class RegisterUser(APIView):
    permission_classes = [AllowAny]  # Anyone can register

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already taken'}, status=400)

        user = User.objects.create_user(username=username, email=email, password=password, is_staff=False)
        token = Token.objects.create(user=user)

        return Response({
            'message': 'User created',
            'token': token.key,
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff,
        })

class RegisterAdminView(APIView):
    permission_classes = [IsAdminUser]  # Only current admins can create new admins

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already taken'}, status=400)

        user = User.objects.create_user(username=username, password=password, is_staff=True)
        token = Token.objects.create(user=user)
        return Response({'message': 'Admin created', 'token': token.key})

# Public endpoint: Request admin access
class AdminAccessRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if AdminAccessRequest.objects.filter(user=request.user, approved=None).exists():
            return Response({'error': 'You already have a pending request.'}, status=400)

        reason = request.data.get('reason', '')
        req = AdminAccessRequest.objects.create(user=request.user, reason=reason)
        return Response({'message': 'Admin access request submitted.'}, status=201)

# Admin-only endpoint: View and approve/reject requests
class AdminAccessApprovalView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        requests = AdminAccessRequest.objects.filter(approved=None)
        serializer = AdminAccessRequestSerializer(requests, many=True)
        return Response(serializer.data)

    def post(self, request):
        req_id = request.data.get('id')
        approve = request.data.get('approve')

        try:
            req = AdminAccessRequest.objects.get(id=req_id, approved=None)
        except AdminAccessRequest.DoesNotExist:
            return Response({'error': 'Request not found or already reviewed.'}, status=404)

        req.approved = bool(approve)
        req.reviewed_by = request.user
        req.reviewed_at = timezone.now()
        req.save()

        if req.approved:
            req.user.is_staff = True
            req.user.save()

        return Response({'message': f"Request {'approved' if req.approved else 'rejected'}."})

class UserAddressViewSet(viewsets.ModelViewSet):
    serializer_class = UserAddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserAddress.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically associate the user (authenticated user) with the UserAddress
        serializer.save(user=self.request.user)

    def perform_destroy(self, instance):
        instance.address.delete()
        instance.delete()

