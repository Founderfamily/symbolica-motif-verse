
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { AlertTriangle, Save, Database, Mail, Shield, Settings, Activity, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import BackupManager from '@/components/admin/BackupManager';
import SystemMonitoring from '@/components/admin/SystemMonitoring';
import MaintenanceScheduler from '@/components/admin/MaintenanceScheduler';

interface SystemSettings {
  maintenanceMode: boolean;
  userRegistration: boolean;
  emailNotifications: boolean;
  autoApproveContributions: boolean;
  maxFileSize: string;
  systemMessage: string;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string;
}

const SystemSettings = () => {
  const { user, isAdmin } = useAuth();
  const [settings, setSettings] = useState<SystemSettings>({
    maintenanceMode: false,
    userRegistration: true,
    emailNotifications: true,
    autoApproveContributions: false,
    maxFileSize: '5',
    systemMessage: '',
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('content_sections')
        .select('content')
        .eq('section_key', 'system_settings')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data?.content) {
        const content = data.content as { fr?: string };
        if (content.fr) {
          try {
            const savedSettings = JSON.parse(content.fr);
            setSettings(prev => ({ ...prev, ...savedSettings }));
          } catch (parseError) {
            console.error('Error parsing settings:', parseError);
          }
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les paramètres.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions nécessaires.",
      });
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase
        .from('content_sections')
        .upsert({
          section_key: 'system_settings',
          content: {
            fr: JSON.stringify(settings),
            en: JSON.stringify(settings)
          }
        });

      if (error) throw error;

      toast({
        title: "Paramètres sauvegardés",
        description: "Les paramètres système ont été mis à jour avec succès.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres.",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!isAdmin) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4">
        <AlertTriangle className="h-10 w-10 text-yellow-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Accès restreint</h1>
        <p className="text-muted-foreground">
          Vous devez être administrateur pour accéder à cette page.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres système</h1>
        <p className="text-muted-foreground">
          Gérez la configuration, le monitoring et la maintenance de l'application.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Général
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Sauvegardes
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Maintenance
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Paramètres généraux
              </CardTitle>
              <CardDescription>
                Configuration principale de l'application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="maintenance"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => updateSetting('maintenanceMode', checked)}
                />
                <Label htmlFor="maintenance">Mode maintenance</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="registration"
                  checked={settings.userRegistration}
                  onCheckedChange={(checked) => updateSetting('userRegistration', checked)}
                />
                <Label htmlFor="registration">Autoriser les nouvelles inscriptions</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-approve"
                  checked={settings.autoApproveContributions}
                  onCheckedChange={(checked) => updateSetting('autoApproveContributions', checked)}
                />
                <Label htmlFor="auto-approve">Approuver automatiquement les contributions</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max-file-size">Taille maximale des fichiers (MB)</Label>
                <Input
                  id="max-file-size"
                  type="number"
                  value={settings.maxFileSize}
                  onChange={(e) => updateSetting('maxFileSize', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="system-message">Message système</Label>
                <Textarea
                  id="system-message"
                  placeholder="Message à afficher aux utilisateurs"
                  value={settings.systemMessage}
                  onChange={(e) => updateSetting('systemMessage', e.target.value)}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <SystemMonitoring />
        </TabsContent>

        <TabsContent value="backup">
          <BackupManager />
        </TabsContent>

        <TabsContent value="maintenance">
          <MaintenanceScheduler />
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Configuration email
              </CardTitle>
              <CardDescription>
                Paramètres SMTP pour l'envoi d'emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                />
                <Label htmlFor="email-notifications">Activer les notifications email</Label>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-host">Serveur SMTP</Label>
                  <Input
                    id="smtp-host"
                    value={settings.smtpHost}
                    onChange={(e) => updateSetting('smtpHost', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">Port SMTP</Label>
                  <Input
                    id="smtp-port"
                    value={settings.smtpPort}
                    onChange={(e) => updateSetting('smtpPort', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-user">Utilisateur SMTP</Label>
                  <Input
                    id="smtp-user"
                    value={settings.smtpUser}
                    onChange={(e) => updateSetting('smtpUser', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smtp-password">Mot de passe SMTP</Label>
                  <Input
                    id="smtp-password"
                    type="password"
                    value={settings.smtpPassword}
                    onChange={(e) => updateSetting('smtpPassword', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings;
