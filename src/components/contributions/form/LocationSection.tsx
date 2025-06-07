
import React from 'react';
import { Control } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { ContributionFormData } from '@/types/contributions';
import MapSelector from '@/components/contributions/MapSelector';

interface LocationSectionProps {
  control: Control<ContributionFormData>;
  onLocationSelected: (lat: number, lng: number, name: string) => void;
  locationName: string;
}

const LocationSection: React.FC<LocationSectionProps> = ({ 
  control, 
  onLocationSelected, 
  locationName 
}) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="mr-2 h-5 w-5 text-primary" />
          {t('contributions:form.sections.location')}
        </CardTitle>
        <CardDescription>
          {t('contributions:form.sections.locationDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <MapSelector
          onLocationSelected={onLocationSelected}
          initialLocation={locationName}
        />
        <div className="mt-4">
          <FormField
            control={control}
            name="location_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('contributions:form.fields.location')}</FormLabel>
                <FormControl>
                  <Input {...field} readOnly placeholder={t('contributions:form.fields.locationPlaceholder')} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationSection;
