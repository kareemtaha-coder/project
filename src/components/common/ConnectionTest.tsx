import React, { useState } from 'react';
import { Database, CheckCircle, XCircle, Loader, AlertTriangle, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { testConnection, createTables } from '../../lib/supabase';

const ConnectionTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingTables, setIsCreatingTables] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    success: boolean;
    message: string;
    needsSetup?: boolean;
  } | null>(null);

  const handleTestConnection = async () => {
    setIsLoading(true);
    setConnectionStatus(null);

    try {
      const result = await testConnection();
      setConnectionStatus(result);
    } catch (error) {
      setConnectionStatus({
        success: false,
        message: 'خطأ في الاتصال بقاعدة البيانات'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTables = async () => {
    setIsCreatingTables(true);
    
    try {
      const result = await createTables();
      setConnectionStatus(result);
      
      // Test connection again after creating tables
      if (result.success) {
        setTimeout(async () => {
          const testResult = await testConnection();
          setConnectionStatus(testResult);
        }, 1000);
      }
    } catch (error) {
      setConnectionStatus({
        success: false,
        message: 'خطأ في إنشاء الجداول'
      });
    } finally {
      setIsCreatingTables(false);
    }
  };

  const hasValidEnvVars = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
  const isPlaceholderKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.includes('YourActualSupabaseAnonKeyHere');

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
          <Database className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">إعداد قاعدة البيانات</h3>
          <p className="text-sm text-gray-600">اختبار الاتصال وإنشاء الجداول</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Environment Variables Warning */}
        {(!hasValidEnvVars || isPlaceholderKey) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg border bg-amber-50 border-amber-200"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <span className="font-medium text-amber-800">تحذير: إعداد متغيرات البيئة</span>
            </div>
            <p className="mt-2 text-sm text-amber-700">
              {!hasValidEnvVars 
                ? 'متغيرات البيئة مفقودة. تأكد من وجود ملف .env مع القيم الصحيحة.'
                : 'يرجى استبدال القيم الافتراضية في ملف .env بالقيم الحقيقية من مشروع Supabase الخاص بك.'
              }
            </p>
          </motion.div>
        )}

        {/* Connection Status */}
        {connectionStatus && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg border ${
              connectionStatus.success
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              {connectionStatus.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="font-medium">
                {connectionStatus.success ? 'نجح الاتصال!' : 'فشل الاتصال!'}
              </span>
            </div>
            <p className="mt-2 text-sm">{connectionStatus.message}</p>
          </motion.div>
        )}

        {/* Database Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">معلومات قاعدة البيانات:</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <p><span className="font-medium">الخادم:</span> vidiuyaglathpuczywno.supabase.co</p>
            <p><span className="font-medium">المنفذ:</span> 5432</p>
            <p><span className="font-medium">قاعدة البيانات:</span> postgres</p>
            <p><span className="font-medium">الحالة:</span> 
              <span className={`mr-2 px-2 py-1 rounded-full text-xs ${
                connectionStatus?.success 
                  ? 'bg-green-100 text-green-800' 
                  : connectionStatus === null 
                    ? 'bg-gray-100 text-gray-800' 
                    : 'bg-red-100 text-red-800'
              }`}>
                {connectionStatus?.success ? 'متصل' : connectionStatus === null ? 'غير محدد' : 'غير متصل'}
              </span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleTestConnection}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 rtl:space-x-reverse"
          >
            {isLoading ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>جاري الاختبار...</span>
              </>
            ) : (
              <>
                <Database className="h-5 w-5" />
                <span>اختبار الاتصال</span>
              </>
            )}
          </button>

          <button
            onClick={handleCreateTables}
            disabled={isCreatingTables || !hasValidEnvVars}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 rtl:space-x-reverse"
          >
            {isCreatingTables ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>جاري الإنشاء...</span>
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                <span>إنشاء الجداول</span>
              </>
            )}
          </button>
        </div>

        {/* Manual Setup Instructions */}
        {connectionStatus?.needsSetup && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">إنشاء الجداول يدوياً:</h4>
            <div className="text-sm text-blue-800 space-y-2">
              <p>إذا لم تنجح عملية الإنشاء التلقائي، يمكنك إنشاء الجداول يدوياً:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>اذهب إلى <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline">Supabase Dashboard</a></li>
                <li>اختر مشروعك</li>
                <li>اذهب إلى SQL Editor</li>
                <li>انسخ والصق الكود من ملف migration في المشروع</li>
                <li>اضغط Run لتنفيذ الكود</li>
              </ol>
            </div>
          </div>
        )}

        {/* Environment Variables Status */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">متغيرات البيئة:</h4>
          <div className="space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-blue-800">VITE_SUPABASE_URL:</span>
              <span className={`px-2 py-1 rounded text-xs ${
                import.meta.env.VITE_SUPABASE_URL 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {import.meta.env.VITE_SUPABASE_URL ? '✓ موجود' : '✗ مفقود'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-800">VITE_SUPABASE_ANON_KEY:</span>
              <span className={`px-2 py-1 rounded text-xs ${
                import.meta.env.VITE_SUPABASE_ANON_KEY && !isPlaceholderKey
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {import.meta.env.VITE_SUPABASE_ANON_KEY 
                  ? (isPlaceholderKey ? '⚠ قيمة افتراضية' : '✓ موجود')
                  : '✗ مفقود'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <h4 className="font-medium text-yellow-900 mb-2">تعليمات الإعداد:</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• انتقل إلى مشروع Supabase الخاص بك في dashboard.supabase.com</li>
            <li>• اذهب إلى Settings → API</li>
            <li>• انسخ Project URL و anon public key</li>
            <li>• استبدل القيم في ملف .env</li>
            <li>• أعد تشغيل الخادم بعد تعديل ملف .env</li>
            <li>• اضغط "إنشاء الجداول" لإنشاء قاعدة البيانات</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ConnectionTest;