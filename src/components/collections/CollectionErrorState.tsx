
import React from 'react';
import { I18nText } from '@/components/ui/i18n-text';

export const CollectionErrorState: React.FC = React.memo(() => {
  return (
    <div className="text-center py-12">
      <h3 className="text-xl font-medium mb-2 text-red-600">
        <I18nText translationKey="collections.errorLoading">Error loading collections</I18nText>
      </h3>
      <p className="text-slate-600">
        <I18nText translationKey="collections.errorMessage">
          Unable to load featured collections. Please try again later.
        </I18nText>
      </p>
    </div>
  );
});

CollectionErrorState.displayName = 'CollectionErrorState';
