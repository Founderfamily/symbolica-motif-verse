
// src/components/symbols/SymbolCard.tsx
import React, { useState, useEffect } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Symbol } from '@/data/symbols';

// Image de remplacement locale en cas d'erreur
const PLACEHOLDER = "/placeholder.svg";

interface SymbolCardProps {
  motif: Symbol;
}

const SymbolCard: React.FC<SymbolCardProps> = ({ motif }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Réinitialiser l'état d'erreur si le motif change
  useEffect(() => {
    setError(false);
    setLoading(true);
  }, [motif.src]);

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleImageError = () => {
    console.error(`Erreur de chargement de l'image: ${motif.name}`, motif.src);
    setError(true);
    setLoading(false);
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-sm border border-slate-200">
      <AspectRatio ratio={1} className="w-full bg-slate-50">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={error ? PLACEHOLDER : motif.src}
          alt={motif.name}
          className={`object-cover w-full h-full ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onError={handleImageError}
          onLoad={handleImageLoad}
          crossOrigin="anonymous"
        />
      </AspectRatio>
      <div className="p-3 bg-white">
        <h4 className="text-sm font-serif text-slate-900 line-clamp-1">{motif.name}</h4>
        <p className="mt-1 text-xs text-slate-600">
          {motif.culture} · {motif.period}
        </p>
      </div>
    </div>
  );
};

export default SymbolCard;
