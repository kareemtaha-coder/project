import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import GroupCard from '../groups/GroupCard';
import AddGroupModal, { MinimalTeacher } from '../groups/AddGroupModal';
import { StudentGroup, GroupSchedule } from '../../types';
import { Plus, Loader } from 'lucide-react';

interface ManageGroupsModalProps {
  teacherId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface SaveGroupPayload {
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
  student_ids?: string[];
}

const ManageGroupsModal: React.FC<ManageGroupsModalProps> = ({ teacherId, isOpen, onClose }) => {
  const [groups, setGroups] = useState<StudentGroup[]>([]);
  const [unassignedGroups, setUnassignedGroups] = useState<StudentGroup[]>([]);
  const [teachers, setTeachers] = useState<MinimalTeacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editGroup, setEditGroup] = useState<StudentGroup | null>(null);

  useEffect(() => {
    if (isOpen && teacherId) {
      fetchGroups();
      fetchUnassignedGroups();
      fetchTeachers();
    }
  }, [isOpen, teacherId]);

  const fetchGroups = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase
        .from('student_groups')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setGroups(data || []);
    } catch {
      setError('حدث خطأ أثناء جلب المجموعات');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnassignedGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('student_groups')
        .select('*')
        .is('teacher_id', null)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setUnassignedGroups(data || []);
    } catch {
      // ignore error for unassigned
    }
  };

  const fetchTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('id, name, email')
        .eq('is_active', true);
      if (error) throw error;
      setTeachers((data as MinimalTeacher[]) || []);
      console.log('Teachers loaded:', data);
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setError('حدث خطأ أثناء جلب قائمة المدرسين');
    }
  };

  const handleAssignGroup = async (groupId: string) => {
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase
        .from('student_groups')
        .update({ teacher_id: teacherId })
        .eq('id', groupId);
      if (error) throw error;
      fetchGroups();
      fetchUnassignedGroups();
    } catch {
      setError('حدث خطأ أثناء تعيين المجموعة');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGroup = () => {
    setEditGroup(null);
    setIsAddModalOpen(true);
  };

  const handleEditGroup = (group: StudentGroup) => {
    setEditGroup(group);
    setIsAddModalOpen(true);
  };

  const handleDeleteGroup = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه المجموعة؟')) return;
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase
        .from('student_groups')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchGroups();
      fetchUnassignedGroups();
    } catch {
      setError('حدث خطأ أثناء حذف المجموعة');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGroup = async (group: SaveGroupPayload) => {
    setLoading(true);
    setError('');
    try {
      const dbGroup = {
        name: group.name,
        subject_id: group.subject_id,
        grade: group.grade,
        description: group.description,
        monthly_price: group.monthly_price,
        max_students: group.max_students,
        current_students: group.current_students,
        location: group.location,
        is_active: group.is_active,
        teacher_id: group.teacher_id,
        start_date: group.start_date,
        end_date: group.end_date,
        created_at: editGroup?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      let groupId = editGroup?.id;
      if (editGroup) {
        const { error } = await supabase
          .from('student_groups')
          .update(dbGroup)
          .eq('id', editGroup.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('student_groups')
          .insert([dbGroup])
          .select('id')
          .single();
        if (error) throw error;
        groupId = data.id;
      }
      if (groupId && Array.isArray(group.schedule)) {
        if (editGroup) {
          await supabase.from('group_schedules').delete().eq('group_id', groupId);
        }
        const scheduleRows = group.schedule.map((sch: GroupSchedule) => ({
          group_id: groupId,
          day: sch.day,
          start_time: sch.startTime,
          end_time: sch.endTime,
          duration: sch.duration,
          location: sch.location || dbGroup.location || null,
        }));
        if (scheduleRows.length > 0) {
          await supabase.from('group_schedules').insert(scheduleRows);
        }
      }
      setIsAddModalOpen(false);
      fetchGroups();
      fetchUnassignedGroups();
    } catch {
      setError('حدث خطأ أثناء حفظ المجموعة');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold">إدارة مجموعات المدرس</h2>
            <p className="text-sm text-gray-600">عدد المدرسين المتاحين: {teachers.length}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleAddGroup}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 rtl:space-x-reverse hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>إضافة مجموعة</span>
          </button>
        </div>
        {unassignedGroups.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">مجموعات غير مخصصة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unassignedGroups.map((group) => (
                <div key={group.id} className="relative">
                  <GroupCard
                    group={group}
                    onEdit={() => {
                      setEditGroup(group);
                      setIsAddModalOpen(true);
                    }}
                    onDelete={() => handleDeleteGroup(group.id)}
                    onViewDetails={() => {}}
                    onManageStudents={() => {}}
                  />
                  <button
                    onClick={() => handleAssignGroup(group.id)}
                    className="absolute top-2 left-2 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 text-xs"
                  >
                    تعيين للمدرس
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader className="animate-spin h-8 w-8 text-blue-600" />
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center text-gray-500 py-8">لا توجد مجموعات لهذا المدرس بعد.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onEdit={handleEditGroup}
                onDelete={handleDeleteGroup}
                onViewDetails={() => {}}
                onManageStudents={() => {}}
              />
            ))}
          </div>
        )}
        {isAddModalOpen && (
          <AddGroupModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSave={handleSaveGroup}
            editGroup={editGroup}
            teachers={teachers}
            defaultTeacherId={teacherId}
          />
        )}
      </div>
    </div>
  );
};

export default ManageGroupsModal; 