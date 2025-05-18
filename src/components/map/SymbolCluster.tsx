
import React, { useState } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { Badge } from '@/components/ui/badge';
import CulturalMarker from './CulturalMarker';
import { SymbolLocation } from '@/services/symbolGeolocationService';
import { getSymbolThemeColor } from '@/utils/symbolImageUtils';

interface SymbolClusterProps {
  locations: SymbolLocation[];
  culture: string;
  onLocationSelect: (location: SymbolLocation) => void;
  exploredLocations: Set<string>;
}

const SymbolCluster: React.FC<SymbolClusterProps> = ({ 
  locations, 
  culture,
  onLocationSelect,
  exploredLocations
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  
  // If there's only one location, render it directly
  if (locations.length === 1) {
    return (
      <CulturalMarker 
        location={locations[0]} 
        onClick={() => onLocationSelect(locations[0])}
        isExplored={exploredLocations.has(locations[0].id)}
      />
    );
  }
  
  // For multiple locations, show a cluster
  const centerLat = locations.reduce((sum, loc) => sum + loc.latitude, 0) / locations.length;
  const centerLng = locations.reduce((sum, loc) => sum + loc.longitude, 0) / locations.length;
  const exploredCount = locations.filter(loc => exploredLocations.has(loc.id)).length;
  
  // Determine an appropriate cluster radius based on number of items
  const clusterRadius = Math.min(10 + locations.length * 2, 32); // Max size 32px
  
  // Handle click on the cluster
  const handleClusterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };
  
  return (
    <>
      {/* Main cluster */}
      <div 
        className={`absolute cursor-pointer z-10 transition-all duration-300 
          ${expanded ? 'opacity-30' : 'opacity-100 hover:scale-110'}`}
        style={{
          left: `${(centerLng + 180) / 360 * 100}%`,
          top: `${(90 - centerLat) / 180 * 100}%`,
          width: `${clusterRadius}px`,
          height: `${clusterRadius}px`,
          transform: 'translate(-50%, -50%)'
        }}
        onClick={handleClusterClick}
      >
        <div className={`w-full h-full rounded-full ${getSymbolThemeColor(culture)} flex items-center justify-center
          text-white font-medium text-xs shadow-md border-2 border-white`}>
          {locations.length}
        </div>
        
        {/* Progress indicator */}
        {exploredCount > 0 && (
          <div className="absolute -bottom-1 -right-1">
            <Badge className="bg-green-500 text-white text-[0.6rem] min-w-4 h-4 flex items-center justify-center p-0">
              {exploredCount}/{locations.length}
            </Badge>
          </div>
        )}
      </div>
      
      {/* Expanded view - show all locations in a radial pattern */}
      {expanded && (
        <>
          <div 
            className="fixed inset-0 bg-transparent z-30"
            onClick={() => setExpanded(false)}
          />
          
          {locations.map((location, index) => {
            // Calculate position in a circle around the center point
            const angle = (2 * Math.PI * index) / locations.length;
            const radius = 60; // Distance from center in pixels
            const x = centerLng + (radius / window.innerWidth) * 360 * Math.cos(angle);
            const y = centerLat - (radius / window.innerHeight) * 180 * Math.sin(angle);
            
            return (
              <div
                key={location.id}
                className="absolute z-40 animate-fade-in"
                style={{
                  left: `${(x + 180) / 360 * 100}%`,
                  top: `${(90 - y) / 180 * 100}%`
                }}
              >
                <CulturalMarker 
                  location={location}
                  onClick={() => {
                    onLocationSelect(location);
                    setExpanded(false);
                  }}
                  isExplored={exploredLocations.has(location.id)}
                />
              </div>
            );
          })}
          
          {/* Center badge identifying the culture */}
          <div 
            className="absolute z-50 animate-fade-in"
            style={{
              left: `${(centerLng + 180) / 360 * 100}%`,
              top: `${(90 - centerLat) / 180 * 100}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <Badge className={`${getSymbolThemeColor(culture)} text-white`}>
              {culture}: {locations.length} <I18nText translationKey="map.labels.locations" />
            </Badge>
          </div>
        </>
      )}
    </>
  );
};

export default SymbolCluster;
