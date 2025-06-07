
import React from 'react';
import { Control } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { ContributionFormData } from '@/types/contributions';
import { CONTRIBUTION_TYPES } from '@/data/contributionOptions';

interface GeneralInfoSectionProps {
  control: Control<ContributionFormData>;
}

const GeneralInfoSection: React.FC<GeneralInfoSectionProps> = ({ control }) => {
  const { t } = useTranslation();

  const getContributionTypeKey = (type: string) => {
    return type.toLowerCase().replace(/\s+/g, '').replace(/é/g, 'e').replace(/à/g, 'a');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Info className="mr-2 h-5 w-5 text-primary" />
          {t('contributions:form.sections.general')}
        </CardTitle>
        <CardDescription>
          {t('contributions:form.sections.generalDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('contributions:form.fields.title')}</FormLabel>
              <FormControl>
                <Input placeholder={t('contributions:form.fields.titlePlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('contributions:form.fields.description')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('contributions:form.fields.descriptionPlaceholder')}
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="contribution_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('contributions:form.fields.contributionType')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('contributions:form.fields.contributionTypePlaceholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CONTRIBUTION_TYPES.map(type => (
                    <SelectItem key={type} value={type}>
                      {t(`contributions:form.contributionTypes.${getContributionTypeKey(type)}`)}
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
  );
};

export default GeneralInfoSection;
