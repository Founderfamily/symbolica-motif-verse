
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Sparkles, 
  Camera, 
  Upload, 
  Search, 
  Filter,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Brain,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { TreasureQuest } from '@/types/quests';

interface AIEvidenceTabProps {
  quest: TreasureQuest;
}

const AIEvidenceTab: React.FC<AIEvidenceTabProps> = ({ quest }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null);

  // Simuler des preuves avec analyse IA
  const mockEvidences = [
    {
      id: '1',
      title: 'Inscription sur Pierre Tombale',
      type: 'photo',
      submittedBy: 'Marie Dubois',
      submittedAt: '2024-01-15T10:30:00Z',
      description: 'Symboles gravés sur une pierre tombale du XIIe siècle',
      imageUrl: '/api/placeholder/300/200',
      location: 'Église Saint-Martin',
      aiAnalysis: {
        confidence: 85,
        findings: ['Symboles templiers identifiés', 'Période médiévale confirmée', 'Connexion avec autres preuves détectée'],
        suggestions: ['Analyser la pierre adjacent', 'Comparer avec le manuscrit de 1204'],
        status: 'validated'
      },
      votes: { up: 12, down: 2 },
      comments: 8
    },
    {
      id: '2',
      title: 'Manuscrit Ancien',
      type: 'document',
      submittedBy: 'Jean Martin',
      submittedAt: '2024-01-14T16:45:00Z',
      description: 'Page d\'un manuscrit mentionnant le trésor',
      imageUrl: '/api/placeholder/300/200',
      location: 'Archives Départementales',
      aiAnalysis: {
        confidence: 92,
        findings: ['Texte en latin médiéval', 'Référence géographique précise', 'Authentification positive'],
        suggestions: ['Traduire passage lignes 15-18', 'Rechercher autres pages du manuscrit'],
        status: 'validated'
      },
      votes: { up: 18, down: 1 },
      comments: 15
    },
    {
      id: '3',
      title: 'Objet Métallique',
      type: 'artifact',
      submittedBy: 'Sophie Legrand',
      submittedAt: '2024-01-13T14:20:00Z',
      description: 'Petite croix en bronze trouvée sur le site',
      imageUrl: '/api/placeholder/300/200',
      location: 'Ancien Château',
      aiAnalysis: {
        confidence: 67,
        findings: ['Métal : bronze du XIIIe siècle', 'Motifs religieux', 'Usure cohérente avec l\'âge'],
        suggestions: ['Analyse métallurgique approfondie', 'Comparaison avec objets similaires'],
        status: 'pending'
      },
      votes: { up: 8, down: 3 },
      comments: 5
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'validated': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'disputed': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-blue-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'photo': return <Camera className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      case 'artifact': return <Box className="h-4 w-4" />;
      default: return <Camera className="h-4 w-4" />;
    }
  };

  const filteredEvidences = mockEvidences.filter(evidence =>
    evidence.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evidence.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Contrôles et actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Preuves avec Analyse IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans les preuves..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
              <Button size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Nouvelle Preuve
              </Button>
            </div>
          </div>

          {/* Statistiques IA */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Analysées IA</span>
              </div>
              <div className="text-2xl font-bold">{mockEvidences.length}</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Validées</span>
              </div>
              <div className="text-2xl font-bold">
                {mockEvidences.filter(e => e.aiAnalysis.status === 'validated').length}
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Confiance Moy.</span>
              </div>
              <div className="text-2xl font-bold">
                {Math.round(mockEvidences.reduce((acc, e) => acc + e.aiAnalysis.confidence, 0) / mockEvidences.length)}%
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <MessageCircle className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Discussions</span>
              </div>
              <div className="text-2xl font-bold">
                {mockEvidences.reduce((acc, e) => acc + e.comments, 0)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des preuves */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvidences.map((evidence) => (
          <Card key={evidence.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(evidence.type)}
                  <CardTitle className="text-lg">{evidence.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(evidence.aiAnalysis.status)}
                  <Badge variant="outline" className="text-xs">
                    {evidence.aiAnalysis.confidence}% confiance
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Image de la preuve */}
              <div className="relative">
                <img 
                  src={evidence.imageUrl} 
                  alt={evidence.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2">
                  <Button size="sm" variant="secondary" className="h-8 px-2">
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Informations */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">{evidence.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Par {evidence.submittedBy}</span>
                  <span>•</span>
                  <span>{evidence.location}</span>
                  <span>•</span>
                  <span>{new Date(evidence.submittedAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              {/* Analyse IA */}
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Analyse IA</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Découvertes:</span>
                    <ul className="text-xs text-muted-foreground mt-1">
                      {evidence.aiAnalysis.findings.map((finding, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="text-green-500">•</span>
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Suggestions:</span>
                    <ul className="text-xs text-muted-foreground mt-1">
                      {evidence.aiAnalysis.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="text-blue-500">→</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="h-8 px-2">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    {evidence.votes.up}
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 px-2">
                    <ThumbsDown className="h-3 w-3 mr-1" />
                    {evidence.votes.down}
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 px-2">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    {evidence.comments}
                  </Button>
                </div>
                <Button size="sm" variant="outline">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Réanalyser
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvidences.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Aucune preuve trouvée</p>
            <p className="text-sm text-muted-foreground">
              Commencez par uploader une preuve pour déclencher l'analyse IA
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIEvidenceTab;
