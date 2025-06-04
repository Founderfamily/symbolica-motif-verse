
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { I18nText } from '@/components/ui/i18n-text';
import { useCollectionStats } from '@/hooks/useCollectionStats';
import { CollectionWithTranslations } from '@/types/collections';

interface CollectionStatsDisplayProps {
  collections: CollectionWithTranslations[] | undefined;
}

export const CollectionStatsDisplay: React.FC<CollectionStatsDisplayProps> = React.memo(({ collections }) => {
  const { total } = useCollectionStats(collections);

  return (
    <Badge variant="outline" className="text-amber-600 border-amber-600">
      {total} <I18nText translationKey="collections.collectionsUnit">collections</I18nText>
    </Badge>
  );
});

CollectionStatsDisplay.displayName = 'CollectionStatsDisplay';
