const { createClient } = require('@supabase/supabase-js');

// يمكنك تعديل هذه القيم حسب مشروعك
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your_service_role_key_here';

console.log('🔧 إعداد Supabase...');
console.log('URL:', SUPABASE_URL);
console.log('Service Key:', SUPABASE_SERVICE_KEY ? '✅ موجود' : '❌ مفقود');

if (SUPABASE_URL === 'https://your-project.supabase.co' || !SUPABASE_SERVICE_KEY || SUPABASE_SERVICE_KEY === 'your_service_role_key_here') {
  console.error('\n❌ خطأ: يجب عليك إعداد متغيرات البيئة أولاً');
  console.error('1. اذهب إلى لوحة تحكم Supabase');
  console.error('2. انسخ URL المشروع و Service Role Key');
  console.error('3. أضفهم إلى متغيرات البيئة أو عدل هذا الملف');
  console.error('\nأو يمكنك تشغيل هذا الأمر:');
  console.error('VITE_SUPABASE_URL=your_url SUPABASE_SERVICE_ROLE_KEY=your_key node add-teachers-direct.js');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function addSampleTeachers() {
  try {
    console.log('\n🔄 بدء إضافة مدرسين تجريبيين...');
    
    // التحقق من وجود مدرسين
    console.log('🔍 التحقق من وجود مدرسين حالياً...');
    const { data: existingTeachers, error: checkError } = await supabase
      .from('teachers')
      .select('id, name')
      .limit(5);
    
    if (checkError) {
      console.error('❌ خطأ في التحقق من المدرسين:', checkError);
      console.error('تأكد من:');
      console.error('1. صحة URL المشروع');
      console.error('2. صحة Service Role Key');
      console.error('3. وجود جدول teachers في قاعدة البيانات');
      return;
    }
    
    if (existingTeachers && existingTeachers.length > 0) {
      console.log('ℹ️ يوجد مدرسين بالفعل في قاعدة البيانات:');
      existingTeachers.forEach(teacher => {
        console.log(`  - ${teacher.name}`);
      });
      return;
    }
    
    console.log('📝 إضافة مدرسين تجريبيين...');
    
    // إضافة مدرسين تجريبيين
    const sampleTeachers = [
      {
        name: 'أحمد محمد علي',
        email: 'ahmed.mohamed@example.com',
        phone: '+201234567890',
        subject: 'الرياضيات',
        hourly_rate: 150,
        address: 'القاهرة، مصر',
        working_hours_start: '09:00',
        working_hours_end: '17:00',
        working_days: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
        bio: 'مدرس رياضيات ذو خبرة 10 سنوات في تدريس المراحل الإعدادية والثانوية',
        specializations: ['الجبر', 'الهندسة', 'التفاضل والتكامل'],
        experience: 10,
        qualifications: ['بكالوريوس رياضيات', 'دبلوم تربوي'],
        role: 'teacher',
        is_active: true,
        rating: 4.8,
        total_students: 25,
        total_groups: 5,
        total_sessions: 120,
        total_revenue: 18000,
        preferences: { language: 'ar', theme: 'light', notifications: { email: true, sms: false, push: true } },
        social_links: { facebook: '', twitter: '', linkedin: '' }
      },
      {
        name: 'فاطمة أحمد حسن',
        email: 'fatima.ahmed@example.com',
        phone: '+201234567891',
        subject: 'الفيزياء',
        hourly_rate: 140,
        address: 'الإسكندرية، مصر',
        working_hours_start: '10:00',
        working_hours_end: '18:00',
        working_days: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
        bio: 'مدرسة فيزياء متخصصة في تدريس الفيزياء للمرحلة الثانوية',
        specializations: ['الميكانيكا', 'الكهرباء', 'الموجات'],
        experience: 8,
        qualifications: ['بكالوريوس فيزياء', 'ماجستير فيزياء'],
        role: 'teacher',
        is_active: true,
        rating: 4.9,
        total_students: 20,
        total_groups: 4,
        total_sessions: 100,
        total_revenue: 14000,
        preferences: { language: 'ar', theme: 'light', notifications: { email: true, sms: true, push: false } },
        social_links: { facebook: '', twitter: '', linkedin: '' }
      },
      {
        name: 'محمد علي محمود',
        email: 'mohamed.ali@example.com',
        phone: '+201234567892',
        subject: 'اللغة الإنجليزية',
        hourly_rate: 130,
        address: 'الجيزة، مصر',
        working_hours_start: '08:00',
        working_hours_end: '16:00',
        working_days: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء'],
        bio: 'مدرس لغة إنجليزية معتمد من جامعة كامبريدج',
        specializations: ['قواعد اللغة', 'المحادثة', 'الكتابة'],
        experience: 12,
        qualifications: ['بكالوريوس أدب إنجليزي', 'شهادة CELTA'],
        role: 'teacher',
        is_active: true,
        rating: 4.7,
        total_students: 30,
        total_groups: 6,
        total_sessions: 150,
        total_revenue: 19500,
        preferences: { language: 'en', theme: 'dark', notifications: { email: true, sms: false, push: true } },
        social_links: { facebook: '', twitter: '', linkedin: '' }
      }
    ];
    
    const { data: insertedTeachers, error: insertError } = await supabase
      .from('teachers')
      .insert(sampleTeachers)
      .select('id, name, subject, email');
    
    if (insertError) {
      console.error('❌ خطأ في إضافة المدرسين:', insertError);
      console.error('تأكد من:');
      console.error('1. وجود جدول teachers');
      console.error('2. صحة هيكل الجدول');
      console.error('3. صلاحيات الكتابة');
      return;
    }
    
    console.log('✅ تم إضافة', insertedTeachers.length, 'مدرس بنجاح');
    console.log('📋 المدرسين المضافون:');
    insertedTeachers.forEach(teacher => {
      console.log(`  - ${teacher.name} (${teacher.subject}) - ${teacher.email}`);
    });
    
    console.log('\n🎉 تم إضافة المدرسين بنجاح! يمكنك الآن إنشاء مجموعات وربطها بالمدرسين.');
    
  } catch (error) {
    console.error('❌ خطأ في إضافة المدرسين:', error);
  }
}

// تشغيل script
addSampleTeachers(); 