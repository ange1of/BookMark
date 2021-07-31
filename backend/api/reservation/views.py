from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import SAFE_METHODS

from reservation.models import Reservation
from ..permissions import IsTokenActive
from . import serializers
from .filters import ReservationFilter, ReservationRangeFilter


class ReservationListCreateAPIView(ListCreateAPIView):
    queryset = Reservation.objects.all().order_by('-updated', '-created')
    pagination_class = LimitOffsetPagination
    filterset_class = ReservationFilter
    permission_classes = (IsTokenActive,)

    def get_serializer_class(self):
        if self.request.method in SAFE_METHODS:
            return serializers.ReservationRetrieveSerializer
        return serializers.ReservationCreateUpdateSerializer


class ReservationRangeListAPIView(ListAPIView):
    queryset = Reservation.objects.all()
    filterset_class = ReservationRangeFilter
    serializer_class = serializers.ReservationRetrieveSerializer
    permission_classes = (IsTokenActive,)


class ReservationRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Reservation.objects.all()
    permission_classes = (IsTokenActive,)

    def get_serializer_class(self):
        if self.request.method in SAFE_METHODS:
            return serializers.ReservationRetrieveSerializer
        return serializers.ReservationCreateUpdateSerializer
