
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Info, MapPin, Calendar, Share2, Tag, Palette, Hammer, Star, BookOpen, Clock } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { I18nText } from '@/components/ui/i18n-text';
import { ShareButton } from '@/components/social/ShareButton';
import { SymbolCollections } from '@/components/symbols/SymbolCollections';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { useSymbolById, useSymbolImages } from '@/hooks/useSupabaseSymbols';
import { SupabaseSymbolService } from '@/services/supabaseSymbolService';

const SymbolDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Gestion de la rétrocompatibilité pour les anciens liens avec indices
  const resolvedId = React.useMemo(() => {
    if (!id) return null;

    // Si c'est déjà un UUID valide, l'utiliser tel quel
    if (SupabaseSymbolService.isValidUuid(id)) {
      return id;
    }

    // Sinon, essayer de convertir l'ancien index en UUID
    const numericIndex = parseInt(id, 10);
    if (!isNaN(numericIndex)) {
      const legacyUuid = SupabaseSymbolService.getLegacyUuidFromIndex(numericIndex);
      if (legacyUuid) {
        // Rediriger automatiquement vers la nouvelle URL avec UUID
        navigate(`/symbols/${legacyUuid}`, { replace: true });
        return legacyUuid;
      }
    }

    return null;
  }, [id, navigate]);

  // Requêtes pour récupérer les données du symbole
  const { data: symbol, isLoading: symbolLoading, error: symbolError } = useSymbolById(resolvedId || undefined);
  const { data: images, isLoading: imagesLoading } = useSymbolImages(resolvedId || undefined);

  // Trouver l'image principale
  const primaryImage = React.useMemo(() => {
    if (!images || images.length === 0) return null;
    return images.find(img => img.image_type === 'original') || images[0];
  }, [images]);

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

  // Fonctions pour les actions
  const handleExplore = () => {
    navigate(`/analysis?symbol=${symbol.id}&name=${encodeURIComponent(symbol.name)}`);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/symbols/${symbol.id}`;
    const title = `${symbol.name} - Symbole ${symbol.culture}`;
    const description = `Découvrez ce symbole de la culture ${symbol.culture} datant de ${symbol.period}`;
    
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
                  alt={symbol.name}
                  className="object-cover w-full h-full"
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
                {symbol.name}
              </h1>
              <div className="flex items-center gap-4 text-slate-600 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{symbol.culture}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{symbol.period}</span>
                </div>
              </div>

              {/* Description */}
              {symbol.description && (
                <p className="text-slate-700 text-lg leading-relaxed mb-4">
                  {symbol.description}
                </p>
              )}

              {/* Signification */}
              {symbol.significance && (
                <div className="mb-4">
                  <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-600" />
                    Signification
                  </h3>
                  <p className="text-slate-700">{symbol.significance}</p>
                </div>
              )}

              {/* Contexte historique */}
              {symbol.historical_context && (
                <div className="mb-4">
                  <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-600" />
                    Contexte historique
                  </h3>
                  <p className="text-slate-700">{symbol.historical_context}</p>
                </div>
              )}
            </div>

            {/* Tags */}
            {symbol.tags && symbol.tags.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4 text-amber-600" />
                  <span className="font-medium text-slate-700">Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {symbol.tags.map((tag, index) => (
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
                url={`${window.location.origin}/symbols/${symbol.id}`}
                title={`${symbol.name} - Symbole ${symbol.culture}`}
                description={`Découvrez ce symbole de la culture ${symbol.culture} datant de ${symbol.period}`}
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
                <p className="text-slate-900">{symbol.culture}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700">
                  <I18nText translationKey="symbols.period">Période</I18nText>
                </label>
                <p className="text-slate-900">{symbol.period}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">UUID du symbole</label>
                <p className="text-slate-900 text-sm font-mono">{symbol.id}</p>
              </div>
            </div>
          </Card>

          {/* Informations techniques */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="h-5 w-5 text-amber-600" />
              <h3 className="text-lg font-semibold text-slate-900">
                Aspects techniques
              </h3>
            </div>
            
            <div className="space-y-4">
              {symbol.function && symbol.function.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    Fonctions
                  </label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {symbol.function.map((func, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {func}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {symbol.medium && symbol.medium.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                    <Palette className="h-4 w-4" />
                    Supports utilisés
                  </label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {symbol.medium.map((med, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                        {med}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {symbol.technique && symbol.technique.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                    <Hammer className="h-4 w-4" />
                    Techniques
                  </label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {symbol.technique.map((tech, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Galerie d'images supplémentaires */}
              {images && images.length > 1 && (
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Images ({images.length})
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {images.slice(0, 4).map((image, index) => (
                      <div key={image.id} className="aspect-square">
                        <img
                          src={image.image_url}
                          alt={image.title || symbol.name}
                          className="w-full h-full object-cover rounded border"
                        />
                      </div>
                    ))}
                    {images.length > 4 && (
                      <div className="aspect-square flex items-center justify-center bg-slate-100 rounded border text-slate-500 text-sm">
                        +{images.length - 4} images
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
            symbolId={symbol.id} 
            symbolName={symbol.name}
          />
        </div>
      </div>
    </div>
  );
};

export default SymbolDetailPage;
