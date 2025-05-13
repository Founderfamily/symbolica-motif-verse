
// Mapping des noms de symboles aux chemins d'images locales
export const symbolToLocalImage: Record<string, string> = {
  "Triskèle celtique": "/images/symbols/triskelion.png",
  "Fleur de Lys": "/images/symbols/fleur-de-lys.png",
  "Méandre grec": "/images/symbols/greek-meander.png",
  "Mandala": "/images/symbols/mandala.png",
  "Symbole Adinkra": "/images/symbols/adinkra.png",
  "Motif Seigaiha": "/images/symbols/seigaiha.png",
  "Art aborigène": "/images/symbols/aboriginal.png",
  "Motif viking": "/images/symbols/viking.png",
  "Arabesque": "/images/symbols/arabesque.png",
  "Motif aztèque": "/images/symbols/aztec.png"
};

// Mapping des cultures aux images de réutilisation plus pertinentes avec des exemples authentiques
export const cultureToReuseImage: Record<string, string> = {
  "Celtique": "https://images.unsplash.com/photo-1566840767200-73c54d10c5f0?q=80&w=800", // Bijoux celtiques
  "Française": "https://images.unsplash.com/photo-1595609403171-aeb9d09db3d4?q=80&w=800", // Architecture française avec fleur de lys
  "Grecque": "https://images.unsplash.com/photo-1586172342228-ecc80ea03d3a?q=80&w=800", // Vase grec avec méandres
  "Indienne": "https://images.unsplash.com/photo-1566066053816-e784ad8add92?q=80&w=800", // Authentique mandala indien
  "Ashanti": "https://images.unsplash.com/photo-1553521041-48ca659adb64?q=80&w=800", // Tissu africain avec motifs Adinkra
  "Japonaise": "https://images.unsplash.com/photo-1624204386084-be798b4aa99c?q=80&w=800", // Tissu japonais avec motif Seigaiha
  "Aborigène": "https://images.unsplash.com/photo-1610020057516-e6e7a5fbbacc?q=80&w=800", // Art aborigène authentique
  "Nordique": "https://images.unsplash.com/photo-1580418717493-93f53b4302df?q=80&w=800", // Gravure viking
  "Islamique": "https://images.unsplash.com/photo-1572056319836-66312adcbee5?q=80&w=800", // Architecture islamique avec arabesques
  "Mésoaméricaine": "https://images.unsplash.com/photo-1665318248932-2d20d5304102?q=80&w=800" // Artisanat aztèque
};

// Image de remplacement locale en cas d'erreur
export const PLACEHOLDER = "/placeholder.svg";

// Types d'images autorisés
export type ImageType = 'original' | 'pattern' | 'reuse';
