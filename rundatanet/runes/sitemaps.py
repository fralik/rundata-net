from django.contrib import sitemaps
from django.urls import reverse

class StaticViewSitemap(sitemaps.Sitemap):
    priority = 0.5
    changefreq = 'monthly'

    def items(self):
        return ['runes:references']

    def location(self, item):
        return reverse(item)

class MainPageSitemap(sitemaps.Sitemap):
    priority = 0.9
    changefreq = 'daily'

    def items(self):
        return ['runes:index']

    def location(self, item):
        return reverse(item)

class AboutPageSitemap(sitemaps.Sitemap):
    priority = 1.0
    changefreq = 'monthly'

    def items(self):
        return ['runes:about']

    def location(self, item):
        return reverse(item)
