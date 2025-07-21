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
  Award
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
      title: "Publications et Recherches",
      description: "Articles peer-reviewed et études comparatives",
      icon: FileText,
      action: () => navigate('/research'),
      badge: "50+ publications"
    },
    {
      title: "Outils d'Analyse IA",
      description: "Intelligence artificielle pour l'analyse symbolique avancée",
      icon: Cpu,
      action: () => navigate('/analysis'),
      badge: "IA avancée"
    },
    {
      title: "Collaboration Recherche",
      description: "Réseau de chercheurs et institutions partenaires",
      icon: Users,
      action: () => navigate('/community'),
      badge: "500+ chercheurs"
    },
    {
      title: "Données Ouvertes",
      description: "API et datasets pour vos recherches",
      icon: Download,
      action: () => navigate('/api-docs'),
      badge: "Open Data"
    },
    {
      title: "Métriques et Analytics",
      description: "Statistiques détaillées et analyses quantitatives",
      icon: BarChart3,
      action: () => navigate('/analytics'),
      badge: "Métriques"
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
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => navigate('/scientific-credentials')}
            >
              Voir nos Certifications
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-600"
              onClick={() => navigate('/contact')}
            >
              Collaborer avec nous
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParcoursAcademique;