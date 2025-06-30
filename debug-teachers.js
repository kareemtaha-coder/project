// ملف للتحقق من وجود مدرسين في قاعدة البيانات
const { createClient } = require('@supabase/supabase-js');

// تأكد من تحديث هذه القيم بمعلومات مشروعك
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTeachers() {
  console.log('🔍 التحقق من وجود مدرسين في قاعدة البيانات...');
  
  try {
    // جلب جميع المدرسين
    const { data: allTeachers, error: allError } = await supabase
      .from('teachers')
      .select('*');
    
    if (allError) {
      console.error('❌ خطأ في جلب جميع المدرسين:', allError);
      return;
    }
    
    console.log(`📊 إجمالي المدرسين: ${allTeachers?.length || 0}`);
    
    if (allTeachers && allTeachers.length > 0) {
      console.log('👥 قائمة المدرسين:');
      allTeachers.forEach((teacher, index) => {
        console.log(`${index + 1}. ${teacher.name} (${teacher.email}) - نشط: ${teacher.is_active}`);
      });
    } else {
      console.log('⚠️ لا توجد مدرسين في قاعدة البيانات');
    }
    
    // جلب المدرسين النشطين فقط
    const { data: activeTeachers, error: activeError } = await supabase
      .from('teachers')
      .select('id, name, email')
      .eq('is_active', true);
    
    if (activeError) {
      console.error('❌ خطأ في جلب المدرسين النشطين:', activeError);
      return;
    }
    
    console.log(`✅ المدرسين النشطين: ${activeTeachers?.length || 0}`);
    
    if (activeTeachers && activeTeachers.length > 0) {
      console.log('🎯 المدرسين النشطين:');
      activeTeachers.forEach((teacher, index) => {
        console.log(`${index + 1}. ${teacher.name} (${teacher.email})`);
      });
    } else {
      console.log('⚠️ لا توجد مدرسين نشطين');
    }
    
  } catch (error) {
    console.error('❌ خطأ عام:', error);
  }
}

// تشغيل الفحص
checkTeachers(); 