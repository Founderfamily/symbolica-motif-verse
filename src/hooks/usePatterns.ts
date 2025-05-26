
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Pattern } from '@/types/patterns';

export const usePatterns = (symbolId?: string) => {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPatterns = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('patterns')
        .select('*')
        .order('created_at', { ascending: false });

      if (symbolId) {
        query = query.eq('symbol_id', symbolId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Type conversion to ensure proper types
      const typedPatterns: Pattern[] = (data || []).map(item => ({
        ...item,
        pattern_type: item.pattern_type as Pattern['pattern_type'],
        complexity_level: item.complexity_level as Pattern['complexity_level'],
        translations: (item.translations as any) || {}
      }));

      setPatterns(typedPatterns);
    } catch (err) {
      console.error('Error fetching patterns:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const createPattern = async (patternData: Omit<Pattern, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      const { data, error } = await supabase
        .from('patterns')
        .insert({
          ...patternData,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      const typedPattern: Pattern = {
        ...data,
        pattern_type: data.pattern_type as Pattern['pattern_type'],
        complexity_level: data.complexity_level as Pattern['complexity_level'],
        translations: (data.translations as any) || {}
      };

      setPatterns(prev => [typedPattern, ...prev]);
      return typedPattern;
    } catch (err) {
      console.error('Error creating pattern:', err);
      throw err;
    }
  };

  const updatePattern = async (id: string, updates: Partial<Pattern>) => {
    try {
      const { data, error } = await supabase
        .from('patterns')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const typedPattern: Pattern = {
        ...data,
        pattern_type: data.pattern_type as Pattern['pattern_type'],
        complexity_level: data.complexity_level as Pattern['complexity_level'],
        translations: (data.translations as any) || {}
      };

      setPatterns(prev => prev.map(pattern => 
        pattern.id === id ? { ...pattern, ...typedPattern } : pattern
      ));

      return typedPattern;
    } catch (err) {
      console.error('Error updating pattern:', err);
      throw err;
    }
  };

  const deletePattern = async (id: string) => {
    try {
      const { error } = await supabase
        .from('patterns')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPatterns(prev => prev.filter(pattern => pattern.id !== id));
    } catch (err) {
      console.error('Error deleting pattern:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchPatterns();
  }, [symbolId]);

  return {
    patterns,
    loading,
    error,
    refetch: fetchPatterns,
    createPattern,
    updatePattern,
    deletePattern
  };
};
