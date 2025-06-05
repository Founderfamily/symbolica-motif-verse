import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useCollections } from '../../hooks/useCollections';
import { useTranslation } from '@/i18n/useTranslation';
import { Skeleton } from '@/components/ui/skeleton';
import { CollectionWithTranslations } from '../../types/collections';
import { useCollectionFilters } from '../../hooks/useCollectionFilters';
import { CollectionControls } from '../controls/CollectionControls';
import { FilteredCollectionGrid } from '../grids/FilteredCollectionGrid';

// Static collection type
interface StaticCollection {
  id: string;
  slug: string;
  title: string;
  description: string;
  is_featured: boolean;
  created_at?: string;
}

// Union type for collections
type UnifiedCollection = CollectionWithTranslations | StaticCollection;

// Type guard to check if collection is static
const isStaticCollection = (collection: UnifiedCollection): collection is StaticCollection => {
  return 'title' in collection && typeof collection.title === 'string';
};

// Static collections data function
const getStaticCollections = (currentLanguage: string): StaticCollection[] => [
  {
    id: '1',
    slug: 'geometrie-sacree',
    title: currentLanguage === 'fr' ? 'Géométrie Sacrée' : 'Sacred Geometry',
    description: currentLanguage === 'fr' 
      ? 'Explorez les motifs géométriques sacrés à travers les cultures : mandalas, spirales dorées, fractales naturelles.'
      : 'Explore sacred geometric patterns across cultures: mandalas, golden spirals, natural fractals.',
    is_featured: true,
    created_at: '2024-01-01'
  },
  {
    id: '2', 
    slug: 'mysteres-anciens',
    title: currentLanguage === 'fr' ? 'Mystères Anciens' : 'Ancient Mysteries',
    description: currentLanguage === 'fr'
      ? 'Découvrez les symboles énigmatiques des civilisations perdues et leurs significations cachées.'
      : 'Discover the enigmatic symbols of lost civilizations and their hidden meanings.',
    is_featured: true,
    created_at: '2024-01-02'
  },
  {
    id: '3',
    slug: 'mythologies-mondiales', 
    title: currentLanguage === 'fr' ? 'Mythologies Mondiales' : 'World Mythologies',
    description: currentLanguage === 'fr'
      ? 'Plongez dans l\'univers des créatures mythiques et des divinités à travers les cultures du monde.'
      : 'Dive into the universe of mythical creatures and deities across world cultures.',
    is_featured: false,
    created_at: '2024-01-03'
  },
  {
    id: '4',
    slug: 'ere-numerique',
    title: currentLanguage === 'fr' ? 'Ère Numérique' : 'Digital Era',
    description: currentLanguage === 'fr'
      ? 'L\'évolution des symboles à l\'ère digitale : émojis, logos, iconographie moderne.'
      : 'The evolution of symbols in the digital age: emojis, logos, modern iconography.',
    is_featured: false,
    created_at: '2024-01-04'
  },
  {
    id: '5',
    slug: 'alchimie-esoterisme',
    title: currentLanguage === 'fr' ? 'Alchimie & Ésotérisme' : 'Alchemy & Esotericism',
    description: currentLanguage === 'fr'
      ? 'Les symboles hermétiques et alchimiques : pentagrammes, ouroboros, signes planétaires.'
      : 'Hermetic and alchemical symbols: pentagrams, ouroboros, planetary signs.',
    is_featured: false,
    created_at: '2024-01-05'
  },
  {
    id: '6',
    slug: 'art-religieux',
    title: currentLanguage === 'fr' ? 'Art Religieux' : 'Religious Art',
    description: currentLanguage === 'fr'
      ? 'Symboles sacrés des grandes traditions spirituelles : christianisme, islam, bouddhisme, hindouisme.'
      : 'Sacred symbols from major spiritual traditions: Christianity, Islam, Buddhism, Hinduism.',
    is_featured: false,
    created_at: '2024-01-06'
  }
];

// Skeleton de chargement
const CollectionsLoadingSkeleton: React.FC = React.memo(() => {
  return (
    <div className="space-y-8">
      <Skeleton className="h-12 w-full" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
});

CollectionsLoadingSkeleton.displayName = 'CollectionsLoadingSkeleton';

// Component principal
const CollectionCategories: React.FC = () => {
  const { currentLanguage } = useTranslation();
  const { data: collections = [], isLoading, error } = useCollections();

  const getTranslation = React.useCallback((collection: CollectionWithTranslations, field: string) => {
    if (!collection?.collection_translations) {
      return '';
    }

    // Find translation for current language first
    const currentTranslation = collection.collection_translations.find(
      (t: any) => t.language === currentLanguage
    );
    
    if (currentTranslation?.[field] && currentTranslation[field].trim()) {
      return currentTranslation[field];
    }
    
    // If current language translation is missing or empty, use fallback language
    const fallbackLang = currentLanguage === 'fr' ? 'en' : 'fr';
    const fallbackTranslation = collection.collection_translations.find(
      (t: any) => t.language === fallbackLang
    );
    
    if (fallbackTranslation?.[field] && fallbackTranslation[field].trim()) {
      return fallbackTranslation[field];
    }
    
    return '';
  }, [currentLanguage]);

  // Function to get title from any collection type
  const getCollectionTitle = React.useCallback((collection: UnifiedCollection) => {
    if (isStaticCollection(collection)) {
      return collection.title;
    }
    return getTranslation(collection, 'title');
  }, [getTranslation]);

  // Function to get description from any collection type
  const getCollectionDescription = React.useCallback((collection: UnifiedCollection) => {
    if (isStaticCollection(collection)) {
      return collection.description;
    }
    return getTranslation(collection, 'description');
  }, [getTranslation]);

  // Get static collections and ensure proper typing
  const staticCollections = React.useMemo(() => getStaticCollections(currentLanguage), [currentLanguage]);
  
  const hasValidCollections = collections && collections.length > 0;
  const finalCollections: UnifiedCollection[] = hasValidCollections ? collections : staticCollections;

  // Use filters hook
  const {
    sortBy,
    setSortBy,
    filterCategory,
    setFilterCategory,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    filteredAndSortedCollections,
    resetFilters,
    activeFiltersCount
  } = useCollectionFilters({ collections: finalCollections });

  // Loading state
  if (isLoading) {
    return <CollectionsLoadingSkeleton />;
  }

  // Error state - but still show static content
  if (error && !hasValidCollections) {
    console.warn('Collections API error, using static fallback:', error);
  }

  return (
    <div className="space-y-8">
      {/* Controls Section */}
      <CollectionControls
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        resetFilters={resetFilters}
        activeFiltersCount={activeFiltersCount}
        totalResults={filteredAndSortedCollections.length}
      />

      {/* Collections Grid */}
      <FilteredCollectionGrid
        collections={filteredAndSortedCollections}
        getCollectionTitle={getCollectionTitle}
        getCollectionDescription={getCollectionDescription}
      />

      {/* Call to Action for more collections */}
      <section className="text-center py-8 bg-slate-50 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">
          <I18nText translationKey="collections.discoverMore">Découvrez plus de collections</I18nText>
        </h3>
        <p className="text-slate-600 mb-6">
          <I18nText translationKey="collections.discoverMoreDescription">
            De nouvelles collections thématiques sont ajoutées régulièrement
          </I18nText>
        </p>
        <Link to="/symbols">
          <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
            <I18nText translationKey="collections.exploreSymbols">Explorer les Symboles</I18nText>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default CollectionCategories;
