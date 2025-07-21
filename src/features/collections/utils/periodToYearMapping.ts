/**
 * Utilitaires pour mapper les périodes culturelles vers des années approximatives
 */

export interface PeriodMappingResult {
  year: number;
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Mappe une période vers une année approximative en fonction de la culture
 */
export function mapPeriodToYear(
  period: string, 
  culture: string = 'unknown', 
  index: number = 0
): PeriodMappingResult {
  const periodLower = period.toLowerCase();
  const cultureLower = culture.toLowerCase();
  
  // 1. Chercher une année explicite d'abord
  const yearMatch = period.match(/(\d{4})/);
  if (yearMatch) {
    return { year: parseInt(yearMatch[1]), confidence: 'high' };
  }

  // 2. Chercher des siècles romains
  const romanCenturyMatch = period.match(/(x+i*)(e|ème)\s*(siècle|s\.)/i);
  if (romanCenturyMatch) {
    const romanNumeral = romanCenturyMatch[1].toUpperCase();
    const century = convertRomanToNumber(romanNumeral);
    if (century > 0) {
      const year = (century - 1) * 100 + 50; // Milieu du siècle
      return { year, confidence: 'high' };
    }
  }

  // 3. Mapping spécifique par culture
  if (cultureLower.includes('egypt') || cultureLower.includes('égypt')) {
    return mapEgyptianPeriod(periodLower, index);
  }
  
  if (cultureLower.includes('grec') || cultureLower.includes('greek')) {
    return mapGreekPeriod(periodLower, index);
  }
  
  if (cultureLower.includes('rom') || cultureLower.includes('latin')) {
    return mapRomanPeriod(periodLower, index);
  }
  
  if (cultureLower.includes('france') || cultureLower.includes('français')) {
    return mapFrenchPeriod(periodLower, index);
  }

  if (cultureLower.includes('chin') || cultureLower.includes('chinese')) {
    return mapChinesePeriod(periodLower, index);
  }

  if (cultureLower.includes('japan') || cultureLower.includes('japonais')) {
    return mapJapanesePeriod(periodLower, index);
  }

  // 4. Mapping générique pour les périodes historiques communes
  return mapGenericPeriod(periodLower, index);
}

function convertRomanToNumber(roman: string): number {
  const romanNumerals: { [key: string]: number } = {
    'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10,
    'XI': 11, 'XII': 12, 'XIII': 13, 'XIV': 14, 'XV': 15, 'XVI': 16, 'XVII': 17, 'XVIII': 18, 'XIX': 19, 'XX': 20,
    'XXI': 21
  };
  return romanNumerals[roman] || 0;
}

function mapEgyptianPeriod(period: string, index: number): PeriodMappingResult {
  if (period.includes('prédynastique')) return { year: -3500 + (index * 100), confidence: 'medium' };
  if (period.includes('ancien empire')) return { year: -2686 + (index * 50), confidence: 'high' };
  if (period.includes('moyen empire')) return { year: -2055 + (index * 50), confidence: 'high' };
  if (period.includes('nouvel empire')) return { year: -1550 + (index * 50), confidence: 'high' };
  if (period.includes('basse époque')) return { year: -664 + (index * 30), confidence: 'high' };
  if (period.includes('ptolémaïque')) return { year: -332 + (index * 20), confidence: 'high' };
  
  return { year: -2000 + (index * 100), confidence: 'low' };
}

function mapGreekPeriod(period: string, index: number): PeriodMappingResult {
  if (period.includes('archaïque')) return { year: -800 + (index * 30), confidence: 'high' };
  if (period.includes('classique')) return { year: -480 + (index * 20), confidence: 'high' };
  if (period.includes('hellénistique')) return { year: -323 + (index * 20), confidence: 'high' };
  if (period.includes('mycénien')) return { year: -1600 + (index * 50), confidence: 'medium' };
  if (period.includes('minoenne')) return { year: -2700 + (index * 100), confidence: 'medium' };
  
  return { year: -500 + (index * 50), confidence: 'low' };
}

function mapRomanPeriod(period: string, index: number): PeriodMappingResult {
  if (period.includes('royauté')) return { year: -753 + (index * 30), confidence: 'high' };
  if (period.includes('république')) return { year: -509 + (index * 40), confidence: 'high' };
  if (period.includes('haut empire')) return { year: -27 + (index * 30), confidence: 'high' };
  if (period.includes('bas empire')) return { year: 235 + (index * 20), confidence: 'high' };
  if (period.includes('empire')) return { year: 50 + (index * 40), confidence: 'medium' };
  
  return { year: -100 + (index * 100), confidence: 'low' };
}

function mapFrenchPeriod(period: string, index: number): PeriodMappingResult {
  if (period.includes('gaulois') || period.includes('gaul')) return { year: -200 + (index * 30), confidence: 'high' };
  if (period.includes('gallo-romain')) return { year: 50 + (index * 50), confidence: 'high' };
  if (period.includes('mérovingien')) return { year: 500 + (index * 30), confidence: 'high' };
  if (period.includes('carolingien')) return { year: 800 + (index * 20), confidence: 'high' };
  if (period.includes('capétien')) return { year: 1000 + (index * 30), confidence: 'high' };
  if (period.includes('renaissance')) return { year: 1500 + (index * 15), confidence: 'high' };
  if (period.includes('moderne')) return { year: 1600 + (index * 20), confidence: 'medium' };
  if (period.includes('révolution')) return { year: 1789 + (index * 5), confidence: 'high' };
  if (period.includes('empire')) return { year: 1804 + (index * 10), confidence: 'high' };
  
  return mapGenericPeriod(period, index);
}

function mapChinesePeriod(period: string, index: number): PeriodMappingResult {
  if (period.includes('shang')) return { year: -1600 + (index * 50), confidence: 'high' };
  if (period.includes('zhou')) return { year: -1046 + (index * 100), confidence: 'high' };
  if (period.includes('qin')) return { year: -221 + (index * 5), confidence: 'high' };
  if (period.includes('han')) return { year: -206 + (index * 40), confidence: 'high' };
  if (period.includes('tang')) return { year: 618 + (index * 30), confidence: 'high' };
  if (period.includes('song')) return { year: 960 + (index * 30), confidence: 'high' };
  if (period.includes('ming')) return { year: 1368 + (index * 20), confidence: 'high' };
  if (period.includes('qing')) return { year: 1644 + (index * 20), confidence: 'high' };
  
  return { year: 500 + (index * 100), confidence: 'low' };
}

function mapJapanesePeriod(period: string, index: number): PeriodMappingResult {
  if (period.includes('jomon')) return { year: -14000 + (index * 1000), confidence: 'medium' };
  if (period.includes('yayoi')) return { year: -300 + (index * 50), confidence: 'high' };
  if (period.includes('kofun')) return { year: 300 + (index * 30), confidence: 'high' };
  if (period.includes('asuka')) return { year: 538 + (index * 15), confidence: 'high' };
  if (period.includes('nara')) return { year: 710 + (index * 10), confidence: 'high' };
  if (period.includes('heian')) return { year: 794 + (index * 30), confidence: 'high' };
  if (period.includes('kamakura')) return { year: 1185 + (index * 15), confidence: 'high' };
  if (period.includes('muromachi')) return { year: 1336 + (index * 20), confidence: 'high' };
  if (period.includes('edo')) return { year: 1603 + (index * 20), confidence: 'high' };
  if (period.includes('meiji')) return { year: 1868 + (index * 5), confidence: 'high' };
  
  return { year: 1000 + (index * 100), confidence: 'low' };
}

function mapGenericPeriod(period: string, index: number): PeriodMappingResult {
  // Périodes historiques génériques
  if (period.includes('préhistoire') || period.includes('paléolithique')) {
    return { year: -10000 + (index * 1000), confidence: 'low' };
  }
  
  if (period.includes('néolithique')) {
    return { year: -8000 + (index * 500), confidence: 'medium' };
  }
  
  if (period.includes('âge du bronze')) {
    return { year: -3000 + (index * 200), confidence: 'medium' };
  }
  
  if (period.includes('âge du fer')) {
    return { year: -1200 + (index * 100), confidence: 'medium' };
  }
  
  if (period.includes('antiquité')) {
    return { year: -500 + (index * 100), confidence: 'medium' };
  }
  
  if (period.includes('haut moyen âge') || period.includes('haut moyen-âge')) {
    return { year: 500 + (index * 50), confidence: 'medium' };
  }
  
  if (period.includes('moyen âge') || period.includes('moyen-âge') || period.includes('médiéval')) {
    return { year: 1000 + (index * 50), confidence: 'medium' };
  }
  
  if (period.includes('renaissance')) {
    return { year: 1500 + (index * 20), confidence: 'medium' };
  }
  
  if (period.includes('moderne') || period.includes('époque moderne')) {
    return { year: 1600 + (index * 30), confidence: 'medium' };
  }
  
  if (period.includes('contemporain') || period.includes('époque contemporaine')) {
    return { year: 1800 + (index * 20), confidence: 'medium' };
  }

  // Guerres spécifiques
  if (period.includes('première guerre') || period.includes('grande guerre')) {
    return { year: 1914 + (index * 2), confidence: 'high' };
  }
  
  if (period.includes('seconde guerre') || period.includes('guerre mondiale')) {
    return { year: 1939 + (index * 2), confidence: 'high' };
  }

  // Par défaut, distribution étalée
  const baseYears = [-1000, -500, 0, 500, 1000, 1500, 1800, 1950];
  return { 
    year: baseYears[index % baseYears.length] || (1000 + index * 100), 
    confidence: 'low' 
  };
}