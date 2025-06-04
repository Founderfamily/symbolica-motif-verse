import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Loader2, AlertCircle, Filter } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { symbolGeolocationService, SymbolLocation } from '@/services/symbolGeolocationService';
import { toast } from '@/components/ui/use-toast';
import MapboxAuth from './MapboxAuth';
import { I18nText } from '@/components/ui/i18n-text';
import { mapboxAuthService } from '@/services/mapboxAuthService';
import { ErrorHandler } from '@/utils/errorHandler';
import { useAuth } from '@/hooks/useAuth';
import CulturalMarker from './CulturalMarker';
import SymbolCluster from './SymbolCluster';
import CultureLegend from './CultureLegend';
import { Button } from '@/components/ui/button';
import { gamificationService } from '@/services/gamification';

// Default map settings
const DEFAULT_MAP_CENTER: [number, number] = [0, 20]; // Initial position at [longitude, latitude]
const DEFAULT_ZOOM = 1.5;

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
  const [mapboxToken, setMapboxToken] = useState<string | null>(mapboxAuthService.getToken());
  const [tokenError, setTokenError] = useState<boolean>(false);
  const mapInitializedRef = useRef<boolean>(false);
  const [exploredLocations, setExploredLocations] = useState<Set<string>>(new Set());
  const [showLegend, setShowLegend] = useState(false);
  const [activeCultureFilters, setActiveCultureFilters] = useState<Set<string>>(new Set());
  const [availableCultures, setAvailableCultures] = useState<string[]>([]);

  // Fetch locations from the database
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        console.log("Fetching symbol locations data...");
        setLoading(true);
        const locations = await symbolGeolocationService.getAllLocations();
        console.log(`Retrieved ${locations.length} symbol locations`);
        setSymbolLocations(locations);
        
        // Extract unique cultures for filtering
        const cultures = [...new Set(locations.map(loc => loc.culture))];
        setAvailableCultures(cultures);
        // By default, show all cultures
        setActiveCultureFilters(new Set(cultures));
        
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
  
  // Initialize or reinitialize the map when token changes
  useEffect(() => {
    // Skip if no token, no container, or map already initialized
    if (!mapboxToken || !mapContainerRef.current || mapInitializedRef.current) return;
    
    console.log("Initializing map with token...");
    setTokenError(false);
    
    try {
      // Initialize Mapbox
      mapboxgl.accessToken = mapboxToken;
      
      const newMap = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: DEFAULT_MAP_CENTER,
        zoom: DEFAULT_ZOOM,
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
        console.log("Map loaded successfully");
        setMapLoaded(true);
        spinGlobe();
        
        // Start animation loop
        const animationInterval = setInterval(spinGlobe, 1000);
        
        return () => clearInterval(animationInterval);
      });

      // Detect errors during map initialization
      newMap.on('error', (e) => {
        console.error("Mapbox map error:", e);
        const mapError = e.error as any;
        
        // Handle authentication errors
        if (mapError?.status === 401) {
          setTokenError(true);
          setError("Invalid Mapbox token. Please try again with a valid token.");
          mapInitializedRef.current = false;
          
          // Clear invalid token
          mapboxAuthService.clearToken();
          
          // Show a toast notification
          toast({
            title: "Authentication error",
            description: "Your Mapbox token is invalid or expired. Please provide a new one.",
            variant: "destructive",
          });
        }
      });

      map.current = newMap;
      mapInitializedRef.current = true;

      // Cleanup function
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
  
  // Handle marker click and award points for exploration
  const handleLocationSelect = async (location: SymbolLocation) => {
    setActiveLocation(location.id);
    
    // Mark the location as explored
    if (!exploredLocations.has(location.id)) {
      const newExplored = new Set(exploredLocations);
      newExplored.add(location.id);
      setExploredLocations(newExplored);
      setExploreCount(prev => prev + 1);
      
      // Award points if user is logged in
      if (user) {
        try {
          await gamificationService.awardPoints(
            user.id,
            'exploration',
            5,
            location.id,
            {
              locationName: location.name,
              culture: location.culture,
              coordinates: `${location.latitude},${location.longitude}`
            }
          );
          
          toast({
            title: t('gamification.pointsEarned'),
            description: t('gamification.earnedForExploration', { points: 5 }),
            variant: "default",
          });
        } catch (error) {
          console.error("Failed to award points:", error);
        }
      }
    }
  };
  
  // Toggle culture filter
  const handleCultureFilterChange = (culture: string, active: boolean) => {
    const newFilters = new Set(activeCultureFilters);
    if (active) {
      newFilters.add(culture);
    } else {
      newFilters.delete(culture);
    }
    setActiveCultureFilters(newFilters);
  };
  
  // Group locations by culture for clustering
  const getLocationsByCulture = () => {
    // Only include locations that match current culture filters
    const filteredLocations = symbolLocations.filter(loc => 
      activeCultureFilters.has(loc.culture)
    );
    
    // Group by culture
    const grouped: Record<string, SymbolLocation[]> = {};
    filteredLocations.forEach(loc => {
      if (!grouped[loc.culture]) {
        grouped[loc.culture] = [];
      }
      grouped[loc.culture].push(loc);
    });
    
    return grouped;
  };
  
  // Handle token submission from auth component
  const handleTokenSubmit = (token: string) => {
    console.log("New Mapbox token received");
    setMapboxToken(token);
    // Reset error states
    setTokenError(false);
    setError(null);
  };

  // If we don't have a token yet, show the auth form
  if (!mapboxToken || tokenError) {
    return (
      <div className="space-y-4">
        <MapboxAuth onTokenSubmit={handleTokenSubmit} />
        
        {tokenError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
            <p className="text-sm text-red-600">
              <I18nText translationKey="map.error.invalidToken" />
            </p>
          </div>
        )}
      </div>
    );
  }
  
  // Get grouped locations for efficient rendering
  const locationsByCulture = getLocationsByCulture();
  const totalLocations = Object.values(locationsByCulture).flat().length;

  return (
    <div className="space-y-4">
      {user && (
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-amber-800">
              <I18nText translationKey="map.exploreInstructions" />
            </p>
            <p className="text-xs text-amber-700">
              <I18nText translationKey="map.earnPoints" />
            </p>
          </div>
          {exploreCount > 0 && (
            <Badge className="bg-amber-100 text-amber-800 gap-1 flex items-center">
              <Star className="h-3 w-3 fill-amber-500" />
              <span>+{exploreCount * 5} <I18nText translationKey="gamification.points" /></span>
            </Badge>
          )}
        </div>
      )}
      
      <div className="relative w-full h-[500px] rounded-lg overflow-hidden shadow-md border border-slate-200">
        {/* Mapbox container */}
        <div ref={mapContainerRef} className="absolute inset-0 bg-slate-50" />
        
        {/* Culture filter toggle */}
        <div className="absolute top-4 left-4 z-20">
          <Button 
            variant={showLegend ? "default" : "outline"} 
            size="sm"
            className="bg-white text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-100"
            onClick={() => setShowLegend(!showLegend)}
          >
            <Filter className="h-4 w-4 mr-1" />
            <I18nText translationKey="map.filters.cultures" />
            {availableCultures.length > 0 && (
              <Badge variant="secondary" className="ml-2 bg-slate-200">
                {activeCultureFilters.size}/{availableCultures.length}
              </Badge>
            )}
          </Button>
          
          {/* Culture legend/filter panel */}
          {showLegend && (
            <div className="absolute top-12 left-0 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
              <CultureLegend 
                cultures={availableCultures}
                onFilterChange={handleCultureFilterChange}
                activeCultures={activeCultureFilters}
              />
            </div>
          )}
        </div>
        
        {/* Show loading state */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50/70 z-30">
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
              <p className="text-sm text-slate-600"><I18nText translationKey="map.loading" /></p>
            </div>
          </div>
        )}
        
        {/* Show error message if any */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50/90 z-30">
            <div className="bg-white p-4 rounded-lg shadow-md border border-red-100 text-red-600 max-w-sm">
              <p>{error}</p>
              <p className="text-sm mt-2"><I18nText translationKey="map.tryAgainLater" /></p>
            </div>
          </div>
        )}
        
        {/* Render map markers/clusters after map is loaded */}
        {mapLoaded && !loading && Object.entries(locationsByCulture).map(([culture, locations]) => (
          // If there are multiple locations for this culture, create a cluster
          locations.length > 1 ? (
            <SymbolCluster
              key={`cluster-${culture}`}
              culture={culture}
              locations={locations}
              onLocationSelect={handleLocationSelect}
              exploredLocations={exploredLocations}
            />
          ) : (
            // If there's just one location, render a single marker
            locations.length === 1 && (
              <CulturalMarker 
                key={locations[0].id}
                location={locations[0]}
                onClick={() => handleLocationSelect(locations[0])}
                isActive={activeLocation === locations[0].id}
                isExplored={exploredLocations.has(locations[0].id)}
              />
            )
          )
        ))}
        
        {/* Show message when no locations are available */}
        {mapLoaded && !loading && totalLocations === 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-md max-w-xs">
              <p className="text-center text-slate-600">
                {activeCultureFilters.size === 0 ? (
                  <I18nText translationKey="map.noFilterSelected" />
                ) : (
                  <I18nText translationKey="map.noLocationsMessage" />
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveMap;
