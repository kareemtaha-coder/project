import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Edit, 
  Eye, 
  Trash2, 
  Plus, 
  Download, 
  Filter,
  ChevronDown,
  ChevronUp,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Student } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface GradeViewProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
  onViewProfile: (student: Student) => void;
  onAddStudent: () => void;
}

const GradeView: React.FC<GradeViewProps> = ({ 
  students, 
  onEdit, 
  onDelete, 
  onViewProfile, 
  onAddStudent 
}) => {
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'name' | 'joinDate' | 'status'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showInactive, setShowInactive] = useState(false);

  // تجميع الطلاب حسب الصف
  const groupedStudents = students.reduce((acc, student) => {
    if (!acc[student.grade]) {
      acc[student.grade] = [];
    }
    acc[student.grade].push(student);
    return acc;
  }, {} as Record<string, Student[]>);

  // ترتيب الصفوف
  const sortedGrades = Object.keys(groupedStudents).sort((a, b) => {
    const gradeOrder = [
      'الصف الأول الابتدائي', 'الصف الثاني الابتدائي', 'الصف الثالث الابتدائي',
      'الصف الرابع الابتدائي', 'الصف الخامس الابتدائي', 'الصف السادس الابتدائي',
      'الصف الأول الإعدادي', 'الصف الثاني الإعدادي', 'الصف الثالث الإعدادي',
      'الصف الأول الثانوي', 'الصف الثاني الثانوي', 'الصف الثالث الثانوي'
    ];
    return gradeOrder.indexOf(a) - gradeOrder.indexOf(b);
  });

  // فلترة وترتيب طلاب الصف المحدد
  const getFilteredStudents = (gradeStudents: Student[]) => {
    let filtered = gradeStudents.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.phone.includes(searchTerm) ||
                           (student.parentPhone && student.parentPhone.includes(searchTerm));
      const matchesStatus = showInactive || student.isActive;
      return matchesSearch && matchesStatus;
    });

    // ترتيب
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'joinDate':
          aValue = new Date(a.joinDate).getTime();
          bValue = new Date(b.joinDate).getTime();
          break;
        case 'status':
          aValue = a.isActive ? 1 : 0;
          bValue = b.isActive ? 1 : 0;
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  // حساب إحصائيات الصف
  const getGradeStats = (gradeStudents: Student[]) => {
    const total = gradeStudents.length;
    const active = gradeStudents.filter(s => s.isActive).length;
    const withParentInfo = gradeStudents.filter(s => s.parentPhone || s.parentName).length;
    const withDocuments = gradeStudents.filter(s => s.documents && s.documents.length > 0).length;
    
    return { total, active, withParentInfo, withDocuments };
  };

  // تحديد مستوى اكتمال الملف
  const getProfileCompleteness = (student: Student) => {
    let score = 0;
    let total = 8;

    if (student.name) score++;
    if (student.phone) score++;
    if (student.grade) score++;
    if (student.subject) score++;
    if (student.parentPhone || student.parentName) score++;
    if (student.address) score++;
    if (student.documents && student.documents.length > 0) score++;
    if (student.notes) score++;

    const percentage = (score / total) * 100;
    
    if (percentage >= 80) return { level: 'complete', color: 'green', icon: CheckCircle };
    if (percentage >= 50) return { level: 'partial', color: 'yellow', icon: AlertCircle };
    return { level: 'basic', color: 'red', icon: XCircle };
  };

  const handleSort = (field: 'name' | 'joinDate' | 'status') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const exportToCSV = (gradeStudents: Student[], gradeName: string) => {
    const headers = ['الاسم', 'الهاتف', 'هاتف ولي الأمر', 'العنوان', 'تاريخ الانضمام', 'الحالة', 'الملاحظات'];
    const csvContent = [
      headers.join(','),
      ...gradeStudents.map(student => [
        student.name,
        student.phone,
        student.parentPhone || '',
        student.address || '',
        new Date(student.joinDate).toLocaleDateString('ar-EG'),
        student.isActive ? 'نشط' : 'غير نشط',
        student.notes || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `طلاب_${gradeName}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* عرض الصفوف الدراسية */}
      {!selectedGrade && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">الصفوف الدراسية</h2>
            <p className="text-gray-600">اختر صفاً لعرض طلابه في جدول تفصيلي</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedGrades.map((grade, index) => {
              const gradeStudents = groupedStudents[grade];
              const stats = getGradeStats(gradeStudents);
              
              return (
                <motion.div
                  key={grade}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedGrade(grade)}
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                          {grade}
                        </h3>
                        <p className="text-sm text-gray-600">{stats.total} طالب</p>
                      </div>
                    </div>
                    <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
                  </div>

                  {/* إحصائيات الصف */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">نشط</span>
                      </div>
                      <p className="text-lg font-bold text-green-900 mt-1">{stats.active}</p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Phone className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">أولياء أمور</span>
                      </div>
                      <p className="text-lg font-bold text-blue-900 mt-1">{stats.withParentInfo}</p>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Eye className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-800">مستندات</span>
                      </div>
                      <p className="text-lg font-bold text-purple-900 mt-1">{stats.withDocuments}</p>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Users className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-800">إجمالي</span>
                      </div>
                      <p className="text-lg font-bold text-orange-900 mt-1">{stats.total}</p>
                    </div>
                  </div>

                  {/* شريط تقدم */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>الملفات المكتملة</span>
                      <span>{Math.round((stats.withDocuments / stats.total) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(stats.withDocuments / stats.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* عرض جدول الطلاب للصف المحدد */}
      {selectedGrade && (
        <div>
          {/* رأس الجدول */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <button
                  onClick={() => setSelectedGrade(null)}
                  className="flex items-center space-x-2 rtl:space-x-reverse text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  <ChevronUp className="h-5 w-5" />
                  <span>العودة للصفوف</span>
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedGrade}</h2>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {getFilteredStudents(groupedStudents[selectedGrade]).length} طالب
                </span>
              </div>

              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <button
                  onClick={() => exportToCSV(groupedStudents[selectedGrade], selectedGrade)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <Download className="h-4 w-4" />
                  <span>تصدير Excel</span>
                </button>
                <button
                  onClick={onAddStudent}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <Plus className="h-4 w-4" />
                  <span>إضافة طالب</span>
                </button>
              </div>
            </div>

            {/* أدوات البحث والفلترة */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="بحث بالاسم أو الهاتف..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                />
              </div>

              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <input
                  type="checkbox"
                  id="showInactive"
                  checked={showInactive}
                  onChange={(e) => setShowInactive(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="showInactive" className="text-sm text-gray-700">
                  عرض غير النشطين
                </label>
              </div>

              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as any)}
                className="py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
              >
                <option value="name">ترتيب بالاسم</option>
                <option value="joinDate">ترتيب بتاريخ الانضمام</option>
                <option value="status">ترتيب بالحالة</option>
              </select>

              <button
                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2 rtl:space-x-reverse"
              >
                {sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                <span>{sortDirection === 'asc' ? 'تصاعدي' : 'تنازلي'}</span>
              </button>
            </div>
          </div>

          {/* الجدول */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th 
                      className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center space-x-1 rtl:space-x-reverse">
                        <span>اسم الطالب</span>
                        {sortField === 'name' && (
                          sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الهاتف
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ولي الأمر
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      العنوان
                    </th>
                    <th 
                      className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => handleSort('joinDate')}
                    >
                      <div className="flex items-center space-x-1 rtl:space-x-reverse">
                        <span>تاريخ الانضمام</span>
                        {sortField === 'joinDate' && (
                          sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getFilteredStudents(groupedStudents[selectedGrade]).map((student, index) => {
                    const completeness = getProfileCompleteness(student);
                    const CompletionIcon = completeness.icon;
                    
                    return (
                      <motion.tr
                        key={student.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <CompletionIcon className={`h-5 w-5 ${
                              completeness.color === 'green' ? 'text-green-500' :
                              completeness.color === 'yellow' ? 'text-yellow-500' : 'text-red-500'
                            }`} />
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              student.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {student.isActive ? 'نشط' : 'غير نشط'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-medium">
                                {student.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{student.name}</div>
                              {student.studentCode && (
                                <div className="text-xs text-blue-600">كود: {student.studentCode}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{student.phone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.parentPhone ? (
                            <div>
                              <div className="text-sm text-gray-900">{student.parentName || 'ولي الأمر'}</div>
                              <div className="text-xs text-gray-500">{student.parentPhone}</div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">غير محدد</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.address ? (
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-900 truncate max-w-32" title={student.address}>
                                {student.address}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">غير محدد</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">
                              {new Date(student.joinDate).toLocaleDateString('ar-EG')}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <button
                              onClick={() => onViewProfile(student)}
                              className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                              title="عرض الملف الكامل"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => onEdit(student)}
                              className="text-green-600 hover:text-green-800 transition-colors duration-200"
                              title="تعديل"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => onDelete(student.id)}
                              className="text-red-600 hover:text-red-800 transition-colors duration-200"
                              title="حذف"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* رسالة عدم وجود نتائج */}
            {getFilteredStudents(groupedStudents[selectedGrade]).length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد نتائج</h3>
                <p className="text-gray-600">
                  {searchTerm ? 'جرب تغيير كلمة البحث' : 'لا يوجد طلاب في هذا الصف'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GradeView;