import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6 mr-64">
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </button>
        
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-gray-900"
        >
          {title}
        </motion.h1>
      </div>

      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        {/* Search */}
        <div className="relative hidden md:block">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="بحث..."
            className="w-64 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right text-sm"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Current Date */}
        <div className="text-sm text-gray-600 hidden md:block">
          {new Date().toLocaleDateString('ar-EG', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>
    </header>
  );
};

export default Header;