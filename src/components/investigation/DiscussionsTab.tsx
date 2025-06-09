
import React from 'react';
import { Card } from '@/components/ui/card';
import { MessageSquare, Users, Pin } from 'lucide-react';
import { TreasureQuest } from '@/types/quests';

interface DiscussionsTabProps {
  quest: TreasureQuest;
}

const DiscussionsTab: React.FC<DiscussionsTabProps> = ({ quest }) => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">Discussions d'Enquête</h3>
          <p className="text-slate-500 mb-4">
            Forums de discussion par indice et lieu pour analyser les découvertes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Pin className="w-4 h-4" />
              Discussions Épinglées
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Users className="w-4 h-4" />
              Communauté Active
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MessageSquare className="w-4 h-4" />
              Temps Réel
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DiscussionsTab;
