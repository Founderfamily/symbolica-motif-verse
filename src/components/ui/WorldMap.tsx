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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const initializeMap = async () => {
      try {
        console.log('🗺️ Initialisation de la carte...');
        
        if (!mapContainer.current) {
          console.error('❌ Container de la carte non trouvé');
          return;
        }

        // Récupérer le token Mapbox
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        
        console.log('🗺️ Réponse edge function:', { data, error });

        if (error) {
          console.error('❌ Erreur edge function:', error);
          setError('Erreur de récupération du token');
          setIsLoading(false);
          return;
        }

        if (!data?.token) {
          console.error('❌ Token Mapbox manquant');
          setError('Token Mapbox non configuré');
          setIsLoading(false);
          return;
        }

        console.log('✅ Token récupéré, initialisation Mapbox...');
        
        // Configurer Mapbox
        mapboxgl.accessToken = data.token;
        
        // Créer la carte
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/satellite-v9',
          projection: 'globe' as any,
          zoom: 1.5,
          center: [20, 20],
          pitch: 0,
          bearing: 0,
        });

        // Ajouter les contrôles
        map.current.addControl(
          new mapboxgl.NavigationControl({
            visualizePitch: true,
          }),
          'top-right'
        );

        // Désactiver le scroll zoom
        map.current.scrollZoom.disable();

        // Quand la carte est chargée
        map.current.on('load', () => {
          console.log('✅ Carte chargée avec succès');
          
          // Ajouter l'atmosphère
          map.current?.setFog({
            color: 'rgb(255, 255, 255)',
            'high-color': 'rgb(200, 200, 225)',
            'horizon-blend': 0.2,
          });

          // Ajouter les marqueurs des régions
          Object.entries(regions).forEach(([regionKey, region]) => {
            const el = document.createElement('div');
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
            
            el.textContent = region.name.charAt(0);

            const marker = new mapboxgl.Marker(el)
              .setLngLat(region.center)
              .addTo(map.current!);

            // Popup
            const popup = new mapboxgl.Popup({
              offset: 25,
              closeButton: false,
              closeOnClick: false
            }).setHTML(`
              <div class="p-3">
                <h3 class="font-bold text-lg mb-2">${region.name}</h3>
                <p class="text-sm text-gray-600 mb-2">Collections:</p>
                <ul class="text-sm">
                  ${region.collections.map(collection => 
                    `<li class="text-blue-600">• ${collection}</li>`
                  ).join('')}
                </ul>
              </div>
            `);

            // Events
            el.addEventListener('mouseenter', () => {
              el.style.transform = 'scale(1.2)';
              marker.setPopup(popup).togglePopup();
            });

            el.addEventListener('mouseleave', () => {
              el.style.transform = 'scale(1)';
              marker.getPopup()?.remove();
            });

            el.addEventListener('click', () => {
              map.current?.flyTo({
                center: region.center,
                zoom: region.zoom,
                duration: 2000
              });

              if (onRegionClick) {
                onRegionClick(regionKey);
              }
            });
          });

          setIsLoading(false);
        });

        // Gestion d'erreur de la carte
        map.current.on('error', (e) => {
          console.error('❌ Erreur Mapbox:', e);
          setError('Erreur de chargement de la carte');
          setIsLoading(false);
        });

      } catch (error) {
        console.error('💥 Erreur fatale:', error);
        setError('Erreur de chargement');
        setIsLoading(false);
      }
    };

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  if (error) {
    return (
      <div className={`relative ${className}`}>
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Erreur de chargement
          </h3>
          <p className="text-red-700 text-sm">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
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
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-50 rounded-lg">
          <div className="text-blue-600">Chargement de la carte...</div>
        </div>
      )}
    </div>
  );
};