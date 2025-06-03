
import React from 'react';
import { RoadmapItem } from './RoadmapItem.archived';
import { RoadmapItem as RoadmapItemType } from '@/services/roadmapService';

interface RoadmapTimelineProps {
  items: RoadmapItemType[];
  error?: string | null;
  usingFallback: boolean;
}

export const RoadmapTimeline = ({ items, error, usingFallback }: RoadmapTimelineProps) => {
  return (
    <div className="relative">
      {/* Message d'erreur discret */}
      {error && usingFallback && (
        <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800 text-sm">
            ⚠️ Données temporaires affichées - {error}
          </p>
        </div>
      )}
      
      {/* Vertical line */}
      <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-slate-200"></div>
      
      <div className="space-y-8">
        {items.map((item) => (
          <RoadmapItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};
