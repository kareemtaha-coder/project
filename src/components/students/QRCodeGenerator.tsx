import React from 'react';
import { QrCode, Download, User } from 'lucide-react';
import { Student } from '../../types';

interface QRCodeGeneratorProps {
  student: Student;
  onGenerateQR: (studentId: string) => string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ student, onGenerateQR }) => {
  const generateQRCode = () => {
    // في التطبيق الحقيقي، ستستخدم مكتبة QR code
    const qrData = JSON.stringify({
      id: student.id,
      name: student.name,
      code: student.studentCode,
      phone: student.phone
    });
    
    // محاكاة إنشاء QR code
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
    return qrCodeUrl;
  };

  const downloadQRCode = () => {
    const qrUrl = generateQRCode();
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `qr-${student.name}-${student.studentCode || student.id}.png`;
    link.click();
  };

  const printQRCard = () => {
    const qrUrl = generateQRCode();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>بطاقة الطالب - ${student.name}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 20px;
                direction: rtl;
              }
              .card {
                border: 2px solid #333;
                border-radius: 10px;
                padding: 20px;
                max-width: 300px;
                margin: 0 auto;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
              }
              .qr-code {
                background: white;
                padding: 10px;
                border-radius: 10px;
                margin: 10px 0;
              }
              h2 { margin: 10px 0; }
              p { margin: 5px 0; }
            </style>
          </head>
          <body>
            <div class="card">
              <h2>${student.name}</h2>
              <p>كود الطالب: ${student.studentCode || student.id}</p>
              <p>${student.grade} - ${student.subject}</p>
              <div class="qr-code">
                <img src="${qrUrl}" alt="QR Code" />
              </div>
              <p>هاتف: ${student.phone}</p>
              <p>نظام إدارة الطلاب</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
      <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
        <div className="bg-purple-100 p-2 rounded-lg">
          <QrCode className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-purple-900">بطاقة الطالب الذكية</h3>
          <p className="text-purple-700 text-sm">كود QR للحضور والانصراف</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 border border-purple-300 mb-4">
        <div className="text-center">
          <img 
            src={generateQRCode()} 
            alt="QR Code" 
            className="mx-auto mb-3 border border-gray-200 rounded"
          />
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-900">{student.name}</p>
            <p>كود: {student.studentCode || student.id}</p>
            <p>{student.grade} - {student.subject}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={downloadQRCode}
          className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center space-x-2 rtl:space-x-reverse text-sm"
        >
          <Download className="h-4 w-4" />
          <span>تحميل</span>
        </button>
        
        <button
          onClick={printQRCard}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2 rtl:space-x-reverse text-sm"
        >
          <User className="h-4 w-4" />
          <span>طباعة البطاقة</span>
        </button>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-yellow-800 text-xs">
          💡 يمكن استخدام هذا الكود لتسجيل الحضور والانصراف بسرعة باستخدام كاميرا الهاتف
        </p>
      </div>
    </div>
  );
};

export default QRCodeGenerator;