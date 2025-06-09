
import { SymbolData } from '@/types/supabase';

// Mapping statique simple qui fonctionne (copié des composants qui marchent)
export const symbolToLocalImage: Record<string, string> = {
  "Triskèle Celtique": "/images/symbols/triskelion.png",
  "Triskèle celtique": "/images/symbols/triskelion.png",
  "Fleur de Lys": "/images/symbols/fleur-de-lys.png",
  "Fleur de lys": "/images/symbols/fleur-de-lys.png",
  "Méandre Grec": "/images/symbols/greek-meander.png",
  "Méandre grec": "/images/symbols/greek-meander.png",
  "Mandala": "/images/symbols/mandala.png",
  "Symbole Adinkra": "/images/symbols/adinkra.png",
  "Adinkra": "/images/symbols/adinkra.png",
  "Motif Seigaiha": "/images/symbols/seigaiha.png",
  "Seigaiha": "/images/symbols/seigaiha.png",
  "Art aborigène": "/images/symbols/aboriginal.png",
  "Motif viking": "/images/symbols/viking.png",
  "Arabesque": "/images/symbols/arabesque.png",
  "Motif aztèque": "/images/symbols/aztec.png",
  "Aztèque": "/images/symbols/aztec.png",
  
  // Nouveaux symboles
  "Yin Yang": "/images/symbols/mandala.png",
  "Yin et Yang": "/images/symbols/mandala.png",
  "Ankh": "/images/symbols/adinkra.png",
  "Hamsa": "/images/symbols/mandala.png",
  "Attrape-rêves": "/images/symbols/triskelion.png",
  "Dreamcatcher": "/images/symbols/triskelion.png",
  "Om": "/images/symbols/mandala.png",
  "Nœud celtique": "/images/symbols/triskelion.png",
  "Croix celtique": "/images/symbols/triskelion.png",
  "Triskell celtique": "/images/symbols/triskelion.png",
  "Sashiko": "/images/symbols/seigaiha.png",
  "Croix de Brigid": "/images/symbols/triskelion.png"
};

// Fonction simple qui utilise le mapping statique
export function getSymbolImagePath(symbol: SymbolData): string {
  console.log(`🔍 Recherche d'image pour: "${symbol.name}"`);
  
  // Utiliser le mapping statique directement
  if (symbolToLocalImage[symbol.name]) {
    console.log(`✅ Image trouvée: ${symbolToLocalImage[symbol.name]}`);
    return symbolToLocalImage[symbol.name];
  }
  
  // Fallback vers placeholder
  console.log(`❌ Aucune image trouvée pour "${symbol.name}", utilisation du placeholder`);
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

// Debug pour lister les symboles sans images
export function debugSymbolImages(symbols: SymbolData[]): void {
  console.group('🐛 Debug: Symboles et leurs images');
  
  const withImages: string[] = [];
  const withoutImages: string[] = [];
  
  symbols.forEach(symbol => {
    const imagePath = getSymbolImagePath(symbol);
    if (imagePath === '/placeholder.svg') {
      withoutImages.push(`"${symbol.name}" (${symbol.culture})`);
    } else {
      withImages.push(`"${symbol.name}" -> ${imagePath}`);
    }
  });
  
  console.log('✅ Symboles avec images:', withImages);
  console.log('❌ Symboles sans images:', withoutImages);
  console.groupEnd();
}
