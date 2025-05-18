
import React, { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import ImageDropzone from '@/components/contributions/ImageDropzone';
import MapSelector from '@/components/contributions/MapSelector';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import TranslatedInput from '@/components/ui/TranslatedInput';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

// Define appropriate types
interface Location {
  lat: number;
  lng: number;
}

interface SymbolFormProps {
  onSubmit?: (data: SymbolFormData) => Promise<void>;
  initialData?: Partial<SymbolFormData>;
  isEditing?: boolean;
}

interface SymbolFormData {
  name: string;
  nameFr?: string;
  nameEn?: string;
  culture: string;
  description: string;
  descriptionFr?: string;
  descriptionEn?: string;
  period: string;
  category: string;
  tags: string[];
  imageFile?: File[];
  location?: Location;
}

// Sample categories and periods for the form
const categories = [
  'religious', 'cultural', 'historical', 'astronomical', 
  'decorative', 'political', 'magical', 'educational'
];

const periods = [
  'prehistoric', 'ancient', 'classical', 'medieval', 
  'renaissance', 'modern', 'contemporary'
];

const cultures = [
  'egyptian', 'greek', 'roman', 'chinese', 'japanese',
  'indian', 'maya', 'aztec', 'inuit', 'celtic',
  'nordic', 'aboriginal', 'persian', 'african'
];

const SymbolForm: React.FC<SymbolFormProps> = ({
  onSubmit,
  initialData = {},
  isEditing = false
}) => {
  const { t, currentLanguage } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [selectedImage, setSelectedImage] = useState<File[]>(initialData.imageFile || []);
  const [selectedLocation, setSelectedLocation] = useState<Location>(initialData.location || { lat: 0, lng: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form validation schema
  const formSchema = z.object({
    name: z.string().min(3, { message: t('form.validation.nameRequired') }),
    nameFr: z.string().optional(),
    nameEn: z.string().optional(),
    culture: z.string().min(1, { message: t('form.validation.cultureRequired') }),
    description: z.string().min(10, { message: t('form.validation.descriptionRequired') }),
    descriptionFr: z.string().optional(),
    descriptionEn: z.string().optional(),
    period: z.string().min(1, { message: t('form.validation.periodRequired') }),
    category: z.string().min(1, { message: t('form.validation.categoryRequired') }),
    tags: z.array(z.string()).optional().default([])
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<SymbolFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name || '',
      nameFr: initialData.nameFr || '',
      nameEn: initialData.nameEn || '',
      culture: initialData.culture || '',
      description: initialData.description || '',
      descriptionFr: initialData.descriptionFr || '',
      descriptionEn: initialData.descriptionEn || '',
      period: initialData.period || '',
      category: initialData.category || '',
      tags: initialData.tags || []
    }
  });

  const handleImageSelected = useCallback((files: File[]) => {
    if (files && files.length > 0) {
      setSelectedImage(files);
    }
  }, []);

  const handleLocationSelected = useCallback((location: Location) => {
    setSelectedLocation(location);
  }, []);

  const processForm = async (data: SymbolFormData) => {
    if (selectedImage.length === 0 && !isEditing) {
      toast.error(t('form.validation.imageRequired'));
      setActiveTab('media');
      return;
    }

    try {
      setIsSubmitting(true);
      // Include the image file and location in the data
      const completeData = {
        ...data,
        imageFile: selectedImage,
        location: selectedLocation
      };

      if (onSubmit) {
        await onSubmit(completeData);
      } else {
        // Default submission logic if no onSubmit prop provided
        console.log('Form submitted:', completeData);
        toast.success(isEditing ? t('form.editSuccess') : t('form.createSuccess'));
        navigate('/symbols');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(t('form.submissionError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(processForm)} className="space-y-6 mb-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="general">
            <I18nText translationKey="symbolForm.tabs.general" />
          </TabsTrigger>
          <TabsTrigger value="details">
            <I18nText translationKey="symbolForm.tabs.details" />
          </TabsTrigger>
          <TabsTrigger value="media">
            <I18nText translationKey="symbolForm.tabs.media" />
          </TabsTrigger>
          <TabsTrigger value="location">
            <I18nText translationKey="symbolForm.tabs.location" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          {/* Name field with translations */}
          <TranslatedInput 
            name="name"
            register={register}
            errors={errors}
            setValue={setValue}
            translationKey="symbolForm.fields.name"
          />

          {/* Culture field */}
          <div className="space-y-2">
            <label htmlFor="culture" className="block text-sm font-medium">
              <I18nText translationKey="symbolForm.fields.culture" />
            </label>
            <Controller
              name="culture"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('symbolForm.placeholders.selectCulture')} />
                  </SelectTrigger>
                  <SelectContent>
                    {cultures.map(culture => (
                      <SelectItem key={culture} value={culture}>
                        {culture.charAt(0).toUpperCase() + culture.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.culture && (
              <p className="text-red-500 text-sm">{errors.culture.message}</p>
            )}
          </div>

          {/* Description field with translations */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              <I18nText translationKey="symbolForm.fields.description" />
            </label>
            <Textarea
              id="description"
              {...register('description')}
              className="min-h-[150px]"
              placeholder={t('symbolForm.placeholders.enterDescription')}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="descriptionTranslations" className="block text-sm font-medium text-slate-500">
              <I18nText translationKey="symbolForm.fields.translatedDescriptions" />
            </label>

            <div className="space-y-2">
              <label htmlFor="descriptionFr" className="block text-sm font-medium">
                <I18nText translationKey="common.languages.french" />
              </label>
              <Textarea
                id="descriptionFr"
                {...register('descriptionFr')}
                className="min-h-[100px]"
                placeholder={t('symbolForm.placeholders.frenchDescription')}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="descriptionEn" className="block text-sm font-medium">
                <I18nText translationKey="common.languages.english" />
              </label>
              <Textarea
                id="descriptionEn"
                {...register('descriptionEn')}
                className="min-h-[100px]"
                placeholder={t('symbolForm.placeholders.englishDescription')}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {/* Category field */}
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium">
              <I18nText translationKey="symbolForm.fields.category" />
            </label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('symbolForm.placeholders.selectCategory')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category.message}</p>
            )}
          </div>

          {/* Period field */}
          <div className="space-y-2">
            <label htmlFor="period" className="block text-sm font-medium">
              <I18nText translationKey="symbolForm.fields.period" />
            </label>
            <Controller
              name="period"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('symbolForm.placeholders.selectPeriod')} />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map(period => (
                      <SelectItem key={period} value={period}>
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.period && (
              <p className="text-red-500 text-sm">{errors.period.message}</p>
            )}
          </div>

          {/* Tags field (simplified for now) */}
          <div className="space-y-2">
            <label htmlFor="tags" className="block text-sm font-medium">
              <I18nText translationKey="symbolForm.fields.tags" />
              <span className="text-xs text-slate-500 ml-1">
                <I18nText translationKey="symbolForm.fields.tagsHint" />
              </span>
            </label>
            <Input
              id="tags"
              placeholder={t('symbolForm.placeholders.enterTags')}
              onChange={(e) => {
                const tagsArray = e.target.value.split(',').map(tag => tag.trim());
                setValue('tags', tagsArray);
              }}
              defaultValue={initialData.tags?.join(', ') || ''}
            />
          </div>
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              {/* Image upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  <I18nText translationKey="symbolForm.fields.image" />
                </label>
                <ImageDropzone 
                  onImageSelected={(files) => handleImageSelected([files[0]])} 
                  className="border-2 border-dashed border-gray-300 rounded-md p-6"
                />
                
                {selectedImage.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-green-600">
                      <I18nText translationKey="symbolForm.fields.imageSelected" />: {selectedImage[0].name}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              {/* Map selector */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  <I18nText translationKey="symbolForm.fields.location" />
                </label>
                <MapSelector 
                  onLocationSelected={handleLocationSelected} 
                />
                
                {selectedLocation && selectedLocation.lat !== 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-green-600">
                      <I18nText translationKey="symbolForm.fields.locationSelected" />: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => navigate(-1)}
        >
          <I18nText translationKey="common.buttons.cancel" />
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <I18nText translationKey="common.buttons.submitting" />
          ) : isEditing ? (
            <I18nText translationKey="common.buttons.update" />
          ) : (
            <I18nText translationKey="common.buttons.create" />
          )}
        </Button>
      </div>
    </form>
  );
};

export default SymbolForm;
