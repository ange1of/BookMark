from datetime import timedelta

from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.generics import CreateAPIView, DestroyAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..permissions import IsTokenActive
from . import serializers


class CurrentUserView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = serializers.UserRetrieveSerializer
    permission_classes = (IsTokenActive,)

    def get_object(self):
        return self.request.user


class LoginView(CreateAPIView):
    queryset = Token.objects.all()
    serializer_class = serializers.TokenCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(
            username=serializer.validated_data.get('username'),
            password=serializer.validated_data.get('password')
        )
        if not user:
            return Response(
                {'auth_error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST
            )

        token, created = Token.objects.get_or_create(user=user)
        if not created and \
                token.created < timezone.now() - timedelta(days=settings.AUTH_TOKEN_LIFETIME):
            token.delete()
            token = Token.objects.create(user=user)

        token_serializer = serializers.TokenRetrieveSerializer(instance=token)
        headers = self.get_success_headers(token_serializer.data)

        return Response(token_serializer.data, status=status.HTTP_200_OK, headers=headers)


class LogoutView(DestroyAPIView):
    queryset = Token.objects.all()
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return Token.objects.get(user=self.request.user)
