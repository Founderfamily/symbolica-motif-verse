
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown, 
  MapPin, 
  FileText, 
  Users, 
  Archive,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useQuests } from '@/hooks/useQuests';
import { useCheckUserRole } from '@/hooks/useRoles';
import { Link } from 'react-router-dom';

export const MasterExplorerDashboard: React.FC = () => {
  const { data: quests } = useQuests();
  const { data: isMasterExplorer } = useCheckUserRole('master_explorer');

  if (!isMasterExplorer) {
    return (
      <div className="text-center py-12">
        <Crown className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-600 mb-2">Accès restreint</h2>
        <p className="text-slate-500">
          Ce tableau de bord est réservé aux Maîtres Explorateurs.
        </p>
      </div>
    );
  }

  const activeQuests = quests?.filter(q => q.status === 'active') || [];
  const upcomingQuests = quests?.filter(q => q.status === 'upcoming') || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Crown className="w-8 h-8 text-purple-600" />
            Tableau de Bord - Maître Explorateur
          </h1>
          <p className="text-slate-600 mt-1">
            Guidez les explorateurs et enrichissez les recherches collaboratives
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MapPin className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-slate-500">Quêtes Actives</p>
                <p className="text-2xl font-bold">{activeQuests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-slate-500">En Préparation</p>
                <p className="text-2xl font-bold">{upcomingQuests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-slate-500">Contributeurs Actifs</p>
                <p className="text-2xl font-bold">1,293</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Archive className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-slate-500">Preuves Validées</p>
                <p className="text-2xl font-bold">2,847</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="active-quests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active-quests">Quêtes Actives</TabsTrigger>
          <TabsTrigger value="content-management">Gestion du Contenu</TabsTrigger>
          <TabsTrigger value="community">Communauté</TabsTrigger>
        </TabsList>

        <TabsContent value="active-quests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Quêtes Nécessitant Votre Attention</span>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Enrichir une Quête
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeQuests.map((quest) => (
                  <div key={quest.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{quest.title}</h3>
                      <p className="text-slate-600 text-sm mb-2">{quest.description}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {quest.clues?.length || 0} indices
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          156 contributeurs
                        </span>
                        <span className="flex items-center gap-1">
                          <Archive className="w-4 h-4" />
                          24 preuves en attente
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={
                        quest.quest_type === 'templar' ? 'bg-red-100 text-red-800' :
                        quest.quest_type === 'grail' ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'
                      }>
                        {quest.quest_type === 'templar' ? 'Templiers' :
                         quest.quest_type === 'grail' ? 'Graal' : 'Civilisation'}
                      </Badge>
                      <Link to={`/quests/${quest.id}`}>
                        <Button variant="outline" size="sm">
                          Superviser
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content-management" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Archive className="w-5 h-5 text-orange-600" />
                  Gestion des Archives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  Ajoutez des documents historiques et des liens d'archives pour enrichir les recherches.
                </p>
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter des Archives
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Validation des Preuves
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  Validez les preuves soumises par la communauté avec votre expertise.
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <FileText className="w-4 h-4 mr-2" />
                  Preuves en Attente (24)
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Outils d'Enrichissement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <MapPin className="w-6 h-6 mb-2" />
                  Ajouter des Lieux
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <FileText className="w-6 h-6 mb-2" />
                  Contextualiser
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <TrendingUp className="w-6 h-6 mb-2" />
                  Analyser Tendances
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="community" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activité de la Communauté</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium">Nouvelle théorie sur les Templiers</p>
                    <p className="text-sm text-slate-600">par @historien_passionné</p>
                  </div>
                  <Button size="sm" variant="outline">Examiner</Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium">Preuve photographique soumise</p>
                    <p className="text-sm text-slate-600">par @explorateur_moderne</p>
                  </div>
                  <Button size="sm" variant="outline">Valider</Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium">Question sur l'interprétation</p>
                    <p className="text-sm text-slate-600">par @chercheur_novice</p>
                  </div>
                  <Button size="sm" variant="outline">Répondre</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
