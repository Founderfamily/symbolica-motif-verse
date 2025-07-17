/**
 * Utility pour regrouper les périodes historiques en grandes époques
 */

export interface PeriodGroup {
  id: string;
  name: string;
  periods: string[];
  description?: string;
}

export const PERIOD_GROUPS: PeriodGroup[] = [
  {
    id: 'prehistoric',
    name: 'Préhistoire & Protohistoire',
    periods: [
      'Préhistoire', 'Paléolithique', 'Néolithique', 'Âge de Pierre',
      'Âge du Bronze', 'Âge du Fer', 'Protohistoire', 'Cultures préhistoriques'
    ],
    description: 'Avant l\'écriture et périodes protohistoriques'
  },
  {
    id: 'antiquity',
    name: 'Antiquité',
    periods: [
      'Antiquité', 'Antiquité égyptienne', 'Antiquité grecque', 'Antiquité romaine',
      'Empire romain', 'Grèce antique', 'Égypte ancienne', 'Ancienne Égypte',
      'Égypte antique', 'Mésopotamie', 'Perse antique', 'Chine antique', 
      'Inde ancienne', 'Empire Ottoman', '-500 à 500', 'Gojoseon'
    ],
    description: 'Civilisations antiques jusqu\'à 500 ap. J.-C.'
  },
  {
    id: 'medieval',
    name: 'Moyen Âge',
    periods: [
      'Moyen Âge', 'Époque médiévale', 'Haut Moyen Âge', 'Bas Moyen Âge',
      'Empire byzantin', 'Vikings', 'Époque carolingienne', '500-1500',
      'XIe siècle', 'XIIe siècle', 'XIIIe siècle', 'XIVe siècle', 'XVe siècle'
    ],
    description: '500-1500 après J.-C.'
  },
  {
    id: 'renaissance',
    name: 'Renaissance & Époque moderne',
    periods: [
      'Renaissance', 'XVIe siècle', 'XVIIe siècle', 'XVIIIe siècle',
      'Époque moderne', 'Baroque', 'Classique', 'Siècle des Lumières',
      '1500-1800'
    ],
    description: '1500-1800'
  },
  {
    id: 'industrial',
    name: 'Époque industrielle',
    periods: [
      'XIXe siècle', 'Époque industrielle', 'Révolution industrielle',
      'Époque victorienne', 'Belle Époque', '1800-1914', '1800-1900'
    ],
    description: '1800-1914'
  },
  {
    id: 'contemporary',
    name: 'Époque contemporaine',
    periods: [
      'XXe siècle', 'XXIe siècle', 'Époque contemporaine', 'Moderne',
      'Art moderne', 'Postmoderne', '1900-présent', 'Contemporain',
      'Actuel', 'Récent'
    ],
    description: '1900 à aujourd\'hui'
  }
];

/**
 * Trouve le groupe de période pour une période donnée
 */
export function getPeriodGroupForPeriod(period: string): PeriodGroup | null {
  const periodLower = period.toLowerCase();
  
  // Gestion spéciale pour les périodes multi-séculaires (priorité à la période la plus ancienne)
  if (periodLower.includes('-') && periodLower.includes('siècle')) {
    // Extraire tous les siècles mentionnés et prendre le premier
    const centuryMatches = periodLower.match(/(xie|xiie|xiiie|xive|xve|xvie|xviie|xviiie|xixe|xxe|xxie)\s*siècle/g);
    if (centuryMatches && centuryMatches.length > 0) {
      const firstCentury = centuryMatches[0];
      // Chercher d'abord avec le premier siècle
      for (const group of PERIOD_GROUPS) {
        if (group.periods.some(p => p.toLowerCase() === firstCentury)) {
          return group;
        }
      }
    }
  }
  
  // Correspondance exacte en priorité
  for (const group of PERIOD_GROUPS) {
    if (group.periods.some(p => p.toLowerCase() === periodLower)) {
      return group;
    }
  }
  
  // Ensuite chercher les inclusions (plus conservateur)
  for (const group of PERIOD_GROUPS) {
    if (group.periods.some(p => {
      const pLower = p.toLowerCase();
      // Éviter les matches partiels problématiques pour les siècles
      if (pLower.includes('siècle') && periodLower.includes('siècle')) {
        return pLower === periodLower;
      }
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