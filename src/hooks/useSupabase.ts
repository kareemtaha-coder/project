import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Student, Session, Payment, TeacherSettings, Subject, StudentGroup } from '../types';
import { Database } from '../types/database';
import { generateStudentCode } from '../utils/qrCodeGenerator';

type DbStudent = Database['public']['Tables']['students']['Row'];
type DbSession = Database['public']['Tables']['sessions']['Row'];
type DbPayment = Database['public']['Tables']['payments']['Row'];
type DbTeacher = Database['public']['Tables']['teachers']['Row'];
type DbSubject = Database['public']['Tables']['subjects']['Row'];
type DbStudentGroup = Database['public']['Tables']['student_groups']['Row'];
type DbGroupSchedule = Database['public']['Tables']['group_schedules']['Row'];

// Helper functions to convert between database and app types
const dbStudentToStudent = (dbStudent: DbStudent): Student => ({
  id: dbStudent.id,
  name: dbStudent.name,
  phone: dbStudent.phone,
  parentPhone: dbStudent.parent_phone || undefined,
  grade: dbStudent.grade,
  subject: dbStudent.subject,
  subjectId: dbStudent.subject_id || undefined,
  address: dbStudent.address || undefined,
  notes: dbStudent.notes || undefined,
  joinDate: new Date(dbStudent.created_at),
  isActive: dbStudent.is_active,
  avatar: dbStudent.avatar || undefined,
  studentCode: dbStudent.student_code || undefined,
});

const studentToDbStudent = (student: Omit<Student, 'id'>, teacherId: string): Database['public']['Tables']['students']['Insert'] => ({
  teacher_id: teacherId,
  name: student.name,
  phone: student.phone,
  parent_phone: student.parentPhone || null,
  grade: student.grade,
  subject: student.subject,
  subject_id: student.subjectId || null,
  address: student.address || null,
  notes: student.notes || null,
  is_active: student.isActive,
  avatar: student.avatar || null,
  student_code: student.studentCode || generateStudentCode(student.name, student.grade),
});

const dbSubjectToSubject = (dbSubject: DbSubject): Subject => ({
  id: dbSubject.id,
  name: dbSubject.name,
  code: dbSubject.code,
  category: dbSubject.category,
  color: dbSubject.color,
  icon: dbSubject.icon,
  description: dbSubject.description || undefined,
  grades: dbSubject.grades,
  defaultDuration: dbSubject.default_duration,
  defaultPrice: dbSubject.default_price,
  materials: dbSubject.materials,
  objectives: dbSubject.objectives,
  prerequisites: dbSubject.prerequisites,
  isActive: dbSubject.is_active,
  createdAt: new Date(dbSubject.created_at),
  updatedAt: new Date(dbSubject.updated_at),
});

const subjectToDbSubject = (subject: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>, teacherId: string): Database['public']['Tables']['subjects']['Insert'] => ({
  teacher_id: teacherId,
  name: subject.name,
  code: subject.code,
  category: subject.category,
  color: subject.color,
  icon: subject.icon,
  description: subject.description || null,
  grades: subject.grades,
  default_duration: subject.defaultDuration,
  default_price: subject.defaultPrice,
  materials: subject.materials || [],
  objectives: subject.objectives || [],
  prerequisites: subject.prerequisites || [],
  is_active: subject.isActive,
});

const dbGroupToGroup = (dbGroup: DbStudentGroup, schedules: DbGroupSchedule[] = []): StudentGroup => ({
  id: dbGroup.id,
  name: dbGroup.name,
  subject: '', // Will be populated from subject join
  subjectId: dbGroup.subject_id,
  grade: dbGroup.grade,
  description: dbGroup.description || undefined,
  monthlyPrice: dbGroup.monthly_price,
  maxStudents: dbGroup.max_students,
  currentStudents: dbGroup.current_students,
  schedule: schedules.map(s => ({
    day: s.day,
    startTime: s.start_time,
    endTime: s.end_time,
    duration: s.duration,
    location: s.location || undefined,
  })),
  studentIds: [], // Will be populated from group_students join
  isActive: dbGroup.is_active,
  createdAt: new Date(dbGroup.created_at),
  startDate: dbGroup.start_date ? new Date(dbGroup.start_date) : undefined,
  endDate: dbGroup.end_date ? new Date(dbGroup.end_date) : undefined,
  location: dbGroup.location || undefined,
  materials: dbGroup.materials,
  rules: dbGroup.rules,
});

const groupToDbGroup = (group: Omit<StudentGroup, 'id'>, teacherId: string): Database['public']['Tables']['student_groups']['Insert'] => ({
  teacher_id: teacherId,
  subject_id: group.subjectId!,
  name: group.name,
  grade: group.grade,
  description: group.description || null,
  monthly_price: group.monthlyPrice,
  max_students: group.maxStudents,
  current_students: group.currentStudents,
  location: group.location || null,
  materials: group.materials || [],
  rules: group.rules || [],
  start_date: group.startDate?.toISOString().split('T')[0] || null,
  end_date: group.endDate?.toISOString().split('T')[0] || null,
  is_active: group.isActive,
});

const dbSessionToSession = (dbSession: DbSession): Session => ({
  id: dbSession.id,
  studentId: dbSession.student_id,
  subjectId: dbSession.subject_id || undefined,
  groupId: dbSession.group_id || undefined,
  date: new Date(dbSession.date),
  duration: dbSession.duration,
  topic: dbSession.topic,
  homework: dbSession.homework || undefined,
  notes: dbSession.notes || undefined,
  payment: dbSession.payment,
  isPaid: dbSession.is_paid,
  status: dbSession.status,
});

const dbPaymentToPayment = (dbPayment: DbPayment): Payment => ({
  id: dbPayment.id,
  studentId: dbPayment.student_id,
  sessionId: dbPayment.session_id || undefined,
  subjectId: dbPayment.subject_id || undefined,
  groupId: dbPayment.group_id || undefined,
  amount: dbPayment.amount,
  date: new Date(dbPayment.date),
  type: dbPayment.type,
  notes: dbPayment.notes || undefined,
  method: dbPayment.method,
});

const dbTeacherToSettings = (dbTeacher: DbTeacher): TeacherSettings => ({
  name: dbTeacher.name,
  subject: dbTeacher.subject || '',
  hourlyRate: dbTeacher.hourly_rate,
  phone: dbTeacher.phone || '',
  address: dbTeacher.address || undefined,
  workingHours: {
    start: dbTeacher.working_hours_start,
    end: dbTeacher.working_hours_end,
  },
  workingDays: dbTeacher.working_days,
});

export const useSupabase = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [groups, setGroups] = useState<StudentGroup[]>([]);
  const [settings, setSettings] = useState<TeacherSettings>({
    name: 'الأستاذ محمد أحمد',
    subject: 'الرياضيات',
    hourlyRate: 150,
    phone: '+20 100 123 4567',
    address: 'القاهرة، مصر',
    workingHours: { start: '16:00', end: '22:00' },
    workingDays: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء']
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        await loadData(user.id);
      } else {
        // Load from localStorage if no user (fallback)
        loadFromLocalStorage();
      }
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        await loadData(session.user.id);
      } else {
        loadFromLocalStorage();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadFromLocalStorage = () => {
    const savedStudents = localStorage.getItem('students');
    const savedSessions = localStorage.getItem('sessions');
    const savedPayments = localStorage.getItem('payments');
    const savedSubjects = localStorage.getItem('subjects');
    const savedGroups = localStorage.getItem('groups');
    const savedSettings = localStorage.getItem('settings');

    if (savedStudents) setStudents(JSON.parse(savedStudents));
    if (savedSessions) setSessions(JSON.parse(savedSessions));
    if (savedPayments) setPayments(JSON.parse(savedPayments));
    if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
    if (savedGroups) setGroups(JSON.parse(savedGroups));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  };

  const loadData = async (teacherId: string) => {
    try {
      // Load teacher settings
      const { data: teacherData } = await supabase
        .from('teachers')
        .select('*')
        .eq('id', teacherId)
        .single();

      if (teacherData) {
        setSettings(dbTeacherToSettings(teacherData));
      }

      // Load subjects
      const { data: subjectsData } = await supabase
        .from('subjects')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false });

      if (subjectsData) {
        setSubjects(subjectsData.map(dbSubjectToSubject));
      }

      // Load groups with schedules and subject names
      const { data: groupsData } = await supabase
        .from('student_groups')
        .select(`
          *,
          subjects(name),
          group_schedules(*),
          group_students(student_id)
        `)
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false });

      if (groupsData) {
        const mappedGroups = groupsData.map((group: any) => {
          const mappedGroup = dbGroupToGroup(group, group.group_schedules);
          mappedGroup.subject = group.subjects?.name || '';
          mappedGroup.studentIds = group.group_students?.map((gs: any) => gs.student_id) || [];
          return mappedGroup;
        });
        setGroups(mappedGroups);
      }

      // Load students
      const { data: studentsData } = await supabase
        .from('students')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false });

      if (studentsData) {
        setStudents(studentsData.map(dbStudentToStudent));
      }

      // Load sessions
      const { data: sessionsData } = await supabase
        .from('sessions')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('date', { ascending: false });

      if (sessionsData) {
        setSessions(sessionsData.map(dbSessionToSession));
      }

      // Load payments
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('date', { ascending: false });

      if (paymentsData) {
        setPayments(paymentsData.map(dbPaymentToPayment));
      }

      // Update teacher stats after loading data
      await updateTeacherStats(teacherId);
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback to localStorage
      loadFromLocalStorage();
    }
  };

  // Function to update teacher statistics
  const updateTeacherStats = async (teacherId: string) => {
    try {
      await supabase.rpc('calculate_teacher_stats', { teacher_uuid: teacherId });
    } catch (error) {
      console.error('Error updating teacher stats:', error);
    }
  };

  // Subject operations
  const addSubject = async (subject: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (user) {
      try {
        const { data, error } = await supabase
          .from('subjects')
          .insert(subjectToDbSubject(subject, user.id))
          .select()
          .single();

        if (error) throw error;

        const newSubject = dbSubjectToSubject(data);
        setSubjects(prev => [newSubject, ...prev]);
        await updateTeacherStats(user.id);
        return newSubject;
      } catch (error) {
        console.error('Error adding subject:', error);
        throw error;
      }
    } else {
      // Fallback to localStorage
      const newSubject: Subject = {
        ...subject,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setSubjects(prev => [newSubject, ...prev]);
      localStorage.setItem('subjects', JSON.stringify([newSubject, ...subjects]));
      return newSubject;
    }
  };

  const updateSubject = async (id: string, updatedSubject: Partial<Subject>) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('subjects')
          .update({
            name: updatedSubject.name,
            code: updatedSubject.code,
            category: updatedSubject.category,
            color: updatedSubject.color,
            icon: updatedSubject.icon,
            description: updatedSubject.description || null,
            grades: updatedSubject.grades,
            default_duration: updatedSubject.defaultDuration,
            default_price: updatedSubject.defaultPrice,
            materials: updatedSubject.materials || [],
            objectives: updatedSubject.objectives || [],
            prerequisites: updatedSubject.prerequisites || [],
            is_active: updatedSubject.isActive,
          })
          .eq('id', id);

        if (error) throw error;

        setSubjects(prev => prev.map(subject => 
          subject.id === id ? { ...subject, ...updatedSubject, updatedAt: new Date() } : subject
        ));
        await updateTeacherStats(user.id);
      } catch (error) {
        console.error('Error updating subject:', error);
        throw error;
      }
    } else {
      // Fallback to localStorage
      const updatedSubjects = subjects.map(subject => 
        subject.id === id ? { ...subject, ...updatedSubject, updatedAt: new Date() } : subject
      );
      setSubjects(updatedSubjects);
      localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
    }
  };

  const deleteSubject = async (id: string) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('subjects')
          .delete()
          .eq('id', id);

        if (error) throw error;

        setSubjects(prev => prev.filter(subject => subject.id !== id));
        await updateTeacherStats(user.id);
      } catch (error) {
        console.error('Error deleting subject:', error);
        throw error;
      }
    } else {
      // Fallback to localStorage
      const updatedSubjects = subjects.filter(subject => subject.id !== id);
      setSubjects(updatedSubjects);
      localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
    }
  };

  // Group operations
  const addGroup = async (group: Omit<StudentGroup, 'id'>) => {
    if (user) {
      try {
        const { data: groupData, error: groupError } = await supabase
          .from('student_groups')
          .insert(groupToDbGroup(group, user.id))
          .select()
          .single();

        if (groupError) throw groupError;

        // Add schedules
        if (group.schedule && group.schedule.length > 0) {
          const scheduleInserts = group.schedule.map(schedule => ({
            group_id: groupData.id,
            day: schedule.day as any,
            start_time: schedule.startTime,
            end_time: schedule.endTime,
            duration: schedule.duration,
            location: schedule.location || null,
          }));

          const { error: scheduleError } = await supabase
            .from('group_schedules')
            .insert(scheduleInserts);

          if (scheduleError) throw scheduleError;
        }

        const newGroup = dbGroupToGroup(groupData, []);
        newGroup.schedule = group.schedule;
        setGroups(prev => [newGroup, ...prev]);
        await updateTeacherStats(user.id);
        return newGroup;
      } catch (error) {
        console.error('Error adding group:', error);
        throw error;
      }
    } else {
      // Fallback to localStorage
      const newGroup: StudentGroup = {
        ...group,
        id: Date.now().toString(),
      };
      setGroups(prev => [newGroup, ...prev]);
      localStorage.setItem('groups', JSON.stringify([newGroup, ...groups]));
      return newGroup;
    }
  };

  const updateGroup = async (id: string, updatedGroup: Partial<StudentGroup>) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('student_groups')
          .update({
            name: updatedGroup.name,
            subject_id: updatedGroup.subjectId,
            grade: updatedGroup.grade,
            description: updatedGroup.description || null,
            monthly_price: updatedGroup.monthlyPrice,
            max_students: updatedGroup.maxStudents,
            current_students: updatedGroup.currentStudents,
            location: updatedGroup.location || null,
            materials: updatedGroup.materials || [],
            rules: updatedGroup.rules || [],
            start_date: updatedGroup.startDate?.toISOString().split('T')[0] || null,
            end_date: updatedGroup.endDate?.toISOString().split('T')[0] || null,
            is_active: updatedGroup.isActive,
          })
          .eq('id', id);

        if (error) throw error;

        // Update schedules if provided
        if (updatedGroup.schedule) {
          // Delete existing schedules
          await supabase
            .from('group_schedules')
            .delete()
            .eq('group_id', id);

          // Insert new schedules
          if (updatedGroup.schedule.length > 0) {
            const scheduleInserts = updatedGroup.schedule.map(schedule => ({
              group_id: id,
              day: schedule.day as any,
              start_time: schedule.startTime,
              end_time: schedule.endTime,
              duration: schedule.duration,
              location: schedule.location || null,
            }));

            await supabase
              .from('group_schedules')
              .insert(scheduleInserts);
          }
        }

        setGroups(prev => prev.map(group => 
          group.id === id ? { ...group, ...updatedGroup } : group
        ));
        await updateTeacherStats(user.id);
      } catch (error) {
        console.error('Error updating group:', error);
        throw error;
      }
    } else {
      // Fallback to localStorage
      const updatedGroups = groups.map(group => 
        group.id === id ? { ...group, ...updatedGroup } : group
      );
      setGroups(updatedGroups);
      localStorage.setItem('groups', JSON.stringify(updatedGroups));
    }
  };

  const deleteGroup = async (id: string) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('student_groups')
          .delete()
          .eq('id', id);

        if (error) throw error;

        setGroups(prev => prev.filter(group => group.id !== id));
        await updateTeacherStats(user.id);
      } catch (error) {
        console.error('Error deleting group:', error);
        throw error;
      }
    } else {
      // Fallback to localStorage
      const updatedGroups = groups.filter(group => group.id !== id);
      setGroups(updatedGroups);
      localStorage.setItem('groups', JSON.stringify(updatedGroups));
    }
  };

  // Student operations (updated)
  const addStudent = async (student: Omit<Student, 'id'>) => {
    // إضافة كود الطالب إذا لم يكن موجوداً
    const studentWithCode = {
      ...student,
      studentCode: student.studentCode || generateStudentCode(student.name, student.grade)
    };

    if (user) {
      try {
        const { data, error } = await supabase
          .from('students')
          .insert(studentToDbStudent(studentWithCode, user.id))
          .select()
          .single();

        if (error) throw error;

        const newStudent = dbStudentToStudent(data);
        
        // Add to group if specified
        if (student.groups && student.groups.length > 0) {
          for (const groupId of student.groups) {
            await supabase
              .from('group_students')
              .insert({
                group_id: groupId,
                student_id: data.id,
              });
          }
          newStudent.groups = student.groups;
        }

        setStudents(prev => [newStudent, ...prev]);
        await updateTeacherStats(user.id);
        return newStudent;
      } catch (error) {
        console.error('Error adding student:', error);
        throw error;
      }
    } else {
      // Fallback to localStorage
      const newStudent: Student = {
        ...studentWithCode,
        id: Date.now().toString(),
      };
      setStudents(prev => [newStudent, ...prev]);
      localStorage.setItem('students', JSON.stringify([newStudent, ...students]));
      return newStudent;
    }
  };

  const updateStudent = async (id: string, updatedStudent: Partial<Student>) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('students')
          .update({
            name: updatedStudent.name,
            phone: updatedStudent.phone,
            parent_phone: updatedStudent.parentPhone || null,
            grade: updatedStudent.grade,
            subject: updatedStudent.subject,
            subject_id: updatedStudent.subjectId || null,
            address: updatedStudent.address || null,
            notes: updatedStudent.notes || null,
            is_active: updatedStudent.isActive,
            avatar: updatedStudent.avatar || null,
            student_code: updatedStudent.studentCode || null,
          })
          .eq('id', id);

        if (error) throw error;

        setStudents(prev => prev.map(student => 
          student.id === id ? { ...student, ...updatedStudent } : student
        ));
        await updateTeacherStats(user.id);
      } catch (error) {
        console.error('Error updating student:', error);
        throw error;
      }
    } else {
      // Fallback to localStorage
      const updatedStudents = students.map(student => 
        student.id === id ? { ...student, ...updatedStudent } : student
      );
      setStudents(updatedStudents);
      localStorage.setItem('students', JSON.stringify(updatedStudents));
    }
  };

  const deleteStudent = async (id: string) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('students')
          .delete()
          .eq('id', id);

        if (error) throw error;

        setStudents(prev => prev.filter(student => student.id !== id));
        setSessions(prev => prev.filter(session => session.studentId !== id));
        setPayments(prev => prev.filter(payment => payment.studentId !== id));
        await updateTeacherStats(user.id);
      } catch (error) {
        console.error('Error deleting student:', error);
        throw error;
      }
    } else {
      // Fallback to localStorage
      const updatedStudents = students.filter(student => student.id !== id);
      const updatedSessions = sessions.filter(session => session.studentId !== id);
      const updatedPayments = payments.filter(payment => payment.studentId !== id);
      
      setStudents(updatedStudents);
      setSessions(updatedSessions);
      setPayments(updatedPayments);
      
      localStorage.setItem('students', JSON.stringify(updatedStudents));
      localStorage.setItem('sessions', JSON.stringify(updatedSessions));
      localStorage.setItem('payments', JSON.stringify(updatedPayments));
    }
  };

  const addSession = async (session: Omit<Session, 'id'>) => {
    if (user) {
      try {
        const { data, error } = await supabase
          .from('sessions')
          .insert({
            teacher_id: user.id,
            student_id: session.studentId!,
            subject_id: session.subjectId || null,
            group_id: session.groupId || null,
            date: session.date.toISOString(),
            duration: session.duration,
            topic: session.topic,
            homework: session.homework || null,
            notes: session.notes || null,
            payment: session.payment,
            is_paid: session.isPaid,
            status: session.status,
          })
          .select()
          .single();

        if (error) throw error;

        const newSession = dbSessionToSession(data);
        setSessions(prev => [newSession, ...prev]);
        await updateTeacherStats(user.id);
        return newSession;
      } catch (error) {
        console.error('Error adding session:', error);
        throw error;
      }
    } else {
      // Fallback to localStorage
      const newSession: Session = {
        ...session,
        id: Date.now().toString(),
      };
      setSessions(prev => [newSession, ...prev]);
      localStorage.setItem('sessions', JSON.stringify([newSession, ...sessions]));
      return newSession;
    }
  };

  const updateSession = async (id: string, updatedSession: Partial<Session>) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('sessions')
          .update({
            student_id: updatedSession.studentId,
            subject_id: updatedSession.subjectId || null,
            group_id: updatedSession.groupId || null,
            date: updatedSession.date?.toISOString(),
            duration: updatedSession.duration,
            topic: updatedSession.topic,
            homework: updatedSession.homework || null,
            notes: updatedSession.notes || null,
            payment: updatedSession.payment,
            is_paid: updatedSession.isPaid,
            status: updatedSession.status,
          })
          .eq('id', id);

        if (error) throw error;

        setSessions(prev => prev.map(session => 
          session.id === id ? { ...session, ...updatedSession } : session
        ));
        await updateTeacherStats(user.id);
      } catch (error) {
        console.error('Error updating session:', error);
        throw error;
      }
    } else {
      // Fallback to localStorage
      const updatedSessions = sessions.map(session => 
        session.id === id ? { ...session, ...updatedSession } : session
      );
      setSessions(updatedSessions);
      localStorage.setItem('sessions', JSON.stringify(updatedSessions));
    }
  };

  const deleteSession = async (id: string) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('sessions')
          .delete()
          .eq('id', id);

        if (error) throw error;

        setSessions(prev => prev.filter(session => session.id !== id));
        await updateTeacherStats(user.id);
      } catch (error) {
        console.error('Error deleting session:', error);
        throw error;
      }
    } else {
      // Fallback to localStorage
      const updatedSessions = sessions.filter(session => session.id !== id);
      setSessions(updatedSessions);
      localStorage.setItem('sessions', JSON.stringify(updatedSessions));
    }
  };

  const addPayment = async (payment: Omit<Payment, 'id'>) => {
    if (user) {
      try {
        const { data, error } = await supabase
          .from('payments')
          .insert({
            teacher_id: user.id,
            student_id: payment.studentId,
            session_id: payment.sessionId || null,
            subject_id: payment.subjectId || null,
            group_id: payment.groupId || null,
            amount: payment.amount,
            date: payment.date.toISOString(),
            type: payment.type,
            notes: payment.notes || null,
            method: payment.method,
          })
          .select()
          .single();

        if (error) throw error;

        const newPayment = dbPaymentToPayment(data);
        setPayments(prev => [newPayment, ...prev]);
        await updateTeacherStats(user.id);
        return newPayment;
      } catch (error) {
        console.error('Error adding payment:', error);
        throw error;
      }
    } else {
      // Fallback to localStorage
      const newPayment: Payment = {
        ...payment,
        id: Date.now().toString(),
      };
      setPayments(prev => [newPayment, ...prev]);
      localStorage.setItem('payments', JSON.stringify([newPayment, ...payments]));
      return newPayment;
    }
  };

  const updateSettings = async (newSettings: Partial<TeacherSettings>) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('teachers')
          .upsert({
            id: user.id,
            email: user.email!,
            name: newSettings.name || settings.name,
            phone: newSettings.phone || settings.phone,
            subject: newSettings.subject || settings.subject,
            hourly_rate: newSettings.hourlyRate || settings.hourlyRate,
            address: newSettings.address || settings.address || null,
            working_hours_start: newSettings.workingHours?.start || settings.workingHours.start,
            working_hours_end: newSettings.workingHours?.end || settings.workingHours.end,
            working_days: newSettings.workingDays || settings.workingDays,
          });

        if (error) throw error;

        setSettings(prev => ({ ...prev, ...newSettings }));
      } catch (error) {
        console.error('Error updating settings:', error);
        throw error;
      }
    } else {
      // Fallback to localStorage
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      localStorage.setItem('settings', JSON.stringify(updatedSettings));
    }
  };

  return {
    students,
    sessions,
    payments,
    subjects,
    groups,
    settings,
    loading,
    user,
    addStudent,
    updateStudent,
    deleteStudent,
    addSession,
    updateSession,
    deleteSession,
    addPayment,
    updateSettings,
    addSubject,
    updateSubject,
    deleteSubject,
    addGroup,
    updateGroup,
    deleteGroup,
  };
};