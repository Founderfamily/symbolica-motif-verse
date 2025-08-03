import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { investigationHistoryService, type AIInvestigation } from '@/services/investigationHistoryService';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FileText, Clock, Eye, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AIInvestigationHistoryProps {
  questId: string;
}

export const AIInvestigationHistory: React.FC<AIInvestigationHistoryProps> = ({ questId }) => {
  const [investigations, setInvestigations] = useState<AIInvestigation[]>([]);
  const [selectedInvestigation, setSelectedInvestigation] = useState<AIInvestigation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvestigations();
  }, [questId]);

  const loadInvestigations = async () => {
    try {
      const data = await investigationHistoryService.getQuestInvestigations(questId);
      setInvestigations(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger l'historique des investigations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getInvestigationTypeLabel = (type: string) => {
    switch (type) {
      case 'full_investigation': return 'Investigation Complète';
      case 'search_historical_sources': return 'Sources Historiques';
      case 'generate_theories': return 'Génération de Théories';
      case 'analyze_connections': return 'Analyse des Connexions';
      default: return type;
    }
  };

  const getInvestigationIcon = (type: string) => {
    switch (type) {
      case 'full_investigation': return <Sparkles className="h-4 w-4" />;
      case 'search_historical_sources': return <FileText className="h-4 w-4" />;
      case 'generate_theories': return <Clock className="h-4 w-4" />;
      case 'analyze_connections': return <Eye className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleViewInvestigation = async (investigation: AIInvestigation) => {
    setSelectedInvestigation(investigation);
    
    try {
      await investigationHistoryService.markInvestigationAsViewed(investigation.id);
    } catch (error) {
      console.error('Error marking investigation as viewed:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (investigations.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Aucune investigation IA</h3>
          <p className="text-muted-foreground">
            Lancez votre première investigation IA pour voir l'historique ici.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Liste des investigations */}
      <div className="grid gap-4">
        {investigations.map((investigation) => (
          <Card 
            key={investigation.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleViewInvestigation(investigation)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getInvestigationIcon(investigation.investigation_type)}
                  <CardTitle className="text-sm">
                    {getInvestigationTypeLabel(investigation.investigation_type)}
                  </CardTitle>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {formatDistanceToNow(new Date(investigation.created_at), { 
                    addSuffix: true, 
                    locale: fr 
                  })}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-xs">
                {typeof investigation.result_content === 'object' && investigation.result_content 
                  ? `Investigation basée sur ${(investigation.evidence_used as any[])?.length || 0} preuves`
                  : 'Investigation générée par IA'}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Détail de l'investigation sélectionnée */}
      {selectedInvestigation && (
        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {getInvestigationIcon(selectedInvestigation.investigation_type)}
                {getInvestigationTypeLabel(selectedInvestigation.investigation_type)}
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedInvestigation(null)}
              >
                ✕
              </Button>
            </div>
            <CardDescription>
              Généré le {new Date(selectedInvestigation.created_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="prose prose-sm max-w-none">
                {typeof selectedInvestigation.result_content === 'object' && 
                 selectedInvestigation.result_content &&
                 'investigation' in (selectedInvestigation.result_content as any) ? (
                  <pre className="whitespace-pre-wrap text-sm">
                    {(selectedInvestigation.result_content as any).investigation}
                  </pre>
                ) : (
                  <p>Contenu de l'investigation non disponible</p>
                )}
              </div>
            </ScrollArea>
            
            {/* Informations sur les preuves utilisées */}
            <Separator className="my-4" />
            <div className="text-xs text-muted-foreground">
              <p>
                <strong>Preuves analysées:</strong> {
                  Array.isArray(selectedInvestigation.evidence_used) 
                    ? selectedInvestigation.evidence_used.length
                    : 0
                } éléments
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};