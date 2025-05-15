
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';
import { createContribution } from '@/services/contributionService';
import { ContributionFormData } from '@/types/contributions';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPin, Tags, Upload, Calendar, Info, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import MapSelector from '@/components/contributions/MapSelector';
import ImageDropzone from '@/components/contributions/ImageDropzone';

const formSchema = z.object({
  title: z.string().min(5, 'Le titre doit contenir au moins 5 caractères'),
  description: z.string().min(20, 'La description doit contenir au moins 20 caractères'),
  location_name: z.string().optional(),
  cultural_context: z.string().min(3, 'Le contexte culturel est requis'),
  period: z.string().min(3, 'La période est requise'),
  tags: z.array(z.string()).min(1, 'Ajoutez au moins un tag'),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
});

const NewContribution = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentTag, setCurrentTag] = useState('');

  const form = useForm<ContributionFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      location_name: '',
      cultural_context: '',
      period: '',
      tags: [],
      latitude: null,
      longitude: null,
    },
  });

  const onSubmit = async (data: ContributionFormData) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (!selectedImage) {
      form.setError('root', { message: 'Une image est requise pour la contribution' });
      return;
    }

    setSubmitting(true);
    const contributionId = await createContribution(user.id, data, selectedImage);
    setSubmitting(false);
    
    if (contributionId) {
      navigate(`/contributions/${contributionId}`);
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !form.getValues().tags.includes(currentTag)) {
      form.setValue('tags', [...form.getValues().tags, currentTag]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    form.setValue(
      'tags',
      form.getValues().tags.filter(tag => tag !== tagToRemove)
    );
  };

  const handleLocationSelected = (lat: number, lng: number, name: string) => {
    form.setValue('latitude', lat);
    form.setValue('longitude', lng);
    form.setValue('location_name', name);
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Vous devez être connecté pour créer une contribution</h1>
        <Button onClick={() => navigate('/auth')}>Se connecter</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Nouvelle Contribution</h1>
      <p className="text-muted-foreground mb-6">
        Partagez un nouveau symbole ou motif avec la communauté Symbolica
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Colonne de gauche - Informations principales */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="mr-2 h-5 w-5 text-primary" />
                    Informations générales
                  </CardTitle>
                  <CardDescription>
                    Détails essentiels sur le motif ou symbole
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titre</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Motif Aztèque du Temple Mayor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Décrivez ce que vous savez sur ce symbole ou motif..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="mr-2 h-5 w-5 text-primary" />
                    Contexte culturel
                  </CardTitle>
                  <CardDescription>
                    Origine et contexte historique
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="cultural_context"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Culture</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Aztèque, Maya, Grec..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="period"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Période</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Ex: 15ème siècle, 1200-1300..." {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Tags className="mr-2 h-5 w-5 text-primary" />
                    Tags
                  </CardTitle>
                  <CardDescription>
                    Ajoutez des mots-clés pour faciliter la recherche
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex">
                      <Input
                        placeholder="Nouveau tag..."
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        className="mr-2"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                      />
                      <Button type="button" onClick={handleAddTag}>
                        Ajouter
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {form.getValues().tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-secondary/80"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          {tag} ×
                        </Badge>
                      ))}
                      {form.getValues().tags.length === 0 && (
                        <p className="text-sm text-muted-foreground italic">
                          Aucun tag ajouté
                        </p>
                      )}
                    </div>
                    {form.formState.errors.tags && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.tags.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Colonne de droite - Image et localisation */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="mr-2 h-5 w-5 text-primary" />
                    Image du symbole
                  </CardTitle>
                  <CardDescription>
                    Téléchargez une photo du symbole ou motif
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageDropzone
                    onImageSelected={(file) => setSelectedImage(file)}
                    selectedImage={selectedImage}
                  />
                  {form.formState.errors.root && (
                    <p className="text-sm text-destructive mt-2">
                      {form.formState.errors.root.message}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5 text-primary" />
                    Localisation
                  </CardTitle>
                  <CardDescription>
                    Où avez-vous trouvé ce symbole ou motif?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MapSelector
                    onLocationSelected={handleLocationSelected}
                    initialLocation={form.getValues().location_name || ''}
                  />
                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name="location_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lieu</FormLabel>
                          <FormControl>
                            <Input {...field} readOnly placeholder="Sélectionnez un lieu sur la carte" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/contributions')}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Envoi en cours...' : 'Soumettre la contribution'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewContribution;
