
import React, { useState, useEffect } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { 
  Palette, Square, Flower2, Atom, Sun, Infinity, 
  CircleDashed, Star, HeartPulse, TreeDeciduous, 
  Waves, Shapes, Compass, Feather, Brush 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Configuration of all the motifs with their respective properties and verified Wikipedia URLs
const motifs = [
  { 
    name: "Triskèle celtique", 
    culture: "Celtique",
    period: "Âge du Fer",
    color: "from-emerald-50 to-emerald-100",
    hoverColor: "group-hover:from-emerald-100 group-hover:to-emerald-200",
    icon: Square,
    bgColor: "bg-emerald-500/10",
    imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Celtic_spiral.svg/240px-Celtic_spiral.svg.png"
  },
  { 
    name: "Fleur de Lys", 
    culture: "Française",
    period: "Moyen Âge",
    color: "from-blue-50 to-indigo-100",
    hoverColor: "group-hover:from-blue-100 group-hover:to-indigo-200",
    icon: Flower2,
    bgColor: "bg-blue-500/10",
    imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Fleur_de_lys_stylized.svg/240px-Fleur_de_lys_stylized.svg.png"
  },
  { 
    name: "Méandre grec", 
    culture: "Grecque",
    period: "Antiquité",
    color: "from-cyan-50 to-cyan-100",
    hoverColor: "group-hover:from-cyan-100 group-hover:to-cyan-200",
    icon: Infinity,
    bgColor: "bg-cyan-500/10",
    imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Greek_meander_black.svg/240px-Greek_meander_black.svg.png"
  },
  { 
    name: "Mandala", 
    culture: "Indienne",
    period: "Traditionnelle",
    color: "from-rose-50 to-orange-100",
    hoverColor: "group-hover:from-rose-100 group-hover:to-orange-200",
    icon: CircleDashed,
    bgColor: "bg-rose-500/10",
    imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/SriYantra.jpg/240px-SriYantra.jpg"
  },
  { 
    name: "Symbole Adinkra", 
    culture: "Ashanti",
    period: "Traditionnelle",
    color: "from-amber-50 to-amber-100",
    hoverColor: "group-hover:from-amber-100 group-hover:to-amber-200",
    icon: Star,
    bgColor: "bg-amber-500/10",
    imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Adinkra_Dwennimmen.svg/240px-Adinkra_Dwennimmen.svg.png"
  },
  { 
    name: "Motif Seigaiha", 
    culture: "Japonaise",
    period: "Traditionnelle",
    color: "from-sky-50 to-sky-100",
    hoverColor: "group-hover:from-sky-100 group-hover:to-sky-200",
    icon: Waves,
    bgColor: "bg-sky-500/10",
    imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Seigaiha_pattern.svg/240px-Seigaiha_pattern.svg.png"
  },
  { 
    name: "Art aborigène", 
    culture: "Aborigène",
    period: "Préhistorique-Contemporain",
    color: "from-orange-50 to-red-100",
    hoverColor: "group-hover:from-orange-100 group-hover:to-red-200",
    icon: Shapes,
    bgColor: "bg-orange-500/10",
    imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Aboriginal_Art_Australia.jpg/240px-Aboriginal_Art_Australia.jpg"
  },
  { 
    name: "Motif viking", 
    culture: "Nordique",
    period: "VIIIe-XIe siècles",
    color: "from-slate-50 to-slate-100",
    hoverColor: "group-hover:from-slate-100 group-hover:to-slate-200",
    icon: Compass,
    bgColor: "bg-slate-500/10",
    imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Oseberg-style.svg/240px-Oseberg-style.svg.png"
  },
  { 
    name: "Arabesque", 
    culture: "Islamique",
    period: "Médiévale",
    color: "from-teal-50 to-teal-100",
    hoverColor: "group-hover:from-teal-100 group-hover:to-teal-200",
    icon: Feather,
    bgColor: "bg-teal-500/10",
    imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Arabesque_Ornament.svg/240px-Arabesque_Ornament.svg.png"
  },
  { 
    name: "Motif aztèque", 
    culture: "Mésoaméricaine",
    period: "Précolombienne",
    color: "from-lime-50 to-green-100",
    hoverColor: "group-hover:from-lime-100 group-hover:to-green-200",
    icon: Sun,
    bgColor: "bg-lime-500/10",
    imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Aztec_Sun_Stone_Replica_cropped.jpg/240px-Aztec_Sun_Stone_Replica_cropped.jpg"
  }
];

// Placeholder image to use when images are loading or fail to load
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=240&h=240&fit=crop&q=80";

const SymbolGrid = () => {
  // Track image loading status
  const [imageStatus, setImageStatus] = useState<Record<string, 'loading' | 'loaded' | 'error'>>({});
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Initialize image loading status on first render
  useEffect(() => {
    // Initialize status for all motifs
    const initialStatus: Record<string, 'loading' | 'loaded' | 'error'> = {};
    motifs.forEach(motif => {
      initialStatus[motif.name] = 'loading';
    });
    setImageStatus(initialStatus);

    // Preload all images
    preloadImages();
  }, []);

  // Function to preload all images
  const preloadImages = () => {
    const preloaded = new Set<string>();
    
    motifs.forEach(motif => {
      const img = new Image();
      img.onload = () => {
        setImageStatus(prev => ({
          ...prev,
          [motif.name]: 'loaded'
        }));
        preloaded.add(motif.name);
        setPreloadedImages(prev => new Set([...prev, motif.name]));
      };
      
      img.onerror = () => {
        console.log(`Failed to preload image: ${motif.name}`);
        setImageStatus(prev => ({
          ...prev,
          [motif.name]: 'error'
        }));
      };
      
      // Add timestamp to prevent caching issues
      img.src = `${motif.imagePath}?t=${new Date().getTime()}`;
      img.crossOrigin = "anonymous";
    });
  };

  // Handle image load success
  const handleImageLoad = (name: string) => {
    setImageStatus(prev => ({
      ...prev,
      [name]: 'loaded'
    }));
  };

  // Handle image load error with toast notification
  const handleImageError = (name: string) => {
    console.log(`Failed to load image: ${name}`);
    setImageStatus(prev => ({
      ...prev,
      [name]: 'error'
    }));
    
    // Only show toast once per session for failed images
    if (!preloadedImages.has(name)) {
      toast({
        variant: "destructive",
        title: "Image non chargée",
        description: `Impossible de charger l'image pour "${name}"`
      });
    }
  };

  // Get image source with fallback to placeholder
  const getImageSource = (motif: (typeof motifs)[0]) => {
    const status = imageStatus[motif.name];
    if (status === 'error') {
      return PLACEHOLDER_IMAGE;
    }
    // Add cache-busting parameter to prevent browser caching issues
    return `${motif.imagePath}?t=${new Date().getTime()}`;
  };

  return (
    <div className="relative mt-8 md:mt-12 mb-16 animate-fade-in">
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full border border-slate-200 z-10">
        <span className="text-slate-700 text-sm font-medium">Explorer le patrimoine symbolique mondial</span>
      </div>
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="aspect-video w-full bg-gradient-to-br from-slate-50 to-white p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 w-full">
            {motifs.map((motif, i) => {
              const isLoading = imageStatus[motif.name] === 'loading';
              const hasError = imageStatus[motif.name] === 'error';
              
              return (
                <div 
                  key={i} 
                  className={`group rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-slate-100 hover:border-slate-200 symbol-card bg-gradient-to-br ${motif.color} ${motif.hoverColor}`}
                  style={{animation: `fade-in 0.5s ease-out ${i * 0.1}s forwards`}}
                >
                  <div className="relative w-full aspect-square">
                    <AspectRatio ratio={1} className="overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        {/* Show shimmer effect during loading */}
                        {isLoading && (
                          <div className="absolute inset-0 bg-slate-100 animate-pulse"></div>
                        )}
                        
                        <img 
                          src={getImageSource(motif)}
                          alt={motif.name}
                          className={`object-cover w-full h-full transform hover:scale-110 transition-transform duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                          onLoad={() => handleImageLoad(motif.name)}
                          onError={() => handleImageError(motif.name)}
                          loading="lazy"
                          crossOrigin="anonymous"
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
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymbolGrid;
