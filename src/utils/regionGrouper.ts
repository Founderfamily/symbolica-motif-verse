/**
 * Utility pour regrouper les pays en grandes régions géographiques
 */

export interface Region {
  id: string;
  name: string;
  countries: string[];
}

export const REGIONS: Region[] = [
  {
    id: 'europe',
    name: 'Europe',
    countries: [
      'France', 'Allemagne', 'Italie', 'Espagne', 'Royaume-Uni', 'Angleterre',
      'Grèce', 'Europe Celtique', 'Scandinavie', 'Russie', 'Pologne',
      'Portugal', 'Pays-Bas', 'Belgique', 'Suisse', 'Autriche'
    ]
  },
  {
    id: 'asia',
    name: 'Asie',
    countries: [
      'Chine', 'Japon', 'Inde', 'Thaïlande', 'Vietnam', 'Corée',
      'Mongolie', 'Tibet', 'Myanmar', 'Indonésie', 'Malaisie',
      'Philippines', 'Iran', 'Monde Arabe', 'Turquie'
    ]
  },
  {
    id: 'africa',
    name: 'Afrique',
    countries: [
      'Ghana', 'Égypte', 'Maroc', 'Tunisie', 'Algérie', 'Éthiopie',
      'Nigeria', 'Afrique du Sud', 'Mali', 'Sénégal'
    ]
  },
  {
    id: 'americas',
    name: 'Amériques',
    countries: [
      'Amérique du Nord', 'Méso-Amérique', 'Mexique', 'Pérou',
      'Brésil', 'Canada', 'États-Unis', 'Argentine', 'Chili',
      'Colombie'
    ]
  },
  {
    id: 'oceania',
    name: 'Océanie',
    countries: [
      'Australie', 'Nouvelle-Zélande', 'Polynésie', 'Mélanésie', 'Micronésie'
    ]
  },
  {
    id: 'global',
    name: 'Global/Universel',
    countries: ['Universelle', 'Globale', 'Internationale']
  }
];

/**
 * Trouve la région d'un pays donné
 */
export function getRegionForCountry(country: string): Region | null {
  return REGIONS.find(region => 
    region.countries.some(c => 
      c.toLowerCase() === country.toLowerCase() ||
      country.toLowerCase().includes(c.toLowerCase()) ||
      c.toLowerCase().includes(country.toLowerCase())
    )
  ) || null;
}

/**
 * Obtient tous les pays d'une région
 */
export function getCountriesForRegion(regionId: string): string[] {
  const region = REGIONS.find(r => r.id === regionId);
  return region?.countries || [];
}

/**
 * Groupe les symboles par région
 */
export function groupSymbolsByRegion(symbols: Array<{ culture: string }>): Record<string, any[]> {
  const { extractCountryFromCulture } = require('@/utils/countryExtractor');
  const groupedByRegion: Record<string, any[]> = {};
  
  // Initialiser tous les groupes
  REGIONS.forEach(region => {
    groupedByRegion[region.id] = [];
  });
  
  // Autres (symboles sans région identifiée)
  groupedByRegion['other'] = [];
  
  symbols.forEach(symbol => {
    const country = extractCountryFromCulture(symbol.culture);
    if (country) {
      const region = getRegionForCountry(country);
      if (region) {
        groupedByRegion[region.id].push(symbol);
      } else {
        groupedByRegion['other'].push(symbol);
      }
    } else {
      groupedByRegion['other'].push(symbol);
    }
  });
  
  return groupedByRegion;
}

/**
 * Filtre les symboles par région
 */
export function filterSymbolsByRegion(
  symbols: Array<{ culture: string }>, 
  regionId: string
): Array<{ culture: string }> {
  if (regionId === 'all') return symbols;
  
  const { extractCountryFromCulture } = require('@/utils/countryExtractor');
  const regionCountries = getCountriesForRegion(regionId);
  
  return symbols.filter(symbol => {
    const country = extractCountryFromCulture(symbol.culture);
    if (!country) return regionId === 'other';
    
    return regionCountries.some(regionCountry => 
      regionCountry.toLowerCase() === country.toLowerCase() ||
      country.toLowerCase().includes(regionCountry.toLowerCase()) ||
      regionCountry.toLowerCase().includes(country.toLowerCase())
    );
  });
}