
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
  Star
} from 'lucide-react';
import { TreasureQuest } from '@/types/quests';
import { useQuestParticipantsSimple } from '@/hooks/useQuestParticipantsSimple';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';
import { useAuth } from '@/hooks/useAuth';
import EnhancedLiveActivityFeed from './EnhancedLiveActivityFeed';
import EnhancedCluesTab from './EnhancedCluesTab';
import AIEnhancedChatTab from './AIEnhancedChatTab';
import AIInvestigationTab from './AIInvestigationTab';
import EnhancedMapTab from './EnhancedMapTab';
import ArchivesTab from './ArchivesTab';
import ContributeEvidenceDialog from '../quests/ContributeEvidenceDialog';

interface InvestigationInterfaceProps {
  quest: TreasureQuest;
}

const InvestigationInterface: React.FC<InvestigationInterfaceProps> = ({ quest }) => {
  const [activeTab, setActiveTab] = useState('live');
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
    <div className="space-y-6">
      {/* En-tête de l'interface */}
      <div className="bg-gradient-to-br from-slate-50 to-stone-100 rounded-2xl border border-stone-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-slate-600 rounded-xl flex items-center justify-center">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Centre d'Investigation
              </h1>
              <p className="text-slate-600 text-sm">
                <span className="inline-flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {participants.length} explorateurs actifs
                </span>
                <span className="mx-3">•</span>
                <span className="inline-flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Analyse IA disponible
                </span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <ContributeEvidenceDialog questId={quest.id} />
            {isAdmin && (
              <Button 
                onClick={handleAIAnalysis}
                disabled={aiAnalysis.isPending}
                variant="outline"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {aiAnalysis.isPending ? 'Analyse...' : 'Analyse IA'}
              </Button>
            )}
          </div>
        </div>
        
        {/* Statistiques de la quête */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-slate-600" />
              <span className="text-slate-700 text-sm font-medium">Statut</span>
            </div>
            <div className="text-sm font-bold text-slate-800 capitalize">{quest.status}</div>
            <div className="text-slate-600 text-xs flex items-center gap-1">
              <Play className="w-3 h-3" />
              En cours
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-slate-600" />
              <span className="text-slate-700 text-sm font-medium">Type</span>
            </div>
            <div className="text-sm font-bold text-slate-800 capitalize">{quest.quest_type.replace('_', ' ')}</div>
            <div className="text-slate-600 text-xs flex items-center gap-1">
              <Star className="w-3 h-3" />
              {quest.difficulty_level}
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Scan className="w-4 h-4 text-slate-600" />
              <span className="text-slate-700 text-sm font-medium">Indices</span>
            </div>
            <div className="text-xl font-bold text-slate-800">{quest.clues?.length || 0}</div>
            <div className="text-slate-600 text-xs flex items-center gap-1">
              <Archive className="w-3 h-3" />
              Disponibles
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-slate-600" />
              <span className="text-slate-700 text-sm font-medium">Participants</span>
            </div>
            <div className="text-xl font-bold text-slate-800">{participants.length}</div>
            <div className="text-green-600 text-xs flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Actifs
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-slate-600" />
              <span className="text-slate-700 text-sm font-medium">Lieux</span>
            </div>
            <div className="text-xl font-bold text-slate-800">4</div>
            <div className="text-slate-600 text-xs flex items-center gap-1">
              <Star className="w-3 h-3" />
              Identifiés
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-slate-600" />
              <span className="text-slate-700 text-sm font-medium">IA</span>
            </div>
            <div className="text-xl font-bold text-slate-800">Prêt</div>
            <div className="text-slate-600 text-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Assistant actif
            </div>
          </div>
        </div>
      </div>

      {/* Interface à onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6 bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
          <TabsTrigger value="live" className="flex items-center gap-2 data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-lg">
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">Live</span>
          </TabsTrigger>
          <TabsTrigger value="clues" className="flex items-center gap-2 data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-lg">
            <Scan className="w-4 h-4" />
            <span className="hidden sm:inline">Indices</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2 data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-lg">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Chat</span>
          </TabsTrigger>
          <TabsTrigger value="investigation" className="flex items-center gap-2 data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-lg">
            <Brain className="w-4 h-4" />
            <span className="hidden sm:inline">Investigation IA</span>
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2 data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-lg">
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">Carte</span>
          </TabsTrigger>
          <TabsTrigger value="archives" className="flex items-center gap-2 data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-lg">
            <Archive className="w-4 h-4" />
            <span className="hidden sm:inline">Archives</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-4">
          <EnhancedLiveActivityFeed questId={quest.id} />
        </TabsContent>

        <TabsContent value="clues" className="space-y-4">
          <EnhancedCluesTab quest={quest} />
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <AIEnhancedChatTab questId={quest.id} questName={quest.title} />
        </TabsContent>

        <TabsContent value="investigation" className="space-y-4">
          <AIInvestigationTab quest={quest} />
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <EnhancedMapTab quest={quest} />
        </TabsContent>

        <TabsContent value="archives" className="space-y-4">
          <ArchivesTab quest={quest} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvestigationInterface;
