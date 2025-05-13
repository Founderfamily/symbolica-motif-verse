
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

// Mapping des cultures aux sources d'images originales authentiques (musées et collections historiques)
export const cultureToMuseumImage: Record<string, string> = {
  "Celtique": "https://images.metmuseum.org/CRDImages/md/original/DP-12480-001.jpg", // Broche triskèle du Metropolitan Museum
  "Française": "https://images.metmuseum.org/CRDImages/es/original/DP-14161-023.jpg", // Fleur de lys sculptée, Met Museum
  "Grecque": "https://images.metmuseum.org/CRDImages/gr/original/DP142208.jpg", // Vase grec avec méandres, Met Museum
  "Indienne": "https://artsandculture.google.com/asset/mandala-of-vajradhatu-tibet/3AE9b5m9OULUhw", // Mandala tibétain, Google Arts & Culture
  "Ashanti": "https://africa.si.edu/collections/objects/21377/adinkra-cloth", // Tissu Adinkra, Smithsonian
  "Japonaise": "https://www.kyohaku.go.jp/eng/syuzou/meihin/senshoku/images/079-2.jpg", // Motif Seigaiha, Kyoto National Museum
  "Aborigène": "https://www.nma.gov.au/exhibitions/aboriginal-art/image-gallery/kangaroo-tailed-person", // Art aborigène, National Museum of Australia
  "Nordique": "https://www.britishmuseum.org/collection/object/H_1904-0702-1", // Artefact viking, British Museum
  "Islamique": "https://www.metmuseum.org/art/collection/search/453345", // Arabesque, Metropolitan Museum
  "Mésoaméricaine": "https://www.britishmuseum.org/collection/object/E_Am-St-399" // Motif aztèque, British Museum
};

// Mapping des cultures aux images de réutilisation contemporaines authentiques
export const cultureToReuseImage: Record<string, string> = {
  "Celtique": "https://images.unsplash.com/photo-1566840767200-73c54d10c5f0?q=80&w=800", // Bijoux celtiques modernes
  "Française": "https://images.unsplash.com/photo-1595609403171-aeb9d09db3d4?q=80&w=800", // Architecture française avec fleur de lys
  "Grecque": "https://images.unsplash.com/photo-1586172342228-ecc80ea03d3a?q=80&w=800", // Vase grec moderne avec méandres
  "Indienne": "https://images.unsplash.com/photo-1566066053816-e784ad8add92?q=80&w=800", // Mandala contemporain
  "Ashanti": "https://images.unsplash.com/photo-1553521041-48ca659adb64?q=80&w=800", // Mode contemporaine avec motifs Adinkra
  "Japonaise": "https://images.unsplash.com/photo-1624204386084-be798b4aa99c?q=80&w=800", // Décoration moderne avec motif Seigaiha
  "Aborigène": "https://images.unsplash.com/photo-1610020057516-e6e7a5fbbacc?q=80&w=800", // Art aborigène contemporain
  "Nordique": "https://images.unsplash.com/photo-1580418717493-93f53b4302df?q=80&w=800", // Tatouage viking moderne
  "Islamique": "https://images.unsplash.com/photo-1572056319836-66312adcbee5?q=80&w=800", // Design d'intérieur avec arabesques
  "Mésoaméricaine": "https://images.unsplash.com/photo-1665318248932-2d20d5304102?q=80&w=800" // Mode contemporaine avec motifs aztèques
};

// Mapping spécifique des symboles aux images de musée (plus précis que par culture)
export const symbolToMuseumImage: Record<string, string> = {
  "Triskèle celtique": "https://www.britishmuseum.org/collection/object/H_1894-0518-22", // Triskèle celtique, British Museum
  "Fleur de Lys": "https://collections.louvre.fr/en/ark:/53355/cl010065969", // Fleur de Lys royale, Louvre
  "Méandre grec": "https://www.metmuseum.org/art/collection/search/247018", // Frise avec méandres, Metropolitan Museum
  "Mandala": "https://www.artic.edu/artworks/78999/mandala-of-the-buddhist-deity-hevajra", // Mandala, Art Institute Chicago
  "Symbole Adinkra": "https://africa.si.edu/collections/objects/21377/adinkra-cloth", // Tissu Adinkra, Smithsonian
  "Motif Seigaiha": "https://www.kyohaku.go.jp/eng/syuzou/meihin/senshoku/index.html", // Kimono avec Seigaiha, Kyoto Museum
  "Art aborigène": "https://nga.gov.au/exhibition/niat07/detail.cfm?IRN=144987", // Peinture aborigène, National Gallery of Australia
  "Motif viking": "https://www.khm.uio.no/english/visit-us/viking-ship-museum/exhibitions/oseberg/oseberg-style.html", // Motif du navire d'Oseberg, Viking Ship Museum
  "Arabesque": "https://www.metmuseum.org/art/collection/search/451402", // Arabesque islamique, Metropolitan Museum
  "Motif aztèque": "https://www.mna.inah.gob.mx/colecciones/piezas-selectas", // Calendrier aztèque, Museo Nacional de Antropología
};

// Sources d'images de remplacement spécifiques aux symboles pour les réutilisations contemporaines
export const symbolToReuseImage: Record<string, string> = {
  "Triskèle celtique": "https://images.unsplash.com/photo-1629585601463-6f8c4bf8d2c5?q=80&w=800", // Bijoux modernes avec triskèle
  "Fleur de Lys": "https://images.unsplash.com/photo-1551888059-56e27a0ce1a1?q=80&w=800", // Design d'intérieur avec fleur de lys
  "Méandre grec": "https://images.unsplash.com/photo-1588603858574-8c20b826b177?q=80&w=800", // Mode contemporaine avec méandre grec
  "Mandala": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800", // Art mural contemporain avec mandala
  "Symbole Adinkra": "https://images.unsplash.com/photo-1602066535998-985fd2682a9d?q=80&w=800", // Mode avec motifs Adinkra
  "Motif Seigaiha": "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=800", // Papier peint moderne avec motif Seigaiha
  "Art aborigène": "https://images.unsplash.com/photo-1617395920324-f2653a568578?q=80&w=800", // Art contemporain inspiré par l'art aborigène
  "Motif viking": "https://images.unsplash.com/photo-1576487236230-6cfca2636ade?q=80&w=800", // Tatouage moderne avec motifs vikings
  "Arabesque": "https://images.unsplash.com/photo-1601276174812-63059b333d90?q=80&w=800", // Carrelage moderne avec arabesques
  "Motif aztèque": "https://images.unsplash.com/photo-1596939917938-78c7a0012d92?q=80&w=800" // Décoration contemporaine avec motifs aztèques
};

// Image de remplacement locale en cas d'erreur
export const PLACEHOLDER = "/placeholder.svg";

// Types d'images autorisés
export type ImageType = 'original' | 'pattern' | 'reuse';

// Fonction pour vérifier la validité d'une URL d'image
export const isValidImageUrl = (url: string): boolean => {
  return url && (
    url.startsWith('http') || 
    url.startsWith('/') || 
    url.startsWith('data:image')
  );
};

// Fonction pour obtenir l'image la plus appropriée selon le type
export const getBestImageForSymbol = (
  symbolName: string, 
  symbolCulture: string, 
  type: ImageType
): string => {
  switch (type) {
    case 'original':
      // Essayer d'abord l'image spécifique au symbole, puis par culture, sinon fallback
      return symbolToMuseumImage[symbolName] || 
             cultureToMuseumImage[symbolCulture] || 
             `https://source.unsplash.com/featured/?${encodeURIComponent(symbolName.toLowerCase())}+historical+artifact`;
    
    case 'pattern':
      // Pour les motifs, utiliser toujours notre collection locale
      return symbolToLocalImage[symbolName] || PLACEHOLDER;
    
    case 'reuse':
      // Essayer l'image spécifique au symbole, puis par culture, sinon fallback
      return symbolToReuseImage[symbolName] || 
             cultureToReuseImage[symbolCulture] || 
             `https://source.unsplash.com/featured/?${encodeURIComponent(symbolCulture.toLowerCase())}+art+contemporary`;
    
    default:
      return PLACEHOLDER;
  }
};
