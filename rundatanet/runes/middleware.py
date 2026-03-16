from django.conf import settings
from django.http import HttpResponsePermanentRedirect
from django.http.request import split_domain_port


class CanonicalDomainMiddleware:
    """301-redirect known non-canonical hostnames to CANONICAL_DOMAIN.

    Only the following host patterns are redirected:
    - ``www.<CANONICAL_DOMAIN>`` – the www subdomain
    - ``*.azurewebsites.net`` – Azure deployment hostnames

    All other hosts (e.g. localhost, 127.0.0.1, staging or custom domains
    listed in ALLOWED_HOSTS) are passed through unchanged, so this middleware
    is safe to use in both local development and production.
    """

    # Host suffixes that should always be redirected to the canonical domain.
    REDIRECT_SUFFIXES = (".azurewebsites.net",)

    def __init__(self, get_response):
        self.get_response = get_response
        self.canonical_domain = getattr(settings, "CANONICAL_DOMAIN", None)

    def _should_redirect(self, domain):
        """Return True if *domain* is a known non-canonical host that must be redirected."""
        if domain == f"www.{self.canonical_domain}":
            return True
        return any(domain.endswith(suffix) for suffix in self.REDIRECT_SUFFIXES)

    def __call__(self, request):
        if self.canonical_domain:
            # Use Django's host parsing to respect USE_X_FORWARDED_HOST and ALLOWED_HOSTS
            host = request.get_host()
            domain, _ = split_domain_port(host)
            if domain and domain != self.canonical_domain and self._should_redirect(domain):
                url = f"https://{self.canonical_domain}{request.get_full_path()}"
                return HttpResponsePermanentRedirect(url)

        return self.get_response(request)
