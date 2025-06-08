
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Save, MapPin, ExternalLink } from 'lucide-react';
import { mapboxConfigService, MapboxConfig } from '@/services/admin/mapboxConfigService';

const MapboxConfigSection = () => {
  const [config, setConfig] = useState<MapboxConfig>({
    token: '',
    enabled: false
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const savedConfig = await mapboxConfigService.getConfig();
      if (savedConfig) {
        setConfig(savedConfig);
      }
    } catch (error) {
      console.error('Error loading Mapbox config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await mapboxConfigService.saveConfig(config);
      toast({
        title: "Configuration sauvegardée",
        description: "La configuration Mapbox a été mise à jour avec succès.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder la configuration Mapbox.",
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
            onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enabled: checked }))}
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
            onChange={(e) => setConfig(prev => ({ ...prev, token: e.target.value }))}
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
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-700">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">Configuration active</span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              La carte Mapbox est maintenant disponible sur la page Explorer la carte
            </p>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapboxConfigSection;
