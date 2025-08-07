import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, ExternalLink, CheckCircle, AlertCircle, FileText } from 'lucide-react';

interface SourceData {
  id: string;
  type: 'documentary' | 'archaeological' | 'testimonial' | 'digital';
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
  sources: SourceData[];
  onSourceAdd: (source: Partial<SourceData>) => void;
  onSourceValidate: (sourceId: string, isValid: boolean) => void;
}

const SourceTrackingWidget: React.FC<SourceTrackingWidgetProps> = ({
  questId,
  sources,
  onSourceAdd,
  onSourceValidate
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSource, setNewSource] = useState({
    title: '',
    content: '',
    url: '',
    location: '',
    type: 'documentary' as const
  });

  const handleAddSource = () => {
    if (!newSource.title.trim() || !newSource.content.trim()) return;
    
    onSourceAdd({
      ...newSource,
      submitted_by: 'current_user',
      submitted_at: new Date()
    });
    
    setNewSource({
      title: '',
      content: '',
      url: '',
      location: '',
      type: 'documentary'
    });
    
    setIsAddDialogOpen(false);
  };

  const getSourceTypeIcon = (type: string) => {
    switch (type) {
      case 'documentary': return <FileText className="h-4 w-4" />;
      case 'archaeological': return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getSourceTypeBadge = (type: string) => {
    switch (type) {
      case 'documentary': return 'Document';
      case 'archaeological': return 'Archéologique';
      case 'testimonial': return 'Témoignage';
      case 'digital': return 'Numérique';
      default: return type;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Sources documentaires</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter source
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouvelle source documentaire</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Titre</label>
                  <Input
                    value={newSource.title}
                    onChange={(e) => setNewSource(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Titre de la source"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newSource.content}
                    onChange={(e) => setNewSource(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Description détaillée de la source"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">URL (optionnel)</label>
                  <Input
                    value={newSource.url}
                    onChange={(e) => setNewSource(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Localisation (optionnel)</label>
                  <Input
                    value={newSource.location}
                    onChange={(e) => setNewSource(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Lieu de conservation"
                  />
                </div>
                
                <Button onClick={handleAddSource} className="w-full">
                  Ajouter la source
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {sources.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Aucune source documentaire encore ajoutée</p>
              <p className="text-sm">Commencez par ajouter des documents historiques</p>
            </div>
          ) : (
            sources.map((source) => (
              <Card key={source.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                        {getSourceTypeIcon(source.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{source.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {source.content}
                        </p>
                        {source.location && (
                          <p className="text-xs text-muted-foreground mt-1">
                            📍 {source.location}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {getSourceTypeBadge(source.type)}
                      </Badge>
                      {source.verified && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Confiance: {Math.round(source.confidence * 100)}%
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {source.votes} vote{source.votes > 1 ? 's' : ''}
                    </Badge>
                    
                    {source.url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 gap-1"
                        asChild
                      >
                        <a href={source.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                          Voir
                        </a>
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2"
                      onClick={() => onSourceValidate(source.id, true)}
                    >
                      Valider
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SourceTrackingWidget;