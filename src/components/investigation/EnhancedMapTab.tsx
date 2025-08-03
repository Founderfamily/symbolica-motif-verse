import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { 
  MapPin, 
  Brain, 
  Search,
  Layers,
  Target,
  Crown,
  Mountain,
  Castle,
  Compass,
  TrendingUp,
  AlertCircle,
  Navigation
} from 'lucide-react';
import { TreasureQuest } from '@/types/quests';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { investigationService } from '@/services/investigationService';

interface AILocationSuggestion {
  id: string;
  name: string;
  coordinates: [number, number];
  relevance_score: number;
  historical_period: string;
  reasoning: string;
  confidence: number;
  type: 'fortress' | 'castle' | 'church' | 'archive' | 'monument';
  verified: boolean;
}

interface CorrelationZone {
  id: string;
  center: [number, number];
  radius: number;
  correlation_strength: number;
  connected_locations: string[];
  time_period: string;
}

interface EnhancedMapTabProps {
  quest: TreasureQuest;
}

const EnhancedMapTab: React.FC<EnhancedMapTabProps> = ({ quest }) => {
  const [mapToken, setMapToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<AILocationSuggestion[]>([]);
  const [correlationZones, setCorrelationZones] = useState<CorrelationZone[]>([]);
  const [questLocations, setQuestLocations] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<AILocationSuggestion | null>(null);
  const [showAILayer, setShowAILayer] = useState(true);
  const [showCorrelations, setShowCorrelations] = useState(true);
  const { toast } = useToast();
  
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const map = React.useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    fetchMapboxToken();
    loadAILocationData();
  }, [quest.id]);

  const fetchMapboxToken = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-mapbox-token');
      
      if (error) throw error;
      
      if (data && data.token) {
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

  const loadAILocationData = async () => {
    try {
      // Charger les lieux existants
      const result = await investigationService.getQuestLocations(quest.id);
      if (result.success) {
        setQuestLocations(result.data);
      }

      // Simuler des suggestions IA basées sur l'analyse de la quête
      const mockAISuggestions: AILocationSuggestion[] = [
        {
          id: '1',
          name: 'Château de Fontainebleau',
          coordinates: [2.7000, 48.4000],
          relevance_score: 0.95,
          historical_period: 'Renaissance (François Ier)',
          reasoning: 'Résidence favorite de François Ier, contient de nombreux symboles de la salamandre royale',
          confidence: 92,
          type: 'castle',
          verified: true
        },
        {
          id: '2',
          name: 'Bureau de Napoléon - Fontainebleau',
          coordinates: [2.7005, 48.4005],
          relevance_score: 0.78,
          historical_period: 'Empire (Napoléon Ier)',
          reasoning: 'Lieu où Napoléon a signé son abdication, possible lien avec les symboles découverts',
          confidence: 78,
          type: 'monument',
          verified: false
        },
        {
          id: '3',
          name: 'Château de Chambord',
          coordinates: [1.5170, 47.6160],
          relevance_score: 0.84,
          historical_period: 'Renaissance (François Ier)',
          reasoning: 'Chef-d\'œuvre architectural de François Ier, influence de Léonard de Vinci',
          confidence: 84,
          type: 'castle',
          verified: true
        },
        {
          id: '4',
          name: 'Archives Nationales - Paris',
          coordinates: [2.3522, 48.8566],
          relevance_score: 0.71,
          historical_period: 'Multi-périodes',
          reasoning: 'Sources documentaires sur François Ier et Napoléon, archives royales',
          confidence: 71,
          type: 'archive',
          verified: false
        }
      ];

      setAiSuggestions(mockAISuggestions);

      // Générer des zones de corrélation
      const mockCorrelationZones: CorrelationZone[] = [
        {
          id: '1',
          center: [2.7000, 48.4000],
          radius: 50000, // 50km
          correlation_strength: 0.89,
          connected_locations: ['Château de Fontainebleau', 'Bureau de Napoléon'],
          time_period: 'Renaissance-Empire'
        },
        {
          id: '2',
          center: [1.8000, 47.8000],
          radius: 80000, // 80km
          correlation_strength: 0.76,
          connected_locations: ['Château de Chambord', 'Loire Valley'],
          time_period: 'Renaissance'
        }
      ];

      setCorrelationZones(mockCorrelationZones);

    } catch (error) {
      console.error('Error loading AI location data:', error);
    }
  };

  useEffect(() => {
    if (!mapToken || !mapContainer.current || map.current) return;

    mapboxgl.accessToken = mapToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v11',
      center: [2.3522, 48.8566],
      zoom: 6,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      addAIMarkersAndLayers();
    });

    return () => {
      map.current?.remove();
    };
  }, [mapToken, aiSuggestions, correlationZones, showAILayer, showCorrelations]);

  const addAIMarkersAndLayers = () => {
    if (!map.current) return;

    // Ajouter les zones de corrélation
    if (showCorrelations) {
      correlationZones.forEach((zone) => {
        const circle = new mapboxgl.Marker({
          element: createCorrelationZoneElement(zone),
          anchor: 'center'
        })
        .setLngLat(zone.center)
        .addTo(map.current!);

        // Ajouter un cercle de corrélation
        map.current!.addSource(`correlation-zone-${zone.id}`, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: zone.center
            }
          }
        });

        map.current!.addLayer({
          id: `correlation-zone-circle-${zone.id}`,
          type: 'circle',
          source: `correlation-zone-${zone.id}`,
          paint: {
            'circle-radius': {
              stops: [
                [0, 0],
                [20, zone.radius / 1000] // Convert to approximate pixels
              ],
              base: 2
            },
            'circle-color': '#8B5CF6',
            'circle-opacity': 0.1,
            'circle-stroke-color': '#8B5CF6',
            'circle-stroke-width': 2,
            'circle-stroke-opacity': 0.8
          }
        });
      });
    }

    // Ajouter les suggestions IA
    if (showAILayer) {
      aiSuggestions.forEach((suggestion) => {
        const marker = new mapboxgl.Marker({
          element: createAIMarkerElement(suggestion),
          anchor: 'bottom'
        })
        .setLngLat(suggestion.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(createAIPopupContent(suggestion))
        )
        .addTo(map.current!);
      });
    }

    // Ajouter les lieux existants
    questLocations.forEach((location) => {
      const marker = new mapboxgl.Marker({ color: '#10B981' })
        .setLngLat([location.longitude, location.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-3">
                <h3 class="font-semibold text-green-600 mb-2">${location.name}</h3>
                <p class="text-sm mb-2">${location.description || 'Lieu d\'intérêt'}</p>
                <div class="text-xs text-gray-600">
                  <div>Type: ${location.location_type}</div>
                  ${location.historical_significance ? `<div class="mt-1">${location.historical_significance}</div>` : ''}
                </div>
              </div>
            `)
        )
        .addTo(map.current!);
    });
  };

  const createAIMarkerElement = (suggestion: AILocationSuggestion) => {
    const el = document.createElement('div');
    el.className = 'ai-marker';
    el.innerHTML = `
      <div class="relative">
        <div class="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
          ${getLocationTypeIcon(suggestion.type)}
        </div>
        ${suggestion.verified ? '' : '<div class="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border border-white"></div>'}
      </div>
    `;
    return el;
  };

  const createCorrelationZoneElement = (zone: CorrelationZone) => {
    const el = document.createElement('div');
    el.className = 'correlation-zone-marker';
    el.innerHTML = `
      <div class="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center opacity-80">
        <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8A6 6 0 006 8c0 7-3 9-3 9s3-2 3-9a6 6 0 0112 0z"/>
        </svg>
      </div>
    `;
    return el;
  };

  const createAIPopupContent = (suggestion: AILocationSuggestion) => {
    return `
      <div class="p-3 min-w-64">
        <div class="flex items-start justify-between mb-2">
          <h3 class="font-semibold text-indigo-600">${suggestion.name}</h3>
          <div class="flex items-center gap-1 ml-2">
            <div class="w-2 h-2 bg-indigo-600 rounded-full"></div>
            <span class="text-xs text-gray-600">${suggestion.confidence}%</span>
          </div>
        </div>
        
        <div class="space-y-2 text-sm">
          <div>
            <span class="font-medium text-gray-700">Période:</span>
            <span class="text-gray-600 ml-2">${suggestion.historical_period}</span>
          </div>
          
          <div>
            <span class="font-medium text-gray-700">Pertinence:</span>
            <div class="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div class="bg-indigo-600 h-1.5 rounded-full" style="width: ${suggestion.relevance_score * 100}%"></div>
            </div>
          </div>
          
          <p class="text-gray-600 text-xs mt-2">${suggestion.reasoning}</p>
          
          ${!suggestion.verified ? '<div class="bg-amber-50 p-2 rounded-lg mt-2"><span class="text-amber-700 text-xs">⚠️ Suggestion IA - À vérifier</span></div>' : ''}
        </div>
      </div>
    `;
  };

  const getLocationTypeIcon = (type: AILocationSuggestion['type']) => {
    const iconClass = "w-4 h-4 text-white";
    switch (type) {
      case 'castle': return `<svg class="${iconClass}" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/></svg>`;
      case 'fortress': return `<svg class="${iconClass}" fill="currentColor" viewBox="0 0 20 20"><path d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2a1 1 0 01-1.414 0l-2-2A1 1 0 016 15v-3.586L1.293 6.707A1 1 0 011 6V3z"/></svg>`;
      case 'church': return `<svg class="${iconClass}" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2l3 3h4l-3.5 7.5h-7L3 5h4l3-3z"/></svg>`;
      case 'archive': return `<svg class="${iconClass}" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/><path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/></svg>`;
      case 'monument': return `<svg class="${iconClass}" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/><path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/></svg>`;
      default: return `<svg class="${iconClass}" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"/></svg>`;
    }
  };

  const filteredSuggestions = aiSuggestions.filter(suggestion =>
    suggestion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    suggestion.historical_period.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Chargement de la carte enrichie IA...</p>
        </CardContent>
      </Card>
    );
  }

  if (!mapToken) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <MapPin className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">Configuration requise</h3>
          <p className="text-slate-500">La carte interactive nécessite un token Mapbox pour fonctionner.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Contrôles enrichis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-indigo-600" />
            Carte Interactive Enrichie IA
            <Badge variant="secondary" className="ml-auto">
              {aiSuggestions.length} suggestions IA
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans les suggestions IA..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={showAILayer ? "default" : "outline"} 
                size="sm"
                onClick={() => setShowAILayer(!showAILayer)}
              >
                <Brain className="h-4 w-4 mr-2" />
                Suggestions IA
              </Button>
              <Button 
                variant={showCorrelations ? "default" : "outline"} 
                size="sm"
                onClick={() => setShowCorrelations(!showCorrelations)}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Corrélations
              </Button>
            </div>
          </div>

          {/* Statistiques des analyses IA */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-indigo-50 rounded-lg">
              <div className="text-lg font-bold text-indigo-800">{aiSuggestions.length}</div>
              <div className="text-xs text-indigo-600">Lieux Suggérés</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-800">{correlationZones.length}</div>
              <div className="text-xs text-purple-600">Zones de Corrélation</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-800">
                {aiSuggestions.filter(s => s.verified).length}
              </div>
              <div className="text-xs text-green-600">Vérifiés</div>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <div className="text-lg font-bold text-amber-800">
                {Math.round(aiSuggestions.reduce((acc, s) => acc + s.confidence, 0) / aiSuggestions.length)}%
              </div>
              <div className="text-xs text-amber-600">Confiance Moy.</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Carte */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div 
              ref={mapContainer} 
              className="w-full h-[600px]"
              style={{ minHeight: '600px' }}
            />
          </Card>
        </div>

        {/* Panneau des suggestions IA */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Suggestions IA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="p-3 rounded-lg border border-slate-100 hover:border-indigo-200 cursor-pointer transition-colors"
                    onClick={() => setSelectedLocation(suggestion)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm text-slate-800 flex items-center gap-2">
                        {suggestion.type === 'castle' && <Castle className="w-4 h-4" />}
                        {suggestion.type === 'monument' && <Crown className="w-4 h-4" />}
                        {suggestion.type === 'archive' && <Search className="w-4 h-4" />}
                        {suggestion.name}
                      </h4>
                      <Badge variant={suggestion.verified ? "default" : "outline"} className="text-xs">
                        {suggestion.confidence}%
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-slate-600 mb-2">
                      {suggestion.historical_period}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="w-16 bg-slate-200 rounded-full h-1.5">
                        <div 
                          className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${suggestion.relevance_score * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-500">
                        {Math.round(suggestion.relevance_score * 100)}% pertinent
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Détails de la sélection */}
          {selectedLocation && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Détails du Lieu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold mb-1">{selectedLocation.name}</h3>
                    <p className="text-sm text-slate-600">{selectedLocation.historical_period}</p>
                  </div>
                  
                  <div className="bg-indigo-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-700">{selectedLocation.reasoning}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {selectedLocation.verified ? (
                      <Badge className="bg-green-100 text-green-800">
                        ✓ Vérifié
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-amber-600">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        À vérifier
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedMapTab;