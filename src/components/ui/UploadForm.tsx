
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import TaxonomySelector from '@/components/ui/TaxonomySelector';
import ImageDropzone from '@/components/contributions/ImageDropzone';
import MapSelector from '@/components/contributions/MapSelector';
import { useTranslation } from '@/i18n/useTranslation';
import TranslatedInput from '@/components/ui/TranslatedInput';
import { I18nText } from '@/components/ui/i18n-text';

// Define option types
interface TaxonomyOption {
  value: string;
  label: string;
}

// Define main props type
interface UploadFormProps {
  cultures: TaxonomyOption[];
  periods: TaxonomyOption[];
  techniques: TaxonomyOption[];
  functions: TaxonomyOption[];
  mediums: TaxonomyOption[];
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

// Define form data interface
interface FormData {
  name: string;
  description: string;
  culture: string;
  period: string;
  location?: { lat: number; lng: number };
  techniques: string[];
  functions: string[];
  mediums: string[];
  images: File[];
}

const UploadForm: React.FC<UploadFormProps> = ({
  cultures,
  periods,
  techniques,
  functions,
  mediums,
  onSubmit,
  isLoading = false
}) => {
  const { t } = useTranslation();
  
  // Default form state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    culture: '',
    period: '',
    techniques: [],
    functions: [],
    mediums: [],
    images: [],
    location: undefined,
  });
  
  // Form handling
  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-800">
              <I18nText translationKey="upload.basicInfo">Basic Information</I18nText>
            </h3>
            
            <TranslatedInput
              id="name"
              label="Name"
              translationKey="upload.name"
              value={formData.name}
              onChange={(value) => handleChange('name', value)}
              required
            />
            
            <TranslatedInput
              id="description"
              label="Description"
              translationKey="upload.description"
              value={formData.description}
              onChange={(value) => handleChange('description', value)}
              multiline
              rows={4}
            />
          </div>
          
          {/* Historical Context */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-800">
              <I18nText translationKey="upload.historicalContext">Historical Context</I18nText>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="culture">
                  <I18nText translationKey="upload.culture.label">Culture</I18nText>
                </Label>
                <select
                  id="culture"
                  className="w-full h-10 px-3 rounded-md border border-input"
                  value={formData.culture}
                  onChange={(e) => handleChange('culture', e.target.value)}
                  required
                >
                  <option value="" disabled>
                    {t('upload.culture.placeholder', 'Select a culture')}
                  </option>
                  {cultures.map((culture) => (
                    <option key={culture.value} value={culture.value}>
                      {culture.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="period">
                  <I18nText translationKey="upload.period.label">Period</I18nText>
                </Label>
                <select
                  id="period"
                  className="w-full h-10 px-3 rounded-md border border-input"
                  value={formData.period}
                  onChange={(e) => handleChange('period', e.target.value)}
                  required
                >
                  <option value="" disabled>
                    {t('upload.period.placeholder', 'Select a period')}
                  </option>
                  {periods.map((period) => (
                    <option key={period.value} value={period.value}>
                      {period.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Taxonomy */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-800">
              <I18nText translationKey="upload.categorization">Categorization</I18nText>
            </h3>
            
            <TaxonomySelector
              label="Techniques"
              translationPrefix="upload.techniques"
              options={techniques}
              selectedValues={formData.techniques}
              onChange={(values) => handleChange('techniques', values)}
            />
            
            <TaxonomySelector
              label="Functions"
              translationPrefix="upload.functions"
              options={functions}
              selectedValues={formData.functions}
              onChange={(values) => handleChange('functions', values)}
            />
            
            <TaxonomySelector
              label="Medium/Support"
              translationPrefix="upload.mediums"
              options={mediums}
              selectedValues={formData.mediums}
              onChange={(values) => handleChange('mediums', values)}
            />
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Images Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-800">
              <I18nText translationKey="upload.images">Images</I18nText>
            </h3>
            
            <ImageDropzone
              onImageSelected={(files) => handleChange('images', files)}
              maxFiles={5}
            />
            
            {formData.images.length > 0 && (
              <p className="text-sm text-slate-500">
                <I18nText 
                  translationKey="upload.imagesSelected" 
                  params={{ count: formData.images.length }}
                >
                  {formData.images.length} images selected
                </I18nText>
              </p>
            )}
          </div>
          
          {/* Geographic Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-800">
              <I18nText translationKey="upload.geographicLocation">Geographic Location</I18nText>
            </h3>
            
            <div className="h-64 md:h-80 border rounded-md overflow-hidden">
              <MapSelector
                onLocationSelected={(location) => handleChange('location', location)}
                selectedLocation={formData.location}
              />
            </div>
            
            {formData.location && (
              <p className="text-sm text-slate-500">
                <I18nText translationKey="upload.locationSelected">Location selected</I18nText>: 
                {' '}{formData.location.lat.toFixed(6)}, {formData.location.lng.toFixed(6)}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading} className="px-6">
          {isLoading ? (
            <I18nText translationKey="common.submitting">Submitting...</I18nText>
          ) : (
            <I18nText translationKey="common.submit">Submit</I18nText>
          )}
        </Button>
      </div>
    </form>
  );
};

export default UploadForm;
