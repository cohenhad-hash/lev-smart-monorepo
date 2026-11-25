from fastapi import APIRouter

from .schemas import CacheHealthStatus
from .service import analytics_notifications_cache_service


router = APIRouter(
    prefix="/api/analytics-notifications",
    tags=["Analytics & Notifications"],
)


@router.get("/health", response_model=CacheHealthStatus)
def health_check() -> CacheHealthStatus:
    status = analytics_notifications_cache_service.health_status()
    return CacheHealthStatus(
        status=status["status"],
        cache_provider=status["cache_provider"],
        cache_enabled=status["cache_enabled"],
        entry_count=status["entry_count"],
        expired_entries_removed=status["expired_entries_removed"],
        ttl_seconds=status["ttl_seconds"],
        max_entries=status["max_entries"],
    )
