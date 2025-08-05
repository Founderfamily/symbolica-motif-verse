import { supabase } from '@/integrations/supabase/client';

export interface ArchiveContribution {
  id: string;
  archive_id: string;
  user_id: string;
  contribution_type: string;
  title?: string;
  description?: string;
  image_url?: string;
  metadata: any;
  status: string;
  reviewed_by?: string;
  reviewed_at?: string;
  votes_count: number;
  score: number;
  created_at: string;
  updated_at: string;
}

export interface ContributionVote {
  id: string;
  contribution_id: string;
  user_id: string;
  vote_type: string;
  created_at: string;
}

export const archiveContributionService = {
  // Get contributions for a specific archive
  async getArchiveContributions(archiveId: string): Promise<ArchiveContribution[]> {
    const { data, error } = await supabase
      .from('archive_contributions')
      .select('*')
      .eq('archive_id', archiveId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Create a new contribution
  async createContribution(contribution: Omit<ArchiveContribution, 'id' | 'created_at' | 'updated_at' | 'votes_count' | 'score' | 'status' | 'reviewed_by' | 'reviewed_at'>): Promise<ArchiveContribution> {
    const { data, error } = await supabase
      .from('archive_contributions')
      .insert(contribution)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Upload image to storage
  async uploadImage(file: File, archiveId: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${archiveId}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('archive-images')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('archive-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  },

  // Vote on a contribution
  async voteContribution(contributionId: string, voteType: 'upvote' | 'downvote'): Promise<void> {
    const { error } = await supabase
      .from('contribution_votes')
      .upsert({
        contribution_id: contributionId,
        user_id: (await supabase.auth.getUser()).data.user?.id!,
        vote_type: voteType
      });

    if (error) throw error;
  },

  // Get user's vote for a contribution
  async getUserVote(contributionId: string): Promise<ContributionVote | null> {
    const { data, error } = await supabase
      .from('contribution_votes')
      .select('*')
      .eq('contribution_id', contributionId)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id!)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Get pending contributions for admin review
  async getPendingContributions(): Promise<ArchiveContribution[]> {
    const { data, error } = await supabase
      .from('archive_contributions')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Approve/reject contribution (admin only)
  async reviewContribution(contributionId: string, status: 'approved' | 'rejected'): Promise<void> {
    const { error } = await supabase
      .from('archive_contributions')
      .update({
        status,
        reviewed_by: (await supabase.auth.getUser()).data.user?.id!,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', contributionId);

    if (error) throw error;
  }
};