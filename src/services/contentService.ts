
import { supabase } from "@/integrations/supabase/client";

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
  const { data, error } = await supabase
    .from('content_sections')
    .select('*')
    .order('section_key');
  
  if (error) {
    console.error("Error fetching content sections:", error);
    throw error;
  }
  
  return data || [];
};

export const getContentSectionByKey = async (key: string): Promise<ContentSection | null> => {
  const { data, error } = await supabase
    .from('content_sections')
    .select('*')
    .eq('section_key', key)
    .single();
  
  if (error) {
    console.error(`Error fetching content section with key ${key}:`, error);
    return null;
  }
  
  return data;
};

export const updateContentSection = async (section: ContentSection): Promise<void> => {
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
    console.error("Error updating content section:", error);
    throw error;
  }
};

export const createContentSection = async (section: Omit<ContentSection, 'id' | 'created_at' | 'updated_at'>): Promise<void> => {
  const { error } = await supabase
    .from('content_sections')
    .insert([{
      section_key: section.section_key,
      title: section.title,
      subtitle: section.subtitle,
      content: section.content
    }]);
  
  if (error) {
    console.error("Error creating content section:", error);
    throw error;
  }
};
