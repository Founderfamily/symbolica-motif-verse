
import React from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import FeaturedCollectionsGrid from '@/components/collections/FeaturedCollectionsGrid';
import CollectionGrid from '@/components/collections/CollectionGrid';
import CreateCollectionDialog from '@/components/collections/CreateCollectionDialog';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { I18nText } from '@/components/ui/i18n-text';
import { useFeaturedCollections, useCollections } from '@/hooks/useCollections';

const CollectionsPage = () => {
  const { currentLanguage } = useTranslation();
  const { user } = useAuth();
  const { data: featuredCollections } = useFeaturedCollections();
  const { data: allCollections } = useCollections();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
              <I18nText translationKey="collections.heroTitle">Cultural Collections</I18nText>
            </h1>
            <Badge variant="outline" className="text-amber-600 border-amber-600">
              {allCollections?.length || 0} collections
            </Badge>
          </div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            <I18nText translationKey="collections.heroDescription">
              Explore thematic journeys through symbols from around the world. Discover fascinating connections between cultures and eras.
            </I18nText>
          </p>
          
          <div className="flex items-center justify-center gap-6 text-sm text-slate-600 mb-8">
            <span className="flex items-center gap-2">
              🏛️ <I18nText translationKey="collections.heroStats.mysteries">Mysteries & Secrets</I18nText>
            </span>
            <span className="flex items-center gap-2">
              📐 <I18nText translationKey="collections.heroStats.geometry">Sacred Geometry</I18nText>
            </span>
            <span className="flex items-center gap-2">
              🏺 <I18nText translationKey="collections.heroStats.mythologies">Mythologies</I18nText>
            </span>
            <span className="flex items-center gap-2">
              💻 <I18nText translationKey="collections.heroStats.digital">Digital Era</I18nText>
            </span>
          </div>

          {user && (
            <div className="flex justify-center">
              <CreateCollectionDialog />
            </div>
          )}
        </section>

        {/* Featured Collections */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              <I18nText translationKey="collections.featured.title">Featured Collections</I18nText>
            </h2>
            <Badge className="bg-amber-600 hover:bg-amber-700">
              <I18nText translationKey="collections.featuredBadge">Featured</I18nText>
            </Badge>
          </div>
          <FeaturedCollectionsGrid />
        </section>

        {/* All Collections */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              <I18nText translationKey="collections.allCollections">All Collections</I18nText>
            </h2>
            <div className="text-sm text-slate-600">
              {allCollections?.length || 0} <I18nText translationKey="collections.allCollectionsCount">thematic journeys available</I18nText>
            </div>
          </div>
          <CollectionGrid />
        </section>
      </div>
    </div>
  );
};

export default CollectionsPage;
