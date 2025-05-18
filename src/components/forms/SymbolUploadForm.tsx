
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import ImageUpload from '../upload/ImageUpload';

interface SymbolUploadFormProps {
  onSubmit: (data: any) => void;
}

const SymbolUploadForm: React.FC<SymbolUploadFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();
  
  const handleImageUpload = (files: File[]) => {
    setImages(files);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        name,
        description,
        images
      });
      
      // Reset form
      setName('');
      setDescription('');
      setImages([]);
    } catch (error) {
      console.error('Error uploading symbol:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleReset = () => {
    setName('');
    setDescription('');
    setImages([]);
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6"><I18nText translationKey="uploadForm.title" /></h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name"><I18nText translationKey="uploadForm.name.label" /></Label>
          <Input 
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('uploadForm.name.placeholder')}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label><I18nText translationKey="uploadForm.image.label" /></Label>
          <ImageUpload onChange={handleImageUpload} />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description"><I18nText translationKey="uploadForm.description.label" /></Label>
          <Textarea 
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('uploadForm.description.placeholder')}
            rows={4}
            required
          />
        </div>
        
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleReset}
          >
            <I18nText translationKey="uploadForm.reset" />
          </Button>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            <I18nText translationKey="uploadForm.submit" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SymbolUploadForm;
