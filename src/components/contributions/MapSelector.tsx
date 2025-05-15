
import React, { useState, useEffect, useRef } from 'react';

interface MapSelectorProps {
  onLocationSelected: (latitude: number, longitude: number, locationName: string) => void;
  initialLocation?: string;
}

const MapSelector: React.FC<MapSelectorProps> = ({ onLocationSelected, initialLocation = '' }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialLocation);

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current) return;
      
      // Vérifier si l'API Google Maps est déjà chargée
      if (!window.google || !window.google.maps) {
        setLoading(true);
        
        // Pour un prototype, on va simuler une carte avec une interface simple
        const mapElement = mapRef.current;
        mapElement.innerHTML = `
          <div class="w-full h-[200px] bg-slate-100 rounded-md flex items-center justify-center">
            <div class="text-center p-4">
              <p class="text-sm text-slate-500 mb-2">Fonctionnalité de carte interactive en développement</p>
              <p class="text-xs text-slate-400">Pour le prototype, veuillez saisir directement le nom du lieu</p>
            </div>
          </div>
        `;
        setLoading(false);
      } else {
        // Dans le cas où l'API Google Maps serait disponible
        // (code d'intégration à ajouter ultérieurement)
        setLoading(false);
      }
    };

    initMap();
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    // Pour la version prototype, on simule une recherche de géocodage
    // et on renvoie des coordonnées fictives basées sur le texte
    
    // En production, on utiliserait un service de géocodage comme l'API Google Maps
    const simulatedLatitude = 48.8566; // Paris comme exemple
    const simulatedLongitude = 2.3522;
    
    onLocationSelected(simulatedLatitude, simulatedLongitude, searchQuery);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un lieu..."
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <button
          type="button"
          onClick={handleSearch}
          className="h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
        >
          Rechercher
        </button>
      </div>
      <div 
        ref={mapRef} 
        className="w-full h-[200px] bg-slate-100 rounded-md flex items-center justify-center"
      >
        {loading && (
          <p className="text-sm text-slate-500">Chargement de la carte...</p>
        )}
      </div>
    </div>
  );
};

export default MapSelector;
