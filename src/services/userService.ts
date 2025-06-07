import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth';

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    // Get additional stats
    const [followersResult, followingResult, contributionsResult] = await Promise.all([
      supabase.from('user_follows').select('id').eq('followed_id', userId),
      supabase.from('user_follows').select('id').eq('follower_id', userId),
      supabase.from('user_contributions').select('id').eq('user_id', userId)
    ]);

    return {
      ...data,
      followers_count: followersResult.data?.length || 0,
      following_count: followingResult.data?.length || 0,
      contributions_count: contributionsResult.data?.length || 0
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const followUser = async (followerId: string, followedId: string) => {
  try {
    const { error } = await supabase
      .from('user_follows')
      .insert({
        follower_id: followerId,
        followed_id: followedId
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error following user:', error);
    throw error;
  }
};

export const unfollowUser = async (followerId: string, followedId: string) => {
  try {
    const { error } = await supabase
      .from('user_follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('followed_id', followedId);

    if (error) throw error;
  } catch (error) {
    console.error('Error unfollowing user:', error);
    throw error;
  }
};

export const checkFollowStatus = async (followerId: string, followedId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_follows')
      .select('id')
      .eq('follower_id', followerId)
      .eq('followed_id', followedId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  } catch (error) {
    console.error('Error checking follow status:', error);
    return false;
  }
};

export const getTopContributors = async (limit: number = 10) => {
  try {
    const { data, error } = await supabase
      .rpc('get_top_contributors', { p_limit: limit });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching top contributors:', error);
    return [];
  }
};
