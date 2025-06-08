
import { InterestGroup } from '@/types/interest-groups';

// Sample data for testing
export const sampleGroups: InterestGroup[] = [
  {
    id: 'sample-1',
    name: 'Symboles Celtiques',
    slug: 'symboles-celtiques',
    description: 'Exploration des symboles et traditions celtiques anciennes',
    icon: null,
    banner_image: null,
    theme_color: '#2563eb',
    is_public: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 'system',
    members_count: 42,
    discoveries_count: 18,
    translations: {
      en: { name: 'Celtic Symbols', description: 'Exploration of ancient Celtic symbols and traditions' },
      fr: { name: 'Symboles Celtiques', description: 'Exploration des symboles et traditions celtiques anciennes' }
    }
  },
  {
    id: 'sample-2',
    name: 'Art Islamique',
    slug: 'art-islamique',
    description: 'Motifs géométriques et calligraphie dans l\'art islamique',
    icon: null,
    banner_image: null,
    theme_color: '#059669',
    is_public: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 'system',
    members_count: 67,
    discoveries_count: 34,
    translations: {
      en: { name: 'Islamic Art', description: 'Geometric patterns and calligraphy in Islamic art' },
      fr: { name: 'Art Islamique', description: 'Motifs géométriques et calligraphie dans l\'art islamique' }
    }
  }
];
