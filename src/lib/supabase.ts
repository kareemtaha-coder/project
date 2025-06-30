import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  });
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Function to create database tables
export const createTables = async () => {
  try {
    // Create teachers table
    await supabase.rpc('exec_sql', {
      sql: `
        -- إنشاء جدول المعلمين
        CREATE TABLE IF NOT EXISTS teachers (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          email text UNIQUE NOT NULL,
          name text NOT NULL,
          phone text,
          subject text,
          hourly_rate integer DEFAULT 150,
          address text,
          working_hours_start time DEFAULT '16:00',
          working_hours_end time DEFAULT '22:00',
          working_days text[] DEFAULT ARRAY['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء'],
          created_at timestamptz DEFAULT now(),
          updated_at timestamptz DEFAULT now()
        );

        -- إنشاء جدول الطلاب
        CREATE TABLE IF NOT EXISTS students (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
          name text NOT NULL,
          phone text NOT NULL,
          parent_phone text,
          grade text NOT NULL,
          subject text NOT NULL,
          address text,
          notes text,
          is_active boolean DEFAULT true,
          avatar text,
          created_at timestamptz DEFAULT now(),
          updated_at timestamptz DEFAULT now()
        );

        -- إنشاء جدول الحصص
        CREATE TABLE IF NOT EXISTS sessions (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
          student_id uuid REFERENCES students(id) ON DELETE CASCADE,
          date timestamptz NOT NULL,
          duration integer NOT NULL DEFAULT 60,
          topic text NOT NULL,
          homework text,
          notes text,
          payment integer NOT NULL DEFAULT 0,
          is_paid boolean DEFAULT false,
          status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'missed')),
          created_at timestamptz DEFAULT now(),
          updated_at timestamptz DEFAULT now()
        );

        -- إنشاء جدول المدفوعات
        CREATE TABLE IF NOT EXISTS payments (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
          student_id uuid REFERENCES students(id) ON DELETE CASCADE,
          session_id uuid REFERENCES sessions(id) ON DELETE SET NULL,
          amount integer NOT NULL,
          date timestamptz NOT NULL DEFAULT now(),
          type text NOT NULL DEFAULT 'session' CHECK (type IN ('session', 'monthly', 'package')),
          notes text,
          method text NOT NULL DEFAULT 'cash' CHECK (method IN ('cash', 'transfer', 'other')),
          created_at timestamptz DEFAULT now(),
          updated_at timestamptz DEFAULT now()
        );

        -- تفعيل RLS على جميع الجداول
        ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
        ALTER TABLE students ENABLE ROW LEVEL SECURITY;
        ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
        ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

        -- سياسات الأمان للمعلمين
        DROP POLICY IF EXISTS "Teachers can read own data" ON teachers;
        CREATE POLICY "Teachers can read own data"
          ON teachers
          FOR SELECT
          TO authenticated
          USING (auth.uid() = id);

        DROP POLICY IF EXISTS "Teachers can update own data" ON teachers;
        CREATE POLICY "Teachers can update own data"
          ON teachers
          FOR UPDATE
          TO authenticated
          USING (auth.uid() = id);

        DROP POLICY IF EXISTS "Teachers can insert own data" ON teachers;
        CREATE POLICY "Teachers can insert own data"
          ON teachers
          FOR INSERT
          TO authenticated
          WITH CHECK (auth.uid() = id);

        -- سياسات الأمان للطلاب
        DROP POLICY IF EXISTS "Teachers can manage own students" ON students;
        CREATE POLICY "Teachers can manage own students"
          ON students
          FOR ALL
          TO authenticated
          USING (teacher_id = auth.uid());

        -- سياسات الأمان للحصص
        DROP POLICY IF EXISTS "Teachers can manage own sessions" ON sessions;
        CREATE POLICY "Teachers can manage own sessions"
          ON sessions
          FOR ALL
          TO authenticated
          USING (teacher_id = auth.uid());

        -- سياسات الأمان للمدفوعات
        DROP POLICY IF EXISTS "Teachers can manage own payments" ON payments;
        CREATE POLICY "Teachers can manage own payments"
          ON payments
          FOR ALL
          TO authenticated
          USING (teacher_id = auth.uid());

        -- إنشاء فهارس لتحسين الأداء
        CREATE INDEX IF NOT EXISTS idx_students_teacher_id ON students(teacher_id);
        CREATE INDEX IF NOT EXISTS idx_students_is_active ON students(is_active);
        CREATE INDEX IF NOT EXISTS idx_sessions_teacher_id ON sessions(teacher_id);
        CREATE INDEX IF NOT EXISTS idx_sessions_student_id ON sessions(student_id);
        CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(date);
        CREATE INDEX IF NOT EXISTS idx_payments_teacher_id ON payments(teacher_id);
        CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments(student_id);
        CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(date);
      `
    });

    return { success: true, message: 'تم إنشاء الجداول بنجاح' };
  } catch (error) {
    console.error('Error creating tables:', error);
    
    // Try alternative method using direct SQL execution
    try {
      // Create tables one by one
      const tables = [
        `CREATE TABLE IF NOT EXISTS teachers (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          email text UNIQUE NOT NULL,
          name text NOT NULL,
          phone text,
          subject text,
          hourly_rate integer DEFAULT 150,
          address text,
          working_hours_start time DEFAULT '16:00',
          working_hours_end time DEFAULT '22:00',
          working_days text[] DEFAULT ARRAY['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء'],
          created_at timestamptz DEFAULT now(),
          updated_at timestamptz DEFAULT now()
        )`,
        
        `CREATE TABLE IF NOT EXISTS students (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
          name text NOT NULL,
          phone text NOT NULL,
          parent_phone text,
          grade text NOT NULL,
          subject text NOT NULL,
          address text,
          notes text,
          is_active boolean DEFAULT true,
          avatar text,
          created_at timestamptz DEFAULT now(),
          updated_at timestamptz DEFAULT now()
        )`,
        
        `CREATE TABLE IF NOT EXISTS sessions (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
          student_id uuid REFERENCES students(id) ON DELETE CASCADE,
          date timestamptz NOT NULL,
          duration integer NOT NULL DEFAULT 60,
          topic text NOT NULL,
          homework text,
          notes text,
          payment integer NOT NULL DEFAULT 0,
          is_paid boolean DEFAULT false,
          status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'missed')),
          created_at timestamptz DEFAULT now(),
          updated_at timestamptz DEFAULT now()
        )`,
        
        `CREATE TABLE IF NOT EXISTS payments (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
          student_id uuid REFERENCES students(id) ON DELETE CASCADE,
          session_id uuid REFERENCES sessions(id) ON DELETE SET NULL,
          amount integer NOT NULL,
          date timestamptz NOT NULL DEFAULT now(),
          type text NOT NULL DEFAULT 'session' CHECK (type IN ('session', 'monthly', 'package')),
          notes text,
          method text NOT NULL DEFAULT 'cash' CHECK (method IN ('cash', 'transfer', 'other')),
          created_at timestamptz DEFAULT now(),
          updated_at timestamptz DEFAULT now()
        )`
      ];

      for (const sql of tables) {
        await supabase.from('_').select().limit(0); // This will fail but establish connection
        // Since we can't execute raw SQL directly, we'll need to use Supabase dashboard
      }

      return { 
        success: false, 
        message: 'لا يمكن إنشاء الجداول تلقائياً. يرجى إنشاؤها يدوياً في Supabase Dashboard.' 
      };
    } catch (fallbackError) {
      return { 
        success: false, 
        message: `خطأ في إنشاء الجداول: ${error instanceof Error ? error.message : 'خطأ غير معروف'}` 
      };
    }
  }
};

// Test connection function
export const testConnection = async () => {
  try {
    // Test basic connection
    const { data, error } = await supabase.auth.getSession();
    
    if (error && error.message.includes('Invalid API key')) {
      throw new Error('Invalid Supabase API key. Please check your VITE_SUPABASE_ANON_KEY in .env file.');
    }
    
    // Try to query teachers table
    const { data: teachersData, error: teachersError } = await supabase
      .from('teachers')
      .select('count')
      .limit(1);
    
    if (teachersError) {
      if (teachersError.code === 'PGRST116' || teachersError.message.includes('does not exist')) {
        return { 
          success: false, 
          message: 'الجداول غير موجودة. يرجى إنشاؤها أولاً.',
          needsSetup: true
        };
      }
      throw teachersError;
    }
    
    return { 
      success: true, 
      message: 'تم الاتصال بقاعدة البيانات بنجاح والجداول موجودة',
      needsSetup: false
    };
  } catch (error) {
    console.error('Database connection error:', error);
    
    let errorMessage = 'خطأ غير معروف';
    
    if (error instanceof Error) {
      if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
        errorMessage = 'خطأ في الشبكة - تحقق من اتصال الإنترنت ومن صحة رابط Supabase';
      } else if (error.message.includes('Invalid API key')) {
        errorMessage = 'مفتاح API غير صحيح - تحقق من VITE_SUPABASE_ANON_KEY في ملف .env';
      } else if (error.message.includes('JWT')) {
        errorMessage = 'مفتاح المصادقة غير صحيح أو منتهي الصلاحية';
      } else {
        errorMessage = error.message;
      }
    }
    
    return { 
      success: false, 
      message: `خطأ في الاتصال: ${errorMessage}`,
      needsSetup: false
    };
  }
};

// Auth helpers
export const signUp = async (email: string, password: string, userData: any) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    if (authData.user) {
      // Insert teacher data
      const { error: insertError } = await supabase
        .from('teachers')
        .insert({
          id: authData.user.id,
          email: authData.user.email!,
          name: userData.name,
          phone: userData.phone,
          subject: userData.subject,
          hourly_rate: userData.hourlyRate || 150,
        });

      if (insertError) throw insertError;
    }

    return { data: authData, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getTeacherProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .eq('id', userId)
    .single();

  return { data, error };
};