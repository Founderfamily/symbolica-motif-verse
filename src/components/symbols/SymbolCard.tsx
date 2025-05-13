
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

  // Pour les images externes, on utilise directement l'URL complète
  // Pour les images locales, on utilise le chemin relatif qui sera correctement résolu par Vite
  const imageUrl = motif.isExternal ? motif.src : motif.src;

  return (
    <div className="rounded-lg overflow-hidden shadow-sm border border-slate-200">
      <AspectRatio ratio={1} className="w-full bg-slate-50">
        <img
          src={error ? PLACEHOLDER : imageUrl}
          alt={motif.name}
          className="object-cover w-full h-full"
          onError={() => setError(true)}
          crossOrigin={motif.isExternal ? "anonymous" : undefined}
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
