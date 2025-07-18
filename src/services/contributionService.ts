import { supabase } from '@/integrations/supabase/client';
import { ContributionFormData, CompleteContribution, ContributionImage, ContributionTag, ContributionComment } from '@/types/contributions';
import { SecurityUtils } from '@/utils/securityUtils';

// Helper function to safely cast image_type
const castImageType = (type: string): 'original' | 'pattern' | 'analysis' | 'extract' => {
  if (['original', 'pattern', 'analysis', 'extract'].includes(type)) {
    return type as 'original' | 'pattern' | 'analysis' | 'extract';
  }
  return 'original'; // fallback to original if unknown type
};

// Helper function to map database results to our types
const mapContributionData = (dbContribution: any): CompleteContribution => {
  return {
    ...dbContribution,
    images: (dbContribution.contribution_images || []).map((img: any): ContributionImage => ({
      id: img.id,
      contribution_id: img.contribution_id,
      image_url: img.image_url,
      image_type: castImageType(img.image_type),
      annotations: img.annotations,
      extracted_pattern_url: img.extracted_pattern_url,
      created_at: img.created_at
    })),
    tags: (dbContribution.contribution_tags || []).map((tag: any): ContributionTag => ({
      id: tag.id,
      contribution_id: tag.contribution_id,
      tag: tag.tag,
      created_at: tag.created_at,
      tag_translations: tag.tag_translations
    })),
    comments: (dbContribution.contribution_comments || []).map((comment: any): ContributionComment => ({
      id: comment.id,
      contribution_id: comment.contribution_id,
      user_id: comment.user_id,
      comment: comment.comment,
      created_at: comment.created_at,
      comment_translations: comment.comment_translations,
      profiles: comment.profiles
    })),
    user_profile: dbContribution.profiles
  };
};

export const createContribution = async (
  userId: string, 
  data: ContributionFormData, 
  imageFile: File
): Promise<string | null> => {
  try {
    console.log('Creating contribution with data:', data);
    
    // Input validation and sanitization
    const sanitizedData = {
      title: SecurityUtils.validateInput(data.title, 200),
      description: SecurityUtils.validateInput(data.description, 2000),
      cultural_context: SecurityUtils.validateInput(data.cultural_context, 100),
      period: SecurityUtils.validateInput(data.period, 100),
      location_name: data.location_name ? SecurityUtils.validateInput(data.location_name, 200) : null,
      latitude: data.latitude,
      longitude: data.longitude,
      significance: data.significance ? SecurityUtils.validateInput(data.significance, 1000) : null,
      historical_context: data.historical_context ? SecurityUtils.validateInput(data.historical_context, 1000) : null,
      sources: data.sources || [],
      tags: data.tags || []
    };

    console.log('Sanitized data:', sanitizedData);

    // Validate image file
    if (!SecurityUtils.validateFileName(imageFile.name)) {
      throw new Error('Invalid file name');
    }

    if (!SecurityUtils.validateFileType(imageFile.name, imageFile.type, ['image/jpeg', 'image/png', 'image/webp'])) {
      throw new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed');
    }

    // Check file size (5MB limit)
    if (imageFile.size > 5 * 1024 * 1024) {
      throw new Error('File too large. Maximum size is 5MB');
    }

    // Rate limiting
    if (!SecurityUtils.checkRateLimit(`contribution_${userId}`, 3, 3600000)) { // 3 per hour
      throw new Error('Rate limit exceeded. You can only submit 3 contributions per hour');
    }

    // Create the contribution record first - only include existing columns
    const contributionPayload = {
      user_id: userId,
      title: sanitizedData.title,
      description: sanitizedData.description,
      cultural_context: sanitizedData.cultural_context,
      period: sanitizedData.period,
      location_name: sanitizedData.location_name,
      latitude: sanitizedData.latitude,
      longitude: sanitizedData.longitude,
      status: 'pending'
    };

    // Only add new columns if they exist in the database
    if (sanitizedData.significance) {
      (contributionPayload as any).significance = sanitizedData.significance;
    }
    if (sanitizedData.historical_context) {
      (contributionPayload as any).historical_context = sanitizedData.historical_context;
    }
    if (sanitizedData.sources && sanitizedData.sources.length > 0) {
      (contributionPayload as any).sources = sanitizedData.sources;
    }

    console.log('Creating contribution with payload:', contributionPayload);

    const { data: contribution, error: contributionError } = await supabase
      .from('user_contributions')
      .insert(contributionPayload)
      .select()
      .single();

    if (contributionError) {
      console.error('Error creating contribution:', contributionError);
      throw new Error(`Failed to create contribution: ${contributionError.message}`);
    }

    console.log('Contribution created successfully:', contribution);

    // Upload image with secure file naming
    const fileExtension = imageFile.name.split('.').pop();
    const sanitizedFileName = `${contribution.id}_${Date.now()}.${fileExtension}`;
    
    console.log('Uploading image:', sanitizedFileName);

    const { error: uploadError } = await supabase.storage
      .from('contribution-images')
      .upload(sanitizedFileName, imageFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      // Clean up the contribution record if image upload fails
      await supabase.from('user_contributions').delete().eq('id', contribution.id);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    // Get the public URL for the uploaded image
    const { data: urlData } = supabase.storage
      .from('contribution-images')
      .getPublicUrl(sanitizedFileName);

    console.log('Image uploaded, creating image record with URL:', urlData.publicUrl);

    // Create the image record
    const { error: imageError } = await supabase
      .from('contribution_images')
      .insert({
        contribution_id: contribution.id,
        image_url: urlData.publicUrl,
        image_type: 'original'
      });

    if (imageError) {
      console.error('Error creating image record:', imageError);
      throw new Error(`Failed to create image record: ${imageError.message}`);
    }

    // Process tags if provided
    if (data.tags && data.tags.length > 0) {
      console.log('Processing tags:', data.tags);
      
      const tagInserts = data.tags.map(tag => ({
        contribution_id: contribution.id,
        tag: SecurityUtils.validateInput(tag, 50)
      }));

      const { error: tagsError } = await supabase
        .from('contribution_tags')
        .insert(tagInserts);

      if (tagsError) {
        console.error('Error creating tags:', tagsError);
        // Don't throw here as the contribution was created successfully
      }
    }

    console.log('Contribution created successfully with ID:', contribution.id);
    return contribution.id;

  } catch (error) {
    console.error('Error in createContribution:', error);
    throw error;
  }
};

export const getContributionById = async (id: string) => {
  try {
    // Validate input
    const sanitizedId = SecurityUtils.validateInput(id, 36);

    const { data, error } = await supabase
      .from('user_contributions')
      .select(`
        *,
        profiles!inner(username, full_name),
        contribution_images(*),
        contribution_tags(*),
        contribution_comments(*)
      `)
      .eq('id', sanitizedId)
      .single();

    if (error) {
      console.error('Error fetching contribution:', error);
      throw error;
    }

    return mapContributionData(data);
  } catch (error) {
    console.error('Error in getContributionById:', error);
    throw error;
  }
};

export const getUserContributions = async (userId: string, status?: string) => {
  try {
    // Validate input
    const sanitizedUserId = SecurityUtils.validateInput(userId, 36);
    
    let query = supabase
      .from('user_contributions')
      .select(`
        *,
        contribution_images(*),
        contribution_tags(*),
        contribution_comments(*)
      `)
      .eq('user_id', sanitizedUserId)
      .order('created_at', { ascending: false });

    if (status) {
      const sanitizedStatus = SecurityUtils.validateInput(status, 20);
      query = query.eq('status', sanitizedStatus);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching user contributions:', error);
      throw error;
    }

    return data.map(mapContributionData);
  } catch (error) {
    console.error('Error in getUserContributions:', error);
    throw error;
  }
};

export const getPendingContributions = async () => {
  try {
    const { data, error } = await supabase
      .from('user_contributions')
      .select(`
        *,
        profiles!inner(username, full_name),
        contribution_images(*),
        contribution_tags(*),
        contribution_comments(*)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending contributions:', error);
      throw error;
    }

    return data.map(mapContributionData);
  } catch (error) {
    console.error('Error in getPendingContributions:', error);
    throw error;
  }
};

export const updateContributionStatus = async (
  contributionId: string,
  status: 'approved' | 'rejected' | 'pending',
  adminId: string,
  reason?: string
): Promise<boolean> => {
  try {
    // Validate input
    const sanitizedId = SecurityUtils.validateInput(contributionId, 36);
    const sanitizedAdminId = SecurityUtils.validateInput(adminId, 36);
    const sanitizedReason = reason ? SecurityUtils.validateInput(reason, 500) : null;

    const { error } = await supabase
      .from('user_contributions')
      .update({
        status,
        reviewed_by: sanitizedAdminId,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', sanitizedId);

    if (error) {
      console.error('Error updating contribution status:', error);
      throw error;
    }

    // Add a comment if reason is provided
    if (sanitizedReason) {
      await supabase
        .from('contribution_comments')
        .insert({
          contribution_id: sanitizedId,
          user_id: sanitizedAdminId,
          comment: sanitizedReason
        });
    }

    console.log('Contribution status updated successfully:', contributionId);
    return true;
  } catch (error) {
    console.error('Error in updateContributionStatus:', error);
    return false;
  }
};
