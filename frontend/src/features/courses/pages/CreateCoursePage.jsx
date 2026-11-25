import { useState } from "react";
import { Link } from "react-router-dom";
import CourseForm from "../components/CourseForm.jsx";
import { createCourse } from "../services/coursesService.js";

export default function CreateCoursePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdCourse, setCreatedCourse] = useState(null);

  async function handleSubmit(formData) {
    setError("");
    setIsLoading(true);
    try {
      const course = await createCourse(formData);
      setCreatedCourse(course);
    } catch (err) {
      setError(err?.message || "לא הצלחנו ליצור את הקורס. נסו שוב.");
    } finally {
      setIsLoading(false);
    }
  }

  function resetForm() {
    setCreatedCourse(null);
    setError("");
  }

  return (
    <div className="page create-course-page">
      <div className="create-course-heading">
        <div>
          <Link to="/" className="back-link">← חזרה לדף הבית</Link>
          <span className="eyebrow">LEV SMART · קורסים</span>
          <h1>יצירת קורס חדש</h1>
          <p>מלאו את הפרטים ליצירת קורס חדש במערכת.</p>
        </div>
      </div>

      <section className="form-panel" aria-label="טופס יצירת קורס">
        {!createdCourse ? (
          <>
            <CourseForm onSubmit={handleSubmit} isLoading={isLoading} />
            {error && <div className="error-banner" role="alert">{error}</div>}
          </>
        ) : (
          <div className="success-panel" role="status" aria-live="polite">
            <strong>הקורס נוצר בהצלחה!</strong>
            <div className="json-preview" style={{ marginTop: 8 }}>
              <pre>{JSON.stringify(createdCourse, null, 2)}</pre>
            </div>
            <div className="success-actions">
              <button className="primary-button" onClick={resetForm}>יצירת קורס נוסף</button>
              <Link to="/" className="text-link">חזרה לדף הבית ←</Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
