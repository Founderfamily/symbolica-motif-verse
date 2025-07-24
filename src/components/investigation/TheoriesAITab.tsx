
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Brain, 
  Sparkles, 
  Plus, 
  Search, 
  Filter,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Star,
  TrendingUp,
  Lightbulb,
  Target,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { TreasureQuest } from '@/types/quests';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';

interface TheoriesAITabProps {
  quest: TreasureQuest;
}

const TheoriesAITab: React.FC<TheoriesAITabProps> = ({ quest }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const aiAnalysis = useAIAnalysis();

  // Théories vides pour l'instant - à connecter avec vraies données
  const mockTheories: any[] = [];

  const handleGenerateTheory = async () => {
    try {
      await aiAnalysis.mutateAsync({ 
        questId: quest.id, 
        analysisType: 'theory' 
      });
    } catch (error) {
      console.error('Erreur génération théorie:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'validated': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'disputed': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'active': return <TrendingUp className="h-4 w-4 text-blue-500" />;
      default: return <Brain className="h-4 w-4 text-gray-500" />;
    }
  };

  const getAuthorIcon = (author: string) => {
    if (author === 'Assistant IA') {
      return <Sparkles className="h-4 w-4 text-purple-500" />;
    }
    return null;
  };

  const filteredTheories = mockTheories.filter(theory =>
    theory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    theory.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Contrôles et actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Théories Assistées par IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans les théories..."
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
              <Button 
                size="sm" 
                onClick={handleGenerateTheory}
                disabled={aiAnalysis.isPending}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {aiAnalysis.isPending ? 'Génération...' : 'Générer Théorie IA'}
              </Button>
              <Button size="sm" onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Théorie
              </Button>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Théories</span>
              </div>
              <div className="text-2xl font-bold">0</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Générées IA</span>
              </div>
              <div className="text-2xl font-bold">0</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Score IA Moy.</span>
              </div>
              <div className="text-2xl font-bold">-</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Validées</span>
              </div>
              <div className="text-2xl font-bold">0</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des théories */}
      <div className="space-y-6">
        {filteredTheories.map((theory) => (
          <Card key={theory.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={theory.authorAvatar} />
                    <AvatarFallback>
                      {theory.author === 'Assistant IA' ? (
                        <Sparkles className="h-5 w-5 text-purple-500" />
                      ) : (
                        theory.author[0]
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{theory.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Par {theory.author}</span>
                      {getAuthorIcon(theory.author)}
                      <span>•</span>
                      <span>{new Date(theory.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(theory.status)}
                  <Badge variant="outline" className="text-xs">
                    IA: {theory.aiScore}%
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {theory.evidenceCount} preuves
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Description */}
              <p className="text-sm leading-relaxed">{theory.description}</p>

              {/* Faits supportant */}
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Faits supportant</span>
                </div>
                <ul className="space-y-1">
                  {theory.supportingFacts.map((fact, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-1">•</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Métriques */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-bold">{theory.confidence}%</div>
                  <div className="text-xs text-muted-foreground">Confiance</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-bold">{theory.aiScore}%</div>
                  <div className="text-xs text-muted-foreground">Score IA</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-bold">{theory.evidenceCount}</div>
                  <div className="text-xs text-muted-foreground">Preuves</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="h-8 px-2">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    {theory.votes.up}
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 px-2">
                    <ThumbsDown className="h-3 w-3 mr-1" />
                    {theory.votes.down}
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 px-2">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    {theory.comments}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Star className="h-3 w-3 mr-1" />
                    Suivre
                  </Button>
                  <Button size="sm" variant="outline">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Enrichir IA
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTheories.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Aucune théorie trouvée</p>
            <p className="text-sm text-muted-foreground">
              Créez une nouvelle théorie ou laissez l'IA en générer une basée sur les preuves
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TheoriesAITab;
