-- טבלת קורסים
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_code VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    semester VARCHAR(50),
    lecturer_id UUID NOT NULL, -- מקושר לטבלת המשתמשים של צוות 1
    syllabus_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- טבלת שיוך סטודנטים ומתרגלים לקורס
CREATE TABLE course_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role VARCHAR(20) CHECK (role IN ('student', 'ta')),
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(course_id, user_id)
);

-- טבלת חומרי לימוד (מצגות, סילבוסים, קבצים)
CREATE TABLE course_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    material_type VARCHAR(50),
    file_url TEXT NOT NULL,
    uploaded_by UUID NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
