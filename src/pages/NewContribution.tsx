
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';
import { createContribution, getContributionById, getUserContributions } from '@/services/contributionService';
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
  const [searchParams] = useSearchParams();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  // Detect if we're in edit mode
  const editId = searchParams.get('edit');
  const isEditMode = !!editId;

  const formSchema = z.object({
    title: z.string().min(5, t('contributions:form.validation.minLength', { count: 5 })),
    description: z.string().min(20, t('contributions:form.validation.minLength', { count: 20 })),
    location_name: z.string().optional(),
    cultural_context: z.string().min(3, t('contributions:form.validation.required')),
    period: z.string().min(3, t('contributions:form.validation.required')),
    contribution_type: z.string().optional(),
    tags: z.array(z.string()).min(1, t('contributions:form.validation.minTags')),
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

  // Load contribution data if in edit mode
  useEffect(() => {
    const loadContributionForEdit = async () => {
      if (!isEditMode || !editId || !user) return;

      setLoading(true);
      try {
        // Get user's contributions to find the one being edited
        const userContributions = await getUserContributions(user.id);
        const contribution = userContributions.find(c => c.id === editId);

        if (contribution && contribution.status === 'pending') {
          // Pre-fill the form with existing data
          form.setValue('title', contribution.title);
          form.setValue('description', contribution.description || '');
          form.setValue('location_name', contribution.location_name || '');
          form.setValue('cultural_context', contribution.cultural_context || '');
          form.setValue('period', contribution.period || '');
          form.setValue('latitude', contribution.latitude);
          form.setValue('longitude', contribution.longitude);
          
          // Set tags from contribution_tags
          if (contribution.tags && contribution.tags.length > 0) {
            const tagNames = contribution.tags.map(tag => tag.tag);
            form.setValue('tags', tagNames);
          }
        } else {
          // Invalid contribution or not editable
          navigate('/profile?tab=contributions');
        }
      } catch (error) {
        console.error('Error loading contribution for edit:', error);
        navigate('/profile?tab=contributions');
      } finally {
        setLoading(false);
      }
    };

    loadContributionForEdit();
  }, [isEditMode, editId, user, form, navigate]);

  const onSubmit = async (data: ContributionFormData) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (!selectedImage && !isEditMode) {
      form.setError('root', { message: t('contributions:form.validation.imageRequired') });
      return;
    }

    setSubmitting(true);
    
    if (isEditMode) {
      // TODO: Implement update contribution functionality
      // For now, we'll just redirect back to contributions
      console.log('Edit mode - would update contribution with:', data);
      setSubmitting(false);
      navigate('/profile?tab=contributions');
      return;
    }

    const contributionId = await createContribution(user.id, data, selectedImage!);
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

  const handleCancel = () => {
    if (isEditMode) {
      navigate('/profile?tab=contributions');
    } else {
      navigate('/contributions');
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">{t('auth:loginTitle')}</h1>
        <Button onClick={() => navigate('/auth')}>{t('auth:login')}</Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-6"></div>
          <div className="h-64 bg-slate-200 rounded-lg mb-6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        {isEditMode ? 'Modifier la contribution' : t('contributions:form.title')}
      </h1>
      <p className="text-muted-foreground mb-6">
        {isEditMode 
          ? 'Modifiez les informations de votre contribution ci-dessous.'
          : t('contributions:form.subtitle')
        }
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
                isEditMode={isEditMode}
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
              onClick={handleCancel}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting 
                ? (isEditMode ? 'Modification...' : t('contributions:form.buttons.submitting'))
                : (isEditMode ? 'Modifier' : t('contributions:form.buttons.submit'))
              }
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewContribution;
