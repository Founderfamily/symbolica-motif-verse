import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { SymbolImage } from '@/types/supabase';

interface ImageGalleryModalProps {
  images: SymbolImage[];
  selectedImageIndex: number;
  isOpen: boolean;
  onClose: () => void;
  symbolName: string;
}

export const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
  images,
  selectedImageIndex,
  isOpen,
  onClose,
  symbolName
}) => {
  const [currentIndex, setCurrentIndex] = useState(selectedImageIndex);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  React.useEffect(() => {
    setCurrentIndex(selectedImageIndex);
  }, [selectedImageIndex]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!images || images.length === 0) {
    return null;
  }

  const currentImage = images[currentIndex];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full h-[90vh] p-0 gap-0">
        <div className="relative flex flex-col h-full bg-black">
          {/* Header avec bouton fermer */}
          <div className="absolute top-4 right-4 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Compteur d'images */}
          <div className="absolute top-4 left-4 z-10">
            <Badge variant="secondary" className="bg-black/50 text-white border-white/20">
              {currentIndex + 1} / {images.length}
            </Badge>
          </div>

          {/* Image principale */}
          <div className="flex-1 relative flex items-center justify-center p-4">
            <img
              src={currentImage.image_url}
              alt={currentImage.title || symbolName}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = '/placeholder.svg';
              }}
            />

            {/* Boutons de navigation */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full h-12 w-12"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full h-12 w-12"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}
          </div>

          {/* Informations de l'image */}
          <div className="absolute bottom-20 left-4 right-4 z-10">
            <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold">
                  {currentImage.title || 'Sans titre'}
                </h3>
                <Badge 
                  variant="outline" 
                  className="text-xs border-white/30 text-white"
                >
                  {currentImage.image_type === 'original' ? 'Original' : 
                   currentImage.image_type === 'pattern' ? 'Motif' : 'Réutilisation'}
                </Badge>
                {currentImage.is_primary && (
                  <Badge variant="default" className="text-xs bg-amber-500">
                    Principale
                  </Badge>
                )}
              </div>
              {currentImage.description && (
                <p className="text-sm text-white/80">{currentImage.description}</p>
              )}
            </div>
          </div>

          {/* Miniatures en bas */}
          {images.length > 1 && (
            <div className="bg-black/90 backdrop-blur-sm p-4">
              <div className="flex gap-2 justify-center overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => goToImage(index)}
                    className={`relative flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all ${
                      index === currentIndex 
                        ? 'border-white scale-110' 
                        : 'border-white/30 hover:border-white/60'
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={image.title || `Image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src = '/placeholder.svg';
                      }}
                    />
                    {image.is_primary && (
                      <div className="absolute top-1 right-1">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};