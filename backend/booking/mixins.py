from django.db import models


class TimeStampedModel(models.Model):

    class Meta:
        abstract = True

    created = models.DateTimeField(
        auto_now_add=True,
        editable=False,
        db_index=True
    )
    updated = models.DateTimeField(
        auto_now=True,
        editable=False,
        db_index=True
    )
