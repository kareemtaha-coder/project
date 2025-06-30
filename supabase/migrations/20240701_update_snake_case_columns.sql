"-- Migration to ensure all columns use snake_case (created_at, updated_at, teacher_id, etc.)\n-- No schema changes needed if already correct, but this is a placeholder for documentation." 

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='student_groups' AND column_name='currentStudents') THEN
    ALTER TABLE student_groups RENAME COLUMN "currentStudents" TO current_students;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='student_groups' AND column_name='maxStudents') THEN
    ALTER TABLE student_groups RENAME COLUMN "maxStudents" TO max_students;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='student_groups' AND column_name='monthlyPrice') THEN
    ALTER TABLE student_groups RENAME COLUMN "monthlyPrice" TO monthly_price;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='student_groups' AND column_name='isActive') THEN
    ALTER TABLE student_groups RENAME COLUMN "isActive" TO is_active;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='student_groups' AND column_name='subjectId') THEN
    ALTER TABLE student_groups RENAME COLUMN "subjectId" TO subject_id;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='student_groups' AND column_name='teacherId') THEN
    ALTER TABLE student_groups RENAME COLUMN "teacherId" TO teacher_id;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='student_groups' AND column_name='startDate') THEN
    ALTER TABLE student_groups RENAME COLUMN "startDate" TO start_date;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='student_groups' AND column_name='endDate') THEN
    ALTER TABLE student_groups RENAME COLUMN "endDate" TO end_date;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='student_groups' AND column_name='createdAt') THEN
    ALTER TABLE student_groups RENAME COLUMN "createdAt" TO created_at;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='student_groups' AND column_name='updatedAt') THEN
    ALTER TABLE student_groups RENAME COLUMN "updatedAt" TO updated_at;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='student_groups' AND column_name='studentIds') THEN
    ALTER TABLE student_groups RENAME COLUMN "studentIds" TO student_ids;
  END IF;
END $$;

ALTER TABLE student_groups
  ADD COLUMN IF NOT EXISTS current_students integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS max_students integer,
  ADD COLUMN IF NOT EXISTS monthly_price integer,
  ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS subject_id uuid,
  ADD COLUMN IF NOT EXISTS teacher_id uuid,
  ADD COLUMN IF NOT EXISTS start_date timestamptz,
  ADD COLUMN IF NOT EXISTS end_date timestamptz,
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS student_ids uuid[]; 
