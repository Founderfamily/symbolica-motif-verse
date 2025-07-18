import React from 'react';
import { Shield, Award, Globe, CheckCircle, Database, Search, Settings } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useStandardizedCategories } from '@/features/collections/hooks/useStandardizedCategories';
import { useCollections } from '@/features/collections/hooks/useCollections';

const Standards = () => {
  const { data: collections } = useCollections();
  const { getConformityStats } = useStandardizedCategories(collections);
  const conformityStats = getConformityStats();
  const conformityScore = Math.round(conformityStats.conformityRate);

  const standards = [
    {
      icon: Globe,
      title: "UNESCO",
      subtitle: "Géographie & Cultures",
      description: "50+ régions normalisées selon standards UNESCO",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Database,
      title: "CIDOC-CRM",
      subtitle: "Métadonnées Culturelles",
      description: "Classification muséographique internationale",
      color: "from-amber-500 to-amber-600"
    },
    {
      icon: Settings,
      title: "Dublin Core",
      subtitle: "Interopérabilité",
      description: "Métadonnées standardisées pour l'échange",
      color: "from-emerald-500 to-emerald-600"
    }
  ];

  const benefits = [
    {
      icon: Search,
      title: "Recherche Universelle",
      description: "Compatible avec les bases patrimoniales mondiales"
    },
    {
      icon: Award,
      title: "Classification Scientifique",
      description: "Terminologie officielle internationale"
    },
    {
      icon: CheckCircle,
      title: "Validation Académique",
      description: "Références aux thésaurus d'autorité"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-stone-50 via-amber-50/20 to-stone-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/75 px-4 py-2 rounded-full border border-amber-200 mb-6">
            <Shield className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-medium text-stone-700">
              <I18nText translationKey="standards.badge">Standards Internationaux</I18nText>
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-stone-800 font-adventure mb-4">
            <I18nText translationKey="standards.title">Taxonomie Certifiée Standards Mondiaux</I18nText>
          </h2>
          
          <p className="text-lg text-stone-600 max-w-3xl mx-auto">
            <I18nText translationKey="standards.subtitle">
              Notre système de classification respecte les standards internationaux pour une compatibilité académique et scientifique optimale
            </I18nText>
          </p>
        </div>

        {/* Standards Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {standards.map((standard, index) => (
            <div key={index} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r opacity-5 rounded-2xl transition-opacity group-hover:opacity-10" 
                   style={{backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))`}} />
              
              <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-stone-200 hover:border-stone-300 transition-all duration-300 hover:shadow-lg">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${standard.color} mb-6`}>
                  <standard.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-stone-800 mb-2">{standard.title}</h3>
                <p className="text-amber-600 font-medium mb-3">{standard.subtitle}</p>
                <p className="text-stone-600 text-sm leading-relaxed">{standard.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Conformity Score */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-amber-200 p-8 mb-12">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div>
              <h3 className="text-2xl font-semibold text-stone-800 mb-2">
                <I18nText translationKey="standards.conformity.title">Score de Conformité</I18nText>
              </h3>
              <p className="text-stone-600">
                <I18nText translationKey="standards.conformity.description">
                  Évaluation automatique du respect des standards internationaux
                </I18nText>
              </p>
            </div>
            
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-24 h-24">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#f59e0b"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${conformityScore * 2.51} 251`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-amber-600">{conformityScore}%</span>
                </div>
              </div>
              <p className="text-sm text-stone-500 mt-2">
                <I18nText translationKey="standards.conformity.score">Conformité Standards</I18nText>
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex p-4 bg-gradient-to-br from-stone-100 to-amber-100 rounded-2xl mb-4">
                <benefit.icon className="w-8 h-8 text-amber-600" />
              </div>
              <h4 className="text-lg font-semibold text-stone-800 mb-2">{benefit.title}</h4>
              <p className="text-stone-600 text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-3 rounded-full font-medium hover:from-amber-600 hover:to-amber-700 transition-all duration-300 hover:shadow-lg">
            <I18nText translationKey="standards.cta">En savoir plus sur nos standards</I18nText>
            <Shield className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Standards;