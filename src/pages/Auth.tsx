
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/auth/AuthForm';
import { I18nText } from '@/components/ui/i18n-text';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Users, Globe, BookOpen, TrendingUp, Star, Shield, Zap, Award } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';

const Auth: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { t } = useTranslation();
  
  // Redirect if user is already logged in
  if (user && !isLoading) {
    return <Navigate to="/" replace />;
  }

  // Benefits list avec traductions
  const benefits = [
    <I18nText translationKey="benefits.feature1" ns="auth">Rejoignez une communauté passionnée qui vous rassemble</I18nText>,
    <I18nText translationKey="benefits.feature2" ns="auth">Vivez des quêtes fascinantes à travers les cultures</I18nText>,
    <I18nText translationKey="benefits.feature3" ns="auth">Transmettez un héritage symbolique aux générations futures</I18nText>,
    <I18nText translationKey="benefits.feature4" ns="auth">Découvrez des nouvelles cultures et leurs trésors cachés</I18nText>
  ];

  // Statistiques communauté - vraies données Symbolica
  const stats = [
    { 
      icon: Users, 
      value: '12K+', 
      label: <I18nText translationKey="stats.activeResearchers" ns="auth">Chercheurs actifs</I18nText>
    },
    { 
      icon: Globe, 
      value: '150+', 
      label: <I18nText translationKey="stats.countriesRepresented" ns="auth">Pays représentés</I18nText>
    },
    { 
      icon: BookOpen, 
      value: '50K+', 
      label: <I18nText translationKey="stats.symbolsDocumented" ns="auth">Symboles documentés</I18nText>
    },
    { 
      icon: TrendingUp, 
      value: '300+', 
      label: <I18nText translationKey="stats.culturalTraditions" ns="auth">Traditions culturelles</I18nText>
    }
  ];

  // Testimonials - harmonisés avec les mêmes personnes FR/EN
  const testimonials = [
    {
      name: <I18nText translationKey="testimonials.testimonial1.name" ns="auth">Dr. Marie Dubois</I18nText>,
      role: <I18nText translationKey="testimonials.testimonial1.role" ns="auth">Anthropologue culturelle</I18nText>,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face",
      content: <I18nText translationKey="testimonials.testimonial1.content" ns="auth">Symbolica a révolutionné mes recherches. Les outils d'analyse IA sont incroyables pour décoder les symboles anciens.</I18nText>,
      rating: 5
    },
    {
      name: <I18nText translationKey="testimonials.testimonial2.name" ns="auth">Jean-Pierre Martin</I18nText>,
      role: <I18nText translationKey="testimonials.testimonial2.role" ns="auth">Conservateur de musée</I18nText>,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      content: <I18nText translationKey="testimonials.testimonial2.content" ns="auth">Une ressource inestimable pour comprendre l'héritage symbolique des cultures. Indispensable pour tout chercheur.</I18nText>,
      rating: 5
    },
    {
      name: <I18nText translationKey="testimonials.testimonial3.name" ns="auth">Prof. Claire Moreau</I18nText>,
      role: <I18nText translationKey="testimonials.testimonial3.role" ns="auth">Archéologue</I18nText>,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      content: <I18nText translationKey="testimonials.testimonial3.content" ns="auth">L'aspect communauté globale rend cette plateforme vraiment unique. Un trésor pour la recherche collaborative.</I18nText>,
      rating: 5
    }
  ];

  // Features highlights
  const features = [
    {
      icon: Shield,
      title: <I18nText translationKey="features.secure.title" ns="auth">Sécurisé & Privé</I18nText>,
      description: <I18nText translationKey="features.secure.description" ns="auth">Vos données sont protégées avec un chiffrement de niveau bancaire</I18nText>
    },
    {
      icon: Zap,
      title: <I18nText translationKey="features.ai.title" ns="auth">IA Avancée</I18nText>,
      description: <I18nText translationKey="features.ai.description" ns="auth">Outils d'analyse alimentés par l'intelligence artificielle</I18nText>
    },
    {
      icon: Award,
      title: <I18nText translationKey="features.certified.title" ns="auth">Certifié Académique</I18nText>,
      description: <I18nText translationKey="features.certified.description" ns="auth">Reconnu par les institutions de recherche mondiales</I18nText>
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
                    {t('app.name', { ns: 'app' })}
                  </h1>
                  <Badge variant="outline" className="text-amber-600 border-amber-600 animate-pulse">
                    <I18nText translationKey="communityBadge" ns="auth">Communauté</I18nText>
                  </Badge>
                </div>
                
                <h2 className="text-2xl lg:text-3xl font-semibold text-slate-900 mb-4">
                  <I18nText translationKey="benefits.title" ns="auth">Rejoignez des milliers de chercheurs</I18nText>
                </h2>
                
                <p className="text-base lg:text-lg text-slate-600 mb-8">
                  <I18nText translationKey="benefits.subtitle" ns="auth">Découvrez, contribuez et connectez-vous avec une communauté mondiale passionnée par l'héritage symbolique</I18nText>
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
                  <I18nText translationKey="benefits.whatYouGet" ns="auth">Ce que vous obtenez :</I18nText>
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
                  <I18nText translationKey="testimonials.subtitle" ns="auth">Ce que disent nos utilisateurs</I18nText>
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
