import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/auth/AuthForm';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Users, Globe, BookOpen, TrendingUp, Star, Shield, Zap, Award } from 'lucide-react';

const Auth: React.FC = () => {
  const { t } = useTranslation();
  const { user, isLoading } = useAuth();
  
  // Redirect if user is already logged in
  if (user && !isLoading) {
    return <Navigate to="/" replace />;
  }

  // Utiliser directement les clés de traduction pour les bénéfices
  const benefits = [
    t('auth.benefits.features.0'),
    t('auth.benefits.features.1'),
    t('auth.benefits.features.2'),
    t('auth.benefits.features.3')
  ];

  const stats = [
    { icon: Users, value: '1,234', label: 'Chercheurs actifs' },
    { icon: Globe, value: '89', label: 'Pays représentés' },
    { icon: BookOpen, value: '2,847', label: 'Symboles documentés' },
    { icon: TrendingUp, value: '156', label: 'Traditions culturelles' }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Anthropologue culturelle",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face",
      content: "Symbolica a révolutionné mes recherches. Les outils d'analyse IA sont incroyables.",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Conservateur de musée",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      content: "Une ressource inestimable pour comprendre l'héritage symbolique des cultures.",
      rating: 5
    },
    {
      name: "Prof. Elena Volkov",
      role: "Archéologue",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      content: "L'aspect communauté globale rend cette plateforme vraiment unique.",
      rating: 5
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Sécurisé & Privé",
      description: "Vos données sont protégées avec un chiffrement de niveau bancaire"
    },
    {
      icon: Zap,
      title: "IA Avancée",
      description: "Outils d'analyse alimentés par l'intelligence artificielle"
    },
    {
      icon: Award,
      title: "Certifié Académique",
      description: "Reconnu par les institutions de recherche mondiales"
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            
            {/* Left side - Benefits and community info */}
            <div className="space-y-8 order-2 lg:order-1">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start space-x-2 mb-4">
                  <img src="/logo.svg" alt="Symbolica" className="h-10 w-10" />
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
                    <I18nText translationKey="app.name">Symbolica</I18nText>
                  </h1>
                  <Badge variant="outline" className="text-amber-600 border-amber-600 animate-pulse">
                    Community
                  </Badge>
                </div>
                
                <h2 className="text-2xl lg:text-3xl font-semibold text-slate-900 mb-4">
                  <I18nText translationKey="auth.benefits.title">
                    Rejoignez des milliers de chercheurs
                  </I18nText>
                </h2>
                
                <p className="text-base lg:text-lg text-slate-600 mb-8">
                  <I18nText translationKey="auth.benefits.subtitle">
                    Découvrez, contribuez et connectez-vous avec une communauté mondiale passionnée par l'héritage symbolique
                  </I18nText>
                </p>
              </div>

              {/* Features highlight */}
              <div className="grid grid-cols-1 gap-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-all duration-200">
                    <div className="bg-amber-100 p-2 rounded-lg">
                      <feature.icon className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{feature.title}</h3>
                      <p className="text-sm text-slate-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Benefits list */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Ce que vous obtenez :</h3>
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
                  <div key={index} className="bg-white rounded-lg p-4 border border-slate-200 hover:shadow-md transition-all duration-200">
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

              {/* Testimonials */}
              <div className="space-y-4 hidden lg:block">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  <I18nText translationKey="testimonials.subtitle">Ce que disent nos utilisateurs</I18nText>
                </h3>
                <div className="space-y-4">
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-slate-200 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start space-x-3">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex space-x-1">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-slate-700 text-sm mb-2">"{testimonial.content}"</p>
                          <div>
                            <div className="font-semibold text-slate-900 text-sm">{testimonial.name}</div>
                            <div className="text-slate-600 text-xs">{testimonial.role}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side - Auth form */}
            <div className="flex justify-center lg:justify-end order-1 lg:order-2">
              <div className="w-full max-w-md sticky top-8">
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
