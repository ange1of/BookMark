import uuid
from django.db import models
from booking.mixins import TimeStampedModel


class Client(TimeStampedModel):
    """ Клиент
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid1,
        editable=False
    )
    phone = models.CharField(
        verbose_name='Телефон',
        null=False,
        blank=False,
        db_index=True,
        unique=True,
        max_length=30
    )
    name = models.CharField(
        verbose_name='Имя',
        null=False,
        blank=False,
        db_index=True,
        max_length=100
    )
    email = models.EmailField(
        verbose_name='Электронная почта',
        null=True,
        blank=True
    )
    additional_info = models.TextField(
        verbose_name='Дополнительная информация',
        max_length=300,
        null=True,
        blank=True
    )

    is_deleted = models.BooleanField(
        verbose_name='Флаг удаленного клиента',
        default=False,
        null=False,
        blank=False
    )
