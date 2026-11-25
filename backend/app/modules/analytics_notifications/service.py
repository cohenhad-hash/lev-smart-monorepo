from typing import Any, Callable, Dict, Optional

from .cache import analytics_cache


class AnalyticsNotificationsCacheService:
    """Basic cache operations for analytics and notification data."""

    def get(self, key: str) -> Optional[Any]:
        return analytics_cache.get(key)

    def set(self, key: str, value: Any, ttl_seconds: Optional[int] = None) -> None:
        analytics_cache.set(key, value, ttl_seconds=ttl_seconds)

    def delete(self, key: str) -> None:
        analytics_cache.delete(key)

    def clear(self) -> None:
        analytics_cache.clear()

    def get_or_set(self, key: str, factory: Callable[[], Any]) -> Any:
        cached_value = analytics_cache.get(key)
        if cached_value is not None:
            return cached_value

        value = factory()
        analytics_cache.set(key, value)
        return value

    def health_status(self) -> Dict[str, Any]:
        return analytics_cache.status()


analytics_notifications_cache_service = AnalyticsNotificationsCacheService()
