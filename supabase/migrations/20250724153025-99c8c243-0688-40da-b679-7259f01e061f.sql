-- Create storage bucket for quest evidence
INSERT INTO storage.buckets (id, name, public) 
VALUES ('quest-evidence', 'quest-evidence', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for quest evidence
CREATE POLICY "Quest evidence images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'quest-evidence');

CREATE POLICY "Authenticated users can upload quest evidence" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'quest-evidence' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Users can update their own quest evidence" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'quest-evidence' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Users can delete their own quest evidence" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'quest-evidence' 
  AND auth.uid() IS NOT NULL
);