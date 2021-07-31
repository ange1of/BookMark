from django.urls import re_path
from . import views

urlpatterns = [
    re_path('^pricing-types/?', views.PricingTypesAPIView.as_view(), name='handbook-pricing-types'),
    re_path('^reservation-states/?', views.ReservationStatesAPIView.as_view(), name='handbook-reservation-states')
]
