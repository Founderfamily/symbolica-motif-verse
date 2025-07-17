import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, ExternalLink, Verified, Globe, Camera } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface SacredSite {
  id: string;
  site_name: string;
  latitude?: number;
  longitude?: number;
  country?: string;
  region?: string;
  site_type?: string;
  description?: string;
  historical_significance?: string;
  visit_info?: string;
  image_url?: string;
  website_url?: string;
  verified: boolean;
}

interface SymbolSacredSitesProps {
  symbolId: string;
}

const siteTypeLabels: { [key: string]: string } = {
  'temple': 'Temple',
  'monastery': 'Monastère',
  'shrine': 'Sanctuaire',
  'pilgrimage': 'Pèlerinage',
  'archaeological': 'Site archéologique'
};

const siteTypeColors: { [key: string]: string } = {
  'temple': 'bg-purple-100 text-purple-800',
  'monastery': 'bg-blue-100 text-blue-800',
  'shrine': 'bg-yellow-100 text-yellow-800',
  'pilgrimage': 'bg-green-100 text-green-800',
  'archaeological': 'bg-red-100 text-red-800'
};

export const SymbolSacredSites: React.FC<SymbolSacredSitesProps> = ({ symbolId }) => {
  const { data: sites, isLoading } = useQuery({
    queryKey: ['symbol-sacred-sites', symbolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('symbol_sacred_sites')
        .select('*')
        .eq('symbol_id', symbolId)
        .order('verified', { ascending: false });
      
      if (error) throw error;
      return data as SacredSite[];
    }
  });

  const openMaps = (site: SacredSite) => {
    if (site.latitude && site.longitude) {
      const mapsUrl = `https://www.google.com/maps/@${site.latitude},${site.longitude},15z`;
      window.open(mapsUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!sites || sites.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Sites sacrés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Aucun site sacré répertorié pour ce symbole.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Sites sacrés ({sites.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {sites.map((site) => (
          <div key={site.id} className="border border-border rounded-lg overflow-hidden">
            {site.image_url && (
              <div className="aspect-video bg-muted">
                <img
                  src={site.image_url}
                  alt={site.site_name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            <div className="p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-lg">{site.site_name}</h4>
                    {site.verified && (
                      <Verified className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4" />
                    {site.region && `${site.region}, `}{site.country}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {site.site_type && (
                      <Badge className={siteTypeColors[site.site_type] || 'bg-gray-100 text-gray-800'}>
                        {siteTypeLabels[site.site_type] || site.site_type}
                      </Badge>
                    )}
                    {site.verified && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Vérifié
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {site.description && (
                <p className="text-sm text-muted-foreground">
                  {site.description}
                </p>
              )}
              
              {site.historical_significance && (
                <div>
                  <h5 className="font-medium mb-1">Signification historique</h5>
                  <p className="text-sm text-muted-foreground">
                    {site.historical_significance}
                  </p>
                </div>
              )}
              
              {site.visit_info && (
                <div>
                  <h5 className="font-medium mb-1">Informations de visite</h5>
                  <p className="text-sm text-muted-foreground">
                    {site.visit_info}
                  </p>
                </div>
              )}
              
              <div className="flex gap-2 pt-2">
                {site.latitude && site.longitude && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openMaps(site)}
                    className="flex items-center gap-2"
                  >
                    <Globe className="h-4 w-4" />
                    Voir sur la carte
                  </Button>
                )}
                
                {site.website_url && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    asChild
                  >
                    <a 
                      href={site.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Site web
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};