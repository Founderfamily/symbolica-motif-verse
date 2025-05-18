
import { Symbol } from '@/data/symbols';

export type ImageType = 'original' | 'pattern' | 'reuse';

export const PLACEHOLDER = "/placeholder.svg";

// Mapping des noms de symboles aux chemins d'images locales
export const symbolToLocalImage: Record<string, string> = {
  "Triskèle celtique": "/images/symbols/triskelion.png",
  "Fleur de Lys": "/images/symbols/fleur-de-lys.png",
  "Méandre grec": "/images/symbols/greek-meander.png",
  "Mandala": "/images/symbols/mandala.png",
  "Symbole Adinkra": "/images/symbols/adinkra.png",
  "Motif Seigaiha": "/images/symbols/seigaiha.png",
  "Art aborigène": "/images/symbols/aboriginal.png",
  "Motif viking": "/images/symbols/viking.png",
  "Arabesque": "/images/symbols/arabesque.png",
  "Motif aztèque": "/images/symbols/aztec.png"
};

// French to English culture mapping
export const cultureMapping: Record<string, string> = {
  // English to English (for direct matches)
  'Celtic': 'Celtic',
  'Viking': 'Viking',
  'Greek': 'Greek',
  'Aboriginal': 'Aboriginal',
  'Aztec': 'Aztec',
  'Mayan': 'Mayan',
  'Japanese': 'Japanese',
  'Indian': 'Indian',
  'Buddhist': 'Buddhist',
  'Persian': 'Persian',
  'Islamic': 'Islamic',
  'French': 'French',
  'Egyptian': 'Egyptian',
  'African': 'African',
  
  // French to English
  'Celtique': 'Celtic',
  'Nordique': 'Viking',
  'Grec': 'Greek',
  'Aborigène': 'Aboriginal',
  'Aztèque': 'Aztec',
  'Maya': 'Mayan',
  'Japonais': 'Japanese',
  'Indien': 'Indian',
  'Bouddhiste': 'Buddhist',
  'Perse': 'Persian',
  'Islamique': 'Islamic',
  'Français': 'French',
  'Égyptien': 'Egyptian',
  'Africain': 'African'
};

// Normalize culture name to English for consistent icon and color mapping
const normalizeCulture = (culture: string): string => {
  return cultureMapping[culture] || culture;
};

// Fonction pour obtenir une image de remplacement appropriée
export function getBestImageForSymbol(symbolName: string, symbolCulture: string, type: ImageType): string {
  // Priorité 1: image locale si elle existe
  if (symbolToLocalImage[symbolName]) {
    return symbolToLocalImage[symbolName];
  }

  // Priorité 2: placeholder générique
  return PLACEHOLDER;
}

// Fonction pour vérifier si une URL d'image est valide
export function isValidImageUrl(url: string): boolean {
  // Pour les chemins locaux (commençant par '/'), considérer comme valides
  if (url.startsWith('/')) {
    return true;
  }
  
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

export const getSymbolIconByType = (culture: string): string => {
  // Normalize culture name to English
  const normalizedCulture = normalizeCulture(culture);
  
  // Map culture to icon
  const cultureMap: Record<string, string> = {
    'Celtic': '/images/symbols/triskelion.png',
    'Viking': '/images/symbols/viking.png',
    'Greek': '/images/symbols/greek-meander.png',
    'Aboriginal': '/images/symbols/aboriginal.png',
    'Aztec': '/images/symbols/aztec.png',
    'Mayan': '/images/symbols/aztec.png', // Using Aztec as fallback
    'Japanese': '/images/symbols/seigaiha.png',
    'Indian': '/images/symbols/mandala.png',
    'Buddhist': '/images/symbols/mandala.png',
    'Persian': '/images/symbols/arabesque.png',
    'Islamic': '/images/symbols/arabesque.png',
    'French': '/images/symbols/fleur-de-lys.png',
    'Egyptian': '/images/symbols/adinkra.png', // Using another symbol as placeholder
    'African': '/images/symbols/adinkra.png'
  };
  
  return cultureMap[normalizedCulture] || '/images/symbols/mandala.png'; // Default to mandala if culture not found
};

export const getSymbolThemeColor = (culture: string): string => {
  // Normalize culture name to English
  const normalizedCulture = normalizeCulture(culture);
  
  // Map culture to a color theme
  const colorMap: Record<string, string> = {
    'Celtic': 'bg-emerald-500',
    'Viking': 'bg-sky-600',
    'Greek': 'bg-blue-500',
    'Aboriginal': 'bg-orange-600',
    'Aztec': 'bg-red-600',
    'Mayan': 'bg-red-700',
    'Japanese': 'bg-pink-500',
    'Indian': 'bg-purple-500',
    'Buddhist': 'bg-indigo-600',
    'Persian': 'bg-amber-600',
    'Islamic': 'bg-amber-600',
    'French': 'bg-violet-500',
    'Egyptian': 'bg-yellow-600',
    'African': 'bg-yellow-700'
  };
  
  return colorMap[normalizedCulture] || 'bg-slate-500'; // Default color
};
