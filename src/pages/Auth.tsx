
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/auth/AuthForm';
import { useTranslation } from '@/i18n/useTranslation';

const Auth: React.FC = () => {
  const { t } = useTranslation();
  const { user, isLoading } = useAuth();
  
  // Redirect if user is already logged in
  if (user && !isLoading) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mb-8 text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent mb-2">
          Symbolica
        </h1>
        <p className="text-slate-600 mb-8">
          {t('auth.intro')}
        </p>
        <AuthForm />
      </div>
    </div>
  );
};

export default Auth;
