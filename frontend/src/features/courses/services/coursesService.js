import { lecturers, tas, semesters } from "./mockData.js";

// In-memory store to simulate created courses locally during the session.
const inMemoryCourses = [];

// Utility to generate a UUID without external dependencies.
function generateId() {
  try {
    // Modern browsers
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch (_) { /* no-op */ }
  // Fallback
  return "mock-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * Create a new course using local mock integration.
 * Returns a Promise resolved with the created Course JSON.
 *
 * Schema:
 * {
 *   "id": "uuid-string",
 *   "course_code": "CS101",
 *   "title": "מבוא להנדסת תוכנה",
 *   "description": "תיאור הקורס והדרישות",
 *   "semester": "תשפ\"ז א'",
 *   "lecturer_id": "mock-lecturer-1",
 *   "ta_ids": ["mock-ta-1"],
 *   "syllabus_url": "https://supabase-storage-url/syllabus.pdf",
 *   "created_at": "2026-11-25T10:00:00Z"
 * }
 */
export function createCourse(courseData) {
  return new Promise((resolve) => {
    const id = generateId();
    const created_at = new Date().toISOString();

    const course = {
      id,
      course_code: courseData.course_code,
      title: courseData.title,
      description: courseData.description,
      semester: courseData.semester,
      lecturer_id: courseData.lecturer_id,
      ta_ids: Array.isArray(courseData.ta_ids) ? courseData.ta_ids : [],
      syllabus_url: courseData.syllabus_url || "",
      created_at,
    };

    // Save to in-memory list for potential future usage.
    inMemoryCourses.push(course);

    // Log the created course to the console (as requested).
    // This mimics a successful backend creation while staying fully local.
    console.log("[coursesService] קורס נוצר (Mock):", course);

    // Simulate a short network delay for better UX feedback.
    setTimeout(() => resolve(course), 500);
  });
}

// Optional helpers if needed later (kept simple and local).
export function getCourses() {
  return Promise.resolve([...inMemoryCourses]);
}

export function getCourseById(courseId) {
  return Promise.resolve(inMemoryCourses.find((c) => c.id === courseId) || null);
}

export function getLecturers() {
  return Promise.resolve(lecturers);
}

export function getTAs() {
  return Promise.resolve(tas);
}

export function getSemesters() {
  return Promise.resolve(semesters);
}
