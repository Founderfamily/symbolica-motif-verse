import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { I18nText } from '@/components/ui/i18n-text';
import { mapboxConfigService } from '@/services/admin/mapboxConfigService';

interface WorldMapProps {
  onRegionClick?: (region: string) => void;
  className?: string;
}

interface MapboxSecretFormProps {
  onTokenSubmit: (token: string) => void;
}

const MapboxSecretForm: React.FC<MapboxSecretFormProps> = ({ onTokenSubmit }) => {
  const [token, setToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onTokenSubmit(token.trim());
    }
  };

  return (
    <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="text-lg font-semibold text-blue-900 mb-2">
        Configuration Mapbox requise
      </h3>
      <p className="text-blue-700 mb-4 text-sm">
        Pour afficher la carte interactive, veuillez entrer votre token Mapbox public.
        Vous pouvez l'obtenir sur{' '}
        <a 
          href="https://mapbox.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="underline hover:text-blue-900"
        >
          mapbox.com
        </a>
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="text"
          placeholder="pk.eyJ1IjoieW91ci11c2VybmFtZSIs..."
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="font-mono text-sm"
        />
        <Button type="submit" className="w-full">
          Configurer la carte
        </Button>
      </form>
    </div>
  );
};

export const WorldMap: React.FC<WorldMapProps> = ({ onRegionClick, className = '' }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [isMapReady, setIsMapReady] = useState(false);

  // Régions et leurs coordonnées
  const regions = {
    'europe': {
      center: [10, 54] as [number, number],
      zoom: 3,
      color: '#3b82f6',
      name: 'Europe',
      collections: ['Patrimoine Français', 'Nordique-Viking']
    },
    'asia': {
      center: [100, 35] as [number, number],
      zoom: 2.5,
      color: '#10b981',
      name: 'Asie',
      collections: ['Japon Traditionnel', 'Perse-Iranienne']
    },
    'africa': {
      center: [20, 0] as [number, number],
      zoom: 2.5,
      color: '#f59e0b',
      name: 'Afrique',
      collections: ['Égypte Antique', 'Civilisations Africaines']
    },
    'north-america': {
      center: [-100, 45] as [number, number],
      zoom: 2.5,
      color: '#ef4444',
      name: 'Amérique du Nord',
      collections: ['Cultures Amérindiennes']
    },
    'south-america': {
      center: [-60, -15] as [number, number],
      zoom: 2.5,
      color: '#8b5cf6',
      name: 'Amérique du Sud',
      collections: ['Civilisations Précolombiennnes']
    },
    'oceania': {
      center: [140, -25] as [number, number],
      zoom: 3,
      color: '#06b6d4',
      name: 'Océanie',
      collections: ['Traditions Polynésiennes']
    }
  };

  const initializeMap = (token: string) => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = token;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      projection: 'globe' as any,
      zoom: 1.5,
      center: [20, 20],
      pitch: 0,
      bearing: 0,
    });

    // Ajouter les contrôles de navigation
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Désactiver le zoom par scroll pour une meilleure expérience
    map.current.scrollZoom.disable();

    // Ajouter l'atmosphère et les effets de brouillard
    map.current.on('style.load', () => {
      map.current?.setFog({
        color: 'rgb(255, 255, 255)',
        'high-color': 'rgb(200, 200, 225)',
        'horizon-blend': 0.2,
      });

      // Ajouter des marqueurs pour chaque région
      Object.entries(regions).forEach(([regionKey, region]) => {
        // Créer un élément div pour le marqueur
        const el = document.createElement('div');
        el.className = 'region-marker';
        el.style.cssText = `
          background-color: ${region.color};
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
          font-size: 12px;
          transition: all 0.3s ease;
        `;
        
        // Ajouter l'initiale de la région
        el.textContent = region.name.charAt(0);

        // Créer le marqueur
        const marker = new mapboxgl.Marker(el)
          .setLngLat(region.center)
          .addTo(map.current!);

        // Ajouter un popup avec les informations de la région
        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: false,
          closeOnClick: false
        }).setHTML(`
          <div class="p-3">
            <h3 class="font-bold text-lg mb-2">${region.name}</h3>
            <p class="text-sm text-gray-600 mb-2">Collections disponibles:</p>
            <ul class="text-sm">
              ${region.collections.map(collection => 
                `<li class="text-blue-600">• ${collection}</li>`
              ).join('')}
            </ul>
          </div>
        `);

        // Événements hover
        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.2)';
          marker.setPopup(popup).togglePopup();
        });

        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)';
          marker.getPopup()?.remove();
        });

        // Événement click
        el.addEventListener('click', () => {
          // Zoomer sur la région
          map.current?.flyTo({
            center: region.center,
            zoom: region.zoom,
            duration: 2000
          });

          // Callback pour la sélection de région
          if (onRegionClick) {
            onRegionClick(regionKey);
          }
        });
      });

      setIsMapReady(true);
    });

    // Animation de rotation du globe
    let userInteracting = false;
    const secondsPerRevolution = 120;

    const spinGlobe = () => {
      if (!map.current || userInteracting) return;
      
      const zoom = map.current.getZoom();
      if (zoom < 3) {
        const center = map.current.getCenter();
        center.lng -= 360 / secondsPerRevolution;
        map.current.easeTo({ center, duration: 1000, easing: (n) => n });
      }
    };

    // Événements d'interaction
    map.current.on('mousedown', () => { userInteracting = true; });
    map.current.on('dragstart', () => { userInteracting = true; });
    map.current.on('mouseup', () => { 
      userInteracting = false;
      spinGlobe();
    });
    map.current.on('touchend', () => { 
      userInteracting = false;
      spinGlobe();
    });
    map.current.on('moveend', spinGlobe);

    // Démarrer la rotation
    spinGlobe();
  };

  const handleTokenSubmit = async (token: string) => {
    try {
      // Sauvegarder la configuration dans la base de données
      await mapboxConfigService.saveConfig({
        token: token,
        enabled: true
      });
      setMapboxToken(token);
      initializeMap(token);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  useEffect(() => {
    const loadMapboxConfig = async () => {
      try {
        const config = await mapboxConfigService.getConfig();
        if (config && config.enabled && config.token) {
          setMapboxToken(config.token);
          initializeMap(config.token);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la config Mapbox:', error);
      }
    };

    loadMapboxConfig();

    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      {!mapboxToken ? (
        <MapboxSecretForm onTokenSubmit={handleTokenSubmit} />
      ) : (
        <>
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-blue-900 mb-2">
              <I18nText translationKey="collections.worldMap.title">Explorez les cultures du monde</I18nText>
            </h2>
            <p className="text-blue-700">
              <I18nText translationKey="collections.worldMap.subtitle">Cliquez sur les marqueurs pour découvrir les symboles de chaque région</I18nText>
            </p>
          </div>
          
          <div 
            ref={mapContainer} 
            className="w-full h-96 rounded-lg shadow-lg border border-blue-200 bg-blue-50"
          />
          
          {!isMapReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-blue-50 rounded-lg">
              <div className="text-blue-600">Chargement de la carte...</div>
            </div>
          )}
        </>
      )}
    </div>
  );
};