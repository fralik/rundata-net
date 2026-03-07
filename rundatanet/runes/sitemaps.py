from django.contrib import sitemaps
from django.urls import reverse

from .models import Signature
from .normalization import normalize_signature


class StaticViewSitemap(sitemaps.Sitemap):
    priority = 0.2
    changefreq = "yearly"

    def items(self):
        return ["runes:references"]

    def location(self, item):
        return reverse(item)


class MainPageSitemap(sitemaps.Sitemap):
    priority = 1.0
    changefreq = "weekly"

    def items(self):
        return ["runes:index"]

    def location(self, item):
        return reverse(item)


class AboutPageSitemap(sitemaps.Sitemap):
    priority = 0.4
    changefreq = "yearly"

    def items(self):
        return ["runes:about"]

    def location(self, item):
        return reverse(item)


class InscriptionSitemap(sitemaps.Sitemap):
    priority = 0.8
    changefreq = "monthly"

    def items(self):
        return Signature.objects.filter(parent__isnull=True).values_list("signature_text", flat=True)

    def location(self, signature_text):
        slug = normalize_signature(signature_text)
        return reverse("runes:inscription_detail", kwargs={"slug": slug})
