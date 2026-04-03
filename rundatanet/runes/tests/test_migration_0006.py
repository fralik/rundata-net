"""Tests for the 0006_extract_runer_ku_dk_references data migration."""

import importlib.util
import os

import django.apps
from django.test import TestCase

from rundatanet.runes.models import MetaInformation, Reference, Signature

_migration_path = os.path.join(
    os.path.dirname(__file__),
    "..",
    "migrations",
    "0006_extract_runer_ku_dk_references.py",
)
_spec = importlib.util.spec_from_file_location("migration_0006", _migration_path)
_migration = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_migration)
extract_dk_references = _migration.extract_dk_references


class ExtractDkReferencesTests(TestCase):
    """Unit tests for the extract_dk_references migration function."""

    databases = {"default", "runes_db"}

    def setUp(self):
        self.sig = Signature.objects.using("runes_db").create(signature_text="DR 1")
        self.meta = MetaInformation.objects.using("runes_db").create(
            signature=self.sig,
            found_location="Test",
        )

    def _run(self):
        extract_dk_references(django.apps.apps, None)

    # ------------------------------------------------------------------
    # helper
    # ------------------------------------------------------------------
    def _create_ref(self, text, kind="text", label=""):
        ref = Reference.objects.using("runes_db").create(text=text, kind=kind, label=label)
        self.meta.references.add(ref)
        return ref

    # ------------------------------------------------------------------
    # cases
    # ------------------------------------------------------------------
    def test_removes_dk_segment_from_middle(self):
        """DK nr. segment in the middle is removed; text reference is updated."""
        ref = self._create_ref(
            "$=Author 1990; DK nr.: Sk 130, http://runer.ku.dk/VisGenstand.aspx?Titel=Farlov-sten; http://urn.nb.no/foo"
        )
        self._run()

        ref.refresh_from_db()
        assert ref.text == "$=Author 1990; http://urn.nb.no/foo"
        assert self.meta.references.filter(text__startswith="http://runer.ku.dk/").exists()
        link_ref = self.meta.references.get(text__startswith="http://runer.ku.dk/")
        assert link_ref.kind == "link"
        assert link_ref.label == "Danish Runic Inscriptions Database"

    def test_removes_dk_segment_at_end(self):
        """DK nr. segment at the end is removed."""
        ref = self._create_ref("$=Moltke 1985:547; DK nr.: NJy 41, http://runer.ku.dk/VisGenstand.aspx?Titel=Ydby-sten")
        self._run()

        ref.refresh_from_db()
        assert ref.text == "$=Moltke 1985:547"

    def test_dk_segment_with_dollar_prefix_deleted_when_only_segment(self):
        """If the only segment is $=DK nr.:…, the reference is deleted."""
        ref_pk = self._create_ref("$=DK nr.: SJy 63, http://runer.ku.dk/VisGenstand.aspx?Titel=Kegnaes-hvaessesten").pk
        self._run()

        assert not Reference.objects.using("runes_db").filter(pk=ref_pk).exists()
        assert self.meta.references.filter(kind="link", label="Danish Runic Inscriptions Database").exists()

    def test_sole_dk_segment_without_prefix_deleted(self):
        """A reference that is purely a DK nr. entry is deleted after extraction."""
        ref_pk = self._create_ref("DK nr.: Sk 14, http://runer.ku.dk/VisGenstand.aspx?Titel=Norra-Asum-sten").pk
        self._run()

        assert not Reference.objects.using("runes_db").filter(pk=ref_pk).exists()

    def test_encoded_url_full_reference_replaced(self):
        """A bare runer.ku.dk URL reference is converted to a link in place."""
        url = "http://runer.ku.dk/VisGenstand.aspx?Titel=Runem%c3%b8nt,_DR_M%c3%b8nt_6"
        ref = self._create_ref(url)
        self._run()

        ref.refresh_from_db()
        assert ref.kind == "link"
        assert ref.label == "Danish Runic Inscriptions Database"
        assert self.meta.references.filter(pk=ref.pk).exists()

    def test_bare_url_extracted_from_mixed_segments(self):
        """A bare runer.ku.dk URL among other segments is extracted as a link."""
        ref = self._create_ref(
            "DR BR74; KJ 128; §Q: $=Grønvik 1996:220-230; http://runer.ku.dk/VisGenstand.aspx?Titel=Eskatorp-brakteat; http://digi20.digitale-sammlungen.de/en/fs1/object/display/bsb00042599_00048.html; <http://www.runenprojekt.uni-kiel.de/abfragen/standard/deutung2_eng.asp?findno=129&ort=Eskatorp&objekt=brakteat (F-typ)>"
        )
        self._run()

        ref.refresh_from_db()
        assert ref.text == (
            "DR BR74; KJ 128; §Q: $=Grønvik 1996:220-230; "
            "http://digi20.digitale-sammlungen.de/en/fs1/object/display/bsb00042599_00048.html; "
            "<http://www.runenprojekt.uni-kiel.de/abfragen/standard/deutung2_eng.asp?findno=129&ort=Eskatorp&objekt=brakteat (F-typ)>"
        )
        link_ref = self.meta.references.get(text="http://runer.ku.dk/VisGenstand.aspx?Titel=Eskatorp-brakteat")
        assert link_ref.kind == "link"
        assert link_ref.label == "Danish Runic Inscriptions Database"

    def test_link_reference_created_once_for_shared_url(self):
        """Even if two text references share the same runer.ku.dk URL only one
        link reference is created."""
        sig2 = Signature.objects.using("runes_db").create(signature_text="DR 2")
        meta2 = MetaInformation.objects.using("runes_db").create(signature=sig2, found_location="Test2")
        url = "http://runer.ku.dk/VisGenstand.aspx?Titel=Shared-sten"
        ref1 = Reference.objects.using("runes_db").create(text=f"$=Author A; DK nr.: Sk 1, {url}")
        ref2 = Reference.objects.using("runes_db").create(text=f"$=Author B; DK nr.: Sk 1, {url}")
        self.meta.references.add(ref1)
        meta2.references.add(ref2)

        self._run()

        link_refs = Reference.objects.using("runes_db").filter(text=url)
        assert link_refs.count() == 1
        link_ref = link_refs.get()
        assert self.meta.references.filter(pk=link_ref.pk).exists()
        assert meta2.references.filter(pk=link_ref.pk).exists()

    def test_cleaned_text_collision_merges_references(self):
        """If cleaning produces a text already owned by another Reference,
        the MetaInformation is migrated to the existing reference."""
        existing = Reference.objects.using("runes_db").create(text="$=Author 1990")
        ref = self._create_ref("$=Author 1990; DK nr.: Sk 99, http://runer.ku.dk/VisGenstand.aspx?Titel=Test-sten")
        ref_pk = ref.pk
        self._run()

        # Original reference should be deleted (duplicate of existing).
        assert not Reference.objects.using("runes_db").filter(pk=ref_pk).exists()
        # MetaInformation should now point to the existing reference.
        assert self.meta.references.filter(pk=existing.pk).exists()

    def test_non_matching_reference_untouched(self):
        """References without a runer.ku.dk URL are not modified."""
        ref = self._create_ref("$=SRI 1 plansch IV fig. 3")
        self._run()

        ref.refresh_from_db()
        assert ref.text == "$=SRI 1 plansch IV fig. 3"
