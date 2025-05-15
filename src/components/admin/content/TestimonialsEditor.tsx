
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Testimonial, getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '@/services/testimonialsService';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const TestimonialsEditor = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Partial<Testimonial>>({
    name: '',
    role: { fr: '', en: '' },
    quote: { fr: '', en: '' },
    initials: '',
    display_order: 0,
    is_active: true
  });
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const data = await getTestimonials();
      setTestimonials(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les témoignages.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setCurrentTestimonial(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLanguageInputChange = (field: 'role' | 'quote', language: 'fr' | 'en', value: string) => {
    setCurrentTestimonial(prev => ({
      ...prev,
      [field]: {
        ...(prev[field] || {}),
        [language]: value
      }
    }));
  };

  const handleCreate = async () => {
    try {
      if (!currentTestimonial.name) {
        toast({
          title: "Champ requis",
          description: "Le nom est requis.",
          variant: "destructive"
        });
        return;
      }

      if (!currentTestimonial.id) {
        await createTestimonial(currentTestimonial as Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>);
        toast({ title: "Succès", description: "Témoignage créé avec succès." });
      } else {
        await updateTestimonial(currentTestimonial as Testimonial);
        toast({ title: "Succès", description: "Témoignage mis à jour avec succès." });
      }
      
      setOpenDialog(false);
      resetForm();
      fetchTestimonials();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le témoignage.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setCurrentTestimonial(testimonial);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce témoignage ?")) {
      try {
        await deleteTestimonial(id);
        toast({ title: "Succès", description: "Témoignage supprimé avec succès." });
        fetchTestimonials();
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le témoignage.",
          variant: "destructive"
        });
      }
    }
  };

  const handleMoveUp = async (testimonial: Testimonial, index: number) => {
    if (index === 0) return;
    
    const prevItem = testimonials[index - 1];
    const updatedCurrent = { ...testimonial, display_order: prevItem.display_order };
    const updatedPrev = { ...prevItem, display_order: testimonial.display_order };
    
    try {
      await updateTestimonial(updatedCurrent);
      await updateTestimonial(updatedPrev);
      fetchTestimonials();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de réorganiser les témoignages.",
        variant: "destructive"
      });
    }
  };

  const handleMoveDown = async (testimonial: Testimonial, index: number) => {
    if (index === testimonials.length - 1) return;
    
    const nextItem = testimonials[index + 1];
    const updatedCurrent = { ...testimonial, display_order: nextItem.display_order };
    const updatedNext = { ...nextItem, display_order: testimonial.display_order };
    
    try {
      await updateTestimonial(updatedCurrent);
      await updateTestimonial(updatedNext);
      fetchTestimonials();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de réorganiser les témoignages.",
        variant: "destructive"
      });
    }
  };

  const handleStatusToggle = async (testimonial: Testimonial) => {
    try {
      await updateTestimonial({
        ...testimonial,
        is_active: !testimonial.is_active
      });
      fetchTestimonials();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setCurrentTestimonial({
      name: '',
      role: { fr: '', en: '' },
      quote: { fr: '', en: '' },
      initials: '',
      display_order: testimonials.length,
      is_active: true
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
        <h2 className="text-xl font-semibold">Témoignages</h2>
        <Dialog open={openDialog} onOpenChange={(open) => {
          setOpenDialog(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpenDialog(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Ajouter un témoignage
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Modifier le témoignage" : "Ajouter un témoignage"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    value={currentTestimonial.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="initials">Initiales</Label>
                  <Input
                    id="initials"
                    value={currentTestimonial.initials || ''}
                    onChange={(e) => handleInputChange('initials', e.target.value)}
                    maxLength={3}
                  />
                </div>
              </div>
              
              <Accordion type="single" collapsible defaultValue="fr">
                <AccordionItem value="fr">
                  <AccordionTrigger>Français</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="role-fr">Fonction</Label>
                        <Input
                          id="role-fr"
                          value={currentTestimonial.role?.fr || ''}
                          onChange={(e) => handleLanguageInputChange('role', 'fr', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="quote-fr">Témoignage</Label>
                        <Textarea
                          id="quote-fr"
                          value={currentTestimonial.quote?.fr || ''}
                          onChange={(e) => handleLanguageInputChange('quote', 'fr', e.target.value)}
                          rows={4}
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
                        <Label htmlFor="role-en">Role</Label>
                        <Input
                          id="role-en"
                          value={currentTestimonial.role?.en || ''}
                          onChange={(e) => handleLanguageInputChange('role', 'en', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="quote-en">Testimonial</Label>
                        <Textarea
                          id="quote-en"
                          value={currentTestimonial.quote?.en || ''}
                          onChange={(e) => handleLanguageInputChange('quote', 'en', e.target.value)}
                          rows={4}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is-active"
                  checked={currentTestimonial.is_active}
                  onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                />
                <Label htmlFor="is-active">Témoignage actif</Label>
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
        {testimonials.map((testimonial, index) => (
          <Card key={testimonial.id} className={testimonial.is_active ? "" : "opacity-60"}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{testimonial.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.role?.fr}</CardDescription>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={() => handleMoveUp(testimonial, index)}>
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleMoveDown(testimonial, index)}>
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleEdit(testimonial)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleDelete(testimonial.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Switch
                  checked={testimonial.is_active}
                  onCheckedChange={() => handleStatusToggle(testimonial)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <p className="italic text-slate-600">{testimonial.quote?.fr}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsEditor;
