import { supabase } from '@/integrations/supabase/client';
import { InterestGroup } from '@/types/interest-groups';

// Sample data for testing
const sampleGroups: InterestGroup[] = [
  {
    id: 'sample-1',
    name: 'Symboles Celtiques',
    slug: 'symboles-celtiques',
    description: 'Exploration des symboles et traditions celtiques anciennes',
    icon: null,
    banner_image: null,
    theme_color: '#2563eb',
    is_public: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 'system',
    members_count: 42,
    discoveries_count: 18,
    translations: {
      en: { name: 'Celtic Symbols', description: 'Exploration of ancient Celtic symbols and traditions' },
      fr: { name: 'Symboles Celtiques', description: 'Exploration des symboles et traditions celtiques anciennes' }
    }
  },
  {
    id: 'sample-2',
    name: 'Art Islamique',
    slug: 'art-islamique',
    description: 'Motifs géométriques et calligraphie dans l\'art islamique',
    icon: null,
    banner_image: null,
    theme_color: '#059669',
    is_public: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 'system',
    members_count: 67,
    discoveries_count: 34,
    translations: {
      en: { name: 'Islamic Art', description: 'Geometric patterns and calligraphy in Islamic art' },
      fr: { name: 'Art Islamique', description: 'Motifs géométriques et calligraphie dans l\'art islamique' }
    }
  }
];

/**
 * Fetches a limited number of interest groups for display - with fallback data
 */
export const getInterestGroups = async (limit?: number): Promise<InterestGroup[]> => {
  try {
    console.log('🚀 [getInterestGroups] Fetching from Supabase...');
    
    let query = supabase
      .from('interest_groups')
      .select('*')
      .order('name');

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ [getInterestGroups] Supabase error:', error);
      console.log('🔄 [getInterestGroups] Using sample data');
      return limit ? sampleGroups.slice(0, limit) : sampleGroups;
    }
    
    if (!data || data.length === 0) {
      console.log('📝 [getInterestGroups] No data in Supabase, using sample data');
      return limit ? sampleGroups.slice(0, limit) : sampleGroups;
    }

    console.log('✅ [getInterestGroups] Supabase data:', data.length, 'groups');

    // Type cast to fix the type issue with translations
    return data.map(group => ({
      ...group,
      translations: typeof group.translations === 'string' 
        ? JSON.parse(group.translations)
        : group.translations
    })) as InterestGroup[];
  } catch (error) {
    console.error('❌ [getInterestGroups] Network error:', error);
    console.log('🔄 [getInterestGroups] Using sample data as fallback');
    return limit ? sampleGroups.slice(0, limit) : sampleGroups;
  }
};

/**
 * Fetches all interest groups - with fallback data
 */
export const getAllGroups = async (): Promise<InterestGroup[]> => {
  try {
    console.log('🚀 [getAllGroups] Fetching from Supabase...');
    
    const { data, error } = await supabase
      .from('interest_groups')
      .select('*')
      .order('name');

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
    console.error('❌ [getAllGroups] Network error:', error);
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
 * Creates a new interest group - respects RLS policies
 */
export const createGroup = async (groupData: Partial<InterestGroup>): Promise<InterestGroup | null> => {
  try {
    // Ensure required properties are present
    if (!groupData.name || !groupData.created_by) {
      throw new Error('Name and created_by are required fields');
    }

    const slug = groupData.slug || groupData.name.toLowerCase().replace(/\s+/g, '-');

    const { data, error } = await supabase
      .from('interest_groups')
      .insert({
        name: groupData.name,
        slug: slug,
        description: groupData.description || null,
        icon: groupData.icon || null,
        banner_image: groupData.banner_image || null,
        theme_color: groupData.theme_color || null,
        is_public: groupData.is_public ?? true,
        created_by: groupData.created_by,
        translations: groupData.translations || { en: {}, fr: {} }
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error creating interest group:', error);
      throw new Error(`Failed to create group: ${error.message}`);
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
    console.error('Error creating interest group:', error);
    throw error;
  }
};

/**
 * Updates an existing interest group - respects RLS policies
 */
export const updateGroup = async (id: string, groupData: Partial<InterestGroup>): Promise<InterestGroup | null> => {
  try {
    const { data, error } = await supabase
      .from('interest_groups')
      .update(groupData)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error(`Error updating interest group with ID ${id}:`, error);
      throw new Error(`Failed to update group: ${error.message}`);
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
    console.error(`Error updating interest group with ID ${id}:`, error);
    throw error;
  }
};
