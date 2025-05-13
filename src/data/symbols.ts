
// src/data/symbols.ts
// Import local images directly so Vite can handle them properly during build
import aztecImage from '/images/symbols/aztec.png';
import vikingImage from '/images/symbols/viking.png';
import mandalaImage from '/images/symbols/mandala.png';
import fleurDeLysImage from '/images/symbols/fleur-de-lys.png';
import greekMeanderImage from '/images/symbols/greek-meander.png';
import adinkraImage from '/images/symbols/adinkra.png';
import seigaihaImage from '/images/symbols/seigaiha.png';
import aboriginalImage from '/images/symbols/aboriginal.png';
import arabesqueImage from '/images/symbols/arabesque.png';

export interface Symbol {
  name: string;
  culture: string;
  period: string;
  src: string | any; // Can be a string URL or an imported image
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
    src: fleurDeLysImage,
  },
  {
    name: "Méandre grec",
    culture: "Grecque",
    period: "Antiquité",
    src: greekMeanderImage,
  },
  {
    name: "Mandala",
    culture: "Indienne",
    period: "Traditionnelle",
    src: mandalaImage,
  },
  {
    name: "Symbole Adinkra",
    culture: "Ashanti",
    period: "Traditionnelle",
    src: adinkraImage,
  },
  {
    name: "Motif Seigaiha",
    culture: "Japonaise",
    period: "Traditionnelle",
    src: seigaihaImage,
  },
  {
    name: "Art aborigène",
    culture: "Aborigène",
    period: "Préhistorique-Contemporain",
    src: aboriginalImage,
  },
  {
    name: "Motif viking",
    culture: "Nordique",
    period: "VIIIe-XI siècles",
    src: vikingImage,
  },
  {
    name: "Arabesque",
    culture: "Islamique",
    period: "Médiévale",
    src: arabesqueImage,
  },
  {
    name: "Motif aztèque",
    culture: "Mésoaméricaine",
    period: "Précolombienne",
    src: aztecImage,
  },
];
