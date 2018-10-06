from django.contrib.sitemaps.views import sitemap
from django.views.generic import TemplateView
from django.urls import path

from .sitemaps import StaticViewSitemap, MainPageSitemap, AboutPageSitemap
from . import views

sitemaps = {
    'static': StaticViewSitemap,
    'main': MainPageSitemap,
    'about': AboutPageSitemap,
}

app_name = 'runes'
urlpatterns = [
    path('', TemplateView.as_view(template_name="runes/index.html"), name='index'),
    # path('master', views.master),
    path('about/', TemplateView.as_view(template_name="runes/about.html"), name='about'),
    path('references/', TemplateView.as_view(template_name="runes/references.html"), name='references'),
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap')
]
