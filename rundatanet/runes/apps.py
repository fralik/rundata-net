from django.apps import AppConfig


class RunesConfig(AppConfig):
    name = "rundatanet.runes"
    verbose_name = "Runes"

    def ready(self):
        from django.db.models.signals import post_delete, post_save

        from .models import Signature
        from .normalization import SlugIndex

        def _invalidate_slug_index(sender, **kwargs):
            SlugIndex.invalidate()

        post_save.connect(_invalidate_slug_index, sender=Signature)
        post_delete.connect(_invalidate_slug_index, sender=Signature)
