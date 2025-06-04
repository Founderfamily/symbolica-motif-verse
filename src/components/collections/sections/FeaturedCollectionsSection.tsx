
import React from 'react';
import { I18nText } from '@/components/ui/i18n-text';
import { Badge } from '@/components/ui/badge';
import { CollectionWithTranslations } from '@/types/collections';
import CollectionCard from '../CollectionCard';

interface FeaturedCollectionsSectionProps {
  collections: CollectionWithTranslations[];
}

export const FeaturedCollectionsSection: React.FC<FeaturedCollectionsSectionProps> = React.memo(({ collections }) => {
  if (collections.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-3xl font-bold text-slate-900">
          <I18nText translationKey="collections.featured.title">Collections en Vedette</I18nText>
        </h2>
        <Badge className="bg-amber-600 hover:bg-amber-700">
          <I18nText translationKey="collections.featuredBadge">En vedette</I18nText>
        </Badge>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </section>
  );
});

FeaturedCollectionsSection.displayName = 'FeaturedCollectionsSection';
