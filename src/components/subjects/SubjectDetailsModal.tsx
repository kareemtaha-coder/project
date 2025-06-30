import React from 'react';
import { X, BookOpen, Target, List, Clock, DollarSign, Users, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Subject } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface SubjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: Subject;
}

const SubjectDetailsModal: React.FC<SubjectDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  subject 
}) => {
  const StatusIcon = subject.isActive ? CheckCircle : XCircle;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div 
              className="text-white p-6 rounded-t-2xl"
              style={{ background: `linear-gradient(135deg, ${subject.color} 0%, ${subject.color}CC 100%)` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl bg-white/20"
                  >
                    {subject.icon || '📚'}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">{subject.name}</h2>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse mt-2">
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                        كود: {subject.code}
                      </span>
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                        {subject.category}
                      </span>
                      <div className={`flex items-center space-x-1 rtl:space-x-reverse px-3 py-1 rounded-full text-sm ${
                        subject.isActive ? 'bg-green-500/20' : 'bg-red-500/20'
                      }`}>
                        <StatusIcon className="h-4 w-4" />
                        <span>{subject.isActive ? 'نشطة' : 'غير نشطة'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Description */}
              {subject.description && (
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">وصف المادة</h3>
                  <p className="text-gray-700 leading-relaxed">{subject.description}</p>
                </div>
              )}

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 text-center">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-900">{subject.totalStudents || 0}</p>
                  <p className="text-sm text-blue-700">طالب مسجل</p>
                </div>

                <div className="bg-green-50 rounded-lg p-4 border border-green-200 text-center">
                  <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-900">{subject.totalGroups || 0}</p>
                  <p className="text-sm text-green-700">مجموعة نشطة</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 text-center">
                  <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-900">{subject.totalSessions || 0}</p>
                  <p className="text-sm text-purple-700">حصة مكتملة</p>
                </div>

                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200 text-center">
                  <DollarSign className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-900">{subject.defaultPrice || 0}</p>
                  <p className="text-sm text-orange-700">جنيه/حصة</p>
                </div>
              </div>

              {/* Default Settings */}
              <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                <h3 className="text-lg font-semibold text-orange-900 mb-4 flex items-center space-x-2 rtl:space-x-reverse">
                  <Clock className="h-5 w-5" />
                  <span>الإعدادات الافتراضية</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <span className="font-medium text-orange-900">مدة الحصة</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-900">{subject.defaultDuration || 60} دقيقة</p>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                      <DollarSign className="h-4 w-4 text-orange-600" />
                      <span className="font-medium text-orange-900">سعر الحصة</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-900">{subject.defaultPrice || 0} جنيه</p>
                  </div>
                </div>
              </div>

              {/* Grades */}
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center space-x-2 rtl:space-x-reverse">
                  <Target className="h-5 w-5" />
                  <span>الصفوف الدراسية ({subject.grades.length})</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {subject.grades.map((grade, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 border border-green-300">
                      <span className="text-green-800 font-medium">{grade}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Materials */}
              {subject.materials && subject.materials.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center space-x-2 rtl:space-x-reverse">
                    <List className="h-5 w-5" />
                    <span>المواد المطلوبة ({subject.materials.length})</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {subject.materials.map((material, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-blue-300 flex items-center space-x-2 rtl:space-x-reverse">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-blue-800">{material}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Objectives */}
              {subject.objectives && subject.objectives.length > 0 && (
                <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
                  <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center space-x-2 rtl:space-x-reverse">
                    <Target className="h-5 w-5" />
                    <span>أهداف المادة ({subject.objectives.length})</span>
                  </h3>
                  
                  <div className="space-y-3">
                    {subject.objectives.map((objective, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-indigo-300">
                        <div className="flex items-start space-x-3 rtl:space-x-reverse">
                          <div className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">
                            {index + 1}
                          </div>
                          <span className="text-indigo-800 flex-1">{objective}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prerequisites */}
              {subject.prerequisites && subject.prerequisites.length > 0 && (
                <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center space-x-2 rtl:space-x-reverse">
                    <BookOpen className="h-5 w-5" />
                    <span>المتطلبات السابقة ({subject.prerequisites.length})</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {subject.prerequisites.map((prerequisite, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-yellow-300 flex items-center space-x-2 rtl:space-x-reverse">
                        <CheckCircle className="h-4 w-4 text-yellow-600" />
                        <span className="text-yellow-800">{prerequisite}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات إضافية</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">تاريخ الإنشاء:</span>
                    <p className="text-gray-900">{subject.created_at ? new Date(subject.created_at).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''}</p>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">آخر تحديث:</span>
                    <p className="text-gray-900">{subject.updated_at ? new Date(subject.updated_at).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-2xl">
              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SubjectDetailsModal;