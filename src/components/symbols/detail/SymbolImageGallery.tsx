import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Images } from 'lucide-react';
import { SymbolImage } from '@/types/supabase';

interface SymbolImageGalleryProps {
  images: SymbolImage[];
  symbolName: string;
}

export const SymbolImageGallery: React.FC<SymbolImageGalleryProps> = ({
  images,
  symbolName
}) => {
  // Trouver l'image principale et exclure de la galerie
  const primaryImage = images.find(img => img.is_primary) || 
                      images.find(img => img.image_type === 'original') || 
                      images[0];
  
  const otherImages = images.filter(img => img.id !== primaryImage?.id);
  
  if (otherImages.length === 0) {
    return null;
  }
  
  const displayImages = otherImages.slice(0, 8);
  const remainingCount = Math.max(0, otherImages.length - 8);

  return (
    <Card className="p-6 mb-8">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Images className="h-5 w-5" />
        Galerie d'images
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {displayImages.map((image, index) => (
          <div key={image.id} className="relative group">
            <div className="aspect-square overflow-hidden rounded-lg">
              <img
                src={image.image_url}
                alt={`${symbolName} - ${image.image_type}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = '/placeholder.svg';
                }}
              />
            </div>
            <Badge
              variant="secondary"
              className="absolute top-2 left-2 text-xs capitalize"
            >
              {image.image_type}
            </Badge>
          </div>
        ))}
        
        {remainingCount > 0 && (
          <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
            <span className="text-sm text-muted-foreground font-medium">
              +{remainingCount}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};