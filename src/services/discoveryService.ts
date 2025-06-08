
import { supabase } from '@/integrations/supabase/client';
import { EntityPreview } from '@/types/interest-groups';

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
      profiles!discovery_comments_user_id_fkey(username, full_name),
      replies:discovery_comments!discovery_comments_parent_comment_id_fkey(
        *,
        profiles!discovery_comments_user_id_fkey(username, full_name)
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

  // Transform the data to match expected interface
  const transformedData = (data || []).map(comment => ({
    ...comment,
    user_profile: comment.profiles ? {
      username: comment.profiles.username,
      full_name: comment.profiles.full_name
    } : undefined,
    is_liked: userLikes.includes(comment.id),
    replies: comment.replies?.map((reply: any) => ({
      ...reply,
      user_profile: reply.profiles ? {
        username: reply.profiles.username,
        full_name: reply.profiles.full_name
      } : undefined
    }))
  }));

  return transformedData;
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

export const validateAndPreviewEntity = async (entityType: string, entityId: string): Promise<EntityPreview | null> => {
  try {
    let preview: EntityPreview | null = null;
    
    switch (entityType) {
      case 'symbol':
        const { data: symbolData } = await supabase
          .from('symbols')
          .select('id, name, description, culture, period')
          .eq('id', entityId)
          .single();
        
        if (symbolData) {
          preview = {
            id: symbolData.id,
            name: symbolData.name,
            type: 'symbol',
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
          .eq('id', entityId)
          .single();
        
        if (collectionData) {
          const translation = collectionData.collection_translations?.[0];
          preview = {
            id: collectionData.id,
            name: translation?.title || 'Untitled Collection',
            type: 'collection',
            description: translation?.description
          };
        }
        break;
        
      case 'contribution':
        const { data: contributionData } = await supabase
          .from('user_contributions')
          .select('id, title, description, cultural_context, period')
          .eq('id', entityId)
          .single();
        
        if (contributionData) {
          preview = {
            id: contributionData.id,
            name: contributionData.title,
            type: 'contribution',
            description: contributionData.description,
            culture: contributionData.cultural_context,
            period: contributionData.period
          };
        }
        break;
    }
    
    return preview;
  } catch (error) {
    console.error('Error validating entity:', error);
    return null;
  }
};

export const searchEntities = async (query: string, entityType: string): Promise<EntityPreview[]> => {
  const results: EntityPreview[] = [];
  
  try {
    switch (entityType) {
      case 'symbol':
        const { data: symbols } = await supabase
          .from('symbols')
          .select('id, name, description, culture, period')
          .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
          .limit(10);
        
        if (symbols) {
          results.push(...symbols.map(symbol => ({
            id: symbol.id,
            name: symbol.name,
            type: 'symbol' as const,
            description: symbol.description,
            culture: symbol.culture,
            period: symbol.period
          })));
        }
        break;
        
      case 'collection':
        const { data: collections } = await supabase
          .from('collections')
          .select(`
            id,
            slug,
            collection_translations!inner(title, description)
          `)
          .limit(10);
        
        if (collections) {
          const filtered = collections.filter(collection => {
            const translation = collection.collection_translations?.[0];
            const title = translation?.title || '';
            const description = translation?.description || '';
            return title.toLowerCase().includes(query.toLowerCase()) || 
                   description.toLowerCase().includes(query.toLowerCase());
          });
          
          results.push(...filtered.map(collection => {
            const translation = collection.collection_translations?.[0];
            return {
              id: collection.id,
              name: translation?.title || 'Untitled Collection',
              type: 'collection' as const,
              description: translation?.description
            };
          }));
        }
        break;
        
      case 'contribution':
        const { data: contributions } = await supabase
          .from('user_contributions')
          .select('id, title, description, cultural_context, period')
          .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
          .eq('status', 'approved')
          .limit(10);
        
        if (contributions) {
          results.push(...contributions.map(contribution => ({
            id: contribution.id,
            name: contribution.title,
            type: 'contribution' as const,
            description: contribution.description,
            culture: contribution.cultural_context,
            period: contribution.period
          })));
        }
        break;
    }
    
    return results;
  } catch (error) {
    console.error('Error searching entities:', error);
    return [];
  }
};
