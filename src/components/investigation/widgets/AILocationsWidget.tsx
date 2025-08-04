import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, TrendingUp, ExternalLink } from 'lucide-react';
import { aiDataExtractionService, AILocation } from '@/services/AIDataExtractionService';

interface AILocationsWidgetProps {
  questId: string;
  compact?: boolean;
  onLocationSelect?: (location: AILocation) => void;
}

const AILocationsWidget: React.FC<AILocationsWidgetProps> = ({ 
  questId, 
  compact = false,
  onLocationSelect
}) => {
  const [locations, setLocations] = useState<AILocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAILocations();
  }, [questId]);

  const loadAILocations = async () => {
    try {
      setLoading(true);
      const data = await aiDataExtractionService.getAILocations(questId);
      setLocations(data.slice(0, compact ? 3 : 8));
    } catch (error) {
      console.error('Erreur lors du chargement des lieux IA:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-50';
    if (confidence >= 0.6) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const handleLocationClick = (location: AILocation) => {
    if (onLocationSelect) {
      onLocationSelect(location);
    } else if (location.coordinates) {
      // Ouvrir dans Google Maps par défaut
      const url = `https://www.google.com/maps/search/?api=1&query=${location.coordinates.lat},${location.coordinates.lng}`;
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Lieux d'Intérêt IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (locations.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Lieux d'Intérêt IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Aucun lieu identifié</p>
            <p className="text-sm">L'IA analysera les références géographiques</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Lieux d'Intérêt IA
          <Badge variant="secondary" className="ml-auto">
            {locations.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {locations.map((location) => (
          <div 
            key={location.id} 
            className="p-3 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors cursor-pointer"
            onClick={() => handleLocationClick(location)}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate flex items-center gap-2">
                  {location.name}
                  {location.coordinates && (
                    <Navigation className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  )}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {location.description}
                </p>
              </div>
              
              <div className="flex flex-col items-end gap-1">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getConfidenceColor(location.confidence)}`}
                >
                  {Math.round(location.confidence * 100)}%
                </Badge>
                {location.coordinates && (
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {location.period}
              </Badge>
              {!compact && (
                <div className="flex items-center gap-1 ml-auto">
                  <TrendingUp className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {location.significance}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {compact && locations.length > 3 && (
          <div className="text-center pt-2">
            <Badge variant="outline" className="text-xs">
              +{locations.length - 3} autres lieux
            </Badge>
          </div>
        )}
        
        <div className="pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs"
            onClick={() => {/* TODO: Afficher tous les lieux sur la carte */}}
          >
            <MapPin className="h-3 w-3 mr-1" />
            Voir tous sur la carte
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AILocationsWidget;