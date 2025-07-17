/**
 * Utility pour regrouper les cultures spécifiques en familles culturelles
 */

export interface CultureFamily {
  id: string;
  name: string;
  cultures: string[];
  description?: string;
}

export const CULTURE_FAMILIES: CultureFamily[] = [
  {
    id: 'french-regional',
    name: 'France & Régions françaises',
    cultures: [
      'Française', 'Compagnonnage français', 'Gauloise', 'Culture gauloise',
      'Aquitaine', 'Ardennes', 'Bourbonnais', 'Bourgogne', 'Bretagne',
      'Champagne', 'Champagne-Ardenne', 'Dauphiné', 'Flandre française',
      'Franche-Comté', 'Gascogne', 'Île-de-France'
    ],
    description: 'Cultures de France et ses régions historiques'
  },
  {
    id: 'western-european',
    name: 'Europe occidentale',
    cultures: [
      'Allemande', 'Italienne', 'Espagnole', 'Anglaise',
      'Britannique', 'Romaine', 'Portugaise', 'Hollandaise', 'Belge',
      'Suisse', 'Autrichienne'
    ],
    description: 'Cultures d\'Europe occidentale'
  },
  {
    id: 'celtic-nordic',
    name: 'Celtique & Nordique',
    cultures: [
      'Celtique', 'Celtes', 'Irlandaise celtique', 'Viking', 'Scandinave', 'Grecque'
    ],
    description: 'Cultures celtiques et nordiques'
  },
  {
    id: 'eastern-european',
    name: 'Europe orientale',
    cultures: [
      'Russe', 'Polonaise', 'Bulgare', 'Roumaine', 'Hongroise',
      'Tchèque', 'Slovaque', 'Serbe', 'Croate'
    ],
    description: 'Cultures d\'Europe orientale'
  },
  {
    id: 'east-asian',
    name: 'Asie de l\'Est',
    cultures: [
      'Chinoise', 'Japonaise', 'Coréenne', 'Mongole', 'Tibétaine'
    ],
    description: 'Cultures d\'Asie orientale'
  },
  {
    id: 'south-asian',
    name: 'Asie du Sud',
    cultures: [
      'Indienne', 'Birmane', 'Thaïlandaise', 'Vietnamienne', 'Cambodgienne',
      'Laotienne', 'Sri Lankaise', 'Népalaise', 'Bhoutanaise'
    ],
    description: 'Cultures d\'Asie du Sud et du Sud-Est'
  },
  {
    id: 'southeast-asian',
    name: 'Asie du Sud-Est',
    cultures: [
      'Indonésienne', 'Malaisienne', 'Philippine', 'Thaïlandaise',
      'Vietnamienne', 'Birmane', 'Cambodgienne'
    ],
    description: 'Cultures d\'Asie du Sud-Est'
  },
  {
    id: 'middle-eastern',
    name: 'Moyen-Orient',
    cultures: [
      'Arabe', 'Perse', 'Iranienne', 'Turque', 'Hébraïque',
      'Israélienne', 'Libanaise', 'Syrienne', 'Irakienne'
    ],
    description: 'Cultures du Moyen-Orient'
  },
  {
    id: 'north-african',
    name: 'Afrique du Nord & Égypte ancienne',
    cultures: [
      'Égyptienne', 'Égypte ancienne', 'Égypte antique', 'Ancienne Égypte',
      'Marocaine', 'Tunisienne', 'Algérienne', 'Libyenne'
    ],
    description: 'Cultures d\'Afrique du Nord et Égypte ancienne'
  },
  {
    id: 'sub-saharan',
    name: 'Afrique subsaharienne',
    cultures: [
      'Akan', 'Ashanti', 'Bamana', 'Nigériane', 'Sud-Africaine', 'Malienne',
      'Sénégalaise', 'Éthiopienne', 'Kenyane', 'Tanzanienne'
    ],
    description: 'Cultures d\'Afrique subsaharienne'
  },
  {
    id: 'north-american',
    name: 'Amérique du Nord',
    cultures: [
      'Amérindienne', 'Canadienne', 'Américaine', 'Inuit'
    ],
    description: 'Cultures d\'Amérique du Nord'
  },
  {
    id: 'mesoamerican',
    name: 'Méso-Amérique',
    cultures: [
      'Maya', 'Aztèque', 'Mexicaine', 'Olmèque', 'Zapotèque'
    ],
    description: 'Cultures de Méso-Amérique'
  },
  {
    id: 'south-american',
    name: 'Amérique du Sud',
    cultures: [
      'Inca', 'Brésilienne', 'Argentine', 'Chilienne', 'Péruvienne',
      'Colombienne', 'Vénézuélienne', 'Équatorienne'
    ],
    description: 'Cultures d\'Amérique du Sud'
  },
  {
    id: 'oceanic',
    name: 'Océanie',
    cultures: [
      'Aborigènes d\'Australie', 'Aborigène australienne', 'Australienne', 'Néo-Zélandaise',
      'Maori', 'Polynésienne', 'Mélanésienne', 'Micronésienne'
    ],
    description: 'Cultures d\'Océanie'
  },
  {
    id: 'religious-spiritual',
    name: 'Traditions religieuses & spirituelles',
    cultures: [
      'Bouddhisme', 'Hindouisme', 'Druidisme moderne', 'Néo-druidisme'
    ],
    description: 'Traditions religieuses et spirituelles transculturelles'
  },
  {
    id: 'ancient-civilizations',
    name: 'Civilisations antiques',
    cultures: [
      'Civilisation Inca', 'Civilisation Maya', 'Civilisation minoenne', 'Culture Moche',
      'Empire Ottoman', 'Culture turco-persane', 'Cultures préhistoriques'
    ],
    description: 'Grandes civilisations antiques'
  }
];

/**
 * Trouve la famille culturelle pour une culture donnée
 */
export function getCultureFamilyForCulture(culture: string): CultureFamily | null {
  if (!culture) return null;
  
  const cultureLower = culture.toLowerCase();
  
  return CULTURE_FAMILIES.find(family => 
    family.cultures.some(c => {
      const cLower = c.toLowerCase();
      
      // Correspondance exacte
      if (cLower === cultureLower) return true;
      
      // Correspondance avec parenthèses (ex: "Akan (peuple du Ghana)" correspond à "Akan")
      if (cultureLower.startsWith(cLower + ' (') || cultureLower.startsWith(cLower + '(')) return true;
      
      // Correspondance partielle bidirectionnelle
      if (cultureLower.includes(cLower) || cLower.includes(cultureLower)) return true;
      
      // Correspondance pour les variantes (ex: "Égypte ancienne" correspond à "Égyptienne")
      const baseWords = cLower.split(' ')[0];
      const cultureBaseWords = cultureLower.split(' ')[0];
      if (baseWords.length > 3 && cultureBaseWords.length > 3) {
        if (baseWords.startsWith(cultureBaseWords.slice(0, 4)) || 
            cultureBaseWords.startsWith(baseWords.slice(0, 4))) return true;
      }
      
      return false;
    })
  ) || null;
}

/**
 * Obtient toutes les cultures d'une famille
 */
export function getCulturesForFamily(familyId: string): string[] {
  const family = CULTURE_FAMILIES.find(f => f.id === familyId);
  return family?.cultures || [];
}

/**
 * Groupe les symboles par famille culturelle
 */
export function groupSymbolsByCultureFamily(symbols: Array<{ culture: string }>): Record<string, any[]> {
  const groupedByFamily: Record<string, any[]> = {};
  
  // Initialiser tous les groupes
  CULTURE_FAMILIES.forEach(family => {
    groupedByFamily[family.id] = [];
  });
  
  // Autres (symboles sans famille identifiée)
  groupedByFamily['other'] = [];
  
  symbols.forEach(symbol => {
    const family = getCultureFamilyForCulture(symbol.culture);
    if (family) {
      groupedByFamily[family.id].push(symbol);
    } else {
      groupedByFamily['other'].push(symbol);
    }
  });
  
  return groupedByFamily;
}

/**
 * Filtre les symboles par famille culturelle
 */
export function filterSymbolsByCultureFamily(
  symbols: Array<{ culture: string }>, 
  familyId: string
): Array<{ culture: string }> {
  if (familyId === 'all') return symbols;
  
  const familyCultures = getCulturesForFamily(familyId);
  
  return symbols.filter(symbol => {
    if (!symbol.culture) return familyId === 'other';
    
    return familyCultures.some(familyCulture => 
      familyCulture.toLowerCase() === symbol.culture.toLowerCase() ||
      symbol.culture.toLowerCase().includes(familyCulture.toLowerCase()) ||
      familyCulture.toLowerCase().includes(symbol.culture.toLowerCase())
    );
  });
}