
import { ImageType, PLACEHOLDER } from "@/utils/symbolImageUtils";
import { supabase } from "@/integrations/supabase/client";

// Fonction pour vérifier si une URL est accessible
export const checkImageAvailability = async (url: string): Promise<boolean> => {
  // Ne pas vérifier les images locales ou les placeholders
  if (url.startsWith('/') || url === PLACEHOLDER) {
    return true;
  }
  
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      mode: 'no-cors' // Pour éviter les erreurs CORS lors de la vérification
    });
    return true; // Si nous arrivons ici sans erreur, l'URL est probablement valide
  } catch (error) {
    console.error(`Erreur lors de la vérification de l'URL d'image: ${url}`, error);
    return false;
  }
};

// Fonction pour nettoyer et valider une URL d'image
export const sanitizeImageUrl = (url: string | null | undefined): string => {
  if (!url) return PLACEHOLDER;
  
  // Vérifier si c'est une URL valide
  try {
    new URL(url);
    return url;
  } catch (e) {
    // Si ce n'est pas une URL absolue, vérifier si c'est un chemin local valide
    if (url.startsWith('/')) {
      return url;
    }
    return PLACEHOLDER;
  }
};

// Fonction pour obtenir la meilleure description pour un type d'image
export const getImageDescription = (
  symbolName: string,
  symbolCulture: string,
  type: ImageType
): string => {
  switch (type) {
    case 'original':
      return `Représentation historique authentique d'un ${symbolName} de la culture ${symbolCulture}`;
    case 'pattern':
      return `Extraction graphique du motif ${symbolName}, utilisé dans la culture ${symbolCulture}`;
    case 'reuse':
      return `Application contemporaine du symbole ${symbolName} dans le contexte moderne de la culture ${symbolCulture}`;
    default:
      return `Image du symbole ${symbolName}`;
  }
};

// Fonction pour traiter et mettre à jour l'URL d'une image dans Supabase
export const processAndUpdateImage = async (
  symbolId: string,
  symbolName: string,
  symbolCulture: string,
  type: ImageType,
  url: string
): Promise<string> => {
  // Valider d'abord l'URL
  const isAvailable = await checkImageAvailability(url);
  
  if (!isAvailable) {
    // Si l'URL n'est pas valide, utiliser une source alternative
    console.log(`Image non disponible: ${url}, recherche d'alternative...`);
    
    let alternativeUrl = "";
    switch (type) {
      case 'original':
        alternativeUrl = `https://source.unsplash.com/featured/?${encodeURIComponent(symbolName.toLowerCase())}+${symbolCulture.toLowerCase()}+historical+artifact`;
        break;
      case 'pattern':
        // Pour les motifs, utiliser notre base locale uniquement
        return url;
      case 'reuse':
        alternativeUrl = `https://source.unsplash.com/featured/?${encodeURIComponent(symbolCulture.toLowerCase())}+art+contemporary`;
        break;
    }
    
    // Mettre à jour dans Supabase avec l'alternative
    try {
      await supabase
        .from('symbol_images')
        .update({
          image_url: alternativeUrl,
          title: type === 'original' ? 'Image originale' : 
                  type === 'pattern' ? 'Motif extrait' : 'Réutilisation contemporaine',
          description: getImageDescription(symbolName, symbolCulture, type)
        })
        .eq('symbol_id', symbolId)
        .eq('image_type', type);
        
      return alternativeUrl;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'image alternative:", error);
      return url; // En cas d'erreur, retourner l'URL originale
    }
  }
  
  return url; // L'URL est valide, la retourner telle quelle
};
