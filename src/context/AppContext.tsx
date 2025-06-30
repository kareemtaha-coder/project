import React, { createContext, useContext, ReactNode } from 'react';
import { useSupabase } from '../hooks/useSupabase';
import { Student, Session, Payment, TeacherSettings, Subject, StudentGroup } from '../types';

interface AppContextType {
  students: Student[];
  sessions: Session[];
  payments: Payment[];
  subjects: Subject[];
  groups: StudentGroup[];
  settings: TeacherSettings;
  loading: boolean;
  user: any;
  addStudent: (student: Omit<Student, 'id'>) => Promise<Student>;
  updateStudent: (id: string, student: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  addSession: (session: Omit<Session, 'id'>) => Promise<Session>;
  updateSession: (id: string, session: Partial<Session>) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  addPayment: (payment: Omit<Payment, 'id'>) => Promise<Payment>;
  updateSettings: (settings: Partial<TeacherSettings>) => Promise<void>;
  addSubject: (subject: Omit<Subject, 'id' | 'created_at' | 'updated_at'>) => Promise<Subject>;
  updateSubject: (id: string, subject: Partial<Subject>) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
  addGroup: (group: Omit<StudentGroup, 'id'>) => Promise<StudentGroup>;
  updateGroup: (id: string, group: Partial<StudentGroup>) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const supabaseData = useSupabase();

  const value = {
    students: supabaseData.students,
    sessions: supabaseData.sessions,
    payments: supabaseData.payments,
    subjects: supabaseData.subjects,
    groups: supabaseData.groups,
    settings: supabaseData.settings,
    loading: supabaseData.loading,
    user: supabaseData.user,
    addStudent: supabaseData.addStudent,
    updateStudent: supabaseData.updateStudent,
    deleteStudent: supabaseData.deleteStudent,
    addSession: supabaseData.addSession,
    updateSession: supabaseData.updateSession,
    deleteSession: supabaseData.deleteSession,
    addPayment: supabaseData.addPayment,
    updateSettings: supabaseData.updateSettings,
    addSubject: supabaseData.addSubject,
    updateSubject: supabaseData.updateSubject,
    deleteSubject: supabaseData.deleteSubject,
    addGroup: supabaseData.addGroup,
    updateGroup: supabaseData.updateGroup,
    deleteGroup: supabaseData.deleteGroup,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};