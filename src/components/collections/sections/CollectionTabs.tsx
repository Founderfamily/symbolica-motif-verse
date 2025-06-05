
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { I18nText } from '@/components/ui/i18n-text';
import { CollectionWithTranslations } from '@/features/collections/types/collections';
import { CategoryGrid } from '@/features/collections/components/sections/CategoryGrid';

interface CollectionTabsProps {
  cultures: CollectionWithTranslations[];
  periods: CollectionWithTranslations[];
  sciences: CollectionWithTranslations[];
  others: CollectionWithTranslations[];
}

export const CollectionTabs: React.FC<CollectionTabsProps> = React.memo(({
  cultures,
  periods,
  sciences,
  others
}) => {
  // Ne pas afficher les tabs si aucune collection n'est disponible dans ces catégories
  const totalCollections = cultures.length + periods.length + sciences.length + others.length;
  
  if (totalCollections === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-3xl font-bold text-slate-900 mb-8">
        <I18nText translationKey="collections.categories.title">Explorer par Catégorie</I18nText>
      </h2>
      
      <Tabs defaultValue="cultures" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="cultures" className="flex flex-col items-center gap-1">
            <span>🌍</span>
            <span><I18nText translationKey="collections.categories.cultures">Cultures</I18nText></span>
            <span className="text-xs text-slate-500">({cultures.length})</span>
          </TabsTrigger>
          <TabsTrigger value="periods" className="flex flex-col items-center gap-1">
            <span>⏳</span>
            <span><I18nText translationKey="collections.categories.periods">Époques</I18nText></span>
            <span className="text-xs text-slate-500">({periods.length})</span>
          </TabsTrigger>
          <TabsTrigger value="sciences" className="flex flex-col items-center gap-1">
            <span>🔬</span>
            <span><I18nText translationKey="collections.categories.sciences">Sciences</I18nText></span>
            <span className="text-xs text-slate-500">({sciences.length})</span>
          </TabsTrigger>
          <TabsTrigger value="others" className="flex flex-col items-center gap-1">
            <span>🎨</span>
            <span><I18nText translationKey="collections.categories.others">Autres</I18nText></span>
            <span className="text-xs text-slate-500">({others.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cultures" className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">
              <I18nText translationKey="collections.categories.cultures">Cultures du Monde</I18nText>
            </h3>
            <p className="text-slate-600 mb-6">
              <I18nText translationKey="collections.categories.culturesDescription">
                Découvrez les symboles et traditions de différentes cultures à travers le monde.
              </I18nText>
            </p>
            <CategoryGrid 
              collections={cultures} 
              emptyMessage="collections.categories.noCultures"
            />
          </div>
        </TabsContent>

        <TabsContent value="periods" className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">
              <I18nText translationKey="collections.categories.periods">Époques Historiques</I18nText>
            </h3>
            <p className="text-slate-600 mb-6">
              <I18nText translationKey="collections.categories.periodsDescription">
                Explorez l'évolution des symboles à travers les différentes périodes historiques.
              </I18nText>
            </p>
            <CategoryGrid 
              collections={periods} 
              emptyMessage="collections.categories.noPeriods"
            />
          </div>
        </TabsContent>

        <TabsContent value="sciences" className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">
              <I18nText translationKey="collections.categories.sciences">Sciences & Ésotérisme</I18nText>
            </h3>
            <p className="text-slate-600 mb-6">
              <I18nText translationKey="collections.categories.sciencesDescription">
                Plongez dans les symboles scientifiques, mathématiques et ésotériques.
              </I18nText>
            </p>
            <CategoryGrid 
              collections={sciences} 
              emptyMessage="collections.categories.noSciences"
            />
          </div>
        </TabsContent>

        <TabsContent value="others" className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">
              <I18nText translationKey="collections.categories.others">Autres Collections</I18nText>
            </h3>
            <p className="text-slate-600 mb-6">
              <I18nText translationKey="collections.categories.othersDescription">
                Découvrez d'autres collections thématiques fascinantes.
              </I18nText>
            </p>
            <CategoryGrid 
              collections={others} 
              emptyMessage="collections.categories.noOthers"
            />
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
});

CollectionTabs.displayName = 'CollectionTabs';
