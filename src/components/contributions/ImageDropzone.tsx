
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Check, AlertCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { SecurityUtils } from '@/utils/securityUtils';

interface ImageDropzoneProps {
  onImageSelected: (file: File) => void;
  selectedImage: File | null;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({ onImageSelected, selectedImage }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const { t } = useTranslation();

  const validateFileContent = async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const bytes = new Uint8Array(arrayBuffer);
        
        // Check for common image file signatures
        const isJPEG = bytes[0] === 0xFF && bytes[1] === 0xD8;
        const isPNG = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47;
        const isWebP = bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
        
        resolve(isJPEG || isPNG || isWebP);
      };
      reader.onerror = () => resolve(false);
      reader.readAsArrayBuffer(file.slice(0, 12));
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null);
    if (acceptedFiles.length === 0) {
      return;
    }

    const file = acceptedFiles[0];
    setIsValidating(true);
    
    try {
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

      // Vérification du contenu du fichier
      const isValidImage = await validateFileContent(file);
      if (!isValidImage) {
        setError('Le fichier ne semble pas être une image valide');
        return;
      }

      // Vérifier le nom du fichier pour des caractères suspects
      if (!SecurityUtils.validateFileName(file.name)) {
        setError('Nom de fichier non autorisé');
        return;
      }

      // Créer une URL d'aperçu
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      onImageSelected(file);

      // Nettoyer l'URL d'aperçu quand le composant est démonté
      return () => URL.revokeObjectURL(objectUrl);
    } catch (err) {
      setError(SecurityUtils.createSafeErrorResponse(err));
      console.error('File validation error:', err);
    } finally {
      setIsValidating(false);
    }
  }, [onImageSelected, t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onImageSelected(null as any);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {!previewUrl ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          } ${isValidating ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-2">
            {isValidating ? (
              <div className="animate-spin">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            ) : (
              <Upload className="h-8 w-8 text-muted-foreground" />
            )}
            {isValidating ? (
              <p className="text-sm font-medium">Validation en cours...</p>
            ) : isDragActive ? (
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
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Validation de sécurité automatique
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
              <div className="ml-2" title="Fichier validé">
                <Shield className="h-4 w-4 text-green-600" />
              </div>
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
