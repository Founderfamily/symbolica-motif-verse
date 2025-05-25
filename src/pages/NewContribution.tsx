
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';
import { createContribution } from '@/services/contributionService';
import { ContributionFormData } from '@/types/contributions';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import ContributionFormSteps from '@/components/contributions/ContributionFormSteps';

const NewContribution = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: ContributionFormData, imageFile: File) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    setSubmitting(true);
    try {
      const contributionId = await createContribution(user.id, data, imageFile);
      if (contributionId) {
        navigate(`/contributions/${contributionId}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-md mx-auto text-center space-y-4">
          <h1 className="text-2xl font-bold">
            <I18nText translationKey="auth.loginTitle" />
          </h1>
          <p className="text-muted-foreground">
            <I18nText translationKey="contributions.form.loginRequired" />
          </p>
          <Button onClick={() => navigate('/auth')}>
            <I18nText translationKey="auth.login" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/contributions')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <I18nText translationKey="contributions.form.buttons.back" />
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">
            <I18nText translationKey="contributions.form.title" />
          </h1>
          <p className="text-muted-foreground text-lg">
            <I18nText translationKey="contributions.form.subtitle" />
          </p>
        </div>

        {/* Formulaire par étapes */}
        <ContributionFormSteps
          onSubmit={handleSubmit}
          isSubmitting={submitting}
        />
      </div>
    </div>
  );
};

export default NewContribution;
