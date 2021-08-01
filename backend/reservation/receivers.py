from django.db.models.signals import pre_delete
from django.dispatch import receiver

from booking_object.models import BookingObject


@receiver(pre_delete, sender=BookingObject)
def cascade_delete_reservation(instance, **__):
    instance.reservation_set.all().delete()
