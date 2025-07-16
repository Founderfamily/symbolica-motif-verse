import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Info, MapPin, Calendar, Share2, Tag, Palette, Hammer, Star, BookOpen, Clock, Images } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { I18nText } from '@/components/ui/i18n-text';
import { ShareButton } from '@/components/social/ShareButton';
import { SymbolCollections } from '@/components/symbols/SymbolCollections';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { useSymbolById, useSymbolImages } from '@/hooks/useSupabaseSymbols';
import { AdminFloatingEditButton } from '@/components/admin/AdminFloatingEditButton';
import { ImageGalleryModal } from '@/components/symbols/ImageGalleryModal';

// Helper functions for legacy UUID mapping
const LEGACY_INDEX_TO_UUID_MAP: Record<number, string> = {
  0: '550e8400-e29b-41d4-a716-446655440001', // Triskèle Celtique
  1: '550e8400-e29b-41d4-a716-446655440002', // Fleur de Lys
  2: '550e8400-e29b-41d4-a716-446655440003', // Mandala
  3: '550e8400-e29b-41d4-a716-446655440004', // Méandre Grec
  4: '550e8400-e29b-41d4-a716-446655440005', // Symbole Adinkra
  5: '550e8400-e29b-41d4-a716-446655440006', // Motif Seigaiha
  6: '550e8400-e29b-41d4-a716-446655440007', // Yin Yang
  7: '550e8400-e29b-41d4-a716-446655440008', // Ankh
  8: '550e8400-e29b-41d4-a716-446655440009', // Hamsa
  9: '550e8400-e29b-41d4-a716-446655440010', // Attrape-rêves
};

const isValidUuid = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

const getLegacyUuidFromIndex = (index: number): string | null => {
  return LEGACY_INDEX_TO_UUID_MAP[index] || null;
};

const SymbolDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Gestion de la rétrocompatibilité pour les anciens liens avec indices
  const resolvedId = React.useMemo(() => {
    if (!id) return null;

    // Si c'est déjà un UUID valide, l'utiliser tel quel
    if (isValidUuid(id)) {
      return id;
    }

    // Sinon, essayer de convertir l'ancien index en UUID
    const numericIndex = parseInt(id, 10);
    if (!isNaN(numericIndex)) {
      const legacyUuid = getLegacyUuidFromIndex(numericIndex);
      if (legacyUuid) {
        // Rediriger automatiquement vers la nouvelle URL avec UUID
        navigate(`/symbols/${legacyUuid}`, { replace: true });
        return legacyUuid;
      }
    }

    return null;
  }, [id, navigate]);

  // Requêtes pour récupérer les données du symbole
  const { data: symbol, isLoading: symbolLoading, error: symbolError, refetch } = useSymbolById(resolvedId || undefined);
  const { data: images, isLoading: imagesLoading, refetch: refetchImages } = useSymbolImages(resolvedId || undefined);

  // État local pour le symbole (pour les mises à jour en temps réel)
  const [currentSymbol, setCurrentSymbol] = React.useState<typeof symbol>(symbol);
  
  // État pour la modal de galerie
  const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);

  // Mettre à jour le symbole local quand les données changent
  React.useEffect(() => {
    setCurrentSymbol(symbol);
  }, [symbol]);

  // Handler pour les mises à jour du symbole
  const handleSymbolUpdated = (updatedSymbol: typeof symbol) => {
    setCurrentSymbol(updatedSymbol);
    // Refetch pour s'assurer que les données sont à jour, y compris les images
    refetch();
    refetchImages();
  };

  // Trouver l'image principale
  const primaryImage = React.useMemo(() => {
    if (!images || images.length === 0) return null;
    // Prioriser l'image marquée comme principale
    return images.find(img => img.is_primary) || 
           images.find(img => img.image_type === 'original') || 
           images[0];
  }, [images]);

  // Handler pour ouvrir la galerie
  const handleImageClick = () => {
    if (!images || images.length === 0) return;
    
    // Trouver l'index de l'image principale
    const primaryIndex = images.findIndex(img => 
      img.is_primary || 
      (primaryImage && img.id === primaryImage.id)
    );
    
    setSelectedImageIndex(Math.max(0, primaryIndex));
    setIsGalleryOpen(true);
  };

  // Handler pour cliquer sur une miniature
  const handleThumbnailClick = (imageIndex: number) => {
    setSelectedImageIndex(imageIndex);
    setIsGalleryOpen(true);
  };

  // États de chargement et d'erreur
  if (symbolLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (symbolError || !symbol) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            <I18nText translationKey="symbols.notFound">Symbole non trouvé</I18nText>
          </h2>
          <p className="text-slate-600 mb-4">
            <I18nText translationKey="symbols.notFoundDesc">Le symbole que vous recherchez n'existe pas.</I18nText>
          </p>
          <p className="text-sm text-slate-500 mb-6">
            ID recherché : "{id}"
          </p>
          <Button onClick={() => navigate('/symbols')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            <I18nText translationKey="common.backToSymbols">Retour aux symboles</I18nText>
          </Button>
        </Card>
      </div>
    );
  }

  // Utiliser currentSymbol au lieu de symbol pour l'affichage
  const displaySymbol = currentSymbol || symbol;

  if (!displaySymbol) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            <I18nText translationKey="symbols.notFound">Symbole non trouvé</I18nText>
          </h2>
          <p className="text-slate-600 mb-4">
            <I18nText translationKey="symbols.notFoundDesc">Le symbole que vous recherchez n'existe pas.</I18nText>
          </p>
          <p className="text-sm text-slate-500 mb-6">
            ID recherché : "{id}"
          </p>
          <Button onClick={() => navigate('/symbols')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            <I18nText translationKey="common.backToSymbols">Retour aux symboles</I18nText>
          </Button>
        </Card>
      </div>
    );
  }

  // Fonctions pour les actions
  const handleExplore = () => {
    navigate(`/analysis?symbol=${displaySymbol.id}&name=${encodeURIComponent(displaySymbol.name)}`);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/symbols/${displaySymbol.id}`;
    const title = `${displaySymbol.name} - Symbole ${displaySymbol.culture}`;
    const description = `Découvrez ce symbole de la culture ${displaySymbol.culture} datant de ${displaySymbol.period}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: description,
          url
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Lien copié dans le presse-papiers !');
      }
    } catch (err) {
      console.error('Erreur lors du partage:', err);
      toast.error('Erreur lors du partage');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header avec bouton retour */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/symbols')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <I18nText translationKey="common.backToSymbols">Retour aux symboles</I18nText>
          </Button>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image du symbole */}
          <Card className="overflow-hidden">
            <AspectRatio ratio={1} className="bg-slate-100">
              {imagesLoading ? (
                <div className="flex items-center justify-center w-full h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                </div>
              ) : (
                <img
                  src={primaryImage?.image_url || '/placeholder.svg'}
                  alt={displaySymbol.name}
                  className="object-cover w-full h-full cursor-pointer hover:scale-105 transition-transform duration-200"
                  onClick={handleImageClick}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
              )}
            </AspectRatio>
          </Card>

          {/* Informations du symbole */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                {displaySymbol.name}
              </h1>
              <div className="flex items-center gap-4 text-slate-600 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{displaySymbol.culture}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{displaySymbol.period}</span>
                </div>
              </div>

              {/* Description */}
              {displaySymbol.description && (
                <p className="text-slate-700 text-lg leading-relaxed mb-4">
                  {displaySymbol.description}
                </p>
              )}

              {/* Signification */}
              {displaySymbol.significance && (
                <div className="mb-4">
                  <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-600" />
                    Signification
                  </h3>
                  <p className="text-slate-700">{displaySymbol.significance}</p>
                </div>
              )}

              {/* Contexte historique */}
              {displaySymbol.historical_context && (
                <div className="mb-4">
                  <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-600" />
                    Contexte historique
                  </h3>
                  <p className="text-slate-700">{displaySymbol.historical_context}</p>
                </div>
              )}
            </div>

            {/* Tags */}
            {displaySymbol.tags && displaySymbol.tags.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4 text-amber-600" />
                  <span className="font-medium text-slate-700">Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {displaySymbol.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-amber-100 text-amber-800">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <Button onClick={handleExplore} className="flex-1">
                <I18nText translationKey="common.explore">Explorer</I18nText>
              </Button>
              <ShareButton
                url={`${window.location.origin}/symbols/${displaySymbol.id}`}
                title={`${displaySymbol.name} - Symbole ${displaySymbol.culture}`}
                description={`Découvrez ce symbole de la culture ${displaySymbol.culture} datant de ${displaySymbol.period}`}
                image={primaryImage?.image_url || '/placeholder.svg'}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        {/* Sections détaillées */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {/* Informations culturelles */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Info className="h-5 w-5 text-amber-600" />
              <h3 className="text-lg font-semibold text-slate-900">
                <I18nText translationKey="symbols.details.information">Informations culturelles</I18nText>
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  <I18nText translationKey="symbols.culture">Culture</I18nText>
                </label>
                <p className="text-slate-900">{displaySymbol.culture}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700">
                  <I18nText translationKey="symbols.period">Période</I18nText>
                </label>
                <p className="text-slate-900">{displaySymbol.period}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">UUID du symbole</label>
                <p className="text-slate-900 text-sm font-mono">{displaySymbol.id}</p>
              </div>
            </div>
          </Card>

          {/* Informations techniques avec galerie d'images améliorée */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="h-5 w-5 text-amber-600" />
              <h3 className="text-lg font-semibold text-slate-900">
                Aspects techniques
              </h3>
            </div>
            
            <div className="space-y-4">
              {displaySymbol.function && displaySymbol.function.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    Fonctions
                  </label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {displaySymbol.function.map((func, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {func}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {displaySymbol.medium && displaySymbol.medium.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                    <Palette className="h-4 w-4" />
                    Supports utilisés
                  </label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {displaySymbol.medium.map((med, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                        {med}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {displaySymbol.technique && displaySymbol.technique.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                    <Hammer className="h-4 w-4" />
                    Techniques
                  </label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {displaySymbol.technique.map((tech, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Galerie d'images améliorée */}
              {images && images.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block flex items-center gap-2">
                    <Images className="h-4 w-4" />
                    Galerie d'images ({images.length})
                  </label>
                  <div className="space-y-3">
                    {/* Image principale en grand */}
                    {primaryImage && (
                      <div className="aspect-video bg-slate-100 rounded border overflow-hidden">
                        <img
                          src={primaryImage.image_url}
                          alt={primaryImage.title || displaySymbol.name}
                          className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                          onClick={handleImageClick}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Miniatures des autres images */}
                    {images.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {images.slice(0, 8).map((image, index) => (
                          <div 
                            key={image.id} 
                            className="relative aspect-square bg-slate-100 rounded border overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200"
                            onClick={() => handleThumbnailClick(index)}
                          >
                            <img
                              src={image.image_url}
                              alt={image.title || displaySymbol.name}
                              className="w-full h-full object-cover"
                              title={image.title || 'Image du symbole'}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder.svg';
                              }}
                            />
                            {image.image_type !== 'original' && (
                              <div className="absolute bottom-1 right-1">
                                <Badge variant="secondary" className="text-xs">
                                  {image.image_type === 'pattern' ? 'Motif' : 'Réut.'}
                                </Badge>
                              </div>
                            )}
                            {image.is_primary && (
                              <div className="absolute top-1 right-1">
                                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                              </div>
                            )}
                          </div>
                        ))}
                        {images.length > 8 && (
                          <div 
                            className="aspect-square flex items-center justify-center bg-slate-100 rounded border text-slate-500 text-sm cursor-pointer hover:bg-slate-200 transition-colors"
                            onClick={() => handleThumbnailClick(8)}
                          >
                            +{images.length - 8}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Collections associées */}
        <div className="mt-12">
          <SymbolCollections 
            symbolId={displaySymbol.id} 
            symbolName={displaySymbol.name}
          />
        </div>
      </div>

      {/* Bouton d'édition flottant pour les admins */}
      <AdminFloatingEditButton
        symbol={displaySymbol}
        onSymbolUpdated={handleSymbolUpdated}
      />
      
      {/* Modal de galerie d'images */}
      {images && images.length > 0 && (
        <ImageGalleryModal
          images={images}
          selectedImageIndex={selectedImageIndex}
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
          symbolName={displaySymbol.name}
        />
      )}
    </div>
  );
};

export default SymbolDetailPage;
