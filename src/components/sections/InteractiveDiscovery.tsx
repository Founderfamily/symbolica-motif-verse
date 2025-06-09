
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Map, Users, TrendingUp, Heart, Sparkles, Filter, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { I18nText } from '@/components/ui/i18n-text';

const InteractiveDiscovery = () => {
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);

  const discoveryTools = [
    {
      id: 'explore',
      title: 'Explorer les Symboles',
      description: 'Plongez dans notre collection complète avec des filtres avancés',
      icon: Search,
      link: '/symbols',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      features: ['Recherche avancée', 'Filtres par culture', 'Visualisation immersive']
    },
    {
      id: 'map',
      title: 'Carte Interactive',
      description: 'Voyagez à travers les cultures par localisation géographique',
      icon: Map,
      link: '/map',
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      features: ['Navigation géographique', 'Hotspots culturels', 'Timeline historique']
    },
    {
      id: 'collections',
      title: 'Collections Thématiques',
      description: 'Explorez nos collections organisées par thème et époque',
      icon: Heart,
      link: '/collections',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      features: ['Thèmes spécialisés', 'Curation experte', 'Parcours guidés']
    },
    {
      id: 'community',
      title: 'Rejoindre la Communauté',
      description: 'Connectez-vous avec des passionnés et partagez vos découvertes',
      icon: Users,
      link: '/community',
      gradient: 'from-amber-500 to-amber-600',
      bgGradient: 'from-amber-50 to-amber-100',
      features: ['Groupes d\'intérêt', 'Discussions expertes', 'Partage découvertes']
    },
    {
      id: 'contribute',
      title: 'Contribuer',
      description: 'Enrichissez la collection avec vos propres découvertes',
      icon: Sparkles,
      link: '/contributions/new',
      gradient: 'from-rose-500 to-rose-600',
      bgGradient: 'from-rose-50 to-rose-100',
      features: ['Upload simple', 'Validation communautaire', 'Reconnaissance']
    },
    {
      id: 'trending',
      title: 'Tendances',
      description: 'Découvrez les symboles populaires et les dernières découvertes',
      icon: TrendingUp,
      link: '/trending',
      gradient: 'from-indigo-500 to-indigo-600',
      bgGradient: 'from-indigo-50 to-indigo-100',
      features: ['Symboles populaires', 'Nouvelles découvertes', 'Analytics visuels']
    }
  ];

  const stats = [
    { value: '42+', label: 'Symboles', description: 'dans notre collection' },
    { value: '25+', label: 'Cultures', description: 'représentées' },
    { value: '1.2k+', label: 'Contributeurs', description: 'actifs' },
    { value: '15+', label: 'Collections', description: 'thématiques' }
  ];

  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* En-tête de section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <Badge className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200">
            <Globe className="w-4 h-4 mr-2" />
            Exploration Interactive
          </Badge>
        </div>
        
        <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent">
          Votre Porte d'Entrée vers l'Histoire
        </h2>
        
        <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
          Choisissez votre mode d'exploration pour découvrir les symboles qui ont façonné nos civilisations
        </p>

        {/* Statistiques visuelles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-slate-700 mb-1">{stat.label}</div>
              <div className="text-xs text-slate-500">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Grille d'outils interactifs */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {discoveryTools.map((tool) => {
          const Icon = tool.icon;
          const isHovered = hoveredTool === tool.id;
          
          return (
            <Link key={tool.id} to={tool.link}>
              <Card 
                className={`h-full overflow-hidden border-2 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl cursor-pointer ${
                  isHovered ? 'border-slate-300 shadow-2xl' : 'border-slate-200 shadow-lg hover:border-slate-300'
                }`}
                onMouseEnter={() => setHoveredTool(tool.id)}
                onMouseLeave={() => setHoveredTool(null)}
              >
                <div className={`h-32 bg-gradient-to-br ${tool.bgGradient} flex items-center justify-center relative overflow-hidden`}>
                  <div className={`w-16 h-16 bg-gradient-to-br ${tool.gradient} rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 ${
                    isHovered ? 'scale-110 rotate-3' : ''
                  }`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Effet de brillance au hover */}
                  {isHovered && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full animate-slide-in-right"></div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{tool.title}</h3>
                  <p className="text-slate-600 mb-4 leading-relaxed">{tool.description}</p>
                  
                  {/* Features list with animation */}
                  <div className={`space-y-2 transition-all duration-300 ${
                    isHovered ? 'opacity-100 transform translate-y-0' : 'opacity-70 transform translate-y-1'
                  }`}>
                    {tool.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-slate-500">
                        <div className={`w-2 h-2 bg-gradient-to-r ${tool.gradient} rounded-full mr-2 flex-shrink-0`}></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <div className={`flex items-center text-sm font-medium transition-all duration-300 ${
                      isHovered ? 'text-slate-700 translate-x-1' : 'text-slate-500'
                    }`}>
                      Commencer l'exploration
                      <div className={`ml-2 transition-all duration-300 ${
                        isHovered ? 'translate-x-1' : ''
                      }`}>→</div>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Call to action principal */}
      <div className="text-center bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-3xl p-12 border border-slate-200">
        <h3 className="text-3xl font-bold text-slate-800 mb-4">
          Prêt à commencer votre voyage ?
        </h3>
        <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
          Rejoignez notre communauté de passionnés et contribuez à préserver le patrimoine symbolique mondial
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/symbols">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
              <Search className="mr-2 h-5 w-5" />
              Explorer maintenant
            </Button>
          </Link>
          <Link to="/community">
            <Button variant="outline" size="lg" className="border-2 border-slate-300 hover:bg-slate-50 px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
              <Users className="mr-2 h-5 w-5" />
              Rejoindre la communauté
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDiscovery;
