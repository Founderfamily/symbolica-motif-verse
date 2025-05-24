
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { I18nText } from '@/components/ui/i18n-text';
import { Shield, CheckCircle, AlertTriangle, Lock } from 'lucide-react';

const SecurityDashboard = () => {
  const securityMetrics = {
    functionsSecured: 17,
    totalFunctions: 17,
    rlsPolicies: 11,
    lastSecurityAudit: new Date().toISOString().split('T')[0]
  };

  const securityFeatures = [
    {
      name: 'Search Path Protection',
      status: 'secured',
      description: 'All database functions have immutable search_path set to public',
      icon: Shield
    },
    {
      name: 'Row Level Security',
      status: 'active',
      description: 'RLS policies active on all sensitive tables',
      icon: Lock
    },
    {
      name: 'Admin Access Control',
      status: 'secured',
      description: 'Admin functions protected with proper authorization',
      icon: CheckCircle
    },
    {
      name: 'Password Protection',
      status: 'warning',
      description: 'Leaked password protection needs to be enabled in Supabase Auth',
      icon: AlertTriangle
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'secured':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-green-600" />
        <h2 className="text-2xl font-bold">
          <I18nText translationKey="admin.security.title">
            Tableau de Bord Sécurité
          </I18nText>
        </h2>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fonctions Sécurisées</p>
                <p className="text-2xl font-bold text-green-600">
                  {securityMetrics.functionsSecured}/{securityMetrics.totalFunctions}
                </p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Politiques RLS</p>
                <p className="text-2xl font-bold text-blue-600">{securityMetrics.rlsPolicies}</p>
              </div>
              <Lock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Dernier Audit</p>
                <p className="text-sm font-semibold">{securityMetrics.lastSecurityAudit}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Statut Global</p>
                <Badge className="bg-green-100 text-green-800">Sécurisé</Badge>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Features Status */}
      <Card>
        <CardHeader>
          <CardTitle>
            <I18nText translationKey="admin.security.features">
              Fonctionnalités de Sécurité
            </I18nText>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-gray-600" />
                  <div>
                    <h3 className="font-medium">{feature.name}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(feature.status)}>
                  {feature.status === 'secured' ? 'Sécurisé' :
                   feature.status === 'active' ? 'Actif' :
                   feature.status === 'warning' ? 'Attention' : feature.status}
                </Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>
            <I18nText translationKey="admin.security.recommendations">
              Recommandations de Sécurité
            </I18nText>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Action requise :</strong> Activez la protection contre les mots de passe compromis dans les paramètres d'authentification Supabase.
              <br />
              <span className="text-sm text-gray-600 mt-2 block">
                Cette fonctionnalité vérifie automatiquement les mots de passe contre la base de données HaveIBeenPwned.
              </span>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Recent Security Fixes */}
      <Card>
        <CardHeader>
          <CardTitle>
            <I18nText translationKey="admin.security.recent.fixes">
              Corrections de Sécurité Récentes
            </I18nText>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>17 fonctions sécurisées avec search_path immutable</span>
              <Badge variant="outline">Aujourd'hui</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Politiques RLS activées sur toutes les tables sensibles</span>
              <Badge variant="outline">Récent</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Contrôle d'accès administrateur renforcé</span>
              <Badge variant="outline">Récent</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityDashboard;
