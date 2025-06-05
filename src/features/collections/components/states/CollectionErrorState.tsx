
import React from 'react';
import { EnhancedErrorState } from '@/components/collections/EnhancedErrorStates';

interface CollectionErrorStateProps {
  error: Error;
  onRetry: () => void;
  onUseFallback: () => void;
}

export const CollectionErrorState: React.FC<CollectionErrorStateProps> = ({
  error,
  onRetry,
  onUseFallback
}) => {
  return (
    <div className="flex justify-center items-center min-h-96">
      <div className="text-center space-y-4">
        <EnhancedErrorState
          error={error}
          context="collections-categories"
          onRetry={onRetry}
        />
        <button 
          onClick={onUseFallback}
          className="mt-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
        >
          Utiliser les collections de démonstration
        </button>
      </div>
    </div>
  );
};
