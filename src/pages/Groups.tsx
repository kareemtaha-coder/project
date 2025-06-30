import React, { useState } from 'react';
import { Plus, Search, Filter, Users, Calendar, DollarSign, Eye, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { StudentGroup } from '../types';
import { useApp } from '../context/AppContext';
import GroupCard from '../components/groups/GroupCard';
import AddGroupModal from '../components/groups/AddGroupModal';
import ManageStudentsModal from '../components/groups/ManageStudentsModal';

const Groups: React.FC = () => {
  const { students, subjects, groups, addGroup, updateGroup, deleteGroup, updateStudent } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [editGroup, setEditGroup] = useState<StudentGroup | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<StudentGroup | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // فلترة المجموعات
  const filteredGroups = groups.filter(group => {
    return (
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterGrade === '' || group.grade === filterGrade) &&
      (filterSubject === '' || group.subject === filterSubject) &&
      (filterStatus === '' || 
       (filterStatus === 'active' && group.isActive) ||
       (filterStatus === 'inactive' && !group.isActive) ||
       (filterStatus === 'full' && group.currentStudents >= group.maxStudents) ||
       (filterStatus === 'available' && group.currentStudents < group.maxStudents))
    );
  });

  // الحصول على قوائم فريدة للفلاتر
  const grades = [...new Set(groups.map(g => g.grade))];
  const subjectNames = [...new Set(groups.map(g => g.subject))];

  // إحصائيات
  const totalGroups = groups.length;
  const activeGroups = groups.filter(g => g.isActive).length;
  const totalStudents = groups.reduce((sum, g) => sum + g.currentStudents, 0);
  const totalRevenue = groups.reduce((sum, g) => sum + (g.monthlyPrice * g.currentStudents), 0);

  const handleAddGroup = () => {
    setEditGroup(null);
    setIsAddModalOpen(true);
  };

  const handleEditGroup = (group: StudentGroup) => {
    setEditGroup(group);
    setIsAddModalOpen(true);
  };

  const handleDeleteGroup = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المجموعة؟ سيتم إزالة جميع الطلاب منها.')) {
      try {
        await deleteGroup(id);
      } catch (error) {
        alert('حدث خطأ أثناء حذف المجموعة');
      }
    }
  };

  const handleViewDetails = (group: StudentGroup) => {
    // يمكن إضافة modal لعرض تفاصيل المجموعة
    console.log('View details for group:', group);
  };

  const handleManageStudents = (group: StudentGroup) => {
    setSelectedGroup(group);
    setIsManageModalOpen(true);
  };

  const handleSaveGroup = async (groupData: Omit<StudentGroup, 'id'>) => {
    try {
      if (editGroup) {
        await updateGroup(editGroup.id, groupData);
      } else {
        await addGroup(groupData);
      }
    } catch (error) {
      console.error('Error saving group:', error);
      throw error;
    }
  };

  const handleUpdateGroup = async (groupId: string, updates: Partial<StudentGroup>) => {
    try {
      await updateGroup(groupId, updates);
      
      // تحديث المجموعة المحددة إذا كانت مفتوحة
      if (selectedGroup && selectedGroup.id === groupId) {
        setSelectedGroup({ ...selectedGroup, ...updates });
      }
    } catch (error) {
      console.error('Error updating group:', error);
      throw error;
    }
  };

  return (
    <div className="p-6 mr-64">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة المجموعات</h1>
          <p className="text-gray-600">
            إنشاء وإدارة المجموعات الدراسية مع تنظيم الطلاب والمواعيد
          </p>
        </div>
        <button
          onClick={handleAddGroup}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2 rtl:space-x-reverse"
        >
          <Plus className="h-5 w-5" />
          <span>إنشاء مجموعة جديدة</span>
        </button>
      </div>

      {/* إحصائيات المجموعات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">إجمالي المجموعات</p>
              <p className="text-3xl font-bold text-gray-900">{totalGroups}</p>
              <p className="text-green-600 text-sm">{activeGroups} نشطة</p>
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
              <p className="text-blue-600 text-sm">في جميع المجموعات</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
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
              <p className="text-gray-600 text-sm font-medium mb-1">الإيرادات الشهرية</p>
              <p className="text-3xl font-bold text-gray-900">{totalRevenue}</p>
              <p className="text-purple-600 text-sm">جنيه</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
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
              <p className="text-gray-600 text-sm font-medium mb-1">متوسط الحضور</p>
              <p className="text-3xl font-bold text-gray-900">
                {totalGroups > 0 ? Math.round((totalStudents / groups.reduce((sum, g) => sum + g.maxStudents, 0)) * 100) : 0}%
              </p>
              <p className="text-orange-600 text-sm">من السعة الكاملة</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-orange-600" />
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
            {subjectNames.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
          >
            <option value="">جميع الحالات</option>
            <option value="active">نشطة</option>
            <option value="inactive">غير نشطة</option>
            <option value="available">متاحة</option>
            <option value="full">مكتملة</option>
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
            عرض {filteredGroups.length} من {totalGroups} مجموعة
          </p>
        </div>
      </motion.div>

      {/* قائمة المجموعات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group, index) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <GroupCard
              group={group}
              onEdit={handleEditGroup}
              onDelete={handleDeleteGroup}
              onViewDetails={handleViewDetails}
              onManageStudents={handleManageStudents}
            />
          </motion.div>
        ))}
      </div>

      {/* رسالة عدم وجود نتائج */}
      {filteredGroups.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 mb-4">
            <Users className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {groups.length === 0 ? 'لا توجد مجموعات بعد' : 'لا توجد نتائج'}
          </h3>
          <p className="text-gray-600 mb-4">
            {groups.length === 0 
              ? 'ابدأ بإنشاء مجموعاتك الدراسية الأولى' 
              : 'جرب تغيير معايير البحث أو إنشاء مجموعات جديدة'
            }
          </p>
          {groups.length === 0 && (
            <button
              onClick={handleAddGroup}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2 rtl:space-x-reverse mx-auto"
            >
              <Plus className="h-5 w-5" />
              <span>إنشاء أول مجموعة</span>
            </button>
          )}
        </motion.div>
      )}

      {/* نصائح للمستخدمين الجدد */}
      {groups.length > 0 && groups.length < 3 && (
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
              <h3 className="font-semibold text-blue-900 mb-2">نصائح لإدارة المجموعات</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• يمكنك سحب وإفلات الطلاب بين المجموعات المختلفة</li>
                <li>• استخدم أكواد QR للطلاب لتسهيل عملية الحضور والانصراف</li>
                <li>• حدد قوانين واضحة لكل مجموعة لضمان الانضباط</li>
                <li>• راقب نسبة الحضور والأداء لكل مجموعة</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* نوافذ منبثقة */}
      <AddGroupModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveGroup}
        editGroup={editGroup}
      />

      {selectedGroup && (
        <ManageStudentsModal
          isOpen={isManageModalOpen}
          onClose={() => setIsManageModalOpen(false)}
          group={selectedGroup}
          allStudents={students}
          onUpdateGroup={handleUpdateGroup}
          onUpdateStudent={updateStudent}
        />
      )}
    </div>
  );
};

export default Groups;