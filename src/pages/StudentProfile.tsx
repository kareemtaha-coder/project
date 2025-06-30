import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Phone, Mail, MapPin, Calendar, ArrowLeft, Edit, QrCode, Download, Printer as Print, Share2, CheckCircle, AlertCircle, Clock, FileText, Heart, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { generateStudentQRCode, printStudentCard } from '../utils/qrCodeGenerator';

const StudentProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { students } = useApp();
  const [student, setStudent] = useState(students.find(s => s.id === id));
  const [qrCode, setQrCode] = useState<string>('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const foundStudent = students.find(s => s.id === id);
    if (foundStudent) {
      setStudent(foundStudent);
      const { qrCodeUrl } = generateStudentQRCode(foundStudent);
      setQrCode(qrCodeUrl);
    }
  }, [id, students]);

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <User className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">الطالب غير موجود</h2>
          <p className="text-gray-600 mb-4">لم يتم العثور على الطالب المطلوب</p>
          <button
            onClick={() => navigate('/students')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 rtl:space-x-reverse mx-auto"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>العودة لقائمة الطلاب</span>
          </button>
        </div>
      </div>
    );
  }

  // تحديد مستوى اكتمال الملف
  const getProfileCompleteness = () => {
    let score = 0;
    let total = 10;

    if (student.name) score++;
    if (student.phone) score++;
    if (student.grade) score++;
    if (student.subject) score++;
    if (student.parentPhone || student.parentName) score++;
    if (student.address) score++;
    if (student.email) score++;
    if (student.birthDate) score++;
    if (student.documents && student.documents.length > 0) score++;
    if (student.notes) score++;

    const percentage = (score / total) * 100;
    
    if (percentage >= 80) return { level: 'complete', color: 'green', icon: CheckCircle, text: 'مكتمل', percentage };
    if (percentage >= 50) return { level: 'partial', color: 'yellow', icon: AlertCircle, text: 'ناقص', percentage };
    return { level: 'basic', color: 'red', icon: Clock, text: 'أساسي', percentage };
  };

  const completeness = getProfileCompleteness();
  const CompletionIcon = completeness.icon;

  const handlePrintCard = () => {
    printStudentCard(student, qrCode);
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `qr-${student.name}-${student.studentCode || student.id}.png`;
    link.click();
  };

  const handleShareProfile = async () => {
    const { studentUrl } = generateStudentQRCode(student);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `ملف الطالب - ${student.name}`,
          text: `ملف الطالب ${student.name} - ${student.grade}`,
          url: studentUrl
        });
      } catch (error) {
        navigator.clipboard.writeText(studentUrl);
        alert('تم نسخ الرابط إلى الحافظة');
      }
    } else {
      navigator.clipboard.writeText(studentUrl);
      alert('تم نسخ الرابط إلى الحافظة');
    }
  };

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: User },
    { id: 'contact', label: 'بيانات الاتصال', icon: Phone },
    { id: 'academic', label: 'المعلومات الأكاديمية', icon: GraduationCap },
    { id: 'documents', label: 'المستندات', icon: FileText },
    { id: 'medical', label: 'المعلومات الطبية', icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/students')}
              className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600 hover:text-blue-600 transition-colors duration-200 bg-gray-100 hover:bg-blue-50 px-4 py-2 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>العودة لقائمة الطلاب</span>
            </button>
            
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <button
                onClick={handleShareProfile}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2 rtl:space-x-reverse"
              >
                <Share2 className="h-4 w-4" />
                <span>مشاركة</span>
              </button>
              
              <button
                onClick={() => navigate(`/students/edit/${student.id}`)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 rtl:space-x-reverse"
              >
                <Edit className="h-4 w-4" />
                <span>تعديل</span>
              </button>
            </div>
          </div>

          {/* Student Header Info */}
          <div className="flex items-start space-x-6 rtl:space-x-reverse">
            <div className="flex-shrink-0">
              <div className="h-32 w-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center overflow-hidden shadow-lg">
                {student.avatar ? (
                  <img 
                    src={student.avatar} 
                    alt={student.name} 
                    className="h-32 w-32 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-16 w-16 text-white" />
                )}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-3 rtl:space-x-reverse mb-3">
                <h1 className="text-4xl font-bold text-gray-900">{student.name}</h1>
                <div className={`flex items-center space-x-1 rtl:space-x-reverse px-4 py-2 rounded-full text-sm font-medium ${
                  completeness.color === 'green' ? 'bg-green-100 text-green-800' :
                  completeness.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                }`}>
                  <CompletionIcon className="h-4 w-4" />
                  <span>ملف {completeness.text} ({Math.round(completeness.percentage)}%)</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 rtl:space-x-reverse mb-4">
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  {student.grade}
                </span>
                <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                  {student.subject}
                </span>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  student.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {student.isActive ? 'نشط' : 'غير نشط'}
                </span>
              </div>

              {student.studentCode && (
                <div className="flex items-center space-x-2 rtl:space-x-reverse mb-3">
                  <QrCode className="h-5 w-5 text-purple-600" />
                  <span className="text-lg font-medium text-gray-700">كود الطالب: </span>
                  <span className="text-lg font-bold text-purple-600">{student.studentCode}</span>
                </div>
              )}
              
              <p className="text-gray-600 text-lg">
                انضم في {new Date(student.joinDate).toLocaleDateString('ar-EG', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>اكتمال الملف</span>
                  <span className="font-medium">{Math.round(completeness.percentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      completeness.color === 'green' ? 'bg-green-500' :
                      completeness.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${completeness.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 rtl:space-x-reverse">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 rtl:space-x-reverse transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">مدة الانضمام</p>
                        <p className="text-xl font-bold text-gray-900">
                          {Math.floor((new Date().getTime() - new Date(student.joinDate).getTime()) / (1000 * 60 * 60 * 24))} يوم
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <FileText className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">المستندات</p>
                        <p className="text-xl font-bold text-gray-900">
                          {student.documents?.length || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <User className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">المجموعات</p>
                        <p className="text-xl font-bold text-gray-900">
                          {student.groups?.length || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">المعلومات الأساسية</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
                      <p className="text-gray-900 font-medium">{student.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">كود الطالب</label>
                      <p className="text-gray-900 font-medium">{student.studentCode || 'غير محدد'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">الصف الدراسي</label>
                      <p className="text-gray-900 font-medium">{student.grade}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">المادة</label>
                      <p className="text-gray-900 font-medium">{student.subject}</p>
                    </div>
                    {student.birthDate && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الميلاد</label>
                          <p className="text-gray-900 font-medium">
                            {new Date(student.birthDate).toLocaleDateString('ar-EG')}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">العمر</label>
                          <p className="text-gray-900 font-medium">
                            {new Date().getFullYear() - new Date(student.birthDate).getFullYear()} سنة
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {student.notes && (
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">ملاحظات</h2>
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <p className="text-gray-800 leading-relaxed">{student.notes}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'contact' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">بيانات الاتصال</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Student Contact */}
                    <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                      <h3 className="font-semibold text-blue-900 mb-4 flex items-center space-x-2 rtl:space-x-reverse">
                        <User className="h-5 w-5" />
                        <span>بيانات الطالب</span>
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <Phone className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-blue-900">هاتف الطالب</p>
                            <p className="text-blue-700">{student.phone}</p>
                          </div>
                        </div>
                        
                        {student.email && (
                          <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <Mail className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium text-blue-900">البريد الإلكتروني</p>
                              <p className="text-blue-700">{student.email}</p>
                            </div>
                          </div>
                        )}
                        
                        {student.address && (
                          <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <MapPin className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium text-blue-900">العنوان</p>
                              <p className="text-blue-700">{student.address}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Parent Contact */}
                    <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                      <h3 className="font-semibold text-green-900 mb-4 flex items-center space-x-2 rtl:space-x-reverse">
                        <User className="h-5 w-5" />
                        <span>بيانات ولي الأمر</span>
                      </h3>
                      
                      <div className="space-y-4">
                        {student.parentName && (
                          <div>
                            <p className="font-medium text-green-900">الاسم</p>
                            <p className="text-green-700">{student.parentName}</p>
                          </div>
                        )}
                        
                        {student.parentPhone ? (
                          <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <Phone className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="font-medium text-green-900">هاتف ولي الأمر</p>
                              <p className="text-green-700">{student.parentPhone}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-gray-500">لم يتم إدخال بيانات ولي الأمر</p>
                          </div>
                        )}
                        
                        {student.parentEmail && (
                          <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <Mail className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="font-medium text-green-900">بريد ولي الأمر</p>
                              <p className="text-green-700">{student.parentEmail}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'academic' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">المعلومات الأكاديمية</h2>
                  
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
                      <p className="text-sm mt-2">يمكن إضافة هذه المعلومات من خلال تعديل ملف الطالب</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'documents' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">المستندات المرفقة</h2>
                  
                  {student.documents && student.documents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {student.documents.map((doc) => (
                        <div key={doc.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                          <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{doc.name}</h4>
                              <p className="text-sm text-gray-600">
                                {new Date(doc.uploadDate).toLocaleDateString('ar-EG')}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(doc.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>لا توجد مستندات مرفقة</p>
                      <p className="text-sm mt-2">يمكن إضافة المستندات من خلال تعديل ملف الطالب</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'medical' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">المعلومات الطبية</h2>
                  
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
                      <p className="text-sm mt-2">يمكن إضافة هذه المعلومات من خلال تعديل ملف الطالب</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* QR Code Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 sticky top-24"
            >
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse mb-4">
                  <QrCode className="h-6 w-6 text-purple-600" />
                  <h3 className="text-lg font-bold text-gray-900">بطاقة الطالب الذكية</h3>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-6">
                  <img 
                    src={qrCode} 
                    alt="QR Code" 
                    className="mx-auto mb-4 border border-gray-200 rounded-lg shadow-sm"
                    style={{ width: '200px', height: '200px' }}
                  />
                  <p className="text-sm text-gray-600 mb-2">
                    امسح الكود للوصول لملف الطالب
                  </p>
                  <p className="text-xs text-gray-500">
                    كود الطالب: {student.studentCode || student.id}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={handlePrintCard}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 rtl:space-x-reverse"
                  >
                    <Print className="h-5 w-5" />
                    <span>طباعة البطاقة</span>
                  </button>
                  
                  <button
                    onClick={handleDownloadQR}
                    className="bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center space-x-2 rtl:space-x-reverse"
                  >
                    <Download className="h-5 w-5" />
                    <span>تحميل QR</span>
                  </button>

                  <button
                    onClick={handleShareProfile}
                    className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2 rtl:space-x-reverse"
                  >
                    <Share2 className="h-5 w-5" />
                    <span>مشاركة الملف</span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">إحصائيات سريعة</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">اكتمال الملف</span>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          completeness.color === 'green' ? 'bg-green-500' :
                          completeness.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${completeness.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {Math.round(completeness.percentage)}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">المستندات</span>
                  <span className="font-medium text-gray-900">
                    {student.documents?.length || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">المجموعات</span>
                  <span className="font-medium text-gray-900">
                    {student.groups?.length || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">مدة الانضمام</span>
                  <span className="font-medium text-gray-900">
                    {Math.floor((new Date().getTime() - new Date(student.joinDate).getTime()) / (1000 * 60 * 60 * 24))} يوم
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-blue-50 rounded-xl p-6 border border-blue-200"
            >
              <h3 className="text-lg font-bold text-blue-900 mb-3">💡 نصائح</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• استخدم QR Code لتسجيل الحضور السريع</li>
                <li>• اطبع البطاقة واحتفظ بها مع الطالب</li>
                <li>• شارك الرابط مع ولي الأمر للمتابعة</li>
                <li>• حدث البيانات دورياً للحفاظ على دقتها</li>
                <li>• أضف المستندات والصور للملف الكامل</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;