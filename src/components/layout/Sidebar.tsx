import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  BarChart3, 
  Settings,
  BookOpen,
  Home,
  UserCheck,
  GraduationCap,
  UserCog
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'الرئيسية', path: '/' },
    { icon: UserCog, label: 'المدرسين', path: '/teachers' },
    { icon: Users, label: 'الطلاب', path: '/students' },
    { icon: UserCheck, label: 'المجموعات', path: '/groups' },
    { icon: GraduationCap, label: 'المواد الدراسية', path: '/subjects' },
    { icon: Calendar, label: 'الحصص', path: '/sessions' },
    { icon: DollarSign, label: 'المدفوعات', path: '/payments' },
    { icon: BarChart3, label: 'التقارير', path: '/reports' },
    { icon: Settings, label: 'الإعدادات', path: '/settings' }
  ];

  return (
    <div className="bg-white shadow-lg h-screen w-64 fixed right-0 top-0 z-40 border-l border-gray-200">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">إدارة التعليم</h1>
            <p className="text-sm text-gray-600">نظام شامل ومتكامل</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 rtl:space-x-reverse px-6 py-3 text-right transition-all duration-200 relative group ${
                isActive
                  ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
              <span className="font-medium">{item.label}</span>
              
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* System Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-gray-50">
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-full w-8 h-8 mx-auto mb-2 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
          <p className="text-xs text-gray-600">النظام متصل</p>
          <p className="text-xs text-green-600 font-medium">قاعدة البيانات نشطة</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;