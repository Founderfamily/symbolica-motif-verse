
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MapSelectorProps {
  onLocationSelected: (latitude: number, longitude: number, locationName: string) => void;
  initialLocation?: string;
}

const MapSelector: React.FC<MapSelectorProps> = ({ onLocationSelected, initialLocation = '' }) => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialLocation);
  const { t } = useTranslation();

  useEffect(() => {
    // Simulate loading time for map initialization
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    // Pour la version prototype, on simule une recherche de géocodage
    // et on renvoie des coordonnées fictives basées sur le texte
    
    // En production, on utiliserait un service de géocodage comme l'API Google Maps
    const simulatedLatitude = 48.8566; // Paris comme exemple
    const simulatedLongitude = 2.3522;
    
    onLocationSelected(simulatedLatitude, simulatedLongitude, searchQuery);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('contributions.map.search')}
        />
        <Button
          type="button"
          onClick={handleSearch}
        >
          <I18nText translationKey="contributions.map.searchButton" />
        </Button>
      </div>
      
      <div className="w-full h-[200px] bg-slate-100 rounded-md flex items-center justify-center">
        {loading ? (
          <p className="text-sm text-slate-500">
            <I18nText translationKey="contributions.map.loading" />
          </p>
        ) : (
          <div className="text-center p-4">
            <p className="text-sm text-slate-500 mb-2">
              <I18nText translationKey="contributions.map.placeholder" />
            </p>
            <p className="text-xs text-slate-400">
              <I18nText translationKey="contributions.map.placeholderSub" />
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapSelector;
