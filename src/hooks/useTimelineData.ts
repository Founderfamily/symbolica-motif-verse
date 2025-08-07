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

  // Historical events for Nicolas Flamel timeline
  const generateTimelineEvents = useMemo(() => {
    const events: TimelineEvent[] = [];

    // Authentic historical events of Nicolas Flamel
    const historicalEvents: TimelineEvent[] = [
      {
        id: 'flamel-birth',
        timestamp: '1330-01-01T00:00:00Z',
        type: 'personnage',
        title: 'Naissance de Nicolas Flamel',
        description: 'Naissance de Nicolas Flamel à Pontoise, futur libraire et alchimiste parisien.',
        metadata: {
          location: 'Pontoise, France'
        }
      },
      {
        id: 'flamel-librarian',
        timestamp: '1357-01-01T00:00:00Z',
        type: 'source',
        title: 'Installation comme libraire-juré',
        description: 'Nicolas Flamel s\'installe comme libraire-juré et copiste dans la rue de Marivaux à Paris.',
        metadata: {
          location: 'Rue de Marivaux, Paris'
        }
      },
      {
        id: 'flamel-marriage',
        timestamp: '1368-01-01T00:00:00Z',
        type: 'personnage',
        title: 'Mariage avec Pernelle',
        description: 'Mariage de Nicolas Flamel avec Pernelle, veuve aisée qui contribuera à sa fortune.',
        metadata: {
          location: 'Paris, France'
        }
      },
      {
        id: 'flamel-discovery',
        timestamp: '1382-01-01T00:00:00Z',
        type: 'indice',
        title: 'Découverte du "Livre d\'Abraham le Juif"',
        description: 'Selon la légende, Nicolas Flamel acquiert un mystérieux manuscrit alchimique pour deux florins.',
        metadata: {
          location: 'Paris, France'
        }
      },
      {
        id: 'flamel-transmutation',
        timestamp: '1383-01-17T00:00:00Z',
        type: 'archive',
        title: 'Première transmutation réussie',
        description: 'Selon ses écrits, première réussite de la transmutation alchimique le 17 janvier.',
        metadata: {
          location: 'Paris, France'
        }
      },
      {
        id: 'flamel-hieroglyphics',
        timestamp: '1399-01-01T00:00:00Z',
        type: 'source',
        title: 'Rédaction des "Figures hiéroglyphiques"',
        description: 'Nicolas Flamel rédige son célèbre traité d\'alchimie "Le Livre des figures hiéroglyphiques".',
        metadata: {
          location: 'Paris, France'
        }
      },
      {
        id: 'flamel-foundations',
        timestamp: '1407-01-01T00:00:00Z',
        type: 'archive',
        title: 'Fondations pieuses et testament',
        description: 'Nicolas Flamel fait de nombreuses donations et fonde des œuvres de charité, témoignant de sa richesse.',
        metadata: {
          location: 'Paris, France'
        }
      },
      {
        id: 'flamel-death',
        timestamp: '1418-03-22T00:00:00Z',
        type: 'personnage',
        title: 'Mort officielle de Nicolas Flamel',
        description: 'Décès officiel de Nicolas Flamel, bien que certaines légendes prétendent qu\'il a simulé sa mort.',
        metadata: {
          location: 'Paris, France'
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