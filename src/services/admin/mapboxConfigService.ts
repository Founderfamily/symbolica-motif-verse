
import { supabase } from '@/integrations/supabase/client';

export interface MapboxConfig {
  token: string;
  enabled: boolean;
}

/**
 * Service pour gérer la configuration Mapbox côté admin
 */
export const mapboxConfigService = {
  /**
   * Récupérer la configuration Mapbox depuis la base de données
   */
  getConfig: async (): Promise<MapboxConfig | null> => {
    try {
      const { data, error } = await supabase
        .from('content_sections')
        .select('content')
        .eq('section_key', 'mapbox_config')
        .single();

      if (error || !data?.content) {
        return null;
      }

      const content = data.content as { fr?: string };
      if (!content.fr) {
        return null;
      }

      try {
        return JSON.parse(content.fr) as MapboxConfig;
      } catch {
        return null;
      }
    } catch (error) {
      console.error('Error fetching Mapbox config:', error);
      return null;
    }
  },

  /**
   * Sauvegarder la configuration Mapbox (admin uniquement)
   */
  saveConfig: async (config: MapboxConfig): Promise<void> => {
    const { error } = await supabase
      .from('content_sections')
      .upsert({
        section_key: 'mapbox_config',
        title: {
          fr: 'Configuration Mapbox',
          en: 'Mapbox Configuration'
        },
        content: {
          fr: JSON.stringify(config),
          en: JSON.stringify(config)
        }
      });

    if (error) {
      throw new Error('Failed to save Mapbox configuration');
    }
  }
};
