from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from client.models import Client
from client.utils import filter_phone
from reservation.models import Reservation


class ClientRetrieveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        read_only_fields = ('id', 'phone', 'name', 'email', 'additional_info', 'created', 'updated')
        fields = read_only_fields


class ClientCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        read_only_fields = ('id', 'created', 'updated')
        fields = read_only_fields + ('phone', 'name', 'email', 'additional_info')
        extra_kwargs = {
            'phone': {
                'validators': [UniqueValidator(
                    queryset=Client.objects.filter(is_deleted=False),
                    message='Клиент с таким номером телефона уже существует'
                )],
                'min_length': 11
            }
        }

    def to_internal_value(self, data):
        if data.get('phone'):
            data['phone'] = filter_phone(data.get('phone'))
        return super().to_internal_value(data)

    def create(self, validated_data):
        try:
            instance = Client.objects.get(phone=validated_data.get('phone'))
            related_reservations = Reservation.objects.select_for_update().filter(client__id=str(instance.pk))
            with transaction.atomic():
                instance.delete()
                new_instance = super().create(validated_data)
                for reservation in related_reservations:
                    reservation.client = new_instance
                    reservation.save()
            return new_instance
        except ObjectDoesNotExist:
            return super().create(validated_data)
