import { supabase } from '@/integrations/supabase/client';
import { GroupPost, PostComment, GroupMember, GroupInvitation, GroupNotification, GroupDiscovery } from '@/types/interest-groups';

export const checkGroupMembership = async (groupId: string, userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('group_members')
    .select('*')
    .eq('group_id', groupId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error checking group membership:', error);
    return false;
  }

  return data.length > 0;
};

export const joinGroup = async (groupId: string, userId: string): Promise<void> => {
  const { error } = await supabase
    .from('group_members')
    .insert([{ group_id: groupId, user_id: userId, role: 'member' }]);

  if (error) {
    throw error;
  }
};

export const leaveGroup = async (groupId: string, userId: string): Promise<void> => {
  const { error } = await supabase
    .from('group_members')
    .delete()
    .eq('group_id', groupId)
    .eq('user_id', userId);

  if (error) {
    throw error;
  }
};

export const getGroupPosts = async (groupId: string): Promise<GroupPost[]> => {
  const { data, error } = await supabase
    .from('group_posts')
    .select(`
      *,
      user_profile:profiles(username, full_name)
    `)
    .eq('group_id', groupId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
};

export const createGroupPost = async (groupId: string, userId: string, content: string): Promise<void> => {
  const { error } = await supabase
    .from('group_posts')
    .insert([{ group_id: groupId, user_id: userId, content: content }]);

  if (error) {
    throw error;
  }
};

export const likePost = async (postId: string, userId: string): Promise<void> => {
  // First, check if the user has already liked the post
  const { data: existingLike, error: likeCheckError } = await supabase
    .from('post_likes')
    .select('*')
    .eq('post_id', postId)
    .eq('user_id', userId);

  if (likeCheckError) {
    console.error('Error checking existing like:', likeCheckError);
    throw likeCheckError;
  }

  if (existingLike && existingLike.length > 0) {
    // User has already liked the post, so unlike it (delete the like)
    const { error: deleteError } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Error deleting like:', deleteError);
      throw deleteError;
    }
  } else {
    // User has not liked the post, so add a like
    const { error: insertError } = await supabase
      .from('post_likes')
      .insert([{ post_id: postId, user_id: userId }]);

    if (insertError) {
      console.error('Error inserting like:', insertError);
      throw insertError;
    }
  }

  // After liking/unliking, update the likes_count in the group_posts table
  const { data: likesData, error: countError } = await supabase
    .from('post_likes')
    .select('*')
    .eq('post_id', postId);

  if (countError) {
    console.error('Error fetching likes count:', countError);
    throw countError;
  }

  const likesCount = likesData.length;

  const { error: updateError } = await supabase
    .from('group_posts')
    .update({ likes_count: likesCount })
    .eq('id', postId);

  if (updateError) {
    console.error('Error updating likes count in group_posts:', updateError);
    throw updateError;
  }
};

export const getPostComments = async (postId: string, userId?: string): Promise<PostComment[]> => {
  const { data, error } = await supabase
    .from('post_comments')
    .select(`
      *,
      user_profile:profiles(username, full_name),
      replies:post_comments(
        *,
        user_profile:profiles(username, full_name)
      )
    `)
    .eq('post_id', postId)
    .is('parent_comment_id', null)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  // Get user likes if user is provided
  let userLikes: string[] = [];
  if (userId) {
    const { data: likesData } = await supabase
      .from('comment_likes')
      .select('comment_id')
      .eq('user_id', userId);
    
    userLikes = likesData?.map(like => like.comment_id) || [];
  }

  // Add is_liked property
  const commentsWithLikes = (data || []).map(comment => ({
    ...comment,
    is_liked: userLikes.includes(comment.id)
  }));

  return commentsWithLikes as PostComment[];
};

export const createPostComment = async (postId: string, userId: string, content: string, parentCommentId: string | null = null): Promise<void> => {
  const { error } = await supabase
    .from('post_comments')
    .insert([{ 
      post_id: postId, 
      user_id: userId, 
      content: content,
      parent_comment_id: parentCommentId
    }]);

  if (error) {
    throw error;
  }

  // After creating comment, update the comments_count in the group_posts table
  const { data: commentsData, error: countError } = await supabase
    .from('post_comments')
    .select('*')
    .eq('post_id', postId);

  if (countError) {
    console.error('Error fetching comments count:', countError);
    throw countError;
  }

  const commentsCount = commentsData.length;

  const { error: updateError } = await supabase
    .from('group_posts')
    .update({ comments_count: commentsCount })
    .eq('id', postId);

  if (updateError) {
    console.error('Error updating comments count in group_posts:', updateError);
    throw updateError;
  }
};

export const likePostComment = async (commentId: string, userId: string): Promise<void> => {
  // First, check if the user has already liked the comment
  const { data: existingLike, error: likeCheckError } = await supabase
    .from('comment_likes')
    .select('*')
    .eq('comment_id', commentId)
    .eq('user_id', userId);

  if (likeCheckError) {
    console.error('Error checking existing like:', likeCheckError);
    throw likeCheckError;
  }

  if (existingLike && existingLike.length > 0) {
    // User has already liked the comment, so unlike it (delete the like)
    const { error: deleteError } = await supabase
      .from('comment_likes')
      .delete()
      .eq('comment_id', commentId)
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Error deleting like:', deleteError);
      throw deleteError;
    }
  } else {
    // User has not liked the comment, so add a like
    const { error: insertError } = await supabase
      .from('comment_likes')
      .insert([{ comment_id: commentId, user_id: userId }]);

    if (insertError) {
      console.error('Error inserting like:', insertError);
      throw insertError;
    }
  }

  // After liking/unliking, update the likes_count in the post_comments table
  const { data: likesData, error: countError } = await supabase
    .from('comment_likes')
    .select('*')
    .eq('comment_id', commentId);

  if (countError) {
    console.error('Error fetching likes count:', countError);
    throw countError;
  }

  const likesCount = likesData.length;

  const { error: updateError } = await supabase
    .from('post_comments')
    .update({ likes_count: likesCount })
    .eq('id', commentId);

  if (updateError) {
    console.error('Error updating likes count in post_comments:', updateError);
    throw updateError;
  }
};

export const getGroupMembers = async (groupId: string): Promise<GroupMember[]> => {
  const { data, error } = await supabase
    .from('group_members')
    .select(`
      *,
      profiles(
        id,
        username,
        full_name
      )
    `)
    .eq('group_id', groupId);

  if (error) {
    throw error;
  }

  return data as GroupMember[];
};

export const inviteUsersToGroup = async (groupId: string, invitedBy: string, invitees: { email?: string; userId?: string; message?: string }[]): Promise<void> => {
  // Prepare invitations to insert
  const invitationsToInsert = invitees.map(invitee => ({
    group_id: groupId,
    invited_by: invitedBy,
    invited_user_id: invitee.userId || null,
    email: invitee.email || null,
    message: invitee.message || null,
    status: 'pending',
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Expires in 7 days
  }));

  const { error } = await supabase
    .from('group_invitations')
    .insert(invitationsToInsert);

  if (error) {
    console.error('Error inviting users to group:', error);
    throw error;
  }
};

export const getGroupInvitations = async (groupId: string, userId: string): Promise<GroupInvitation[]> => {
  const { data, error } = await supabase
    .from('group_invitations')
    .select(`
      *,
      group(name, slug),
      inviter_profile:profiles!invited_by(username, full_name)
    `)
    .eq('group_id', groupId)
    .eq('invited_user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching group invitations:', error);
    throw error;
  }

  return data as GroupInvitation[];
};

export const respondToGroupInvitation = async (invitationId: string, userId: string, status: 'accepted' | 'declined'): Promise<void> => {
  const { error } = await supabase
    .from('group_invitations')
    .update({ status, responded_at: new Date().toISOString() })
    .eq('id', invitationId)
    .eq('invited_user_id', userId);

  if (error) {
    console.error('Error responding to group invitation:', error);
    throw error;
  }

  if (status === 'accepted') {
    // Also add the user to the group members
    const { error: memberError } = await supabase
      .from('group_members')
      .insert([{ group_id: (await supabase.from('group_invitations').select('group_id').eq('id', invitationId).single()).data?.group_id, user_id: userId, role: 'member' }]);

    if (memberError) {
      console.error('Error adding user to group members:', memberError);
      throw memberError;
    }
  }
};

export const getGroupNotifications = async (userId: string): Promise<GroupNotification[]> => {
  const { data, error } = await supabase
    .from('group_notifications')
    .select(`
      *,
      group(name, slug),
      creator_profile:profiles!created_by(username, full_name)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching group notifications:', error);
    throw error;
  }

  return data as GroupNotification[];
};

export const markNotificationAsRead = async (notificationId: string, userId: string): Promise<void> => {
  const { error } = await supabase
    .from('group_notifications')
    .update({ read: true })
    .eq('id', notificationId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const getGroupDiscoveries = async (groupId: string, userId?: string): Promise<GroupDiscovery[]> => {
  let query = supabase
    .from('group_discoveries')
    .select(`
      *,
      sharer_profile:profiles!shared_by(username, full_name)
    `)
    .eq('group_id', groupId)
    .order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) throw error;

  // Get user likes if user is provided
  let userLikes: string[] = [];
  if (userId) {
    const { data: likesData } = await supabase
      .from('discovery_likes')
      .select('discovery_id')
      .eq('user_id', userId);
    
    userLikes = likesData?.map(like => like.discovery_id) || [];
  }

  // Fetch entity previews for each discovery
  const discoveriesWithPreviews = await Promise.all(
    (data || []).map(async (discovery) => {
      let entity_preview = null;
      
      try {
        switch (discovery.entity_type) {
          case 'symbol':
            const { data: symbolData } = await supabase
              .from('symbols')
              .select('name, description, culture, period')
              .eq('id', discovery.entity_id)
              .single();
            
            if (symbolData) {
              entity_preview = {
                name: symbolData.name,
                description: symbolData.description,
                culture: symbolData.culture,
                period: symbolData.period
              };
            }
            break;
            
          case 'collection':
            const { data: collectionData } = await supabase
              .from('collections')
              .select(`
                id,
                slug,
                collection_translations!inner(title, description)
              `)
              .eq('id', discovery.entity_id)
              .single();
            
            if (collectionData) {
              const translation = collectionData.collection_translations?.[0];
              entity_preview = {
                name: translation?.title || 'Untitled Collection',
                description: translation?.description
              };
            }
            break;
            
          case 'contribution':
            const { data: contributionData } = await supabase
              .from('user_contributions')
              .select('title, description, cultural_context, period')
              .eq('id', discovery.entity_id)
              .single();
            
            if (contributionData) {
              entity_preview = {
                name: contributionData.title,
                description: contributionData.description,
                culture: contributionData.cultural_context,
                period: contributionData.period
              };
            }
            break;
        }
      } catch (error) {
        console.error('Error fetching entity preview:', error);
      }

      return {
        ...discovery,
        entity_preview,
        is_liked: userLikes.includes(discovery.id)
      } as GroupDiscovery;
    })
  );

  return discoveriesWithPreviews;
};

export const getDiscoveryComments = async (discoveryId: string, userId?: string): Promise<GroupDiscovery[]> => {
  const { data, error } = await supabase
    .from('discovery_comments')
    .select(`
      *,
      user_profile:profiles(username, full_name),
      replies:discovery_comments(
        *,
        user_profile:profiles(username, full_name)
      )
    `)
    .eq('discovery_id', discoveryId)
    .is('parent_comment_id', null)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  // Get user likes if user is provided
  let userLikes: string[] = [];
  if (userId) {
    const { data: likesData } = await supabase
      .from('comment_likes')
      .select('comment_id')
      .eq('user_id', userId);
    
    userLikes = likesData?.map(like => like.comment_id) || [];
  }

  // Add is_liked property
  const commentsWithLikes = (data || []).map(comment => ({
    ...comment,
    is_liked: userLikes.includes(comment.id)
  }));

  return commentsWithLikes as GroupDiscovery[];
};

export const createDiscoveryComment = async (discoveryId: string, userId: string, content: string, parentCommentId: string | null = null): Promise<void> => {
  const { error } = await supabase
    .from('discovery_comments')
    .insert([{ 
      discovery_id: discoveryId, 
      user_id: userId, 
      content: content,
      parent_comment_id: parentCommentId
    }]);

  if (error) {
    throw error;
  }

  // After creating comment, update the comments_count in the group_discoveries table
  const { data: commentsData, error: countError } = await supabase
    .from('discovery_comments')
    .select('*')
    .eq('discovery_id', discoveryId);

  if (countError) {
    console.error('Error fetching comments count:', countError);
    throw countError;
  }

  const commentsCount = commentsData.length;

  const { error: updateError } = await supabase
    .from('group_discoveries')
    .update({ comments_count: commentsCount })
    .eq('id', discoveryId);

  if (updateError) {
    console.error('Error updating comments count in group_discoveries:', updateError);
    throw updateError;
  }
};

export const likeDiscoveryComment = async (commentId: string, userId: string): Promise<void> => {
  // First, check if the user has already liked the comment
  const { data: existingLike, error: likeCheckError } = await supabase
    .from('comment_likes')
    .select('*')
    .eq('comment_id', commentId)
    .eq('user_id', userId);

  if (likeCheckError) {
    console.error('Error checking existing like:', likeCheckError);
    throw likeCheckError;
  }

  if (existingLike && existingLike.length > 0) {
    // User has already liked the comment, so unlike it (delete the like)
    const { error: deleteError } = await supabase
      .from('comment_likes')
      .delete()
      .eq('comment_id', commentId)
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Error deleting like:', deleteError);
      throw deleteError;
    }
  } else {
    // User has not liked the comment, so add a like
    const { error: insertError } = await supabase
      .from('comment_likes')
      .insert([{ comment_id: commentId, user_id: userId }]);

    if (insertError) {
      console.error('Error inserting like:', insertError);
      throw insertError;
    }
  }

  // After liking/unliking, update the likes_count in the discovery_comments table
  const { data: likesData, error: countError } = await supabase
    .from('comment_likes')
    .select('*')
    .eq('comment_id', commentId);

  if (countError) {
    console.error('Error fetching likes count:', countError);
    throw countError;
  }

  const likesCount = likesData.length;

  const { error: updateError } = await supabase
    .from('discovery_comments')
    .update({ likes_count: likesCount })
    .eq('id', commentId);

  if (updateError) {
    console.error('Error updating likes count in discovery_comments:', updateError);
    throw updateError;
  }
};
