const { createClient } = require('@supabase/supabase-js');

console.log('🔧 فحص وإضافة المدرسين...\n');

// يمكنك تعديل هذه القيم حسب مشروعك
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'your_anon_key_here';

console.log('URL:', SUPABASE_URL);
console.log('Anon Key:', SUPABASE_ANON_KEY ? '✅ موجود' : '❌ مفقود');

if (SUPABASE_URL === 'https://your-project.supabase.co' || !SUPABASE_ANON_KEY || SUPABASE_ANON_KEY === 'your_anon_key_here') {
  console.error('\n❌ خطأ: يجب عليك إعداد متغيرات البيئة أولاً');
  console.error('1. اذهب إلى لوحة تحكم Supabase');
  console.error('2. انسخ URL المشروع و Anon Key');
  console.error('3. شغل هذا الأمر:');
  console.error('VITE_SUPABASE_URL=your_url VITE_SUPABASE_ANON_KEY=your_key node check-and-add-teachers.js');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkAndAddTeachers() {
  try {
    console.log('🔍 التحقق من وجود مدرسين...');
    
    // جلب المدرسين النشطين
    const { data: teachers, error } = await supabase
      .from('teachers')
      .select('id, name, email, subject, is_active')
      .eq('is_active', true)
      .order('name');
    
    if (error) {
      console.error('❌ خطأ في جلب المدرسين:', error.message);
      console.error('تأكد من:');
      console.error('1. وجود جدول teachers');
      console.error('2. صحة متغيرات البيئة');
      console.error('3. إعداد RLS policies');
      return;
    }
    
    console.log(`📊 عدد المدرسين النشطين: ${teachers?.length || 0}\n`);
    
    if (!teachers || teachers.length === 0) {
      console.log('⚠️ لا توجد مدرسين نشطين!');
      console.log('💡 سأضيف مدرسين تجريبيين...\n');
      
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
          bio: 'مدرس رياضيات ذو خبرة 10 سنوات',
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
          bio: 'مدرسة فيزياء متخصصة',
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
          bio: 'مدرس لغة إنجليزية معتمد',
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
      
      const { data: newTeachers, error: insertError } = await supabase
        .from('teachers')
        .insert(sampleTeachers)
        .select('id, name, subject, email');
      
      if (insertError) {
        console.error('❌ خطأ في إضافة المدرسين:', insertError.message);
        console.error('قد تحتاج إلى Service Role Key للكتابة');
        console.error('جرب تشغيل: node add-teachers-direct.js');
      } else {
        console.log('✅ تم إضافة', newTeachers.length, 'مدرس بنجاح:');
        newTeachers.forEach(teacher => {
          console.log(`   - ${teacher.name} (${teacher.subject}) - ${teacher.email}`);
        });
        console.log('\n🎉 يمكنك الآن إنشاء مجموعات وربطها بالمدرسين!');
      }
    } else {
      console.log('👥 قائمة المدرسين النشطين:');
      teachers.forEach((teacher, index) => {
        console.log(`   ${index + 1}. ${teacher.name} (${teacher.subject}) - ${teacher.email}`);
      });
      console.log('\n✅ يوجد مدرسين نشطين في النظام!');
    }
    
  } catch (error) {
    console.error('❌ خطأ عام:', error.message);
  }
}

// تشغيل الفحص
checkAndAddTeachers(); 