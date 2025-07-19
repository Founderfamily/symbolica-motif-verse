
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Trash2 } from 'lucide-react';
import { useSymbolSources, useAddSymbolSource, useDeleteSymbolSource } from '@/hooks/useSymbolSources';

interface SourcesTabProps {
  symbolId?: string;
}

export function SourcesTab({ symbolId }: SourcesTabProps) {
  const [newSource, setNewSource] = useState({
    title: '',
    url: '',
    source_type: '',
    description: ''
  });

  const { data: sources } = useSymbolSources(symbolId || null);
  const addSource = useAddSymbolSource();
  const deleteSource = useDeleteSymbolSource();

  const handleAddSource = async () => {
    if (!symbolId || !newSource.title || !newSource.url || !newSource.source_type) {
      return;
    }

    try {
      await addSource.mutateAsync({
        symbol_id: symbolId,
        title: newSource.title,
        url: newSource.url,
        source_type: newSource.source_type,
        description: newSource.description,
        created_by: 'current-user' // This should be replaced with actual user ID
      });
      
      setNewSource({ title: '', url: '', source_type: '', description: '' });
    } catch (error) {
      console.error('Error adding source:', error);
    }
  };

  const handleDeleteSource = async (sourceId: string) => {
    if (!symbolId) return;
    
    try {
      await deleteSource.mutateAsync({ id: sourceId, symbolId });
    } catch (error) {
      console.error('Error deleting source:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Ajouter une nouvelle source */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Ajouter une nouvelle source</h3>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="source-title">Titre de la source *</Label>
            <Input
              id="source-title"
              value={newSource.title}
              onChange={(e) => setNewSource(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Titre de la source..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="source-type">Type de source *</Label>
            <Select value={newSource.source_type} onValueChange={(value) => setNewSource(prev => ({ ...prev, source_type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="book">Livre</SelectItem>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="website">Site web</SelectItem>
                <SelectItem value="academic">Article académique</SelectItem>
                <SelectItem value="museum">Musée</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="source-url">URL *</Label>
            <Input
              id="source-url"
              type="url"
              value={newSource.url}
              onChange={(e) => setNewSource(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://..."
            />
          </div>

          <Button
            onClick={handleAddSource}
            disabled={addSource.isPending || !newSource.title || !newSource.url || !newSource.source_type}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {addSource.isPending ? 'Ajout...' : 'Ajouter la source'}
          </Button>
        </div>
      </div>

      {/* Sources ajoutées */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Sources ajoutées</h3>
        
        {sources && sources.length > 0 ? (
          <div className="space-y-3">
            {sources.map((source) => (
              <Card key={source.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-slate-500" />
                      <h4 className="font-medium">{source.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {source.source_type}
                      </Badge>
                    </div>
                    
                    <a 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-blue-600 hover:underline block"
                    >
                      {source.url}
                    </a>
                    
                    {source.description && (
                      <p className="text-sm text-slate-600">{source.description}</p>
                    )}
                    
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{source.upvotes} votes positifs</span>
                      <span>{source.downvotes} votes négatifs</span>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSource(source.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <p>Aucune source ajoutée pour ce symbole</p>
          </div>
        )}
      </div>
    </div>
  );
}
