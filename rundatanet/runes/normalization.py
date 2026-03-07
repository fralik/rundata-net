"""
Normalization utilities for inscription signature slugs.

Transforms signature_text values (e.g. "Öl 1", "Ög F7;54") into
URL-safe slugs (e.g. "ol-1", "og-f7-54").

Normalization scheme:
  1. Unicode NFD decomposition
  2. Strip combining marks (\\u0300-\\u036f)
  3. Lowercase
  4. Replace any non-alphanumeric character (except '-') with '-'
  5. Collapse consecutive hyphens
  6. Strip leading/trailing hyphens
"""

import logging
import re
import threading
import unicodedata
from typing import Optional

logger = logging.getLogger(__name__)


def normalize_signature(text: str) -> str:
    """Convert a signature_text into a URL-safe slug.

    Examples:
        >>> normalize_signature("Öl 1")
        'ol-1'
        >>> normalize_signature("Ög F7;54")
        'og-f7-54'
        >>> normalize_signature("Öl SHM1304:1836:64")
        'ol-shm1304-1836-64'
        >>> normalize_signature("Bo Peterson1992")
        'bo-peterson1992'
        >>> normalize_signature("X SvIK365,1,7")
        'x-svik365-1-7'
    """
    # 1. NFD decomposition
    nfd = unicodedata.normalize("NFD", text)
    # 2. Strip combining marks
    stripped = re.sub(r"[\u0300-\u036f]", "", nfd)
    # 3. Lowercase
    lowered = stripped.lower()
    # 4. Replace non-alphanumeric (except '-') with '-'
    replaced = re.sub(r"[^a-z0-9-]", "-", lowered)
    # 5. Collapse consecutive hyphens
    collapsed = re.sub(r"-{2,}", "-", replaced)
    # 6. Strip leading/trailing hyphens
    return collapsed.strip("-")


class SlugIndex:
    """Lazy, thread-safe in-memory index mapping normalized slugs to Signature IDs.

    The index is built on first access and cached. It auto-invalidates when
    Signature objects are created, updated, or deleted (via Django signals
    wired in RunesConfig.ready()). For bulk operations, call
    ``SlugIndex.invalidate()`` once after the batch completes.

    The index maps each slug to a tuple (signature_id, parent_id_or_none).
    For alias signatures, parent_id is set so we can resolve to the canonical.
    """

    _instance = None
    _lock = threading.Lock()

    def __init__(self):
        # slug -> (signature_id, parent_id or None)
        self._slug_to_info: dict[str, tuple[int, Optional[int]]] = {}
        # signature_id -> slug (for canonical lookups)
        self._id_to_slug: dict[int, str] = {}
        self._built = False

    @classmethod
    def get(cls) -> "SlugIndex":
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = cls()
        return cls._instance

    @classmethod
    def reset(cls):
        """Reset the cached index (useful for testing)."""
        with cls._lock:
            cls._instance = None

    @classmethod
    def invalidate(cls):
        """Mark the index as stale so it rebuilds on next access.

        Cheaper than reset() — reuses the singleton but clears its data.
        Safe to call from signal handlers.
        """
        with cls._lock:
            if cls._instance is not None:
                cls._instance._slug_to_info.clear()
                cls._instance._id_to_slug.clear()
                cls._instance._built = False

    def _build(self):
        """Build the slug index from the database."""
        from .models import Signature

        signatures = Signature.objects.all().values_list("id", "signature_text", "parent_id")
        collisions: dict[str, list[str]] = {}

        for sig_id, sig_text, parent_id in signatures:
            slug = normalize_signature(sig_text)
            if slug in self._slug_to_info:
                # Track collision but don't overwrite — first one wins
                existing_text = sig_text
                if slug not in collisions:
                    # Find the original text that claimed this slug
                    existing_id = self._slug_to_info[slug][0]
                    orig = Signature.objects.get(id=existing_id).signature_text
                    collisions[slug] = [orig]
                collisions[slug].append(sig_text)
            else:
                self._slug_to_info[slug] = (sig_id, parent_id)
                self._id_to_slug[sig_id] = slug

        if collisions:
            for slug, texts in collisions.items():
                logger.warning("Slug collision for '%s': %s", slug, texts)

        self._built = True

    def _ensure_built(self):
        if not self._built:
            with self._lock:
                if not self._built:
                    self._build()

    def resolve(self, input_slug: str) -> Optional[tuple[int, str]]:
        """Resolve a slug to (canonical_signature_id, canonical_slug).

        If the slug matches an alias, follows the parent chain.
        Returns None if the slug is not found.
        """
        self._ensure_built()

        slug = normalize_signature(input_slug)
        info = self._slug_to_info.get(slug)
        if info is None:
            return None

        sig_id, parent_id = info
        # Follow parent chain for aliases
        if parent_id is not None:
            canonical_slug = self._id_to_slug.get(parent_id)
            if canonical_slug:
                return (parent_id, canonical_slug)
            # Fallback: parent exists but wasn't indexed (shouldn't happen)
            return (parent_id, slug)

        return (sig_id, slug)

    def is_alias(self, input_slug: str) -> bool:
        """Return True if the slug corresponds to an alias (child) signature."""
        self._ensure_built()
        slug = normalize_signature(input_slug)
        info = self._slug_to_info.get(slug)
        if info is None:
            return False
        return info[1] is not None

    def get_canonical_slug(self, signature_id: int) -> Optional[str]:
        """Return the canonical slug for a signature ID."""
        self._ensure_built()
        return self._id_to_slug.get(signature_id)
