
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Info } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';

interface MapboxAuthProps {
  onTokenSubmit: (token: string) => void;
}

const MapboxAuth: React.FC<MapboxAuthProps> = ({ onTokenSubmit }) => {
  const [token, setToken] = useState<string>('');
  const [showInfo, setShowInfo] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onTokenSubmit(token.trim());
      // Store token in local storage for future use
      localStorage.setItem('mapbox_token', token.trim());
    }
  };

  // Check if there's a stored token when component mounts
  React.useEffect(() => {
    const storedToken = localStorage.getItem('mapbox_token');
    if (storedToken) {
      setToken(storedToken);
      // Auto-submit if token exists
      onTokenSubmit(storedToken);
    }
  }, [onTokenSubmit]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Lock className="h-5 w-5 text-amber-600" />
        <h3 className="font-medium text-lg"><I18nText translationKey="map.mapboxAuth.title" /></h3>
      </div>

      <p className="text-slate-600 mb-6">
        <I18nText translationKey="map.mapboxAuth.description" />
        <button 
          onClick={() => setShowInfo(!showInfo)} 
          className="ml-1 text-amber-600 hover:text-amber-800 inline-flex items-center"
        >
          <Info className="h-4 w-4 mr-1" />
          <I18nText translationKey="map.mapboxAuth.learnMore" />
        </button>
      </p>
      
      {showInfo && (
        <div className="bg-amber-50 border border-amber-100 rounded-md p-3 mb-6">
          <p className="text-sm text-amber-800">
            <I18nText translationKey="map.mapboxAuth.tokenInstructions" />
            <a 
              href="https://account.mapbox.com/access-tokens/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline block mt-2"
            >
              Mapbox Access Tokens
            </a>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbFhYeSJ9.exampleToken123456"
            className="w-full"
          />
        </div>
        <Button 
          type="submit" 
          disabled={!token.trim()} 
          className="w-full"
        >
          <I18nText translationKey="map.mapboxAuth.submit" />
        </Button>
      </form>
    </div>
  );
};

export default MapboxAuth;
