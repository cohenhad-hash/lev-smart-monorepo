from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field


class RegistrationRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    fullName: str = Field(min_length=1, max_length=120, pattern=r".*\S.*")


class RegisteredUser(BaseModel):
    id: str
    email: EmailStr
    fullName: str
    role: Literal["user", "student", "lecturer", "admin"]
    isLocked: bool
    twoFactorEnabled: bool
    createdAt: datetime
