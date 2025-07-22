
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, Lock, Database } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';

const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          <I18nText translationKey="privacy.title" ns="privacy">Politique de confidentialité</I18nText>
        </h1>
        <p className="text-muted-foreground">
          <I18nText translationKey="privacy.subtitle" ns="privacy">
            Comment nous protégeons et utilisons vos données personnelles
          </I18nText>
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              <I18nText translationKey="privacy.collection.title" ns="privacy">Collecte des données</I18nText>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Données que nous collectons</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Informations de compte (email, nom d'utilisateur)</li>
                <li>Contributions et contenus partagés</li>
                <li>Données d'utilisation et analytics anonymes</li>
                <li>Cookies techniques nécessaires au fonctionnement</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-green-600" />
              <I18nText translationKey="privacy.usage.title" ns="privacy">Utilisation des données</I18nText>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Pourquoi nous utilisons vos données</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Fournir et améliorer nos services</li>
                <li>Permettre la collaboration communautaire</li>
                <li>Assurer la sécurité de la plateforme</li>
                <li>Communiquer sur les nouvelles fonctionnalités</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-amber-600" />
              <I18nText translationKey="privacy.protection.title" ns="privacy">Protection des données</I18nText>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Mesures de sécurité</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Chiffrement SSL/TLS pour toutes les communications</li>
                <li>Authentification sécurisée via Supabase</li>
                <li>Accès aux données strictement contrôlé</li>
                <li>Sauvegardes régulières et sécurisées</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              <I18nText translationKey="privacy.rights.title" ns="privacy">Vos droits</I18nText>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Droits RGPD</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Droit d'accès à vos données personnelles</li>
                <li>Droit de rectification des informations inexactes</li>
                <li>Droit à l'effacement (droit à l'oubli)</li>
                <li>Droit à la portabilité de vos données</li>
                <li>Droit d'opposition au traitement</li>
              </ul>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm">
                Pour exercer ces droits, contactez-nous à : 
                <span className="font-medium"> privacy@pureplayer.fr</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPage;
