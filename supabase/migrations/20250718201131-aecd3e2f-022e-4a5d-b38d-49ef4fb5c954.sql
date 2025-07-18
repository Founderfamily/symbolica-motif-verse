
-- Create the bucket for user content including avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('user_content', 'user_content', true);

-- Policy to allow users to upload their own avatars
CREATE POLICY "Users can upload their own avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'user_content' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy to allow anyone to view avatars (public read)
CREATE POLICY "Anyone can view avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'user_content');

-- Policy to allow users to update their own avatars
CREATE POLICY "Users can update their own avatars" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'user_content' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy to allow users to delete their own avatars
CREATE POLICY "Users can delete their own avatars" ON storage.objects
FOR DELETE USING (
  bucket_id = 'user_content' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
