
import React from 'react';
import { useCollections } from '@/hooks/useCollections';
import CollectionCard from './CollectionCard';
import { Skeleton } from '@/components/ui/skeleton';
import { I18nText } from '@/components/ui/i18n-text';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CollectionCategories: React.FC = () => {
  const { data: collections, isLoading } = useCollections();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!collections || collections.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2 text-slate-700">
          <I18nText translationKey="collections.noCollections">No collections available</I18nText>
        </h3>
        <p className="text-slate-600">
          <I18nText translationKey="collections.noCollectionsMessage">
            Collections will be available soon. Come back later!
          </I18nText>
        </p>
      </div>
    );
  }

  // Séparer les collections par catégories
  const featuredCollections = collections.filter(c => c.is_featured);
  const cultureCollections = collections.filter(c => c.slug.startsWith('culture-'));
  const periodCollections = collections.filter(c => c.slug.startsWith('periode-'));
  const otherCollections = collections.filter(c => 
    !c.is_featured && 
    !c.slug.startsWith('culture-') && 
    !c.slug.startsWith('periode-')
  );

  return (
    <div className="space-y-12">
      {/* Collections en vedette */}
      {featuredCollections.length > 0 && (
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
            {featuredCollections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </section>
      )}

      {/* Collections par catégories avec onglets */}
      <section>
        <Tabs defaultValue="cultures" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cultures" className="flex items-center gap-2">
              🌍 <I18nText translationKey="collections.categories.cultures">Cultures</I18nText>
              <Badge variant="secondary">{cultureCollections.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="periods" className="flex items-center gap-2">
              ⏳ <I18nText translationKey="collections.categories.periods">Périodes</I18nText>
              <Badge variant="secondary">{periodCollections.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="others" className="flex items-center gap-2">
              📚 <I18nText translationKey="collections.categories.others">Autres</I18nText>
              <Badge variant="secondary">{otherCollections.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cultures" className="mt-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                <I18nText translationKey="collections.categories.cultures">Collections par Culture</I18nText>
              </h3>
              <p className="text-slate-600">
                <I18nText translationKey="collections.categories.culturesDescription">
                  Explorez les symboles organisés par leur origine culturelle
                </I18nText>
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cultureCollections.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="periods" className="mt-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                <I18nText translationKey="collections.categories.periods">Collections par Période</I18nText>
              </h3>
              <p className="text-slate-600">
                <I18nText translationKey="collections.categories.periodsDescription">
                  Découvrez l'évolution des symboles à travers les époques
                </I18nText>
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {periodCollections.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="others" className="mt-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                <I18nText translationKey="collections.categories.others">Autres Collections</I18nText>
              </h3>
              <p className="text-slate-600">
                <I18nText translationKey="collections.categories.othersDescription">
                  Collections thématiques et créations personnalisées
                </I18nText>
              </p>
            </div>
            {otherCollections.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {otherCollections.map((collection) => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-lg">
                <p className="text-slate-500">
                  <I18nText translationKey="collections.categories.noOthers">
                    Aucune autre collection pour le moment
                  </I18nText>
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default CollectionCategories;
