
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
  Globe
} from 'lucide-react';
import DocumentsTab from './DocumentsTab';
import EvidenceTab from './EvidenceTab';
import MapTab from './MapTab';
import DiscussionsTab from './DiscussionsTab';
import TheoriesTab from './TheoriesTab';
import { TreasureQuest } from '@/types/quests';
import ContributeEvidenceDialog from '../quests/ContributeEvidenceDialog';

interface InvestigationInterfaceProps {
  quest: TreasureQuest;
}

const InvestigationInterface: React.FC<InvestigationInterfaceProps> = ({ quest }) => {
  const [activeTab, setActiveTab] = useState('evidence');

  const isHistoricalQuest = ['templar', 'lost_civilization', 'grail'].includes(quest.quest_type);

  return (
    <div className="space-y-6">
      {/* En-tête du dossier de recherche collaborative */}
      <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-amber-800">Recherche Collaborative</h1>
              <p className="text-amber-600">Communauté mondiale travaillant sur {quest.title}</p>
            </div>
          </div>
          
          <ContributeEvidenceDialog questId={quest.id} />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-700">32</div>
            <div className="text-sm text-blue-600">Archives</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-700">87</div>
            <div className="text-sm text-green-600">Preuves</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-700">156</div>
            <div className="text-sm text-purple-600">Contributeurs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-700">23</div>
            <div className="text-sm text-orange-600">Théories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-700">12</div>
            <div className="text-sm text-red-600">Pistes Validées</div>
          </div>
        </div>

        {isHistoricalQuest && (
          <div className="mt-4 p-3 bg-amber-100 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <History className="w-4 h-4 text-amber-700" />
              <span className="font-semibold text-amber-800">Mystère Historique Authentique</span>
            </div>
            <p className="text-sm text-amber-700">
              Cette recherche collaborative est basée sur de véritables mystères historiques et des documents d'époque. 
              Ensemble, nous pouvons peut-être résoudre ce qui n'a jamais été élucidé.
            </p>
          </div>
        )}
      </Card>

      {/* Interface collaborative à onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-white border border-amber-200">
          <TabsTrigger value="evidence" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Preuves</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <Archive className="w-4 h-4" />
            <span className="hidden sm:inline">Archives</span>
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">Carte</span>
          </TabsTrigger>
          <TabsTrigger value="theories" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            <span className="hidden sm:inline">Théories</span>
          </TabsTrigger>
          <TabsTrigger value="discussions" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Forum</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="evidence">
          <EvidenceTab quest={quest} />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentsTab quest={quest} />
        </TabsContent>

        <TabsContent value="map">
          <MapTab quest={quest} />
        </TabsContent>

        <TabsContent value="theories">
          <TheoriesTab quest={quest} />
        </TabsContent>

        <TabsContent value="discussions">
          <DiscussionsTab quest={quest} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvestigationInterface;
