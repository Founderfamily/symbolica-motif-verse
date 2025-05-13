
import React from 'react';

const motifs = [
  { 
    name: "Triskèle celtique", 
    culture: "Celtique",
    period: "Âge du Fer"
  },
  { 
    name: "Fleur de Lys", 
    culture: "Française",
    period: "Moyen Âge"
  },
  { 
    name: "Méandre grec", 
    culture: "Grecque",
    period: "Antiquité"
  },
  { 
    name: "Mandala", 
    culture: "Indienne",
    period: "Traditionnelle"
  },
  { 
    name: "Symbole Adinkra", 
    culture: "Ashanti",
    period: "Traditionnelle"
  },
  { 
    name: "Motif Seigaiha", 
    culture: "Japonaise",
    period: "Traditionnelle"
  },
  { 
    name: "Art aborigène", 
    culture: "Aborigène",
    period: "Préhistorique-Contemporain"
  },
  { 
    name: "Motif viking", 
    culture: "Nordique",
    period: "VIIIe-XIe siècles"
  },
  { 
    name: "Arabesque", 
    culture: "Islamique",
    period: "Médiévale"
  },
  { 
    name: "Motif aztèque", 
    culture: "Mésoaméricaine",
    period: "Précolombienne"
  },
  { 
    name: "Motif persan", 
    culture: "Perse",
    period: "Antique-Médiévale"
  },
  { 
    name: "Art déco", 
    culture: "Occidentale",
    period: "1920-1930"
  },
  { 
    name: "Art mucha", 
    culture: "Tchèque",
    period: "Art Nouveau"
  },
  { 
    name: "Motif balinais", 
    culture: "Indonésienne",
    period: "Traditionnelle"
  },
  { 
    name: "Art nouveau", 
    culture: "Européenne",
    period: "1890-1910"
  }
];

const SymbolGrid = () => {
  return (
    <div className="relative mt-8 md:mt-12 mb-16">
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full border border-slate-200 z-10">
        <span className="text-slate-700 text-sm font-medium">Explorer le patrimoine symbolique mondial</span>
      </div>
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="aspect-video w-full bg-slate-50 flex items-center justify-center">
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2 p-4 w-full">
            {motifs.map((motif, i) => (
              <div 
                key={i} 
                className="bg-white rounded-lg aspect-square flex flex-col items-center justify-center overflow-hidden group relative border border-slate-100 hover:border-slate-300 transition-colors"
              >
                <div className="w-3/4 h-3/4 bg-slate-50 rounded-md flex items-center justify-center">
                  <span className="text-xs text-slate-400 text-center px-2">{motif.name}</span>
                </div>
                <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-xs text-center">
                  <span className="font-medium text-slate-800">{motif.name}</span>
                  <span className="text-slate-600 text-[10px]">{motif.culture}</span>
                  <span className="text-slate-500 text-[10px]">{motif.period}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymbolGrid;
