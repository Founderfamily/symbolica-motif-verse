
import React, { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Check, AlertCircle, Camera, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

interface EnhancedImageDropzoneProps {
  onImageSelected: (file: File) => void;
  selectedImage: File | null;
  onImageAnalyzed?: (analysis: any) => void;
  maxSize?: number;
  allowedTypes?: string[];
}

const EnhancedImageDropzone: React.FC<EnhancedImageDropzoneProps> = ({ 
  onImageSelected, 
  selectedImage,
  onImageAnalyzed,
  maxSize = 10 * 1024 * 1024, // 10MB par défaut
  allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [imageMetadata, setImageMetadata] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const analyzeImage = useCallback(async (file: File) => {
    setIsAnalyzing(true);
    try {
      // Simuler une analyse d'image basique
      const metadata = {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified),
        dimensions: null
      };

      // Obtenir les dimensions de l'image
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      await new Promise((resolve) => {
        img.onload = () => {
          metadata.dimensions = {
            width: img.width,
            height: img.height,
            ratio: (img.width / img.height).toFixed(2)
          };
          resolve(null);
        };
        img.src = objectUrl;
      });

      URL.revokeObjectURL(objectUrl);
      
      setImageMetadata(metadata);
      if (onImageAnalyzed) {
        onImageAnalyzed(metadata);
      }
    } catch (error) {
      console.error('Erreur lors de l\'analyse de l\'image:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [onImageAnalyzed]);

  const validateFile = useCallback((file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return t('contributions.image.errors.format');
    }
    
    if (file.size > maxSize) {
      return t('contributions.image.errors.size');
    }

    return null;
  }, [allowedTypes, maxSize, t]);

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);
    setUploadProgress(0);

    if (rejectedFiles.length > 0) {
      setError(t('contributions.image.errors.rejected'));
      return;
    }

    if (acceptedFiles.length === 0) {
      return;
    }

    const file = acceptedFiles[0];
    const validationError = validateFile(file);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    // Simuler le progrès d'upload
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    try {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      onImageSelected(file);
      
      // Finaliser le progrès
      setUploadProgress(100);
      
      // Analyser l'image
      await analyzeImage(file);
      
    } catch (error) {
      console.error('Erreur lors du traitement de l\'image:', error);
      setError(t('contributions.image.errors.processing'));
      setUploadProgress(0);
    } finally {
      clearInterval(progressInterval);
    }
  }, [onImageSelected, validateFile, analyzeImage, t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': allowedTypes.map(type => type.replace('image/', '.'))
    },
    maxFiles: 1,
    maxSize,
    multiple: false
  });

  const handleRemoveImage = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setImageMetadata(null);
    setUploadProgress(0);
    setError(null);
    onImageSelected(null as any);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [previewUrl, onImageSelected]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {!previewUrl ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragActive
              ? 'border-primary bg-primary/10 scale-105'
              : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/20'
          }`}
        >
          <input {...getInputProps()} ref={fileInputRef} />
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className={`p-4 rounded-full ${isDragActive ? 'bg-primary/20' : 'bg-muted/20'}`}>
              {isDragActive ? (
                <Upload className="h-8 w-8 text-primary animate-bounce" />
              ) : (
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            
            {isDragActive ? (
              <div className="space-y-2">
                <p className="text-lg font-medium text-primary">
                  <I18nText translationKey="contributions.image.dropActive" />
                </p>
                <p className="text-sm text-muted-foreground">
                  <I18nText translationKey="contributions.image.releaseFiles" />
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-lg font-medium">
                  <I18nText translationKey="contributions.image.drop" />
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    <I18nText translationKey="contributions.image.browse" />
                  </Button>
                  <span className="text-sm text-muted-foreground">ou</span>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    <I18nText translationKey="contributions.image.dragDrop" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  <I18nText translationKey="contributions.image.formats" />
                  <br />
                  <I18nText 
                    translationKey="contributions.image.maxSize" 
                    values={{ size: formatFileSize(maxSize) }}
                  />
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden border border-muted">
            <img
              src={previewUrl}
              alt="Aperçu"
              className="w-full h-64 object-contain bg-secondary/20"
            />
            
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-4 flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm font-medium">
                    <I18nText translationKey="contributions.image.analyzing" />
                  </span>
                </div>
              </div>
            )}

            <div className="absolute top-2 right-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRemoveImage}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span><I18nText translationKey="contributions.image.uploading" /></span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {imageMetadata && (
            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <I18nText translationKey="contributions.image.uploaded" />
                </h4>
                <Badge variant="secondary">
                  <I18nText translationKey="contributions.image.ready" />
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">
                    <I18nText translationKey="contributions.image.filename" />:
                  </span>
                  <p className="font-medium truncate">{imageMetadata.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    <I18nText translationKey="contributions.image.size" />:
                  </span>
                  <p className="font-medium">{formatFileSize(imageMetadata.size)}</p>
                </div>
                {imageMetadata.dimensions && (
                  <>
                    <div>
                      <span className="text-muted-foreground">
                        <I18nText translationKey="contributions.image.dimensions" />:
                      </span>
                      <p className="font-medium">
                        {imageMetadata.dimensions.width} × {imageMetadata.dimensions.height}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        <I18nText translationKey="contributions.image.ratio" />:
                      </span>
                      <p className="font-medium">{imageMetadata.dimensions.ratio}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center text-destructive text-sm bg-destructive/10 rounded-lg p-3">
          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default EnhancedImageDropzone;
