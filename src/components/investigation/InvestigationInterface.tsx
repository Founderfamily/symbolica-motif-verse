import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TreasureQuest } from '@/types/quests';
import { useQuestParticipantsSimple } from '@/hooks/useQuestParticipantsSimple';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Map, BookOpen, FileText, MessageCircle, Search, User, Archive } from 'lucide-react';
import TreasureProbabilityWidget from './TreasureProbabilityWidget';
import ChronologicalJournal from './ChronologicalJournal';
import ClueVotingSystem from './ClueVotingSystem';
import EnhancedChatInterface from './EnhancedChatInterface';
import SourceTrackingWidget from './SourceTrackingWidget';
import AIInvestigationTab from './AIInvestigationTab';
import InteractiveMapTab from './InteractiveMapTab';
import HistoricalFiguresTab from './HistoricalFiguresTab';
import ArchivesTab from './ArchivesTab';

interface InvestigationInterfaceProps {
  quest: TreasureQuest;
}

const InvestigationInterface: React.FC<InvestigationInterfaceProps> = ({ quest }) => {
  const [activeTab, setActiveTab] = useState('carte');
  const [currentProbability, setCurrentProbability] = useState(42);

  const { participants } = useQuestParticipantsSimple(quest.id);
  const aiAnalysisMutation = useAIAnalysis();
  const { isAdmin } = useAuth();

  const handleAIAnalysis = () => {
    if (quest?.id) {
      aiAnalysisMutation.mutate({ questId: quest.id });
    }
  };

  const handleNavigateToTab = (tab: string, data?: any) => {
    setActiveTab(tab);
    console.log('Navigation vers:', tab, 'avec données:', data);
  };

  // Mock data pour les composants
  const mockSources = [
    {
      id: '1',
      type: 'documentary' as const,
      title: 'Archives du Château de Fontainebleau',
      content: 'Documents historiques sur François Ier',
      url: 'https://example.com',
      location: 'Archives Nationales',
      submitted_by: 'expert_historian',
      submitted_at: new Date(),
      verified: true,
      confidence: 0.95,
      votes: 13
    }
  ];

  const mockClues = [
    {
      id: 1,
      title: 'Salamandre de François Ier',
      description: 'Salamandre sculptée dans la galerie François Ier',
      content: 'Salamandre sculptée dans la galerie François Ier',
      hint: 'Cherchez le symbole royal',
      validation_type: 'photo' as const,
      validation_data: {},
      votes: { true: 8, false: 0 },
      validation_score: 0.87,
      userVote: undefined as any,
      consensus_reached: true,
      validation_threshold: 0.8,
      comments: []
    }
  ];

  return (
    <div className="space-y-6">
      {/* Widget de probabilité visible en permanence */}
      <TreasureProbabilityWidget
        questId={quest.id}
        currentProbability={currentProbability}
        lastUpdate="Il y a 2 heures"
        trend="increasing"
        factors={[
          { name: "Sources historiques", score: 85, change: 5 },
          { name: "Indices géographiques", score: 60, change: -2 },
          { name: "Validation communautaire", score: 75, change: 8 },
          { name: "Analyse IA", score: 90, change: 12 }
        ]}
        onAnalyze={handleAIAnalysis}
        isAnalyzing={aiAnalysisMutation.isPending}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="carte" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            Carte
          </TabsTrigger>
          <TabsTrigger value="journal" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Journal
          </TabsTrigger>
          <TabsTrigger value="indices" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Indices
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="investigation" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Investigation
          </TabsTrigger>
          <TabsTrigger value="personnages" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Personnages
          </TabsTrigger>
          <TabsTrigger value="archives" className="flex items-center gap-2">
            <Archive className="h-4 w-4" />
            Archives
          </TabsTrigger>
        </TabsList>

        <TabsContent value="carte" className="space-y-4">
          <InteractiveMapTab quest={quest} />
        </TabsContent>

        <TabsContent value="journal" className="space-y-4">
          <ChronologicalJournal
            quest={quest}
            onNavigateToTab={handleNavigateToTab}
            currentProbability={currentProbability}
          />
        </TabsContent>

        <TabsContent value="indices" className="space-y-4">
          <ClueVotingSystem
            questId={quest.id}
            clues={mockClues}
            onClueValidated={(clueId, isValid) => {
              console.log('Clue validation:', clueId, isValid);
              if (isValid) {
                setCurrentProbability(prev => Math.min(prev + 5, 100));
              }
            }}
          />
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <EnhancedChatInterface
            questId={quest.id}
            participants={participants || []}
            onAnalysisRequest={handleAIAnalysis}
          />
        </TabsContent>

        <TabsContent value="investigation" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            <SourceTrackingWidget
              questId={quest.id}
              sources={mockSources}
              onSourceAdd={(source) => console.log('Adding source:', source)}
              onSourceValidate={(sourceId, isValid) => {
                console.log('Validating source:', sourceId, isValid);
                if (isValid) {
                  setCurrentProbability(prev => Math.min(prev + 8, 100));
                }
              }}
            />
            <AIInvestigationTab
              quest={quest}
            />
          </div>
        </TabsContent>

        <TabsContent value="personnages" className="space-y-4">
          <HistoricalFiguresTab questId={quest.id} />
        </TabsContent>

        <TabsContent value="archives" className="space-y-4">
          <ArchivesTab quest={quest} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvestigationInterface;