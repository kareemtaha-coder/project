import React, { useState } from 'react';
import { Search, Filter, Star, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { mockCourses } from '../data/mockData';

const CoursesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  const subjects = ['رياضيات', 'فيزياء', 'كيمياء', 'لغة إنجليزية', 'لغة عربية', 'أحياء'];
  const levels = ['ابتدائي', 'إعدادي', 'الثانوية العامة', 'جامعي'];

  const filteredCourses = mockCourses.filter(course => {
    return (
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedSubject === '' || course.subject === selectedSubject) &&
      (selectedLevel === '' || course.level === selectedLevel)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            جميع <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">الدورات</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            اكتشف مجموعة واسعة من الدورات التعليمية المصممة لمساعدتك على النجاح
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="ابحث عن دورة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
              />
            </div>

            {/* Subject Filter */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
            >
              <option value="">جميع المواد</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>

            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
            >
              <option value="">جميع المراحل</option>
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            {/* Filter Button */}
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 rtl:space-x-reverse">
              <Filter className="h-5 w-5" />
              <span>تطبيق الفلتر</span>
            </button>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            تم العثور على <span className="font-semibold text-blue-600">{filteredCourses.length}</span> دورة
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Course Image */}
              <div className="relative overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span className="text-sm font-semibold text-blue-600">{course.level}</span>
                </div>
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span className="text-sm font-medium text-white">{course.subject}</span>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {course.description}
                  </p>
                </div>

                {/* Tutor Info */}
                <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
                  <img
                    src={course.tutor.avatar}
                    alt={course.tutor.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{course.tutor.name}</p>
                    <div className="flex items-center space-x-1 rtl:space-x-reverse">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{course.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Course Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration} أسبوع</span>
                  </div>
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <Users className="h-4 w-4" />
                    <span>{course.enrolledStudents}/{course.maxStudents}</span>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-blue-600">{course.price}</span>
                    <span className="text-gray-600"> جنيه</span>
                  </div>
                  <Link
                    to={`/courses/${course.id}`}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                  >
                    عرض التفاصيل
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              لم يتم العثور على دورات
            </h3>
            <p className="text-gray-600">
              جرب تغيير معايير البحث أو الفلتر
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;