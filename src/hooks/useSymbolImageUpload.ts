
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useSymbolImageUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      symbolId,
      file,
      imageType = 'original',
      title,
      description
    }: {
      symbolId: string;
      file: File;
      imageType?: 'original' | 'pattern' | 'reuse';
      title?: string;
      description?: string;
    }) => {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${symbolId}-${Date.now()}.${fileExt}`;
      const filePath = `symbol-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('symbol-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('symbol-images')
        .getPublicUrl(filePath);

      // Get current user
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Insert image record
      const { data, error } = await supabase
        .from('symbol_images')
        .insert([{
          symbol_id: symbolId,
          image_url: publicUrl,
          image_type: imageType,
          title,
          description,
          uploaded_by: user.user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['symbol-images', variables.symbolId] });
      toast.success('Image ajoutée avec succès');
    },
    onError: (error) => {
      console.error('Error uploading image:', error);
      toast.error('Erreur lors de l\'upload de l\'image');
    }
  });
};

export const useDeleteSymbolImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, symbolId }: { id: string; symbolId: string }) => {
      const { error } = await supabase
        .from('symbol_images')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['symbol-images', variables.symbolId] });
      toast.success('Image supprimée avec succès');
    },
    onError: (error) => {
      console.error('Error deleting image:', error);
      toast.error('Erreur lors de la suppression de l\'image');
    }
  });
};

export const useSetPrimaryImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, symbolId }: { id: string; symbolId: string }) => {
      const { error } = await supabase
        .from('symbol_images')
        .update({ is_primary: true })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['symbol-images', variables.symbolId] });
      toast.success('Image définie comme principale');
    },
    onError: (error) => {
      console.error('Error setting primary image:', error);
      toast.error('Erreur lors de la définition de l\'image principale');
    }
  });
};
