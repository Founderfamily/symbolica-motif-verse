
import React, { useState } from 'react';
import { useQuests } from '@/hooks/useQuests';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  BookOpen, 
  Edit, 
  Save, 
  Plus, 
  Scroll,
  Crown,
  Sword,
  Trophy,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MasterExplorerPage = () => {
  const { data: quests, isLoading } = useQuests();
  const { isAdmin } = useAuth();
  const [selectedQuest, setSelectedQuest] = useState<string | null>(null);
  const [enrichmentData, setEnrichmentData] = useState({
    story_background: '',
    description: '',
    clues: [] as any[]
  });
  const [newClue, setNewClue] = useState({
    title: '',
    description: '',
    hint: '',
    points: 10
  });
  const [isSaving, setIsSaving] = useState(false);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Accès refusé</h1>
          <p className="text-slate-600">Cette page est réservée aux Master Explorers.</p>
        </Card>
      </div>
    );
  }

  const questTypeIcons = {
    templar: Sword,
    lost_civilization: Scroll,
    grail: Crown,
    custom: Trophy
  };

  const handleQuestSelect = async (questId: string) => {
    setSelectedQuest(questId);
    const quest = quests?.find(q => q.id === questId);
    if (quest) {
      setEnrichmentData({
        story_background: quest.story_background || '',
        description: quest.description || '',
        clues: quest.clues || []
      });
    }
  };

  const addClue = () => {
    if (!newClue.title.trim()) return;
    
    const clue = {
      id: enrichmentData.clues.length + 1,
      title: newClue.title,
      description: newClue.description,
      hint: newClue.hint,
      points: newClue.points,
      validation_type: 'location',
      validation_data: {}
    };
    
    setEnrichmentData(prev => ({
      ...prev,
      clues: [...prev.clues, clue]
    }));
    
    setNewClue({ title: '', description: '', hint: '', points: 10 });
  };

  const removeClue = (index: number) => {
    setEnrichmentData(prev => ({
      ...prev,
      clues: prev.clues.filter((_, i) => i !== index)
    }));
  };

  const saveEnrichment = async () => {
    if (!selectedQuest) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('treasure_quests')
        .update({
          story_background: enrichmentData.story_background,
          description: enrichmentData.description,
          clues: enrichmentData.clues,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedQuest);

      if (error) throw error;

      toast.success('Quête enrichie avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'enrichissement:', error);
      toast.error('Erreur lors de l\'enrichissement de la quête');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement des quêtes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/admin">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour Admin
            </Button>
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <BookOpen className="w-8 h-8 text-amber-600" />
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Master Explorer - Enrichissement des Quêtes</h1>
              <p className="text-slate-600">Ajoutez du contenu historique authentique aux quêtes existantes</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Liste des quêtes */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Quêtes disponibles</h2>
              <div className="space-y-3">
                {quests?.map((quest) => {
                  const TypeIcon = questTypeIcons[quest.quest_type];
                  const isSelected = selectedQuest === quest.id;
                  
                  return (
                    <div
                      key={quest.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-amber-50 border-amber-300' 
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                      onClick={() => handleQuestSelect(quest.id)}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <TypeIcon className="w-5 h-5 text-amber-600" />
                        <h3 className="font-semibold text-sm">{quest.title}</h3>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {quest.quest_type}
                        </Badge>
                        <Badge 
                          variant={quest.status === 'active' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {quest.status}
                        </Badge>
                      </div>
                      
                      <div className="text-xs text-slate-500">
                        {quest.clues?.length || 0} indices • {quest.description ? 'Enrichie' : 'À enrichir'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Interface d'enrichissement */}
          <div className="lg:col-span-2">
            {selectedQuest ? (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">
                    Enrichir: {quests?.find(q => q.id === selectedQuest)?.title}
                  </h2>
                  <Button 
                    onClick={saveEnrichment}
                    disabled={isSaving}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </Button>
                </div>

                <Tabs defaultValue="background" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="background">Contexte Historique</TabsTrigger>
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="clues">Indices</TabsTrigger>
                  </TabsList>

                  <TabsContent value="background">
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-slate-700">
                        Contexte Historique
                      </label>
                      <Textarea
                        value={enrichmentData.story_background}
                        onChange={(e) => setEnrichmentData(prev => ({
                          ...prev,
                          story_background: e.target.value
                        }))}
                        placeholder="Ajoutez le contexte historique authentique de cette quête..."
                        rows={8}
                        className="w-full"
                      />
                      <p className="text-xs text-slate-500">
                        Incluez des faits historiques, des dates, des personnages réels, des lieux authentiques.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="description">
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-slate-700">
                        Description de la Quête
                      </label>
                      <Textarea
                        value={enrichmentData.description}
                        onChange={(e) => setEnrichmentData(prev => ({
                          ...prev,
                          description: e.target.value
                        }))}
                        placeholder="Décrivez précisément ce que les explorateurs vont découvrir..."
                        rows={6}
                        className="w-full"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="clues">
                    <div className="space-y-6">
                      {/* Indices existants */}
                      <div className="space-y-3">
                        <h3 className="font-medium">Indices existants ({enrichmentData.clues.length})</h3>
                        {enrichmentData.clues.map((clue, index) => (
                          <div key={index} className="p-4 bg-slate-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{clue.title}</h4>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeClue(index)}
                                className="text-red-600 hover:bg-red-50"
                              >
                                Supprimer
                              </Button>
                            </div>
                            <p className="text-sm text-slate-600 mb-1">{clue.description}</p>
                            <p className="text-xs text-slate-500">Indice: {clue.hint}</p>
                            <p className="text-xs text-amber-600 mt-1">{clue.points} points</p>
                          </div>
                        ))}
                      </div>

                      {/* Ajouter un nouvel indice */}
                      <div className="border-t pt-6">
                        <h3 className="font-medium mb-4">Ajouter un nouvel indice</h3>
                        <div className="space-y-4">
                          <Input
                            value={newClue.title}
                            onChange={(e) => setNewClue(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Titre de l'indice"
                          />
                          <Textarea
                            value={newClue.description}
                            onChange={(e) => setNewClue(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Description détaillée de l'indice"
                            rows={3}
                          />
                          <Textarea
                            value={newClue.hint}
                            onChange={(e) => setNewClue(prev => ({ ...prev, hint: e.target.value }))}
                            placeholder="Indice pour aider les explorateurs"
                            rows={2}
                          />
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <label className="text-sm font-medium">Points:</label>
                              <Input
                                type="number"
                                value={newClue.points}
                                onChange={(e) => setNewClue(prev => ({ ...prev, points: parseInt(e.target.value) || 10 }))}
                                className="w-20"
                                min="1"
                                max="100"
                              />
                            </div>
                            <Button onClick={addClue} variant="outline">
                              <Plus className="w-4 h-4 mr-2" />
                              Ajouter l'indice
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            ) : (
              <Card className="p-8 text-center">
                <Edit className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">
                  Sélectionnez une quête à enrichir
                </h3>
                <p className="text-slate-500">
                  Choisissez une quête dans la liste de gauche pour commencer l'enrichissement.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterExplorerPage;
