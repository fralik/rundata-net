import ipaddress

from django.conf import settings
from django.http import HttpResponse, HttpResponsePermanentRedirect
from django.http.request import split_domain_port


class InternalHealthCheckMiddleware:
    """Short-circuit requests from Azure App Service internal probes.

    Azure's front-ends / platform health probes reach the container on a
    link-local address (``169.254.0.0/16``) that rotates periodically. Such
    requests arrive with ``Host: <ip>:<port>`` headers that are not — and
    should not be — listed in ``ALLOWED_HOSTS``. If we let Django's
    ``request.get_host()`` run first, it raises ``DisallowedHost`` and the
    probe is logged as an error.

    This middleware inspects the raw ``HTTP_HOST`` header (without calling
    ``get_host()``, which validates against ``ALLOWED_HOSTS``) and answers
    internal probes with a lightweight ``200 OK`` before any downstream
    middleware, including :class:`CanonicalDomainMiddleware`, runs.

    Hosts treated as "internal":

    * ``169.254.0.0/16`` — IPv4 link-local (Azure platform probes)
    * ``127.0.0.0/8``    — loopback
    * ``::1`` / ``fe80::/10`` — IPv6 loopback / link-local
    * Missing or empty ``Host`` header
    """

    _INTERNAL_NETWORKS = (
        ipaddress.ip_network("169.254.0.0/16"),
        ipaddress.ip_network("127.0.0.0/8"),
        ipaddress.ip_network("::1/128"),
        ipaddress.ip_network("fe80::/10"),
    )

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if self._is_internal_probe(request):
            return HttpResponse("OK", content_type="text/plain")
        return self.get_response(request)

    @classmethod
    def _is_internal_probe(cls, request):
        raw_host = request.headers.get("host", "")
        if not raw_host:
            # Some probes (and HTTP/1.0 clients) omit Host entirely.
            return True

        # Strip optional port. ``split_domain_port`` handles IPv6 in brackets.
        domain, _ = split_domain_port(raw_host)
        if not domain:
            return False

        # Unwrap bracketed IPv6 literals: "[::1]" -> "::1"
        if domain.startswith("[") and domain.endswith("]"):
            domain = domain[1:-1]

        try:
            ip = ipaddress.ip_address(domain)
        except ValueError:
            # Not an IP literal — a real hostname. Let normal routing handle it.
            return False

        return any(ip in net for net in cls._INTERNAL_NETWORKS)


class CanonicalDomainMiddleware:
    """301-redirect requests from non-canonical hostnames to CANONICAL_DOMAIN.

    Intended for production use where ``CANONICAL_DOMAIN`` is set.  Any
    incoming hostname that differs from ``CANONICAL_DOMAIN`` is permanently
    redirected, preventing duplicate-content issues in search engines.
    """

    def __init__(self, get_response):
        self.get_response = get_response
        self.canonical_domain = getattr(settings, "CANONICAL_DOMAIN", None)
        self._canonical_domain_lower = self.canonical_domain.lower() if isinstance(self.canonical_domain, str) else None

    def __call__(self, request):
        if self._canonical_domain_lower:
            # Use Django's host parsing to respect USE_X_FORWARDED_HOST and ALLOWED_HOSTS
            host = request.get_host()
            domain, _ = split_domain_port(host)
            if domain and domain.lower() != self._canonical_domain_lower:
                url = f"https://{self.canonical_domain}{request.get_full_path()}"
                # Use 301 for safe methods (GET/HEAD), and 308 for others to preserve method and body.
                if request.method in ("GET", "HEAD"):
                    return HttpResponsePermanentRedirect(url)
                response = HttpResponsePermanentRedirect(url)
                response.status_code = 308
                return response

        return self.get_response(request)
