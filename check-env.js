console.log('🔧 فحص متغيرات البيئة...\n');

// التحقق من متغيرات البيئة
const envVars = {
  'VITE_SUPABASE_URL': process.env.VITE_SUPABASE_URL,
  'VITE_SUPABASE_ANON_KEY': process.env.VITE_SUPABASE_ANON_KEY,
  'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY
};

console.log('📋 متغيرات البيئة:');
Object.entries(envVars).forEach(([key, value]) => {
  const status = value ? '✅ موجود' : '❌ مفقود';
  const displayValue = value ? `${value.substring(0, 20)}...` : 'غير محدد';
  console.log(`   ${key}: ${status}`);
  if (value) console.log(`      القيمة: ${displayValue}`);
});

console.log('\n💡 لتشغيل scripts مع متغيرات البيئة:');
console.log('Windows:');
console.log('   set VITE_SUPABASE_URL=your_url && set VITE_SUPABASE_ANON_KEY=your_key && node check-and-add-teachers.js');
console.log('\nLinux/Mac:');
console.log('   VITE_SUPABASE_URL=your_url VITE_SUPABASE_ANON_KEY=your_key node check-and-add-teachers.js');

console.log('\n🔗 للحصول على متغيرات البيئة:');
console.log('1. اذهب إلى https://supabase.com/dashboard');
console.log('2. اختر مشروعك');
console.log('3. اذهب إلى Settings > API');
console.log('4. انسخ Project URL و anon public key');
console.log('5. للكتابة، انسخ service_role key'); 