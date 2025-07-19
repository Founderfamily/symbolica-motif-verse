
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, XCircle, Loader2 } from 'lucide-react';
import { useSymbolVerification } from '@/hooks/useSymbolVerification';

interface VerificationTabProps {
  symbolId?: string;
  symbolName?: string;
}

const verificationAPIs = [
  {
    name: 'OpenAI GPT-4',
    description: 'Analyse générale et historique du symbole',
    status: 'pending' as const
  },
  {
    name: 'DeepSeek',
    description: 'Vérification des détails culturels',
    status: 'pending' as const
  },
  {
    name: 'Claude (Anthropic)',
    description: 'Validation des sources historiques',
    status: 'pending' as const
  },
  {
    name: 'Perplexity',
    description: 'Recherche web et vérification croisée',
    status: 'pending' as const
  },
  {
    name: 'Google Gemini',
    description: 'Analyse contextuelle et géographique',
    status: 'pending' as const
  }
];

export function VerificationTab({ symbolId, symbolName }: VerificationTabProps) {
  const [verifying, setVerifying] = useState<string | null>(null);
  const [verifyingAll, setVerifyingAll] = useState(false);
  const { data: verificationData } = useSymbolVerification(symbolId || '');

  const handleVerifyAPI = async (apiName: string) => {
    if (!symbolId) return;
    
    setVerifying(apiName);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setVerifying(null);
  };

  const handleVerifyAll = async () => {
    if (!symbolId) return;
    
    setVerifyingAll(true);
    // Simulate verifying all APIs
    await new Promise(resolve => setTimeout(resolve, 5000));
    setVerifyingAll(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'uncertain':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-slate-300" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800">Vérifié</Badge>;
      case 'uncertain':
        return <Badge className="bg-yellow-100 text-yellow-800">Incertain</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejeté</Badge>;
      default:
        return <Badge variant="outline">En attente</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Section de vérification principale */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Vérification de la véracité (Admin)</h3>
          <Button
            onClick={handleVerifyAll}
            disabled={verifyingAll || !symbolId}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {verifyingAll && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Vérifier tout
          </Button>
        </div>

        {verificationData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Vue d'ensemble</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(verificationData.status)}
                    {getStatusBadge(verificationData.status)}
                  </div>
                  <p className="text-sm text-slate-600">
                    Confiance moyenne: {verificationData.averageConfidence}%
                  </p>
                  <p className="text-xs text-slate-500">
                    {verificationData.verificationCount} vérification(s) effectuée(s)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Détails par API</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Cliquez sur "Vérifier" pour chaque API pour obtenir des détails spécifiques
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Liste des APIs de vérification */}
      <div className="space-y-3">
        {verificationAPIs.map((api) => (
          <Card key={api.name} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {getStatusIcon(api.status)}
                  <h4 className="font-medium">{api.name}</h4>
                  {getStatusBadge(api.status)}
                </div>
                <p className="text-sm text-slate-600">{api.description}</p>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVerifyAPI(api.name)}
                disabled={verifying === api.name || verifyingAll || !symbolId}
              >
                {verifying === api.name && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Vérifier
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
