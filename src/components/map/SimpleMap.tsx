
import React, { useEffect, useRef, useState } from 'react';
import { symbolGeolocationService, SymbolLocation } from '@/services/symbolGeolocationService';
import { mapboxConfigService } from '@/services/admin/mapboxConfigService';
import { MapPin, AlertTriangle, Settings, Map, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const SimpleMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [locations, setLocations] = useState<SymbolLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mapboxReady, setMapboxReady] = useState(false);

  // Fonction pour attendre que Mapbox GL JS soit chargé
  const waitForMapboxGL = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      const checkMapbox = () => {
        if ((window as any).mapboxgl) {
          console.log('✅ [SimpleMap] Mapbox GL JS is now available');
          setMapboxReady(true);
          resolve((window as any).mapboxgl);
          return;
        }
        
        console.log('⏳ [SimpleMap] Waiting for Mapbox GL JS to load...');
      };

      // Vérifier immédiatement
      checkMapbox();
      
      // Si pas encore chargé, attendre avec un intervalle
      let attempts = 0;
      const maxAttempts = 50; // 10 secondes maximum (50 x 200ms)
      
      const interval = setInterval(() => {
        attempts++;
        
        if ((window as any).mapboxgl) {
          clearInterval(interval);
          console.log('✅ [SimpleMap] Mapbox GL JS loaded after', attempts * 200, 'ms');
          setMapboxReady(true);
          resolve((window as any).mapboxgl);
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          console.error('❌ [SimpleMap] Mapbox GL JS failed to load after 10 seconds');
          reject(new Error('Mapbox GL JS failed to load'));
        }
      }, 200);
    });
  };

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

      // Attendre que Mapbox GL JS soit chargé avant d'initialiser la carte
      try {
        console.log('⏳ [SimpleMap] Waiting for Mapbox GL JS to be available...');
        const mapboxgl = await waitForMapboxGL();
        
        // Initialiser Mapbox
        if (mapContainerRef.current) {
          mapboxgl.accessToken = config.token;
          
          const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [2.3522, 48.8566], // Paris par défaut
            zoom: 6
          });

          // Ajouter des contrôles de navigation
          map.addControl(new mapboxgl.NavigationControl(), 'top-right');

          // Ajouter les marqueurs
          symbolLocations.forEach(location => {
            const popup = new mapboxgl.Popup().setHTML(
              `<div class="p-3">
                <h3 class="font-semibold text-sm mb-1">${location.name}</h3>
                <p class="text-xs text-gray-600 mb-1">${location.culture}</p>
                ${location.description ? `<p class="text-xs">${location.description}</p>` : ''}
              </div>`
            );

            new mapboxgl.Marker({
              color: '#d97706' // Couleur ambrée pour correspondre au thème
            })
              .setLngLat([location.longitude, location.latitude])
              .setPopup(popup)
              .addTo(map);
          });

          console.log('🎯 [SimpleMap] Map initialized successfully');
          setLoading(false);
        } else {
          console.error('❌ [SimpleMap] Map container not available');
          setError('Conteneur de carte non disponible');
          setLoading(false);
        }
      } catch (mapboxError) {
        console.error('❌ [SimpleMap] Mapbox GL JS loading error:', mapboxError);
        setError('Mapbox GL JS n\'a pas pu être chargé. Vérifiez votre connexion internet.');
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
        <Card className="bg-white shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Chargement de la carte</h3>
            <p className="text-slate-600 mb-4">Initialisation de la carte interactive...</p>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
              <Map className="h-4 w-4" />
              <span>Mapbox {mapboxReady ? '✓' : '⏳'}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[500px] bg-slate-100 rounded-lg flex items-center justify-center">
        <Card className="bg-white shadow-lg max-w-md">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">Carte non disponible</h3>
            <p className="text-slate-600 mb-6">{error}</p>
            
            <div className="flex gap-2 justify-center mb-6">
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
                <div className="max-h-32 overflow-y-auto space-y-2 bg-slate-50 rounded-lg p-3 border">
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

            <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Navigation className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Alternative</span>
              </div>
              <p className="text-xs text-blue-700">
                Explorez nos collections thématiques en attendant la restauration de la carte interactive.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 text-blue-700 border-blue-300"
                onClick={() => window.location.href = '/collections'}
              >
                Voir les Collections
              </Button>
            </div>
          </CardContent>
        </Card>
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
