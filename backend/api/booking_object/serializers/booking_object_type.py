from rest_framework import serializers

from booking_object.models import BookingObjectType


class BookingObjectTypeRetrieveSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingObjectType
        read_only_fields = ('id', 'title')
        fields = read_only_fields


class BookingObjectTypeCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingObjectType
        read_only_fields = ('id',)
        fields = read_only_fields + ('title',)
