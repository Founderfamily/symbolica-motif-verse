import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Mic, 
  MicOff, 
  Camera, 
  MapPin, 
  Filter,
  History,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { voiceSearchService } from '@/services/mobile/voiceSearchService';
import { capacitorService } from '@/services/mobile/capacitorService';
import { offlineService } from '@/services/mobile/offlineService';

interface MobileSearchInterfaceProps {
  onSearch: (query: string, filters?: any, action?: string) => void;
  onImageSearch: (imageData: string) => void;
  onLocationSearch: (location: { lat: number; lng: number }) => void;
}

const MobileSearchInterface: React.FC<MobileSearchInterfaceProps> = ({
  onSearch,
  onImageSearch,
  onLocationSearch
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<any>({});

  useEffect(() => {
    setVoiceSupported(voiceSearchService.isVoiceSearchSupported());
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const cached = await offlineService.getCachedSearchResults('recent_searches');
      if (cached) {
        setRecentSearches(cached.slice(0, 5));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const saveSearch = async (query: string) => {
    const updatedSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 10);
    setRecentSearches(updatedSearches);
    await offlineService.cacheSearchResults('recent_searches', updatedSearches);
  };

  const handleVoiceSearch = async () => {
    if (!voiceSupported) return;

    try {
      setIsListening(true);
      const result = await voiceSearchService.startListening();
      
      if (result.transcript && !result.isListening) {
        const processed = voiceSearchService.processVoiceCommand(result.transcript);
        setSearchQuery(processed.searchQuery);
        setSelectedFilters({ ...selectedFilters, ...processed.filters });
        
        await saveSearch(processed.searchQuery);
        onSearch(processed.searchQuery, { ...selectedFilters, ...processed.filters }, processed.action);
      }
    } catch (error) {
      console.error('Voice search error:', error);
    } finally {
      setIsListening(false);
    }
  };

  const handleImageSearch = async () => {
    try {
      const imageData = await capacitorService.takePhoto();
      if (imageData) {
        onImageSearch(imageData);
      }
    } catch (error) {
      console.error('Image search error:', error);
    }
  };

  const handleLocationSearch = async () => {
    try {
      const location = await capacitorService.getCurrentLocation();
      if (location) {
        // Convert from latitude/longitude to lat/lng format
        const searchLocation = {
          lat: location.latitude,
          lng: location.longitude
        };
        onLocationSearch(searchLocation);
      }
    } catch (error) {
      console.error('Location search error:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    await saveSearch(searchQuery);
    onSearch(searchQuery, selectedFilters);
  };

  const generateSuggestions = (query: string) => {
    const commonTerms = [
      'symbole celtique',
      'croix chrétienne',
      'motif géométrique',
      'art roman',
      'sculpture gothique',
      'gravure rupestre'
    ];

    const filtered = commonTerms.filter(term => 
      term.toLowerCase().includes(query.toLowerCase()) && term !== query
    );

    setSuggestions(filtered.slice(0, 3));
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Recherche intelligente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main search input */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              placeholder="Rechercher des symboles..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                generateSuggestions(e.target.value);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pr-20"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
              {voiceSupported && (
                <Button
                  size="sm"
                  variant={isListening ? "destructive" : "ghost"}
                  onClick={handleVoiceSearch}
                  disabled={isListening}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button onClick={handleSearch} disabled={!searchQuery.trim()}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Voice listening indicator */}
        {isListening && (
          <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded">
            <div className="animate-pulse">
              <Mic className="h-4 w-4" />
            </div>
            Écoute en cours...
          </div>
        )}

        {/* Smart search buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleImageSearch}
            className="flex items-center gap-2"
          >
            <Camera className="h-4 w-4" />
            Recherche par image
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLocationSearch}
            className="flex items-center gap-2"
          >
            <MapPin className="h-4 w-4" />
            Recherche locale
          </Button>
        </div>

        {/* Search suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-3 w-3" />
              Suggestions
            </div>
            <div className="flex gap-2 flex-wrap">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery(suggestion);
                    setSuggestions([]);
                  }}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Recent searches */}
        {recentSearches.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <History className="h-3 w-3" />
              Recherches récentes
            </div>
            <ScrollArea className="h-20">
              <div className="flex gap-2 flex-wrap">
                {recentSearches.map((search, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80"
                    onClick={() => {
                      setSearchQuery(search);
                      onSearch(search, selectedFilters);
                    }}
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Quick filters */}
        {showFilters && (
          <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
            <div className="text-sm font-medium">Filtres rapides</div>
            
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Périodes</div>
              <div className="flex gap-2 flex-wrap">
                {['Préhistoire', 'Antiquité', 'Moyen Âge', 'Renaissance', 'Moderne'].map(period => (
                  <Badge
                    key={period}
                    variant={selectedFilters.periods?.includes(period) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      const periods = selectedFilters.periods || [];
                      const updated = periods.includes(period)
                        ? periods.filter((p: string) => p !== period)
                        : [...periods, period];
                      setSelectedFilters({ ...selectedFilters, periods: updated });
                    }}
                  >
                    {period}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Cultures</div>
              <div className="flex gap-2 flex-wrap">
                {['Celte', 'Romain', 'Germanique', 'Viking', 'Byzantin'].map(culture => (
                  <Badge
                    key={culture}
                    variant={selectedFilters.cultures?.includes(culture) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      const cultures = selectedFilters.cultures || [];
                      const updated = cultures.includes(culture)
                        ? cultures.filter((c: string) => c !== culture)
                        : [...cultures, culture];
                      setSelectedFilters({ ...selectedFilters, cultures: updated });
                    }}
                  >
                    {culture}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MobileSearchInterface;
