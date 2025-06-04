
import React from 'react';
import { I18nText } from '@/components/ui/i18n-text';

export const CollectionEmptyState: React.FC = React.memo(() => {
  return (
    <div className="text-center py-12">
      <h3 className="text-xl font-medium mb-2 text-slate-700">
        <I18nText translationKey="collections.noFeaturedCollections">No featured collections</I18nText>
      </h3>
      <p className="text-slate-600">
        <I18nText translationKey="collections.noFeaturedCollectionsMessage">
          Thematic collections coming soon!
        </I18nText>
      </p>
    </div>
  );
});

CollectionEmptyState.displayName = 'CollectionEmptyState';
