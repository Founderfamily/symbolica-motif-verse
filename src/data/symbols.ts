
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
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Triskele-Symbol-spiral-five-thirds-turns.svg/800px-Triskele-Symbol-spiral-five-thirds-turns.svg.png",
    isExternal: true,
  },
  {
    name: "Fleur de Lys",
    culture: "Française",
    period: "Moyen Âge",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Fleur_de_lys.svg/800px-Fleur_de_lys.svg.png",
    isExternal: true,
  },
  {
    name: "Méandre grec",
    culture: "Grecque",
    period: "Antiquité",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Greek_key_design.svg/800px-Greek_key_design.svg.png",
    isExternal: true,
  },
  {
    name: "Mandala",
    culture: "Indienne",
    period: "Traditionnelle",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Mandala_of_Vajradhatu.jpg/800px-Mandala_of_Vajradhatu.jpg",
    isExternal: true,
  },
  {
    name: "Symbole Adinkra",
    culture: "Ashanti",
    period: "Traditionnelle",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Adinkra_Symbols_from_Ntonso.JPG/800px-Adinkra_Symbols_from_Ntonso.JPG",
    isExternal: true,
  },
  {
    name: "Motif Seigaiha",
    culture: "Japonaise",
    period: "Traditionnelle",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Japanese_Traditional_Pattern_-_Seigaiha.svg/800px-Japanese_Traditional_Pattern_-_Seigaiha.svg.png",
    isExternal: true,
  },
  {
    name: "Art aborigène",
    culture: "Aborigène",
    period: "Préhistorique-Contemporain",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Bradshaw_rock_paintings.jpg/800px-Bradshaw_rock_paintings.jpg",
    isExternal: true,
  },
  {
    name: "Motif viking",
    culture: "Nordique",
    period: "VIIIe-XI siècles",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Urnes_Stave_Church_wood_carving.jpg/800px-Urnes_Stave_Church_wood_carving.jpg",
    isExternal: true,
  },
  {
    name: "Arabesque",
    culture: "Islamique",
    period: "Médiévale",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Alcazar_de_Sevilla_-_Patio_de_las_Doncellas_-_004.jpg/800px-Alcazar_de_Sevilla_-_Patio_de_las_Doncellas_-_004.jpg",
    isExternal: true,
  },
  {
    name: "Motif aztèque",
    culture: "Mésoaméricaine",
    period: "Précolombienne",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Aztec_calendar_stone.svg/800px-Aztec_calendar_stone.svg.png",
    isExternal: true,
  },
];
