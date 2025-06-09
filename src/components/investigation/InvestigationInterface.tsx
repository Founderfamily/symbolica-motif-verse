
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
  Eye
} from 'lucide-react';
import DocumentsTab from './DocumentsTab';
import EvidenceTab from './EvidenceTab';
import MapTab from './MapTab';
import DiscussionsTab from './DiscussionsTab';
import TheoriesTab from './TheoriesTab';
import { TreasureQuest } from '@/types/quests';

interface InvestigationInterfaceProps {
  quest: TreasureQuest;
}

const InvestigationInterface: React.FC<InvestigationInterfaceProps> = ({ quest }) => {
  const [activeTab, setActiveTab] = useState('documents');

  const isHistoricalQuest = ['templar', 'lost_civilization', 'grail'].includes(quest.quest_type);

  return (
    <div className="space-y-6">
      {/* En-tête du dossier d'enquête */}
      <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
            <Search className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-amber-800">Dossier d'Enquête</h1>
            <p className="text-amber-600">Investigation collaborative sur {quest.title}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-700">12</div>
            <div className="text-sm text-amber-600">Documents</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-700">8</div>
            <div className="text-sm text-green-600">Preuves Validées</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-700">24</div>
            <div className="text-sm text-blue-600">Participants</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-700">5</div>
            <div className="text-sm text-purple-600">Théories</div>
          </div>
        </div>

        {isHistoricalQuest && (
          <div className="mt-4 p-3 bg-amber-100 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <History className="w-4 h-4 text-amber-700" />
              <span className="font-semibold text-amber-800">Enquête Historique Authentique</span>
            </div>
            <p className="text-sm text-amber-700">
              Cette enquête est basée sur de véritables mystères historiques et des documents d'époque.
            </p>
          </div>
        )}
      </Card>

      {/* Interface à onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-white border border-amber-200">
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Documents</span>
          </TabsTrigger>
          <TabsTrigger value="evidence" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Preuves</span>
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">Carte</span>
          </TabsTrigger>
          <TabsTrigger value="discussions" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Discussions</span>
          </TabsTrigger>
          <TabsTrigger value="theories" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            <span className="hidden sm:inline">Théories</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <DocumentsTab quest={quest} />
        </TabsContent>

        <TabsContent value="evidence">
          <EvidenceTab quest={quest} />
        </TabsContent>

        <TabsContent value="map">
          <MapTab quest={quest} />
        </TabsContent>

        <TabsContent value="discussions">
          <DiscussionsTab quest={quest} />
        </TabsContent>

        <TabsContent value="theories">
          <TheoriesTab quest={quest} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvestigationInterface;
