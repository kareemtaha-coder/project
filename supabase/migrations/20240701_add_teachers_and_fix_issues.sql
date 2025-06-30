-- Migration شامل لإضافة مدرسين تجريبيين وإصلاح المشاكل
-- تاريخ: 2024-07-01

-- التحقق من وجود جدول teachers وإنشاؤه إذا لم يكن موجوداً
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'teachers') THEN
    CREATE TABLE teachers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(50),
      subject VARCHAR(100),
      hourly_rate DECIMAL(10,2),
      address TEXT,
      working_hours_start TIME,
      working_hours_end TIME,
      working_days TEXT[],
      bio TEXT,
      specializations TEXT[],
      experience INTEGER,
      qualifications TEXT[],
      role VARCHAR(50) DEFAULT 'teacher',
      is_active BOOLEAN DEFAULT true,
      join_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
      rating DECIMAL(3,2),
      total_students INTEGER DEFAULT 0,
      total_groups INTEGER DEFAULT 0,
      total_sessions INTEGER DEFAULT 0,
      total_revenue DECIMAL(12,2) DEFAULT 0,
      preferences JSONB DEFAULT '{}',
      social_links JSONB DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    RAISE NOTICE 'تم إنشاء جدول teachers';
  ELSE
    RAISE NOTICE 'جدول teachers موجود بالفعل';
  END IF;
END $$;

-- إضافة مدرسين تجريبيين إذا لم يكونوا موجودين
DO $$
BEGIN
  IF (SELECT COUNT(*) FROM teachers) = 0 THEN
    INSERT INTO teachers (
      name, 
      email, 
      phone,
      subject,
      hourly_rate,
      address,
      working_hours_start,
      working_hours_end,
      working_days,
      bio,
      specializations,
      experience,
      qualifications,
      role,
      is_active,
      rating,
      total_students,
      total_groups,
      total_sessions,
      total_revenue,
      preferences,
      social_links
    ) VALUES 
      (
        'أحمد محمد علي',
        'ahmed.mohamed@example.com',
        '+201234567890',
        'الرياضيات',
        150,
        'القاهرة، مصر',
        '09:00',
        '17:00',
        ARRAY['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
        'مدرس رياضيات ذو خبرة 10 سنوات في تدريس المراحل الإعدادية والثانوية',
        ARRAY['الجبر', 'الهندسة', 'التفاضل والتكامل'],
        10,
        ARRAY['بكالوريوس رياضيات', 'دبلوم تربوي'],
        'teacher',
        true,
        4.8,
        25,
        5,
        120,
        18000,
        '{"language": "ar", "theme": "light", "notifications": {"email": true, "sms": false, "push": true}}',
        '{"facebook": "", "twitter": "", "linkedin": ""}'
      ),
      (
        'فاطمة أحمد حسن',
        'fatima.ahmed@example.com',
        '+201234567891',
        'الفيزياء',
        140,
        'الإسكندرية، مصر',
        '10:00',
        '18:00',
        ARRAY['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
        'مدرسة فيزياء متخصصة في تدريس الفيزياء للمرحلة الثانوية',
        ARRAY['الميكانيكا', 'الكهرباء', 'الموجات'],
        8,
        ARRAY['بكالوريوس فيزياء', 'ماجستير فيزياء'],
        'teacher',
        true,
        4.9,
        20,
        4,
        100,
        14000,
        '{"language": "ar", "theme": "light", "notifications": {"email": true, "sms": true, "push": false}}',
        '{"facebook": "", "twitter": "", "linkedin": ""}'
      ),
      (
        'محمد علي محمود',
        'mohamed.ali@example.com',
        '+201234567892',
        'اللغة الإنجليزية',
        130,
        'الجيزة، مصر',
        '08:00',
        '16:00',
        ARRAY['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء'],
        'مدرس لغة إنجليزية معتمد من جامعة كامبريدج',
        ARRAY['قواعد اللغة', 'المحادثة', 'الكتابة'],
        12,
        ARRAY['بكالوريوس أدب إنجليزي', 'شهادة CELTA'],
        'teacher',
        true,
        4.7,
        30,
        6,
        150,
        19500,
        '{"language": "en", "theme": "dark", "notifications": {"email": true, "sms": false, "push": true}}',
        '{"facebook": "", "twitter": "", "linkedin": ""}'
      ),
      (
        'سارة محمود أحمد',
        'sara.mahmoud@example.com',
        '+201234567893',
        'الكيمياء',
        145,
        'المنصورة، مصر',
        '09:30',
        '17:30',
        ARRAY['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
        'مدرسة كيمياء متخصصة في الكيمياء العضوية والغير عضوية',
        ARRAY['الكيمياء العضوية', 'الكيمياء الغير عضوية', 'الكيمياء التحليلية'],
        9,
        ARRAY['بكالوريوس كيمياء', 'ماجستير كيمياء'],
        'teacher',
        true,
        4.6,
        18,
        3,
        90,
        13050,
        '{"language": "ar", "theme": "auto", "notifications": {"email": true, "sms": true, "push": true}}',
        '{"facebook": "", "twitter": "", "linkedin": ""}'
      ),
      (
        'علي حسن محمد',
        'ali.hassan@example.com',
        '+201234567894',
        'اللغة العربية',
        135,
        'أسيوط، مصر',
        '08:30',
        '16:30',
        ARRAY['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء'],
        'مدرس لغة عربية متخصص في الأدب والنصوص',
        ARRAY['النحو', 'الأدب', 'البلاغة'],
        11,
        ARRAY['بكالوريوس أدب عربي', 'دبلوم تربوي'],
        'teacher',
        true,
        4.8,
        22,
        4,
        110,
        14850,
        '{"language": "ar", "theme": "light", "notifications": {"email": false, "sms": true, "push": true}}',
        '{"facebook": "", "twitter": "", "linkedin": ""}'
      );
    
    RAISE NOTICE 'تم إضافة 5 مدرسين تجريبيين بنجاح';
  ELSE
    RAISE NOTICE 'يوجد مدرسين بالفعل في قاعدة البيانات';
  END IF;
END $$;

-- إضافة سياسات RLS للمدرسين
DO $$
BEGIN
  -- سياسة القراءة العامة
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'teachers' 
    AND policyname = 'Allow public read access'
  ) THEN
    CREATE POLICY "Allow public read access" ON teachers
    FOR SELECT USING (true);
    RAISE NOTICE 'تم إضافة سياسة القراءة العامة للمدرسين';
  ELSE
    RAISE NOTICE 'سياسة القراءة العامة موجودة بالفعل';
  END IF;

  -- سياسة الكتابة للمستخدمين المصرح لهم
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'teachers' 
    AND policyname = 'Allow authenticated insert'
  ) THEN
    CREATE POLICY "Allow authenticated insert" ON teachers
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    RAISE NOTICE 'تم إضافة سياسة الكتابة للمدرسين';
  ELSE
    RAISE NOTICE 'سياسة الكتابة موجودة بالفعل';
  END IF;

  -- سياسة التحديث للمستخدمين المصرح لهم
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'teachers' 
    AND policyname = 'Allow authenticated update'
  ) THEN
    CREATE POLICY "Allow authenticated update" ON teachers
    FOR UPDATE USING (auth.role() = 'authenticated');
    RAISE NOTICE 'تم إضافة سياسة التحديث للمدرسين';
  ELSE
    RAISE NOTICE 'سياسة التحديث موجودة بالفعل';
  END IF;
END $$;

-- تفعيل RLS على جدول teachers
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- إنشاء trigger لتحديث updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_teachers_updated_at'
  ) THEN
    CREATE TRIGGER update_teachers_updated_at
      BEFORE UPDATE ON teachers
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    RAISE NOTICE 'تم إنشاء trigger لتحديث updated_at';
  ELSE
    RAISE NOTICE 'trigger updated_at موجود بالفعل';
  END IF;
END $$;

-- التحقق من النتيجة النهائية
SELECT 
  'Migration completed successfully' as status,
  COUNT(*) as total_teachers,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_teachers
FROM teachers; 