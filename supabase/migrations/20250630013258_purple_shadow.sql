/*
  # إضافة جداول المواد والمجموعات

  1. الجداول الجديدة
    - `subjects` - جدول المواد الدراسية
      - `id` (uuid, primary key)
      - `name` (text) - اسم المادة
      - `code` (text, unique) - كود المادة
      - `category` (text) - تصنيف المادة
      - `color` (text) - لون المادة
      - `icon` (text) - أيقونة المادة
      - `description` (text) - وصف المادة
      - `grades` (text array) - الصفوف التي تدرس فيها
      - `default_duration` (integer) - مدة الحصة الافتراضية
      - `default_price` (integer) - السعر الافتراضي
      - `materials` (text array) - المواد المطلوبة
      - `objectives` (text array) - أهداف المادة
      - `prerequisites` (text array) - المتطلبات السابقة
      - `is_active` (boolean) - حالة المادة
      - `teacher_id` (uuid, foreign key) - معرف المعلم
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `student_groups` - جدول المجموعات الدراسية
      - `id` (uuid, primary key)
      - `name` (text) - اسم المجموعة
      - `subject_id` (uuid, foreign key) - معرف المادة
      - `grade` (text) - الصف الدراسي
      - `description` (text) - وصف المجموعة
      - `monthly_price` (integer) - السعر الشهري
      - `max_students` (integer) - الحد الأقصى للطلاب
      - `current_students` (integer) - عدد الطلاب الحاليين
      - `location` (text) - مكان الحصص
      - `materials` (text array) - المواد المطلوبة
      - `rules` (text array) - قوانين المجموعة
      - `start_date` (date) - تاريخ البداية
      - `end_date` (date) - تاريخ النهاية
      - `is_active` (boolean) - حالة المجموعة
      - `teacher_id` (uuid, foreign key) - معرف المعلم
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `group_schedules` - جدول مواعيد المجموعات
      - `id` (uuid, primary key)
      - `group_id` (uuid, foreign key) - معرف المجموعة
      - `day` (text) - اليوم
      - `start_time` (time) - وقت البداية
      - `end_time` (time) - وقت النهاية
      - `duration` (integer) - المدة بالدقائق
      - `location` (text) - المكان
      - `created_at` (timestamp)

    - `group_students` - جدول ربط الطلاب بالمجموعات
      - `id` (uuid, primary key)
      - `group_id` (uuid, foreign key) - معرف المجموعة
      - `student_id` (uuid, foreign key) - معرف الطالب
      - `joined_at` (timestamp) - تاريخ الانضمام
      - `is_active` (boolean) - حالة الطالب في المجموعة

  2. التحديثات على الجداول الموجودة
    - إضافة `subject_id` و `student_code` لجدول الطلاب
    - إضافة `subject_id` لجدول الحصص والمدفوعات

  3. الأمان
    - تفعيل RLS على جميع الجداول الجديدة
    - إضافة سياسات للوصول المحدود حسب المعلم
*/

-- إضافة عمود subject_id و student_code لجدول الطلاب
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'students' AND column_name = 'subject_id'
  ) THEN
    ALTER TABLE students ADD COLUMN subject_id uuid REFERENCES subjects(id) ON DELETE SET NULL;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'students' AND column_name = 'student_code'
  ) THEN
    ALTER TABLE students ADD COLUMN student_code text UNIQUE;
  END IF;
END $$;

-- إنشاء جدول المواد الدراسية
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text NOT NULL,
  category text NOT NULL DEFAULT 'أخرى' CHECK (category IN ('علوم', 'أدب', 'لغات', 'رياضيات', 'اجتماعيات', 'فنون', 'أخرى')),
  color text DEFAULT '#3B82F6',
  icon text DEFAULT '📚',
  description text,
  grades text[] DEFAULT ARRAY[]::text[],
  default_duration integer DEFAULT 60,
  default_price integer DEFAULT 150,
  materials text[] DEFAULT ARRAY[]::text[],
  objectives text[] DEFAULT ARRAY[]::text[],
  prerequisites text[] DEFAULT ARRAY[]::text[],
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(teacher_id, code)
);

-- إنشاء جدول المجموعات الدراسية
CREATE TABLE IF NOT EXISTS student_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  name text NOT NULL,
  grade text NOT NULL,
  description text,
  monthly_price integer NOT NULL DEFAULT 0,
  max_students integer NOT NULL DEFAULT 10,
  current_students integer DEFAULT 0,
  location text,
  materials text[] DEFAULT ARRAY[]::text[],
  rules text[] DEFAULT ARRAY[]::text[],
  start_date date,
  end_date date,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- إنشاء جدول مواعيد المجموعات
CREATE TABLE IF NOT EXISTS group_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES student_groups(id) ON DELETE CASCADE,
  day text NOT NULL CHECK (day IN ('السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة')),
  start_time time NOT NULL,
  end_time time NOT NULL,
  duration integer NOT NULL DEFAULT 60,
  location text,
  created_at timestamptz DEFAULT now()
);

-- إنشاء جدول ربط الطلاب بالمجموعات
CREATE TABLE IF NOT EXISTS group_students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES student_groups(id) ON DELETE CASCADE,
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  UNIQUE(group_id, student_id)
);

-- إضافة عمود subject_id للحصص والمدفوعات
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'sessions' AND column_name = 'subject_id'
  ) THEN
    ALTER TABLE sessions ADD COLUMN subject_id uuid REFERENCES subjects(id) ON DELETE SET NULL;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'sessions' AND column_name = 'group_id'
  ) THEN
    ALTER TABLE sessions ADD COLUMN group_id uuid REFERENCES student_groups(id) ON DELETE SET NULL;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payments' AND column_name = 'subject_id'
  ) THEN
    ALTER TABLE payments ADD COLUMN subject_id uuid REFERENCES subjects(id) ON DELETE SET NULL;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payments' AND column_name = 'group_id'
  ) THEN
    ALTER TABLE payments ADD COLUMN group_id uuid REFERENCES student_groups(id) ON DELETE SET NULL;
  END IF;
END $$;

-- تفعيل RLS على الجداول الجديدة
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_students ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان للمواد
CREATE POLICY "Teachers can manage own subjects"
  ON subjects
  FOR ALL
  TO authenticated
  USING (teacher_id = auth.uid());

-- سياسات الأمان للمجموعات
CREATE POLICY "Teachers can manage own groups"
  ON student_groups
  FOR ALL
  TO authenticated
  USING (teacher_id = auth.uid());

-- سياسات الأمان لمواعيد المجموعات
CREATE POLICY "Teachers can manage own group schedules"
  ON group_schedules
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM student_groups 
      WHERE student_groups.id = group_schedules.group_id 
      AND student_groups.teacher_id = auth.uid()
    )
  );

-- سياسات الأمان لربط الطلاب بالمجموعات
CREATE POLICY "Teachers can manage own group students"
  ON group_students
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM student_groups 
      WHERE student_groups.id = group_students.group_id 
      AND student_groups.teacher_id = auth.uid()
    )
  );

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_subjects_teacher_id ON subjects(teacher_id);
CREATE INDEX IF NOT EXISTS idx_subjects_is_active ON subjects(is_active);
CREATE INDEX IF NOT EXISTS idx_subjects_category ON subjects(category);
CREATE INDEX IF NOT EXISTS idx_student_groups_teacher_id ON student_groups(teacher_id);
CREATE INDEX IF NOT EXISTS idx_student_groups_subject_id ON student_groups(subject_id);
CREATE INDEX IF NOT EXISTS idx_student_groups_is_active ON student_groups(is_active);
CREATE INDEX IF NOT EXISTS idx_group_schedules_group_id ON group_schedules(group_id);
CREATE INDEX IF NOT EXISTS idx_group_students_group_id ON group_students(group_id);
CREATE INDEX IF NOT EXISTS idx_group_students_student_id ON group_students(student_id);
CREATE INDEX IF NOT EXISTS idx_students_subject_id ON students(subject_id);
CREATE INDEX IF NOT EXISTS idx_students_student_code ON students(student_code);

-- إضافة triggers لتحديث updated_at
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_groups_updated_at BEFORE UPDATE ON student_groups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- دالة لتحديث عدد الطلاب في المجموعة تلقائياً
CREATE OR REPLACE FUNCTION update_group_student_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE student_groups 
    SET current_students = (
      SELECT COUNT(*) FROM group_students 
      WHERE group_id = NEW.group_id AND is_active = true
    )
    WHERE id = NEW.group_id;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE student_groups 
    SET current_students = (
      SELECT COUNT(*) FROM group_students 
      WHERE group_id = NEW.group_id AND is_active = true
    )
    WHERE id = NEW.group_id;
    
    IF OLD.group_id != NEW.group_id THEN
      UPDATE student_groups 
      SET current_students = (
        SELECT COUNT(*) FROM group_students 
        WHERE group_id = OLD.group_id AND is_active = true
      )
      WHERE id = OLD.group_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE student_groups 
    SET current_students = (
      SELECT COUNT(*) FROM group_students 
      WHERE group_id = OLD.group_id AND is_active = true
    )
    WHERE id = OLD.group_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- إضافة trigger لتحديث عدد الطلاب
CREATE TRIGGER update_group_student_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON group_students
  FOR EACH ROW EXECUTE FUNCTION update_group_student_count();

-- إدراج بعض المواد الافتراضية (اختياري)
INSERT INTO subjects (teacher_id, name, code, category, color, icon, grades, default_duration, default_price, is_active)
SELECT 
  t.id,
  'الرياضيات',
  'MATH',
  'رياضيات',
  '#3B82F6',
  '🧮',
  ARRAY['الصف الأول الإعدادي', 'الصف الثاني الإعدادي', 'الصف الثالث الإعدادي'],
  90,
  200,
  true
FROM teachers t
WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE code = 'MATH' AND teacher_id = t.id)
LIMIT 1;

INSERT INTO subjects (teacher_id, name, code, category, color, icon, grades, default_duration, default_price, is_active)
SELECT 
  t.id,
  'الفيزياء',
  'PHYS',
  'علوم',
  '#10B981',
  '⚛️',
  ARRAY['الصف الأول الثانوي', 'الصف الثاني الثانوي', 'الصف الثالث الثانوي'],
  90,
  250,
  true
FROM teachers t
WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE code = 'PHYS' AND teacher_id = t.id)
LIMIT 1;

INSERT INTO subjects (teacher_id, name, code, category, color, icon, grades, default_duration, default_price, is_active)
SELECT 
  t.id,
  'اللغة الإنجليزية',
  'ENG',
  'لغات',
  '#8B5CF6',
  '🇬🇧',
  ARRAY['الصف الأول الابتدائي', 'الصف الثاني الابتدائي', 'الصف الثالث الابتدائي'],
  60,
  150,
  true
FROM teachers t
WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE code = 'ENG' AND teacher_id = t.id)
LIMIT 1;