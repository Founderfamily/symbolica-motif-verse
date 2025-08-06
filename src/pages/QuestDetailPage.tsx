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
  Flag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuestById } from '@/hooks/useQuests';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import InvestigationInterface from '@/components/investigation/InvestigationInterface';
import AINotificationService from '@/components/investigation/AINotificationService';
import AIInsightsWidget from '@/components/investigation/AIInsightsWidget';
import AdaptiveHero from '@/components/adaptive/AdaptiveHero';
import AdaptiveActions from '@/components/adaptive/AdaptiveActions';
import AdaptiveNavigation from '@/components/adaptive/AdaptiveNavigation';

import { normalizeQuestClues, getQuestCluesPreview, getQuestCluesCount } from '@/utils/questUtils';
import { useQuestParticipantsSimple } from '@/hooks/useQuestParticipantsSimple';
import { useAIData } from '@/hooks/useAIData';
import { useQuestStats } from '@/hooks/useQuestStats';
import { aiDataExtractionService } from '@/services/AIDataExtractionService';

const QuestDetailPage = () => {
  const { questId } = useParams<{ questId: string }>();
  const { user } = useAuth();
  const { adaptiveProfile, setUserProfileType, isAuthenticated } = useUserProfile();
  
  // État pour l'interface adaptative
  const [activeTab, setActiveTab] = useState('adventure');
  
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

  // Fonctions pour gérer les actions
  const handleStartAdventure = () => {
    if (adaptiveProfile.isFirstTime) {
      setActiveTab('adventure');
    } else {
      // Rediriger selon le profil
      const tabMap = {
        beginner: 'adventure',
        treasure_hunter: 'field',
        historian: 'sources',
        remote_helper: 'tasks'
      };
      setActiveTab(tabMap[adaptiveProfile.type] || 'adventure');
    }
  };

  const handleAction = (actionId: string) => {
    console.log('Action déclenchée:', actionId);
    // Implémenter les actions spécifiques selon le profil
    switch (actionId) {
      case 'take_photo':
      case 'verify_coordinates':
      case 'document_discovery':
        setActiveTab('field');
        break;
      case 'chat':
      case 'community_support':
        setActiveTab('chat');
        break;
      case 'explore_map':
        setActiveTab('map');
        break;
      case 'validate_sources':
      case 'cross_reference':
        setActiveTab('sources');
        break;
      case 'online_research':
      case 'photo_analysis':
        setActiveTab('research');
        break;
      default:
        setActiveTab('adventure');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* En-tête adaptatif */}
      <div className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/quests" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
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

      {/* Hero Section Adaptatif */}
      <AdaptiveHero 
        profile={adaptiveProfile}
        quest={quest}
        onStartAdventure={handleStartAdventure}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Actions Rapides Adaptatives */}
        <div className="mb-4">
          <AdaptiveActions 
            profile={adaptiveProfile}
            onAction={handleAction}
            questType={quest.quest_type}
            questStatus={quest.status}
          />
        </div>

        {/* Navigation et Contenu Adaptatifs */}
        <div className="bg-background rounded-2xl border border-border shadow-lg overflow-hidden">
          <AdaptiveNavigation
            profile={adaptiveProfile}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          >
            {/* Contenu des onglets */}
            <div className="p-4">
              {activeTab === 'adventure' && adaptiveProfile.type === 'beginner' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      🎮 Bienvenue dans ton Aventure !
                    </h3>
                    <p className="text-muted-foreground">
                      Tu es sur le point de découvrir comment fonctionnent les quêtes de trésors.
                    </p>
                  </div>
                  
                  {/* Interface simplifiée pour débutants */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="p-6">
                      <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-amber-500" />
                        Progression
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Tutoriel</span>
                          <Badge variant="outline">0/4</Badge>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full w-0"></div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Commence par faire le tutoriel pour gagner tes premiers points !
                        </p>
                      </div>
                    </Card>
                    
                    <Card className="p-6">
                      <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-500" />
                        Communauté
                      </h4>
                      <div className="space-y-3">
                        <div className="text-2xl font-bold text-foreground">12</div>
                        <p className="text-sm text-muted-foreground">
                          explorateurs participent à cette quête
                        </p>
                        <Button size="sm" variant="outline" className="w-full">
                          Rejoindre le chat
                        </Button>
                      </div>
                    </Card>
                  </div>
                  
                  <InvestigationInterface quest={quest} />
                </div>
              )}
              
              {/* Interface complète pour les autres profils */}
              {(activeTab !== 'adventure' || adaptiveProfile.type !== 'beginner') && (
                <InvestigationInterface quest={quest} />
              )}
            </div>
          </AdaptiveNavigation>
        </div>
      </div>

    </div>
  );
};

export default QuestDetailPage;