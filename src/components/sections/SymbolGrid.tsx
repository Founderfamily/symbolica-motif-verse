// src/components/sections/SymbolGrid.tsx
import React, { useState } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface Motif {
  name: string;
  culture: string;
  period: string;
  src: string;
}

const MOTIFS: Motif[] = [
  {
    name: "Triskèle celtique",
    culture: "Celtique",
    period: "Âge du Fer",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Triskele-Symbol3.svg/800px-Triskele-Symbol3.svg.png",
  },
  {
    name: "Fleur de Lys",
    culture: "Française",
    period: "Moyen Âge",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Fleur_de_lys_%28golden%29.svg/800px-Fleur_de_lys_%28golden%29.svg.png",
  },
  {
    name: "Méandre grec",
    culture: "Grecque",
    period: "Antiquité",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Greek_key_pattern.svg/800px-Greek_key_pattern.svg.png",
  },
  {
    name: "Mandala",
    culture: "Indienne",
    period: "Traditionnelle",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Mandala_gross.jpg/800px-Mandala_gross.jpg",
  },
  {
    name: "Symbole Adinkra",
    culture: "Ashanti",
    period: "Traditionnelle",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Adinkra_symbols.jpg/800px-Adinkra_symbols.jpg",
  },
  {
    name: "Motif Seigaiha",
    culture: "Japonaise",
    period: "Traditionnelle",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Seigaiha_pattern.svg/800px-Seigaiha_pattern.svg.png",
  },
  {
    name: "Art aborigène",
    culture: "Aborigène",
    period: "Préhistorique-Contemporain",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Aboriginal_Australian_Art%2C_Australia_Museum_01.jpg/800px-Aboriginal_Australian_Art%2C_Australia_Museum_01.jpg",
  },
  {
    name: "Motif viking",
    culture: "Nordique",
    period: "VIIIe-XI siècles",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Urnes_Orm.jpg/800px-Urnes_Orm.jpg",
  },
  {
    name: "Arabesque",
    culture: "Islamique",
    period: "Médiévale",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Arabesque_Louvre_OA6802.jpg/800px-Arabesque_Louvre_OA6802.jpg",
  },
  {
    name: "Motif aztèque",
    culture: "Mésoaméricaine",
    period: "Précolombienne",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Aztec_calendar_stone_interpretation.svg/800px-Aztec_calendar_stone_interpretation.svg.png",
  },
];

const PLACEHOLDER = "/placeholder.svg";

const SymbolCard: React.FC<{ motif: Motif }> = ({ motif }) => {
  const [error, setError] = useState(false);

  return (
    <div className="rounded-lg overflow-hidden shadow-sm border border-slate-200">
      <AspectRatio ratio={1} className="w-full bg-slate-50">
        <img
          src={error ? PLACEHOLDER : motif.src}
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
          {MOTIFS.map((m, idx) => (
            <SymbolCard key={idx} motif={m} />
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default SymbolGrid;
