
import React, { useMemo } from 'react';
import { InterestGroup } from '@/types/interest-groups';
import InterestGroupCard from './InterestGroupCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';

interface OptimizedGroupGridProps {
  groups: InterestGroup[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  emptyMessage?: string;
}

const GroupSkeletonCard = React.memo(() => (
  <div className="space-y-3 animate-pulse">
    <div className="h-48 bg-slate-200 rounded-lg" />
    <div className="h-4 bg-slate-200 rounded w-3/4" />
    <div className="h-3 bg-slate-200 rounded w-full" />
    <div className="h-3 bg-slate-200 rounded w-2/3" />
  </div>
));

GroupSkeletonCard.displayName = 'GroupSkeletonCard';

export const OptimizedGroupGrid: React.FC<OptimizedGroupGridProps> = ({
  groups,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  emptyMessage = "No groups found"
}) => {
  const groupCards = useMemo(() => 
    groups.map((group) => (
      <InterestGroupCard key={group.id} group={group} />
    )), [groups]);

  const skeletonCards = useMemo(() => 
    Array.from({ length: 4 }, (_, i) => (
      <GroupSkeletonCard key={`skeleton-${i}`} />
    )), []);

  if (groups.length === 0 && !isFetchingNextPage) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">
          <I18nText translationKey="community.noGroups">{emptyMessage}</I18nText>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {groupCards}
        {isFetchingNextPage && skeletonCards}
      </div>

      {hasNextPage && (
        <div className="flex justify-center pt-6">
          <Button
            onClick={onLoadMore}
            disabled={isFetchingNextPage}
            variant="outline"
            size="lg"
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <I18nText translationKey="common.loading">Loading...</I18nText>
              </>
            ) : (
              <I18nText translationKey="common.loadMore">Load More</I18nText>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default OptimizedGroupGrid;
