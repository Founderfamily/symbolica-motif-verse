
import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { symbolGeolocationService, SymbolLocation } from '@/services/symbolGeolocationService';
import { toast } from '@/components/ui/use-toast';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';
import CulturalMarker from './CulturalMarker';
import SymbolCluster from './SymbolCluster';
import { gamificationService } from '@/services/gamification';
import { useMapInitialization } from '@/hooks/useMapInitialization';
import { useMapPerformance } from '@/hooks/useMapPerformance';
import MapContainer from './MapContainer';
import MapControls from './MapControls';
import MapLoadingStates from './MapLoadingStates';

const InteractiveMap = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { measureMapOperation } = useMapPerformance();
  
  // Map initialization hook
  const {
    mapContainerRef,
    mapLoaded,
    mapboxToken,
    tokenError,
    error,
    handleTokenSubmit
  } = useMapInitialization();

  // State management
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  const [exploreCount, setExploreCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [symbolLocations, setSymbolLocations] = useState<SymbolLocation[]>([]);
  const [exploredLocations, setExploredLocations] = useState<Set<string>>(new Set());
  const [showLegend, setShowLegend] = useState(false);
  const [activeCultureFilters, setActiveCultureFilters] = useState<Set<string>>(new Set());

  // Memoized calculations
  const availableCultures = useMemo(() => {
    return [...new Set(symbolLocations.map(loc => loc.culture))];
  }, [symbolLocations]);

  const locationsByCulture = useMemo(() => {
    const filteredLocations = symbolLocations.filter(loc => 
      activeCultureFilters.has(loc.culture)
    );
    
    const grouped: Record<string, SymbolLocation[]> = {};
    filteredLocations.forEach(loc => {
      if (!grouped[loc.culture]) {
        grouped[loc.culture] = [];
      }
      grouped[loc.culture].push(loc);
    });
    
    return grouped;
  }, [symbolLocations, activeCultureFilters]);

  const totalLocations = useMemo(() => {
    return Object.values(locationsByCulture).flat().length;
  }, [locationsByCulture]);

  // Fetch locations from the database
  useEffect(() => {
    const fetchLocations = async () => {
      await measureMapOperation('fetchLocations', async () => {
        try {
          console.log("Fetching symbol locations data...");
          setLoading(true);
          const locations = await symbolGeolocationService.getAllLocations();
          console.log(`Retrieved ${locations.length} symbol locations`);
          setSymbolLocations(locations);
          
          // Extract unique cultures for filtering
          const cultures = [...new Set(locations.map(loc => loc.culture))];
          // By default, show all cultures
          setActiveCultureFilters(new Set(cultures));
        } catch (err) {
          console.error("Failed to fetch symbol locations:", err);
          toast({
            title: t('error.title'),
            description: t('map.error.loadingLocations'),
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      });
    };
    
    fetchLocations();
  }, [t, measureMapOperation]);
  
  // Handle marker click and award points for exploration
  const handleLocationSelect = async (location: SymbolLocation) => {
    await measureMapOperation('locationSelect', async () => {
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
    });
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

  // If we don't have a token yet, show the auth form
  if (!mapboxToken || tokenError) {
    return (
      <MapLoadingStates
        loading={loading}
        error={error}
        mapboxToken={mapboxToken}
        tokenError={tokenError}
        onTokenSubmit={handleTokenSubmit}
      />
    );
  }

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
      
      <MapContainer mapContainerRef={mapContainerRef}>
        {/* Map Controls */}
        <MapControls
          showLegend={showLegend}
          setShowLegend={setShowLegend}
          availableCultures={availableCultures}
          activeCultureFilters={activeCultureFilters}
          onCultureFilterChange={handleCultureFilterChange}
        />
        
        {/* Loading and Error States */}
        <MapLoadingStates
          loading={loading}
          error={error}
          mapboxToken={mapboxToken}
          tokenError={tokenError}
          onTokenSubmit={handleTokenSubmit}
        />
        
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
      </MapContainer>
    </div>
  );
};

export default React.memo(InteractiveMap);
