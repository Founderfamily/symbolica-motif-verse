
export class ContentCleaningService {
  cleanMarkdownFormatting(content: string): string {
    if (!content) return content;
    
    // Nettoie seulement le formatage markdown excessif, pas les caractères normaux
    let cleaned = content
      .replace(/^\s*\*{2,}\s*/gm, '') // Astérisques multiples en début de ligne
      .replace(/\*{3,}/g, '') // Trois astérisques ou plus consécutifs
      .replace(/^\s*-{2,}\s+/gm, '') // Tirets multiples en début de ligne
      .replace(/^\s*•\s+/gm, '') // Puces en début de ligne
      .replace(/^\s*[\d]+\.\s+/gm, '') // Listes numérotées
      .replace(/#{1,6}\s+/g, '') // Titres markdown
      .replace(/`{1,3}/g, '') // Code markdown
      .trim();
    
    // Nettoyer les espaces excessifs uniquement
    cleaned = cleaned
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Triple retours à la ligne
      .replace(/\s{3,}/g, ' ') // Espaces multiples
      .trim();
    
    return cleaned;
  }

  processFieldContent(field: string, content: string, request: any): any {
    if (field === 'clues') {
      try {
        // Pour les indices, on tente de parser directement sans nettoyage
        return JSON.parse(content);
      } catch (parseError) {
        console.warn('Erreur de parsing JSON pour les indices:', parseError);
        console.log('Contenu reçu:', content);
        // En cas d'erreur, on retourne les indices actuels
        return request.currentValue;
      }
    } else if (field === 'target_symbols') {
      // Nettoyage minimal pour les symboles
      const cleanedContent = content.trim();
      return cleanedContent
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0);
    } else {
      // Pour les textes narratifs, appliquer le nettoyage markdown
      return this.cleanMarkdownFormatting(content);
    }
  }
}

export const contentCleaningService = new ContentCleaningService();
