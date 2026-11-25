import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ErdUpload from "../components/ErdUpload.jsx";
import { assignmentMock, submitErd } from "../services/erdSubmissionMock.js";
import "../components/ErdUpload.css";

export default function SubmitErdPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const dueText = useMemo(() => {
    try {
      return new Date(assignmentMock.due_date).toLocaleString("he-IL");
    } catch {
      return assignmentMock.due_date;
    }
  }, []);

  async function handleSubmit({ file, student_notes }) {
    setError("");
    setIsSubmitting(true);
    try {
      const submission = await submitErd({
        file,
        student_notes,
        assignment_id: assignmentMock.id,
        course_id: assignmentMock.course_id,
      });
      setResult(submission);
    } catch (e) {
      setError(e?.message || "אירעה שגיאה בהגשה. נסו שוב.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function reset() {
    setResult(null);
    setError("");
  }

  return (
    <div className="page" style={{ maxWidth: 880 }}>
      <div className="create-course-heading">
        <div>
          <Link to="/" className="back-link">← חזרה לדף הבית</Link>
          <span className="eyebrow">LEV SMART · קורסים</span>
          <h1>הגשת ERD</h1>
          <p>העלאת קובץ ERD בהתאם להנחיות המטלה.</p>
        </div>
      </div>

      <section className="erd-panel" aria-label="הגשת קובץ ERD">
        <header className="assignment-header">
          <h2 className="assignment-title">{assignmentMock.title}</h2>
          <div className="assignment-meta">
            <span>מועד אחרון: {dueText}</span> · <span>ניקוד מקסימלי: {assignmentMock.max_score}</span>
          </div>
          <div className="assignment-actions">
            <a href={assignmentMock.rubric_url} target="_blank" rel="noreferrer">צפייה ברובריקה →</a>
          </div>
          <p style={{ margin: "8px 0 0", color: "#53617a", fontSize: 13 }}>{assignmentMock.instructions}</p>
        </header>

        {!result ? (
          <>
            <ErdUpload
              allowedExtensions={assignmentMock.allowed_file_types}
              onSubmit={handleSubmit}
              disabled={isSubmitting}
            />
            {error && <div className="error-banner" role="alert">{error}</div>}
          </>
        ) : (
          <div className="success-panel" role="status" aria-live="polite">
            <strong>ההגשה נשלחה בהצלחה!</strong>
            <div className="json-preview">
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
            <div className="submit-row" style={{ marginTop: 12 }}>
              <button className="primary-button" onClick={reset}>הגשה נוספת</button>
              <Link to="/" className="text-link" style={{ alignSelf: "center" }}>חזרה לדף הבית ←</Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
