import React from 'react';

export interface TeacherCardProps {
  teacher: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
    bio?: string | null;
    total_students: number;
    total_groups: number;
    total_sessions: number;
    rating: number;
    hourly_rate: number;
    is_active: boolean;
    role: string;
  };
  onManageGroups: (teacherId: string) => void;
}

const TeacherCard: React.FC<TeacherCardProps> = ({ teacher, onManageGroups }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center overflow-hidden">
              {teacher.avatar ? (
                <img src={teacher.avatar} alt={teacher.name} className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <span className="text-white text-xl font-bold">{teacher.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{teacher.name}</h3>
              <p className="text-sm text-gray-600">{teacher.email}</p>
            </div>
          </div>
        </div>
        {teacher.bio && <p className="text-gray-600 text-sm mb-4 line-clamp-2">{teacher.bio}</p>}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
            <p className="text-xs text-blue-800 font-medium">الطلاب</p>
            <p className="text-lg font-bold text-blue-900">{teacher.total_students}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
            <p className="text-xs text-green-800 font-medium">المجموعات</p>
            <p className="text-lg font-bold text-green-900">{teacher.total_groups}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center border border-purple-200">
            <p className="text-xs text-purple-800 font-medium">الحصص</p>
            <p className="text-lg font-bold text-purple-900">{teacher.total_sessions}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <span className="text-yellow-400 font-bold">★</span>
            <span className="text-sm font-medium text-gray-900">{teacher.rating.toFixed(1)}</span>
          </div>
          <div className="text-sm text-gray-600">{teacher.hourly_rate} جنيه/ساعة</div>
        </div>
        <button
          onClick={() => onManageGroups(teacher.id)}
          className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-1 rtl:space-x-reverse text-sm mt-2"
        >
          إدارة المجموعات
        </button>
      </div>
    </div>
  );
};

export default TeacherCard; 