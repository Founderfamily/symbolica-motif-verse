
import { SymbolImage } from '../types/supabase';
import { supabase } from '@/integrations/supabase/client';

// Types d'images prises en charge
export type ImageType = 'original' | 'pattern' | 'reuse';

// Fonction pour valider les URL d'images
export async function validateImageUrl(url: string): Promise<boolean> {
  if (!url || url.trim() === '') return false;
  
  // Vérifier si l'URL est valide
  try {
    new URL(url);
  } catch (e) {
    console.error("URL invalide:", url);
    return false;
  }

  // Pour les URL de Supabase Storage
  if (url.includes('supabase') && url.includes('storage')) {
    // Nous faisons confiance à nos propres URL de stockage
    return true;
  }

  try {
    // Vérifier si l'image est accessible
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error("Erreur lors de la vérification de l'URL:", error);
    return false;
  }
}

// Fonction pour valider les dimensions de l'image
export async function validateImageDimensions(
  url: string,
  minWidth: number = 100,
  minHeight: number = 100
): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      const valid = img.width >= minWidth && img.height >= minHeight;
      resolve(valid);
    };
    
    img.onerror = () => {
      console.error("Erreur lors du chargement de l'image:", url);
      resolve(false);
    };
    
    img.src = url;
  });
}

// Fonction pour valider le type MIME de l'image
export async function validateImageType(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    if (!response.ok) return false;
    
    const contentType = response.headers.get('content-type');
    return contentType !== null && contentType.startsWith('image/');
  } catch (error) {
    console.error("Erreur lors de la vérification du type MIME:", error);
    return false;
  }
}

// Fonction principale pour valider une image complètement
export async function validateImage(
  url: string,
  minWidth: number = 100,
  minHeight: number = 100
): Promise<boolean> {
  const urlValid = await validateImageUrl(url);
  if (!urlValid) return false;
  
  const dimensionsValid = await validateImageDimensions(url, minWidth, minHeight);
  if (!dimensionsValid) return false;
  
  const typeValid = await validateImageType(url);
  return typeValid;
}

// Fonction pour traiter et mettre à jour une image en cas d'échec
export async function processAndUpdateImage(
  symbolName: string,
  symbolCulture: string,
  imageUrl: string,
  type: ImageType
): Promise<string> {
  // Vérifier si l'image est valide
  const isValid = await validateImageUrl(imageUrl);
  
  if (isValid) {
    return imageUrl; // Image valide, renvoyer l'URL originale
  }
  
  // Si l'image n'est pas valide, générer une alternative
  console.log(`Image non disponible: ${imageUrl}, recherche d'alternative...`);
  
  let alternativeUrl = "";
  
  // Utiliser le switch avec tous les types possibles définis dans ImageType
  switch (type) {
    case 'original':
      alternativeUrl = `https://source.unsplash.com/featured/?${encodeURIComponent(symbolName.toLowerCase())}+${symbolCulture.toLowerCase()}+historical+artifact`;
      break;
    case 'pattern':
      alternativeUrl = `https://source.unsplash.com/featured/?${encodeURIComponent(symbolName.toLowerCase())}+pattern+design`;
      break;
    case 'reuse':
      alternativeUrl = `https://source.unsplash.com/featured/?${encodeURIComponent(symbolName.toLowerCase())}+modern+design`;
      break;
    default:
      alternativeUrl = `https://source.unsplash.com/featured/?${encodeURIComponent(symbolName.toLowerCase())}`;
  }
  
  console.log(`URL alternative générée: ${alternativeUrl}`);
  return alternativeUrl;
}

// Sauvegarder une image dans Supabase Storage
export async function saveImageToStorage(
  file: File,
  bucket: string,
  path: string
): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: true,
        cacheControl: '3600',
        contentType: file.type,
      });
    
    if (error) {
      throw error;
    }
    
    // Construire l'URL de l'image stockée
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'image:", error);
    return null;
  }
}

// Fonctions pour valider spécifiquement chaque type d'image
export function validateOriginalImage(url: string): Promise<boolean> {
  return validateImage(url, 300, 300);
}

export function validatePatternImage(url: string): Promise<boolean> {
  return validateImage(url, 200, 200);
}

export function validateReuseImage(url: string): Promise<boolean> {
  return validateImage(url, 250, 250);
}
