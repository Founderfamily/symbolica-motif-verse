import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { 
  MapPin, 
  Navigation, 
  Layers, 
  Plus,
  Search,
  Filter,
  Crosshair,
  Settings,
  Users
} from 'lucide-react';
import { TreasureQuest } from '@/types/quests';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { investigationService } from '@/services/investigationService';
import AddLocationDialog from './AddLocationDialog';
import { useArchiveMap } from '@/contexts/ArchiveMapContext';
import CommunityMapContribution from './CommunityMapContribution';
import MapLegend from '@/components/map/MapLegend';

interface MapTabProps {
  quest: TreasureQuest;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

const InteractiveMapTab: React.FC<MapTabProps> = ({ quest, activeTab, setActiveTab }) => {
  const [mapToken, setMapToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [questLocations, setQuestLocations] = useState<any[]>([]);
  const [showCommunityTab, setShowCommunityTab] = useState(false);
  const [visibleLayers, setVisibleLayers] = useState({
    clues: true,
    archives: true,
    community: true
  });
  const { toast } = useToast();
  const { selectedArchive, archiveLocations, setSelectedLocation: setMapSelectedLocation } = useArchiveMap();
  
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const map = React.useRef<mapboxgl.Map | null>(null);

  // Get Mapbox token from Edge Function
  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        console.log('🗺️ [MapTab] Fetching Mapbox token...');
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        
        console.log('🗺️ [MapTab] Token response:', { data, error });
        
        if (error) {
          console.error('🗺️ [MapTab] Token fetch error:', error);
          throw error;
        }
        
        if (data && data.token) {
          console.log('✅ [MapTab] Token obtained successfully');
          setMapToken(data.token);
        } else {
          console.error('❌ [MapTab] No token in response:', data);
          toast({
            title: "Token Mapbox manquant",
            description: "La carte interactive nécessite un token Mapbox",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('❌ [MapTab] Error fetching Mapbox token:', error);
        toast({
          title: "Erreur de configuration",
          description: "Impossible de charger la carte interactive",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMapboxToken();
  }, []);

  // Load quest locations
  useEffect(() => {
    const loadQuestLocations = async () => {
      try {
        const result = await investigationService.getQuestLocations(quest.id);
        if (result.success) {
          setQuestLocations(result.data);
        }
      } catch (error) {
        console.error('Error loading quest locations:', error);
      }
    };

    loadQuestLocations();
  }, [quest.id]);

  const refreshLocations = async () => {
    try {
      const result = await investigationService.getQuestLocations(quest.id);
      if (result.success) {
        setQuestLocations(result.data);
        
        // Update map markers
        if (map.current) {
          // Remove existing markers and add new ones
          // This is a simplified approach - in production you'd want to manage markers more efficiently
          map.current.remove();
          // Re-initialize map with new data
          // The useEffect will handle this
        }
      }
    } catch (error) {
      console.error('Error refreshing locations:', error);
    }
  };

  // Initialize map when token is available
  useEffect(() => {
    if (!mapToken || !mapContainer.current || map.current) return;

    mapboxgl.accessToken = mapToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v11',
      center: [2.3522, 48.8566], // Paris center as default
      zoom: 6,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add geolocate control
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }),
      'top-right'
    );

    // Add markers for quest clues (from quest.clues)
    if (quest.clues && Array.isArray(quest.clues)) {
      quest.clues.forEach((clue: any, index: number) => {
        if (clue.location && clue.location.latitude && clue.location.longitude) {
          const { latitude, longitude } = clue.location;
            
          // Create marker for quest clue
          const marker = new mapboxgl.Marker({ color: '#EF4444' })
            .setLngLat([longitude, latitude])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML(`
                  <div class="p-2">
                    <h3 class="font-semibold text-red-600">Indice ${index + 1}</h3>
                    <p class="text-sm">${clue.description || clue.hint || 'Emplacement d\'indice'}</p>
                    ${clue.title ? `<p class="text-xs text-gray-600">${clue.title}</p>` : ''}
                  </div>
                `)
            )
            .addTo(map.current!);

          // Store marker with type for layer management
          marker.getElement().setAttribute('data-layer', 'clues');
        }
      });
    }

    // Add markers for archive locations (from context)
    archiveLocations.forEach((location) => {
      const marker = new mapboxgl.Marker({ color: '#8B5CF6' })
        .setLngLat([location.longitude, location.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-2">
                <h3 class="font-semibold text-purple-600">${location.name}</h3>
                <p class="text-sm">Site historique documenté</p>
                <p class="text-xs text-gray-600">${location.relatedDocuments?.length || 0} document(s) associé(s)</p>
                <button onclick="window.viewArchives('${location.id}')" class="text-xs text-blue-500 hover:underline mt-1">
                  📚 Voir archives →
                </button>
              </div>
            `)
        )
        .addTo(map.current!);
      
      // Store marker reference for later updates
      marker.getElement().addEventListener('click', () => {
        setMapSelectedLocation(location);
      });
      marker.getElement().setAttribute('data-layer', 'archives');
    });

    // Add markers for quest locations (from database)
    questLocations.forEach((location) => {
      const marker = new mapboxgl.Marker({ color: '#10B981' })
        .setLngLat([location.longitude, location.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-2">
                <h3 class="font-semibold text-green-600">${location.name}</h3>
                <p class="text-sm">${location.description || 'Lieu d\'intérêt'}</p>
                <p class="text-xs text-gray-600">${location.location_type}</p>
                ${location.historical_significance ? `<p class="text-xs mt-1">${location.historical_significance}</p>` : ''}
              </div>
            `)
        )
        .addTo(map.current!);
      marker.getElement().setAttribute('data-layer', 'community');
    });

    // Add function to window for popup button
    (window as any).viewArchives = (locationId: string) => {
      if (setActiveTab) {
        const location = archiveLocations.find(loc => loc.id === locationId);
        if (location) {
          setMapSelectedLocation(location);
          setActiveTab('archives');
        }
      }
    };

    // Fit map to show all markers
    const allCoordinates = [];
    
    // Add clue coordinates
    if (quest.clues) {
      quest.clues.forEach((clue: any) => {
        if (clue.location && clue.location.latitude && clue.location.longitude) {
          allCoordinates.push([clue.location.longitude, clue.location.latitude]);
        }
      });
    }
    
    // Add archive location coordinates
    archiveLocations.forEach(location => {
      allCoordinates.push([location.longitude, location.latitude]);
    });
    
    // Add quest location coordinates
    questLocations.forEach(location => {
      allCoordinates.push([location.longitude, location.latitude]);
    });
      
    if (allCoordinates.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      allCoordinates.forEach((coord: [number, number]) => {
        bounds.extend(coord);
      });
      map.current!.fitBounds(bounds, { padding: 50 });
    }

    return () => {
      map.current?.remove();
      // Clean up window function
      delete (window as any).viewArchives;
    };
  }, [mapToken, quest, questLocations, archiveLocations]);

  // Handle selectedArchive change - center map on corresponding location
  React.useEffect(() => {
    if (selectedArchive && map.current) {
      const location = archiveLocations.find(loc => 
        loc.relatedDocuments?.includes(selectedArchive)
      );
      if (location) {
        map.current.flyTo({
          center: [location.longitude, location.latitude],
          zoom: 18,
          essential: true
        });
        setMapSelectedLocation(location);
      }
    }
  }, [selectedArchive, archiveLocations]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([longitude, latitude]);
          
          if (map.current) {
            map.current.flyTo({
              center: [longitude, latitude],
              zoom: 15
            });
          }
          
          toast({
            title: "Position obtenue",
            description: "Votre position actuelle a été localisée",
          });
        },
        (error) => {
          toast({
            title: "Erreur de géolocalisation",
            description: "Impossible d'obtenir votre position",
            variant: "destructive",
          });
        }
      );
    }
  };

  const handleCommunityContribution = (contribution: any) => {
    toast({
      title: "Contribution reçue",
      description: `Merci pour votre contribution: ${contribution.title}`,
    });
    // Ici on pourrait envoyer vers une API de validation communautaire
  };

  const handleToggleLayer = (type: 'clues' | 'archives' | 'community') => {
    setVisibleLayers(prev => ({
      ...prev,
      [type]: !prev[type]
    }));

    // Toggle markers visibility on map
    if (map.current) {
      const markers = document.querySelectorAll(`[data-layer="${type}"]`);
      markers.forEach(marker => {
        const element = marker as HTMLElement;
        element.style.display = visibleLayers[type] ? 'none' : 'block';
      });
    }
  };

  // Calculate counts
  const clueCount = quest.clues?.filter((clue: any) => clue.location).length || 0;
  const archiveCount = archiveLocations.length;
  const communityCount = questLocations.length;

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Chargement de la carte...</p>
        </CardContent>
      </Card>
    );
  }

  if (!mapToken) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="text-center py-12">
            <MapPin className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">Configuration requise</h3>
            <p className="text-slate-500 mb-4">
              La carte interactive nécessite un token Mapbox pour fonctionner.
            </p>
            <p className="text-sm text-slate-400">
              Contactez l'administrateur pour configurer l'intégration Mapbox.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation tabs */}
      <div className="flex gap-2 mb-4">
        <Button 
          variant={!showCommunityTab ? "default" : "outline"}
          onClick={() => setShowCommunityTab(false)}
        >
          <MapPin className="h-4 w-4 mr-2" />
          Carte Interactive
        </Button>
        <Button 
          variant={showCommunityTab ? "default" : "outline"}
          onClick={() => setShowCommunityTab(true)}
        >
          <Users className="h-4 w-4 mr-2" />
          Contributions Communautaires
        </Button>
      </div>

      {showCommunityTab ? (
        <CommunityMapContribution onContributionSubmit={handleCommunityContribution} />
      ) : (
        <>
          {/* Contrôles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Carte Interactive
              </CardTitle>
            </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un lieu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={getCurrentLocation}>
                <Crosshair className="h-4 w-4 mr-2" />
                Ma Position
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
              <AddLocationDialog questId={quest.id} onLocationAdded={refreshLocations}>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter Lieu
                </Button>
              </AddLocationDialog>
            </div>
          </div>

          {/* Résumé des données */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              {clueCount} Indice{clueCount > 1 ? 's' : ''}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              {archiveCount} Site{archiveCount > 1 ? 's' : ''} historique{archiveCount > 1 ? 's' : ''}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              {communityCount} Lieu{communityCount > 1 ? 'x' : ''} communautaire{communityCount > 1 ? 's' : ''}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Carte */}
      <Card className="overflow-hidden relative">
        <div 
          ref={mapContainer} 
          className="w-full h-[600px]"
          style={{ minHeight: '600px' }}
        />
        {mapToken && (
          <MapLegend 
            clueCount={clueCount}
            archiveCount={archiveCount}
            communityCount={communityCount}
            visibleLayers={visibleLayers}
            onToggleLayer={handleToggleLayer}
          />
        )}
      </Card>

      {/* Informations sur la localisation sélectionnée */}
      {selectedLocation && (
        <Card>
          <CardHeader>
            <CardTitle>Détails du lieu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">{selectedLocation.name}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedLocation.description}
              </p>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline">
                  Voir détails
                </Button>
                <Button size="sm" variant="outline">
                  Ajouter note
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
        </>
      )}
    </div>
  );
};

export default InteractiveMapTab;