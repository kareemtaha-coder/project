import React, { useState, useEffect } from 'react';
import { X, Save, Loader, User, Phone, Mail, MapPin, Calendar, Heart, GraduationCap, Upload, Plus, Trash2 } from 'lucide-react';
import { Student, EmergencyContact, MedicalInfo, AcademicInfo } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedAddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Omit<Student, 'id'>) => Promise<void>;
  editStudent?: Student | null;
}

const EnhancedAddStudentModal: React.FC<EnhancedAddStudentModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editStudent 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Basic Info
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    studentCode: '',
    birthDate: '',
    phone: '',
    email: '',
    grade: '',
    subject: '',
    address: '',
    notes: '',
    isActive: true
  });

  // Parent Info
  const [parentInfo, setParentInfo] = useState({
    parentName: '',
    parentPhone: '',
    parentEmail: ''
  });

  // Emergency Contact
  const [emergencyContact, setEmergencyContact] = useState<EmergencyContact>({
    name: '',
    relationship: '',
    phone: '',
    email: ''
  });

  // Medical Info
  const [medicalInfo, setMedicalInfo] = useState<MedicalInfo>({
    bloodType: '',
    allergies: [],
    medications: [],
    conditions: [],
    emergencyMedicalInfo: ''
  });

  // Academic Info
  const [academicInfo, setAcademicInfo] = useState<AcademicInfo>({
    previousSchool: '',
    previousGrades: {},
    strengths: [],
    weaknesses: [],
    learningStyle: 'mixed',
    goals: []
  });

  // Groups
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const steps = [
    { id: 1, title: 'البيانات الأساسية', icon: User },
    { id: 2, title: 'بيانات الاتصال', icon: Phone },
    { id: 3, title: 'المعلومات الطبية', icon: Heart },
    { id: 4, title: 'المعلومات الأكاديمية', icon: GraduationCap },
    { id: 5, title: 'المراجعة والحفظ', icon: Save }
  ];

  useEffect(() => {
    if (editStudent) {
      setBasicInfo({
        name: editStudent.name,
        studentCode: editStudent.studentCode || '',
        birthDate: editStudent.birthDate ? new Date(editStudent.birthDate).toISOString().split('T')[0] : '',
        phone: editStudent.phone,
        email: editStudent.email || '',
        grade: editStudent.grade,
        subject: editStudent.subject,
        address: editStudent.address || '',
        notes: editStudent.notes || '',
        isActive: editStudent.isActive
      });

      setParentInfo({
        parentName: editStudent.parentName || '',
        parentPhone: editStudent.parentPhone || '',
        parentEmail: editStudent.parentEmail || ''
      });

      if (editStudent.emergencyContact) {
        setEmergencyContact(editStudent.emergencyContact);
      }

      if (editStudent.medicalInfo) {
        setMedicalInfo(editStudent.medicalInfo);
      }

      if (editStudent.academicInfo) {
        setAcademicInfo(editStudent.academicInfo);
      }

      if (editStudent.groups) {
        setSelectedGroups(editStudent.groups);
      }
    } else {
      // Reset all forms
      setBasicInfo({
        name: '',
        studentCode: '',
        birthDate: '',
        phone: '',
        email: '',
        grade: '',
        subject: '',
        address: '',
        notes: '',
        isActive: true
      });
      setParentInfo({ parentName: '', parentPhone: '', parentEmail: '' });
      setEmergencyContact({ name: '', relationship: '', phone: '', email: '' });
      setMedicalInfo({ bloodType: '', allergies: [], medications: [], conditions: [], emergencyMedicalInfo: '' });
      setAcademicInfo({ previousSchool: '', previousGrades: {}, strengths: [], weaknesses: [], learningStyle: 'mixed', goals: [] });
      setSelectedGroups([]);
    }
    setCurrentStep(1);
    setError('');
  }, [editStudent, isOpen]);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const studentData: Omit<Student, 'id'> = {
        ...basicInfo,
        ...parentInfo,
        birthDate: basicInfo.birthDate ? new Date(basicInfo.birthDate) : undefined,
        joinDate: editStudent?.joinDate || new Date(),
        emergencyContact: emergencyContact.name ? emergencyContact : undefined,
        medicalInfo: Object.values(medicalInfo).some(v => v && (Array.isArray(v) ? v.length > 0 : true)) ? medicalInfo : undefined,
        academicInfo: Object.values(academicInfo).some(v => v && (Array.isArray(v) ? v.length > 0 : true)) ? academicInfo : undefined,
        groups: selectedGroups.length > 0 ? selectedGroups : undefined,
        documents: editStudent?.documents || []
      };

      await onSave(studentData);
      onClose();
    } catch (err) {
      setError('حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى.');
      console.error('Error saving student:', err);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addToArray = (array: string[], value: string, setter: (arr: string[]) => void) => {
    if (value.trim() && !array.includes(value.trim())) {
      setter([...array, value.trim()]);
    }
  };

  const removeFromArray = (array: string[], index: number, setter: (arr: string[]) => void) => {
    setter(array.filter((_, i) => i !== index));
  };

  const grades = [
    'الصف الأول الابتدائي', 'الصف الثاني الابتدائي', 'الصف الثالث الابتدائي',
    'الصف الرابع الابتدائي', 'الصف الخامس الابتدائي', 'الصف السادس الابتدائي',
    'الصف الأول الإعدادي', 'الصف الثاني الإعدادي', 'الصف الثالث الإعدادي',
    'الصف الأول الثانوي', 'الصف الثاني الثانوي', 'الصف الثالث الثانوي'
  ];

  const subjects = [
    'الرياضيات', 'الفيزياء', 'الكيمياء', 'الأحياء', 'اللغة العربية',
    'اللغة الإنجليزية', 'التاريخ', 'الجغرافيا', 'العلوم'
  ];

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const relationships = ['والد', 'والدة', 'أخ', 'أخت', 'جد', 'جدة', 'عم', 'عمة', 'خال', 'خالة', 'أخرى'];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {editStudent ? 'تعديل بيانات الطالب' : 'تسجيل طالب جديد'}
                </h2>
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>

              {/* Progress Steps */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        currentStep >= step.id 
                          ? 'bg-white text-blue-600 border-white' 
                          : 'border-white/50 text-white/50'
                      }`}>
                        <step.icon className="h-5 w-5" />
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`w-16 h-1 mx-2 ${
                          currentStep > step.id ? 'bg-white' : 'bg-white/30'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-center">
                  <p className="text-white/90">{steps[currentStep - 1].title}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6"
                >
                  {error}
                </motion.div>
              )}

              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        اسم الطالب *
                      </label>
                      <input
                        type="text"
                        required
                        value={basicInfo.name}
                        onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                        placeholder="أدخل اسم الطالب الكامل"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        كود الطالب
                      </label>
                      <input
                        type="text"
                        value={basicInfo.studentCode}
                        onChange={(e) => setBasicInfo({ ...basicInfo, studentCode: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                        placeholder="كود تعريف الطالب (اختياري)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        تاريخ الميلاد
                      </label>
                      <input
                        type="date"
                        value={basicInfo.birthDate}
                        onChange={(e) => setBasicInfo({ ...basicInfo, birthDate: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        رقم الهاتف *
                      </label>
                      <input
                        type="tel"
                        required
                        value={basicInfo.phone}
                        onChange={(e) => setBasicInfo({ ...basicInfo, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                        placeholder="01xxxxxxxxx"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        البريد الإلكتروني
                      </label>
                      <input
                        type="email"
                        value={basicInfo.email}
                        onChange={(e) => setBasicInfo({ ...basicInfo, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                        placeholder="student@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الصف الدراسي *
                      </label>
                      <select
                        required
                        value={basicInfo.grade}
                        onChange={(e) => setBasicInfo({ ...basicInfo, grade: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                      >
                        <option value="">اختر الصف</option>
                        {grades.map(grade => (
                          <option key={grade} value={grade}>{grade}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        المادة *
                      </label>
                      <select
                        required
                        value={basicInfo.subject}
                        onChange={(e) => setBasicInfo({ ...basicInfo, subject: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                      >
                        <option value="">اختر المادة</option>
                        {subjects.map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        العنوان
                      </label>
                      <input
                        type="text"
                        value={basicInfo.address}
                        onChange={(e) => setBasicInfo({ ...basicInfo, address: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                        placeholder="عنوان السكن"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ملاحظات
                    </label>
                    <textarea
                      value={basicInfo.notes}
                      onChange={(e) => setBasicInfo({ ...basicInfo, notes: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                      placeholder="أي ملاحظات إضافية..."
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 2: Contact Info */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Parent Info */}
                  <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center space-x-2 rtl:space-x-reverse">
                      <User className="h-5 w-5" />
                      <span>بيانات ولي الأمر</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-green-700 mb-2">
                          اسم ولي الأمر
                        </label>
                        <input
                          type="text"
                          value={parentInfo.parentName}
                          onChange={(e) => setParentInfo({ ...parentInfo, parentName: e.target.value })}
                          className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-right"
                          placeholder="اسم ولي الأمر"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-green-700 mb-2">
                          رقم هاتف ولي الأمر
                        </label>
                        <input
                          type="tel"
                          value={parentInfo.parentPhone}
                          onChange={(e) => setParentInfo({ ...parentInfo, parentPhone: e.target.value })}
                          className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-right"
                          placeholder="01xxxxxxxxx"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-green-700 mb-2">
                          بريد ولي الأمر الإلكتروني
                        </label>
                        <input
                          type="email"
                          value={parentInfo.parentEmail}
                          onChange={(e) => setParentInfo({ ...parentInfo, parentEmail: e.target.value })}
                          className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-right"
                          placeholder="parent@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                    <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center space-x-2 rtl:space-x-reverse">
                      <Phone className="h-5 w-5" />
                      <span>جهة اتصال الطوارئ</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-red-700 mb-2">
                          الاسم
                        </label>
                        <input
                          type="text"
                          value={emergencyContact.name}
                          onChange={(e) => setEmergencyContact({ ...emergencyContact, name: e.target.value })}
                          className="w-full px-4 py-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-right"
                          placeholder="اسم جهة الاتصال"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-red-700 mb-2">
                          العلاقة
                        </label>
                        <select
                          value={emergencyContact.relationship}
                          onChange={(e) => setEmergencyContact({ ...emergencyContact, relationship: e.target.value })}
                          className="w-full px-4 py-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-right"
                        >
                          <option value="">اختر العلاقة</option>
                          {relationships.map(rel => (
                            <option key={rel} value={rel}>{rel}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-red-700 mb-2">
                          رقم الهاتف
                        </label>
                        <input
                          type="tel"
                          value={emergencyContact.phone}
                          onChange={(e) => setEmergencyContact({ ...emergencyContact, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-right"
                          placeholder="01xxxxxxxxx"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-red-700 mb-2">
                          البريد الإلكتروني
                        </label>
                        <input
                          type="email"
                          value={emergencyContact.email}
                          onChange={(e) => setEmergencyContact({ ...emergencyContact, email: e.target.value })}
                          className="w-full px-4 py-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-right"
                          placeholder="emergency@example.com"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Medical Info */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center space-x-2 rtl:space-x-reverse">
                      <Heart className="h-5 w-5" />
                      <span>المعلومات الطبية</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">
                          فصيلة الدم
                        </label>
                        <select
                          value={medicalInfo.bloodType}
                          onChange={(e) => setMedicalInfo({ ...medicalInfo, bloodType: e.target.value })}
                          className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                        >
                          <option value="">اختر فصيلة الدم</option>
                          {bloodTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">
                          الحساسيات
                        </label>
                        <div className="space-y-2">
                          <div className="flex space-x-2 rtl:space-x-reverse">
                            <input
                              type="text"
                              placeholder="أضف حساسية"
                              className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  const value = (e.target as HTMLInputElement).value;
                                  addToArray(medicalInfo.allergies || [], value, (arr) => 
                                    setMedicalInfo({ ...medicalInfo, allergies: arr })
                                  );
                                  (e.target as HTMLInputElement).value = '';
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                                const value = input.value;
                                addToArray(medicalInfo.allergies || [], value, (arr) => 
                                  setMedicalInfo({ ...medicalInfo, allergies: arr })
                                );
                                input.value = '';
                              }}
                              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {medicalInfo.allergies?.map((allergy, index) => (
                              <span key={index} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2 rtl:space-x-reverse">
                                <span>{allergy}</span>
                                <button
                                  onClick={() => removeFromArray(medicalInfo.allergies || [], index, (arr) => 
                                    setMedicalInfo({ ...medicalInfo, allergies: arr })
                                  )}
                                  className="text-yellow-600 hover:text-yellow-800"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">
                          الأدوية
                        </label>
                        <div className="space-y-2">
                          <div className="flex space-x-2 rtl:space-x-reverse">
                            <input
                              type="text"
                              placeholder="أضف دواء"
                              className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  const value = (e.target as HTMLInputElement).value;
                                  addToArray(medicalInfo.medications || [], value, (arr) => 
                                    setMedicalInfo({ ...medicalInfo, medications: arr })
                                  );
                                  (e.target as HTMLInputElement).value = '';
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                                const value = input.value;
                                addToArray(medicalInfo.medications || [], value, (arr) => 
                                  setMedicalInfo({ ...medicalInfo, medications: arr })
                                );
                                input.value = '';
                              }}
                              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {medicalInfo.medications?.map((medication, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2 rtl:space-x-reverse">
                                <span>{medication}</span>
                                <button
                                  onClick={() => removeFromArray(medicalInfo.medications || [], index, (arr) => 
                                    setMedicalInfo({ ...medicalInfo, medications: arr })
                                  )}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">
                          معلومات طبية طارئة
                        </label>
                        <textarea
                          value={medicalInfo.emergencyMedicalInfo}
                          onChange={(e) => setMedicalInfo({ ...medicalInfo, emergencyMedicalInfo: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                          placeholder="أي معلومات طبية مهمة في حالات الطوارئ..."
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Academic Info */}
              {currentStep === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center space-x-2 rtl:space-x-reverse">
                      <GraduationCap className="h-5 w-5" />
                      <span>المعلومات الأكاديمية</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-purple-700 mb-2">
                          المدرسة السابقة
                        </label>
                        <input
                          type="text"
                          value={academicInfo.previousSchool}
                          onChange={(e) => setAcademicInfo({ ...academicInfo, previousSchool: e.target.value })}
                          className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-right"
                          placeholder="اسم المدرسة السابقة"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-purple-700 mb-2">
                          أسلوب التعلم المفضل
                        </label>
                        <select
                          value={academicInfo.learningStyle}
                          onChange={(e) => setAcademicInfo({ ...academicInfo, learningStyle: e.target.value as any })}
                          className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-right"
                        >
                          <option value="visual">بصري</option>
                          <option value="auditory">سمعي</option>
                          <option value="kinesthetic">حركي</option>
                          <option value="mixed">مختلط</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-purple-700 mb-2">
                          نقاط القوة
                        </label>
                        <div className="space-y-2">
                          <div className="flex space-x-2 rtl:space-x-reverse">
                            <input
                              type="text"
                              placeholder="أضف نقطة قوة"
                              className="flex-1 px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-right"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  const value = (e.target as HTMLInputElement).value;
                                  addToArray(academicInfo.strengths || [], value, (arr) => 
                                    setAcademicInfo({ ...academicInfo, strengths: arr })
                                  );
                                  (e.target as HTMLInputElement).value = '';
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                                const value = input.value;
                                addToArray(academicInfo.strengths || [], value, (arr) => 
                                  setAcademicInfo({ ...academicInfo, strengths: arr })
                                );
                                input.value = '';
                              }}
                              className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {academicInfo.strengths?.map((strength, index) => (
                              <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2 rtl:space-x-reverse">
                                <span>{strength}</span>
                                <button
                                  onClick={() => removeFromArray(academicInfo.strengths || [], index, (arr) => 
                                    setAcademicInfo({ ...academicInfo, strengths: arr })
                                  )}
                                  className="text-green-600 hover:text-green-800"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-purple-700 mb-2">
                          نقاط الضعف
                        </label>
                        <div className="space-y-2">
                          <div className="flex space-x-2 rtl:space-x-reverse">
                            <input
                              type="text"
                              placeholder="أضف نقطة ضعف"
                              className="flex-1 px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-right"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  const value = (e.target as HTMLInputElement).value;
                                  addToArray(academicInfo.weaknesses || [], value, (arr) => 
                                    setAcademicInfo({ ...academicInfo, weaknesses: arr })
                                  );
                                  (e.target as HTMLInputElement).value = '';
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                                const value = input.value;
                                addToArray(academicInfo.weaknesses || [], value, (arr) => 
                                  setAcademicInfo({ ...academicInfo, weaknesses: arr })
                                );
                                input.value = '';
                              }}
                              className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {academicInfo.weaknesses?.map((weakness, index) => (
                              <span key={index} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2 rtl:space-x-reverse">
                                <span>{weakness}</span>
                                <button
                                  onClick={() => removeFromArray(academicInfo.weaknesses || [], index, (arr) => 
                                    setAcademicInfo({ ...academicInfo, weaknesses: arr })
                                  )}
                                  className="text-orange-600 hover:text-orange-800"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-purple-700 mb-2">
                          الأهداف الأكاديمية
                        </label>
                        <div className="space-y-2">
                          <div className="flex space-x-2 rtl:space-x-reverse">
                            <input
                              type="text"
                              placeholder="أضف هدف أكاديمي"
                              className="flex-1 px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-right"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  const value = (e.target as HTMLInputElement).value;
                                  addToArray(academicInfo.goals || [], value, (arr) => 
                                    setAcademicInfo({ ...academicInfo, goals: arr })
                                  );
                                  (e.target as HTMLInputElement).value = '';
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                                const value = input.value;
                                addToArray(academicInfo.goals || [], value, (arr) => 
                                  setAcademicInfo({ ...academicInfo, goals: arr })
                                );
                                input.value = '';
                              }}
                              className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {academicInfo.goals?.map((goal, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2 rtl:space-x-reverse">
                                <span>{goal}</span>
                                <button
                                  onClick={() => removeFromArray(academicInfo.goals || [], index, (arr) => 
                                    setAcademicInfo({ ...academicInfo, goals: arr })
                                  )}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Review */}
              {currentStep === 5 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4">مراجعة البيانات</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info Summary */}
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-3">البيانات الأساسية</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">الاسم:</span> {basicInfo.name}</p>
                        <p><span className="font-medium">الصف:</span> {basicInfo.grade}</p>
                        <p><span className="font-medium">المادة:</span> {basicInfo.subject}</p>
                        <p><span className="font-medium">الهاتف:</span> {basicInfo.phone}</p>
                      </div>
                    </div>

                    {/* Contact Info Summary */}
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-3">بيانات الاتصال</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">ولي الأمر:</span> {parentInfo.parentName || 'غير محدد'}</p>
                        <p><span className="font-medium">هاتف ولي الأمر:</span> {parentInfo.parentPhone || 'غير محدد'}</p>
                        <p><span className="font-medium">جهة الطوارئ:</span> {emergencyContact.name || 'غير محدد'}</p>
                      </div>
                    </div>

                    {/* Medical Info Summary */}
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <h4 className="font-semibold text-red-900 mb-3">المعلومات الطبية</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">فصيلة الدم:</span> {medicalInfo.bloodType || 'غير محدد'}</p>
                        <p><span className="font-medium">الحساسيات:</span> {medicalInfo.allergies?.length || 0}</p>
                        <p><span className="font-medium">الأدوية:</span> {medicalInfo.medications?.length || 0}</p>
                      </div>
                    </div>

                    {/* Academic Info Summary */}
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <h4 className="font-semibold text-purple-900 mb-3">المعلومات الأكاديمية</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">المدرسة السابقة:</span> {academicInfo.previousSchool || 'غير محدد'}</p>
                        <p><span className="font-medium">أسلوب التعلم:</span> {
                          academicInfo.learningStyle === 'visual' ? 'بصري' :
                          academicInfo.learningStyle === 'auditory' ? 'سمعي' :
                          academicInfo.learningStyle === 'kinesthetic' ? 'حركي' : 'مختلط'
                        }</p>
                        <p><span className="font-medium">نقاط القوة:</span> {academicInfo.strengths?.length || 0}</p>
                        <p><span className="font-medium">الأهداف:</span> {academicInfo.goals?.length || 0}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="flex space-x-4 rtl:space-x-reverse">
                {currentStep > 1 && (
                  <button
                    onClick={prevStep}
                    disabled={loading}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                  >
                    السابق
                  </button>
                )}
              </div>

              <div className="flex space-x-4 rtl:space-x-reverse">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                >
                  إلغاء
                </button>
                
                {currentStep < steps.length ? (
                  <button
                    onClick={nextStep}
                    disabled={loading || !basicInfo.name || !basicInfo.phone || !basicInfo.grade || !basicInfo.subject}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    التالي
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2 rtl:space-x-reverse disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader className="h-5 w-5 animate-spin" />
                        <span>جاري الحفظ...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        <span>{editStudent ? 'حفظ التعديلات' : 'تسجيل الطالب'}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EnhancedAddStudentModal;