
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { mapboxAuthService } from '@/services/mapboxAuthService';
import { ErrorHandler } from '@/utils/errorHandler';
import { toast } from '@/components/ui/use-toast';

// Default map settings
const DEFAULT_MAP_CENTER: [number, number] = [0, 20];
const DEFAULT_ZOOM = 1.5;

export const useMapInitialization = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const mapInitializedRef = useRef<boolean>(false);
  
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapboxToken, setMapboxToken] = useState<string | null>(mapboxAuthService.getToken());
  const [tokenError, setTokenError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize or reinitialize the map when token changes
  useEffect(() => {
    if (!mapboxToken || !mapContainerRef.current || mapInitializedRef.current) return;
    
    console.log("Initializing map with token...");
    setTokenError(false);
    
    try {
      mapboxgl.accessToken = mapboxToken;
      
      const newMap = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: DEFAULT_MAP_CENTER,
        zoom: DEFAULT_ZOOM,
        minZoom: 1,
        projection: 'globe'
      });

      // Add controls
      newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
      newMap.addControl(new mapboxgl.FullscreenControl());

      // Add atmosphere
      newMap.on('style.load', () => {
        newMap.setFog({
          color: 'rgb(255, 255, 255)',
          'high-color': 'rgb(200, 200, 225)',
          'horizon-blend': 0.2,
        });
      });

      // Globe rotation setup
      setupGlobeRotation(newMap);

      newMap.on('load', () => {
        console.log("Map loaded successfully");
        setMapLoaded(true);
      });

      // Handle errors
      newMap.on('error', (e) => {
        console.error("Mapbox map error:", e);
        const mapError = e.error as any;
        
        if (mapError?.status === 401) {
          setTokenError(true);
          setError("Invalid Mapbox token. Please try again with a valid token.");
          mapInitializedRef.current = false;
          mapboxAuthService.clearToken();
          
          toast({
            title: "Authentication error",
            description: "Your Mapbox token is invalid or expired. Please provide a new one.",
            variant: "destructive",
          });
        }
      });

      map.current = newMap;
      mapInitializedRef.current = true;

      return () => {
        if (map.current) {
          map.current.remove();
          map.current = null;
          mapInitializedRef.current = false;
        }
      };
    } catch (err) {
      console.error("Error initializing map:", err);
      ErrorHandler.handleGenericError(err, 'Map initialization', 'Failed to initialize map. Please try again.');
      setTokenError(true);
      setError("Failed to initialize map. Please try again.");
      mapInitializedRef.current = false;
    }
  }, [mapboxToken]);

  const handleTokenSubmit = (token: string) => {
    console.log("New Mapbox token received");
    setMapboxToken(token);
    setTokenError(false);
    setError(null);
  };

  return {
    mapContainerRef,
    map: map.current,
    mapLoaded,
    mapboxToken,
    tokenError,
    error,
    handleTokenSubmit
  };
};

// Helper function for globe rotation
function setupGlobeRotation(map: mapboxgl.Map) {
  const secondsPerRevolution = 240;
  const maxSpinZoom = 3;
  let userInteracting = false;
  let spinEnabled = true;

  function spinGlobe() {
    if (!map) return;
    
    const zoom = map.getZoom();
    if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
      const distancePerSecond = 360 / secondsPerRevolution;
      const center = map.getCenter();
      center.lng -= distancePerSecond * 0.05;
      map.easeTo({ center, duration: 1000, easing: (n) => n });
    }
  }

  map.on('mousedown', () => { userInteracting = true; });
  map.on('mouseup', () => { userInteracting = false; spinGlobe(); });
  map.on('touchstart', () => { userInteracting = true; });
  map.on('touchend', () => { userInteracting = false; spinGlobe(); });

  // Start spinning
  spinGlobe();
  const animationInterval = setInterval(spinGlobe, 1000);
  
  return () => clearInterval(animationInterval);
}
