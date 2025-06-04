
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { I18nText } from '@/components/ui/i18n-text';
import { CollectionWithTranslations } from '@/types/collections';
import { CategoryGrid } from './CategoryGrid';

interface CollectionTabsProps {
  cultures: CollectionWithTranslations[];
  periods: CollectionWithTranslations[];
  others: CollectionWithTranslations[];
}

export const CollectionTabs: React.FC<CollectionTabsProps> = React.memo(({ 
  cultures, 
  periods, 
  others 
}) => (
  <section>
    <Tabs defaultValue="cultures" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="cultures" className="flex items-center gap-2">
          🌍 <I18nText translationKey="collections.categories.cultures">Cultures</I18nText>
          <Badge variant="secondary">{cultures.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="periods" className="flex items-center gap-2">
          ⏳ <I18nText translationKey="collections.categories.periods">Périodes</I18nText>
          <Badge variant="secondary">{periods.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="others" className="flex items-center gap-2">
          📚 <I18nText translationKey="collections.categories.others">Autres</I18nText>
          <Badge variant="secondary">{others.length}</Badge>
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
        <CategoryGrid collections={cultures} />
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
        <CategoryGrid collections={periods} />
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
        <CategoryGrid 
          collections={others} 
          emptyMessage="collections.categories.noOthers"
        />
      </TabsContent>
    </Tabs>
  </section>
));

CollectionTabs.displayName = 'CollectionTabs';
