
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuests } from '@/hooks/useQuests';
import { masterExplorerService } from '@/services/masterExplorerService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown, 
  FileText, 
  Camera, 
  Lightbulb, 
  Archive, 
  Users,
  Plus,
  CheckCircle,
  BookOpen,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

const MasterExplorerDashboard = () => {
  const { user } = useAuth();
  const { data: quests } = useQuests();
  const [isMasterExplorer, setIsMasterExplorer] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<string>('');
  const [enrichmentForm, setEnrichmentForm] = useState({
    type: 'evidence' as 'evidence' | 'document' | 'theory' | 'guidance',
    title: '',
    description: '',
    sourceUrl: '',
    credibilityScore: 1.0
  });
  const [isEnriching, setIsEnriching] = useState(false);

  useEffect(() => {
    if (user?.id) {
      masterExplorerService.isMasterExplorer(user.id).then(setIsMasterExplorer);
    }
  }, [user]);

  if (!isMasterExplorer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 text-center">
            <Shield className="w-16 h-16 text-amber-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Accès Master Explorer Requis</h1>
            <p className="text-slate-600">
              Cette section est réservée aux Master Explorers certifiés.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  const handleCreateAccounts = async () => {
    try {
      console.log('Creating Master Explorer accounts...');
      
      // Créer le compte MasterAI
      await masterExplorerService.createMasterExplorerAccount({
        email: 'master@pureplayer.fr',
        password: 'Dzw2022??',
        username: 'MasterAI',
        fullName: 'Master Explorer AI'
      });

      toast.success('Comptes Master Explorer créés avec succès !');
    } catch (error) {
      console.error('Error creating accounts:', error);
      toast.error('Erreur lors de la création des comptes');
    }
  };

  const handleEnrichQuest = async () => {
    if (!selectedQuest || !enrichmentForm.title) {
      toast.error('Veuillez sélectionner une quête et saisir un titre');
      return;
    }

    setIsEnriching(true);
    try {
      await masterExplorerService.enrichQuest({
        questId: selectedQuest,
        enrichmentType: enrichmentForm.type,
        title: enrichmentForm.title,
        description: enrichmentForm.description,
        sourceUrl: enrichmentForm.sourceUrl,
        credibilityScore: enrichmentForm.credibilityScore,
        isOfficial: true
      });

      toast.success('Contenu ajouté avec succès !');
      setEnrichmentForm({
        type: 'evidence',
        title: '',
        description: '',
        sourceUrl: '',
        credibilityScore: 1.0
      });
    } catch (error) {
      console.error('Error enriching quest:', error);
      toast.error('Erreur lors de l\'ajout du contenu');
    } finally {
      setIsEnriching(false);
    }
  };

  const handlePrefillQuest = async (questId: string, questType: string) => {
    try {
      await masterExplorerService.prefillQuestWithHistoricalContent(questId, questType);
      toast.success('Quête pré-remplie avec du contenu historique !');
    } catch (error) {
      console.error('Error prefilling quest:', error);
      toast.error('Erreur lors du pré-remplissage');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="w-8 h-8 text-amber-600" />
            <h1 className="text-4xl font-bold text-slate-800">Dashboard Master Explorer</h1>
            <Badge className="bg-amber-100 text-amber-800">
              Accès Expert
            </Badge>
          </div>
          <p className="text-lg text-slate-600">
            Outils avancés pour enrichir et guider les recherches historiques collaboratives
          </p>
        </div>

        <Tabs defaultValue="enrich" className="space-y-6">
          <TabsList className="bg-white/90 backdrop-blur-sm border border-amber-200/50">
            <TabsTrigger value="enrich" className="px-6 py-3">
              <Plus className="w-4 h-4 mr-2" />
              Enrichir Quêtes
            </TabsTrigger>
            <TabsTrigger value="manage" className="px-6 py-3">
              <Users className="w-4 h-4 mr-2" />
              Gestion Comptes
            </TabsTrigger>
            <TabsTrigger value="quests" className="px-6 py-3">
              <BookOpen className="w-4 h-4 mr-2" />
              Pré-remplissage
            </TabsTrigger>
          </TabsList>

          {/* Onglet Enrichissement */}
          <TabsContent value="enrich">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Formulaire d'enrichissement */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Ajouter du Contenu Expert</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Quête à enrichir</label>
                    <select
                      value={selectedQuest}
                      onChange={(e) => setSelectedQuest(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    >
                      <option value="">Sélectionner une quête</option>
                      {quests?.map((quest) => (
                        <option key={quest.id} value={quest.id}>
                          {quest.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Type de contenu</label>
                    <select
                      value={enrichmentForm.type}
                      onChange={(e) => setEnrichmentForm(prev => ({ 
                        ...prev, 
                        type: e.target.value as typeof prev.type 
                      }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    >
                      <option value="evidence">Preuve/Évidence</option>
                      <option value="document">Document Historique</option>
                      <option value="theory">Théorie Expert</option>
                      <option value="guidance">Guidance Méthodologique</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Titre</label>
                    <Input
                      value={enrichmentForm.title}
                      onChange={(e) => setEnrichmentForm(prev => ({ 
                        ...prev, 
                        title: e.target.value 
                      }))}
                      placeholder="Titre du contenu expert"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      value={enrichmentForm.description}
                      onChange={(e) => setEnrichmentForm(prev => ({ 
                        ...prev, 
                        description: e.target.value 
                      }))}
                      placeholder="Description détaillée avec contexte historique"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">URL Source</label>
                    <Input
                      value={enrichmentForm.sourceUrl}
                      onChange={(e) => setEnrichmentForm(prev => ({ 
                        ...prev, 
                        sourceUrl: e.target.value 
                      }))}
                      placeholder="https://gallica.bnf.fr/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Score de Crédibilité ({enrichmentForm.credibilityScore})
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={enrichmentForm.credibilityScore}
                      onChange={(e) => setEnrichmentForm(prev => ({ 
                        ...prev, 
                        credibilityScore: parseFloat(e.target.value) 
                      }))}
                      className="w-full"
                    />
                  </div>

                  <Button 
                    onClick={handleEnrichQuest}
                    disabled={isEnriching}
                    className="w-full bg-amber-600 hover:bg-amber-700"
                  >
                    {isEnriching ? 'Ajout en cours...' : 'Ajouter le Contenu Expert'}
                  </Button>
                </div>
              </Card>

              {/* Types de contenu */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Types de Contenu Master Explorer</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Camera className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-medium">Preuves/Évidences</h4>
                      <p className="text-sm text-slate-600">
                        Photos d'archives, documents authentifiés, artefacts historiques
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-medium">Documents Historiques</h4>
                      <p className="text-sm text-slate-600">
                        Manuscrits, chroniques, actes officiels, correspondances
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <h4 className="font-medium">Théories Expert</h4>
                      <p className="text-sm text-slate-600">
                        Hypothèses basées sur l'expertise, analyses critiques
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Archive className="w-5 h-5 text-orange-600 mt-1" />
                    <div>
                      <h4 className="font-medium">Guidance Méthodologique</h4>
                      <p className="text-sm text-slate-600">
                        Conseils de recherche, méthodologie historique, sources fiables
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Gestion des comptes */}
          <TabsContent value="manage">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Créer les Comptes Master Explorer</h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Compte MasterAI</h4>
                  <p className="text-sm text-blue-600 mb-2">master@pureplayer.fr</p>
                  <p className="text-xs text-blue-500">
                    IA spécialisée en recherche historique et pré-remplissage automatique
                  </p>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-medium text-amber-800 mb-2">Compte Admin</h4>
                  <p className="text-sm text-amber-600 mb-2">farid@founderfamily.org</p>
                  <p className="text-xs text-amber-500">
                    Administrateur principal avec privilèges Master Explorer
                  </p>
                </div>
              </div>

              <Button 
                onClick={handleCreateAccounts}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer les Comptes Master Explorer
              </Button>
            </Card>
          </TabsContent>

          {/* Onglet Pré-remplissage */}
          <TabsContent value="quests">
            <div className="grid gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Pré-remplissage Automatique</h3>
                <p className="text-slate-600 mb-6">
                  Enrichir automatiquement les quêtes avec du contenu historique authentique
                </p>
                
                <div className="grid gap-4">
                  {quests?.map((quest) => (
                    <div key={quest.id} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div className="flex-1">
                        <h4 className="font-medium">{quest.title}</h4>
                        <p className="text-sm text-slate-600">{quest.description}</p>
                        <div className="mt-2">
                          <Badge variant="outline">
                            {quest.quest_type}
                          </Badge>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => handlePrefillQuest(quest.id, quest.quest_type)}
                        className="ml-4 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Pré-remplir
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MasterExplorerDashboard;
