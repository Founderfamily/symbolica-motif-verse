
import React, { useState, useRef, useEffect } from 'react';
import { CollectionWithTranslations } from '@/types/collections';
import { OptimizedCollectionCard } from './OptimizedCollectionCard';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';

interface AdaptiveGridProps {
  collections: CollectionWithTranslations[];
  onCollectionSelect?: (collection: CollectionWithTranslations) => void;
}

export const AdaptiveGrid: React.FC<AdaptiveGridProps> = ({
  collections,
  onCollectionSelect
}) => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const gridRef = useRef<HTMLDivElement>(null);

  // Calcul adaptatif des colonnes selon l'écran
  const getGridColumns = () => {
    if (typeof window === 'undefined') return 4;
    const width = window.innerWidth;
    if (width < 768) return 1;
    if (width < 1024) return 2;
    if (width < 1280) return 3;
    return 4;
  };

  const [gridColumns, setGridColumns] = useState(getGridColumns());

  useEffect(() => {
    const handleResize = () => {
      const columns = getGridColumns();
      setGridColumns(columns);
      setItemsPerPage(columns * 3); // 3 rangées par page
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Appel initial

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { containerRef, focusedIndex, focusItem } = useKeyboardNavigation(
    Math.min(collections.length, itemsPerPage),
    {
      gridColumns,
      onEnter: (index) => {
        const collection = paginatedCollections[index];
        if (collection && onCollectionSelect) {
          onCollectionSelect(collection);
        }
      }
    }
  );

  // Pagination
  const totalPages = Math.ceil(collections.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const paginatedCollections = collections.slice(startIndex, startIndex + itemsPerPage);

  // Gestion des gestes tactiles
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;

    // Swipe horizontal pour pagination
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0 && currentPage > 0) {
        setCurrentPage(prev => prev - 1);
      } else if (deltaX < 0 && currentPage < totalPages - 1) {
        setCurrentPage(prev => prev + 1);
      }
    }

    setTouchStart(null);
  };

  const getGridClasses = () => {
    const baseClasses = "grid gap-6 transition-all duration-300";
    switch (gridColumns) {
      case 1: return `${baseClasses} grid-cols-1`;
      case 2: return `${baseClasses} md:grid-cols-2`;
      case 3: return `${baseClasses} md:grid-cols-2 lg:grid-cols-3`;
      default: return `${baseClasses} md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`;
    }
  };

  return (
    <div className="space-y-6">
      <div
        ref={containerRef}
        className={getGridClasses()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'pan-y' }}
      >
        {paginatedCollections.map((collection, index) => (
          <div
            key={collection.id}
            data-keyboard-nav
            tabIndex={0}
            className={`
              transition-all duration-200 outline-none
              ${focusedIndex === index ? 'ring-2 ring-amber-500 ring-offset-2' : ''}
            `}
            onClick={() => focusItem(index)}
          >
            <OptimizedCollectionCard collection={collection} />
          </div>
        ))}
      </div>

      {/* Indicateur de pagination pour mobile */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 md:hidden">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentPage ? 'bg-amber-500' : 'bg-slate-300'
              }`}
              onClick={() => setCurrentPage(index)}
              aria-label={`Page ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
