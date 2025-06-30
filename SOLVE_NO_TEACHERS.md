# حل مشكلة "لا توجد مدرسين نشطين في النظام"

## المشكلة
عند محاولة إنشاء مجموعة أو إدارة المجموعات، تظهر رسالة "لا توجد مدرسين نشطين في النظام".

## الأسباب المحتملة

1. **جدول `teachers` فارغ**
2. **المدرسين غير نشطين** (`is_active = false`)
3. **مشاكل في RLS policies**
4. **متغيرات البيئة غير صحيحة**
5. **مشاكل في الاتصال بقاعدة البيانات**

## الحلول السريعة

### الحل الأول: فحص وإضافة مدرسين (الأسرع)

```bash
# شغل هذا الأمر مع متغيرات البيئة الخاصة بك
VITE_SUPABASE_URL=your_url VITE_SUPABASE_ANON_KEY=your_key node check-and-add-teachers.js
```

### الحل الثاني: إضافة مدرسين باستخدام Service Role Key

```bash
# شغل هذا الأمر مع Service Role Key
VITE_SUPABASE_URL=your_url SUPABASE_SERVICE_ROLE_KEY=your_service_key node add-teachers-direct.js
```

### الحل الثالث: إضافة مدرسين يدوياً

1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard)
2. اختر مشروعك
3. اذهب إلى **Table Editor** > **teachers**
4. اضغط **Insert row**
5. أضف البيانات التالية:

```json
{
  "name": "أحمد محمد علي",
  "email": "ahmed.mohamed@example.com",
  "phone": "+201234567890",
  "subject": "الرياضيات",
  "hourly_rate": 150,
  "address": "القاهرة، مصر",
  "working_hours_start": "09:00",
  "working_hours_end": "17:00",
  "working_days": ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"],
  "bio": "مدرس رياضيات ذو خبرة 10 سنوات",
  "specializations": ["الجبر", "الهندسة", "التفاضل والتكامل"],
  "experience": 10,
  "qualifications": ["بكالوريوس رياضيات", "دبلوم تربوي"],
  "role": "teacher",
  "is_active": true,
  "rating": 4.8,
  "total_students": 25,
  "total_groups": 5,
  "total_sessions": 120,
  "total_revenue": 18000,
  "preferences": {"language": "ar", "theme": "light"},
  "social_links": {"facebook": "", "twitter": "", "linkedin": ""}
}
```

### الحل الرابع: استخدام SQL Editor

1. اذهب إلى **SQL Editor** في لوحة تحكم Supabase
2. انسخ والصق الكود التالي:

```sql
-- إضافة مدرسين تجريبيين
INSERT INTO teachers (
  name, email, phone, subject, hourly_rate, address,
  working_hours_start, working_hours_end, working_days,
  bio, specializations, experience, qualifications,
  role, is_active, rating, total_students, total_groups,
  total_sessions, total_revenue, preferences, social_links
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
    'مدرس رياضيات ذو خبرة 10 سنوات',
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
    '{"language": "ar", "theme": "light"}',
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
    'مدرسة فيزياء متخصصة',
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
    '{"language": "ar", "theme": "light"}',
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
    'مدرس لغة إنجليزية معتمد',
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
    '{"language": "en", "theme": "dark"}',
    '{"facebook": "", "twitter": "", "linkedin": ""}'
  );
```

## التحقق من النجاح

بعد إضافة المدرسين، تحقق من:

1. **في التطبيق**: اذهب إلى صفحة Teachers أو Groups
2. **في لوحة التحكم**: Table Editor > teachers
3. **باستخدام script**: `node quick-check-teachers.js`

## إذا استمرت المشكلة

### تحقق من RLS Policies

```sql
-- إضافة سياسة للقراءة العامة
CREATE POLICY "Allow public read access" ON teachers
FOR SELECT USING (true);

-- إضافة سياسة للكتابة (إذا كنت تستخدم Service Role Key)
CREATE POLICY "Allow service role insert" ON teachers
FOR INSERT WITH CHECK (true);
```

### تحقق من متغيرات البيئة

تأكد من وجود هذه المتغيرات في ملف `.env` أو في متغيرات البيئة:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### تحقق من هيكل الجدول

تأكد من وجود جميع الأعمدة المطلوبة في جدول `teachers`:

```sql
-- عرض هيكل الجدول
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'teachers';
```

## نصائح إضافية

1. **استخدم Service Role Key** للكتابة في قاعدة البيانات
2. **استخدم Anon Key** للقراءة من التطبيق
3. **تأكد من أن `is_active = true`** للمدرسين
4. **تحقق من RLS policies** قبل إضافة البيانات

## الملفات المفيدة

- `check-and-add-teachers.js` - فحص وإضافة مدرسين
- `add-teachers-direct.js` - إضافة مدرسين باستخدام Service Role Key
- `quick-check-teachers.js` - فحص سريع للمدرسين
- `VERIFY_TEACHERS_GUIDE.md` - دليل شامل للتحقق من المدرسين 