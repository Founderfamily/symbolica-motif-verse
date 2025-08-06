import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Brain, 
  Lightbulb, 
  Users, 
  Clock,
  Send,
  ArrowRight,
  Target,
  TrendingUp,
  FileText,
  Sparkles
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import QuestChatReal from './QuestChatReal';

interface AISuggestion {
  id: string;
  type: 'topic' | 'question' | 'research_direction' | 'collaboration';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  context: string;
  auto_post?: boolean;
}

interface AIDiscoveryShare {
  id: string;
  discovery_title: string;
  summary: string;
  relevance_score: number;
  suggested_discussion_points: string[];
  timestamp: string;
}

interface AIEnhancedChatTabProps {
  questId: string;
  questName: string;
}

const AIEnhancedChatTab: React.FC<AIEnhancedChatTabProps> = ({ questId, questName }) => {
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [aiDiscoveries, setAiDiscoveries] = useState<AIDiscoveryShare[]>([]);
  const [showAISuggestions, setShowAISuggestions] = useState(true);
  const [selectedSuggestion, setSelectedSuggestion] = useState<AISuggestion | null>(null);

  useEffect(() => {
    loadAIChatEnhancements();
  }, [questId]);

  const loadAIChatEnhancements = async () => {
    try {
      // Charger les analyses IA récentes pour générer des suggestions
      const { data: aiData } = await supabase
        .from('ai_investigations')
        .select('*')
        .eq('quest_id', questId)
        .order('created_at', { ascending: false })
        .limit(3);

      // Charger les personnages historiques de la quête
      const { data: historicalFigures } = await supabase
        .from('historical_figures_metadata')
        .select('*')
        .eq('quest_id', questId)
        .eq('status', 'verified')
        .order('created_at', { ascending: false });

      // Générer des suggestions dynamiques basées sur les vraies données
      const dynamicSuggestions: AISuggestion[] = [];

      if (historicalFigures && historicalFigures.length > 0) {
        // Suggestions basées sur les personnages historiques réels
        const renaissanceFigures = historicalFigures.filter(f => 
          f.figure_period.includes('Renaissance') || f.figure_period.includes('1500')
        );
        
        const classicFigures = historicalFigures.filter(f => 
          f.figure_period.includes('Classique') || f.figure_period.includes('1600')
        );

        if (renaissanceFigures.length > 0) {
          dynamicSuggestions.push({
            id: 'renaissance_discussion',
            type: 'topic',
            title: `${renaissanceFigures[0].figure_name} et l'art Renaissance`,
            description: `Discussion sur l'influence de ${renaissanceFigures[0].figure_name} dans l'architecture de Fontainebleau`,
            priority: 'high',
            context: `${renaissanceFigures.length} personnage(s) de la Renaissance identifié(s) dans les archives`,
            auto_post: false
          });
        }

        if (classicFigures.length > 0) {
          const louisXIV = classicFigures.find(f => f.figure_name.includes('Louis XIV'));
          if (louisXIV) {
            dynamicSuggestions.push({
              id: 'louis_xiv_works',
              type: 'question',
              title: 'Travaux de Louis XIV à Fontainebleau',
              description: 'Quels sont les liens entre les modifications de Louis XIV et les éléments d\'origine ?',
              priority: 'medium',
              context: 'Le Roi-Soleil a entrepris de nombreux travaux de restauration documentés',
              auto_post: false
            });
          }
        }

        // Suggestion de recherche archivistique
        if (historicalFigures.some(f => f.figure_role.includes('Jésuite'))) {
          dynamicSuggestions.push({
            id: 'symbolic_research',
            type: 'research_direction',
            title: 'Recherche symbolique avec Père Ménestrier',
            description: 'Explorer les écrits du Père Ménestrier sur la symbolique des châteaux royaux',
            priority: 'high',
            context: 'Spécialiste de l\'héraldique mentionné dans les archives',
            auto_post: false
          });
        }

        // Suggestion de collaboration d'expert
        const architects = historicalFigures.filter(f => 
          f.figure_role.includes('architecte') || f.figure_role.includes('Architecte')
        );
        
        if (architects.length > 0) {
          dynamicSuggestions.push({
            id: 'architecture_expert',
            type: 'collaboration',
            title: 'Expert en architecture Renaissance-Classique',
            description: `Cherchons un spécialiste pour analyser les œuvres de ${architects.map(a => a.figure_name).join(', ')}`,
            priority: 'medium',
            context: `${architects.length} architecte(s) historique(s) identifié(s)`,
            auto_post: false
          });
        }
      }

      // Ajouter des suggestions génériques si pas assez de données
      if (dynamicSuggestions.length < 4) {
        dynamicSuggestions.push({
          id: 'general_archives',
          type: 'research_direction',
          title: 'Recherche aux Archives Nationales',
          description: 'Vérifier les documents historiques manquants pour cette période',
          priority: 'medium',
          context: 'Documentation archivistique à compléter',
          auto_post: false
        });
      }

      setAiSuggestions(dynamicSuggestions);

      // Générer des découvertes à partager
      const mockDiscoveries: AIDiscoveryShare[] = [];
      
      if (aiData && aiData.length > 0) {
        aiData.forEach((investigation, index) => {
          const result = investigation.result_content as any;
          
          if (result?.investigation) {
            mockDiscoveries.push({
              id: `discovery_${investigation.id}`,
              discovery_title: 'Nouvelle analyse IA disponible',
              summary: result.investigation.summary || 'L\'IA a identifié de nouvelles connexions',
              relevance_score: 0.87,
              suggested_discussion_points: [
                'Validation des connexions historiques',
                'Vérification des sources documentaires',
                'Planification des recherches sur terrain'
              ],
              timestamp: investigation.created_at
            });
          }
        });
      }

      setAiDiscoveries(mockDiscoveries);

    } catch (error) {
      console.error('Erreur chargement enrichissements chat IA:', error);
    }
  };

  const getSuggestionIcon = (type: AISuggestion['type']) => {
    switch (type) {
      case 'topic': return <MessageSquare className="w-4 h-4" />;
      case 'question': return <Lightbulb className="w-4 h-4" />;
      case 'research_direction': return <Target className="w-4 h-4" />;
      case 'collaboration': return <Users className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getSuggestionColor = (type: AISuggestion['type']) => {
    switch (type) {
      case 'topic': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'question': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'research_direction': return 'bg-green-100 text-green-800 border-green-200';
      case 'collaboration': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getPriorityColor = (priority: AISuggestion['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-green-100 text-green-800';
    }
  };

  const handleUseSuggestion = (suggestion: AISuggestion) => {
    setSelectedSuggestion(suggestion);
    // Ici on pourrait pré-remplir le champ de message avec la suggestion
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `${diffMins}min`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;
    return `${Math.floor(diffMins / 1440)}j`;
  };

  const generateRelevantQuestions = (questName: string): string[] => {
    const baseQuestions = [
      `Avez-vous des informations sur ${questName} ?`,
      `Quelqu'un a-t-il exploré des lieux liés à cette quête ?`,
      `Y a-t-il des documents historiques pertinents ?`,
      `Avez-vous remarqué des symboles ou indices particuliers ?`
    ];

    // Questions spécifiques selon le nom de la quête
    if (questName.toLowerCase().includes('fontainebleau')) {
      baseQuestions.push(
        'Connaissez-vous l\'histoire des appartements de François Ier ?',
        'Avez-vous vu des salamandres sculptées dans le château ?',
        'Où trouve-t-on les traces de Napoléon à Fontainebleau ?'
      );
    }

    if (questName.toLowerCase().includes('templar') || questName.toLowerCase().includes('templier')) {
      baseQuestions.push(
        'Avez-vous trouvé des symboles templiers ?',
        'Connaissez-vous des sites templiers dans la région ?'
      );
    }

    return baseQuestions.slice(0, 4); // Garder 4 questions max
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Chat principal */}
      <div className="lg:col-span-3">
        <QuestChatReal questId={questId} questName={questName} />
      </div>

      {/* Panneau d'assistance IA */}
      <div className="space-y-4">
        {/* Contrôles */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="w-5 h-5 text-indigo-600" />
              Assistant IA
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowAISuggestions(!showAISuggestions)}
                className="ml-auto p-1"
              >
                {showAISuggestions ? '−' : '+'}
              </Button>
            </CardTitle>
          </CardHeader>
          {showAISuggestions && (
            <CardContent>
              <div className="space-y-3">
                <div className="text-xs text-slate-600">
                  Suggestions basées sur l'analyse de la quête et des découvertes récentes
                </div>
                
                {/* Statistiques rapides */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 bg-indigo-50 rounded-lg">
                    <div className="text-sm font-bold text-indigo-800">{aiSuggestions.length}</div>
                    <div className="text-xs text-indigo-600">Suggestions</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <div className="text-sm font-bold text-green-800">{aiDiscoveries.length}</div>
                    <div className="text-xs text-green-600">Découvertes</div>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Suggestions de sujets IA */}
        {showAISuggestions && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                Sujets Suggérés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {aiSuggestions.map((suggestion) => (
                  <div key={suggestion.id} className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded ${getSuggestionColor(suggestion.type)}`}>
                          {getSuggestionIcon(suggestion.type)}
                        </div>
                        <Badge className={getPriorityColor(suggestion.priority)}>
                          {suggestion.priority}
                        </Badge>
                      </div>
                    </div>
                    
                    <h4 className="font-medium text-sm text-slate-800 mb-1">
                      {suggestion.title}
                    </h4>
                    <p className="text-xs text-slate-600 mb-2">
                      {suggestion.description}
                    </p>
                    
                    <div className="bg-slate-50 p-2 rounded text-xs text-slate-600 mb-2">
                      {suggestion.context}
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full text-xs"
                      onClick={() => handleUseSuggestion(suggestion)}
                    >
                      <Send className="w-3 h-3 mr-1" />
                      Utiliser cette suggestion
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Découvertes à partager */}
        {aiDiscoveries.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                Découvertes Récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {aiDiscoveries.map((discovery) => (
                  <div key={discovery.id} className="p-3 rounded-lg border border-green-100 bg-green-50/50">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm text-slate-800">
                        {discovery.discovery_title}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(discovery.relevance_score * 100)}%
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-slate-600 mb-2">
                      {discovery.summary}
                    </p>
                    
                    <div className="space-y-1 mb-3">
                      <div className="text-xs font-medium text-slate-700">Points de discussion :</div>
                      {discovery.suggested_discussion_points.slice(0, 2).map((point, i) => (
                        <div key={i} className="text-xs text-slate-600 flex items-start gap-1">
                          <ArrowRight className="w-3 h-3 mt-0.5 text-slate-400" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(discovery.timestamp)}
                      </span>
                      <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Partager
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Questions pertinentes générées dynamiquement */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Questions Pertinentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {generateRelevantQuestions(questName).map((question, index) => (
                <Button 
                  key={index}
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-xs justify-start h-auto p-2"
                >
                  <MessageSquare className="w-3 h-3 mr-2 text-slate-400" />
                  <span className="text-left">{question}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIEnhancedChatTab;