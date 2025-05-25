
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';
import { ContributionFormData } from '@/types/contributions';
import { I18nText } from '@/components/ui/i18n-text';
import MapSelector from './MapSelector';

interface ContributionLocationStepProps {
  form: UseFormReturn<ContributionFormData>;
}

const ContributionLocationStep: React.FC<ContributionLocationStepProps> = ({ form }) => {
  const handleLocationSelected = (lat: number, lng: number, name: string) => {
    form.setValue('latitude', lat);
    form.setValue('longitude', lng);
    form.setValue('location_name', name);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          <I18nText translationKey="contributions.form.sections.location" />
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          <I18nText translationKey="contributions.form.sections.locationDescription" />
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <MapSelector
          onLocationSelected={handleLocationSelected}
          initialLocation={form.getValues().location_name || ''}
        />
        
        <FormField
          control={form.control}
          name="location_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel><I18nText translationKey="contributions.form.fields.location" /></FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  readOnly 
                  placeholder="Cliquez sur la carte ou utilisez la recherche"
                  className="bg-muted/30"
                />
              </FormControl>
            </FormItem>
          )}
        />

        {form.getValues().latitude && form.getValues().longitude && (
          <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
            <p><strong>Coordonnées:</strong></p>
            <p>Latitude: {form.getValues().latitude?.toFixed(6)}</p>
            <p>Longitude: {form.getValues().longitude?.toFixed(6)}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContributionLocationStep;
