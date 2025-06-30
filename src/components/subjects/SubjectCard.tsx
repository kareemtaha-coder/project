import React from 'react';
import { 
  BookOpen, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  List
} from 'lucide-react';
import { Subject } from '../../types';
import { motion } from 'framer-motion';

interface SubjectCardProps {
  subject: Subject;
  onEdit: (subject: Subject) => void;
  onDelete: (id: string) => void;
  onViewDetails: (subject: Subject) => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ 
  subject, 
  onEdit, 
  onDelete, 
  onViewDetails 
}) => {
  const getStatusColor = () => {
    if (!subject.isActive) return 'bg-gray-100 text-gray-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = () => {
    return subject.isActive ? 'نشطة' : 'غير نشطة';
  };

  const getStatusIcon = () => {
    return subject.isActive ? CheckCircle : XCircle;
  };

  const StatusIcon = getStatusIcon();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      {/* Header with Color */}
      <div 
        className="h-2"
        style={{ backgroundColor: subject.color }}
      ></div>

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl"
                style={{ backgroundColor: subject.color }}
              >
                {subject.icon || '📚'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{subject.name}</h3>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-sm text-gray-600">كود: {subject.code}</span>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 rtl:space-x-reverse ${getStatusColor()}`}>
                    <StatusIcon className="h-3 w-3" />
                    <span>{getStatusText()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-3">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {subject.category}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        {subject.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{subject.description}</p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
            <Users className="h-4 w-4 text-blue-600 mx-auto mb-1" />
            <p className="text-xs text-blue-800 font-medium">الطلاب</p>
            <p className="text-lg font-bold text-blue-900">{subject.totalStudents || 0}</p>
          </div>

          <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
            <Calendar className="h-4 w-4 text-green-600 mx-auto mb-1" />
            <p className="text-xs text-green-800 font-medium">المجموعات</p>
            <p className="text-lg font-bold text-green-900">{subject.totalGroups || 0}</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-3 text-center border border-purple-200">
            <Clock className="h-4 w-4 text-purple-600 mx-auto mb-1" />
            <p className="text-xs text-purple-800 font-medium">الحصص</p>
            <p className="text-lg font-bold text-purple-900">{subject.totalSessions || 0}</p>
          </div>
        </div>

        {/* Grades */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
            <Target className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">الصفوف الدراسية</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {subject.grades.slice(0, 3).map((grade, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                {grade.replace('الصف ', '')}
              </span>
            ))}
            {subject.grades.length > 3 && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                +{subject.grades.length - 3} أخرى
              </span>
            )}
          </div>
        </div>

        {/* Price and Duration */}
        {(subject.defaultPrice || subject.defaultDuration) && (
          <div className="mb-4 bg-gray-50 rounded-lg p-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {subject.defaultPrice && (
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">السعر:</span>
                  <span className="font-medium text-gray-900">{subject.defaultPrice} جنيه</span>
                </div>
              )}
              {subject.defaultDuration && (
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">المدة:</span>
                  <span className="font-medium text-gray-900">{subject.defaultDuration} دقيقة</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Materials */}
        {subject.materials && subject.materials.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
              <List className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">المواد المطلوبة</span>
            </div>
            <div className="text-xs text-gray-600">
              {subject.materials.slice(0, 2).join('، ')}
              {subject.materials.length > 2 && ` و ${subject.materials.length - 2} أخرى`}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onViewDetails(subject)}
            className="bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-1 rtl:space-x-reverse text-sm"
          >
            <Eye className="h-4 w-4" />
            <span>التفاصيل</span>
          </button>
          
          <button
            onClick={() => onEdit(subject)}
            className="bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-1 rtl:space-x-reverse text-sm"
          >
            <Edit className="h-4 w-4" />
            <span>تعديل</span>
          </button>
        </div>

        {/* Secondary Actions */}
        <div className="flex justify-center mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={() => onDelete(subject.id)}
            className="text-gray-600 hover:text-red-600 transition-colors duration-200 flex items-center space-x-1 rtl:space-x-reverse text-sm"
          >
            <Trash2 className="h-4 w-4" />
            <span>حذف</span>
          </button>
        </div>

        {/* Quick Info */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>تم الإنشاء: {subject.created_at ? new Date(subject.created_at).toLocaleDateString('ar-EG') : ''}</span>
            <span>آخر تحديث: {subject.updated_at ? new Date(subject.updated_at).toLocaleDateString('ar-EG') : ''}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SubjectCard;