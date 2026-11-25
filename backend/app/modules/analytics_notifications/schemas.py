from pydantic import BaseModel


class CacheHealthStatus(BaseModel):
    status: str
    cache_provider: str
    cache_enabled: bool
    entry_count: int
    expired_entries_removed: int
    ttl_seconds: int
    max_entries: int


class CacheItem(BaseModel):
    key: str
    value: object
