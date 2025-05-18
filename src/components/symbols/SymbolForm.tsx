
import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MultiSelect } from '@/components/ui/multi-select';
import { Label } from '@/components/ui/label';
import { TranslatedInput } from '@/components/ui/translated-input';
import { useTranslation } from '@/i18n/useTranslation';
import { SymbolFormData } from '@/types/symbol';
import { I18nText } from '@/components/ui/i18n-text';
import ImageDropzone from '@/components/upload/ImageDropzone';
import LocationPicker from '@/components/map/LocationPicker';
import { Location } from '@/types/location';

const CULTURE_OPTIONS = [
  { value: 'berber', label: 'Berber' },
  { value: 'amazigh', label: 'Amazigh' },
  { value: 'tuareg', label: 'Tuareg' },
  { value: 'kabyle', label: 'Kabyle' },
  { value: 'moorish', label: 'Moorish' },
];

const PERIOD_OPTIONS = [
  { value: 'prehistoric', label: 'Prehistoric' },
  { value: 'ancient', label: 'Ancient' },
  { value: 'medieval', label: 'Medieval' },
  { value: 'modern', label: 'Modern' },
  { value: 'contemporary', label: 'Contemporary' },
];

const TECHNIQUE_OPTIONS = [
  { value: 'carving', label: 'Carving' },
  { value: 'painting', label: 'Painting' },
  { value: 'engraving', label: 'Engraving' },
  { value: 'weaving', label: 'Weaving' },
  { value: 'pottery', label: 'Pottery' },
];

const MEDIUM_OPTIONS = [
  { value: 'rock', label: 'Rock' },
  { value: 'textile', label: 'Textile' },
  { value: 'pottery', label: 'Pottery' },
  { value: 'metal', label: 'Metal' },
  { value: 'wood', label: 'Wood' },
];

const FUNCTION_OPTIONS = [
  { value: 'decorative', label: 'Decorative' },
  { value: 'religious', label: 'Religious' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'practical', label: 'Practical' },
];

interface SymbolFormProps {
  defaultValues?: Partial<SymbolFormData>;
  onSubmit: (data: SymbolFormData) => Promise<void>;
  isSubmitting?: boolean;
}

const SymbolForm: React.FC<SymbolFormProps> = ({ 
  defaultValues, 
  onSubmit,
  isSubmitting = false
}) => {
  const { register, handleSubmit, formState: { errors }, control, setValue } = useForm<SymbolFormData>({
    defaultValues: {
      name: '',
      name_fr: '',
      description: '',
      description_fr: '',
      culture: '',
      period: '',
      techniques: [],
      mediums: [],
      functions: [],
      location: undefined,
      images: [],
      ...defaultValues,
    }
  });
  
  const [activeTab, setActiveTab] = useState<string>('info');
  const { t } = useTranslation();
  
  const formSubmitHandler: SubmitHandler<SymbolFormData> = async (data) => {
    // Add validation if needed
    try {
      await onSubmit(data);
      // Success handling is done in the parent component
    } catch (error) {
      console.error('Error in form submission:', error);
      // Error handling is done in the parent component
    }
  };
  
  const handleLocationSelected = (latitude: number, longitude: number, locationName: string) => {
    setValue('location', { 
      latitude,
      longitude,
      name: locationName
    });
  };

  const handleImageSelected = (files: File[]) => {
    if (files && files.length > 0) {
      // Add to existing images
      setValue('images', [...(defaultValues?.images || []), ...files]);
    }
  };
  
  // Example of how to handle existing images (e.g., when editing)
  const [existingImages, setExistingImages] = useState<string[]>([]);
  
  useEffect(() => {
    // This would typically load from an API or props
    // For now, we'll just simulate with default values
    if (defaultValues?.imageUrls) {
      setExistingImages(defaultValues.imageUrls);
    }
  }, [defaultValues?.imageUrls]);
  
  return (
    <form onSubmit={handleSubmit(formSubmitHandler)} className="space-y-6">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="info">
            <I18nText translationKey="symbolForm.tabs.basicInfo" />
          </TabsTrigger>
          <TabsTrigger value="details">
            <I18nText translationKey="symbolForm.tabs.details" />
          </TabsTrigger>
          <TabsTrigger value="media">
            <I18nText translationKey="symbolForm.tabs.media" />
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    <I18nText translationKey="symbolForm.name.label" />
                  </Label>
                  <Input
                    id="name"
                    {...register("name", { required: "This field is required" })}
                    error={errors.name?.message}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name_fr">
                    <I18nText translationKey="symbolForm.nameFr.label" />
                  </Label>
                  <Input
                    id="name_fr"
                    {...register("name_fr")}
                    error={errors.name_fr?.message}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">
                    <I18nText translationKey="symbolForm.description.label" />
                  </Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    rows={4}
                    error={errors.description?.message}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description_fr">
                    <I18nText translationKey="symbolForm.descriptionFr.label" />
                  </Label>
                  <Textarea
                    id="description_fr"
                    {...register("description_fr")}
                    rows={4}
                    error={errors.description_fr?.message}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-6">
          {/* Classification and Taxonomy */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="culture">
                    <I18nText translationKey="symbolForm.culture.label" />
                  </Label>
                  <Controller
                    name="culture"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <select 
                          {...field}
                          className="w-full border border-gray-300 rounded-md py-2 px-3"
                        >
                          <option value="">
                            <I18nText translationKey="symbolForm.culture.placeholder" />
                          </option>
                          {CULTURE_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="period">
                    <I18nText translationKey="symbolForm.period.label" />
                  </Label>
                  <Controller
                    name="period"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <select 
                          {...field}
                          className="w-full border border-gray-300 rounded-md py-2 px-3"
                        >
                          <option value="">
                            <I18nText translationKey="symbolForm.period.placeholder" />
                          </option>
                          {PERIOD_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="techniques">
                    <I18nText translationKey="symbolForm.techniques.label" />
                  </Label>
                  <Controller
                    name="techniques"
                    control={control}
                    render={({ field }) => (
                      <MultiSelect
                        options={TECHNIQUE_OPTIONS}
                        value={TECHNIQUE_OPTIONS.filter(option => 
                          field.value?.includes(option.value)
                        )}
                        onChange={(selected) => {
                          field.onChange(selected.map(item => item.value));
                        }}
                        placeholder={t('symbolForm.techniques.placeholder')}
                      />
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mediums">
                    <I18nText translationKey="symbolForm.mediums.label" />
                  </Label>
                  <Controller
                    name="mediums"
                    control={control}
                    render={({ field }) => (
                      <MultiSelect
                        options={MEDIUM_OPTIONS}
                        value={MEDIUM_OPTIONS.filter(option => 
                          field.value?.includes(option.value)
                        )}
                        onChange={(selected) => {
                          field.onChange(selected.map(item => item.value));
                        }}
                        placeholder={t('symbolForm.mediums.placeholder')}
                      />
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="functions">
                    <I18nText translationKey="symbolForm.functions.label" />
                  </Label>
                  <Controller
                    name="functions"
                    control={control}
                    render={({ field }) => (
                      <MultiSelect
                        options={FUNCTION_OPTIONS}
                        value={FUNCTION_OPTIONS.filter(option => 
                          field.value?.includes(option.value)
                        )}
                        onChange={(selected) => {
                          field.onChange(selected.map(item => item.value));
                        }}
                        placeholder={t('symbolForm.functions.placeholder')}
                      />
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Location */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Label>
                  <I18nText translationKey="symbolForm.location.label" />
                </Label>
                <LocationPicker 
                  onLocationSelected={handleLocationSelected}
                  initialLocation={defaultValues?.location}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="media" className="space-y-6">
          {/* Images */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Label>
                  <I18nText translationKey="symbolForm.images.label" />
                </Label>
                <ImageDropzone 
                  onImageSelected={(files) => handleImageSelected([files])}
                  selectedImage={null}
                />
                
                {/* Display existing images when editing */}
                {existingImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {existingImages.map((imageUrl, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={imageUrl} 
                          alt={`Symbol image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline">
          <I18nText translationKey="common.cancel" />
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <I18nText translationKey="common.submitting" />
          ) : (
            <I18nText translationKey="common.submit" />
          )}
        </Button>
      </div>
    </form>
  );
};

export default SymbolForm;
