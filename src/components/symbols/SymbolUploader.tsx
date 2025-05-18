
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { SymbolFormData } from '@/types/symbol';
import SymbolForm from './SymbolForm';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

// Mock upload function - In a real app this would connect to your API
const uploadSymbolData = async (formData: SymbolFormData): Promise<{ id: string }> => {
  // Simulate an API call
  console.log('Uploading symbol data:', formData);
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return a mock response
  return { id: 'symbol_' + Math.random().toString(36).substr(2, 9) };
};

// Mock function to upload image files
const uploadSymbolImages = async (files: File[], symbolId: string): Promise<string[]> => {
  // Simulate an API call
  console.log(`Uploading ${files.length} images for symbol ${symbolId}`);
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return mock image URLs
  return files.map((_, index) => 
    `https://placehold.co/600x400?text=Symbol+Image+${index + 1}`
  );
};

const SymbolUploader: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();
  
  // Define the Form Data type explicitly to match with SymbolForm
  interface SubmitFormData extends SymbolFormData {
    images: File[];
    techniques: string[];
    functions: string[];
    mediums: string[];
  }
  
  const handleSubmit = async (data: SubmitFormData) => {
    setIsSubmitting(true);
    
    try {
      // 1. First upload the symbol metadata
      const { id } = await uploadSymbolData(data);
      
      // 2. Then upload any images if present
      if (data.images && data.images.length > 0) {
        await uploadSymbolImages(data.images, id);
      }
      
      // 3. Show success message
      toast.success(t('symbolUploader.success.title'), {
        description: t('symbolUploader.success.description'),
      });
      
      // 4. Could redirect to the symbol details page here
      // navigate(`/symbols/${id}`);
      
    } catch (error) {
      console.error('Error uploading symbol:', error);
      toast.error(t('symbolUploader.error.title'), {
        description: t('symbolUploader.error.description'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            <I18nText translationKey="symbolUploader.title" />
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <SymbolForm 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting}
          />
        </CardContent>
        
        <CardFooter className="bg-slate-50 border-t flex flex-col items-start px-6 py-4">
          <p className="text-sm text-slate-600">
            <I18nText translationKey="symbolUploader.footer.note" />
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SymbolUploader;
