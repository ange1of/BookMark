from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response

from booking_object.constants import PRICING_TYPES
from reservation.constants import RESERVATION_STATES
from ..permissions import IsTokenActive


class PricingTypesAPIView(RetrieveAPIView):
    permission_classes = (IsTokenActive,)

    def get(self, request, *_, **__):
        return Response([{'value': item[0], 'title': item[1]} for item in PRICING_TYPES])


class ReservationStatesAPIView(RetrieveAPIView):
    permission_classes = (IsTokenActive,)

    def get(self, request, *_, **__):
        return Response([{'value': item[0], 'title': item[1]} for item in RESERVATION_STATES])
