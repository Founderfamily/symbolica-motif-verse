
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Upload, Search, BarChart } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { 
  AnalysisExample,
  AnalysisExampleFormData, 
  createAnalysisExample, 
  uploadAnalysisImage,
  updateAnalysisExample 
} from '@/services/analysisExampleService';

const formSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable()
});

type AnalysisExampleFormProps = {
  existingExample?: AnalysisExample;
  onSubmitSuccess?: () => void;
};

type ImageUploadState = {
  original: { loading: boolean; progress: number; file?: File };
  detection: { loading: boolean; progress: number; file?: File };
  extraction: { loading: boolean; progress: number; file?: File };
  classification: { loading: boolean; progress: number; file?: File };
};

export default function AnalysisExampleForm({ existingExample, onSubmitSuccess }: AnalysisExampleFormProps) {
  const { toast } = useToast();
  const [exampleId, setExampleId] = useState<string | null>(existingExample?.id || null);
  const [uploadState, setUploadState] = useState<ImageUploadState>({
    original: { loading: false, progress: 0 },
    detection: { loading: false, progress: 0 },
    extraction: { loading: false, progress: 0 },
    classification: { loading: false, progress: 0 }
  });
  
  const [imageUrls, setImageUrls] = useState({
    original: existingExample?.original_image_url || null,
    detection: existingExample?.detection_image_url || null,
    extraction: existingExample?.extraction_image_url || null,
    classification: existingExample?.classification_image_url || null
  });

  const form = useForm<AnalysisExampleFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: existingExample?.title || '',
      description: existingExample?.description || '',
      tags: existingExample?.tags || []
    }
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    imageType: 'original' | 'detection' | 'extraction' | 'classification'
  ) => {
    if (e.target.files && e.target.files[0]) {
      setUploadState(prev => ({
        ...prev,
        [imageType]: {
          ...prev[imageType],
          file: e.target.files![0]
        }
      }));
    }
  };

  const handleUpload = async (
    imageType: 'original' | 'detection' | 'extraction' | 'classification'
  ) => {
    const file = uploadState[imageType].file;
    if (!file || !exampleId) return;

    try {
      setUploadState(prev => ({
        ...prev,
        [imageType]: { ...prev[imageType], loading: true }
      }));

      const imageUrl = await uploadAnalysisImage(file, imageType, exampleId);
      
      setImageUrls(prev => ({
        ...prev,
        [imageType]: imageUrl
      }));

      toast({
        title: "Succès",
        description: "Image téléchargée avec succès",
        variant: "default"
      });
    } catch (error) {
      console.error(`Error uploading ${imageType} image:`, error);
      toast({
        title: "Erreur",
        description: "Échec du téléchargement de l'image",
        variant: "destructive"
      });
    } finally {
      setUploadState(prev => ({
        ...prev,
        [imageType]: { ...prev[imageType], loading: false, progress: 100 }
      }));
    }
  };

  const onSubmit = async (data: AnalysisExampleFormData) => {
    try {
      if (exampleId) {
        // Update existing example
        await updateAnalysisExample(exampleId, data);
        toast({
          title: "Succès",
          description: "Exemple mis à jour avec succès",
          variant: "default"
        });
      } else {
        // Create new example
        const id = await createAnalysisExample(data);
        setExampleId(id);
        toast({
          title: "Succès",
          description: "Nouvel exemple créé avec succès",
          variant: "default"
        });
      }
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error("Error submitting analysis example:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'enregistrement de l'exemple",
        variant: "destructive"
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre de l'exemple</FormLabel>
                  <FormControl>
                    <Input placeholder="Art Nouveau - Motif floral" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Description du processus d'analyse" 
                      rows={3} 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
              {exampleId ? "Mettre à jour l'exemple" : "Enregistrer l'exemple"}
            </Button>
          </div>

          <div className="space-y-4">
            <FormLabel>Images du processus</FormLabel>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {/* Original image upload */}
              <div className="border border-dashed border-slate-300 rounded-md p-4 text-center">
                {imageUrls.original ? (
                  <div className="relative w-full aspect-square mb-2">
                    <img 
                      src={imageUrls.original} 
                      alt="Original"
                      className="object-cover w-full h-full rounded-md"
                    />
                  </div>
                ) : (
                  <Camera className="h-6 w-6 mx-auto text-slate-400" />
                )}
                <p className="text-xs text-slate-500 mt-1">Photo originale</p>
                <Input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  id="original-upload"
                  onChange={(e) => handleFileChange(e, 'original')}
                />
                <label htmlFor="original-upload">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 w-full" 
                    disabled={uploadState.original.loading || !exampleId}
                    onClick={() => uploadState.original.file && handleUpload('original')}
                    type="button"
                  >
                    {uploadState.original.file && !imageUrls.original ? 
                      (uploadState.original.loading ? "Envoi..." : "Télécharger") : 
                      "Choisir une image"}
                  </Button>
                </label>
              </div>

              {/* Detection image upload */}
              <div className="border border-dashed border-slate-300 rounded-md p-4 text-center">
                {imageUrls.detection ? (
                  <div className="relative w-full aspect-square mb-2">
                    <img 
                      src={imageUrls.detection} 
                      alt="Detection"
                      className="object-cover w-full h-full rounded-md"
                    />
                  </div>
                ) : (
                  <Search className="h-6 w-6 mx-auto text-slate-400" />
                )}
                <p className="text-xs text-slate-500 mt-1">Détection IA</p>
                <Input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  id="detection-upload"
                  onChange={(e) => handleFileChange(e, 'detection')}
                />
                <label htmlFor="detection-upload">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 w-full" 
                    disabled={uploadState.detection.loading || !exampleId}
                    onClick={() => uploadState.detection.file && handleUpload('detection')}
                    type="button"
                  >
                    {uploadState.detection.file && !imageUrls.detection ? 
                      (uploadState.detection.loading ? "Envoi..." : "Télécharger") : 
                      "Choisir une image"}
                  </Button>
                </label>
              </div>

              {/* Extraction image upload */}
              <div className="border border-dashed border-slate-300 rounded-md p-4 text-center">
                {imageUrls.extraction ? (
                  <div className="relative w-full aspect-square mb-2">
                    <img 
                      src={imageUrls.extraction} 
                      alt="Extraction"
                      className="object-cover w-full h-full rounded-md"
                    />
                  </div>
                ) : (
                  <Camera className="h-6 w-6 mx-auto text-slate-400" />
                )}
                <p className="text-xs text-slate-500 mt-1">Extraction du motif</p>
                <Input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  id="extraction-upload"
                  onChange={(e) => handleFileChange(e, 'extraction')}
                />
                <label htmlFor="extraction-upload">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 w-full" 
                    disabled={uploadState.extraction.loading || !exampleId}
                    onClick={() => uploadState.extraction.file && handleUpload('extraction')}
                    type="button"
                  >
                    {uploadState.extraction.file && !imageUrls.extraction ? 
                      (uploadState.extraction.loading ? "Envoi..." : "Télécharger") : 
                      "Choisir une image"}
                  </Button>
                </label>
              </div>

              {/* Classification image upload */}
              <div className="border border-dashed border-slate-300 rounded-md p-4 text-center">
                {imageUrls.classification ? (
                  <div className="relative w-full aspect-square mb-2">
                    <img 
                      src={imageUrls.classification} 
                      alt="Classification"
                      className="object-cover w-full h-full rounded-md"
                    />
                  </div>
                ) : (
                  <BarChart className="h-6 w-6 mx-auto text-slate-400" />
                )}
                <p className="text-xs text-slate-500 mt-1">Classification</p>
                <Input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  id="classification-upload"
                  onChange={(e) => handleFileChange(e, 'classification')}
                />
                <label htmlFor="classification-upload">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 w-full" 
                    disabled={uploadState.classification.loading || !exampleId}
                    onClick={() => uploadState.classification.file && handleUpload('classification')}
                    type="button"
                  >
                    {uploadState.classification.file && !imageUrls.classification ? 
                      (uploadState.classification.loading ? "Envoi..." : "Télécharger") : 
                      "Choisir une image"}
                  </Button>
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
