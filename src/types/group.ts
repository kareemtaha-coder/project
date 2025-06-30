import { GroupSchedule } from '../types';

export interface GroupFormState {
  name: string;
  subject_id: string;
  grade: string;
  description: string;
  monthly_price: number;
  max_students: number;
  current_students: number;
  location: string;
  materials: string[];
  rules: string[];
  start_date: string;
  end_date: string;
  is_active: boolean;
  teacher_id: string;
}

export interface GroupPayload {
  name: string;
  subject_id: string;
  grade: string;
  description: string;
  monthly_price: number;
  max_students: number;
  current_students: number;
  location: string;
  materials: string[];
  rules: string[];
  start_date: string;
  end_date: string;
  is_active: boolean;
  teacher_id: string;
  schedule: GroupSchedule[];
}

export const mapFormToPayload = (form: GroupFormState, schedule: GroupSchedule[]): GroupPayload => ({
  name: form.name,
  subject_id: form.subject_id,
  grade: form.grade,
  description: form.description,
  monthly_price: form.monthly_price,
  max_students: form.max_students,
  current_students: form.current_students,
  location: form.location,
  materials: form.materials,
  rules: form.rules,
  start_date: form.start_date,
  end_date: form.end_date,
  is_active: form.is_active,
  teacher_id: form.teacher_id,
  schedule,
});
