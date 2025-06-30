import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Star, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockCourses } from '../../data/mockData';

const FeaturedCourses: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            الدورات <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">المميزة</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            اكتشف أفضل الدورات التعليمية المصممة خصيصاً لمساعدتك على تحقيق أهدافك الأكاديمية
          </p>
        </motion.div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
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
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2 rtl:space-x-reverse"
                  >
                    <span>عرض التفاصيل</span>
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            to="/courses"
            className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            <span>عرض جميع الدورات</span>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCourses;