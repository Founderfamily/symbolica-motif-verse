
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
      console.log('🔍 [MapboxConfig] Fetching config from database...');
      
      const { data, error } = await supabase
        .from('content_sections')
        .select('content')
        .eq('section_key', 'mapbox_config')
        .single();

      if (error) {
        console.log('⚠️ [MapboxConfig] No config found:', error.message);
        return null;
      }

      if (!data?.content) {
        console.log('⚠️ [MapboxConfig] No content in config');
        return null;
      }

      const content = data.content as { fr?: string | object };
      if (!content.fr) {
        console.log('⚠️ [MapboxConfig] No French content');
        return null;
      }

      try {
        let config: MapboxConfig;
        
        // Gérer les deux cas : chaîne JSON ou objet direct
        if (typeof content.fr === 'string') {
          console.log('🔧 [MapboxConfig] Parsing JSON string...');
          config = JSON.parse(content.fr) as MapboxConfig;
        } else {
          console.log('🔧 [MapboxConfig] Using direct object...');
          config = content.fr as MapboxConfig;
        }
        
        // Valider que la configuration a les propriétés attendues
        if (typeof config.enabled !== 'boolean' || typeof config.token !== 'string') {
          console.error('❌ [MapboxConfig] Invalid config structure:', config);
          return null;
        }
        
        console.log('✅ [MapboxConfig] Config loaded:', { enabled: config.enabled, hasToken: !!config.token });
        return config;
      } catch (parseError) {
        console.error('❌ [MapboxConfig] Failed to parse config:', parseError);
        console.error('❌ [MapboxConfig] Raw content.fr:', content.fr);
        return null;
      }
    } catch (error) {
      console.error('❌ [MapboxConfig] Error fetching config:', error);
      return null;
    }
  },

  /**
   * Sauvegarder la configuration Mapbox (admin uniquement)
   */
  saveConfig: async (config: MapboxConfig): Promise<void> => {
    try {
      console.log('💾 [MapboxConfig] Saving config:', { enabled: config.enabled, hasToken: !!config.token });
      
      // Vérifier d'abord si l'entrée existe
      const { data: existing } = await supabase
        .from('content_sections')
        .select('id')
        .eq('section_key', 'mapbox_config')
        .single();

      const configData = {
        section_key: 'mapbox_config',
        title: {
          fr: 'Configuration Mapbox',
          en: 'Mapbox Configuration'
        },
        content: {
          fr: JSON.stringify(config),
          en: JSON.stringify(config)
        }
      };

      let result;
      
      if (existing) {
        // Mettre à jour l'entrée existante
        console.log('🔄 [MapboxConfig] Updating existing config...');
        result = await supabase
          .from('content_sections')
          .update(configData)
          .eq('section_key', 'mapbox_config');
      } else {
        // Créer une nouvelle entrée
        console.log('➕ [MapboxConfig] Creating new config...');
        result = await supabase
          .from('content_sections')
          .insert([configData]);
      }

      if (result.error) {
        console.error('❌ [MapboxConfig] Database error:', result.error);
        throw new Error(`Failed to save Mapbox configuration: ${result.error.message}`);
      }

      console.log('✅ [MapboxConfig] Config saved successfully');
    } catch (error) {
      console.error('❌ [MapboxConfig] Save error:', error);
      throw error;
    }
  }
};
