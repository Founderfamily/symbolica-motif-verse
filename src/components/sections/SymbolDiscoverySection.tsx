
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Heart, Eye, Sparkles, TrendingUp, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { I18nText } from '@/components/ui/i18n-text';
import { SymbolGrid } from '@/components/search/SymbolGrid';
import { SymbolData } from '@/types/supabase';
import { useAllSymbols } from '@/hooks/useSupabaseSymbols';

const SymbolDiscoverySection = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'featured'>('grid');
  const navigate = useNavigate();
  const { data: symbols, isLoading } = useAllSymbols();

  const handleExploreMore = () => {
    navigate('/symbols');
  };

  const filters = [
    { id: 'all', label: 'Tous', icon: Globe },
    { id: 'trending', label: 'Tendances', icon: TrendingUp },
    { id: 'ancient', label: 'Antique', icon: Sparkles },
  ];

  const filteredSymbols = React.useMemo(() => {
    if (!symbols) return [];
    
    let filtered = symbols;
    
    if (selectedFilter === 'trending') {
      // Simuler des symboles tendance (les 6 premiers)
      filtered = symbols.slice(0, 6);
    } else if (selectedFilter === 'ancient') {
      // Filtrer par période ancienne
      filtered = symbols.filter(symbol => 
        symbol.period?.toLowerCase().includes('antique') || 
        symbol.period?.toLowerCase().includes('ancien') ||
        symbol.period?.toLowerCase().includes('ancient')
      );
    }
    
    return filtered.slice(0, viewMode === 'featured' ? 3 : 8);
  }, [symbols, selectedFilter, viewMode]);

  const stats = [
    { value: symbols?.length || 0, label: 'Symboles', icon: Eye },
    { value: '25+', label: 'Cultures', icon: Globe },
    { value: '1.2k', label: 'Membres', icon: Heart },
  ];

  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* En-tête avec statistiques */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <Badge className="px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200">
            <Sparkles className="w-4 h-4 mr-2" />
            <I18nText translationKey="discovery" ns="sections">Découverte</I18nText>
          </Badge>
        </div>
        
        <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent">
          <I18nText translationKey="title" ns="symbolDiscovery">
            Explorez l'Héritage Symbolique Mondial
          </I18nText>
        </h2>
        
        <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
          <I18nText translationKey="description" ns="symbolDiscovery">
            Découvrez des milliers de symboles culturels, leurs significations et leurs évolutions à travers les civilisations
          </I18nText>
        </p>

        {/* Statistiques visuelles */}
        <div className="grid grid-cols-3 gap-6 max-w-md mx-auto mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-4 bg-white/50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-center mb-2">
                <stat.icon className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Contrôles de filtrage */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={selectedFilter === filter.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(filter.id)}
              className={`transition-all duration-200 ${
                selectedFilter === filter.id 
                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg' 
                  : 'hover:bg-amber-50 hover:border-amber-200'
              }`}
            >
              <filter.icon className="w-4 h-4 mr-2" />
              {filter.label}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'featured' : 'grid')}
            className="hover:bg-slate-50"
          >
            <Filter className="w-4 h-4 mr-2" />
            {viewMode === 'grid' ? 'Vue Mise en avant' : 'Vue Grille'}
          </Button>
          
          <Button 
            onClick={handleExploreMore}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Search className="mr-2 h-4 w-4" />
            <I18nText translationKey="exploreAll" ns="symbolDiscovery">Explorer Tout</I18nText>
          </Button>
        </div>
      </div>

      {/* Galerie de symboles avec état de chargement amélioré */}
      <div className="mb-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="aspect-square bg-slate-100 rounded-lg animate-pulse">
                <div className="h-full w-full bg-gradient-to-br from-slate-200 to-slate-100 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : filteredSymbols.length > 0 ? (
          <div className={`transition-all duration-500 ${
            viewMode === 'featured' 
              ? 'grid grid-cols-1 md:grid-cols-3 gap-8' 
              : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
          }`}>
            <SymbolGrid symbols={filteredSymbols} />
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50/50 rounded-xl border border-slate-200">
            <Sparkles className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">Aucun symbole trouvé pour ce filtre</p>
          </div>
        )}
      </div>

      {/* Section d'inspiration avec design amélioré */}
      <div className="bg-gradient-to-br from-slate-50 via-white to-amber-50/30 rounded-3xl p-8 border border-slate-200 shadow-sm">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-slate-800 mb-4 flex items-center justify-center gap-3">
            <Sparkles className="h-8 w-8 text-amber-500" />
            Du Patrimoine aux Créations Modernes
          </h3>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Chaque symbole raconte une histoire millénaire qui continue d'inspirer 
            les créateurs contemporains dans l'art, le design et l'architecture.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="group text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-slate-800 mb-2">Patrimoine Ancestral</h4>
            <p className="text-sm text-slate-600">
              Préservation des techniques et significations originelles transmises à travers les générations
            </p>
          </div>

          <div className="group text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-slate-800 mb-2">Innovation Moderne</h4>
            <p className="text-sm text-slate-600">
              Réinterprétation créative dans les nouveaux médias et technologies numériques
            </p>
          </div>

          <div className="group text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              <Globe className="h-6 w-6 text-amber-600" />
            </div>
            <h4 className="font-semibold text-slate-800 mb-2">Fusion Culturelle</h4>
            <p className="text-sm text-slate-600">
              Synthèse harmonieuse entre traditions locales et influences globales contemporaines
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SymbolDiscoverySection;
