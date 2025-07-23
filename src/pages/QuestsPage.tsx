import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search,
  Filter,
  Crown,
  Trophy,
  Eye,
  Users,
  MapPin,
  Clock,
  Globe,
  ArrowRight,
  Plus,
  Loader2,
  Compass,
  Brain,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuests } from '@/hooks/useQuests';
import { TreasureQuest } from '@/types/quests';
import { getQuestTypeLabel, getDifficultyLabel } from '@/utils/questUtils';
import ClueSubmissionDialog from '@/components/quests/ClueSubmissionDialog';
import QuestJoinDialog from '@/components/quests/QuestJoinDialog';

const QuestsPage = () => {
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterRegion, setFilterRegion] = useState<string>('all');

  const { data: allQuests, isLoading, error } = useQuests();

  // Filtrer les quêtes
  const filteredQuests = allQuests?.filter(quest => {
    if (searchTerm && !quest.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !quest.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (filterType !== 'all' && quest.quest_type !== filterType) return false;
    if (filterDifficulty !== 'all' && quest.difficulty_level !== filterDifficulty) return false;
    return true;
  }) || [];

  // Statistiques
  const stats = {
    total: filteredQuests.length,
    myths: filteredQuests.filter(q => q.quest_type === 'myth').length,
    foundTreasures: filteredQuests.filter(q => q.quest_type === 'found_treasure').length,
    unfoundTreasures: filteredQuests.filter(q => q.quest_type === 'unfound_treasure').length,
    active: filteredQuests.filter(q => q.status === 'active').length
  };

  const getQuestTypeIcon = (type: string) => {
    switch (type) {
      case 'myth': return <Crown className="w-5 h-5" />;
      case 'found_treasure': return <Trophy className="w-5 h-5" />;
      case 'unfound_treasure': return <Eye className="w-5 h-5" />;
      default: return <Compass className="w-5 h-5" />;
    }
  };

  const getQuestTypeColor = (type: string) => {
    switch (type) {
      case 'myth': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'found_treasure': return 'bg-green-100 text-green-800 border-green-200';
      case 'unfound_treasure': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-blue-100 text-blue-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'expert': return 'bg-orange-100 text-orange-800';
      case 'master': return 'bg-red-100 text-red-800';
      default: return 'bg-stone-100 text-stone-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-stone-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-stone-800 mb-4">
            Quêtes & Recherches Collaboratives
          </h1>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto">
            Rejoignez la communauté pour explorer les mystères du passé, découvrir des trésors cachés et percer les secrets de l'Histoire
          </p>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="p-4 text-center bg-white/80 backdrop-blur-sm">
            <div className="text-2xl font-bold text-stone-800">{stats.total}</div>
            <div className="text-sm text-stone-600">Quêtes Disponibles</div>
          </Card>
          <Card className="p-4 text-center bg-purple-50/80 backdrop-blur-sm border-purple-200">
            <div className="text-2xl font-bold text-purple-800">{stats.myths}</div>
            <div className="text-sm text-purple-600">Mythes & Légendes</div>
          </Card>
          <Card className="p-4 text-center bg-green-50/80 backdrop-blur-sm border-green-200">
            <div className="text-2xl font-bold text-green-800">{stats.foundTreasures}</div>
            <div className="text-sm text-green-600">Trésors Découverts</div>
          </Card>
          <Card className="p-4 text-center bg-red-50/80 backdrop-blur-sm border-red-200">
            <div className="text-2xl font-bold text-red-800">{stats.unfoundTreasures}</div>
            <div className="text-sm text-red-600">Trésors à Trouver</div>
          </Card>
          <Card className="p-4 text-center bg-amber-50/80 backdrop-blur-sm border-amber-200">
            <div className="text-2xl font-bold text-amber-800">{stats.active}</div>
            <div className="text-sm text-amber-600">Recherches Actives</div>
          </Card>
        </div>

        {/* Filtres */}
        <Card className="p-6 mb-8 bg-white/90 backdrop-blur-sm border-amber-200">
          <div className="space-y-4">
            {/* Barre de recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
              <Input
                placeholder="Rechercher une quête par nom, lieu, description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg border-2 border-amber-200 focus:border-amber-400"
              />
            </div>

            {/* Filtres rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="border-amber-200">
                  <SelectValue placeholder="Type de quête" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="myth">📜 Mythes & Légendes</SelectItem>
                  <SelectItem value="found_treasure">💎 Trésors Découverts</SelectItem>
                  <SelectItem value="unfound_treasure">🗝️ Trésors à Trouver</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                <SelectTrigger className="border-amber-200">
                  <SelectValue placeholder="Niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous niveaux</SelectItem>
                  <SelectItem value="beginner">🌟 Accessible</SelectItem>
                  <SelectItem value="intermediate">⭐ Intermédiaire</SelectItem>
                  <SelectItem value="expert">🔥 Avancé</SelectItem>
                  <SelectItem value="master">💎 Expert</SelectItem>
                </SelectContent>
              </Select>

              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Proposer une Quête
              </Button>
            </div>
          </div>
        </Card>

        {/* Liste des quêtes */}
        {error ? (
          <Card className="p-8 text-center">
            <p className="text-red-600 mb-4">Erreur lors du chargement des quêtes</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Réessayer
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredQuests.map((quest) => (
              <Card key={quest.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-white/95 backdrop-blur-sm border-amber-200/50">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Contenu principal */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${getQuestTypeColor(quest.quest_type)}`}>
                          {getQuestTypeIcon(quest.quest_type)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-bold text-stone-800 leading-tight">
                              {quest.title}
                            </h3>
                            <div className="flex gap-2">
                              <Badge className={getDifficultyColor(quest.difficulty_level)}>
                                {getDifficultyLabel(quest.difficulty_level)}
                              </Badge>
                              <Badge className={getQuestTypeColor(quest.quest_type)}>
                                {getQuestTypeLabel(quest.quest_type)}
                              </Badge>
                            </div>
                          </div>
                          
                          <p className="text-stone-600 mb-4 line-clamp-2">
                            {quest.description}
                          </p>

                          {/* Informations sur la collaboration */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-green-600">
                              <Users className="w-4 h-4" />
                              <span>Collaboration {quest.collaboration_type === 'open' ? 'Ouverte' : 'Limitée'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-blue-600">
                              <Brain className="w-4 h-4" />
                              <span>{quest.ai_research_enabled ? 'IA Activée' : 'Manuel'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-amber-600">
                              <Target className="w-4 h-4" />
                              <span>{quest.clues?.length || 0} indices</span>
                            </div>
                            <div className="flex items-center gap-2 text-stone-600">
                              <Clock className="w-4 h-4" />
                              <span>{quest.status === 'active' ? 'Active' : quest.status}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 lg:w-48">
                      <Link to={`/quests/${quest.id}`} className="w-full">
                        <Button 
                          variant="outline" 
                          className="w-full border-2 border-amber-300 text-amber-700 hover:bg-amber-50"
                        >
                          <Compass className="w-4 h-4 mr-2" />
                          Explorer
                        </Button>
                      </Link>
                      
                      <QuestJoinDialog quest={quest} className="w-full" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Message si aucune quête */}
        {filteredQuests.length === 0 && !isLoading && (
          <Card className="p-12 text-center">
            <Compass className="w-16 h-16 text-stone-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-stone-800 mb-2">
              Aucune quête trouvée
            </h3>
            <p className="text-stone-600 mb-6">
              Essayez d'ajuster vos filtres ou proposez une nouvelle quête à la communauté
            </p>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Proposer une Quête
            </Button>
          </Card>
        )}

        {/* Call to Action */}
        {filteredQuests.length > 0 && (
          <Card className="p-8 mt-8 text-center bg-gradient-to-r from-amber-50 to-stone-50 border-amber-200">
            <h3 className="text-2xl font-bold text-stone-800 mb-4">
              Rejoignez la Communauté de Chercheurs
            </h3>
            <p className="text-stone-600 mb-6 max-w-2xl mx-auto">
              Participez aux recherches collaboratives, partagez vos découvertes et aidez à résoudre les mystères les plus fascinants de l'Histoire
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-stone-800 hover:bg-stone-900 text-amber-100">
                <Users className="w-5 h-5 mr-2" />
                Rejoindre la Communauté
              </Button>
              <Button size="lg" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50">
                <Plus className="w-5 h-5 mr-2" />
                Proposer une Recherche
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuestsPage;