from django.test import RequestFactory, TestCase, override_settings

from rundatanet.runes.middleware import CanonicalDomainMiddleware


def dummy_response(request):
    from django.http import HttpResponse

    return HttpResponse("OK")


@override_settings(
    CANONICAL_DOMAIN="rundata.info",
    ALLOWED_HOSTS=["rundata.info", "www.rundata.info", "rundatanet.azurewebsites.net"],
)
class TestCanonicalDomainMiddleware(TestCase):
    def setUp(self):
        self.middleware = CanonicalDomainMiddleware(dummy_response)
        self.factory = RequestFactory()

    def test_canonical_host_passes_through(self):
        request = self.factory.get("/", HTTP_HOST="rundata.info")
        response = self.middleware(request)
        assert response.status_code == 200

    def test_www_redirects_to_canonical(self):
        request = self.factory.get("/about/", HTTP_HOST="www.rundata.info")
        response = self.middleware(request)
        assert response.status_code == 301
        assert response["Location"] == "https://rundata.info/about/"

    def test_azure_hostname_redirects_to_canonical(self):
        request = self.factory.get("/", HTTP_HOST="rundatanet.azurewebsites.net")
        response = self.middleware(request)
        assert response.status_code == 301
        assert response["Location"] == "https://rundata.info/"

    def test_preserves_query_string(self):
        request = self.factory.get("/inscription/ol-1/?ref=search", HTTP_HOST="www.rundata.info")
        response = self.middleware(request)
        assert response.status_code == 301
        assert response["Location"] == "https://rundata.info/inscription/ol-1/?ref=search"

    def test_host_with_port_redirects(self):
        request = self.factory.get("/", HTTP_HOST="www.rundata.info:443")
        response = self.middleware(request)
        assert response.status_code == 301
        assert response["Location"] == "https://rundata.info/"

    @override_settings(CANONICAL_DOMAIN=None)
    def test_no_canonical_domain_passes_through(self):
        middleware = CanonicalDomainMiddleware(dummy_response)
        request = self.factory.get("/", HTTP_HOST="www.rundata.info")
        response = middleware(request)
        assert response.status_code == 200
