/*
  # إنشاء نظام إدارة الطلاب

  1. الجداول الجديدة
    - `teachers` - بيانات المعلمين
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `phone` (text)
      - `subject` (text)
      - `hourly_rate` (integer)
      - `address` (text, optional)
      - `working_hours_start` (time)
      - `working_hours_end` (time)
      - `working_days` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `students` - بيانات الطلاب
      - `id` (uuid, primary key)
      - `teacher_id` (uuid, foreign key)
      - `name` (text)
      - `phone` (text)
      - `parent_phone` (text, optional)
      - `grade` (text)
      - `subject` (text)
      - `address` (text, optional)
      - `notes` (text, optional)
      - `is_active` (boolean)
      - `avatar` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `sessions` - بيانات الحصص
      - `id` (uuid, primary key)
      - `teacher_id` (uuid, foreign key)
      - `student_id` (uuid, foreign key)
      - `date` (timestamp)
      - `duration` (integer)
      - `topic` (text)
      - `homework` (text, optional)
      - `notes` (text, optional)
      - `payment` (integer)
      - `is_paid` (boolean)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `payments` - بيانات المدفوعات
      - `id` (uuid, primary key)
      - `teacher_id` (uuid, foreign key)
      - `student_id` (uuid, foreign key)
      - `session_id` (uuid, foreign key, optional)
      - `amount` (integer)
      - `date` (timestamp)
      - `type` (text)
      - `notes` (text, optional)
      - `method` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. الأمان
    - تفعيل RLS على جميع الجداول
    - إضافة سياسات للوصول المحدود حسب المعلم
*/

-- إنشاء جدول المعلمين
CREATE TABLE IF NOT EXISTS teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  phone text,
  subject text,
  hourly_rate integer DEFAULT 150,
  address text,
  working_hours_start time DEFAULT '16:00',
  working_hours_end time DEFAULT '22:00',
  working_days text[] DEFAULT ARRAY['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء'],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- إنشاء جدول الطلاب
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text NOT NULL,
  parent_phone text,
  grade text NOT NULL,
  subject text NOT NULL,
  address text,
  notes text,
  is_active boolean DEFAULT true,
  avatar text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- إنشاء جدول الحصص
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  date timestamptz NOT NULL,
  duration integer NOT NULL DEFAULT 60,
  topic text NOT NULL,
  homework text,
  notes text,
  payment integer NOT NULL DEFAULT 0,
  is_paid boolean DEFAULT false,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'missed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- إنشاء جدول المدفوعات
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  session_id uuid REFERENCES sessions(id) ON DELETE SET NULL,
  amount integer NOT NULL,
  date timestamptz NOT NULL DEFAULT now(),
  type text NOT NULL DEFAULT 'session' CHECK (type IN ('session', 'monthly', 'package')),
  notes text,
  method text NOT NULL DEFAULT 'cash' CHECK (method IN ('cash', 'transfer', 'other')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- تفعيل RLS على جميع الجداول
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان للمعلمين
CREATE POLICY "Teachers can read own data"
  ON teachers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Teachers can update own data"
  ON teachers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- سياسات الأمان للطلاب
CREATE POLICY "Teachers can manage own students"
  ON students
  FOR ALL
  TO authenticated
  USING (teacher_id = auth.uid());

-- سياسات الأمان للحصص
CREATE POLICY "Teachers can manage own sessions"
  ON sessions
  FOR ALL
  TO authenticated
  USING (teacher_id = auth.uid());

-- سياسات الأمان للمدفوعات
CREATE POLICY "Teachers can manage own payments"
  ON payments
  FOR ALL
  TO authenticated
  USING (teacher_id = auth.uid());

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_students_teacher_id ON students(teacher_id);
CREATE INDEX IF NOT EXISTS idx_students_is_active ON students(is_active);
CREATE INDEX IF NOT EXISTS idx_sessions_teacher_id ON sessions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_sessions_student_id ON sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(date);
CREATE INDEX IF NOT EXISTS idx_payments_teacher_id ON payments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(date);

-- دالة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- إضافة triggers لتحديث updated_at
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();