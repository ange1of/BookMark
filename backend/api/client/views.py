from rest_framework.generics import RetrieveUpdateDestroyAPIView, ListCreateAPIView, UpdateAPIView
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import SAFE_METHODS
from rest_framework.response import Response

from client.models import Client
from client.utils import filter_phone
from ..permissions import IsTokenActive
from reservation.models import Reservation
from . import serializers
from .filters import ClientFilter


class ClientListCreateAPIView(ListCreateAPIView):
    filterset_class = ClientFilter
    queryset = Client.objects.exclude(is_deleted=True).order_by('name')
    pagination_class = LimitOffsetPagination
    permission_classes = (IsTokenActive,)

    def get_serializer_class(self):
        if self.request.method in SAFE_METHODS:
            return serializers.ClientRetrieveSerializer
        return serializers.ClientCreateUpdateSerializer


class ClientRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Client.objects.exclude(is_deleted=True)
    permission_classes = (IsTokenActive,)

    def get_serializer_class(self):
        if self.request.method in SAFE_METHODS:
            return serializers.ClientRetrieveSerializer
        return serializers.ClientCreateUpdateSerializer

    def perform_destroy(self, instance):
        if Reservation.objects.filter(client=instance.pk).count() == 0:
            instance.delete()
        else:
            instance.is_deleted = True
            instance.save()


class ClientCreateOrUpdateAPIView(UpdateAPIView):
    queryset = Client.objects.exclude(is_deleted=True)
    serializer_class = serializers.ClientCreateUpdateSerializer
    permission_classes = (IsTokenActive,)

    def update(self, request, *args, **kwargs):
        instance = None
        if 'phone' in request.data:
            clients = list(Client.objects.filter(
                phone=filter_phone(request.data['phone']), is_deleted=False)
            )
            if len(clients):
                instance = clients[0]

        if instance is not None:
            serializer = self.get_serializer(instance, data=request.data)
        else:
            serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if instance is not None:
            instance.is_delete = False
            if getattr(instance, '_prefetched_objects_cache', None):
                instance._prefetched_objects_cache = {}

        return Response(serializer.data)
