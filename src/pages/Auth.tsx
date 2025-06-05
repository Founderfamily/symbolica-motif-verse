
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/auth/AuthForm';
import { I18nText } from '@/components/ui/i18n-text';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Users, Globe, BookOpen, TrendingUp, Star, Shield, Zap, Award } from 'lucide-react';

const Auth: React.FC = () => {
  const { user, isLoading } = useAuth();
  
  // Redirect if user is already logged in
  if (user && !isLoading) {
    return <Navigate to="/" replace />;
  }

  // Benefits list avec traductions
  const benefits = [
    <I18nText translationKey="auth.benefits.feature1" />,
    <I18nText translationKey="auth.benefits.feature2" />,
    <I18nText translationKey="auth.benefits.feature3" />,
    <I18nText translationKey="auth.benefits.feature4" />
  ];

  // Statistiques communauté - vraies données Symbolica
  const stats = [
    { 
      icon: Users, 
      value: '12K+', 
      label: <I18nText translationKey="auth.stats.activeResearchers" />
    },
    { 
      icon: Globe, 
      value: '150+', 
      label: <I18nText translationKey="auth.stats.countriesRepresented" />
    },
    { 
      icon: BookOpen, 
      value: '50K+', 
      label: <I18nText translationKey="auth.stats.symbolsDocumented" />
    },
    { 
      icon: TrendingUp, 
      value: '300+', 
      label: <I18nText translationKey="auth.stats.culturalTraditions" />
    }
  ];

  // Testimonials - harmonisés avec les mêmes personnes FR/EN
  const testimonials = [
    {
      name: <I18nText translationKey="auth.testimonials.testimonial1.name" />,
      role: <I18nText translationKey="auth.testimonials.testimonial1.role" />,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face",
      content: <I18nText translationKey="auth.testimonials.testimonial1.content" />,
      rating: 5
    },
    {
      name: <I18nText translationKey="auth.testimonials.testimonial2.name" />,
      role: <I18nText translationKey="auth.testimonials.testimonial2.role" />,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      content: <I18nText translationKey="auth.testimonials.testimonial2.content" />,
      rating: 5
    },
    {
      name: <I18nText translationKey="auth.testimonials.testimonial3.name" />,
      role: <I18nText translationKey="auth.testimonials.testimonial3.role" />,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      content: <I18nText translationKey="auth.testimonials.testimonial3.content" />,
      rating: 5
    }
  ];

  // Features highlights
  const features = [
    {
      icon: Shield,
      title: <I18nText translationKey="auth.features.secure.title" />,
      description: <I18nText translationKey="auth.features.secure.description" />
    },
    {
      icon: Zap,
      title: <I18nText translationKey="auth.features.ai.title" />,
      description: <I18nText translationKey="auth.features.ai.description" />
    },
    {
      icon: Award,
      title: <I18nText translationKey="auth.features.certified.title" />,
      description: <I18nText translationKey="auth.features.certified.description" />
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
                    <I18nText translationKey="auth.communityBadge">Community</I18nText>
                  </Badge>
                </div>
                
                <h2 className="text-2xl lg:text-3xl font-semibold text-slate-900 mb-4">
                  <I18nText translationKey="auth.benefits.title" />
                </h2>
                
                <p className="text-base lg:text-lg text-slate-600 mb-8">
                  <I18nText translationKey="auth.benefits.subtitle" />
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
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  <I18nText translationKey="auth.benefits.whatYouGet" />
                </h3>
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

              {/* Testimonials - maintenant visible sur mobile aussi */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  <I18nText translationKey="auth.testimonials.subtitle" />
                </h3>
                <div className="space-y-4">
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-slate-200 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start space-x-3">
                        <img 
                          src={testimonial.avatar} 
                          alt={typeof testimonial.name === 'string' ? testimonial.name : 'User'}
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

            {/* Right side - Auth form (sticky positioning) */}
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
