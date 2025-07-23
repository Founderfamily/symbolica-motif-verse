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
      {/* Live Collaboration Header - Sobre et Élégant */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-stone-100 rounded-2xl border border-stone-200">
        <div className="absolute inset-0 opacity-10"></div>
        
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-slate-600 rounded-xl flex items-center justify-center">
                  <Compass className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Centre d'Investigation
                </h1>
                <p className="text-slate-600 text-sm">
                  <span className="inline-flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Recherche collaborative
                  </span>
                  <span className="mx-3">•</span>
                  <span className="inline-flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Assistant IA actif
                  </span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setAiAssistantActive(!aiAssistantActive)}
                variant={aiAssistantActive ? "default" : "outline"}
                className={aiAssistantActive ? 'bg-slate-800 text-white' : ''}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                IA Analyste
              </Button>
              <ContributeEvidenceDialog questId={quest.id} />
            </div>
          </div>
          
          {/* Stats Dashboard Sobres */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-slate-600" />
                <span className="text-slate-700 text-sm font-medium">Indices</span>
              </div>
              <div className="text-xl font-bold text-slate-800">{quest.clues?.length || 0}</div>
              <div className="text-slate-600 text-xs flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Disponibles
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-slate-600" />
                <span className="text-slate-700 text-sm font-medium">Type</span>
              </div>
              <div className="text-sm font-bold text-slate-800 capitalize">{quest.quest_type.replace('_', ' ')}</div>
              <div className="text-slate-600 text-xs flex items-center gap-1">
                <Target className="w-3 h-3" />
                {quest.difficulty_level}
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Archive className="w-4 h-4 text-slate-600" />
                <span className="text-slate-700 text-sm font-medium">Statut</span>
              </div>
              <div className="text-sm font-bold text-slate-800 capitalize">{quest.status}</div>
              <div className="text-slate-600 text-xs flex items-center gap-1">
                <Clock className="w-3 h-3" />
                En cours
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-slate-600" />
                <span className="text-slate-700 text-sm font-medium">Symboles</span>
              </div>
              <div className="text-xl font-bold text-slate-800">{quest.target_symbols?.length || 0}</div>
              <div className="text-slate-600 text-xs flex items-center gap-1">
                <Star className="w-3 h-3" />
                Cibles
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-4 h-4 text-slate-600" />
                <span className="text-slate-700 text-sm font-medium">Collaboration</span>
              </div>
              <div className="text-xl font-bold text-slate-800">Actif</div>
              <div className="text-green-600 text-xs flex items-center gap-1">
                <Play className="w-3 h-3" />
                En temps réel
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-slate-600" />
                <span className="text-slate-700 text-sm font-medium">IA</span>
              </div>
              <div className="text-xl font-bold text-slate-800">Prêt</div>
              <div className="text-slate-600 text-xs flex items-center gap-1">
                <Star className="w-3 h-3" />
                Assistant actif
              </div>
            </div>
          </div>

          {/* AI Status Banner - Sobre */}
          {aiAssistantActive && (
            <div className="bg-slate-100 rounded-lg p-4 border border-slate-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-slate-800 font-semibold">Assistant IA Activé</h3>
                  <p className="text-slate-600 text-sm">Analyse en temps réel des indices et suggestions de recherche</p>
                </div>
                <Badge variant="secondary" className="bg-slate-800 text-white">ACTIF</Badge>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interface à onglets sobre */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6 bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
          <TabsTrigger value="live" className="flex items-center gap-2 data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-lg">
            <Flame className="w-4 h-4" />
            <span className="hidden sm:inline">Live</span>
          </TabsTrigger>
          <TabsTrigger value="evidence" className="flex items-center gap-2 data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-lg">
            <Scan className="w-4 h-4" />
            <span className="hidden sm:inline">Preuves IA</span>
          </TabsTrigger>
          <TabsTrigger value="theories" className="flex items-center gap-2 data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-lg">
            <Brain className="w-4 h-4" />
            <span className="hidden sm:inline">Théories</span>
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2 data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-lg">
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">Carte</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2 data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-lg">
            <Archive className="w-4 h-4" />
            <span className="hidden sm:inline">Archives</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2 data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-lg">
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
            <Button className="bg-slate-800 hover:bg-slate-900 text-white">
              <Sparkles className="w-4 h-4 mr-2" />
              Analyser avec IA
            </Button>
          </div>
          <EvidenceTab quest={quest} />
        </TabsContent>

        <TabsContent value="theories" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Brain className="w-5 h-5 text-slate-600" />
              Théories Assistées par IA
            </h2>
            <Button className="bg-slate-800 hover:bg-slate-900 text-white">
              <Zap className="w-4 h-4 mr-2" />
              Générer Théorie IA
            </Button>
          </div>
          <TheoriesTab quest={quest} />
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-slate-600" />
              Carte Interactive
            </h2>
            <Button className="bg-slate-800 hover:bg-slate-900 text-white">
              <Target className="w-4 h-4 mr-2" />
              Analyser Zones
            </Button>
          </div>
          <MapTab quest={quest} />
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Archive className="w-5 h-5 text-slate-600" />
              Archives Historiques
            </h2>
            <Button className="bg-slate-800 hover:bg-slate-900 text-white">
              <Search className="w-4 h-4 mr-2" />
              Recherche IA
            </Button>
          </div>
          <DocumentsTab quest={quest} />
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-slate-600" />
              Chat Collaboratif
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Réactions
              </Button>
              <Button className="bg-slate-800 hover:bg-slate-900 text-white">
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