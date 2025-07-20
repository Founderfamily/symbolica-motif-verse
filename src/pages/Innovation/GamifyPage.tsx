
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Award, Target, ArrowRight, Play, CheckCircle, Zap, Gift } from 'lucide-react';

const GamifyPage = () => {
  const [level, setLevel] = useState(12);
  const [xp, setXp] = useState(2847);
  const [xpToNext, setXpToNext] = useState(3000);
  const [streak, setStreak] = useState(7);
  const [achievements, setAchievements] = useState(15);
  const [isActive, setIsActive] = useState(false);

  const mockMetrics = {
    engagement: '+420%',
    retention: '+380%',
    completion: '+290%',
    social: '+150%'
  };

  const mockQuests = [
    { name: 'Explorateur Égyptien', progress: 80, reward: '500 XP', icon: '🏺' },
    { name: 'Maître des Runes', progress: 45, reward: 'Badge Rare', icon: '⚡' },
    { name: 'Collectionneur', progress: 90, reward: 'Titre Spécial', icon: '💎' },
  ];

  const mockAchievements = [
    { name: 'Premier Pas', description: 'Découvrir votre premier symbole', unlocked: true },
    { name: 'Curieux', description: 'Explorer 10 collections', unlocked: true },
    { name: 'Érudit', description: 'Atteindre le niveau 10', unlocked: true },
    { name: 'Légende', description: 'Débloquer tous les symboles rares', unlocked: false },
  ];

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setXp(prev => {
          const newXp = prev + Math.floor(Math.random() * 50) + 10;
          if (newXp >= xpToNext) {
            setLevel(prevLevel => prevLevel + 1);
            setXpToNext(prevNext => prevNext + 500);
            setAchievements(prevAch => prevAch + 1);
            return newXp - xpToNext;
          }
          return newXp;
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isActive, xpToNext]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="h-8 w-8 text-orange-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Système de Progression Gamifiée
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transformez l'exploration culturelle en aventure captivante. 
            Niveaux, achievements, quêtes - engagez vos utilisateurs durablement.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Interactive Demo */}
          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Profil Joueur Interactif
              </CardTitle>
              <CardDescription>
                Système de progression complet avec récompenses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Player Stats */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold">Niveau {level}</h3>
                    <p className="opacity-80">Explorateur Culturel</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{streak}</div>
                    <div className="text-sm opacity-80">jours de suite</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Expérience</span>
                    <span>{xp.toLocaleString()} / {xpToNext.toLocaleString()} XP</span>
                  </div>
                  <Progress value={(xp / xpToNext) * 100} className="h-3" />
                </div>
              </div>

              {/* Active Quests */}
              <div>
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-500" />
                  Quêtes Actives
                </h4>
                <div className="space-y-3">
                  {mockQuests.map((quest, index) => (
                    <div key={index} className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{quest.icon}</span>
                          <span className="font-medium text-sm">{quest.name}</span>
                        </div>
                        <Badge variant="secondary">{quest.reward}</Badge>
                      </div>
                      <Progress value={quest.progress} className="h-2" />
                      <div className="text-xs text-muted-foreground mt-1">
                        {quest.progress}% terminé
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Achievement */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Award className="h-8 w-8 text-yellow-600" />
                  <div>
                    <h4 className="font-bold text-yellow-800">Nouveau Succès!</h4>
                    <p className="text-sm text-yellow-700">
                      Vous avez débloqué 15 achievements
                    </p>
                  </div>
                  <Gift className="h-6 w-6 text-yellow-600 ml-auto animate-bounce" />
                </div>
              </div>

              <Button 
                onClick={() => setIsActive(!isActive)}
                className="w-full"
                variant={isActive ? "destructive" : "default"}
              >
                {isActive ? "Arrêter" : "Démarrer"} la progression
                <Zap className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Achievements & Metrics */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-orange-500" />
                  Impact sur l'Engagement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(mockMetrics).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-sm font-medium capitalize">
                      {key === 'social' ? 'Partage social' : 
                       key === 'retention' ? 'Rétention' :
                       key === 'completion' ? 'Taux de complétion' : 'Engagement'}
                    </span>
                    <Badge variant="secondary" className="text-orange-600">
                      {value}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Galerie d'Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {mockAchievements.map((achievement, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg border text-center ${
                        achievement.unlocked 
                          ? 'bg-yellow-50 border-yellow-200' 
                          : 'bg-slate-50 border-slate-200 opacity-50'
                      }`}
                    >
                      <div className="text-2xl mb-1">
                        {achievement.unlocked ? '🏆' : '🔒'}
                      </div>
                      <div className="text-xs font-medium">{achievement.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {achievement.description}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mécaniques de Jeu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    "Système de niveaux et d'expérience",
                    "Quêtes quotidiennes et défis",
                    "Collections d'achievements uniques",
                    "Récompenses sociales et partage"
                  ].map((mechanic, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{mechanic}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button size="lg" className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
            Gamifier mon Application
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Boostez l'engagement utilisateur avec la gamification intelligente
          </p>
        </div>
      </div>
    </div>
  );
};

export default GamifyPage;
