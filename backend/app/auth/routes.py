from fastapi import APIRouter, HTTPException, status

from app.auth.schemas import RegisteredUser, RegistrationRequest
from app.auth.service import (
    EmailAlreadyRegisteredError,
    UserStoreError,
    register_user,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/register",
    response_model=RegisteredUser,
    status_code=status.HTTP_201_CREATED,
)
def register(registration: RegistrationRequest) -> RegisteredUser:
    try:
        return register_user(registration)
    except EmailAlreadyRegisteredError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        ) from error
    except UserStoreError as error:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="User registration is currently unavailable.",
        ) from error
