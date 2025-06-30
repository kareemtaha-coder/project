const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// قراءة متغيرات البيئة
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ خطأ: متغيرات البيئة مطلوبة');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✅ موجود' : '❌ مفقود');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ موجود' : '❌ مفقود');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyTeachersMigration() {
  try {
    console.log('🔄 بدء تطبيق migration المدرسين...');
    
    // قراءة ملف migration
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', '20240701_add_sample_teachers.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 قراءة ملف migration...');
    
    // تنفيذ migration
    console.log('⚡ تنفيذ migration...');
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      // إذا فشل exec_sql، نجرب الطريقة البديلة
      console.log('⚠️ exec_sql غير متاح، نجرب الطريقة البديلة...');
      
      // التحقق من وجود مدرسين
      const { data: existingTeachers, error: checkError } = await supabase
        .from('teachers')
        .select('id')
        .limit(1);
      
      if (checkError) {
        console.error('❌ خطأ في التحقق من المدرسين:', checkError);
        return;
      }
      
      if (existingTeachers && existingTeachers.length > 0) {
        console.log('ℹ️ يوجد مدرسين بالفعل في قاعدة البيانات');
        return;
      }
      
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
        .select();
      
      if (insertError) {
        console.error('❌ خطأ في إضافة المدرسين:', insertError);
        return;
      }
      
      console.log('✅ تم إضافة', insertedTeachers.length, 'مدرس بنجاح');
      console.log('📋 المدرسين المضافون:');
      insertedTeachers.forEach(teacher => {
        console.log(`  - ${teacher.name} (${teacher.subject})`);
      });
      
    } else {
      console.log('✅ تم تطبيق migration بنجاح');
    }
    
  } catch (error) {
    console.error('❌ خطأ في تطبيق migration:', error);
  }
}

// تشغيل migration
applyTeachersMigration(); 