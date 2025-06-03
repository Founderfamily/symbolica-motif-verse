
import React from 'react';
import { I18nText } from '@/components/ui/i18n-text';

interface RoadmapHeaderProps {
  usingFallback: boolean;
}

export const RoadmapHeader = ({ usingFallback }: RoadmapHeaderProps) => {
  return (
    <div className="text-center mb-12">
      <I18nText 
        translationKey="sections.roadmap" 
        as="h2" 
        className="text-3xl font-bold text-slate-800 mb-4"
      />
      <I18nText 
        translationKey="roadmap.subtitle" 
        as="p" 
        className="text-xl text-slate-600"
      />
      {usingFallback && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800 text-sm">
            📱 Mode déconnecté - Affichage des données locales
          </p>
        </div>
      )}
    </div>
  );
};
