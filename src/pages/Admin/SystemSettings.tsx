
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { I18nText } from '@/components/ui/i18n-text';
import { useTranslation } from '@/i18n/useTranslation';
import { Save, Shield, Bell, Server, Database, Download, AlertTriangle } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SystemSettings() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({
    general: {
      siteName: 'Symbolica',
      siteDescription: 'Musée collaboratif du patrimoine symbolique mondial',
      defaultLanguage: 'fr',
      maintenanceMode: false,
      registrationEnabled: true
    },
    security: {
      passwordMinLength: 8,
      sessionTimeout: 24,
      maxLoginAttempts: 5,
      twoFactorEnabled: false,
      ipWhitelist: ''
    },
    notifications: {
      emailNotifications: true,
      adminAlerts: true,
      userWelcomeEmails: true,
      moderationAlerts: true,
      systemAlerts: true
    },
    performance: {
      cacheEnabled: true,
      cacheDuration: 3600,
      compressionEnabled: true,
      cdnEnabled: false,
      maxUploadSize: 5
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      retentionDays: 30,
      backupLocation: 'cloud'
    }
  });

  const handleSave = (section: string) => {
    console.log(`Saving ${section} settings:`, settings[section as keyof typeof settings]);
    // Here you would save to your backend
  };

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          <I18nText translationKey="admin.settings.title">
            Paramètres système
          </I18nText>
        </h1>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">
            <Server className="h-4 w-4 mr-2" />
            <I18nText translationKey="admin.settings.general">
              Général
            </I18nText>
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            <I18nText translationKey="admin.settings.security">
              Sécurité
            </I18nText>
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            <I18nText translationKey="admin.settings.notifications">
              Notifications
            </I18nText>
          </TabsTrigger>
          <TabsTrigger value="performance">
            <Database className="h-4 w-4 mr-2" />
            <I18nText translationKey="admin.settings.performance">
              Performance
            </I18nText>
          </TabsTrigger>
          <TabsTrigger value="backup">
            <Download className="h-4 w-4 mr-2" />
            <I18nText translationKey="admin.settings.backup">
              Sauvegarde
            </I18nText>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="siteName">Nom du site</Label>
                  <Input
                    id="siteName"
                    value={settings.general.siteName}
                    onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="defaultLanguage">Langue par défaut</Label>
                  <Select value={settings.general.defaultLanguage} onValueChange={(value) => updateSetting('general', 'defaultLanguage', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="siteDescription">Description du site</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.general.siteDescription}
                  onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mode maintenance</Label>
                    <p className="text-sm text-muted-foreground">Désactive l'accès public au site</p>
                  </div>
                  <Switch
                    checked={settings.general.maintenanceMode}
                    onCheckedChange={(checked) => updateSetting('general', 'maintenanceMode', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Inscription ouverte</Label>
                    <p className="text-sm text-muted-foreground">Permet aux nouveaux utilisateurs de s'inscrire</p>
                  </div>
                  <Switch
                    checked={settings.general.registrationEnabled}
                    onCheckedChange={(checked) => updateSetting('general', 'registrationEnabled', checked)}
                  />
                </div>
              </div>

              <Button onClick={() => handleSave('general')}>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de sécurité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="passwordMinLength">Longueur minimale du mot de passe</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="sessionTimeout">Expiration de session (heures)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="maxLoginAttempts">Tentatives de connexion maximales</Label>
                <Input
                  id="maxLoginAttempts"
                  type="number"
                  value={settings.security.maxLoginAttempts}
                  onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                />
              </div>

              <div>
                <Label htmlFor="ipWhitelist">Liste blanche IP (une IP par ligne)</Label>
                <Textarea
                  id="ipWhitelist"
                  value={settings.security.ipWhitelist}
                  onChange={(e) => updateSetting('security', 'ipWhitelist', e.target.value)}
                  placeholder="192.168.1.1&#10;10.0.0.1"
                  rows={4}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Authentification à deux facteurs</Label>
                  <p className="text-sm text-muted-foreground">Active 2FA pour tous les administrateurs</p>
                </div>
                <Switch
                  checked={settings.security.twoFactorEnabled}
                  onCheckedChange={(checked) => updateSetting('security', 'twoFactorEnabled', checked)}
                />
              </div>

              <Button onClick={() => handleSave('security')}>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications par email</Label>
                    <p className="text-sm text-muted-foreground">Active l'envoi d'emails automatiques</p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => updateSetting('notifications', 'emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Alertes administrateur</Label>
                    <p className="text-sm text-muted-foreground">Notifications pour les actions importantes</p>
                  </div>
                  <Switch
                    checked={settings.notifications.adminAlerts}
                    onCheckedChange={(checked) => updateSetting('notifications', 'adminAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Emails de bienvenue</Label>
                    <p className="text-sm text-muted-foreground">Email automatique aux nouveaux utilisateurs</p>
                  </div>
                  <Switch
                    checked={settings.notifications.userWelcomeEmails}
                    onCheckedChange={(checked) => updateSetting('notifications', 'userWelcomeEmails', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Alertes de modération</Label>
                    <p className="text-sm text-muted-foreground">Notifications pour les contenus à modérer</p>
                  </div>
                  <Switch
                    checked={settings.notifications.moderationAlerts}
                    onCheckedChange={(checked) => updateSetting('notifications', 'moderationAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Alertes système</Label>
                    <p className="text-sm text-muted-foreground">Notifications pour les erreurs système</p>
                  </div>
                  <Switch
                    checked={settings.notifications.systemAlerts}
                    onCheckedChange={(checked) => updateSetting('notifications', 'systemAlerts', checked)}
                  />
                </div>
              </div>

              <Button onClick={() => handleSave('notifications')}>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Cache activé</Label>
                    <p className="text-sm text-muted-foreground">Améliore les performances du site</p>
                  </div>
                  <Switch
                    checked={settings.performance.cacheEnabled}
                    onCheckedChange={(checked) => updateSetting('performance', 'cacheEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Compression activée</Label>
                    <p className="text-sm text-muted-foreground">Compresse les réponses HTTP</p>
                  </div>
                  <Switch
                    checked={settings.performance.compressionEnabled}
                    onCheckedChange={(checked) => updateSetting('performance', 'compressionEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>CDN activé</Label>
                    <p className="text-sm text-muted-foreground">Utilise un réseau de distribution de contenu</p>
                  </div>
                  <Switch
                    checked={settings.performance.cdnEnabled}
                    onCheckedChange={(checked) => updateSetting('performance', 'cdnEnabled', checked)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="cacheDuration">Durée du cache (secondes)</Label>
                  <Input
                    id="cacheDuration"
                    type="number"
                    value={settings.performance.cacheDuration}
                    onChange={(e) => updateSetting('performance', 'cacheDuration', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="maxUploadSize">Taille max de téléchargement (MB)</Label>
                  <Input
                    id="maxUploadSize"
                    type="number"
                    value={settings.performance.maxUploadSize}
                    onChange={(e) => updateSetting('performance', 'maxUploadSize', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <Button onClick={() => handleSave('performance')}>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de sauvegarde</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Sauvegarde automatique</Label>
                  <p className="text-sm text-muted-foreground">Sauvegarde régulière de la base de données</p>
                </div>
                <Switch
                  checked={settings.backup.autoBackup}
                  onCheckedChange={(checked) => updateSetting('backup', 'autoBackup', checked)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="backupFrequency">Fréquence de sauvegarde</Label>
                  <Select value={settings.backup.backupFrequency} onValueChange={(value) => updateSetting('backup', 'backupFrequency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Toutes les heures</SelectItem>
                      <SelectItem value="daily">Quotidienne</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      <SelectItem value="monthly">Mensuelle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="retentionDays">Rétention (jours)</Label>
                  <Input
                    id="retentionDays"
                    type="number"
                    value={settings.backup.retentionDays}
                    onChange={(e) => updateSetting('backup', 'retentionDays', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="backupLocation">Emplacement de sauvegarde</Label>
                <Select value={settings.backup.backupLocation} onValueChange={(value) => updateSetting('backup', 'backupLocation', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local</SelectItem>
                    <SelectItem value="cloud">Cloud</SelectItem>
                    <SelectItem value="both">Local + Cloud</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2">
                <Button onClick={() => handleSave('backup')}>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger sauvegarde manuelle
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
