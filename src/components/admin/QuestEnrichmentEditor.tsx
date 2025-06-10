import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Brain, Save, RotateCcw, Sparkles, Clock, CheckCircle, Settings, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useQuests } from '@/hooks/useQuests';
import { useQuestEnrichment } from '@/hooks/useQuestEnrichment';
import { TreasureQuest } from '@/types/quests';
import { MCPService, AIProvider } from '@/services/mcpService';

const QuestEnrichmentEditor = () => {
  const { data: quests, isLoading } = useQuests();
  const { enrichField, saveQuest, getFieldHistory, revertField, isEnriching, isSaving } = useQuestEnrichment();
  
  const [selectedQuestId, setSelectedQuestId] = useState<string>('');
  const [selectedQuest, setSelectedQuest] = useState<TreasureQuest | null>(null);
  const [editedQuest, setEditedQuest] = useState<Partial<TreasureQuest>>({});
  const [enrichingField, setEnrichingField] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('deepseek');
  const [lastEnrichmentError, setLastEnrichmentError] = useState<string | null>(null);
  const [jsonValidationStatus, setJsonValidationStatus] = useState<{[key: string]: boolean}>({});

  const availableProviders = MCPService.getAvailableProviders();

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

  // Valider le JSON des clues
  const validateCluesJson = (value: any): boolean => {
    try {
      let clues = value;
      if (typeof value === 'string') {
        clues = JSON.parse(value);
      }
      
      return Array.isArray(clues) && clues.every(clue => 
        typeof clue === 'object' &&
        clue !== null &&
        typeof clue.id === 'number' &&
        typeof clue.description === 'string' &&
        typeof clue.hint === 'string' &&
        clue.description.length > 0 &&
        clue.hint.length > 0
      );
    } catch {
      return false;
    }
  };

  // Mettre à jour le statut de validation JSON
  useEffect(() => {
    if (editedQuest.clues) {
      const isValid = validateCluesJson(editedQuest.clues);
      setJsonValidationStatus(prev => ({ ...prev, clues: isValid }));
    }
  }, [editedQuest.clues]);

  const handleEnrichField = async (field: keyof TreasureQuest) => {
    if (!selectedQuest) return;
    
    setEnrichingField(field);
    setLastEnrichmentError(null);
    
    try {
      const response = await enrichField({
        questId: selectedQuest.id,
        field: field as any,
        currentValue: editedQuest[field] || selectedQuest[field],
        questContext: editedQuest,
        provider: selectedProvider
      });

      if (response.success) {
        setEditedQuest(prev => ({
          ...prev,
          [field]: response.enrichedValue
        }));
      } else {
        setLastEnrichmentError(response.error || 'Erreur d\'enrichissement');
      }
    } catch (error) {
      console.error('Erreur d\'enrichissement:', error);
      setLastEnrichmentError(error.message || 'Erreur inconnue');
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
    
    // Validation finale pour les clues
    if (editedQuest.clues && !validateCluesJson(editedQuest.clues)) {
      setLastEnrichmentError('Format JSON des indices invalide. Impossible de sauvegarder.');
      return;
    }
    
    try {
      await saveQuest(selectedQuest.id, editedQuest);
      setSelectedQuest({ ...selectedQuest, ...editedQuest } as TreasureQuest);
      setLastEnrichmentError(null);
    } catch (error) {
      console.error('Erreur de sauvegarde:', error);
      setLastEnrichmentError('Erreur lors de la sauvegarde');
    }
  };

  const formatFieldValue = (field: keyof TreasureQuest, value: any): string => {
    try {
      // Gestion spéciale pour target_symbols (array vers chaîne séparée par virgules)
      if (field === 'target_symbols' && Array.isArray(value)) {
        return value.join(', ');
      }
      
      // Gestion spéciale pour clues (formatage JSON uniquement)
      if (field === 'clues') {
        if (typeof value === 'string') {
          try {
            const parsed = JSON.parse(value);
            return JSON.stringify(parsed, null, 2);
          } catch {
            return value;
          }
        }
        if (typeof value === 'object' && value !== null) {
          return JSON.stringify(value, null, 2);
        }
      }
      
      // Pour tous les autres champs, retourner comme chaîne simple
      return String(value || '');
    } catch (error) {
      console.error('Error formatting field value:', error);
      return String(value || '');
    }
  };

  const handleFieldChange = (field: keyof TreasureQuest, newValue: string) => {
    try {
      let processedValue: any = newValue;
      
      if (field === 'target_symbols') {
        processedValue = newValue.split(',').map(s => s.trim()).filter(s => s.length > 0);
      } else if (field === 'clues') {
        try {
          processedValue = JSON.parse(newValue);
        } catch {
          processedValue = newValue;
        }
      }
      
      setEditedQuest(prev => ({ ...prev, [field]: processedValue }));
    } catch (error) {
      console.error('Error handling field change:', error);
      setEditedQuest(prev => ({ ...prev, [field]: newValue }));
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
    const fieldValue = editedQuest[field] || '';
    const isJsonField = field === 'clues';
    const isJsonValid = isJsonField ? jsonValidationStatus[field] !== false : true;

    return (
      <Card className="mb-4">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {label}
                {isJsonField && (
                  <div className="flex items-center gap-1">
                    {isJsonValid ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      {isJsonValid ? 'JSON valide' : 'JSON invalide'}
                    </span>
                  </div>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <div className="flex gap-2">
              {history && (
                <Badge variant="secondary" className="gap-1">
                  <Clock className="h-3 w-3" />
                  Enrichi ({history.provider})
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
                value={formatFieldValue(field, fieldValue)}
                onChange={(e) => handleFieldChange(field, e.target.value)}
                rows={field === 'clues' ? 8 : 4}
                className={`font-mono text-sm ${!isJsonValid && isJsonField ? 'border-red-300 bg-red-50' : ''}`}
              />
            ) : (
              <div className="p-3 border rounded bg-muted font-mono text-sm">
                {formatFieldValue(field, fieldValue)}
              </div>
            )}
            
            {!isJsonValid && isJsonField && (
              <div className="p-3 border border-red-200 rounded bg-red-50 text-red-700 text-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  <strong>Format JSON invalide</strong>
                </div>
                <p className="mt-1">Les indices doivent être un array d'objets avec les champs : id (number), description (string), hint (string)</p>
              </div>
            )}
            
            {lastEnrichmentError && enrichingField === field && (
              <div className="p-3 border border-red-200 rounded bg-red-50 text-red-700 text-sm">
                <strong>Erreur d'enrichissement:</strong> {lastEnrichmentError}
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
                {isCurrentlyEnriching ? 'Enrichissement...' : `Enrichir avec ${MCPService.getProviderDisplayName(selectedProvider)}`}
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
                avec {history.provider} (Confiance: {history.confidence}%)
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
            Utilisez différents providers IA pour enrichir automatiquement le contenu de vos quêtes
          </p>
        </div>
        
        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <Select value={selectedProvider} onValueChange={(value: AIProvider) => setSelectedProvider(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableProviders.map((provider) => (
                  <SelectItem key={provider} value={provider}>
                    {MCPService.getProviderDisplayName(provider)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedQuest && (
            <Button
              onClick={handleSaveQuest}
              disabled={isSaving || !Object.values(jsonValidationStatus).every(Boolean)}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          )}
        </div>
      </div>

      {/* Provider Info Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Brain className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="font-semibold">Provider IA actuel : {MCPService.getProviderDisplayName(selectedProvider)}</h3>
              <p className="text-sm text-muted-foreground">
                {selectedProvider === 'deepseek' && 'Spécialisé dans l\'analyse historique et culturelle détaillée'}
                {selectedProvider === 'openai' && 'Excellent pour la génération créative et la restructuration de contenu'}
                {selectedProvider === 'anthropic' && 'Optimal pour la précision historique et la cohérence narrative'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
            'Liste des indices au format JSON strict avec id, description et hint'
          )}

          {renderFieldEditor(
            'target_symbols',
            'Symboles Cibles',
            'Symboles pertinents pour cette quête (séparés par des virgules)'
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
