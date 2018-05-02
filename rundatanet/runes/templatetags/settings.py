from django import template
from django.conf import settings

register = template.Library()

@register.simple_tag
def get_from_settings(key, default=None):
	return getattr(settings, key, default)