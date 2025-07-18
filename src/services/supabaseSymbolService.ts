import { supabase } from '@/integrations/supabase/client';
import { SymbolData, SymbolImage } from '@/types/supabase';
import { logger } from '@/services/logService';

export class SupabaseSymbolService {
  private async uploadFile(file: File, storagePath: string): Promise<{ data: { path: string } | null; error: any }> {
    try {
      const { data, error } = await supabase.storage
        .from('symbol-images')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        logger.error('Error uploading file', { error, storagePath });
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      logger.error('Error uploading file', { error, storagePath });
      return { data: null, error };
    }
  }

  private generateStoragePath(symbolId: string, imageType: string, originalFileName: string): string {
    const timestamp = Date.now();
    const fileExtension = originalFileName.split('.').pop();
    const baseName = originalFileName.substring(0, originalFileName.lastIndexOf('.'));
    const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9]/g, '_');
    return `${symbolId}/${imageType}/${sanitizedBaseName}_${timestamp}.${fileExtension}`;
  }

  /**
   * Récupère un symbole par son ID
   */
  async getSymbolById(id: string): Promise<SymbolData | null> {
    const { data, error } = await supabase
      .from('symbols')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      logger.error('Error fetching symbol by ID', { error, id });
      throw error;
    }

    return data;
  }

  /**
   * Récupère tous les symboles
   */
  async getAllSymbols(): Promise<SymbolData[]> {
    const { data, error } = await supabase
      .from('symbols')
      .select(`
        *
      `)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching all symbols', { error });
      throw error;
    }

    return data || [];
  }

  /**
   * Récupère les images d'un symbole
   */
  async getSymbolImages(symbolId: string): Promise<SymbolImage[]> {
    const { data, error } = await supabase
      .from('symbol_images')
      .select('*')
      .eq('symbol_id', symbolId);

    if (error) {
      logger.error('Error fetching symbol images', { error, symbolId });
      return [];
    }

    return data || [];
  }

  /**
   * Ajoute une nouvelle image à un symbole
   */
  async addSymbolImage(
    symbolId: string,
    imageType: 'original' | 'pattern' | 'reuse',
    file: File,
    title: string,
    description: string | null,
    uploadedBy: string | null,
    location: string | null,
    source: string | null,
    tags: string[] | null,
    is_primary: boolean | null,
    translations: any | null
  ): Promise<SymbolImage | null> {
    const storagePath = this.generateStoragePath(symbolId, imageType, file.name);
    const uploadResult = await this.uploadFile(file, storagePath);

    if (uploadResult.error) {
      throw uploadResult.error;
    }

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/symbol-images/${storagePath}`;

    const { data, error } = await supabase
      .from('symbol_images')
      .insert([
        {
          symbol_id: symbolId,
          image_url: imageUrl,
          image_type: imageType,
          title: title,
          description: description,
          uploaded_by: uploadedBy,
          location: location,
          source: source,
          tags: tags,
          is_primary: is_primary,
          translations: translations
        }
      ])
      .select('*')
      .single();

    if (error) {
      logger.error('Error adding symbol image', { error, symbolId, imageType, imageUrl });
      throw error;
    }

    return data;
  }

  /**
   * Met à jour une image de symbole existante
   */
  async updateSymbolImage(
    imageId: string,
    updates: Partial<SymbolImage>
  ): Promise<SymbolImage | null> {
    const { data, error } = await supabase
      .from('symbol_images')
      .update(updates)
      .eq('id', imageId)
      .select('*')
      .single();

    if (error) {
      logger.error('Error updating symbol image', { error, imageId, updates });
      throw error;
    }

    return data;
  }

  /**
   * Supprime une image de symbole
   */
  async deleteSymbolImage(imageId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('symbol_images')
      .delete()
      .eq('id', imageId);

    if (error) {
      logger.error('Error deleting symbol image', { error, imageId });
      throw error;
    }

    return true;
  }

  /**
   * Crée un nouveau symbole
   */
  async createSymbol(symbolData: Omit<SymbolData, 'id'>): Promise<SymbolData | null> {
    const { data, error } = await supabase
      .from('symbols')
      .insert([symbolData])
      .select('*')
      .single();

    if (error) {
      logger.error('Error creating symbol', { error, symbolData });
      throw error;
    }

    return data;
  }

  /**
   * Met à jour un symbole existant
   */
  async updateSymbol(id: string, updates: Partial<SymbolData>): Promise<SymbolData | null> {
    const { data, error } = await supabase
      .from('symbols')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      logger.error('Error updating symbol', { error, id, updates });
      throw error;
    }

    return data;
  }

  /**
   * Supprime un symbole
   */
  async deleteSymbol(id: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('symbols')
      .delete()
      .eq('id', id);

    if (error) {
      logger.error('Error deleting symbol', { error, id });
      throw error;
    }

    return true;
  }

  /**
   * Recherche de symboles avec filtres hiérarchiques
   */
  async searchSymbols(
    query?: string,
    region?: string,
    periodGroup?: string,
    cultureFamily?: string,
    tags?: string[]
  ): Promise<SymbolData[]> {
    let queryBuilder = supabase
      .from('symbols')
      .select('*');

    if (query) {
      queryBuilder = queryBuilder.ilike('name', `%${query}%`);
    }

    if (region) {
      queryBuilder = queryBuilder.eq('culture', region);
    }

    if (periodGroup) {
      queryBuilder = queryBuilder.eq('period', periodGroup);
    }

    if (cultureFamily) {
      queryBuilder = queryBuilder.eq('culture', cultureFamily);
    }

    if (tags && tags.length > 0) {
      // Use the 'cs' (contains) operator to find symbols where the 'tags' array contains ALL of the specified tags
      queryBuilder = queryBuilder.contains('tags', tags);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      logger.error('Error searching symbols', { error, query, region, periodGroup, cultureFamily, tags });
      throw error;
    }

    return data || [];
  }

  /**
   * Trouve un symbole par son nom
   */
  async findSymbolByName(name: string): Promise<SymbolData | null> {
    const { data, error } = await supabase
      .from('symbols')
      .select('*')
      .eq('name', name)
      .maybeSingle();

    if (error) {
      logger.error('Error finding symbol by name', { error, name });
      return null;
    }

    return data;
  }

  /**
   * Incrémente le compteur de vues d'un symbole (désactivé pour l'instant)
   */
  async incrementViewCount(symbolId: string): Promise<void> {
    // Function disabled until database function is created
    logger.info('View count increment requested', { symbolId });
  }
}

export const supabaseSymbolService = new SupabaseSymbolService();
