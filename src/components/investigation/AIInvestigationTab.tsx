import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Search, Lightbulb, Network, History, Settings } from 'lucide-react';
import { TreasureQuest } from '@/types/quests';
import { useProactiveAI } from '@/hooks/useProactiveAI';
import { AIInvestigationHistory } from './AIInvestigationHistory';
import { AIConnectivityTest } from './AIConnectivityTest';
import AIDebugPanel from './AIDebugPanel';
import HistoricalFiguresWidget from './widgets/HistoricalFiguresWidget';
import AILocationsWidget from './widgets/AILocationsWidget';
import AIConnectionsWidget from './widgets/AIConnectionsWidget';

interface AIInvestigationTabProps {
  quest: TreasureQuest;
}

const AIInvestigationTab: React.FC<AIInvestigationTabProps> = ({ quest }) => {
  const {
    startProactiveInvestigation,
    searchHistoricalSources,
    generateTheories,
    analyzeConnections,
    isInvestigating,
    isSearchingSources,
    isGeneratingTheories,
    isAnalyzingConnections,
  } = useProactiveAI(quest.id);

  const [investigationResult, setInvestigationResult] = useState<string>('');
  const [sourcesResult, setSourcesResult] = useState<string>('');
  const [theoriesResult, setTheoriesResult] = useState<string>('');
  const [connectionsResult, setConnectionsResult] = useState<string>('');

  const handleFullInvestigation = async () => {
    try {
      console.log('🔍 [UI] Démarrage investigation complète pour:', quest.id);
      const result = await startProactiveInvestigation({ questId: quest.id, questData: quest });
      console.log('📊 [UI] Résultat investigation reçu. Clés:', Object.keys(result || {}));
      
      // Gestion ultra-flexible des différents formats de réponse
      let investigationContent = '';
      
      // Essayer plusieurs propriétés possibles pour le contenu
      if (result?.investigation) {
        investigationContent = result.investigation;
      } else if (result?.content) {
        investigationContent = result.content;
      } else if (result?.result) {
        investigationContent = result.result;
      } else if (result?.data) {
        investigationContent = result.data;
      } else if (result?.message && result.message !== 'Investigation générée avec succès') {
        investigationContent = result.message;
      } else if (typeof result === 'string') {
        investigationContent = result;
      } else {
        investigationContent = "Investigation IA générée avec succès mais contenu non accessible. Vérifiez l'historique ou l'onglet Debug.";
      }
      
      // Ajouter des informations contextuelles
      if (result?.auth_required) {
        investigationContent += "\n\n⚠️ Note: Ce résultat n'a pas été sauvegardé car vous n'êtes pas connecté. Connectez-vous pour que vos investigations soient automatiquement sauvegardées dans l'historique.";
      } else if (!result?.saved && result?.save_error) {
        investigationContent += `\n\n❌ Erreur de sauvegarde: ${result.save_error}`;
      } else if (result?.saved) {
        investigationContent += "\n\n✅ Investigation sauvegardée dans l'historique.";
      }
      
      setInvestigationResult(investigationContent);
      console.log('✅ [UI] Investigation affichée avec succès');
      
    } catch (error: any) {
      console.error('❌ [UI] Erreur investigation:', error);
      const errorMessage = `Erreur: ${error.message || 'Erreur inconnue'}\n\nUtilisez l'onglet Debug pour plus d'informations.`;
      setInvestigationResult(errorMessage);
    }
  };

  const handleSearchSources = async () => {
    try {
      console.log('📚 Démarrage recherche sources pour:', quest.id);
      const result = await searchHistoricalSources({ questId: quest.id, questData: quest });
      console.log('📊 Résultat sources reçu:', result);
      
      if (result && result.sources) {
        setSourcesResult(result.sources);
        console.log('✅ Sources stockées avec succès');
      } else {
        console.warn('⚠️ Pas de contenu sources dans la réponse:', result);
        setSourcesResult("Aucune source trouvée");
      }
    } catch (error) {
      console.error('❌ Erreur sources:', error);
      setSourcesResult(`Erreur: ${error.message}`);
    }
  };

  const handleGenerateTheories = async () => {
    try {
      console.log('💡 Démarrage génération théories pour:', quest.id);
      const result = await generateTheories({ questId: quest.id, questData: quest, evidenceData: [] });
      console.log('📊 Résultat théories reçu:', result);
      
      if (result && result.theories) {
        setTheoriesResult(result.theories);
        console.log('✅ Théories stockées avec succès');
      } else {
        console.warn('⚠️ Pas de contenu théories dans la réponse:', result);
        setTheoriesResult("Aucune théorie générée");
      }
    } catch (error) {
      console.error('❌ Erreur théories:', error);
      setTheoriesResult(`Erreur: ${error.message}`);
    }
  };

  const handleAnalyzeConnections = async () => {
    try {
      console.log('🔗 Démarrage analyse connexions pour:', quest.id);
      const result = await analyzeConnections({ 
        questId: quest.id, 
        questData: quest, 
        evidenceData: [], 
        theoriesData: [] 
      });
      console.log('📊 Résultat connexions reçu:', result);
      
      if (result && result.connections) {
        setConnectionsResult(result.connections);
        console.log('✅ Connexions stockées avec succès');
      } else {
        console.warn('⚠️ Pas de contenu connexions dans la réponse:', result);
        setConnectionsResult("Aucune connexion analysée");
      }
    } catch (error) {
      console.error('❌ Erreur connexions:', error);
      setConnectionsResult(`Erreur: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="tools" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tools" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Outils IA
          </TabsTrigger>
          <TabsTrigger value="diagnostics" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Diagnostic
          </TabsTrigger>
          <TabsTrigger value="debug" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Debug
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Historique
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tools" className="space-y-6">
          {/* Widgets d'analyse IA */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <HistoricalFiguresWidget questId={quest.id} />
            <AILocationsWidget questId={quest.id} />
            <AIConnectionsWidget questId={quest.id} />
          </div>

          {/* Investigation IA Avancée */}
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Brain className="h-6 w-6 text-secondary" />
                <div>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                    Investigation IA Avancée
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Outils d'investigation intelligente pour analyser la quête
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
          {/* Boutons d'action IA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={handleFullInvestigation}
              disabled={isInvestigating}
              className="flex items-center gap-2 h-12"
              variant="outline"
            >
              <Search className="h-4 w-4" />
              {isInvestigating ? 'Investigation en cours...' : 'Investigation Complète'}
            </Button>

            <Button
              onClick={handleSearchSources}
              disabled={isSearchingSources}
              className="flex items-center gap-2 h-12"
              variant="outline"
            >
              <Search className="h-4 w-4" />
              {isSearchingSources ? 'Recherche en cours...' : 'Rechercher Sources'}
            </Button>

            <Button
              onClick={handleGenerateTheories}
              disabled={isGeneratingTheories}
              className="flex items-center gap-2 h-12"
              variant="outline"
            >
              <Lightbulb className="h-4 w-4" />
              {isGeneratingTheories ? 'Génération en cours...' : 'Générer Théories'}
            </Button>

            <Button
              onClick={handleAnalyzeConnections}
              disabled={isAnalyzingConnections}
              className="flex items-center gap-2 h-12"
              variant="outline"
            >
              <Network className="h-4 w-4" />
              {isAnalyzingConnections ? 'Analyse en cours...' : 'Analyser Connexions'}
            </Button>
          </div>

          {/* Résultats d'investigation */}
          {investigationResult && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Investigation Complète
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm bg-muted/50 p-4 rounded-md">
                  {investigationResult}
                </div>
              </CardContent>
            </Card>
          )}

          {sourcesResult && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Sources Historiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm bg-muted/50 p-4 rounded-md">
                  {sourcesResult}
                </div>
              </CardContent>
            </Card>
          )}

          {theoriesResult && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Théories Générées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm bg-muted/50 p-4 rounded-md">
                  {theoriesResult}
                </div>
              </CardContent>
            </Card>
          )}

          {connectionsResult && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  Analyse des Connexions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm bg-muted/50 p-4 rounded-md">
                  {connectionsResult}
                </div>
              </CardContent>
            </Card>
          )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagnostics" className="space-y-6">
          <AIConnectivityTest />
        </TabsContent>

        <TabsContent value="debug" className="space-y-6">
          <AIDebugPanel />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <AIInvestigationHistory questId={quest.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIInvestigationTab;