import React, { useState, useEffect } from 'react';
import { X, Save, Loader, BookOpen, Palette, Target, List, Plus, Trash2 } from 'lucide-react';
import { Subject } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subject: Omit<Subject, 'id' | 'created_at' | 'updated_at'>) => void;
  editSubject?: Subject | null;
}

const AddSubjectModal: React.FC<AddSubjectModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editSubject 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: '',
    category: 'أخرى' as Subject['category'],
    grades: [] as string[],
    color: '#3B82F6',
    icon: '📚',
    isActive: true,
    defaultDuration: 60,
    defaultPrice: 150,
    materials: [] as string[],
    objectives: [] as string[],
    prerequisites: [] as string[]
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories: Subject['category'][] = ['علوم', 'أدب', 'لغات', 'رياضيات', 'اجتماعيات', 'فنون', 'أخرى'];
  const availableGrades = [
    'الصف الأول الابتدائي', 'الصف الثاني الابتدائي', 'الصف الثالث الابتدائي',
    'الصف الرابع الابتدائي', 'الصف الخامس الابتدائي', 'الصف السادس الابتدائي',
    'الصف الأول الإعدادي', 'الصف الثاني الإعدادي', 'الصف الثالث الإعدادي',
    'الصف الأول الثانوي', 'الصف الثاني الثانوي', 'الصف الثالث الثانوي'
  ];

  const colorOptions = [
    '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4',
    '#84CC16', '#F97316', '#EC4899', '#6366F1', '#14B8A6', '#F43F5E'
  ];

  const iconOptions = [
    '📚', '📖', '📝', '🔬', '🧮', '🌍', '🎨', '🎵', '⚛️', '📐', '🇬🇧', '🇫🇷',
    '💻', '🏛️', '🌱', '🔭', '🎭', '📊', '🏃‍♂️', '🍎', '🧪', '📏'
  ];

  useEffect(() => {
    if (editSubject) {
      setFormData({
        name: editSubject.name,
        description: editSubject.description || '',
        code: editSubject.code,
        category: editSubject.category,
        grades: editSubject.grades,
        color: editSubject.color,
        icon: editSubject.icon || '📚',
        isActive: editSubject.isActive,
        defaultDuration: editSubject.defaultDuration || 60,
        defaultPrice: editSubject.defaultPrice || 150,
        materials: editSubject.materials || [],
        objectives: editSubject.objectives || [],
        prerequisites: editSubject.prerequisites || []
      });
    } else {
      setFormData({
        name: '',
        description: '',
        code: '',
        category: 'أخرى',
        grades: [],
        color: '#3B82F6',
        icon: '📚',
        isActive: true,
        defaultDuration: 60,
        defaultPrice: 150,
        materials: [],
        objectives: [],
        prerequisites: []
      });
    }
    setError('');
  }, [editSubject, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.grades.length === 0) {
      setError('يجب اختيار صف دراسي واحد على الأقل');
      setLoading(false);
      return;
    }

    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError('حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى.');
      console.error('Error saving subject:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleGrade = (grade: string) => {
    setFormData(prev => ({
      ...prev,
      grades: prev.grades.includes(grade)
        ? prev.grades.filter(g => g !== grade)
        : [...prev.grades, grade]
    }));
  };

  const addToArray = (array: string[], value: string, field: 'materials' | 'objectives' | 'prerequisites') => {
    if (value.trim() && !array.includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...array, value.trim()]
      }));
    }
  };

  const removeFromArray = (array: string[], index: number, field: 'materials' | 'objectives' | 'prerequisites') => {
    setFormData(prev => ({
      ...prev,
      [field]: array.filter((_, i) => i !== index)
    }));
  };

  // إنشاء كود تلقائي من اسم المادة
  const generateCode = (name: string) => {
    const words = name.split(' ');
    if (words.length === 1) {
      return words[0].substring(0, 4).toUpperCase();
    } else {
      return words.map(word => word.charAt(0)).join('').toUpperCase();
    }
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      code: editSubject ? prev.code : generateCode(name)
    }));
  };

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
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center space-x-3 rtl:space-x-reverse">
                  <BookOpen className="h-6 w-6" />
                  <span>{editSubject ? 'تعديل المادة' : 'إضافة مادة جديدة'}</span>
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
                قم بإعداد مادة دراسية جديدة مع تحديد الصفوف والأسعار والمتطلبات
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
                  <BookOpen className="h-5 w-5" />
                  <span>المعلومات الأساسية</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      اسم المادة *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                      placeholder="مثال: الرياضيات، الفيزياء، اللغة الإنجليزية"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      كود المادة *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                      placeholder="MATH, PHYS, ENG"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      التصنيف *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as Subject['category'] })}
                      className="w-full py-3 px-4 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                      disabled={loading}
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      وصف المادة
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                      placeholder="وصف مختصر للمادة وما تشمله..."
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* التخصيص البصري */}
              <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center space-x-2 rtl:space-x-reverse">
                  <Palette className="h-5 w-5" />
                  <span>التخصيص البصري</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-2">
                      لون المادة
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                      {colorOptions.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFormData({ ...formData, color })}
                          className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 ${
                            formData.color === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                          disabled={loading}
                        />
                      ))}
                    </div>
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="mt-2 w-full h-10 rounded-lg border border-purple-300"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-2">
                      أيقونة المادة
                    </label>
                    <div className="grid grid-cols-6 gap-2 mb-2">
                      {iconOptions.map(icon => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => setFormData({ ...formData, icon })}
                          className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg transition-all duration-200 ${
                            formData.icon === icon ? 'border-purple-600 bg-purple-100' : 'border-gray-300 hover:border-purple-400'
                          }`}
                          disabled={loading}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-center"
                      placeholder="أو أدخل رمز تعبيري"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* معاينة */}
                <div className="mt-4 p-4 bg-white rounded-lg border border-purple-300">
                  <p className="text-sm text-purple-700 mb-2">معاينة:</p>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl"
                      style={{ backgroundColor: formData.color }}
                    >
                      {formData.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{formData.name || 'اسم المادة'}</h4>
                      <p className="text-sm text-gray-600">{formData.code || 'CODE'} - {formData.category}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* الصفوف الدراسية */}
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center space-x-2 rtl:space-x-reverse">
                  <Target className="h-5 w-5" />
                  <span>الصفوف الدراسية *</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {availableGrades.map(grade => (
                    <label key={grade} className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.grades.includes(grade)}
                        onChange={() => toggleGrade(grade)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        disabled={loading}
                      />
                      <span className="text-sm text-green-800">{grade}</span>
                    </label>
                  ))}
                </div>
                
                {formData.grades.length > 0 && (
                  <div className="mt-4 p-3 bg-white rounded-lg border border-green-300">
                    <p className="text-sm text-green-700 mb-2">الصفوف المحددة ({formData.grades.length}):</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.grades.map(grade => (
                        <span key={grade} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          {grade}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* الإعدادات الافتراضية */}
              <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                <h3 className="text-lg font-semibold text-orange-900 mb-4">الإعدادات الافتراضية</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-orange-700 mb-2">
                      مدة الحصة الافتراضية (دقيقة)
                    </label>
                    <input
                      type="number"
                      min="30"
                      max="180"
                      value={formData.defaultDuration}
                      onChange={(e) => setFormData({ ...formData, defaultDuration: Number(e.target.value) })}
                      className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-right"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-orange-700 mb-2">
                      السعر الافتراضي للحصة (جنيه)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.defaultPrice}
                      onChange={(e) => setFormData({ ...formData, defaultPrice: Number(e.target.value) })}
                      className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-right"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* المواد المطلوبة */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2 rtl:space-x-reverse">
                  <List className="h-5 w-5" />
                  <span>المواد المطلوبة (اختياري)</span>
                </h3>
                
                <div className="space-y-3">
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <input
                      type="text"
                      placeholder="أضف مادة مطلوبة (مثال: كتاب الطالب، آلة حاسبة)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const value = (e.target as HTMLInputElement).value;
                          addToArray(formData.materials, value, 'materials');
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                        const value = input.value;
                        addToArray(formData.materials, value, 'materials');
                        input.value = '';
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      disabled={loading}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {formData.materials.map((material, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2 rtl:space-x-reverse">
                        <span>{material}</span>
                        <button
                          type="button"
                          onClick={() => removeFromArray(formData.materials, index, 'materials')}
                          className="text-blue-600 hover:text-blue-800"
                          disabled={loading}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* الأهداف */}
              <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
                <h3 className="text-lg font-semibold text-indigo-900 mb-4">أهداف المادة (اختياري)</h3>
                
                <div className="space-y-3">
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <input
                      type="text"
                      placeholder="أضف هدف تعليمي (مثال: فهم المفاهيم الأساسية)"
                      className="flex-1 px-3 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-right"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const value = (e.target as HTMLInputElement).value;
                          addToArray(formData.objectives, value, 'objectives');
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                        const value = input.value;
                        addToArray(formData.objectives, value, 'objectives');
                        input.value = '';
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                      disabled={loading}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {formData.objectives.map((objective, index) => (
                      <div key={index} className="bg-indigo-100 text-indigo-800 px-3 py-2 rounded-lg text-sm flex items-center justify-between">
                        <span>{objective}</span>
                        <button
                          type="button"
                          onClick={() => removeFromArray(formData.objectives, index, 'objectives')}
                          className="text-indigo-600 hover:text-indigo-800"
                          disabled={loading}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* حالة المادة */}
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div>
                  <h4 className="font-medium text-gray-900">حالة المادة</h4>
                  <p className="text-sm text-gray-700">هل المادة نشطة ومتاحة للتدريس؟</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="sr-only peer"
                    disabled={loading}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="mr-3 text-sm font-medium text-gray-900">
                    {formData.isActive ? 'نشطة' : 'غير نشطة'}
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
                  disabled={loading || !formData.name || !formData.code || formData.grades.length === 0}
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
                      <span>{editSubject ? 'حفظ التعديلات' : 'إضافة المادة'}</span>
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

export default AddSubjectModal;