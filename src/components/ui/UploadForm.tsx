
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import ImageDropzone from '@/components/upload/ImageDropzone';
import LocationPicker from '@/components/map/LocationPicker';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

interface FormData {
  title: string;
  description: string;
  category: string;
  tags: string;
  imageFile: File | null;
  location: {
    latitude: number;
    longitude: number;
    name: string;
  } | null;
}

const CATEGORIES = [
  { id: 'symbol', name: 'Symbol' },
  { id: 'pattern', name: 'Pattern' },
  { id: 'artifact', name: 'Artifact' },
  { id: 'site', name: 'Archaeological Site' },
];

const UploadForm = () => {
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      tags: '',
      imageFile: null,
      location: null,
    }
  });
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      console.log('Form data submitted:', data);
      
      // Simulate API submission delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Show success toast
      toast({
        title: t('upload.success.title'),
        description: t('upload.success.description'),
      });
      
      // Reset form or redirect
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: t('upload.error.title'),
        description: t('upload.error.description'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageSelected = (file: File) => {
    setSelectedImage(file);
    setValue('imageFile', file);
  };

  const handleLocationSelected = (latitude: number, longitude: number, locationName: string) => {
    setValue('location', {
      latitude,
      longitude,
      name: locationName,
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <Card className="overflow-hidden">
        <CardHeader className="bg-slate-50">
          <CardTitle>
            <I18nText translationKey="upload.title" />
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base">
                <I18nText translationKey="upload.form.title.label" />
              </Label>
              <Input
                id="title"
                placeholder={t('upload.form.title.placeholder')}
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-base">
                <I18nText translationKey="upload.form.description.label" />
              </Label>
              <Textarea
                id="description"
                placeholder={t('upload.form.description.placeholder')}
                {...register("description")}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-base">
                <I18nText translationKey="upload.form.category.label" />
              </Label>
              <Controller
                name="category"
                control={control}
                rules={{ required: "Please select a category" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder={t('upload.form.category.placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags" className="text-base">
                <I18nText translationKey="upload.form.tags.label" />
              </Label>
              <Input
                id="tags"
                placeholder={t('upload.form.tags.placeholder')}
                {...register("tags")}
              />
              <p className="text-sm text-slate-500">
                <I18nText translationKey="upload.form.tags.help" />
              </p>
            </div>

            <div className="space-y-4">
              <Label className="text-base">
                <I18nText translationKey="upload.form.image.label" />
              </Label>
              <ImageDropzone 
                onImageSelected={handleImageSelected}
                selectedImage={selectedImage}
              />
              {!selectedImage && (
                <p className="text-sm text-red-500">
                  <I18nText translationKey="upload.form.image.required" />
                </p>
              )}
            </div>

            <div className="space-y-4">
              <Label className="text-base">
                <I18nText translationKey="upload.form.location.label" />
              </Label>
              <LocationPicker onLocationSelected={handleLocationSelected} />
              <p className="text-sm text-slate-500">
                <I18nText translationKey="upload.form.location.help" />
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="bg-slate-50 p-6 flex justify-end space-x-2">
            <Button variant="outline" type="button">
              <I18nText translationKey="common.cancel" />
            </Button>
            <Button type="submit" disabled={isSubmitting || !selectedImage}>
              {isSubmitting ? (
                <I18nText translationKey="upload.form.submitting" />
              ) : (
                <I18nText translationKey="upload.form.submit" />
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default UploadForm;
