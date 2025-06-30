import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import Teachers from './pages/Teachers';
import Students from './pages/Students';
import Groups from './pages/Groups';
import Subjects from './pages/Subjects';
import Settings from './pages/Settings';
import StudentProfile from './pages/StudentProfile';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex">
          <Routes>
            {/* صفحة ملف الطالب المستقلة (بدون sidebar) */}
            <Route path="/student/:id" element={<StudentProfile />} />
            
            {/* الصفحات العادية مع sidebar */}
            <Route path="/*" element={
              <>
                <Sidebar />
                <div className="flex-1">
                  <Header title="نظام إدارة التعليم المتكامل" />
                  <main>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/teachers" element={<Teachers />} />
                      <Route path="/students" element={<Students />} />
                      <Route path="/groups" element={<Groups />} />
                      <Route path="/subjects" element={<Subjects />} />
                      <Route path="/sessions" element={<div className="p-6 mr-64"><h1 className="text-2xl font-bold">الحصص - قريباً</h1></div>} />
                      <Route path="/payments" element={<div className="p-6 mr-64"><h1 className="text-2xl font-bold">المدفوعات - قريباً</h1></div>} />
                      <Route path="/reports" element={<div className="p-6 mr-64"><h1 className="text-2xl font-bold">التقارير - قريباً</h1></div>} />
                      <Route path="/settings" element={<Settings />} />
                    </Routes>
                  </main>
                </div>
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;