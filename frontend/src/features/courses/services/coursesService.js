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
 * Create a new course using Backend API.
 * Returns a Promise resolved with the created Course JSON.
 */
export async function createCourse(courseData) {
  const baseUrl = (import.meta?.env?.VITE_API_URL) || "http://localhost:8000";
  const url = `${baseUrl}/api/courses`;

  const payload = {
    course_code: courseData.course_code,
    title: courseData.title,
    description: courseData.description,
    semester: courseData.semester,
    lecturer_id: courseData.lecturer_id,
    ta_ids: Array.isArray(courseData.ta_ids) ? courseData.ta_ids : [],
    syllabus_url: courseData.syllabus_url || "",
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let data = null;
  try {
    data = await response.json();
  } catch (_) {
    // ignore JSON parse error; will handle below
  }

  if (!response.ok) {
    const errBody = data || {};
    const msg = errBody.detail || "Failed to create course";
    throw new Error(msg);
  }

  // Save created course locally for potential future usage.
  inMemoryCourses.push(data);

  // Log the created course to the console.
  console.log("[coursesService] קורס נוצר:", data);

  return data;
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
