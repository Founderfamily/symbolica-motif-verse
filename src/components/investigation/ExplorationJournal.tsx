import React, { useState, useEffect } from 'react';
import { TreasureQuest } from '@/types/quests';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, Users, BookOpen, Camera, HelpCircle } from 'lucide-react';
import HistoricalFiguresWidget from './widgets/HistoricalFiguresWidget';
import { supabase } from '@/integrations/supabase/client';
import { normalizeQuestClues } from '@/utils/questUtils';
import { useQuestActivitiesSimple } from '@/hooks/useQuestActivitiesSimple';
import { useQuestStats } from '@/hooks/useQuestStats';

interface ExplorationJournalProps {
  quest: TreasureQuest;
}

const ExplorationJournal: React.FC<ExplorationJournalProps> = ({ quest }) => {
  const [activeExplorers, setActiveExplorers] = useState<Array<{
    id: string;
    username: string;
    full_name: string;
    location: string;
    lastSeen: string;
    status: 'analyzing_documents' | 'on_site' | 'researching' | 'offline';
  }>>([]);
  const [recentDiscoveries, setRecentDiscoveries] = useState<Array<{
    id: string;
    type: string;
    description: string;
    user: string;
    timestamp: string;
  }>>([]);

  // Hooks pour les vraies données  
  const { activities } = useQuestActivitiesSimple(quest.id);
  const stats = useQuestStats(quest.id, normalizeQuestClues(quest.clues).length);

  useEffect(() => {
    loadActiveExplorers();
    loadRecentDiscoveries();
  }, [quest.id, activities]);

  const loadActiveExplorers = async () => {
    try {
      // Explorateurs actifs pour la quête témoin Fontainebleau
      if (quest.title.includes('Fontainebleau')) {
        const mockExplorers = [
          {
            id: 'marie-dubois',
            username: 'marie_historienne', 
            full_name: 'Marie Dubois',
            location: 'Paris, France',
            lastSeen: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            status: 'analyzing_documents' as const
          },
          {
            id: 'jean-moreau',
            username: 'jean_archeologue',
            full_name: 'Jean Moreau', 
            location: 'Fontainebleau, France',
            lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            status: 'on_site' as const
          },
          {
            id: 'pierre-fontaine',
            username: 'pierre_guide',
            full_name: 'Pierre Fontaine',
            location: 'Fontainebleau, France', 
            lastSeen: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            status: 'researching' as const
          },
          {
            id: 'anna-rousseau',
            username: 'anna_experte',
            full_name: 'Anna Rousseau',
            location: 'Melun, France',
            lastSeen: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            status: 'offline' as const
          }
        ];
        setActiveExplorers(mockExplorers);
        return;
      }

      // Pour les autres quêtes, utiliser les vraies données
      const { data: { user } } = await supabase.auth.getUser();
      const explorers = [];
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, full_name')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          explorers.push({
            id: user.id,
            username: profile.username || 'user',
            full_name: profile.full_name || profile.username || 'Vous',
            location: quest.title || 'Exploration en cours',
            lastSeen: 'En ligne',
            status: 'researching' as const
          });
        }
      }

      setActiveExplorers(explorers);
    } catch (error) {
      console.error('Erreur lors du chargement des explorateurs actifs:', error);
      setActiveExplorers([]);
    }
  };

  const loadRecentDiscoveries = async () => {
    try {
      // Pour la quête témoin Fontainebleau, utiliser des données enrichies
      if (quest.title.includes('Fontainebleau') && quest.status === 'completed') {
        const witnessDiscoveries = [
          {
            id: 'discovery-1',
            type: 'Indice résolu',
            description: 'Manuscrit royal découvert aux Archives Nationales révélant l\'emplacement du premier indice',
            user: 'Marie Dubois',
            timestamp: 'il y a 3 semaines'
          },
          {
            id: 'discovery-2', 
            type: 'Preuve photographique',
            description: 'Pierre gravée dans les jardins du château confirmant la théorie historique',
            user: 'Jean Moreau',
            timestamp: 'il y a 2 semaines'
          },
          {
            id: 'discovery-3',
            type: 'Validation finale',
            description: 'Médaillon royal authentifié par expertise - quête complétée avec succès',
            user: 'Anna Rousseau', 
            timestamp: 'il y a 1 semaine'
          }
        ];
        setRecentDiscoveries(witnessDiscoveries);
        return;
      }

      // Transformer les activités en découvertes pour les autres quêtes
      const discoveries = activities.slice(0, 5).map((activity, index) => {
        const timeAgo = formatTimeAgo(activity.created_at);
        return {
          id: activity.id,
          type: getActivityTypeLabel(activity.activity_type),
          description: getActivityDescription(activity),
          user: activity.profiles?.full_name || activity.profiles?.username || 'Explorateur',
          timestamp: timeAgo
        };
      });

      setRecentDiscoveries(discoveries);
    } catch (error) {
      console.error('Erreur lors du chargement des découvertes:', error);
      setRecentDiscoveries([]);
    }
  };

  const getActivityTypeLabel = (type: string): string => {
    switch (type) {
      case 'clue_submitted': return 'Nouvel indice';
      case 'location_visited': return 'Lieu exploré';
      case 'theory_shared': return 'Théorie partagée';
      case 'evidence_found': return 'Preuve découverte';
      default: return 'Activité';
    }
  };

  const getActivityDescription = (activity: any): string => {
    if (activity.activity_data?.description) {
      return activity.activity_data.description;
    }
    return `Nouvelle activité ${activity.activity_type}`;
  };

  const formatTimeAgo = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `il y a ${diffMins}min`;
    if (diffMins < 1440) return `il y a ${Math.floor(diffMins / 60)}h`;
    return `il y a ${Math.floor(diffMins / 1440)}j`;
  };

  // Utiliser les vrais indices de la quête avec logique de statut selon l'état de la quête
  const treasures = normalizeQuestClues(quest.clues).map((clue, index) => {
    let status: 'current' | 'locked' | 'completed';
    
    if (quest.status === 'completed') {
      // Si la quête est terminée, tous les indices sont résolus
      status = 'completed';
    } else {
      // Logique normale pour les quêtes en cours
      status = index === 0 ? 'current' : 'locked';
    }
    
    return {
      id: clue.id,
      name: clue.title,
      description: clue.description,
      location: clue.location ? `${clue.location.latitude}, ${clue.location.longitude}` : 'Localisation à déterminer',
      clue: clue.hint,
      status,
      historicalContext: clue.description || 'Contexte historique à enrichir par l\'IA',
      // Ajouter des dates de résolution pour les quêtes terminées
      resolvedAt: quest.status === 'completed' ? 
        new Date(Date.now() - (24 * 60 * 60 * 1000) * (3 - index)).toISOString() : 
        undefined
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header - Journal Style */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-6 border-l-4 border-amber-500">
            <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <BookOpen className="w-8 h-8 text-amber-600" />
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Journal d'Exploration</h1>
                <p className="text-slate-600">{quest.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <HelpCircle className="w-4 h-4 mr-1" />
                Guide
              </Button>
              <Badge variant="secondary" className={
                quest.status === 'completed' 
                  ? "bg-green-100 text-green-800" 
                  : "bg-amber-100 text-amber-800"
              }>
                {quest.status === 'completed' ? 'Quête terminée' : 'Exploration en cours'}
              </Badge>
            </div>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-4 border-l-4 border-amber-400">
            <p className="text-slate-700 italic">
              {quest.story_background || `"Dans les couloirs de ${quest.title}, des secrets attendent d'être découverts. 
              Suivez les indices et percez leurs mystères..."`}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Quest Progress */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-600" />
                  Progression de la Quête
                </h2>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{treasures.length} indices</Badge>
                  <Button variant="ghost" size="sm">
                    <HelpCircle className="w-4 h-4 mr-1" />
                    Aide
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {treasures.length > 0 ? treasures.map((treasure, index) => (
                  <div 
                    key={treasure.id}
                    className={`border rounded-lg p-4 transition-all ${
                      treasure.status === 'current' 
                        ? 'border-amber-400 bg-amber-50 shadow-md' 
                        : treasure.status === 'locked'
                        ? 'border-slate-200 bg-slate-50 opacity-60'
                        : 'border-green-400 bg-green-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          treasure.status === 'current' ? 'bg-amber-500' : 
                          treasure.status === 'locked' ? 'bg-slate-400' : 'bg-green-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800">{treasure.name}</h3>
                          <p className="text-sm text-slate-600">{treasure.location}</p>
                        </div>
                      </div>
                      {treasure.status === 'current' && (
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                          En cours
                        </Badge>
                      )}
                      {treasure.status === 'completed' && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          ✓ Résolu
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-slate-700 mb-3">{treasure.description}</p>
                    
                    {treasure.status === 'current' && (
                      <div className="bg-white rounded-lg p-3 border-l-4 border-amber-400">
                        <p className="font-medium text-amber-800 mb-1">Indice actuel :</p>
                        <p className="text-slate-700 italic">"{treasure.clue}"</p>
                      </div>
                    )}
                    
                    {treasure.status === 'completed' && (
                      <div className="bg-white rounded-lg p-3 border-l-4 border-green-400">
                        <p className="font-medium text-green-800 mb-1">Indice résolu :</p>
                        <p className="text-slate-700 italic">"{treasure.clue}"</p>
                        {treasure.resolvedAt && (
                          <p className="text-xs text-green-600 mt-2">
                            Résolu le {new Date(treasure.resolvedAt).toLocaleDateString('fr-FR')}
                          </p>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-3 text-xs text-slate-500">
                      <p><strong>Contexte historique :</strong> {treasure.historicalContext}</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-slate-500">
                    <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun indice disponible pour cette quête</p>
                    <p className="text-sm">Les indices apparaîtront ici une fois ajoutés</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Collaboration Sidebar */}
          <div className="space-y-6">
            {/* Active Explorers */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Explorateurs Actifs
                </h3>
                <Badge variant="outline">{stats.participantsCount}</Badge>
              </div>
              
              <div className="space-y-3">
                {activeExplorers.length > 0 ? (
                  activeExplorers.map((explorer, index) => (
                    <div key={explorer.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {explorer.full_name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800">{explorer.full_name}</p>
                        <p className="text-xs text-slate-600">{explorer.location}</p>
                        <p className="text-xs text-blue-600">
                          {explorer.status === 'analyzing_documents' && '📚 Analyse de documents'}
                          {explorer.status === 'on_site' && '📍 Sur le terrain'}
                          {explorer.status === 'researching' && '🔍 Recherche'}
                          {explorer.status === 'offline' && '💤 Hors ligne'}
                        </p>
                      </div>
                      <span className="text-xs text-green-600">{formatTimeAgo(explorer.lastSeen)}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-slate-500">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucun explorateur actif actuellement</p>
                  </div>
                )}
              </div>
              
            </div>

            {/* Recent Discoveries */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-green-600" />
                  Découvertes Récentes
                </h3>
                <Badge variant="outline">{recentDiscoveries.length}</Badge>
              </div>
              
              <div className="space-y-3">
                {recentDiscoveries.length > 0 ? (
                  recentDiscoveries.map((discovery) => (
                    <div key={discovery.id} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800 text-sm">{discovery.type}</p>
                        <p className="text-xs text-slate-600">{discovery.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-green-600">{discovery.user}</span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500">{discovery.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-slate-500">
                    <Camera className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucune découverte récente</p>
                    <p className="text-xs">Les découvertes de l'équipe apparaîtront ici</p>
                  </div>
                )}
              </div>
            </div>

            {/* Personnages Historiques */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <HistoricalFiguresWidget questId={quest.id} compact={true} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorationJournal;