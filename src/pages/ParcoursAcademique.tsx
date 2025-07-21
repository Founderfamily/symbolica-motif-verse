import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Microscope, 
  Database, 
  FileText, 
  Users, 
  Search,
  BarChart3,
  Download,
  Cpu,
  Award,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ParcoursAcademique = () => {
  const navigate = useNavigate();

  const academicFeatures = [
    {
      title: "Base de Données Scientifique",
      description: "Accès à plus de 25,000 symboles documentés avec sources académiques",
      icon: Database,
      action: () => navigate('/symbols'),
      badge: "25K+ symboles"
    },
    {
      title: "Collections Thématiques",
      description: "Collections organisées par périodes, cultures et thèmes",
      icon: BookOpen,
      action: () => navigate('/collections'),
      badge: "50+ collections"
    },
    {
      title: "Laboratoire Innovation",
      description: "Expérimentez les nouvelles approches de visualisation",
      icon: Microscope,
      action: () => navigate('/innovation'),
      badge: "Lab R&D"
    },
    {
      title: "Outils d'Analyse",
      description: "Analysez les patterns et connexions entre symboles",
      icon: BarChart3,
      action: () => navigate('/analysis'),
      badge: "Analytics"
    },
    {
      title: "Recherche Avancée",
      description: "Moteur de recherche sémantique et filtres précis",
      icon: Search,
      action: () => navigate('/search'),
      badge: "IA Search"
    },
    {
      title: "Timeline Historique",
      description: "Explorez l'évolution des symboles à travers les époques",
      icon: Cpu,
      action: () => navigate('/symbols/timeline'),
      badge: "5000 ans"
    }
  ];

  const researchAreas = [
    "Iconographie Comparative",
    "Anthropologie Symbolique", 
    "Archéologie Numérique",
    "Sémiologie Culturelle",
    "Histoire des Religions",
    "Art et Patrimoine"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Microscope className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Parcours Académique</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Plateforme de recherche scientifique dédiée à l'étude rigoureuse des symboles culturels. 
            Accédez aux outils, données et collaborations nécessaires pour vos travaux académiques.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Recherche Scientifique
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Peer-Reviewed
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              Open Science
            </Badge>
          </div>
        </div>

        {/* Academic Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {academicFeatures.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <feature.icon className="h-8 w-8 text-blue-600 group-hover:text-blue-700" />
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
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Accéder
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Innovation Lab Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Microscope className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Laboratoire d'Innovation</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Explorez nos approches expérimentales de visualisation et d'analyse des données symboliques
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="p-4 h-auto flex-col gap-2"
              onClick={() => navigate('/innovation/graph')}
            >
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm font-medium">Visualisation Graphique</span>
            </Button>
            <Button 
              variant="outline" 
              className="p-4 h-auto flex-col gap-2"
              onClick={() => navigate('/innovation/tabs')}
            >
              <Database className="h-6 w-6" />
              <span className="text-sm font-medium">Interface Avancée</span>
            </Button>
            <Button 
              variant="outline" 
              className="p-4 h-auto flex-col gap-2"
              onClick={() => navigate('/innovation/immersion')}
            >
              <Cpu className="h-6 w-6" />
              <span className="text-sm font-medium">Expérience Immersive</span>
            </Button>
            <Button 
              variant="outline" 
              className="p-4 h-auto flex-col gap-2"
              onClick={() => navigate('/innovation/timeline')}
            >
              <Clock className="h-6 w-6" />
              <span className="text-sm font-medium">Timeline Innovation</span>
            </Button>
          </div>
        </div>

        {/* Research Areas */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-16">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Domaines de Recherche</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {researchAreas.map((area, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Search className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-gray-800">{area}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scientific Credentials */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Award className="h-8 w-8" />
            <h2 className="text-2xl font-semibold">Reconnaissance Scientifique</h2>
          </div>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Symbolica est reconnu par les institutions académiques internationales et soutenu 
            par des financements publics de recherche (ANR, Horizon Europe, DRAC).
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              className="bg-white text-blue-600 hover:bg-blue-50 hover-scale"
              onClick={() => navigate('/')}
            >
              Voir Excellence Scientifique
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-600 hover-scale"
              onClick={() => navigate('/community')}
            >
              Rejoindre la Communauté
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParcoursAcademique;