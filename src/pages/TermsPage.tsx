
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, AlertTriangle, Scale } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';

const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          <I18nText translationKey="terms.title">Conditions d'utilisation</I18nText>
        </h1>
        <p className="text-muted-foreground">
          <I18nText translationKey="terms.subtitle">
            Règles et conditions pour l'utilisation de Symbolica Museum
          </I18nText>
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Dernière mise à jour : Décembre 2024
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <I18nText translationKey="terms.acceptance.title">Acceptation des conditions</I18nText>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              En accédant et en utilisant Symbolica Museum, vous acceptez d'être lié par ces 
              conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas 
              utiliser notre service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <I18nText translationKey="terms.community.title">Règles de la communauté</I18nText>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Comportement respectueux</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Respectez tous les membres de la communauté</li>
                <li>Pas de harcèlement, discrimination ou contenu offensant</li>
                <li>Contributions constructives et bienveillantes</li>
                <li>Respect des différences culturelles et religieuses</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Contenu approprié</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Partagez uniquement du contenu culturel et éducatif</li>
                <li>Vérifiez l'exactitude de vos contributions</li>
                <li>Respectez les droits d'auteur et de propriété intellectuelle</li>
                <li>Pas de contenu commercial non autorisé</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-amber-600" />
              <I18nText translationKey="terms.intellectual.title">Propriété intellectuelle</I18nText>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Vos contributions</h4>
              <p className="text-sm text-muted-foreground">
                Vous conservez les droits sur le contenu que vous créez. En le partageant sur 
                Symbolica Museum, vous accordez une licence d'utilisation à des fins éducatives 
                et culturelles.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Notre plateforme</h4>
              <p className="text-sm text-muted-foreground">
                Symbolica Museum et sa technologie sont protégés par des droits de propriété 
                intellectuelle. L'utilisation est limitée aux fins prévues de la plateforme.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <I18nText translationKey="terms.restrictions.title">Restrictions et sanctions</I18nText>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Comportements interdits</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Utilisation abusive ou malveillante de la plateforme</li>
                <li>Tentatives de contournement des mesures de sécurité</li>
                <li>Spam, publicité non autorisée ou contenu répétitif</li>
                <li>Usurpation d'identité ou fausses informations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Sanctions possibles</h4>
              <p className="text-sm text-muted-foreground">
                En cas de violation de ces conditions, nous nous réservons le droit de 
                suspendre ou supprimer votre compte, ainsi que de supprimer tout contenu 
                non conforme.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Pour toute question concernant ces conditions d'utilisation, 
              contactez-nous à : <span className="font-medium">legal@symbolica-museum.org</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsPage;
