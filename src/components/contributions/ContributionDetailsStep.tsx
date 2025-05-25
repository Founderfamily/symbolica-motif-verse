
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileText, Lightbulb, Calendar, Globe } from 'lucide-react';
import { ContributionFormData } from '@/types/contributions';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

interface ContributionDetailsStepProps {
  form: UseFormReturn<ContributionFormData>;
  imageAnalysis?: any;
}

const ContributionDetailsStep: React.FC<ContributionDetailsStepProps> = ({
  form,
  imageAnalysis
}) => {
  const { t } = useTranslation();

  const culturalSuggestions = [
    'Art Nouveau', 'Art Déco', 'Byzantin', 'Celtic', 'Islamique', 
    'Japonais', 'Chinois', 'Indien', 'Africain', 'Précolombien'
  ];

  const periodSuggestions = [
    'Antiquité', 'Moyen Âge', 'Renaissance', 'Baroque', 'Classique',
    'XIXe siècle', 'XXe siècle', 'Contemporain'
  ];

  const handleSuggestionClick = (field: 'cultural_context' | 'period', value: string) => {
    form.setValue(field, value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <I18nText translationKey="contributions.form.sections.general" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel><I18nText translationKey="contributions.form.fields.title" /></FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t('contributions.form.fields.titlePlaceholder')} 
                    {...field} 
                  />
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
                <FormLabel><I18nText translationKey="contributions.form.fields.description" /></FormLabel>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <I18nText translationKey="contributions.form.sections.cultural" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="cultural_context"
            render={({ field }) => (
              <FormItem>
                <FormLabel><I18nText translationKey="contributions.form.fields.culture" /></FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t('contributions.form.fields.culturePlaceholder')} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lightbulb className="h-4 w-4" />
                    <I18nText translationKey="contributions.form.suggestions" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {culturalSuggestions.map((suggestion) => (
                      <Badge
                        key={suggestion}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => handleSuggestionClick('cultural_context', suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="period"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <I18nText translationKey="contributions.form.fields.period" />
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t('contributions.form.fields.periodPlaceholder')} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lightbulb className="h-4 w-4" />
                    <I18nText translationKey="contributions.form.suggestions" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {periodSuggestions.map((suggestion) => (
                      <Badge
                        key={suggestion}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => handleSuggestionClick('period', suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {imageAnalysis && (
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-sm">
              <I18nText translationKey="contributions.form.imageAnalysis" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p><strong>Dimensions:</strong> {imageAnalysis.dimensions?.width} × {imageAnalysis.dimensions?.height}</p>
            <p><strong>Ratio:</strong> {imageAnalysis.dimensions?.ratio}</p>
            <p><strong>Taille:</strong> {(imageAnalysis.size / 1024 / 1024).toFixed(2)} MB</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContributionDetailsStep;
