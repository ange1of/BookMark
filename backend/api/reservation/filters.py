from django.db.models import Q
from django_filters import rest_framework as filters

from booking_object.models import BookingObject
from reservation.models import Reservation
from ..client.filters import transform_phone


class ReservationFilter(filters.FilterSet):
    class Meta:
        model = Reservation
        fields = (
            'id', 'state', 'booking_object_type', 'booking_objects', 'start_from', 'start_to',
            'end_from', 'end_to', 'created_from', 'created_to', 'updated_from', 'updated_to',
            'client_phone', 'client_name',
        )

    booking_object_type = filters.UUIDFilter(
        method=lambda qs, fn, value: qs.filter(booking_objects__object_type=value).distinct()
    )
    booking_objects = filters.ModelMultipleChoiceFilter(
        queryset=BookingObject.objects.all(), field_name='booking_objects'
    )
    start_from = filters.DateTimeFilter(
        field_name='start', lookup_expr='gte'
    )
    start_to = filters.DateTimeFilter(
        field_name='start', lookup_expr='lte'
    )
    end_from = filters.DateTimeFilter(
        field_name='end', lookup_expr='gte'
    )
    end_to = filters.DateTimeFilter(
        field_name='end', lookup_expr='lte'
    )

    created_from = filters.DateTimeFilter(
        field_name='created', lookup_expr='gte'
    )
    created_to = filters.DateTimeFilter(
        field_name='created', lookup_expr='lte'
    )
    updated_from = filters.DateTimeFilter(
        field_name='updated', lookup_expr='gte'
    )
    updated_to = filters.DateTimeFilter(
        field_name='updated', lookup_expr='lte'
    )

    client_phone = filters.CharFilter(
        method=lambda qs, fn, value: qs.filter(Q(client__phone__icontains=transform_phone(value)))
    )
    client_name = filters.CharFilter(field_name='client__name', lookup_expr='icontains')


class ReservationRangeFilter(filters.FilterSet):
    class Meta:
        model = Reservation
        fields = ['booking_object_type', 'booking_objects', 'date_from', 'date_to']

    booking_object_type = filters.UUIDFilter(
        method=lambda qs, fn, value: qs.filter(booking_objects__object_type=value).distinct()
    )
    booking_objects = filters.ModelMultipleChoiceFilter(
        queryset=BookingObject.objects.all(), field_name='booking_objects'
    )
    date_from = filters.DateTimeFilter(
        method=lambda qs, fn, value: qs.filter(Q(start__gte=value) | Q(end__gte=value))
    )
    date_to = filters.DateTimeFilter(
        method=lambda qs, fn, value: qs.filter(Q(start__lte=value) | Q(end__lte=value))
    )
