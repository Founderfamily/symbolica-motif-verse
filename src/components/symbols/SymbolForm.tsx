
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { MultiSelect } from '@/components/ui/multi-select';
import { useTranslation } from '@/i18n/useTranslation';
import TranslatedInput from '@/components/ui/translated-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { SymbolFormData } from '@/types/symbol';
import { z } from 'zod';
import ImageDropzone from '@/components/upload/ImageDropzone';
import LocationPicker from '@/components/map/LocationPicker';
import { LocationData } from '@/types/location';
import { I18nText } from '@/components/ui/i18n-text';

// Default values for select options
const TECHNIQUES = [
  { value: 'painting', label: 'Painting' },
  { value: 'carving', label: 'Carving' },
  { value: 'weaving', label: 'Weaving' },
  { value: 'printing', label: 'Printing' },
  { value: 'embroidery', label: 'Embroidery' },
];

const FUNCTIONS = [
  { value: 'religious', label: 'Religious' },
  { value: 'decorative', label: 'Decorative' },
  { value: 'protective', label: 'Protective' },
  { value: 'narrative', label: 'Narrative' },
  { value: 'identification', label: 'Identification' },
];

const MEDIUMS = [
  { value: 'stone', label: 'Stone' },
  { value: 'wood', label: 'Wood' },
  { value: 'metal', label: 'Metal' },
  { value: 'textile', label: 'Textile' },
  { value: 'clay', label: 'Clay' },
];

// Create validation schema
const symbolSchema = z.object({
  name: z.string().min(3, "Name is required and must be at least 3 characters"),
  description: z.string().optional(),
  culture: z.string().min(1, "Culture is required"),
  period: z.string().min(1, "Period is required"),
  techniques: z.array(z.string()).optional(),
  functions: z.array(z.string()).optional(),
  mediums: z.array(z.string()).optional(),
  images: z.array(z.any()).optional(),
});

interface SymbolFormProps {
  initialData?: SymbolFormData;
  onSubmit: (data: SymbolFormData & { images: File[], techniques: string[], functions: string[], mediums: string[] }) => Promise<void> | void;
  isSubmitting?: boolean;
}

const SymbolForm: React.FC<SymbolFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
}) => {
  const { t, currentLanguage } = useTranslation();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    initialData?.location || null
  );

  // Set up form with validation
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm<SymbolFormData>({
    resolver: zodResolver(symbolSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      culture: '',
      period: '',
      techniques: [],
      functions: [],
      mediums: [],
      images: [],
    }
  });

  useEffect(() => {
    // Reset form if initialData changes
    if (initialData) {
      reset(initialData);
      if (initialData.images && initialData.images.length > 0) {
        setSelectedImage(initialData.images[0]);
      }
    }
  }, [initialData, reset]);

  const handleImageSelected = (file: File) => {
    setSelectedImage(file);
    setValue('images', file ? [file] : []);
  };

  const handleLocationSelected = (latitude: number, longitude: number, locationName: string) => {
    const location = latitude && longitude ? {
      latitude,
      longitude,
      name: locationName,
    } : null;
    
    setSelectedLocation(location);
  };

  const processSubmit = (data: SymbolFormData) => {
    // Add the selected image to the form data
    const formData = {
      ...data,
      images: selectedImage ? [selectedImage] : [],
      techniques: data.techniques || [],
      functions: data.functions || [],
      mediums: data.mediums || [],
      location: selectedLocation,
    };

    // Submit the form data
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-6">
      {/* Name field */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-base">
          <I18nText translationKey="symbolForm.name.label" />
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="name"
          placeholder={t('symbolForm.name.placeholder')}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Culture field */}
      <div className="space-y-2">
        <Label htmlFor="culture" className="text-base">
          <I18nText translationKey="symbolForm.culture.label" />
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="culture"
          placeholder={t('symbolForm.culture.placeholder')}
          {...register("culture")}
        />
        {errors.culture && (
          <p className="text-sm text-red-500">{errors.culture.message}</p>
        )}
      </div>

      {/* Period field */}
      <div className="space-y-2">
        <Label htmlFor="period" className="text-base">
          <I18nText translationKey="symbolForm.period.label" />
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="period"
          placeholder={t('symbolForm.period.placeholder')}
          {...register("period")}
        />
        {errors.period && (
          <p className="text-sm text-red-500">{errors.period.message}</p>
        )}
      </div>

      {/* Description field */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-base">
          <I18nText translationKey="symbolForm.description.label" />
        </Label>
        <Textarea
          id="description"
          rows={4}
          placeholder={t('symbolForm.description.placeholder')}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Multi-select fields */}
      <div className="space-y-6 pt-2">
        <div className="space-y-2">
          <Label className="text-base">
            <I18nText translationKey="symbolForm.techniques.label" />
          </Label>
          <Controller
            name="techniques"
            control={control}
            render={({ field }) => (
              <MultiSelect
                options={TECHNIQUES}
                selected={field.value || []}
                onChange={(selected) => field.onChange(selected)}
                placeholder={t('symbolForm.techniques.placeholder')}
                allowAddNew
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-base">
            <I18nText translationKey="symbolForm.functions.label" />
          </Label>
          <Controller
            name="functions"
            control={control}
            render={({ field }) => (
              <MultiSelect
                options={FUNCTIONS}
                selected={field.value || []}
                onChange={(selected) => field.onChange(selected)}
                placeholder={t('symbolForm.functions.placeholder')}
                allowAddNew
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-base">
            <I18nText translationKey="symbolForm.mediums.label" />
          </Label>
          <Controller
            name="mediums"
            control={control}
            render={({ field }) => (
              <MultiSelect
                options={MEDIUMS}
                selected={field.value || []}
                onChange={(selected) => field.onChange(selected)}
                placeholder={t('symbolForm.mediums.placeholder')}
                allowAddNew
              />
            )}
          />
        </div>
      </div>

      {/* Image upload */}
      <div className="space-y-4">
        <Label className="text-base">
          <I18nText translationKey="symbolForm.images.label" />
        </Label>
        <ImageDropzone 
          onImageSelected={handleImageSelected}
          selectedImage={selectedImage}
        />
      </div>

      {/* Location picker */}
      <div className="space-y-4">
        <Label className="text-base">
          <I18nText translationKey="symbolForm.location.label" />
        </Label>
        <LocationPicker 
          onLocationSelected={handleLocationSelected} 
          initialLocation={selectedLocation}
        />
      </div>

      {/* Submit button */}
      <div className="pt-4">
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <I18nText translationKey="symbolForm.submitting" />
          ) : (
            <I18nText translationKey="symbolForm.submit" />
          )}
        </Button>
      </div>
    </form>
  );
};

export default SymbolForm;
