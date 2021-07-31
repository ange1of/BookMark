import uuid

from django.db import models


class BookingObjectType(models.Model):
    """ Категория объектов бронирования
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid1,
        editable=False
    )
    title = models.CharField(
        verbose_name='Название категории',
        max_length=80,
        null=False,
        blank=False
    )
