from rest_framework.generics import RetrieveUpdateDestroyAPIView, ListCreateAPIView, ListAPIView
from rest_framework.permissions import SAFE_METHODS

from booking_object.models import BookingObject, BookingObjectType
from ..permissions import IsTokenActive
from .filters import BookingObjectFilter
from .serializers import BookingObjectRetrieveSerializer, BookingObjectCreateUpdateSerializer, \
    BookingObjectTypeRetrieveSerializer, BookingObjectTypeCreateUpdateSerializer,\
    BookingObjectTreeSerializer


class BookingObjectMixin:
    retrieve_serializer_class = BookingObjectRetrieveSerializer
    create_update_serializer_class = BookingObjectCreateUpdateSerializer
    permission_classes = (IsTokenActive,)

    def get_serializer_class(self):
        if self.request.method in SAFE_METHODS:
            return self.retrieve_serializer_class
        return self.create_update_serializer_class


class BookingObjectListCreateAPIView(BookingObjectMixin, ListCreateAPIView):
    queryset = BookingObject.objects.all().order_by('object_type__title', 'title')
    filterset_class = BookingObjectFilter


class BookingObjectRetrieveUpdateDestroyAPIView(BookingObjectMixin, RetrieveUpdateDestroyAPIView):
    queryset = BookingObject.objects.all()


class BookingObjectTypeListCreateAPIView(BookingObjectMixin, ListCreateAPIView):
    queryset = BookingObjectType.objects.all().order_by('title')
    retrieve_serializer_class = BookingObjectTypeRetrieveSerializer
    create_update_serializer_class = BookingObjectTypeCreateUpdateSerializer


class BookingObjectTypeRetrieveUpdateDestroyAPIView(
        BookingObjectMixin, RetrieveUpdateDestroyAPIView
):
    queryset = BookingObjectType.objects.all()
    retrieve_serializer_class = BookingObjectTypeRetrieveSerializer
    create_update_serializer_class = BookingObjectTypeCreateUpdateSerializer


class BookingObjectTreeView(ListAPIView):
    queryset = BookingObjectType.objects.all()
    serializer_class = BookingObjectTreeSerializer

