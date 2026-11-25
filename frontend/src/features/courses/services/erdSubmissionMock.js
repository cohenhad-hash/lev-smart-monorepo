// Mock Assignment (aligned with SQL & JSON mocks)
export const assignmentMock = {
  id: "mock-assignment-1",
  course_id: "mock-course-1",
  title: "תרגיל בית 1 - תכנון מסד נתונים",
  instructions: "יש להגיש קובץ ERD בפורמט PDF או PNG...",
  rubric_url: "https://supabase-storage-url/rubric.pdf",
  due_date: "2026-12-05T23:59:00Z",
  max_score: 100,
  allowed_file_types: [".pdf", ".png", ".zip"],
  created_at: "2026-11-25T11:00:00Z",
};

// Helper: create a UUID-like string without new deps
function generateId() {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch { /* no-op */ }
  return "mock-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// Local in-memory submissions store (optional future use)
const inMemorySubmissions = [];

/**
 * Local mock submit function. Returns a resolved Promise with Submission JSON.
 * No real network calls. Also logs the created submission to the console.
 *
 * @param {Object} payload
 * @param {File} payload.file
 * @param {string} payload.student_notes
 * @param {string} payload.assignment_id
 * @param {string} payload.course_id
 * @param {string} [payload.student_id="mock-student-1"]
 */
export function submitErd({ file, student_notes, assignment_id, course_id, student_id = "mock-student-1" }) {
  const id = generateId();
  const submitted_at = new Date().toISOString();
  const file_url = `https://supabase-storage-url/${encodeURIComponent(file?.name || "student_erd.pdf")}`;

  const submission = {
    id,
    assignment_id: assignment_id || assignmentMock.id,
    course_id: course_id || assignmentMock.course_id,
    student_id,
    file_url,
    student_notes: student_notes || "",
    submitted_at,
    status: "submitted",
    grade: null,
    ai_feedback_id: null,
  };

  // Save locally and log
  inMemorySubmissions.push(submission);
  console.log("[ERD Submission] נוצרה הגשה (Mock):", submission);

  // Simulate small delay
  return new Promise((resolve) => setTimeout(() => resolve(submission), 500));
}
