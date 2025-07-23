
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trophy, 
  Users, 
  Clock, 
  Star, 
  MapPin, 
  Award,
  Sword,
  Scroll,
  Crown,
  Search,
  Filter,
  Plus,
  History,
  Globe,
  BookOpen,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  Camera,
  Brain,
  Archive,
  Loader2,
  RefreshCw,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useQuests } from '@/hooks/useQuests';
import { useEnhancedQuests } from '@/hooks/useEnhancedQuests';
import { historicalQuestService } from '@/services/historicalQuestService';
import { TreasureQuest } from '@/types/quests';
import { getQuestTypeLabel, getDifficultyLabel } from '@/utils/questUtils';
import EnhancedQuestFilters from '@/components/quests/EnhancedQuestFilters';
import EnhancedQuestCard from '@/components/quests/EnhancedQuestCard';
import ClueSubmissionDialog from '@/components/quests/ClueSubmissionDialog';
import QuestJoinDialog from '@/components/quests/QuestJoinDialog';

const QuestsPage = () => {
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [filterCity, setFilterCity] = useState<string>('all');
  const [filterZone, setFilterZone] = useState<string>('all');

  // États pour les actions
  const [isPopulating, setIsPopulating] = useState(false);
  const [isForceReloading, setIsForceReloading] = useState(false);
  const [populationResult, setPopulationResult] = useState<{success: boolean, message: string} | null>(null);

  // Hook pour les quêtes enrichies avec filtrage
  const { 
    quests: filteredQuests, 
    isLoading, 
    error, 
    refetch, 
    stats, 
    totalQuests,
    activeQuests
  } = useEnhancedQuests({
    searchTerm,
    filterType,
    filterDifficulty,
    filterCountry,
    filterRegion,
    filterCity,
    filterZone
  });

  // Debug: Afficher les informations de débogage
  useEffect(() => {
    console.log('🔍 QuestsPage - Debug Info:');
    console.log('- Total quests loaded:', totalQuests);
    console.log('- Active quests:', activeQuests.length);
    console.log('- Filtered quests:', filteredQuests.length);
    console.log('- Loading state:', isLoading);
    console.log('- Error state:', error);
    console.log('- Quest stats:', stats);
  }, [filteredQuests, activeQuests, isLoading, error, stats, totalQuests]);

  const handlePopulateQuests = async (forceReload: boolean = false) => {
    console.log(`🚀 ${forceReload ? 'Force reloading' : 'Loading'} quests...`);
    if (forceReload) {
      setIsForceReloading(true);
    } else {
      setIsPopulating(true);
    }
    setPopulationResult(null);
    
    try {
      const result = await historicalQuestService.populateHistoricalQuests(forceReload);
      console.log('📊 Population result:', result);
      
      setPopulationResult({
        success: result.success,
        message: result.message
      });
      
      if (result.success) {
        console.log('✅ Quests loaded successfully, refreshing list...');
        await refetch();
      }
    } catch (error) {
      console.error('💥 Error loading quests:', error);
      setPopulationResult({
        success: false,
        message: 'Erreur lors du chargement: ' + (error instanceof Error ? error.message : 'Erreur inconnue')
      });
    } finally {
      setIsPopulating(false);
      setIsForceReloading(false);
    }
  };

  const handleRefreshQuests = async () => {
    console.log('🔄 Refreshing quests list...');
    await refetch();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Erreur de chargement</h1>
            <p className="text-slate-600 mb-4">
              Impossible de charger la liste des quêtes.
            </p>
            <p className="text-sm text-slate-500 mb-6">
              {error instanceof Error ? error.message : 'Erreur inconnue'}
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Réessayer
              </Button>
              <Button onClick={() => handlePopulateQuests()} disabled={isPopulating}>
                <BookOpen className="w-4 h-4 mr-2" />
                {isPopulating ? 'Chargement...' : 'Charger Mystères'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Badge className="px-4 py-2 bg-gradient-to-r from-amber-100 to-stone-100 text-amber-800 border-amber-200">
              <History className="w-4 h-4 mr-2" />
              Recherche Collaborative
            </Badge>
          </div>
          
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-stone-800 to-amber-700 bg-clip-text text-transparent">
            Chasse aux Trésors Perdus
          </h1>
          
          <p className="text-stone-600 max-w-2xl mx-auto mb-4 text-sm">
            Rejoignez une communauté mondiale de chercheurs pour résoudre les plus grands mystères de l'histoire. 
            Contribuez avec des preuves, des indices, des théories et des liens d'archives pour découvrir ensemble des trésors perdus.
          </p>

          {/* Statistiques compactes avec données réelles */}
          <div className="grid grid-cols-4 gap-3 max-w-2xl mx-auto mb-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-amber-200/50 shadow-sm">
              <div className="text-xl font-bold text-amber-700 mb-1">{stats.active}</div>
              <div className="text-stone-600 text-xs">Recherches Actives</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-amber-200/50 shadow-sm">
              <div className="text-xl font-bold text-amber-800 mb-1">{stats.total}</div>
              <div className="text-stone-600 text-xs">Total des Quêtes</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-amber-200/50 shadow-sm">
              <div className="text-xl font-bold text-stone-700 mb-1">{Object.keys(stats.byRegion).length}</div>
              <div className="text-stone-600 text-xs">Régions Explorées</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-amber-200/50 shadow-sm">
              <div className="text-xl font-bold text-stone-800 mb-1">{Object.keys(stats.byCities).length}</div>
              <div className="text-stone-600 text-xs">Villes Couvertes</div>
            </div>
          </div>
        </div>

        {/* Filtres de recherche avancés */}
        <EnhancedQuestFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterType={filterType}
          setFilterType={setFilterType}
          filterDifficulty={filterDifficulty}
          setFilterDifficulty={setFilterDifficulty}
          filterCountry={filterCountry}
          setFilterCountry={setFilterCountry}
          filterRegion={filterRegion}
          setFilterRegion={setFilterRegion}
          filterCity={filterCity}
          setFilterCity={setFilterCity}
          filterZone={filterZone}
          setFilterZone={setFilterZone}
          onRefresh={handleRefreshQuests}
          onPopulateQuests={handlePopulateQuests}
          isPopulating={isPopulating}
          isForceReloading={isForceReloading}
          populationResult={populationResult}
          questCount={stats.total}
          activeQuestCount={stats.active}
        />

        {/* État de chargement */}
        {isLoading && (
          <div className="text-center py-16">
            <Loader2 className="w-12 h-12 animate-spin text-amber-600 mx-auto mb-4" />
            <p className="text-slate-600 text-lg">Chargement des recherches...</p>
          </div>
        )}

        {/* Affichage des quêtes avec cards améliorées */}
        {!isLoading && filteredQuests.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <Globe className="w-8 h-8 text-amber-600 mr-3" />
                <h2 className="text-3xl font-bold text-stone-800">
                  Mystères Disponibles ({filteredQuests.length})
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <Badge className="bg-amber-100 text-amber-800 border-amber-200 px-4 py-2">
                  {stats.active} Actives
                </Badge>
                {/* Statistiques par régions si filtre appliqué */}
                {Object.keys(stats.byRegion).length > 0 && (
                  <div className="flex gap-2">
                    {Object.entries(stats.byRegion).slice(0, 3).map(([region, count]) => (
                      <Badge key={region} variant="secondary" className="bg-blue-50 text-blue-700">
                        📍 {region} ({count})
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredQuests.map((quest) => (
                <EnhancedQuestCard key={quest.id} quest={quest} />
              ))}
            </div>
          </div>
        )}

        {/* État vide amélioré */}
        {!isLoading && filteredQuests.length === 0 && (
          <div className="text-center py-16">
            <History className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">
              {totalQuests === 0 ? 'Aucune quête chargée' : 'Aucune recherche trouvée'}
            </h3>
            <p className="text-slate-500 mb-6">
              {totalQuests === 0 
                ? 'Chargez les mystères historiques pour commencer votre exploration.' 
                : 'Essayez de modifier vos filtres pour voir plus de résultats.'}
            </p>
            
            {/* Suggestions de filtres alternatives */}
            {totalQuests > 0 && (
              <div className="mb-6">
                <p className="text-sm text-slate-400 mb-3">Essayez ces recherches populaires :</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {Object.entries(stats.byRegion).slice(0, 3).map(([region, count]) => (
                    <Button
                      key={region}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFilterRegion(region);
                        setSearchTerm('');
                      }}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      📍 {region} ({count})
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => handlePopulateQuests(false)}
                disabled={isPopulating}
                className="bg-stone-700 hover:bg-stone-800 text-white"
              >
                {isPopulating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Chargement...
                  </>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Charger les Mystères Historiques
                  </>
                )}
              </Button>
              {totalQuests > 0 && (
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setFilterType('all');
                    setFilterDifficulty('all');
                    setFilterCountry('all');
                    setFilterRegion('all');
                    setFilterCity('all');
                    setFilterZone('all');
                  }}
                  variant="outline"
                >
                  Réinitialiser les filtres
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestsPage;
