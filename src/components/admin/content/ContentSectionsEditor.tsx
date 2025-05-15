
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Edit, Save, Plus } from 'lucide-react';
import { ContentSection, getContentSections, updateContentSection, createContentSection } from '@/services/contentService';

const ContentSectionsEditor = () => {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<Record<string, ContentSection>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const data = await getContentSections();
      setSections(data);
      
      // Initialize form data
      const initialFormData: Record<string, ContentSection> = {};
      data.forEach(section => {
        initialFormData[section.id] = { ...section };
      });
      setFormData(initialFormData);
      
      setLoading(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les sections de contenu.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const handleEditToggle = (sectionId: string) => {
    setEditMode(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleInputChange = (sectionId: string, field: string, language: string, value: string) => {
    setFormData(prev => {
      const section = { ...prev[sectionId] };
      if (field === 'title' || field === 'subtitle' || field === 'content') {
        section[field] = {
          ...(section[field] || {}),
          [language]: value
        };
      }
      return {
        ...prev,
        [sectionId]: section
      };
    });
  };

  const handleSave = async (sectionId: string) => {
    try {
      await updateContentSection(formData[sectionId]);
      toast({
        title: "Succès",
        description: "Section mise à jour avec succès."
      });
      handleEditToggle(sectionId);
      fetchSections();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la section.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Sections de contenu</h2>
      </div>
      
      <div className="grid gap-4">
        {sections.map(section => (
          <Card key={section.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg capitalize">{section.section_key}</CardTitle>
              <Button 
                variant={editMode[section.id] ? "default" : "outline"} 
                size="sm" 
                onClick={() => handleEditToggle(section.id)}
              >
                {editMode[section.id] ? <Save className="h-4 w-4 mr-1" /> : <Edit className="h-4 w-4 mr-1" />}
                {editMode[section.id] ? "Enregistrer" : "Éditer"}
              </Button>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="fr">
                  <AccordionTrigger>Français</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`${section.id}-title-fr`}>Titre</Label>
                        <Input
                          id={`${section.id}-title-fr`}
                          value={formData[section.id]?.title?.fr || ""}
                          onChange={(e) => handleInputChange(section.id, 'title', 'fr', e.target.value)}
                          readOnly={!editMode[section.id]}
                          className={!editMode[section.id] ? "bg-slate-50" : ""}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`${section.id}-subtitle-fr`}>Sous-titre</Label>
                        <Input
                          id={`${section.id}-subtitle-fr`}
                          value={formData[section.id]?.subtitle?.fr || ""}
                          onChange={(e) => handleInputChange(section.id, 'subtitle', 'fr', e.target.value)}
                          readOnly={!editMode[section.id]}
                          className={!editMode[section.id] ? "bg-slate-50" : ""}
                        />
                      </div>
                      {section.content && (
                        <div>
                          <Label htmlFor={`${section.id}-content-fr`}>Contenu</Label>
                          <Textarea
                            id={`${section.id}-content-fr`}
                            value={formData[section.id]?.content?.fr || ""}
                            onChange={(e) => handleInputChange(section.id, 'content', 'fr', e.target.value)}
                            readOnly={!editMode[section.id]}
                            className={!editMode[section.id] ? "bg-slate-50" : ""}
                          />
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="en">
                  <AccordionTrigger>English</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`${section.id}-title-en`}>Title</Label>
                        <Input
                          id={`${section.id}-title-en`}
                          value={formData[section.id]?.title?.en || ""}
                          onChange={(e) => handleInputChange(section.id, 'title', 'en', e.target.value)}
                          readOnly={!editMode[section.id]}
                          className={!editMode[section.id] ? "bg-slate-50" : ""}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`${section.id}-subtitle-en`}>Subtitle</Label>
                        <Input
                          id={`${section.id}-subtitle-en`}
                          value={formData[section.id]?.subtitle?.en || ""}
                          onChange={(e) => handleInputChange(section.id, 'subtitle', 'en', e.target.value)}
                          readOnly={!editMode[section.id]}
                          className={!editMode[section.id] ? "bg-slate-50" : ""}
                        />
                      </div>
                      {section.content && (
                        <div>
                          <Label htmlFor={`${section.id}-content-en`}>Content</Label>
                          <Textarea
                            id={`${section.id}-content-en`}
                            value={formData[section.id]?.content?.en || ""}
                            onChange={(e) => handleInputChange(section.id, 'content', 'en', e.target.value)}
                            readOnly={!editMode[section.id]}
                            className={!editMode[section.id] ? "bg-slate-50" : ""}
                          />
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              {editMode[section.id] && (
                <div className="mt-4 flex justify-end">
                  <Button 
                    onClick={() => handleSave(section.id)} 
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Enregistrer les modifications
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContentSectionsEditor;
