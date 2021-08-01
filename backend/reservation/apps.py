from django.apps import AppConfig


class ReservationModuleConfig(AppConfig):
    name = 'reservation'
    verbose_name = 'Бронирование'

    def ready(self):
        import reservation.receivers
