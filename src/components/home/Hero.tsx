import React from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Users, Star, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-emerald-200 rounded-full opacity-20 animate-pulse"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-right space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                <span className="block">تعلم مع</span>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  أفضل المدرسين
                </span>
                <span className="block">في مصر</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                انضم لآلاف الطلاب الذين يحققون أهدافهم التعليمية من خلال دروس خصوصية
                مع مدرسين متخصصين في جميع المواد الدراسية
              </p>
            </div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative max-w-lg mx-auto lg:mx-0"
            >
              <div className="relative flex">
                <input
                  type="text"
                  placeholder="ابحث عن مادة أو مدرس..."
                  className="w-full px-6 py-4 text-right rounded-r-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg"
                />
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-l-2xl hover:shadow-lg transition-all duration-300">
                  <Search className="h-6 w-6" />
                </button>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                to="/courses"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 rtl:space-x-reverse"
              >
                <BookOpen className="h-5 w-5" />
                <span>تصفح الدورات</span>
              </Link>
              <Link
                to="/tutors"
                className="bg-white text-gray-800 px-8 py-4 rounded-xl font-semibold border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 rtl:space-x-reverse"
              >
                <Users className="h-5 w-5" />
                <span>ابحث عن مدرس</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10">
              <img
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Students learning"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
              
              {/* Floating Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100"
              >
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Star className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">4.9/5</p>
                    <p className="text-sm text-gray-600">تقييم المدرسين</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100"
              >
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">+5000</p>
                    <p className="text-sm text-gray-600">طالب مسجل</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-2xl -z-10 transform rotate-6"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;