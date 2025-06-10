
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
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useQuests, useActiveQuests, useJoinQuest } from '@/hooks/useQuests';
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
  const joinQuestMutation = useJoinQuest();

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

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    expert: 'bg-orange-100 text-orange-800',
    master: 'bg-red-100 text-red-800'
  };

  const difficultyLabels = {
    beginner: 'Débutant',
    intermediate: 'Intermédiaire',
    expert: 'Expert',
    master: 'Maître'
  };

  const handlePopulateQuests = async () => {
    setIsPopulating(true);
    setPopulationResult(null);
    try {
      console.log('Starting quest population...');
      const result = await historicalQuestService.populateHistoricalQuests();
      console.log('Population result:', result);
      
      setPopulationResult(result);
      
      if (result.success) {
        console.log('Quests populated successfully, refreshing list...');
        await refetch(); // Refresh the quests list
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

  const handleJoinQuest = async (questId: string) => {
    try {
      console.log('Attempting to join quest:', questId);
      await joinQuestMutation.mutateAsync({ questId });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
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
    ['templar', 'lost_civilization', 'graal'].includes(quest.quest_type)
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
          <p className="text-slate-600">Chargement des quêtes...</p>
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
            <Badge className="px-6 py-3 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200 text-lg">
              <History className="w-5 h-5 mr-2" />
              Mystères Historiques
            </Badge>
          </div>
          
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-amber-800 via-orange-600 to-red-700 bg-clip-text text-transparent">
            Quêtes de Trésors Perdus
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Plongez dans l'histoire et résolvez les plus grands mystères de l'humanité. 
            Du trésor des Templiers aux cités perdues, chaque quête est basée sur de véritables énigmes historiques.
          </p>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 shadow-lg">
              <div className="text-3xl font-bold text-amber-600 mb-2">{activeQuests?.length || 0}</div>
              <div className="text-slate-600">Quêtes Actives</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 shadow-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">{historicalQuests.length}</div>
              <div className="text-slate-600">Mystères Historiques</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 shadow-lg">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {allQuests?.reduce((sum, quest) => sum + quest.reward_points, 0) || 0}
              </div>
              <div className="text-slate-600">Points Totaux</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">3000+</div>
              <div className="text-slate-600">Ans d'Histoire</div>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-amber-200/50 shadow-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Rechercher une quête..."
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
              <option value="graal">Quête du Graal</option>
              <option value="custom">Personnalisée</option>
            </select>
            
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="all">Toutes difficultés</option>
              <option value="beginner">Débutant</option>
              <option value="intermediate">Intermédiaire</option>
              <option value="expert">Expert</option>
              <option value="master">Maître</option>
            </select>
            
            <Button 
              onClick={handlePopulateQuests}
              disabled={isPopulating}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              {isPopulating ? 'Chargement...' : 'Charger Mystères'}
            </Button>
            
            <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Créer une Quête
            </Button>
          </div>
          
          {/* Résultat de population */}
          {populationResult && (
            <div className={`mt-4 p-4 rounded-lg ${
              populationResult.success 
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <p className="font-medium">
                {populationResult.success ? '✅ ' : '❌ '}
                {populationResult.message}
              </p>
            </div>
          )}
        </div>

        {/* Section des quêtes historiques */}
        {historicalQuests.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-8">
              <Globe className="w-8 h-8 text-amber-600 mr-3" />
              <h2 className="text-3xl font-bold text-slate-800">Mystères Historiques Authentiques</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {historicalQuests.map((quest) => {
                const TypeIcon = questTypeIcons[quest.quest_type];
                
                return (
                  <Card key={quest.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white/95 backdrop-blur-sm border border-amber-200/50">
                    
                    <div className="relative">
                      <div className={`p-6 bg-gradient-to-br ${
                        quest.quest_type === 'templar' ? 'from-red-500 to-red-700' :
                        quest.quest_type === 'graal' ? 'from-purple-500 to-purple-700' :
                        quest.quest_type === 'lost_civilization' ? 'from-blue-500 to-blue-700' :
                        'from-amber-500 to-amber-700'
                      } text-white`}>
                        <div className="flex items-center justify-between mb-4">
                          <TypeIcon className="w-8 h-8" />
                          <Badge className={`${difficultyColors[quest.difficulty_level]} border-0`}>
                            {difficultyLabels[quest.difficulty_level]}
                          </Badge>
                        </div>
                        
                        <h3 className="text-2xl font-bold mb-2">{quest.title}</h3>
                        <p className="text-white/90 text-sm">{questTypeLabels[quest.quest_type]}</p>
                        
                        {/* Historical authenticity badge */}
                        <div className="mt-3">
                          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                            <History className="w-3 h-3 mr-1" />
                            Basé sur l'Histoire
                          </Badge>
                        </div>
                        
                        {/* Debug: Affichage de l'ID */}
                        <div className="mt-2">
                          <Badge variant="secondary" className="bg-black/20 text-white/70 border-white/20 text-xs">
                            ID: {quest.id.slice(0, 8)}...
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="absolute top-4 right-4">
                        <Badge variant={quest.status === 'active' ? 'default' : 'secondary'}>
                          {quest.status === 'active' ? 'Active' : 
                           quest.status === 'upcoming' ? 'À venir' : 
                           quest.status === 'completed' ? 'Terminée' : 'Annulée'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <p className="text-slate-600 mb-4 line-clamp-3">
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
                      
                      {/* Métriques */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center text-sm text-slate-600">
                          <Users className="w-4 h-4 mr-2 text-blue-500" />
                          {quest.min_participants}-{quest.max_participants} joueurs
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <Award className="w-4 h-4 mr-2 text-amber-500" />
                          {quest.reward_points} points
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <MapPin className="w-4 h-4 mr-2 text-green-500" />
                          {quest.clues?.length || 0} indices
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <Clock className="w-4 h-4 mr-2 text-purple-500" />
                          {quest.status === 'active' ? 'En cours' : 'Bientôt'}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-3">
                        <Link to={`/quests/${quest.id}`} className="flex-1">
                          <Button 
                            variant="outline" 
                            className="w-full border-2 border-amber-300 text-amber-700 hover:bg-amber-50"
                            onClick={() => console.log('Navigating to quest:', quest.id)}
                          >
                            Voir détails
                          </Button>
                        </Link>
                        
                        {quest.status === 'active' && (
                          <Button 
                            onClick={() => handleJoinQuest(quest.id)}
                            disabled={joinQuestMutation.isPending}
                            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                          >
                            {joinQuestMutation.isPending ? 'Inscription...' : 'Rejoindre'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Section des quêtes personnalisées */}
        {customQuests.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-8">
              <Trophy className="w-8 h-8 text-purple-600 mr-3" />
              <h2 className="text-3xl font-bold text-slate-800">Quêtes Personnalisées</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {customQuests?.map((quest) => {
                const TypeIcon = questTypeIcons[quest.quest_type];
                
                return (
                  <Card key={quest.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white/95 backdrop-blur-sm border border-amber-200/50">
                    <div className="relative">
                      {/* En-tête avec gradient basé sur le type */}
                      <div className={`p-6 bg-gradient-to-br ${
                        quest.quest_type === 'templar' ? 'from-red-500 to-red-700' :
                        quest.quest_type === 'grail' ? 'from-purple-500 to-purple-700' :
                        quest.quest_type === 'lost_civilization' ? 'from-blue-500 to-blue-700' :
                        'from-amber-500 to-amber-700'
                      } text-white`}>
                        <div className="flex items-center justify-between mb-4">
                          <TypeIcon className="w-8 h-8" />
                          <Badge className={`${difficultyColors[quest.difficulty_level]} border-0`}>
                            {difficultyLabels[quest.difficulty_level]}
                          </Badge>
                        </div>
                        
                        <h3 className="text-2xl font-bold mb-2">{quest.title}</h3>
                        <p className="text-white/90 text-sm">{questTypeLabels[quest.quest_type]}</p>
                      </div>
                      
                      {/* Statut */}
                      <div className="absolute top-4 right-4">
                        <Badge variant={quest.status === 'active' ? 'default' : 'secondary'}>
                          {quest.status === 'active' ? 'Active' : 
                           quest.status === 'upcoming' ? 'À venir' : 
                           quest.status === 'completed' ? 'Terminée' : 'Annulée'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <p className="text-slate-600 mb-4 line-clamp-3">
                        {quest.description || quest.story_background}
                      </p>
                      
                      {/* Métriques */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center text-sm text-slate-600">
                          <Users className="w-4 h-4 mr-2 text-blue-500" />
                          {quest.min_participants}-{quest.max_participants} joueurs
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <Award className="w-4 h-4 mr-2 text-amber-500" />
                          {quest.reward_points} points
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <MapPin className="w-4 h-4 mr-2 text-green-500" />
                          {quest.clues?.length || 0} indices
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <Clock className="w-4 h-4 mr-2 text-purple-500" />
                          {quest.status === 'active' ? 'En cours' : 'Bientôt'}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-3">
                        <Link to={`/quests/${quest.id}`} className="flex-1">
                          <Button variant="outline" className="w-full border-2 border-amber-300 text-amber-700 hover:bg-amber-50">
                            Voir détails
                          </Button>
                        </Link>
                        
                        {quest.status === 'active' && (
                          <Button 
                            onClick={() => handleJoinQuest(quest.id)}
                            disabled={joinQuestMutation.isPending}
                            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                          >
                            {joinQuestMutation.isPending ? 'Inscription...' : 'Rejoindre'}
                          </Button>
                        )}
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
            <h3 className="text-xl font-semibold text-slate-600 mb-2">Aucune quête trouvée</h3>
            <p className="text-slate-500 mb-4">Essayez de modifier vos filtres ou chargez les mystères historiques.</p>
            <Button 
              onClick={handlePopulateQuests}
              disabled={isPopulating}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
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
