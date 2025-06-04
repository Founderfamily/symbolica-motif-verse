
import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import MapboxAuth from './MapboxAuth';

interface MapLoadingStatesProps {
  loading: boolean;
  error: string | null;
  mapboxToken: string | null;
  tokenError: boolean;
  onTokenSubmit: (token: string) => void;
}

const MapLoadingStates: React.FC<MapLoadingStatesProps> = ({
  loading,
  error,
  mapboxToken,
  tokenError,
  onTokenSubmit
}) => {
  // If we don't have a token yet, show the auth form
  if (!mapboxToken || tokenError) {
    return (
      <div className="space-y-4">
        <MapboxAuth onTokenSubmit={onTokenSubmit} />
        
        {tokenError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
            <p className="text-sm text-red-600">
              <I18nText translationKey="map.error.invalidToken" />
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Show loading state */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50/70 z-30">
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
            <p className="text-sm text-slate-600"><I18nText translationKey="map.loading" /></p>
          </div>
        </div>
      )}
      
      {/* Show error message if any */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50/90 z-30">
          <div className="bg-white p-4 rounded-lg shadow-md border border-red-100 text-red-600 max-w-sm">
            <p>{error}</p>
            <p className="text-sm mt-2"><I18nText translationKey="map.tryAgainLater" /></p>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(MapLoadingStates);
