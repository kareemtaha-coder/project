import { Course, Tutor, Lesson } from '../types';

export const mockTutors: Tutor[] = [
  {
    id: '1',
    name: 'د. فاطمة أحمد',
    email: 'fatima@example.com',
    role: 'tutor',
    avatar: 'https://images.pexels.com/photos/3727464/pexels-photo-3727464.jpeg?auto=compress&cs=tinysrgb&w=150',
    phone: '+20 100 123 4567',
    location: 'القاهرة',
    specializations: ['الرياضيات', 'الفيزياء'],
    experience: 8,
    rating: 4.9,
    hourlyRate: 200,
    qualifications: ['بكالوريوس هندسة', 'ماجستير رياضيات تطبيقية'],
    availableHours: [
      { day: 'الأحد', startTime: '16:00', endTime: '20:00' },
      { day: 'الثلاثاء', startTime: '16:00', endTime: '20:00' }
    ],
    bio: 'مدرسة رياضيات وفيزياء بخبرة 8 سنوات في التدريس الخصوصي',
    created_at: new Date()
  },
  {
    id: '2',
    name: 'أ. محمد علي',
    email: 'mohamed@example.com',
    role: 'tutor',
    avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150',
    phone: '+20 101 234 5678',
    location: 'الجيزة',
    specializations: ['اللغة الإنجليزية', 'الأدب الإنجليزي'],
    experience: 5,
    rating: 4.7,
    hourlyRate: 150,
    qualifications: ['بكالوريوس آداب إنجليزي', 'TESOL Certificate'],
    availableHours: [
      { day: 'السبت', startTime: '14:00', endTime: '18:00' },
      { day: 'الاثنين', startTime: '16:00', endTime: '20:00' }
    ],
    bio: 'معلم لغة إنجليزية معتمد مع خبرة في تحضير الطلاب للامتحانات الدولية',
    created_at: new Date()
  }
];

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'الرياضيات للثانوية العامة',
    description: 'دورة شاملة لمنهج الرياضيات للصف الثالث الثانوي مع حل نماذج امتحانات',
    subject: 'رياضيات',
    level: 'الثانوية العامة',
    tutorId: '1',
    tutor: mockTutors[0],
    duration: 12,
    price: 2000,
    maxStudents: 15,
    enrolledStudents: 8,
    schedule: [
      { day: 'الأحد', startTime: '16:00', endTime: '18:00' },
      { day: 'الثلاثاء', startTime: '16:00', endTime: '18:00' }
    ],
    materials: ['كتاب الطالب', 'مذكرة الأستاذة', 'نماذج امتحانات'],
    tags: ['ثانوية عامة', 'رياضيات', 'امتحانات'],
    thumbnail: 'https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8
  },
  {
    id: '2',
    title: 'اللغة الإنجليزية - المحادثة المتقدمة',
    description: 'تطوير مهارات المحادثة والنطق الصحيح للغة الإنجليزية',
    subject: 'لغة إنجليزية',
    level: 'متقدم',
    tutorId: '2',
    tutor: mockTutors[1],
    duration: 8,
    price: 1200,
    maxStudents: 10,
    enrolledStudents: 6,
    schedule: [
      { day: 'السبت', startTime: '14:00', endTime: '16:00' },
      { day: 'الاثنين', startTime: '18:00', endTime: '20:00' }
    ],
    materials: ['Oxford Speaking Skills', 'Audio Materials', 'Practice Worksheets'],
    tags: ['محادثة', 'إنجليزي', 'متقدم'],
    thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6
  }
];

export const mockLessons: Lesson[] = [
  {
    id: '1',
    courseId: '1',
    title: 'النهايات والاتصال',
    description: 'شرح مفهوم النهايات وخصائص الدوال المتصلة',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    duration: 120,
    type: 'online',
    status: 'upcoming',
    meetingLink: 'https://zoom.us/j/123456789',
    attendees: ['student1', 'student2']
  },
  {
    id: '2',
    courseId: '2',
    title: 'Presentation Skills',
    description: 'تطوير مهارات العرض والتقديم باللغة الإنجليزية',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    duration: 90,
    type: 'online',
    status: 'completed',
    meetingLink: 'https://zoom.us/j/987654321',
    attendees: ['student1', 'student3']
  }
];