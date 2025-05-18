
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Info, AlertCircle } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { mapboxAuthService } from '@/services/mapboxAuthService';
import { toast } from '@/components/ui/use-toast';

interface MapboxAuthProps {
  onTokenSubmit: (token: string) => void;
}

const MapboxAuth: React.FC<MapboxAuthProps> = ({ onTokenSubmit }) => {
  const [token, setToken] = useState<string>('');
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [isInvalid, setIsInvalid] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (token.trim()) {
      // Basic validation
      if (!mapboxAuthService.validateTokenFormat(token.trim())) {
        setIsInvalid(true);
        toast({
          title: "Invalid token format",
          description: "Please enter a valid Mapbox token starting with 'pk.'",
          variant: "destructive",
        });
        return;
      }
      
      setIsInvalid(false);
      // Store token and notify parent
      mapboxAuthService.saveToken(token.trim());
      onTokenSubmit(token.trim());
      
      toast({
        title: "Token saved",
        description: "Your Mapbox token has been saved successfully.",
      });
    }
  };

  const handleClearToken = () => {
    mapboxAuthService.clearToken();
    setToken('');
    setIsInvalid(false);
    toast({
      title: "Token removed",
      description: "Your Mapbox token has been removed.",
    });
  };

  // Check if there's a stored token when component mounts
  useEffect(() => {
    const storedToken = mapboxAuthService.getToken();
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
            onChange={(e) => {
              setToken(e.target.value);
              if (isInvalid) setIsInvalid(false);
            }}
            placeholder="pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbFhYeSJ9.exampleToken123456"
            className={`w-full ${isInvalid ? 'border-red-500 focus-visible:ring-red-300' : ''}`}
          />
          {isInvalid && (
            <div className="flex items-center mt-1 text-xs text-red-500">
              <AlertCircle className="h-3 w-3 mr-1" />
              <span>Invalid token format. Mapbox tokens typically start with 'pk.'</span>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            type="submit" 
            disabled={!token.trim()} 
            className="flex-1"
          >
            <I18nText translationKey="map.mapboxAuth.submit" />
          </Button>
          
          {mapboxAuthService.hasToken() && (
            <Button 
              type="button"
              variant="outline"
              onClick={handleClearToken}
            >
              <I18nText translationKey="map.mapboxAuth.clear">Clear</I18nText>
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MapboxAuth;
