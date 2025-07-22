
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { I18nText } from '@/components/ui/i18n-text';

const LegalPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          <I18nText translationKey="legal.title">Mentions légales</I18nText>
        </h1>
        <p className="text-muted-foreground">
          <I18nText translationKey="legal.subtitle">
            Informations légales et conditions d'utilisation
          </I18nText>
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <I18nText translationKey="legal.company.title">Informations sur l'entreprise</I18nText>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">PurePlayer SAS</h4>
              <p className="text-sm text-muted-foreground">
                Plateforme dédiée à la préservation et à la célébration du patrimoine symbolique mondial.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                266 avenue Daumesnil, 75012 Paris, France
              </p>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold mb-2">Contact</h4>
              <p className="text-sm">Email: contact@pureplayer.fr</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <I18nText translationKey="legal.terms.title">Conditions d'utilisation</I18nText>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Acceptation des conditions</h4>
              <p className="text-sm text-muted-foreground">
                En utilisant cette plateforme, vous acceptez ces conditions d'utilisation dans leur intégralité.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Utilisation du service</h4>
              <p className="text-sm text-muted-foreground">
                Vous vous engagez à utiliser le service de manière respectueuse et conforme aux lois en vigueur.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Propriété intellectuelle</h4>
              <p className="text-sm text-muted-foreground">
                Les contenus partagés restent la propriété de leurs auteurs respectifs. 
                La plateforme facilite le partage dans un but éducatif et culturel.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <I18nText translationKey="legal.liability.title">Limitation de responsabilité</I18nText>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              PurePlayer SAS s'efforce de fournir des informations exactes mais ne peut garantir 
              l'exactitude complète de tous les contenus partagés par la communauté.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LegalPage;
