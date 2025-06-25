
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Map, Crown, Users, Clock, ArrowRight, Compass, Loader2 } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useQuests } from '@/hooks/useQuests';
import { getQuestCluesCount } from '@/utils/questUtils';

const QuestsSection = () => {
  const navigate = useNavigate();
  const { data: quests, isLoading, error } = useQuests();

  // Filtrer les quêtes actives et prendre les 3 premières
  const featuredQuests = quests?.filter(quest => quest.status === 'active').slice(0, 3) || [];

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expert': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'master': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  const getDifficultyLabel = (level: string) => {
    switch (level) {
      case 'beginner': return 'Débutant';
      case 'intermediate': return 'Intermédiaire';
      case 'expert': return 'Expert';
      case 'master': return 'Maître';
      default: return level;
    }
  };

  const getQuestTypeIcon = (questType: string) => {
    switch (questType) {
      case 'templar': return <Crown className="h-4 w-4" />;
      case 'lost_civilization': return <Compass className="h-4 w-4" />;
      case 'grail': return <Map className="h-4 w-4" />;
      default: return <Map className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <section className="relative px-4 md:px-8 max-w-7xl mx-auto">
        <div className="relative">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-semibold mb-3 text-stone-800">
              <I18nText translationKey="quests.featured.title">Quêtes Historiques</I18nText>
            </h2>
            <p className="text-base text-stone-600 max-w-2xl mx-auto mb-6 leading-relaxed">
              <I18nText translationKey="quests.featured.description">
                Partez à l'aventure sur les traces des grands mystères de l'Histoire. 
                Résolvez des énigmes, découvrez des trésors cachés et percez les secrets du passé.
              </I18nText>
            </p>
          </div>
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-stone-600" />
          </div>
        </div>
      </section>
    );
  }

  if (error || featuredQuests.length === 0) {
    return (
      <section className="relative px-4 md:px-8 max-w-7xl mx-auto">
        <div className="relative">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-semibold mb-3 text-stone-800">
              <I18nText translationKey="quests.featured.title">Quêtes Historiques</I18nText>
            </h2>
            <p className="text-base text-stone-600 max-w-2xl mx-auto mb-6 leading-relaxed">
              <I18nText translationKey="quests.featured.description">
                Partez à l'aventure sur les traces des grands mystères de l'Histoire. 
                Résolvez des énigmes, découvrez des trésors cachés et percez les secrets du passé.
              </I18nText>
            </p>
          </div>
          <div className="text-center py-8">
            <p className="text-stone-500 mb-4">Aucune quête disponible pour le moment.</p>
            <Button 
              onClick={() => navigate('/quests')}
              variant="outline"
              className="bg-stone-800 hover:bg-stone-900 text-amber-100"
            >
              <Compass className="mr-2 h-4 w-4" />
              Voir toutes les quêtes
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative px-4 md:px-8 max-w-7xl mx-auto">
      <div className="relative">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-3 text-stone-800">
            <I18nText translationKey="quests.featured.title">Quêtes Historiques</I18nText>
          </h2>
          
          <p className="text-base text-stone-600 max-w-2xl mx-auto mb-6 leading-relaxed">
            <I18nText translationKey="quests.featured.description">
              Partez à l'aventure sur les traces des grands mystères de l'Histoire. 
              Résolvez des énigmes, découvrez des trésors cachés et percez les secrets du passé.
            </I18nText>
          </p>
        </div>

        {/* Quests Grid */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-amber-50/80 via-stone-50 to-amber-50/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200">
            <div className="grid md:grid-cols-3 gap-6">
              {featuredQuests.map((quest) => (
                <Card key={quest.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/90 border-stone-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-stone-800 text-amber-100 rounded-lg flex items-center justify-center">
                          {getQuestTypeIcon(quest.quest_type)}
                        </div>
                        <Badge className={getDifficultyColor(quest.difficulty_level)}>
                          {getDifficultyLabel(quest.difficulty_level)}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardTitle className="text-lg text-stone-800 leading-tight">
                      {quest.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-stone-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {quest.description}
                    </p>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-stone-600">
                          <Crown className="h-3 w-3" />
                          <span>{quest.reward_points ?? 0} points</span>
                        </div>
                        <div className="flex items-center gap-1 text-stone-600">
                          <Users className="h-3 w-3" />
                          <span>{quest.max_participants ?? '-'} participant{quest.max_participants === 1 ? '' : 's'}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-stone-600">
                        <Clock className="h-3 w-3" />
                        <span>
                          {getQuestCluesCount(quest)} indice{getQuestCluesCount(quest) > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-stone-800 hover:bg-stone-900 text-amber-100"
                      onClick={() => navigate(`/quests/${quest.id}`)}
                    >
                      <Map className="w-4 h-4 mr-2" />
                      <I18nText translationKey="quests.join">Rejoindre la quête</I18nText>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <Button 
            onClick={() => navigate('/quests')}
            size="lg"
            className="bg-stone-800 hover:bg-stone-900 text-amber-100 px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <Compass className="mr-2 h-4 w-4" />
            <I18nText translationKey="quests.featured.exploreAll">Découvrir toutes les quêtes</I18nText>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Transition Message */}
        <div className="text-center">
          <div className="relative max-w-2xl mx-auto">
            <div className="bg-stone-50 rounded-xl p-6 border-l-4 border-stone-600 shadow-sm">
              <h3 className="text-xl font-semibold text-stone-800 mb-3">
                Prêt pour l'aventure ?
              </h3>
              <p className="text-base text-stone-600 leading-relaxed">
                Parfait ! Rejoignez notre communauté d'explorateurs et commencez 
                votre première quête dès aujourd'hui.
              </p>
              
              <div className="mt-4 flex justify-center">
                <div className="w-6 h-6 bg-stone-600 rounded-full flex items-center justify-center">
                  <ArrowRight className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuestsSection;
