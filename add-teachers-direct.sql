-- إضافة مدرسين تجريبيين مباشرة لقاعدة البيانات
-- يمكن تشغيل هذا الملف في Supabase SQL Editor

-- التحقق من وجود مدرسين حالياً
SELECT '=== التحقق من المدرسين الحاليين ===' as info;
SELECT COUNT(*) as total_teachers FROM teachers;
SELECT COUNT(*) as active_teachers FROM teachers WHERE is_active = true;

-- إضافة مدرسين تجريبيين
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
  )
ON CONFLICT (email) DO NOTHING;

-- التحقق من إضافة المدرسين
SELECT '=== بعد إضافة المدرسين ===' as info;
SELECT COUNT(*) as total_teachers FROM teachers;
SELECT COUNT(*) as active_teachers FROM teachers WHERE is_active = true;

-- عرض المدرسين النشطين
SELECT '=== قائمة المدرسين النشطين ===' as info;
SELECT 
  id,
  name,
  email,
  subject,
  hourly_rate,
  is_active,
  created_at
FROM teachers 
WHERE is_active = true 
ORDER BY name;

-- عرض إحصائيات المدرسين
SELECT '=== إحصائيات المدرسين ===' as info;
SELECT 
  subject,
  COUNT(*) as teacher_count,
  AVG(hourly_rate) as avg_hourly_rate,
  AVG(rating) as avg_rating
FROM teachers 
WHERE is_active = true 
GROUP BY subject 
ORDER BY teacher_count DESC; 