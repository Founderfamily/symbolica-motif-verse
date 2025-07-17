import { supabase } from '@/integrations/supabase/client';
import { generateSEOImageTitle, generateImageDescription } from './seoImageUtils';
import { SymbolImage } from '@/types/supabase';

interface MigrationResult {
  success: boolean;
  updated: number;
  errors: string[];
}

export async function migrateImageTitles(): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: true,
    updated: 0,
    errors: []
  };

  try {
    // Récupérer toutes les images avec leurs symboles
    const { data: images, error: fetchError } = await supabase
      .from('symbol_images')
      .select(`
        id,
        title,
        image_type,
        image_url,
        symbols (
          id,
          name,
          culture
        )
      `)
      .not('symbols', 'is', null);

    if (fetchError) {
      throw fetchError;
    }

    if (!images || images.length === 0) {
      console.log('Aucune image à migrer');
      return result;
    }

    // Grouper par symbole pour compter les indices
    const imagesBySymbol = images.reduce((acc, image) => {
      const symbolId = image.symbols?.id;
      if (!symbolId) return acc;
      
      if (!acc[symbolId]) {
        acc[symbolId] = {
          symbolName: image.symbols.name,
          symbolCulture: image.symbols.culture,
          images: []
        };
      }
      acc[symbolId].images.push(image);
      return acc;
    }, {} as Record<string, { symbolName: string; symbolCulture: string; images: any[] }>);

    // Migrer les titres pour chaque symbole
    for (const [symbolId, symbolData] of Object.entries(imagesBySymbol)) {
      const { symbolName, symbolCulture, images: symbolImages } = symbolData;
      
      // Compter les images par type
      const typeCounters = {
        original: 1,
        pattern: 1,
        reuse: 1
      };

      for (const image of symbolImages) {
        try {
          // Vérifier si l'image a déjà un titre SEO-friendly
          const currentTitle = image.title || '';
          const hasOldTitle = currentTitle.includes('.') || 
                             currentTitle.includes('ChatGPT') || 
                             currentTitle.includes('Image générée') ||
                             currentTitle === '' ||
                             !currentTitle.includes('-');

          if (!hasOldTitle) {
            console.log(`Image ${image.id} déjà migrée, titre: ${currentTitle}`);
            continue;
          }

          const imageType = image.image_type as 'original' | 'pattern' | 'reuse';
          const imageIndex = typeCounters[imageType];
          typeCounters[imageType]++;

          // Générer le nouveau titre SEO-friendly
          const newTitle = generateSEOImageTitle(symbolName, imageType, imageIndex);
          const newDescription = generateImageDescription(symbolName, symbolCulture, imageType);

          // Mettre à jour l'image
          const { error: updateError } = await supabase
            .from('symbol_images')
            .update({
              title: newTitle,
              description: newDescription,
              updated_at: new Date().toISOString()
            })
            .eq('id', image.id);

          if (updateError) {
            throw updateError;
          }

          console.log(`✅ Image ${image.id} migrée: "${currentTitle}" → "${newTitle}"`);
          result.updated++;

        } catch (error) {
          const errorMsg = `Erreur pour l'image ${image.id}: ${error.message}`;
          console.error(errorMsg);
          result.errors.push(errorMsg);
          result.success = false;
        }
      }
    }

    console.log(`Migration terminée: ${result.updated} images mises à jour`);
    if (result.errors.length > 0) {
      console.error(`${result.errors.length} erreurs:`, result.errors);
    }

  } catch (error) {
    console.error('Erreur lors de la migration:', error);
    result.success = false;
    result.errors.push(`Erreur générale: ${error.message}`);
  }

  return result;
}

// Fonction pour migrer une seule image
export async function migrateSingleImageTitle(imageId: string): Promise<boolean> {
  try {
    // Récupérer l'image avec son symbole
    const { data: imageData, error: fetchError } = await supabase
      .from('symbol_images')
      .select(`
        id,
        title,
        image_type,
        symbols (
          id,
          name,
          culture
        )
      `)
      .eq('id', imageId)
      .single();

    if (fetchError || !imageData || !imageData.symbols) {
      throw new Error('Image ou symbole non trouvé');
    }

    // Compter les images existantes du même type pour déterminer l'index
    const { data: existingImages, error: countError } = await supabase
      .from('symbol_images')
      .select('title')
      .eq('symbol_id', imageData.symbols.id)
      .eq('image_type', imageData.image_type);

    if (countError) {
      throw countError;
    }

    const imageType = imageData.image_type as 'original' | 'pattern' | 'reuse';
    const typeMapping = {
      original: 'original',
      pattern: 'motif',
      reuse: 'moderne'
    };
    
    const typeSlug = typeMapping[imageType];
    const existingOfType = existingImages?.filter(img => 
      img.title && img.title.includes(`-${typeSlug}-`)
    ) || [];
    
    const imageIndex = existingOfType.length + 1;

    // Générer le nouveau titre
    const newTitle = generateSEOImageTitle(imageData.symbols.name, imageType, imageIndex);
    const newDescription = generateImageDescription(
      imageData.symbols.name, 
      imageData.symbols.culture, 
      imageType
    );

    // Mettre à jour l'image
    const { error: updateError } = await supabase
      .from('symbol_images')
      .update({
        title: newTitle,
        description: newDescription,
        updated_at: new Date().toISOString()
      })
      .eq('id', imageId);

    if (updateError) {
      throw updateError;
    }

    console.log(`✅ Image ${imageId} migrée vers: "${newTitle}"`);
    return true;

  } catch (error) {
    console.error(`Erreur lors de la migration de l'image ${imageId}:`, error);
    return false;
  }
}