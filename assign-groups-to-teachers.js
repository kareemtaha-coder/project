import { createClient } from '@supabase/supabase-js';

// Your Supabase credentials
const supabaseUrl = 'https://vidiuyaglathpuczywno.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpZGl1eWFnbGF0aHB1Y3p5d25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMzUyOTAsImV4cCI6MjA2NjgxMTI5MH0.F9WBriwNNHxG6w0tCQr-FAiWfs-3u30qXV0fs3j8kMc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Example: Assign multiple groups to teachers
const groups = [
  {
    teacher_id: 'teacher-uuid-1',
    subject_id: 'subject-uuid-1',
    name: 'مجموعة الرياضيات',
    grade: 'الثالث الثانوي',
    monthly_price: 500,
    max_students: 20,
    is_active: true,
    current_students: 0,
    description: 'مجموعة متقدمة في الرياضيات',
    location: 'قاعة 1',
    materials: [],
    rules: [],
    start_date: null,
    end_date: null
  },
  {
    teacher_id: 'teacher-uuid-2',
    subject_id: 'subject-uuid-2',
    name: 'مجموعة الفيزياء',
    grade: 'الثاني الثانوي',
    monthly_price: 400,
    max_students: 15,
    is_active: true,
    current_students: 0,
    description: 'مجموعة متقدمة في الفيزياء',
    location: 'قاعة 2',
    materials: [],
    rules: [],
    start_date: null,
    end_date: null
  },
  // أضف المزيد من المجموعات حسب الحاجة
];

(async () => {
  const { data, error } = await supabase
    .from('student_groups')
    .insert(groups);

  if (error) {
    console.error('❌ Error assigning groups:', error.message);
  } else {
    console.log('✅ Groups assigned successfully:', data);
  }
})(); 