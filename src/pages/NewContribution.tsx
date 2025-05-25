
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPin, Tags, Upload, Calendar, Info, Globe, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import MapSelector from '@/components/contributions/MapSelector';
import ImageDropzone from '@/components/contributions/ImageDropzone';
import { CULTURAL_CONTEXTS, HISTORICAL_PERIODS, CONTRIBUTION_TYPES, COMMON_TAGS } from '@/data/contributionOptions';

const NewContribution = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const [showCultureOther, setShowCultureOther] = useState(false);
  const [showPeriodOther, setShowPeriodOther] = useState(false);

  const formSchema = z.object({
    title: z.string().min(5, t('contributions.form.validation.minLength', { count: 5 })),
    description: z.string().min(20, t('contributions.form.validation.minLength', { count: 20 })),
    location_name: z.string().optional(),
    cultural_context: z.string().min(3, t('contributions.form.validation.required')),
    period: z.string().min(3, t('contributions.form.validation.required')),
    contribution_type: z.string().optional(),
    tags: z.array(z.string()).min(1, t('contributions.form.validation.minTags')),
    latitude: z.number().nullable().optional(),
    longitude: z.number().nullable().optional(),
  });

  const form = useForm<ContributionFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      location_name: '',
      cultural_context: '',
      period: '',
      contribution_type: '',
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
      form.setError('root', { message: t('contributions.form.validation.imageRequired') });
      return;
    }

    setSubmitting(true);
    const contributionId = await createContribution(user.id, data, selectedImage);
    setSubmitting(false);
    
    if (contributionId) {
      navigate(`/contributions/${contributionId}`);
    }
  };

  const handleAddTag = (tag?: string) => {
    const tagToAdd = tag || currentTag;
    if (tagToAdd.trim() && !form.getValues().tags.includes(tagToAdd)) {
      form.setValue('tags', [...form.getValues().tags, tagToAdd]);
      if (!tag) setCurrentTag('');
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

  const handleCultureChange = (value: string) => {
    if (value === 'other') {
      setShowCultureOther(true);
      form.setValue('cultural_context', '');
    } else {
      setShowCultureOther(false);
      form.setValue('cultural_context', value);
    }
  };

  const handlePeriodChange = (value: string) => {
    if (value === 'other') {
      setShowPeriodOther(true);
      form.setValue('period', '');
    } else {
      setShowPeriodOther(false);
      form.setValue('period', value);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">{t('auth.loginTitle')}</h1>
        <Button onClick={() => navigate('/auth')}>{t('auth.login')}</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">{t('contributions.form.title')}</h1>
      <p className="text-muted-foreground mb-6">
        {t('contributions.form.subtitle')}
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
                    {t('contributions.form.sections.general')}
                  </CardTitle>
                  <CardDescription>
                    {t('contributions.form.sections.generalDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('contributions.form.fields.title')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('contributions.form.fields.titlePlaceholder')} {...field} />
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
                        <FormLabel>{t('contributions.form.fields.description')}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t('contributions.form.fields.descriptionPlaceholder')}
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contribution_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('contributions.form.fields.contributionType')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('contributions.form.fields.contributionTypePlaceholder')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CONTRIBUTION_TYPES.map(type => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                    {t('contributions.form.sections.cultural')}
                  </CardTitle>
                  <CardDescription>
                    {t('contributions.form.sections.culturalDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="cultural_context"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('contributions.form.fields.culture')}</FormLabel>
                        {!showCultureOther ? (
                          <Select onValueChange={handleCultureChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t('contributions.form.fields.culturePlaceholder')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CULTURAL_CONTEXTS.map(culture => (
                                <SelectItem key={culture} value={culture}>
                                  {culture}
                                </SelectItem>
                              ))}
                              <SelectItem value="other">
                                {t('contributions.form.fields.cultureOther')}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="space-y-2">
                            <FormControl>
                              <Input
                                placeholder={t('contributions.form.fields.cultureOtherPlaceholder')}
                                {...field}
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setShowCultureOther(false);
                                form.setValue('cultural_context', '');
                              }}
                            >
                              Back to selection
                            </Button>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="period"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('contributions.form.fields.period')}</FormLabel>
                        {!showPeriodOther ? (
                          <Select onValueChange={handlePeriodChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <Calendar className="mr-2 h-4 w-4" />
                                <SelectValue placeholder={t('contributions.form.fields.periodPlaceholder')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {HISTORICAL_PERIODS.map(period => (
                                <SelectItem key={period} value={period}>
                                  {period}
                                </SelectItem>
                              ))}
                              <SelectItem value="other">
                                {t('contributions.form.fields.periodOther')}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="space-y-2">
                            <FormControl>
                              <div className="flex items-center">
                                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder={t('contributions.form.fields.periodOtherPlaceholder')}
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setShowPeriodOther(false);
                                form.setValue('period', '');
                              }}
                            >
                              Back to selection
                            </Button>
                          </div>
                        )}
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
                    {t('contributions.form.sections.tags')}
                  </CardTitle>
                  <CardDescription>
                    {t('contributions.form.sections.tagsDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex">
                      <Input
                        placeholder={t('contributions.form.fields.tagsPlaceholder')}
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
                      <Button type="button" onClick={() => handleAddTag()}>
                        {t('contributions.form.fields.addTag')}
                      </Button>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">{t('contributions.form.fields.commonTags')}</p>
                      <p className="text-xs text-muted-foreground mb-3">{t('contributions.form.fields.commonTagsDescription')}</p>
                      <div className="flex flex-wrap gap-2">
                        {COMMON_TAGS.filter(tag => !form.getValues().tags.includes(tag)).map(tag => (
                          <Button
                            key={tag}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddTag(tag)}
                            className="h-7 text-xs"
                          >
                            <Plus className="mr-1 h-3 w-3" />
                            {tag}
                          </Button>
                        ))}
                      </div>
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
                          {t('contributions.form.fields.noTags')}
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
                    {t('contributions.form.sections.image')}
                  </CardTitle>
                  <CardDescription>
                    {t('contributions.form.sections.imageDescription')}
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
                    {t('contributions.form.sections.location')}
                  </CardTitle>
                  <CardDescription>
                    {t('contributions.form.sections.locationDescription')}
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
                          <FormLabel>{t('contributions.form.fields.location')}</FormLabel>
                          <FormControl>
                            <Input {...field} readOnly placeholder={t('contributions.form.fields.locationPlaceholder')} />
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
              {t('contributions.form.buttons.cancel')}
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? t('contributions.form.buttons.submitting') : t('contributions.form.buttons.submit')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewContribution;
