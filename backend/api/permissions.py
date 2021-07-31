from datetime import timedelta

from django.conf import settings
from django.utils import timezone
from rest_framework.authtoken.models import Token
from rest_framework.permissions import BasePermission


class IsTokenActive(BasePermission):

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False

        try:
            return Token.objects.get(user=request.user).created >= \
                   timezone.now() - timedelta(days=settings.AUTH_TOKEN_LIFETIME)
        except Token.DoesNotExist:
            return False
