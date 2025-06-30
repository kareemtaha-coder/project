import React, { useState, useEffect } from 'react';
import { X, Save, Loader, Users, Calendar, DollarSign, MapPin, Plus, Trash2 } from 'lucide-react';
import { GroupFormState, GroupPayload, mapFormToPayload } from '../../types/group';
import { GroupSchedule, StudentGroup, Subject } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

export type MinimalTeacher = { id: string; name: string; email: string };

interface AddGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (group: {
    name: string;
    subject_id: string;
    grade: string;
    description: string;
    monthly_price: number;
    max_students: number;
    current_students: number;
    location: string;
    is_active: boolean;
    teacher_id: string;
    start_date: string;
    end_date: string;
    schedule: GroupSchedule[];
  }) => Promise<void>;
  editGroup?: StudentGroup | null;
  teachers?: MinimalTeacher[];
  defaultTeacherId?: string;
  onTeachersError?: (error: string) => void;
}

const AddGroupModal: React.FC<AddGroupModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editGroup, 
  teachers: propTeachers = [],
  defaultTeacherId,
  onTeachersError
}) => {
  // قائمة المواد المتاحة (يمكن جلبها من context أو API)
  const [subjects] = useState<Subject[]>([
    { id: '1', name: 'الرياضيات', code: 'MATH', category: 'رياضيات', grades: [], color: '#3B82F6', isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { id: '2', name: 'الفيزياء', code: 'PHYS', category: 'علوم', grades: [], color: '#10B981', isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { id: '3', name: 'اللغة الإنجليزية', code: 'ENG', category: 'لغات', grades: [], color: '#8B5CF6', isActive: true, createdAt: new Date(), updatedAt: new Date() }
  ]);

  const [teachers, setTeachers] = useState<MinimalTeacher[]>(propTeachers);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [teachersError, setTeachersError] = useState('');

  const [formData, setFormData] = useState<GroupFormState>({
    name: '',
    subject_id: '',
    grade: '',
    description: '',
    monthly_price: 0,
    max_students: 10,
    current_students: 0,
    location: '',
    materials: [],
    rules: [],
    start_date: '',
    end_date: '',
    is_active: true,
    teacher_id: defaultTeacherId || ''
  });
  
  const [schedule, setSchedule] = useState<GroupSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const days = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
  const grades = [
    'الصف الأول الابتدائي', 'الصف الثاني الابتدائي', 'الصف الثالث الابتدائي',
    'الصف الرابع الابتدائي', 'الصف الخامس الابتدائي', 'الصف السادس الابتدائي',
    'الصف الأول الإعدادي', 'الصف الثاني الإعدادي', 'الصف الثالث الإعدادي',
    'الصف الأول الثانوي', 'الصف الثاني الثانوي', 'الصف الثالث الثانوي'
  ];

  // جلب المدرسين من قاعدة البيانات
  const fetchTeachers = async () => {
    setLoadingTeachers(true);
    setTeachersError('');
    
    try {
      console.log('Fetching teachers from database...');
      
      const { data, error } = await supabase
        .from('teachers')
        .select('id, name, email')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Teachers fetched:', data);
      
      if (!data || data.length === 0) {
        setTeachersError('لا توجد مدرسين نشطين في النظام. يرجى إضافة مدرسين أولاً.');
        if (onTeachersError) {
          onTeachersError('لا توجد مدرسين نشطين في النظام');
        }
      } else {
        setTeachers(data as MinimalTeacher[]);
        console.log(`تم تحميل ${data.length} مدرس بنجاح`);
      }
    } catch (err) {
      console.error('Error fetching teachers:', err);
      const errorMessage = err instanceof Error ? err.message : 'خطأ في جلب قائمة المدرسين';
      setTeachersError(errorMessage);
      if (onTeachersError) {
        onTeachersError(errorMessage);
      }
    } finally {
      setLoadingTeachers(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // جلب المدرسين عند فتح النافذة
      if (propTeachers.length === 0) {
        fetchTeachers();
      } else {
        setTeachers(propTeachers);
      }

      if (editGroup) {
        setFormData({
          name: editGroup.name,
          subject_id: editGroup.subjectId || '',
          grade: editGroup.grade,
          description: editGroup.description || '',
          monthly_price: editGroup.monthlyPrice || 0,
          max_students: editGroup.maxStudents || 0,
          current_students: editGroup.currentStudents || 0,
          location: editGroup.location || '',
          materials: editGroup.materials || [],
          rules: editGroup.rules || [],
          start_date: editGroup.startDate ? editGroup.startDate.toISOString().split('T')[0] : '',
          end_date: editGroup.endDate ? editGroup.endDate.toISOString().split('T')[0] : '',
          is_active: editGroup.isActive,
          teacher_id: editGroup.teacherId || ''
        });
        setSchedule(editGroup.schedule || []);
      } else {
        setFormData({
          name: '',
          subject_id: '',
          grade: '',
          description: '',
          monthly_price: 0,
          max_students: 10,
          current_students: 0,
          location: '',
          materials: [],
          rules: [],
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date().toISOString().split('T')[0],
          is_active: true,
          teacher_id: defaultTeacherId || ''
        });
        setSchedule([]);
      }
      setError('');
      setTeachersError('');
    }
  }, [editGroup, isOpen, defaultTeacherId, propTeachers]);

  // تحديث المادة عند اختيار مادة جديدة
  const handleSubjectChange = (subjectId: string) => {
    const selectedSubject = subjects.find(s => s.id === subjectId);
    if (selectedSubject) {
      setFormData(prev => ({
        ...prev,
        subject_id: subjectId
      }));
    }
  };

  const addScheduleSlot = () => {
    setSchedule([...schedule, {
      day: '',
      startTime: '',
      endTime: '',
      location: formData.location,
      duration: 60
    }]);
  };

  const updateScheduleSlot = (index: number, field: keyof GroupSchedule, value: string | number) => {
    const newSchedule = [...schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    
    // حساب المدة تلقائياً
    if (field === 'startTime' || field === 'endTime') {
      const slot = newSchedule[index];
      if (slot.startTime && slot.endTime) {
        const start = new Date(`2000-01-01 ${slot.startTime}`);
        const end = new Date(`2000-01-01 ${slot.endTime}`);
        const duration = (end.getTime() - start.getTime()) / (1000 * 60);
        newSchedule[index].duration = duration > 0 ? duration : 60;
      }
    }
    
    setSchedule(newSchedule);
  };

  const removeScheduleSlot = (index: number) => {
    setSchedule(schedule.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (schedule.length === 0) {
      setError('يجب إضافة موعد واحد على الأقل');
      setLoading(false);
      return;
    }

    if (!formData.teacher_id) {
      setError('يجب اختيار مدرس للمجموعة');
      setLoading(false);
      return;
    }
    
    try {
      const dbGroup = mapFormToPayload(formData, schedule);
      await onSave({
        name: dbGroup.name,
        subject_id: dbGroup.subject_id,
        grade: dbGroup.grade,
        description: dbGroup.description,
        monthly_price: dbGroup.monthly_price,
        max_students: dbGroup.max_students,
        current_students: dbGroup.current_students,
        location: dbGroup.location,
        is_active: dbGroup.is_active,
        teacher_id: dbGroup.teacher_id,
        start_date: dbGroup.start_date,
        end_date: dbGroup.end_date,
        schedule,
      });
      onClose();
    } catch (err) {
      setError('حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى.');
      console.error('Error saving group:', err);
    } finally {
      setLoading(false);
    }
  };

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
                  <Users className="h-6 w-6" />
                  <span>{editGroup ? 'تعديل المجموعة' : 'إنشاء مجموعة جديدة'}</span>
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
                قم بإعداد مجموعة دراسية جديدة مع تحديد المواعيد والأسعار
              </p>
            </div>

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

              {/* المعلومات الأساسية */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center space-x-2 rtl:space-x-reverse">
                  <Users className="h-5 w-5" />
                  <span>المعلومات الأساسية</span>
                </h3>
                
                {/* Teacher selection dropdown */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">المدرس *</label>
                  <select
                    required
                    value={formData.teacher_id}
                    onChange={e => setFormData({ ...formData, teacher_id: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                    disabled={loading || loadingTeachers}
                  >
                    {loadingTeachers && (
                      <option value="" disabled>جاري تحميل المدرسين...</option>
                    )}
                    {!loadingTeachers && teachers.length === 0 && (
                      <option value="" disabled>لا توجد مدرسين متاحين</option>
                    )}
                    {!loadingTeachers && teachers.length > 0 && (
                      <>
                        <option value="">اختر المدرس</option>
                        {teachers.map(t => (
                          <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                        ))}
                      </>
                    )}
                  </select>
                  
                  {loadingTeachers && (
                    <div className="flex items-center mt-2 text-sm text-blue-600">
                      <Loader className="h-4 w-4 animate-spin mr-2" />
                      <span>جاري تحميل المدرسين...</span>
                    </div>
                  )}
                  
                  {teachersError && (
                    <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                      {teachersError}
                      <button
                        type="button"
                        onClick={fetchTeachers}
                        className="mr-2 text-blue-600 underline hover:text-blue-800"
                      >
                        إعادة المحاولة
                      </button>
                    </div>
                  )}
                  
                  {!loadingTeachers && teachers.length === 0 && !teachersError && (
                    <p className="text-sm text-red-600 mt-1">لا توجد مدرسين نشطين في النظام</p>
                  )}
                  
                  {teachers.length > 0 && (
                    <p className="text-sm text-gray-500 mt-1">تم العثور على {teachers.length} مدرس</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      اسم المجموعة *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                      placeholder="مثال: مجموعة الصف الثالث الإعدادي - الثلاثاء/الخميس"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      الصف الدراسي *
                    </label>
                    <select
                      required
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      className="w-full py-3 px-4 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                      disabled={loading}
                    >
                      <option value="">اختر الصف</option>
                      {grades.map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      المادة *
                    </label>
                    <select
                      required
                      value={formData.subject_id}
                      onChange={(e) => handleSubjectChange(e.target.value)}
                      className="w-full py-3 px-4 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
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

                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      تاريخ البداية *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="w-full py-3 px-4 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      تاريخ النهاية *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="w-full py-3 px-4 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      السعر الشهري (جنيه) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <DollarSign className="h-4 w-4 text-blue-400" />
                      </div>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.monthly_price}
                        onChange={(e) => setFormData({ ...formData, monthly_price: Number(e.target.value) })}
                        className="w-full pr-10 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                        placeholder="0"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      الحد الأقصى للطلاب *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="50"
                      value={formData.max_students}
                      onChange={(e) => setFormData({ ...formData, max_students: Number(e.target.value) })}
                      className="w-full py-3 px-4 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div>
                    <h4 className="font-medium text-gray-900">حالة المجموعة</h4>
                    <p className="text-sm text-gray-700">هل المجموعة نشطة ومتاحة للتسجيل؟</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="sr-only peer"
                      disabled={loading}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="mr-3 text-sm font-medium text-gray-900">
                      {formData.is_active ? 'نشطة' : 'غير نشطة'}
                    </span>
                  </label>
                </div>
              </div>

              {/* مواعيد المجموعة */}
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-green-900 flex items-center space-x-2 rtl:space-x-reverse">
                    <Calendar className="h-5 w-5" />
                    <span>مواعيد المجموعة</span>
                  </h3>
                  <button
                    type="button"
                    onClick={addScheduleSlot}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2 rtl:space-x-reverse"
                    disabled={loading}
                  >
                    <Plus className="h-4 w-4" />
                    <span>إضافة موعد</span>
                  </button>
                </div>

                {schedule.length === 0 ? (
                  <div className="text-center py-8 text-green-600">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-green-400" />
                    <p>لم يتم إضافة مواعيد بعد</p>
                    <p className="text-sm mt-2">اضغط "إضافة موعد" لتحديد مواعيد المجموعة</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {schedule.map((slot, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-green-300">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-green-700 mb-2">اليوم</label>
                            <select
                              value={slot.day}
                              onChange={(e) => updateScheduleSlot(index, 'day', e.target.value)}
                              className="w-full py-2 px-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-right"
                              required
                              disabled={loading}
                            >
                              <option value="">اختر اليوم</option>
                              {days.map(day => (
                                <option key={day} value={day}>{day}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-green-700 mb-2">من الساعة</label>
                            <input
                              type="time"
                              value={slot.startTime}
                              onChange={(e) => updateScheduleSlot(index, 'startTime', e.target.value)}
                              className="w-full py-2 px-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              required
                              disabled={loading}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-green-700 mb-2">إلى الساعة</label>
                            <input
                              type="time"
                              value={slot.endTime}
                              onChange={(e) => updateScheduleSlot(index, 'endTime', e.target.value)}
                              className="w-full py-2 px-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              required
                              disabled={loading}
                            />
                          </div>

                          <div className="flex items-end">
                            <button
                              type="button"
                              onClick={() => removeScheduleSlot(index)}
                              className="w-full bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2 rtl:space-x-reverse"
                              disabled={loading}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>حذف</span>
                            </button>
                          </div>
                        </div>

                        {slot.startTime && slot.endTime && (
                          <div className="mt-2 text-sm text-green-600">
                            المدة: {slot.duration} دقيقة
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
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
                  disabled={loading || !formData.name || !formData.grade || !formData.subject_id || !formData.teacher_id || schedule.length === 0}
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
                      <span>{editGroup ? 'حفظ التعديلات' : 'إنشاء المجموعة'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddGroupModal;