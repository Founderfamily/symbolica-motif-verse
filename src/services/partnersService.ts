import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  description: Record<string, string> | null;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const getPartners = async (activeOnly: boolean = false): Promise<Partner[]> => {
  let query = supabase
    .from('partners')
    .select('*')
    .order('display_order');
    
  if (activeOnly) {
    query = query.eq('is_active', true);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching partners:", error);
    throw error;
  }
  
  return (data || []).map(item => ({
    ...item,
    description: item.description as Record<string, string> | null
  }));
};

export const getPartnerById = async (id: string): Promise<Partner | null> => {
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching partner with id ${id}:`, error);
    return null;
  }
  
  return data ? {
    ...data,
    description: data.description as Record<string, string> | null
  } : null;
};

export const updatePartner = async (partner: Partner): Promise<void> => {
  const { error } = await supabase
    .from('partners')
    .update({
      name: partner.name,
      logo_url: partner.logo_url,
      website_url: partner.website_url,
      description: partner.description,
      display_order: partner.display_order,
      is_active: partner.is_active,
      updated_at: new Date().toISOString()
    })
    .eq('id', partner.id);
  
  if (error) {
    console.error("Error updating partner:", error);
    throw error;
  }
};

export const createPartner = async (partner: Omit<Partner, 'id' | 'created_at' | 'updated_at'>): Promise<void> => {
  const { error } = await supabase
    .from('partners')
    .insert([{
      name: partner.name,
      logo_url: partner.logo_url,
      website_url: partner.website_url,
      description: partner.description,
      display_order: partner.display_order,
      is_active: partner.is_active
    }]);
  
  if (error) {
    console.error("Error creating partner:", error);
    throw error;
  }
};

export const deletePartner = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('partners')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting partner with id ${id}:`, error);
    throw error;
  }
};
