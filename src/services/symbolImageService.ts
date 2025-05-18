
import { supabase } from '@/integrations/supabase/client';
import { SymbolData, SymbolImage } from '@/types/supabase';
import { ImageType } from '@/utils/symbolImageUtils';

// Fonction pour mettre à jour automatiquement l'image dans Supabase
export const updateImageInSupabase = async (
  symbolId: string, 
  imageType: ImageType, 
  imageUrl: string, 
  title: string, 
  description: string = ''
): Promise<boolean> => {
  try {
    // Vérifier si l'image existe déjà
    const { data: existingImage, error: queryError } = await supabase
      .from('symbol_images')
      .select('id')
      .eq('symbol_id', symbolId)
      .eq('image_type', imageType)
      .single();
    
    if (queryError && queryError.code !== 'PGRST116') { // PGRST116 est l'erreur "No rows returned"
      throw queryError;
    }
    
    if (existingImage) {
      // Mettre à jour l'image existante
      const { error } = await supabase
        .from('symbol_images')
        .update({
          image_url: imageUrl,
          title: title,
          description: description || null
        })
        .eq('id', existingImage.id);
        
      if (error) throw error;
    } else {
      // Créer une nouvelle entrée
      const { error } = await supabase
        .from('symbol_images')
        .insert({
          symbol_id: symbolId,
          image_url: imageUrl,
          image_type: imageType,
          title: title,
          description: description || null
        });
        
      if (error) throw error;
    }
    
    return true;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'image ${imageType}:`, error);
    return false;
  }
};

// Fonction pour récupérer les données d'un symbole et ses images
export const fetchSymbolData = async (symbolId: string) => {
  try {
    // Récupérer les infos du symbole
    const { data: symbolData, error: symbolError } = await supabase
      .from('symbols')
      .select('*')
      .eq('id', symbolId)
      .single();
    
    if (symbolError) throw symbolError;
    
    // Récupérer les images du symbole
    const { data: imagesData, error: imagesError } = await supabase
      .from('symbol_images')
      .select('*')
      .eq('symbol_id', symbolId);
    
    if (imagesError) throw imagesError;
    
    return { 
      symbolData: (symbolData as unknown) as SymbolData, 
      imagesData: (imagesData as unknown) as SymbolImage[] 
    };
  } catch (error) {
    console.error("Erreur lors du chargement des données:", error);
    throw error;
  }
};
