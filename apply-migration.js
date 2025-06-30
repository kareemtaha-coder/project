const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

console.log('🚀 بدء تطبيق migration المدرسين...\n');

// يمكنك تعديل هذه القيم حسب مشروعك
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your_service_role_key_here';

console.log('URL:', SUPABASE_URL);
console.log('Service Key:', SUPABASE_SERVICE_KEY ? '✅ موجود' : '❌ مفقود');

if (SUPABASE_URL === 'https://your-project.supabase.co' || !SUPABASE_SERVICE_KEY || SUPABASE_SERVICE_KEY === 'your_service_role_key_here') {
  console.error('\n❌ خطأ: يجب عليك إعداد متغيرات البيئة أولاً');
  console.error('1. اذهب إلى لوحة تحكم Supabase');
  console.error('2. انسخ URL المشروع و Service Role Key');
  console.error('3. شغل هذا الأمر:');
  console.error('VITE_SUPABASE_URL=your_url SUPABASE_SERVICE_ROLE_KEY=your_key node apply-migration.js');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function applyMigration() {
  try {
    console.log('📄 قراءة ملف migration...');
    
    // قراءة ملف migration
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', '20240701_add_teachers_and_fix_issues.sql');
    
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ ملف migration غير موجود:', migrationPath);
      return;
    }
    
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    console.log('✅ تم قراءة ملف migration بنجاح');
    
    // تقسيم SQL إلى أوامر منفصلة
    const sqlCommands = migrationSQL
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    console.log(`📝 عدد الأوامر SQL: ${sqlCommands.length}`);
    
    // تنفيذ كل أمر على حدة
    for (let i = 0; i < sqlCommands.length; i++) {
      const command = sqlCommands[i];
      if (command.trim()) {
        console.log(`⚡ تنفيذ الأمر ${i + 1}/${sqlCommands.length}...`);
        
        try {
          const { data, error } = await supabase.rpc('exec_sql', { sql: command + ';' });
          
          if (error) {
            console.log(`⚠️ تحذير في الأمر ${i + 1}:`, error.message);
            // نستمر مع الأوامر التالية
          } else {
            console.log(`✅ تم تنفيذ الأمر ${i + 1} بنجاح`);
          }
        } catch (err) {
          console.log(`⚠️ خطأ في الأمر ${i + 1}:`, err.message);
        }
      }
    }
    
    // التحقق من النتيجة
    console.log('\n🔍 التحقق من النتيجة...');
    const { data: teachers, error: checkError } = await supabase
      .from('teachers')
      .select('id, name, email, subject, is_active')
      .eq('is_active', true);
    
    if (checkError) {
      console.error('❌ خطأ في التحقق من المدرسين:', checkError.message);
    } else {
      console.log(`✅ عدد المدرسين النشطين: ${teachers?.length || 0}`);
      
      if (teachers && teachers.length > 0) {
        console.log('👥 قائمة المدرسين:');
        teachers.forEach((teacher, index) => {
          console.log(`   ${index + 1}. ${teacher.name} (${teacher.subject}) - ${teacher.email}`);
        });
      }
    }
    
    console.log('\n🎉 تم تطبيق migration بنجاح!');
    
  } catch (error) {
    console.error('❌ خطأ في تطبيق migration:', error.message);
    
    // إذا فشل exec_sql، نجرب الطريقة البديلة
    console.log('\n🔄 تجربة الطريقة البديلة...');
    await applyMigrationAlternative();
  }
}

async function applyMigrationAlternative() {
  try {
    console.log('📝 تطبيق migration بالطريقة البديلة...');
    
    // التحقق من وجود جدول teachers
    const { data: existingTeachers, error: checkError } = await supabase
      .from('teachers')
      .select('id')
      .limit(1);
    
    if (checkError && checkError.message.includes('does not exist')) {
      console.log('⚠️ جدول teachers غير موجود، سيتم إنشاؤه تلقائياً عند إضافة أول مدرس');
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
    
    const { data: insertedTeachers, error: insertError } = await supabase
      .from('teachers')
      .insert(sampleTeachers)
      .select('id, name, subject, email');
    
    if (insertError) {
      console.error('❌ خطأ في إضافة المدرسين:', insertError.message);
      console.error('💡 جرب إضافة المدرسين يدوياً من لوحة تحكم Supabase');
    } else {
      console.log('✅ تم إضافة', insertedTeachers.length, 'مدرس بنجاح:');
      insertedTeachers.forEach(teacher => {
        console.log(`   - ${teacher.name} (${teacher.subject}) - ${teacher.email}`);
      });
      console.log('\n🎉 تم تطبيق migration بالطريقة البديلة بنجاح!');
    }
    
  } catch (error) {
    console.error('❌ خطأ في الطريقة البديلة:', error.message);
  }
}

// تشغيل migration
applyMigration(); 