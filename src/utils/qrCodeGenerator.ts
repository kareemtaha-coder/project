// مولد QR Code للطلاب
export const generateStudentQRCode = (student: { id: string; name: string; studentCode?: string }) => {
  // إنشاء رابط لصفحة الطالب
  const studentUrl = `${window.location.origin}/student/${student.id}`;
  
  // بيانات QR Code
  const qrData = {
    type: 'student_profile',
    id: student.id,
    name: student.name,
    code: student.studentCode,
    url: studentUrl,
    timestamp: new Date().toISOString()
  };

  // إنشاء QR Code باستخدام خدمة مجانية
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&format=png&data=${encodeURIComponent(studentUrl)}`;
  
  return {
    qrCodeUrl,
    studentUrl,
    qrData: JSON.stringify(qrData)
  };
};

// إنشاء كود فريد للطالب
export const generateStudentCode = (name: string, grade: string) => {
  const nameCode = name.split(' ')[0].substring(0, 3).toUpperCase();
  const gradeCode = grade.includes('الأول') ? '1' : 
                   grade.includes('الثاني') ? '2' : 
                   grade.includes('الثالث') ? '3' : 
                   grade.includes('الرابع') ? '4' : 
                   grade.includes('الخامس') ? '5' : 
                   grade.includes('السادس') ? '6' : '0';
  
  const levelCode = grade.includes('ابتدائي') ? 'P' : 
                   grade.includes('إعدادي') ? 'M' : 
                   grade.includes('ثانوي') ? 'S' : 'X';
  
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `${nameCode}${levelCode}${gradeCode}${randomNum}`;
};

// طباعة بطاقة الطالب
export const printStudentCard = (student: any, qrCodeUrl: string) => {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
        <head>
          <title>بطاقة الطالب - ${student.name}</title>
          <meta charset="UTF-8">
          <style>
            body { 
              font-family: 'Arial', sans-serif; 
              margin: 0;
              padding: 20px;
              background: #f5f5f5;
              direction: rtl;
            }
            .card {
              width: 400px;
              height: 250px;
              margin: 0 auto;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 20px;
              padding: 25px;
              box-shadow: 0 15px 35px rgba(0,0,0,0.3);
              color: white;
              position: relative;
              overflow: hidden;
            }
            .card::before {
              content: '';
              position: absolute;
              top: -50%;
              right: -50%;
              width: 200%;
              height: 200%;
              background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
              transform: rotate(45deg);
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              position: relative;
              z-index: 2;
            }
            .logo {
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 8px;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            .subtitle {
              font-size: 12px;
              opacity: 0.9;
            }
            .content {
              display: flex;
              justify-content: space-between;
              align-items: center;
              position: relative;
              z-index: 2;
            }
            .student-info {
              flex: 1;
            }
            .student-name {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 12px;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            .student-details {
              font-size: 13px;
              line-height: 1.6;
              opacity: 0.95;
            }
            .detail-item {
              margin-bottom: 4px;
              display: flex;
              align-items: center;
            }
            .detail-icon {
              margin-left: 8px;
              font-size: 14px;
            }
            .qr-section {
              background: white;
              padding: 10px;
              border-radius: 12px;
              margin-left: 20px;
              box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }
            .qr-code {
              width: 90px;
              height: 90px;
              border-radius: 8px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 10px;
              opacity: 0.8;
              position: relative;
              z-index: 2;
            }
            .decorative-element {
              position: absolute;
              bottom: -20px;
              left: -20px;
              width: 100px;
              height: 100px;
              background: rgba(255,255,255,0.1);
              border-radius: 50%;
              z-index: 1;
            }
            @media print {
              body { 
                background: white; 
                padding: 10px;
              }
              .card { 
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="decorative-element"></div>
            
            <div class="header">
              <div class="logo">🎓 نظام إدارة الطلاب</div>
              <div class="subtitle">بطاقة الطالب الذكية</div>
            </div>
            
            <div class="content">
              <div class="student-info">
                <div class="student-name">${student.name}</div>
                <div class="student-details">
                  <div class="detail-item">
                    <span class="detail-icon">📚</span>
                    <span>${student.grade}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-icon">📖</span>
                    <span>${student.subject}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-icon">📱</span>
                    <span>${student.phone}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-icon">🔢</span>
                    <span>${student.studentCode || student.id}</span>
                  </div>
                </div>
              </div>
              
              <div class="qr-section">
                <img src="${qrCodeUrl}" alt="QR Code" class="qr-code" />
              </div>
            </div>
            
            <div class="footer">
              امسح الكود للوصول لملف الطالب • ${new Date().toLocaleDateString('ar-EG')}
            </div>
          </div>
          
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 1000);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
};