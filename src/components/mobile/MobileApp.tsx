
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MobileSearchInterface from './MobileSearchInterface';
import FieldModeInterface from './FieldModeInterface';
import { 
  Search, 
  MapPin, 
  Users, 
  BarChart3, 
  FileText,
  Smartphone,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { capacitorService } from '@/services/mobile/capacitorService';
import { offlineService } from '@/services/mobile/offlineService';

const MobileApp: React.FC = () => {
  const { t } = useTranslation();
  const [isOnline, setIsOnline] = useState(true);
  const [capabilities, setCapabilities] = useState({
    camera: false,
    geolocation: false,
    network: true,
    filesystem: false
  });
  const [storageStats, setStorageStats] = useState({
    fieldNotes: 0,
    cacheEntries: 0,
    pendingSync: 0
  });

  useEffect(() => {
    initializeMobileApp();
    const interval = setInterval(checkNetworkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const initializeMobileApp = async () => {
    // Check device capabilities
    const caps = await capacitorService.checkCapabilities();
    setCapabilities(caps);

    // Initialize offline service
    await offlineService.initialize();

    // Get storage stats
    const stats = await offlineService.getStorageStats();
    setStorageStats(stats);

    // Check initial network status
    checkNetworkStatus();
  };

  const checkNetworkStatus = async () => {
    const status = await capacitorService.getNetworkStatus();
    setIsOnline(status.connected);
  };

  const handleSearch = async (query: string, filters?: any, action?: string) => {
    console.log('Search:', { query, filters, action });
    
    // Cache search for offline access
    await offlineService.cacheSearchResults(query, []);
    
    // Handle different search actions
    switch (action) {
      case 'create':
        // Navigate to contribution form
        break;
      case 'map':
        // Navigate to map view
        break;
      case 'analyze':
        // Navigate to analysis tools
        break;
      default:
        // Standard search
        break;
    }
  };

  const handleImageSearch = async (imageData: string) => {
    console.log('Image search initiated');
    // Process image search
  };

  const handleLocationSearch = async (location: { lat: number; lng: number }) => {
    console.log('Location search:', location);
    // Process location-based search
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="h-6 w-6" />
            <h1 className="text-lg font-bold">Symbolica Mobile</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isOnline ? "secondary" : "destructive"} className="text-xs">
              {isOnline ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
              {isOnline ? 'En ligne' : 'Hors ligne'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Offline Storage Stats */}
      {!isOnline && (
        <Alert className="m-4 border-amber-200 bg-amber-50">
          <AlertDescription className="text-amber-800">
            Mode hors ligne actif - {storageStats.fieldNotes} notes, {storageStats.cacheEntries} éléments en cache
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="p-4">
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="search" className="flex items-center gap-1">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Recherche</span>
            </TabsTrigger>
            <TabsTrigger value="field" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Terrain</span>
            </TabsTrigger>
            <TabsTrigger value="collaboration" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Équipe</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Stats</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="mt-4">
            <MobileSearchInterface
              onSearch={handleSearch}
              onImageSearch={handleImageSearch}
              onLocationSearch={handleLocationSearch}
            />
          </TabsContent>

          <TabsContent value="field" className="mt-4">
            <FieldModeInterface />
          </TabsContent>

          <TabsContent value="collaboration" className="mt-4">
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Outils de collaboration à venir</p>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Analytics personnalisés à venir</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Device Capabilities Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 right-4 bg-muted/90 backdrop-blur-sm rounded-lg p-2 text-xs">
          <div className="flex gap-2 flex-wrap">
            <Badge variant={capabilities.camera ? "default" : "secondary"}>
              Camera: {capabilities.camera ? 'OK' : 'NO'}
            </Badge>
            <Badge variant={capabilities.geolocation ? "default" : "secondary"}>
              GPS: {capabilities.geolocation ? 'OK' : 'NO'}
            </Badge>
            <Badge variant={capabilities.filesystem ? "default" : "secondary"}>
              Storage: {capabilities.filesystem ? 'OK' : 'NO'}
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileApp;
