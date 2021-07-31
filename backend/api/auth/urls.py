from django.urls import re_path

from . import views

urlpatterns = [
    re_path(r'^current/?$', views.CurrentUserView.as_view()),
    re_path(r'^login/?$', views.LoginView.as_view()),
    re_path(r'^logout/?$', views.LogoutView.as_view()),
]
