import React from 'react';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Clock, 
  Edit, 
  Trash2, 
  UserPlus,
  Eye,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { StudentGroup } from '../../types';
import { motion } from 'framer-motion';

interface GroupCardProps {
  group: StudentGroup;
  onEdit: (group: StudentGroup) => void;
  onDelete: (id: string) => void;
  onViewDetails: (group: StudentGroup) => void;
  onManageStudents: (group: StudentGroup) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ 
  group, 
  onEdit, 
  onDelete, 
  onViewDetails, 
  onManageStudents 
}) => {
  const occupancyPercentage = (group.current_students / group.max_students) * 100;
  const isNearFull = occupancyPercentage >= 80;
  const isFull = group.current_students >= group.max_students;

  const getStatusColor = () => {
    if (!group.is_active) return 'bg-gray-100 text-gray-800';
    if (isFull) return 'bg-red-100 text-red-800';
    if (isNearFull) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = () => {
    if (!group.is_active) return 'غير نشطة';
    if (isFull) return 'مكتملة';
    if (isNearFull) return 'شبه مكتملة';
    return 'متاحة';
  };

  const getStatusIcon = () => {
    if (!group.is_active) return AlertCircle;
    if (isFull) return AlertCircle;
    return CheckCircle;
  };

  const StatusIcon = getStatusIcon();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{group.name}</h3>
            <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 rtl:space-x-reverse ${getStatusColor()}`}>
              <StatusIcon className="h-3 w-3" />
              <span>{getStatusText()}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-600">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
              {group.grade}
            </span>
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium">
              {group.subject_id}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      {group.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{group.description}</p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">الطلاب</span>
          </div>
          <p className="text-lg font-bold text-blue-900 mt-1">
            {group.current_students}/{group.max_students}
          </p>
          <div className="w-full bg-blue-200 rounded-full h-1.5 mt-2">
            <div 
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">السعر الشهري</span>
          </div>
          <p className="text-lg font-bold text-green-900 mt-1">{group.monthly_price} جنيه</p>
        </div>
      </div>

      {/* Schedule */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">المواعيد</span>
        </div>
        <div className="space-y-1">
          {group.schedule.slice(0, 2).map((schedule, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{schedule.day}</span>
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-gray-800">
                <Clock className="h-3 w-3" />
                <span>{schedule.startTime} - {schedule.endTime}</span>
              </div>
            </div>
          ))}
          {group.schedule.length > 2 && (
            <p className="text-xs text-gray-500">+{group.schedule.length - 2} مواعيد أخرى</p>
          )}
        </div>
      </div>

      {/* Location */}
      {group.location && (
        <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{group.location}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onViewDetails(group)}
          className="bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-1 rtl:space-x-reverse text-sm"
        >
          <Eye className="h-4 w-4" />
          <span>التفاصيل</span>
        </button>
        
        <button
          onClick={() => onManageStudents(group)}
          className="bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-1 rtl:space-x-reverse text-sm"
        >
          <UserPlus className="h-4 w-4" />
          <span>إدارة الطلاب</span>
        </button>
      </div>

      {/* Secondary Actions */}
      <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
        <button
          onClick={() => onEdit(group)}
          className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-1 rtl:space-x-reverse text-sm"
        >
          <Edit className="h-4 w-4" />
          <span>تعديل</span>
        </button>
        
        <button
          onClick={() => onDelete(group.id)}
          className="text-gray-600 hover:text-red-600 transition-colors duration-200 flex items-center space-x-1 rtl:space-x-reverse text-sm"
        >
          <Trash2 className="h-4 w-4" />
          <span>حذف</span>
        </button>
      </div>

      {/* Quick Info */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>تم الإنشاء: {group.created_at ? new Date(group.created_at).toLocaleDateString('ar-EG') : ''}</span>
          {group.start_date && (
            <span>البداية: {new Date(group.start_date).toLocaleDateString('ar-EG')}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GroupCard;