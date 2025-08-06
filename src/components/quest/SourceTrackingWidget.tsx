import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  BookOpen, 
  MapPin, 
  Users, 
  Plus, 
  CheckCircle, 
  Clock, 
  ExternalLink,
  Shield,
  Star
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Source {
  id: string;
  type: 'documentary' | 'field' | 'community';
  title: string;
  content: string;
  url?: string;
  location?: string;
  submitted_by: string;
  submitted_at: Date;
  verified: boolean;
  confidence: number;
  votes: number;
}

interface SourceTrackingWidgetProps {
  questId: string;
  sources: Source[];
  onSourceAdd: (source: Omit<Source, 'id' | 'submitted_at'>) => void;
  onSourceVote: (sourceId: string, vote: 'up' | 'down') => void;
}

const SourceTrackingWidget: React.FC<SourceTrackingWidgetProps> = ({
  questId,
  sources,
  onSourceAdd,
  onSourceVote
}) => {
  const [isAddingSource, setIsAddingSource] = useState(false);
  const [newSource, setNewSource] = useState({
    type: 'documentary' as const,
    title: '',
    content: '',
    url: '',
    location: '',
    submitted_by: 'current_user', // À remplacer par l'utilisateur actuel
    verified: false,
    confidence: 70,
    votes: 0
  });

  const handleAddSource = () => {
    if (newSource.title && newSource.content) {
      onSourceAdd(newSource);
      setNewSource({
        type: 'documentary',
        title: '',
        content: '',
        url: '',
        location: '',
        submitted_by: 'current_user',
        verified: false,
        confidence: 70,
        votes: 0
      });
      setIsAddingSource(false);
    }
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'documentary': return <BookOpen className="w-4 h-4" />;
      case 'field': return <MapPin className="w-4 h-4" />;
      case 'community': return <Users className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getSourceColor = (type: string) => {
    switch (type) {
      case 'documentary': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'field': return 'bg-green-50 text-green-700 border-green-200';
      case 'community': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'documentary': return 'Documentaire';
      case 'field': return 'Terrain';
      case 'community': return 'Communauté';
      default: return type;
    }
  };

  const documentarySources = sources.filter(s => s.type === 'documentary');
  const fieldSources = sources.filter(s => s.type === 'field');
  const communitySources = sources.filter(s => s.type === 'community');

  const calculateScore = () => {
    const docScore = documentarySources.filter(s => s.verified).length * 15;
    const fieldScore = fieldSources.filter(s => s.verified).length * 20;
    const communityScore = communitySources.filter(s => s.verified).length * 10;
    return Math.min(docScore + fieldScore + communityScore, 100);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Sources & Preuves
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-amber-50 text-amber-700">
              Score: {calculateScore()}%
            </Badge>
            <Dialog open={isAddingSource} onOpenChange={setIsAddingSource}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  Ajouter
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter une nouvelle source</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Type de source</Label>
                    <Select value={newSource.type} onValueChange={(value: any) => setNewSource({...newSource, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                    <SelectItem value="documentary">📚 Documentaire</SelectItem>
                    <SelectItem value="field">📍 Terrain</SelectItem>
                    <SelectItem value="community">🤝 Communauté</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Titre</Label>
                    <Input 
                      value={newSource.title}
                      onChange={(e) => setNewSource({...newSource, title: e.target.value})}
                      placeholder="Titre de la source..."
                    />
                  </div>
                  <div>
                    <Label>Contenu</Label>
                    <Textarea 
                      value={newSource.content}
                      onChange={(e) => setNewSource({...newSource, content: e.target.value})}
                      placeholder="Description détaillée..."
                      rows={3}
                    />
                  </div>
                  {newSource.type === 'documentary' && (
                    <div>
                      <Label>URL (optionnel)</Label>
                      <Input 
                        value={newSource.url}
                        onChange={(e) => setNewSource({...newSource, url: e.target.value})}
                        placeholder="https://..."
                      />
                    </div>
                  )}
                  {newSource.type === 'field' && (
                    <div>
                      <Label>Localisation</Label>
                      <Input 
                        value={newSource.location}
                        onChange={(e) => setNewSource({...newSource, location: e.target.value})}
                        placeholder="Coordonnées ou nom du lieu..."
                      />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button onClick={handleAddSource} className="flex-1">
                      Ajouter la source
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingSource(false)}>
                      Annuler
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-blue-600">{documentarySources.length}</span>
            </div>
            <div className="text-xs text-blue-600">Documentaires</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-green-600">{fieldSources.length}</span>
            </div>
            <div className="text-xs text-green-600">Terrain</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="w-4 h-4 text-purple-600" />
              <span className="font-semibold text-purple-600">{communitySources.length}</span>
            </div>
            <div className="text-xs text-purple-600">Communauté</div>
          </div>
        </div>

        {/* Liste des sources récentes */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-muted-foreground">Sources récentes</h4>
          {sources.slice(0, 3).map((source) => (
            <div key={source.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3 flex-1">
                <Badge variant="outline" className={getSourceColor(source.type)}>
                  {getSourceIcon(source.type)}
                  {getTypeLabel(source.type)}
                </Badge>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{source.title}</div>
                  <div className="text-xs text-muted-foreground">{source.submitted_by}</div>
                </div>
                {source.verified && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => onSourceVote(source.id, 'up')}
                  className="h-8 w-8 p-0"
                >
                  <Star className="w-3 h-3" />
                </Button>
                <span className="text-xs text-muted-foreground">{source.votes}</span>
                {source.url && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0"
                    onClick={() => window.open(source.url, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          {sources.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aucune source ajoutée pour le moment</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SourceTrackingWidget;