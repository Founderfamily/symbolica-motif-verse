
import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

interface ImageUploadProps {
  onChange: (files: File[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string[];
  maxSizeInMB?: number;
  className?: string;
  initialImages?: string[];
  multiple?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  maxFiles = 5,
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/webp'],
  maxSizeInMB = 5,
  className = '',
  initialImages = [],
  multiple = true
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(initialImages || []);
  const [errors, setErrors] = useState<string[]>([]);
  const { t } = useTranslation();
  
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  
  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Handle accepted files
      const newFiles = [...files];
      const newPreviews = [...previews.filter(p => !p.startsWith('blob:'))];
      const newErrors: string[] = [];
      
      // Process accepted files
      acceptedFiles.forEach((file) => {
        if (newFiles.length + newPreviews.length >= maxFiles) {
          newErrors.push(t('imageUpload.tooManyFiles', { max: maxFiles }));
          return;
        }
        
        if (file.size > maxSizeInBytes) {
          newErrors.push(
            t('imageUpload.fileTooLarge', {
              name: file.name,
              size: (file.size / (1024 * 1024)).toFixed(2),
              max: maxSizeInMB
            })
          );
          return;
        }
        
        newFiles.push(file);
        newPreviews.push(URL.createObjectURL(file));
      });
      
      // Process rejected files
      rejectedFiles.forEach((rejection) => {
        newErrors.push(
          t('imageUpload.fileRejected', {
            name: rejection.file.name,
            reason: rejection.errors[0]?.message || 'Unknown error'
          })
        );
      });
      
      setFiles(newFiles);
      setPreviews(newPreviews);
      setErrors(newErrors);
      onChange(newFiles);
    },
    [files, previews, maxFiles, maxSizeInBytes, maxSizeInMB, onChange, t]
  );
  
  const removeFile = (index: number) => {
    const newFiles = [...files];
    const newPreviews = [...previews];
    
    // Revoke object URL to avoid memory leaks
    if (newPreviews[index] && newPreviews[index].startsWith('blob:')) {
      URL.revokeObjectURL(newPreviews[index]);
    }
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setFiles(newFiles);
    setPreviews(newPreviews);
    onChange(newFiles);
  };
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles: maxFiles - previews.length + files.length,
    multiple
  });
  
  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/10'
            : 'border-gray-300 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-10 w-10 text-gray-400" />
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {isDragActive ? (
                <I18nText translationKey="imageUpload.dropHere">Drop files here</I18nText>
              ) : (
                <I18nText translationKey="imageUpload.dragOrClick">
                  Drag and drop files or click to upload
                </I18nText>
              )}
            </p>
            <p className="text-xs text-gray-500">
              <I18nText 
                translationKey="imageUpload.restrictions"
                params={{ max: maxFiles, types: acceptedFileTypes.join(', '), size: maxSizeInMB }}
              >
                Maximum {maxFiles} files, {acceptedFileTypes.join(', ')}, up to {maxSizeInMB}MB each
              </I18nText>
            </p>
          </div>
        </div>
      </div>

      {/* Error messages */}
      {errors.length > 0 && (
        <div className="mt-2 text-sm text-red-500">
          {errors.map((error, i) => (
            <p key={i}>{error}</p>
          ))}
        </div>
      )}

      {/* Image previews */}
      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative aspect-square rounded-md overflow-hidden group">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="bg-white/80 p-1.5 rounded-full text-red-500 hover:bg-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          
          {/* Empty slots */}
          {Array.from({ length: Math.max(0, maxFiles - previews.length) }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="aspect-square rounded-md bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center"
            >
              <ImageIcon className="h-8 w-8 text-gray-300" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
