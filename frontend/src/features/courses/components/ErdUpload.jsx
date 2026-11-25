import { useRef, useState } from "react";
import "./ErdUpload.css";

const humanFileSize = (bytes) => {
  if (!Number.isFinite(bytes)) return "";
  const thresh = 1024;
  if (bytes < thresh) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (bytes >= thresh && u < units.length - 1);
  return `${bytes.toFixed(1)} ${units[u]}`;
};

export default function ErdUpload({ allowedExtensions = [".pdf", ".png", ".zip"], onSubmit, disabled = false }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  function isValidExtension(fileName) {
    const lower = fileName.toLowerCase();
    return allowedExtensions.some((ext) => lower.endsWith(ext));
  }

  function pickFile() {
    inputRef.current?.click();
  }

  function onFileSelected(files) {
    if (!files || files.length === 0) return;
    const picked = files[0];
    if (!isValidExtension(picked.name)) {
      setError(`סוג הקובץ אינו מותר. ניתן להגיש רק: ${allowedExtensions.join(", ")}`);
      setFile(null);
      return;
    }
    setError("");
    setFile(picked);
  }

  function handleInputChange(e) {
    onFileSelected(e.target.files);
  }

  function handleDragOver(e) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    onFileSelected(e.dataTransfer.files);
  }

  function removeFile() {
    setFile(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleSubmit() {
    if (!file) {
      setError("בחרו קובץ תקין לפני ההגשה.");
      return;
    }
    setError("");
    onSubmit?.({ file, student_notes: notes });
  }

  return (
    <div>
      <div
        className={`dropzone ${dragOver ? "drag-over" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="גררו ושחררו קובץ לאזור זה או לחצו לבחירה"
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") pickFile(); }}
      >
        <p>גררו ושחררו כאן את קובץ ה־ERD או</p>
        <button type="button" className="choose-button" onClick={pickFile} disabled={disabled}>בחירת קובץ</button>
        <input
          ref={inputRef}
          type="file"
          accept={allowedExtensions.join(",")}
          onChange={handleInputChange}
          disabled={disabled}
          aria-hidden="true"
          tabIndex={-1}
        />
        <p style={{ marginTop: 6, color: "#8a95a7", fontSize: 12 }}>קבצים מותרים: {allowedExtensions.join(", ")}</p>
      </div>

      {file && (
        <div className="file-card" aria-live="polite">
          <div className="file-name">{file.name}</div>
          <button type="button" className="remove-file" onClick={removeFile} disabled={disabled}>החלפת קובץ</button>
          <div className="file-size">{humanFileSize(file.size)}</div>
        </div>
      )}

      <div className="notes-group">
        <label htmlFor="student-notes">הערות לשרטוט (אופציונלי)</label>
        <textarea
          id="student-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="כתבו כאן הערות או הסברים אם יש…"
          disabled={disabled}
        />
      </div>

      {error && <div className="error-banner" role="alert">{error}</div>}

      <div className="submit-row">
        <button type="button" className="primary-button" onClick={handleSubmit} disabled={disabled || !file}>
          שליחת ההגשה ↑
        </button>
      </div>
    </div>
  );
}
