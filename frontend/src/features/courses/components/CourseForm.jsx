import { useState } from "react";
import "./CourseForm.css";
import { lecturers, tas, semesters } from "../services/mockData.js";

export default function CourseForm({ onSubmit, isLoading = false }) {
  const [formData, setFormData] = useState({
    course_code: "",
    title: "",
    description: "",
    semester: "",
    lecturer_id: "",
    ta_ids: [],
    syllabus_url: "",
  });

  const [validationErrors, setValidationErrors] = useState({});

  const isValidUrl = (value) => {
    if (!value) return true;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  function validateForm() {
    const errors = {};
    if (!formData.course_code.trim()) errors.course_code = "קוד הקורס חובה";
    if (!formData.title.trim()) errors.title = "שם הקורס חובה";
    if (!formData.description.trim()) errors.description = "תיאור הקורס חובה";
    if (!formData.semester) errors.semester = "בחרו סמסטר";
    if (!formData.lecturer_id) errors.lecturer_id = "בחרו מרצה";
    if (formData.syllabus_url && !isValidUrl(formData.syllabus_url)) errors.syllabus_url = "כתובת URL אינה תקינה";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleChange(e) {
    const { name, value, type, selectedOptions } = e.target;
    if (type === "select-multiple") {
      const selected = Array.from(selectedOptions).map((opt) => opt.value);
      setFormData((prev) => ({ ...prev, [name]: selected }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear field error on change
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData);
  }

  return (
    <form className="course-form" onSubmit={handleSubmit} noValidate>
      <div className="form-section">
        <h2>פרטי הקורס</h2>

        <div className="form-group">
          <label htmlFor="course_code">קוד הקורס</label>
          <input
            id="course_code"
            name="course_code"
            type="text"
            value={formData.course_code}
            onChange={handleChange}
            placeholder="למשל: CS101"
            disabled={isLoading}
            maxLength={50}
            aria-describedby={validationErrors.course_code ? "course_code-error" : undefined}
          />
          {validationErrors.course_code && (
            <span id="course_code-error" className="error-text">{validationErrors.course_code}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="title">שם הקורס</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="למשל: מבוא להנדסת תוכנה"
            disabled={isLoading}
            maxLength={200}
            aria-describedby={validationErrors.title ? "title-error" : undefined}
          />
          {validationErrors.title && (
            <span id="title-error" className="error-text">{validationErrors.title}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description">תיאור הקורס</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="תיאור הקורס, דרישות מקדימות וכדומה..."
            disabled={isLoading}
            rows={5}
            maxLength={2000}
            aria-describedby={validationErrors.description ? "description-error" : undefined}
          />
          {validationErrors.description && (
            <span id="description-error" className="error-text">{validationErrors.description}</span>
          )}
        </div>
      </div>

      <div className="form-section">
        <h2>מרצה וסמסטר</h2>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="semester">סמסטר</label>
            <select
              id="semester"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              disabled={isLoading}
              aria-describedby={validationErrors.semester ? "semester-error" : undefined}
            >
              <option value="">בחרו סמסטר</option>
              {semesters.map((sem) => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
            {validationErrors.semester && (
              <span id="semester-error" className="error-text">{validationErrors.semester}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="lecturer_id">מרצה</label>
            <select
              id="lecturer_id"
              name="lecturer_id"
              value={formData.lecturer_id}
              onChange={handleChange}
              disabled={isLoading}
              aria-describedby={validationErrors.lecturer_id ? "lecturer_id-error" : undefined}
            >
              <option value="">בחרו מרצה</option>
              {lecturers.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
            {validationErrors.lecturer_id && (
              <span id="lecturer_id-error" className="error-text">{validationErrors.lecturer_id}</span>
            )}
          </div>
        </div>
      </div>

      <div className="form-section">
        <h2>עוזרי הוראה וחומר נוסף</h2>

        <div className="form-group">
          <label htmlFor="ta_ids">עוזרי הוראה (אפשר לבחור יותר מאחד)</label>
          <select
            id="ta_ids"
            name="ta_ids"
            value={formData.ta_ids}
            onChange={handleChange}
            disabled={isLoading}
            multiple
            size={Math.min(6, tas.length)}
          >
            {tas.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <span className="form-hint">השתמשו ב־Ctrl/Cmd + לחיצה כדי לבחור מספר עוזרים</span>
        </div>

        <div className="form-group">
          <label htmlFor="syllabus_url">קישור לסילבוס (אופציונלי)</label>
          <input
            id="syllabus_url"
            name="syllabus_url"
            type="url"
            value={formData.syllabus_url}
            onChange={handleChange}
            placeholder="https://supabase-storage-url/syllabus.pdf"
            disabled={isLoading}
            aria-describedby={validationErrors.syllabus_url ? "syllabus_url-error" : undefined}
          />
          {validationErrors.syllabus_url && (
            <span id="syllabus_url-error" className="error-text">{validationErrors.syllabus_url}</span>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="primary-button" disabled={isLoading}>
          {isLoading ? "יוצר קורס…" : "יצור קורס ✓"}
        </button>
      </div>
    </form>
  );
}
