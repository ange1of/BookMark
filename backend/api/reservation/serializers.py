from rest_framework import serializers

from ..client.serializers import ClientRetrieveSerializer
from ..booking_object.serializers import BookingObjectRetrieveSerializer
from reservation.models import Reservation


class ReservationRetrieveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        read_only_fields = (
            'id', 'state', 'state_display', 'start', 'end', 'client',
            'booking_objects', 'price', 'created', 'updated', 'comments'
        )
        fields = read_only_fields

    def get_state_display(self, obj):
        return obj.get_state_display()

    state_display = serializers.SerializerMethodField()
    booking_objects = BookingObjectRetrieveSerializer(read_only=True, many=True)
    client = ClientRetrieveSerializer(read_only=True)


class ReservationCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        read_only_fields = ('id', 'state_display', 'created', 'updated')
        fields = read_only_fields + (
            'state', 'start', 'end', 'client', 'booking_objects', 'price', 'comments'
        )

    def get_state_display(self, obj):
        return obj.get_state_display()

    state_display = serializers.SerializerMethodField()
