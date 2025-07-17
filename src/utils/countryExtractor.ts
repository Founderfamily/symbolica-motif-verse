/**
 * Utility to extract country information from culture data
 */

// Mapping des cultures vers les pays
const CULTURE_TO_COUNTRY_MAP: Record<string, string> = {
  // Afrique
  'Akan (Ghana)': 'Ghana',
  'Égyptienne': 'Égypte',
  'Marocaine': 'Maroc',
  'Tunisienne': 'Tunisie',
  'Algérienne': 'Algérie',
  'Éthiopienne': 'Éthiopie',
  'Nigériane': 'Nigeria',
  'Sud-Africaine': 'Afrique du Sud',
  'Malienne': 'Mali',
  'Sénégalaise': 'Sénégal',
  
  // Europe
  'Française': 'France',
  'Allemande': 'Allemagne',
  'Italienne': 'Italie',
  'Espagnole': 'Espagne',
  'Anglaise': 'Angleterre',
  'Britannique': 'Royaume-Uni',
  'Grecque': 'Grèce',
  'Romaine': 'Italie',
  'Celtique': 'Europe Celtique',
  'Viking': 'Scandinavie',
  'Scandinave': 'Scandinavie',
  'Russe': 'Russie',
  'Polonaise': 'Pologne',
  'Portugaise': 'Portugal',
  'Hollandaise': 'Pays-Bas',
  'Belge': 'Belgique',
  'Suisse': 'Suisse',
  'Autrichienne': 'Autriche',
  
  // Asie
  'Chinoise': 'Chine',
  'Japonaise': 'Japon',
  'Indienne': 'Inde',
  'Thaïlandaise': 'Thaïlande',
  'Vietnamienne': 'Vietnam',
  'Coréenne': 'Corée',
  'Mongole': 'Mongolie',
  'Tibétaine': 'Tibet',
  'Birmane': 'Myanmar',
  'Indonésienne': 'Indonésie',
  'Malaisienne': 'Malaisie',
  'Philippine': 'Philippines',
  'Perse': 'Iran',
  'Iranienne': 'Iran',
  'Arabe': 'Monde Arabe',
  'Turque': 'Turquie',
  
  // Amériques
  'Amérindienne': 'Amérique du Nord',
  'Maya': 'Méso-Amérique',
  'Aztèque': 'Mexique',
  'Inca': 'Pérou',
  'Brésilienne': 'Brésil',
  'Mexicaine': 'Mexique',
  'Canadienne': 'Canada',
  'Américaine': 'États-Unis',
  'Argentine': 'Argentine',
  'Chilienne': 'Chili',
  'Péruvienne': 'Pérou',
  'Colombienne': 'Colombie',
  
  // Océanie
  'Aborigènes d\'Australie': 'Australie',
  'Australienne': 'Australie',
  'Néo-Zélandaise': 'Nouvelle-Zélande',
  'Maori': 'Nouvelle-Zélande',
  'Polynésienne': 'Polynésie',
  'Mélanésienne': 'Mélanésie',
  'Micronésienne': 'Micronésie',
};

// Mapping par mots-clés pour les cultures non exactes
const KEYWORD_TO_COUNTRY_MAP: Array<{ keywords: string[], country: string }> = [
  { keywords: ['ghana'], country: 'Ghana' },
  { keywords: ['égypt', 'egypt'], country: 'Égypte' },
  { keywords: ['france', 'français'], country: 'France' },
  { keywords: ['chine', 'china', 'chinois'], country: 'Chine' },
  { keywords: ['japon', 'japan', 'japonais'], country: 'Japon' },
  { keywords: ['inde', 'india', 'indien'], country: 'Inde' },
  { keywords: ['australie', 'australia', 'aborigène'], country: 'Australie' },
  { keywords: ['mexique', 'mexico', 'aztèque'], country: 'Mexique' },
  { keywords: ['pérou', 'peru', 'inca'], country: 'Pérou' },
  { keywords: ['grèce', 'greece', 'grec'], country: 'Grèce' },
  { keywords: ['italie', 'italy', 'rome', 'romain'], country: 'Italie' },
  { keywords: ['espagne', 'spain', 'espagnol'], country: 'Espagne' },
  { keywords: ['allemagne', 'germany', 'allemand'], country: 'Allemagne' },
  { keywords: ['angleterre', 'england', 'britain', 'anglais'], country: 'Royaume-Uni' },
  { keywords: ['russie', 'russia', 'russe'], country: 'Russie' },
  { keywords: ['maroc', 'morocco', 'marocain'], country: 'Maroc' },
  { keywords: ['brésil', 'brazil', 'brésilien'], country: 'Brésil' },
  { keywords: ['canada', 'canadien'], country: 'Canada' },
  { keywords: ['états-unis', 'usa', 'america', 'américain'], country: 'États-Unis' },
];

/**
 * Extrait le nom du pays à partir d'une culture donnée
 */
export function extractCountryFromCulture(culture: string): string | null {
  if (!culture) return null;
  
  // Recherche exacte dans le mapping
  if (CULTURE_TO_COUNTRY_MAP[culture]) {
    return CULTURE_TO_COUNTRY_MAP[culture];
  }
  
  // Extraire les pays entre parenthèses (ex: "Akan (peuple du Ghana et de Côte d'Ivoire)")
  const parenthesesMatch = culture.match(/\(([^)]*)\)/);
  if (parenthesesMatch) {
    const parenthesesContent = parenthesesMatch[1].toLowerCase();
    
    // Rechercher des pays spécifiques dans le contenu des parenthèses
    const countryPatterns = [
      { pattern: /ghana/, country: 'Ghana' },
      { pattern: /côte d'ivoire|cote d'ivoire/, country: 'Côte d\'Ivoire' },
      { pattern: /mali/, country: 'Mali' },
      { pattern: /sénégal/, country: 'Sénégal' },
      { pattern: /burkina faso/, country: 'Burkina Faso' },
      { pattern: /niger/, country: 'Niger' },
      { pattern: /guinée/, country: 'Guinée' },
      { pattern: /pérou/, country: 'Pérou' },
      { pattern: /crète/, country: 'Grèce' },
      { pattern: /france/, country: 'France' },
      { pattern: /bretagne|normandie/, country: 'France' },
      { pattern: /drôme|allier|auvergne/, country: 'France' },
      { pattern: /corée/, country: 'Corée' },
      { pattern: /inde/, country: 'Inde' },
      { pattern: /tibet/, country: 'Tibet' },
      { pattern: /australie/, country: 'Australie' },
      { pattern: /amérique du nord/, country: 'Amérique du Nord' }
    ];
    
    for (const { pattern, country } of countryPatterns) {
      if (pattern.test(parenthesesContent)) {
        return country;
      }
    }
  }
  
  // Recherche par mots-clés dans le texte principal
  const cultureLower = culture.toLowerCase();
  for (const mapping of KEYWORD_TO_COUNTRY_MAP) {
    if (mapping.keywords.some(keyword => cultureLower.includes(keyword))) {
      return mapping.country;
    }
  }
  
  // Recherche par régions françaises
  const frenchRegions = [
    'aquitaine', 'ardennes', 'bourbonnais', 'bourgogne', 'bretagne',
    'champagne', 'dauphiné', 'flandre', 'franche-comté', 'gascogne',
    'île-de-france', 'languedoc', 'lorraine', 'normandie', 'picardie',
    'poitou', 'provence', 'savoie'
  ];
  
  if (frenchRegions.some(region => cultureLower.includes(region))) {
    return 'France';
  }
  
  return null;
}

/**
 * Extrait tous les pays uniques à partir d'une liste de symboles
 */
export function extractUniqueCountries(symbols: Array<{ culture: string }>): string[] {
  const countries = new Set<string>();
  
  symbols.forEach(symbol => {
    const country = extractCountryFromCulture(symbol.culture);
    if (country) {
      countries.add(country);
    }
  });
  
  return Array.from(countries).sort();
}

/**
 * Filtre les symboles par pays
 */
export function filterSymbolsByCountry(
  symbols: Array<{ culture: string }>, 
  targetCountry: string
): Array<{ culture: string }> {
  return symbols.filter(symbol => {
    const country = extractCountryFromCulture(symbol.culture);
    return country === targetCountry;
  });
}