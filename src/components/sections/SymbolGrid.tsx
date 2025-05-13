
// src/components/sections/SymbolGrid.tsx
import React from 'react';
import SymbolCard from '@/components/symbols/SymbolCard';
import { SYMBOLS } from '@/data/symbols';

const SymbolGrid: React.FC = () => (
  <section className="relative mt-12 mb-20">
    {/* Bandeau muséal & communautaire */}
    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur px-6 py-3 rounded-full border border-slate-200 z-10 flex items-center space-x-6">
      <div>
        <p className="text-lg font-serif text-slate-800">Musée Symbolica</p>
        <p className="text-sm text-slate-600">Portail collaboratif du patrimoine symbolique</p>
      </div>
      <button className="px-4 py-1 text-sm font-medium text-white bg-amber-500 rounded hover:bg-amber-600 transition">
        Rejoindre une communauté
      </button>
    </div>

    {/* Grille des motifs */}
    <div className="bg-white border border-slate-200 shadow-md rounded-xl overflow-hidden pt-12">
      <div className="px-6 pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
          {SYMBOLS.map((motif, idx) => (
            <SymbolCard key={idx} motif={motif} />
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default SymbolGrid;
