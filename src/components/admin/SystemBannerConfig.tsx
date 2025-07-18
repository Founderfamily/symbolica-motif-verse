
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Save, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface BannerConfig {
  enabled: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
  title: {
    fr: string;
    en: string;
  };
  message: {
    fr: string;
    en: string;
  };
  startDate?: string;
  endDate?: string;
}

const SystemBannerConfig = () => {
  const [config, setConfig] = useState<BannerConfig>({
    enabled: false,
    type: 'info',
    title: { fr: '', en: '' },
    message: { fr: '', en: '' }
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBannerConfig();
  }, []);

  const loadBannerConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('content_sections')
        .select('content')
        .eq('section_key', 'system_banner')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data?.content) {
        const content = data.content as { fr?: string };
        if (content.fr) {
          try {
            const savedConfig = JSON.parse(content.fr);
            setConfig(prev => ({ ...prev, ...savedConfig }));
          } catch (parseError) {
            console.error('Error parsing banner config:', parseError);
          }
        }
      }
    } catch (error) {
      console.error('Error loading banner config:', error);
      toast.error('Impossible de charger la configuration du bandeau');
    } finally {
      setLoading(false);
    }
  };

  const saveBannerConfig = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('content_sections')
        .upsert({
          section_key: 'system_banner',
          title: {
            fr: 'Configuration du bandeau système',
            en: 'System banner configuration'
          },
          subtitle: {
            fr: 'Paramètres d\'affichage du bandeau d\'information',
            en: 'Information banner display settings'
          },
          content: {
            fr: JSON.stringify(config),
            en: JSON.stringify(config)
          }
        });

      if (error) throw error;

      toast.success('Configuration du bandeau sauvegardée');
    } catch (error) {
      console.error('Error saving banner config:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (field: string, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const updateTranslation = (field: 'title' | 'message', language: 'fr' | 'en', value: string) => {
    setConfig(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [language]: value
      }
    }));
  };

  const getBannerIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'error': return <XCircle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getBannerIcon(config.type)}
          Bandeau d'information système
        </CardTitle>
        <CardDescription>
          Configurez le bandeau d'information affiché sur le site
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Activation */}
        <div className="flex items-center space-x-2">
          <Switch
            id="banner-enabled"
            checked={config.enabled}
            onCheckedChange={(checked) => updateConfig('enabled', checked)}
          />
          <Label htmlFor="banner-enabled">Activer le bandeau</Label>
        </div>

        {/* Type de bandeau */}
        <div className="space-y-2">
          <Label>Type de bandeau</Label>
          <Select value={config.type} onValueChange={(value) => updateConfig('type', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="info">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-500" />
                  Information
                </div>
              </SelectItem>
              <SelectItem value="warning">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  Avertissement
                </div>
              </SelectItem>
              <SelectItem value="success">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Succès
                </div>
              </SelectItem>
              <SelectItem value="error">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  Erreur
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Titres */}
        <div className="space-y-4">
          <Label>Titre du bandeau</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title-fr">Français</Label>
              <Input
                id="title-fr"
                value={config.title.fr}
                onChange={(e) => updateTranslation('title', 'fr', e.target.value)}
                placeholder="Titre en français"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title-en">English</Label>
              <Input
                id="title-en"
                value={config.title.en}
                onChange={(e) => updateTranslation('title', 'en', e.target.value)}
                placeholder="Title in English"
              />
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-4">
          <Label>Message du bandeau</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="message-fr">Français</Label>
              <Textarea
                id="message-fr"
                value={config.message.fr}
                onChange={(e) => updateTranslation('message', 'fr', e.target.value)}
                placeholder="Message en français"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message-en">English</Label>
              <Textarea
                id="message-en"
                value={config.message.en}
                onChange={(e) => updateTranslation('message', 'en', e.target.value)}
                placeholder="Message in English"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Dates programmées (optionnel) */}
        <div className="space-y-4">
          <Label>Programmation (optionnel)</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Date de début</Label>
              <Input
                id="start-date"
                type="datetime-local"
                value={config.startDate || ''}
                onChange={(e) => updateConfig('startDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">Date de fin</Label>
              <Input
                id="end-date"
                type="datetime-local"
                value={config.endDate || ''}
                onChange={(e) => updateConfig('endDate', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Aperçu */}
        {config.enabled && config.title.fr && (
          <div className="space-y-2">
            <Label>Aperçu</Label>
            <div className={`rounded-lg border p-4 ${
              config.type === 'info' ? 'bg-blue-50 border-blue-200' :
              config.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
              config.type === 'success' ? 'bg-green-50 border-green-200' :
              'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-medium ${
                    config.type === 'info' ? 'text-blue-900' :
                    config.type === 'warning' ? 'text-yellow-900' :
                    config.type === 'success' ? 'text-green-900' :
                    'text-red-900'
                  }`}>
                    {config.title.fr}
                  </h3>
                  {config.message.fr && (
                    <p className={`text-sm mt-1 ${
                      config.type === 'info' ? 'text-blue-700' :
                      config.type === 'warning' ? 'text-yellow-700' :
                      config.type === 'success' ? 'text-green-700' :
                      'text-red-700'
                    }`}>
                      {config.message.fr}
                    </p>
                  )}
                </div>
                {getBannerIcon(config.type)}
              </div>
            </div>
          </div>
        )}

        {/* Bouton de sauvegarde */}
        <div className="flex justify-end">
          <Button onClick={saveBannerConfig} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemBannerConfig;
