
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

// Mapping des cultures aux sources d'images originales authentiques (liens directs vers des images de musées)
export const cultureToMuseumImage: Record<string, string> = {
  "Celtique": "https://images.metmuseum.org/CRDImages/md/original/DP-12480-001.jpg", 
  "Française": "https://images.metmuseum.org/CRDImages/es/original/DP-14161-023.jpg",
  "Grecque": "https://images.metmuseum.org/CRDImages/gr/original/DP142208.jpg", 
  "Indienne": "https://www.britishmuseum.org/sites/default/files/styles/uncropped_large/public/2019-10/Mandala-of-Jnanadakini-british-museum-buddhism.jpg",
  "Ashanti": "https://ids.si.edu/ids/deliveryService?id=NMAAHC-2007_7_1-000001", 
  "Japonaise": "https://www.kyohaku.go.jp/eng/syuzou/meihin/senshoku/images/079-2.jpg",
  "Aborigène": "https://www.nma.gov.au/__data/assets/image/0004/573754/001_nma-31066-01-pi.jpg", 
  "Nordique": "https://www.britishmuseum.org/sites/default/files/styles/uncropped_large/public/2019-10/Viking-brooch-Bronze-Norway-British-Museum.jpg", 
  "Islamique": "https://www.metmuseum.org/-/media/images/art/islamic-art/paper-art/57_51_17_28_sf.jpg", 
  "Mésoaméricaine": "https://www.britishmuseum.org/sites/default/files/styles/uncropped_large/public/2019-09/aztec-double-headed-serpent-british-museum-mexico.jpg"
};

// Mapping des cultures aux images de réutilisation contemporaines authentiques
export const cultureToReuseImage: Record<string, string> = {
  "Celtique": "https://images.unsplash.com/photo-1566840767200-73c54d10c5f0?q=80&w=800",
  "Française": "https://images.unsplash.com/photo-1595609403171-aeb9d09db3d4?q=80&w=800",
  "Grecque": "https://images.unsplash.com/photo-1586172342228-ecc80ea03d3a?q=80&w=800", 
  "Indienne": "https://images.unsplash.com/photo-1566066053816-e784ad8add92?q=80&w=800",
  "Ashanti": "https://images.unsplash.com/photo-1553521041-48ca659adb64?q=80&w=800",
  "Japonaise": "https://images.unsplash.com/photo-1624204386084-be798b4aa99c?q=80&w=800",
  "Aborigène": "https://images.unsplash.com/photo-1610020057516-e6e7a5fbbacc?q=80&w=800",
  "Nordique": "https://images.unsplash.com/photo-1580418717493-93f53b4302df?q=80&w=800",
  "Islamique": "https://images.unsplash.com/photo-1572056319836-66312adcbee5?q=80&w=800",
  "Mésoaméricaine": "https://images.unsplash.com/photo-1665318248932-2d20d5304102?q=80&w=800"
};

// Mapping spécifique des symboles aux images de musée (liens directs vers des images)
export const symbolToMuseumImage: Record<string, string> = {
  "Triskèle celtique": "https://www.britishmuseum.org/sites/default/files/styles/uncropped_large/public/2020-02/bronze-triskele-1st-century-bc-winchester-british-museum.jpg",
  "Fleur de Lys": "https://images.metmuseum.org/CRDImages/ad/original/DP105629.jpg", 
  "Méandre grec": "https://images.metmuseum.org/CRDImages/gr/original/DP359184.jpg", 
  "Mandala": "https://www.artic.edu/iiif/2/b3974542-b9d4-7709-bd80-cd6425a9b546/full/843,/0/default.jpg", 
  "Symbole Adinkra": "https://africa.si.edu/collections/objects/21377/adinkra-cloth/image-detail", 
  "Motif Seigaiha": "https://www.kyohaku.go.jp/eng/syuzou/meihin/senshoku/images/079-2.jpg", 
  "Art aborigène": "https://nga.gov.au/exhibitions/niat07/images/abelam-lmed.jpg", 
  "Motif viking": "https://media.britishmuseum.org/media/Repository/Documents/2014_10/8_11/7a250c74_d2f0_4eda_bf51_a3e100b304a6/mid_00366592_001.jpg", 
  "Arabesque": "https://images.metmuseum.org/CRDImages/is/original/DP231524.jpg", 
  "Motif aztèque": "https://www.metmuseum.org/-/media/images/art/collection-landing-page/collection-highlights/ancient-american-art/dp302356.jpg", 
};

// Sources d'images de remplacement spécifiques aux symboles pour les réutilisations contemporaines
export const symbolToReuseImage: Record<string, string> = {
  "Triskèle celtique": "https://images.unsplash.com/photo-1629585601463-6f8c4bf8d2c5?q=80&w=800", 
  "Fleur de Lys": "https://images.unsplash.com/photo-1551888059-56e27a0ce1a1?q=80&w=800", 
  "Méandre grec": "https://images.unsplash.com/photo-1588603858574-8c20b826b177?q=80&w=800", 
  "Mandala": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800", 
  "Symbole Adinkra": "https://images.unsplash.com/photo-1602066535998-985fd2682a9d?q=80&w=800", 
  "Motif Seigaiha": "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=800", 
  "Art aborigène": "https://images.unsplash.com/photo-1617395920324-f2653a568578?q=80&w=800", 
  "Motif viking": "https://images.unsplash.com/photo-1576487236230-6cfca2636ade?q=80&w=800", 
  "Arabesque": "https://images.unsplash.com/photo-1601276174812-63059b333d90?q=80&w=800", 
  "Motif aztèque": "https://images.unsplash.com/photo-1596939917938-78c7a0012d92?q=80&w=800"
};

// Image de remplacement locale en cas d'erreur
export const PLACEHOLDER = "/placeholder.svg";

// Types d'images autorisés
export type ImageType = 'original' | 'pattern' | 'reuse';

// Fonction pour vérifier la validité d'une URL d'image
export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  
  // Vérifier les chemins locaux
  if (url.startsWith('/')) return true;
  
  // Vérifier le placeholder
  if (url === PLACEHOLDER) return true;
  
  try {
    // Vérifier si c'est une URL valide
    const parsedUrl = new URL(url);
    
    // Vérifier si l'URL pointe vers un fichier image
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const lowercaseUrl = url.toLowerCase();
    
    return imageExtensions.some(ext => lowercaseUrl.endsWith(ext)) || 
           lowercaseUrl.includes('/image') || 
           lowercaseUrl.includes('/images');
  } catch (error) {
    return false;
  }
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
