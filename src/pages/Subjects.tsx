import React, { useState } from 'react';
import { Plus, Search, BookOpen, Edit, Trash2, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Subject } from '../types';

const Subjects: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: '1',
      name: 'الرياضيات',
      code: 'MATH',
      category: 'رياضيات',
      grades: ['الصف الأول الإعدادي', 'الصف الثاني الإعدادي', 'الصف الثالث الإعدادي'],
      color: '#3B82F6',
      isActive: true,
      created_at: new Date(),
      updated_at: new Date(),
      totalStudents: 25,
      totalGroups: 3
    },
    {
      id: '2',
      name: 'الفيزياء',
      code: 'PHYS',
      category: 'علوم',
      grades: ['الصف الأول الثانوي', 'الصف الثاني الثانوي', 'الصف الثالث الثانوي'],
      color: '#10B981',
      isActive: true,
      created_at: new Date(),
      updated_at: new Date(),
      totalStudents: 18,
      totalGroups: 2
    },
    {
      id: '3',
      name: 'اللغة الإنجليزية',
      code: 'ENG',
      category: 'لغات',
      grades: ['الصف الأول الابتدائي', 'الصف الثاني الابتدائي', 'الصف الثالث الابتدائي'],
      color: '#8B5CF6',
      isActive: true,
      created_at: new Date(),
      updated_at: new Date(),
      totalStudents: 32,
      totalGroups: 4
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editSubject, setEditSubject] = useState<Subject | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: 'أخرى' as Subject['category'],
    color: '#3B82F6',
    isActive: true
  });

  const categories: Subject['category'][] = ['علوم', 'أدب', 'لغات', 'رياضيات', 'اجتماعيات', 'فنون', 'أخرى'];
  const colorOptions = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubject = () => {
    setEditSubject(null);
    setFormData({
      name: '',
      code: '',
      category: 'أخرى',
      color: '#3B82F6',
      isActive: true
    });
    setIsAddModalOpen(true);
  };

  const handleEditSubject = (subject: Subject) => {
    setEditSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code,
      category: subject.category,
      color: subject.color,
      isActive: subject.isActive
    });
    setIsAddModalOpen(true);
  };

  const handleDeleteSubject = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المادة؟')) {
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  const handleSaveSubject = () => {
    if (!formData.name || !formData.code) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (editSubject) {
      setSubjects(subjects.map(s => 
        s.id === editSubject.id 
          ? { ...s, ...formData, updated_at: new Date() }
          : s
      ));
    } else {
      const newSubject: Subject = {
        ...formData,
        id: Date.now().toString(),
        grades: [],
        created_at: new Date(),
        updated_at: new Date(),
        totalStudents: 0,
        totalGroups: 0
      };
      setSubjects([...subjects, newSubject]);
    }
    setIsAddModalOpen(false);
  };

  const generateCode = (name: string) => {
    const words = name.split(' ');
    if (words.length === 1) {
      return words[0].substring(0, 4).toUpperCase();
    } else {
      return words.map(word => word.charAt(0)).join('').toUpperCase();
    }
  };

  return (
    <div className="p-6 mr-64">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة المواد الدراسية</h1>
          <p className="text-gray-600">إضافة وإدارة المواد التي تدرسها</p>
        </div>
        <button
          onClick={handleAddSubject}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2 rtl:space-x-reverse"
        >
          <Plus className="h-5 w-5" />
          <span>إضافة مادة</span>
        </button>
      </div>

      {/* إحصائيات بسيطة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">إجمالي المواد</p>
              <p className="text-3xl font-bold text-gray-900">{subjects.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">إجمالي الطلاب</p>
              <p className="text-3xl font-bold text-gray-900">
                {subjects.reduce((sum, s) => sum + (s.totalStudents || 0), 0)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">المجموعات النشطة</p>
              <p className="text-3xl font-bold text-gray-900">
                {subjects.reduce((sum, s) => sum + (s.totalGroups || 0), 0)}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* البحث */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
        <div className="relative">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="بحث بالاسم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
          />
        </div>
      </div>

      {/* قائمة المواد */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((subject, index) => (
          <motion.div
            key={subject.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div 
              className="h-2"
              style={{ backgroundColor: subject.color }}
            ></div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{subject.name}</h3>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-sm text-gray-600">كود: {subject.code}</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {subject.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-blue-800 font-medium">الطلاب</p>
                  <p className="text-lg font-bold text-blue-900">{subject.totalStudents || 0}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-green-800 font-medium">المجموعات</p>
                  <p className="text-lg font-bold text-green-900">{subject.totalGroups || 0}</p>
                </div>
              </div>

              <div className="flex space-x-2 rtl:space-x-reverse">
                <button
                  onClick={() => handleEditSubject(subject)}
                  className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-1 rtl:space-x-reverse text-sm"
                >
                  <Edit className="h-4 w-4" />
                  <span>تعديل</span>
                </button>
                
                <button
                  onClick={() => handleDeleteSubject(subject.id)}
                  className="bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* رسالة عدم وجود نتائج */}
      {filteredSubjects.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {subjects.length === 0 ? 'لا توجد مواد بعد' : 'لا توجد نتائج'}
          </h3>
          <p className="text-gray-600 mb-4">
            {subjects.length === 0 ? 'ابدأ بإضافة المواد التي تدرسها' : 'جرب تغيير كلمة البحث'}
          </p>
          {subjects.length === 0 && (
            <button
              onClick={handleAddSubject}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2 rtl:space-x-reverse mx-auto"
            >
              <Plus className="h-5 w-5" />
              <span>إضافة أول مادة</span>
            </button>
          )}
        </div>
      )}

      {/* نافذة إضافة/تعديل المادة */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <h2 className="text-xl font-bold">
                {editSubject ? 'تعديل المادة' : 'إضافة مادة جديدة'}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم المادة *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData({
                      ...formData,
                      name,
                      code: editSubject ? formData.code : generateCode(name)
                    });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                  placeholder="مثال: الرياضيات"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  كود المادة *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                  placeholder="MATH"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التصنيف
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Subject['category'] })}
                  className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  لون المادة
                </label>
                <div className="flex space-x-2 rtl:space-x-reverse">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-lg border-2 ${
                        formData.color === color ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">المادة نشطة</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <div className="flex space-x-4 rtl:space-x-reverse p-6 border-t border-gray-200">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveSubject}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg"
              >
                {editSubject ? 'حفظ التعديلات' : 'إضافة المادة'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Subjects;