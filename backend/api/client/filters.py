from django.db.models import Q
from django_filters import rest_framework as filters
from client.models import Client
from client.utils import filter_phone


def transform_phone(value):
    filtered_value = filter_phone(value)
    return filtered_value if len(filtered_value) else value


class ClientFilter(filters.FilterSet):
    class Meta:
        model = Client
        fields = (
            'id', 'name', 'phone', 'search', 'created_from', 'created_to', 'updated_from', 'updated_to'
        )

    name = filters.CharFilter(lookup_expr='icontains')
    phone = filters.CharFilter(method=lambda qs, fn, value: qs.filter(
        Q(phone__icontains=transform_phone(value))
    ))
    search = filters.CharFilter(
        method=lambda qs, fn, value: qs.filter(
            Q(name__icontains=value) |
            Q(phone__icontains=transform_phone(value))
        )
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
