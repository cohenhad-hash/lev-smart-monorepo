from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field, field_validator


class CourseCreateRequest(BaseModel):
    course_code: str = Field(..., min_length=1, max_length=20)
    title: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1, max_length=2000)
    semester: str = Field(..., min_length=1, max_length=50)
    lecturer_id: str = Field(..., min_length=1)
    ta_ids: List[str] = Field(default_factory=list)
    syllabus_url: Optional[str] = ""

    @field_validator("course_code", "title", "description", "semester", "lecturer_id", mode="before")
    @classmethod
    def not_blank(cls, v: str):
        if isinstance(v, str):
            s = v.strip()
            if s == "":
                raise ValueError("must not be blank")
            return s
        raise ValueError("must be a string")


class CourseResponse(BaseModel):
    id: str
    course_code: str
    title: str
    description: str
    semester: str
    lecturer_id: str
    ta_ids: List[str] = []
    syllabus_url: Optional[str] = ""
    created_at: datetime
