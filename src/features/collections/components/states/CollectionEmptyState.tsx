
import React from 'react';
import { I18nText } from '@/components/ui/i18n-text';

interface CollectionEmptyStateProps {
  onUseFallback: () => void;
  collections?: any[];
  useFallback: boolean;
}

export const CollectionEmptyState: React.FC<CollectionEmptyStateProps> = ({
  onUseFallback,
  collections,
  useFallback
}) => {
  return (
    <div className="text-center py-12 space-y-4">
      <h3 className="text-xl font-medium mb-2 text-slate-700">
        <I18nText translationKey="collections.noCollections">No collections available</I18nText>
      </h3>
      <p className="text-slate-600">
        <I18nText translationKey="collections.noCollectionsMessage">
          Collections will be available soon. Come back later!
        </I18nText>
      </p>
      <button 
        onClick={onUseFallback}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Voir les collections de démonstration
      </button>
      <p className="text-xs text-slate-400 mt-4">
        Debug: finalCollections = {JSON.stringify(collections?.slice(0, 1))} | source = {useFallback ? 'fallback' : 'supabase'}
      </p>
    </div>
  );
};
