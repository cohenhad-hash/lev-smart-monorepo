import { useState } from "react";

const demoStudents = [
  { id: "demo-1", name: "נועה לוי" },
  { id: "demo-2", name: "מיה כהן" },
  { id: "demo-3", name: "תמר דוד" },
];

export default function StudentPicker() {
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  function toggleStudent(studentId) {
    setSelectedStudentIds((currentIds) =>
      currentIds.includes(studentId)
        ? currentIds.filter((id) => id !== studentId)
        : [...currentIds, studentId]
    );
  }

  return (
    <fieldset>
      <legend>בחירת סטודנטים לקורס</legend>

      {demoStudents.map((student) => (
        <div key={student.id}>
          <label>
            <input
              type="checkbox"
              checked={selectedStudentIds.includes(student.id)}
              onChange={() => toggleStudent(student.id)}
            />
            {" "}{student.name}
          </label>
        </div>
      ))}

      <p role="status">נבחרו {selectedStudentIds.length} סטודנטים</p>
    </fieldset>
  );
}