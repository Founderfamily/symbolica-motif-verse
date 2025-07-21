
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Globe, Award, Users } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const HeritageSection = () => {
  const navigate = useNavigate();

  const heritageFeatures = [
    {
      icon: Globe,
      title: "Civilisations du Monde",
      description: "Explorez les symboles de toutes les civilisations",
      count: "50+ cultures",
      color: "blue"
    },
    {
      icon: BookOpen,
      title: "Approche Académique",
      description: "Recherches validées par des experts",
      count: "200+ études",
      color: "emerald"
    },
    {
      icon: Award,
      title: "Standards UNESCO",
      description: "Conforme aux standards internationaux",
      count: "Certifié",
      color: "amber"
    },
    {
      icon: Users,
      title: "Communauté Savante",
      description: "Échangez avec des historiens et archéologues",
      count: "1000+ experts",
      color: "purple"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' };
      case 'emerald':
        return { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200' };
      case 'amber':
        return { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' };
      case 'purple':
        return { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    }
  };

  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto bg-slate-50/50">
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
          <BookOpen className="w-4 h-4 mr-2" />
          Patrimoine Culturel
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
          Apprenez le patrimoine culturel mondial
        </h2>
        
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Une approche rigoureuse et académique pour comprendre les symboles 
          qui ont façonné les civilisations à travers l'histoire.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {heritageFeatures.map((feature, index) => {
          const Icon = feature.icon;
          const colors = getColorClasses(feature.color);
          
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 ${colors.bg} ${colors.text} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-8 h-8" />
                </div>
                
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-slate-600 text-sm mb-3">
                  {feature.description}
                </p>
                
                <div className={`inline-block px-3 py-1 ${colors.bg} ${colors.text} rounded-full text-xs font-medium`}>
                  {feature.count}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Timeline Interactive Preview */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">
            Voyagez à travers l'Histoire
          </h3>
          <p className="text-slate-600">
            Timeline interactive des grandes civilisations et de leurs symboles
          </p>
        </div>

        {/* Simple timeline preview */}
        <div className="flex justify-center items-center space-x-8 overflow-x-auto pb-4">
          {[
            { period: "Antiquité", years: "-3000", color: "bg-blue-500" },
            { period: "Moyen Âge", years: "500", color: "bg-emerald-500" },
            { period: "Renaissance", years: "1400", color: "bg-amber-500" },
            { period: "Moderne", years: "1800", color: "bg-purple-500" },
            { period: "Contemporain", years: "2000", color: "bg-rose-500" }
          ].map((era, index) => (
            <div key={index} className="text-center flex-shrink-0">
              <div className={`w-4 h-4 ${era.color} rounded-full mx-auto mb-2`}></div>
              <div className="text-xs font-medium text-slate-700">{era.period}</div>
              <div className="text-xs text-slate-500">{era.years}</div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button 
            onClick={() => navigate('/timeline')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Explorer la Timeline Complète
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeritageSection;
