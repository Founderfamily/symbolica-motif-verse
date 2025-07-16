
import { supabase } from '@/integrations/supabase/client';
import { SymbolData, SymbolImage } from '@/types/supabase';

/**
 * Service unifié pour la gestion des symboles via Supabase
 * Remplace le système statique par des requêtes à la base de données
 */
class SupabaseSymbolService {
  /**
   * Récupère un symbole par son UUID
   */
  async getSymbolById(id: string): Promise<SymbolData | null> {
    try {
      const { data, error } = await supabase
        .from('symbols')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération du symbole:', error);
        return null;
      }

      return data as SymbolData;
    } catch (error) {
      console.error('Erreur dans getSymbolById:', error);
      return null;
    }
  }

  /**
   * Récupère tous les symboles
   */
  async getAllSymbols(): Promise<SymbolData[]> {
    try {
      const { data, error } = await supabase
        .from('symbols')
        .select('*')
        .order('name');

      if (error) {
        console.error('Erreur lors de la récupération des symboles:', error);
        return [];
      }

      return data as SymbolData[];
    } catch (error) {
      console.error('Erreur dans getAllSymbols:', error);
      return [];
    }
  }

  /**
   * Récupère les images d'un symbole
   */
  async getSymbolImages(symbolId: string): Promise<SymbolImage[]> {
    try {
      const { data, error } = await supabase
        .from('symbol_images')
        .select('*')
        .eq('symbol_id', symbolId)
        .order('is_primary', { ascending: false })
        .order('created_at');

      if (error) {
        console.error('Erreur lors de la récupération des images:', error);
        return [];
      }

      return data as SymbolImage[];
    } catch (error) {
      console.error('Erreur dans getSymbolImages:', error);
      return [];
    }
  }

  /**
   * Recherche de symboles par nom (pour maintenir la compatibilité)
   */
  async findSymbolByName(name: string): Promise<SymbolData | null> {
    try {
      const { data, error } = await supabase
        .from('symbols')
        .select('*')
        .ilike('name', `%${name}%`)
        .limit(1)
        .single();

      if (error) {
        console.error('Erreur lors de la recherche par nom:', error);
        return null;
      }

      return data as SymbolData;
    } catch (error) {
      console.error('Erreur dans findSymbolByName:', error);
      return null;
    }
  }

  /**
   * Recherche de symboles avec filtres
   */
  async searchSymbols(
    query?: string,
    culture?: string,
    period?: string,
    tags?: string[]
  ): Promise<SymbolData[]> {
    try {
      let queryBuilder = supabase.from('symbols').select('*');

      if (query) {
        queryBuilder = queryBuilder.or(
          `name.ilike.%${query}%,description.ilike.%${query}%`
        );
      }

      if (culture) {
        queryBuilder = queryBuilder.ilike('culture', `%${culture}%`);
      }

      if (period) {
        queryBuilder = queryBuilder.ilike('period', `%${period}%`);
      }

      if (tags && tags.length > 0) {
        queryBuilder = queryBuilder.overlaps('tags', tags);
      }

      const { data, error } = await queryBuilder.order('name');

      if (error) {
        console.error('Erreur lors de la recherche:', error);
        return [];
      }

      return data as SymbolData[];
    } catch (error) {
      console.error('Erreur dans searchSymbols:', error);
      return [];
    }
  }

  /**
   * Mapping des anciens indices vers les nouveaux UUIDs (pour la transition)
   */
  private static readonly LEGACY_INDEX_TO_UUID_MAP: Record<number, string> = {
    0: '550e8400-e29b-41d4-a716-446655440001', // Triskèle Celtique
    1: '550e8400-e29b-41d4-a716-446655440002', // Fleur de Lys
    2: '550e8400-e29b-41d4-a716-446655440003', // Mandala
    3: '550e8400-e29b-41d4-a716-446655440004', // Méandre Grec
    4: '550e8400-e29b-41d4-a716-446655440005', // Symbole Adinkra
    5: '550e8400-e29b-41d4-a716-446655440006', // Motif Seigaiha
    6: '550e8400-e29b-41d4-a716-446655440007', // Yin Yang
    7: '550e8400-e29b-41d4-a716-446655440008', // Ankh
    8: '550e8400-e29b-41d4-a716-446655440009', // Hamsa
    9: '550e8400-e29b-41d4-a716-446655440010', // Attrape-rêves
  };

  /**
   * Convertit un ancien index en UUID (pour la rétrocompatibilité)
   */
  static getLegacyUuidFromIndex(index: number): string | null {
    return this.LEGACY_INDEX_TO_UUID_MAP[index] || null;
  }

  /**
   * Vérifie si une chaîne est un UUID valide
   */
  static isValidUuid(str: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  }
}

export const supabaseSymbolService = new SupabaseSymbolService();
