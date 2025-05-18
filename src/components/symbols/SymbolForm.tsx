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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

// Create validation schema with translation support
const symbolSchema = z.object({
  name: z.string().min(3, "Name is required and must be at least 3 characters"),
  name_fr: z.string().optional(),
  name_en: z.string().optional(),
  description: z.string().optional(),
  description_fr: z.string().optional(),
  description_en: z.string().optional(),
  culture: z.string().min(1, "Culture is required"),
  culture_fr: z.string().optional(),
  culture_en: z.string().optional(),
  period: z.string().min(1, "Period is required"),
  period_fr: z.string().optional(),
  period_en: z.string().optional(),
  techniques: z.array(z.string()).optional(),
  functions: z.array(z.string()).optional(),
  mediums: z.array(z.string()).optional(),
  images: z.array(z.any()).optional(),
});

interface SymbolFormProps {
  initialData?: SymbolFormData;
  onSubmit: (data: SymbolFormData & { 
    images: File[], 
    techniques: string[], 
    functions: string[], 
    mediums: string[],
    translations?: Record<string, Record<string, any>> 
  }) => Promise<void> | void;
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
  const [activeLanguageTab, setActiveLanguageTab] = useState<string>("default");

  // Extract initial translations if available
  const extractInitialTranslations = () => {
    if (!initialData?.translations) return {};
    
    const translations = initialData.translations;
    return {
      name_fr: translations.fr?.name || '',
      description_fr: translations.fr?.description || '',
      name_en: translations.en?.name || '',
      description_en: translations.en?.description || '',
      culture_fr: translations.fr?.culture || '',
      culture_en: translations.en?.culture || '',
      period_fr: translations.fr?.period || '',
      period_en: translations.en?.period || '',
    };
  };

  // Set up form with validation
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm<SymbolFormData & {
    name_fr?: string;
    name_en?: string;
    description_fr?: string;
    description_en?: string;
    culture_fr?: string;
    culture_en?: string;
    period_fr?: string;
    period_en?: string;
  }>({
    resolver: zodResolver(symbolSchema),
    defaultValues: {
      ...initialData || {
        name: '',
        description: '',
        culture: '',
        period: '',
        techniques: [],
        functions: [],
        mediums: [],
        images: [],
      },
      ...extractInitialTranslations()
    }
  });

  useEffect(() => {
    // Reset form if initialData changes
    if (initialData) {
      reset({
        ...initialData,
        ...extractInitialTranslations()
      });
      
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

  const processSubmit = (data: SymbolFormData & {
    name_fr?: string;
    name_en?: string;
    description_fr?: string;
    description_en?: string;
    culture_fr?: string;
    culture_en?: string;
    period_fr?: string;
    period_en?: string;
  }) => {
    // Prepare translations object
    const translations = {
      fr: {
        name: data.name_fr || data.name,
        description: data.description_fr || data.description || '',
        culture: data.culture_fr || data.culture,
        period: data.period_fr || data.period,
      },
      en: {
        name: data.name_en || data.name,
        description: data.description_en || data.description || '',
        culture: data.culture_en || data.culture,
        period: data.period_en || data.period,
      }
    };

    // Add the selected image to the form data
    const formData = {
      ...data,
      images: selectedImage ? [selectedImage] : [],
      techniques: data.techniques || [],
      functions: data.functions || [],
      mediums: data.mediums || [],
      location: selectedLocation,
      translations
    };

    // Submit the form data
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-6">
      {/* Language tabs */}
      <Tabs value={activeLanguageTab} onValueChange={setActiveLanguageTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <Label className="text-base font-medium">
            <I18nText translationKey="symbolForm.language.label">Language</I18nText>
          </Label>
          <TabsList>
            <TabsTrigger value="default">Default</TabsTrigger>
            <TabsTrigger value="fr">Français</TabsTrigger>
            <TabsTrigger value="en">English</TabsTrigger>
          </TabsList>
        </div>

        {/* Default language fields (always visible) */}
        <TabsContent value="default" className="space-y-6">
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
        </TabsContent>

        {/* French translation fields */}
        <TabsContent value="fr" className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name_fr" className="text-base">
              <I18nText translationKey="symbolForm.name.label" /> (Français)
            </Label>
            <Input
              id="name_fr"
              placeholder="Nom en français"
              {...register("name_fr")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="culture_fr" className="text-base">
              <I18nText translationKey="symbolForm.culture.label" /> (Français)
            </Label>
            <Input
              id="culture_fr"
              placeholder="Culture en français"
              {...register("culture_fr")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="period_fr" className="text-base">
              <I18nText translationKey="symbolForm.period.label" /> (Français)
            </Label>
            <Input
              id="period_fr"
              placeholder="Période en français"
              {...register("period_fr")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description_fr" className="text-base">
              <I18nText translationKey="symbolForm.description.label" /> (Français)
            </Label>
            <Textarea
              id="description_fr"
              rows={4}
              placeholder="Description en français"
              {...register("description_fr")}
            />
          </div>
        </TabsContent>

        {/* English translation fields */}
        <TabsContent value="en" className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name_en" className="text-base">
              <I18nText translationKey="symbolForm.name.label" /> (English)
            </Label>
            <Input
              id="name_en"
              placeholder="Name in English"
              {...register("name_en")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="culture_en" className="text-base">
              <I18nText translationKey="symbolForm.culture.label" /> (English)
            </Label>
            <Input
              id="culture_en"
              placeholder="Culture in English"
              {...register("culture_en")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="period_en" className="text-base">
              <I18nText translationKey="symbolForm.period.label" /> (English)
            </Label>
            <Input
              id="period_en"
              placeholder="Period in English"
              {...register("period_en")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description_en" className="text-base">
              <I18nText translationKey="symbolForm.description.label" /> (English)
            </Label>
            <Textarea
              id="description_en"
              rows={4}
              placeholder="Description in English"
              {...register("description_en")}
            />
          </div>
        </TabsContent>
      </Tabs>

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
