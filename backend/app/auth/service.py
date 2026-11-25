import os
import uuid
from datetime import datetime, timezone
from functools import lru_cache

from postgrest.exceptions import APIError
from pwdlib import PasswordHash
from supabase import Client, create_client

from app.auth.schemas import RegistrationRequest

password_hash = PasswordHash.recommended()


class EmailAlreadyRegisteredError(Exception):
    pass


class UserStoreError(Exception):
    pass


@lru_cache(maxsize=1)
def _create_supabase_client(url: str, anon_key: str) -> Client:
    return create_client(url, anon_key)


def _get_supabase_client() -> Client:
    url = os.getenv("SUPABASE_URL")
    anon_key = os.getenv("SUPABASE_ANON_KEY")
    if not url or not anon_key:
        raise UserStoreError("Supabase configuration is missing.")
    return _create_supabase_client(url, anon_key)


def register_user(registration: RegistrationRequest) -> dict:
    user = {
        "id": str(uuid.uuid4()),
        "email": str(registration.email).lower(),
        "passwordHash": password_hash.hash(registration.password),
        "fullName": registration.fullName.strip(),
        "role": "user",
        "isLocked": False,
        "twoFactorEnabled": False,
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }

    try:
        _get_supabase_client().table("users").insert(user).execute()
    except APIError as error:
        if error.code == "23505":
            raise EmailAlreadyRegisteredError from error
        raise UserStoreError("Supabase could not create the user.") from error

    return {key: value for key, value in user.items() if key != "passwordHash"}
