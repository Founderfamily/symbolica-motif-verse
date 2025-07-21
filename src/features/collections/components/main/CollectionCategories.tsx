
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Map, Layers, Star, BookOpen, Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { I18nText } from '@/components/ui/i18n-text';
import { useCollections } from '../../hooks/useCollections';
import { useTranslation } from '@/i18n/useTranslation';
import { Skeleton } from '@/components/ui/skeleton';
import { CollectionWithTranslations } from '../../types/collections';
import { useCollectionFilters } from '../../hooks/useCollectionFilters';
import { CollectionControls } from '../controls/CollectionControls';
import { FilteredCollectionGrid } from '../grids/FilteredCollectionGrid';
import { useCollectionTranslations } from '@/hooks/useCollectionTranslations';

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
  }
];

// Loading skeleton component
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

// Error state component
const CollectionsErrorState: React.FC<{ error: Error; retry: () => void }> = React.memo(({ error, retry }) => {
  return (
    <div className="text-center py-12">
      <div className="text-red-600 text-lg mb-4">
        <I18nText translationKey="collections.errorLoading">Erreur de chargement</I18nText>
      </div>
      <p className="text-slate-600 mb-4">
        {error.message}
      </p>
      <Button onClick={retry} variant="outline">
        <I18nText translationKey="collections.retry">Réessayer</I18nText>
      </Button>
    </div>
  );
});

CollectionsErrorState.displayName = 'CollectionsErrorState';

// Main component
const CollectionCategories: React.FC = () => {
  const { currentLanguage } = useTranslation();
  const { data: collections = [], isLoading, error, refetch } = useCollections();
  const { getTranslation } = useCollectionTranslations();
  

  // Use database collections directly or static ones if empty
  console.log('📚 [CollectionCategories] Collections received:', collections?.length || 0);
  const staticCollections = getStaticCollections(currentLanguage);
  const finalCollections: UnifiedCollection[] = collections && collections.length > 0 ? collections : staticCollections;

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
    console.log('⏳ [CollectionCategories] Affichage état de chargement');
    return <CollectionsLoadingSkeleton />;
  }

  // Error state
  if (error) {
    console.error('❌ [CollectionCategories] Affichage état d\'erreur:', error);
    return <CollectionsErrorState error={error} retry={() => refetch()} />;
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
    </div>
  );
};

export default CollectionCategories;
