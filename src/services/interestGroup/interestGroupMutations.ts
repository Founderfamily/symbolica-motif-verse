
import { supabase } from '@/integrations/supabase/client';
import { InterestGroup } from '@/types/interest-groups';

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
