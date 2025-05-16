
import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';

// This is a placeholder component for the interactive map
// In a real implementation, we would integrate with a mapping library like Mapbox or Leaflet
const InteractiveMap = () => {
  const { t } = useTranslation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // Mock data for symbol locations
  const symbolLocations = [
    { id: 1, name: 'Triskelion', lat: 51.5074, lng: -0.1278, culture: 'Celtic' },
    { id: 2, name: 'Meander', lat: 37.9838, lng: 23.7275, culture: 'Greek' },
    { id: 3, name: 'Fleur-de-lys', lat: 48.8566, lng: 2.3522, culture: 'French' },
    { id: 4, name: 'Mandala', lat: 28.6139, lng: 77.2090, culture: 'Indian' },
    { id: 5, name: 'Aboriginal Art', lat: -25.2744, lng: 133.7751, culture: 'Aboriginal' },
  ];
  
  useEffect(() => {
    // In a real implementation, we would initialize the map here
    console.log('Map should be initialized here with a proper mapping library');
    
    // For now, we'll just add a message to the map container
    if (mapContainerRef.current) {
      const message = document.createElement('div');
      message.className = 'absolute inset-0 flex items-center justify-center bg-slate-100 bg-opacity-80 text-slate-800 p-6 text-center';
      message.innerHTML = `
        <div>
          <p class="mb-2 font-medium">${t('map.placeholder')}</p>
          <p class="text-sm text-slate-600">${t('map.comingSoon')}</p>
        </div>
      `;
      mapContainerRef.current.appendChild(message);
    }
    
    return () => {
      // Cleanup function for when we implement the real map
    };
  }, [t]);
  
  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden shadow-md border border-slate-200">
      <div ref={mapContainerRef} className="absolute inset-0 bg-slate-50">
        {/* Map will be rendered here */}
        
        {/* Placeholder pins */}
        {symbolLocations.map((location) => (
          <div 
            key={location.id}
            className="absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{ 
              left: `${(location.lng + 180) / 360 * 100}%`,
              top: `${(90 - location.lat) / 180 * 100}%`
            }}
            title={location.name}
          >
            <MapPin className="h-6 w-6 text-amber-600 hover:text-amber-700" />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-white px-2 py-1 rounded shadow-md text-xs whitespace-nowrap">
              <strong>{location.name}</strong> ({location.culture})
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveMap;
