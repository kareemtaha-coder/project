// ملف تشخيص محسن للتحقق من وجود مدرسين في قاعدة البيانات
const { createClient } = require('@supabase/supabase-js');

// قراءة متغيرات البيئة من ملف .env
require('dotenv').config();

// الحصول على معلومات Supabase من متغيرات البيئة
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 بدء تشخيص قاعدة البيانات...');
console.log('📋 معلومات الاتصال:');
console.log('   URL:', supabaseUrl ? '✅ متوفر' : '❌ مفقود');
console.log('   Key:', supabaseKey ? '✅ متوفر' : '❌ مفقود');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ خطأ: متغيرات البيئة مفقودة!');
  console.log('📝 تأكد من وجود ملف .env يحتوي على:');
  console.log('   VITE_SUPABASE_URL=your_supabase_url');
  console.log('   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log('\n🔍 التحقق من قاعدة البيانات...');
  
  try {
    // 1. التحقق من الاتصال
    console.log('\n1️⃣ اختبار الاتصال...');
    const { data: testData, error: testError } = await supabase
      .from('teachers')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ خطأ في الاتصال:', testError.message);
      return;
    }
    console.log('✅ الاتصال ناجح');

    // 2. التحقق من وجود جدول teachers
    console.log('\n2️⃣ التحقق من جدول teachers...');
    const { data: tableCheck, error: tableError } = await supabase
      .from('teachers')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.error('❌ خطأ في جدول teachers:', tableError.message);
      console.log('💡 قد تحتاج إلى إنشاء الجدول أولاً');
      return;
    }
    console.log('✅ جدول teachers موجود');

    // 3. جلب عدد المدرسين
    console.log('\n3️⃣ جلب إحصائيات المدرسين...');
    const { count: totalTeachers, error: countError } = await supabase
      .from('teachers')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ خطأ في عد المدرسين:', countError.message);
      return;
    }
    
    console.log(`📊 إجمالي المدرسين: ${totalTeachers || 0}`);

    // 4. جلب جميع المدرسين
    console.log('\n4️⃣ جلب قائمة المدرسين...');
    const { data: allTeachers, error: allError } = await supabase
      .from('teachers')
      .select('*')
      .order('name');
    
    if (allError) {
      console.error('❌ خطأ في جلب المدرسين:', allError.message);
      return;
    }
    
    if (!allTeachers || allTeachers.length === 0) {
      console.log('⚠️ لا توجد مدرسين في قاعدة البيانات');
      console.log('💡 سأقوم بإضافة مدرسين تجريبيين...');
      await addSampleTeachers();
      return;
    }

    console.log('👥 قائمة جميع المدرسين:');
    allTeachers.forEach((teacher, index) => {
      console.log(`   ${index + 1}. ${teacher.name} (${teacher.email})`);
      console.log(`      - نشط: ${teacher.is_active ? '✅' : '❌'}`);
      console.log(`      - المادة: ${teacher.subject || 'غير محدد'}`);
      console.log(`      - تاريخ الإنشاء: ${new Date(teacher.created_at).toLocaleDateString('ar-EG')}`);
      console.log('');
    });

    // 5. جلب المدرسين النشطين فقط
    console.log('\n5️⃣ جلب المدرسين النشطين...');
    const { data: activeTeachers, error: activeError } = await supabase
      .from('teachers')
      .select('id, name, email, subject')
      .eq('is_active', true)
      .order('name');
    
    if (activeError) {
      console.error('❌ خطأ في جلب المدرسين النشطين:', activeError.message);
      return;
    }
    
    console.log(`✅ المدرسين النشطين: ${activeTeachers?.length || 0}`);
    
    if (activeTeachers && activeTeachers.length > 0) {
      console.log('🎯 قائمة المدرسين النشطين:');
      activeTeachers.forEach((teacher, index) => {
        console.log(`   ${index + 1}. ${teacher.name} (${teacher.email})`);
      });
    } else {
      console.log('⚠️ لا توجد مدرسين نشطين');
      console.log('💡 سأقوم بتفعيل بعض المدرسين...');
      await activateSampleTeachers();
    }

    // 6. اختبار إضافة مدرس جديد
    console.log('\n6️⃣ اختبار إضافة مدرس جديد...');
    const testTeacher = {
      name: 'مدرس تجريبي للاختبار',
      email: `test-${Date.now()}@example.com`,
      phone: '+201234567890',
      subject: 'الرياضيات',
      hourly_rate: 150,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: newTeacher, error: insertError } = await supabase
      .from('teachers')
      .insert([testTeacher])
      .select()
      .single();

    if (insertError) {
      console.error('❌ خطأ في إضافة مدرس تجريبي:', insertError.message);
    } else {
      console.log('✅ تم إضافة مدرس تجريبي بنجاح');
      console.log(`   - الاسم: ${newTeacher.name}`);
      console.log(`   - البريد: ${newTeacher.email}`);
      
      // حذف المدرس التجريبي
      await supabase
        .from('teachers')
        .delete()
        .eq('id', newTeacher.id);
      console.log('🗑️ تم حذف المدرس التجريبي');
    }

  } catch (error) {
    console.error('❌ خطأ عام:', error.message);
  }
}

async function addSampleTeachers() {
  console.log('\n➕ إضافة مدرسين تجريبيين...');
  
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
      join_date: new Date().toISOString(),
      rating: 4.8,
      total_students: 25,
      total_groups: 5,
      total_sessions: 120,
      total_revenue: 18000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
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
      join_date: new Date().toISOString(),
      rating: 4.9,
      total_students: 20,
      total_groups: 4,
      total_sessions: 100,
      total_revenue: 14000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  try {
    const { data, error } = await supabase
      .from('teachers')
      .insert(sampleTeachers)
      .select();

    if (error) {
      console.error('❌ خطأ في إضافة المدرسين التجريبيين:', error.message);
      return;
    }

    console.log('✅ تم إضافة المدرسين التجريبيين بنجاح');
    data.forEach(teacher => {
      console.log(`   - ${teacher.name} (${teacher.email})`);
    });

  } catch (error) {
    console.error('❌ خطأ في إضافة المدرسين:', error.message);
  }
}

async function activateSampleTeachers() {
  console.log('\n🔄 تفعيل المدرسين...');
  
  try {
    const { data, error } = await supabase
      .from('teachers')
      .update({ is_active: true })
      .neq('is_active', true)
      .select();

    if (error) {
      console.error('❌ خطأ في تفعيل المدرسين:', error.message);
      return;
    }

    console.log(`✅ تم تفعيل ${data?.length || 0} مدرس`);
    
  } catch (error) {
    console.error('❌ خطأ في تفعيل المدرسين:', error.message);
  }
}

// تشغيل التشخيص
checkDatabase().then(() => {
  console.log('\n🎉 انتهى التشخيص!');
  process.exit(0);
}).catch(error => {
  console.error('\n❌ خطأ في التشخيص:', error.message);
  process.exit(1);
}); 