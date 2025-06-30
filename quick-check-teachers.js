// ملف تشخيص سريع للتحقق من المدرسين
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ متغيرات البيئة مفقودة!');
  console.log('📝 تأكد من وجود ملف .env مع:');
  console.log('   VITE_SUPABASE_URL=your_url');
  console.log('   VITE_SUPABASE_ANON_KEY=your_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function quickCheck() {
  console.log('🔍 فحص سريع للمدرسين...\n');
  
  try {
    // جلب المدرسين النشطين
    const { data: teachers, error } = await supabase
      .from('teachers')
      .select('id, name, email, subject, is_active')
      .eq('is_active', true)
      .order('name');
    
    if (error) {
      console.error('❌ خطأ:', error.message);
      return;
    }
    
    console.log(`📊 عدد المدرسين النشطين: ${teachers?.length || 0}\n`);
    
    if (!teachers || teachers.length === 0) {
      console.log('⚠️ لا توجد مدرسين نشطين!');
      console.log('💡 سأضيف مدرسين تجريبيين...\n');
      
      const sampleTeachers = [
        {
          name: 'أحمد محمد',
          email: 'ahmed@example.com',
          phone: '+201234567890',
          subject: 'الرياضيات',
          hourly_rate: 150,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          name: 'فاطمة علي',
          email: 'fatima@example.com',
          phone: '+201234567891',
          subject: 'الفيزياء',
          hourly_rate: 140,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      const { data: newTeachers, error: insertError } = await supabase
        .from('teachers')
        .insert(sampleTeachers)
        .select();
      
      if (insertError) {
        console.error('❌ خطأ في الإضافة:', insertError.message);
      } else {
        console.log('✅ تم إضافة مدرسين تجريبيين:');
        newTeachers.forEach(t => console.log(`   - ${t.name} (${t.email})`));
      }
    } else {
      console.log('👥 قائمة المدرسين:');
      teachers.forEach((teacher, index) => {
        console.log(`   ${index + 1}. ${teacher.name} (${teacher.email})`);
      });
    }
    
  } catch (error) {
    console.error('❌ خطأ عام:', error.message);
  }
}

quickCheck().then(() => {
  console.log('\n🎉 انتهى الفحص!');
  process.exit(0);
}); 