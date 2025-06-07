
import { supabase } from '@/integrations/supabase/client';
import { GroupPost, GroupMember, PostComment, GroupInvitation, GroupNotification, GroupDiscovery, GroupJoinRequest } from '@/types/interest-groups';

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

/**
 * Get post comments with user profiles
 */
export const getPostComments = async (postId: string): Promise<PostComment[]> => {
  try {
    const { data: comments, error: commentsError } = await supabase
      .from('post_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (commentsError) {
      console.error('Error fetching comments:', commentsError);
      return [];
    }

    if (!comments || comments.length === 0) return [];

    // Get unique user IDs
    const userIds = [...new Set(comments.map(comment => comment.user_id))];

    // Get profiles for these users
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, full_name')
      .in('id', userIds);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
    }

    // Map profiles to comments and organize by parent/child
    const commentsWithProfiles = comments.map(comment => {
      const profile = profiles?.find(p => p.id === comment.user_id);
      return {
        ...comment,
        user_profile: profile ? {
          username: profile.username || 'Unknown',
          full_name: profile.full_name || 'Unknown User'
        } : {
          username: 'Unknown',
          full_name: 'Unknown User'
        }
      };
    });

    // Organize comments in a tree structure
    const topLevelComments = commentsWithProfiles.filter(comment => !comment.parent_comment_id);
    const childComments = commentsWithProfiles.filter(comment => comment.parent_comment_id);

    return topLevelComments.map(comment => ({
      ...comment,
      replies: childComments.filter(child => child.parent_comment_id === comment.id)
    }));
  } catch (error) {
    console.error('Error in getPostComments service:', error);
    return [];
  }
};

/**
 * Create a comment on a post
 */
export const createComment = async (postId: string, userId: string, content: string, parentCommentId?: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('post_comments')
      .insert({
        post_id: postId,
        user_id: userId,
        content: content.trim(),
        parent_comment_id: parentCommentId || null
      });

    if (error) {
      console.error('Error creating comment:', error);
      throw new Error(`Failed to create comment: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in createComment service:', error);
    throw error;
  }
};

/**
 * Like/unlike a comment
 */
export const likeComment = async (commentId: string, userId: string): Promise<void> => {
  try {
    // Check if user already liked the comment
    const { data: existingLike, error: checkError } = await supabase
      .from('comment_likes')
      .select('id')
      .eq('comment_id', commentId)
      .eq('user_id', userId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing comment like:', checkError);
      throw new Error(`Failed to check like status: ${checkError.message}`);
    }

    if (existingLike) {
      // Unlike the comment
      const { error: deleteError } = await supabase
        .from('comment_likes')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', userId);

      if (deleteError) {
        console.error('Error removing comment like:', deleteError);
        throw new Error(`Failed to unlike comment: ${deleteError.message}`);
      }
    } else {
      // Like the comment
      const { error: insertError } = await supabase
        .from('comment_likes')
        .insert({
          comment_id: commentId,
          user_id: userId
        });

      if (insertError) {
        console.error('Error adding comment like:', insertError);
        throw new Error(`Failed to like comment: ${insertError.message}`);
      }
    }
  } catch (error) {
    console.error('Error in likeComment service:', error);
    throw error;
  }
};

/**
 * Send a group invitation
 */
export const sendGroupInvitation = async (groupId: string, invitedBy: string, invitedUserId?: string, email?: string, message?: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('group_invitations')
      .insert({
        group_id: groupId,
        invited_by: invitedBy,
        invited_user_id: invitedUserId || null,
        email: email || null,
        message: message || null
      });

    if (error) {
      console.error('Error sending invitation:', error);
      throw new Error(`Failed to send invitation: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in sendGroupInvitation service:', error);
    throw error;
  }
};

/**
 * Get user notifications for groups
 */
export const getGroupNotifications = async (userId: string): Promise<GroupNotification[]> => {
  try {
    const { data: notifications, error } = await supabase
      .from('group_notifications')
      .select(`
        *,
        interest_groups (name, slug)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }

    return notifications || [];
  } catch (error) {
    console.error('Error in getGroupNotifications service:', error);
    return [];
  }
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('group_notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
      throw new Error(`Failed to mark notification as read: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in markNotificationAsRead service:', error);
    throw error;
  }
};

/**
 * Share a discovery in a group
 */
export const shareDiscovery = async (groupId: string, sharedBy: string, entityType: 'symbol' | 'collection' | 'contribution', entityId: string, title: string, description?: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('group_discoveries')
      .insert({
        group_id: groupId,
        shared_by: sharedBy,
        entity_type: entityType,
        entity_id: entityId,
        title: title,
        description: description || null
      });

    if (error) {
      console.error('Error sharing discovery:', error);
      throw new Error(`Failed to share discovery: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in shareDiscovery service:', error);
    throw error;
  }
};

/**
 * Get group discoveries
 */
export const getGroupDiscoveries = async (groupId: string): Promise<GroupDiscovery[]> => {
  try {
    const { data: discoveries, error } = await supabase
      .from('group_discoveries')
      .select('*')
      .eq('group_id', groupId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching discoveries:', error);
      return [];
    }

    if (!discoveries || discoveries.length === 0) return [];

    // Get unique user IDs
    const userIds = [...new Set(discoveries.map(discovery => discovery.shared_by))];

    // Get profiles for these users
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, full_name')
      .in('id', userIds);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
    }

    // Map profiles to discoveries
    return discoveries.map(discovery => {
      const profile = profiles?.find(p => p.id === discovery.shared_by);
      return {
        ...discovery,
        sharer_profile: profile ? {
          username: profile.username || 'Unknown',
          full_name: profile.full_name || 'Unknown User'
        } : {
          username: 'Unknown',
          full_name: 'Unknown User'
        }
      };
    });
  } catch (error) {
    console.error('Error in getGroupDiscoveries service:', error);
    return [];
  }
};
