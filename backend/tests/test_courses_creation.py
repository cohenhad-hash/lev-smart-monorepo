import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.modules.courses import service

client = TestClient(app)


@pytest.fixture(autouse=True)
def clean_store():
    # Reset before and after each test to keep isolation
    service.reset_store()
    yield
    service.reset_store()


def test_create_course_success():
    payload = {
        "course_code": "CS101",
        "title": "מבוא להנדסת תוכנה",
        "description": "תיאור הקורס והדרישות",
        "semester": "תשפ\"ז א'",
        "lecturer_id": "mock-lecturer-1",
        "ta_ids": ["mock-ta-1", "mock-ta-2", "mock-ta-1"],  # includes duplicate
        "syllabus_url": "https://example.com/syllabus.pdf",
    }
    resp = client.post("/api/courses", json=payload)
    assert resp.status_code == 201
    data = resp.json()
    assert isinstance(data["id"], str) and len(data["id"]) > 0
    assert isinstance(data["created_at"], str) and len(data["created_at"]) > 0
    assert data["course_code"] == payload["course_code"]
    assert data["title"] == payload["title"]
    assert data["semester"] == payload["semester"]
    assert data["lecturer_id"] == payload["lecturer_id"]
    # TA IDs should be deduplicated while preserving order
    assert data["ta_ids"] == ["mock-ta-1", "mock-ta-2"]


def test_validation_error_blank_and_missing():
    # Missing required field: title
    resp_missing = client.post(
        "/api/courses",
        json={
            "course_code": "CS102",
            "description": "תיאור",
            "semester": "אביב 2026",
            "lecturer_id": "mock-lecturer-2",
        },
    )
    assert resp_missing.status_code == 422

    # Blank values for required fields
    resp_blank = client.post(
        "/api/courses",
        json={
            "course_code": "   ",
            "title": "   ",
            "description": "   ",
            "semester": "",
            "lecturer_id": "",
        },
    )
    assert resp_blank.status_code == 422


def test_duplicate_conflict_same_code_and_semester():
    base = {
        "course_code": "CS103",
        "title": "קורס בדיקות",
        "description": "תיאור",
        "semester": "אביב 2026",
        "lecturer_id": "mock-lecturer-1",
        "ta_ids": [],
    }
    r1 = client.post("/api/courses", json=base)
    assert r1.status_code == 201

    dup = dict(base)
    dup["course_code"] = "cs103"  # lower-case should still be considered duplicate
    r2 = client.post("/api/courses", json=dup)
    assert r2.status_code == 409
