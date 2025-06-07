
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import ImageDropzone from '@/components/contributions/ImageDropzone';

interface ImageUploadSectionProps {
  selectedImage: File | null;
  onImageSelected: (file: File) => void;
  formErrors: any;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({ 
  selectedImage, 
  onImageSelected, 
  formErrors 
}) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Upload className="mr-2 h-5 w-5 text-primary" />
          {t('contributions:form.sections.image')}
        </CardTitle>
        <CardDescription>
          {t('contributions:form.sections.imageDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ImageDropzone
          onImageSelected={onImageSelected}
          selectedImage={selectedImage}
        />
        {formErrors.root && (
          <p className="text-sm text-destructive mt-2">
            {formErrors.root.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUploadSection;
