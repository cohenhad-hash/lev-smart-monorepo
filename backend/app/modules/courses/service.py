from datetime import datetime, timezone
from typing import Dict, List
from uuid import uuid4

from fastapi import HTTPException, status

from .schemas import CourseCreateRequest, CourseResponse

# In-memory "database" structures
_courses_db: List[Dict] = []
_enrollments_db: List[Dict] = []  # stores {"course_id", "user_id", "role", "enrolled_at"}


def reset_store() -> None:
    """Clear the in-memory stores (for tests)."""
    _courses_db.clear()
    _enrollments_db.clear()


def _dedupe_preserve_order(items: List[str]) -> List[str]:
    seen = set()
    result: List[str] = []
    for x in items or []:
        if x not in seen:
            seen.add(x)
            result.append(x)
    return result


def create_course(payload: CourseCreateRequest) -> CourseResponse:
    # Check duplicates: same (course_code, semester), case-insensitive for course_code
    for c in _courses_db:
        if c["course_code"].lower() == payload.course_code.lower() and c["semester"] == payload.semester:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Course with this code already exists for this semester",
            )

    course_id = str(uuid4())
    created_at = datetime.now(timezone.utc)

    ta_ids = _dedupe_preserve_order(payload.ta_ids)

    course_record = {
        "id": course_id,
        "course_code": payload.course_code,
        "title": payload.title,
        "description": payload.description,
        "semester": payload.semester,
        "lecturer_id": payload.lecturer_id,
        "ta_ids": ta_ids,
        "syllabus_url": payload.syllabus_url or "",
        "created_at": created_at,
    }

    _courses_db.append(course_record)

    # Record each TA enrollment
    for ta in ta_ids:
        _enrollments_db.append(
            {
                "course_id": course_id,
                "user_id": ta,
                "role": "ta",
                "enrolled_at": created_at,
            }
        )

    return CourseResponse(**course_record)


def list_courses() -> List[CourseResponse]:
    return [CourseResponse(**c) for c in _courses_db]
