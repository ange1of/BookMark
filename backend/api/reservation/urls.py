from django.urls import re_path
from . import views

urlpatterns = [
    re_path(
        r'^$', views.ReservationListCreateAPIView.as_view(),
        name='reservation_list_create'
    ),
    re_path(
        r'^range/?$', views.ReservationRangeListAPIView.as_view(),
        name='reservation_range_list'
    ),
    re_path(
        r'^(?P<pk>[^/]+)/?$', views.ReservationRetrieveUpdateDestroyAPIView.as_view(),
        name='reservation_retrieve_update_destroy'
    ),
]
