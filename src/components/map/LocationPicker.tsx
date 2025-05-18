
import React, { useState } from 'react';
import { MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { I18nText } from '@/components/ui/i18n-text';

interface LocationPickerProps {
  onLocationSelected: (latitude: number, longitude: number, name: string) => void;
  initialLocation?: { latitude: number; longitude: number; name: string } | null;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelected,
  initialLocation = null,
}) => {
  const [locationInput, setLocationInput] = useState(initialLocation?.name || '');
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
    name: string;
  } | null>(initialLocation);

  const handleLocationSearch = async () => {
    if (!locationInput.trim()) return;
    
    try {
      // This is a mock implementation - would use a real geocoding service in production
      const mockLocation = {
        latitude: 48.8566 + (Math.random() * 2 - 1),
        longitude: 2.3522 + (Math.random() * 2 - 1),
        name: locationInput,
      };
      
      setSelectedLocation(mockLocation);
      onLocationSelected(mockLocation.latitude, mockLocation.longitude, mockLocation.name);
    } catch (error) {
      console.error('Error searching for location:', error);
    }
  };

  const clearLocation = () => {
    setLocationInput('');
    setSelectedLocation(null);
    onLocationSelected(0, 0, '');
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="Enter a location or coordinates"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            className="w-full"
          />
        </div>
        <Button type="button" onClick={handleLocationSearch}>
          <I18nText translationKey="location.search">Search</I18nText>
        </Button>
      </div>

      {selectedLocation && (
        <div className="p-3 bg-slate-50 rounded-lg border flex items-start justify-between">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-slate-600 mr-2" />
            <div>
              <p className="font-medium">{selectedLocation.name}</p>
              <p className="text-xs text-slate-500">
                {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearLocation} 
            className="h-8 w-8 p-0 rounded-full hover:bg-red-50"
          >
            <X className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      )}

      {!selectedLocation && (
        <p className="text-sm text-slate-500">
          <I18nText translationKey="location.instructions">
            Search for a location or landmark to set coordinates
          </I18nText>
        </p>
      )}
    </div>
  );
};

export default LocationPicker;
