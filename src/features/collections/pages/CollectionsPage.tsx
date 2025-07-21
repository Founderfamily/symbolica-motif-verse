
import React from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import CollectionCategories from '../components/main/CollectionCategories';
import CreateCollectionDialog from '@/components/collections/CreateCollectionDialog';
import { CollectionErrorBoundary } from '@/components/collections/CollectionErrorBoundary';
import { useAuth } from '@/hooks/useAuth';
import { I18nText } from '@/components/ui/i18n-text';
import { useCollections } from '../hooks/useCollections';
import { CollectionStatsDisplay } from '@/components/collections/CollectionStatsDisplay';
import { SystemBanner } from '@/components/ui/system-banner';

const CollectionsPage = () => {
  const { currentLanguage } = useTranslation();
  const { user } = useAuth();
  const { data: collections } = useCollections();

  return (
    <CollectionErrorBoundary>
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          <SystemBanner />
          <CollectionCategories />
        </div>
      </div>
    </CollectionErrorBoundary>
  );
};

export default CollectionsPage;
