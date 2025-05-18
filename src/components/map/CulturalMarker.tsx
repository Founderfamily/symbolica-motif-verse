
import React, { useState } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { 
  HoverCard, 
  HoverCardContent, 
  HoverCardTrigger 
} from '@/components/ui/hover-card';
import { I18nText } from '@/components/ui/i18n-text';
import { Badge } from '@/components/ui/badge';
import { MapPin, Info, ExternalLink, Star } from 'lucide-react';
import { getSymbolIconByType, getSymbolThemeColor } from '@/utils/symbolImageUtils';
import { SymbolLocation } from '@/services/symbolGeolocationService';

interface CulturalMarkerProps {
  location: SymbolLocation;
  onClick?: () => void;
  isActive?: boolean;
  isExplored?: boolean;
}

const CulturalMarker: React.FC<CulturalMarkerProps> = ({ 
  location, 
  onClick,
  isActive = false,
  isExplored = false
}) => {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState(false);
  
  // Get icon image based on culture
  const iconImage = getSymbolIconByType(location.culture);
  
  // Handle marker interaction
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    if (onClick) onClick();
  };
  
  return (
    <div 
      className={`absolute w-8 h-8 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10
        transition-all duration-300 ${isActive ? 'scale-125 z-20' : 'hover:scale-110'} 
        ${isExplored ? 'ring-2 ring-green-400 ring-opacity-70 rounded-full' : ''}`}
      style={{
        left: `${(location.longitude + 180) / 360 * 100}%`,
        top: `${(90 - location.latitude) / 180 * 100}%`
      }}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <HoverCard openDelay={100} closeDelay={100}>
        <HoverCardTrigger asChild>
          <div className="relative group">
            {/* Cultural symbol icon */}
            <div className={`w-8 h-8 rounded-full shadow-md overflow-hidden 
                ${isActive ? 'animate-pulse' : ''}
                border-2 ${isExplored ? 'border-green-500' : 'border-white'}`}>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/30 z-10"></div>
              <img 
                src={iconImage}
                alt={location.culture}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Location pin */}
            <div className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 transition-all
                ${hovered || isActive ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}>
              <MapPin 
                className={`h-4 w-4 drop-shadow-md ${isExplored ? 'text-green-500 fill-green-500/10' : 'text-amber-500 fill-amber-500/10'}`} 
              />
            </div>
            
            {/* Verification badge */}
            {location.is_verified && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
            )}
          </div>
        </HoverCardTrigger>
        
        <HoverCardContent side="top" align="center" className="w-80 p-0 overflow-hidden shadow-lg">
          <div className="relative">
            {/* Header with culture badge */}
            <div className={`${getSymbolThemeColor(location.culture)} px-4 py-3 text-white`}>
              <div className="flex justify-between items-center">
                <h5 className="font-semibold truncate">{location.name}</h5>
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  {location.culture}
                </Badge>
              </div>
              {location.historical_period && (
                <p className="text-sm text-white/80 mt-1">{location.historical_period}</p>
              )}
            </div>
            
            {/* Content */}
            <div className="p-4 space-y-3">
              {/* Description */}
              {location.description && (
                <p className="text-sm text-muted-foreground">{location.description}</p>
              )}
              
              {/* Location details */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span>{location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</span>
              </div>
              
              {/* Source */}
              {location.source && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Info className="h-3 w-3 flex-shrink-0" />
                  <span>{location.source}</span>
                </div>
              )}
              
              {/* Explored status */}
              {isExplored && (
                <div className="bg-green-50 text-green-700 rounded px-2 py-1 flex items-center justify-between text-xs mt-2">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-green-500" />
                    <I18nText translationKey="map.badges.explored" />
                  </span>
                  <span>+5 <I18nText translationKey="gamification.points" /></span>
                </div>
              )}
              
              {/* Actions */}
              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={handleClick}
                  className="text-xs flex items-center gap-1 text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  <I18nText translationKey="map.actions.explore" />
                </button>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default CulturalMarker;
