
import { supabase } from "@/integrations/supabase/client";

export interface Testimonial {
  id: string;
  name: string;
  role: Record<string, string>;
  quote: Record<string, string>;
  initials: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const getTestimonials = async (activeOnly: boolean = false): Promise<Testimonial[]> => {
  let query = supabase
    .from('testimonials')
    .select('*')
    .order('display_order');
    
  if (activeOnly) {
    query = query.eq('is_active', true);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching testimonials:", error);
    throw error;
  }
  
  return data || [];
};

export const getTestimonialById = async (id: string): Promise<Testimonial | null> => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching testimonial with id ${id}:`, error);
    return null;
  }
  
  return data;
};

export const updateTestimonial = async (testimonial: Testimonial): Promise<void> => {
  const { error } = await supabase
    .from('testimonials')
    .update({
      name: testimonial.name,
      role: testimonial.role,
      quote: testimonial.quote,
      initials: testimonial.initials,
      image_url: testimonial.image_url,
      display_order: testimonial.display_order,
      is_active: testimonial.is_active,
      updated_at: new Date().toISOString()
    })
    .eq('id', testimonial.id);
  
  if (error) {
    console.error("Error updating testimonial:", error);
    throw error;
  }
};

export const createTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>): Promise<void> => {
  const { error } = await supabase
    .from('testimonials')
    .insert([{
      name: testimonial.name,
      role: testimonial.role,
      quote: testimonial.quote,
      initials: testimonial.initials,
      image_url: testimonial.image_url,
      display_order: testimonial.display_order,
      is_active: testimonial.is_active
    }]);
  
  if (error) {
    console.error("Error creating testimonial:", error);
    throw error;
  }
};

export const deleteTestimonial = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting testimonial with id ${id}:`, error);
    throw error;
  }
};
