
import React from 'react';
import InteractiveMapTab from './InteractiveMapTab';
import { TreasureQuest } from '@/types/quests';

interface MapTabProps {
  quest: TreasureQuest;
}

const MapTab: React.FC<MapTabProps> = ({ quest }) => {
  return <InteractiveMapTab quest={quest} />;
};

export default MapTab;
