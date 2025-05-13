
import React, { useState } from 'react';
import SymbolList from '@/components/symbols/SymbolList';
import SymbolTriptych from '@/components/symbols/SymbolTriptych';
import { useAuth } from '@/hooks/useAuth';

const SymbolTriptychSection: React.FC = () => {
  const [selectedSymbolId, setSelectedSymbolId] = useState<string | null>(null);
  const { isAdmin } = useAuth();

  return (
    <section className="relative mt-12 mb-20">
      {/* Bandeau muséal & communautaire */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur px-6 py-3 rounded-full border border-slate-200 z-10 flex items-center space-x-6">
        <div>
          <p className="text-lg font-serif text-slate-800">Musée Symbolica</p>
          <p className="text-sm text-slate-600">Portail collaboratif du patrimoine symbolique</p>
        </div>
        {isAdmin ? (
          <a href="/admin" className="px-4 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition">
            Administration
          </a>
        ) : (
          <button className="px-4 py-1 text-sm font-medium text-white bg-amber-500 rounded hover:bg-amber-600 transition">
            Rejoindre une communauté
          </button>
        )}
      </div>

      {/* Contenu principal */}
      <div className="bg-white border border-slate-200 shadow-md rounded-xl overflow-hidden pt-12">
        <div className="px-6 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar avec liste des symboles */}
            <div className="md:col-span-1 border-r border-slate-200 pr-4">
              <h3 className="text-lg font-serif text-slate-800 mb-4">Symboles</h3>
              <SymbolList 
                onSelectSymbol={setSelectedSymbolId} 
                selectedSymbolId={selectedSymbolId} 
              />
            </div>
            
            {/* Affichage du triptyque */}
            <div className="md:col-span-3">
              <SymbolTriptych symbolId={selectedSymbolId} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SymbolTriptychSection;
