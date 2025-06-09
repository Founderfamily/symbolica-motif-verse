
import { SymbolData } from '@/types/supabase';

// Mapping des noms de symboles vers les fichiers d'images disponibles
export const symbolToImageMap: Record<string, string> = {
  // Correspondances exactes
  'Triskèle celtique': 'triskelion.png',
  'Triskèle Celtique': 'triskelion.png',
  'Fleur de Lys': 'fleur-de-lys.png',
  'Fleur de lys': 'fleur-de-lys.png',
  'Méandre grec': 'greek-meander.png',
  'Méandre Grec': 'greek-meander.png',
  'Mandala': 'mandala.png',
  'Symbole Adinkra': 'adinkra.png',
  'Adinkra': 'adinkra.png',
  'Motif Seigaiha': 'seigaiha.png',
  'Seigaiha': 'seigaiha.png',
  'Art aborigène': 'aboriginal.png',
  'Motif viking': 'viking.png',
  'Arabesque': 'arabesque.png',
  'Motif aztèque': 'aztec.png',
  'Aztèque': 'aztec.png',
  
  // Fallbacks par culture (sans doublons)
  'Celtique': 'triskelion.png',
  'Celtic': 'triskelion.png',
  'Française': 'fleur-de-lys.png',
  'French': 'fleur-de-lys.png',
  'Grecque': 'greek-meander.png',
  'Greek': 'greek-meander.png',
  'Indienne': 'mandala.png',
  'Indian': 'mandala.png',
  'Ashanti': 'adinkra.png',
  'African': 'adinkra.png',
  'Japonaise': 'seigaiha.png',
  'Japanese': 'seigaiha.png',
  'Aborigène': 'aboriginal.png',
  'Aboriginal': 'aboriginal.png',
  'Nordique': 'viking.png',
  'Islamique': 'arabesque.png',
  'Islamic': 'arabesque.png',
  'Mésoaméricaine': 'aztec.png'
};

// Fonction pour obtenir le chemin de l'image d'un symbole
export function getSymbolImagePath(symbol: SymbolData): string {
  // 1. Essayer avec le nom exact du symbole
  if (symbolToImageMap[symbol.name]) {
    return `/images/symbols/${symbolToImageMap[symbol.name]}`;
  }
  
  // 2. Essayer avec la culture
  if (symbolToImageMap[symbol.culture]) {
    return `/images/symbols/${symbolToImageMap[symbol.culture]}`;
  }
  
  // 3. Essayer de nettoyer le nom et chercher une correspondance partielle
  const cleanName = symbol.name.toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  // Chercher des correspondances partielles
  for (const [key, imageName] of Object.entries(symbolToImageMap)) {
    const cleanKey = key.toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9]/g, '-');
    
    if (cleanName.includes(cleanKey) || cleanKey.includes(cleanName)) {
      return `/images/symbols/${imageName}`;
    }
  }
  
  // 4. Fallback final
  return '/placeholder.svg';
}

// Fonction pour vérifier si une image existe
export function checkImageExists(imagePath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imagePath;
  });
}

// Fonction pour obtenir une image de fallback par culture
export function getCultureFallbackImage(culture: string): string {
  const cultureMap: Record<string, string> = {
    'Celtique': 'triskelion.png',
    'Celtic': 'triskelion.png',
    'Française': 'fleur-de-lys.png',
    'French': 'fleur-de-lys.png',
    'Grecque': 'greek-meander.png',
    'Greek': 'greek-meander.png',
    'Indienne': 'mandala.png',
    'Indian': 'mandala.png',
    'Ashanti': 'adinkra.png',
    'African': 'adinkra.png',
    'Japonaise': 'seigaiha.png',
    'Japanese': 'seigaiha.png',
    'Aborigène': 'aboriginal.png',
    'Aboriginal': 'aboriginal.png',
    'Nordique': 'viking.png',
    'Islamique': 'arabesque.png',
    'Islamic': 'arabesque.png',
    'Mésoaméricaine': 'aztec.png',
    'Aztec': 'aztec.png'
  };
  
  return cultureMap[culture] ? `/images/symbols/${cultureMap[culture]}` : '/placeholder.svg';
}
