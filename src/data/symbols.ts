
// src/data/symbols.ts
// Utilisation d'URLs externes pour une meilleure compatibilité avec le déploiement

export interface Symbol {
  name: string;
  culture: string;
  period: string;
  src: string; // Toujours une URL externe
  isExternal: boolean; // Toutes les images sont externes
}

export const SYMBOLS: Symbol[] = [
  {
    name: "Triskèle celtique",
    culture: "Celtique",
    period: "Âge du Fer",
    src: "https://images.unsplash.com/photo-1591403716274-b6c83d426fc8?q=80&w=800",
    isExternal: true,
  },
  {
    name: "Fleur de Lys",
    culture: "Française",
    period: "Moyen Âge",
    src: "https://images.unsplash.com/photo-1583623025817-d180a2fe0396?q=80&w=800",
    isExternal: true,
  },
  {
    name: "Méandre grec",
    culture: "Grecque",
    period: "Antiquité",
    src: "https://images.unsplash.com/photo-1594736496525-ab640de34c63?q=80&w=800",
    isExternal: true,
  },
  {
    name: "Mandala",
    culture: "Indienne",
    period: "Traditionnelle",
    src: "https://images.unsplash.com/photo-1545158535-c3f7168c28b6?q=80&w=800",
    isExternal: true,
  },
  {
    name: "Symbole Adinkra",
    culture: "Ashanti",
    period: "Traditionnelle",
    src: "https://images.unsplash.com/photo-1516870214493-a0d44932f5a3?q=80&w=800",
    isExternal: true,
  },
  {
    name: "Motif Seigaiha",
    culture: "Japonaise",
    period: "Traditionnelle",
    src: "https://images.unsplash.com/photo-1557434440-27f99e99abb5?q=80&w=800",
    isExternal: true,
  },
  {
    name: "Art aborigène",
    culture: "Aborigène",
    period: "Préhistorique-Contemporain",
    src: "https://images.unsplash.com/photo-1623682573534-daad80039ca6?q=80&w=800",
    isExternal: true,
  },
  {
    name: "Motif viking",
    culture: "Nordique",
    period: "VIIIe-XI siècles",
    src: "https://images.unsplash.com/photo-1605806616949-1e87b487fc2f?q=80&w=800",
    isExternal: true,
  },
  {
    name: "Arabesque",
    culture: "Islamique",
    period: "Médiévale",
    src: "https://images.unsplash.com/photo-1564999261787-e7c15e5b4a5e?q=80&w=800",
    isExternal: true,
  },
  {
    name: "Motif aztèque",
    culture: "Mésoaméricaine",
    period: "Précolombienne",
    src: "https://images.unsplash.com/photo-1594760467013-64ac2b80b7d3?q=80&w=800",
    isExternal: true,
  },
  // Nouveaux symboles ajoutés
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
