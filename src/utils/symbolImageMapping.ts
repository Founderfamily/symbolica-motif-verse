
import { SymbolData } from '@/types/supabase';

// Mapping des noms de symboles vers les fichiers d'images disponibles
// Basé sur les vrais noms de symboles de la base de données
export const symbolToImageMap: Record<string, string> = {
  // Correspondances exactes avec les vrais noms de la DB
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
  
  // Nouveaux symboles identifiés dans la base
  'Yin et Yang': 'mandala.png',
  'Om': 'mandala.png',
  'Hamsa': 'arabesque.png',
  'Ankh': 'fleur-de-lys.png',
  'Croix celtique': 'triskelion.png',
  'Ouroboros': 'greek-meander.png',
  'Arbre de Vie': 'triskelion.png',
  'Nœud celtique': 'triskelion.png',
  'Pentagramme': 'greek-meander.png',
  'Caducée': 'greek-meander.png',
  'Scarabée': 'adinkra.png',
  'Lotus': 'mandala.png',
  'Dragon chinois': 'seigaiha.png',
  'Œil d\'Horus': 'adinkra.png',
  'Spirale': 'triskelion.png',
  
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
  'Africaine': 'adinkra.png',
  'Japonaise': 'seigaiha.png',
  'Japanese': 'seigaiha.png',
  'Aborigène': 'aboriginal.png',
  'Aboriginal': 'aboriginal.png',
  'Nordique': 'viking.png',
  'Islamique': 'arabesque.png',
  'Islamic': 'arabesque.png',
  'Mésoaméricaine': 'aztec.png',
  'Chinoise': 'seigaiha.png',
  'Chinese': 'seigaiha.png',
  'Égyptienne': 'fleur-de-lys.png',
  'Egyptian': 'fleur-de-lys.png'
};

// Fonction pour obtenir le chemin de l'image d'un symbole avec debug
export function getSymbolImagePath(symbol: SymbolData): string {
  console.log(`🔍 Recherche d'image pour le symbole: "${symbol.name}" (Culture: "${symbol.culture}")`);
  
  // 1. Essayer avec le nom exact du symbole
  if (symbolToImageMap[symbol.name]) {
    const imagePath = `/images/symbols/${symbolToImageMap[symbol.name]}`;
    console.log(`✅ Image trouvée par nom exact: ${imagePath}`);
    return imagePath;
  }
  
  // 2. Essayer avec la culture
  if (symbolToImageMap[symbol.culture]) {
    const imagePath = `/images/symbols/${symbolToImageMap[symbol.culture]}`;
    console.log(`✅ Image trouvée par culture: ${imagePath}`);
    return imagePath;
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
  
  console.log(`🔧 Nom nettoyé: "${cleanName}"`);
  
  // Chercher des correspondances partielles plus flexibles
  for (const [key, imageName] of Object.entries(symbolToImageMap)) {
    const cleanKey = key.toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9]/g, '-');
    
    // Recherche plus flexible
    if (cleanName.includes(cleanKey) || cleanKey.includes(cleanName) ||
        symbol.name.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(symbol.name.toLowerCase())) {
      const imagePath = `/images/symbols/${imageName}`;
      console.log(`✅ Image trouvée par correspondance partielle (${key}): ${imagePath}`);
      return imagePath;
    }
  }
  
  // 4. Essayer avec des mots-clés dans le nom
  const nameWords = symbol.name.toLowerCase().split(/[\s\-\_]/);
  for (const word of nameWords) {
    if (word.length > 2) { // Éviter les mots trop courts
      for (const [key, imageName] of Object.entries(symbolToImageMap)) {
        if (key.toLowerCase().includes(word) || word.includes(key.toLowerCase())) {
          const imagePath = `/images/symbols/${imageName}`;
          console.log(`✅ Image trouvée par mot-clé "${word}" (${key}): ${imagePath}`);
          return imagePath;
        }
      }
    }
  }
  
  // 5. Fallback par culture avec recherche de mots-clés
  const cultureWords = symbol.culture.toLowerCase().split(/[\s\-\_]/);
  for (const word of cultureWords) {
    if (word.length > 3) {
      if (symbolToImageMap[word]) {
        const imagePath = `/images/symbols/${symbolToImageMap[word]}`;
        console.log(`✅ Image trouvée par mot de culture "${word}": ${imagePath}`);
        return imagePath;
      }
    }
  }
  
  // 6. Fallback final
  console.warn(`❌ Aucune image trouvée pour "${symbol.name}" (${symbol.culture}). Utilisation du placeholder.`);
  return '/placeholder.svg';
}

// Fonction pour vérifier si une image existe
export function checkImageExists(imagePath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      console.log(`✅ Image chargée avec succès: ${imagePath}`);
      resolve(true);
    };
    img.onerror = () => {
      console.warn(`❌ Échec du chargement de l'image: ${imagePath}`);
      resolve(false);
    };
    img.src = imagePath;
  });
}

// Fonction pour obtenir une image de fallback par culture
export function getCultureFallbackImage(culture: string): string {
  console.log(`🔄 Recherche de fallback pour la culture: "${culture}"`);
  
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
    'Africaine': 'adinkra.png',
    'Japonaise': 'seigaiha.png',
    'Japanese': 'seigaiha.png',
    'Aborigène': 'aboriginal.png',
    'Aboriginal': 'aboriginal.png',
    'Nordique': 'viking.png',
    'Islamique': 'arabesque.png',
    'Islamic': 'arabesque.png',
    'Mésoaméricaine': 'aztec.png',
    'Aztec': 'aztec.png',
    'Chinoise': 'seigaiha.png',
    'Chinese': 'seigaiha.png',
    'Égyptienne': 'fleur-de-lys.png',
    'Egyptian': 'fleur-de-lys.png'
  };
  
  const fallbackImage = cultureMap[culture] ? `/images/symbols/${cultureMap[culture]}` : '/placeholder.svg';
  console.log(`🔄 Fallback trouvé: ${fallbackImage}`);
  return fallbackImage;
}

// Fonction pour lister tous les symboles sans images
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
