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

  // Convert different data sources to timeline events
  const generateTimelineEvents = useMemo(() => {
    const timelineEvents: TimelineEvent[] = [];

    // Convert clues to timeline events
    clues.forEach((clue, index) => {
      const clueEvent: TimelineEvent = {
        id: `clue-${clue.id || index}`,
        timestamp: clue.created_at || clue.submitted_at || new Date().toISOString(),
        type: 'indice',
        title: `Indice découvert: ${clue.title || clue.content?.substring(0, 50) + '...'}`,
        description: clue.description || clue.content || clue.hint || '',
        relatedTabData: { clueId: clue.id, tabTarget: 'clues' },
        consensus_score: clue.validation_score ? Math.round(clue.validation_score * 100) : undefined,
        debate_status: clue.validation_score > 0.8 ? 'consensus' : 
                     clue.validation_score > 0.6 ? 'active' : 'controversial',
        total_participants: clue.votes || 0,
        user_data: {
          submitted_by: clue.submitted_by,
          validated_by: clue.verified_by,
          votes: clue.votes,
          confidence: clue.credibility_score
        }
      };
      timelineEvents.push(clueEvent);
    });

    // Convert sources to timeline events
    sources.forEach((source, index) => {
      const sourceEvent: TimelineEvent = {
        id: `source-${source.id || index}`,
        timestamp: source.submitted_at?.toISOString() || source.created_at || new Date().toISOString(),
        type: 'source',
        title: `Source documentaire: ${source.title}`,
        description: source.content || source.description || '',
        relatedTabData: { sourceId: source.id, tabTarget: 'investigation' },
        consensus_score: source.confidence ? Math.round(source.confidence * 100) : undefined,
        debate_status: source.verified ? 'consensus' : 'active',
        total_participants: source.votes || 0,
        user_data: {
          submitted_by: source.submitted_by,
          votes: source.votes,
          confidence: source.confidence
        },
        metadata: {
          location: source.location,
          source: source.type
        }
      };
      timelineEvents.push(sourceEvent);
    });

    // Convert documents/archives to timeline events
    documents.forEach((doc, index) => {
      const docEvent: TimelineEvent = {
        id: `doc-${doc.id || index}`,
        timestamp: doc.created_at || doc.date_created || new Date().toISOString(),
        type: 'archive',
        title: `Document authentifié: ${doc.title}`,
        description: doc.description || doc.content || '',
        relatedTabData: { documentId: doc.id, tabTarget: 'archives' },
        consensus_score: doc.credibility_score ? Math.round(doc.credibility_score) : undefined,
        debate_status: 'resolved',
        user_data: {
          submitted_by: doc.uploaded_by || doc.author
        },
        metadata: {
          author: doc.author,
          date_created: doc.date_created,
          source: doc.source
        }
      };
      timelineEvents.push(docEvent);
    });

    // Convert archives to timeline events
    archives.forEach((archive, index) => {
      const archiveEvent: TimelineEvent = {
        id: `archive-${archive.id || index}`,
        timestamp: archive.created_at || archive.date || new Date().toISOString(),
        type: 'archive',
        title: `Archive historique: ${archive.title}`,
        description: archive.description || archive.content || '',
        relatedTabData: { archiveId: archive.id, tabTarget: 'archives' },
        consensus_score: archive.credibility ? Math.round(archive.credibility) : 95,
        debate_status: 'resolved',
        metadata: {
          author: archive.author,
          date_created: archive.date,
          source: archive.source,
          location: archive.physical_location || archive.physicalLocation
        }
      };
      timelineEvents.push(archiveEvent);
    });

    // Convert historical figures to timeline events
    figures.forEach((figure, index) => {
      const figureEvent: TimelineEvent = {
        id: `figure-${figure.id || index}`,
        timestamp: figure.created_at || new Date().toISOString(),
        type: 'personnage',
        title: `Personnage historique identifié: ${figure.name}`,
        description: `${figure.role} (${figure.period}) - ${figure.description}`,
        relatedTabData: { figureId: figure.id, tabTarget: 'personnages' },
        consensus_score: figure.relevance ? Math.round(figure.relevance * 100) : undefined,
        debate_status: figure.relevance > 0.8 ? 'consensus' : 'active',
        metadata: {
          author: figure.role,
          date_created: figure.period
        }
      };
      timelineEvents.push(figureEvent);
    });

    // Convert discussions to timeline events
    discussions.forEach((discussion, index) => {
      const discussionEvent: TimelineEvent = {
        id: `discussion-${discussion.id || index}`,
        timestamp: discussion.created_at || discussion.last_activity_at || new Date().toISOString(),
        type: 'discussion',
        title: `Discussion communautaire: ${discussion.title}`,
        description: discussion.content || `Discussion ${discussion.topic_type} avec ${discussion.replies_count || 0} réponses`,
        relatedTabData: { discussionId: discussion.id, tabTarget: 'chat' },
        total_participants: discussion.replies_count || 0,
        debate_status: discussion.pinned ? 'consensus' : 'active',
        user_data: {
          submitted_by: discussion.created_by
        }
      };
      timelineEvents.push(discussionEvent);
    });

    // Sort events by timestamp (most recent first)
    return timelineEvents.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
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