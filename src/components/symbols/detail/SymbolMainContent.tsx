import React from 'react';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { I18nText } from '@/components/ui/i18n-text';
import { ShareButton } from '@/components/social/ShareButton';
import { Button } from '@/components/ui/button';
import { Info, MapPin, Calendar, Share2, Tag, BookOpen } from 'lucide-react';
import { SymbolData, SymbolImage } from '@/types/supabase';

interface SymbolMainContentProps {
  symbol: SymbolData;
  symbolImages: SymbolImage[];
  onExplore: () => void;
}

export const SymbolMainContent: React.FC<SymbolMainContentProps> = ({
  symbol,
  symbolImages,
  onExplore
}) => {
  const mainImage = symbolImages.find(img => img.image_type === 'original') || symbolImages[0];

  return (
    <div className="grid lg:grid-cols-2 gap-8 mb-8">
      {/* Image principale */}
      <div className="space-y-4">
        <AspectRatio ratio={1} className="w-full">
          <img
            src={mainImage?.image_url || '/placeholder.svg'}
            alt={symbol.name}
            className="w-full h-full object-cover rounded-lg shadow-lg"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = '/placeholder.svg';
            }}
          />
        </AspectRatio>
      </div>

      {/* Informations principales */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {symbol.name}
          </h1>
          
          <div className="flex flex-wrap gap-3 mb-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {symbol.culture}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {symbol.period}
            </Badge>
          </div>

          {symbol.description && (
            <p className="text-muted-foreground leading-relaxed mb-6">
              {symbol.description}
            </p>
          )}
        </div>

        {symbol.significance && (
          <Card className="p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Info className="h-4 w-4" />
              Signification culturelle
            </h3>
            <p className="text-sm text-muted-foreground">
              {symbol.significance}
            </p>
          </Card>
        )}

        {symbol.historical_context && (
          <Card className="p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Contexte historique
            </h3>
            <p className="text-sm text-muted-foreground">
              {symbol.historical_context}
            </p>
          </Card>
        )}

        {symbol.tags && symbol.tags.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {symbol.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <Button onClick={onExplore} className="flex-1">
            Explorer
          </Button>
          <ShareButton 
            url={window.location.href}
            title={symbol.name}
            description={symbol.description || ''}
            image={mainImage?.image_url}
          />
        </div>
      </div>
    </div>
  );
};