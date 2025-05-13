
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SymbolData, SymbolImage } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const SymbolEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [symbol, setSymbol] = useState<SymbolData | null>(null);
  const [images, setImages] = useState<Record<string, SymbolImage | null>>({
    original: null,
    pattern: null,
    reuse: null
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<Record<string, boolean>>({
    original: false,
    pattern: false,
    reuse: false
  });

  // Pour l'upload d'images
  const [imageTitle, setImageTitle] = useState<Record<string, string>>({
    original: 'Image originale',
    pattern: 'Extraction du motif',
    reuse: 'Nouvelle utilisation'
  });
  const [imageDescription, setImageDescription] = useState<Record<string, string>>({
    original: '',
    pattern: '',
    reuse: ''
  });

  useEffect(() => {
    if (!id) {
      navigate('/admin/symbols');
      return;
    }
    
    const fetchSymbolData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les infos du symbole
        const { data: symbolData, error: symbolError } = await supabase
          .from('symbols')
          .select('*')
          .eq('id', id)
          .single();
        
        if (symbolError) throw symbolError;
        setSymbol(symbolData);
        
        // Récupérer les images du symbole
        const { data: imagesData, error: imagesError } = await supabase
          .from('symbol_images')
          .select('*')
          .eq('symbol_id', id);
        
        if (imagesError) throw imagesError;
        
        // Organiser les images par type
        const organizedImages: Record<string, SymbolImage | null> = {
          original: null,
          pattern: null,
          reuse: null
        };
        
        imagesData.forEach(img => {
          organizedImages[img.image_type] = img;
          if (img.title) {
            setImageTitle(prev => ({...prev, [img.image_type]: img.title || prev[img.image_type]}));
          }
          if (img.description) {
            setImageDescription(prev => ({...prev, [img.image_type]: img.description || ''}));
          }
        });
        
        setImages(organizedImages);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données du symbole",
          variant: "destructive",
        });
        navigate('/admin/symbols');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSymbolData();
  }, [id, navigate, toast]);

  const handleImageUpload = async (type: 'original' | 'pattern' | 'reuse', file: File) => {
    if (!symbol) return;
    
    try {
      setUploading(prev => ({ ...prev, [type]: true }));
      
      // 1. Upload de l'image dans le bucket Storage
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      const filePath = `${symbol.id}/${type}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('symbol_images')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // 2. Récupérer l'URL publique de l'image
      const { data: { publicUrl } } = supabase.storage
        .from('symbol_images')
        .getPublicUrl(filePath);
      
      // 3. Mettre à jour ou créer l'entrée dans symbol_images
      if (images[type]) {
        // Mise à jour
        const { error } = await supabase
          .from('symbol_images')
          .update({
            image_url: publicUrl,
            title: imageTitle[type],
            description: imageDescription[type] || null
          })
          .eq('id', images[type]!.id);
          
        if (error) throw error;
      } else {
        // Création
        const { error } = await supabase
          .from('symbol_images')
          .insert({
            symbol_id: symbol.id,
            image_url: publicUrl,
            image_type: type,
            title: imageTitle[type],
            description: imageDescription[type] || null
          });
          
        if (error) throw error;
      }
      
      // Recharger les images
      const { data, error } = await supabase
        .from('symbol_images')
        .select('*')
        .eq('symbol_id', symbol.id)
        .eq('image_type', type)
        .single();
        
      if (error) throw error;
      
      setImages(prev => ({
        ...prev,
        [type]: data
      }));
      
      toast({
        title: "Succès",
        description: "Image mise à jour avec succès"
      });
    } catch (error) {
      console.error('Erreur lors de l\'upload de l\'image:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger l'image",
        variant: "destructive"
      });
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleUpdateMetadata = async (type: 'original' | 'pattern' | 'reuse') => {
    if (!symbol || !images[type]) return;
    
    try {
      const { error } = await supabase
        .from('symbol_images')
        .update({
          title: imageTitle[type],
          description: imageDescription[type] || null
        })
        .eq('id', images[type]!.id);
        
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Métadonnées mises à jour"
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des métadonnées:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les métadonnées",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!symbol) {
    return (
      <div className="text-center">
        <p className="text-slate-600">Symbole non trouvé</p>
        <Button onClick={() => navigate('/admin/symbols')} className="mt-4">
          Retour à la liste
        </Button>
      </div>
    );
  }

  const renderImageUploader = (type: 'original' | 'pattern' | 'reuse', title: string) => {
    const image = images[type];
    const PLACEHOLDER = '/placeholder.svg';
    
    return (
      <Card className="overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-medium">{title}</h3>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <AspectRatio ratio={1} className="bg-slate-50 rounded-md overflow-hidden">
              <img
                src={image?.image_url || PLACEHOLDER}
                alt={image?.title || title}
                className="object-cover w-full h-full"
                crossOrigin="anonymous"
              />
            </AspectRatio>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor={`${type}-title`}>Titre</Label>
              <Input
                id={`${type}-title`}
                value={imageTitle[type]}
                onChange={(e) => setImageTitle(prev => ({ ...prev, [type]: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor={`${type}-description`}>Description</Label>
              <textarea
                id={`${type}-description`}
                value={imageDescription[type]}
                onChange={(e) => setImageDescription(prev => ({ ...prev, [type]: e.target.value }))}
                className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            
            <div>
              <Label htmlFor={`${type}-upload`}>Télécharger une nouvelle image</Label>
              <Input
                id={`${type}-upload`}
                type="file"
                accept="image/*"
                disabled={uploading[type]}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImageUpload(type, e.target.files[0]);
                  }
                }}
              />
            </div>
            
            {image && (
              <Button 
                onClick={() => handleUpdateMetadata(type)}
                variant="outline"
                className="w-full"
              >
                Mettre à jour les métadonnées
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-slate-800">Édition du symbole: {symbol.name}</h2>
        <Button onClick={() => navigate('/admin/symbols')} variant="outline">
          Retour à la liste
        </Button>
      </div>
      
      <div className="mb-6">
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Informations</h3>
            <p><span className="font-medium">Nom:</span> {symbol.name}</p>
            <p><span className="font-medium">Culture:</span> {symbol.culture}</p>
            <p><span className="font-medium">Période:</span> {symbol.period}</p>
            {symbol.description && (
              <p><span className="font-medium">Description:</span> {symbol.description}</p>
            )}
          </div>
          
          <Button onClick={() => navigate(`/admin/symbols`)} variant="outline">
            Modifier les informations
          </Button>
        </Card>
      </div>
      
      <h3 className="text-lg font-medium mb-4">Images</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderImageUploader('original', 'Image originale')}
        {renderImageUploader('pattern', 'Extraction du motif')}
        {renderImageUploader('reuse', 'Nouvelle utilisation')}
      </div>
    </div>
  );
};

export default SymbolEditor;
