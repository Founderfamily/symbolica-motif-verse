/**
 * Taxonomie mondiale standardisée conforme aux normes internationales
 * Base: UNESCO Cultural Heritage Standards + CIDOC-CRM + Dublin Core
 * Standards temporels: ISO 8601 + Three Age System
 */

// Types de base pour la taxonomie
export interface TaxonomyNode {
  id: string;
  code: string; // Code international standardisé
  label: Record<string, string>; // Multilingue
  description?: Record<string, string>;
  parent?: string;
  children?: string[];
  dateRange?: {
    start: number; // Année (négative pour av. J.-C.)
    end: number;
  };
  keywords: string[]; // Mots-clés pour la correspondance
  metadata?: {
    unescoBroaderTerm?: string;
    cidocCrmClass?: string;
    dublinCoreSubject?: string;
    authority?: string; // Source d'autorité (Getty, UNESCO, etc.)
  };
}

// ========================
// GÉOGRAPHIE ET CULTURES
// ========================
export const GEOGRAPHIC_CULTURAL_TAXONOMY: TaxonomyNode[] = [
  // EUROPE
  {
    id: 'EUR',
    code: 'EUR',
    label: { fr: 'Europe', en: 'Europe' },
    keywords: ['europe', 'european'],
    metadata: { unescoBroaderTerm: 'Europe', authority: 'UNESCO' }
  },
  {
    id: 'EUR-CEL',
    code: 'EUR-CEL',
    label: { fr: 'Cultures Celtiques', en: 'Celtic Cultures' },
    parent: 'EUR',
    keywords: ['celte', 'celtique', 'celtic', 'gaule', 'irlande', 'ecosse', 'bretagne', 'galles'],
    metadata: { unescoBroaderTerm: 'Celtic Culture' }
  },
  {
    id: 'EUR-GRE',
    code: 'EUR-GRE',
    label: { fr: 'Grèce Antique', en: 'Ancient Greece' },
    parent: 'EUR',
    keywords: ['grec', 'grece', 'hellénique', 'hellenistique', 'greece', 'greek'],
    dateRange: { start: -800, end: 146 },
    metadata: { unescoBroaderTerm: 'Ancient Greek Culture' }
  },
  {
    id: 'EUR-ROM',
    code: 'EUR-ROM',
    label: { fr: 'Empire Romain', en: 'Roman Empire' },
    parent: 'EUR',
    keywords: ['romain', 'rome', 'latin', 'roman', 'empire'],
    dateRange: { start: -753, end: 476 },
    metadata: { unescoBroaderTerm: 'Roman Culture' }
  },
  {
    id: 'EUR-FRA',
    code: 'EUR-FRA',
    label: { fr: 'France', en: 'France' },
    parent: 'EUR',
    keywords: ['france', 'français', 'french', 'gaule'],
    metadata: { authority: 'ISO 3166-1' }
  },

  // ASIE
  {
    id: 'ASI',
    code: 'ASI',
    label: { fr: 'Asie', en: 'Asia' },
    keywords: ['asie', 'asia', 'asian'],
    metadata: { unescoBroaderTerm: 'Asia', authority: 'UNESCO' }
  },
  {
    id: 'ASI-CHN',
    code: 'ASI-CHN',
    label: { fr: 'Chine', en: 'China' },
    parent: 'ASI',
    keywords: ['chine', 'chinois', 'china', 'chinese', 'han'],
    metadata: { authority: 'ISO 3166-1' }
  },
  {
    id: 'ASI-IND',
    code: 'ASI-IND',
    label: { fr: 'Inde', en: 'India' },
    parent: 'ASI',
    keywords: ['inde', 'indien', 'india', 'indian', 'hindou', 'hindu'],
    metadata: { authority: 'ISO 3166-1' }
  },
  {
    id: 'ASI-JPN',
    code: 'ASI-JPN',
    label: { fr: 'Japon', en: 'Japan' },
    parent: 'ASI',
    keywords: ['japon', 'japonais', 'japan', 'japanese', 'nippon'],
    metadata: { authority: 'ISO 3166-1' }
  },

  // AFRIQUE
  {
    id: 'AFR',
    code: 'AFR',
    label: { fr: 'Afrique', en: 'Africa' },
    keywords: ['afrique', 'africa', 'african'],
    metadata: { unescoBroaderTerm: 'Africa', authority: 'UNESCO' }
  },
  {
    id: 'AFR-EGY',
    code: 'AFR-EGY',
    label: { fr: 'Égypte Ancienne', en: 'Ancient Egypt' },
    parent: 'AFR',
    keywords: ['egypte', 'egyptien', 'egypt', 'egyptian', 'pharaon'],
    dateRange: { start: -3100, end: -30 },
    metadata: { unescoBroaderTerm: 'Ancient Egyptian Culture' }
  },

  // AMÉRIQUES
  {
    id: 'AME',
    code: 'AME',
    label: { fr: 'Amériques', en: 'Americas' },
    keywords: ['amerique', 'america', 'american'],
    metadata: { unescoBroaderTerm: 'Americas', authority: 'UNESCO' }
  },
  {
    id: 'AME-NAT',
    code: 'AME-NAT',
    label: { fr: 'Peuples Autochtones d\'Amérique', en: 'Indigenous American Peoples' },
    parent: 'AME',
    keywords: ['amerindien', 'autochtone', 'indigenous', 'native', 'tribal'],
    metadata: { unescoBroaderTerm: 'Indigenous Peoples' }
  },
  {
    id: 'AME-AZT',
    code: 'AME-AZT',
    label: { fr: 'Civilisation Aztèque', en: 'Aztec Civilization' },
    parent: 'AME',
    keywords: ['azteque', 'aztec', 'mexica', 'nahuatl'],
    dateRange: { start: 1345, end: 1521 },
    metadata: { unescoBroaderTerm: 'Mesoamerican Cultures' }
  },
  {
    id: 'AME-MAY',
    code: 'AME-MAY',
    label: { fr: 'Civilisation Maya', en: 'Maya Civilization' },
    parent: 'AME',
    keywords: ['maya', 'mayan', 'yucatan'],
    dateRange: { start: -2000, end: 1500 },
    metadata: { unescoBroaderTerm: 'Mesoamerican Cultures' }
  },

  // OCÉANIE
  {
    id: 'OCE',
    code: 'OCE',
    label: { fr: 'Océanie', en: 'Oceania' },
    keywords: ['oceanie', 'oceania'],
    metadata: { unescoBroaderTerm: 'Oceania', authority: 'UNESCO' }
  },
  {
    id: 'OCE-ABO',
    code: 'OCE-ABO',
    label: { fr: 'Peuples Aborigènes d\'Australie', en: 'Australian Aboriginal Peoples' },
    parent: 'OCE',
    keywords: ['aborigene', 'aboriginal', 'aborigines', 'australie'],
    metadata: { unescoBroaderTerm: 'Indigenous Peoples' }
  }
];

// ========================
// CHRONOLOGIE STANDARDISÉE
// ========================
export const TEMPORAL_TAXONOMY: TaxonomyNode[] = [
  {
    id: 'PRE',
    code: 'PRE',
    label: { fr: 'Préhistoire', en: 'Prehistory' },
    description: { 
      fr: 'Période avant l\'invention de l\'écriture', 
      en: 'Period before the invention of writing' 
    },
    dateRange: { start: -3000000, end: -3500 },
    keywords: ['prehistoire', 'prehistory', 'prehistoric', 'stone age', 'paleolithique', 'neolithique'],
    metadata: { 
      unescoBroaderTerm: 'Prehistory',
      authority: 'Three Age System'
    }
  },
  {
    id: 'ANT',
    code: 'ANT',
    label: { fr: 'Antiquité', en: 'Antiquity' },
    description: { 
      fr: 'De l\'invention de l\'écriture à la chute de l\'Empire romain d\'Occident', 
      en: 'From the invention of writing to the fall of the Western Roman Empire' 
    },
    dateRange: { start: -3500, end: 476 },
    keywords: ['antiquite', 'antiquity', 'ancient', 'classique', 'classical'],
    metadata: { 
      unescoBroaderTerm: 'Ancient Period',
      authority: 'UNESCO Periodization'
    }
  },
  {
    id: 'MED',
    code: 'MED',
    label: { fr: 'Moyen Âge', en: 'Middle Ages' },
    description: { 
      fr: 'De la chute de l\'Empire romain à la Renaissance', 
      en: 'From the fall of the Roman Empire to the Renaissance' 
    },
    dateRange: { start: 476, end: 1453 },
    keywords: ['moyen age', 'medieval', 'middle ages', 'byzantin', 'viking'],
    metadata: { 
      unescoBroaderTerm: 'Medieval Period',
      authority: 'UNESCO Periodization'
    }
  },
  {
    id: 'MOD',
    code: 'MOD',
    label: { fr: 'Époque Moderne', en: 'Early Modern Period' },
    description: { 
      fr: 'De la Renaissance aux révolutions démocratiques', 
      en: 'From the Renaissance to democratic revolutions' 
    },
    dateRange: { start: 1453, end: 1789 },
    keywords: ['moderne', 'modern', 'renaissance', 'baroque', 'classique'],
    metadata: { 
      unescoBroaderTerm: 'Early Modern Period',
      authority: 'UNESCO Periodization'
    }
  },
  {
    id: 'CON',
    code: 'CON',
    label: { fr: 'Époque Contemporaine', en: 'Contemporary Period' },
    description: { 
      fr: 'Des révolutions démocratiques à nos jours', 
      en: 'From democratic revolutions to present day' 
    },
    dateRange: { start: 1789, end: new Date().getFullYear() },
    keywords: ['contemporain', 'contemporary', 'moderne', 'actuel', 'recent'],
    metadata: { 
      unescoBroaderTerm: 'Contemporary Period',
      authority: 'UNESCO Periodization'
    }
  }
];

// ========================
// DOMAINES THÉMATIQUES
// ========================
export const THEMATIC_TAXONOMY: TaxonomyNode[] = [
  {
    id: 'REL',
    code: 'REL',
    label: { fr: 'Religions et Spiritualités', en: 'Religions and Spiritualities' },
    keywords: ['religion', 'spiritualite', 'divin', 'sacre', 'mystique', 'esoterisme'],
    metadata: { 
      dublinCoreSubject: 'Religion',
      unescoBroaderTerm: 'Religious Heritage'
    }
  },
  {
    id: 'REL-CHR',
    code: 'REL-CHR',
    label: { fr: 'Christianisme', en: 'Christianity' },
    parent: 'REL',
    keywords: ['christianisme', 'chretien', 'christian', 'catholique', 'orthodoxe', 'protestant'],
    metadata: { dublinCoreSubject: 'Christianity' }
  },
  {
    id: 'REL-HIN',
    code: 'REL-HIN',
    label: { fr: 'Hindouisme', en: 'Hinduism' },
    parent: 'REL',
    keywords: ['hindou', 'hinduism', 'vedique', 'sanskrit', 'dharma'],
    metadata: { dublinCoreSubject: 'Hinduism' }
  },
  {
    id: 'REL-BUD',
    code: 'REL-BUD',
    label: { fr: 'Bouddhisme', en: 'Buddhism' },
    parent: 'REL',
    keywords: ['bouddhisme', 'buddhism', 'bouddha', 'dharma', 'sangha'],
    metadata: { dublinCoreSubject: 'Buddhism' }
  },
  {
    id: 'REL-ISL',
    code: 'REL-ISL',
    label: { fr: 'Islam', en: 'Islam' },
    parent: 'REL',
    keywords: ['islam', 'musulman', 'islamic', 'arabe', 'calligraphie'],
    metadata: { dublinCoreSubject: 'Islam' }
  },
  {
    id: 'SCI',
    code: 'SCI',
    label: { fr: 'Sciences et Mathématiques', en: 'Sciences and Mathematics' },
    keywords: ['science', 'mathematique', 'geometrie', 'alchimie', 'astronomie'],
    metadata: { 
      dublinCoreSubject: 'Science',
      unescoBroaderTerm: 'Scientific Heritage'
    }
  },
  {
    id: 'SCI-GEO',
    code: 'SCI-GEO',
    label: { fr: 'Géométrie Sacrée', en: 'Sacred Geometry' },
    parent: 'SCI',
    keywords: ['geometrie', 'sacred geometry', 'mandala', 'fibonacci', 'proportion'],
    metadata: { dublinCoreSubject: 'Geometry' }
  },
  {
    id: 'SOC',
    code: 'SOC',
    label: { fr: 'Société et Pouvoir', en: 'Society and Power' },
    keywords: ['royal', 'imperial', 'noble', 'politique', 'social', 'heraldique'],
    metadata: { 
      dublinCoreSubject: 'Social Organization',
      unescoBroaderTerm: 'Social Heritage'
    }
  },
  {
    id: 'NAT',
    code: 'NAT',
    label: { fr: 'Nature et Cosmos', en: 'Nature and Cosmos' },
    keywords: ['nature', 'animal', 'vegetal', 'cosmos', 'etoile', 'lune', 'soleil'],
    metadata: { 
      dublinCoreSubject: 'Natural History',
      unescoBroaderTerm: 'Natural Heritage'
    }
  }
];

// ========================
// FONCTIONS UTILITAIRES
// ========================

/**
 * Trouve le nœud taxonomique correspondant à un terme donné
 */
export function findTaxonomyNode(term: string, taxonomy: TaxonomyNode[]): TaxonomyNode | null {
  if (!term) return null;
  
  const termLower = term.toLowerCase().trim();
  
  // Recherche exacte par label
  for (const node of taxonomy) {
    const labels = Object.values(node.label).map(l => l.toLowerCase());
    if (labels.includes(termLower)) {
      return node;
    }
  }
  
  // Recherche par mots-clés
  for (const node of taxonomy) {
    if (node.keywords.some(keyword => 
      termLower.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(termLower)
    )) {
      return node;
    }
  }
  
  return null;
}

/**
 * Normalise un terme culturel selon la taxonomie
 */
export function normalizeCulturalTerm(culture: string): { code: string; label: string } | null {
  const node = findTaxonomyNode(culture, GEOGRAPHIC_CULTURAL_TAXONOMY);
  return node ? { code: node.code, label: node.label.fr } : null;
}

/**
 * Normalise un terme temporel selon la taxonomie
 */
export function normalizeTemporalTerm(period: string): { code: string; label: string } | null {
  const node = findTaxonomyNode(period, TEMPORAL_TAXONOMY);
  return node ? { code: node.code, label: node.label.fr } : null;
}

/**
 * Normalise un terme thématique selon la taxonomie
 */
export function normalizeThematicTerm(theme: string): { code: string; label: string } | null {
  const node = findTaxonomyNode(theme, THEMATIC_TAXONOMY);
  return node ? { code: node.code, label: node.label.fr } : null;
}

/**
 * Obtient la taxonomie complète consolidée
 */
export function getFullTaxonomy(): TaxonomyNode[] {
  return [
    ...GEOGRAPHIC_CULTURAL_TAXONOMY,
    ...TEMPORAL_TAXONOMY,
    ...THEMATIC_TAXONOMY
  ];
}