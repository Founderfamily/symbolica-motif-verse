
// src/components/symbols/SymbolCard.tsx
import React, { useState } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Symbol } from '@/data/symbols';

// Image de remplacement locale en cas d'erreur
const PLACEHOLDER = "/placeholder.svg";

interface SymbolCardProps {
  motif: Symbol;
}

const SymbolCard: React.FC<SymbolCardProps> = ({ motif }) => {
  const [error, setError] = useState(false);

  // Correction pour le premier symbole qui pointe vers une page Wikimedia et non une image directe
  const imageUrl = motif.name === "Triskèle celtique" 
    ? "/images/symbols/triskelion.png" 
    : motif.src;

  return (
    <div className="rounded-lg overflow-hidden shadow-sm border border-slate-200">
      <AspectRatio ratio={1} className="w-full bg-slate-50">
        <img
          src={error ? PLACEHOLDER : imageUrl}
          alt={motif.name}
          className="object-cover w-full h-full"
          onError={() => setError(true)}
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
