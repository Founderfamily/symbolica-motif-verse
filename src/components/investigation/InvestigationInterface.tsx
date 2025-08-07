import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TreasureQuest } from '@/types/quests';
import { useQuestParticipantsSimple } from '@/hooks/useQuestParticipantsSimple';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Map, BookOpen, FileText, MessageCircle, Search, User, Archive } from 'lucide-react';
import TreasureProbabilityWidget from './TreasureProbabilityWidget';
import ChronologicalJournal from './ChronologicalJournal';
import ClueVotingSystem from './ClueVotingSystem';
import EnhancedChatInterface from './EnhancedChatInterface';
import SourceTrackingWidget from './SourceTrackingWidget';
import AIInvestigationTab from './AIInvestigationTab';
import InteractiveMapTab from './InteractiveMapTab';
import HistoricalFiguresTab from './HistoricalFiguresTab';
import ArchivesTab from './ArchivesTab';

interface InvestigationInterfaceProps {
  quest: TreasureQuest;
}

const InvestigationInterface: React.FC<InvestigationInterfaceProps> = ({ quest }) => {
  const [activeTab, setActiveTab] = useState('carte');
  const [currentProbability, setCurrentProbability] = useState(42);

  const { participants } = useQuestParticipantsSimple(quest.id);
  const aiAnalysisMutation = useAIAnalysis();
  const { isAdmin } = useAuth();

  const handleAIAnalysis = () => {
    if (quest?.id) {
      aiAnalysisMutation.mutate({ questId: quest.id });
    }
  };

  const handleNavigateToTab = (tab: string, data?: any) => {
    setActiveTab(tab);
    console.log('Navigation vers:', tab, 'avec données:', data);
  };

  // Mock data pour les composants
  const mockSources = [
    {
      id: '1',
      type: 'documentary' as const,
      title: 'Archives du Château de Fontainebleau',
      content: 'Documents historiques sur François Ier',
      url: 'https://example.com',
      location: 'Archives Nationales',
      submitted_by: 'expert_historian',
      submitted_at: new Date(),
      verified: true,
      confidence: 0.95,
      votes: 13
    }
  ];

  const mockClues = [
    {
      id: 1,
      title: 'Salamandre de François Ier',
      description: 'Salamandre sculptée dans la galerie François Ier au château',
      content: 'Symbole emblématique de François Ier, visible sur les voûtes',
      hint: 'Comptez le nombre exact de salamandres dans la galerie',
      validation_type: 'photo' as const,
      validation_data: { required_count: 8 },
      votes: { true: 847, false: 23 },
      validation_score: 0.97,
      userVote: true,
      consensus_reached: true,
      validation_threshold: 0.8,
      debate_status: 'consensus' as const,
      submitted_by: 'expert_historian_marie',
      submitted_at: '2024-01-15T10:30:00Z',
      contributors: ['architect_paul', 'photo_analyst_claire'],
      controversy_level: 'low' as const,
      comments: [
        { user: 'architect_paul', text: 'Position confirmée par les plans originaux', votes: 34 },
        { user: 'tourist_guide_anna', text: 'Visible depuis le passage touristique', votes: 18 }
      ]
    },
    {
      id: 2,
      title: 'Inscription latine cachée',
      description: 'Gravure latine partiellement effacée derrière un pilier',
      content: 'FRAN[...] PRIM[...] inscription royale médiévale',
      hint: 'Recherchez les mots "FRANCISCUS PRIMUS" à proximité de la salamandre',
      validation_type: 'symbol' as const,
      validation_data: { target_text: 'FRANCISCUS PRIMUS' },
      votes: { true: 1204, false: 156 },
      validation_score: 0.89,
      userVote: undefined,
      consensus_reached: true,
      validation_threshold: 0.85,
      debate_status: 'consensus' as const,
      submitted_by: 'latin_scholar_thomas',
      submitted_at: '2024-01-12T14:20:00Z',
      contributors: ['epigraphy_expert_lisa', 'historian_jean'],
      controversy_level: 'medium' as const,
      comments: [
        { user: 'epigraphy_expert_lisa', text: 'Style épigraphique typique du XVIe siècle', votes: 89 },
        { user: 'skeptic_robert', text: 'Erosion importante, lecture incertaine', votes: 23 }
      ]
    },
    {
      id: 3,
      title: 'Orientation astronomique',
      description: 'Alignement de la galerie avec le solstice d\'été',
      content: 'La galerie François Ier pointe vers le lever du soleil au solstice',
      hint: 'Vérifiez l\'orientation exacte : 64° Nord-Est',
      validation_type: 'location' as const,
      validation_data: { bearing: 64, tolerance: 2 },
      votes: { true: 892, false: 445 },
      validation_score: 0.67,
      userVote: false,
      consensus_reached: false,
      validation_threshold: 0.75,
      debate_status: 'active_debate' as const,
      submitted_by: 'astronomer_philippe',
      submitted_at: '2024-01-10T09:15:00Z',
      contributors: ['surveyor_michel', 'architect_sophie'],
      controversy_level: 'high' as const,
      comments: [
        { user: 'surveyor_michel', text: 'Mesures GPS confirment 63.8°±0.5°', votes: 156 },
        { user: 'historian_dubois', text: 'François Ier n\'était pas astronome!', votes: 89 }
      ]
    },
    {
      id: 4,
      title: 'Passage secret vers les caves',
      description: 'Mécanisme d\'ouverture dissimulé dans les boiseries',
      content: 'Panneau mobile activé par pression sur une rosace sculptée',
      hint: 'Pressez la 3ème rosace en partant de la cheminée',
      validation_type: 'code' as const,
      validation_data: { sequence: 'rosace_3_press_5sec' },
      votes: { true: 234, false: 1876 },
      validation_score: 0.11,
      userVote: false,
      consensus_reached: true,
      validation_threshold: 0.3,
      debate_status: 'rejected' as const,
      submitted_by: 'mystery_hunter_alex',
      submitted_at: '2024-01-08T16:45:00Z',
      contributors: ['security_fontainebleau', 'conservation_expert'],
      controversy_level: 'high' as const,
      comments: [
        { user: 'security_fontainebleau', text: 'Aucun passage secret répertorié', votes: 234 },
        { user: 'conservation_expert', text: 'Les boiseries sont protégées', votes: 189 }
      ]
    },
    {
      id: 5,
      title: 'Miroir de Claude de France',
      description: 'Miroir historique avec reflets révélateurs',
      content: 'Miroir vénitien du XVIe siècle dans l\'appartement royal',
      hint: 'Regardez le reflet à 16h précises quand le soleil traverse',
      validation_type: 'photo' as const,
      validation_data: { time_window: '15:45-16:15', lighting: 'direct_sunlight' },
      votes: { true: 1567, false: 89 },
      validation_score: 0.95,
      userVote: true,
      consensus_reached: true,
      validation_threshold: 0.8,
      debate_status: 'consensus' as const,
      submitted_by: 'art_historian_camille',
      submitted_at: '2024-01-14T11:00:00Z',
      contributors: ['optics_specialist', 'renaissance_expert'],
      controversy_level: 'low' as const,
      comments: [
        { user: 'optics_specialist', text: 'Phénomène de réflexion documenté', votes: 123 },
        { user: 'visitor_marie45', text: 'J\'ai vu les reflets hier!', votes: 67 }
      ]
    },
    {
      id: 6,
      title: 'Carreaux de faïence codés',
      description: 'Motifs géométriques dans le carrelage de la galerie',
      content: 'Séquence de carreaux bleus formant un code chiffré',
      hint: 'Comptez les carreaux bleus: pattern 3-1-4-1-5-9',
      validation_type: 'symbol' as const,
      validation_data: { pattern: [3,1,4,1,5,9], sequence_type: 'fibonacci_pi' },
      votes: { true: 445, false: 667 },
      validation_score: 0.40,
      userVote: undefined,
      consensus_reached: false,
      validation_threshold: 0.6,
      debate_status: 'controversial' as const,
      submitted_by: 'math_teacher_lucas',
      submitted_at: '2024-01-06T13:30:00Z',
      contributors: ['ceramics_expert', 'number_theorist'],
      controversy_level: 'high' as const,
      comments: [
        { user: 'ceramics_expert', text: 'Carreaux remplacés au XVIIIe siècle', votes: 89 },
        { user: 'number_theorist', text: 'Coïncidence troublante avec π', votes: 156 }
      ]
    },
    {
      id: 7,
      title: 'Portrait de Léonard de Vinci',
      description: 'Portrait caché sous la Joconde de la galerie',
      content: 'Analyse rayons X révèle un portrait antérieur sous la peinture',
      hint: 'Observez les anomalies de brushstrokes près du sourire',
      validation_type: 'photo' as const,
      validation_data: { analysis_type: 'infrared', anomaly_zones: ['mouth', 'eyes'] },
      votes: { true: 2341, false: 134 },
      validation_score: 0.95,
      userVote: true,
      consensus_reached: true,
      validation_threshold: 0.9,
      debate_status: 'consensus' as const,
      submitted_by: 'louvre_researcher_marie',
      submitted_at: '2024-01-18T08:45:00Z',
      contributors: ['xray_technician', 'renaissance_specialist'],
      controversy_level: 'low' as const,
      comments: [
        { user: 'xray_technician', text: 'Couches de peinture confirmées', votes: 234 },
        { user: 'art_critic_bernard', text: 'Découverte majeure!', votes: 189 }
      ]
    },
    {
      id: 8,
      title: 'Code dans les entrelacs',
      description: 'Motifs entrelacés cachant des coordonnées géographiques',
      content: 'Entrelacs celtiques modifiés avec des angles spécifiques',
      hint: 'Mesurez les angles: ils donnent latitude 48.4024°N',
      validation_type: 'location' as const,
      validation_data: { coordinates: [48.4024, 2.7001], precision: 0.001 },
      votes: { true: 678, false: 543 },
      validation_score: 0.56,
      userVote: false,
      consensus_reached: false,
      validation_threshold: 0.7,
      debate_status: 'active_debate' as const,
      submitted_by: 'geometry_prof_claire',
      submitted_at: '2024-01-05T15:20:00Z',
      contributors: ['celtic_art_expert', 'gps_specialist'],
      controversy_level: 'medium' as const,
      comments: [
        { user: 'celtic_art_expert', text: 'Entrelacs non conformes à la tradition', votes: 67 },
        { user: 'gps_specialist', text: 'Coordonnées pointent vers Fontainebleau!', votes: 123 }
      ]
    },
    {
      id: 9,
      title: 'Bibliothèque secrète de François Ier',
      description: 'Collection cachée de manuscrits alchimiques',
      content: 'Rayonnage dissimulé derrière le portrait du roi',
      hint: 'Livre relié en cuir rouge avec l\'emblème de la salamandre',
      validation_type: 'symbol' as const,
      validation_data: { target_book: 'alchemical_treatise_paracelsus' },
      votes: { true: 1876, false: 456 },
      validation_score: 0.80,
      userVote: true,
      consensus_reached: true,
      validation_threshold: 0.75,
      debate_status: 'consensus' as const,
      submitted_by: 'bibliophile_antoine',
      submitted_at: '2024-01-16T12:10:00Z',
      contributors: ['manuscript_expert', 'royal_librarian'],
      controversy_level: 'low' as const,
      comments: [
        { user: 'manuscript_expert', text: 'Style de reliure du XVIe confirmé', votes: 156 },
        { user: 'historian_fontainebleau', text: 'Inventaires royaux mentionnent cette collection', votes: 89 }
      ]
    },
    {
      id: 10,
      title: 'Graffiti de Benvenuto Cellini',
      description: 'Signature de l\'orfèvre italien gravée discrètement',
      content: 'Monogramme BC entrelacé sous une console sculptée',
      hint: 'Cherchez près des œuvres d\'orfèvrerie exposées',
      validation_type: 'symbol' as const,
      validation_data: { monogram: 'BC_intertwined', location: 'console_south_wall' },
      votes: { true: 567, false: 234 },
      validation_score: 0.71,
      userVote: undefined,
      consensus_reached: true,
      validation_threshold: 0.7,
      debate_status: 'consensus' as const,
      submitted_by: 'cellini_specialist_marco',
      submitted_at: '2024-01-09T14:30:00Z',
      contributors: ['goldsmith_expert', 'italian_historian'],
      controversy_level: 'medium' as const,
      comments: [
        { user: 'goldsmith_expert', text: 'Style typique de Cellini', votes: 78 },
        { user: 'skeptic_pierre', text: 'Beaucoup d\'artistes signaient ainsi', votes: 45 }
      ]
    },
    {
      id: 11,
      title: 'Mécanisme d\'horloge astronomique',
      description: 'Engrenages cachés dans le plafond sculpté',
      content: 'Système complexe d\'engrenages dorés intégrés aux motifs',
      hint: 'Écoutez le tic-tac subtil vers 11h45 chaque jour',
      validation_type: 'code' as const,
      validation_data: { sound_pattern: 'tick_11_45', mechanism_type: 'astronomical' },
      votes: { true: 234, false: 1456 },
      validation_score: 0.14,
      userVote: false,
      consensus_reached: true,
      validation_threshold: 0.3,
      debate_status: 'rejected' as const,
      submitted_by: 'clockmaker_henri',
      submitted_at: '2024-01-03T10:15:00Z',
      contributors: ['acoustics_engineer', 'restoration_expert'],
      controversy_level: 'high' as const,
      comments: [
        { user: 'restoration_expert', text: 'Aucun mécanisme détecté lors des travaux', votes: 234 },
        { user: 'acoustics_engineer', text: 'Sons probablement dus à la dilatation', votes: 189 }
      ]
    },
    {
      id: 12,
      title: 'Crypte souterraine',
      description: 'Escalier en colimaçon menant à une crypte secrète',
      content: 'Accès dissimulé sous l\'autel de la chapelle royale',
      hint: 'Dalle mobile marquée de la croix templière',
      validation_type: 'location' as const,
      validation_data: { access_point: 'chapel_altar', marker: 'templar_cross' },
      votes: { true: 3421, false: 567 },
      validation_score: 0.86,
      userVote: true,
      consensus_reached: true,
      validation_threshold: 0.8,
      debate_status: 'consensus' as const,
      submitted_by: 'archaeologist_sophie',
      submitted_at: '2024-01-20T16:00:00Z',
      contributors: ['ground_radar_tech', 'medieval_specialist'],
      controversy_level: 'low' as const,
      comments: [
        { user: 'ground_radar_tech', text: 'Cavité détectée par géoradar', votes: 345 },
        { user: 'medieval_specialist', text: 'Cohérent avec l\'architecture de l\'époque', votes: 234 }
      ]
    },
    {
      id: 13,
      title: 'Carte au trésor de Diane de Poitiers',
      description: 'Parchemin dissimulé dans les appartements de la favorite',
      content: 'Carte dessinée à l\'encre sympathique révélée par la chaleur',
      hint: 'Approchez une bougie du portrait de Diane',
      validation_type: 'photo' as const,
      validation_data: { reveal_method: 'heat_source', target_portrait: 'diane_poitiers' },
      votes: { true: 1234, false: 678 },
      validation_score: 0.65,
      userVote: undefined,
      consensus_reached: false,
      validation_threshold: 0.7,
      debate_status: 'active_debate' as const,
      submitted_by: 'romantic_historian_julie',
      submitted_at: '2024-01-11T13:45:00Z',
      contributors: ['chemistry_expert', 'paper_conservator'],
      controversy_level: 'medium' as const,
      comments: [
        { user: 'chemistry_expert', text: 'Encre sympathique possible au XVIe siècle', votes: 89 },
        { user: 'paper_conservator', text: 'Risque de dégradation du parchemin', votes: 123 }
      ]
    },
    {
      id: 14,
      title: 'Code musical dans les fresques',
      description: 'Notes de musique cachées dans les motifs décoratifs',
      content: 'Séquence mélodique codée dans les volutes ornementales',
      hint: 'Suivez les courbes: do-ré-mi-fa-sol-la-si-do',
      validation_type: 'symbol' as const,
      validation_data: { musical_sequence: ['C','D','E','F','G','A','B','C'], pattern_type: 'scale' },
      votes: { true: 789, false: 456 },
      validation_score: 0.63,
      userVote: true,
      consensus_reached: false,
      validation_threshold: 0.65,
      debate_status: 'active_debate' as const,
      submitted_by: 'musicologist_pierre',
      submitted_at: '2024-01-07T11:20:00Z',
      contributors: ['baroque_specialist', 'pattern_analyst'],
      controversy_level: 'medium' as const,
      comments: [
        { user: 'baroque_specialist', text: 'Notation musicale anachronique pour l\'époque', votes: 67 },
        { user: 'pattern_analyst', text: 'Répétition troublante de la gamme', votes: 89 }
      ]
    },
    {
      id: 15,
      title: 'Cachette derrière le trumeau',
      description: 'Compartiment secret dans le trumeau de la cheminée',
      content: 'Mécanisme d\'ouverture activé par rotation d\'un élément sculpté',
      hint: 'Tournez la tête de lion dans le sens horaire',
      validation_type: 'code' as const,
      validation_data: { mechanism: 'lion_head_rotation', direction: 'clockwise' },
      votes: { true: 2103, false: 298 },
      validation_score: 0.88,
      userVote: true,
      consensus_reached: true,
      validation_threshold: 0.8,
      debate_status: 'consensus' as const,
      submitted_by: 'furniture_expert_claire',
      submitted_at: '2024-01-17T09:30:00Z',
      contributors: ['mechanism_specialist', 'period_craftsman'],
      controversy_level: 'low' as const,
      comments: [
        { user: 'mechanism_specialist', text: 'Mécanisme typique de l\'ébénisterie Renaissance', votes: 178 },
        { user: 'period_craftsman', text: 'J\'ai restauré des pièces similaires', votes: 134 }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Widget de probabilité visible en permanence */}
      <TreasureProbabilityWidget
        questId={quest.id}
        currentProbability={currentProbability}
        lastUpdate="Il y a 2 heures"
        trend="increasing"
        factors={[
          { name: "Sources historiques", score: 85, change: 5 },
          { name: "Indices géographiques", score: 60, change: -2 },
          { name: "Validation communautaire", score: 75, change: 8 },
          { name: "Analyse IA", score: 90, change: 12 }
        ]}
        onAnalyze={handleAIAnalysis}
        isAnalyzing={aiAnalysisMutation.isPending}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="carte" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            Carte
          </TabsTrigger>
          <TabsTrigger value="journal" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Journal
          </TabsTrigger>
          <TabsTrigger value="indices" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Indices
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="investigation" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Investigation
          </TabsTrigger>
          <TabsTrigger value="personnages" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Personnages
          </TabsTrigger>
          <TabsTrigger value="archives" className="flex items-center gap-2">
            <Archive className="h-4 w-4" />
            Archives
          </TabsTrigger>
        </TabsList>

        <TabsContent value="carte" className="space-y-4">
          <InteractiveMapTab quest={quest} />
        </TabsContent>

        <TabsContent value="journal" className="space-y-4">
          <ChronologicalJournal
            quest={quest}
            onNavigateToTab={handleNavigateToTab}
            currentProbability={currentProbability}
            sources={mockSources}
            clues={mockClues}
            documents={[]}
            discussions={[]}
            figures={[]}
            archives={[]}
          />
        </TabsContent>

        <TabsContent value="indices" className="space-y-4">
          <ClueVotingSystem
            questId={quest.id}
            clues={mockClues}
            onClueValidated={(clueId, isValid) => {
              console.log('Clue validation:', clueId, isValid);
              if (isValid) {
                setCurrentProbability(prev => Math.min(prev + 5, 100));
              }
            }}
          />
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <EnhancedChatInterface
            questId={quest.id}
            participants={participants || []}
            onAnalysisRequest={handleAIAnalysis}
          />
        </TabsContent>

        <TabsContent value="investigation" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            <SourceTrackingWidget
              questId={quest.id}
              sources={mockSources}
              onSourceAdd={(source) => console.log('Adding source:', source)}
              onSourceValidate={(sourceId, isValid) => {
                console.log('Validating source:', sourceId, isValid);
                if (isValid) {
                  setCurrentProbability(prev => Math.min(prev + 8, 100));
                }
              }}
            />
            <AIInvestigationTab
              quest={quest}
            />
          </div>
        </TabsContent>

        <TabsContent value="personnages" className="space-y-4">
          <HistoricalFiguresTab questId={quest.id} />
        </TabsContent>

        <TabsContent value="archives" className="space-y-4">
          <ArchivesTab quest={quest} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvestigationInterface;