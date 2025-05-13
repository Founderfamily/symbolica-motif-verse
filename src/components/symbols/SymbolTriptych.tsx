
import React, { useState, useEffect } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { supabase } from '@/integrations/supabase/client';
import { SymbolData, SymbolImage } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';

// Image de remplacement locale en cas d'erreur
const PLACEHOLDER = "/placeholder.svg";

interface SymbolTriptychProps {
  symbolId: string | null;
}

const SymbolTriptych: React.FC<SymbolTriptychProps> = ({ symbolId }) => {
  const [symbol, setSymbol] = useState<SymbolData | null>(null);
  const [images, setImages] = useState<Record<string, SymbolImage | null>>({
    original: null,
    pattern: null,
    reuse: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!symbolId) return;
    
    const fetchSymbolData = async () => {
      setLoading(true);
      setError(false);
      
      try {
        // Récupérer les infos du symbole
        const { data: symbolData, error: symbolError } = await supabase
          .from('symbols')
          .select('*')
          .eq('id', symbolId)
          .single();
        
        if (symbolError) throw symbolError;
        setSymbol(symbolData);
        
        // Récupérer les images du symbole
        const { data: imagesData, error: imagesError } = await supabase
          .from('symbol_images')
          .select('*')
          .eq('symbol_id', symbolId);
        
        if (imagesError) throw imagesError;
        
        // Organiser les images par type
        const organizedImages: Record<string, SymbolImage | null> = {
          original: null,
          pattern: null,
          reuse: null
        };
        
        imagesData.forEach(img => {
          organizedImages[img.image_type] = img;
        });
        
        setImages(organizedImages);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setError(true);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données du symbole",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSymbolData();
  }, [symbolId, toast]);
  
  if (!symbolId) {
    return (
      <div className="flex items-center justify-center p-12 bg-slate-50 rounded-lg">
        <p className="text-slate-500 text-lg">Sélectionnez un symbole pour voir ses détails</p>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 bg-slate-50 rounded-lg">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error || !symbol) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-lg">
        <p className="text-slate-800 text-lg">Erreur de chargement</p>
        <p className="text-slate-500">Impossible de charger les données du symbole</p>
      </div>
    );
  }
  
  const renderImage = (type: 'original' | 'pattern' | 'reuse', title: string) => {
    const image = images[type];
    const imageUrl = image?.image_url || PLACEHOLDER;
    
    return (
      <div className="flex flex-col space-y-2">
        <div className="rounded-lg overflow-hidden border border-slate-200 shadow-sm">
          <AspectRatio ratio={1} className="bg-slate-50">
            <img
              src={imageUrl}
              alt={`${symbol.name} - ${title}`}
              className="object-cover w-full h-full"
              crossOrigin="anonymous"
            />
          </AspectRatio>
        </div>
        <div className="text-center">
          <h4 className="text-sm font-medium text-slate-800">{image?.title || title}</h4>
          {image?.description && (
            <p className="text-xs text-slate-600 mt-1">{image.description}</p>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-serif text-slate-900">{symbol.name}</h2>
        <p className="text-sm text-slate-600 mt-1">
          {symbol.culture} · {symbol.period}
        </p>
        {symbol.description && (
          <p className="text-slate-700 mt-3">{symbol.description}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderImage('original', 'Image originale')}
        {renderImage('pattern', 'Extraction du motif')}
        {renderImage('reuse', 'Nouvelle utilisation')}
      </div>
    </div>
  );
};

export default SymbolTriptych;
