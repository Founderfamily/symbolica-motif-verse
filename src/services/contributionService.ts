
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

// Récupérer toutes les contributions approuvées
export async function getApprovedContributions(): Promise<CompleteContribution[]> {
  try {
    const { data, error } = await supabase
      .from('user_contributions')
      .select(`
        *,
        profiles:user_id (username, full_name)
      `)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Récupérer les images, tags et commentaires pour chaque contribution
    const contributionsWithDetails = await Promise.all(
      (data as any[]).map(async (contribution) => {
        const images = await getContributionImages(contribution.id);
        const tags = await getContributionTags(contribution.id);
        const comments = await getContributionComments(contribution.id);

        return {
          ...contribution,
          images,
          tags,
          comments,
          user_profile: contribution.profiles
        } as CompleteContribution;
      })
    );

    return contributionsWithDetails;
  } catch (error: any) {
    console.error('Error fetching approved contributions:', error.message);
    return [];
  }
}

// Récupérer les contributions d'un utilisateur
export async function getUserContributions(userId: string): Promise<CompleteContribution[]> {
  try {
    const { data, error } = await supabase
      .from('user_contributions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Récupérer les images, tags et commentaires pour chaque contribution
    const contributionsWithDetails = await Promise.all(
      (data as UserContribution[]).map(async (contribution) => {
        const images = await getContributionImages(contribution.id);
        const tags = await getContributionTags(contribution.id);
        const comments = await getContributionComments(contribution.id);

        return {
          ...contribution,
          images,
          tags,
          comments
        } as CompleteContribution;
      })
    );

    return contributionsWithDetails;
  } catch (error: any) {
    console.error('Error fetching user contributions:', error.message);
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
    return data as ContributionComment[];
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
    // 1. Insérer la contribution
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
      })
      .select()
      .single();

    if (contributionError) throw contributionError;

    // 2. Uploader l'image
    const fileExt = imageFile.name.split('.').pop();
    const filePath = `${userId}/${uuidv4()}.${fileExt}`;

    const { error: uploadError } = await supabase
      .storage
      .from('contribution-images')
      .upload(filePath, imageFile);

    if (uploadError) throw uploadError;

    // 3. Obtenir l'URL de l'image
    const { data: urlData } = supabase
      .storage
      .from('contribution-images')
      .getPublicUrl(filePath);

    // 4. Ajouter l'image à la contribution
    const { error: imageError } = await supabase
      .from('contribution_images')
      .insert({
        contribution_id: contribution.id,
        image_url: urlData.publicUrl,
        image_type: 'original',
      });

    if (imageError) throw imageError;

    // 5. Ajouter les tags
    if (formData.tags && formData.tags.length > 0) {
      const tagInserts = formData.tags.map(tag => ({
        contribution_id: contribution.id,
        tag
      }));

      const { error: tagError } = await supabase
        .from('contribution_tags')
        .insert(tagInserts);

      if (tagError) throw tagError;
    }

    toast({
      title: "Contribution soumise avec succès",
      description: "Votre contribution a été enregistrée et sera examinée prochainement.",
    });

    return contribution.id;
  } catch (error: any) {
    console.error('Error creating contribution:', error.message);
    toast({
      variant: "destructive",
      title: "Erreur lors de la création de la contribution",
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
    // 1. Mettre à jour le statut
    const { error: statusError } = await supabase
      .from('user_contributions')
      .update({
        status: status,
        reviewed_by: reviewerId,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', contributionId);

    if (statusError) throw statusError;

    // 2. Ajouter un commentaire si fourni
    if (comment) {
      const { error: commentError } = await supabase
        .from('contribution_comments')
        .insert({
          contribution_id: contributionId,
          user_id: reviewerId,
          comment
        });

      if (commentError) throw commentError;
    }

    toast({
      title: `Contribution ${status === 'approved' ? 'approuvée' : 'rejetée'}`,
      description: "Le statut de la contribution a été mis à jour.",
    });

    return true;
  } catch (error: any) {
    console.error('Error updating contribution status:', error.message);
    toast({
      variant: "destructive",
      title: "Erreur lors de la mise à jour du statut",
      description: error.message,
    });
    return false;
  }
}

// Récupérer toutes les contributions en attente (pour les admins)
export async function getPendingContributions(): Promise<CompleteContribution[]> {
  try {
    const { data, error } = await supabase
      .from('user_contributions')
      .select(`
        *,
        profiles:user_id (username, full_name)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Récupérer les images, tags et commentaires pour chaque contribution
    const contributionsWithDetails = await Promise.all(
      (data as any[]).map(async (contribution) => {
        const images = await getContributionImages(contribution.id);
        const tags = await getContributionTags(contribution.id);
        const comments = await getContributionComments(contribution.id);

        // Utiliser as unknown as CompleteContribution pour éviter l'erreur de type
        return {
          ...contribution,
          images,
          tags,
          comments,
          user_profile: contribution.profiles || undefined
        } as unknown as CompleteContribution;
      })
    );

    return contributionsWithDetails;
  } catch (error: any) {
    console.error('Error fetching pending contributions:', error.message);
    return [];
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

    // Utiliser as unknown as CompleteContribution pour éviter l'erreur de type
    return {
      ...data,
      images,
      tags,
      comments,
      user_profile: data.profiles || undefined
    } as unknown as CompleteContribution;
  } catch (error: any) {
    console.error('Error fetching contribution by ID:', error.message);
    return null;
  }
}
