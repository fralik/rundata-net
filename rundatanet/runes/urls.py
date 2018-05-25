from django.urls import path
from django.views.generic import TemplateView

from . import views

app_name = 'runes'
urlpatterns = [
    path('', TemplateView.as_view(template_name="runes/index.html"), name='index'),
    # path('master', views.master),
    path('about/', TemplateView.as_view(template_name="runes/about.html"), name="about"),
    path('references/', TemplateView.as_view(template_name="runes/references.html"), name="references"),
]
