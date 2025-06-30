# دليل حل مشكلة exec_sql وإضافة المدرسين

## المشكلة
```
"Could not find the function public.exec_sql(sql) in the schema cache"
```

هذا الخطأ يحدث لأن دالة `exec_sql` غير متاحة في جميع مشاريع Supabase.

## الحلول المتاحة

### الحل الأول: استخدام Supabase CLI (الأفضل)

1. **تثبيت Supabase CLI**:
   ```bash
   npm install -g supabase
   ```

2. **تسجيل الدخول إلى Supabase**:
   ```bash
   supabase login
   ```

3. **ربط المشروع**:
   ```bash
   supabase link --project-ref YOUR_PROJECT_ID
   ```

4. **تطبيق migration**:
   ```bash
   supabase db push
   ```

### الحل الثاني: استخدام SQL Editor في لوحة التحكم

1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard)
2. اختر مشروعك
3. اذهب إلى **SQL Editor**
4. انسخ محتوى ملف `supabase/migrations/20240701_add_sample_teachers.sql`
5. الصق الكود واضغط **Run**

### الحل الثالث: استخدام Script Node.js

1. **إعداد متغيرات البيئة**:
   ```bash
   # في Windows
   set VITE_SUPABASE_URL=your_project_url
   set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # في Linux/Mac
   export VITE_SUPABASE_URL=your_project_url
   export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. **تشغيل script إضافة المدرسين**:
   ```bash
   node add-teachers-direct.js
   ```

### الحل الرابع: إضافة المدرسين يدوياً

1. اذهب إلى **Table Editor** في لوحة تحكم Supabase
2. اختر جدول `teachers`
3. اضغط **Insert row**
4. أضف البيانات التالية:

#### مدرس 1:
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

#### مدرس 2:
```json
{
  "name": "فاطمة أحمد حسن",
  "email": "fatima.ahmed@example.com",
  "phone": "+201234567891",
  "subject": "الفيزياء",
  "hourly_rate": 140,
  "address": "الإسكندرية، مصر",
  "working_hours_start": "10:00",
  "working_hours_end": "18:00",
  "working_days": ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"],
  "bio": "مدرسة فيزياء متخصصة",
  "specializations": ["الميكانيكا", "الكهرباء", "الموجات"],
  "experience": 8,
  "qualifications": ["بكالوريوس فيزياء", "ماجستير فيزياء"],
  "role": "teacher",
  "is_active": true,
  "rating": 4.9,
  "total_students": 20,
  "total_groups": 4,
  "total_sessions": 100,
  "total_revenue": 14000,
  "preferences": {"language": "ar", "theme": "light"},
  "social_links": {"facebook": "", "twitter": "", "linkedin": ""}
}
```

#### مدرس 3:
```json
{
  "name": "محمد علي محمود",
  "email": "mohamed.ali@example.com",
  "phone": "+201234567892",
  "subject": "اللغة الإنجليزية",
  "hourly_rate": 130,
  "address": "الجيزة، مصر",
  "working_hours_start": "08:00",
  "working_hours_end": "16:00",
  "working_days": ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء"],
  "bio": "مدرس لغة إنجليزية معتمد",
  "specializations": ["قواعد اللغة", "المحادثة", "الكتابة"],
  "experience": 12,
  "qualifications": ["بكالوريوس أدب إنجليزي", "شهادة CELTA"],
  "role": "teacher",
  "is_active": true,
  "rating": 4.7,
  "total_students": 30,
  "total_groups": 6,
  "total_sessions": 150,
  "total_revenue": 19500,
  "preferences": {"language": "en", "theme": "dark"},
  "social_links": {"facebook": "", "twitter": "", "linkedin": ""}
}
```

## التحقق من النجاح

بعد إضافة المدرسين، يمكنك التحقق من نجاح العملية:

1. **في لوحة التحكم**: اذهب إلى Table Editor > teachers
2. **في التطبيق**: اذهب إلى صفحة Teachers أو Groups
3. **باستخدام script**: شغل `node quick-check-teachers.js`

## ملاحظات مهمة

- تأكد من وجود جدول `teachers` في قاعدة البيانات
- تأكد من صحة هيكل الجدول (الأعمدة)
- تأكد من إعداد RLS policies بشكل صحيح
- استخدم Service Role Key للكتابة، و Anon Key للقراءة

## إذا استمرت المشكلة

1. تحقق من **Database Logs** في لوحة التحكم
2. تحقق من **RLS Policies** للجدول
3. تأكد من صحة **Environment Variables**
4. راجع ملف `VERIFY_TEACHERS_GUIDE.md` للمزيد من التفاصيل 