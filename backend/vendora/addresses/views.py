from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from .models import Address
from .serializers import AddressSerializer

class AddressCreateView(CreateAPIView):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer
    permission_classes = [AllowAny]
