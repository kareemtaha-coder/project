import React, { useState } from 'react';
import { Plus, Search, Filter, Loader, Users, FileText, Edit, Eye, Grid, Table } from 'lucide-react';
import { useApp } from '../context/AppContext';
import StudentCard from '../components/students/StudentCard';
import AddStudentModal from '../components/students/AddStudentModal';
import StudentProfileModal from '../components/students/StudentProfileModal';
import GradeView from '../components/students/GradeView';
import { Student, StudentGroup } from '../types';
import { motion } from 'framer-motion';

const Students: React.FC = () => {
  const { students, addStudent, updateStudent, deleteStudent, loading, user } = useApp();
  
  // قائمة المجموعات المتاحة (يمكن جلبها من context أو API)
  const [groups] = useState<StudentGroup[]>([
    {
      id: '1',
      name: 'مجموعة الصف الثالث الإعدادي - الثلاثاء/الخميس',
      subject: 'الرياضيات',
      subjectId: '1',
      grade: 'الصف الثالث الإعدادي',
      monthlyPrice: 400,
      maxStudents: 15,
      currentStudents: 8,
      schedule: [],
      studentIds: [],
      isActive: true,
      created_at: new Date()
    },
    {
      id: '2',
      name: 'مجموعة المراجعة النهائية للثانوية العامة',
      subject: 'الفيزياء',
      subjectId: '2',
      grade: 'الصف الثالث الثانوي',
      monthlyPrice: 600,
      maxStudents: 12,
      currentStudents: 10,
      schedule: [],
      studentIds: [],
      isActive: true,
      created_at: new Date()
    },
    {
      id: '3',
      name: 'مجموعة اللغة الإنجليزية للمبتدئين',
      subject: 'اللغة الإنجليزية',
      subjectId: '3',
      grade: 'الصف الأول الابتدائي',
      monthlyPrice: 300,
      maxStudents: 10,
      currentStudents: 5,
      schedule: [],
      studentIds: [],
      isActive: true,
      created_at: new Date()
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'grades'>('cards');

  const filteredStudents = students.filter(student => {
    return (
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterGrade === '' || student.grade === filterGrade) &&
      (filterSubject === '' || student.subject === filterSubject) &&
      (filterStatus === '' || 
       (filterStatus === 'active' && student.isActive) ||
       (filterStatus === 'inactive' && !student.isActive))
    );
  });

  const handleAddStudent = () => {
    setEditStudent(null);
    setIsModalOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditStudent(student);
    setIsModalOpen(true);
  };

  const handleViewProfile = (student: Student) => {
    setSelectedStudent(student);
    setIsProfileModalOpen(true);
  };

  const handleSaveStudent = async (studentData: Omit<Student, 'id'>) => {
    if (editStudent) {
      await updateStudent(editStudent.id, studentData);
    } else {
      await addStudent(studentData);
    }
  };

  const handleUpdateStudent = async (studentData: Partial<Student>) => {
    if (selectedStudent) {
      await updateStudent(selectedStudent.id, studentData);
      setSelectedStudent({ ...selectedStudent, ...studentData });
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطالب؟ سيتم حذف جميع الحصص والمدفوعات المرتبطة به.')) {
      try {
        await deleteStudent(id);
      } catch (error) {
        alert('حدث خطأ أثناء حذف الطالب. يرجى المحاولة مرة أخرى.');
      }
    }
  };

  const grades = [...new Set(students.map(s => s.grade))];
  const subjects = [...new Set(students.map(s => s.subject))];

  // إحصائيات مبسطة
  const activeStudents = students.filter(s => s.isActive).length;
  const studentsWithDocuments = students.filter(s => s.documents && s.documents.length > 0).length;
  const studentsWithParentInfo = students.filter(s => s.parentPhone || s.parentName).length;
  const completedProfiles = students.filter(s => 
    s.parentPhone && s.address && s.documents && s.documents.length > 0
  ).length;

  if (loading) {
    return (
      <div className="p-6 mr-64 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mr-64">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة الطلاب</h1>
          <p className="text-gray-600">
            نظام شامل لإدارة ملفات الطلاب مع تنظيم حسب الصفوف الدراسية
            {user && (
              <span className="text-green-600 mr-2">
                • متصل بقاعدة البيانات
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          {/* أزرار تبديل العرض */}
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center space-x-2 rtl:space-x-reverse ${
                viewMode === 'cards'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid className="h-4 w-4" />
              <span>بطاقات</span>
            </button>
            <button
              onClick={() => setViewMode('grades')}
              className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center space-x-2 rtl:space-x-reverse ${
                viewMode === 'grades'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Table className="h-4 w-4" />
              <span>جداول الصفوف</span>
            </button>
          </div>

          <button
            onClick={handleAddStudent}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2 rtl:space-x-reverse"
          >
            <Plus className="h-5 w-5" />
            <span>إضافة طالب جديد</span>
          </button>
        </div>
      </div>

      {/* إحصائيات مبسطة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">إجمالي الطلاب</p>
              <p className="text-3xl font-bold text-gray-900">{students.length}</p>
              <p className="text-green-600 text-sm">{activeStudents} نشط</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">ملفات مكتملة</p>
              <p className="text-3xl font-bold text-gray-900">{completedProfiles}</p>
              <p className="text-blue-600 text-sm">من {students.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">بيانات أولياء الأمور</p>
              <p className="text-3xl font-bold text-gray-900">{studentsWithParentInfo}</p>
              <p className="text-purple-600 text-sm">مسجلة</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">المجموعات المتاحة</p>
              <p className="text-3xl font-bold text-gray-900">{groups.filter(g => g.isActive).length}</p>
              <p className="text-orange-600 text-sm">مجموعة</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* عرض حسب الوضع المحدد */}
      {viewMode === 'grades' ? (
        <GradeView
          students={students}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
          onViewProfile={handleViewProfile}
          onAddStudent={handleAddStudent}
        />
      ) : (
        <>
          {/* فلاتر البحث */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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

              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
              >
                <option value="">جميع الصفوف</option>
                {grades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>

              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
              >
                <option value="">جميع المواد</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
              >
                <option value="">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
              </select>

              <button 
                onClick={() => {
                  setSearchTerm('');
                  setFilterGrade('');
                  setFilterSubject('');
                  setFilterStatus('');
                }}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2 rtl:space-x-reverse"
              >
                <Filter className="h-5 w-5" />
                <span>مسح الفلاتر</span>
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <p>
                عرض {filteredStudents.length} من {students.length} طالب
              </p>
              {students.length > 0 && (
                <div className="flex items-center space-x-4 rtl:space-x-reverse text-xs">
                  <span className="flex items-center space-x-1 rtl:space-x-reverse">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>ملف مكتمل</span>
                  </span>
                  <span className="flex items-center space-x-1 rtl:space-x-reverse">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>ملف ناقص</span>
                  </span>
                  <span className="flex items-center space-x-1 rtl:space-x-reverse">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>بيانات أساسية فقط</span>
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* قائمة الطلاب */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <StudentCard
                  student={student}
                  onEdit={handleEditStudent}
                  onDelete={handleDeleteStudent}
                  onViewProfile={handleViewProfile}
                />
              </motion.div>
            ))}
          </div>

          {/* رسالة عدم وجود نتائج */}
          {filteredStudents.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-gray-400 mb-4">
                <Users className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {students.length === 0 ? 'لا توجد طلاب بعد' : 'لا توجد نتائج'}
              </h3>
              <p className="text-gray-600 mb-4">
                {students.length === 0 
                  ? 'ابدأ بإضافة طلابك الأوائل في النظام' 
                  : 'جرب تغيير معايير البحث أو إضافة طلاب جدد'
                }
              </p>
              {students.length === 0 && (
                <button
                  onClick={handleAddStudent}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2 rtl:space-x-reverse mx-auto"
                >
                  <Plus className="h-5 w-5" />
                  <span>إضافة أول طالب</span>
                </button>
              )}
            </motion.div>
          )}

          {/* نصائح للمستخدمين الجدد */}
          {students.length > 0 && students.length < 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200"
            >
              <div className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Eye className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">نصائح لاستخدام النظام</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• يمكنك إضافة الطلاب بالبيانات الأساسية فقط وإكمال الباقي لاحقاً</li>
                    <li>• استخدم عرض "جداول الصفوف" لتنظيم أفضل للطلاب حسب الصف الدراسي</li>
                    <li>• اضغط على "عرض الملف" لإضافة الصور والمستندات والمعلومات التفصيلية</li>
                    <li>• يمكن تصدير بيانات كل صف إلى ملف Excel منفصل</li>
                    <li>• يمكن إضافة الطلاب للمجموعات مباشرة عند التسجيل</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* نافذة إضافة/تعديل الطالب */}
      <AddStudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStudent}
        editStudent={editStudent}
        availableGroups={groups} // تمرير المجموعات المتاحة
      />

      {/* نافذة ملف الطالب الشامل */}
      {selectedStudent && (
        <StudentProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          student={selectedStudent}
          onUpdate={handleUpdateStudent}
        />
      )}
    </div>
  );
};

export default Students;