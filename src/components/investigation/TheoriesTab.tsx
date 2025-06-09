
import React from 'react';
import { Card } from '@/components/ui/card';
import { Lightbulb, Vote, TrendingUp } from 'lucide-react';
import { TreasureQuest } from '@/types/quests';

interface TheoriesTabProps {
  quest: TreasureQuest;
}

const TheoriesTab: React.FC<TheoriesTabProps> = ({ quest }) => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="text-center py-12">
          <Lightbulb className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">Théories Collaboratives</h3>
          <p className="text-slate-500 mb-4">
            Hypothèses et interprétations de la communauté sur les mystères de cette enquête.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Vote className="w-4 h-4" />
              Votes Communautaires
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <TrendingUp className="w-4 h-4" />
              Théories Populaires
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Lightbulb className="w-4 h-4" />
              Nouvelles Hypothèses
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TheoriesTab;
