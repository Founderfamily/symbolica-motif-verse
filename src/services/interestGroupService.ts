import { supabase } from '@/integrations/supabase/client';
import { InterestGroup } from '@/types/interest-groups';

/**
 * Fetches a limited number of interest groups for display
 */
export const getInterestGroups = async (limit?: number): Promise<InterestGroup[]> => {
  try {
    let query = supabase
      .from('interest_groups')
      .select('*')
      .order('name');

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    if (!data) return [];

    // Type cast to fix the type issue with translations
    return data.map(group => ({
      ...group,
      translations: typeof group.translations === 'string' 
        ? JSON.parse(group.translations)
        : group.translations
    })) as InterestGroup[];
  } catch (error) {
    console.error('Error fetching interest groups:', error);
    return [];
  }
};

/**
 * Fetches all interest groups
 */
export const getAllGroups = async (): Promise<InterestGroup[]> => {
  try {
    const { data, error } = await supabase
      .from('interest_groups')
      .select('*')
      .order('name');

    if (error) throw error;
    if (!data) return [];

    // Type cast to fix the type issue with translations
    return data.map(group => ({
      ...group,
      translations: typeof group.translations === 'string' 
        ? JSON.parse(group.translations)
        : group.translations
    })) as InterestGroup[];
  } catch (error) {
    console.error('Error fetching interest groups:', error);
    return [];
  }
};

/**
 * Fetches a single interest group by ID
 */
export const getGroupById = async (id: string): Promise<InterestGroup | null> => {
  try {
    const { data, error } = await supabase
      .from('interest_groups')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
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
 * Creates a new interest group
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
      .single();

    if (error) throw error;
    
    // Type cast to fix the type issue with translations
    return {
      ...data,
      translations: typeof data.translations === 'string'
        ? JSON.parse(data.translations)
        : data.translations
    } as InterestGroup;
  } catch (error) {
    console.error('Error creating interest group:', error);
    return null;
  }
};

/**
 * Updates an existing interest group
 */
export const updateGroup = async (id: string, groupData: Partial<InterestGroup>): Promise<InterestGroup | null> => {
  try {
    const { data, error } = await supabase
      .from('interest_groups')
      .update(groupData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    // Type cast to fix the type issue with translations
    return {
      ...data,
      translations: typeof data.translations === 'string'
        ? JSON.parse(data.translations)
        : data.translations
    } as InterestGroup;
  } catch (error) {
    console.error(`Error updating interest group with ID ${id}:`, error);
    return null;
  }
};
