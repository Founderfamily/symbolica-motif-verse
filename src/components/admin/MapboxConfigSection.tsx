
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Save, MapPin, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';
import { mapboxConfigService, MapboxConfig } from '@/services/admin/mapboxConfigService';

const MapboxConfigSection = () => {
  const [config, setConfig] = useState<MapboxConfig>({
    token: '',
    enabled: false
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      console.log('🔄 [MapboxConfigSection] Loading configuration...');
      const savedConfig = await mapboxConfigService.getConfig();
      if (savedConfig) {
        setConfig(savedConfig);
        console.log('✅ [MapboxConfigSection] Configuration loaded successfully');
      } else {
        console.log('ℹ️ [MapboxConfigSection] No existing configuration found');
      }
    } catch (error) {
      console.error('❌ [MapboxConfigSection] Error loading config:', error);
      toast({
        variant: "destructive",
        title: "Erreur de chargement",
        description: "Impossible de charger la configuration Mapbox.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config.enabled) {
      setSaving(true);
      try {
        await mapboxConfigService.saveConfig(config);
        setSaveStatus('success');
        toast({
          title: "Configuration sauvegardée",
          description: "La carte Mapbox a été désactivée avec succès.",
        });
      } catch (error) {
        console.error('❌ [MapboxConfigSection] Save error:', error);
        setSaveStatus('error');
        toast({
          variant: "destructive",
          title: "Erreur de sauvegarde",
          description: "Impossible de sauvegarder la configuration Mapbox.",
        });
      } finally {
        setSaving(false);
      }
      return;
    }

    if (!config.token || !config.token.startsWith('pk.')) {
      toast({
        variant: "destructive",
        title: "Token invalide",
        description: "Veuillez entrer un token Mapbox valide (commence par pk.)",
      });
      return;
    }

    setSaving(true);
    setSaveStatus('idle');
    
    try {
      console.log('💾 [MapboxConfigSection] Saving configuration...');
      await mapboxConfigService.saveConfig(config);
      setSaveStatus('success');
      toast({
        title: "Configuration sauvegardée",
        description: "La configuration Mapbox a été mise à jour avec succès.",
      });
      
      // Recharger la configuration pour vérifier
      setTimeout(() => {
        loadConfig();
      }, 1000);
      
    } catch (error) {
      console.error('❌ [MapboxConfigSection] Save error:', error);
      setSaveStatus('error');
      toast({
        variant: "destructive",
        title: "Erreur de sauvegarde",
        description: error instanceof Error ? error.message : "Impossible de sauvegarder la configuration Mapbox.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Configuration Mapbox
        </CardTitle>
        <CardDescription>
          Configurez l'intégration Mapbox pour la fonctionnalité de carte interactive
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="mapbox-enabled"
            checked={config.enabled}
            onCheckedChange={(checked) => {
              setConfig(prev => ({ ...prev, enabled: checked }));
              setSaveStatus('idle');
            }}
          />
          <Label htmlFor="mapbox-enabled">Activer la carte Mapbox</Label>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mapbox-token">Token d'accès Mapbox</Label>
          <Input
            id="mapbox-token"
            type="password"
            placeholder="pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbFhYeSJ9..."
            value={config.token}
            onChange={(e) => {
              setConfig(prev => ({ ...prev, token: e.target.value }));
              setSaveStatus('idle');
            }}
            disabled={!config.enabled}
          />
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Obtenez votre token sur</span>
            <a 
              href="https://account.mapbox.com/access-tokens/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              Mapbox Account
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {config.enabled && config.token && (
          <div className={`border rounded-lg p-4 ${
            saveStatus === 'success' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'
          }`}>
            <div className={`flex items-center gap-2 ${
              saveStatus === 'success' ? 'text-green-700' : 'text-blue-700'
            }`}>
              {saveStatus === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <MapPin className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">
                {saveStatus === 'success' ? 'Configuration sauvegardée' : 'Configuration prête'}
              </span>
            </div>
            <p className={`text-xs mt-1 ${
              saveStatus === 'success' ? 'text-green-600' : 'text-blue-600'
            }`}>
              {saveStatus === 'success' 
                ? 'La carte Mapbox est maintenant disponible sur la page Explorer la carte'
                : 'Cliquez sur "Sauvegarder" pour activer la carte Mapbox'
              }
            </p>
          </div>
        )}

        {saveStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Erreur de sauvegarde</span>
            </div>
            <p className="text-xs text-red-600 mt-1">
              Impossible de sauvegarder la configuration. Vérifiez la console pour plus de détails.
            </p>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSave} 
            disabled={saving || (config.enabled && !config.token)}
            className="min-w-[120px]"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapboxConfigSection;
