
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadSectionProps {
  selectedImage: File | null;
  onImageSelected: (file: File | null) => void;
  formErrors: any;
  isEditMode?: boolean;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  selectedImage,
  onImageSelected,
  formErrors,
  isEditMode = false
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageSelected(acceptedFiles[0]);
    }
  }, [onImageSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const removeImage = () => {
    onImageSelected(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Image du symbole
          {!isEditMode && <span className="text-red-500">*</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedImage ? (
          <div className="relative">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Aperçu"
              className="w-full h-48 object-cover rounded-lg border"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={removeImage}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="mt-2 text-sm text-gray-600">
              <p>{selectedImage.name}</p>
              <p>{(selectedImage.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            {isDragActive ? (
              <p className="text-primary">Déposez l'image ici...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">
                  {isEditMode 
                    ? 'Cliquez ou glissez une nouvelle image pour la remplacer'
                    : 'Cliquez ou glissez une image ici'
                  }
                </p>
                <p className="text-sm text-gray-500">
                  Formats acceptés: JPEG, PNG, WebP (max. 5MB)
                </p>
              </div>
            )}
          </div>
        )}

        {isEditMode && !selectedImage && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              💡 L'image actuelle sera conservée si vous n'en téléchargez pas une nouvelle.
            </p>
          </div>
        )}

        {formErrors.root?.message && (
          <p className="text-sm text-red-600">{formErrors.root.message}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUploadSection;
