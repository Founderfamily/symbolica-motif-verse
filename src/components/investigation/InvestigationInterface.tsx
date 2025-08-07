
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity,
  MessageSquare,
  Scan,
  Brain,
  MapPin,
  Archive,
  Sparkles,
  Users,
  Compass,
  Shield,
  Play,
  Star,
  BookOpen,
  Target,
  Database,
  TrendingUp
} from 'lucide-react';
import { TreasureQuest } from '@/types/quests';
import { useQuestParticipantsSimple } from '@/hooks/useQuestParticipantsSimple';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';
import { useAuth } from '@/hooks/useAuth';
import EnhancedLiveActivityFeed from './EnhancedLiveActivityFeed';
import EnhancedCluesTab from './EnhancedCluesTab';
import AIInvestigationTab from './AIInvestigationTab';
import InteractiveMapTab from './InteractiveMapTab';
import ArchivesTab from './ArchivesTab';
import HistoricalFiguresTab from './HistoricalFiguresTab';
import ContributeEvidenceDialog from '../quests/ContributeEvidenceDialog';
import ExplorationJournal from './ExplorationJournal';
import { ArchiveMapProvider } from '@/contexts/ArchiveMapContext';
import TreasureProbabilityWidget from '@/components/quest/TreasureProbabilityWidget';
import SourceTrackingWidget from '@/components/quest/SourceTrackingWidget';
import LogicalProgressionInterface from '@/components/quest/LogicalProgressionInterface';
import EnhancedChatInterface from '@/components/quest/EnhancedChatInterface';
import ClueVotingSystem from '@/components/quest/ClueVotingSystem';

interface InvestigationInterfaceProps {
  quest: TreasureQuest;
}

const InvestigationInterface: React.FC<InvestigationInterfaceProps> = ({ quest }) => {
  const [activeTab, setActiveTab] = useState('journal');
  const [aiAssistantActive, setAiAssistantActive] = useState(false);

  const { participants } = useQuestParticipantsSimple(quest.id);
  const aiAnalysis = useAIAnalysis();
  const { isAdmin } = useAuth();

  const handleAIAnalysis = async () => {
    try {
      await aiAnalysis.mutateAsync({ 
        questId: quest.id, 
        analysisType: 'general' 
      });
    } catch (error) {
      console.error('Erreur analyse IA:', error);
    }
  };

  // Mock data pour les composants (à remplacer par de vraies données)
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

  const mockProbabilityClues = [
    {
      id: '1',
      content: 'Salamandre sculptée dans la galerie François Ier',
      votes: { true: 8, false: 0 },
      validation_score: 0.87
    }
  ];

  const mockVotingClues = [
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

  const mockMessages = [
    {
      id: '1',
      type: 'user' as const,
      user: 'Expert Historien',
      content: 'Bonjour à tous, je viens de découvrir des documents fascinants...',
      timestamp: new Date(),
      attachedClues: [],
      aiSuggestion: null
    }
  ];

  const mockProgressClues = [
    {
      id: '1',
      title: 'Découverte de la salamandre',
      description: 'Symbole royal de François Ier identifié',
      status: 'completed' as const,
      dependencies: [],
      unlocks: ['2'],
      unlockInfo: 'Premier indice découvert',
      validation_score: 0.87,
      required_for_map: false
    },
    {
      id: '2', 
      title: 'Analyse architecturale',
      description: 'Étude des modifications Renaissance',
      status: 'available' as const,
      dependencies: ['1'],
      unlocks: [],
      unlockInfo: 'Accessible après validation du premier indice',
      validation_score: 0,
      required_for_map: true
    }
  ];

  const mockQuestProgress = {
    totalClues: 2,
    completedClues: 1,
    mapUnlocked: false,
    finalStageUnlocked: false
  };

  const mockAvailableClues = [
    {
      id: 1,
      title: 'Salamandre de François Ier',
      description: 'Salamandre sculptée dans la galerie François Ier',
      content: 'Salamandre sculptée dans la galerie François Ier',
      hint: 'Cherchez le symbole royal',
      validation_type: 'photo' as const,
      validation_data: {}
    }
  ];

  return (
    <ArchiveMapProvider>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-slate-100">
        
        {/* Widget de probabilité au niveau global */}
        <div className="p-6 pb-0">
          <TreasureProbabilityWidget 
            questId={quest.id}
            sources={mockSources}
            clues={mockProbabilityClues}
            onProbabilityChange={(prob) => console.log('Probabilité:', prob)}
          />
        </div>

        {/* Interface à onglets restructurée */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="inline-flex w-[calc(100%-3rem)] justify-evenly bg-white/80 backdrop-blur-sm border border-amber-200 rounded-xl shadow-lg m-6 mb-0 px-2 py-2">
            <TabsTrigger 
              value="journal" 
              className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900 data-[state=active]:shadow-md transition-all duration-200 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Journal</span>
              <Badge variant="secondary" className="ml-1 text-xs">4</Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="clues" 
              className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900 data-[state=active]:shadow-md transition-all duration-200 flex items-center gap-2"
            >
              <Scan className="w-4 h-4" />
              <span className="hidden sm:inline">Indices</span>
              <Badge variant="secondary" className="ml-1 text-xs">{mockVotingClues.length}</Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="chat" 
              className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900 data-[state=active]:shadow-md transition-all duration-200 flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Chat</span>
              <Badge variant="secondary" className="ml-1 text-xs">3</Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="investigation" 
              className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900 data-[state=active]:shadow-md transition-all duration-200 flex items-center gap-2"
            >
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">Investigation</span>
              <Badge variant="secondary" className="ml-1 text-xs">{mockSources.length}</Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="map" 
              className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900 data-[state=active]:shadow-md transition-all duration-200 flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Carte</span>
            </TabsTrigger>
            <TabsTrigger 
              value="personnages" 
              className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900 data-[state=active]:shadow-md transition-all duration-200 flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Personnages</span>
            </TabsTrigger>
            <TabsTrigger 
              value="archives" 
              className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900 data-[state=active]:shadow-md transition-all duration-200 flex items-center gap-2"
            >
              <Archive className="w-4 h-4" />
              <span className="hidden sm:inline">Archives</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="journal" className="space-y-4 p-6">
            <LogicalProgressionInterface 
              clues={mockProgressClues}
              questProgress={mockQuestProgress}
              onClueActivate={(clueId) => console.log('Activer indice:', clueId)}
              onMapAccess={() => setActiveTab('map')}
              onFinalStage={() => console.log('Étape finale')}
            />
          </TabsContent>

          <TabsContent value="clues" className="space-y-4 p-6">
            <ClueVotingSystem 
              clues={mockVotingClues}
              onVote={(clueId, voteType) => console.log('Vote:', clueId, voteType)}
              onUnlock={(clueId) => console.log('Débloquer:', clueId)}
            />
          </TabsContent>

          <TabsContent value="chat" className="space-y-4 p-6">
            <EnhancedChatInterface 
              questId={quest.id}
              messages={mockMessages}
              availableClues={mockAvailableClues}
              onSendMessage={(message, clues) => console.log('Message:', message, clues)}
              onAISuggestion={async (content) => {
                console.log('Suggestion IA:', content);
                return 'Suggestion générée';
              }}
            />
          </TabsContent>

          <TabsContent value="investigation" className="space-y-4 p-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <SourceTrackingWidget 
                questId={quest.id}
                sources={mockSources}
                onSourceAdd={(source) => console.log('Nouvelle source:', source)}
                onSourceVote={(sourceId, voteType) => console.log('Vote source:', sourceId, voteType)}
              />
              <AIInvestigationTab quest={quest} />
            </div>
          </TabsContent>

          <TabsContent value="map" className="space-y-4 p-6">
            <InteractiveMapTab quest={quest} activeTab={activeTab} setActiveTab={setActiveTab} />
          </TabsContent>

          <TabsContent value="personnages" className="space-y-4 p-6">
            <HistoricalFiguresTab questId={quest.id} />
          </TabsContent>

          <TabsContent value="archives" className="space-y-4 p-6">
            <ArchivesTab quest={quest} activeTab={activeTab} setActiveTab={setActiveTab} />
          </TabsContent>
        </Tabs>
      </div>
    </ArchiveMapProvider>
  );
};

export default InvestigationInterface;
