import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Award, 
  Building2, 
  FileText, 
  Users, 
  Microscope, 
  BookOpen,
  ExternalLink,
  Calendar,
  Euro
} from 'lucide-react';

export const ScientificCredibility = () => {
  const funding = [
    {
      title: "Appel à Projets ANR - Patrimoine Numérique",
      agency: "Agence Nationale de la Recherche",
      amount: "150 000 €",
      status: "En cours",
      description: "Financement pour la digitalisation et l'analyse IA du patrimoine symbolique",
      year: "2024-2026"
    },
    {
      title: "Programme Horizon Europe - MSCA",
      agency: "Commission Européenne",
      amount: "250 000 €",
      status: "Approuvé",
      description: "Recherche collaborative sur les symboles culturels transnationaux",
      year: "2023-2025"
    },
    {
      title: "DRAC - Mission Patrimoine",
      agency: "Ministère de la Culture",
      amount: "75 000 €",
      status: "Finalisé",
      description: "Inventaire numérique des symboles architecturaux français",
      year: "2022-2023"
    }
  ];

  const partners = [
    {
      name: "CNRS - Centre National de la Recherche Scientifique",
      type: "Partenaire Recherche",
      logo: "🏛️"
    },
    {
      name: "Université Sorbonne Paris Cité",
      type: "Partenaire Académique",
      logo: "🎓"
    },
    {
      name: "Ministère de la Culture",
      type: "Institution Publique",
      logo: "🏛️"
    },
    {
      name: "Institut National du Patrimoine",
      type: "Expertise Patrimoine",
      logo: "🏺"
    }
  ];

  const publications = [
    {
      title: "IA et Analyse Symbolique : Nouvelles Méthodologies",
      journal: "Digital Heritage Quarterly",
      year: "2024",
      impact: "Q1"
    },
    {
      title: "Cartographie Numérique du Patrimoine Symbolique Européen",
      journal: "Journal of Cultural Computing",
      year: "2023",
      impact: "Q2"
    },
    {
      title: "Approches Collaboratives en Archéologie Numérique",
      journal: "Archaeological Computing Review",
      year: "2023",
      impact: "Q1"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Microscope className="h-8 w-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">Excellence Scientifique</h2>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Symbolica est reconnu par les institutions académiques et soutenu par des financements publics 
            pour ses contributions à la recherche en patrimoine culturel numérique
          </p>
        </div>

        {/* Financements et Appels à Projets */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-8">
            <Euro className="h-6 w-6 text-green-600" />
            <h3 className="text-2xl font-semibold text-gray-900">Financements Publics</h3>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              +475K€ obtenus
            </Badge>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {funding.map((project, index) => (
              <Card key={index} className="border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg leading-tight">{project.title}</CardTitle>
                    <Badge 
                      variant={project.status === 'Approuvé' ? 'default' : 
                              project.status === 'En cours' ? 'secondary' : 'outline'}
                      className="ml-2"
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <CardDescription className="font-medium text-blue-600">
                    {project.agency}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Montant:</span>
                      <span className="font-bold text-green-600">{project.amount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Période:</span>
                      <span className="text-sm font-medium">{project.year}</span>
                    </div>
                    <p className="text-sm text-gray-700">{project.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Partenaires Institutionnels */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-8">
            <Building2 className="h-6 w-6 text-blue-600" />
            <h3 className="text-2xl font-semibold text-gray-900">Partenaires Institutionnels</h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partners.map((partner, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-4xl mb-3">{partner.logo}</div>
                  <h4 className="font-semibold text-gray-900 mb-2 leading-tight">{partner.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {partner.type}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Publications Scientifiques */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-8">
            <BookOpen className="h-6 w-6 text-purple-600" />
            <h3 className="text-2xl font-semibold text-gray-900">Publications Scientifiques</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {publications.map((pub, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge 
                      variant={pub.impact === 'Q1' ? 'default' : 'secondary'}
                      className={pub.impact === 'Q1' ? 'bg-purple-600' : 'bg-purple-400'}
                    >
                      {pub.impact}
                    </Badge>
                    <span className="text-sm text-gray-500">{pub.year}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2 leading-tight">{pub.title}</h4>
                  <p className="text-sm text-blue-600 font-medium">{pub.journal}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action Scientifique */}
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg border">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Rejoignez la Communauté Scientifique
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Collaborez avec nos chercheurs, accédez aux données de recherche ouvertes, 
            et contribuez à l'avancement des connaissances en patrimoine culturel numérique
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <FileText className="h-4 w-4 mr-2" />
              Accéder aux Publications
            </Button>
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Proposer une Collaboration
            </Button>
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Données Ouvertes
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};