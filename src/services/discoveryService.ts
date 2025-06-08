
import { supabase } from '@/integrations/supabase/client';

export const likeDiscovery = async (discoveryId: string, userId: string): Promise<void> => {
  // First, check if the user has already liked the discovery
  const { data: existingLike, error: likeCheckError } = await supabase
    .from('discovery_likes')
    .select('*')
    .eq('discovery_id', discoveryId)
    .eq('user_id', userId);

  if (likeCheckError) {
    console.error('Error checking existing like:', likeCheckError);
    throw likeCheckError;
  }

  if (existingLike && existingLike.length > 0) {
    // User has already liked the discovery, so unlike it (delete the like)
    const { error: deleteError } = await supabase
      .from('discovery_likes')
      .delete()
      .eq('discovery_id', discoveryId)
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Error deleting like:', deleteError);
      throw deleteError;
    }
  } else {
    // User has not liked the discovery, so add a like
    const { error: insertError } = await supabase
      .from('discovery_likes')
      .insert([{ discovery_id: discoveryId, user_id: userId }]);

    if (insertError) {
      console.error('Error inserting like:', insertError);
      throw insertError;
    }
  }

  // After liking/unliking, update the likes_count in the group_discoveries table
  const { data: likesData, error: countError } = await supabase
    .from('discovery_likes')
    .select('*')
    .eq('discovery_id', discoveryId);

  if (countError) {
    console.error('Error fetching likes count:', countError);
    throw countError;
  }

  const likesCount = likesData.length;

  const { error: updateError } = await supabase
    .from('group_discoveries')
    .update({ likes_count: likesCount })
    .eq('id', discoveryId);

  if (updateError) {
    console.error('Error updating likes count in group_discoveries:', updateError);
    throw updateError;
  }
};

export const getDiscoveryComments = async (discoveryId: string, userId?: string) => {
  const { data, error } = await supabase
    .from('discovery_comments')
    .select(`
      *,
      user_profile:profiles!discovery_comments_user_id_fkey(username, full_name),
      replies:discovery_comments!parent_comment_id(
        *,
        user_profile:profiles!discovery_comments_user_id_fkey(username, full_name)
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
      .from('discovery_comment_likes')
      .select('comment_id')
      .eq('user_id', userId);
    
    userLikes = likesData?.map(like => like.comment_id) || [];
  }

  // Add is_liked property
  const commentsWithLikes = (data || []).map(comment => ({
    ...comment,
    is_liked: userLikes.includes(comment.id)
  }));

  return commentsWithLikes;
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
    .from('discovery_comment_likes')
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
      .from('discovery_comment_likes')
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
      .from('discovery_comment_likes')
      .insert([{ comment_id: commentId, user_id: userId }]);

    if (insertError) {
      console.error('Error inserting like:', insertError);
      throw insertError;
    }
  }

  // After liking/unliking, update the likes_count in the discovery_comments table
  const { data: likesData, error: countError } = await supabase
    .from('discovery_comment_likes')
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
