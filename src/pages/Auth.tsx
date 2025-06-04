
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/auth/AuthForm';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Users, Globe, BookOpen, TrendingUp } from 'lucide-react';

const Auth: React.FC = () => {
  const { t } = useTranslation();
  const { user, isLoading } = useAuth();
  
  // Redirect if user is already logged in
  if (user && !isLoading) {
    return <Navigate to="/" replace />;
  }

  const benefits = [
    t('auth.benefits.features.0'),
    t('auth.benefits.features.1'),
    t('auth.benefits.features.2'),
    t('auth.benefits.features.3')
  ];

  const stats = [
    { icon: Users, value: '1,234', label: 'Active researchers' },
    { icon: Globe, value: '89', label: 'Countries represented' },
    { icon: BookOpen, value: '2,847', label: 'Symbols documented' },
    { icon: TrendingUp, value: '156', label: 'Cultural traditions' }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left side - Benefits and community info */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start space-x-2 mb-4">
                  <img src="/logo.svg" alt="Symbolica" className="h-10 w-10" />
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
                    <I18nText translationKey="app.name">Symbolica</I18nText>
                  </h1>
                  <Badge variant="outline" className="text-amber-600 border-amber-600">
                    Community
                  </Badge>
                </div>
                
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                  <I18nText translationKey="auth.benefits.title">
                    Join thousands of researchers
                  </I18nText>
                </h2>
                
                <p className="text-lg text-slate-600 mb-8">
                  <I18nText translationKey="auth.benefits.subtitle">
                    Discover, contribute and connect with a global community passionate about symbolic heritage
                  </I18nText>
                </p>
              </div>

              {/* Benefits list */}
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Community stats */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center space-x-3">
                      <div className="bg-amber-100 p-2 rounded-lg">
                        <stat.icon className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-slate-900">{stat.value}</div>
                        <div className="text-sm text-slate-600">{stat.label}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Auth form */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md">
                <AuthForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
