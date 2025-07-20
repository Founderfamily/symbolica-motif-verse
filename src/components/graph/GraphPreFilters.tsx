
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Filter, Globe, Clock, Palette, Zap, BarChart3 } from 'lucide-react';

interface GraphPreFiltersProps {
  onApplyFilters: (filters: GraphFilters) => void;
  totalSymbols: number;
  estimatedNodes: number;
  estimatedLinks: number;
}

export interface GraphFilters {
  culturalRegion: string;
  temporalPeriod: string;
  thematicCategory: string;
  maxNodes: number;
  connectionStrength: number;
  mode: 'explorer' | 'thematic' | 'cultural' | 'temporal';
}

const GraphPreFilters: React.FC<GraphPreFiltersProps> = ({
  onApplyFilters,
  totalSymbols,
  estimatedNodes,
  estimatedLinks
}) => {
  const [filters, setFilters] = React.useState<GraphFilters>({
    culturalRegion: 'all',
    temporalPeriod: 'all',
    thematicCategory: 'all',
    maxNodes: 100,
    connectionStrength: 2,
    mode: 'explorer'
  });

  const culturalRegions = [
    { value: 'all', label: 'Toutes les régions', count: totalSymbols },
    { value: 'EUR', label: 'Europe', count: Math.floor(totalSymbols * 0.35) },
    { value: 'ASI', label: 'Asie', count: Math.floor(totalSymbols * 0.30) },
    { value: 'AFR', label: 'Afrique', count: Math.floor(totalSymbols * 0.15) },
    { value: 'AME', label: 'Amérique', count: Math.floor(totalSymbols * 0.12) },
    { value: 'OCE', label: 'Océanie', count: Math.floor(totalSymbols * 0.08) }
  ];

  const temporalPeriods = [
    { value: 'all', label: 'Toutes les époques' },
    { value: 'PRE', label: 'Préhistoire' },
    { value: 'ANT', label: 'Antiquité' },
    { value: 'MED', label: 'Moyen Âge' },
    { value: 'MOD', label: 'Époque moderne' },
    { value: 'CON', label: 'Contemporain' }
  ];

  const thematicCategories = [
    { value: 'all', label: 'Tous les thèmes' },
    { value: 'REL', label: 'Religieux/Spirituel', icon: '🙏' },
    { value: 'SCI-GEO', label: 'Géométrique/Scientifique', icon: '📐' },
    { value: 'SOC', label: 'Social/Politique', icon: '🏛️' },
    { value: 'NAT', label: 'Nature/Cosmique', icon: '🌟' }
  ];

  const explorationModes = [
    { 
      value: 'explorer', 
      label: 'Explorateur', 
      description: 'Commencer par 1 symbole + connexions directes',
      icon: <Zap className="h-4 w-4" />
    },
    { 
      value: 'thematic', 
      label: 'Thématique', 
      description: 'Explorer par classification thématique',
      icon: <Palette className="h-4 w-4" />
    },
    { 
      value: 'cultural', 
      label: 'Culturel', 
      description: 'Découvrir par région culturelle',
      icon: <Globe className="h-4 w-4" />
    },
    { 
      value: 'temporal', 
      label: 'Temporel', 
      description: 'Voyager à travers les époques',
      icon: <Clock className="h-4 w-4" />
    }
  ];

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const updateFilter = (key: keyof GraphFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Mode d'exploration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Mode d'Exploration
          </CardTitle>
          <CardDescription>
            Choisissez comment vous voulez explorer le graphe sémantique
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {explorationModes.map(mode => (
              <Button
                key={mode.value}
                variant={filters.mode === mode.value ? 'default' : 'outline'}
                className="h-auto p-4 flex flex-col items-start gap-2"
                onClick={() => updateFilter('mode', mode.value)}
              >
                <div className="flex items-center gap-2">
                  {mode.icon}
                  <span className="font-medium">{mode.label}</span>
                </div>
                <span className="text-xs text-muted-foreground text-left">
                  {mode.description}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filtres spécifiques */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Région culturelle */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Région Culturelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={filters.culturalRegion} onValueChange={(value) => updateFilter('culturalRegion', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {culturalRegions.map(region => (
                  <SelectItem key={region.value} value={region.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{region.label}</span>
                      <Badge variant="secondary" className="ml-2">
                        {region.count}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Période temporelle */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Période Temporelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={filters.temporalPeriod} onValueChange={(value) => updateFilter('temporalPeriod', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {temporalPeriods.map(period => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Catégorie thématique */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Catégorie Thématique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {thematicCategories.map(category => (
              <Button
                key={category.value}
                variant={filters.thematicCategory === category.value ? 'default' : 'outline'}
                size="sm"
                className="h-auto p-3 flex flex-col items-center gap-1"
                onClick={() => updateFilter('thematicCategory', category.value)}
              >
                {category.icon && <span className="text-lg">{category.icon}</span>}
                <span className="text-xs text-center">{category.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Paramètres avancés */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Paramètres de Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Nombre maximum de nœuds : {filters.maxNodes}
            </label>
            <Slider
              value={[filters.maxNodes]}
              onValueChange={(value) => updateFilter('maxNodes', value[0])}
              max={300}
              min={20}
              step={10}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground mt-1">
              Recommandé : 50-150 nœuds pour une visualisation optimale
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Force des connexions : {filters.connectionStrength}
            </label>
            <Slider
              value={[filters.connectionStrength]}
              onValueChange={(value) => updateFilter('connectionStrength', value[0])}
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground mt-1">
              Plus élevé = connexions plus fortes uniquement
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aperçu et application */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-800 mb-1">
                Aperçu de la visualisation
              </div>
              <div className="text-xs text-gray-600">
                Environ {estimatedNodes} nœuds • {estimatedLinks} connexions
              </div>
            </div>
            <Button onClick={handleApply} size="lg" className="min-w-32">
              Générer le Graphe
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GraphPreFilters;
