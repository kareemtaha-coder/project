# اختبار إنشاء مجموعة جديدة

## البيانات المطلوبة لإنشاء مجموعة:

### 1. المعلومات الأساسية
- **اسم المجموعة**: نص مطلوب
- **المدرس**: معرف المدرس (teacher_id) - مطلوب
- **المادة**: معرف المادة (subject_id) - مطلوب
- **الصف الدراسي**: نص مطلوب
- **الوصف**: نص اختياري

### 2. الإعدادات المالية
- **السعر الشهري**: رقم - مطلوب
- **الحد الأقصى للطلاب**: رقم - مطلوب (افتراضي: 10)
- **عدد الطلاب الحاليين**: رقم - مطلوب (افتراضي: 0)

### 3. الإعدادات الزمنية
- **تاريخ البداية**: تاريخ - مطلوب
- **تاريخ النهاية**: تاريخ - مطلوب
- **المواعيد**: قائمة مواعيد - مطلوب (موعد واحد على الأقل)

### 4. إعدادات إضافية
- **الموقع**: نص اختياري
- **الحالة**: نشط/غير نشط - مطلوب (افتراضي: نشط)

## هيكل البيانات المرسلة لقاعدة البيانات:

```typescript
interface SaveGroupPayload {
  name: string;
  subject_id: string;
  grade: string;
  description: string;
  monthly_price: number;
  max_students: number;
  current_students: number;
  location: string;
  is_active: boolean;
  teacher_id: string;
  start_date: string;
  end_date: string;
  schedule: GroupSchedule[];
}
```

## خطوات الاختبار:

1. **فتح نافذة إدارة المجموعات**
2. **النقر على "إضافة مجموعة"**
3. **ملء البيانات المطلوبة**
4. **إضافة موعد واحد على الأقل**
5. **النقر على "حفظ"**

## التحقق من النتائج:

- يجب أن تظهر المجموعة الجديدة في قائمة المجموعات
- يجب أن يتم حفظ المواعيد في جدول `group_schedules`
- يجب أن تكون جميع الحقول محفوظة بالشكل الصحيح

## الأخطاء المحتملة:

1. **خطأ في أسماء الحقول**: تأكد من استخدام snake_case
2. **خطأ في العلاقات**: تأكد من وجود المدرس والمادة
3. **خطأ في المواعيد**: تأكد من إضافة موعد واحد على الأقل
4. **خطأ في التواريخ**: تأكد من صحة تنسيق التاريخ 