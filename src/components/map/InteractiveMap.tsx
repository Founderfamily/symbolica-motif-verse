
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import MapSymbolMarker from './MapSymbolMarker';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Loader2 } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { symbolGeolocationService, SymbolLocation } from '@/services/symbolGeolocationService';
import { toast } from '@/components/ui/use-toast';

// Temporary Mapbox token - in production this should be stored securely
// and loaded from environment variables or server-side
const MAPBOX_TOKEN = 'pk.eyJ1Ijoic3ltYm9saWNhIiwiYSI6ImNsdjV5Zm9nODFnMmEycXBwNDI2M3QwdXEifQ.pshEPEGmIHumtf9dqbJeBA';

// This is an upgraded component for the interactive map using Mapbox
const InteractiveMap = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  const [exploreCount, setExploreCount] = useState(0);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [symbolLocations, setSymbolLocations] = useState<SymbolLocation[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const locations = await symbolGeolocationService.getAllLocations();
        setSymbolLocations(locations);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch symbol locations:", err);
        setError("Failed to load symbol locations");
        toast({
          title: t('error.title'),
          description: t('map.error.loadingLocations'),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchLocations();
  }, [t]);
  
  useEffect(() => {
    if (!mapContainerRef.current || map.current) return;
    
    // Initialize Mapbox
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    const newMap = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [0, 20], // Initial position at [longitude, latitude]
      zoom: 1.5,
      minZoom: 1,
      projection: 'globe'
    });

    // Add navigation controls (zoom in/out)
    newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Add fullscreen control
    newMap.addControl(new mapboxgl.FullscreenControl());

    // Add atmosphere and fog for better globe visualization
    newMap.on('style.load', () => {
      newMap.setFog({
        color: 'rgb(255, 255, 255)',
        'high-color': 'rgb(200, 200, 225)',
        'horizon-blend': 0.2,
      });
    });

    // Add gentle globe rotation animation
    const secondsPerRevolution = 240;
    const maxSpinZoom = 3;
    let userInteracting = false;
    let spinEnabled = true;

    // Function to spin the globe
    function spinGlobe() {
      if (!newMap) return;
      
      const zoom = newMap.getZoom();
      if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        const distancePerSecond = 360 / secondsPerRevolution;
        const center = newMap.getCenter();
        center.lng -= distancePerSecond * 0.05;
        newMap.easeTo({ center, duration: 1000, easing: (n) => n });
      }
    }

    // Event listeners for interaction
    newMap.on('mousedown', () => {
      userInteracting = true;
    });
    
    newMap.on('mouseup', () => {
      userInteracting = false;
      spinGlobe();
    });
    
    newMap.on('touchstart', () => {
      userInteracting = true;
    });
    
    newMap.on('touchend', () => {
      userInteracting = false;
      spinGlobe();
    });

    // Start the spinning once the map has loaded
    newMap.on('load', () => {
      setMapLoaded(true);
      spinGlobe();
      
      // Start animation loop
      const animationInterval = setInterval(spinGlobe, 1000);
      
      return () => clearInterval(animationInterval);
    });

    map.current = newMap;

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);
  
  const handleMarkerClick = (id: string) => {
    setActiveLocation(id);
    setExploreCount(prev => prev + 1);
  };
  
  return (
    <div className="space-y-4">
      {user && (
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-amber-800">
              {t('map.exploreInstructions')}
            </p>
            <p className="text-xs text-amber-700">
              {t('map.earnPoints')}
            </p>
          </div>
          {exploreCount > 0 && (
            <Badge className="bg-amber-100 text-amber-800 gap-1 flex items-center">
              <Star className="h-3 w-3 fill-amber-500" />
              <span>+{exploreCount * 5} {t('gamification.points')}</span>
            </Badge>
          )}
        </div>
      )}
      
      <div className="relative w-full h-[500px] rounded-lg overflow-hidden shadow-md border border-slate-200">
        {/* Mapbox container */}
        <div ref={mapContainerRef} className="absolute inset-0 bg-slate-50" />
        
        {/* Show loading state */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50/70 z-30">
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
              <p className="text-sm text-slate-600">{t('map.loading')}</p>
            </div>
          </div>
        )}
        
        {/* Show error message if any */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50/90 z-30">
            <div className="bg-white p-4 rounded-lg shadow-md border border-red-100 text-red-600 max-w-sm">
              <p>{error}</p>
              <p className="text-sm mt-2">{t('map.tryAgainLater')}</p>
            </div>
          </div>
        )}
        
        {/* Render map markers only after map is loaded */}
        {mapLoaded && !loading && symbolLocations.map((location) => (
          <MapSymbolMarker
            key={location.id}
            id={location.id}
            name={location.name}
            culture={location.culture}
            lat={location.latitude}
            lng={location.longitude}
            isVerified={location.is_verified || location.verification_status === 'verified'}
            historicalPeriod={location.historical_period}
            source={location.source}
            description={location.description}
            onClick={() => handleMarkerClick(location.id)}
          />
        ))}
        
        {/* Show message when no locations are available */}
        {mapLoaded && !loading && symbolLocations.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-md max-w-xs">
              <p className="text-center text-slate-600">{t('map.noLocationsMessage')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveMap;
