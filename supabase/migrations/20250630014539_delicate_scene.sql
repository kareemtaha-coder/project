/*
  # نظام إدارة المدرسين المتكامل

  1. تحديث جدول المدرسين
    - إضافة معلومات شخصية مفصلة
    - إضافة صلاحيات وأدوار
    - إضافة إعدادات وتفضيلات
    - إضافة إحصائيات

  2. جداول جديدة
    - `teacher_permissions` - صلاحيات المدرسين
    - `teacher_documents` - مستندات المدرسين
    - `teacher_subjects` - ربط المدرسين بالمواد
    - `teacher_stats` - إحصائيات المدرسين

  3. تحديث الجداول الموجودة
    - ربط أفضل بين الجداول
    - إضافة حقول للإحصائيات
    - تحسين الفهارس

  4. Views للإحصائيات
    - عرض شامل لإحصائيات كل مدرس
    - تقارير مفصلة
*/

-- تحديث جدول المدرسين
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS avatar text;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS specializations text[] DEFAULT ARRAY[]::text[];
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS experience integer DEFAULT 0;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS qualifications text[] DEFAULT ARRAY[]::text[];
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS role text DEFAULT 'teacher' CHECK (role IN ('teacher', 'admin', 'supervisor'));
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS join_date date DEFAULT CURRENT_DATE;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS last_login timestamptz;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS rating numeric(3,2) DEFAULT 0.0;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS total_students integer DEFAULT 0;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS total_groups integer DEFAULT 0;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS total_sessions integer DEFAULT 0;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS total_revenue integer DEFAULT 0;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS preferences jsonb DEFAULT '{}'::jsonb;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{}'::jsonb;

-- جدول صلاحيات المدرسين
CREATE TABLE IF NOT EXISTS teacher_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  permission_name text NOT NULL,
  permission_category text NOT NULL CHECK (permission_category IN ('students', 'groups', 'sessions', 'payments', 'reports', 'settings', 'admin')),
  description text,
  is_granted boolean DEFAULT false,
  granted_by uuid REFERENCES teachers(id),
  granted_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(teacher_id, permission_name)
);

-- جدول مستندات المدرسين
CREATE TABLE IF NOT EXISTS teacher_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('cv', 'certificate', 'id', 'photo', 'other')),
  url text NOT NULL,
  upload_date timestamptz DEFAULT now(),
  file_size integer,
  mime_type text,
  is_verified boolean DEFAULT false,
  verified_by uuid REFERENCES teachers(id),
  verified_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- جدول ربط المدرسين بالمواد (للمدرسين متعددي التخصصات)
CREATE TABLE IF NOT EXISTS teacher_subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  is_primary boolean DEFAULT false,
  hourly_rate integer,
  experience_years integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(teacher_id, subject_id)
);

-- جدول إحصائيات المدرسين (للتقارير المفصلة)
CREATE TABLE IF NOT EXISTS teacher_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  stat_date date DEFAULT CURRENT_DATE,
  students_count integer DEFAULT 0,
  groups_count integer DEFAULT 0,
  sessions_count integer DEFAULT 0,
  revenue_amount integer DEFAULT 0,
  attendance_rate numeric(5,2) DEFAULT 0.0,
  payment_rate numeric(5,2) DEFAULT 0.0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(teacher_id, stat_date)
);

-- تفعيل RLS على الجداول الجديدة
ALTER TABLE teacher_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_stats ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان
CREATE POLICY "Teachers can manage own permissions"
  ON teacher_permissions
  FOR ALL
  TO authenticated
  USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can manage own documents"
  ON teacher_documents
  FOR ALL
  TO authenticated
  USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can manage own subjects"
  ON teacher_subjects
  FOR ALL
  TO authenticated
  USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can view own stats"
  ON teacher_stats
  FOR SELECT
  TO authenticated
  USING (teacher_id = auth.uid());

-- إنشاء فهارس
CREATE INDEX IF NOT EXISTS idx_teacher_permissions_teacher_id ON teacher_permissions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_permissions_category ON teacher_permissions(permission_category);
CREATE INDEX IF NOT EXISTS idx_teacher_documents_teacher_id ON teacher_documents(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_documents_type ON teacher_documents(type);
CREATE INDEX IF NOT EXISTS idx_teacher_subjects_teacher_id ON teacher_subjects(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_subjects_subject_id ON teacher_subjects(subject_id);
CREATE INDEX IF NOT EXISTS idx_teacher_stats_teacher_id ON teacher_stats(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_stats_date ON teacher_stats(stat_date);

-- دالة لحساب إحصائيات المدرس
CREATE OR REPLACE FUNCTION calculate_teacher_stats(teacher_uuid uuid)
RETURNS void AS $$
DECLARE
  students_count integer;
  groups_count integer;
  sessions_count integer;
  revenue_amount integer;
  attendance_rate numeric;
  payment_rate numeric;
BEGIN
  -- حساب عدد الطلاب
  SELECT COUNT(*) INTO students_count
  FROM students
  WHERE teacher_id = teacher_uuid AND is_active = true;

  -- حساب عدد المجموعات
  SELECT COUNT(*) INTO groups_count
  FROM student_groups
  WHERE teacher_id = teacher_uuid AND is_active = true;

  -- حساب عدد الحصص
  SELECT COUNT(*) INTO sessions_count
  FROM sessions
  WHERE teacher_id = teacher_uuid;

  -- حساب إجمالي الإيرادات
  SELECT COALESCE(SUM(amount), 0) INTO revenue_amount
  FROM payments
  WHERE teacher_id = teacher_uuid;

  -- حساب معدل الحضور
  SELECT COALESCE(
    (COUNT(*) FILTER (WHERE status = 'completed')::numeric / NULLIF(COUNT(*), 0)) * 100,
    0
  ) INTO attendance_rate
  FROM sessions
  WHERE teacher_id = teacher_uuid;

  -- حساب معدل الدفع
  SELECT COALESCE(
    (COUNT(*) FILTER (WHERE is_paid = true)::numeric / NULLIF(COUNT(*), 0)) * 100,
    0
  ) INTO payment_rate
  FROM sessions
  WHERE teacher_id = teacher_uuid;

  -- تحديث جدول المدرسين
  UPDATE teachers SET
    total_students = students_count,
    total_groups = groups_count,
    total_sessions = sessions_count,
    total_revenue = revenue_amount,
    updated_at = now()
  WHERE id = teacher_uuid;

  -- إدراج أو تحديث الإحصائيات اليومية
  INSERT INTO teacher_stats (
    teacher_id, stat_date, students_count, groups_count, 
    sessions_count, revenue_amount, attendance_rate, payment_rate
  )
  VALUES (
    teacher_uuid, CURRENT_DATE, students_count, groups_count,
    sessions_count, revenue_amount, attendance_rate, payment_rate
  )
  ON CONFLICT (teacher_id, stat_date)
  DO UPDATE SET
    students_count = EXCLUDED.students_count,
    groups_count = EXCLUDED.groups_count,
    sessions_count = EXCLUDED.sessions_count,
    revenue_amount = EXCLUDED.revenue_amount,
    attendance_rate = EXCLUDED.attendance_rate,
    payment_rate = EXCLUDED.payment_rate,
    created_at = now();
END;
$$ LANGUAGE plpgsql;

-- دالة لتحديث الإحصائيات تلقائياً
CREATE OR REPLACE FUNCTION update_teacher_stats_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'students' THEN
    PERFORM calculate_teacher_stats(COALESCE(NEW.teacher_id, OLD.teacher_id));
  ELSIF TG_TABLE_NAME = 'student_groups' THEN
    PERFORM calculate_teacher_stats(COALESCE(NEW.teacher_id, OLD.teacher_id));
  ELSIF TG_TABLE_NAME = 'sessions' THEN
    PERFORM calculate_teacher_stats(COALESCE(NEW.teacher_id, OLD.teacher_id));
  ELSIF TG_TABLE_NAME = 'payments' THEN
    PERFORM calculate_teacher_stats(COALESCE(NEW.teacher_id, OLD.teacher_id));
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- إضافة triggers لتحديث الإحصائيات
CREATE TRIGGER update_teacher_stats_on_students
  AFTER INSERT OR UPDATE OR DELETE ON students
  FOR EACH ROW EXECUTE FUNCTION update_teacher_stats_trigger();

CREATE TRIGGER update_teacher_stats_on_groups
  AFTER INSERT OR UPDATE OR DELETE ON student_groups
  FOR EACH ROW EXECUTE FUNCTION update_teacher_stats_trigger();

CREATE TRIGGER update_teacher_stats_on_sessions
  AFTER INSERT OR UPDATE OR DELETE ON sessions
  FOR EACH ROW EXECUTE FUNCTION update_teacher_stats_trigger();

CREATE TRIGGER update_teacher_stats_on_payments
  AFTER INSERT OR UPDATE OR DELETE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_teacher_stats_trigger();

-- إنشاء view للإحصائيات الشاملة
CREATE OR REPLACE VIEW teacher_dashboard_stats AS
SELECT 
  t.id,
  t.name,
  t.email,
  t.total_students,
  t.total_groups,
  t.total_sessions,
  t.total_revenue,
  t.rating,
  t.is_active,
  -- إحصائيات هذا الشهر
  COALESCE(monthly.students_this_month, 0) as students_this_month,
  COALESCE(monthly.sessions_this_month, 0) as sessions_this_month,
  COALESCE(monthly.revenue_this_month, 0) as revenue_this_month,
  -- إحصائيات اليوم
  COALESCE(daily.sessions_today, 0) as sessions_today,
  COALESCE(daily.revenue_today, 0) as revenue_today,
  -- معدلات
  CASE 
    WHEN t.total_sessions > 0 THEN 
      (SELECT COUNT(*) FROM sessions s WHERE s.teacher_id = t.id AND s.status = 'completed')::numeric / t.total_sessions * 100
    ELSE 0 
  END as completion_rate,
  CASE 
    WHEN t.total_sessions > 0 THEN 
      (SELECT COUNT(*) FROM sessions s WHERE s.teacher_id = t.id AND s.is_paid = true)::numeric / t.total_sessions * 100
    ELSE 0 
  END as payment_rate
FROM teachers t
LEFT JOIN (
  SELECT 
    teacher_id,
    COUNT(DISTINCT s.id) as students_this_month,
    COUNT(DISTINCT sess.id) as sessions_this_month,
    COALESCE(SUM(p.amount), 0) as revenue_this_month
  FROM teachers t2
  LEFT JOIN students s ON s.teacher_id = t2.id AND s.created_at >= date_trunc('month', CURRENT_DATE)
  LEFT JOIN sessions sess ON sess.teacher_id = t2.id AND sess.date >= date_trunc('month', CURRENT_DATE)
  LEFT JOIN payments p ON p.teacher_id = t2.id AND p.date >= date_trunc('month', CURRENT_DATE)
  GROUP BY teacher_id
) monthly ON monthly.teacher_id = t.id
LEFT JOIN (
  SELECT 
    teacher_id,
    COUNT(DISTINCT sess.id) as sessions_today,
    COALESCE(SUM(p.amount), 0) as revenue_today
  FROM teachers t3
  LEFT JOIN sessions sess ON sess.teacher_id = t3.id AND sess.date >= CURRENT_DATE AND sess.date < CURRENT_DATE + INTERVAL '1 day'
  LEFT JOIN payments p ON p.teacher_id = t3.id AND p.date >= CURRENT_DATE AND p.date < CURRENT_DATE + INTERVAL '1 day'
  GROUP BY teacher_id
) daily ON daily.teacher_id = t.id;

-- إدراج الصلاحيات الافتراضية للمدرسين
INSERT INTO teacher_permissions (teacher_id, permission_name, permission_category, description, is_granted)
SELECT 
  t.id,
  perm.name,
  perm.category,
  perm.description,
  true
FROM teachers t
CROSS JOIN (
  VALUES 
    ('manage_students', 'students', 'إدارة الطلاب - إضافة وتعديل وحذف'),
    ('view_students', 'students', 'عرض قائمة الطلاب'),
    ('manage_groups', 'groups', 'إدارة المجموعات - إنشاء وتعديل وحذف'),
    ('view_groups', 'groups', 'عرض المجموعات'),
    ('manage_sessions', 'sessions', 'إدارة الحصص - جدولة وتعديل وإلغاء'),
    ('view_sessions', 'sessions', 'عرض الحصص'),
    ('manage_payments', 'payments', 'إدارة المدفوعات - تسجيل وتعديل'),
    ('view_payments', 'payments', 'عرض المدفوعات'),
    ('view_reports', 'reports', 'عرض التقارير والإحصائيات'),
    ('manage_settings', 'settings', 'إدارة الإعدادات الشخصية')
) as perm(name, category, description)
WHERE NOT EXISTS (
  SELECT 1 FROM teacher_permissions tp 
  WHERE tp.teacher_id = t.id AND tp.permission_name = perm.name
);

-- تحديث الإحصائيات للمدرسين الموجودين
DO $$
DECLARE
  teacher_record RECORD;
BEGIN
  FOR teacher_record IN SELECT id FROM teachers LOOP
    PERFORM calculate_teacher_stats(teacher_record.id);
  END LOOP;
END $$;