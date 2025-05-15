
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

export interface AnalysisExample {
  id: string;
  title: string;
  description: string | null;
  original_image_url: string | null;
  detection_image_url: string | null;
  extraction_image_url: string | null;
  classification_image_url: string | null;
  tags: string[] | null;
  created_at: string | null;
  updated_at: string | null;
}

export type AnalysisExampleFormData = Pick<
  AnalysisExample,
  "title" | "description" | "tags"
>;

export type ImageType = 'original' | 'detection' | 'extraction' | 'classification';

export async function getAnalysisExamples(): Promise<AnalysisExample[]> {
  const { data, error } = await supabase
    .from("analysis_examples")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching analysis examples:", error);
    throw new Error(error.message);
  }

  return data || [];
}

export async function getAnalysisExample(id: string): Promise<AnalysisExample | null> {
  const { data, error } = await supabase
    .from("analysis_examples")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // No rows found
    }
    console.error("Error fetching analysis example:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function createAnalysisExample(formData: AnalysisExampleFormData): Promise<string> {
  const { data, error } = await supabase
    .from("analysis_examples")
    .insert([{ ...formData }])
    .select("id")
    .single();

  if (error) {
    console.error("Error creating analysis example:", error);
    throw new Error(error.message);
  }

  return data.id;
}

export async function updateAnalysisExample(
  id: string,
  updates: Partial<AnalysisExample>
): Promise<void> {
  const { error } = await supabase
    .from("analysis_examples")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("Error updating analysis example:", error);
    throw new Error(error.message);
  }
}

export async function deleteAnalysisExample(id: string): Promise<void> {
  const example = await getAnalysisExample(id);
  if (!example) return;

  // Delete images from storage if they exist
  const imagesToDelete = [
    example.original_image_url,
    example.detection_image_url,
    example.extraction_image_url,
    example.classification_image_url
  ].filter(url => url && url.includes('analysis_images'));

  for (const imageUrl of imagesToDelete) {
    if (!imageUrl) continue;
    
    const path = imageUrl.split('/').pop();
    if (path) {
      await supabase.storage.from('analysis_images').remove([path]);
    }
  }

  // Delete the record
  const { error } = await supabase
    .from("analysis_examples")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting analysis example:", error);
    throw new Error(error.message);
  }
}

export async function uploadAnalysisImage(
  file: File,
  imageType: ImageType,
  exampleId: string
): Promise<string> {
  if (!file) throw new Error("No file provided");
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${exampleId}/${imageType}_${uuidv4()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('analysis_images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    console.error("Error uploading image:", error);
    throw new Error(error.message);
  }

  const { data: urlData } = supabase.storage
    .from('analysis_images')
    .getPublicUrl(fileName);

  // Update the example with the new image URL
  const updates = {
    [`${imageType}_image_url`]: urlData.publicUrl
  };
  
  await updateAnalysisExample(exampleId, updates);
  
  return urlData.publicUrl;
}
