
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/auth/AuthForm';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

const Auth: React.FC = () => {
  const { user, isLoading } = useAuth();
  
  // Redirect if user is already logged in
  if (user && !isLoading) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-[calc(100vh-120px)] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src="/logo.svg" alt="Symbolica" className="h-12 w-12 mr-3" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
              Symbolica
            </h1>
          </div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-2">
            <I18nText translationKey="auth.title" />
          </h2>
          <p className="text-slate-600">
            <I18nText translationKey="auth.subtitle" />
          </p>
        </div>

        {/* Auth Form */}
        <AuthForm />
      </div>
    </div>
  );
};

export default Auth;
