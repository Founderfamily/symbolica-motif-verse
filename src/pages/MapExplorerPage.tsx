
import React, { useState, useEffect } from 'react';
import InteractiveMap from '@/components/map/InteractiveMap';
import { useTranslation } from '@/i18n/useTranslation';
import { Button } from '@/components/ui/button';
import { MapPin, Filter, ZoomIn, Search, Globe, History } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { symbolGeolocationService } from '@/services/symbolGeolocationService';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { I18nText } from '@/components/ui/i18n-text';

const MapExplorerPage = () => {
  const { t } = useTranslation();
  const [regionCount, setRegionCount] = useState(0);
  const [locationsCount, setLocationsCount] = useState(0);
  const [regions, setRegions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false); // Ajout de l'état loading manquant
  const [selectedFilters, setSelectedFilters] = useState<{
    regions: string[];
    verified: boolean;
  }>({
    regions: [],
    verified: false
  });
  
  useEffect(() => {
    const fetchLocationMetadata = async () => {
      try {
        setLoading(true);
        const locations = await symbolGeolocationService.getAllLocations();
        
        if (locations.length) {
          const uniqueCultures = [...new Set(locations.map(loc => loc.culture))];
          setRegions(uniqueCultures);
          setRegionCount(uniqueCultures.length);
          setLocationsCount(locations.length);
        }
      } catch (error) {
        console.error('Error fetching location metadata:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLocationMetadata();
  }, []);
  
  const toggleRegionFilter = (region: string) => {
    setSelectedFilters(prev => {
      const newRegions = prev.regions.includes(region) 
        ? prev.regions.filter(r => r !== region)
        : [...prev.regions, region];
        
      return {
        ...prev,
        regions: newRegions
      };
    });
  };
  
  const toggleVerifiedFilter = () => {
    setSelectedFilters(prev => ({
      ...prev,
      verified: !prev.verified
    }));
  };
  
  const clearFilters = () => {
    setSelectedFilters({
      regions: [],
      verified: false
    });
    setSearchQuery("");
  };
  
  const hasActiveFilters = selectedFilters.regions.length > 0 || selectedFilters.verified || searchQuery;
  
  // Create translation variables for needed texts
  const searchPlaceholder = t('mapExplorer.searchLocation');
  
  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            <I18nText translationKey="mapExplorer.title" />
          </h1>
          <p className="text-slate-600 max-w-2xl">
            <I18nText translationKey="mapExplorer.description" />
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <Input 
              placeholder={searchPlaceholder}
              className="pl-10 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-1 relative">
                <Filter className="h-4 w-4" />
                <I18nText translationKey="mapExplorer.filters" />
                {hasActiveFilters && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <div className="space-y-4">
                <h4 className="font-medium text-sm"><I18nText translationKey="filters.regions" /></h4>
                <ScrollArea className="h-[180px] pr-4">
                  <div className="space-y-2">
                    {regions.length > 0 ? (
                      regions.map(region => (
                        <div key={region} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`region-${region}`} 
                            checked={selectedFilters.regions.includes(region)}
                            onCheckedChange={() => toggleRegionFilter(region)}
                          />
                          <label htmlFor={`region-${region}`} className="text-sm cursor-pointer">
                            {region}
                          </label>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">
                        <I18nText translationKey="filters.noRegionsAvailable" />
                      </p>
                    )}
                  </div>
                </ScrollArea>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm"><I18nText translationKey="filters.status" /></h4>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="verified-only" 
                      checked={selectedFilters.verified}
                      onCheckedChange={toggleVerifiedFilter}
                    />
                    <label htmlFor="verified-only" className="text-sm cursor-pointer">
                      <I18nText translationKey="filters.verifiedOnly" />
                    </label>
                  </div>
                </div>
                
                <div className="border-t pt-2 flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    disabled={!hasActiveFilters}
                  >
                    <I18nText translationKey="filters.clear" />
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button variant="outline" className="gap-1">
            <ZoomIn className="h-4 w-4" />
            <I18nText translationKey="mapExplorer.zoom" />
          </Button>
          
          <Button variant="outline" className="gap-1">
            <History className="h-4 w-4" />
            <I18nText translationKey="mapExplorer.history" />
          </Button>
        </div>
      </div>
      
      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-slate-500"><I18nText translationKey="filters.activeFilters" />:</span>
          
          {selectedFilters.regions.map(region => (
            <Badge 
              key={region} 
              variant="outline"
              className="px-2 py-1 bg-slate-100 gap-1"
            >
              {region}
              <button 
                className="ml-1 text-slate-400 hover:text-slate-600"
                onClick={() => toggleRegionFilter(region)}
              >
                ×
              </button>
            </Badge>
          ))}
          
          {selectedFilters.verified && (
            <Badge 
              variant="outline"
              className="px-2 py-1 bg-green-50 text-green-800 border-green-200 gap-1"
            >
              <I18nText translationKey="filters.verifiedOnly" />
              <button 
                className="ml-1 text-green-600 hover:text-green-800"
                onClick={toggleVerifiedFilter}
              >
                ×
              </button>
            </Badge>
          )}
          
          {searchQuery && (
            <Badge 
              variant="outline"
              className="px-2 py-1 bg-blue-50 text-blue-800 border-blue-200 gap-1"
            >
              "{searchQuery}"
              <button 
                className="ml-1 text-blue-600 hover:text-blue-800"
                onClick={() => setSearchQuery("")}
              >
                ×
              </button>
            </Badge>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-7 hover:bg-slate-100"
            onClick={clearFilters}
          >
            <I18nText translationKey="filters.clearAll" />
          </Button>
        </div>
      )}
      
      <Tabs defaultValue="map">
        <TabsList className="mb-4">
          <TabsTrigger value="map"><I18nText translationKey="mapExplorer.mapView" /></TabsTrigger>
          <TabsTrigger value="list"><I18nText translationKey="mapExplorer.listView" /></TabsTrigger>
        </TabsList>
        
        <TabsContent value="map" className="space-y-6">
          <div className="flex items-center text-sm text-slate-500 mb-4">
            <Globe className="h-4 w-4 mr-1 text-blue-600" />
            <span>
              <I18nText 
                translationKey="mapExplorer.symbolCount" 
                params={{ count: locationsCount }}
              />
            </span>
            <span className="mx-2">•</span>
            <span>
              <I18nText 
                translationKey="mapExplorer.countriesCount" 
                params={{ count: regionCount }}
              />
            </span>
          </div>
          
          <InteractiveMap />
          
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-amber-800">
            <p className="text-sm">
              <I18nText translationKey="mapExplorer.betaNotice" />
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="list">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-slate-600 text-center py-10">
              <I18nText translationKey="mapExplorer.listViewComingSoon" />
            </p>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4"><I18nText translationKey="mapExplorer.popularRegions" /></h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {regions.slice(0, 4).map((region) => (
            <Button 
              key={region} 
              variant="outline" 
              className="h-auto py-3 justify-start"
              onClick={() => {
                if (!selectedFilters.regions.includes(region)) {
                  toggleRegionFilter(region);
                }
              }}
            >
              <MapPin className="h-4 w-4 mr-2 text-amber-600" />
              {region}
            </Button>
          ))}
          {regions.length === 0 && (
            <p className="text-slate-500 col-span-4">
              <I18nText translationKey="mapExplorer.noRegionsAvailable" />
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapExplorerPage;
