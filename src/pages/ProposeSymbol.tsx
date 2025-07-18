import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Camera, Plus, X, Upload, MapPin, BookOpen, Clock, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ContributionFormData } from '@/types/contributions';
import { createContribution } from '@/services/contributionService';

const ProposeSymbol: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState<ContributionFormData & {
    significance?: string;
    historical_context?: string;
    sources?: Array<{ title: string; url: string; type: string; author?: string; year?: string; }>;
  }>({
    title: '',
    description: '',
    location_name: '',
    latitude: null,
    longitude: null,
    cultural_context: '',
    period: '',
    tags: [],
    significance: '',
    historical_context: '',
    sources: []
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');
  const [newSource, setNewSource] = useState({
    title: '',
    url: '',
    type: 'website',
    author: '',
    year: ''
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addSource = () => {
    if (newSource.title.trim() && newSource.url.trim()) {
      setFormData(prev => ({
        ...prev,
        sources: [...(prev.sources || []), { 
          ...newSource,
          type: newSource.type as 'book' | 'article' | 'website' | 'museum' | 'other'
        }]
      }));
      setNewSource({ title: '', url: '', type: 'website', author: '', year: '' });
    }
  };

  const removeSource = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sources: prev.sources?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une image",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Vous devez être connecté pour proposer un symbole');
      }

      const contributionId = await createContribution(user.id, formData, imageFile);
      
      toast({
        title: "Symbole proposé avec succès !",
        description: "Votre proposition sera examinée par nos experts",
      });
      
      navigate('/profile?tab=contributions');
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la soumission",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const StepIndicator = ({ step, currentStep }: { step: number; currentStep: number }) => (
    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
      ${step <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
      {step}
    </div>
  );

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Proposer un Symbole</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Partagez un symbole culturel avec la communauté. Votre proposition sera examinée par nos experts avant publication.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4">
          <StepIndicator step={1} currentStep={currentStep} />
          <div className={`h-1 w-16 ${currentStep > 1 ? 'bg-primary' : 'bg-muted'}`} />
          <StepIndicator step={2} currentStep={currentStep} />
          <div className={`h-1 w-16 ${currentStep > 2 ? 'bg-primary' : 'bg-muted'}`} />
          <StepIndicator step={3} currentStep={currentStep} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Informations de base */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Informations de base
                </CardTitle>
                <CardDescription>
                  Décrivez le symbole que vous souhaitez proposer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Nom du symbole *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ex: Ankh égyptien"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cultural_context">Culture d'origine *</Label>
                    <Input
                      id="cultural_context"
                      value={formData.cultural_context}
                      onChange={(e) => setFormData(prev => ({ ...prev, cultural_context: e.target.value }))}
                      placeholder="Ex: Égypte antique"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Décrivez le symbole, son apparence et sa signification..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="period">Période historique</Label>
                    <Input
                      id="period"
                      value={formData.period}
                      onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value }))}
                      placeholder="Ex: 3000-300 av. J.-C."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location_name">Lieu de découverte/utilisation</Label>
                    <Input
                      id="location_name"
                      value={formData.location_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, location_name: e.target.value }))}
                      placeholder="Ex: Vallée des Rois, Égypte"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="significance">Signification et importance</Label>
                  <Textarea
                    id="significance"
                    value={formData.significance}
                    onChange={(e) => setFormData(prev => ({ ...prev, significance: e.target.value }))}
                    placeholder="Expliquez la signification culturelle et l'importance de ce symbole..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Image et détails */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Image et détails
                </CardTitle>
                <CardDescription>
                  Ajoutez une image et des informations complémentaires
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Image Upload */}
                <div className="space-y-4">
                  <Label>Image du symbole *</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Aperçu"
                          className="max-w-full h-64 object-contain mx-auto rounded"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <div>
                          <label htmlFor="image" className="cursor-pointer">
                            <span className="text-primary hover:text-primary/80">
                              Cliquez pour sélectionner une image
                            </span>
                            <input
                              id="image"
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleImageUpload}
                            />
                          </label>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          PNG, JPG, WebP jusqu'à 5MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-4">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Ajouter un tag..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 ml-1"
                          onClick={() => removeTag(tag)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Historical Context */}
                <div className="space-y-2">
                  <Label htmlFor="historical_context">Contexte historique</Label>
                  <Textarea
                    id="historical_context"
                    value={formData.historical_context}
                    onChange={(e) => setFormData(prev => ({ ...prev, historical_context: e.target.value }))}
                    placeholder="Décrivez le contexte historique dans lequel ce symbole était utilisé..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Sources et validation */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Sources et validation
                </CardTitle>
                <CardDescription>
                  Ajoutez des sources pour valider votre proposition
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Sources */}
                <div className="space-y-4">
                  <Label>Sources (recommandé)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      value={newSource.title}
                      onChange={(e) => setNewSource(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Titre de la source"
                    />
                    <Input
                      value={newSource.url}
                      onChange={(e) => setNewSource(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="URL ou référence"
                    />
                    <Select value={newSource.type} onValueChange={(value) => setNewSource(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="book">Livre</SelectItem>
                        <SelectItem value="article">Article</SelectItem>
                        <SelectItem value="website">Site web</SelectItem>
                        <SelectItem value="museum">Musée</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button type="button" onClick={addSource} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter source
                    </Button>
                  </div>
                  
                  {formData.sources && formData.sources.length > 0 && (
                    <div className="space-y-2">
                      {formData.sources.map((source, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <div className="font-medium">{source.title}</div>
                            <div className="text-sm text-muted-foreground">{source.url}</div>
                            <Badge variant="outline">{source.type}</Badge>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSource(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Récapitulatif de votre proposition</h3>
                  <div className="space-y-1 text-sm">
                    <div><strong>Symbole:</strong> {formData.title}</div>
                    <div><strong>Culture:</strong> {formData.cultural_context}</div>
                    <div><strong>Tags:</strong> {formData.tags.join(', ') || 'Aucun'}</div>
                    <div><strong>Sources:</strong> {formData.sources?.length || 0} source(s)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Précédent
            </Button>
            
            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
                disabled={currentStep === 1 && (!formData.title || !formData.description || !formData.cultural_context)}
              >
                Suivant
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting || !imageFile}
                className="min-w-32"
              >
                {isSubmitting ? 'Envoi...' : 'Proposer le symbole'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProposeSymbol;