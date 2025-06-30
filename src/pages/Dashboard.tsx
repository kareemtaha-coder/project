import React from 'react';
import { Users, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatsCard from '../components/dashboard/StatsCard';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { students, sessions, payments } = useApp();

  const activeStudents = students.filter(s => s.isActive).length;
  const todaySessions = sessions.filter(s => 
    new Date(s.date).toDateString() === new Date().toDateString()
  ).length;
  const monthlyRevenue = payments
    .filter(p => new Date(p.date).getMonth() === new Date().getMonth())
    .reduce((sum, p) => sum + p.amount, 0);
  const completedSessions = sessions.filter(s => s.status === 'completed').length;

  const recentSessions = sessions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const upcomingSessions = sessions
    .filter(s => new Date(s.date) > new Date() && s.status === 'scheduled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="p-6 mr-64">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة التحكم</h1>
        <p className="text-gray-600">مرحباً بك في نظام إدارة الطلاب</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="الطلاب النشطين"
          value={activeStudents}
          icon={Users}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          change={{ value: 12, type: 'increase' }}
        />
        <StatsCard
          title="حصص اليوم"
          value={todaySessions}
          icon={Calendar}
          color="bg-gradient-to-r from-emerald-500 to-emerald-600"
        />
        <StatsCard
          title="إيرادات الشهر"
          value={`${monthlyRevenue} جنيه`}
          icon={DollarSign}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
          change={{ value: 8, type: 'increase' }}
        />
        <StatsCard
          title="الحصص المكتملة"
          value={completedSessions}
          icon={TrendingUp}
          color="bg-gradient-to-r from-orange-500 to-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">الحصص الأخيرة</h2>
          <div className="space-y-4">
            {recentSessions.length > 0 ? (
              recentSessions.map(session => {
                const student = students.find(s => s.id === session.studentId);
                return (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{student?.name}</p>
                      <p className="text-sm text-gray-600">{session.topic}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-600">
                        {new Date(session.date).toLocaleDateString('ar-EG')}
                      </p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        session.status === 'completed' ? 'bg-green-100 text-green-800' :
                        session.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {session.status === 'completed' ? 'مكتملة' :
                         session.status === 'cancelled' ? 'ملغية' : 'مجدولة'}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-4">لا توجد حصص حديثة</p>
            )}
          </div>
        </motion.div>

        {/* Upcoming Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">الحصص القادمة</h2>
          <div className="space-y-4">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map(session => {
                const student = students.find(s => s.id === session.studentId);
                return (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{student?.name}</p>
                      <p className="text-sm text-gray-600">{session.topic}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-blue-600 font-medium">
                        {new Date(session.date).toLocaleDateString('ar-EG')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(session.date).toLocaleTimeString('ar-EG', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-4">لا توجد حصص قادمة</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;