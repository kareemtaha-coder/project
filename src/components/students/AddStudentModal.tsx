import React, { useState, useEffect } from 'react';
import { X, Save, Loader, User, Phone, GraduationCap, QrCode, Users } from 'lucide-react';
import { Student, Subject, StudentGroup } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { generateStudentCode, generateStudentQRCode } from '../../utils/qrCodeGenerator';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Omit<Student, 'id'>) => Promise<void>;
  editStudent?: Student | null;
  availableGroups?: StudentGroup[]; // إضافة المجموعات المتاحة كخاصية
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editStudent,
  availableGroups = [] // قيمة افتراضية
}) => {
  // قائمة المواد المتاحة (يمكن جلبها من context أو API)
  const [subjects] = useState<Subject[]>([
    { id: '1', name: 'الرياضيات', code: 'MATH', category: 'رياضيات', grades: [], color: '#3B82F6', isActive: true, created_at: new Date(), updated_at: new Date() },
    { id: '2', name: 'الفيزياء', code: 'PHYS', category: 'علوم', grades: [], color: '#10B981', isActive: true, created_at: new Date(), updated_at: new Date() },
    { id: '3', name: 'اللغة الإنجليزية', code: 'ENG', category: 'لغات', grades: [], color: '#8B5CF6', isActive: true, created_at: new Date(), updated_at: new Date() }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    grade: '',
    subject: '',
    subjectId: '',
    groupId: '', // إضافة معرف المجموعة
    parentPhone: '',
    address: '',
    notes: '',
    isActive: true,
    studentCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showQRPreview, setShowQRPreview] = useState(false);

  useEffect(() => {
    if (editStudent) {
      setFormData({
        name: editStudent.name,
        phone: editStudent.phone,
        grade: editStudent.grade,
        subject: editStudent.subject,
        subjectId: editStudent.subjectId || '',
        groupId: editStudent.groups?.[0] || '', // أول مجموعة إذا كان مسجل في مجموعات
        parentPhone: editStudent.parentPhone || '',
        address: editStudent.address || '',
        notes: editStudent.notes || '',
        isActive: editStudent.isActive,
        studentCode: editStudent.studentCode || ''
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        grade: '',
        subject: '',
        subjectId: '',
        groupId: '',
        parentPhone: '',
        address: '',
        notes: '',
        isActive: true,
        studentCode: ''
      });
    }
    setError('');
    setShowQRPreview(false);
  }, [editStudent, isOpen]);

  // إنشاء كود تلقائي عند تغيير الاسم والصف
  useEffect(() => {
    if (formData.name && formData.grade && !editStudent) {
      const autoCode = generateStudentCode(formData.name, formData.grade);
      setFormData(prev => ({ ...prev, studentCode: autoCode }));
    }
  }, [formData.name, formData.grade, editStudent]);

  // تحديث المادة عند اختيار مادة جديدة
  const handleSubjectChange = (subjectId: string) => {
    const selectedSubject = subjects.find(s => s.id === subjectId);
    if (selectedSubject) {
      setFormData(prev => ({
        ...prev,
        subjectId,
        subject: selectedSubject.name,
        groupId: '' // إعادة تعيين المجموعة عند تغيير المادة
      }));
    }
  };

  // تحديث الصف عند اختيار صف جديد
  const handleGradeChange = (grade: string) => {
    setFormData(prev => ({
      ...prev,
      grade,
      groupId: '' // إعادة تعيين المجموعة عند تغيير الصف
    }));
  };

  // فلترة المجموعات حسب المادة والصف المختارين
  const getAvailableGroups = () => {
    return availableGroups.filter(group => 
      group.isActive &&
      group.subject === formData.subject &&
      group.grade === formData.grade &&
      group.currentStudents < group.maxStudents
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const studentData = {
        ...formData,
        joinDate: editStudent?.joinDate || new Date(),
        studentCode: formData.studentCode || generateStudentCode(formData.name, formData.grade),
        groups: formData.groupId ? [formData.groupId] : undefined // إضافة المجموعة إذا تم اختيارها
      };

      await onSave(studentData);
      
      // عرض معاينة QR Code للطلاب الجدد
      if (!editStudent) {
        setShowQRPreview(true);
        setTimeout(() => {
          setShowQRPreview(false);
          onClose();
        }, 3000);
      } else {
        onClose();
      }
    } catch (err) {
      setError('حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى.');
      console.error('Error saving student:', err);
    } finally {
      setLoading(false);
    }
  };

  const grades = [
    'الصف الأول الابتدائي',
    'الصف الثاني الابتدائي',
    'الصف الثالث الابتدائي',
    'الصف الرابع الابتدائي',
    'الصف الخامس الابتدائي',
    'الصف السادس الابتدائي',
    'الصف الأول الإعدادي',
    'الصف الثاني الإعدادي',
    'الصف الثالث الإعدادي',
    'الصف الأول الثانوي',
    'الصف الثاني الثانوي',
    'الصف الثالث الثانوي'
  ];

  // معاينة QR Code
  const getQRPreview = () => {
    if (formData.name && formData.studentCode) {
      const mockStudent = { 
        id: 'preview', 
        name: formData.name, 
        studentCode: formData.studentCode 
      };
      return generateStudentQRCode(mockStudent).qrCodeUrl;
    }
    return '';
  };

  const filteredGroups = getAvailableGroups();
  const selectedGroup = availableGroups.find(g => g.id === formData.groupId);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center space-x-3 rtl:space-x-reverse">
                  <User className="h-6 w-6" />
                  <span>{editStudent ? 'تعديل بيانات الطالب' : 'إضافة طالب جديد'}</span>
                </h2>
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
              <p className="text-blue-100 mt-2">
                {editStudent ? 'تعديل البيانات الأساسية للطالب' : 'سيتم إنشاء QR Code تلقائياً للطالب'}
              </p>
            </div>

            {/* QR Code Success Preview */}
            <AnimatePresence>
              {showQRPreview && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-green-50 border-b border-green-200 p-4"
                >
                  <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse">
                    <div className="bg-green-100 p-2 rounded-full">
                      <QrCode className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-green-800 font-medium">تم إنشاء الطالب بنجاح!</p>
                      <p className="text-green-600 text-sm">تم إنشاء QR Code للطالب: {formData.studentCode}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* البيانات الأساسية المطلوبة */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center space-x-2 rtl:space-x-reverse">
                  <User className="h-5 w-5" />
                  <span>البيانات الأساسية المطلوبة</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      اسم الطالب *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                      placeholder="أدخل اسم الطالب"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      كود الطالب {!editStudent && <span className="text-xs text-blue-600">(تلقائي)</span>}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <QrCode className="h-4 w-4 text-blue-400" />
                      </div>
                      <input
                        type="text"
                        value={formData.studentCode}
                        onChange={(e) => setFormData({ ...formData, studentCode: e.target.value })}
                        className="w-full pr-10 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right bg-blue-50"
                        placeholder="سيتم إنشاؤه تلقائياً"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      رقم الهاتف *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-blue-400" />
                      </div>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pr-10 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                        placeholder="01xxxxxxxxx"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      الصف الدراسي *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <GraduationCap className="h-4 w-4 text-blue-400" />
                      </div>
                      <select
                        required
                        value={formData.grade}
                        onChange={(e) => handleGradeChange(e.target.value)}
                        className="w-full pr-10 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right appearance-none"
                        disabled={loading}
                      >
                        <option value="">اختر الصف</option>
                        {grades.map(grade => (
                          <option key={grade} value={grade}>{grade}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      المادة *
                    </label>
                    <select
                      required
                      value={formData.subjectId}
                      onChange={(e) => handleSubjectChange(e.target.value)}
                      className="w-full py-3 px-4 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right appearance-none"
                      disabled={loading}
                    >
                      <option value="">اختر المادة</option>
                      {subjects.filter(s => s.isActive).map(subject => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name} ({subject.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* اختيار المجموعة */}
              {formData.subjectId && formData.grade && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center space-x-2 rtl:space-x-reverse">
                    <Users className="h-5 w-5" />
                    <span>اختيار المجموعة (اختياري)</span>
                  </h3>
                  
                  {filteredGroups.length > 0 ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-green-700 mb-2">
                          المجموعة المناسبة
                        </label>
                        <select
                          value={formData.groupId}
                          onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                          className="w-full py-3 px-4 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-right"
                          disabled={loading}
                        >
                          <option value="">بدون مجموعة (حصص فردية)</option>
                          {filteredGroups.map(group => (
                            <option key={group.id} value={group.id}>
                              {group.name} - {group.currentStudents}/{group.maxStudents} طالب - {group.monthlyPrice} جنيه/شهر
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* معاينة المجموعة المختارة */}
                      {selectedGroup && (
                        <div className="bg-white rounded-lg p-4 border border-green-300">
                          <h4 className="font-medium text-green-900 mb-2">تفاصيل المجموعة المختارة:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <div>
                              <span className="text-green-700 font-medium">الاسم:</span>
                              <p className="text-green-900">{selectedGroup.name}</p>
                            </div>
                            <div>
                              <span className="text-green-700 font-medium">السعر الشهري:</span>
                              <p className="text-green-900">{selectedGroup.monthlyPrice} جنيه</p>
                            </div>
                            <div>
                              <span className="text-green-700 font-medium">عدد الطلاب:</span>
                              <p className="text-green-900">{selectedGroup.currentStudents}/{selectedGroup.maxStudents}</p>
                            </div>
                          </div>
                          {selectedGroup.description && (
                            <div className="mt-2">
                              <span className="text-green-700 font-medium text-sm">الوصف:</span>
                              <p className="text-green-900 text-sm">{selectedGroup.description}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Users className="h-12 w-12 mx-auto mb-3 text-green-400" />
                      <p className="text-green-700 font-medium">لا توجد مجموعات متاحة</p>
                      <p className="text-green-600 text-sm">
                        {!formData.subjectId || !formData.grade 
                          ? 'اختر المادة والصف أولاً لعرض المجموعات المتاحة'
                          : 'لا توجد مجموعات نشطة لهذا الصف والمادة، سيتم تسجيل الطالب للحصص الفردية'
                        }
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* معاينة QR Code */}
              {formData.name && formData.studentCode && !editStudent && (
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center space-x-2 rtl:space-x-reverse">
                    <QrCode className="h-5 w-5" />
                    <span>معاينة QR Code</span>
                  </h3>
                  
                  <div className="text-center">
                    <img 
                      src={getQRPreview()} 
                      alt="QR Code Preview" 
                      className="mx-auto mb-3 border border-purple-300 rounded-lg"
                      style={{ width: '120px', height: '120px' }}
                    />
                    <p className="text-purple-700 text-sm">
                      سيتم إنشاء هذا الكود للطالب {formData.name}
                    </p>
                    <p className="text-purple-600 text-xs">
                      الكود: {formData.studentCode}
                    </p>
                  </div>
                </div>
              )}

              {/* البيانات الاختيارية */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  بيانات إضافية (اختيارية)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رقم هاتف ولي الأمر
                    </label>
                    <input
                      type="tel"
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                      className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                      placeholder="01xxxxxxxxx"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      العنوان
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                      placeholder="عنوان السكن"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ملاحظات
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                    placeholder="أي ملاحظات إضافية..."
                    disabled={loading}
                  />
                </div>
              </div>

              {/* حالة الطالب */}
              <div className="flex items-center justify-between bg-green-50 rounded-lg p-4 border border-green-200">
                <div>
                  <h4 className="font-medium text-green-900">حالة الطالب</h4>
                  <p className="text-sm text-green-700">هل الطالب نشط حالياً؟</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="sr-only peer"
                    disabled={loading}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  <span className="mr-3 text-sm font-medium text-green-900">
                    {formData.isActive ? 'نشط' : 'غير نشط'}
                  </span>
                </label>
              </div>

              {/* أزرار الحفظ */}
              <div className="flex space-x-4 rtl:space-x-reverse pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 font-medium"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.name || !formData.phone || !formData.grade || !formData.subjectId}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 rtl:space-x-reverse disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      <span>جاري الحفظ...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>{editStudent ? 'حفظ التعديلات' : 'إضافة الطالب'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* رسالة توضيحية */}
              {!editStudent && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">ملاحظات مهمة</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• يمكن إضافة الطالب لمجموعة أو تركه للحصص الفردية</li>
                        <li>• سيتم إنشاء QR Code فريد للطالب تلقائياً</li>
                        <li>• يمكن تعديل المجموعة لاحقاً من خلال إدارة المجموعات</li>
                        <li>• البيانات الإضافية يمكن إكمالها من ملف الطالب</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddStudentModal;