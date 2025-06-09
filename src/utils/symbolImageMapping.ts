
import { SymbolData } from '@/types/supabase';

// Mapping statique simple - identique à celui qui fonctionne dans SymbolCard
export const symbolToLocalImage: Record<string, string> = {
  "Triskèle Celtique": "/images/symbols/triskelion.png",
  "Triskèle celtique": "/images/symbols/triskelion.png",
  "Fleur de Lys": "/images/symbols/fleur-de-lys.png",
  "Fleur de lys": "/images/symbols/fleur-de-lys.png",
  "Méandre Grec": "/images/symbols/greek-meander.png",
  "Méandre grec": "/images/symbols/greek-meander.png",
  "Mandala": "/images/symbols/mandala.png",
  "Symbole Adinkra": "/images/symbols/adinkra.png",
  "Adinkra": "/images/symbols/adinkra.png",
  "Motif Seigaiha": "/images/symbols/seigaiha.png",
  "Seigaiha": "/images/symbols/seigaiha.png",
  "Art aborigène": "/images/symbols/aboriginal.png",
  "Motif viking": "/images/symbols/viking.png",
  "Arabesque": "/images/symbols/arabesque.png",
  "Motif aztèque": "/images/symbols/aztec.png",
  "Aztèque": "/images/symbols/aztec.png",
  "Yin Yang": "/images/symbols/mandala.png",
  "Yin et Yang": "/images/symbols/mandala.png",
  "Ankh": "/images/symbols/adinkra.png",
  "Hamsa": "/images/symbols/mandala.png",
  "Attrape-rêves": "/images/symbols/triskelion.png",
  "Dreamcatcher": "/images/symbols/triskelion.png",
  "Om": "/images/symbols/mandala.png",
  "Nœud celtique": "/images/symbols/triskelion.png",
  "Croix celtique": "/images/symbols/triskelion.png",
  "Triskell celtique": "/images/symbols/triskelion.png",
  "Sashiko": "/images/symbols/seigaiha.png",
  "Croix de Brigid": "/images/symbols/triskelion.png"
};

// Fonction simple pour obtenir l'image d'un symbole
export function getSymbolImagePath(symbol: SymbolData): string {
  return symbolToLocalImage[symbol.name] || '/placeholder.svg';
}
