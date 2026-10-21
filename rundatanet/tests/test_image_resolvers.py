import json
import zipfile
from io import BytesIO
from unittest.mock import patch

from django.test import SimpleTestCase, TestCase
from django.urls import reverse

from rundatanet.runes.image_resolvers import (
    ImageResolveError, extract_raa_document_uuid, is_supported_image_source, resolve_image_link,
)
from rundatanet.runes.models import ImageLink, MetaInformation, Signature


RAA_UUID = "d8875a4e-0e76-4eea-b571-f592189f5d5b"
RUNER_SOURCE_URL = "https://runer.ku.dk/q.php?p=runer/genstande/genstand/365"
RUNER_IMAGE_URL = "https://runer.ku.dk/projects/runer/RunerKUdk_userfiles/image/ImgCache/365/rune05b_502.jpg"
RAA_SOURCE_URL = f"https://pub.raa.se/visa/dokumentation/{RAA_UUID}"
RAA_THUMBNAIL_URL = f"https://pub.raa.se/dokumentation/{RAA_UUID}/visning/1/miniatyr"
RAA_DISPLAY_URL = f"https://pub.raa.se/dokumentation/{RAA_UUID}/visning/1"
RAA_ARCHIVE_URL = f"https://pub.raa.se/dokumentation/{RAA_UUID}/arkivbestandig/1"
SORMLAND_SOURCE_URL = "https://sokisamlingar.sormlandsmuseum.se/objects/c24-363406/"
SORMLAND_IMAGE_URL = "https://cust.kulturhotell.se/c24/files/fullsize/45dc66d1c25b38bc42c49d91ad8f6a84.jpg"
SORMLAND_LICENSE_URL = "https://creativecommons.org/publicdomain/mark/1.0/deed.sv"
DIGITALT_MUSEUM_SOURCE_URL = "https://digitaltmuseum.se/011013957649"
DIGITALT_MUSEUM_DOWNLOAD_URL = (
    "https://ems.dimu.org/image/022s93Xu15Yc"
    "?filename=DIA15081.jpg&dimension=max&quality=100&dpi=300&mediatype=image/jpg"
)
DIGITALT_MUSEUM_THUMBNAIL_URL = "https://ems.dimu.org/image/022s93Xu15Yc?dimension=1200x1200"
DIGITALT_MUSEUM_LICENSE_URL = "https://creativecommons.org/licenses/by-nc-nd/4.0/deed.en"


def raa_document_json():
    return {
        "license": {
            "license": "https://creativecommons.org/licenses/by/4.0/",
            "licenseName": "CC-BY 4.0",
        },
        "resourceGroups": [
            {
                "presentationThumbnailUrl": RAA_THUMBNAIL_URL,
                "resources": [
                    {
                        "fileName": "index_1.tiff",
                        "fileSize": 37758930,
                        "format": "arkivbestandig",
                        "media": "image/tiff",
                        "uri": RAA_ARCHIVE_URL,
                    },
                    {
                        "fileName": "thumbnail.png",
                        "fileSize": 43273,
                        "format": "visning",
                        "media": "image/png",
                        "uri": RAA_THUMBNAIL_URL,
                    },
                    {
                        "fileName": "index_1.jpeg",
                        "fileSize": 741459,
                        "format": "visning",
                        "media": "image/jpeg",
                        "uri": RAA_DISPLAY_URL,
                    },
                ],
            }
        ],
    }


class FakeUrlopenResponse:
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        return False

    def read(self):
        return json.dumps(raa_document_json()).encode("utf-8")


class FakeSormlandUrlopenResponse:
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        return False

    def read(self):
        return f"""
        <html>
          <head>
            <meta property="og:image" content="{SORMLAND_IMAGE_URL}" />
          </head>
          <body>
            <a href="{SORMLAND_LICENSE_URL}">Public Domain-märke (PDM)</a>
          </body>
        </html>
        """.encode("utf-8")


class FakeDigitaltMuseumUrlopenResponse:
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        return False

    def read(self):
        return f"""
        <html>
          <head>
            <meta property="og:image" content="{DIGITALT_MUSEUM_THUMBNAIL_URL}" />
          </head>
          <body>
            <script>
              window.app.data = {{"images":[{{"dms_url":"https://ems.dimu.org/image/022s93Xu15Yc","license_data":{{"licenses":[{{"label":"CC by-nc-nd","link":{{"url":"{DIGITALT_MUSEUM_LICENSE_URL}"}}}}]}}}}]}};
            </script>
            <a download href="{DIGITALT_MUSEUM_DOWNLOAD_URL}">Accept license and download photo</a>
            <a href="{DIGITALT_MUSEUM_LICENSE_URL}">Attribution-NonCommercial-NoDerivs (CC BY-NC-ND)</a>
          </body>
        </html>
        """.encode("utf-8")


class TestArildHaugeImageResolver(SimpleTestCase):
    @patch("rundatanet.runes.image_resolvers.urlopen")
    def test_resolves_direct_images_without_fetching_page(self, mocked_urlopen):
        for extension, media_type in (("jpg", "image/jpeg"), ("jpeg", "image/jpeg"), ("gif", "image/gif"), ("png", "image/png")):
            url = f"https://www.arild-hauge.com/arild-hauge/tunestein.{extension}"
            resolved = resolve_image_link(url, url)
            assert is_supported_image_source(url)
            assert resolved.provider == "Arild Hauge"
            assert resolved.download_url == url
            assert resolved.media_type == media_type
            assert resolved.license_url == resolved.license_name == ""
        mocked_urlopen.assert_not_called()

    def test_normalizes_entities_spaces_and_unicode(self):
        url = "https://arild-hauge.com/Futhark/Bug&aring;rd photo%20one.JPG"
        resolved = resolve_image_link(url)
        assert resolved.download_url.endswith("Bug%C3%A5rd%20photo%20one.JPG")
        assert resolved.file_name == "Bugård photo one.JPG"
        assert resolved.media_type == "image/jpeg"

    def test_rejects_pages_and_other_hosts(self):
        with self.assertRaises(ImageResolveError):
            resolve_image_link("https://www.arild-hauge.com/runer.htm")
        with self.assertRaises(ImageResolveError):
            resolve_image_link("https://www.arild-hauge.com/runer.htm", "https://example.org/image.jpg")
        assert not is_supported_image_source("https://arild-hauge.com.example.org/photo.jpg")
        assert not is_supported_image_source("https://example.org/arild-hauge.com/photo.jpg")


class TestRunerKuImageResolver(SimpleTestCase):
    @patch("rundatanet.runes.image_resolvers.urlopen")
    def test_preserves_selected_image_without_fetching_object_page(self, mocked_urlopen):
        resolved = resolve_image_link(RUNER_SOURCE_URL, RUNER_IMAGE_URL)
        assert is_supported_image_source(RUNER_SOURCE_URL, RUNER_IMAGE_URL)
        assert resolved.provider == "Runer KU"
        assert resolved.download_url == RUNER_IMAGE_URL
        assert resolved.source_url == RUNER_SOURCE_URL
        assert resolved.file_name == "rune05b_502.jpg"
        assert resolved.media_type == "image/jpeg"
        assert resolved.license_url == resolved.license_name == ""
        mocked_urlopen.assert_not_called()

    def test_encodes_spaces_and_preserves_existing_escapes(self):
        resolved = resolve_image_link(RUNER_SOURCE_URL, RUNER_IMAGE_URL.replace("rune05b_502", "photo%20one two"))
        assert resolved.download_url.endswith("photo%20one%20two.jpg")
        assert resolved.file_name == "photo one two.jpg"

    def test_accepts_direct_image_without_object_page(self):
        assert resolve_image_link("", RUNER_IMAGE_URL).download_url == RUNER_IMAGE_URL

    def test_rejects_missing_image_and_other_hosts(self):
        for direct_url in ("", "https://example.org/image.jpg"):
            with self.assertRaises(ImageResolveError):
                resolve_image_link(RUNER_SOURCE_URL, direct_url)
        assert not is_supported_image_source("https://runer.ku.dk.example.org/image.jpg")
        assert not is_supported_image_source("https://example.org/runer.ku.dk/image.jpg")


class TestRaaImageResolver(TestCase):
    def test_extracts_raa_uuid_from_source_or_thumbnail_urls(self):
        assert extract_raa_document_uuid(RAA_SOURCE_URL) == RAA_UUID
        assert extract_raa_document_uuid("", RAA_THUMBNAIL_URL) == RAA_UUID

    @patch("rundatanet.runes.image_resolvers.urlopen", return_value=FakeUrlopenResponse())
    def test_resolves_raa_thumbnail_to_display_image(self, mocked_urlopen):
        resolved = resolve_image_link(RAA_SOURCE_URL, RAA_THUMBNAIL_URL)

        assert resolved.provider == "RAÄ"
        assert resolved.download_url == RAA_DISPLAY_URL
        assert resolved.thumbnail_url == RAA_THUMBNAIL_URL
        assert resolved.file_name == "index_1.jpeg"
        assert resolved.media_type == "image/jpeg"
        assert resolved.file_size == 741459
        assert resolved.license_url == "https://creativecommons.org/licenses/by/4.0/"
        assert resolved.license_name == "CC-BY 4.0"

        request = mocked_urlopen.call_args.args[0]
        assert request.full_url == f"https://pub.raa.se/dokumentation/{RAA_UUID}"

    @patch("rundatanet.runes.image_resolvers.urlopen", return_value=FakeSormlandUrlopenResponse())
    def test_resolves_sormlandsmuseum_object_to_fullsize_image(self, mocked_urlopen):
        resolved = resolve_image_link(SORMLAND_SOURCE_URL, "")

        assert resolved.provider == "Sörmlands museum"
        assert resolved.download_url == SORMLAND_IMAGE_URL
        assert resolved.thumbnail_url == SORMLAND_IMAGE_URL
        assert resolved.file_name == "45dc66d1c25b38bc42c49d91ad8f6a84.jpg"
        assert resolved.media_type == "image/jpeg"
        assert resolved.license_url == SORMLAND_LICENSE_URL
        assert resolved.license_name == "Public Domain Mark"
        assert mocked_urlopen.called

    @patch("rundatanet.runes.image_resolvers.urlopen", return_value=FakeDigitaltMuseumUrlopenResponse())
    def test_resolves_digitaltmuseum_object_to_download_image(self, mocked_urlopen):
        resolved = resolve_image_link(DIGITALT_MUSEUM_SOURCE_URL, "")

        assert resolved.provider == "Digitalt museum"
        assert resolved.download_url == DIGITALT_MUSEUM_DOWNLOAD_URL
        assert resolved.thumbnail_url == DIGITALT_MUSEUM_THUMBNAIL_URL
        assert resolved.file_name == "DIA15081.jpg"
        assert resolved.media_type == "image/jpeg"
        assert resolved.license_url == DIGITALT_MUSEUM_LICENSE_URL
        assert resolved.license_name == "CC by-nc-nd"
        assert mocked_urlopen.called


class TestResolveImageDownloadView(TestCase):
    databases = {"default", "runes_db"}

    def setUp(self):
        self.signature = Signature.objects.using("runes_db").create(signature_text="Öl 26")
        self.meta = MetaInformation.objects.using("runes_db").create(signature=self.signature)
        self.image = ImageLink.objects.using("runes_db").create(
            meta=self.meta,
            link_url=RAA_SOURCE_URL,
            direct_url=RAA_THUMBNAIL_URL,
        )

    @patch("rundatanet.runes.image_resolvers.urlopen", return_value=FakeUrlopenResponse())
    def test_resolve_image_download_endpoint_returns_display_image(self, mocked_urlopen):
        url = reverse("runes:resolve_image_download", kwargs={"image_id": self.image.id})
        response = self.client.get(url)

        assert response.status_code == 200
        payload = response.json()
        assert payload["ok"] is True
        assert payload["image_id"] == self.image.id
        assert payload["image"]["provider"] == "RAÄ"
        assert payload["image"]["download_url"] == RAA_DISPLAY_URL
        assert payload["image"]["thumbnail_url"] == RAA_THUMBNAIL_URL
        assert mocked_urlopen.called

    @patch("rundatanet.runes.views.fetch_url_bytes", return_value=b"runer-image-bytes")
    def test_export_runer_image_zip(self, mocked_fetch):
        self.image.link_url = RUNER_SOURCE_URL
        self.image.direct_url = RUNER_IMAGE_URL
        self.image.save(using="runes_db")
        response = self.client.post(
            reverse("runes:export_raa_images_zip"),
            data=json.dumps({"inscriptions": [{"signature": "Öl 26", "image_ids": [self.image.id]}]}),
            content_type="application/json",
        )
        assert response.status_code == 200
        with zipfile.ZipFile(BytesIO(response.content)) as archive:
            assert archive.read("images/0001-ol-26.jpg") == b"runer-image-bytes"
            assert RUNER_IMAGE_URL in archive.read("metadata.csv").decode("utf-8")
            assert "Runer KU" in archive.read("README.txt").decode("utf-8")
        mocked_fetch.assert_called_once_with(RUNER_IMAGE_URL)

    @patch("rundatanet.runes.views.fetch_url_bytes", return_value=b"GIF89a-image-bytes")
    def test_export_arild_hauge_gif_zip(self, mocked_fetch):
        image_url = "https://www.arild-hauge.com/arild-hauge/tunesteina.gif"
        self.image.link_url = self.image.direct_url = image_url
        self.image.save(using="runes_db")
        response = self.client.post(
            reverse("runes:export_raa_images_zip"),
            data=json.dumps({"inscriptions": [{"signature": "Öl 26", "image_ids": [self.image.id]}]}),
            content_type="application/json",
        )
        assert response.status_code == 200
        with zipfile.ZipFile(BytesIO(response.content)) as archive:
            assert archive.read("images/0001-ol-26.gif") == b"GIF89a-image-bytes"
            metadata = archive.read("metadata.csv").decode("utf-8")
            assert "Arild Hauge" in metadata
            assert "image/gif" in metadata
        mocked_fetch.assert_called_once_with(image_url)

    @patch("rundatanet.runes.image_resolvers.urlopen", return_value=FakeUrlopenResponse())
    def test_export_raa_images_zip_returns_archive_with_metadata(self, mocked_urlopen):
        url = reverse("runes:export_raa_images_zip")
        response = self.client.post(
            url,
            data=json.dumps({
                "inscriptions": [
                    {
                        "signature": "Öl 26",
                        "image_ids": [self.image.id],
                    }
                ]
            }),
            content_type="application/json",
        )

        assert response.status_code == 200
        assert response["Content-Type"] == "application/zip"
        with zipfile.ZipFile(BytesIO(response.content)) as archive:
            names = archive.namelist()
            assert "metadata.csv" in names
            assert "skipped-images.csv" in names
            assert "README.txt" in names
            assert "images/0001-ol-26.jpeg" in names
            metadata = archive.read("metadata.csv").decode("utf-8")
            assert "CC-BY 4.0" in metadata
            assert RAA_DISPLAY_URL in metadata
        assert mocked_urlopen.call_count == 2
