
import { useEffect, useCallback, useRef } from 'react';

interface KeyboardNavigationOptions {
  enabled?: boolean;
  gridColumns?: number;
  onEnter?: (index: number) => void;
  onEscape?: () => void;
}

export const useKeyboardNavigation = (
  itemsCount: number,
  options: KeyboardNavigationOptions = {}
) => {
  const {
    enabled = true,
    gridColumns = 4,
    onEnter,
    onEscape
  } = options;

  const focusedIndexRef = useRef(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const setFocusedIndex = useCallback((index: number) => {
    focusedIndexRef.current = Math.max(-1, Math.min(index, itemsCount - 1));
    
    // Mettre à jour l'attribut data-focused sur les éléments
    if (containerRef.current) {
      const items = containerRef.current.querySelectorAll('[data-keyboard-nav]');
      items.forEach((item, i) => {
        if (i === focusedIndexRef.current) {
          item.setAttribute('data-focused', 'true');
          (item as HTMLElement).focus();
        } else {
          item.removeAttribute('data-focused');
        }
      });
    }
  }, [itemsCount]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled || itemsCount === 0) return;

    const { key } = event;
    let newIndex = focusedIndexRef.current;

    switch (key) {
      case 'ArrowRight':
        event.preventDefault();
        newIndex = focusedIndexRef.current === -1 ? 0 : (focusedIndexRef.current + 1) % itemsCount;
        break;

      case 'ArrowLeft':
        event.preventDefault();
        newIndex = focusedIndexRef.current === -1 ? 0 : 
          focusedIndexRef.current === 0 ? itemsCount - 1 : focusedIndexRef.current - 1;
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (focusedIndexRef.current === -1) {
          newIndex = 0;
        } else {
          const nextRow = focusedIndexRef.current + gridColumns;
          newIndex = nextRow < itemsCount ? nextRow : focusedIndexRef.current;
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (focusedIndexRef.current === -1) {
          newIndex = 0;
        } else {
          const prevRow = focusedIndexRef.current - gridColumns;
          newIndex = prevRow >= 0 ? prevRow : focusedIndexRef.current;
        }
        break;

      case 'Enter':
        event.preventDefault();
        if (focusedIndexRef.current >= 0 && onEnter) {
          onEnter(focusedIndexRef.current);
        }
        break;

      case 'Escape':
        event.preventDefault();
        setFocusedIndex(-1);
        if (onEscape) {
          onEscape();
        }
        break;

      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;

      case 'End':
        event.preventDefault();
        newIndex = itemsCount - 1;
        break;

      default:
        return;
    }

    if (newIndex !== focusedIndexRef.current) {
      setFocusedIndex(newIndex);
    }
  }, [enabled, itemsCount, gridColumns, onEnter, onEscape, setFocusedIndex]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled, handleKeyDown]);

  const focusItem = useCallback((index: number) => {
    setFocusedIndex(index);
  }, [setFocusedIndex]);

  const clearFocus = useCallback(() => {
    setFocusedIndex(-1);
  }, [setFocusedIndex]);

  return {
    containerRef,
    focusedIndex: focusedIndexRef.current,
    focusItem,
    clearFocus
  };
};
