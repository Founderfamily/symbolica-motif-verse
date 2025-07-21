
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Grid3X3, Clock, Map, Layers, Star, BookOpen, Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { I18nText } from '@/components/ui/i18n-text';
import { useCollections } from '../../hooks/useCollections';
import { useTranslation } from '@/i18n/useTranslation';
import { Skeleton } from '@/components/ui/skeleton';
import { CollectionWithTranslations } from '../../types/collections';
import { useCollectionFilters } from '../../hooks/useCollectionFilters';
import { CollectionControls } from '../controls/CollectionControls';
import { FilteredCollectionGrid } from '../grids/FilteredCollectionGrid';
import { CollectionsTimeline } from '../timeline/CollectionsTimeline';
import { useCollectionTranslations } from '@/hooks/useCollectionTranslations';
import { useState } from 'react';

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
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');
  const [organizationMode, setOrganizationMode] = useState<'thematic' | 'geographic' | 'popularity' | 'difficulty' | 'chronological'>('thematic');

  // Use database collections directly
  console.log('📚 [CollectionCategories] Collections received:', collections?.length || 0);
  const finalCollections: UnifiedCollection[] = collections || [];

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

  // Obtenir les options d'organisation selon le mode
  const getOrganizationOptions = () => {
    switch (organizationMode) {
      case 'thematic':
        return [
          { id: 'cultures', label: 'Cultures du monde', icon: Globe },
          { id: 'spirituality', label: 'Spiritualité & Religion', icon: Star },
          { id: 'art', label: 'Art & Artisanat', icon: Layers },
          { id: 'history', label: 'Histoire & Patrimoine', icon: BookOpen }
        ];
      case 'geographic':
        return [
          { id: 'europe', label: 'Europe', icon: Map },
          { id: 'asia', label: 'Asie', icon: Map },
          { id: 'africa', label: 'Afrique', icon: Map },
          { id: 'americas', label: 'Amériques', icon: Map }
        ];
      case 'popularity':
        return [
          { id: 'most-viewed', label: 'Plus consultées', icon: Star },
          { id: 'trending', label: 'Tendances', icon: ArrowRight },
          { id: 'new', label: 'Nouveautés', icon: Clock }
        ];
      case 'difficulty':
        return [
          { id: 'beginner', label: 'Découverte', icon: Star },
          { id: 'intermediate', label: 'Approfondissement', icon: Layers },
          { id: 'expert', label: 'Expertise', icon: BookOpen }
        ];
      case 'chronological':
        return [
          { id: 'ancient', label: 'Antiquité', icon: Clock },
          { id: 'medieval', label: 'Moyen Âge', icon: Clock },
          { id: 'modern', label: 'Époque moderne', icon: Clock },
          { id: 'contemporary', label: 'Contemporain', icon: Clock }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-8">
      {/* Menu de sélection d'organisation */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-6 border border-muted">
        <h3 className="text-lg font-semibold mb-4 text-foreground">
          <I18nText translationKey="collections.organizationMode">Mode d'organisation</I18nText>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Button
            variant={organizationMode === 'thematic' ? 'default' : 'outline'}
            className="h-auto p-4 flex flex-col items-start gap-2"
            onClick={() => setOrganizationMode('thematic')}
          >
            <div className="flex items-center gap-2 w-full">
              <Layers className="w-5 h-5" />
              <span className="font-medium">Organisation thématique</span>
            </div>
            <p className="text-xs text-left opacity-80">Par domaines : cultures, art, spiritualité...</p>
          </Button>

          <Button
            variant={organizationMode === 'geographic' ? 'default' : 'outline'}
            className="h-auto p-4 flex flex-col items-start gap-2"
            onClick={() => setOrganizationMode('geographic')}
          >
            <div className="flex items-center gap-2 w-full">
              <Map className="w-5 h-5" />
              <span className="font-medium">Organisation géographique</span>
            </div>
            <p className="text-xs text-left opacity-80">Par régions et continents</p>
          </Button>

          <Button
            variant={organizationMode === 'popularity' ? 'default' : 'outline'}
            className="h-auto p-4 flex flex-col items-start gap-2"
            onClick={() => setOrganizationMode('popularity')}
          >
            <div className="flex items-center gap-2 w-full">
              <Star className="w-5 h-5" />
              <span className="font-medium">Par popularité</span>
            </div>
            <p className="text-xs text-left opacity-80">Selon l'engagement des utilisateurs</p>
          </Button>

          <Button
            variant={organizationMode === 'difficulty' ? 'default' : 'outline'}
            className="h-auto p-4 flex flex-col items-start gap-2"
            onClick={() => setOrganizationMode('difficulty')}
          >
            <div className="flex items-center gap-2 w-full">
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">Par niveau</span>
            </div>
            <p className="text-xs text-left opacity-80">Découverte, approfondissement, expertise</p>
          </Button>

          <Button
            variant={organizationMode === 'chronological' ? 'default' : 'outline'}
            className="h-auto p-4 flex flex-col items-start gap-2"
            onClick={() => setOrganizationMode('chronological')}
          >
            <div className="flex items-center gap-2 w-full">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Chronologique</span>
            </div>
            <p className="text-xs text-left opacity-80">Par époques historiques</p>
          </Button>

          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-start gap-2 opacity-60"
            disabled
          >
            <div className="flex items-center gap-2 w-full">
              <Grid3X3 className="w-5 h-5" />
              <span className="font-medium">Vue classique</span>
            </div>
            <p className="text-xs text-left opacity-80">Grille simple avec filtres</p>
          </Button>
        </div>

        {/* Aperçu des catégories selon le mode sélectionné */}
        <div className="border-t border-muted pt-4">
          <h4 className="font-medium mb-3 text-sm text-muted-foreground">
            Catégories disponibles dans ce mode :
          </h4>
          <div className="flex flex-wrap gap-2">
            {getOrganizationOptions().map((option) => {
              const IconComponent = option.icon;
              return (
                <div
                  key={option.id}
                  className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1 text-xs"
                >
                  <IconComponent className="w-3 h-3" />
                  <span>{option.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Boutons de vue (Timeline/Grille) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'timeline' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('timeline')}
            className="flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            <I18nText translationKey="collections.timelineView">Timeline</I18nText>
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="flex items-center gap-2"
          >
            <Grid3X3 className="w-4 h-4" />
            <I18nText translationKey="collections.gridView">Grille</I18nText>
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredAndSortedCollections.length} collections • Mode: {organizationMode}
        </div>
      </div>

      {/* Vue conditionnelle */}
      {viewMode === 'timeline' ? (
        <CollectionsTimeline
          collections={filteredAndSortedCollections}
          getCollectionTitle={getCollectionTitle}
          getCollectionDescription={getCollectionDescription}
        />
      ) : (
        <>
          {/* Controls Section pour la vue grille */}
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
        </>
      )}
    </div>
  );
};

export default CollectionCategories;
