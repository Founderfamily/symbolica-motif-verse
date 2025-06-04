
import React from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import CollectionCategories from '@/components/collections/CollectionCategories';
import CreateCollectionDialog from '@/components/collections/CreateCollectionDialog';
import { CollectionErrorBoundary } from '@/components/collections/CollectionErrorBoundary';
import { useAuth } from '@/hooks/useAuth';
import { I18nText } from '@/components/ui/i18n-text';
import { useOptimizedCollections } from '@/hooks/useOptimizedCollections';
import { CollectionStatsDisplay } from '@/components/collections/CollectionStatsDisplay';

const CollectionsPage = () => {
  const { currentLanguage } = useTranslation();
  const { user } = useAuth();
  const { collections } = useOptimizedCollections();

  return (
    <CollectionErrorBoundary>
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <section className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
                <I18nText translationKey="collections.title">Collections</I18nText>
              </h1>
              <CollectionStatsDisplay collections={collections} />
            </div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              <I18nText translationKey="collections.featured.description">
                Explorez des parcours thématiques à travers les symboles du monde entier
              </I18nText>
            </p>
            
            <div className="flex items-center justify-center gap-6 text-sm text-slate-600 mb-8">
              <span className="flex items-center gap-2">
                🌍 <I18nText translationKey="collections.heroStats.cultures">Cultures du Monde</I18nText>
              </span>
              <span className="flex items-center gap-2">
                ⏳ <I18nText translationKey="collections.heroStats.periods">Époques Historiques</I18nText>
              </span>
              <span className="flex items-center gap-2">
                🏺 <I18nText translationKey="collections.heroStats.mythologies">Mythologies</I18nText>
              </span>
              <span className="flex items-center gap-2">
                🎨 <I18nText translationKey="collections.heroStats.art">Art Symbolique</I18nText>
              </span>
            </div>

            {user && (
              <div className="flex justify-center">
                <CreateCollectionDialog />
              </div>
            )}
          </section>

          {/* Collections organisées par catégories */}
          <CollectionCategories />
        </div>
      </div>
    </CollectionErrorBoundary>
  );
};

export default CollectionsPage;
