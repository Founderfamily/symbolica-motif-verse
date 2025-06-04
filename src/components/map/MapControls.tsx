
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import CultureLegend from './CultureLegend';

interface MapControlsProps {
  showLegend: boolean;
  setShowLegend: (show: boolean) => void;
  availableCultures: string[];
  activeCultureFilters: Set<string>;
  onCultureFilterChange: (culture: string, active: boolean) => void;
}

const MapControls: React.FC<MapControlsProps> = ({
  showLegend,
  setShowLegend,
  availableCultures,
  activeCultureFilters,
  onCultureFilterChange
}) => {
  return (
    <div className="absolute top-4 left-4 z-20">
      <Button 
        variant={showLegend ? "default" : "outline"} 
        size="sm"
        className="bg-white text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-100"
        onClick={() => setShowLegend(!showLegend)}
      >
        <Filter className="h-4 w-4 mr-1" />
        <I18nText translationKey="map.filters.cultures" />
        {availableCultures.length > 0 && (
          <Badge variant="secondary" className="ml-2 bg-slate-200">
            {activeCultureFilters.size}/{availableCultures.length}
          </Badge>
        )}
      </Button>
      
      {/* Culture legend/filter panel */}
      {showLegend && (
        <div className="absolute top-12 left-0 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
          <CultureLegend 
            cultures={availableCultures}
            onFilterChange={onCultureFilterChange}
            activeCultures={activeCultureFilters}
          />
        </div>
      )}
    </div>
  );
};

export default React.memo(MapControls);
