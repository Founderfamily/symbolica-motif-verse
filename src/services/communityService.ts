
import { supabase } from '@/integrations/supabase/client';
import { GroupPost, GroupMember } from '@/types/interest-groups';

/**
 * Join a group - now with proper RLS handling
 */
export const joinGroup = async (groupId: string, userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('group_members')
      .insert({
        group_id: groupId,
        user_id: userId,
        role: 'member'
      });

    if (error) {
      console.error('Error joining group:', error);
      throw new Error(`Failed to join group: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in joinGroup service:', error);
    throw error;
  }
};

/**
 * Leave a group - now with proper RLS handling
 */
export const leaveGroup = async (groupId: string, userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error leaving group:', error);
      throw new Error(`Failed to leave group: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in leaveGroup service:', error);
    throw error;
  }
};

/**
 * Check if user is a member of a group
 */
export const checkGroupMembership = async (groupId: string, userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', groupId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error checking membership:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in checkGroupMembership service:', error);
    return false;
  }
};

/**
 * Get group posts with user profiles - respects RLS policies
 */
export const getGroupPosts = async (groupId: string): Promise<GroupPost[]> => {
  try {
    // First get posts
    const { data: posts, error: postsError } = await supabase
      .from('group_posts')
      .select('*')
      .eq('group_id', groupId)
      .order('created_at', { ascending: false });

    if (postsError) {
      console.error('Error fetching group posts:', postsError);
      return [];
    }

    if (!posts || posts.length === 0) return [];

    // Get unique user IDs
    const userIds = [...new Set(posts.map(post => post.user_id))];

    // Get profiles for these users
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, full_name')
      .in('id', userIds);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      // Return posts without profile info if profiles fetch fails
      return posts.map(post => ({
        ...post,
        user_profile: {
          username: 'Unknown',
          full_name: 'Unknown User'
        }
      }));
    }

    // Map profiles to posts
    return posts.map(post => {
      const profile = profiles?.find(p => p.id === post.user_id);
      return {
        ...post,
        user_profile: profile ? {
          username: profile.username || 'Unknown',
          full_name: profile.full_name || 'Unknown User'
        } : {
          username: 'Unknown',
          full_name: 'Unknown User'
        }
      };
    });
  } catch (error) {
    console.error('Error in getGroupPosts service:', error);
    return [];
  }
};

/**
 * Create a new group post - respects RLS policies
 */
export const createGroupPost = async (groupId: string, userId: string, content: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('group_posts')
      .insert({
        group_id: groupId,
        user_id: userId,
        content: content.trim()
      });

    if (error) {
      console.error('Error creating group post:', error);
      throw new Error(`Failed to create post: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in createGroupPost service:', error);
    throw error;
  }
};

/**
 * Like/unlike a post - respects RLS policies
 */
export const likePost = async (postId: string, userId: string): Promise<void> => {
  try {
    // Check if user already liked the post
    const { data: existingLike, error: checkError } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing like:', checkError);
      throw new Error(`Failed to check like status: ${checkError.message}`);
    }

    if (existingLike) {
      // Unlike the post
      const { error: deleteError } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);

      if (deleteError) {
        console.error('Error removing like:', deleteError);
        throw new Error(`Failed to unlike post: ${deleteError.message}`);
      }
    } else {
      // Like the post
      const { error: insertError } = await supabase
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: userId
        });

      if (insertError) {
        console.error('Error adding like:', insertError);
        throw new Error(`Failed to like post: ${insertError.message}`);
      }
    }
  } catch (error) {
    console.error('Error in likePost service:', error);
    throw error;
  }
};

/**
 * Get group members with profiles - respects RLS policies
 */
export const getGroupMembers = async (groupId: string): Promise<GroupMember[]> => {
  try {
    // First get group members
    const { data: members, error: membersError } = await supabase
      .from('group_members')
      .select('*')
      .eq('group_id', groupId)
      .order('joined_at', { ascending: false });

    if (membersError) {
      console.error('Error fetching group members:', membersError);
      return [];
    }

    if (!members || members.length === 0) return [];

    // Get unique user IDs
    const userIds = [...new Set(members.map(member => member.user_id))];

    // Get profiles for these users
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, full_name')
      .in('id', userIds);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      // Return members without profile info if profiles fetch fails
      return members.map(member => ({
        ...member,
        role: member.role as 'member' | 'admin' | 'moderator',
        profiles: {
          id: member.user_id,
          username: 'Unknown',
          full_name: 'Unknown User'
        }
      }));
    }

    // Map profiles to members
    return members.map(member => {
      const profile = profiles?.find(p => p.id === member.user_id);
      return {
        ...member,
        role: member.role as 'member' | 'admin' | 'moderator',
        profiles: profile ? {
          id: profile.id,
          username: profile.username || 'Unknown',
          full_name: profile.full_name || 'Unknown User'
        } : {
          id: member.user_id,
          username: 'Unknown',
          full_name: 'Unknown User'
        }
      };
    });
  } catch (error) {
    console.error('Error in getGroupMembers service:', error);
    return [];
  }
};
