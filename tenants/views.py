from rest_framework import viewsets
from .models import Tenant
from .serializers import TenantSerializer
from vendora.permissions import IsAdminOrReadOnly

class TenantViewSet(viewsets.ModelViewSet):
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        return Tenant.objects.filter(owner=user)
