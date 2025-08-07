import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TreasureQuest } from '@/types/quests';
import TreasureProbabilityWidget from '@/components/quest/TreasureProbabilityWidget';
import SourceTrackingWidget from '@/components/quest/SourceTrackingWidget';
import ClueVotingSystem from '@/components/quest/ClueVotingSystem';
import LogicalProgressionInterface from '@/components/quest/LogicalProgressionInterface';
import EnhancedChatInterface from '@/components/quest/EnhancedChatInterface';
import { 
  Compass, 
  FileSearch, 
  Vote, 
  MessageSquare, 
  TrendingUp 
} from 'lucide-react';

interface EnhancedCluesTabProps {
  quest: TreasureQuest;
}

const EnhancedCluesTab: React.FC<EnhancedCluesTabProps> = ({ quest }) => {
  // Données simulées pour la démonstration
  const [sources, setSources] = useState([
    { id: '1', type: 'documentary' as const, title: 'Archives Château de Fontainebleau', content: 'Documents sur les trésor cachés de François Ier', verified: true, confidence: 85, votes: 12, submitted_by: 'Historien123', submitted_at: new Date() },
    { id: '2', type: 'field' as const, title: 'Reconnaissance terrain', content: 'Visite des sous-sols du château', verified: false, confidence: 60, votes: 5, submitted_by: 'Explorer42', submitted_at: new Date() },
    { id: '3', type: 'community' as const, title: 'Témoignage local', content: 'Récit de famille sur un passage secret', verified: false, confidence: 40, votes: 8, submitted_by: 'Local77', submitted_at: new Date() }
  ]);

  const [cluesWithVotes, setCluesWithVotes] = useState([
    { 
      id: 1, 
      title: 'Symbole de la Salamandre', 
      description: 'Chercher le symbole royal de François Ier',
      hint: 'Regardez les plafonds sculptés',
      validation_type: 'symbol' as const,
      validation_data: {},
      content: 'Chercher le symbole royal de François Ier', 
      votes: { true: 8, false: 2 }, 
      validation_score: 80,
      userVote: undefined as 'true' | 'false' | undefined,
      consensus_reached: false,
      validation_threshold: 70,
      comments: []
    },
    { 
      id: 2, 
      title: 'Galerie François Ier', 
      description: 'Explorer la galerie principale du château',
      hint: 'Comptez les fresques représentant des salamandres',
      validation_type: 'location' as const,
      validation_data: {},
      content: 'Explorer la galerie principale du château', 
      votes: { true: 15, false: 1 }, 
      validation_score: 90,
      userVote: undefined as 'true' | 'false' | undefined,
      consensus_reached: true,
      validation_threshold: 70,
      comments: []
    },
    { 
      id: 3, 
      title: 'Escalier Secret', 
      description: 'Localiser l\'escalier mentionné dans les documents',
      hint: 'Cherchez derrière les tapisseries',
      validation_type: 'photo' as const,
      validation_data: {},
      content: 'Localiser l\'escalier mentionné dans les documents', 
      votes: { true: 5, false: 8 }, 
      validation_score: 30,
      userVote: undefined as 'true' | 'false' | undefined,
      consensus_reached: false,
      validation_threshold: 70,
      comments: []
    }
  ]);

  const [chatMessages, setChatMessages] = useState([
    { id: '1', type: 'user' as const, user: 'HistorienPro', content: 'J\'ai trouvé ce document sur François Ier...', timestamp: new Date(), attachedClues: ['1'] },
    { id: '2', type: 'user' as const, user: 'ExploreurTerrain', content: 'Sur le terrain, j\'ai remarqué des marques étranges', timestamp: new Date(), attachedClues: [] }
  ]);

  const [currentProgress, setCurrentProgress] = useState({
    totalClues: quest.clues.length,
    completedClues: 1,
    mapUnlocked: false,
    finalStageUnlocked: false
  });

  // Handlers pour les nouveaux composants
  const handleProbabilityChange = (probability: number) => {
    console.log('Probabilité mise à jour:', probability);
  };

  const handleSourceAdd = (source: any) => {
    const newSource = { ...source, id: Date.now().toString(), submitted_at: new Date() };
    setSources([newSource, ...sources]);
  };

  const handleSourceVote = (sourceId: string, vote: 'up' | 'down') => {
    setSources(sources.map(source => 
      source.id === sourceId 
        ? { ...source, votes: source.votes + (vote === 'up' ? 1 : -1) }
        : source
    ));
  };

  const handleClueVote = (clueId: string, voteType: 'true' | 'false', comment?: string) => {
    setCluesWithVotes(cluesWithVotes.map(clue => {
      if (clue.id.toString() === clueId) {
        const newVotes = { ...clue.votes };
        newVotes[voteType] += 1;
        const total = newVotes.true + newVotes.false;
        const validation_score = Math.round((newVotes.true / total) * 100);
        return { ...clue, votes: newVotes, validation_score };
      }
      return clue;
    }));
  };

  const handleClueUnlock = (clueId: string) => {
    console.log('Débloquer l\'indice:', clueId);
  };

  const handleClueActivate = (clueId: string) => {
    setCurrentProgress(prev => ({
      ...prev,
      completedClues: prev.completedClues + 1
    }));
  };

  const handleMapAccess = () => {
    console.log('Accès à la carte interacteur');
  };

  const handleFinalStage = () => {
    console.log('Progression vers l\'étape finale');
  };

  const handleSendMessage = (content: string, attachedClues?: string[]) => {
    const newMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      user: 'Utilisateur',
      content,
      timestamp: new Date(),
      attachedClues: attachedClues || []
    };
    setChatMessages([...chatMessages, newMessage]);
  };

  const handleAISuggestion = (content: string) => {
    return Promise.resolve('Suggestion IA basée sur: ' + content);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="progression" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="progression" className="flex items-center gap-2">
            <Compass className="w-4 h-4" />
            Progression
          </TabsTrigger>
          <TabsTrigger value="sources" className="flex items-center gap-2">
            <FileSearch className="w-4 h-4" />
            Sources
          </TabsTrigger>
          <TabsTrigger value="votes" className="flex items-center gap-2">
            <Vote className="w-4 h-4" />
            Votes Indices
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Chat Collaboratif
          </TabsTrigger>
          <TabsTrigger value="probability" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Probabilité
          </TabsTrigger>
        </TabsList>

        <TabsContent value="progression" className="space-y-4">
          <LogicalProgressionInterface
            clues={quest.clues.map((clue, index) => ({
              id: clue.id.toString(),
              title: clue.title,
              description: clue.description,
              status: index === 0 ? 'completed' : index === 1 ? 'available' : 'locked',
              dependencies: index > 0 ? [(clue.id - 1).toString()] : [],
              unlockInfo: index > 0 ? `Complétez l'indice ${index}` : 'Disponible immédiatement',
              validationScore: Math.floor(Math.random() * 100),
              unlocks: index < quest.clues.length - 1 ? [(clue.id + 1).toString()] : [],
              validation_score: Math.floor(Math.random() * 100),
              required_for_map: index >= Math.floor(quest.clues.length * 0.6)
            }))}
            questProgress={currentProgress}
            onClueActivate={handleClueActivate}
            onMapAccess={handleMapAccess}
            onFinalStage={handleFinalStage}
          />
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <SourceTrackingWidget
            questId={quest.id}
            sources={sources}
            onSourceAdd={handleSourceAdd}
            onSourceVote={handleSourceVote}
          />
        </TabsContent>

        <TabsContent value="votes" className="space-y-4">
          <ClueVotingSystem
            clues={cluesWithVotes}
            onVote={handleClueVote}
            onUnlock={handleClueUnlock}
          />
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <EnhancedChatInterface
            questId={quest.id}
            messages={chatMessages}
            availableClues={quest.clues}
            onSendMessage={handleSendMessage}
            onAISuggestion={handleAISuggestion}
          />
        </TabsContent>

        <TabsContent value="probability" className="space-y-4">
          <TreasureProbabilityWidget
            questId={quest.id}
            sources={sources.map(s => ({ type: s.type, content: s.content, confidence: s.confidence, verified: s.verified }))}
            clues={cluesWithVotes.map(c => ({ id: c.id.toString(), content: c.content, votes: c.votes, validation_score: c.validation_score }))}
            onProbabilityChange={handleProbabilityChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedCluesTab;