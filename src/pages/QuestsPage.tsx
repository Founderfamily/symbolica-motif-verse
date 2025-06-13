
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
  Archive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useQuests, useActiveQuests } from '@/hooks/useQuests';
import { historicalQuestService } from '@/services/historicalQuestService';
import { TreasureQuest } from '@/types/quests';

const QuestsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [isPopulating, setIsPopulating] = useState(false);
  const [populationResult, setPopulationResult] = useState<{success: boolean, message: string} | null>(null);
  
  const { data: allQuests, isLoading, refetch, error } = useQuests();
  const { data: activeQuests } = useActiveQuests();

  // Logs de debug
  console.log('QuestsPage - All quests:', allQuests);
  console.log('QuestsPage - Loading state:', isLoading);
  console.log('QuestsPage - Error state:', error);

  const questTypeIcons = {
    templar: Sword,
    lost_civilization: Scroll,
    grail: Crown,
    custom: Trophy
  };

  const questTypeLabels = {
    templar: 'Templiers',
    lost_civilization: 'Civilisation Perdue',
    graal: 'Quête du Graal',
    custom: 'Personnalisée'
  };

  // Unified color palette using amber/stone tones
  const difficultyColors = {
    beginner: 'bg-amber-50 text-amber-800 border-amber-200',
    intermediate: 'bg-amber-100 text-amber-900 border-amber-300',
    expert: 'bg-stone-100 text-stone-800 border-stone-300',
    master: 'bg-stone-200 text-stone-900 border-stone-400'
  };

  const difficultyLabels = {
    beginner: 'Accessible',
    intermediate: 'Intermédiaire',
    expert: 'Avancé',
    master: 'Expert'
  };

  const handlePopulateQuests = async () => {
    setIsPopulating(true);
    setPopulationResult(null);
    
    try {
      console.log('Starting quest population...');
      const result = await historicalQuestService.populateHistoricalQuests();
      console.log('Population result:', result);
      
      setPopulationResult({
        success: result.success,
        message: result.message
      });
      
      if (result.success) {
        console.log('Quests populated successfully, refreshing list...');
        await refetch();
      }
    } catch (error) {
      console.error('Error populating quests:', error);
      setPopulationResult({
        success: false,
        message: 'Erreur lors du chargement: ' + (error instanceof Error ? error.message : 'Erreur inconnue')
      });
    } finally {
      setIsPopulating(false);
    }
  };

  const filteredQuests = allQuests?.filter(quest => {
    const matchesSearch = quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quest.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || quest.quest_type === filterType;
    const matchesDifficulty = filterDifficulty === 'all' || quest.difficulty_level === filterDifficulty;
    
    return matchesSearch && matchesType && matchesDifficulty;
  });

  // Separate historical quests from custom ones
  const historicalQuests = filteredQuests?.filter(quest => 
    ['templar', 'lost_civilization', 'grail'].includes(quest.quest_type)
  ) || [];
  
  const customQuests = filteredQuests?.filter(quest => 
    quest.quest_type === 'custom'
  ) || [];

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
            <Button onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement des recherches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Badge className="px-6 py-3 bg-gradient-to-r from-amber-100 to-stone-100 text-amber-800 border-amber-200 text-lg">
              <History className="w-5 h-5 mr-2" />
              Recherche Collaborative
            </Badge>
          </div>
          
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-stone-800 to-amber-700 bg-clip-text text-transparent">
            Chasse aux Trésors Perdus
          </h1>
          
          <p className="text-xl text-stone-600 max-w-3xl mx-auto mb-8">
            Rejoignez une communauté mondiale de chercheurs pour résoudre les plus grands mystères de l'histoire. 
            Contribuez avec des preuves, des indices, des théories et des liens d'archives pour découvrir ensemble des trésors perdus.
          </p>

          {/* Statistiques unifiées avec palette cohérente */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 shadow-lg">
              <div className="text-3xl font-bold text-amber-700 mb-2">{activeQuests?.length || 0}</div>
              <div className="text-stone-600">Recherches Actives</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 shadow-lg">
              <div className="text-3xl font-bold text-amber-800 mb-2">2,847</div>
              <div className="text-stone-600">Preuves Soumises</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 shadow-lg">
              <div className="text-3xl font-bold text-stone-700 mb-2">1,293</div>
              <div className="text-stone-600">Contributeurs Actifs</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 shadow-lg">
              <div className="text-3xl font-bold text-stone-800 mb-2">156</div>
              <div className="text-stone-600">Pistes Découvertes</div>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-amber-200/50 shadow-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Rechercher un mystère..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="all">Tous les types</option>
              <option value="templar">Templiers</option>
              <option value="lost_civilization">Civilisation Perdue</option>
              <option value="grail">Quête du Graal</option>
              <option value="custom">Personnalisée</option>
            </select>
            
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="all">Toutes difficultés</option>
              <option value="beginner">Accessible</option>
              <option value="intermediate">Intermédiaire</option>
              <option value="expert">Avancé</option>
              <option value="master">Expert</option>
            </select>
            
            <Button 
              onClick={handlePopulateQuests}
              disabled={isPopulating}
              className="bg-stone-700 hover:bg-stone-800 text-white"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              {isPopulating ? 'Chargement...' : 'Charger Mystères'}
            </Button>
            
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Proposer une Recherche
            </Button>
          </div>
          
          {/* Résultat de population */}
          {populationResult && (
            <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
              populationResult.success 
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {populationResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <p className="font-medium">
                {populationResult.message}
              </p>
            </div>
          )}
        </div>

        {/* Section des mystères historiques */}
        {historicalQuests.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-8">
              <Globe className="w-8 h-8 text-amber-600 mr-3" />
              <h2 className="text-3xl font-bold text-stone-800">Mystères Historiques Authentiques</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {historicalQuests.map((quest) => {
                const TypeIcon = questTypeIcons[quest.quest_type];
                
                console.log('QuestsPage - Rendering quest card:', quest.title, 'with ID:', quest.id);
                
                return (
                  <Card key={quest.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white/95 backdrop-blur-sm border border-amber-200/50">
                    
                    <div className="relative">
                      {/* Simplified card header with unified amber/stone gradient */}
                      <div className="p-6 bg-gradient-to-br from-amber-100 to-stone-100 border-b border-amber-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-stone-800 text-amber-100 rounded-lg flex items-center justify-center">
                            <TypeIcon className="w-6 h-6" />
                          </div>
                          <Badge className={`${difficultyColors[quest.difficulty_level]} border-0`}>
                            {difficultyLabels[quest.difficulty_level]}
                          </Badge>
                        </div>
                        
                        <h3 className="text-2xl font-bold mb-2 text-stone-800">{quest.title}</h3>
                        <p className="text-stone-600 text-sm">{questTypeLabels[quest.quest_type]}</p>
                        
                        {/* Historical authenticity badge */}
                        <div className="mt-3">
                          <Badge variant="secondary" className="bg-amber-50 text-amber-800 border-amber-300">
                            <History className="w-3 h-3 mr-1" />
                            Basé sur l'Histoire
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="absolute top-4 right-4">
                        <Badge variant={quest.status === 'active' ? 'default' : 'secondary'} className="bg-stone-800 text-amber-100">
                          {quest.status === 'active' ? 'Active' : 
                           quest.status === 'upcoming' ? 'À venir' : 
                           quest.status === 'completed' ? 'Résolue' : 'En pause'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <p className="text-stone-600 mb-4 line-clamp-3">
                        {quest.description}
                      </p>
                      
                      {/* Story background preview */}
                      {quest.story_background && (
                        <div className="bg-amber-50 rounded-lg p-3 mb-4 border-l-4 border-amber-400">
                          <p className="text-amber-800 text-sm line-clamp-2">
                            {quest.story_background}
                          </p>
                        </div>
                      )}
                      
                      {/* Métriques de contribution avec couleurs unifiées */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center text-sm text-stone-600">
                          <FileText className="w-4 h-4 mr-2 text-amber-600" />
                          {quest.clues?.length || 0} indices
                        </div>
                        <div className="flex items-center text-sm text-stone-600">
                          <Camera className="w-4 h-4 mr-2 text-amber-700" />
                          24 preuves
                        </div>
                        <div className="flex items-center text-sm text-stone-600">
                          <Brain className="w-4 h-4 mr-2 text-stone-700" />
                          8 théories
                        </div>
                        <div className="flex items-center text-sm text-stone-600">
                          <Archive className="w-4 h-4 mr-2 text-stone-600" />
                          15 archives
                        </div>
                      </div>
                      
                      {/* Actions de contribution */}
                      <div className="flex gap-3">
                        <Link to={`/quests/${quest.id}`} className="flex-1">
                          <Button 
                            variant="outline" 
                            className="w-full border-2 border-amber-300 text-amber-700 hover:bg-amber-50"
                            onClick={() => console.log('QuestsPage - Explorer clicked for quest:', quest.id)}
                          >
                            <Search className="w-4 h-4 mr-2" />
                            Explorer
                          </Button>
                        </Link>
                        
                        <Button 
                          className="flex-1 bg-stone-800 hover:bg-stone-900 text-amber-100"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Contribuer
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Section des recherches personnalisées */}
        {customQuests.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-8">
              <Trophy className="w-8 h-8 text-stone-600 mr-3" />
              <h2 className="text-3xl font-bold text-stone-800">Recherches Communautaires</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {customQuests?.map((quest) => {
                const TypeIcon = questTypeIcons[quest.quest_type];
                
                return (
                  <Card key={quest.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white/95 backdrop-blur-sm border border-amber-200/50">
                    <div className="relative">
                      <div className="p-6 bg-gradient-to-br from-stone-100 to-amber-50 border-b border-stone-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-stone-700 text-amber-100 rounded-lg flex items-center justify-center">
                            <TypeIcon className="w-6 h-6" />
                          </div>
                          <Badge className={`${difficultyColors[quest.difficulty_level]} border-0`}>
                            {difficultyLabels[quest.difficulty_level]}
                          </Badge>
                        </div>
                        
                        <h3 className="text-2xl font-bold mb-2 text-stone-800">{quest.title}</h3>
                        <p className="text-stone-600 text-sm">{questTypeLabels[quest.quest_type]}</p>
                      </div>
                      
                      <div className="absolute top-4 right-4">
                        <Badge variant={quest.status === 'active' ? 'default' : 'secondary'} className="bg-stone-700 text-amber-100">
                          {quest.status === 'active' ? 'Active' : 
                           quest.status === 'upcoming' ? 'À venir' : 
                           quest.status === 'completed' ? 'Résolue' : 'En pause'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <p className="text-stone-600 mb-4 line-clamp-3">
                        {quest.description || quest.story_background}
                      </p>
                      
                      {/* Métriques de contribution avec couleurs unifiées */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center text-sm text-stone-600">
                          <FileText className="w-4 h-4 mr-2 text-amber-600" />
                          {quest.clues?.length || 0} indices
                        </div>
                        <div className="flex items-center text-sm text-stone-600">
                          <Camera className="w-4 h-4 mr-2 text-amber-700" />
                          12 preuves
                        </div>
                        <div className="flex items-center text-sm text-stone-600">
                          <Brain className="w-4 h-4 mr-2 text-stone-700" />
                          3 théories
                        </div>
                        <div className="flex items-center text-sm text-stone-600">
                          <Archive className="w-4 h-4 mr-2 text-stone-600" />
                          7 archives
                        </div>
                      </div>
                      
                      {/* Actions de contribution */}
                      <div className="flex gap-3">
                        <Link to={`/quests/${quest.id}`} className="flex-1">
                          <Button variant="outline" className="w-full border-2 border-amber-300 text-amber-700 hover:bg-amber-50">
                            <Search className="w-4 h-4 mr-2" />
                            Explorer
                          </Button>
                        </Link>
                        
                        <Button 
                          className="flex-1 bg-stone-800 hover:bg-stone-900 text-amber-100"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Contribuer
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {filteredQuests?.length === 0 && (
          <div className="text-center py-16">
            <History className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">Aucune recherche trouvée</h3>
            <p className="text-slate-500 mb-4">Essayez de modifier vos filtres ou chargez les mystères historiques.</p>
            <Button 
              onClick={handlePopulateQuests}
              disabled={isPopulating}
              className="bg-stone-700 hover:bg-stone-800 text-white"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              {isPopulating ? 'Chargement...' : 'Charger les Mystères Historiques'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestsPage;
