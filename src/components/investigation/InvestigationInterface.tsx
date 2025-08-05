
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  BookOpen
} from 'lucide-react';
import { TreasureQuest } from '@/types/quests';
import { useQuestParticipantsSimple } from '@/hooks/useQuestParticipantsSimple';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';
import { useAuth } from '@/hooks/useAuth';
import EnhancedLiveActivityFeed from './EnhancedLiveActivityFeed';
import EnhancedCluesTab from './EnhancedCluesTab';
import AIEnhancedChatTab from './AIEnhancedChatTab';
import AIInvestigationTab from './AIInvestigationTab';
import InteractiveMapTab from './InteractiveMapTab';
import ArchivesTab from './ArchivesTab';
import HistoricalFiguresTab from './HistoricalFiguresTab';
import ContributeEvidenceDialog from '../quests/ContributeEvidenceDialog';
import ExplorationJournal from './ExplorationJournal';
import { ArchiveMapProvider } from '@/contexts/ArchiveMapContext';

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

  return (
    <ArchiveMapProvider>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-slate-100">
        {/* Interface à onglets - Style Journal */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex w-full flex-wrap bg-white/80 backdrop-blur-sm border border-amber-200 rounded-xl shadow-lg m-6 mb-0">
            <TabsTrigger 
              value="journal" 
              className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900 data-[state=active]:shadow-md transition-all duration-200 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Journal</span>
            </TabsTrigger>
            <TabsTrigger 
              value="clues" 
              className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900 data-[state=active]:shadow-md transition-all duration-200 flex items-center gap-2"
            >
              <Scan className="w-4 h-4" />
              <span className="hidden sm:inline">Indices</span>
            </TabsTrigger>
            <TabsTrigger 
              value="chat" 
              className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900 data-[state=active]:shadow-md transition-all duration-200 flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Chat IA</span>
            </TabsTrigger>
            <TabsTrigger 
              value="investigation" 
              className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900 data-[state=active]:shadow-md transition-all duration-200 flex items-center gap-2"
            >
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">Investigation</span>
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

          <TabsContent value="journal" className="space-y-4">
            <ExplorationJournal quest={quest} />
          </TabsContent>

          <TabsContent value="clues" className="space-y-4 p-6">
            <EnhancedCluesTab quest={quest} />
          </TabsContent>

          <TabsContent value="chat" className="space-y-4 p-6">
            <AIEnhancedChatTab questId={quest.id} questName={quest.title} />
          </TabsContent>

          <TabsContent value="investigation" className="space-y-4 p-6">
            <AIInvestigationTab quest={quest} />
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
