import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { I18nText } from '@/components/ui/i18n-text';
import { supabase } from '@/integrations/supabase/client';

interface WorldMapProps {
  onRegionClick?: (region: string) => void;
  className?: string;
}

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

  useEffect(() => {
    const loadMapboxToken = async () => {
      try {
        console.log('🗺️ Tentative de récupération du token Mapbox...');
        
        // Récupérer le token depuis l'edge function
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        
        console.log('🗺️ Réponse de l\'edge function:', { data, error });
        
        if (error) {
          console.error('❌ Erreur lors de la récupération du token Mapbox:', error);
          return;
        }

        if (data && data.token) {
          console.log('✅ Token Mapbox récupéré avec succès');
          setMapboxToken(data.token);
          initializeMap(data.token);
        } else {
          console.warn('⚠️ Token Mapbox non configuré dans les secrets Supabase. Réponse:', data);
        }
      } catch (error) {
        console.error('💥 Erreur lors du chargement du token Mapbox:', error);
      }
    };

    loadMapboxToken();

    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      {!mapboxToken ? (
        <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Configuration de la carte
          </h3>
          <p className="text-blue-700 text-sm">
            La carte se charge automatiquement avec la configuration Mapbox...
          </p>
        </div>
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