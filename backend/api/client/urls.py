from django.urls import re_path

from . import views

urlpatterns = [
    re_path(
        r'^$', views.ClientListCreateAPIView.as_view(),
        name='client_list_create'
    ),
    re_path(
        r'^create-or-update/?$', views.ClientCreateOrUpdateAPIView.as_view(),
        name='client_create_or_update'
    ),
    re_path(
        r'^(?P<pk>[^/]+)/?$', views.ClientRetrieveUpdateDestroyAPIView.as_view(),
        name='client_retrieve_update_destroy'
    ),
]
