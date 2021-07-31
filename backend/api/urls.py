from django.urls import re_path, include

urlpatterns = [
    re_path(r'^auth/', include('api.auth.urls')),
    re_path(r'^booking-object/', include('api.booking_object.urls')),
    re_path(r'^client/', include('api.client.urls')),
    re_path(r'^handbook/', include('api.handbook.urls')),
    re_path(r'^reservation/', include('api.reservation.urls')),
]
