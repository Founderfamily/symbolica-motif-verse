
import React from 'react';

interface FallbackNoticeProps {
  onRetry: () => void;
}

export const FallbackNotice: React.FC<FallbackNoticeProps> = ({ onRetry }) => {
  return (
    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
      <p className="text-amber-800 text-sm">
        🔧 Mode diagnostic activé - Collections de démonstration affichées. 
        <button 
          onClick={onRetry}
          className="ml-2 underline hover:no-underline"
        >
          Réessayer avec les vraies données
        </button>
      </p>
    </div>
  );
};
