import React from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { 
  Palette, Square, Flower2, Atom, Sun, Infinity, 
  CircleDashed, Star, HeartPulse, TreeDeciduous, 
  Waves, Shapes, Compass, Feather, Brush 
} from "lucide-react";

const motifs = [
  { 
    name: "Triskèle celtique", 
    culture: "Celtique",
    period: "Âge du Fer",
    color: "from-emerald-50 to-emerald-100",
    hoverColor: "group-hover:from-emerald-100 group-hover:to-emerald-200",
    icon: Square,
    bgColor: "bg-emerald-500/10",
    image: "https://cdn.pixabay.com/photo/2022/02/07/13/15/celtic-knot-7000013_1280.png"
  },
  { 
    name: "Fleur de Lys", 
    culture: "Française",
    period: "Moyen Âge",
    color: "from-blue-50 to-indigo-100",
    hoverColor: "group-hover:from-blue-100 group-hover:to-indigo-200",
    icon: Flower2,
    bgColor: "bg-blue-500/10",
    image: "https://cdn.pixabay.com/photo/2020/09/14/22/27/flower-5572630_1280.jpg"
  },
  { 
    name: "Méandre grec", 
    culture: "Grecque",
    period: "Antiquité",
    color: "from-cyan-50 to-cyan-100",
    hoverColor: "group-hover:from-cyan-100 group-hover:to-cyan-200",
    icon: Infinity,
    bgColor: "bg-cyan-500/10",
    image: "https://cdn.pixabay.com/photo/2020/01/27/22/14/greek-pattern-4798710_1280.jpg"
  },
  { 
    name: "Mandala", 
    culture: "Indienne",
    period: "Traditionnelle",
    color: "from-rose-50 to-orange-100",
    hoverColor: "group-hover:from-rose-100 group-hover:to-orange-200",
    icon: CircleDashed,
    bgColor: "bg-rose-500/10",
    image: "https://cdn.pixabay.com/photo/2023/05/02/14/52/mandala-7965661_1280.jpg"
  },
  { 
    name: "Symbole Adinkra", 
    culture: "Ashanti",
    period: "Traditionnelle",
    color: "from-amber-50 to-amber-100",
    hoverColor: "group-hover:from-amber-100 group-hover:to-amber-200",
    icon: Star,
    bgColor: "bg-amber-500/10",
    image: "https://cdn.pixabay.com/photo/2018/05/18/13/22/web-3411989_1280.jpg"
  },
  { 
    name: "Motif Seigaiha", 
    culture: "Japonaise",
    period: "Traditionnelle",
    color: "from-sky-50 to-sky-100",
    hoverColor: "group-hover:from-sky-100 group-hover:to-sky-200",
    icon: Waves,
    bgColor: "bg-sky-500/10",
    image: "https://cdn.pixabay.com/photo/2019/06/21/07/49/japan-4288792_1280.jpg"
  },
  { 
    name: "Art aborigène", 
    culture: "Aborigène",
    period: "Préhistorique-Contemporain",
    color: "from-orange-50 to-red-100",
    hoverColor: "group-hover:from-orange-100 group-hover:to-red-200",
    icon: Shapes,
    bgColor: "bg-orange-500/10",
    image: "https://cdn.pixabay.com/photo/2023/08/07/12/44/indigenous-8174449_1280.png"
  },
  { 
    name: "Motif viking", 
    culture: "Nordique",
    period: "VIIIe-XIe siècles",
    color: "from-slate-50 to-slate-100",
    hoverColor: "group-hover:from-slate-100 group-hover:to-slate-200",
    icon: Compass,
    bgColor: "bg-slate-500/10",
    image: "https://cdn.pixabay.com/photo/2020/10/22/04/30/viking-pattern-5674483_1280.png"
  },
  { 
    name: "Arabesque", 
    culture: "Islamique",
    period: "Médiévale",
    color: "from-teal-50 to-teal-100",
    hoverColor: "group-hover:from-teal-100 group-hover:to-teal-200",
    icon: Feather,
    bgColor: "bg-teal-500/10",
    image: "https://cdn.pixabay.com/photo/2021/11/20/07/17/pattern-6811337_1280.jpg"
  },
  { 
    name: "Motif aztèque", 
    culture: "Mésoaméricaine",
    period: "Précolombienne",
    color: "from-lime-50 to-green-100",
    hoverColor: "group-hover:from-lime-100 group-hover:to-green-200",
    icon: Sun,
    bgColor: "bg-lime-500/10",
    image: "https://cdn.pixabay.com/photo/2016/04/13/22/46/aztec-1328070_1280.jpg"
  }
];

const SymbolGrid = () => {
  return (
    <div className="relative mt-8 md:mt-12 mb-16 animate-fade-in">
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full border border-slate-200 z-10">
        <span className="text-slate-700 text-sm font-medium">Explorer le patrimoine symbolique mondial</span>
      </div>
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="aspect-video w-full bg-gradient-to-br from-slate-50 to-white p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 w-full">
            {motifs.map((motif, i) => (
              <div 
                key={i} 
                className={`group rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-slate-100 hover:border-slate-200 symbol-card bg-gradient-to-br ${motif.color} ${motif.hoverColor}`}
                style={{animation: `fade-in 0.5s ease-out ${i * 0.1}s both`}}
              >
                <div className="relative w-full aspect-square">
                  <AspectRatio ratio={1} className="overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img 
                        src={motif.image}
                        alt={motif.name}
                        className="object-cover w-full h-full transform hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </AspectRatio>
                </div>
                <div className="p-2 sm:p-3 bg-white/90 backdrop-blur-sm">
                  <h4 className="text-xs sm:text-sm font-medium text-slate-800 line-clamp-1">{motif.name}</h4>
                  <div className="flex flex-col mt-1">
                    <span className="text-[10px] text-slate-600">{motif.culture}</span>
                    <span className="text-[9px] text-slate-500">{motif.period}</span>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 p-3">
                  <div className="flex flex-col items-center justify-center space-y-1 text-center transform scale-90 group-hover:scale-100 transition-transform">
                    <div className={`p-2 rounded-full ${motif.bgColor} mb-1`}>
                      {React.createElement(motif.icon, { className: "w-4 h-4 text-slate-700", strokeWidth: 1.5 })}
                    </div>
                    <h3 className="font-medium text-xs sm:text-sm text-slate-800">{motif.name}</h3>
                    <p className="text-slate-600 text-[10px] sm:text-[11px]">{motif.culture}</p>
                    <p className="text-slate-500 text-[9px]">{motif.period}</p>
                  </div>
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
