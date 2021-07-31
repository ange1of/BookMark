from rest_framework import serializers
from booking_object.models import BookingObject


class BookingObjectBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingObject
        read_only_fields = (
            'id', 'title', 'object_type', 'object_type_display', 'pricing_type', 'pricing_type_display', 'price'
        )
        fields = read_only_fields

    def get_object_type_display(self, obj):
        return obj.object_type.title

    def get_pricing_type_display(self, obj):
        return obj.get_pricing_type_display()

    object_type_display = serializers.SerializerMethodField()
    pricing_type_display = serializers.SerializerMethodField()


class BookingObjectRetrieveSerializer(BookingObjectBaseSerializer):
    pass


class BookingObjectCreateUpdateSerializer(BookingObjectBaseSerializer):
    class Meta(BookingObjectBaseSerializer.Meta):
        read_only_fields = ('id', 'object_type_display', 'pricing_type_display')
        fields = read_only_fields + ('title', 'price', 'object_type', 'pricing_type', 'price')
