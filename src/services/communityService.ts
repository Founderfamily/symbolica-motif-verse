import { supabase } from '@/integrations/supabase/client';
import { GroupPost, PostComment, GroupMember, GroupInvitation, GroupNotification, GroupDiscovery, GroupSymbol } from '@/types/interest-groups';

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
    .select('*')
    .eq('group_id', groupId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  // Get user profiles separately
  const userIds = data?.map(post => post.user_id) || [];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username, full_name')
    .in('id', userIds);

  // Transform the data to match expected interface
  const transformedData = (data || []).map(post => {
    const profile = profiles?.find(p => p.id === post.user_id);
    return {
      ...post,
      user_profile: profile ? {
        username: profile.username,
        full_name: profile.full_name
      } : undefined
    };
  });

  return transformedData as GroupPost[];
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
      replies:post_comments!parent_comment_id(*)
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

  // Get all user IDs from comments and replies
  const allUserIds = new Set<string>();
  (data || []).forEach(comment => {
    allUserIds.add(comment.user_id);
    if (comment.replies && Array.isArray(comment.replies)) {
      comment.replies.forEach((reply: any) => allUserIds.add(reply.user_id));
    }
  });

  // Get user profiles separately
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username, full_name')
    .in('id', Array.from(allUserIds));

  // Transform the data to match expected interface
  const transformedData = (data || []).map(comment => {
    const profile = profiles?.find(p => p.id === comment.user_id);
    return {
      ...comment,
      user_profile: profile ? {
        username: profile.username,
        full_name: profile.full_name
      } : undefined,
      is_liked: userLikes.includes(comment.id),
      replies: comment.replies && Array.isArray(comment.replies) ? comment.replies.map((reply: any) => {
        const replyProfile = profiles?.find(p => p.id === reply.user_id);
        return {
          ...reply,
          user_profile: replyProfile ? {
            username: replyProfile.username,
            full_name: replyProfile.full_name
          } : undefined
        };
      }) : []
    };
  });

  return transformedData as PostComment[];
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
    .select('*')
    .eq('group_id', groupId);

  if (error) {
    throw error;
  }

  // Get user profiles separately
  const userIds = data?.map(member => member.user_id) || [];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username, full_name')
    .in('id', userIds);

  // Transform the data to match expected interface
  const transformedData = (data || []).map(member => {
    const profile = profiles?.find(p => p.id === member.user_id);
    return {
      ...member,
      profiles: profile ? {
        id: profile.id,
        username: profile.username,
        full_name: profile.full_name
      } : undefined
    };
  });

  return transformedData as GroupMember[];
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
      interest_groups(name, slug)
    `)
    .eq('group_id', groupId)
    .eq('invited_user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching group invitations:', error);
    throw error;
  }

  // Get inviter profiles separately
  const inviterIds = data?.map(invitation => invitation.invited_by) || [];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username, full_name')
    .in('id', inviterIds);

  // Transform the data to match expected interface
  const transformedData = (data || []).map(invitation => {
    const profile = profiles?.find(p => p.id === invitation.invited_by);
    return {
      ...invitation,
      group: invitation.interest_groups ? {
        name: invitation.interest_groups.name,
        slug: invitation.interest_groups.slug
      } : undefined,
      inviter_profile: profile ? {
        username: profile.username,
        full_name: profile.full_name
      } : undefined
    };
  });

  return transformedData as GroupInvitation[];
};

export const getUserInvitations = async (userId: string): Promise<GroupInvitation[]> => {
  const { data, error } = await supabase
    .from('group_invitations')
    .select(`
      *,
      interest_groups(name, slug)
    `)
    .eq('invited_user_id', userId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user invitations:', error);
    throw error;
  }

  // Get inviter profiles separately
  const inviterIds = data?.map(invitation => invitation.invited_by) || [];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username, full_name')
    .in('id', inviterIds);

  // Transform the data to match expected interface
  const transformedData = (data || []).map(invitation => {
    const profile = profiles?.find(p => p.id === invitation.invited_by);
    return {
      ...invitation,
      group: invitation.interest_groups ? {
        name: invitation.interest_groups.name,
        slug: invitation.interest_groups.slug
      } : undefined,
      inviter_profile: profile ? {
        username: profile.username,
        full_name: profile.full_name
      } : undefined
    };
  });

  return transformedData as GroupInvitation[];
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
    // Get the group_id from the invitation
    const { data: invitation } = await supabase
      .from('group_invitations')
      .select('group_id')
      .eq('id', invitationId)
      .single();

    if (invitation) {
      // Also add the user to the group members
      const { error: memberError } = await supabase
        .from('group_members')
        .insert([{ group_id: invitation.group_id, user_id: userId, role: 'member' }]);

      if (memberError) {
        console.error('Error adding user to group members:', memberError);
        throw memberError;
      }
    }
  }
};

// Alias for backward compatibility
export const respondToInvitation = respondToGroupInvitation;

export const getGroupNotifications = async (userId: string): Promise<GroupNotification[]> => {
  const { data, error } = await supabase
    .from('group_notifications')
    .select(`
      *,
      interest_groups(name, slug)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching group notifications:', error);
    throw error;
  }

  // Get creator profiles separately
  const creatorIds = data?.map(notification => notification.created_by).filter(Boolean) || [];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username, full_name')
    .in('id', creatorIds);

  // Transform the data to match expected interface
  const transformedData = (data || []).map(notification => {
    const profile = profiles?.find(p => p.id === notification.created_by);
    return {
      ...notification,
      group: notification.interest_groups ? {
        name: notification.interest_groups.name,
        slug: notification.interest_groups.slug
      } : undefined,
      creator_profile: profile ? {
        username: profile.username,
        full_name: profile.full_name
      } : undefined
    };
  });

  return transformedData as GroupNotification[];
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
    .select('*')
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

  // Get sharer profiles separately
  const sharerIds = data?.map(discovery => discovery.shared_by) || [];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username, full_name')
    .in('id', sharerIds);

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

      const profile = profiles?.find(p => p.id === discovery.shared_by);
      return {
        ...discovery,
        entity_preview,
        is_liked: userLikes.includes(discovery.id),
        sharer_profile: profile ? {
          username: profile.username,
          full_name: profile.full_name
        } : undefined
      } as GroupDiscovery;
    })
  );

  return discoveriesWithPreviews;
};

// Additional exports for missing functions
export const shareDiscovery = async (groupId: string, userId: string, entityType: string, entityId: string, title: string, description?: string): Promise<void> => {
  const { error } = await supabase
    .from('group_discoveries')
    .insert([{
      group_id: groupId,
      shared_by: userId,
      entity_type: entityType,
      entity_id: entityId,
      title,
      description
    }]);

  if (error) {
    throw error;
  }
};

export const searchUsersForInvitation = async (query: string): Promise<any[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, full_name')
    .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
    .limit(10);

  if (error) {
    console.error('Error searching users:', error);
    return [];
  }

  return data || [];
};

export const sendGroupInvitation = async (groupId: string, invitedBy: string, invitees: { email?: string; userId?: string; message?: string }[]): Promise<void> => {
  return inviteUsersToGroup(groupId, invitedBy, invitees);
};

// Alias for post comments
export const createComment = createPostComment;
export const likeComment = likePostComment;

export const getGroupSymbols = async (groupId: string): Promise<GroupSymbol[]> => {
  const { data, error } = await supabase
    .from('group_symbols')
    .select(`
      *,
      symbols (
        id,
        name,
        culture,
        period,
        description,
        medium,
        technique,
        function
      )
    `)
    .eq('group_id', groupId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  // Get user profiles separately
  const userIds = data?.map(gs => gs.added_by) || [];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username, full_name')
    .in('id', userIds);

  // Transform the data to match expected interface
  const transformedData = (data || []).map(groupSymbol => {
    const profile = profiles?.find(p => p.id === groupSymbol.added_by);
    return {
      ...groupSymbol,
      symbol: groupSymbol.symbols,
      added_by_profile: profile ? {
        username: profile.username,
        full_name: profile.full_name
      } : undefined
    };
  });

  return transformedData as GroupSymbol[];
};

export const addSymbolToGroup = async (groupId: string, symbolId: string, userId: string, notes?: string): Promise<void> => {
  const { error } = await supabase
    .from('group_symbols')
    .insert([{ 
      group_id: groupId, 
      symbol_id: symbolId, 
      added_by: userId,
      notes: notes || null
    }]);

  if (error) {
    throw error;
  }
};

export const removeSymbolFromGroup = async (groupSymbolId: string, userId: string): Promise<void> => {
  const { error } = await supabase
    .from('group_symbols')
    .delete()
    .eq('id', groupSymbolId)
    .eq('added_by', userId);

  if (error) {
    throw error;
  }
};

export const searchSymbolsForGroup = async (query: string): Promise<any[]> => {
  const { data, error } = await supabase
    .from('symbols')
    .select('id, name, culture, period, description')
    .or(`name.ilike.%${query}%,culture.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(10);

  if (error) {
    console.error('Error searching symbols:', error);
    return [];
  }

  return data || [];
};
