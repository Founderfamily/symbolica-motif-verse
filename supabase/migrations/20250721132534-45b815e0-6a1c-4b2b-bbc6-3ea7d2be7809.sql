-- Sécuriser la création de collections pour les admins seulement
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

-- Policy pour que seuls les admins puissent créer des collections
CREATE POLICY "Only admins can create collections" 
ON public.collections 
FOR INSERT 
WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Policy pour que seuls les admins puissent modifier des collections
CREATE POLICY "Only admins can update collections" 
ON public.collections 
FOR UPDATE 
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Policy pour que seuls les admins puissent supprimer des collections
CREATE POLICY "Only admins can delete collections" 
ON public.collections 
FOR DELETE 
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Policy pour que tout le monde puisse voir les collections
CREATE POLICY "Everyone can view collections" 
ON public.collections 
FOR SELECT 
USING (true);