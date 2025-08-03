import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Search, Lightbulb, Network } from 'lucide-react';
import { TreasureQuest } from '@/types/quests';
import { useProactiveAI } from '@/hooks/useProactiveAI';

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
      console.log('🔍 Démarrage investigation complète pour:', quest.id);
      const result = await startProactiveInvestigation({ questId: quest.id, questData: quest });
      console.log('📊 Résultat investigation reçu:', result);
      
      if (result && result.investigation) {
        setInvestigationResult(result.investigation);
        console.log('✅ Investigation stockée avec succès');
      } else {
        console.warn('⚠️ Pas de contenu investigation dans la réponse:', result);
        setInvestigationResult("Aucun résultat d'investigation généré");
      }
    } catch (error) {
      console.error('❌ Erreur investigation:', error);
      setInvestigationResult(`Erreur: ${error.message}`);
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
    </div>
  );
};

export default AIInvestigationTab;