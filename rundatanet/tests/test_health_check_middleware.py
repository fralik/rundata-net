from django.http import HttpResponse
from django.test import RequestFactory, TestCase, override_settings

from rundatanet.runes.middleware import InternalHealthCheckMiddleware


def dummy_response(request):
    # If the middleware lets the request through, this would call
    # ``request.get_host()`` implicitly via other Django machinery and raise
    # ``DisallowedHost``. We return a sentinel so the tests can distinguish
    # the short-circuit path from pass-through.
    return HttpResponse("PASSED_THROUGH")


@override_settings(ALLOWED_HOSTS=["rundata.info"])
class TestInternalHealthCheckMiddleware(TestCase):
    def setUp(self):
        self.middleware = InternalHealthCheckMiddleware(dummy_response)
        self.factory = RequestFactory()

    def _request(self, host):
        # RequestFactory sets SERVER_NAME from HTTP_HOST; we bypass its
        # validation by building the request manually via ``get`` with an
        # explicit ``HTTP_HOST`` header.
        return self.factory.get("/", HTTP_HOST=host)

    def test_link_local_ipv4_short_circuits(self):
        response = self.middleware(self._request("169.254.130.2:8000"))
        assert response.status_code == 200
        assert response.content == b"OK"

    def test_link_local_ipv4_no_port(self):
        response = self.middleware(self._request("169.254.1.1"))
        assert response.status_code == 200

    def test_loopback_ipv4_short_circuits(self):
        response = self.middleware(self._request("127.0.0.1:8000"))
        assert response.status_code == 200

    def test_ipv6_loopback_short_circuits(self):
        response = self.middleware(self._request("[::1]:8000"))
        assert response.status_code == 200

    def test_ipv6_link_local_short_circuits(self):
        response = self.middleware(self._request("[fe80::1]"))
        assert response.status_code == 200

    def test_public_hostname_passes_through(self):
        response = self.middleware(self._request("rundata.info"))
        assert response.content == b"PASSED_THROUGH"

    def test_public_ipv4_passes_through(self):
        # A non-internal IP literal should NOT be treated as a probe.
        response = self.middleware(self._request("8.8.8.8"))
        assert response.content == b"PASSED_THROUGH"

    def test_missing_host_header_short_circuits(self):
        request = self.factory.get("/")
        request.META.pop("HTTP_HOST", None)
        response = self.middleware(request)
        assert response.status_code == 200
