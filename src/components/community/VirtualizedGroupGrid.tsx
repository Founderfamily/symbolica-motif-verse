
import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { InterestGroup } from '@/types/interest-groups';
import InterestGroupCard from './InterestGroupCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';

interface VirtualizedGroupGridProps {
  groups: InterestGroup[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  emptyMessage?: string;
  itemHeight?: number;
  containerHeight?: number;
}

const ITEM_HEIGHT = 320; // Hauteur approximative d'une carte de groupe
const BUFFER_SIZE = 5; // Nombre d'éléments à rendre en plus

export const VirtualizedGroupGrid: React.FC<VirtualizedGroupGridProps> = ({
  groups,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  emptyMessage = "No groups found",
  itemHeight = ITEM_HEIGHT,
  containerHeight = 800
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculer le nombre de colonnes basé sur la largeur du conteneur
  const [columns, setColumns] = useState(4);

  useEffect(() => {
    const updateColumns = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        if (width >= 1280) setColumns(4); // xl
        else if (width >= 1024) setColumns(3); // lg
        else if (width >= 768) setColumns(2); // md
        else setColumns(1); // sm
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // Calculer les éléments visibles
  const visibleItems = useMemo(() => {
    const rowHeight = itemHeight + 24; // hauteur + gap
    const totalRows = Math.ceil(groups.length / columns);
    
    const startRow = Math.floor(scrollTop / rowHeight);
    const endRow = Math.min(
      startRow + Math.ceil(containerHeight / rowHeight) + BUFFER_SIZE,
      totalRows
    );

    const startIndex = Math.max(0, startRow - BUFFER_SIZE) * columns;
    const endIndex = Math.min(endRow * columns, groups.length);

    return {
      startIndex,
      endIndex,
      startRow: Math.max(0, startRow - BUFFER_SIZE),
      totalHeight: totalRows * rowHeight
    };
  }, [scrollTop, groups.length, columns, itemHeight, containerHeight]);

  const visibleGroups = useMemo(() => 
    groups.slice(visibleItems.startIndex, visibleItems.endIndex)
  , [groups, visibleItems.startIndex, visibleItems.endIndex]);

  const groupCards = useMemo(() => 
    visibleGroups.map((group, index) => (
      <div
        key={group.id}
        style={{
          position: 'absolute',
          top: Math.floor((visibleItems.startIndex + index) / columns) * (itemHeight + 24),
          left: ((visibleItems.startIndex + index) % columns) * (100 / columns) + '%',
          width: `${100 / columns}%`,
          height: itemHeight,
          padding: '0 12px 24px 0'
        }}
      >
        <InterestGroupCard group={group} />
      </div>
    )), [visibleGroups, visibleItems.startIndex, columns, itemHeight]);

  // Skeleton cards pour le loading
  const skeletonCards = useMemo(() => 
    Array.from({ length: Math.min(8, columns * 2) }, (_, i) => (
      <div
        key={`skeleton-${i}`}
        style={{
          position: 'absolute',
          top: Math.floor(i / columns) * (itemHeight + 24) + visibleItems.totalHeight,
          left: (i % columns) * (100 / columns) + '%',
          width: `${100 / columns}%`,
          height: itemHeight,
          padding: '0 12px 24px 0'
        }}
      >
        <div className="space-y-3 animate-pulse h-full">
          <div className="h-48 bg-slate-200 rounded-lg" />
          <div className="h-4 bg-slate-200 rounded w-3/4" />
          <div className="h-3 bg-slate-200 rounded w-full" />
          <div className="h-3 bg-slate-200 rounded w-2/3" />
        </div>
      </div>
    )), [columns, itemHeight, visibleItems.totalHeight]);

  // Auto-load more quand on approche de la fin
  useEffect(() => {
    const threshold = 200; // pixels avant la fin
    const scrollHeight = visibleItems.totalHeight;
    const isNearEnd = scrollTop + containerHeight > scrollHeight - threshold;
    
    if (isNearEnd && hasNextPage && !isFetchingNextPage) {
      onLoadMore();
    }
  }, [scrollTop, containerHeight, visibleItems.totalHeight, hasNextPage, isFetchingNextPage, onLoadMore]);

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
      <div
        ref={containerRef}
        className="relative overflow-auto"
        style={{ height: containerHeight }}
        onScroll={handleScroll}
      >
        <div
          style={{
            position: 'relative',
            height: visibleItems.totalHeight + (isFetchingNextPage ? (Math.ceil(8 / columns) * (itemHeight + 24)) : 0)
          }}
        >
          {groupCards}
          {isFetchingNextPage && skeletonCards}
        </div>
      </div>

      {hasNextPage && !isFetchingNextPage && (
        <div className="flex justify-center pt-6">
          <Button
            onClick={onLoadMore}
            variant="outline"
            size="lg"
          >
            <I18nText translationKey="common.loadMore">Load More</I18nText>
          </Button>
        </div>
      )}

      {isFetchingNextPage && (
        <div className="flex justify-center items-center py-6">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <I18nText translationKey="common.loading">Loading...</I18nText>
        </div>
      )}
    </div>
  );
};

export default VirtualizedGroupGrid;
