
import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const motifs = [
  { 
    name: "Triskèle celtique", 
    color1: "#f5f0e0", 
    color2: "#eaddca",
    pattern: "radial-gradient(circle at 50% 50%, #e5e7eb 1px, transparent 1px)",
    patternSize: "20px"
  },
  { 
    name: "Fleur de Lys", 
    color1: "#f0f5e0", 
    color2: "#d8e8e6",
    pattern: "radial-gradient(circle at 30% 70%, #e5e7eb 1.5px, transparent 1.5px)",
    patternSize: "15px"
  },
  { 
    name: "Méandre grec", 
    color1: "#e0f5f0", 
    color2: "#caeadd",
    pattern: "repeating-linear-gradient(90deg, #e5e7eb 0px, transparent 2px, transparent 10px)",
    patternSize: "12px"
  },
  { 
    name: "Mandala", 
    color1: "#f5e0f0", 
    color2: "#eacad8",
    pattern: "repeating-radial-gradient(circle at 50% 50%, transparent 15px, #e5e7eb 16px, transparent 20px)",
    patternSize: "40px"
  },
  { 
    name: "Symbole Adinkra", 
    color1: "#f5f0d0", 
    color2: "#eaddba",
    pattern: "radial-gradient(circle at 20% 30%, #e5e7eb 2px, transparent 2px)",
    patternSize: "25px"  
  },
  { 
    name: "Motif japonais Seigaiha", 
    color1: "#e0f0f5", 
    color2: "#cadde8",
    pattern: "radial-gradient(circle at 50% 120%, transparent 30%, #e5e7eb 31%, transparent 40%)",
    patternSize: "30px"  
  },
  { 
    name: "Art aborigène", 
    color1: "#f5e8e0", 
    color2: "#eadcca",
    pattern: "radial-gradient(circle at 40% 40%, #e5e7eb 1px, transparent 1px)",
    patternSize: "8px"  
  },
  { 
    name: "Motif viking", 
    color1: "#e0e8f5", 
    color2: "#cad8e8",
    pattern: "repeating-linear-gradient(45deg, transparent, transparent 5px, #e5e7eb 5px, #e5e7eb 6px)",
    patternSize: "15px"  
  },
  { 
    name: "Motif islamique", 
    color1: "#f0f5e8", 
    color2: "#dae8d0",
    pattern: "repeating-radial-gradient(circle at 0% 0%, transparent 0, transparent 10px, #e5e7eb 10px, #e5e7eb 11px)",
    patternSize: "35px"  
  },
  { 
    name: "Motif aztèque", 
    color1: "#f5e0e0", 
    color2: "#eacaca",
    pattern: "repeating-linear-gradient(0deg, transparent, transparent 8px, #e5e7eb 8px, #e5e7eb 9px)",
    patternSize: "20px"  
  },
  { 
    name: "Motif persan", 
    color1: "#e8f0f5", 
    color2: "#d0dae8",
    pattern: "radial-gradient(circle at 25% 25%, #e5e7eb 2px, transparent 2px)",
    patternSize: "22px"  
  },
  { 
    name: "Art déco", 
    color1: "#f0e8f5", 
    color2: "#dacae8",
    pattern: "repeating-linear-gradient(135deg, transparent, transparent 10px, #e5e7eb 10px, #e5e7eb 11px)",
    patternSize: "25px"  
  },
  { 
    name: "Art mucha", 
    color1: "#e8f5e0", 
    color2: "#d0e8ca",
    pattern: "radial-gradient(circle at 60% 60%, #e5e7eb 3px, transparent 3px)",
    patternSize: "28px"  
  },
  { 
    name: "Motif balinais", 
    color1: "#f5e8f0", 
    color2: "#e8d0da",
    pattern: "repeating-radial-gradient(circle at 100% 100%, transparent 0, transparent 15px, #e5e7eb 15px, #e5e7eb 16px)",
    patternSize: "32px"  
  },
  { 
    name: "Art nouveau", 
    color1: "#e0f5e8", 
    color2: "#cae8d0",
    pattern: "radial-gradient(circle at 75% 25%, #e5e7eb 2px, transparent 2px)",
    patternSize: "18px"  
  }
];

const SymbolGrid = () => {
  return (
    <div className="relative mt-8 md:mt-12 mb-16">
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white/50 backdrop-blur-sm px-4 py-1 rounded-full border border-amber-200 z-10">
        <span className="text-amber-800 text-sm font-medium">Des milliers de motifs à découvrir</span>
      </div>
      <div className="bg-white border border-slate-200 shadow-lg rounded-xl overflow-hidden">
        <div className="aspect-video w-full bg-slate-100 flex items-center justify-center">
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2 p-4 w-full">
            {motifs.map((motif, i) => (
              <div 
                key={i} 
                className="bg-amber-50 rounded-lg aspect-square flex items-center justify-center overflow-hidden group relative"
                style={{
                  background: `linear-gradient(${i * 25}deg, ${motif.color1}, ${motif.color2})`
                }}
              >
                <div className="w-3/4 h-3/4 rounded-full bg-opacity-50" 
                  style={{
                    backgroundImage: motif.pattern,
                    backgroundSize: motif.patternSize
                  }}
                />
                <div className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-xs text-center font-medium">
                  {motif.name}
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
