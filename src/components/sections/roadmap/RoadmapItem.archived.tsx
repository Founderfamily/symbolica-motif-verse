
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { I18nText } from '@/components/ui/i18n-text';
import { useTranslation } from '@/i18n/useTranslation';
import { RoadmapItem as RoadmapItemType } from '@/services/roadmapService';

interface RoadmapItemProps {
  item: RoadmapItemType;
}

export const RoadmapItem = ({ item }: RoadmapItemProps) => {
  const { i18n } = useTranslation();
  
  const circleColor = item.is_completed 
    ? 'bg-green-500' 
    : item.is_current 
      ? 'bg-slate-700' 
      : 'bg-slate-300';
  
  const statusBadge = item.is_completed 
    ? <Badge className="bg-green-100 text-green-700 hover:bg-green-100"><I18nText translationKey="roadmap.completed" /></Badge>
    : item.is_current 
      ? <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100"><I18nText translationKey="roadmap.inProgress" /></Badge>
      : null;

  return (
    <div className="relative flex items-start space-x-4">
      {/* Circle */}
      <div className={`w-4 h-4 rounded-full ${circleColor} relative z-10`}></div>
      
      {/* Content */}
      <div className="flex-1 min-w-0 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-lg font-semibold text-slate-800">
            {item.title?.[i18n.language] || item.title?.fr || item.title || 'Titre non disponible'}
          </h3>
          {statusBadge}
        </div>
        <p className="text-slate-600">
          {item.description?.[i18n.language] || item.description?.fr || item.description || 'Description non disponible'}
        </p>
      </div>
    </div>
  );
};
