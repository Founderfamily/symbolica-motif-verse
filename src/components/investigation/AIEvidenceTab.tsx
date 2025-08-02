
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Sparkles, 
  Camera, 
  Upload, 
  Search, 
  Filter,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Brain,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Box,
  MapPin
} from 'lucide-react';
import { TreasureQuest } from '@/types/quests';
import { useQuestEvidence } from '@/hooks/useQuestEvidence';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';
import EvidenceUploadDialog from './EvidenceUploadDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface AIEvidenceTabProps {
  quest: TreasureQuest;
}

const AIEvidenceTab: React.FC<AIEvidenceTabProps> = ({ quest }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null);
  const [analysisDialogOpen, setAnalysisDialogOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  
  const { evidence, isLoading, refetch, validateEvidence, isValidating } = useQuestEvidence(quest.id);
  const aiAnalysis = useAIAnalysis();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'validated': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'disputed': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-blue-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'photo': return <Camera className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      case 'artifact': return <Box className="h-4 w-4" />;
      default: return <Camera className="h-4 w-4" />;
    }
  };

  const filteredEvidences = evidence.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const validatedCount = evidence.filter(e => e.validation_status === 'validated').length;
  const averageScore = evidence.length > 0 
    ? Math.round(evidence.reduce((acc, e) => acc + (e.validation_score || 0), 0) / evidence.length * 100)
    : 0;

  const handleEvidenceAnalysis = async (evidenceItem: any) => {
    try {
      setSelectedEvidence(evidenceItem.id);
      const result = await aiAnalysis.mutateAsync({ 
        questId: quest.id, 
        analysisType: 'general' // Using general for evidence analysis
      });
      setAnalysisResult(result.analysis);
      setAnalysisDialogOpen(true);
    } catch (error) {
      console.error('Error analyzing evidence:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Contrôles et actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Preuves avec Analyse IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans les preuves..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
              <EvidenceUploadDialog questId={quest.id} onEvidenceUploaded={refetch}>
                <Button size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Nouvelle Preuve
                </Button>
              </EvidenceUploadDialog>
            </div>
          </div>

          {/* Statistiques IA */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Analysées IA</span>
              </div>
              <div className="text-2xl font-bold">{evidence.length}</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Validées</span>
              </div>
              <div className="text-2xl font-bold">{validatedCount}</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Confiance Moy.</span>
              </div>
              <div className="text-2xl font-bold">{averageScore}%</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <MessageCircle className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Discussions</span>
              </div>
              <div className="text-2xl font-bold">0</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des preuves */}
      {isLoading ? (
        <Card>
          <CardContent className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Chargement des preuves...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEvidences.map((evidenceItem) => (
            <Card key={evidenceItem.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(evidenceItem.evidence_type)}
                    <CardTitle className="text-lg">{evidenceItem.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(evidenceItem.validation_status)}
                    <Badge variant="outline" className="text-xs">
                      {Math.round((evidenceItem.validation_score || 0) * 100)}% confiance
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Image de la preuve */}
                {evidenceItem.image_url && (
                  <div className="relative">
                    <img 
                      src={evidenceItem.image_url} 
                      alt={evidenceItem.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2">
                      <Button size="sm" variant="secondary" className="h-8 px-2">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Informations */}
                <div>
                  {evidenceItem.description && (
                    <p className="text-sm text-muted-foreground mb-2">{evidenceItem.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Par {evidenceItem.submitted_by_profile?.username || 'Anonyme'}</span>
                    {evidenceItem.location_name && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {evidenceItem.location_name}
                        </span>
                      </>
                    )}
                    <span>•</span>
                    <span>{new Date(evidenceItem.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>

                {/* Statut de validation */}
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Validation</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Score: {Math.round((evidenceItem.validation_score || 0) * 100)}%</span>
                    <span>Votes: {evidenceItem.validation_count}</span>
                    <span className="capitalize">{evidenceItem.validation_status}</span>
                  </div>
                </div>

                {/* Actions de validation et analyse */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    {evidenceItem.validation_status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 px-2"
                          onClick={() => validateEvidence({ evidenceId: evidenceItem.id, voteType: 'validate' })}
                          disabled={isValidating}
                        >
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          Valider
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 px-2"
                          onClick={() => validateEvidence({ evidenceId: evidenceItem.id, voteType: 'dispute' })}
                          disabled={isValidating}
                        >
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Contester
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 px-2"
                          onClick={() => validateEvidence({ evidenceId: evidenceItem.id, voteType: 'reject' })}
                          disabled={isValidating}
                        >
                          <ThumbsDown className="h-3 w-3 mr-1" />
                          Rejeter
                        </Button>
                      </>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 px-2 bg-blue-50 hover:bg-blue-100"
                    onClick={() => handleEvidenceAnalysis(evidenceItem)}
                    disabled={aiAnalysis.isPending}
                  >
                    <Brain className="h-3 w-3 mr-1" />
                    {aiAnalysis.isPending && selectedEvidence === evidenceItem.id ? 'Analyse...' : 'Analyse IA'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredEvidences.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Aucune preuve trouvée</p>
            <p className="text-sm text-muted-foreground">
              Commencez par uploader une preuve pour déclencher l'analyse IA
            </p>
          </CardContent>
        </Card>
      )}

      {/* Dialog d'analyse IA */}
      <Dialog open={analysisDialogOpen} onOpenChange={setAnalysisDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-500" />
              Analyse IA de la Preuve
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {analysisResult ? (
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap bg-muted/50 p-4 rounded-lg">
                  {analysisResult}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Analyse en cours...</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIEvidenceTab;
