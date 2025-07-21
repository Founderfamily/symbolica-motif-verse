
import { supabase } from '@/integrations/supabase/client';
import { InterestGroup } from '@/types/interest-groups';
import { sampleGroups } from './interestGroupSampleData';

/**
 * Fetches a limited number of interest groups for display - with fallback data and timeout
 */
export const getInterestGroups = async (limit?: number): Promise<InterestGroup[]> => {
  try {
    console.log('🚀 [getInterestGroups] Fetching from Supabase with timeout...');
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Interest groups timeout')), 1500)
    );

    let query = supabase
      .from('interest_groups')
      .select('*')
      .order('name');

    if (limit) {
      query = query.limit(limit);
    }

    const dataPromise = query;
    const { data, error } = await Promise.race([dataPromise, timeoutPromise]) as any;

    if (error) {
      console.error('❌ [getInterestGroups] Supabase error:', error);
      console.log('🔄 [getInterestGroups] Returning empty array instead of sample data');
      return [];
    }
    
    if (!data || data.length === 0) {
      console.log('📝 [getInterestGroups] No data in Supabase');
      return [];
    }

    console.log('✅ [getInterestGroups] Supabase data:', data.length, 'groups');

    // Ensure unique groups by ID and fix translations
    const uniqueGroups = data
      .filter((group, index, self) => 
        index === self.findIndex(g => g.id === group.id)
      )
      .map(group => ({
        ...group,
        translations: typeof group.translations === 'string' 
          ? JSON.parse(group.translations)
          : group.translations
      })) as InterestGroup[];

    console.log('✅ [getInterestGroups] Unique groups after dedup:', uniqueGroups.length);
    return uniqueGroups;
  } catch (error) {
    console.error('❌ [getInterestGroups] Network error or timeout:', error);
    console.log('🔄 [getInterestGroups] Using sample data as fallback');
    return limit ? sampleGroups.slice(0, limit) : sampleGroups;
  }
};

/**
 * Fetches all interest groups - with fallback data and timeout
 */
export const getAllGroups = async (): Promise<InterestGroup[]> => {
  try {
    console.log('🚀 [getAllGroups] Fetching from Supabase with timeout...');
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('All groups timeout')), 1500)
    );
    
    const dataPromise = supabase
      .from('interest_groups')
      .select('*')
      .order('name');

    const { data, error } = await Promise.race([dataPromise, timeoutPromise]) as any;

    if (error) {
      console.error('❌ [getAllGroups] Supabase error:', error);
      console.log('🔄 [getAllGroups] Using sample data');
      return sampleGroups;
    }
    
    if (!data || data.length === 0) {
      console.log('📝 [getAllGroups] No data in Supabase, using sample data');
      return sampleGroups;
    }

    console.log('✅ [getAllGroups] Supabase data:', data.length, 'groups');

    // Type cast to fix the type issue with translations
    return data.map(group => ({
      ...group,
      translations: typeof group.translations === 'string' 
        ? JSON.parse(group.translations)
        : group.translations
    })) as InterestGroup[];
  } catch (error) {
    console.error('❌ [getAllGroups] Network error or timeout:', error);
    console.log('🔄 [getAllGroups] Using sample data as fallback');
    return sampleGroups;
  }
};

/**
 * Fetches a single interest group by ID - respects RLS policies
 */
export const getGroupById = async (id: string): Promise<InterestGroup | null> => {
  try {
    const { data, error } = await supabase
      .from('interest_groups')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching interest group with ID ${id}:`, error);
      return null;
    }
    
    if (!data) return null;

    // Type cast to fix the type issue with translations
    return {
      ...data,
      translations: typeof data.translations === 'string'
        ? JSON.parse(data.translations)
        : data.translations
    } as InterestGroup;
  } catch (error) {
    console.error(`Error fetching interest group with ID ${id}:`, error);
    return null;
  }
};

/**
 * Fetches a single interest group by slug - respects RLS policies
 */
export const getGroupBySlug = async (slug: string): Promise<InterestGroup | null> => {
  try {
    console.log('🚀 [getGroupBySlug] Fetching group with slug:', slug);
    
    const { data, error } = await supabase
      .from('interest_groups')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching interest group with slug ${slug}:`, error);
      // Check sample data as fallback
      const sampleGroup = sampleGroups.find(group => group.slug === slug);
      return sampleGroup || null;
    }
    
    if (!data) {
      // Check sample data as fallback
      const sampleGroup = sampleGroups.find(group => group.slug === slug);
      return sampleGroup || null;
    }

    console.log('✅ [getGroupBySlug] Found group:', data.name);

    // Type cast to fix the type issue with translations
    return {
      ...data,
      translations: typeof data.translations === 'string'
        ? JSON.parse(data.translations)
        : data.translations
    } as InterestGroup;
  } catch (error) {
    console.error(`Error fetching interest group with slug ${slug}:`, error);
    // Check sample data as fallback
    const sampleGroup = sampleGroups.find(group => group.slug === slug);
    return sampleGroup || null;
  }
};
