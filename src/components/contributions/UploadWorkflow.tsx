
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Upload, MapPin, Tags, FileText } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useTranslation } from '@/i18n/useTranslation';

interface UploadWorkflowProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  completedSteps: number[];
}

const UploadWorkflow: React.FC<UploadWorkflowProps> = ({ 
  currentStep, 
  onStepChange, 
  completedSteps 
}) => {
  const { t } = useTranslation();

  const steps = [
    {
      id: 1,
      icon: Upload,
      titleKey: 'contributions.workflow.steps.upload.title',
      descriptionKey: 'contributions.workflow.steps.upload.description'
    },
    {
      id: 2,
      icon: FileText,
      titleKey: 'contributions.workflow.steps.details.title',
      descriptionKey: 'contributions.workflow.steps.details.description'
    },
    {
      id: 3,
      icon: MapPin,
      titleKey: 'contributions.workflow.steps.location.title',
      descriptionKey: 'contributions.workflow.steps.location.description'
    },
    {
      id: 4,
      icon: Tags,
      titleKey: 'contributions.workflow.steps.tags.title',
      descriptionKey: 'contributions.workflow.steps.tags.description'
    }
  ];

  const progress = (completedSteps.length / steps.length) * 100;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          <I18nText translationKey="contributions.workflow.title" />
        </CardTitle>
        <div className="space-y-3">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground">
            <I18nText 
              translationKey="contributions.workflow.progress" 
              values={{ current: completedSteps.length, total: steps.length }}
            />
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = currentStep === step.id;
            const isAccessible = step.id <= Math.max(...completedSteps, currentStep);

            return (
              <div
                key={step.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  isCompleted
                    ? 'border-green-200 bg-green-50 hover:bg-green-100'
                    : isCurrent
                    ? 'border-primary bg-primary/5 hover:bg-primary/10'
                    : isAccessible
                    ? 'border-muted hover:border-primary/50'
                    : 'border-muted bg-muted/30 cursor-not-allowed opacity-60'
                }`}
                onClick={() => isAccessible && onStepChange(step.id)}
              >
                <div className="flex items-center gap-3 mb-2">
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className={`h-5 w-5 ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`} />
                  )}
                  <step.icon className={`h-5 w-5 ${
                    isCompleted ? 'text-green-600' : isCurrent ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                </div>
                <h3 className={`font-medium text-sm mb-1 ${
                  isCompleted ? 'text-green-700' : isCurrent ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  <I18nText translationKey={step.titleKey} />
                </h3>
                <p className="text-xs text-muted-foreground">
                  <I18nText translationKey={step.descriptionKey} />
                </p>
                {isCompleted && (
                  <Badge variant="secondary" className="mt-2 text-xs">
                    <I18nText translationKey="contributions.workflow.completed" />
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadWorkflow;
