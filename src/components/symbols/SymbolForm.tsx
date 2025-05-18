
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import TranslatedInput from '@/components/ui/TranslatedInput';
import TaxonomySelector from '@/components/ui/TaxonomySelector';
import ImageDropzone from '@/components/contributions/ImageDropzone';
import MapSelector from '@/components/contributions/MapSelector';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

// Define option types
interface TaxonomyOption {
  value: string;
  label: string;
}

// Define location type
interface Location {
  lat: number;
  lng: number;
}

// Define form data interface
interface SymbolFormData {
  id?: string;
  name: string;
  description: string;
  culture: string;
  period: string;
  location?: Location;
  techniques: string[];
  functions: string[];
  mediums: string[];
  images: File[];
}

// Define props
interface SymbolFormProps {
  initialData?: Partial<SymbolFormData>;
  cultures: TaxonomyOption[];
  periods: TaxonomyOption[];
  techniques: TaxonomyOption[];
  functions: TaxonomyOption[];
  mediums: TaxonomyOption[];
  onSubmit: (data: SymbolFormData) => void;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
}

const SymbolForm: React.FC<SymbolFormProps> = ({
  initialData = {},
  cultures,
  periods,
  techniques,
  functions,
  mediums,
  onSubmit,
  isLoading = false,
  mode = 'create'
}) => {
  const { t } = useTranslation();
  
  // Form state
  const [formData, setFormData] = useState<SymbolFormData>({
    id: initialData.id || undefined,
    name: initialData.name || '',
    description: initialData.description || '',
    culture: initialData.culture || '',
    period: initialData.period || '',
    location: initialData.location,
    techniques: initialData.techniques || [],
    functions: initialData.functions || [],
    mediums: initialData.mediums || [],
    images: [] // Files cannot be pre-populated
  });
  
  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Update specific field
  const updateField = <K extends keyof SymbolFormData>(field: K, value: SymbolFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('validation.required');
    }
    
    if (!formData.culture) {
      newErrors.culture = t('validation.required');
    }
    
    if (!formData.period) {
      newErrors.period = t('validation.required');
    }
    
    // In edit mode, don't require images if none are provided
    if (mode === 'create' && formData.images.length === 0) {
      newErrors.images = t('validation.requiredImages');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-800">
              <I18nText translationKey="symbols.form.basicInfo">Basic Information</I18nText>
            </h3>
            
            <TranslatedInput
              id="name"
              label="Name"
              translationKey="symbols.form.name"
              value={formData.name}
              onChange={(value) => updateField('name', value)}
              required
              className={errors.name ? "border-red-300" : ""}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            
            <TranslatedInput
              id="description"
              label="Description"
              translationKey="symbols.form.description"
              value={formData.description}
              onChange={(value) => updateField('description', value)}
              multiline
              rows={4}
            />
          </div>
          
          {/* Cultural Context */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-800">
              <I18nText translationKey="symbols.form.culturalContext">Cultural Context</I18nText>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="culture" className="block text-sm font-medium text-slate-700 mb-1">
                  <I18nText translationKey="symbols.form.culture.label">Culture</I18nText>
                  <span className="text-red-500">*</span>
                </label>
                <select
                  id="culture"
                  className={`w-full h-10 px-3 rounded-md border ${
                    errors.culture ? "border-red-300" : "border-input"
                  }`}
                  value={formData.culture}
                  onChange={(e) => updateField('culture', e.target.value)}
                  required
                >
                  <option value="" disabled>
                    <I18nText translationKey="symbols.form.culture.placeholder">Select culture</I18nText>
                  </option>
                  {cultures.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.culture && <p className="text-red-500 text-xs mt-1">{errors.culture}</p>}
              </div>
              
              <div>
                <label htmlFor="period" className="block text-sm font-medium text-slate-700 mb-1">
                  <I18nText translationKey="symbols.form.period.label">Period</I18nText>
                  <span className="text-red-500">*</span>
                </label>
                <select
                  id="period"
                  className={`w-full h-10 px-3 rounded-md border ${
                    errors.period ? "border-red-300" : "border-input"
                  }`}
                  value={formData.period}
                  onChange={(e) => updateField('period', e.target.value)}
                  required
                >
                  <option value="" disabled>
                    <I18nText translationKey="symbols.form.period.placeholder">Select period</I18nText>
                  </option>
                  {periods.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.period && <p className="text-red-500 text-xs mt-1">{errors.period}</p>}
              </div>
            </div>
          </div>
          
          {/* Taxonomy Selectors */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-800">
              <I18nText translationKey="symbols.form.categorization">Categorization</I18nText>
            </h3>
            
            <TaxonomySelector
              label="Medium/Support"
              translationPrefix="symbols.form.medium"
              options={mediums}
              selectedValues={formData.mediums}
              onChange={(values) => updateField('mediums', values)}
            />
            
            <TaxonomySelector
              label="Techniques"
              translationPrefix="symbols.form.techniques"
              options={techniques}
              selectedValues={formData.techniques}
              onChange={(values) => updateField('techniques', values)}
            />
            
            <TaxonomySelector
              label="Functions"
              translationPrefix="symbols.form.functions"
              options={functions}
              selectedValues={formData.functions}
              onChange={(values) => updateField('functions', values)}
            />
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Images */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-slate-800">
                <I18nText translationKey="symbols.form.images">Images</I18nText>
                {mode === 'create' && <span className="text-red-500 ml-1">*</span>}
              </h3>
              
              {mode === 'edit' && (
                <p className="text-xs text-slate-500">
                  <I18nText translationKey="symbols.form.imagesEditNote">
                    Upload new images to replace existing ones
                  </I18nText>
                </p>
              )}
            </div>
            
            <ImageDropzone
              onImagesSelected={(files) => updateField('images', files)}
              maxFiles={5}
              className={errors.images ? "border-red-300" : ""}
            />
            
            {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
            
            {formData.images.length > 0 && (
              <p className="text-sm text-slate-600">
                <I18nText 
                  translationKey="symbols.form.selectedImages" 
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
              <I18nText translationKey="symbols.form.location">Geographic Location</I18nText>
            </h3>
            
            <div className="h-64 md:h-80 border rounded-md overflow-hidden">
              <MapSelector
                onLocationSelect={(location) => updateField('location', location)}
                selectedLocation={formData.location}
              />
            </div>
            
            {formData.location && (
              <p className="text-sm text-slate-600">
                <I18nText translationKey="symbols.form.locationSelected">Location selected</I18nText>: 
                {' '}{formData.location.lat.toFixed(6)}, {formData.location.lng.toFixed(6)}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700">
          {isLoading ? (
            <I18nText translationKey="common.submitting">Submitting...</I18nText>
          ) : mode === 'create' ? (
            <I18nText translationKey="common.create">Create</I18nText>
          ) : (
            <I18nText translationKey="common.save">Save</I18nText>
          )}
        </Button>
      </div>
    </form>
  );
};

export default SymbolForm;
