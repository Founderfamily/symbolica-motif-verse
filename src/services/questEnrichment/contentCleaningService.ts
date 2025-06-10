
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
    console.log('Traitement du contenu pour le champ:', {
      field,
      contentLength: content?.length,
      contentType: typeof content,
      isJSON: field === 'clues'
    });

    if (field === 'clues') {
      try {
        // Pour les indices, nettoyer d'abord le contenu des balises markdown potentielles
        let cleanedContent = content.trim();
        
        // Retirer les balises de code markdown si présentes
        if (cleanedContent.startsWith('```json') && cleanedContent.endsWith('```')) {
          cleanedContent = cleanedContent.slice(7, -3).trim();
        } else if (cleanedContent.startsWith('```') && cleanedContent.endsWith('```')) {
          cleanedContent = cleanedContent.slice(3, -3).trim();
        }
        
        // Retirer les backticks simples autour du JSON
        if (cleanedContent.startsWith('`') && cleanedContent.endsWith('`')) {
          cleanedContent = cleanedContent.slice(1, -1).trim();
        }
        
        console.log('Contenu nettoyé pour parsing JSON:', {
          original: content.substring(0, 100) + '...',
          cleaned: cleanedContent.substring(0, 100) + '...',
          startsWithBrace: cleanedContent.startsWith('{') || cleanedContent.startsWith('[')
        });
        
        const parsed = JSON.parse(cleanedContent);
        console.log('JSON parsé avec succès:', { type: typeof parsed, isArray: Array.isArray(parsed) });
        return parsed;
      } catch (parseError) {
        console.error('Erreur de parsing JSON pour les indices:', {
          error: parseError.message,
          contentPreview: content.substring(0, 200),
          contentLength: content.length
        });
        console.log('Contenu complet qui a échoué:', content);
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
