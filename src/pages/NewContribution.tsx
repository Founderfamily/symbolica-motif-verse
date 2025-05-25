
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';
import { createContribution } from '@/services/contributionService';
import { ContributionFormData } from '@/types/contributions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import GeneralInfoSection from '@/components/contributions/form/GeneralInfoSection';
import CulturalContextSection from '@/components/contributions/form/CulturalContextSection';
import TagsSection from '@/components/contributions/form/TagsSection';
import ImageUploadSection from '@/components/contributions/form/ImageUploadSection';
import LocationSection from '@/components/contributions/form/LocationSection';

const NewContribution = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
      tags: [], // Ensure tags is always initialized as an empty array
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

  const handleLocationSelected = (lat: number, lng: number, name: string) => {
    form.setValue('latitude', lat);
    form.setValue('longitude', lng);
    form.setValue('location_name', name);
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
              <GeneralInfoSection control={form.control} />
              <CulturalContextSection control={form.control} setValue={form.setValue} />
              <TagsSection 
                control={form.control}
                getValues={form.getValues}
                setValue={form.setValue}
                formErrors={form.formState.errors}
              />
            </div>

            {/* Colonne de droite - Image et localisation */}
            <div className="space-y-6">
              <ImageUploadSection
                selectedImage={selectedImage}
                onImageSelected={setSelectedImage}
                formErrors={form.formState.errors}
              />
              <LocationSection
                control={form.control}
                onLocationSelected={handleLocationSelected}
                locationName={form.getValues().location_name || ''}
              />
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
