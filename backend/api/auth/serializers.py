from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.authtoken.models import Token


class TokenCreateSerializer(serializers.Serializer):
    username = serializers.CharField(required=True, max_length=100)
    password = serializers.CharField(required=True, max_length=100)


class UserRetrieveSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        read_only_fields = ('username',)
        fields = read_only_fields


class TokenRetrieveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        read_only_fields = ('key', 'created')
        fields = read_only_fields
