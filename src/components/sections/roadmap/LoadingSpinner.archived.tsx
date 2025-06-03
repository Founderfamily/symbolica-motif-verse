
import React from 'react';

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-32">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
      <span className="ml-3 text-slate-600">Chargement de la feuille de route...</span>
    </div>
  );
};
