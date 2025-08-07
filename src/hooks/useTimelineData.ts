import { useMemo, useEffect, useState } from 'react';
import { TreasureQuest } from '@/types/quests';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'carte' | 'indice' | 'discussion' | 'source' | 'personnage' | 'archive' | 'decouverte';
  title: string;
  description: string;
  relatedTabData?: any;
  probability_impact?: number;
  community_votes?: any[];
  consensus_score?: number;
  debate_status?: 'active' | 'consensus' | 'controversial' | 'resolved';
  total_participants?: number;
  propositions?: {
    id: string;
    content: string;
    votes_for: number;
    votes_against: number;
    author: string;
  }[];
  user_data?: {
    submitted_by?: string;
    validated_by?: string;
    votes?: number;
    confidence?: number;
  };
  metadata?: {
    location?: string;
    author?: string;
    date_created?: string;
    source?: string;
  };
}

interface UseTimelineDataProps {
  quest: TreasureQuest;
  sources?: any[];
  clues?: any[];
  documents?: any[];
  discussions?: any[];
  figures?: any[];
  archives?: any[];
}

export const useTimelineData = ({
  quest,
  sources = [],
  clues = [],
  documents = [],
  discussions = [],
  figures = [],
  archives = []
}: UseTimelineDataProps) => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);

  // Historical events for Fontainebleau timeline
  const generateTimelineEvents = useMemo(() => {
    const events: TimelineEvent[] = [];

    // Authentic historical events of Château de Fontainebleau
    const historicalEvents: TimelineEvent[] = [
      {
        id: 'fontainebleau-origins',
        timestamp: '1137-01-01T00:00:00Z',
        type: 'archive',
        title: 'Première mention historique',
        description: 'Première mention documentée d\'une résidence royale à Fontainebleau sous Louis VII le Jeune.',
        metadata: {
          location: 'Fontainebleau, France'
        }
      },
      {
        id: 'francois-transformation',
        timestamp: '1528-01-01T00:00:00Z',
        type: 'decouverte',
        title: 'Transformation Renaissance par François Ier',
        description: 'François Ier lance la transformation complète du château médiéval en magnifique résidence Renaissance.',
        metadata: {
          location: 'Château de Fontainebleau'
        }
      },
      {
        id: 'secret-passages',
        timestamp: '1547-01-01T00:00:00Z',
        type: 'indice',
        title: 'Construction des passages secrets',
        description: 'Aménagement de passages secrets et cachettes dans les murs épais du château sous Henri II.',
        metadata: {
          location: 'Ailes du château'
        }
      },
      {
        id: 'louis-xiii-hunts',
        timestamp: '1610-01-01T00:00:00Z',
        type: 'source',
        title: 'Chasses royales et cachettes',
        description: 'Louis XIII organise de grandes chasses et fait aménager des cachettes pour ses objets précieux.',
        metadata: {
          location: 'Forêt de Fontainebleau'
        }
      },
      {
        id: 'napoleon-residence',
        timestamp: '1804-01-01T00:00:00Z',
        type: 'personnage',
        title: 'Résidence favorite de Napoléon',
        description: 'Napoléon Ier fait de Fontainebleau sa résidence préférée et y cache des trésors de ses campagnes.',
        metadata: {
          location: 'Appartements impériaux'
        }
      },
      {
        id: 'napoleon-abdication',
        timestamp: '1814-04-06T00:00:00Z',
        type: 'archive',
        title: 'Abdication de Napoléon',
        description: 'Napoléon signe son abdication dans la cour d\'honneur. Des témoins rapportent des cachettes précipitées.',
        metadata: {
          location: 'Cour d\'honneur'
        }
      },
      {
        id: 'hidden-rooms-discovery',
        timestamp: '1962-01-01T00:00:00Z',
        type: 'decouverte',
        title: 'Découverte de salles cachées',
        description: 'Des travaux de restauration révèlent des pièces murées contenant des indices de trésors royaux.',
        metadata: {
          location: 'Sous-sols du château'
        }
      }
    ];

    // Add historical events first
    events.push(...historicalEvents);

    // Convert modern clues to simplified timeline events
    clues?.forEach((clue, index) => {
      events.push({
        id: `clue-${clue.id || index}`,
        timestamp: clue.created_at || new Date().toISOString(),
        type: 'indice',
        title: clue.description || 'Indice découvert',
        description: clue.content || 'Un indice lié à la quête de Nicolas Flamel.',
        metadata: {
          location: clue.location
        }
      });
    });

    // Convert sources to simplified timeline events
    sources?.forEach((source, index) => {
      events.push({
        id: `source-${source.id || index}`,
        timestamp: source.created_at || new Date().toISOString(),
        type: 'source',
        title: source.title || 'Source documentaire',
        description: source.content || 'Document historique référencé.',
        metadata: {
          location: source.location
        }
      });
    });

    // Convert documents to simplified timeline events
    documents?.forEach((document, index) => {
      events.push({
        id: `document-${document.id || index}`,
        timestamp: document.created_at || new Date().toISOString(),
        type: 'archive',
        title: document.title || 'Document archivé',
        description: document.description || 'Archive historique.',
        metadata: {
          location: document.origin
        }
      });
    });

    // Sort events chronologically (oldest first for historical perspective)
    return events.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [quest, sources, clues, documents, discussions, figures, archives]);

  useEffect(() => {
    setEvents(generateTimelineEvents);
  }, [generateTimelineEvents]);

  // Add new event to timeline
  const addTimelineEvent = (event: Omit<TimelineEvent, 'id'>) => {
    const newEvent: TimelineEvent = {
      ...event,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setEvents(prev => [newEvent, ...prev]);
  };

  // Get events by type
  const getEventsByType = (type: TimelineEvent['type']) => {
    return events.filter(event => event.type === type);
  };

  // Get recent events (last 24 hours)
  const getRecentEvents = (hours: number = 24) => {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return events.filter(event => new Date(event.timestamp) > cutoff);
  };

  // Get statistics
  const getStatistics = () => {
    const totalEvents = events.length;
    const activeDebates = events.filter(e => e.debate_status === 'active').length;
    const consensusEvents = events.filter(e => e.debate_status === 'consensus').length;
    const totalParticipants = events.reduce((sum, e) => sum + (e.total_participants || 0), 0);
    const avgConsensus = events.filter(e => e.consensus_score !== undefined)
      .reduce((sum, e) => sum + (e.consensus_score || 0), 0) / 
      events.filter(e => e.consensus_score !== undefined).length;

    return {
      totalEvents,
      activeDebates,
      consensusEvents,
      totalParticipants,
      avgConsensus: Math.round(avgConsensus) || 0
    };
  };

  return {
    events,
    addTimelineEvent,
    getEventsByType,
    getRecentEvents,
    getStatistics
  };
};