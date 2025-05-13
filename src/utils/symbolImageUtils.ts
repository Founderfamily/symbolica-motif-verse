
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

// Mapping des cultures aux images de réutilisation plus pertinentes
export const cultureToReuseImage: Record<string, string> = {
  "Celtique": "https://images.unsplash.com/photo-1607439039734-c662293d51e3?q=80&w=800",
  "Française": "https://images.unsplash.com/photo-1540162012087-080d9acf0da0?q=80&w=800",
  "Grecque": "https://images.unsplash.com/photo-1603566541830-926010260166?q=80&w=800",
  "Indienne": "https://images.unsplash.com/photo-1534430480872-3498386a78e0?q=80&w=800",
  "Ashanti": "https://images.unsplash.com/photo-1603397023583-74b3ca45222f?q=80&w=800",
  "Japonaise": "https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=800",
  "Aborigène": "https://images.unsplash.com/photo-1535082623926-b39352a03fb7?q=80&w=800",
  "Nordique": "https://images.unsplash.com/photo-1560273313-28f297ab3a66?q=80&w=800",
  "Islamique": "https://images.unsplash.com/photo-1585236243288-126dd5ee0769?q=80&w=800",
  "Mésoaméricaine": "https://images.unsplash.com/photo-1559403128-d1fbe6983f62?q=80&w=800"
};

// Image de remplacement locale en cas d'erreur
export const PLACEHOLDER = "/placeholder.svg";

// Types d'images autorisés
export type ImageType = 'original' | 'pattern' | 'reuse';
