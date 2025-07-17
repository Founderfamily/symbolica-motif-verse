/**
 * Utilitaires pour générer des noms d'images SEO-friendly
 */

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // Décompose les caractères accentués
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^\w\s-]/g, '') // Supprime les caractères spéciaux
    .replace(/\s+/g, '-') // Remplace les espaces par des tirets
    .replace(/-+/g, '-') // Supprime les tirets multiples
    .trim()
    .replace(/^-+|-+$/g, ''); // Supprime les tirets en début/fin
}

export function generateSEOImageTitle(
  symbolName: string,
  imageType: 'original' | 'pattern' | 'reuse',
  imageIndex: number = 1
): string {
  const symbolSlug = generateSlug(symbolName);
  const typeMapping = {
    original: 'original',
    pattern: 'motif',
    reuse: 'moderne'
  };
  
  const typeSlug = typeMapping[imageType];
  return `${symbolSlug}-${typeSlug}-${imageIndex}`;
}

export function generateImageDescription(
  symbolName: string,
  symbolCulture: string,
  imageType: 'original' | 'pattern' | 'reuse'
): string {
  const typeDescriptions = {
    original: `Image originale du symbole ${symbolName} de la culture ${symbolCulture}`,
    pattern: `Motif décoratif extrait du symbole ${symbolName} (${symbolCulture})`,
    reuse: `Interprétation moderne du symbole ${symbolName} issu de la culture ${symbolCulture}`
  };
  
  return typeDescriptions[imageType];
}

export function getNextImageIndex(
  existingImages: Array<{ title: string | null }>,
  imageType: 'original' | 'pattern' | 'reuse'
): number {
  const typeMapping = {
    original: 'original',
    pattern: 'motif',
    reuse: 'moderne'
  };
  
  const typeSlug = typeMapping[imageType];
  
  // Compter les images existantes du même type
  const existingOfType = existingImages.filter(img => 
    img.title && img.title.includes(`-${typeSlug}-`)
  );
  
  return existingOfType.length + 1;
}