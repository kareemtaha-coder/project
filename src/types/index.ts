export interface Student {
  id: string;
  name: string;
  studentCode?: string; // كود فريد للطالب (QR)
  avatar?: string; // الصورة الشخصية
  phone: string;
  parentPhone?: string;
  parentName?: string;
  grade: string;
  subject: string;
  subjectId?: string; // معرف المادة
  address?: string;
  notes?: string; // ملاحظات خاصة بالطالب
  joinDate: Date;
  isActive: boolean;
  groups?: string[]; // المجموعات المسجل بها
  documents?: StudentDocument[];
  qrCode?: string; // QR Code للطالب
  // Extended fields
  email?: string;
  birthDate?: Date;
  emergencyContact?: EmergencyContact;
  medicalInfo?: MedicalInfo;
  academicInfo?: AcademicInfo;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  specializations: string[]; // المواد التي يدرسها
  experience: number; // سنوات الخبرة
  qualifications: string[]; // المؤهلات العلمية
  bio?: string; // نبذة شخصية
  hourlyRate: number; // السعر بالساعة
  address?: string;
  workingHours: {
    start: string;
    end: string;
  };
  workingDays: string[];
  isActive: boolean;
  role: 'teacher' | 'admin' | 'supervisor'; // دور المدرس
  permissions: TeacherPermission[]; // الصلاحيات
  joinDate: Date;
  lastLogin?: Date;
  // إحصائيات
  totalStudents?: number;
  totalGroups?: number;
  totalSessions?: number;
  totalRevenue?: number;
  rating?: number; // تقييم المدرس
  // إعدادات إضافية
  preferences?: TeacherPreferences;
  socialLinks?: SocialLinks;
  documents?: TeacherDocument[];
  created_at: string; // تاريخ الإنشاء
  updated_at: string; // تاريخ التحديث
}

export interface TeacherPermission {
  id: string;
  name: string;
  description: string;
  category: 'students' | 'groups' | 'sessions' | 'payments' | 'reports' | 'settings' | 'admin';
  isGranted: boolean;
}

export interface TeacherPreferences {
  language: 'ar' | 'en';
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  privacy: {
    showProfile: boolean;
    showContact: boolean;
    showStats: boolean;
  };
}

export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  website?: string;
}

export interface TeacherDocument {
  id: string;
  name: string;
  type: 'cv' | 'certificate' | 'id' | 'photo' | 'other';
  url: string;
  uploadDate: Date;
  size: number;
  mimeType: string;
  isVerified?: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
}

export interface Subject {
  id: string;
  name: string; // اسم المادة
  code: string; // كود المادة (مثل MATH)
  category: 'علوم' | 'أدب' | 'لغات' | 'رياضيات' | 'اجتماعيات' | 'فنون' | 'أخرى'; // تصنيف المادة
  grades: string[]; // الصفوف التي تدرس فيها هذه المادة
  color: string; // لون مميز للمادة
  icon?: string; // أيقونة المادة
  description?: string; // وصف المادة
  isActive: boolean;
  created_at: string; // تاريخ الإنشاء
  updated_at: string; // تاريخ التحديث
  // إحصائيات
  totalStudents?: number; // عدد الطلاب المسجلين
  totalGroups?: number; // عدد المجموعات
  totalSessions?: number; // عدد الحصص
  // إعدادات افتراضية
  defaultDuration?: number; // مدة الحصة الافتراضية بالدقائق
  defaultPrice?: number; // السعر الافتراضي للحصة
  // محتوى المادة
  materials?: string[]; // المواد المطلوبة
  objectives?: string[]; // أهداف المادة
  prerequisites?: string[]; // المتطلبات السابقة
}

export interface StudentGroup {
  id: string;
  name: string; // اسم المجموعة
  subject_id: string; // معرف المادة
  grade: string; // الصف الدراسي
  description?: string; // وصف المجموعة
  monthly_price: number; // السعر الشهري
  max_students: number; // الحد الأقصى للطلاب
  current_students: number; // عدد الطلاب الحاليين
  schedule: GroupSchedule[]; // مواعيد المجموعة
  student_ids: string[]; // معرفات الطلاب المسجلين
  is_active: boolean;
  created_at: string; // تاريخ الإنشاء
  updated_at: string; // تاريخ التحديث
  start_date?: string; // تاريخ بداية المجموعة
  end_date?: string; // تاريخ نهاية المجموعة
  location?: string; // مكان الحصص
  materials?: string[]; // المواد المطلوبة
  rules?: string[]; // قوانين المجموعة
  teacher_id: string; // معرف المدرس
}

export interface GroupSchedule {
  day: string; // اليوم
  startTime: string; // وقت البداية
  endTime: string; // وقت النهاية
  location?: string; // المكان
  duration: number; // المدة بالدقائق
}

export interface StudentDocument {
  id: string;
  name: string;
  type: 'birth_certificate' | 'photo' | 'medical_report' | 'previous_grades' | 'other';
  url: string;
  uploadDate: Date;
  size: number;
  mimeType: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface MedicalInfo {
  bloodType?: string;
  allergies?: string[];
  medications?: string[];
  conditions?: string[];
  emergencyMedicalInfo?: string;
}

export interface AcademicInfo {
  previousSchool?: string;
  previousGrades?: Record<string, string>;
  strengths?: string[];
  weaknesses?: string[];
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  goals?: string[];
}

export interface Session {
  id: string;
  studentId?: string; // للحصص الفردية
  groupId?: string; // للحصص الجماعية
  subjectId?: string; // معرف المادة
  date: Date;
  duration: number;
  topic: string;
  homework?: string;
  notes?: string;
  payment: number;
  isPaid: boolean;
  status: 'scheduled' | 'completed' | 'cancelled' | 'missed';
  attendance?: StudentAttendance[]; // للحصص الجماعية
}

export interface StudentAttendance {
  studentId: string;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}

export interface Payment {
  id: string;
  studentId: string;
  groupId?: string;
  sessionId?: string;
  subjectId?: string;
  amount: number;
  date: Date;
  type: 'session' | 'monthly' | 'package' | 'registration';
  notes?: string;
  method: 'cash' | 'transfer' | 'other';
  receiptNumber?: string;
}

export interface TeacherSettings {
  name: string;
  subject: string;
  hourlyRate: number;
  phone: string;
  address?: string;
  workingHours: {
    start: string;
    end: string;
  };
  workingDays: string[];
  registrationFee?: number;
  documentRequirements?: string[];
  groupSettings?: {
    defaultMaxStudents: number;
    defaultDuration: number;
    allowWaitingList: boolean;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'tutor' | 'admin';
  avatar?: string;
  phone?: string;
  location?: string;
  createdAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  level: string;
  tutorId: string;
  tutor: Tutor;
  duration: number;
  price: number;
  maxStudents: number;
  enrolledStudents: number;
  schedule: { day: string; startTime: string; endTime: string }[];
  materials: string[];
  tags: string[];
  thumbnail: string;
  rating: number;
}

export interface Tutor {
  id: string;
  name: string;
  email: string;
  role: 'tutor';
  avatar?: string;
  phone: string;
  location: string;
  specializations: string[];
  experience: number;
  rating: number;
  hourlyRate: number;
  qualifications: string[];
  availableHours: { day: string; startTime: string; endTime: string }[];
  bio: string;
  createdAt: Date;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  date: Date;
  duration: number;
  type: 'online' | 'offline';
  status: 'upcoming' | 'completed' | 'cancelled';
  meetingLink?: string;
  attendees: string[];
}