
import React, { useState } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";

// Configuration simplifiée des motifs avec des images locales
const motifs = [
  { 
    name: "Triskèle celtique", 
    culture: "Celtique",
    period: "Âge du Fer",
    color: "bg-emerald-50",
    imagePath: "/images/symbols/triskelion.png"
  },
  { 
    name: "Fleur de Lys", 
    culture: "Française",
    period: "Moyen Âge",
    color: "bg-blue-50",
    imagePath: "/images/symbols/fleur-de-lys.png"
  },
  { 
    name: "Méandre grec", 
    culture: "Grecque",
    period: "Antiquité",
    color: "bg-cyan-50",
    imagePath: "/images/symbols/greek-meander.png"
  },
  { 
    name: "Mandala", 
    culture: "Indienne",
    period: "Traditionnelle",
    color: "bg-rose-50",
    imagePath: "/images/symbols/mandala.png"
  },
  { 
    name: "Symbole Adinkra", 
    culture: "Ashanti",
    period: "Traditionnelle",
    color: "bg-amber-50",
    imagePath: "/images/symbols/adinkra.png"
  },
  { 
    name: "Motif Seigaiha", 
    culture: "Japonaise",
    period: "Traditionnelle",
    color: "bg-sky-50",
    imagePath: "/images/symbols/seigaiha.png"
  },
  { 
    name: "Art aborigène", 
    culture: "Aborigène",
    period: "Préhistorique-Contemporain",
    color: "bg-orange-50",
    imagePath: "/images/symbols/aboriginal.png"
  },
  { 
    name: "Motif viking", 
    culture: "Nordique",
    period: "VIIIe-XIe siècles",
    color: "bg-slate-50",
    imagePath: "/images/symbols/viking.png"
  },
  { 
    name: "Arabesque", 
    culture: "Islamique",
    period: "Médiévale",
    color: "bg-teal-50",
    imagePath: "/images/symbols/arabesque.png"
  },
  { 
    name: "Motif aztèque", 
    culture: "Mésoaméricaine",
    period: "Précolombienne",
    color: "bg-lime-50",
    imagePath: "/images/symbols/aztec.png"
  }
];

// Image par défaut à utiliser en cas d'échec de chargement
const PLACEHOLDER_IMAGE = "/placeholder.svg";

// Composant pour une carte de symbole individuelle
const SymbolCard = ({ motif }: { motif: typeof motifs[0] }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`rounded-lg overflow-hidden shadow-sm border border-slate-100 ${motif.color}`}>
      <div className="relative w-full aspect-square">
        <AspectRatio ratio={1} className="overflow-hidden">
          <img 
            src={hasError ? PLACEHOLDER_IMAGE : motif.imagePath}
            alt={motif.name}
            className="object-cover w-full h-full"
            onError={() => setHasError(true)}
          />
        </AspectRatio>
      </div>
      <div className="p-2 sm:p-3 bg-white">
        <h4 className="text-xs sm:text-sm font-medium text-slate-800 line-clamp-1">{motif.name}</h4>
        <div className="flex flex-col mt-1">
          <span className="text-[10px] text-slate-600">{motif.culture}</span>
          <span className="text-[9px] text-slate-500">{motif.period}</span>
        </div>
      </div>
    </div>
  );
};

const SymbolGrid = () => {
  return (
    <div className="relative mt-8 md:mt-12 mb-16">
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full border border-slate-200 z-10">
        <span className="text-slate-700 text-sm font-medium">Explorer le patrimoine symbolique mondial</span>
      </div>
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="aspect-video w-full bg-gradient-to-br from-slate-50 to-white p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 w-full">
            {motifs.map((motif, i) => (
              <SymbolCard key={i} motif={motif} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymbolGrid;
