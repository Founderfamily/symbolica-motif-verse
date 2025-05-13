
// src/data/symbols.ts
// Utilisation d'URLs externes pour une meilleure compatibilité avec le déploiement
// et ajout de fallbacks vers des images locales

export interface Symbol {
  name: string;
  culture: string;
  period: string;
  src: string; // URL externe ou chemin local
  isExternal: boolean;
}

export const SYMBOLS: Symbol[] = [
  {
    name: "Triskèle celtique",
    culture: "Celtique",
    period: "Âge du Fer",
    src: "/images/symbols/triskelion.png",
    isExternal: false,
  },
  {
    name: "Fleur de Lys",
    culture: "Française",
    period: "Moyen Âge",
    src: "/images/symbols/fleur-de-lys.png",
    isExternal: false,
  },
  {
    name: "Méandre grec",
    culture: "Grecque",
    period: "Antiquité",
    src: "/images/symbols/greek-meander.png",
    isExternal: false,
  },
  {
    name: "Mandala",
    culture: "Indienne",
    period: "Traditionnelle",
    src: "/images/symbols/mandala.png",
    isExternal: false,
  },
  {
    name: "Symbole Adinkra",
    culture: "Ashanti",
    period: "Traditionnelle",
    src: "/images/symbols/adinkra.png",
    isExternal: false,
  },
  {
    name: "Motif Seigaiha",
    culture: "Japonaise",
    period: "Traditionnelle",
    src: "/images/symbols/seigaiha.png",
    isExternal: false,
  },
  {
    name: "Art aborigène",
    culture: "Aborigène",
    period: "Préhistorique-Contemporain",
    src: "/images/symbols/aboriginal.png",
    isExternal: false,
  },
  {
    name: "Motif viking",
    culture: "Nordique",
    period: "VIIIe-XI siècles",
    src: "/images/symbols/viking.png",
    isExternal: false,
  },
  {
    name: "Arabesque",
    culture: "Islamique",
    period: "Médiévale",
    src: "/images/symbols/arabesque.png",
    isExternal: false,
  },
  {
    name: "Motif aztèque",
    culture: "Mésoaméricaine",
    period: "Précolombienne",
    src: "/images/symbols/aztec.png",
    isExternal: false,
  },
  // Nouveaux symboles ajoutés - utilisant des images externes mais avec fallbacks possibles
  {
    name: "Yin et Yang",
    culture: "Chinoise",
    period: "Antiquité",
    src: "https://images.unsplash.com/photo-1493884752013-d0e5eb8b8178?q=80&w=800",
    isExternal: true,
  },
  {
    name: "Ankh",
    culture: "Égyptienne",
    period: "Antiquité",
    src: "https://images.unsplash.com/photo-1553545985-1e0d8781d5db?q=80&w=800",
    isExternal: true,
  },
  {
    name: "Totem",
    culture: "Amérindienne",
    period: "Traditionnelle",
    src: "https://images.unsplash.com/photo-1610676254245-944ed74eaab9?q=80&w=800",
    isExternal: true,
  },
  {
    name: "Hamsa",
    culture: "Moyen-Orientale",
    period: "Traditionnelle",
    src: "https://images.unsplash.com/photo-1592878050892-6471f62255ff?q=80&w=800",
    isExternal: true,
  },
  {
    name: "Nœud celtique",
    culture: "Celtique",
    period: "Médiévale",
    src: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=800",
    isExternal: true,
  },
  {
    name: "Dreamcatcher",
    culture: "Amérindienne",
    period: "Traditionnelle",
    src: "https://images.unsplash.com/photo-1577191087923-afa9393e2c22?q=80&w=800",
    isExternal: true,
  },
  {
    name: "Om",
    culture: "Indienne",
    period: "Traditionnelle",
    src: "https://images.unsplash.com/photo-1601811273613-4b5d3b4eb15e?q=80&w=800",
    isExternal: true,
  },
  {
    name: "Sashiko",
    culture: "Japonaise",
    period: "Edo",
    src: "https://images.unsplash.com/photo-1597837267439-d70441d76fec?q=80&w=800",
    isExternal: true,
  },
  {
    name: "Croix de Brigid",
    culture: "Irlandaise",
    period: "Médiévale",
    src: "https://images.unsplash.com/photo-1561016444-14f747499547?q=80&w=800",
    isExternal: true,
  },
  {
    name: "Pétroglyph Maori",
    culture: "Maorie",
    period: "Traditionnelle",
    src: "https://images.unsplash.com/photo-1585178856860-21f67d229fe7?q=80&w=800",
    isExternal: true,
  }
];
