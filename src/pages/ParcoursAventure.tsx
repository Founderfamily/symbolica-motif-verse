import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Compass, 
  Map, 
  Trophy, 
  Zap, 
  Star, 
  Target,
  Gift,
  Users,
  Clock,
  Gamepad2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ParcoursAventure = () => {
  const navigate = useNavigate();

  const adventureFeatures = [
    {
      title: "Quêtes aux Trésors",
      description: "Résolvez des énigmes et découvrez des symboles cachés",
      icon: Target,
      action: () => navigate('/quests'),
      badge: "50+ quêtes",
      color: "emerald"
    },
    {
      title: "Exploration Interactive",
      description: "Parcourez le monde des symboles de façon ludique",
      icon: Compass,
      action: () => navigate('/map'),
      badge: "Monde ouvert",
      color: "blue"
    },
    {
      title: "Défis Communautaires",
      description: "Participez à des challenges avec d'autres aventuriers",
      icon: Users,
      action: () => navigate('/community'),
      badge: "1000+ joueurs",
      color: "purple"
    },
    {
      title: "Système de Récompenses",
      description: "Gagnez des badges et débloquez du contenu exclusif",
      icon: Trophy,
      action: () => navigate('/achievements'),
      badge: "100+ badges",
      color: "yellow"
    },
    {
      title: "Timeline Immersive",
      description: "Voyagez dans le temps à travers les époques",
      icon: Clock,
      action: () => navigate('/symbols/timeline'),
      badge: "5000 ans",
      color: "indigo"
    },
    {
      title: "Mode Découverte",
      description: "Explorez au hasard et faites des découvertes surprenantes",
      icon: Zap,
      action: () => navigate('/discover'),
      badge: "Surprise",
      color: "pink"
    }
  ];

  const questTypes = [
    {
      name: "Chasse aux Symboles",
      description: "Trouvez des symboles cachés dans des images",
      difficulty: "Facile",
      time: "15 min",
      points: "50-100 pts"
    },
    {
      name: "Énigmes Historiques", 
      description: "Résolvez des mystères liés à l'histoire des symboles",
      difficulty: "Moyen",
      time: "30 min",
      points: "100-200 pts"
    },
    {
      name: "Missions Épiques",
      description: "Quêtes complexes sur plusieurs jours",
      difficulty: "Difficile", 
      time: "3-7 jours",
      points: "500-1000 pts"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: "text-emerald-600 group-hover:text-emerald-700",
      blue: "text-blue-600 group-hover:text-blue-700",
      purple: "text-purple-600 group-hover:text-purple-700",
      yellow: "text-yellow-600 group-hover:text-yellow-700",
      indigo: "text-indigo-600 group-hover:text-indigo-700",
      pink: "text-pink-600 group-hover:text-pink-700"
    };
    return colors[color] || "text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="container mx-auto px-4 py-16">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Gamepad2 className="h-12 w-12 text-emerald-600" />
            <h1 className="text-4xl font-bold text-gray-900">Parcours Aventure</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Embarquez dans une aventure ludique à travers l'univers des symboles ! 
            Résolvez des énigmes, relevez des défis et découvrez des trésors cachés.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
              Gamification
            </Badge>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Récompenses
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              Communauté
            </Badge>
          </div>
        </div>

        {/* Adventure Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {adventureFeatures.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <feature.icon className={`h-8 w-8 ${getColorClasses(feature.color)}`} />
                  <Badge variant="outline" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={feature.action}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  Commencer l'Aventure
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quest Types */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Map className="h-6 w-6 text-emerald-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Types de Quêtes</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {questTypes.map((quest, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg text-gray-900 mb-2">{quest.name}</h3>
                <p className="text-gray-600 mb-4">{quest.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Difficulté:</span>
                    <Badge 
                      variant={quest.difficulty === 'Facile' ? 'secondary' : 
                              quest.difficulty === 'Moyen' ? 'outline' : 'default'}
                    >
                      {quest.difficulty}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Durée:</span>
                    <span className="text-sm font-medium">{quest.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Points:</span>
                    <span className="text-sm font-bold text-emerald-600">{quest.points}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard Preview */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Star className="h-8 w-8" />
            <h2 className="text-2xl font-semibold">Tableau des Champions</h2>
          </div>
          <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
            Grimpez dans le classement, débloquez des titres exclusifs et devenez une légende 
            de l'exploration symbolique !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              className="bg-white text-emerald-600 hover:bg-emerald-50"
              onClick={() => navigate('/leaderboard')}
            >
              <Trophy className="h-4 w-4 mr-2" />
              Voir le Classement
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-emerald-600"
              onClick={() => navigate('/quests')}
            >
              <Target className="h-4 w-4 mr-2" />
              Commencer une Quête
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParcoursAventure;