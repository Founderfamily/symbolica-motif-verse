
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useCollections } from '../../hooks/useCollections';
import { useTranslation } from '@/i18n/useTranslation';
import { Skeleton } from '@/components/ui/skeleton';
import { useCollectionFilters } from '../../hooks/useCollectionFilters';
import { CollectionControls } from '../controls/CollectionControls';
import { FilteredCollectionGrid } from '../grids/FilteredCollectionGrid';
import { useCollectionTranslations } from '@/hooks/useCollectionTranslations';

// Loading skeleton component
const CollectionsLoadingSkeleton: React.FC = React.memo(() => {
  return (
    <div className="space-y-8">
      <Skeleton className="h-12 w-full" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(20)].map((_, i) => (
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

  console.log('📚 [CollectionCategories] Collections reçues:', collections?.length || 0);

  // Function to get title from collection
  const getCollectionTitle = React.useCallback((collection: any) => {
    return getTranslation(collection, 'title');
  }, [getTranslation]);

  // Function to get description from collection
  const getCollectionDescription = React.useCallback((collection: any) => {
    return getTranslation(collection, 'description');
  }, [getTranslation]);

  // Use filters hook with direct collections
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
  } = useCollectionFilters({ collections: collections || [] });

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

      {/* Collections Grid - Affichage direct de toutes les collections */}
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
