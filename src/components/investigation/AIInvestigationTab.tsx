import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AIInvestigationStatusBar } from './AIInvestigationStatusBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Brain, 
  Search, 
  Plus, 
  Camera, 
  FileText, 
  Box,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Sparkles,
  FileX,
  Users,
  TrendingUp,
  Target,
  Lightbulb,
  Zap,
  Activity,
  Filter,
  ArrowRight,
  Link,
  BookOpen,
  Compass,
  Bot
} from 'lucide-react';
import { TreasureQuest } from '@/types/quests';
import { useQuestEvidence } from '@/hooks/useQuestEvidence';
import { useQuestTheories } from '@/hooks/useQuestTheories';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';
import { useProactiveAI } from '@/hooks/useProactiveAI';
import { useAuth } from '@/hooks/useAuth';
import EvidenceUploadDialog from './EvidenceUploadDialog';

interface AIInvestigationTabProps {
  quest: TreasureQuest;
}

const AIInvestigationTab: React.FC<AIInvestigationTabProps> = ({ quest }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'validated' | 'pending' | 'disputed'>('all');
  const [selectedDossier, setSelectedDossier] = useState<string | null>(null);
  const [newTheoryDialog, setNewTheoryDialog] = useState(false);
  const [aiSuggestionsDialog, setAiSuggestionsDialog] = useState(false);
  const { evidence, isLoading: evidenceLoading, refetch: refetchEvidence, validateEvidence } = useQuestEvidence(quest.id);
  const { theories, isLoading: theoriesLoading, refetch: refetchTheories, createTheory } = useQuestTheories(quest.id);
  const aiAnalysis = useAIAnalysis();
  const proactiveAI = useProactiveAI(quest.id);
  const { user, isAdmin } = useAuth();

  // Grouper les preuves et théories en dossiers d'investigation
  const investigationDossiers = React.useMemo(() => {
    const dossiers = new Map();
    
    // Grouper par thème/type d'indice
    evidence.forEach(ev => {
      const theme = ev.clue_index !== null ? `Indice ${ev.clue_index + 1}` : 'Général';
      if (!dossiers.has(theme)) {
        dossiers.set(theme, { evidence: [], theories: [], theme });
      }
      dossiers.get(theme).evidence.push(ev);
    });

    theories.forEach(theory => {
      const theme = theory.theory_type || 'Général';
      if (!dossiers.has(theme)) {
        dossiers.set(theme, { evidence: [], theories: [], theme });
      }
      dossiers.get(theme).theories.push(theory);
    });

    return Array.from(dossiers.values());
  }, [evidence, theories]);


  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'validated': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'disputed': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-blue-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-700 border border-red-200';
      case 'medium': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'low': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      default: return 'bg-muted/50 text-muted-foreground border border-border';
    }
  };

  const filteredDossiers = investigationDossiers.filter(dossier => {
    const searchMatch = dossier.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       dossier.evidence.some(e => e.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                       dossier.theories.some(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeFilter === 'all') return searchMatch;
    return searchMatch && dossier.evidence.some(e => e.validation_status === activeFilter);
  });

  return (
    <div className="space-y-6">
      {/* Barre de statut IA */}
      <AIInvestigationStatusBar 
        isInvestigating={proactiveAI.isInvestigating}
        isSearchingSources={proactiveAI.isSearchingSources}
        isGeneratingTheories={proactiveAI.isGeneratingTheories}
        investigationProgress={65}
      />

      {/* En-tête avec insights IA proactifs */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            Assistant IA Investigation - Insights en Temps Réel
          </CardTitle>
        </CardHeader>
        <CardContent>
          {proactiveAI.insights.length === 0 && !proactiveAI.isLoading && (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">L'IA n'a pas encore commencé l'investigation</p>
              <Button onClick={() => proactiveAI.startProactiveInvestigation?.('full_investigation')}>
                <Sparkles className="h-4 w-4 mr-2" />
                Démarrer l'Investigation IA
              </Button>
            </div>
          )}
          
          {proactiveAI.insights.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {proactiveAI.insights.map((insight, index) => (
                <Card key={index} className={`p-4 ${getPriorityColor(insight.priority)}`}>
                  <div className="flex items-center gap-2 mb-3">
                    {insight.type === 'missing_evidence' && <FileX className="h-4 w-4" />}
                    {insight.type === 'pattern_detected' && <TrendingUp className="h-4 w-4" />}
                    {insight.type === 'location_correlation' && <MapPin className="h-4 w-4" />}
                    <span className="font-medium text-sm">{insight.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{insight.description}</p>
                  <Button size="sm" variant="outline" className="h-7 text-xs border-current">
                    <ArrowRight className="h-3 w-3 mr-1" />
                    {insight.action}
                  </Button>
                </Card>
              ))}
            </div>
          )}

          {/* Actions IA proactives */}
          <div className="flex flex-wrap gap-3">
            <Button 
              size="sm" 
              onClick={() => setAiSuggestionsDialog(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              Suggestions IA
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => proactiveAI.analyzeConnections()}
              disabled={proactiveAI.isAnalyzingConnections}
            >
              <Zap className="h-4 w-4 mr-2" />
              {proactiveAI.isAnalyzingConnections ? 'Analyse...' : 'Analyse Croisée'}
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => proactiveAI.regenerateInsights()}
              disabled={proactiveAI.isRegeneratingInsights}
            >
              <Target className="h-4 w-4 mr-2" />
              {proactiveAI.isRegeneratingInsights ? 'Génération...' : 'Nouvelles Insights'}
            </Button>
            <Button size="sm" variant="outline">
              <Compass className="h-4 w-4 mr-2" />
              Pistes Inexploitées
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contrôles de recherche et filtrage */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans les dossiers d'investigation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={activeFilter} onValueChange={(value: any) => setActiveFilter(value)}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="validated">Validées</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="disputed">Contestées</SelectItem>
              </SelectContent>
            </Select>
            <EvidenceUploadDialog questId={quest.id} onEvidenceUploaded={refetchEvidence}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Preuve
              </Button>
            </EvidenceUploadDialog>
            <Button onClick={() => setNewTheoryDialog(true)} variant="outline">
              <Brain className="h-4 w-4 mr-2" />
              Nouvelle Théorie
            </Button>
          </div>

          {/* Statistiques globales */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Dossiers</span>
              </div>
              <div className="text-2xl font-bold">{investigationDossiers.length}</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Camera className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Preuves</span>
              </div>
              <div className="text-2xl font-bold">{evidence.length}</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Théories</span>
              </div>
              <div className="text-2xl font-bold">{theories.length}</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-medium">Validées</span>
              </div>
              <div className="text-2xl font-bold">
                {evidence.filter(e => e.validation_status === 'validated').length}
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Insights IA</span>
              </div>
              <div className="text-2xl font-bold">{proactiveAI.insights.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dossiers d'investigation */}
      <div className="space-y-6">
        {filteredDossiers.map((dossier, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-slate-600" />
                  Dossier: {dossier.theme}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{dossier.evidence.length} preuves</Badge>
                  <Badge variant="outline">{dossier.theories.length} théories</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full rounded-none border-b">
                  <TabsTrigger value="overview" className="flex-1">Vue d'ensemble</TabsTrigger>
                  <TabsTrigger value="evidence" className="flex-1">Preuves ({dossier.evidence.length})</TabsTrigger>
                  <TabsTrigger value="theories" className="flex-1">Théories ({dossier.theories.length})</TabsTrigger>
                  <TabsTrigger value="connections" className="flex-1">Connexions IA</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Résumé des preuves */}
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        Preuves récentes
                      </h4>
                      <div className="space-y-3">
                        {dossier.evidence.slice(0, 3).map((evidence: any) => (
                          <div key={evidence.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                            {evidence.image_url && (
                              <img 
                                src={evidence.image_url} 
                                alt={evidence.title}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{evidence.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {getStatusIcon(evidence.validation_status)}
                                <span className="text-xs text-muted-foreground">
                                  {Math.round((evidence.validation_score || 0) * 100)}% confiance
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Résumé des théories */}
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        Théories principales
                      </h4>
                      <div className="space-y-3">
                        {dossier.theories.slice(0, 3).map((theory: any) => (
                          <div key={theory.id} className="p-3 bg-muted/30 rounded-lg">
                            <p className="font-medium text-sm">{theory.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {theory.confidence_level}% confiance
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {theory.supporting_evidence?.length || 0} preuves liées
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="evidence" className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {dossier.evidence.map((evidenceItem: any) => (
                      <Card key={evidenceItem.id} className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h5 className="font-medium">{evidenceItem.title}</h5>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(evidenceItem.validation_status)}
                            <Badge variant="outline" className="text-xs">
                              {Math.round((evidenceItem.validation_score || 0) * 100)}%
                            </Badge>
                          </div>
                        </div>
                        
                        {evidenceItem.image_url && (
                          <img 
                            src={evidenceItem.image_url} 
                            alt={evidenceItem.title}
                            className="w-full h-32 object-cover rounded mb-3"
                          />
                        )}
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          {evidenceItem.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {evidenceItem.validation_status === 'pending' && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => validateEvidence({ 
                                    evidenceId: evidenceItem.id, 
                                    voteType: 'validate' 
                                  })}
                                >
                                  <ThumbsUp className="h-3 w-3" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => validateEvidence({ 
                                    evidenceId: evidenceItem.id, 
                                    voteType: 'reject' 
                                  })}
                                >
                                  <ThumbsDown className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            Détails
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="theories" className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {dossier.theories.map((theory: any) => (
                      <Card key={theory.id} className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h5 className="font-medium">{theory.title}</h5>
                          <Badge variant="outline" className="text-xs">
                            {theory.confidence_level}% confiance
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          {theory.description}
                        </p>
                        
                        <div className="space-y-2 mb-3">
                          <p className="text-xs font-medium">Preuves supportantes:</p>
                          <div className="flex flex-wrap gap-1">
                            {(theory.supporting_evidence || []).map((evidenceId: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                Preuve {index + 1}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Par {theory.author_profile?.username || 'Anonyme'}</span>
                          <span>{new Date(theory.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="connections" className="p-6">
                  {proactiveAI.connections ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-muted/50 rounded-lg p-4">
                          <h4 className="font-medium mb-2">Théories analysées</h4>
                          <div className="text-2xl font-bold">{proactiveAI.connections.analysis_summary.total_theories}</div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-4">
                          <h4 className="font-medium mb-2">Preuves liées</h4>
                          <div className="text-2xl font-bold">{proactiveAI.connections.analysis_summary.total_evidence}</div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-4">
                          <h4 className="font-medium mb-2">Force moyenne</h4>
                          <div className="text-2xl font-bold">
                            {Math.round(proactiveAI.connections.analysis_summary.average_support * 100)}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-medium">Théories les mieux supportées</h4>
                        {proactiveAI.connections.best_supported.map((connection: any, index: number) => (
                          <Card key={index} className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium">{connection.theory_title}</h5>
                              <Badge variant="outline">
                                {Math.round(connection.connection_strength * 100)}% supportée
                              </Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                              <span>{connection.supporting_evidence_count} preuves</span>
                              <span>{connection.confidence_level}% confiance</span>
                              <span>{Math.round(connection.evidence_quality * 100)}% qualité</span>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Link className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-medium mb-2">Analyse des connexions IA</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        L'IA analyse les liens entre preuves et théories de ce dossier
                      </p>
                      <Button 
                        onClick={() => proactiveAI.analyzeConnections()}
                        disabled={proactiveAI.isAnalyzingConnections}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        {proactiveAI.isAnalyzingConnections ? 'Analyse en cours...' : 'Lancer l\'analyse'}
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* État vide */}
      {filteredDossiers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Aucun dossier d'investigation</p>
            <p className="text-sm text-muted-foreground mb-4">
              Commencez par ajouter des preuves ou créer des théories
            </p>
            <div className="flex gap-2 justify-center">
              <EvidenceUploadDialog questId={quest.id} onEvidenceUploaded={refetchEvidence}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Première Preuve
                </Button>
              </EvidenceUploadDialog>
              <Button variant="outline" onClick={() => setNewTheoryDialog(true)}>
                <Brain className="h-4 w-4 mr-2" />
                Première Théorie
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog pour nouvelles théories */}
      <Dialog open={newTheoryDialog} onOpenChange={setNewTheoryDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle théorie</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Titre de la théorie" />
            <Textarea placeholder="Description détaillée de votre théorie..." />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Type de théorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="historical">Historique</SelectItem>
                <SelectItem value="location">Localisation</SelectItem>
                <SelectItem value="symbolic">Symbolique</SelectItem>
                <SelectItem value="archaeological">Archéologique</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setNewTheoryDialog(false)}>
                Annuler
              </Button>
              <Button>
                <Brain className="h-4 w-4 mr-2" />
                Créer la théorie
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog suggestions IA */}
      <Dialog open={aiSuggestionsDialog} onOpenChange={setAiSuggestionsDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Suggestions Proactives de l'IA
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  Zones d'investigation prioritaires
                </h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Château de Chambord (rayon 5km)</li>
                  <li>• Archives départementales du Loir-et-Cher</li>
                  <li>• Bibliothèque municipale de Blois</li>
                </ul>
              </Card>
              
              <Card className="p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-500" />
                  Preuves manquantes détectées
                </h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Documents royaux 1515-1520</li>
                  <li>• Témoignages de l'époque Renaissance</li>
                  <li>• Cartes anciennes de la région</li>
                </ul>
              </Card>
              
              <Card className="p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  Patterns identifiés
                </h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Récurrence du symbole salamandre</li>
                  <li>• Concentration géographique à Chambord</li>
                  <li>• Lien avec François Ier confirmé</li>
                </ul>
              </Card>
              
              <Card className="p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Compass className="h-4 w-4 text-orange-500" />
                  Pistes d'investigation
                </h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Analyser les armoiries royales</li>
                  <li>• Rechercher à Fontainebleau</li>
                  <li>• Consulter les experts Renaissance</li>
                </ul>
              </Card>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={() => setAiSuggestionsDialog(false)}>
                Fermer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIInvestigationTab;