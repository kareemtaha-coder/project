# دليل التأكد من إضافة المدرسين لقاعدة البيانات

## 🎯 الهدف
التأكد من وجود مدرسين في قاعدة البيانات لحل مشكلة عدم ظهور أسماء المدرسين عند إنشاء مجموعة جديدة.

## 📋 خطوات التحقق والإضافة

### الطريقة الأولى: استخدام ملف التشخيص (الأسهل)

#### الخطوة 1: تثبيت المتطلبات
```bash
# التأكد من وجود dotenv
npm install dotenv

# أو إذا لم يكن مثبتاً
npm install dotenv @supabase/supabase-js
```

#### الخطوة 2: تشغيل ملف التشخيص
```bash
node check-teachers-db.js
```

**النتيجة المتوقعة:**
```
🔍 بدء تشخيص قاعدة البيانات...
📋 معلومات الاتصال:
   URL: ✅ متوفر
   Key: ✅ متوفر

🔍 التحقق من قاعدة البيانات...

1️⃣ اختبار الاتصال...
✅ الاتصال ناجح

2️⃣ التحقق من جدول teachers...
✅ جدول teachers موجود

3️⃣ جلب إحصائيات المدرسين...
📊 إجمالي المدرسين: 0

4️⃣ جلب قائمة المدرسين...
⚠️ لا توجد مدرسين في قاعدة البيانات
💡 سأقوم بإضافة مدرسين تجريبيين...

➕ إضافة مدرسين تجريبيين...
✅ تم إضافة المدرسين التجريبيين بنجاح
   - أحمد محمد علي (ahmed.mohamed@example.com)
   - فاطمة أحمد حسن (fatima.ahmed@example.com)
```

### الطريقة الثانية: استخدام Supabase SQL Editor

#### الخطوة 1: فتح Supabase Dashboard
1. اذهب إلى [supabase.com](https://supabase.com)
2. سجل دخولك إلى حسابك
3. اختر مشروعك

#### الخطوة 2: فتح SQL Editor
1. من القائمة الجانبية، اختر **SQL Editor**
2. انقر على **New Query**

#### الخطوة 3: تشغيل الاستعلام
انسخ والصق محتوى ملف `add-teachers-direct.sql` واضغط **Run**

**النتيجة المتوقعة:**
```
=== التحقق من المدرسين الحاليين ===
total_teachers: 0
active_teachers: 0

=== بعد إضافة المدرسين ===
total_teachers: 5
active_teachers: 5

=== قائمة المدرسين النشطين ===
id | name | email | subject | hourly_rate | is_active | created_at
---|------|-------|---------|-------------|-----------|------------
... | أحمد محمد علي | ahmed.mohamed@example.com | الرياضيات | 150 | true | 2024-...
... | فاطمة أحمد حسن | fatima.ahmed@example.com | الفيزياء | 140 | true | 2024-...
... | محمد علي محمود | mohamed.ali@example.com | اللغة الإنجليزية | 130 | true | 2024-...
... | سارة محمود أحمد | sara.mahmoud@example.com | الكيمياء | 145 | true | 2024-...
... | علي حسن محمد | ali.hassan@example.com | اللغة العربية | 135 | true | 2024-...
```

### الطريقة الثالثة: التحقق اليدوي

#### الخطوة 1: فتح Table Editor
1. في Supabase Dashboard، اختر **Table Editor**
2. اختر جدول **teachers**

#### الخطوة 2: التحقق من البيانات
- يجب أن ترى قائمة بالمدرسين
- تأكد من أن `is_active = true` للمدرسين

#### الخطوة 3: إضافة مدرس يدوياً (اختياري)
```sql
INSERT INTO teachers (
  name, 
  email, 
  phone,
  subject,
  hourly_rate,
  is_active,
  created_at,
  updated_at
) VALUES (
  'مدرس تجريبي',
  'test@example.com',
  '+201234567890',
  'الرياضيات',
  150,
  true,
  now(),
  now()
);
```

## 🔍 التحقق من النتيجة

### في التطبيق:
1. **إعادة تشغيل التطبيق**
2. **فتح نافذة إدارة المجموعات**
3. **النقر على "إضافة مجموعة"**
4. **التحقق من ظهور قائمة المدرسين**

### في Console المتصفح:
1. **فتح Developer Tools (F12)**
2. **الذهاب إلى Console**
3. **البحث عن رسالة "Teachers loaded:"**
4. **التحقق من عدد المدرسين**

### في Network Tab:
1. **فتح Developer Tools**
2. **الذهاب إلى Network**
3. **فتح نافذة إدارة المجموعات**
4. **البحث عن استعلام Supabase للمدرسين**

## 🚨 حل المشاكل الشائعة

### مشكلة 1: "Missing Supabase environment variables"
**الحل:**
```bash
# تأكد من وجود ملف .env في مجلد المشروع
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### مشكلة 2: "relation 'teachers' does not exist"
**الحل:**
```sql
-- إنشاء جدول teachers
CREATE TABLE IF NOT EXISTS teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  phone text,
  subject text,
  hourly_rate integer DEFAULT 150,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### مشكلة 3: "permission denied"
**الحل:**
```sql
-- إضافة سياسة RLS للقراءة العامة
CREATE POLICY "Allow public read access" ON teachers
FOR SELECT USING (true);
```

### مشكلة 4: "Teachers loaded: []"
**الحل:**
- تأكد من وجود مدرسين في قاعدة البيانات
- تأكد من أن `is_active = true`
- تحقق من سياسات RLS

## ✅ قائمة التحقق النهائية

- [ ] تم تشغيل ملف التشخيص بنجاح
- [ ] تم إضافة مدرسين تجريبيين
- [ ] يظهر عدد المدرسين في نافذة إدارة المجموعات
- [ ] تظهر قائمة المدرسين عند إنشاء مجموعة جديدة
- [ ] يمكن اختيار مدرس من القائمة
- [ ] لا توجد أخطاء في Console المتصفح

## 📞 إذا استمرت المشكلة

1. **فحص سجلات Supabase** في Dashboard
2. **التأكد من إعدادات المشروع**
3. **مراجعة سياسات RLS**
4. **التواصل مع دعم Supabase**

## 🎉 النتيجة المتوقعة

بعد اتباع هذه الخطوات، يجب أن تظهر أسماء المدرسين في قائمة الاختيار عند إنشاء مجموعة جديدة، وستتمكن من اختيار مدرس للمجموعة بنجاح! 