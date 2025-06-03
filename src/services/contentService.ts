
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export interface ContentSection {
  id: string;
  section_key: string;
  title: Record<string, string>;
  subtitle: Record<string, string>;
  content: Record<string, string>;
  created_at?: string;
  updated_at?: string;
}

export const getContentSections = async (): Promise<ContentSection[]> => {
  try {
    console.log('ContentService: Fetching all content sections...');
    const { data, error } = await supabase
      .from('content_sections')
      .select('*')
      .order('section_key');
    
    if (error) {
      console.error("ContentService: Error fetching content sections:", error);
      // Return empty array instead of throwing
      return [];
    }
    
    console.log('ContentService: Successfully fetched sections:', data?.length || 0);
    return (data || []).map(item => ({
      ...item,
      title: item.title as Record<string, string>,
      subtitle: item.subtitle as Record<string, string>,
      content: item.content as Record<string, string>
    }));
  } catch (error) {
    console.error("ContentService: Unexpected error:", error);
    return [];
  }
};

export const getContentSectionByKey = async (key: string): Promise<ContentSection | null> => {
  try {
    console.log(`ContentService: Fetching content section with key: ${key}`);
    const { data, error } = await supabase
      .from('content_sections')
      .select('*')
      .eq('section_key', key)
      .maybeSingle(); // Use maybeSingle instead of single to avoid errors when no data
    
    if (error) {
      console.error(`ContentService: Error fetching content section with key ${key}:`, error);
      return null;
    }
    
    if (!data) {
      console.log(`ContentService: No content found for key: ${key}`);
      return null;
    }
    
    console.log(`ContentService: Successfully fetched section for key: ${key}`);
    return {
      ...data,
      title: data.title as Record<string, string>,
      subtitle: data.subtitle as Record<string, string>,
      content: data.content as Record<string, string>
    };
  } catch (error) {
    console.error(`ContentService: Unexpected error for key ${key}:`, error);
    return null;
  }
};

export const updateContentSection = async (section: ContentSection): Promise<void> => {
  try {
    console.log(`ContentService: Updating section: ${section.id}`);
    const { error } = await supabase
      .from('content_sections')
      .update({
        title: section.title,
        subtitle: section.subtitle,
        content: section.content,
        updated_at: new Date().toISOString()
      })
      .eq('id', section.id);
    
    if (error) {
      console.error("ContentService: Error updating content section:", error);
      throw error;
    }
    
    console.log(`ContentService: Successfully updated section: ${section.id}`);
  } catch (error) {
    console.error("ContentService: Unexpected error during update:", error);
    throw error;
  }
};

export const createContentSection = async (section: Omit<ContentSection, 'id' | 'created_at' | 'updated_at'>): Promise<void> => {
  try {
    console.log(`ContentService: Creating new section with key: ${section.section_key}`);
    const { error } = await supabase
      .from('content_sections')
      .insert([{
        section_key: section.section_key,
        title: section.title,
        subtitle: section.subtitle,
        content: section.content
      }]);
    
    if (error) {
      console.error("ContentService: Error creating content section:", error);
      throw error;
    }
    
    console.log(`ContentService: Successfully created section: ${section.section_key}`);
  } catch (error) {
    console.error("ContentService: Unexpected error during creation:", error);
    throw error;
  }
};
