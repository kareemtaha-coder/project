import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Users, Star, Award, TrendingUp, Edit, Trash2, Eye, UserCheck, UserX, Settings, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import TeacherCard from '../components/teachers/TeacherCard';
import ManageGroupsModal from '../components/teachers/ManageGroupsModal';

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  hourly_rate: number;
  address: string | null;
  bio: string | null;
  avatar: string | null;
  specializations: string[];
  experience: number;
  qualifications: string[];
  role: 'teacher' | 'admin' | 'supervisor';
  is_active: boolean;
  join_date: string;
  rating: number;
  total_students: number;
  total_groups: number;
  total_sessions: number;
  total_revenue: number;
  working_hours_start: string;
  working_hours_end: string;
  working_days: string[];
  created_at: string;
  updated_at: string;
}

interface TeacherStats {
  id: string;
  name: string;
  email: string;
  total_students: number;
  total_groups: number;
  total_sessions: number;
  total_revenue: number;
  rating: number;
  is_active: boolean;
  students_this_month: number;
  sessions_this_month: number;
  revenue_this_month: number;
  sessions_today: number;
  revenue_today: number;
  completion_rate: number;
  payment_rate: number;
}

const Teachers: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teacherStats, setTeacherStats] = useState<TeacherStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'stats'>('cards');
  const [manageGroupsTeacherId, setManageGroupsTeacherId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    hourly_rate: 150,
    address: '',
    bio: '',
    specializations: [] as string[],
    experience: 0,
    qualifications: [] as string[],
    role: 'teacher' as 'teacher' | 'admin' | 'supervisor',
    working_hours_start: '16:00',
    working_hours_end: '22:00',
    working_days: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء'] as string[]
  });

  useEffect(() => {
    loadTeachers();
    loadTeacherStats();
  }, []);

  const loadTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTeachers(data || []);
    } catch (error) {
      console.error('Error loading teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTeacherStats = async () => {
    try {
      const { data, error } = await supabase
        .from('teacher_dashboard_stats')
        .select('*');

      if (error) throw error;
      setTeacherStats(data || []);
    } catch (error) {
      console.error('Error loading teacher stats:', error);
    }
  };

  const filteredTeachers = teachers.filter(teacher => {
    return (
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterRole === '' || teacher.role === filterRole) &&
      (filterStatus === '' || 
       (filterStatus === 'active' && teacher.is_active) ||
       (filterStatus === 'inactive' && !teacher.is_active))
    );
  });

  const handleAddTeacher = () => {
    setEditTeacher(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      hourly_rate: 150,
      address: '',
      bio: '',
      specializations: [],
      experience: 0,
      qualifications: [],
      role: 'teacher',
      working_hours_start: '16:00',
      working_hours_end: '22:00',
      working_days: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء']
    });
    setIsAddModalOpen(true);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setEditTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone || '',
      subject: teacher.subject || '',
      hourly_rate: teacher.hourly_rate,
      address: teacher.address || '',
      bio: teacher.bio || '',
      specializations: teacher.specializations,
      experience: teacher.experience,
      qualifications: teacher.qualifications,
      role: teacher.role,
      working_hours_start: teacher.working_hours_start,
      working_hours_end: teacher.working_hours_end,
      working_days: teacher.working_days
    });
    setIsAddModalOpen(true);
  };

  const handleSaveTeacher = async () => {
    if (!formData.name || !formData.email) {
      alert('يرجى ملء الحقول المطلوبة');
      return;
    }

    try {
      if (editTeacher) {
        const { error } = await supabase
          .from('teachers')
          .update({
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            subject: formData.subject || null,
            hourly_rate: formData.hourly_rate,
            address: formData.address || null,
            bio: formData.bio || null,
            specializations: formData.specializations,
            experience: formData.experience,
            qualifications: formData.qualifications,
            role: formData.role,
            working_hours_start: formData.working_hours_start,
            working_hours_end: formData.working_hours_end,
            working_days: formData.working_days
          })
          .eq('id', editTeacher.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('teachers')
          .insert({
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            subject: formData.subject || null,
            hourly_rate: formData.hourly_rate,
            address: formData.address || null,
            bio: formData.bio || null,
            specializations: formData.specializations,
            experience: formData.experience,
            qualifications: formData.qualifications,
            role: formData.role,
            working_hours_start: formData.working_hours_start,
            working_hours_end: formData.working_hours_end,
            working_days: formData.working_days
          });

        if (error) throw error;
      }

      setIsAddModalOpen(false);
      loadTeachers();
      loadTeacherStats();
    } catch (error) {
      console.error('Error saving teacher:', error);
      alert('حدث خطأ أثناء حفظ البيانات');
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المدرس؟ سيتم حذف جميع البيانات المرتبطة به.')) {
      try {
        const { error } = await supabase
          .from('teachers')
          .delete()
          .eq('id', id);

        if (error) throw error;
        loadTeachers();
        loadTeacherStats();
      } catch (error) {
        console.error('Error deleting teacher:', error);
        alert('حدث خطأ أثناء حذف المدرس');
      }
    }
  };

  const toggleTeacherStatus = async (teacher: Teacher) => {
    try {
      const { error } = await supabase
        .from('teachers')
        .update({ is_active: !teacher.is_active })
        .eq('id', teacher.id);

      if (error) throw error;
      loadTeachers();
    } catch (error) {
      console.error('Error updating teacher status:', error);
      alert('حدث خطأ أثناء تحديث حالة المدرس');
    }
  };

  const addSpecialization = (spec: string) => {
    if (spec.trim() && !formData.specializations.includes(spec.trim())) {
      setFormData({
        ...formData,
        specializations: [...formData.specializations, spec.trim()]
      });
    }
  };

  const removeSpecialization = (index: number) => {
    setFormData({
      ...formData,
      specializations: formData.specializations.filter((_, i) => i !== index)
    });
  };

  const addQualification = (qual: string) => {
    if (qual.trim() && !formData.qualifications.includes(qual.trim())) {
      setFormData({
        ...formData,
        qualifications: [...formData.qualifications, qual.trim()]
      });
    }
  };

  const removeQualification = (index: number) => {
    setFormData({
      ...formData,
      qualifications: formData.qualifications.filter((_, i) => i !== index)
    });
  };

  const toggleWorkingDay = (day: string) => {
    if (formData.working_days.includes(day)) {
      setFormData({
        ...formData,
        working_days: formData.working_days.filter(d => d !== day)
      });
    } else {
      setFormData({
        ...formData,
        working_days: [...formData.working_days, day]
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'supervisor': return 'bg-purple-100 text-purple-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'مدير';
      case 'supervisor': return 'مشرف';
      default: return 'مدرس';
    }
  };

  const days = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

  // إحصائيات عامة
  const totalTeachers = teachers.length;
  const activeTeachers = teachers.filter(t => t.is_active).length;
  const totalStudents = teachers.reduce((sum, t) => sum + t.total_students, 0);
  const totalRevenue = teachers.reduce((sum, t) => sum + t.total_revenue, 0);

  if (loading) {
    return (
      <div className="p-6 mr-64 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات المدرسين...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mr-64">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة المدرسين</h1>
          <p className="text-gray-600">نظام شامل لإدارة المدرسين والصلاحيات والإحصائيات</p>
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
              <Users className="h-4 w-4" />
              <span>بطاقات</span>
            </button>
            <button
              onClick={() => setViewMode('stats')}
              className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center space-x-2 rtl:space-x-reverse ${
                viewMode === 'stats'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>إحصائيات</span>
            </button>
          </div>

          <button
            onClick={handleAddTeacher}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2 rtl:space-x-reverse"
          >
            <Plus className="h-5 w-5" />
            <span>إضافة مدرس</span>
          </button>
        </div>
      </div>

      {/* إحصائيات عامة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">إجمالي المدرسين</p>
              <p className="text-3xl font-bold text-gray-900">{totalTeachers}</p>
              <p className="text-green-600 text-sm">{activeTeachers} نشط</p>
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
              <p className="text-gray-600 text-sm font-medium mb-1">إجمالي الطلاب</p>
              <p className="text-3xl font-bold text-gray-900">{totalStudents}</p>
              <p className="text-blue-600 text-sm">جميع المدرسين</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <UserCheck className="h-6 w-6 text-green-600" />
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
              <p className="text-gray-600 text-sm font-medium mb-1">إجمالي الإيرادات</p>
              <p className="text-3xl font-bold text-gray-900">{totalRevenue.toLocaleString()}</p>
              <p className="text-purple-600 text-sm">جنيه</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
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
              <p className="text-gray-600 text-sm font-medium mb-1">متوسط التقييم</p>
              <p className="text-3xl font-bold text-gray-900">
                {totalTeachers > 0 ? (teachers.reduce((sum, t) => sum + t.rating, 0) / totalTeachers).toFixed(1) : '0.0'}
              </p>
              <p className="text-orange-600 text-sm">من 5.0</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Star className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* فلاتر البحث */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="بحث بالاسم أو البريد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
            />
          </div>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
          >
            <option value="">جميع الأدوار</option>
            <option value="teacher">مدرس</option>
            <option value="supervisor">مشرف</option>
            <option value="admin">مدير</option>
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
              setFilterRole('');
              setFilterStatus('');
            }}
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2 rtl:space-x-reverse"
          >
            <Filter className="h-5 w-5" />
            <span>مسح الفلاتر</span>
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <p>عرض {filteredTeachers.length} من {totalTeachers} مدرس</p>
        </div>
      </motion.div>

      {/* عرض البطاقات */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher, index) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <TeacherCard
                teacher={teacher}
                onManageGroups={(teacherId) => setManageGroupsTeacherId(teacherId)}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* عرض الإحصائيات */}
      {viewMode === 'stats' && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المدرس</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الطلاب</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المجموعات</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحصص</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإيرادات</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">معدل الإنجاز</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">معدل الدفع</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التقييم</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teacherStats.map((stat, index) => (
                  <motion.tr
                    key={stat.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {stat.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{stat.name}</div>
                          <div className="text-xs text-gray-500">{stat.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{stat.total_students}</div>
                      <div className="text-xs text-gray-500">+{stat.students_this_month} هذا الشهر</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{stat.total_groups}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{stat.total_sessions}</div>
                      <div className="text-xs text-gray-500">{stat.sessions_today} اليوم</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{stat.total_revenue.toLocaleString()} جنيه</div>
                      <div className="text-xs text-gray-500">+{stat.revenue_this_month.toLocaleString()} هذا الشهر</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${Math.min(stat.completion_rate, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{stat.completion_rate.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${Math.min(stat.payment_rate, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{stat.payment_rate.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1 rtl:space-x-reverse">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-900">{stat.rating.toFixed(1)}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* رسالة عدم وجود نتائج */}
      {filteredTeachers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 mb-4">
            <Users className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {teachers.length === 0 ? 'لا يوجد مدرسين بعد' : 'لا توجد نتائج'}
          </h3>
          <p className="text-gray-600 mb-4">
            {teachers.length === 0 
              ? 'ابدأ بإضافة المدرسين في النظام' 
              : 'جرب تغيير معايير البحث أو إضافة مدرسين جدد'
            }
          </p>
          {teachers.length === 0 && (
            <button
              onClick={handleAddTeacher}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2 rtl:space-x-reverse mx-auto"
            >
              <Plus className="h-5 w-5" />
              <span>إضافة أول مدرس</span>
            </button>
          )}
        </motion.div>
      )}

      {/* نافذة إضافة/تعديل المدرس */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold">
                {editTeacher ? 'تعديل بيانات المدرس' : 'إضافة مدرس جديد'}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* البيانات الأساسية */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                    placeholder="أدخل الاسم الكامل"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                    placeholder="01xxxxxxxxx"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المادة الأساسية</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                    placeholder="مثال: الرياضيات"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">السعر بالساعة (جنيه)</label>
                  <input
                    type="number"
                    value={formData.hourly_rate}
                    onChange={(e) => setFormData({ ...formData, hourly_rate: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">سنوات الخبرة</label>
                  <input
                    type="number"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الدور</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                  >
                    <option value="teacher">مدرس</option>
                    <option value="supervisor">مشرف</option>
                    <option value="admin">مدير</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                    placeholder="العنوان الكامل"
                  />
                </div>
              </div>

              {/* النبذة الشخصية */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">النبذة الشخصية</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                  placeholder="نبذة مختصرة عن المدرس..."
                />
              </div>

              {/* ساعات العمل */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">ساعات العمل</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">من الساعة</label>
                    <input
                      type="time"
                      value={formData.working_hours_start}
                      onChange={(e) => setFormData({ ...formData, working_hours_start: e.target.value })}
                      className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">إلى الساعة</label>
                    <input
                      type="time"
                      value={formData.working_hours_end}
                      onChange={(e) => setFormData({ ...formData, working_hours_end: e.target.value })}
                      className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">أيام العمل</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {days.map(day => (
                      <label key={day} className="flex items-center space-x-2 rtl:space-x-reverse">
                        <input
                          type="checkbox"
                          checked={formData.working_days.includes(day)}
                          onChange={() => toggleWorkingDay(day)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>
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
                onClick={handleSaveTeacher}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg"
              >
                {editTeacher ? 'حفظ التعديلات' : 'إضافة المدرس'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* إدارة مجموعات المدرس */}
      <ManageGroupsModal
        teacherId={manageGroupsTeacherId || ''}
        isOpen={!!manageGroupsTeacherId}
        onClose={() => setManageGroupsTeacherId(null)}
      />
    </div>
  );
};

export default Teachers;