
import { supabase } from '@/integrations/supabase/client';
import { InterestGroup, GroupPost, GroupMember } from '@/types/interest-groups';

export const joinGroup = async (groupId: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('group_members')
      .insert({
        group_id: groupId,
        user_id: userId,
        role: 'member'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error joining group:', error);
    throw error;
  }
};

export const leaveGroup = async (groupId: string, userId: string) => {
  try {
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error leaving group:', error);
    throw error;
  }
};

export const checkGroupMembership = async (groupId: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', groupId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  } catch (error) {
    console.error('Error checking membership:', error);
    return false;
  }
};

export const getGroupPosts = async (groupId: string) => {
  try {
    const { data, error } = await supabase
      .from('group_posts')
      .select(`
        *,
        profiles!user_id (
          username,
          full_name
        )
      `)
      .eq('group_id', groupId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching group posts:', error);
    return [];
  }
};

export const createGroupPost = async (groupId: string, userId: string, content: string) => {
  try {
    const { data, error } = await supabase
      .from('group_posts')
      .insert({
        group_id: groupId,
        user_id: userId,
        content: content
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const likePost = async (postId: string, userId: string) => {
  try {
    // Check if already liked
    const { data: existingLike } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      // Unlike
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);

      if (error) throw error;
    } else {
      // Like
      const { error } = await supabase
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: userId
        });

      if (error) throw error;
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};

export const getGroupMembers = async (groupId: string) => {
  try {
    const { data, error } = await supabase
      .from('group_members')
      .select(`
        *,
        profiles!user_id (
          username,
          full_name
        )
      `)
      .eq('group_id', groupId)
      .order('joined_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching group members:', error);
    return [];
  }
};
