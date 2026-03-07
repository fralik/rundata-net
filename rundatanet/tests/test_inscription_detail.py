from django.test import TestCase, override_settings
from django.urls import reverse

from rundatanet.runes.models import MetaInformation, Signature
from rundatanet.runes.normalization import SlugIndex, normalize_signature


class TestNormalizeSignature(TestCase):
    """Test the normalize_signature function with various inputs."""

    def test_basic_ascii(self):
        assert normalize_signature("U 1034") == "u-1034"

    def test_swedish_umlauts(self):
        assert normalize_signature("Öl 1") == "ol-1"
        assert normalize_signature("Ög 218") == "og-218"
        assert normalize_signature("Sö 145") == "so-145"

    def test_complex_serial(self):
        assert normalize_signature("Öl SHM1304:1836:64") == "ol-shm1304-1836-64"

    def test_semicolon_reference(self):
        assert normalize_signature("Ög F7;54") == "og-f7-54"

    def test_no_space(self):
        assert normalize_signature("Bo Peterson1992") == "bo-peterson1992"

    def test_comma_separated(self):
        assert normalize_signature("X SvIK365,1,7") == "x-svik365-1-7"

    def test_empty_string(self):
        assert normalize_signature("") == ""

    def test_only_special_chars(self):
        assert normalize_signature("---") == ""

    def test_consecutive_spaces(self):
        assert normalize_signature("U  1034") == "u-1034"

    def test_leading_trailing_spaces(self):
        assert normalize_signature(" Öl 1 ") == "ol-1"

    def test_idempotent(self):
        """Normalizing an already-normalized slug should return the same value."""
        slug = normalize_signature("Ög F7;54")
        assert normalize_signature(slug) == slug

    def test_narke(self):
        assert normalize_signature("Nä 1") == "na-1"

    def test_angermanland(self):
        assert normalize_signature("Ån 1") == "an-1"

    def test_fv_reference(self):
        # Fv1958;252 kind of signature
        assert normalize_signature("U Fv1958;252") == "u-fv1958-252"

    def test_parentheses(self):
        assert normalize_signature("DR EM85;523B") == "dr-em85-523b"


class TestSlugIndex(TestCase):
    """Test the SlugIndex class with real Signature objects."""

    databases = {"default", "runes_db"}

    def setUp(self):
        SlugIndex.reset()
        # Create parent signatures
        self.sig1 = Signature.objects.using("runes_db").create(signature_text="Öl 1")
        self.sig2 = Signature.objects.using("runes_db").create(signature_text="U 1034")
        # Create MetaInformation for sig1
        self.meta1 = MetaInformation.objects.using("runes_db").create(
            signature=self.sig1,
            found_location="Test location",
        )
        self.meta2 = MetaInformation.objects.using("runes_db").create(
            signature=self.sig2,
            found_location="Another location",
        )
        # Create an alias
        self.alias = Signature.objects.using("runes_db").create(
            signature_text="Öl Alternative1",
            parent=self.sig1,
        )

    def tearDown(self):
        SlugIndex.reset()

    def test_resolve_primary(self):
        result = SlugIndex.get().resolve("ol-1")
        assert result is not None
        sig_id, slug = result
        assert sig_id == self.sig1.id
        assert slug == "ol-1"

    def test_resolve_alias(self):
        result = SlugIndex.get().resolve("ol-alternative1")
        assert result is not None
        sig_id, slug = result
        assert sig_id == self.sig1.id  # Resolves to parent
        assert slug == "ol-1"  # Canonical slug

    def test_resolve_not_found(self):
        result = SlugIndex.get().resolve("nonexistent-inscription")
        assert result is None

    def test_is_alias(self):
        assert SlugIndex.get().is_alias("ol-alternative1") is True
        assert SlugIndex.get().is_alias("ol-1") is False
        assert SlugIndex.get().is_alias("nonexistent") is False

    def test_get_canonical_slug(self):
        idx = SlugIndex.get()
        assert idx.get_canonical_slug(self.sig1.id) == "ol-1"
        assert idx.get_canonical_slug(self.sig2.id) == "u-1034"

    def test_unnormalized_input(self):
        """Passing an unnormalized string should still resolve."""
        result = SlugIndex.get().resolve("Öl 1")
        assert result is not None
        assert result[1] == "ol-1"


class TestInscriptionDetailView(TestCase):
    """Test the inscription detail HTML view."""

    databases = {"default", "runes_db"}

    def setUp(self):
        SlugIndex.reset()
        self.sig = Signature.objects.using("runes_db").create(signature_text="Sö 145")
        self.meta = MetaInformation.objects.using("runes_db").create(
            signature=self.sig,
            found_location="Södermanland",
            lost=True,
            new_reading=False,
        )
        self.alias = Signature.objects.using("runes_db").create(
            signature_text="Sö Alt145",
            parent=self.sig,
        )

    def tearDown(self):
        SlugIndex.reset()

    def test_detail_200(self):
        url = reverse("runes:inscription_detail", kwargs={"slug": "so-145"})
        response = self.client.get(url)
        assert response.status_code == 200
        assert "Sö 145" in response.content.decode()

    def test_detail_404(self):
        url = reverse("runes:inscription_detail", kwargs={"slug": "nonexistent"})
        response = self.client.get(url)
        assert response.status_code == 404

    def test_alias_redirect(self):
        url = reverse("runes:inscription_detail", kwargs={"slug": "so-alt145"})
        response = self.client.get(url)
        assert response.status_code == 301
        assert response.url.endswith("/inscription/so-145/")

    def test_lost_badge(self):
        url = reverse("runes:inscription_detail", kwargs={"slug": "so-145"})
        response = self.client.get(url)
        content = response.content.decode()
        assert "†" in content

    def test_alias_shown(self):
        url = reverse("runes:inscription_detail", kwargs={"slug": "so-145"})
        response = self.client.get(url)
        content = response.content.decode()
        assert "Sö Alt145" in content

    def test_map_is_hidden_without_coordinates(self):
        url = reverse("runes:inscription_detail", kwargs={"slug": "so-145"})
        response = self.client.get(url)
        content = response.content.decode()
        assert 'id="detailMap"' not in content
        assert "Original coordinates" not in content
        assert "Current coordinates" not in content

    def test_map_renders_both_location_sets(self):
        self.meta.latitude = 59.123456
        self.meta.longitude = 17.654321
        self.meta.present_latitude = 59.987654
        self.meta.present_longitude = 18.123456
        self.meta.current_location = "Museum storehouse"
        self.meta.original_site = "Ancient bridge crossing"
        self.meta.save(using="runes_db")

        url = reverse("runes:inscription_detail", kwargs={"slug": "so-145"})
        response = self.client.get(url)
        content = response.content.decode()

        assert 'id="detailMap"' in content
        assert "Original coordinates" in content
        assert "Current coordinates" in content
        assert "Original or found location" in content
        assert "Current or present location" in content
        assert "59.123456, 17.654321" in content
        assert "59.987654, 18.123456" in content
        assert "Museum storehouse" in content

    def test_map_renders_with_present_only_coordinates(self):
        self.meta.present_latitude = 58.765432
        self.meta.present_longitude = 16.234567
        self.meta.current_location = "Regional museum"
        self.meta.save(using="runes_db")

        url = reverse("runes:inscription_detail", kwargs={"slug": "so-145"})
        response = self.client.get(url)
        content = response.content.decode()

        assert 'id="detailMap"' in content
        assert "Current coordinates" in content
        assert "58.765432, 16.234567" in content
        assert "Regional museum" in content

    def test_unicode_input_redirects(self):
        """Raw Unicode signature in URL should 301-redirect to the canonical slug."""
        response = self.client.get("/inscription/S\u00f6 145/")
        assert response.status_code == 301
        assert response.url.endswith("/inscription/so-145/")

    def test_uppercase_slug_redirects(self):
        """Non-normalized but ASCII slug should redirect to canonical."""
        response = self.client.get("/inscription/So-145/")
        assert response.status_code == 301
        assert response.url.endswith("/inscription/so-145/")


class TestInscriptionDetailAPI(TestCase):
    """Test the inscription detail JSON API endpoint."""

    databases = {"default", "runes_db"}

    def setUp(self):
        SlugIndex.reset()
        self.sig = Signature.objects.using("runes_db").create(signature_text="U 1034")
        self.meta = MetaInformation.objects.using("runes_db").create(
            signature=self.sig,
            found_location="Uppland",
        )
        self.alias = Signature.objects.using("runes_db").create(
            signature_text="U Alt1034",
            parent=self.sig,
        )

    def tearDown(self):
        SlugIndex.reset()

    def test_api_200(self):
        response = self.client.get("/api/inscription/u-1034")
        assert response.status_code == 200
        data = response.json()
        assert data["signature"] == "U 1034"
        assert data["canonical_slug"] == "u-1034"

    def test_api_alias_resolves(self):
        response = self.client.get("/api/inscription/u-alt1034")
        assert response.status_code == 200
        data = response.json()
        assert data["signature"] == "U 1034"
        assert data["canonical_slug"] == "u-1034"
        assert "U Alt1034" in data["aliases"]

    def test_api_404(self):
        response = self.client.get("/api/inscription/nonexistent")
        assert response.status_code == 404
        data = response.json()
        assert "detail" in data
