import uuid
from django.db import models
from .constants import RESERVATION_STATES
from booking.mixins import TimeStampedModel


class Reservation(TimeStampedModel):
    """ Бронирование
    """

    id = models.AutoField(primary_key=True)
    state = models.CharField(
        verbose_name='Состояние',
        choices=RESERVATION_STATES,
        max_length=20
    )
    start = models.DateTimeField(
        verbose_name='Начало брони'
    )
    end = models.DateTimeField(
        verbose_name='Окончание брони'
    )
    client = models.ForeignKey(
        'client.Client',
        on_delete=models.SET_NULL,
        null=True
    )
    booking_object = models.ForeignKey(
        'booking_object.BookingObject',
        on_delete=models.CASCADE,
        verbose_name='Объект бронирования',
        null=True
    )
    price = models.FloatField(
        verbose_name='Цена',
    )
    comments = models.TextField(
        verbose_name='Комментарии к бронированию',
        max_length=300,
        null=True,
        blank=True
    )
