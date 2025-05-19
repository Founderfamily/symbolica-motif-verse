
import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { 
  HoverCard, 
  HoverCardContent, 
  HoverCardTrigger 
} from '@/components/ui/hover-card';
import { useTranslation } from '@/i18n/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import { gamificationService } from '@/services/gamification';
import { I18nText } from '@/components/ui/i18n-text';
import { SymbolLocation } from '@/services/symbolGeolocationService';

interface MapSymbolMarkerProps {
  id: string;
  name: string;
  culture: string;
  lat: number;
  lng: number;
  isVerified?: boolean;
  historicalPeriod?: string;
  source?: string;
  description?: string;
  onClick?: () => void;
}

const MapSymbolMarker = ({ 
  id, 
  name, 
  culture, 
  lat, 
  lng, 
  isVerified = false,
  historicalPeriod,
  source,
  description,
  onClick 
}: MapSymbolMarkerProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [hasBeenExplored, setHasBeenExplored] = useState(false);
  const markerRef = useRef<HTMLDivElement>(null);
  
  const handleClick = async (e: React.MouseEvent) => {
    // Prevent event bubbling to map
    e.stopPropagation();
    
    // Set active state for animation
    setIsActive(true);
    
    // Reset active state after animation completes
    setTimeout(() => setIsActive(false), 1000);
    
    // Track exploration activity if user is logged in
    if (user) {
      try {
        // Award points for exploring symbols
        await gamificationService.awardPoints(
          user.id, 
          'exploration', 
          5, 
          id,
          { 
            symbolName: name, 
            culture,
            historicalPeriod,
            coordinates: `${lat},${lng}`
          }
        );
        setHasBeenExplored(true);
      } catch (error) {
        console.error("Error tracking symbol exploration:", error);
      }
    }
    
    // Call the original onClick handler if provided
    if (onClick) {
      onClick();
    }
  };
  
  const getMarkerColorClass = () => {
    if (hasBeenExplored) return 'text-green-500 hover:text-green-600';
    if (isVerified) return 'text-amber-600 hover:text-amber-700';
    return 'text-blue-500 hover:text-blue-600';
  };
  
  return (
    <div 
      ref={markerRef}
      className={`absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 
        ${isActive ? 'scale-125' : 'hover:scale-110'} 
        ${hasBeenExplored ? 'z-20' : isVerified ? 'z-15' : 'z-10'}`}
      style={{ 
        left: `${(lng + 180) / 360 * 100}%`,
        top: `${(90 - lat) / 180 * 100}%`
      }}
      title={name}
      onClick={handleClick}
    >
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="relative">
            <MapPin 
              className={`h-6 w-6 ${getMarkerColorClass()} 
                transition-all duration-300 ${isActive ? 'animate-ping-once' : ''}`} 
            />
            {hasBeenExplored && (
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full" />
            )}
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-72 p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h5 className="font-semibold">{name}</h5>
              {isVerified && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  <I18nText translationKey="map.badges.verified" />
                </span>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground">
              <I18nText translationKey="map.labels.culture" />: <span className="font-medium">{culture}</span>
            </p>
            
            {historicalPeriod && (
              <p className="text-sm text-muted-foreground">
                <I18nText translationKey="map.labels.period" />: <span className="font-medium">{historicalPeriod}</span>
              </p>
            )}
            
            <p className="text-sm text-muted-foreground">
              <I18nText translationKey="map.labels.location" />: {lat.toFixed(4)}, {lng.toFixed(4)}
            </p>
            
            {description && (
              <p className="text-sm border-t pt-2 border-slate-100 mt-2">{description}</p>
            )}
            
            {source && (
              <p className="text-xs text-slate-500">
                <I18nText translationKey="map.labels.source" />: {source}
              </p>
            )}
            
            {hasBeenExplored && (
              <div className="bg-green-50 text-green-700 rounded px-2 py-1 flex items-center justify-between text-sm mt-2">
                <span><I18nText translationKey="map.badges.explored" /></span>
                <span>+5 <I18nText translationKey="gamification.labels.points" /></span>
              </div>
            )}
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default MapSymbolMarker;
