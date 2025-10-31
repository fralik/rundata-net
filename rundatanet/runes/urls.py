from django.contrib.sitemaps.views import sitemap
from django.urls import path
from django.views.generic import TemplateView

from . import views
from .sitemaps import AboutPageSitemap, MainPageSitemap, StaticViewSitemap

sitemaps = {
    "static": StaticViewSitemap,
    "main": MainPageSitemap,
    "about": AboutPageSitemap,
}

app_name = "runes"
urlpatterns = [
    path("", TemplateView.as_view(template_name="runes/index.html"), name="index"),
    path("v1", TemplateView.as_view(template_name="runes/index_old.html"), name="index_v1"),
    # path('master', views.master),
    path("about/", TemplateView.as_view(template_name="runes/about.html"), name="about"),
    path("references/", TemplateView.as_view(template_name="runes/references.html"), name="references"),
    path("eda/", TemplateView.as_view(template_name="runes/eda.html"), name="eda"),
    path("sitemap.xml", sitemap, {"sitemaps": sitemaps}, name="django.contrib.sitemaps.views.sitemap"),
]
