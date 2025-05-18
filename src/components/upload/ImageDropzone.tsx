
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';

interface ImageDropzoneProps {
  onImageSelected: (file: File) => void;
  selectedImage: File | null;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  className?: string;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  onImageSelected,
  selectedImage,
  multiple = false,
  maxFiles = 1,
  maxSize = 5000000, // 5MB
  className = '',
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      onImageSelected(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  }, [onImageSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple,
    maxFiles,
    maxSize
  });

  const clearSelectedImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageSelected(null as unknown as File);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors 
                ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50/50'} 
                ${className}`}
    >
      <input {...getInputProps()} />
      
      {previewUrl || selectedImage ? (
        <div className="relative">
          <img 
            src={previewUrl || (selectedImage && URL.createObjectURL(selectedImage))} 
            alt="Preview" 
            className="max-h-64 mx-auto rounded-lg"
          />
          <button
            type="button"
            onClick={clearSelectedImage}
            className="absolute top-2 right-2 bg-white/80 rounded-full p-1 shadow-md hover:bg-white"
          >
            <X className="h-5 w-5 text-red-600" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-4">
          <UploadCloud className="h-10 w-10 text-slate-400 mb-2" />
          <p className="text-sm text-slate-600 font-medium">
            <I18nText translationKey="upload.dragImages" />
          </p>
          <p className="text-xs text-slate-500 mt-1">
            <I18nText translationKey="upload.imageRequirements" />
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageDropzone;
