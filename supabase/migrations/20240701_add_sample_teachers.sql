-- Migration لإضافة مدرسين تجريبيين
-- تاريخ: 2024-07-01

-- التحقق من وجود مدرسين حالياً
DO $$
BEGIN
  IF (SELECT COUNT(*) FROM teachers) = 0 THEN
    -- إضافة مدرسين تجريبيين فقط إذا لم يكن هناك مدرسين
    INSERT INTO teachers (
      id, 
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
      join_date,
      rating,
      total_students,
      total_groups,
      total_sessions,
      total_revenue,
      preferences,
      social_links,
      created_at,
      updated_at
    ) VALUES 
      (
        gen_random_uuid(),
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
        now(),
        4.8,
        25,
        5,
        120,
        18000,
        '{"language": "ar", "theme": "light", "notifications": {"email": true, "sms": false, "push": true}}',
        '{"facebook": "", "twitter": "", "linkedin": ""}',
        now(),
        now()
      ),
      (
        gen_random_uuid(),
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
        now(),
        4.9,
        20,
        4,
        100,
        14000,
        '{"language": "ar", "theme": "light", "notifications": {"email": true, "sms": true, "push": false}}',
        '{"facebook": "", "twitter": "", "linkedin": ""}',
        now(),
        now()
      ),
      (
        gen_random_uuid(),
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
        now(),
        4.7,
        30,
        6,
        150,
        19500,
        '{"language": "en", "theme": "dark", "notifications": {"email": true, "sms": false, "push": true}}',
        '{"facebook": "", "twitter": "", "linkedin": ""}',
        now(),
        now()
      ),
      (
        gen_random_uuid(),
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
        now(),
        4.6,
        18,
        3,
        90,
        13050,
        '{"language": "ar", "theme": "auto", "notifications": {"email": true, "sms": true, "push": true}}',
        '{"facebook": "", "twitter": "", "linkedin": ""}',
        now(),
        now()
      ),
      (
        gen_random_uuid(),
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
        now(),
        4.8,
        22,
        4,
        110,
        14850,
        '{"language": "ar", "theme": "light", "notifications": {"email": false, "sms": true, "push": true}}',
        '{"facebook": "", "twitter": "", "linkedin": ""}',
        now(),
        now()
      );
    
    RAISE NOTICE 'تم إضافة 5 مدرسين تجريبيين بنجاح';
  ELSE
    RAISE NOTICE 'يوجد مدرسين بالفعل في قاعدة البيانات';
  END IF;
END $$;

-- إضافة سياسة RLS للقراءة العامة للمدرسين (إذا لم تكن موجودة)
DO $$
BEGIN
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
END $$; 