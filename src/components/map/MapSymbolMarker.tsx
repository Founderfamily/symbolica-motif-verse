
import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { 
  HoverCard, 
  HoverCardContent, 
  HoverCardTrigger 
} from '@/components/ui/hover-card';
import { useTranslation } from '@/i18n/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import { gamificationService } from '@/services/gamificationService';

interface MapSymbolMarkerProps {
  id: string | number;
  name: string;
  culture: string;
  lat: number;
  lng: number;
  onClick?: () => void;
}

const MapSymbolMarker = ({ id, name, culture, lat, lng, onClick }: MapSymbolMarkerProps) => {
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
          typeof id === 'string' ? id : id.toString(),
          { symbolName: name, culture }
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
  
  return (
    <div 
      ref={markerRef}
      className={`absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 
        ${isActive ? 'scale-125' : 'hover:scale-110'} 
        ${hasBeenExplored ? 'z-20' : 'z-10'}`}
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
              className={`h-6 w-6 ${hasBeenExplored ? 'text-green-500 hover:text-green-600' : 'text-amber-600 hover:text-amber-700'} 
                transition-all duration-300 ${isActive ? 'animate-ping-once' : ''}`} 
            />
            {hasBeenExplored && (
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full" />
            )}
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-64 p-3">
          <div className="space-y-2">
            <h5 className="font-semibold text-sm">{name}</h5>
            <p className="text-xs text-muted-foreground">{t('map.culture')}: {culture}</p>
            <p className="text-xs text-muted-foreground">{t('map.location')}: {lat.toFixed(2)}, {lng.toFixed(2)}</p>
            {hasBeenExplored && (
              <div className="text-xs bg-green-50 text-green-700 rounded px-2 py-1 flex items-center justify-between">
                <span>{t('map.explored')}</span>
                <span>+5 {t('gamification.points')}</span>
              </div>
            )}
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default MapSymbolMarker;
