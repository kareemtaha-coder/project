import React, { useState } from 'react';
import { X, User, Phone, Mail, MapPin, Calendar, FileText, Heart, GraduationCap, Users, Upload, Download, Trash2, Eye, ZoomIn } from 'lucide-react';
import { Student, StudentDocument } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  onUpdate: (student: Partial<Student>) => void;
}

const StudentProfileModal: React.FC<StudentProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  student,
  onUpdate 
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const tabs = [
    { id: 'basic', label: 'البيانات الأساسية', icon: User },
    { id: 'contact', label: 'بيانات الاتصال', icon: Phone },
    { id: 'academic', label: 'المعلومات الأكاديمية', icon: GraduationCap },
    { id: 'medical', label: 'المعلومات الطبية', icon: Heart },
    { id: 'documents', label: 'المستندات', icon: FileText },
    { id: 'groups', label: 'المجموعات', icon: Users }
  ];

  const documentTypes = [
    { value: 'birth_certificate', label: 'شهادة الميلاد' },
    { value: 'photo', label: 'صورة شخصية' },
    { value: 'medical_report', label: 'تقرير طبي' },
    { value: 'previous_grades', label: 'درجات سابقة' },
    { value: 'other', label: 'أخرى' }
  ];

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingDocument(true);
    
    try {
      const mockUrl = URL.createObjectURL(file);
      
      const newDocument: StudentDocument = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type.startsWith('image/') ? 'photo' : 'other',
        url: mockUrl,
        uploadDate: new Date(),
        size: file.size,
        mimeType: file.type
      };

      const updatedDocuments = [...(student.documents || []), newDocument];
      onUpdate({ documents: updatedDocuments });
    } catch (error) {
      alert('حدث خطأ أثناء رفع الملف');
    } finally {
      setUploadingDocument(false);
    }
  };

  const handleDeleteDocument = (documentId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المستند؟')) {
      const updatedDocuments = student.documents?.filter(doc => doc.id !== documentId) || [];
      onUpdate({ documents: updatedDocuments });
    }
  };

  const handleImagePreview = (imageUrl: string) => {
    setImagePreview(imageUrl);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImageFile = (mimeType: string) => {
    return mimeType.startsWith('image/');
  };

  const profileImage = getProfileImage();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
                    {profileImage ? (
                      <img 
                        src={profileImage} 
                        alt={student.name} 
                        className="h-16 w-16 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleImagePreview(profileImage)}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : (
                      <User className="h-8 w-8 text-white" />
                    )}
                    {profileImage && (
                      <User className="h-8 w-8 text-white hidden" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{student.name}</h2>
                    <p className="text-blue-100">{student.grade} - {student.subject}</p>
                    {student.studentCode && (
                      <p className="text-blue-200 text-sm">كود الطالب: {student.studentCode}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
            </div>

            <div className="flex h-[calc(90vh-120px)]">
              {/* Sidebar */}
              <div className="w-64 bg-gray-50 border-l border-gray-200 overflow-y-auto">
                <nav className="p-4 space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-lg text-right transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <tab.icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'basic' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">البيانات الأساسية</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
                        <p className="text-gray-900 font-medium">{student.name}</p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">كود الطالب</label>
                        <p className="text-gray-900 font-medium">{student.studentCode || 'غير محدد'}</p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ الميلاد</label>
                        <p className="text-gray-900 font-medium">
                          {student.birthDate ? new Date(student.birthDate).toLocaleDateString('ar-EG') : 'غير محدد'}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ الانضمام</label>
                        <p className="text-gray-900 font-medium">
                          {new Date(student.joinDate).toLocaleDateString('ar-EG')}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">الصف الدراسي</label>
                        <p className="text-gray-900 font-medium">{student.grade}</p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">المادة</label>
                        <p className="text-gray-900 font-medium">{student.subject}</p>
                      </div>
                    </div>

                    {student.notes && (
                      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <label className="block text-sm font-medium text-yellow-800 mb-2">ملاحظات</label>
                        <p className="text-yellow-900">{student.notes}</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'contact' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">بيانات الاتصال</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* بيانات الطالب */}
                      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-4 flex items-center space-x-2 rtl:space-x-reverse">
                          <User className="h-5 w-5" />
                          <span>بيانات الطالب</span>
                        </h4>
                        
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <Phone className="h-4 w-4 text-blue-600" />
                            <span className="text-blue-900">{student.phone}</span>
                          </div>
                          
                          {student.email && (
                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                              <Mail className="h-4 w-4 text-blue-600" />
                              <span className="text-blue-900">{student.email}</span>
                            </div>
                          )}
                          
                          {student.address && (
                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                              <MapPin className="h-4 w-4 text-blue-600" />
                              <span className="text-blue-900">{student.address}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* بيانات ولي الأمر */}
                      <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                        <h4 className="font-semibold text-green-900 mb-4 flex items-center space-x-2 rtl:space-x-reverse">
                          <User className="h-5 w-5" />
                          <span>بيانات ولي الأمر</span>
                        </h4>
                        
                        <div className="space-y-4">
                          {student.parentName && (
                            <div>
                              <label className="text-sm text-green-700">الاسم</label>
                              <p className="text-green-900 font-medium">{student.parentName}</p>
                            </div>
                          )}
                          
                          {student.parentPhone && (
                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                              <Phone className="h-4 w-4 text-green-600" />
                              <span className="text-green-900">{student.parentPhone}</span>
                            </div>
                          )}
                          
                          {student.parentEmail && (
                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                              <Mail className="h-4 w-4 text-green-600" />
                              <span className="text-green-900">{student.parentEmail}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* جهة اتصال الطوارئ */}
                    {student.emergencyContact && (
                      <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                        <h4 className="font-semibold text-red-900 mb-4">جهة اتصال الطوارئ</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm text-red-700">الاسم</label>
                            <p className="text-red-900 font-medium">{student.emergencyContact.name}</p>
                          </div>
                          <div>
                            <label className="text-sm text-red-700">العلاقة</label>
                            <p className="text-red-900 font-medium">{student.emergencyContact.relationship}</p>
                          </div>
                          <div>
                            <label className="text-sm text-red-700">الهاتف</label>
                            <p className="text-red-900 font-medium">{student.emergencyContact.phone}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'academic' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">المعلومات الأكاديمية</h3>
                    
                    {student.academicInfo ? (
                      <div className="space-y-6">
                        {student.academicInfo.previousSchool && (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">المدرسة السابقة</label>
                            <p className="text-gray-900">{student.academicInfo.previousSchool}</p>
                          </div>
                        )}

                        {student.academicInfo.learningStyle && (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">أسلوب التعلم</label>
                            <p className="text-gray-900">
                              {student.academicInfo.learningStyle === 'visual' ? 'بصري' :
                               student.academicInfo.learningStyle === 'auditory' ? 'سمعي' :
                               student.academicInfo.learningStyle === 'kinesthetic' ? 'حركي' : 'مختلط'}
                            </p>
                          </div>
                        )}

                        {student.academicInfo.strengths && student.academicInfo.strengths.length > 0 && (
                          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                            <label className="block text-sm font-medium text-green-700 mb-2">نقاط القوة</label>
                            <div className="flex flex-wrap gap-2">
                              {student.academicInfo.strengths.map((strength, index) => (
                                <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                  {strength}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {student.academicInfo.weaknesses && student.academicInfo.weaknesses.length > 0 && (
                          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                            <label className="block text-sm font-medium text-orange-700 mb-2">نقاط الضعف</label>
                            <div className="flex flex-wrap gap-2">
                              {student.academicInfo.weaknesses.map((weakness, index) => (
                                <span key={index} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                                  {weakness}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {student.academicInfo.goals && student.academicInfo.goals.length > 0 && (
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <label className="block text-sm font-medium text-blue-700 mb-2">الأهداف الأكاديمية</label>
                            <ul className="list-disc list-inside space-y-1">
                              {student.academicInfo.goals.map((goal, index) => (
                                <li key={index} className="text-blue-900">{goal}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>لا توجد معلومات أكاديمية مسجلة</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'medical' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">المعلومات الطبية</h3>
                    
                    {student.medicalInfo ? (
                      <div className="space-y-6">
                        {student.medicalInfo.bloodType && (
                          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                            <label className="block text-sm font-medium text-red-700 mb-2">فصيلة الدم</label>
                            <p className="text-red-900 font-bold text-lg">{student.medicalInfo.bloodType}</p>
                          </div>
                        )}

                        {student.medicalInfo.allergies && student.medicalInfo.allergies.length > 0 && (
                          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                            <label className="block text-sm font-medium text-yellow-700 mb-2">الحساسيات</label>
                            <div className="flex flex-wrap gap-2">
                              {student.medicalInfo.allergies.map((allergy, index) => (
                                <span key={index} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                                  {allergy}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {student.medicalInfo.medications && student.medicalInfo.medications.length > 0 && (
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <label className="block text-sm font-medium text-blue-700 mb-2">الأدوية</label>
                            <ul className="list-disc list-inside space-y-1">
                              {student.medicalInfo.medications.map((medication, index) => (
                                <li key={index} className="text-blue-900">{medication}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {student.medicalInfo.emergencyMedicalInfo && (
                          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                            <label className="block text-sm font-medium text-red-700 mb-2">معلومات طبية طارئة</label>
                            <p className="text-red-900">{student.medicalInfo.emergencyMedicalInfo}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>لا توجد معلومات طبية مسجلة</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900">المستندات</h3>
                      <label className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:shadow-lg transition-all duration-200 flex items-center space-x-2 rtl:space-x-reverse">
                        <Upload className="h-4 w-4" />
                        <span>رفع مستند</span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileUpload}
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.bmp,.webp"
                        />
                      </label>
                    </div>

                    {student.documents && student.documents.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {student.documents.map((doc) => (
                          <div key={doc.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                  {isImageFile(doc.mimeType) ? (
                                    <div className="relative">
                                      <img 
                                        src={doc.url} 
                                        alt={doc.name}
                                        className="h-10 w-10 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                                        onClick={() => handleImagePreview(doc.url)}
                                      />
                                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded cursor-pointer">
                                        <ZoomIn className="h-4 w-4 text-white" />
                                      </div>
                                    </div>
                                  ) : (
                                    <FileText className="h-5 w-5 text-blue-600" />
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900 truncate">{doc.name}</h4>
                                  <p className="text-sm text-gray-500">
                                    {documentTypes.find(type => type.value === doc.type)?.label || 'أخرى'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex space-x-2 rtl:space-x-reverse">
                                {isImageFile(doc.mimeType) ? (
                                  <button
                                    onClick={() => handleImagePreview(doc.url)}
                                    className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                                    title="معاينة الصورة"
                                  >
                                    <ZoomIn className="h-4 w-4" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => window.open(doc.url, '_blank')}
                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                    title="عرض المستند"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = doc.url;
                                    link.download = doc.name;
                                    link.click();
                                  }}
                                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                                  title="تحميل"
                                >
                                  <Download className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteDocument(doc.id)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                  title="حذف"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 space-y-1">
                              <p>الحجم: {formatFileSize(doc.size)}</p>
                              <p>تاريخ الرفع: {new Date(doc.uploadDate).toLocaleDateString('ar-EG')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>لا توجد مستندات مرفقة</p>
                        <p className="text-sm mt-2">يمكنك رفع المستندات مثل شهادة الميلاد والصور الشخصية</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'groups' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">المجموعات المسجل بها</h3>
                    
                    {student.groups && student.groups.length > 0 ? (
                      <div className="space-y-4">
                        {student.groups.map((groupId, index) => (
                          <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                              <Users className="h-5 w-5 text-blue-600" />
                              <span className="font-medium text-blue-900">{groupId}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>غير مسجل في أي مجموعة</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Image Preview Modal */}
      <AnimatePresence>
        {imagePreview && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center"
            >
              <button
                onClick={() => setImagePreview(null)}
                className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200"
              >
                <X className="h-6 w-6" />
              </button>
              <img
                src={imagePreview}
                alt="معاينة الصورة"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onClick={() => setImagePreview(null)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};

export default StudentProfileModal;