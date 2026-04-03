"""Integration tests: ensure no Danish inscriptions reference http://runer.ku.dk."""

from django.test import TestCase

from rundatanet.runes.models import MetaInformation


class DanishRunerKuDkReferenceTests(TestCase):
    """Verify that Danish inscriptions have no runer.ku.dk links in their references."""

    databases = {"default", "runes_db"}

    def test_no_runer_ku_dk_in_legacy_reference_field(self):
        """No DR inscription should mention runer.ku.dk in the legacy 'reference' text field."""
        bad = (
            MetaInformation.objects.using("runes_db")
            .filter(
                signature__signature_text__startswith="DR ",
                reference__contains="http://runer.ku.dk",
            )
            .values_list("signature__signature_text", flat=True)
        )
        bad_list = list(bad)
        self.assertEqual(
            bad_list,
            [],
            f"Danish inscriptions still contain http://runer.ku.dk in 'reference': {bad_list}",
        )

    def test_no_runer_ku_dk_in_normalised_references(self):
        """No DR inscription should have a normalised Reference row whose text contains runer.ku.dk."""
        bad = (
            MetaInformation.objects.using("runes_db")
            .filter(
                signature__signature_text__startswith="DR ",
                references__text__contains="http://runer.ku.dk",
            )
            .values_list("signature__signature_text", flat=True)
            .distinct()
        )
        bad_list = list(bad)
        self.assertEqual(
            bad_list,
            [],
            f"Danish inscriptions still linked to runer.ku.dk Reference rows: {bad_list}",
        )
