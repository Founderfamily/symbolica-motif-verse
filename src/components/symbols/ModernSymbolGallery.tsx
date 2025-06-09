
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, Filter, Heart, Share2, Eye, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useHybridSymbols } from '@/hooks/useHybridSymbols';
import { useTranslation } from '@/i18n/useTranslation';
import { SymbolData } from '@/types/supabase';
import { getSymbolImagePath, debugSymbolImages, checkImageExists } from '@/utils/symbolImageMapping';

interface ModernSymbolGalleryProps {
  onSymbolSelect?: (symbol: SymbolData) => void;
}

const ModernSymbolGallery: React.FC<ModernSymbolGalleryProps> = ({ onSymbolSelect }) => {
  const { symbols, isLoading } = useHybridSymbols();
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCulture, setSelectedCulture] = useState<string | null>(null);
  const [hoveredSymbol, setHoveredSymbol] = useState<string | null>(null);

  // Debug: Afficher les informations sur les images au chargement
  useEffect(() => {
    if (symbols.length > 0) {
      console.log(`🎯 Galerie chargée avec ${symbols.length} symboles`);
      debugSymbolImages(symbols);
    }
  }, [symbols]);

  // Filtrer les symboles selon la recherche et la culture
  const filteredSymbols = symbols.filter(symbol => {
    const matchesSearch = symbol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         symbol.culture.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCulture = !selectedCulture || symbol.culture === selectedCulture;
    return matchesSearch && matchesCulture;
  });

  // Obtenir les cultures uniques
  const cultures = Array.from(new Set(symbols.map(s => s.culture)));

  // Navigation
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, filteredSymbols.length - 2));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, filteredSymbols.length - 2)) % Math.max(1, filteredSymbols.length - 2));
  };

  // Auto-play
  useEffect(() => {
    if (filteredSymbols.length <= 3) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.max(1, filteredSymbols.length - 2));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [filteredSymbols.length]);

  // Gestionnaire d'erreur d'image amélioré
  const handleImageError = async (e: React.SyntheticEvent<HTMLImageElement>, symbol: SymbolData) => {
    const img = e.currentTarget;
    const originalSrc = img.src;
    
    console.warn(`❌ Échec de chargement pour ${symbol.name}: ${originalSrc}`);
    
    // Essayer le fallback par culture
    const fallbackPath = `/images/symbols/${symbol.culture.toLowerCase()}.png`;
    
    if (originalSrc !== fallbackPath) {
      console.log(`🔄 Tentative de fallback pour ${symbol.name}: ${fallbackPath}`);
      const exists = await checkImageExists(fallbackPath);
      if (exists) {
        img.src = fallbackPath;
        return;
      }
    }
    
    // Utiliser le placeholder final
    console.log(`📷 Utilisation du placeholder pour ${symbol.name}`);
    img.src = '/placeholder.svg';
  };

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
          <span className="text-slate-600">Chargement de la galerie...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* En-tête avec recherche et filtres */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Rechercher un symbole..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm border-slate-200"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={!selectedCulture ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCulture(null)}
              className="h-8"
            >
              Toutes
            </Button>
            {cultures.slice(0, 4).map((culture) => (
              <Button
                key={culture}
                variant={selectedCulture === culture ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCulture(culture === selectedCulture ? null : culture)}
                className="h-8"
              >
                {culture}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Galerie principale */}
      <div className="relative">
        {/* Navigation */}
        {filteredSymbols.length > 3 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg border-slate-200 hover:bg-white"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg border-slate-200 hover:bg-white"
              onClick={nextSlide}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Grille de symboles */}
        <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-slate-50 to-white p-6">
          <div 
            className="flex transition-transform duration-500 ease-in-out gap-6"
            style={{ transform: `translateX(-${currentIndex * 33.333}%)` }}
          >
            {filteredSymbols.map((symbol, index) => {
              const imagePath = getSymbolImagePath(symbol);
              
              return (
                <div
                  key={symbol.id}
                  className="flex-shrink-0 w-80"
                  onMouseEnter={() => setHoveredSymbol(symbol.id)}
                  onMouseLeave={() => setHoveredSymbol(null)}
                >
                  <Card 
                    className={`h-full cursor-pointer transition-all duration-300 border-2 ${
                      hoveredSymbol === symbol.id 
                        ? 'border-amber-300 shadow-2xl scale-105' 
                        : 'border-slate-200 shadow-lg hover:shadow-xl'
                    }`}
                    onClick={() => onSymbolSelect?.(symbol)}
                  >
                    <CardContent className="p-0">
                      {/* Image principale */}
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        <img
                          src={imagePath}
                          alt={symbol.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                          onError={(e) => handleImageError(e, symbol)}
                          onLoad={() => console.log(`✅ Image chargée: ${symbol.name} -> ${imagePath}`)}
                        />
                        
                        {/* Overlay avec actions */}
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
                          hoveredSymbol === symbol.id ? 'opacity-100' : 'opacity-0'
                        }`}>
                          <div className="absolute bottom-3 left-3 flex space-x-2">
                            <Button size="sm" variant="secondary" className="h-8 px-2">
                              <Eye className="h-3 w-3 mr-1" />
                              Voir
                            </Button>
                            <Button size="sm" variant="secondary" className="h-8 px-2">
                              <Heart className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="secondary" className="h-8 px-2">
                              <Share2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Badge culture */}
                        <div className="absolute top-3 right-3">
                          <Badge variant="secondary" className="bg-white/90 text-slate-700">
                            {symbol.culture}
                          </Badge>
                        </div>

                        {/* Debug badge */}
                        {process.env.NODE_ENV === 'development' && imagePath === '/placeholder.svg' && (
                          <div className="absolute top-3 left-3">
                            <Badge variant="destructive" className="text-xs">
                              No Image
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Contenu */}
                      <div className="p-4 space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg text-slate-800 mb-1">
                            {symbol.name}
                          </h3>
                          <p className="text-sm text-slate-500 flex items-center">
                            <Sparkles className="h-3 w-3 mr-1" />
                            {symbol.period}
                          </p>
                        </div>

                        {symbol.description && (
                          <p className="text-sm text-slate-600 line-clamp-2">
                            {symbol.description}
                          </p>
                        )}

                        {/* Section Motifs & Réutilisation */}
                        <div className="flex gap-2 pt-2 border-t border-slate-100">
                          <div className="flex-1 text-center p-2 bg-blue-50 rounded-lg">
                            <div className="text-xs font-medium text-blue-700">Motif</div>
                            <div className="text-xs text-blue-600">Traditionnel</div>
                          </div>
                          <div className="flex-1 text-center p-2 bg-green-50 rounded-lg">
                            <div className="text-xs font-medium text-green-700">Moderne</div>
                            <div className="text-xs text-green-600">Design</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Indicateurs */}
        {filteredSymbols.length > 3 && (
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: Math.max(1, filteredSymbols.length - 2) }).map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-amber-500 w-8' 
                    : 'bg-slate-300 hover:bg-slate-400'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="text-center">
        <p className="text-sm text-slate-500">
          {filteredSymbols.length} symbole{filteredSymbols.length > 1 ? 's' : ''} 
          {selectedCulture && ` • Culture: ${selectedCulture}`}
          {searchTerm && ` • Recherche: "${searchTerm}"`}
        </p>
      </div>
    </div>
  );
};

export default ModernSymbolGallery;
