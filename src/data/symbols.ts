
// src/data/symbols.ts
export interface Symbol {
  name: string;
  culture: string;
  period: string;
  src: string;
  isExternal?: boolean; // Flag to indicate if the image is externally hosted
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
    src: "/images/symbols/fleur-de-lys.png",
  },
  {
    name: "Méandre grec",
    culture: "Grecque",
    period: "Antiquité",
    src: "/images/symbols/greek-meander.png",
  },
  {
    name: "Mandala",
    culture: "Indienne",
    period: "Traditionnelle",
    src: "/images/symbols/mandala.png",
  },
  {
    name: "Symbole Adinkra",
    culture: "Ashanti",
    period: "Traditionnelle",
    src: "/images/symbols/adinkra.png",
  },
  {
    name: "Motif Seigaiha",
    culture: "Japonaise",
    period: "Traditionnelle",
    src: "/images/symbols/seigaiha.png",
  },
  {
    name: "Art aborigène",
    culture: "Aborigène",
    period: "Préhistorique-Contemporain",
    src: "/images/symbols/aboriginal.png",
  },
  {
    name: "Motif viking",
    culture: "Nordique",
    period: "VIIIe-XI siècles",
    src: "/images/symbols/viking.png",
  },
  {
    name: "Arabesque",
    culture: "Islamique",
    period: "Médiévale",
    src: "/images/symbols/arabesque.png",
  },
  {
    name: "Motif aztèque",
    culture: "Mésoaméricaine",
    period: "Précolombienne",
    src: "/images/symbols/aztec.png",
  },
];
