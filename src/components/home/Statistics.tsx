import React from 'react';
import { Users, BookOpen, Award, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const Statistics: React.FC = () => {
  const stats = [
    {
      icon: Users,
      number: '5,000+',
      label: 'طالب مسجل',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: BookOpen,
      number: '200+',
      label: 'دورة تعليمية',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      icon: Award,
      number: '150+',
      label: 'مدرس معتمد',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Clock,
      number: '50,000+',
      label: 'ساعة تدريس',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            أرقام تتحدث عن <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">نجاحنا</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            انضم إلى مجتمع متنامي من الطلاب والمدرسين الذين يحققون النجاح معاً
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="relative mb-6">
                <div className={`mx-auto w-20 h-20 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110`}>
                  <stat.icon className="h-10 w-10 text-white" />
                </div>
                {/* Glow effect */}
                <div className={`absolute inset-0 mx-auto w-20 h-20 bg-gradient-to-r ${stat.color} rounded-2xl opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-300`}></div>
              </div>
              
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
              >
                <h3 className="text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </h3>
                <p className="text-gray-600 font-medium">
                  {stat.label}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Testimonial Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 text-center"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto border border-gray-100">
            <blockquote className="text-2xl font-medium text-gray-900 mb-6">
              "منصة رائعة ساعدتني كثيراً في تحسين درجاتي. المدرسين محترفين والمحتوى ممتاز"
            </blockquote>
            <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse">
              <img
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100"
                alt="Student"
                className="h-12 w-12 rounded-full object-cover"
              />
              <div className="text-right">
                <p className="font-semibold text-gray-900">أحمد محمد</p>
                <p className="text-gray-600">طالب ثانوية عامة</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Statistics;