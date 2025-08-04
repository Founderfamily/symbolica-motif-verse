import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  Clock, 
  Trophy, 
  Star,
  FileText,
  MessageSquare,
  Camera,
  Search,
  CheckCircle,
  AlertTriangle,
  Plus,
  Calendar,
  Target,
  Compass,
  History,
  BookOpen,
  Eye,
  ThumbsUp,
  Share2,
  Flag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuestById } from '@/hooks/useQuests';
import { useAuth } from '@/hooks/useAuth';
import InvestigationInterface from '@/components/investigation/InvestigationInterface';
import AINotificationService from '@/components/investigation/AINotificationService';
import AIInsightsWidget from '@/components/investigation/AIInsightsWidget';
import { normalizeQuestClues, getQuestCluesPreview, getQuestCluesCount } from '@/utils/questUtils';
import { useQuestParticipantsSimple } from '@/hooks/useQuestParticipantsSimple';
import { useAIData } from '@/hooks/useAIData';
import { useQuestStats } from '@/hooks/useQuestStats';
import { aiDataExtractionService } from '@/services/AIDataExtractionService';

const QuestDetailPage = () => {
  const { questId } = useParams<{ questId: string }>();
  const { user } = useAuth();
  
  console.log('QuestDetailPage - Quest ID from params:', questId);
  
  // Utiliser le hook spécialisé pour récupérer une seule quête
  const { data: quest, isLoading, error } = useQuestById(questId || '');
  
  // Récupérer les données IA pour enrichir l'objectif
  const { data: aiData, theories, sources, historicalFigures, locations } = useAIData(questId || '');
  const { participants, loading: participantsLoading } = useQuestParticipantsSimple(questId || '');
  
  // Normaliser les clues de manière sécurisée
  const questClues = quest ? normalizeQuestClues(quest.clues) : [];
  const questCluesCount = quest ? getQuestCluesCount(quest) : 0;
  
  // Hook pour les statistiques réelles
  const questStats = useQuestStats(questId || '', questCluesCount);
  
  // State pour l'objectif spécifique du trésor
  const [specificObjective, setSpecificObjective] = useState<string>('');

  // Charger l'objectif spécifique du trésor
  useEffect(() => {
    const loadSpecificObjective = async () => {
      if (questId) {
        try {
          const objective = await aiDataExtractionService.getSpecificTreasureObjective(questId);
          setSpecificObjective(objective);
        } catch (error) {
          console.error('Erreur lors du chargement de l\'objectif spécifique:', error);
          setSpecificObjective(quest?.description || 'Découvrir l\'emplacement d\'un trésor historique');
        }
      }
    };
    
    loadSpecificObjective();
  }, [questId, quest]);

  console.log('QuestDetailPage - Quest data:', quest);
  console.log('QuestDetailPage - Loading state:', isLoading);
  console.log('QuestDetailPage - Error state:', error);
  console.log('QuestDetailPage - AI data:', aiData);
  console.log('QuestDetailPage - Specific objective:', specificObjective);

  const questCluesPreview = quest ? getQuestCluesPreview(quest).slice(0, 3) : [];

  console.log('QuestDetailPage - Normalized clues:', questClues);
  console.log('QuestDetailPage - Clues count:', questCluesCount);
  console.log('QuestDetailPage - Clues preview:', questCluesPreview);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement de la quête...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('QuestDetailPage - Error loading quest:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Erreur de chargement</h1>
            <p className="text-slate-600 mb-4">Impossible de charger les détails de la quête.</p>
            <p className="text-sm text-slate-500 mb-6">
              Erreur: {error instanceof Error ? error.message : 'Erreur inconnue'}
            </p>
            <div className="space-y-4">
              <Link to="/quests">
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour aux quêtes
                </Button>
              </Link>
              <Button onClick={() => window.location.reload()} variant="outline">
                Réessayer
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!quest) {
    console.warn('QuestDetailPage - Quest not found for ID:', questId);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 text-center">
            <Search className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Quête introuvable</h1>
            <p className="text-slate-600 mb-4">La quête demandée n'existe pas ou n'est pas disponible.</p>
            <div className="bg-slate-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-slate-500 mb-2">Détails de débogage :</p>
              <p className="text-xs text-slate-400">ID recherché : {questId}</p>
            </div>
            <Link to="/quests">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux quêtes
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  console.log('QuestDetailPage - Successfully rendering quest:', quest.title);

  // Trouver la quête par ID avec meilleur diagnostic
  const questTypeLabels = {
    templar: 'Templiers',
    lost_civilization: 'Civilisation Perdue',
    graal: 'Quête du Graal',
    custom: 'Personnalisée',
    myth: 'Mythe & Légende',
    found_treasure: 'Trésor Découvert',
    unfound_treasure: 'Trésor Recherché'
  };

  const difficultyColors = {
    beginner: 'bg-amber-50 text-amber-800 border-amber-200',
    intermediate: 'bg-amber-100 text-amber-900 border-amber-300',
    expert: 'bg-stone-100 text-stone-800 border-stone-300',
    master: 'bg-stone-200 text-stone-900 border-stone-400'
  };

  const difficultyLabels = {
    beginner: 'Accessible',
    intermediate: 'Intermédiaire',
    expert: 'Avancé',
    master: 'Expert'
  };

  const statusColors = {
    upcoming: 'bg-amber-100 text-amber-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-stone-100 text-stone-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    upcoming: 'À venir',
    active: 'Active',
    completed: 'Terminée',
    cancelled: 'Annulée'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* En-tête minimaliste */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-amber-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/quests" className="flex items-center text-stone-600 hover:text-stone-800 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour
              </Link>
              <Badge className={difficultyColors[quest.difficulty_level]}>
                {difficultyLabels[quest.difficulty_level]}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              {user && <AINotificationService userId={user.id} questId={quest.id} />}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Titre et intro compacte */}
          <div className="lg:col-span-3 bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 shadow-lg">
            <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-stone-800 to-amber-700 bg-clip-text text-transparent">
              {quest.title}
            </h1>
            <p className="text-stone-600 mb-4">{quest.description}</p>
            
            {/* Objectif clair de la quête avec données IA */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-800 mb-1">Objectif de la quête</h3>
                  
                   {/* Objectif principal enrichi par l'IA */}
                   <div className="space-y-2">
                     <p className="text-amber-700 text-sm">
                       {specificObjective || quest.description || 'Découvrir l\'emplacement d\'un trésor historique'}
                     </p>
                    
                    {/* Détails spécifiques basés sur l'IA */}
                    {(historicalFigures.length > 0 || locations.length > 0) && (
                      <div className="bg-amber-100/50 rounded p-2 text-xs text-amber-800">
                        <div className="font-medium mb-1">Pistes de recherche :</div>
                        <ul className="space-y-1">
                          {historicalFigures.slice(0, 2).map(figure => (
                            <li key={figure.id}>• <strong>{figure.name}</strong> ({figure.period}) - {figure.role}</li>
                          ))}
                          {locations.slice(0, 1).map(location => (
                            <li key={location.id}>• <strong>{location.name}</strong> - {location.description?.split('.')[0]}</li>
                          ))}
                          {theories.slice(0, 1).map(theory => (
                            <li key={theory.id}>• {theory.description?.split('.').slice(0, 2).join('.') || theory.title}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                   <div className="flex items-center gap-4 mt-3 text-xs text-amber-600">
                     <span className="flex items-center gap-1">
                       <BookOpen className="w-3 h-3" />
                       {sources.length > 0 ? (
                         <>{sources.length} preuve{sources.length > 1 ? 's' : ''} analysée{sources.length > 1 ? 's' : ''} : {sources.slice(0, 2).map(s => s.title).join(', ')}{sources.length > 2 && '...'}</>
                       ) : (
                         '0 preuves'
                       )}
                     </span>
                     <span className="flex items-center gap-1">
                       <MapPin className="w-3 h-3" />
                       {locations.length > 0 ? (
                         <>{locations.length} lieu{locations.length > 1 ? 'x' : ''} : {locations.slice(0, 2).map(l => l.name).join(', ')}{locations.length > 2 && '...'}</>
                       ) : (
                         '0 lieux'
                       )}
                     </span>
                     <span className="flex items-center gap-1">
                       <Users className="w-3 h-3" />
                       {historicalFigures.length > 0 ? (
                         <>{historicalFigures.length} personnage{historicalFigures.length > 1 ? 's' : ''} : {historicalFigures.slice(0, 2).map(f => f.name).join(', ')}{historicalFigures.length > 2 && '...'}</>
                       ) : (
                         '0 personnages'
                       )}
                     </span>
                   </div>
                </div>
              </div>
            </div>
            
            {/* Stats compactes avec vraies données */}
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center">
                <div className="text-lg font-bold text-amber-800">{questStats.participantsCount}</div>
                <div className="text-xs text-stone-600">Participants</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-stone-800">{questStats.cluesCount}</div>
                <div className="text-xs text-stone-600">Indices</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-amber-800">{questStats.evidenceCount}</div>
                <div className="text-xs text-stone-600">Preuves</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-stone-800">{questStats.discussionsCount}</div>
                <div className="text-xs text-stone-600">Discussions</div>
              </div>
            </div>
          </div>

          {/* Widget Insights IA */}
          <div className="lg:col-span-1">
            <AIInsightsWidget questId={quest.id} compact={true} />
          </div>
        </div>

        {/* Interface collaborative immédiate */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-amber-200/50 shadow-lg">
          <div className="p-4 border-b border-stone-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-stone-800">Espace de Collaboration</h2>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                  onClick={() => {
                    const chatTab = document.querySelector('[data-value="chat"]') as HTMLElement;
                    chatTab?.click();
                  }}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Discuter
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    const evidenceTab = document.querySelector('[data-value="evidence"]') as HTMLElement;
                    evidenceTab?.click();
                  }}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Partager
                </Button>
              </div>
            </div>
          </div>
          
          {/* Interface de collaboration directe */}
          <InvestigationInterface quest={quest} />
        </div>
      </div>
    </div>
  );
};

export default QuestDetailPage;