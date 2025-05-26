
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { usePatterns } from '@/hooks/usePatterns';
import type { Pattern } from '@/types/patterns';

interface PatternManagerProps {
  symbolId: string;
  onPatternCreated?: (pattern: Pattern) => void;
}

export const PatternManager: React.FC<PatternManagerProps> = ({
  symbolId,
  onPatternCreated
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingPattern, setEditingPattern] = useState<Pattern | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pattern_type: 'geometric' as Pattern['pattern_type'],
    complexity_level: 'simple' as Pattern['complexity_level'],
    cultural_significance: '',
    historical_context: ''
  });

  const { patterns, loading, createPattern, updatePattern, deletePattern } = usePatterns(symbolId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPattern) {
        await updatePattern(editingPattern.id, formData);
        setEditingPattern(null);
      } else {
        const newPattern = await createPattern({
          ...formData,
          symbol_id: symbolId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
        if (onPatternCreated) {
          onPatternCreated(newPattern);
        }
        setIsCreating(false);
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving pattern:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      pattern_type: 'geometric',
      complexity_level: 'simple',
      cultural_significance: '',
      historical_context: ''
    });
  };

  const handleEdit = (pattern: Pattern) => {
    setEditingPattern(pattern);
    setFormData({
      name: pattern.name,
      description: pattern.description || '',
      pattern_type: pattern.pattern_type,
      complexity_level: pattern.complexity_level,
      cultural_significance: pattern.cultural_significance || '',
      historical_context: pattern.historical_context || ''
    });
    setIsCreating(true);
  };

  const handleDelete = async (patternId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce motif ?')) {
      try {
        await deletePattern(patternId);
      } catch (error) {
        console.error('Error deleting pattern:', error);
      }
    }
  };

  const cancelEdit = () => {
    setIsCreating(false);
    setEditingPattern(null);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Motifs associés</h2>
        <Button 
          onClick={() => setIsCreating(true)}
          disabled={isCreating}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau motif
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingPattern ? 'Modifier le motif' : 'Créer un nouveau motif'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Nom du motif"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />

              <Textarea
                placeholder="Description du motif"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />

              <div className="grid grid-cols-2 gap-4">
                <Select 
                  value={formData.pattern_type} 
                  onValueChange={(value: Pattern['pattern_type']) => 
                    setFormData(prev => ({ ...prev, pattern_type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type de motif" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="geometric">Géométrique</SelectItem>
                    <SelectItem value="figurative">Figuratif</SelectItem>
                    <SelectItem value="abstract">Abstrait</SelectItem>
                    <SelectItem value="decorative">Décoratif</SelectItem>
                  </SelectContent>
                </Select>

                <Select 
                  value={formData.complexity_level} 
                  onValueChange={(value: Pattern['complexity_level']) => 
                    setFormData(prev => ({ ...prev, complexity_level: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Niveau de complexité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple">Simple</SelectItem>
                    <SelectItem value="medium">Moyen</SelectItem>
                    <SelectItem value="complex">Complexe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Textarea
                placeholder="Signification culturelle"
                value={formData.cultural_significance}
                onChange={(e) => setFormData(prev => ({ ...prev, cultural_significance: e.target.value }))}
                rows={2}
              />

              <Textarea
                placeholder="Contexte historique"
                value={formData.historical_context}
                onChange={(e) => setFormData(prev => ({ ...prev, historical_context: e.target.value }))}
                rows={2}
              />

              <div className="flex gap-2">
                <Button type="submit">
                  {editingPattern ? 'Mettre à jour' : 'Créer'}
                </Button>
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {loading ? (
          <div>Chargement des motifs...</div>
        ) : patterns.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              Aucun motif associé à ce symbole
            </CardContent>
          </Card>
        ) : (
          patterns.map((pattern) => (
            <Card key={pattern.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold">{pattern.name}</h3>
                    {pattern.description && (
                      <p className="text-sm text-gray-600 mt-1">{pattern.description}</p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">{pattern.pattern_type}</Badge>
                      <Badge variant="outline">{pattern.complexity_level}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(pattern)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(pattern.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
