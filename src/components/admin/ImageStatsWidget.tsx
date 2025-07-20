
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Camera, Image, AlertTriangle, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ImageStatsData {
  totalSymbols: number;
  symbolsWithImages: number;
  symbolsWithoutImages: number;
  imagesBySource: {
    supabase: number;
    local: number;
    placeholder: number;
  };
  missingByPriority: Array<{
    name: string;
    culture: string;
    priority: 'high' | 'medium' | 'low';
    reason: string;
  }>;
}

// Données simulées pour l'exemple
const mockStats: ImageStatsData = {
  totalSymbols: 132,
  symbolsWithImages: 89,
  symbolsWithoutImages: 43,
  imagesBySource: {
    supabase: 45,
    local: 44,
    placeholder: 43
  },
  missingByPriority: [
    { name: 'Ankh Égyptien', culture: 'Égyptienne', priority: 'high', reason: 'Symbole populaire' },
    { name: 'Rune Algiz', culture: 'Nordique', priority: 'high', reason: 'Demande fréquente' },
    { name: 'Mudra Bouddhiste', culture: 'Indienne', priority: 'medium', reason: 'Collection incomplète' },
    { name: 'Calligraphie Chinoise', culture: 'Chinoise', priority: 'medium', reason: 'Diversité culturelle' },
    { name: 'Motif Maori', culture: 'Polynésienne', priority: 'low', reason: 'Rare mais authentique' }
  ]
};

export const ImageStatsWidget: React.FC = () => {
  const { isAdmin } = useAuth();

  // Ne rien afficher si l'utilisateur n'est pas admin
  if (!isAdmin) {
    return null;
  }

  const coveragePercentage = Math.round((mockStats.symbolsWithImages / mockStats.totalSymbols) * 100);
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔥';
      case 'medium': return '⚡';
      case 'low': return '💫';
      default: return '📝';
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-900">Couverture Images</h3>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          Admin Only
        </Badge>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-white/60 rounded-lg border border-blue-100">
          <div className="text-2xl font-bold text-green-600">{mockStats.symbolsWithImages}</div>
          <div className="text-sm text-green-700">Avec images</div>
        </div>
        <div className="text-center p-4 bg-white/60 rounded-lg border border-blue-100">
          <div className="text-2xl font-bold text-orange-600">{mockStats.symbolsWithoutImages}</div>
          <div className="text-sm text-orange-700">Sans images</div>
        </div>
        <div className="text-center p-4 bg-white/60 rounded-lg border border-blue-100">
          <div className="text-2xl font-bold text-blue-600">{coveragePercentage}%</div>
          <div className="text-sm text-blue-700">Couverture</div>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-blue-800">Progression globale</span>
          <span className="text-sm text-blue-600">{coveragePercentage}%</span>
        </div>
        <Progress value={coveragePercentage} className="h-3 bg-blue-100" />
      </div>

      {/* Répartition par source */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Image className="w-4 h-4" />
          Sources d'images
        </h4>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-green-50 rounded border border-green-200">
            <div className="text-lg font-bold text-green-600">{mockStats.imagesBySource.supabase}</div>
            <div className="text-xs text-green-700">Supabase</div>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded border border-blue-200">
            <div className="text-lg font-bold text-blue-600">{mockStats.imagesBySource.local}</div>
            <div className="text-xs text-blue-700">Locales</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded border border-gray-200">
            <div className="text-lg font-bold text-gray-600">{mockStats.imagesBySource.placeholder}</div>
            <div className="text-xs text-gray-700">Placeholder</div>
          </div>
        </div>
      </div>

      {/* Symboles prioritaires manquants */}
      <div>
        <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Images prioritaires manquantes
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {mockStats.missingByPriority.map((symbol, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/60 rounded border border-blue-100 hover:bg-white/80 transition-colors">
              <div className="flex-1">
                <div className="font-medium text-blue-900 text-sm">{symbol.name}</div>
                <div className="text-xs text-blue-600">{symbol.culture} • {symbol.reason}</div>
              </div>
              <Badge className={`text-xs border ${getPriorityColor(symbol.priority)}`}>
                {getPriorityIcon(symbol.priority)} {symbol.priority}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Action suggérée */}
      <div className="mt-4 p-3 bg-blue-100 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 text-blue-800">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">Suggestion d'amélioration</span>
        </div>
        <p className="text-xs text-blue-700 mt-1">
          Concentrez-vous sur les symboles haute priorité pour améliorer rapidement l'expérience utilisateur.
        </p>
      </div>
    </Card>
  );
};
