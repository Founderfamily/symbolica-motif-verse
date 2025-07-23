import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Search, 
  MapPin, 
  MessageSquare, 
  Lightbulb,
  History,
  Users,
  Eye,
  Brain,
  Archive,
  Globe,
  Sparkles,
  Zap,
  Target,
  Camera,
  Shield,
  Clock,
  TrendingUp,
  Flame,
  Star,
  Compass,
  Scan,
  ChevronRight,
  Play,
  MessageCircle,
  Share2,
  Heart,
  Bookmark
} from 'lucide-react';
import DocumentsTab from './DocumentsTab';
import EvidenceTab from './EvidenceTab';
import MapTab from './MapTab';
import DiscussionsTab from './DiscussionsTab';
import TheoriesTab from './TheoriesTab';
import AIAnalysisInterface from './AIAnalysisInterface';
import CollaborationHub from './CollaborationHub';
import { TreasureQuest } from '@/types/quests';
import ContributeEvidenceDialog from '../quests/ContributeEvidenceDialog';

interface InvestigationInterfaceProps {
  quest: TreasureQuest;
}

const InvestigationInterface: React.FC<InvestigationInterfaceProps> = ({ quest }) => {
  const [activeTab, setActiveTab] = useState('live');
  const [aiAssistantActive, setAiAssistantActive] = useState(false);

  const isHistoricalQuest = ['templar', 'lost_civilization', 'grail'].includes(quest.quest_type);

  return (
    <div className="space-y-4">
      {/* Live Collaboration Header - Immersive */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-amber-900 to-orange-900 rounded-3xl border border-amber-300/20">
        <div className="absolute inset-0 opacity-20"></div>
        
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Compass className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">
                  Centre d'Investigation IA
                </h1>
                <p className="text-amber-200/80 text-lg">
                  <span className="inline-flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    156 explorateurs connectés
                  </span>
                  <span className="mx-3">•</span>
                  <span className="inline-flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-400" />
                    Recherche active
                  </span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setAiAssistantActive(!aiAssistantActive)}
                className={`bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg ${aiAssistantActive ? 'ring-2 ring-purple-400' : ''}`}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                IA Analyste
              </Button>
              <ContributeEvidenceDialog questId={quest.id} />
            </div>
          </div>
          
          {/* Live Stats Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-5 h-5 text-blue-400" />
                <span className="text-blue-200 text-sm font-medium">Preuves</span>
              </div>
              <div className="text-2xl font-bold text-white">87</div>
              <div className="text-green-400 text-xs flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +5 aujourd'hui
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <span className="text-purple-200 text-sm font-medium">Théories IA</span>
              </div>
              <div className="text-2xl font-bold text-white">23</div>
              <div className="text-amber-400 text-xs flex items-center gap-1">
                <Zap className="w-3 h-3" />
                3 vérifiées
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Archive className="w-5 h-5 text-amber-400" />
                <span className="text-amber-200 text-sm font-medium">Archives</span>
              </div>
              <div className="text-2xl font-bold text-white">32</div>
              <div className="text-blue-400 text-xs flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Historiques
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-red-400" />
                <span className="text-red-200 text-sm font-medium">Pistes Chaudes</span>
              </div>
              <div className="text-2xl font-bold text-white">12</div>
              <div className="text-red-400 text-xs flex items-center gap-1">
                <Flame className="w-3 h-3" />
                Priorité haute
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-200 text-sm font-medium">Discussions</span>
              </div>
              <div className="text-2xl font-bold text-white">234</div>
              <div className="text-green-400 text-xs flex items-center gap-1">
                <Play className="w-3 h-3" />
                Live actif
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-indigo-400" />
                <span className="text-indigo-200 text-sm font-medium">IA Confiance</span>
              </div>
              <div className="text-2xl font-bold text-white">94%</div>
              <div className="text-indigo-400 text-xs flex items-center gap-1">
                <Star className="w-3 h-3" />
                Très élevée
              </div>
            </div>
          </div>

          {/* AI Status Banner */}
          {aiAssistantActive && (
            <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div className="flex-1">
                  <h3 className="text-purple-200 font-semibold">Assistant IA Activé</h3>
                  <p className="text-purple-300/80 text-sm">Analyse en temps réel des indices, connexions automatiques, et suggestions de recherche</p>
                </div>
                <Badge className="bg-purple-500 text-white">ACTIF</Badge>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Revolutionary Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6 bg-gradient-to-r from-slate-50 to-amber-50 border border-amber-200/50 p-1 rounded-2xl">
          <TabsTrigger value="live" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white rounded-xl">
            <Flame className="w-4 h-4" />
            <span className="hidden sm:inline">Live</span>
          </TabsTrigger>
          <TabsTrigger value="evidence" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-xl">
            <Scan className="w-4 h-4" />
            <span className="hidden sm:inline">Preuves IA</span>
          </TabsTrigger>
          <TabsTrigger value="theories" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-xl">
            <Brain className="w-4 h-4" />
            <span className="hidden sm:inline">Théories</span>
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white rounded-xl">
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">Carte</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-xl">
            <Archive className="w-4 h-4" />
            <span className="hidden sm:inline">Archives</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-xl">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Chat</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-4">
          <CollaborationHub quest={quest} />
        </TabsContent>

        <TabsContent value="evidence" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Scan className="w-5 h-5 text-blue-600" />
              Preuves avec Analyse IA
            </h2>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <Sparkles className="w-4 h-4 mr-2" />
              Analyser avec IA
            </Button>
          </div>
          <EvidenceTab quest={quest} />
        </TabsContent>

        <TabsContent value="theories" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              Théories Assistées par IA
            </h2>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <Zap className="w-4 h-4 mr-2" />
              Générer Théorie IA
            </Button>
          </div>
          <TheoriesTab quest={quest} />
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Carte Interactive
            </h2>
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              <Target className="w-4 h-4 mr-2" />
              Analyser Zones
            </Button>
          </div>
          <MapTab quest={quest} />
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Archive className="w-5 h-5 text-orange-600" />
              Archives Historiques
            </h2>
            <Button className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
              <Search className="w-4 h-4 mr-2" />
              Recherche IA
            </Button>
          </div>
          <DocumentsTab quest={quest} />
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-teal-600" />
              Chat Collaboratif
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Réactions
              </Button>
              <Button className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
                <Share2 className="w-4 h-4 mr-2" />
                Partager
              </Button>
            </div>
          </div>
          <DiscussionsTab quest={quest} />
        </TabsContent>
      </Tabs>

      {/* AI Analysis Panel */}
      {aiAssistantActive && (
        <AIAnalysisInterface quest={quest} />
      )}
    </div>
  );
};

export default InvestigationInterface;