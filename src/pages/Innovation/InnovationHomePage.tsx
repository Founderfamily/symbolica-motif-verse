
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, 
  Network, 
  Layout, 
  Trophy, 
  Compass, 
  Clock,
  ArrowRight,
  Zap,
  Target,
  Users,
  Brain
} from 'lucide-react';

const InnovationHomePage = () => {
  const innovations = [
    {
      id: 'graph',
      title: 'Navigateur de Graphe',
      icon: Network,
      description: 'Navigation par relations sémantiques',
      explanation: 'Explorez les symboles culturels à travers leurs connexions naturelles. Découvrez comment l\'Ankh égyptien se connecte aux traditions hermétiques, puis à l\'alchimie médiévale.',
      benefits: ['Navigation intuitive', 'Découvertes surprenantes', 'Apprentissage contextuel'],
      href: '/innovation/graph',
      color: 'from-purple-500 to-blue-500'
    },
    {
      id: 'tabs',
      title: 'Onglets Métaphoriques',
      icon: Layout,
      description: 'Interface inspirée des navigateurs web',
      explanation: 'Comme sur un navigateur web, ouvrez plusieurs symboles dans des onglets. Comparez, naviguez entre eux, créez votre propre parcours de découverte.',
      benefits: ['Multitâche culturel', 'Comparaison facile', 'Personnalisation'],
      href: '/innovation/tabs',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'gamify',
      title: 'Progression Gamifiée',
      icon: Trophy,
      description: 'Système de progression et achievements',
      explanation: 'Transformez votre apprentissage en aventure ! Gagnez des points, débloquez des badges, progressez de novice à expert dans différentes cultures.',
      benefits: ['Motivation accrue', 'Progression claire', 'Récompenses'],
      href: '/innovation/gamify',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'immersion',
      title: 'Exploration Immersive',
      icon: Compass,
      description: 'Terrier de lapin interactif',
      explanation: 'Plongez dans un "terrier de lapin" culturel. Chaque découverte révèle de nouveaux chemins d\'exploration, comme Alice au pays des merveilles.',
      benefits: ['Immersion totale', 'Découverte naturelle', 'Profondeur infinie'],
      href: '/innovation/immersion',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'timeline',
      title: 'Timeline Vivante',
      icon: Clock,
      description: 'Navigation temporelle intelligente',
      explanation: 'Voyagez dans le temps ! Suivez l\'évolution des symboles à travers les époques, des origines antiques aux interprétations modernes.',
      benefits: ['Perspective historique', 'Évolution visible', 'Contexte temporel'],
      href: '/innovation/timeline',
      color: 'from-green-500 to-emerald-500'
    },
  ];

  const useCases = [
    {
      icon: Target,
      title: 'Recherche Académique',
      description: 'Explorez les connexions entre cultures pour vos travaux de recherche'
    },
    {
      icon: Brain,
      title: 'Apprentissage Personnel',
      description: 'Découvrez votre style d\'exploration préféré pour mieux apprendre'
    },
    {
      icon: Users,
      title: 'Enseignement',
      description: 'Utilisez ces outils pour captiver vos étudiants avec la culture'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <Lightbulb className="h-12 w-12 text-purple-600" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Zap className="h-3 w-3 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Laboratoire d'Innovation
            </h1>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-pulse">
              Beta
            </Badge>
          </div>
          
          <p className="text-2xl text-muted-foreground max-w-4xl mx-auto mb-8">
            Découvrez <strong>5 nouvelles façons révolutionnaires</strong> d'explorer les symboles culturels. 
            Chaque approche offre une expérience unique pour transformer votre apprentissage.
          </p>

          <div className="bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 rounded-lg p-6 max-w-3xl mx-auto">
            <h3 className="text-lg font-semibold text-amber-800 mb-2">
              🎯 Pourquoi ces innovations ?
            </h3>
            <p className="text-amber-700">
              Nous avons identifié que chaque personne apprend différemment. Certains préfèrent les connexions visuelles, 
              d'autres la progression structurée, ou encore l'exploration libre. Ces 5 approches couvrent tous les styles d'apprentissage.
            </p>
          </div>
        </div>

        {/* Innovation Cards */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {innovations.map((innovation) => (
            <Card key={innovation.id} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className={`absolute inset-0 bg-gradient-to-br ${innovation.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
              
              <CardHeader className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${innovation.color} text-white`}>
                    <innovation.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{innovation.title}</CardTitle>
                    <CardDescription className="text-sm font-medium text-purple-600">
                      {innovation.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {innovation.explanation}
                </p>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-slate-700">Avantages clés :</h4>
                  <div className="flex flex-wrap gap-2">
                    {innovation.benefits.map((benefit) => (
                      <Badge key={benefit} variant="secondary" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Link to={innovation.href}>
                  <Button className="w-full group-hover:scale-105 transition-transform">
                    Essayer cette approche
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Use Cases */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Cas d'Usage Pratiques
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <useCase.icon className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                  <h3 className="text-lg font-semibold mb-2">{useCase.title}</h3>
                  <p className="text-muted-foreground text-sm">{useCase.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à Révolutionner Votre Exploration ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Choisissez l'approche qui vous correspond le mieux et transformez votre façon d'apprendre
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/innovation/graph">
              <Button size="lg" variant="secondary" className="min-w-[200px]">
                Commencer par les Graphes
                <Network className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/innovation/gamify">
              <Button size="lg" variant="outline" className="min-w-[200px] bg-white/10 hover:bg-white/20 text-white border-white/30">
                Ou la Gamification
                <Trophy className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InnovationHomePage;
