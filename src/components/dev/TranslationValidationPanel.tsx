
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  RefreshCw, 
  Trash2,
  Languages,
  FileText,
  BarChart3
} from 'lucide-react';
import { useTranslationValidation } from '@/i18n/hooks/useTranslationValidation';
import { ValidationIssue } from '@/i18n/services/browserValidationService';

interface TranslationValidationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TranslationValidationPanel: React.FC<TranslationValidationPanelProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { report, isLoading, error, validate, clearCache, hasErrors, hasWarnings, totalIssues } = useTranslationValidation();
  const [selectedSeverity, setSelectedSeverity] = useState<'all' | 'error' | 'warning' | 'info'>('all');

  const getSeverityIcon = (severity: ValidationIssue['severity']) => {
    switch (severity) {
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: ValidationIssue['severity']) => {
    switch (severity) {
      case 'error': return 'destructive';
      case 'warning': return 'outline';
      case 'info': return 'secondary';
    }
  };

  const getTypeLabel = (type: ValidationIssue['type']) => {
    switch (type) {
      case 'missing': return 'Manquant';
      case 'format': return 'Format';
      case 'unused': return 'Inutilisé';
      case 'undefined': return 'Non défini';
    }
  };

  const filteredIssues = report?.issues.filter(issue => 
    selectedSeverity === 'all' || issue.severity === selectedSeverity
  ) || [];

  const groupedIssues = filteredIssues.reduce((acc, issue) => {
    if (!acc[issue.type]) acc[issue.type] = [];
    acc[issue.type].push(issue);
    return acc;
  }, {} as Record<ValidationIssue['type'], ValidationIssue[]>);

  // Skip en production
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5" />
            <CardTitle>Validation des Traductions i18n</CardTitle>
            {report && (
              <Badge variant={hasErrors ? 'destructive' : hasWarnings ? 'outline' : 'secondary'}>
                {totalIssues} problèmes
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={validate}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Validation...' : 'Valider'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearCache}
              disabled={!report}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Effacer Cache
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {report && (
            <Tabs defaultValue="issues" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="issues" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Problèmes ({totalIssues})
                </TabsTrigger>
                <TabsTrigger value="summary" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Résumé
                </TabsTrigger>
                <TabsTrigger value="stats" className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Statistiques
                </TabsTrigger>
              </TabsList>

              <TabsContent value="issues" className="mt-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-gray-600">Filtrer par sévérité:</span>
                    <div className="flex gap-1">
                      {(['all', 'error', 'warning', 'info'] as const).map(severity => (
                        <Button
                          key={severity}
                          variant={selectedSeverity === severity ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedSeverity(severity)}
                        >
                          {severity === 'all' ? 'Tous' : severity}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <ScrollArea className="h-96">
                    {Object.keys(groupedIssues).length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500" />
                        Aucun problème de ce type trouvé !
                      </div>
                    ) : (
                      <div className="space-y-4 pr-4">
                        {Object.entries(groupedIssues).map(([type, issues]) => (
                          <div key={type} className="space-y-2">
                            <h4 className="font-medium text-sm text-gray-700 sticky top-0 bg-white py-1">
                              {getTypeLabel(type as ValidationIssue['type'])} ({issues.length})
                            </h4>
                            {issues.map((issue, idx) => (
                              <div 
                                key={`${issue.key}-${idx}`}
                                className="p-3 border rounded-lg bg-gray-50 space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    {getSeverityIcon(issue.severity)}
                                    <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                                      {issue.key}
                                    </code>
                                  </div>
                                  <Badge variant={getSeverityColor(issue.severity)}>
                                    {issue.severity}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600">{issue.description}</p>
                                {issue.languages.length > 0 && (
                                  <div className="flex gap-1">
                                    {issue.languages.map(lang => (
                                      <Badge key={lang} variant="outline" className="text-xs">
                                        {lang.toUpperCase()}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent value="summary" className="mt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="font-medium">Erreurs</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600">
                      {report.issues.filter(i => i.severity === 'error').length}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <span className="font-medium">Avertissements</span>
                    </div>
                    <p className="text-2xl font-bold text-amber-600">
                      {report.issues.filter(i => i.severity === 'warning').length}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">Infos</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      {report.issues.filter(i => i.severity === 'info').length}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="font-medium">Total</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {totalIssues}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="stats" className="mt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(report.summary.totalKeys).map(([lang, count]) => (
                      <div key={lang} className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Clés {lang.toUpperCase()}</h4>
                        <p className="text-2xl font-bold">{count}</p>
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">
                    Dernière validation: {report.lastValidated.toLocaleString('fr-FR')}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}

          {!report && !isLoading && (
            <div className="text-center py-8">
              <Languages className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">Cliquez sur "Valider" pour analyser les traductions</p>
              <Button onClick={validate}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Démarrer la Validation
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TranslationValidationPanel;
