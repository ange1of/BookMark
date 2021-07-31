from django_filters import rest_framework as filters
from booking_object.models import BookingObject


class BookingObjectFilter(filters.FilterSet):
    class Meta:
        model = BookingObject
        fields = ('id', 'title', 'object_type')
