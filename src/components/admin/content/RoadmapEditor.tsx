
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, CheckCircle, Circle } from 'lucide-react';
import { RoadmapItem, getRoadmapItems, createRoadmapItem, updateRoadmapItem, deleteRoadmapItem } from '@/services/roadmapService';
import { Badge } from '@/components/ui/badge';

const RoadmapEditor = () => {
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<RoadmapItem>>({
    phase: '',
    title: { fr: '', en: '' },
    description: { fr: '', en: '' },
    is_current: false,
    is_completed: false,
    display_order: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await getRoadmapItems();
      setItems(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les étapes de la feuille de route.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setCurrentItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLanguageInputChange = (field: 'title' | 'description', language: 'fr' | 'en', value: string) => {
    setCurrentItem(prev => ({
      ...prev,
      [field]: {
        ...(prev[field] || {}),
        [language]: value
      }
    }));
  };

  const handleCreate = async () => {
    try {
      if (!currentItem.phase) {
        toast({
          title: "Champ requis",
          description: "La phase est requise.",
          variant: "destructive"
        });
        return;
      }

      if (!currentItem.id) {
        await createRoadmapItem(currentItem as Omit<RoadmapItem, 'id' | 'created_at' | 'updated_at'>);
        toast({ title: "Succès", description: "Étape créée avec succès." });
      } else {
        await updateRoadmapItem(currentItem as RoadmapItem);
        toast({ title: "Succès", description: "Étape mise à jour avec succès." });
      }
      
      setOpenDialog(false);
      resetForm();
      fetchItems();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer l'étape.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (item: RoadmapItem) => {
    setCurrentItem(item);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette étape ?")) {
      try {
        await deleteRoadmapItem(id);
        toast({ title: "Succès", description: "Étape supprimée avec succès." });
        fetchItems();
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'étape.",
          variant: "destructive"
        });
      }
    }
  };

  const handleMoveUp = async (item: RoadmapItem, index: number) => {
    if (index === 0) return;
    
    const prevItem = items[index - 1];
    const updatedCurrent = { ...item, display_order: prevItem.display_order };
    const updatedPrev = { ...prevItem, display_order: item.display_order };
    
    try {
      await updateRoadmapItem(updatedCurrent);
      await updateRoadmapItem(updatedPrev);
      fetchItems();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de réorganiser les étapes.",
        variant: "destructive"
      });
    }
  };

  const handleMoveDown = async (item: RoadmapItem, index: number) => {
    if (index === items.length - 1) return;
    
    const nextItem = items[index + 1];
    const updatedCurrent = { ...item, display_order: nextItem.display_order };
    const updatedNext = { ...nextItem, display_order: item.display_order };
    
    try {
      await updateRoadmapItem(updatedCurrent);
      await updateRoadmapItem(updatedNext);
      fetchItems();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de réorganiser les étapes.",
        variant: "destructive"
      });
    }
  };

  const handleSetCurrent = async (item: RoadmapItem) => {
    try {
      // Reset current status for all items
      for (const existingItem of items) {
        if (existingItem.is_current && existingItem.id !== item.id) {
          await updateRoadmapItem({
            ...existingItem,
            is_current: false
          });
        }
      }
      
      // Set the new current item
      await updateRoadmapItem({
        ...item,
        is_current: true
      });
      
      fetchItems();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut.",
        variant: "destructive"
      });
    }
  };

  const handleToggleCompleted = async (item: RoadmapItem) => {
    try {
      await updateRoadmapItem({
        ...item,
        is_completed: !item.is_completed
      });
      fetchItems();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setCurrentItem({
      phase: '',
      title: { fr: '', en: '' },
      description: { fr: '', en: '' },
      is_current: false,
      is_completed: false,
      display_order: items.length
    });
    setIsEditing(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Feuille de route</h2>
        <Dialog open={openDialog} onOpenChange={(open) => {
          setOpenDialog(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpenDialog(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Ajouter une étape
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Modifier l'étape" : "Ajouter une étape"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="phase">Phase (ex: "Phase 1")</Label>
                <Input
                  id="phase"
                  value={currentItem.phase || ''}
                  onChange={(e) => handleInputChange('phase', e.target.value)}
                />
              </div>
              
              <Accordion type="single" collapsible defaultValue="fr">
                <AccordionItem value="fr">
                  <AccordionTrigger>Français</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="title-fr">Titre</Label>
                        <Input
                          id="title-fr"
                          value={currentItem.title?.fr || ''}
                          onChange={(e) => handleLanguageInputChange('title', 'fr', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="description-fr">Description</Label>
                        <Textarea
                          id="description-fr"
                          value={currentItem.description?.fr || ''}
                          onChange={(e) => handleLanguageInputChange('description', 'fr', e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="en">
                  <AccordionTrigger>English</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="title-en">Title</Label>
                        <Input
                          id="title-en"
                          value={currentItem.title?.en || ''}
                          onChange={(e) => handleLanguageInputChange('title', 'en', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="description-en">Description</Label>
                        <Textarea
                          id="description-en"
                          value={currentItem.description?.en || ''}
                          onChange={(e) => handleLanguageInputChange('description', 'en', e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is-completed"
                    checked={currentItem.is_completed}
                    onCheckedChange={(checked) => handleInputChange('is_completed', checked)}
                  />
                  <Label htmlFor="is-completed">Étape terminée</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is-current"
                    checked={currentItem.is_current}
                    onCheckedChange={(checked) => handleInputChange('is_current', checked)}
                  />
                  <Label htmlFor="is-current">Étape en cours</Label>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>Annuler</Button>
              <Button onClick={handleCreate}>
                {isEditing ? "Mettre à jour" : "Ajouter"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid gap-4">
        {items.map((item, index) => (
          <Card key={item.id} className={item.is_current ? "border-amber-500" : item.is_completed ? "border-green-300" : ""}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center space-x-4">
                {item.is_completed ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : item.is_current ? (
                  <Circle className="h-6 w-6 text-amber-500" />
                ) : (
                  <Circle className="h-6 w-6 text-slate-300" />
                )}
                <div>
                  <CardTitle className="text-lg">
                    {item.title?.fr}
                    <span className="ml-2">
                      <Badge variant={item.is_current ? "default" : item.is_completed ? "secondary" : "outline"}>
                        {item.phase}
                      </Badge>
                    </span>
                  </CardTitle>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={() => handleMoveUp(item, index)}>
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleMoveDown(item, index)}>
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleEdit(item)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                {!item.is_current && (
                  <Button variant="outline" size="sm" onClick={() => handleSetCurrent(item)}>
                    Définir comme actuel
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleToggleCompleted(item)}
                >
                  {item.is_completed ? "Marquer non terminé" : "Marquer terminé"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">{item.description?.fr}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoadmapEditor;
