
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Map, Users, Trophy, Clock, MapPin } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const TreasureHunting = () => {
  const navigate = useNavigate();

  const activeQuests = [
    {
      title: "Le Mystère des Templiers",
      location: "France, Europe",
      participants: 127,
      clues: 8,
      difficulty: "Expert",
      reward: "500 points",
      status: "active",
      description: "Suivez les indices laissés par les Templiers à travers l'Europe"
    },
    {
      title: "Trésors Mayas Perdus",
      location: "Mexique, Amérique",
      participants: 89,
      clues: 5,
      difficulty: "Intermédiaire",
      reward: "350 points",
      status: "new",
      description: "Découvrez les symboles cachés dans les temples mayas"
    },
    {
      title: "Secrets des Pharaons",
      location: "Égypte, Afrique",
      participants: 156,
      clues: 12,
      difficulty: "Maître",
      reward: "750 points",
      status: "hot",
      description: "Percez les mystères des hiéroglyphes royaux"
    }
  ];

  const treasureFeatures = [
    {
      icon: Map,
      title: "Vrais Trésors Oubliés",
      description: "Participez à de vraies découvertes archéologiques",
      highlight: "Collaborations avec des musées"
    },
    {
      icon: Clock,
      title: "Indices en Temps Réel",
      description: "Nouveaux indices débloqués par la communauté",
      highlight: "Mises à jour quotidiennes"
    },
    {
      icon: Users,
      title: "Communauté d'Explorateurs",
      description: "Collaborez avec des passionnés du monde entier",
      highlight: "5000+ explorateurs actifs"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Débutant':
        return 'bg-green-100 text-green-800';
      case 'Intermédiaire':
        return 'bg-yellow-100 text-yellow-800';
      case 'Expert':
        return 'bg-orange-100 text-orange-800';
      case 'Maître':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-100 text-blue-800">Nouveau</Badge>;
      case 'hot':
        return <Badge className="bg-red-100 text-red-800">🔥 Populaire</Badge>;
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      default:
        return null;
    }
  };

  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
          <Compass className="w-4 h-4 mr-2" />
          Chasse aux Trésors
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
          Rejoignez la communauté pour trouver 
          <span className="text-amber-600"> de vrais trésors oubliés</span>
        </h2>
        
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Participez à des quêtes réelles, suivez des indices historiques authentiques 
          et faites partie des grandes découvertes archéologiques.
        </p>
      </div>

      {/* Treasure Features */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {treasureFeatures.map((feature, index) => {
          const Icon = feature.icon;
          
          return (
            <Card key={index} className="border-2 border-amber-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8" />
                </div>
                
                <h3 className="text-xl font-semibold text-slate-800 mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-slate-600 mb-4">
                  {feature.description}
                </p>
                
                <div className="bg-amber-50 p-3 rounded-lg border-l-4 border-amber-400">
                  <p className="text-sm text-amber-800 font-medium">
                    {feature.highlight}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Active Quests */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-8 rounded-2xl">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">
            Quêtes Actives
          </h3>
          <p className="text-slate-600">
            Rejoignez ces aventures en cours et aidez à percer leurs mystères
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {activeQuests.map((quest, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-semibold text-slate-800 leading-tight">
                    {quest.title}
                  </h4>
                  {getStatusBadge(quest.status)}
                </div>
                
                <div className="flex items-center text-slate-600 text-sm mb-3">
                  <MapPin className="w-4 h-4 mr-2" />
                  {quest.location}
                </div>
                
                <p className="text-slate-600 text-sm mb-4">
                  {quest.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Participants</span>
                    <span className="font-medium">{quest.participants}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Indices</span>
                    <span className="font-medium">{quest.clues} disponibles</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Récompense</span>
                    <span className="font-medium text-amber-600">{quest.reward}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <Badge className={getDifficultyColor(quest.difficulty)}>
                    {quest.difficulty}
                  </Badge>
                  <Button 
                    size="sm" 
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                    onClick={() => navigate('/quests')}
                  >
                    Rejoindre
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={() => navigate('/quests')}
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3"
          >
            <Compass className="w-5 h-5 mr-2" />
            Voir Toutes les Quêtes
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TreasureHunting;
