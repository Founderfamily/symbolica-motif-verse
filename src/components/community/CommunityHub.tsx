
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { I18nText } from '@/components/ui/i18n-text';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CommunityStats from '@/components/community/CommunityStats';
import CommunityTabs from '@/components/community/CommunityTabs';
import InterestGroupCard from '@/components/community/InterestGroupCard';
import TopContributors from '@/components/community/TopContributors';
import ActivityFeed from '@/components/community/ActivityFeed';
import { getInterestGroups } from '@/services/interestGroupService';
import { InterestGroup } from '@/types/interest-groups';
import { useWelcomeGroup } from '@/hooks/useCommunityGroups';
import { Users, BookOpen, Crown, Compass, History, Building, Palette, Mountain, MessageCircle } from 'lucide-react';

const CommunityHub: React.FC = () => {
  const navigate = useNavigate();
  const [activeMainTab, setActiveMainTab] = useState('aventure');
  const { data: welcomeGroupData, isLoading: isLoadingWelcome } = useWelcomeGroup();

  // Groupes d'aventure (quêtes)
  const aventureGroups = [
    {
      id: '1',
      title: 'Le Mystère des Templiers',
      location: 'France, Europe',
      description: 'Suivez les indices laissés par les Templiers à travers l\'Europe',
      participants: 127,
      clues: 8,
      reward: 500,
      difficulty: 'Expert',
      icon: Crown,
      color: 'green'
    },
    {
      id: '2', 
      title: 'Trésors Mayas Perdus',
      location: 'Mexique, Amérique',
      description: 'Découvrez les symboles cachés dans les temples mayas',
      participants: 89,
      clues: 5,
      reward: 350,
      difficulty: 'Intermédiaire',
      icon: Mountain,
      color: 'blue'
    },
    {
      id: '3',
      title: 'Secrets des Pharaons',
      location: 'Égypte, Afrique', 
      description: 'Percez les mystères des hiéroglyphes royaux',
      participants: 156,
      clues: 12,
      reward: 750,
      difficulty: 'Maître',
      icon: Crown,
      color: 'red'
    }
  ];

  // Utiliser les vraies données du groupe de bienvenue
  const welcomeGroup = welcomeGroupData ? {
    id: welcomeGroupData.id,
    title: welcomeGroupData.name,
    members: welcomeGroupData.totalMembers,
    online: welcomeGroupData.onlineMembers,
    topic: welcomeGroupData.topic || 'Présentation et conseils pour débuter',
    icon: MessageCircle,
    color: 'purple'
  } : {
    id: 'welcome',
    title: 'Bienvenue - Nouveaux Membres',
    members: 0,
    online: 0,
    topic: 'Présentation et conseils pour débuter',
    icon: MessageCircle,
    color: 'purple'
  };

  // Groupes académiques
  const academiqueGroups = [
    {
      id: 'historiens',
      title: 'Historiens & Archéologues',
      members: 342,
      online: 28,
      topic: 'Débat sur l\'origine des symboles celtiques',
      icon: History,
      color: 'blue'
    },
    {
      id: 'unesco',
      title: 'Experts UNESCO',
      members: 156,
      online: 12,
      topic: 'Classification des patrimoines mondiaux',
      icon: Building,
      color: 'green'
    },
    {
      id: 'symbologie',
      title: 'Chercheurs en Symbologie',
      members: 498,
      online: 45,
      topic: 'Nouvelles découvertes en Mésopotamie',
      icon: BookOpen,
      color: 'amber'
    },
    {
      id: 'patrimoine',
      title: 'Patrimoine & Culture',
      members: 287,
      online: 22,
      topic: 'Préservation des traditions orales',
      icon: Palette,
      color: 'pink'
    },
    {
      id: 'traditions',
      title: 'Traditions Ancestrales',
      members: 193,
      online: 15,
      topic: 'Rituels et symboles chamaniques',
      icon: Compass,
      color: 'orange'
    },
    {
      id: 'linguistique',
      title: 'Linguistes & Épigraphes',
      members: 234,
      online: 19,
      topic: 'Déchiffrage de langues anciennes',
      icon: BookOpen,
      color: 'blue'
    },
    {
      id: 'anthropologie',
      title: 'Anthropologues Culturels',
      members: 178,
      online: 14,
      topic: 'Rites initiatiques et symbolisme',
      icon: Users,
      color: 'green'
    },
    {
      id: 'archeologie',
      title: 'Archéologie Expérimentale',
      members: 156,
      online: 11,
      topic: 'Reconstitution d\'outils anciens',
      icon: Mountain,
      color: 'orange'
    }
  ];

  // Groupes dédiés aux collections
  const collectionsGroups = [
    {
      id: 'symboles-celtiques',
      title: 'Symboles Celtiques',
      members: 432,
      online: 37,
      topic: 'Discussion sur les triquetra et spirales',
      icon: Compass,
      color: 'green'
    },
    {
      id: 'runes-nordiques',
      title: 'Runes Nordiques',
      members: 298,
      online: 23,
      topic: 'Interprétation des inscriptions runiques',
      icon: BookOpen,
      color: 'blue'
    },
    {
      id: 'hieroglyphes',
      title: 'Hiéroglyphes Égyptiens',
      members: 387,
      online: 31,
      topic: 'Déchiffrage de nouveaux papyrus',
      icon: Crown,
      color: 'amber'
    },
    {
      id: 'art-rupestre',
      title: 'Art Rupestre',
      members: 254,
      online: 19,
      topic: 'Découvertes en Australie et Amérique',
      icon: Mountain,
      color: 'orange'
    },
    {
      id: 'symboles-alchimiques',
      title: 'Symboles Alchimiques',
      members: 189,
      online: 14,
      topic: 'Manuscrits médiévaux et Renaissance',
      icon: Palette,
      color: 'purple'
    },
    {
      id: 'motifs-indigenes',
      title: 'Motifs Indigènes',
      members: 167,
      online: 12,
      topic: 'Traditions des peuples autochtones',
      icon: Users,
      color: 'pink'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-900',
      green: 'bg-green-50 border-green-200 text-green-900',
      purple: 'bg-purple-50 border-purple-200 text-purple-900',
      amber: 'bg-amber-50 border-amber-200 text-amber-900',
      pink: 'bg-pink-50 border-pink-200 text-pink-900',
      orange: 'bg-orange-50 border-orange-200 text-orange-900',
      red: 'bg-red-50 border-red-200 text-red-900'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'Expert': 'bg-orange-100 text-orange-800',
      'Intermédiaire': 'bg-yellow-100 text-yellow-800', 
      'Maître': 'bg-red-100 text-red-800'
    };
    return colors[difficulty as keyof typeof colors] || colors['Intermédiaire'];
  };

  return (
    <div className="min-h-screen relative bg-stone-50">
      {/* Subtle background like HomePage */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Main subtle paper effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100"></div>
        {/* Soft background circles */}
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-stone-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-amber-50/20 rounded-full blur-2xl" />
        <div className="absolute top-2/3 right-1/4 w-40 h-40 bg-stone-200/15 rounded-full blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-2 bg-gradient-to-r from-stone-50 to-amber-50 rounded-full mb-4">
            <div className="bg-white/75 px-4 py-2 rounded-full text-stone-700 text-sm font-medium border border-amber-100">
              <I18nText translationKey="badge" ns="community">Communauté Active</I18nText>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-stone-800 to-amber-700 bg-clip-text text-transparent">
            <I18nText translationKey="title" ns="community">Hub Communautaire</I18nText>
          </h1>
          <p className="text-stone-600 max-w-2xl mx-auto">
            <I18nText translationKey="description" ns="community">
              Rejoignez des groupes d'intérêt, partagez vos découvertes et collaborez avec d'autres passionnés de symboles
            </I18nText>
          </p>
        </div>

        {/* Stats - subtle neutral style */}
        <div className="mb-8">
          <div className="bg-white/75 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-stone-200/60">
            <CommunityStats />
          </div>
        </div>

        {/* Groupe Bienvenue - Section globale au-dessus des onglets */}
        <div className="mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-stone-100/50">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-stone-800 mb-2 flex items-center justify-center gap-2">
                <MessageCircle className="w-6 h-6 text-purple-600" />
                Nouveau sur la plateforme ?
              </h2>
              <p className="text-stone-600">Rejoignez notre groupe d'accueil pour débuter</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-purple-200 shadow-sm hover:shadow-md transition-shadow max-w-2xl mx-auto">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getColorClasses(welcomeGroup.color)}`}>
                    <welcomeGroup.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-stone-800">{welcomeGroup.title}</h3>
                    <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full mt-1">
                      Groupe d'accueil - Ouvert à tous
                    </span>
                  </div>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {welcomeGroup.online} en ligne
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-stone-600 mb-4">
                <div className="text-center">
                  <span className="block font-medium text-lg text-stone-800">{welcomeGroup.members}</span>
                  <span>Membres</span>
                </div>
                <div className="text-center">
                  <span className="block font-medium text-lg text-stone-800">{welcomeGroup.online}</span>
                  <span>En ligne</span>
                </div>
              </div>
              
              <p className="text-stone-700 text-sm mb-4 italic text-center">
                "Sujet actuel : {welcomeGroup.topic}"
              </p>
              
              <Button 
                onClick={() => navigate(`/welcome-group/${welcomeGroup.id}`)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                size="lg"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Rejoindre la Discussion
              </Button>
            </div>
          </div>
        </div>

        {/* Main Tabs - Aventure vs Académique vs Collections */}
        <div className="mb-8">
          <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="aventure" className="flex items-center gap-2">
                <Compass className="w-4 h-4" />
                Aventure
              </TabsTrigger>
              <TabsTrigger value="academique" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Académique
              </TabsTrigger>
              <TabsTrigger value="collections" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Collections
              </TabsTrigger>
            </TabsList>

            {/* Section Aventure - Quêtes */}
            <TabsContent value="aventure" className="mt-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-stone-100/50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {aventureGroups.map(quest => (
                    <div key={quest.id} className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${getColorClasses(quest.color)}`}>
                            <quest.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-stone-800">{quest.title}</h3>
                            <p className="text-sm text-stone-600 flex items-center gap-1 mt-1">
                              <span className="w-2 h-2 bg-stone-400 rounded-full"></span>
                              {quest.location}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quest.difficulty)}`}>
                          {quest.difficulty}
                        </span>
                      </div>
                      
                      <p className="text-stone-700 text-sm mb-4">{quest.description}</p>
                      
                      <div className="space-y-2 text-sm text-stone-600 mb-4">
                        <div className="flex justify-between">
                          <span>Participants</span>
                          <span className="font-medium">{quest.participants}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Indices</span>
                          <span className="font-medium">{quest.clues} disponibles</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Récompense</span>
                          <span className="font-medium text-amber-600">{quest.reward} points</span>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => navigate('/quests')}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        Rejoindre
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="text-center">
                  <Button 
                    onClick={() => navigate('/quests')}
                    size="lg"
                    className="bg-amber-600 hover:bg-amber-700 text-white px-8"
                  >
                    <Compass className="w-5 h-5 mr-2" />
                    Voir Toutes les Quêtes
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Section Académique - Discussions */}
            <TabsContent value="academique" className="mt-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-stone-100/50">
                {/* Groupes académiques */}
                <div>
                  <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-600" />
                    Groupes de recherche
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {academiqueGroups.map(group => (
                      <div key={group.id} className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${getColorClasses(group.color)}`}>
                              <group.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-stone-800">{group.title}</h3>
                            </div>
                          </div>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            {group.online} en ligne
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm text-stone-600 mb-4">
                          <div className="flex justify-between">
                            <span>Membres</span>
                            <span className="font-medium">{group.members}</span>
                          </div>
                        </div>
                        
                        <p className="text-stone-700 text-sm mb-4 italic">
                          "Sujet actuel : {group.topic}"
                        </p>
                        
                        <Button 
                          onClick={() => navigate('/community')}
                          variant="outline"
                          className="w-full border-stone-300 hover:bg-stone-50"
                        >
                          Rejoindre la Discussion
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Section Collections - Communautés par collection */}
            <TabsContent value="collections" className="mt-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-stone-100/50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {collectionsGroups.map(group => (
                    <div key={group.id} className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${getColorClasses(group.color)}`}>
                            <group.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-stone-800">{group.title}</h3>
                          </div>
                        </div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {group.online} en ligne
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm text-stone-600 mb-4">
                        <div className="flex justify-between">
                          <span>Membres</span>
                          <span className="font-medium">{group.members}</span>
                        </div>
                      </div>
                      
                      <p className="text-stone-700 text-sm mb-4 italic">
                        "Sujet actuel : {group.topic}"
                      </p>
                      
                      <Button 
                        onClick={() => navigate('/community')}
                        variant="outline"
                        className="w-full border-stone-300 hover:bg-stone-50"
                      >
                        Rejoindre la Discussion
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow border border-stone-100/60">
              <TopContributors />
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow border border-stone-100/60">
              <ActivityFeed />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityHub;
