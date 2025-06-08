
import React, { useEffect, useRef, useState } from 'react';
import { symbolGeolocationService, SymbolLocation } from '@/services/symbolGeolocationService';
import { mapboxConfigService } from '@/services/admin/mapboxConfigService';
import { MapPin, AlertTriangle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SimpleMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [locations, setLocations] = useState<SymbolLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est admin
    const checkAdminStatus = () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setIsAdmin(user?.is_admin || false);
        } catch (e) {
          console.log('No user data found');
        }
      }
    };

    checkAdminStatus();
    loadMapData();
  }, []);

  const loadMapData = async () => {
    try {
      console.log('🗺️ [SimpleMap] Loading map configuration...');
      
      // Vérifier si Mapbox est configuré
      const config = await mapboxConfigService.getConfig();
      
      if (!config) {
        console.log('❌ [SimpleMap] No Mapbox config found');
        setError('La carte n\'est pas configurée. Contactez l\'administrateur.');
        setLoading(false);
        return;
      }

      if (!config.enabled) {
        console.log('❌ [SimpleMap] Mapbox disabled in config');
        setError('La carte est désactivée. Contactez l\'administrateur.');
        setLoading(false);
        return;
      }

      if (!config.token) {
        console.log('❌ [SimpleMap] No Mapbox token in config');
        setError('Token Mapbox manquant. Contactez l\'administrateur.');
        setLoading(false);
        return;
      }

      console.log('✅ [SimpleMap] Mapbox config found, loading locations...');

      // Charger les emplacements de symboles
      const symbolLocations = await symbolGeolocationService.getAllLocations();
      setLocations(symbolLocations);
      
      console.log(`📍 [SimpleMap] Loaded ${symbolLocations.length} symbol locations`);

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
          const popup = new (window as any).mapboxgl.Popup().setHTML(
            `<div class="p-2">
              <h3 class="font-semibold text-sm">${location.name}</h3>
              <p class="text-xs text-gray-600">${location.culture}</p>
              ${location.description ? `<p class="text-xs mt-1">${location.description}</p>` : ''}
            </div>`
          );

          new (window as any).mapboxgl.Marker({
            color: '#d97706' // Couleur ambrée pour correspondre au thème
          })
            .setLngLat([location.longitude, location.latitude])
            .setPopup(popup)
            .addTo(map);
        });

        console.log('🎯 [SimpleMap] Map initialized successfully');
        setLoading(false);
      } else {
        console.error('❌ [SimpleMap] Mapbox GL JS not available');
        setError('Mapbox n\'est pas disponible');
        setLoading(false);
      }
    } catch (err) {
      console.error('❌ [SimpleMap] Error loading map:', err);
      setError('Erreur lors du chargement de la carte');
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    loadMapData();
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
        <div className="text-center p-6 max-w-md">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Carte non disponible</h3>
          <p className="text-slate-600 mb-4">{error}</p>
          
          <div className="flex gap-2 justify-center mb-4">
            <Button onClick={handleRetry} variant="outline" size="sm">
              Réessayer
            </Button>
            {isAdmin && (
              <Button 
                onClick={() => window.location.href = '/admin/settings'}
                size="sm"
                className="flex items-center gap-1"
              >
                <Settings className="h-3 w-3" />
                Configurer
              </Button>
            )}
          </div>
          
          {locations.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700">Emplacements disponibles :</p>
              <div className="max-h-32 overflow-y-auto space-y-2 bg-white rounded-lg p-3 border">
                {locations.slice(0, 5).map(location => (
                  <div key={location.id} className="flex items-center gap-2 text-xs">
                    <MapPin className="h-3 w-3 text-amber-600 flex-shrink-0" />
                    <span className="text-slate-700">{location.name}</span>
                    <span className="text-slate-500">({location.culture})</span>
                  </div>
                ))}
                {locations.length > 5 && (
                  <p className="text-xs text-slate-400 text-center pt-2 border-t">
                    +{locations.length - 5} autres emplacements...
                  </p>
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
