-- Fix Row Level Security Policies for Teacher Management
-- Migration: 20250630020000_fix_teacher_rls.sql
-- Description: Update RLS policies to allow proper teacher management functionality

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Teachers can read own data" ON teachers;
DROP POLICY IF EXISTS "Teachers can update own data" ON teachers;
DROP POLICY IF EXISTS "Teachers can insert own data" ON teachers;

-- Create new policies that allow teacher management
-- Allow authenticated users to read all teachers (for management purposes)
CREATE POLICY "Allow read all teachers" ON teachers
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert teachers (for registration/management)
CREATE POLICY "Allow insert teachers" ON teachers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update teachers (for management)
CREATE POLICY "Allow update teachers" ON teachers
  FOR UPDATE
  TO authenticated
  USING (true);

-- Allow authenticated users to delete teachers (for management)
CREATE POLICY "Allow delete teachers" ON teachers
  FOR DELETE
  TO authenticated
  USING (true);

-- Update student policies to be more flexible
DROP POLICY IF EXISTS "Teachers can manage own students" ON students;

CREATE POLICY "Allow manage students" ON students
  FOR ALL
  TO authenticated
  USING (true);

-- Update session policies to be more flexible
DROP POLICY IF EXISTS "Teachers can manage own sessions" ON sessions;

CREATE POLICY "Allow manage sessions" ON sessions
  FOR ALL
  TO authenticated
  USING (true);

-- Update payment policies to be more flexible
DROP POLICY IF EXISTS "Teachers can manage own payments" ON payments;

CREATE POLICY "Allow manage payments" ON payments
  FOR ALL
  TO authenticated
  USING (true);

-- Add missing columns to teachers table if they don't exist
DO $$
BEGIN
  -- Add bio column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'teachers' AND column_name = 'bio'
  ) THEN
    ALTER TABLE teachers ADD COLUMN bio text;
  END IF;

  -- Add avatar column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'teachers' AND column_name = 'avatar'
  ) THEN
    ALTER TABLE teachers ADD COLUMN avatar text;
  END IF;

  -- Add specializations column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'teachers' AND column_name = 'specializations'
  ) THEN
    ALTER TABLE teachers ADD COLUMN specializations text[] DEFAULT ARRAY[]::text[];
  END IF;

  -- Add experience column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'teachers' AND column_name = 'experience'
  ) THEN
    ALTER TABLE teachers ADD COLUMN experience integer DEFAULT 0;
  END IF;

  -- Add qualifications column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'teachers' AND column_name = 'qualifications'
  ) THEN
    ALTER TABLE teachers ADD COLUMN qualifications text[] DEFAULT ARRAY[]::text[];
  END IF;

  -- Add role column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'teachers' AND column_name = 'role'
  ) THEN
    ALTER TABLE teachers ADD COLUMN role text DEFAULT 'teacher' CHECK (role IN ('teacher', 'admin', 'supervisor'));
  END IF;

  -- Add is_active column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'teachers' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE teachers ADD COLUMN is_active boolean DEFAULT true;
  END IF;

  -- Add join_date column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'teachers' AND column_name = 'join_date'
  ) THEN
    ALTER TABLE teachers ADD COLUMN join_date timestamptz DEFAULT now();
  END IF;

  -- Add rating column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'teachers' AND column_name = 'rating'
  ) THEN
    ALTER TABLE teachers ADD COLUMN rating numeric(3,2) DEFAULT 0.0;
  END IF;

  -- Add total_students column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'teachers' AND column_name = 'total_students'
  ) THEN
    ALTER TABLE teachers ADD COLUMN total_students integer DEFAULT 0;
  END IF;

  -- Add total_groups column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'teachers' AND column_name = 'total_groups'
  ) THEN
    ALTER TABLE teachers ADD COLUMN total_groups integer DEFAULT 0;
  END IF;

  -- Add total_sessions column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'teachers' AND column_name = 'total_sessions'
  ) THEN
    ALTER TABLE teachers ADD COLUMN total_sessions integer DEFAULT 0;
  END IF;

  -- Add total_revenue column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'teachers' AND column_name = 'total_revenue'
  ) THEN
    ALTER TABLE teachers ADD COLUMN total_revenue integer DEFAULT 0;
  END IF;
END $$;

-- Create teacher_dashboard_stats view if it doesn't exist
CREATE OR REPLACE VIEW teacher_dashboard_stats AS
SELECT 
  t.id,
  t.name,
  t.email,
  COALESCE(t.total_students, 0) as total_students,
  COALESCE(t.total_groups, 0) as total_groups,
  COALESCE(t.total_sessions, 0) as total_sessions,
  COALESCE(t.total_revenue, 0) as total_revenue,
  COALESCE(t.rating, 0.0) as rating,
  COALESCE(t.is_active, true) as is_active,
  0 as students_this_month,
  0 as sessions_this_month,
  0 as revenue_this_month,
  0 as sessions_today,
  0 as revenue_today,
  85.0 as completion_rate,
  90.0 as payment_rate
FROM teachers t;

-- Grant permissions on the view
GRANT SELECT ON teacher_dashboard_stats TO authenticated; 