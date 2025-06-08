import { supabase } from '@/integrations/supabase/client';
import { 
  UserContribution, 
  ContributionImage, 
  ContributionTag,
  ContributionComment,
  CompleteContribution,
  ContributionFormData 
} from '@/types/contributions';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

// Utility pour les timeouts avec types Supabase corrects
const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), ms)
    )
  ]);
};

// Récupérer toutes les contributions approuvées
export async function getApprovedContributions(): Promise<CompleteContribution[]> {
  console.log('🔍 [ContributionService] Getting approved contributions...');
  
  try {
    const { data, error } = await supabase
      .from('user_contributions')
      .select(`
        *,
        profiles:user_id (username, full_name)
      `)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('❌ [ContributionService] Error:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log('📭 [ContributionService] No approved contributions found');
      return [];
    }

    // Récupérer les détails pour chaque contribution
    const contributionsWithDetails = await Promise.all(
      data.map(async (contribution) => {
        try {
          const [images, tags, comments] = await Promise.all([
            getContributionImages(contribution.id),
            getContributionTags(contribution.id),
            getContributionComments(contribution.id)
          ]);

          return {
            ...contribution,
            images,
            tags,
            comments,
            user_profile: contribution.profiles
          } as CompleteContribution;
        } catch (err) {
          console.warn('⚠️ [ContributionService] Error loading details for contribution:', contribution.id);
          return {
            ...contribution,
            images: [],
            tags: [],
            comments: [],
            user_profile: contribution.profiles
          } as CompleteContribution;
        }
      })
    );

    console.log('✅ [ContributionService] Loaded approved contributions:', contributionsWithDetails.length);
    return contributionsWithDetails;
  } catch (error: any) {
    console.error('💥 [ContributionService] Exception in getApprovedContributions:', error.message);
    return [];
  }
}

// Récupérer les contributions d'un utilisateur
export async function getUserContributions(userId: string): Promise<CompleteContribution[]> {
  console.log('🔍 [ContributionService] Getting user contributions for user:', userId);
  
  try {
    const { data, error } = await supabase
      .from('user_contributions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [ContributionService] Error:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log('📭 [ContributionService] No user contributions found');
      return [];
    }

    // Récupérer les détails
    const contributionsWithDetails = await Promise.all(
      data.map(async (contribution) => {
        try {
          const [images, tags, comments] = await Promise.all([
            getContributionImages(contribution.id),
            getContributionTags(contribution.id),
            getContributionComments(contribution.id)
          ]);

          return {
            ...contribution,
            images,
            tags,
            comments
          } as CompleteContribution;
        } catch (err) {
          console.warn('⚠️ [ContributionService] Error loading details for contribution:', contribution.id);
          return {
            ...contribution,
            images: [],
            tags: [],
            comments: []
          } as CompleteContribution;
        }
      })
    );

    console.log('✅ [ContributionService] Loaded user contributions:', contributionsWithDetails.length);
    return contributionsWithDetails;
  } catch (error: any) {
    console.error('💥 [ContributionService] Exception in getUserContributions:', error.message);
    return [];
  }
}

// Récupérer les contributions en attente (pour les admins)
export async function getPendingContributions(): Promise<CompleteContribution[]> {
  console.log('🔍 [ContributionService] Getting pending contributions...');
  
  try {
    const { data, error } = await supabase
      .from('user_contributions')
      .select(`
        *,
        profiles:user_id (username, full_name)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('❌ [ContributionService] Error:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log('📭 [ContributionService] No pending contributions found');
      return [];
    }

    // Récupérer les détails
    const contributionsWithDetails = await Promise.all(
      data.map(async (contribution) => {
        try {
          const [images, tags, comments] = await Promise.all([
            getContributionImages(contribution.id),
            getContributionTags(contribution.id),
            getContributionComments(contribution.id)
          ]);

          return {
            ...contribution,
            images,
            tags,
            comments,
            user_profile: contribution.profiles || undefined,
            title_translations: contribution.title_translations as { [key: string]: string | null } | null,
            description_translations: contribution.description_translations as { [key: string]: string | null } | null,
            location_name_translations: contribution.location_name_translations as { [key: string]: string | null } | null,
            cultural_context_translations: contribution.cultural_context_translations as { [key: string]: string | null } | null,
            period_translations: contribution.period_translations as { [key: string]: string | null } | null
          } as unknown as CompleteContribution;
        } catch (err) {
          console.warn('⚠️ [ContributionService] Error loading details for contribution:', contribution.id);
          return {
            ...contribution,
            images: [],
            tags: [],
            comments: [],
            user_profile: contribution.profiles || undefined
          } as unknown as CompleteContribution;
        }
      })
    );

    console.log('✅ [ContributionService] Loaded pending contributions:', contributionsWithDetails.length);
    return contributionsWithDetails;
  } catch (error: any) {
    console.error('💥 [ContributionService] Exception in getPendingContributions:', error.message);
    return [];
  }
}

// Récupérer les images d'une contribution
export async function getContributionImages(contributionId: string): Promise<ContributionImage[]> {
  try {
    const { data, error } = await supabase
      .from('contribution_images')
      .select('*')
      .eq('contribution_id', contributionId);

    if (error) throw error;
    return data as ContributionImage[];
  } catch (error: any) {
    console.error('Error fetching contribution images:', error.message);
    return [];
  }
}

// Récupérer les tags d'une contribution
export async function getContributionTags(contributionId: string): Promise<ContributionTag[]> {
  try {
    const { data, error } = await supabase
      .from('contribution_tags')
      .select('*')
      .eq('contribution_id', contributionId);

    if (error) throw error;
    return data as ContributionTag[];
  } catch (error: any) {
    console.error('Error fetching contribution tags:', error.message);
    return [];
  }
}

// Récupérer les commentaires d'une contribution
export async function getContributionComments(contributionId: string): Promise<ContributionComment[]> {
  try {
    const { data, error } = await supabase
      .from('contribution_comments')
      .select(`
        *,
        profiles:user_id (username, full_name)
      `)
      .eq('contribution_id', contributionId);

    if (error) throw error;
    
    const transformedData = (data || []).map(item => {
      const comment: ContributionComment = {
        id: item.id,
        contribution_id: item.contribution_id,
        user_id: item.user_id,
        comment: item.comment,
        created_at: item.created_at,
        comment_translations: item.comment_translations as { [key: string]: string | null } | null
      };
      
      if (item.profiles) {
        const profiles = item.profiles as { username?: string; full_name?: string };
        
        if (profiles && typeof profiles === 'object') {
          comment.profiles = {
            username: profiles.username || '',
            full_name: profiles.full_name || ''
          };
        }
      }
      
      return comment;
    });
    
    return transformedData;
  } catch (error: any) {
    console.error('Error fetching contribution comments:', error.message);
    return [];
  }
}

// Créer une nouvelle contribution
export async function createContribution(
  userId: string,
  formData: ContributionFormData,
  imageFile: File
): Promise<string | null> {
  try {
    const { data: contribution, error: contributionError } = await supabase
      .from('user_contributions')
      .insert({
        user_id: userId,
        title: formData.title,
        description: formData.description,
        location_name: formData.location_name,
        latitude: formData.latitude,
        longitude: formData.longitude,
        cultural_context: formData.cultural_context,
        period: formData.period,
        title_translations: {
          fr: formData.title,
          en: formData.title
        },
        description_translations: formData.description ? {
          fr: formData.description,
          en: formData.description
        } : null,
        location_name_translations: formData.location_name ? {
          fr: formData.location_name,
          en: formData.location_name
        } : null,
        cultural_context_translations: formData.cultural_context ? {
          fr: formData.cultural_context,
          en: formData.cultural_context
        } : null,
        period_translations: formData.period ? {
          fr: formData.period,
          en: formData.period
        } : null
      })
      .select()
      .single();

    if (contributionError) throw contributionError;

    const fileExt = imageFile.name.split('.').pop();
    const filePath = `${userId}/${uuidv4()}.${fileExt}`;

    const { error: uploadError } = await supabase
      .storage
      .from('contribution-images')
      .upload(filePath, imageFile);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase
      .storage
      .from('contribution-images')
      .getPublicUrl(filePath);

    const { error: imageError } = await supabase
      .from('contribution_images')
      .insert({
        contribution_id: contribution.id,
        image_url: urlData.publicUrl,
        image_type: 'original',
      });

    if (imageError) throw imageError;

    if (formData.tags && formData.tags.length > 0) {
      const tagInserts = formData.tags.map(tag => ({
        contribution_id: contribution.id,
        tag,
        tag_translations: {
          fr: tag,
          en: tag
        }
      }));

      const { error: tagError } = await supabase
        .from('contribution_tags')
        .insert(tagInserts);

      if (tagError) throw tagError;
    }

    toast({
      title: "contributions.toast.contributionSubmitted",
      description: "contributions.toast.contributionDescription",
    });

    return contribution.id;
  } catch (error: any) {
    console.error('Error creating contribution:', error.message);
    toast({
      variant: "destructive",
      title: "contributions.toast.errorCreating",
      description: error.message,
    });
    return null;
  }
}

// Mettre à jour le statut d'une contribution (pour les admins)
export async function updateContributionStatus(
  contributionId: string,
  status: 'approved' | 'rejected',
  reviewerId: string,
  comment?: string
): Promise<boolean> {
  try {
    const { error: statusError } = await supabase
      .from('user_contributions')
      .update({
        status: status,
        reviewed_by: reviewerId,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', contributionId);

    if (statusError) throw statusError;

    if (comment) {
      const { error: commentError } = await supabase
        .from('contribution_comments')
        .insert({
          contribution_id: contributionId,
          user_id: reviewerId,
          comment,
          comment_translations: {
            fr: comment,
            en: comment
          }
        });

      if (commentError) throw commentError;
    }

    toast({
      title: `contributions.toast.statusUpdateSuccess`,
      description: `contributions.toast.statusUpdateSuccess`,
    });

    return true;
  } catch (error: any) {
    console.error('Error updating contribution status:', error.message);
    toast({
      variant: "destructive",
      title: "contributions.toast.errorUpdating",
      description: error.message,
    });
    return false;
  }
}

// Récupérer une contribution spécifique par ID
export async function getContributionById(contributionId: string): Promise<CompleteContribution | null> {
  try {
    const { data, error } = await supabase
      .from('user_contributions')
      .select(`
        *,
        profiles:user_id (username, full_name)
      `)
      .eq('id', contributionId)
      .single();

    if (error) throw error;

    const images = await getContributionImages(contributionId);
    const tags = await getContributionTags(contributionId);
    const comments = await getContributionComments(contributionId);

    return {
      ...data,
      images,
      tags,
      comments,
      user_profile: data.profiles || undefined,
      title_translations: data.title_translations as { [key: string]: string | null } | null,
      description_translations: data.description_translations as { [key: string]: string | null } | null,
      location_name_translations: data.location_name_translations as { [key: string]: string | null } | null,
      cultural_context_translations: data.cultural_context_translations as { [key: string]: string | null } | null,
      period_translations: data.period_translations as { [key: string]: string | null } | null
    } as unknown as CompleteContribution;
  } catch (error: any) {
    console.error('Error fetching contribution by ID:', error.message);
    return null;
  }
}
