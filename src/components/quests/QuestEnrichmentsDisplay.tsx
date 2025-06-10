
import React, { useState, useEffect } from 'react';
import { masterExplorerService } from '@/services/masterExplorerService';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Camera, 
  Lightbulb, 
  Archive, 
  ExternalLink,
  Crown,
  Star,
  Calendar,
  User
} from 'lucide-react';

interface QuestEnrichment {
  id: string;
  quest_id: string;
  enriched_by: string;
  enrichment_type: string;
  enrichment_data: Record<string, any>;
  title: string;
  description?: string;
  source_url?: string;
  credibility_score: number;
  is_official: boolean;
  created_at: string;
  updated_at: string;
  enricher?: {
    username?: string;
    full_name?: string;
  };
}

interface QuestEnrichmentsDisplayProps {
  questId: string;
}

const QuestEnrichmentsDisplay: React.FC<QuestEnrichmentsDisplayProps> = ({ questId }) => {
  const [enrichments, setEnrichments] = useState<QuestEnrichment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEnrichments();
  }, [questId]);

  const loadEnrichments = async () => {
    try {
      setIsLoading(true);
      const data = await masterExplorerService.getQuestEnrichments(questId);
      setEnrichments(data || []);
    } catch (error) {
      console.error('Error loading enrichments:', error);
      setEnrichments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getEnrichmentIcon = (type: string) => {
    switch (type) {
      case 'evidence': return <Camera className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      case 'theory': return <Lightbulb className="w-4 h-4" />;
      case 'guidance': return <Archive className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getEnrichmentColor = (type: string) => {
    switch (type) {
      case 'evidence': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'document': return 'bg-green-100 text-green-800 border-green-200';
      case 'theory': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'guidance': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'evidence': return 'Preuve';
      case 'document': return 'Document';
      case 'theory': return 'Théorie';
      case 'guidance': return 'Guidance';
      default: return type;
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-slate-200 rounded"></div>
            <div className="h-3 bg-slate-200 rounded w-5/6"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (enrichments.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Archive className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-600 mb-2">Aucun contenu expert</h3>
        <p className="text-sm text-slate-500">
          Cette quête n'a pas encore été enrichie par un Master Explorer.
        </p>
      </Card>
    );
  }

  // Grouper par type
  const groupedEnrichments = enrichments.reduce((acc: Record<string, QuestEnrichment[]>, enrichment) => {
    const type = enrichment.enrichment_type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(enrichment);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Crown className="w-6 h-6 text-amber-600" />
        <h3 className="text-xl font-semibold text-slate-800">Contenu Expert Master Explorer</h3>
        <Badge className="bg-amber-100 text-amber-800">
          {enrichments.length} contribution{enrichments.length > 1 ? 's' : ''}
        </Badge>
      </div>

      {Object.entries(groupedEnrichments).map(([type, typeEnrichments]) => (
        <Card key={type} className="overflow-hidden">
          <div className={`px-6 py-4 border-b ${getEnrichmentColor(type)} bg-opacity-50`}>
            <div className="flex items-center gap-3">
              {getEnrichmentIcon(type)}
              <h4 className="text-lg font-semibold">
                {getTypeLabel(type)}s Expert{typeEnrichments.length > 1 ? 's' : ''}
              </h4>
              <Badge variant="outline" className="bg-white">
                {typeEnrichments.length}
              </Badge>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {typeEnrichments.map((enrichment) => (
              <div key={enrichment.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h5 className="text-lg font-medium text-slate-800 mb-1">
                      {enrichment.title}
                    </h5>
                    {enrichment.is_official && (
                      <Badge className="bg-emerald-100 text-emerald-800 text-xs">
                        <Crown className="w-3 h-3 mr-1" />
                        Contenu Officiel
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Star className="w-3 h-3" />
                    <span>{enrichment.credibility_score}/1.0</span>
                  </div>
                </div>

                {enrichment.description && (
                  <p className="text-slate-600 mb-3 leading-relaxed">
                    {enrichment.description}
                  </p>
                )}

                {enrichment.enrichment_data && Object.keys(enrichment.enrichment_data).length > 0 && (
                  <div className="bg-slate-50 rounded-lg p-3 mb-3">
                    <h6 className="text-sm font-medium text-slate-700 mb-2">Données historiques :</h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {Object.entries(enrichment.enrichment_data).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-slate-600 capitalize">
                            {key.replace(/_/g, ' ')} :
                          </span>
                          <span className="text-slate-800 font-medium">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{enrichment.enricher?.full_name || enrichment.enricher?.username || 'Expert'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(enrichment.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>

                  {enrichment.source_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => window.open(enrichment.source_url, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Source
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default QuestEnrichmentsDisplay;
