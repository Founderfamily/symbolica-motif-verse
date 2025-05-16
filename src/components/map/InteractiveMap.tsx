
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import MapSymbolMarker from './MapSymbolMarker';

// This is a placeholder component for the interactive map
// In a real implementation, we would integrate with a mapping library like Mapbox or Leaflet
const InteractiveMap = () => {
  const { t } = useTranslation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [activeLocation, setActiveLocation] = useState<number | null>(null);
  
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
  
  const handleMarkerClick = (id: number | string) => {
    setActiveLocation(Number(id));
    console.log(`Clicked symbol location: ${id}`);
  };
  
  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden shadow-md border border-slate-200">
      <div ref={mapContainerRef} className="absolute inset-0 bg-slate-50">
        {/* Map will be rendered here */}
        
        {/* Locations markers */}
        {symbolLocations.map((location) => (
          <MapSymbolMarker
            key={location.id}
            id={location.id}
            name={location.name}
            culture={location.culture}
            lat={location.lat}
            lng={location.lng}
            onClick={() => handleMarkerClick(location.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default InteractiveMap;
