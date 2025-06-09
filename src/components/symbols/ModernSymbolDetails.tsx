
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MapPin, Calendar, Palette, Sparkles, ExternalLink } from 'lucide-react';
import { SymbolData } from '@/types/supabase';
import { getSymbolImagePath, getCultureFallbackImage, checkImageExists } from '@/utils/symbolImageMapping';

interface ModernSymbolDetailsProps {
  symbol: SymbolData;
}

const ModernSymbolDetails: React.FC<ModernSymbolDetailsProps> = ({ symbol }) => {
  const mainImagePath = getSymbolImagePath(symbol);
  const cultureImagePath = getCultureFallbackImage(symbol.culture);

  // Gestionnaire d'erreur d'image amélioré
  const handleImageError = async (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const originalSrc = img.src;
    
    console.warn(`❌ Échec de chargement pour ${symbol.name}: ${originalSrc}`);
    
    if (originalSrc !== cultureImagePath) {
      console.log(`🔄 Tentative de fallback pour ${symbol.name}: ${cultureImagePath}`);
      const exists = await checkImageExists(cultureImagePath);
      if (exists) {
        img.src = cultureImagePath;
        return;
      }
    }
    
    console.log(`📷 Utilisation du placeholder pour ${symbol.name}`);
    img.src = '/placeholder.svg';
  };

  return (
    <Card className="w-full max-w-4xl mx-auto border-2 border-slate-200 shadow-xl">
      <CardContent className="p-0">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Images section */}
          <div className="space-y-4 p-6 bg-gradient-to-br from-slate-50 to-white">
            {/* Image principale */}
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              <img
                src={mainImagePath}
                alt={`${symbol.name} - Original`}
                className="w-full h-64 object-cover"
                onError={handleImageError}
                onLoad={() => console.log(`✅ Image principale chargée: ${symbol.name}`)}
              />
              <div className="absolute top-3 left-3">
                <Badge className="bg-blue-600 text-white">
                  Motif Original
                </Badge>
              </div>
              
              {/* Debug badge */}
              {process.env.NODE_ENV === 'development' && mainImagePath === '/placeholder.svg' && (
                <div className="absolute top-3 right-3">
                  <Badge variant="destructive" className="text-xs">
                    No Image Found
                  </Badge>
                </div>
              )}
            </div>

            {/* Mini-galerie Motif & Moderne */}
            <div className="grid grid-cols-2 gap-3">
              <div className="relative rounded-lg overflow-hidden shadow-md group cursor-pointer">
                <img
                  src={mainImagePath}
                  alt={`${symbol.name} - Motif`}
                  className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-300"
                  style={{ filter: 'sepia(0.3) saturate(1.2)' }}
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors duration-300" />
                <div className="absolute bottom-1 left-1">
                  <Badge variant="secondary" className="text-xs bg-white/90">
                    Motif
                  </Badge>
                </div>
              </div>

              <div className="relative rounded-lg overflow-hidden shadow-md group cursor-pointer">
                <img
                  src={mainImagePath}
                  alt={`${symbol.name} - Moderne`}
                  className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-300"
                  style={{ filter: 'contrast(1.2) brightness(1.1)' }}
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-green-500/20 group-hover:bg-green-500/30 transition-colors duration-300" />
                <div className="absolute bottom-1 left-1">
                  <Badge variant="secondary" className="text-xs bg-white/90">
                    Moderne
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Détails section */}
          <div className="p-6 space-y-6">
            {/* En-tête */}
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h2 className="text-2xl font-bold text-slate-800">
                  {symbol.name}
                </h2>
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Détails
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {symbol.culture}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {symbol.period}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Description */}
            {symbol.description && (
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Description
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {symbol.description}
                </p>
              </div>
            )}

            <Separator />

            {/* Motifs & Réutilisation Moderne */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Motifs & Inspirations
              </h3>
              
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-blue-700 text-sm">Motif Traditionnel</span>
                  </div>
                  <p className="text-xs text-blue-600">
                    Élément décoratif ancestral préservant l'authenticité culturelle
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-green-700 text-sm">Réutilisation Moderne</span>
                  </div>
                  <p className="text-xs text-green-600">
                    Adaptation contemporaine dans le design, l'architecture et l'art
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Métadonnées supplémentaires */}
            <div className="space-y-3">
              {symbol.significance && (
                <div>
                  <h4 className="font-medium text-slate-700 text-sm mb-1">Signification</h4>
                  <p className="text-xs text-slate-600">{symbol.significance}</p>
                </div>
              )}
              
              {symbol.tags && symbol.tags.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-700 text-sm mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {symbol.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {(symbol.function && symbol.function.length > 0) && (
                <div>
                  <h4 className="font-medium text-slate-700 text-sm mb-2">Fonctions</h4>
                  <div className="flex flex-wrap gap-1">
                    {symbol.function.map((func, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {func}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModernSymbolDetails;
