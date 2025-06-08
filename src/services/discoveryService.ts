
import { supabase } from '@/integrations/supabase/client';
import { GroupDiscovery, DiscoveryComment, EntityPreview } from '@/types/interest-groups';

/**
 * Like/unlike a discovery
 */
export const likeDiscovery = async (discoveryId: string, userId: string): Promise<void> => {
  try {
    const { data: existingLike, error: checkError } = await supabase
      .from('discovery_likes')
      .select('id')
      .eq('discovery_id', discoveryId)
      .eq('user_id', userId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing discovery like:', checkError);
      throw new Error(`Failed to check like status: ${checkError.message}`);
    }

    if (existingLike) {
      const { error: deleteError } = await supabase
        .from('discovery_likes')
        .delete()
        .eq('discovery_id', discoveryId)
        .eq('user_id', userId);

      if (deleteError) {
        console.error('Error removing discovery like:', deleteError);
        throw new Error(`Failed to unlike discovery: ${deleteError.message}`);
      }
    } else {
      const { error: insertError } = await supabase
        .from('discovery_likes')
        .insert({
          discovery_id: discoveryId,
          user_id: userId
        });

      if (insertError) {
        console.error('Error adding discovery like:', insertError);
        throw new Error(`Failed to like discovery: ${insertError.message}`);
      }
    }
  } catch (error) {
    console.error('Error in likeDiscovery service:', error);
    throw error;
  }
};

/**
 * Get discovery comments with user profiles and like status
 */
export const getDiscoveryComments = async (discoveryId: string, userId?: string): Promise<DiscoveryComment[]> => {
  try {
    const { data: comments, error: commentsError } = await supabase
      .from('discovery_comments')
      .select('id, discovery_id, user_id, parent_comment_id, content, likes_count, created_at, updated_at, translations')
      .eq('discovery_id', discoveryId)
      .order('created_at', { ascending: true });

    if (commentsError) {
      console.error('Error fetching discovery comments:', commentsError);
      return [];
    }

    if (!comments || comments.length === 0) return [];

    const userIds = [...new Set(comments.map(comment => comment.user_id))];

    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, full_name')
      .in('id', userIds);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
    }

    // Get like status for each comment if user is provided
    let userLikes: string[] = [];
    if (userId) {
      const commentIds = comments.map(c => c.id);
      const { data: likes } = await supabase
        .from('discovery_comment_likes')
        .select('comment_id')
        .eq('user_id', userId)
        .in('comment_id', commentIds);
      
      userLikes = likes?.map(l => l.comment_id) || [];
    }

    const commentsWithProfiles = comments.map(comment => ({
      ...comment,
      user_profile: profiles?.find(p => p.id === comment.user_id) ? {
        username: profiles.find(p => p.id === comment.user_id)?.username || 'Unknown',
        full_name: profiles.find(p => p.id === comment.user_id)?.full_name || 'Unknown User'
      } : {
        username: 'Unknown',
        full_name: 'Unknown User'
      },
      is_liked: userLikes.includes(comment.id)
    } as DiscoveryComment));

    const topLevelComments = commentsWithProfiles.filter(comment => !comment.parent_comment_id);
    const childComments = commentsWithProfiles.filter(comment => comment.parent_comment_id);

    return topLevelComments.map(comment => ({
      ...comment,
      replies: childComments.filter(child => child.parent_comment_id === comment.id)
    }));
  } catch (error) {
    console.error('Error in getDiscoveryComments service:', error);
    return [];
  }
};

/**
 * Create a comment on a discovery
 */
export const createDiscoveryComment = async (discoveryId: string, userId: string, content: string, parentCommentId?: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('discovery_comments')
      .insert({
        discovery_id: discoveryId,
        user_id: userId,
        content: content.trim(),
        parent_comment_id: parentCommentId || null
      });

    if (error) {
      console.error('Error creating discovery comment:', error);
      throw new Error(`Failed to create comment: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in createDiscoveryComment service:', error);
    throw error;
  }
};

/**
 * Like/unlike a discovery comment
 */
export const likeDiscoveryComment = async (commentId: string, userId: string): Promise<void> => {
  try {
    const { data: existingLike, error: checkError } = await supabase
      .from('discovery_comment_likes')
      .select('id')
      .eq('comment_id', commentId)
      .eq('user_id', userId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing discovery comment like:', checkError);
      throw new Error(`Failed to check like status: ${checkError.message}`);
    }

    if (existingLike) {
      const { error: deleteError } = await supabase
        .from('discovery_comment_likes')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', userId);

      if (deleteError) {
        console.error('Error removing discovery comment like:', deleteError);
        throw new Error(`Failed to unlike comment: ${deleteError.message}`);
      }
    } else {
      const { error: insertError } = await supabase
        .from('discovery_comment_likes')
        .insert({
          comment_id: commentId,
          user_id: userId
        });

      if (insertError) {
        console.error('Error adding discovery comment like:', insertError);
        throw new Error(`Failed to like comment: ${insertError.message}`);
      }
    }
  } catch (error) {
    console.error('Error in likeDiscoveryComment service:', error);
    throw error;
  }
};

/**
 * Validate if an entity exists and get preview data
 */
export const validateAndPreviewEntity = async (entityType: 'symbol' | 'collection' | 'contribution', entityId: string): Promise<EntityPreview | null> => {
  try {
    let tableName = '';
    let selectFields = 'id, name';
    
    switch (entityType) {
      case 'symbol':
        tableName = 'symbols';
        selectFields = 'id, name, description, culture, period';
        break;
      case 'collection':
        tableName = 'collections';
        selectFields = 'id, slug as name, created_at';
        break;
      case 'contribution':
        tableName = 'user_contributions';
        selectFields = 'id, title as name, description, cultural_context, period';
        break;
      default:
        throw new Error('Invalid entity type');
    }

    const { data, error } = await supabase
      .from(tableName)
      .select(selectFields)
      .eq('id', entityId)
      .maybeSingle();

    if (error) {
      console.error(`Error validating ${entityType}:`, error);
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      name: data.name || data.title || `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} ${data.id.slice(0, 8)}`,
      type: entityType,
      description: data.description || data.cultural_context || undefined,
      culture: data.culture || undefined,
      period: data.period || undefined,
      image_url: undefined // Could be enhanced to fetch actual images
    };
  } catch (error) {
    console.error('Error in validateAndPreviewEntity service:', error);
    return null;
  }
};

/**
 * Search entities by name or ID for autocomplete
 */
export const searchEntities = async (query: string, entityType: 'symbol' | 'collection' | 'contribution', limit: number = 10): Promise<EntityPreview[]> => {
  try {
    let tableName = '';
    let selectFields = 'id, name';
    let nameField = 'name';
    
    switch (entityType) {
      case 'symbol':
        tableName = 'symbols';
        selectFields = 'id, name, description, culture';
        nameField = 'name';
        break;
      case 'collection':
        tableName = 'collections';
        selectFields = 'id, slug';
        nameField = 'slug';
        break;
      case 'contribution':
        tableName = 'user_contributions';
        selectFields = 'id, title, description';
        nameField = 'title';
        break;
      default:
        return [];
    }

    const { data, error } = await supabase
      .from(tableName)
      .select(selectFields)
      .or(`${nameField}.ilike.%${query}%,id.ilike.%${query}%`)
      .limit(limit);

    if (error) {
      console.error(`Error searching ${entityType}s:`, error);
      return [];
    }

    return (data || []).map(item => ({
      id: item.id,
      name: item.name || item.slug || item.title || `${entityType} ${item.id.slice(0, 8)}`,
      type: entityType,
      description: item.description || undefined,
      culture: item.culture || undefined
    }));
  } catch (error) {
    console.error('Error in searchEntities service:', error);
    return [];
  }
};
