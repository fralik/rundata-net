from django.http import HttpResponse
from django.test import RequestFactory, TestCase, override_settings

from rundatanet.runes.middleware import InternalHealthCheckMiddleware


def dummy_response(request):
    # Sentinel that lets tests distinguish pass-through from short-circuit.
    return HttpResponse("PASSED_THROUGH")


@override_settings(ALLOWED_HOSTS=["rundata.info"])
class TestInternalHealthCheckMiddleware(TestCase):
    """Exercise the probe detector.

    The middleware is intentionally strict: a request is only short-circuited
    when *all* of the following hold:

    1. HTTP method is GET / HEAD / OPTIONS.
    2. ``REMOTE_ADDR`` is in an internal range (link-local / loopback).
       REMOTE_ADDR is set by the WSGI server from the TCP peer, so it cannot
       be spoofed by a public client reaching us through Azure's front-end.
    3. No ``X-Forwarded-For`` / ``X-Forwarded-Host`` headers are present.
    4. The ``Host`` header is either missing or an internal IP literal.
    """

    INTERNAL_PEER = "169.254.130.2"
    EXTERNAL_PEER = "168.63.129.16"  # example of a front-end / public peer

    def setUp(self):
        self.middleware = InternalHealthCheckMiddleware(dummy_response)
        self.factory = RequestFactory()

    def _request(self, host=None, remote_addr=INTERNAL_PEER, method="GET", **extra):
        kwargs = {"REMOTE_ADDR": remote_addr, **extra}
        if host is not None:
            kwargs["HTTP_HOST"] = host
        return getattr(self.factory, method.lower())("/", **kwargs)

    # --- Short-circuit (happy path) -------------------------------------

    def test_link_local_ipv4_probe_short_circuits(self):
        response = self.middleware(self._request(host="169.254.130.2:8000", remote_addr="169.254.130.2"))
        assert response.status_code == 200
        assert response.content == b"OK"

    def test_loopback_probe_short_circuits(self):
        response = self.middleware(self._request(host="127.0.0.1:8000", remote_addr="127.0.0.1"))
        assert response.status_code == 200
        assert response.content == b"OK"

    def test_ipv6_loopback_short_circuits(self):
        response = self.middleware(self._request(host="[::1]:8000", remote_addr="::1"))
        assert response.status_code == 200
        assert response.content == b"OK"

    def test_missing_host_from_internal_peer_short_circuits(self):
        request = self._request(host=None, remote_addr="169.254.130.2")
        request.META.pop("HTTP_HOST", None)
        response = self.middleware(request)
        assert response.status_code == 200
        assert response.content == b"OK"

    def test_head_method_short_circuits(self):
        response = self.middleware(self._request(host="169.254.1.1", remote_addr="169.254.1.1", method="HEAD"))
        assert response.status_code == 200
        assert response.content == b"OK"

    # --- Fail-closed paths ----------------------------------------------

    def test_spoofed_host_from_external_peer_passes_through(self):
        """Public client sending ``Host: 127.0.0.1`` must NOT be short-circuited."""
        response = self.middleware(self._request(host="127.0.0.1", remote_addr=self.EXTERNAL_PEER))
        assert response.content == b"PASSED_THROUGH"

    def test_spoofed_link_local_host_from_external_peer_passes_through(self):
        response = self.middleware(self._request(host="169.254.130.2:8000", remote_addr="8.8.8.8"))
        assert response.content == b"PASSED_THROUGH"

    def test_forwarded_request_passes_through_even_from_internal_peer(self):
        """Traffic carrying X-Forwarded-* is real user traffic via the front-end."""
        response = self.middleware(
            self._request(
                host="169.254.130.2",
                remote_addr="169.254.130.2",
                HTTP_X_FORWARDED_FOR="203.0.113.7",
                HTTP_X_FORWARDED_HOST="rundata.info",
            )
        )
        assert response.content == b"PASSED_THROUGH"

    def test_post_from_internal_peer_passes_through(self):
        """Only safe methods are recognised as probes."""
        response = self.middleware(self._request(host="169.254.130.2", remote_addr="169.254.130.2", method="POST"))
        assert response.content == b"PASSED_THROUGH"

    def test_public_hostname_passes_through(self):
        response = self.middleware(self._request(host="rundata.info", remote_addr=self.EXTERNAL_PEER))
        assert response.content == b"PASSED_THROUGH"

    def test_public_ip_host_passes_through(self):
        response = self.middleware(self._request(host="8.8.8.8", remote_addr=self.EXTERNAL_PEER))
        assert response.content == b"PASSED_THROUGH"

    def test_internal_peer_with_canonical_host_passes_through(self):
        """Edge case: internal peer but with a real hostname → let normal
        routing handle it so the response comes from the actual app."""
        response = self.middleware(self._request(host="rundata.info", remote_addr="169.254.130.2"))
        assert response.content == b"PASSED_THROUGH"

    def test_missing_remote_addr_passes_through(self):
        request = self._request(host="127.0.0.1", remote_addr="")
        response = self.middleware(request)
        assert response.content == b"PASSED_THROUGH"
