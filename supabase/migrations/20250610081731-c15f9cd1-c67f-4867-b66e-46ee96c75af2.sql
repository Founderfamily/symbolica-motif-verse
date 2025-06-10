
-- Supprimer les anciennes politiques pour treasure_quests
DROP POLICY IF EXISTS "Quest creation" ON public.treasure_quests;
DROP POLICY IF EXISTS "Quest management" ON public.treasure_quests;
DROP POLICY IF EXISTS "Quest visibility" ON public.treasure_quests;
DROP POLICY IF EXISTS "Quest deletion" ON public.treasure_quests;

-- Créer les nouvelles politiques RLS pour la table treasure_quests
-- Politique pour permettre la lecture publique des quêtes
CREATE POLICY "Public can view quests" ON public.treasure_quests 
FOR SELECT USING (true);

-- Politique pour permettre aux créateurs et admins de créer des quêtes
CREATE POLICY "Authenticated users can create quests" ON public.treasure_quests 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Politique pour permettre aux créateurs et admins de modifier des quêtes
CREATE POLICY "Creators and admins can update quests" ON public.treasure_quests 
FOR UPDATE USING (
  auth.uid() = created_by OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Politique pour permettre aux admins de supprimer des quêtes
CREATE POLICY "Admins can delete quests" ON public.treasure_quests 
FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);
