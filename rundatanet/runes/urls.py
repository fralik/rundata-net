from django.urls import path

from . import views

app_name = 'runes'
urlpatterns = [
    path('', views.mytest),
    # path('master', views.master),
]