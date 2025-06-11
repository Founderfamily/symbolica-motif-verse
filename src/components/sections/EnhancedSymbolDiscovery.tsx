
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MapPin, Calendar, Palette, ChevronRight, Globe, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlatformStats } from '@/hooks/usePlatformStats';

interface SymbolCategory {
  id: string;
  name: string;
  culture: string;
  period: string;
  description: string;
  symbolCount: number;
  icon: React.ElementType;
  gradient: string;
  borderColor: string;
}

const EnhancedSymbolDiscovery: React.FC = () => {
  const navigate = useNavigate();
  const { data: platformStats } = usePlatformStats();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const symbolCategories: SymbolCategory[] = [
    {
      id: 'geometric',
      name: 'Motifs Géométriques',
      culture: 'Universel',
      period: 'Antiquité - Moderne',
      description: 'Formes pures et symétries sacrées présentes dans toutes les civilisations',
      symbolCount: 342,
      icon: Compass,
      gradient: 'from-blue-50 via-blue-100 to-blue-200',
      borderColor: 'border-blue-300'
    },
    {
      id: 'nature',
      name: 'Symboles Naturels',
      culture: 'Mondial',
      period: 'Préhistoire - Contemporain',
      description: 'Éléments de la nature transformés en symboles spirituels et culturels',
      symbolCount: 487,
      icon: Palette,
      gradient: 'from-emerald-50 via-emerald-100 to-emerald-200',
      borderColor: 'border-emerald-300'
    },
    {
      id: 'architectural',
      name: 'Ornements Architecturaux',
      culture: 'Civilisations Urbaines',
      period: 'Antiquité - Art Déco',
      description: 'Décors sculptés et gravés ornant temples, palais et édifices sacrés',
      symbolCount: 156,
      icon: MapPin,
      gradient: 'from-amber-50 via-amber-100 to-amber-200',
      borderColor: 'border-amber-300'
    },
    {
      id: 'spiritual',
      name: 'Symboles Spirituels',
      culture: 'Toutes Traditions',
      period: 'Origines - Présent',
      description: 'Représentations du sacré et chemins vers la transcendance',
      symbolCount: 289,
      icon: Globe,
      gradient: 'from-purple-50 via-purple-100 to-purple-200',
      borderColor: 'border-purple-300'
    }
  ];

  const filters = [
    { id: 'all', label: 'Tous', count: platformStats?.totalSymbols || 1274 },
    { id: 'recent', label: 'Récents', count: 23 },
    { id: 'popular', label: 'Populaires', count: 89 },
    { id: 'verified', label: 'Vérifiés', count: 756 }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête avec animation */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Globe className="h-4 w-4" />
            <span>Musée Symbolica</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Explorez l'Héritage
            <span className="block bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
              Symbolique Mondial
            </span>
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Découvrez des milliers de symboles authentiques, leurs significations profondes 
            et les connexions fascinantes qui unissent les cultures à travers l'histoire.
          </p>

          {/* Statistiques en temps réel */}
          <div className="flex justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">
                {platformStats?.totalSymbols?.toLocaleString() || '1,274'}
              </div>
              <div className="text-sm text-slate-600">Symboles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">
                {platformStats?.totalCultures || 47}
              </div>
              <div className="text-sm text-slate-600">Cultures</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">
                {platformStats?.totalContributions?.toLocaleString() || '2,340'}
              </div>
              <div className="text-sm text-slate-600">Contributions</div>
            </div>
          </div>
        </div>

        {/* Filtres interactifs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={selectedFilter === filter.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(filter.id)}
              className={`
                transition-all duration-200 
                ${selectedFilter === filter.id 
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg' 
                  : 'hover:border-amber-300 hover:bg-amber-50'
                }
              `}
            >
              <Filter className="h-3 w-3 mr-1" />
              {filter.label}
              <Badge variant="secondary" className="ml-2 text-xs">
                {filter.count.toLocaleString()}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Grille de catégories avec animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {symbolCategories.map((category) => (
            <Card 
              key={category.id}
              className={`
                group cursor-pointer transition-all duration-300 overflow-hidden
                bg-gradient-to-br ${category.gradient} 
                border-2 ${category.borderColor}
                hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1
                ${hoveredCard === category.id ? 'shadow-2xl scale-[1.02] -translate-y-1' : ''}
              `}
              onMouseEnter={() => setHoveredCard(category.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => navigate('/symbols')}
            >
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`
                      p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50
                      group-hover:scale-110 group-hover:rotate-3 transition-all duration-300
                    `}>
                      <category.icon className="h-8 w-8 text-slate-700" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1">
                        {category.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="h-3 w-3" />
                        <span>{category.culture}</span>
                        <span>•</span>
                        <Calendar className="h-3 w-3" />
                        <span>{category.period}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">
                      {category.symbolCount.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-600">symboles</div>
                  </div>
                </div>

                <p className="text-slate-700 leading-relaxed mb-6">
                  {category.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <Search className="h-3 w-3 mr-1" />
                      Explorable
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Authentifié
                    </Badge>
                  </div>
                  
                  <ChevronRight className={`
                    h-5 w-5 text-slate-400 
                    group-hover:text-slate-600 group-hover:translate-x-1 
                    transition-all duration-200
                  `} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA amélioré */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-2xl p-8 text-white relative overflow-hidden">
            {/* Éléments décoratifs */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">
                Prêt à commencer votre exploration ?
              </h3>
              <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
                Rejoignez des milliers d'explorateurs qui découvrent chaque jour 
                les secrets du patrimoine symbolique mondial.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate('/symbols')}
                  className="bg-white text-amber-700 hover:bg-amber-50 font-semibold px-8"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Explorer les Symboles
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/map')}
                  className="border-white text-white hover:bg-white/10 font-semibold px-8"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Carte Interactive
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedSymbolDiscovery;
