import uuid

from django.db import models

from ..constants import PRICING_TYPES


class BookingObject(models.Model):
    """ Объект бронирования
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid1,
        editable=False
    )
    title = models.CharField(
        verbose_name='Название объекта',
        max_length=80,
        null=False,
        blank=False
    )
    object_type = models.ForeignKey(
        'booking_object.BookingObjectType',
        on_delete=models.CASCADE,
        verbose_name='Тип объекта',
        related_name='booking_objects',
        null=False,
        blank=False
    )
    pricing_type = models.CharField(
        verbose_name='Тип оплаты',
        choices=PRICING_TYPES,
        max_length=20,
        null=False,
        blank=False
    )
    price = models.IntegerField(
        verbose_name='Цена',
        null=False,
        blank=False
    )


