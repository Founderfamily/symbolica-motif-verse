
import React, { useState } from 'react';
import { Control, UseFormSetValue } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Globe, Calendar } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { ContributionFormData } from '@/types/contributions';
import { CULTURAL_CONTEXTS, HISTORICAL_PERIODS } from '@/data/contributionOptions';

interface CulturalContextSectionProps {
  control: Control<ContributionFormData>;
  setValue: UseFormSetValue<ContributionFormData>;
}

const CulturalContextSection: React.FC<CulturalContextSectionProps> = ({ control, setValue }) => {
  const { t } = useTranslation();
  const [showCultureOther, setShowCultureOther] = useState(false);
  const [showPeriodOther, setShowPeriodOther] = useState(false);

  const getCultureKey = (culture: string) => {
    return culture.toLowerCase().replace(/\s+/g, '').replace(/-/g, '').replace(/é/g, 'e').replace(/è/g, 'e');
  };

  const getPeriodKey = (period: string) => {
    return period.toLowerCase().replace(/\s+/g, '').replace(/-/g, '').replace(/è/g, 'e').replace(/é/g, 'e').replace(/â/g, 'a');
  };

  const handleCultureChange = (value: string) => {
    if (value === 'other') {
      setShowCultureOther(true);
      setValue('cultural_context', '');
    } else {
      setShowCultureOther(false);
      setValue('cultural_context', value);
    }
  };

  const handlePeriodChange = (value: string) => {
    if (value === 'other') {
      setShowPeriodOther(true);
      setValue('period', '');
    } else {
      setShowPeriodOther(false);
      setValue('period', value);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Globe className="mr-2 h-5 w-5 text-primary" />
          {t('contributions:form.sections.cultural')}
        </CardTitle>
        <CardDescription>
          {t('contributions:form.sections.culturalDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="cultural_context"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('contributions:form.fields.culture')}</FormLabel>
              {!showCultureOther ? (
                <Select onValueChange={handleCultureChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('contributions:form.fields.culturePlaceholder')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CULTURAL_CONTEXTS.map(culture => (
                      <SelectItem key={culture} value={culture}>
                        {t(`contributions:form.cultures.${getCultureKey(culture)}`)}
                      </SelectItem>
                    ))}
                    <SelectItem value="other">
                      {t('contributions:form.fields.cultureOther')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="space-y-2">
                  <FormControl>
                    <Input
                      placeholder={t('contributions:form.fields.cultureOtherPlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowCultureOther(false);
                      setValue('cultural_context', '');
                    }}
                  >
                    {t('contributions:form.fields.backToSelection')}
                  </Button>
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="period"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('contributions:form.fields.period')}</FormLabel>
              {!showPeriodOther ? (
                <Select onValueChange={handlePeriodChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <Calendar className="mr-2 h-4 w-4" />
                      <SelectValue placeholder={t('contributions:form.fields.periodPlaceholder')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {HISTORICAL_PERIODS.map(period => (
                      <SelectItem key={period} value={period}>
                        {t(`contributions:form.periods.${getPeriodKey(period)}`)}
                      </SelectItem>
                    ))}
                    <SelectItem value="other">
                      {t('contributions:form.fields.periodOther')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="space-y-2">
                  <FormControl>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={t('contributions:form.fields.periodOtherPlaceholder')}
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
                      setValue('period', '');
                    }}
                  >
                    {t('contributions:form.fields.backToSelection')}
                  </Button>
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default CulturalContextSection;
