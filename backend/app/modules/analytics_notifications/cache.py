import os
import threading
import time
from dataclasses import dataclass
from typing import Any, Dict, Optional


def _get_int_setting(name: str, default: int, minimum: int) -> int:
    raw_value = os.getenv(name)
    if raw_value is None:
        return default

    try:
        value = int(raw_value)
    except (TypeError, ValueError):
        return default

    return value if value >= minimum else default


def _get_bool_setting(name: str, default: bool) -> bool:
    raw_value = os.getenv(name)
    if raw_value is None:
        return default

    normalized = raw_value.strip().lower()
    if normalized in {"1", "true", "yes", "on"}:
        return True
    if normalized in {"0", "false", "no", "off"}:
        return False
    return default


@dataclass
class _CacheEntry:
    value: Any
    expires_at: float


class InMemoryTTLCache:
    """A thread-safe in-memory cache with TTL expiration and bounded size."""

    PROVIDER = "in_memory"

    def __init__(
        self,
        ttl_seconds: Optional[int] = None,
        max_entries: Optional[int] = None,
        enabled: Optional[bool] = None,
    ) -> None:
        self.enabled = (
            _get_bool_setting("ANALYTICS_CACHE_ENABLED", True)
            if enabled is None
            else enabled
        )
        self.ttl_seconds = (
            _get_int_setting("ANALYTICS_CACHE_TTL_SECONDS", 300, 1)
            if ttl_seconds is None
            else max(ttl_seconds, 1)
        )
        self.max_entries = (
            _get_int_setting("ANALYTICS_CACHE_MAX_ENTRIES", 500, 1)
            if max_entries is None
            else max(max_entries, 1)
        )
        self._entries: Dict[str, _CacheEntry] = {}
        self._lock = threading.RLock()
        self._expired_entries_removed = 0

    def get(self, key: str) -> Optional[Any]:
        if not self.enabled:
            return None

        now = time.monotonic()
        with self._lock:
            entry = self._entries.get(key)
            if entry is None:
                return None
            if entry.expires_at <= now:
                del self._entries[key]
                self._expired_entries_removed += 1
                return None
            return entry.value

    def set(self, key: str, value: Any, ttl_seconds: Optional[int] = None) -> None:
        if not self.enabled:
            return

        effective_ttl = max(ttl_seconds, 1) if ttl_seconds is not None else self.ttl_seconds
        expires_at = time.monotonic() + effective_ttl

        with self._lock:
            self._remove_expired(time.monotonic())

            if key not in self._entries and len(self._entries) >= self.max_entries:
                oldest_key = min(
                    self._entries,
                    key=lambda entry_key: self._entries[entry_key].expires_at,
                )
                del self._entries[oldest_key]

            self._entries[key] = _CacheEntry(value=value, expires_at=expires_at)

    def delete(self, key: str) -> None:
        with self._lock:
            self._entries.pop(key, None)

    def clear(self) -> None:
        with self._lock:
            self._entries.clear()

    def _remove_expired(self, now: float) -> int:
        expired_keys = [
            key
            for key, entry in self._entries.items()
            if entry.expires_at <= now
        ]
        for key in expired_keys:
            del self._entries[key]

        if expired_keys:
            self._expired_entries_removed += len(expired_keys)
        return len(expired_keys)

    def status(self) -> Dict[str, Any]:
        with self._lock:
            removed = self._remove_expired(time.monotonic())
            return {
                "status": "ok" if self.enabled else "disabled",
                "cache_provider": self.PROVIDER,
                "cache_enabled": self.enabled,
                "entry_count": len(self._entries),
                "expired_entries_removed": self._expired_entries_removed,
                "ttl_seconds": self.ttl_seconds,
                "max_entries": self.max_entries,
                "purged_on_status_check": removed,
            }


analytics_cache = InMemoryTTLCache()


def get_cache_status() -> Dict[str, Any]:
    return analytics_cache.status()
