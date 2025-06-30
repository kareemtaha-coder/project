# دليل تطبيق Migration المدرسين

## الخطوات السريعة

### الطريقة الأولى: استخدام Script (الأسرع)

1. **إعداد متغيرات البيئة**:
   ```bash
   # في Windows
   set VITE_SUPABASE_URL=your_project_url
   set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # في Linux/Mac
   export VITE_SUPABASE_URL=your_project_url
   export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. **تشغيل migration**:
   ```bash
   node apply-migration.js
   ```

### الطريقة الثانية: استخدام Supabase CLI

1. **تثبيت Supabase CLI**:
   ```bash
   npm install -g supabase
   ```

2. **تسجيل الدخول**:
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

### الطريقة الثالثة: استخدام SQL Editor

1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard)
2. اختر مشروعك
3. اذهب إلى **SQL Editor**
4. انسخ محتوى ملف `supabase/migrations/20240701_add_teachers_and_fix_issues.sql`
5. الصق الكود واضغط **Run**

## ما يفعله Migration

### 1. إنشاء جدول teachers (إذا لم يكن موجوداً)
```sql
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
```

### 2. إضافة 5 مدرسين تجريبيين
- أحمد محمد علي (الرياضيات)
- فاطمة أحمد حسن (الفيزياء)
- محمد علي محمود (اللغة الإنجليزية)
- سارة محمود أحمد (الكيمياء)
- علي حسن محمد (اللغة العربية)

### 3. إعداد RLS Policies
```sql
-- قراءة عامة
CREATE POLICY "Allow public read access" ON teachers
FOR SELECT USING (true);

-- كتابة للمستخدمين المصرح لهم
CREATE POLICY "Allow authenticated insert" ON teachers
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- تحديث للمستخدمين المصرح لهم
CREATE POLICY "Allow authenticated update" ON teachers
FOR UPDATE USING (auth.role() = 'authenticated');
```

### 4. تفعيل RLS و Triggers
- تفعيل Row Level Security
- إنشاء trigger لتحديث `updated_at`

## التحقق من النجاح

### في التطبيق
1. اذهب إلى صفحة **Teachers**
2. اذهب إلى صفحة **Groups** > **Add Group**
3. تحقق من ظهور المدرسين في قائمة الاختيار

### في لوحة التحكم
1. اذهب إلى **Table Editor** > **teachers**
2. تحقق من وجود 5 مدرسين نشطين

### باستخدام Script
```bash
node quick-check-teachers.js
```

## إذا واجهت مشاكل

### خطأ "exec_sql not found"
```bash
# استخدم الطريقة البديلة
node add-teachers-direct.js
```

### خطأ في RLS Policies
```sql
-- إضافة سياسة للقراءة العامة
CREATE POLICY "Allow public read access" ON teachers
FOR SELECT USING (true);
```

### خطأ في الاتصال
1. تحقق من صحة URL المشروع
2. تحقق من صحة Service Role Key
3. تأكد من وجود جدول `teachers`

## الملفات المهمة

- `supabase/migrations/20240701_add_teachers_and_fix_issues.sql` - ملف Migration
- `apply-migration.js` - Script لتطبيق Migration
- `add-teachers-direct.js` - Script بديل لإضافة المدرسين
- `quick-check-teachers.js` - Script للتحقق من المدرسين

## ملاحظات مهمة

1. **Service Role Key** مطلوب للكتابة في قاعدة البيانات
2. **Anon Key** كافي للقراءة من التطبيق
3. تأكد من أن `is_active = true` للمدرسين
4. RLS policies ضرورية للوصول للبيانات

## الخطوات التالية

بعد تطبيق migration بنجاح:

1. **اختبر التطبيق**: اذهب إلى صفحة Groups وأنشئ مجموعة جديدة
2. **تحقق من المدرسين**: تأكد من ظهورهم في قوائم الاختيار
3. **اختبر إدارة المجموعات**: جرب ربط المجموعات بالمدرسين

## الدعم

إذا واجهت أي مشاكل:

1. راجع `SOLVE_NO_TEACHERS.md`
2. راجع `VERIFY_TEACHERS_GUIDE.md`
3. تحقق من Database Logs في لوحة تحكم Supabase 