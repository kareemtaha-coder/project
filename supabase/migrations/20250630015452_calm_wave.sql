/*
  # نظام متكامل لربط المجموعات والمعلمين والطلاب

  1. تحديثات على الجداول الموجودة
    - إضافة عمود teacher_id لجدول student_groups
    - تحديث العلاقات والفهارس
    - إضافة triggers للتحديث التلقائي

  2. دوال جديدة
    - دالة إضافة طالب لمجموعة تلقائياً
    - دالة تحديث إحصائيات المجموعات
    - دالة ربط المعلم بالمجموعة

  3. Views محدثة
    - عرض شامل للمجموعات مع بيانات المعلم
    - إحصائيات المجموعات لكل معلم

  4. Triggers ذكية
    - تحديث تلقائي عند إضافة/حذف طلاب
    - تحديث إحصائيات المعلم عند تغيير المجموعات
*/

-- التأكد من وجود عمود teacher_id في جدول student_groups
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'student_groups' AND column_name = 'teacher_id'
  ) THEN
    ALTER TABLE student_groups ADD COLUMN teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE;
  END IF;
END $$;

-- إضافة فهارس جديدة
CREATE INDEX IF NOT EXISTS idx_student_groups_teacher_id ON student_groups(teacher_id);
CREATE INDEX IF NOT EXISTS idx_group_students_active ON group_students(group_id, is_active);

-- دالة لإضافة طالب لمجموعة مع التحديث التلقائي
CREATE OR REPLACE FUNCTION add_student_to_group(
  p_student_id uuid,
  p_group_id uuid
)
RETURNS json AS $$
DECLARE
  v_group student_groups%ROWTYPE;
  v_student students%ROWTYPE;
  v_result json;
BEGIN
  -- التحقق من وجود المجموعة
  SELECT * INTO v_group FROM student_groups WHERE id = p_group_id;
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'المجموعة غير موجودة');
  END IF;

  -- التحقق من وجود الطالب
  SELECT * INTO v_student FROM students WHERE id = p_student_id;
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'الطالب غير موجود');
  END IF;

  -- التحقق من أن المجموعة لم تصل للحد الأقصى
  IF v_group.current_students >= v_group.max_students THEN
    RETURN json_build_object('success', false, 'message', 'المجموعة مكتملة');
  END IF;

  -- التحقق من أن الطالب ليس مسجل بالفعل
  IF EXISTS (
    SELECT 1 FROM group_students 
    WHERE group_id = p_group_id AND student_id = p_student_id AND is_active = true
  ) THEN
    RETURN json_build_object('success', false, 'message', 'الطالب مسجل بالفعل في هذه المجموعة');
  END IF;

  -- إضافة الطالب للمجموعة
  INSERT INTO group_students (group_id, student_id, is_active)
  VALUES (p_group_id, p_student_id, true)
  ON CONFLICT (group_id, student_id) 
  DO UPDATE SET is_active = true, joined_at = now();

  -- تحديث عدد الطلاب في المجموعة
  UPDATE student_groups 
  SET current_students = (
    SELECT COUNT(*) FROM group_students 
    WHERE group_id = p_group_id AND is_active = true
  )
  WHERE id = p_group_id;

  -- تحديث إحصائيات المعلم
  PERFORM calculate_teacher_stats(v_group.teacher_id);

  RETURN json_build_object('success', true, 'message', 'تم إضافة الطالب للمجموعة بنجاح');
END;
$$ LANGUAGE plpgsql;

-- دالة لإزالة طالب من مجموعة
CREATE OR REPLACE FUNCTION remove_student_from_group(
  p_student_id uuid,
  p_group_id uuid
)
RETURNS json AS $$
DECLARE
  v_group student_groups%ROWTYPE;
  v_result json;
BEGIN
  -- التحقق من وجود المجموعة
  SELECT * INTO v_group FROM student_groups WHERE id = p_group_id;
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'المجموعة غير موجودة');
  END IF;

  -- إزالة الطالب من المجموعة
  UPDATE group_students 
  SET is_active = false 
  WHERE group_id = p_group_id AND student_id = p_student_id;

  -- تحديث عدد الطلاب في المجموعة
  UPDATE student_groups 
  SET current_students = (
    SELECT COUNT(*) FROM group_students 
    WHERE group_id = p_group_id AND is_active = true
  )
  WHERE id = p_group_id;

  -- تحديث إحصائيات المعلم
  PERFORM calculate_teacher_stats(v_group.teacher_id);

  RETURN json_build_object('success', true, 'message', 'تم إزالة الطالب من المجموعة بنجاح');
END;
$$ LANGUAGE plpgsql;

-- دالة لإنشاء مجموعة جديدة مع ربطها بالمعلم
CREATE OR REPLACE FUNCTION create_group_for_teacher(
  p_teacher_id uuid,
  p_name text,
  p_subject_id uuid,
  p_grade text,
  p_monthly_price integer DEFAULT 0,
  p_max_students integer DEFAULT 10,
  p_description text DEFAULT NULL,
  p_location text DEFAULT NULL
)
RETURNS json AS $$
DECLARE
  v_group_id uuid;
  v_result json;
BEGIN
  -- إنشاء المجموعة
  INSERT INTO student_groups (
    teacher_id, subject_id, name, grade, description, 
    monthly_price, max_students, current_students, location, is_active
  )
  VALUES (
    p_teacher_id, p_subject_id, p_name, p_grade, p_description,
    p_monthly_price, p_max_students, 0, p_location, true
  )
  RETURNING id INTO v_group_id;

  -- تحديث إحصائيات المعلم
  PERFORM calculate_teacher_stats(p_teacher_id);

  RETURN json_build_object(
    'success', true, 
    'message', 'تم إنشاء المجموعة بنجاح',
    'group_id', v_group_id
  );
END;
$$ LANGUAGE plpgsql;

-- دالة للحصول على المجموعات المتاحة للطالب
CREATE OR REPLACE FUNCTION get_available_groups_for_student(
  p_student_id uuid
)
RETURNS TABLE(
  group_id uuid,
  group_name text,
  subject_name text,
  grade text,
  teacher_name text,
  current_students integer,
  max_students integer,
  monthly_price integer,
  available_spots integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sg.id as group_id,
    sg.name as group_name,
    s.name as subject_name,
    sg.grade,
    t.name as teacher_name,
    sg.current_students,
    sg.max_students,
    sg.monthly_price,
    (sg.max_students - sg.current_students) as available_spots
  FROM student_groups sg
  JOIN subjects s ON s.id = sg.subject_id
  JOIN teachers t ON t.id = sg.teacher_id
  JOIN students st ON st.id = p_student_id
  WHERE sg.is_active = true
    AND sg.grade = st.grade
    AND s.name = st.subject
    AND sg.current_students < sg.max_students
    AND NOT EXISTS (
      SELECT 1 FROM group_students gs 
      WHERE gs.group_id = sg.id 
        AND gs.student_id = p_student_id 
        AND gs.is_active = true
    )
  ORDER BY sg.name;
END;
$$ LANGUAGE plpgsql;

-- View شامل للمجموعات مع بيانات المعلم والمادة
CREATE OR REPLACE VIEW groups_with_details AS
SELECT 
  sg.id,
  sg.name,
  sg.grade,
  sg.description,
  sg.monthly_price,
  sg.max_students,
  sg.current_students,
  sg.location,
  sg.materials,
  sg.rules,
  sg.start_date,
  sg.end_date,
  sg.is_active,
  sg.created_at,
  sg.updated_at,
  -- بيانات المعلم
  t.id as teacher_id,
  t.name as teacher_name,
  t.email as teacher_email,
  t.phone as teacher_phone,
  -- بيانات المادة
  s.id as subject_id,
  s.name as subject_name,
  s.code as subject_code,
  s.color as subject_color,
  s.icon as subject_icon,
  -- إحصائيات
  (sg.max_students - sg.current_students) as available_spots,
  CASE 
    WHEN sg.current_students >= sg.max_students THEN 'full'
    WHEN sg.current_students >= (sg.max_students * 0.8) THEN 'nearly_full'
    ELSE 'available'
  END as status,
  -- مواعيد المجموعة
  COALESCE(
    json_agg(
      json_build_object(
        'day', gs.day,
        'start_time', gs.start_time,
        'end_time', gs.end_time,
        'duration', gs.duration,
        'location', gs.location
      ) ORDER BY 
        CASE gs.day
          WHEN 'السبت' THEN 1
          WHEN 'الأحد' THEN 2
          WHEN 'الاثنين' THEN 3
          WHEN 'الثلاثاء' THEN 4
          WHEN 'الأربعاء' THEN 5
          WHEN 'الخميس' THEN 6
          WHEN 'الجمعة' THEN 7
        END
    ) FILTER (WHERE gs.id IS NOT NULL),
    '[]'::json
  ) as schedule,
  -- قائمة الطلاب
  COALESCE(
    json_agg(
      json_build_object(
        'id', st.id,
        'name', st.name,
        'phone', st.phone,
        'joined_at', gst.joined_at
      ) ORDER BY gst.joined_at
    ) FILTER (WHERE st.id IS NOT NULL AND gst.is_active = true),
    '[]'::json
  ) as students
FROM student_groups sg
LEFT JOIN teachers t ON t.id = sg.teacher_id
LEFT JOIN subjects s ON s.id = sg.subject_id
LEFT JOIN group_schedules gs ON gs.group_id = sg.id
LEFT JOIN group_students gst ON gst.group_id = sg.id AND gst.is_active = true
LEFT JOIN students st ON st.id = gst.student_id
GROUP BY 
  sg.id, sg.name, sg.grade, sg.description, sg.monthly_price, 
  sg.max_students, sg.current_students, sg.location, sg.materials, 
  sg.rules, sg.start_date, sg.end_date, sg.is_active, 
  sg.created_at, sg.updated_at,
  t.id, t.name, t.email, t.phone,
  s.id, s.name, s.code, s.color, s.icon;

-- View لإحصائيات المجموعات لكل معلم
CREATE OR REPLACE VIEW teacher_groups_stats AS
SELECT 
  t.id as teacher_id,
  t.name as teacher_name,
  COUNT(sg.id) as total_groups,
  COUNT(sg.id) FILTER (WHERE sg.is_active = true) as active_groups,
  SUM(sg.current_students) as total_students_in_groups,
  SUM(sg.max_students) as total_capacity,
  SUM(sg.monthly_price * sg.current_students) as monthly_revenue_from_groups,
  ROUND(
    AVG(sg.current_students::numeric / NULLIF(sg.max_students, 0)) * 100, 2
  ) as average_occupancy_rate,
  -- المجموعات حسب الحالة
  COUNT(sg.id) FILTER (WHERE sg.current_students >= sg.max_students) as full_groups,
  COUNT(sg.id) FILTER (WHERE sg.current_students >= (sg.max_students * 0.8) AND sg.current_students < sg.max_students) as nearly_full_groups,
  COUNT(sg.id) FILTER (WHERE sg.current_students < (sg.max_students * 0.8)) as available_groups
FROM teachers t
LEFT JOIN student_groups sg ON sg.teacher_id = t.id
WHERE t.is_active = true
GROUP BY t.id, t.name;

-- تحديث دالة حساب إحصائيات المعلم لتشمل المجموعات
CREATE OR REPLACE FUNCTION calculate_teacher_stats(teacher_uuid uuid)
RETURNS void AS $$
DECLARE
  students_count integer;
  groups_count integer;
  sessions_count integer;
  revenue_amount integer;
  attendance_rate numeric;
  payment_rate numeric;
  groups_revenue integer;
BEGIN
  -- حساب عدد الطلاب (الفرديين + في المجموعات)
  SELECT COUNT(DISTINCT s.id) INTO students_count
  FROM students s
  LEFT JOIN group_students gs ON gs.student_id = s.id AND gs.is_active = true
  LEFT JOIN student_groups sg ON sg.id = gs.group_id
  WHERE (s.teacher_id = teacher_uuid OR sg.teacher_id = teacher_uuid) 
    AND s.is_active = true;

  -- حساب عدد المجموعات
  SELECT COUNT(*) INTO groups_count
  FROM student_groups
  WHERE teacher_id = teacher_uuid AND is_active = true;

  -- حساب عدد الحصص
  SELECT COUNT(*) INTO sessions_count
  FROM sessions
  WHERE teacher_id = teacher_uuid;

  -- حساب إجمالي الإيرادات (المدفوعات + إيرادات المجموعات)
  SELECT COALESCE(SUM(amount), 0) INTO revenue_amount
  FROM payments
  WHERE teacher_id = teacher_uuid;

  -- إضافة إيرادات المجموعات الشهرية
  SELECT COALESCE(SUM(monthly_price * current_students), 0) INTO groups_revenue
  FROM student_groups
  WHERE teacher_id = teacher_uuid AND is_active = true;

  revenue_amount := revenue_amount + groups_revenue;

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

-- تحديث trigger لتحديث إحصائيات المعلم عند تغيير المجموعات
CREATE OR REPLACE FUNCTION update_teacher_stats_on_group_change()
RETURNS TRIGGER AS $$
BEGIN
  -- تحديث إحصائيات المعلم المرتبط بالمجموعة
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    PERFORM calculate_teacher_stats(NEW.teacher_id);
    
    -- إذا تم تغيير المعلم، تحديث إحصائيات المعلم القديم أيضاً
    IF TG_OP = 'UPDATE' AND OLD.teacher_id != NEW.teacher_id THEN
      PERFORM calculate_teacher_stats(OLD.teacher_id);
    END IF;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM calculate_teacher_stats(OLD.teacher_id);
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- إضافة trigger للمجموعات
DROP TRIGGER IF EXISTS update_teacher_stats_on_groups ON student_groups;
CREATE TRIGGER update_teacher_stats_on_groups
  AFTER INSERT OR UPDATE OR DELETE ON student_groups
  FOR EACH ROW EXECUTE FUNCTION update_teacher_stats_on_group_change();

-- تحديث trigger لطلاب المجموعات
CREATE OR REPLACE FUNCTION update_stats_on_group_students_change()
RETURNS TRIGGER AS $$
DECLARE
  v_teacher_id uuid;
BEGIN
  -- الحصول على معرف المعلم من المجموعة
  SELECT teacher_id INTO v_teacher_id
  FROM student_groups
  WHERE id = COALESCE(NEW.group_id, OLD.group_id);

  -- تحديث إحصائيات المعلم
  IF v_teacher_id IS NOT NULL THEN
    PERFORM calculate_teacher_stats(v_teacher_id);
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- إضافة trigger لطلاب المجموعات
DROP TRIGGER IF EXISTS update_stats_on_group_students ON group_students;
CREATE TRIGGER update_stats_on_group_students
  AFTER INSERT OR UPDATE OR DELETE ON group_students
  FOR EACH ROW EXECUTE FUNCTION update_stats_on_group_students_change();

-- دالة لنقل طالب من مجموعة لأخرى
CREATE OR REPLACE FUNCTION transfer_student_between_groups(
  p_student_id uuid,
  p_from_group_id uuid,
  p_to_group_id uuid
)
RETURNS json AS $$
DECLARE
  v_result json;
BEGIN
  -- إزالة من المجموعة القديمة
  SELECT remove_student_from_group(p_student_id, p_from_group_id) INTO v_result;
  
  IF (v_result->>'success')::boolean = false THEN
    RETURN v_result;
  END IF;

  -- إضافة للمجموعة الجديدة
  SELECT add_student_to_group(p_student_id, p_to_group_id) INTO v_result;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- إنشاء فهارس إضافية لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_group_students_student_active ON group_students(student_id, is_active);
CREATE INDEX IF NOT EXISTS idx_students_grade_subject ON students(grade, subject);
CREATE INDEX IF NOT EXISTS idx_student_groups_grade_active ON student_groups(grade, is_active);

-- تحديث الإحصائيات للمعلمين الموجودين
DO $$
DECLARE
  teacher_record RECORD;
BEGIN
  FOR teacher_record IN SELECT id FROM teachers WHERE is_active = true LOOP
    PERFORM calculate_teacher_stats(teacher_record.id);
  END LOOP;
END $$;