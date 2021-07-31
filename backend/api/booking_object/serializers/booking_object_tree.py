from rest_framework import serializers
from booking_object.models import BookingObjectType
from .booking_object import BookingObjectRetrieveSerializer


class BookingObjectTreeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingObjectType
        read_only_fields = ('id', 'title', 'booking_objects')
        fields = read_only_fields

    booking_objects = BookingObjectRetrieveSerializer(many=True, read_only=True)
