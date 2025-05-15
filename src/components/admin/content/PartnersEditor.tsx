
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
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';
import { Partner, getPartners, createPartner, updatePartner, deletePartner } from '@/services/partnersService';

const PartnersEditor = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPartner, setCurrentPartner] = useState<Partial<Partner>>({
    name: '',
    logo_url: '',
    website_url: '',
    description: { fr: '', en: '' },
    display_order: 0,
    is_active: true
  });
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const data = await getPartners();
      setPartners(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les partenaires.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setCurrentPartner(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLanguageInputChange = (language: 'fr' | 'en', value: string) => {
    setCurrentPartner(prev => ({
      ...prev,
      description: {
        ...(prev.description || {}),
        [language]: value
      }
    }));
  };

  const handleCreate = async () => {
    try {
      if (!currentPartner.name) {
        toast({
          title: "Champ requis",
          description: "Le nom est requis.",
          variant: "destructive"
        });
        return;
      }

      if (!currentPartner.id) {
        await createPartner(currentPartner as Omit<Partner, 'id' | 'created_at' | 'updated_at'>);
        toast({ title: "Succès", description: "Partenaire créé avec succès." });
      } else {
        await updatePartner(currentPartner as Partner);
        toast({ title: "Succès", description: "Partenaire mis à jour avec succès." });
      }
      
      setOpenDialog(false);
      resetForm();
      fetchPartners();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le partenaire.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (partner: Partner) => {
    setCurrentPartner(partner);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce partenaire ?")) {
      try {
        await deletePartner(id);
        toast({ title: "Succès", description: "Partenaire supprimé avec succès." });
        fetchPartners();
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le partenaire.",
          variant: "destructive"
        });
      }
    }
  };

  const handleMoveUp = async (partner: Partner, index: number) => {
    if (index === 0) return;
    
    const prevItem = partners[index - 1];
    const updatedCurrent = { ...partner, display_order: prevItem.display_order };
    const updatedPrev = { ...prevItem, display_order: partner.display_order };
    
    try {
      await updatePartner(updatedCurrent);
      await updatePartner(updatedPrev);
      fetchPartners();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de réorganiser les partenaires.",
        variant: "destructive"
      });
    }
  };

  const handleMoveDown = async (partner: Partner, index: number) => {
    if (index === partners.length - 1) return;
    
    const nextItem = partners[index + 1];
    const updatedCurrent = { ...partner, display_order: nextItem.display_order };
    const updatedNext = { ...nextItem, display_order: partner.display_order };
    
    try {
      await updatePartner(updatedCurrent);
      await updatePartner(updatedNext);
      fetchPartners();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de réorganiser les partenaires.",
        variant: "destructive"
      });
    }
  };

  const handleStatusToggle = async (partner: Partner) => {
    try {
      await updatePartner({
        ...partner,
        is_active: !partner.is_active
      });
      fetchPartners();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setCurrentPartner({
      name: '',
      logo_url: '',
      website_url: '',
      description: { fr: '', en: '' },
      display_order: partners.length,
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
        <h2 className="text-xl font-semibold">Partenaires</h2>
        <Dialog open={openDialog} onOpenChange={(open) => {
          setOpenDialog(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpenDialog(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Ajouter un partenaire
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Modifier le partenaire" : "Ajouter un partenaire"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  value={currentPartner.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="website_url">Site Web</Label>
                <Input
                  id="website_url"
                  value={currentPartner.website_url || ''}
                  onChange={(e) => handleInputChange('website_url', e.target.value)}
                  placeholder="https://..."
                />
              </div>
              
              <div>
                <Label htmlFor="logo_url">URL du logo</Label>
                <Input
                  id="logo_url"
                  value={currentPartner.logo_url || ''}
                  onChange={(e) => handleInputChange('logo_url', e.target.value)}
                  placeholder="https://..."
                />
              </div>
              
              <Accordion type="single" collapsible defaultValue="fr">
                <AccordionItem value="fr">
                  <AccordionTrigger>Français</AccordionTrigger>
                  <AccordionContent>
                    <div>
                      <Label htmlFor="description-fr">Description</Label>
                      <Textarea
                        id="description-fr"
                        value={currentPartner.description?.fr || ''}
                        onChange={(e) => handleLanguageInputChange('fr', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="en">
                  <AccordionTrigger>English</AccordionTrigger>
                  <AccordionContent>
                    <div>
                      <Label htmlFor="description-en">Description</Label>
                      <Textarea
                        id="description-en"
                        value={currentPartner.description?.en || ''}
                        onChange={(e) => handleLanguageInputChange('en', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is-active"
                  checked={currentPartner.is_active}
                  onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                />
                <Label htmlFor="is-active">Partenaire actif</Label>
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
        {partners.map((partner, index) => (
          <Card key={partner.id} className={partner.is_active ? "" : "opacity-60"}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center space-x-4">
                <div className="bg-slate-100 w-12 h-12 flex items-center justify-center rounded-md">
                  {partner.logo_url ? (
                    <img src={partner.logo_url} alt={partner.name} className="max-w-full max-h-full object-contain" />
                  ) : (
                    <span className="text-sm font-semibold text-slate-400">{partner.name.substring(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <CardTitle className="text-lg">{partner.name}</CardTitle>
                  {partner.website_url && (
                    <a 
                      href={partner.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-amber-600 hover:underline flex items-center"
                    >
                      Visiter le site <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={() => handleMoveUp(partner, index)}>
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleMoveDown(partner, index)}>
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleEdit(partner)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleDelete(partner.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Switch
                  checked={partner.is_active}
                  onCheckedChange={() => handleStatusToggle(partner)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {partner.description?.fr && (
                <p className="text-slate-600">{partner.description.fr}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PartnersEditor;
