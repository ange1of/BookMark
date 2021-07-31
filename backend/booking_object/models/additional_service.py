import uuid

from django.db import models


class AdditionalService(models.Model):
    """ Дополнительная услуга
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid1,
        editable=False
    )
    title = models.CharField(
        verbose_name='Название услуги',
        editable=False,
        max_length=80
    )
    description = models.TextField(
        verbose_name='Описание услуги',
        null=True,
        blank=True,
        max_length=200
    )
    price = models.FloatField(
        verbose_name='Цена'
    )
    booking_object = models.ForeignKey(
        'booking_object.BookingObject',
        on_delete=models.CASCADE,
        verbose_name='Объект бронирования',
        null=False
    )
