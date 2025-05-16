
import React from 'react';
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
  
  const handleClick = async () => {
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
      className="absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-110"
      style={{ 
        left: `${(lng + 180) / 360 * 100}%`,
        top: `${(90 - lat) / 180 * 100}%`
      }}
      title={name}
      onClick={handleClick}
    >
      <HoverCard>
        <HoverCardTrigger>
          <MapPin className="h-6 w-6 text-amber-600 hover:text-amber-700" />
        </HoverCardTrigger>
        <HoverCardContent className="w-64 p-3">
          <div className="space-y-2">
            <h5 className="font-semibold text-sm">{name}</h5>
            <p className="text-xs text-muted-foreground">{t('map.culture')}: {culture}</p>
            <p className="text-xs text-muted-foreground">{t('map.location')}: {lat.toFixed(2)}, {lng.toFixed(2)}</p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default MapSymbolMarker;
