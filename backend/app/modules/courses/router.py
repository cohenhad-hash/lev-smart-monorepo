from typing import List

from fastapi import APIRouter, status

from .schemas import CourseCreateRequest, CourseResponse
from . import service

router = APIRouter(prefix="/api/courses", tags=["Courses"])


@router.post("", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
def create_course(payload: CourseCreateRequest):
    return service.create_course(payload)


@router.get("", response_model=List[CourseResponse])
def list_courses():
    return service.list_courses()
