from django.conf import settings
from django.http import HttpResponsePermanentRedirect
from django.http.request import split_domain_port


class CanonicalDomainMiddleware:
    """301-redirect requests from non-canonical hostnames to CANONICAL_DOMAIN.

    Ensures that www.rundata.info and *.azurewebsites.net are redirected
    to the canonical domain, preventing duplicate-content issues in search
    engines.
    """

    def __init__(self, get_response):
        self.get_response = get_response
        self.canonical_domain = getattr(settings, "CANONICAL_DOMAIN", None)

    def __call__(self, request):
        if self.canonical_domain:
            # Use Django's host parsing to respect USE_X_FORWARDED_HOST and ALLOWED_HOSTS
            host = request.get_host()
            domain, _ = split_domain_port(host)
            if domain and domain != self.canonical_domain:
                url = f"https://{self.canonical_domain}{request.get_full_path()}"
                return HttpResponsePermanentRedirect(url)

        return self.get_response(request)
