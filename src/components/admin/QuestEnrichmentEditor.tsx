
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Brain, Save, RotateCcw, Sparkles, Clock, CheckCircle } from 'lucide-react';
import { useQuests } from '@/hooks/useQuests';
import { useQuestEnrichment } from '@/hooks/useQuestEnrichment';
import { TreasureQuest } from '@/types/quests';

const QuestEnrichmentEditor = () => {
  const { data: quests, isLoading } = useQuests();
  const { enrichField, saveQuest, getFieldHistory, revertField, isEnriching, isSaving } = useQuestEnrichment();
  
  const [selectedQuestId, setSelectedQuestId] = useState<string>('');
  const [selectedQuest, setSelectedQuest] = useState<TreasureQuest | null>(null);
  const [editedQuest, setEditedQuest] = useState<Partial<TreasureQuest>>({});
  const [enrichingField, setEnrichingField] = useState<string | null>(null);

  // Mettre à jour la quête sélectionnée
  useEffect(() => {
    if (selectedQuestId && quests) {
      const quest = quests.find(q => q.id === selectedQuestId);
      if (quest) {
        setSelectedQuest(quest);
        setEditedQuest(quest);
      }
    }
  }, [selectedQuestId, quests]);

  const handleEnrichField = async (field: keyof TreasureQuest) => {
    if (!selectedQuest) return;
    
    setEnrichingField(field);
    try {
      const response = await enrichField({
        questId: selectedQuest.id,
        field: field as any,
        currentValue: editedQuest[field] || selectedQuest[field],
        questContext: editedQuest
      });

      setEditedQuest(prev => ({
        ...prev,
        [field]: response.enrichedValue
      }));
    } catch (error) {
      console.error('Erreur d\'enrichissement:', error);
    } finally {
      setEnrichingField(null);
    }
  };

  const handleRevertField = (field: keyof TreasureQuest) => {
    if (!selectedQuest) return;
    
    const original = revertField(selectedQuest.id, field);
    if (original !== null) {
      setEditedQuest(prev => ({
        ...prev,
        [field]: original
      }));
    } else {
      setEditedQuest(prev => ({
        ...prev,
        [field]: selectedQuest[field]
      }));
    }
  };

  const handleSaveQuest = async () => {
    if (!selectedQuest || !editedQuest) return;
    
    try {
      await saveQuest(selectedQuest.id, editedQuest);
      setSelectedQuest({ ...selectedQuest, ...editedQuest } as TreasureQuest);
    } catch (error) {
      console.error('Erreur de sauvegarde:', error);
    }
  };

  const renderFieldEditor = (
    field: keyof TreasureQuest,
    label: string,
    description: string,
    isTextArea = true
  ) => {
    const history = getFieldHistory(selectedQuest?.id || '', field);
    const hasChanges = editedQuest[field] !== selectedQuest?.[field];
    const isCurrentlyEnriching = enrichingField === field;

    return (
      <Card className="mb-4">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{label}</CardTitle>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <div className="flex gap-2">
              {history && (
                <Badge variant="secondary" className="gap-1">
                  <Clock className="h-3 w-3" />
                  Enrichi
                </Badge>
              )}
              {hasChanges && (
                <Badge variant="outline" className="gap-1">
                  <Sparkles className="h-3 w-3" />
                  Modifié
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {isTextArea ? (
              <Textarea
                value={typeof editedQuest[field] === 'string' ? editedQuest[field] : JSON.stringify(editedQuest[field], null, 2)}
                onChange={(e) => setEditedQuest(prev => ({ ...prev, [field]: e.target.value }))}
                rows={field === 'clues' ? 8 : 4}
                className="font-mono text-sm"
              />
            ) : (
              <div className="p-3 border rounded bg-muted font-mono text-sm">
                {JSON.stringify(editedQuest[field], null, 2)}
              </div>
            )}
            
            <div className="flex gap-2">
              <Button
                onClick={() => handleEnrichField(field)}
                disabled={isEnriching || !selectedQuest}
                variant="default"
                size="sm"
                className="gap-2"
              >
                <Brain className="h-4 w-4" />
                {isCurrentlyEnriching ? 'Enrichissement...' : 'Enrichir avec IA'}
              </Button>
              
              {hasChanges && (
                <Button
                  onClick={() => handleRevertField(field)}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Revenir à l'original
                </Button>
              )}
            </div>

            {history && (
              <div className="text-xs text-muted-foreground">
                Enrichi le {history.timestamp.toLocaleString()} 
                (Confiance: {history.confidence}%)
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return <div className="p-8 text-center">Chargement des quêtes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Enrichissement de Quêtes avec IA</h2>
          <p className="text-muted-foreground">
            Utilisez MCP + DeepSeek pour enrichir automatiquement le contenu de vos quêtes
          </p>
        </div>
        
        {selectedQuest && (
          <Button
            onClick={handleSaveQuest}
            disabled={isSaving}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sélectionner une Quête</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedQuestId} onValueChange={setSelectedQuestId}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir une quête à enrichir" />
            </SelectTrigger>
            <SelectContent>
              {quests?.map((quest) => (
                <SelectItem key={quest.id} value={quest.id}>
                  {quest.title} ({quest.quest_type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedQuest && (
        <div className="grid gap-6">
          {renderFieldEditor(
            'description',
            'Description de la Quête',
            'Description générale qui motivera les participants'
          )}

          {renderFieldEditor(
            'story_background',
            'Contexte Historique',
            'Background historique détaillé et authentique'
          )}

          {renderFieldEditor(
            'clues',
            'Indices de la Quête',
            'Liste des indices au format JSON avec descriptions et hints'
          )}

          {renderFieldEditor(
            'target_symbols',
            'Symboles Cibles',
            'Symboles pertinents pour cette quête (liste)',
            false
          )}
        </div>
      )}

      {!selectedQuest && quests && quests.length > 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Prêt à enrichir vos quêtes</h3>
            <p className="text-muted-foreground">
              Sélectionnez une quête ci-dessus pour commencer l'enrichissement avec l'IA
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuestEnrichmentEditor;
