
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import ImageDropzone from '@/components/contributions/ImageDropzone';
import MapSelector from '@/components/contributions/MapSelector';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

// Define the basic types we need
interface Location {
  lat: number;
  lng: number;
}

interface UploadFormProps {
  onSubmit?: (data: FormData) => void;
  isLoading?: boolean;
}

const UploadForm: React.FC<UploadFormProps> = ({ 
  onSubmit,
  isLoading = false 
}) => {
  const { t } = useTranslation();
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [culture, setCulture] = useState('');
  const [category, setCategory] = useState('');
  const [selectedImage, setSelectedImage] = useState<File[]>([]);
  const [location, setLocation] = useState<Location>({ lat: 0, lng: 0 });
  const [activeTab, setActiveTab] = useState('info');
  
  // Sample options
  const cultureOptions = [
    'Ancient Egyptian', 
    'Celtic', 
    'Chinese', 
    'Greek', 
    'Japanese', 
    'Maya', 
    'Norse', 
    'Roman'
  ];
  
  const categoryOptions = [
    'Religious',
    'Cultural',
    'Decorative',
    'Historical',
    'Political',
    'Educational'
  ];
  
  // Handle image selection
  const handleImageSelected = useCallback((files: File[]) => {
    if (files && files.length > 0) {
      setSelectedImage(files);
      toast.success(t('upload.imageUploaded'));
    }
  }, [t]);
  
  // Handle location selection
  const handleLocationSelected = useCallback((loc: Location) => {
    setLocation(loc);
    toast.success(t('upload.locationSelected'));
  }, [t]);
  
  // Form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim()) {
      toast.error(t('upload.validation.nameRequired'));
      return;
    }
    
    if (!description.trim()) {
      toast.error(t('upload.validation.descriptionRequired'));
      return;
    }
    
    if (!culture) {
      toast.error(t('upload.validation.cultureRequired'));
      return;
    }
    
    if (selectedImage.length === 0) {
      toast.error(t('upload.validation.imageRequired'));
      setActiveTab('media');
      return;
    }
    
    // Prepare form data
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('culture', culture);
    formData.append('category', category);
    
    if (selectedImage.length > 0) {
      formData.append('image', selectedImage[0]);
    }
    
    if (location.lat !== 0 && location.lng !== 0) {
      formData.append('location', JSON.stringify(location));
    }
    
    // Submit form
    if (onSubmit) {
      onSubmit(formData);
    } else {
      console.log('Form submitted:', {
        name,
        description,
        culture,
        category,
        image: selectedImage.length > 0 ? selectedImage[0].name : 'No image',
        location: location.lat !== 0 ? `${location.lat}, ${location.lng}` : 'No location'
      });
      toast.success(t('upload.success'));
      
      // Reset form
      setName('');
      setDescription('');
      setCulture('');
      setCategory('');
      setSelectedImage([]);
      setLocation({ lat: 0, lng: 0 });
      setActiveTab('info');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">
            <I18nText translationKey="upload.tabs.info" />
          </TabsTrigger>
          <TabsTrigger value="media">
            <I18nText translationKey="upload.tabs.media" />
          </TabsTrigger>
          <TabsTrigger value="location">
            <I18nText translationKey="upload.tabs.location" />
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              <I18nText translationKey="upload.fields.name" />
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('upload.placeholders.name')}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              <I18nText translationKey="upload.fields.description" />
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('upload.placeholders.description')}
              className="min-h-[120px]"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="culture" className="text-sm font-medium">
                <I18nText translationKey="upload.fields.culture" />
              </label>
              <Select value={culture} onValueChange={setCulture}>
                <SelectTrigger>
                  <SelectValue placeholder={t('upload.placeholders.culture')} />
                </SelectTrigger>
                <SelectContent>
                  {cultureOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                <I18nText translationKey="upload.fields.category" />
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder={t('upload.placeholders.category')} />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="media" className="pt-4">
          <Card>
            <CardContent className="pt-6">
              <ImageDropzone 
                onImageSelected={(files) => handleImageSelected([files[0]])} 
              />
              
              {selectedImage.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-green-600">
                    <I18nText translationKey="upload.imageSelected" />: {selectedImage[0].name}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="location" className="pt-4">
          <Card>
            <CardContent className="pt-6">
              <MapSelector 
                onLocationSelected={handleLocationSelected} 
              />
              
              {location.lat !== 0 && location.lng !== 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-green-600">
                    <I18nText translationKey="upload.locationSelected" />: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <I18nText translationKey="common.loading" />
        ) : (
          <I18nText translationKey="upload.submit" />
        )}
      </Button>
    </form>
  );
};

export default UploadForm;
