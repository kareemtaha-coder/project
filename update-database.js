const { createClient } = require('@supabase/supabase-js');

console.log('🔄 Updating database with teachers...\n');

// You need to set these environment variables before running
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Error: Environment variables are missing!');
  console.error('Please set these environment variables:');
  console.error('VITE_SUPABASE_URL=your_project_url');
  console.error('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
  console.error('\nOr run this command:');
  console.error('VITE_SUPABASE_URL=your_url SUPABASE_SERVICE_ROLE_KEY=your_key node update-database.js');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function updateDatabase() {
  try {
    console.log('🔍 Checking current teachers...');
    
    // Check if teachers exist
    const { data: existingTeachers, error: checkError } = await supabase
      .from('teachers')
      .select('id, name, email')
      .limit(5);
    
    if (checkError) {
      console.log('⚠️ Teachers table might not exist, will create it...');
    } else if (existingTeachers && existingTeachers.length > 0) {
      console.log('✅ Teachers already exist:');
      existingTeachers.forEach(teacher => {
        console.log(`   - ${teacher.name} (${teacher.email})`);
      });
      return;
    }
    
    console.log('📝 Adding sample teachers...');
    
    // Add sample teachers
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
      console.error('❌ Error adding teachers:', insertError.message);
      console.error('💡 Try adding teachers manually from Supabase Dashboard');
      return;
    }
    
    console.log('✅ Successfully added', insertedTeachers.length, 'teachers:');
    insertedTeachers.forEach(teacher => {
      console.log(`   - ${teacher.name} (${teacher.subject}) - ${teacher.email}`);
    });
    
    console.log('\n🎉 Database updated successfully!');
    console.log('You can now create groups and assign them to teachers.');
    
  } catch (error) {
    console.error('❌ Error updating database:', error.message);
  }
}

// Run the update
updateDatabase(); 