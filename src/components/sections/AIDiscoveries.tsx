
import React from 'react';
import { Sparkles, Brain, Search, Link2 } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { Card, CardContent } from '@/components/ui/card';

const AIDiscoveries = () => {
  const discoveries = [
    {
      icon: Brain,
      title: "Reconnaissance de Motifs",
      description: "L'IA identifie des patterns cachés dans les symboles anciens",
      example: "Connexions entre l'art celtique et les motifs aztèques",
      color: "purple"
    },
    {
      icon: Link2,
      title: "Connexions Inattendues",
      description: "Découverte de liens entre civilisations distantes",
      example: "Symboles similaires en Asie et en Amérique du Sud",
      color: "blue"
    },
    {
      icon: Search,
      title: "Nouveaux Indices",
      description: "Analyse approfondie révèle des détails invisibles",
      example: "Inscriptions cachées dans les ornements médiévaux",
      color: "emerald"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'purple':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'blue':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'emerald':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full text-purple-800 text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4 mr-2" />
          Intelligence Artificielle
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
          L'IA ouvre de nouvelles possibilités
        </h2>
        
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Grâce à l'intelligence artificielle, nous révélons des secrets cachés 
          et découvrons des connexions fascinantes entre les symboles du monde entier.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {discoveries.map((discovery, index) => {
          const Icon = discovery.icon;
          const colorClasses = getColorClasses(discovery.color);
          
          return (
            <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-xl ${colorClasses} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <h3 className="text-xl font-semibold text-slate-800 mb-3">
                  {discovery.title}
                </h3>
                
                <p className="text-slate-600 mb-4 leading-relaxed">
                  {discovery.description}
                </p>
                
                <div className="bg-slate-50 p-3 rounded-lg border-l-4 border-amber-400">
                  <p className="text-sm text-slate-700 font-medium">
                    Exemple : {discovery.example}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-2xl border border-purple-100">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">
            Explorez avec l'IA
          </h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Utilisez nos outils d'analyse assistée par IA pour découvrir 
            des détails que l'œil humain ne peut percevoir.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Essayer l'Analyse IA
            </button>
            <button className="px-6 py-3 border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors">
              Voir les Découvertes
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIDiscoveries;
