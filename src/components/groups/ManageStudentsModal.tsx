import React, { useState, useEffect } from 'react';
import { X, UserPlus, UserMinus, Search, Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Student, StudentGroup } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface ManageStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: StudentGroup;
  allStudents: Student[];
  onUpdateGroup: (groupId: string, updates: Partial<StudentGroup>) => Promise<void>;
  onUpdateStudent: (studentId: string, updates: Partial<Student>) => Promise<void>;
}

const ManageStudentsModal: React.FC<ManageStudentsModalProps> = ({
  isOpen,
  onClose,
  group,
  allStudents,
  onUpdateGroup,
  onUpdateStudent
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // الطلاب المسجلين في المجموعة
  const enrolledStudents = allStudents.filter(student => 
    group.studentIds.includes(student.id)
  );

  // الطلاب المتاحين للإضافة (نفس الصف والمادة وغير مسجلين)
  const availableStudents = allStudents.filter(student => 
    student.grade === group.grade &&
    student.subject === group.subject &&
    !group.studentIds.includes(student.id) &&
    student.isActive &&
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setSelectedStudents([]);
    setSearchTerm('');
  }, [isOpen]);

  const handleAddStudents = async () => {
    if (selectedStudents.length === 0) return;
    
    setLoading(true);
    try {
      // التحقق من عدم تجاوز الحد الأقصى
      const newTotal = group.currentStudents + selectedStudents.length;
      if (newTotal > group.maxStudents) {
        alert(`لا يمكن إضافة ${selectedStudents.length} طلاب. المتاح فقط ${group.maxStudents - group.currentStudents} مقعد.`);
        setLoading(false);
        return;
      }

      // تحديث المجموعة
      const updatedStudentIds = [...group.studentIds, ...selectedStudents];
      await onUpdateGroup(group.id, {
        studentIds: updatedStudentIds,
        currentStudents: updatedStudentIds.length
      });

      // تحديث الطلاب
      for (const studentId of selectedStudents) {
        const student = allStudents.find(s => s.id === studentId);
        if (student) {
          const updatedGroups = [...(student.groups || []), group.id];
          await onUpdateStudent(studentId, { groups: updatedGroups });
        }
      }

      setSelectedStudents([]);
    } catch (error) {
      alert('حدث خطأ أثناء إضافة الطلاب');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    if (!window.confirm('هل أنت متأكد من إزالة هذا الطالب من المجموعة؟')) {
      return;
    }

    setLoading(true);
    try {
      // تحديث المجموعة
      const updatedStudentIds = group.studentIds.filter(id => id !== studentId);
      await onUpdateGroup(group.id, {
        studentIds: updatedStudentIds,
        currentStudents: updatedStudentIds.length
      });

      // تحديث الطالب
      const student = allStudents.find(s => s.id === studentId);
      if (student) {
        const updatedGroups = (student.groups || []).filter(id => id !== group.id);
        await onUpdateStudent(studentId, { groups: updatedGroups });
      }
    } catch (error) {
      alert('حدث خطأ أثناء إزالة الطالب');
    } finally {
      setLoading(false);
    }
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const getGroupStatus = () => {
    const occupancyPercentage = (group.currentStudents / group.maxStudents) * 100;
    if (group.currentStudents >= group.maxStudents) {
      return { text: 'مكتملة', color: 'red', icon: XCircle };
    } else if (occupancyPercentage >= 80) {
      return { text: 'شبه مكتملة', color: 'yellow', icon: AlertCircle };
    } else {
      return { text: 'متاحة', color: 'green', icon: CheckCircle };
    }
  };

  const status = getGroupStatus();
  const StatusIcon = status.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center space-x-3 rtl:space-x-reverse">
                    <Users className="h-6 w-6" />
                    <span>إدارة طلاب المجموعة</span>
                  </h2>
                  <p className="text-green-100 mt-1">{group.name}</p>
                  <div className="flex items-center space-x-4 rtl:space-x-reverse mt-2">
                    <span className="bg-green-500 px-3 py-1 rounded-full text-sm">
                      {group.grade} - {group.subject}
                    </span>
                    <div className={`flex items-center space-x-1 rtl:space-x-reverse px-3 py-1 rounded-full text-sm ${
                      status.color === 'green' ? 'bg-green-500' :
                      status.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}>
                      <StatusIcon className="h-4 w-4" />
                      <span>{status.text}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
            </div>

            <div className="flex h-[calc(90vh-140px)]">
              {/* الطلاب المسجلين */}
              <div className="w-1/2 p-6 border-l border-gray-200">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    الطلاب المسجلين ({enrolledStudents.length}/{group.maxStudents})
                  </h3>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(enrolledStudents.length / group.maxStudents) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {enrolledStudents.length > 0 ? (
                    enrolledStudents.map((student) => (
                      <div key={student.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <div className="h-10 w-10 bg-green-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium">
                                {student.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{student.name}</h4>
                              <p className="text-sm text-gray-600">{student.phone}</p>
                              {student.parentPhone && (
                                <p className="text-xs text-gray-500">ولي الأمر: {student.parentPhone}</p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveStudent(student.id)}
                            disabled={loading}
                            className="text-red-600 hover:text-red-800 transition-colors duration-200 disabled:opacity-50"
                            title="إزالة من المجموعة"
                          >
                            <UserMinus className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>لا يوجد طلاب مسجلين بعد</p>
                    </div>
                  )}
                </div>
              </div>

              {/* الطلاب المتاحين */}
              <div className="w-1/2 p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    إضافة طلاب جدد
                  </h3>
                  
                  {/* البحث */}
                  <div className="relative mb-4">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="بحث بالاسم..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-right"
                    />
                  </div>

                  {/* أزرار الإجراءات */}
                  {selectedStudents.length > 0 && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <span className="text-blue-800 font-medium">
                          تم اختيار {selectedStudents.length} طالب
                        </span>
                        <div className="flex space-x-2 rtl:space-x-reverse">
                          <button
                            onClick={() => setSelectedStudents([])}
                            className="text-gray-600 hover:text-gray-800 text-sm"
                          >
                            إلغاء التحديد
                          </button>
                          <button
                            onClick={handleAddStudents}
                            disabled={loading || group.currentStudents + selectedStudents.length > group.maxStudents}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 rtl:space-x-reverse"
                          >
                            <UserPlus className="h-4 w-4" />
                            <span>إضافة المحددين</span>
                          </button>
                        </div>
                      </div>
                      
                      {group.currentStudents + selectedStudents.length > group.maxStudents && (
                        <p className="text-red-600 text-sm mt-2">
                          تجاوز الحد الأقصى! المتاح فقط {group.maxStudents - group.currentStudents} مقعد
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {availableStudents.length > 0 ? (
                    availableStudents.map((student) => (
                      <div 
                        key={student.id} 
                        className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                          selectedStudents.includes(student.id)
                            ? 'bg-blue-50 border-blue-300'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                        onClick={() => toggleStudentSelection(student.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                              selectedStudents.includes(student.id)
                                ? 'bg-blue-600'
                                : 'bg-gray-600'
                            }`}>
                              <span className="text-white font-medium">
                                {student.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{student.name}</h4>
                              <p className="text-sm text-gray-600">{student.phone}</p>
                              {student.parentPhone && (
                                <p className="text-xs text-gray-500">ولي الأمر: {student.parentPhone}</p>
                              )}
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedStudents.includes(student.id)
                              ? 'border-blue-600 bg-blue-600'
                              : 'border-gray-300'
                          }`}>
                            {selectedStudents.includes(student.id) && (
                              <CheckCircle className="h-3 w-3 text-white" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>
                        {searchTerm 
                          ? 'لا توجد نتائج للبحث' 
                          : 'لا يوجد طلاب متاحين للإضافة'
                        }
                      </p>
                      <p className="text-sm mt-2">
                        يجب أن يكون الطالب في نفس الصف والمادة وغير مسجل في المجموعة
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span>المجموعة: {group.currentStudents}/{group.maxStudents} طالب</span>
                  {group.monthlyPrice > 0 && (
                    <span className="mr-4">السعر الشهري: {group.monthlyPrice} جنيه</span>
                  )}
                </div>
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

export default ManageStudentsModal;