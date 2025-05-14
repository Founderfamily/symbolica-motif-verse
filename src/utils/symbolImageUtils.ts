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
