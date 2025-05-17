
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface InterestGroup {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  banner_image: string | null;
  theme_color: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  is_public: boolean;
  translations: {
    en?: {
      name?: string;
      description?: string;
    };
    fr?: {
      name?: string;
      description?: string;
    };
  } | null;
  members_count: number;
  discoveries_count: number;
}

export async function getInterestGroups(): Promise<InterestGroup[]> {
  try {
    const { data, error } = await supabase
      .from('interest_groups')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching interest groups:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch interest groups:', error);
    throw error;
  }
}

export async function getInterestGroupBySlug(slug: string): Promise<InterestGroup | null> {
  try {
    const { data, error } = await supabase
      .from('interest_groups')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Not found
        return null;
      }
      console.error('Error fetching interest group:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch interest group:', error);
    throw error;
  }
}

export async function createInterestGroup(group: Partial<InterestGroup>): Promise<InterestGroup> {
  try {
    // Generate a slug from name (lowercase, hyphens instead of spaces)
    const slug = group.name?.toLowerCase().replace(/\s+/g, '-') || '';
    
    const { data, error } = await supabase
      .from('interest_groups')
      .insert({ 
        ...group, 
        slug,
        created_by: (await supabase.auth.getUser()).data.user?.id
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating interest group:', error);
      throw error;
    }

    toast.success('Group created successfully');
    return data;
  } catch (error: any) {
    console.error('Failed to create interest group:', error);
    toast.error(error.message || 'Failed to create group');
    throw error;
  }
}

export async function updateInterestGroup(id: string, updates: Partial<InterestGroup>): Promise<InterestGroup> {
  try {
    const { data, error } = await supabase
      .from('interest_groups')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating interest group:', error);
      throw error;
    }

    toast.success('Group updated successfully');
    return data;
  } catch (error: any) {
    console.error('Failed to update interest group:', error);
    toast.error(error.message || 'Failed to update group');
    throw error;
  }
}

export async function joinGroup(groupId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('group_members')
      .insert({
        group_id: groupId,
        user_id: (await supabase.auth.getUser()).data.user?.id
      });

    if (error) {
      console.error('Error joining group:', error);
      throw error;
    }

    toast.success('Joined group successfully');
  } catch (error: any) {
    console.error('Failed to join group:', error);
    toast.error(error.message || 'Failed to join group');
    throw error;
  }
}

export async function leaveGroup(groupId: string): Promise<void> {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', user?.id);

    if (error) {
      console.error('Error leaving group:', error);
      throw error;
    }

    toast.success('Left group successfully');
  } catch (error: any) {
    console.error('Failed to leave group:', error);
    toast.error(error.message || 'Failed to leave group');
    throw error;
  }
}

export async function isGroupMember(groupId: string): Promise<boolean> {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return false;
    
    const { data, error } = await supabase
      .from('group_members')
      .select('*')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // Not found is not an error
      console.error('Error checking group membership:', error);
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error('Failed to check group membership:', error);
    return false;
  }
}

export async function getGroupMembers(groupId: string) {
  try {
    const { data, error } = await supabase
      .from('group_members')
      .select(`
        *,
        profiles:user_id(id, username, full_name)
      `)
      .eq('group_id', groupId);

    if (error) {
      console.error('Error fetching group members:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch group members:', error);
    throw error;
  }
}
