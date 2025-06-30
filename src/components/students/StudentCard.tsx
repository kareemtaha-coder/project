import React from 'react';
import { Phone, MapPin, Calendar, Edit, Trash2, User, Eye, Mail, AlertCircle, CheckCircle, Clock, QrCode } from 'lucide-react';
import { Student } from '../../types';
import { motion } from 'framer-motion';
import { generateStudentQRCode } from '../../utils/qrCodeGenerator';

interface StudentCardProps {
  student: Student;
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
  onViewProfile: (student: Student) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onEdit, onDelete, onViewProfile }) => {
  // Get profile image from documents or avatar
  const getProfileImage = () => {
    const photoDoc = student.documents?.find(doc => 
      doc.type === 'photo' || 
      doc.mimeType?.startsWith('image/')
    );
    
    if (photoDoc) {
      return photoDoc.url;
    }
    
    return student.avatar;
  };

  // تحديد مستوى اكتمال الملف
  const getProfileCompleteness = () => {
    let score = 0;
    let total = 0;

    // البيانات الأساسية (مطلوبة دائماً)
    total += 4;
    if (student.name) score++;
    if (student.phone) score++;
    if (student.grade) score++;
    if (student.subject) score++;

    // البيانات الإضافية
    total += 4;
    if (student.parentPhone || student.parentName) score++;
    if (student.address) score++;
    if (student.documents && student.documents.length > 0) score++;
    if (student.notes) score++;

    const percentage = (score / total) * 100;
    
    if (percentage >= 80) return { level: 'complete', color: 'green', text: 'مكتمل' };
    if (percentage >= 50) return { level: 'partial', color: 'yellow', text: 'ناقص' };
    return { level: 'basic', color: 'red', text: 'أساسي' };
  };

  const handleQRClick = () => {
    const { studentUrl } = generateStudentQRCode(student);
    window.open(studentUrl, '_blank');
  };

  const profileImage = getProfileImage();
  const completeness = getProfileCompleteness();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 relative group"
    >
      {/* مؤشر اكتمال الملف */}
      <div className={`absolute top-4 left-4 w-3 h-3 rounded-full ${
        completeness.color === 'green' ? 'bg-green-500' :
        completeness.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
      }`} title={`الملف ${completeness.text}`}></div>

      {/* QR Code Button */}
      <button
        onClick={handleQRClick}
        className="absolute top-4 left-8 bg-purple-100 hover:bg-purple-200 p-2 rounded-lg transition-colors duration-200 opacity-0 group-hover:opacity-100"
        title="فتح صفحة الطالب"
      >
        <QrCode className="h-4 w-4 text-purple-600" />
      </button>

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center overflow-hidden">
            {profileImage ? (
              <img 
                src={profileImage} 
                alt={student.name} 
                className="h-12 w-12 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : (
              <User className="h-6 w-6 text-white" />
            )}
            {profileImage && (
              <User className="h-6 w-6 text-white hidden" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{student.name}</h3>
            <p className="text-sm text-gray-600">{student.grade} - {student.subject}</p>
            {student.studentCode && (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <p className="text-xs text-blue-600 font-medium">كود: {student.studentCode}</p>
                <QrCode className="h-3 w-3 text-blue-600" />
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            student.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {student.isActive ? 'نشط' : 'غير نشط'}
          </div>
        </div>
      </div>

      {/* البيانات الأساسية */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-600">
          <Phone className="h-4 w-4" />
          <span>{student.phone}</span>
        </div>
        
        {student.parentPhone && (
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-600">
            <Phone className="h-4 w-4" />
            <span>ولي الأمر: {student.parentPhone}</span>
          </div>
        )}
        
        {student.address && (
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{student.address}</span>
          </div>
        )}
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>انضم في {new Date(student.joinDate).toLocaleDateString('ar-EG')}</span>
        </div>
      </div>

      {/* مؤشرات الملف */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {student.birthDate && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
              العمر: {new Date().getFullYear() - new Date(student.birthDate).getFullYear()} سنة
            </span>
          )}
          
          {student.documents && student.documents.length > 0 && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
              {student.documents.length} مستند
            </span>
          )}
          
          {student.emergencyContact?.name && (
            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
              اتصال طوارئ
            </span>
          )}

          {student.medicalInfo && (
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
              معلومات طبية
            </span>
          )}

          {student.studentCode && (
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs flex items-center space-x-1 rtl:space-x-reverse">
              <QrCode className="h-3 w-3" />
              <span>QR Code</span>
            </span>
          )}
        </div>
      </div>

      {/* شريط تقدم اكتمال الملف */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>اكتمال الملف</span>
          <span className={`font-medium ${
            completeness.color === 'green' ? 'text-green-600' :
            completeness.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {completeness.text}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              completeness.color === 'green' ? 'bg-green-500' :
              completeness.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ 
              width: `${
                completeness.level === 'complete' ? '100' :
                completeness.level === 'partial' ? '60' : '25'
              }%` 
            }}
          ></div>
        </div>
      </div>

      {student.notes && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700 line-clamp-2">{student.notes}</p>
        </div>
      )}

      {/* أزرار العمليات */}
      <div className="flex space-x-2 rtl:space-x-reverse">
        <button
          onClick={() => onViewProfile(student)}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2 rtl:space-x-reverse"
        >
          <Eye className="h-4 w-4" />
          <span>الملف الكامل</span>
        </button>
        
        <button
          onClick={() => onEdit(student)}
          className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
          title="تعديل البيانات الأساسية"
        >
          <Edit className="h-4 w-4" />
        </button>
        
        <button
          onClick={() => onDelete(student.id)}
          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center"
          title="حذف الطالب"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* رسالة تحفيزية لإكمال الملف */}
      {completeness.level !== 'complete' && (
        <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Clock className="h-3 w-3 text-blue-600" />
            <p className="text-xs text-blue-700">
              {completeness.level === 'basic' 
                ? 'أضف بيانات ولي الأمر والمستندات لإكمال الملف'
                : 'أضف المزيد من التفاصيل لإكمال الملف'
              }
            </p>
          </div>
        </div>
      )}

      {/* QR Code Info */}
      {student.studentCode && (
        <div className="mt-3 p-2 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <QrCode className="h-3 w-3 text-purple-600" />
              <p className="text-xs text-purple-700">اضغط على QR للوصول للملف</p>
            </div>
            <button
              onClick={handleQRClick}
              className="text-purple-600 hover:text-purple-800 text-xs underline"
            >
              فتح الصفحة
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StudentCard;