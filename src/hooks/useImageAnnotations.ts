
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { ImageAnnotation } from '@/types/patterns';

export const useImageAnnotations = (imageId?: string, imageType: 'symbol' | 'contribution' = 'symbol') => {
  const [annotations, setAnnotations] = useState<ImageAnnotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchAnnotations = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('image_annotations')
        .select(`
          *,
          pattern:patterns(*)
        `)
        .order('created_at', { ascending: false });

      if (imageId) {
        query = query.eq('image_id', imageId).eq('image_type', imageType);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setAnnotations(data || []);
    } catch (err) {
      console.error('Error fetching annotations:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const createAnnotation = async (annotationData: Omit<ImageAnnotation, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      const { data, error } = await supabase
        .from('image_annotations')
        .insert({
          ...annotationData,
          created_by: user.id
        })
        .select(`
          *,
          pattern:patterns(*)
        `)
        .single();

      if (error) throw error;

      setAnnotations(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error creating annotation:', err);
      throw err;
    }
  };

  const updateAnnotation = async (id: string, updates: Partial<ImageAnnotation>) => {
    try {
      const { data, error } = await supabase
        .from('image_annotations')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          pattern:patterns(*)
        `)
        .single();

      if (error) throw error;

      setAnnotations(prev => prev.map(annotation => 
        annotation.id === id ? { ...annotation, ...data } : annotation
      ));

      return data;
    } catch (err) {
      console.error('Error updating annotation:', err);
      throw err;
    }
  };

  const deleteAnnotation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('image_annotations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAnnotations(prev => prev.filter(annotation => annotation.id !== id));
    } catch (err) {
      console.error('Error deleting annotation:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (imageId) {
      fetchAnnotations();
    }
  }, [imageId, imageType]);

  return {
    annotations,
    loading,
    error,
    refetch: fetchAnnotations,
    createAnnotation,
    updateAnnotation,
    deleteAnnotation
  };
};
