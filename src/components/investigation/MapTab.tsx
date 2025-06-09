
import React from 'react';
import { Card } from '@/components/ui/card';
import { MapPin, Navigation, Layers } from 'lucide-react';
import { TreasureQuest } from '@/types/quests';

interface MapTabProps {
  quest: TreasureQuest;
}

const MapTab: React.FC<MapTabProps> = ({ quest }) => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">Carte Interactive</h3>
          <p className="text-slate-500 mb-4">
            La carte interactive avec les lieux historiques sera bientôt disponible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Navigation className="w-4 h-4" />
              Navigation GPS
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Layers className="w-4 h-4" />
              Couches Historiques
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4" />
              Points d'Intérêt
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MapTab;
