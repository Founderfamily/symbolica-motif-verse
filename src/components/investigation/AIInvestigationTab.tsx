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
      const result = await startProactiveInvestigation({ questId: quest.id, questData: quest });
      setInvestigationResult(result.investigation || 'Investigation terminée');
    } catch (error) {
      console.error('Erreur investigation:', error);
    }
  };

  const handleSearchSources = async () => {
    try {
      const result = await searchHistoricalSources({ questId: quest.id, questData: quest });
      setSourcesResult(result.sources || 'Recherche terminée');
    } catch (error) {
      console.error('Erreur recherche sources:', error);
    }
  };

  const handleGenerateTheories = async () => {
    try {
      const result = await generateTheories({ questId: quest.id, questData: quest, evidenceData: [] });
      setTheoriesResult(result.theories || 'Théories générées');
    } catch (error) {
      console.error('Erreur génération théories:', error);
    }
  };

  const handleAnalyzeConnections = async () => {
    try {
      const result = await analyzeConnections({ 
        questId: quest.id, 
        questData: quest, 
        evidenceData: [], 
        theoriesData: [] 
      });
      setConnectionsResult(result.connections || 'Analyse terminée');
    } catch (error) {
      console.error('Erreur analyse connexions:', error);
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