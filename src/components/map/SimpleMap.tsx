
import React, { useEffect, useRef, useState } from 'react';
import { symbolGeolocationService, SymbolLocation } from '@/services/symbolGeolocationService';
import { mapboxConfigService } from '@/services/admin/mapboxConfigService';

const SimpleMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [locations, setLocations] = useState<SymbolLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMapData();
  }, []);

  const loadMapData = async () => {
    try {
      // Vérifier si Mapbox est configuré
      const config = await mapboxConfigService.getConfig();
      
      if (!config || !config.enabled || !config.token) {
        setError('La carte n\'est pas configurée. Contactez l\'administrateur.');
        setLoading(false);
        return;
      }

      // Charger les emplacements de symboles
      const symbolLocations = await symbolGeolocationService.getAllLocations();
      setLocations(symbolLocations);

      // Initialiser Mapbox (version simplifiée)
      if (mapContainerRef.current && (window as any).mapboxgl) {
        (window as any).mapboxgl.accessToken = config.token;
        
        const map = new (window as any).mapboxgl.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [2.3522, 48.8566], // Paris par défaut
          zoom: 6
        });

        // Ajouter les marqueurs
        symbolLocations.forEach(location => {
          new (window as any).mapboxgl.Marker()
            .setLngLat([location.longitude, location.latitude])
            .setPopup(
              new (window as any).mapboxgl.Popup().setHTML(
                `<div>
                  <h3>${location.name}</h3>
                  <p>${location.culture}</p>
                  ${location.description ? `<p>${location.description}</p>` : ''}
                </div>`
              )
            )
            .addTo(map);
        });

        setLoading(false);
      } else {
        // Fallback sans Mapbox
        setError('Mapbox n\'est pas disponible');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error loading map:', err);
      setError('Erreur lors du chargement de la carte');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[500px] bg-slate-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-2"></div>
          <p className="text-slate-600">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[500px] bg-slate-100 rounded-lg flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-slate-600 mb-4">{error}</p>
          {locations.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Emplacements disponibles :</p>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {locations.slice(0, 5).map(location => (
                  <div key={location.id} className="text-xs text-slate-500">
                    {location.name} - {location.culture}
                  </div>
                ))}
                {locations.length > 5 && (
                  <p className="text-xs text-slate-400">+{locations.length - 5} autres...</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-md border border-slate-200">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};

export default SimpleMap;
