import { createClient } from '@supabase/supabase-js';
import readline from 'readline';

// Supabase credentials (from your .env)
const supabaseUrl = 'https://vidiuyaglathpuczywno.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpZGl1eWFnbGF0aHB1Y3p5d25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMzUyOTAsImV4cCI6MjA2NjgxMTI5MH0.F9WBriwNNHxG6w0tCQr-FAiWfs-3u30qXV0fs3j8kMc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

(async () => {
  try {
    console.log('🧑‍🏫 إضافة مجموعة جديدة لمدرس في Supabase');
    const teacher_id = await ask('Teacher ID (uuid): ');
    const subject_id = await ask('Subject ID (uuid): ');
    const name = await ask('Group Name: ');
    const grade = await ask('Grade: ');
    const description = await ask('Description (optional): ');
    const monthly_price = parseInt(await ask('Monthly Price: '), 10);
    const max_students = parseInt(await ask('Max Students: '), 10);
    const location = await ask('Location (optional): ');
    const is_active = (await ask('Is Active? (yes/no): ')).toLowerCase().startsWith('y');

    // Insert the group
    const { data, error } = await supabase
      .from('student_groups')
      .insert({
        teacher_id,
        subject_id,
        name,
        grade,
        description: description || null,
        monthly_price,
        max_students,
        current_students: 0,
        location: location || null,
        materials: [],
        rules: [],
        start_date: null,
        end_date: null,
        is_active
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error adding group:', error.message);
    } else {
      console.log('✅ Group added successfully:', data);
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  } finally {
    rl.close();
  }
})(); 