from django.urls import re_path

from . import views

urlpatterns = [
    re_path(r'^object/?$', views.BookingObjectListCreateAPIView.as_view(), name='booking_object_list_create'),
    re_path(
        r'^object/(?P<pk>[^/]+)/?', views.BookingObjectRetrieveUpdateDestroyAPIView.as_view(),
        name='booking_object_retrieve_update_destroy'
    ),
    re_path(
        r'^type/?$', views.BookingObjectTypeListCreateAPIView.as_view(),
        name='booking_object_type_list_create'
    ),
    re_path(
        r'^type/(?P<pk>[^/]+)/?$', views.BookingObjectTypeRetrieveUpdateDestroyAPIView.as_view(),
        name='booking_object_type_retrieve_update_destroy'
    ),
    re_path('^object-tree/?', views.BookingObjectTreeView.as_view(), name='booking_object_tree_view')
]
