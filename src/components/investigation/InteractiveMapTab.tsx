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
  Settings
} from 'lucide-react';
import { TreasureQuest } from '@/types/quests';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface MapTabProps {
  quest: TreasureQuest;
}

const InteractiveMapTab: React.FC<MapTabProps> = ({ quest }) => {
  const [mapToken, setMapToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const { toast } = useToast();
  
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const map = React.useRef<mapboxgl.Map | null>(null);

  // Get Mapbox token from Edge Function
  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        
        if (error) throw error;
        
        if (data.token) {
          setMapToken(data.token);
        } else {
          toast({
            title: "Token Mapbox manquant",
            description: "La carte interactive nécessite un token Mapbox",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching Mapbox token:', error);
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

    // Parse quest clues to extract locations
    if (quest.clues && Array.isArray(quest.clues)) {
      quest.clues.forEach((clue: any, index: number) => {
        if (clue.coordinates) {
          const [lng, lat] = clue.coordinates;
            
            // Create marker
            const marker = new mapboxgl.Marker({ color: '#3B82F6' })
              .setLngLat([lng, lat])
              .setPopup(
                new mapboxgl.Popup({ offset: 25 })
                  .setHTML(`
                    <div class="p-2">
                      <h3 class="font-semibold">Indice ${index + 1}</h3>
                      <p class="text-sm">${clue.description || 'Emplacement d\'intérêt'}</p>
                    </div>
                  `)
              )
              .addTo(map.current!);
          }
        });

        // Fit map to show all markers if there are coordinates
        const coordinates = quest.clues
          .filter((clue: any) => clue.coordinates)
          .map((clue: any) => clue.coordinates);
          
        if (coordinates.length > 0) {
          const bounds = new mapboxgl.LngLatBounds();
          coordinates.forEach((coord: [number, number]) => {
            bounds.extend(coord);
          });
          map.current!.fitBounds(bounds, { padding: 50 });
        }
      }

    return () => {
      map.current?.remove();
    };
  }, [mapToken, quest]);

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
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter Lieu
              </Button>
            </div>
          </div>

          {/* Fonctionnalités */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Navigation className="w-4 h-4" />
              Navigation GPS
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Layers className="w-4 h-4" />
              Couches Historiques
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              Points d'Intérêt
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Carte */}
      <Card className="overflow-hidden">
        <div 
          ref={mapContainer} 
          className="w-full h-[600px]"
          style={{ minHeight: '600px' }}
        />
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
    </div>
  );
};

export default InteractiveMapTab;