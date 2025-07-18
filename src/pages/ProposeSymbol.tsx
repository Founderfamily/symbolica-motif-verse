import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Camera, Upload, X, BookOpen, Send, HelpCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ContributionFormData } from '@/types/contributions';
import { createContribution } from '@/services/contributionService';
import { useCollectionOptions } from '@/hooks/useCollectionOptions';
import { TagSelector } from '@/components/forms/TagSelector';
import { HISTORICAL_PERIODS, SYMBOL_TYPES } from '@/data/formOptions';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ProposeSymbol: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { culturalOptions, isLoading: loadingCollections } = useCollectionOptions();
  
  const [formData, setFormData] = useState<ContributionFormData & {
    significance?: string;
    historical_context?: string;
    sources?: Array<{ title: string; url: string; type: string; author?: string; year?: string; }>;
    symbol_type?: string;
    custom_period?: string;
    custom_culture?: string;
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
    sources: [],
    symbol_type: '',
    custom_period: '',
    custom_culture: ''
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
        title: "Image requise",
        description: "Veuillez sélectionner une image pour votre symbole",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    console.log('Starting form submission...');
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Vous devez être connecté pour proposer un symbole');
      }

      console.log('User authenticated:', user.id);

      // Préparer les données avec les valeurs personnalisées si nécessaire
      const finalFormData = {
        ...formData,
        cultural_context: formData.cultural_context === 'autre' ? formData.custom_culture : formData.cultural_context,
        period: formData.period === 'autre' ? formData.custom_period : formData.period
      };

      console.log('Final form data:', finalFormData);
      console.log('Image file:', imageFile);

      const contributionId = await createContribution(user.id, finalFormData, imageFile);
      
      console.log('Contribution created with ID:', contributionId);
      
      toast({
        title: "Symbole proposé avec succès !",
        description: "Votre proposition sera examinée par nos experts",
      });
      
      navigate('/profile?tab=contributions');
    } catch (error: any) {
      console.error('Submission error:', error);
      
      let errorMessage = "Une erreur est survenue lors de la soumission";
      
      // Provide more specific error messages
      if (error.message?.includes('rate limit')) {
        errorMessage = "Vous avez atteint la limite de 3 propositions par heure. Veuillez réessayer plus tard.";
      } else if (error.message?.includes('file type')) {
        errorMessage = "Format d'image non supporté. Utilisez JPG, PNG ou WebP.";
      } else if (error.message?.includes('file size')) {
        errorMessage = "L'image est trop volumineuse. Taille maximale : 5MB.";
      } else if (error.message?.includes('Invalid file name')) {
        errorMessage = "Nom de fichier invalide. Évitez les caractères spéciaux.";
      } else if (error.message?.includes('Failed to upload image')) {
        errorMessage = "Échec de l'upload de l'image. Vérifiez votre connexion.";
      } else if (error.message?.includes('Failed to create contribution')) {
        errorMessage = "Erreur lors de l'enregistrement. Vérifiez que tous les champs requis sont remplis.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
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

  const selectedSymbolType = SYMBOL_TYPES.find(type => type.value === formData.symbol_type);

  return (
    <TooltipProvider>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Proposer un Symbole</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Partagez un symbole culturel avec la communauté. Notre interface simplifiée vous guide étape par étape.
            </p>
          </div>

          {/* Progress Steps - Now only 2 steps */}
          <div className="flex items-center justify-center space-x-4">
            <StepIndicator step={1} currentStep={currentStep} />
            <div className={`h-1 w-16 ${currentStep > 1 ? 'bg-primary' : 'bg-muted'}`} />
            <StepIndicator step={2} currentStep={currentStep} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Informations essentielles */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Informations essentielles
                  </CardTitle>
                  <CardDescription>
                    Décrivez votre symbole en quelques informations clés
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nom du symbole */}
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
                    
                    {/* Type de symbole */}
                    <div className="space-y-2">
                      <Label htmlFor="symbol_type" className="flex items-center gap-2">
                        Type de symbole
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="w-4 h-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Choisissez le type qui correspond le mieux à votre symbole</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Select value={formData.symbol_type} onValueChange={(value) => setFormData(prev => ({ ...prev, symbol_type: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un type" />
                        </SelectTrigger>
                        <SelectContent>
                          {SYMBOL_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex flex-col">
                                <span>{type.label}</span>
                                {type.example && <span className="text-xs text-muted-foreground">{type.example}</span>}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder={selectedSymbolType ? 
                        `Décrivez ce ${selectedSymbolType.label.toLowerCase()}, son apparence et sa signification...` :
                        "Décrivez le symbole, son apparence et sa signification..."
                      }
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Culture d'origine - Select avec collections existantes */}
                    <div className="space-y-2">
                      <Label htmlFor="cultural_context">Culture d'origine *</Label>
                      <Select 
                        value={formData.cultural_context} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, cultural_context: value }))}
                        disabled={loadingCollections}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une culture" />
                        </SelectTrigger>
                        <SelectContent>
                          {culturalOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                          <SelectItem value="autre">Autre culture</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {/* Champ personnalisé si "Autre" est sélectionné */}
                      {formData.cultural_context === 'autre' && (
                        <Input
                          value={formData.custom_culture}
                          onChange={(e) => setFormData(prev => ({ ...prev, custom_culture: e.target.value }))}
                          placeholder="Précisez la culture"
                          required
                        />
                      )}
                    </div>
                    
                    {/* Période historique - Select prédéfini */}
                    <div className="space-y-2">
                      <Label htmlFor="period">Période historique</Label>
                      <Select value={formData.period} onValueChange={(value) => setFormData(prev => ({ ...prev, period: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une période" />
                        </SelectTrigger>
                        <SelectContent>
                          {HISTORICAL_PERIODS.map((period) => (
                            <SelectItem key={period.value} value={period.value}>
                              {period.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      {/* Champ personnalisé si "Autre" est sélectionné */}
                      {formData.period === 'autre' && (
                        <Input
                          value={formData.custom_period}
                          onChange={(e) => setFormData(prev => ({ ...prev, custom_period: e.target.value }))}
                          placeholder="Ex: 3000-300 av. J.-C."
                        />
                      )}
                    </div>
                  </div>

                  {/* Lieu (optionnel) */}
                  <div className="space-y-2">
                    <Label htmlFor="location_name">Lieu de découverte/utilisation (optionnel)</Label>
                    <Input
                      id="location_name"
                      value={formData.location_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, location_name: e.target.value }))}
                      placeholder="Ex: Vallée des Rois, Égypte"
                    />
                  </div>

                  {/* Tags avec sélecteur amélioré */}
                  <TagSelector
                    selectedTags={formData.tags}
                    onTagsChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
                  />
                </CardContent>
              </Card>
            )}

            {/* Step 2: Image et sources */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Image et sources
                  </CardTitle>
                  <CardDescription>
                    Ajoutez une image de qualité et des sources pour valider votre proposition
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

                  {/* Informations complémentaires (optionnelles) */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-muted-foreground">Informations complémentaires (optionnelles)</h3>
                    
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
                  </div>

                  {/* Sources simplifiées */}
                  <div className="space-y-4">
                    <Label>Sources (recommandé pour validation)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <Button type="button" onClick={addSource} size="sm" disabled={!newSource.title || !newSource.url}>
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

                  {/* Récapitulatif */}
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-medium mb-2">Récapitulatif de votre proposition</h3>
                    <div className="space-y-1 text-sm">
                      <div><strong>Symbole:</strong> {formData.title}</div>
                      <div><strong>Type:</strong> {selectedSymbolType?.label || 'Non spécifié'}</div>
                      <div><strong>Culture:</strong> {formData.cultural_context === 'autre' ? formData.custom_culture : formData.cultural_context}</div>
                      <div><strong>Période:</strong> {formData.period === 'autre' ? formData.custom_period : 
                        HISTORICAL_PERIODS.find(p => p.value === formData.period)?.label || 'Non spécifiée'}</div>
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
              
              {currentStep < 2 ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(Math.min(2, currentStep + 1))}
                  disabled={!formData.title || !formData.description || !formData.cultural_context}
                >
                  Suivant
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting || !imageFile}
                  className="min-w-32"
                >
                  {isSubmitting ? (
                    'Envoi...'
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Proposer le symbole
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ProposeSymbol;
