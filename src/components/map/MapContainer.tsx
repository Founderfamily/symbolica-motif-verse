
import React from 'react';

interface MapContainerProps {
  mapContainerRef: React.RefObject<HTMLDivElement>;
  children?: React.ReactNode;
}

const MapContainer: React.FC<MapContainerProps> = ({ mapContainerRef, children }) => {
  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden shadow-md border border-slate-200">
      {/* Mapbox container */}
      <div ref={mapContainerRef} className="absolute inset-0 bg-slate-50" />
      
      {/* Overlay content */}
      {children}
    </div>
  );
};

export default React.memo(MapContainer);
