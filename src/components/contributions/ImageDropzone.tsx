
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

interface ImageDropzoneProps {
  onImageSelected: (file: File) => void;
  selectedImage: File | null;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({ onImageSelected, selectedImage }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    if (acceptedFiles.length === 0) {
      return;
    }

    const file = acceptedFiles[0];
    
    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      setError(t('contributions.image.errors.format'));
      return;
    }

    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError(t('contributions.image.errors.size'));
      return;
    }

    // Créer une URL d'aperçu
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    onImageSelected(file);

    // Nettoyer l'URL d'aperçu quand le composant est démonté
    return () => URL.revokeObjectURL(objectUrl);
  }, [onImageSelected, t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
  });

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onImageSelected(null as any);
    setError(null);
  };

  // Get translated message strings
  const dropActiveText = t('contributions.image.dropActive');
  const dropText = t('contributions.image.drop');
  const formatsText = t('contributions.image.formats');
  const removeText = t('contributions.image.remove');

  return (
    <div className="space-y-4">
      {!previewUrl ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-sm font-medium">
                <I18nText translationKey="contributions.image.dropActive" />
              </p>
            ) : (
              <>
                <p className="text-sm font-medium">
                  <I18nText translationKey="contributions.image.drop" />
                </p>
                <p className="text-xs text-muted-foreground">
                  <I18nText translationKey="contributions.image.formats" />
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="relative rounded-md overflow-hidden border border-muted">
          <img
            src={previewUrl}
            alt="Aperçu"
            className="w-full h-64 object-contain bg-secondary/20"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-3 flex justify-between items-center">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm truncate max-w-[200px]">
                {selectedImage?.name}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveImage}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">
                <I18nText translationKey="contributions.image.remove" />
              </span>
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center text-destructive text-sm">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
        </div>
      )}
    </div>
  );
};

export default ImageDropzone;
