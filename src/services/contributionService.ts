
import { supabase } from '@/integrations/supabase/client';
import { ContributionFormData } from '@/types/contributions';
import { SecurityUtils } from '@/utils/securityUtils';

export const createContribution = async (
  userId: string, 
  data: ContributionFormData, 
  imageFile: File
): Promise<string | null> => {
  try {
    // Input validation and sanitization
    const sanitizedData = {
      title: SecurityUtils.validateInput(data.title, 200),
      description: SecurityUtils.validateInput(data.description, 2000),
      cultural_context: SecurityUtils.validateInput(data.cultural_context, 100),
      period: SecurityUtils.validateInput(data.period, 100),
      location_name: data.location_name ? SecurityUtils.validateInput(data.location_name, 200) : null,
      contribution_type: data.contribution_type || 'symbol',
      latitude: data.latitude,
      longitude: data.longitude,
    };

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

    // Create the contribution record first
    const { data: contribution, error: contributionError } = await supabase
      .from('user_contributions')
      .insert({
        user_id: userId,
        ...sanitizedData,
        status: 'pending'
      })
      .select()
      .single();

    if (contributionError) {
      console.error('Error creating contribution:', contributionError);
      throw contributionError;
    }

    // Upload image with secure file naming
    const fileExtension = imageFile.name.split('.').pop();
    const sanitizedFileName = `${contribution.id}_${Date.now()}.${fileExtension}`;
    
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
      throw uploadError;
    }

    // Get the public URL for the uploaded image
    const { data: urlData } = supabase.storage
      .from('contribution-images')
      .getPublicUrl(sanitizedFileName);

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
      throw imageError;
    }

    // Process tags if provided
    if (data.tags && data.tags.length > 0) {
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

    console.log('Contribution created successfully:', contribution.id);
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
        contribution_tags(*)
      `)
      .eq('id', sanitizedId)
      .single();

    if (error) {
      console.error('Error fetching contribution:', error);
      throw error;
    }

    return data;
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
        contribution_tags(*)
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

    return data;
  } catch (error) {
    console.error('Error in getUserContributions:', error);
    throw error;
  }
};
