
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Upload, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const SymbolEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewSymbol = id === 'new';
  
  const [symbol, setSymbol] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    culture: '',
    period: '',
    description: '',
    medium: [] as string[],
    technique: [] as string[],
    function: [] as string[],
  });

  // Options pour les nouveaux champs
  const mediumOptions = [
    'Pierre', 'Bois', 'Métal', 'Textile', 'Céramique', 'Verre', 
    'Papier', 'Parchemin', 'Os', 'Ivoire', 'Coquillage', 'Cuir'
  ];

  const techniqueOptions = [
    'Sculpture', 'Gravure', 'Peinture', 'Tissage', 'Broderie', 
    'Forge', 'Moulage', 'Incision', 'Relief', 'Dorure', 'Émaillage'
  ];

  const functionOptions = [
    'Religieux', 'Décoratif', 'Protecteur', 'Rituel', 'Commercial', 
    'Identitaire', 'Narratif', 'Politique', 'Funéraire', 'Thérapeutique'
  ];

  useEffect(() => {
    if (isNewSymbol) {
      setLoading(false);
      return;
    }

    const fetchSymbolData = async () => {
      try {
        const { data: symbolData, error: symbolError } = await supabase
          .from('symbols')
          .select('*')
          .eq('id', id)
          .single();

        if (symbolError) throw symbolError;

        setSymbol(symbolData);
        setFormData({
          name: symbolData.name,
          culture: symbolData.culture,
          period: symbolData.period,
          description: symbolData.description || '',
          medium: symbolData.medium || [],
          technique: symbolData.technique || [],
          function: symbolData.function || [],
        });

        const { data: imagesData, error: imagesError } = await supabase
          .from('symbol_images')
          .select('*')
          .eq('symbol_id', id);

        if (imagesError) throw imagesError;
        setImages(imagesData || []);
      } catch (error) {
        console.error('Error fetching symbol data:', error);
        toast.error('Erreur lors du chargement des données du symbole');
        navigate('/admin/symbols');
      } finally {
        setLoading(false);
      }
    };

    fetchSymbolData();
  }, [id, isNewSymbol, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayFieldChange = (field: 'medium' | 'technique' | 'function', value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleSave = async () => {
    try {
      if (isNewSymbol) {
        const { data, error } = await supabase
          .from('symbols')
          .insert([formData])
          .select()
          .single();

        if (error) throw error;

        toast.success('Symbole créé avec succès');
        navigate(`/admin/symbols/${data.id}/edit`);
      } else {
        const { error } = await supabase
          .from('symbols')
          .update(formData)
          .eq('id', id);

        if (error) throw error;

        toast.success('Symbole mis à jour avec succès');
      }
    } catch (error) {
      console.error('Error saving symbol:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || isNewSymbol) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `symbols/${id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('symbol-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('symbol-images')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from('symbol_images')
        .insert([
          {
            symbol_id: id,
            image_url: publicUrl,
            image_type: 'original',
            title: file.name,
          }
        ]);

      if (insertError) throw insertError;

      const { data: imagesData } = await supabase
        .from('symbol_images')
        .select('*')
        .eq('symbol_id', id);

      setImages(imagesData || []);
      toast.success('Image ajoutée avec succès');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Erreur lors du téléchargement de l\'image');
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from('symbol_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      setImages(prev => prev.filter(img => img.id !== imageId));
      toast.success('Image supprimée avec succès');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Erreur lors de la suppression de l\'image');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/admin/symbols')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-3xl font-bold">
          {isNewSymbol ? 'Nouveau Symbole' : 'Modifier le Symbole'}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="culture">Culture</Label>
                <Input
                  id="culture"
                  name="culture"
                  value={formData.culture}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="period">Période</Label>
                <Input
                  id="period"
                  name="period"
                  value={formData.period}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Caractéristiques techniques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Matériaux</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {mediumOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`medium-${option}`}
                        checked={formData.medium.includes(option)}
                        onCheckedChange={(checked) => 
                          handleArrayFieldChange('medium', option, checked as boolean)
                        }
                      />
                      <Label htmlFor={`medium-${option}`} className="text-sm">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Techniques</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {techniqueOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`technique-${option}`}
                        checked={formData.technique.includes(option)}
                        onCheckedChange={(checked) => 
                          handleArrayFieldChange('technique', option, checked as boolean)
                        }
                      />
                      <Label htmlFor={`technique-${option}`} className="text-sm">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Fonctions</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {functionOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`function-${option}`}
                        checked={formData.function.includes(option)}
                        onCheckedChange={(checked) => 
                          handleArrayFieldChange('function', option, checked as boolean)
                        }
                      />
                      <Label htmlFor={`function-${option}`} className="text-sm">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={handleSave} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                {isNewSymbol ? 'Créer le symbole' : 'Sauvegarder'}
              </Button>
            </CardContent>
          </Card>

          {!isNewSymbol && (
            <Card>
              <CardHeader>
                <CardTitle>Images du symbole</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="image-upload">Ajouter une image</Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {images.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.image_url}
                          alt={image.title || 'Symbol image'}
                          className="w-full h-32 object-cover rounded-md border"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDeleteImage(image.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {images.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <Upload className="w-8 h-8 mx-auto mb-2" />
                      <p>Aucune image pour ce symbole</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymbolEditor;
