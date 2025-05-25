
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { ContributionFormData } from '@/types/contributions';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import UploadWorkflow from './UploadWorkflow';
import EnhancedImageDropzone from './EnhancedImageDropzone';
import ContributionDetailsStep from './ContributionDetailsStep';
import ContributionLocationStep from './ContributionLocationStep';
import ContributionTagsStep from './ContributionTagsStep';

interface ContributionFormStepsProps {
  onSubmit: (data: ContributionFormData, imageFile: File) => Promise<void>;
  isSubmitting: boolean;
}

const ContributionFormSteps: React.FC<ContributionFormStepsProps> = ({
  onSubmit,
  isSubmitting
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageAnalysis, setImageAnalysis] = useState<any>(null);
  const { t } = useTranslation();

  const formSchema = z.object({
    title: z.string().min(5, t('contributions.form.validation.minLength', { count: 5 })),
    description: z.string().min(20, t('contributions.form.validation.minLength', { count: 20 })),
    location_name: z.string().optional(),
    cultural_context: z.string().min(3, t('contributions.form.validation.required')),
    period: z.string().min(3, t('contributions.form.validation.required')),
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
      tags: [],
      latitude: null,
      longitude: null,
    },
  });

  // Valider chaque étape et marquer comme complétée
  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        return selectedImage !== null;
      case 2:
        const { title, description, cultural_context, period } = form.getValues();
        return title.length >= 5 && description.length >= 20 && cultural_context.length >= 3 && period.length >= 3;
      case 3:
        return true; // Étape optionnelle
      case 4:
        return form.getValues().tags.length > 0;
      default:
        return false;
    }
  };

  const handleStepChange = (step: number) => {
    // Valider l'étape actuelle avant de passer à la suivante
    if (step > currentStep && !validateCurrentStep()) {
      return;
    }

    // Marquer l'étape actuelle comme complétée si elle est valide
    if (validateCurrentStep() && !completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }

    setCurrentStep(step);
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) return;
    
    const formData = form.getValues();
    await onSubmit(formData, selectedImage);
  };

  const canSubmit = completedSteps.length === 4 && selectedImage !== null;

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardContent className="pt-6">
              <EnhancedImageDropzone
                onImageSelected={setSelectedImage}
                selectedImage={selectedImage}
                onImageAnalyzed={setImageAnalysis}
              />
            </CardContent>
          </Card>
        );
      case 2:
        return <ContributionDetailsStep form={form} imageAnalysis={imageAnalysis} />;
      case 3:
        return <ContributionLocationStep form={form} />;
      case 4:
        return <ContributionTagsStep form={form} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <UploadWorkflow
        currentStep={currentStep}
        onStepChange={handleStepChange}
        completedSteps={completedSteps}
      />

      {renderCurrentStep()}

      <div className="flex justify-between items-center pt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <I18nText translationKey="contributions.form.buttons.previous" />
        </Button>

        <div className="flex gap-2">
          {currentStep < 4 ? (
            <Button
              onClick={handleNext}
              disabled={!validateCurrentStep()}
            >
              <I18nText translationKey="contributions.form.buttons.next" />
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Save className="h-4 w-4 mr-2 animate-spin" />
                  <I18nText translationKey="contributions.form.buttons.submitting" />
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  <I18nText translationKey="contributions.form.buttons.submit" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContributionFormSteps;
