/**
 * Utility pour regrouper les périodes historiques en grandes époques
 */

export interface PeriodGroup {
  id: string;
  name: string;
  periods: string[];
  description?: string;
  dateRange?: {
    start: number;
    end: number;
  };
}

// Classification internationale selon les standards académiques UNESCO/Three-Age System
export const PERIOD_GROUPS: PeriodGroup[] = [
  {
    id: 'prehistory',
    name: 'Préhistoire',
    periods: [
      'Préhistoire', 'Paléolithique', 'Mésolithique', 'Néolithique', 
      'Âge de Pierre', 'Âge du Bronze', 'Âge du Fer', 'Protohistoire', 
      'Cultures préhistoriques'
    ],
    description: 'Période avant l\'invention de l\'écriture (-3500 av. J.-C.)',
    dateRange: { start: -3000000, end: -3500 }
  },
  {
    id: 'antiquity',
    name: 'Antiquité',
    periods: [
      'Antiquité', 'Antiquité égyptienne', 'Antiquité grecque', 'Antiquité romaine',
      'Empire romain', 'Grèce antique', 'Égypte ancienne', 'Ancienne Égypte',
      'Égypte antique', 'Mésopotamie', 'Perse antique', 'Chine antique', 
      'Inde ancienne', 'Gojoseon', '-500 à 500',
      'Ier siècle', 'IIe siècle', 'IIIe siècle', 'IVe siècle', 'Ve siècle'
    ],
    description: 'De l\'invention de l\'écriture à la chute de l\'Empire romain d\'Occident (-3500 à 476)',
    dateRange: { start: -3500, end: 476 }
  },
  {
    id: 'middle-ages',
    name: 'Moyen Âge',
    periods: [
      'Moyen Âge', 'Époque médiévale', 'Haut Moyen Âge', 'Bas Moyen Âge',
      'Empire byzantin', 'Vikings', 'Époque carolingienne', '500-1500',
      'VIe siècle', 'VIIe siècle', 'VIIIe siècle', 'IXe siècle', 'Xe siècle',
      'XIe siècle', 'XIIe siècle', 'XIIIe siècle', 'XIVe siècle', 'XVe siècle'
    ],
    description: 'De la chute de l\'Empire romain à la découverte de l\'Amérique (476-1492)',
    dateRange: { start: 476, end: 1492 }
  },
  {
    id: 'early-modern',
    name: 'Époque moderne',
    periods: [
      'Renaissance', 'XVIe siècle', 'XVIIe siècle', 'XVIIIe siècle',
      'Époque moderne', 'Baroque', 'Classique', 'Siècle des Lumières',
      'Ancien Régime', '1500-1800'
    ],
    description: 'De la Renaissance à la Révolution française (1492-1789)',
    dateRange: { start: 1492, end: 1789 }
  },
  {
    id: 'contemporary',
    name: 'Époque contemporaine',
    periods: [
      'XIXe siècle', 'XXe siècle', 'XXIe siècle', 'Époque contemporaine', 
      'Époque industrielle', 'Révolution industrielle', 'Révolution française',
      'Empire', 'Époque victorienne', 'Belle Époque', 'Moderne',
      'Art moderne', 'Postmoderne', '1800-1914', '1800-1900', '1900-présent', 
      'Contemporain', 'Actuel', 'Récent'
    ],
    description: 'De la Révolution française à nos jours (1789-présent)',
    dateRange: { start: 1789, end: new Date().getFullYear() }
  }
];

/**
 * Mapping des siècles romains vers leurs équivalents numériques pour la classification
 */
const CENTURY_TO_NUMBER: Record<string, number> = {
  'ier': 1, 'iie': 2, 'iiie': 3, 'ive': 4, 've': 5,
  'vie': 6, 'viie': 7, 'viiie': 8, 'ixe': 9, 'xe': 10,
  'xie': 11, 'xiie': 12, 'xiiie': 13, 'xive': 14, 'xve': 15,
  'xvie': 16, 'xviie': 17, 'xviiie': 18, 'xixe': 19, 'xxe': 20, 'xxie': 21
};

/**
 * Trouve le groupe de période selon la classification internationale académique
 */
export function getPeriodGroupForPeriod(period: string): PeriodGroup | null {
  if (!period) return null;
  
  const periodLower = period.toLowerCase().trim();
  
  // 1. Gestion intelligente des périodes multi-séculaires
  if (periodLower.includes('-') && periodLower.includes('siècle')) {
    const centuryMatches = periodLower.match(/(ier|iie|iiie|ive|ve|vie|viie|viiie|ixe|xe|xie|xiie|xiiie|xive|xve|xvie|xviie|xviiie|xixe|xxe|xxie)\s*siècle/g);
    
    if (centuryMatches && centuryMatches.length > 0) {
      // Extraire le premier siècle (le plus ancien) pour la classification
      const firstCenturyString = centuryMatches[0].replace(/\s*siècle/, '');
      const firstCenturyNumber = CENTURY_TO_NUMBER[firstCenturyString];
      
      if (firstCenturyNumber) {
        // Classification selon les standards académiques internationaux
        if (firstCenturyNumber <= 5) return PERIOD_GROUPS.find(g => g.id === 'antiquity') || null;
        if (firstCenturyNumber <= 15) return PERIOD_GROUPS.find(g => g.id === 'middle-ages') || null;
        if (firstCenturyNumber <= 18) return PERIOD_GROUPS.find(g => g.id === 'early-modern') || null;
        return PERIOD_GROUPS.find(g => g.id === 'contemporary') || null;
      }
    }
  }

  // 2. Classification directe par siècle individuel
  const singleCenturyMatch = periodLower.match(/^(ier|iie|iiie|ive|ve|vie|viie|viiie|ixe|xe|xie|xiie|xiiie|xive|xve|xvie|xviie|xviiie|xixe|xxe|xxie)\s*siècle$/);
  if (singleCenturyMatch) {
    const centuryNumber = CENTURY_TO_NUMBER[singleCenturyMatch[1]];
    if (centuryNumber) {
      if (centuryNumber <= 5) return PERIOD_GROUPS.find(g => g.id === 'antiquity') || null;
      if (centuryNumber <= 15) return PERIOD_GROUPS.find(g => g.id === 'middle-ages') || null;
      if (centuryNumber <= 18) return PERIOD_GROUPS.find(g => g.id === 'early-modern') || null;
      return PERIOD_GROUPS.find(g => g.id === 'contemporary') || null;
    }
  }

  // 3. Correspondance exacte prioritaire
  for (const group of PERIOD_GROUPS) {
    if (group.periods.some(p => p.toLowerCase() === periodLower)) {
      return group;
    }
  }
  
  // 4. Correspondance par inclusion (plus conservatrice)
  for (const group of PERIOD_GROUPS) {
    if (group.periods.some(p => {
      const pLower = p.toLowerCase();
      return periodLower.includes(pLower) || pLower.includes(periodLower);
    })) {
      return group;
    }
  }
  
  return null;
}

/**
 * Obtient toutes les périodes d'un groupe
 */
export function getPeriodsForGroup(groupId: string): string[] {
  const group = PERIOD_GROUPS.find(g => g.id === groupId);
  return group?.periods || [];
}

/**
 * Groupe les symboles par époque
 */
export function groupSymbolsByPeriod(symbols: Array<{ period: string }>): Record<string, any[]> {
  const groupedByPeriod: Record<string, any[]> = {};
  
  // Initialiser tous les groupes
  PERIOD_GROUPS.forEach(group => {
    groupedByPeriod[group.id] = [];
  });
  
  // Autres (symboles sans période identifiée)
  groupedByPeriod['other'] = [];
  
  symbols.forEach(symbol => {
    const group = getPeriodGroupForPeriod(symbol.period);
    if (group) {
      groupedByPeriod[group.id].push(symbol);
    } else {
      groupedByPeriod['other'].push(symbol);
    }
  });
  
  return groupedByPeriod;
}

/**
 * Filtre les symboles par groupe de période
 */
export function filterSymbolsByPeriodGroup(
  symbols: Array<{ period: string }>, 
  groupId: string
): Array<{ period: string }> {
  if (groupId === 'all') return symbols;
  
  const groupPeriods = getPeriodsForGroup(groupId);
  
  return symbols.filter(symbol => {
    if (!symbol.period) return groupId === 'other';
    
    return groupPeriods.some(groupPeriod => 
      groupPeriod.toLowerCase() === symbol.period.toLowerCase() ||
      symbol.period.toLowerCase().includes(groupPeriod.toLowerCase()) ||
      groupPeriod.toLowerCase().includes(symbol.period.toLowerCase())
    );
  });
}