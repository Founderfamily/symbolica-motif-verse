
// Define image types that can be used with the SymbolTriptych component
export type ImageType = 'original' | 'pattern' | 'reuse';

// Placeholder image for symbols
export const PLACEHOLDER = '/placeholder.svg';

// Helper to get an image URL or return a placeholder
export const getImageUrlOrPlaceholder = (url: string | null | undefined): string => {
  if (!url) return PLACEHOLDER;
  
  // If URL starts with 'http', it's an external image
  if (url.startsWith('http')) {
    return url;
  }
  
  // For relative paths, ensure we have the correct format
  return url.startsWith('/') ? url : `/${url}`;
};

// Helper to get the appropriate alt text for an image type
export const getImageAltText = (type: ImageType, symbolName: string): string => {
  switch (type) {
    case 'original':
      return `Original ${symbolName} symbol`;
    case 'pattern':
      return `Pattern based on ${symbolName} symbol`;
    case 'reuse':
      return `Modern reuse of ${symbolName} symbol`;
    default:
      return symbolName;
  }
};
