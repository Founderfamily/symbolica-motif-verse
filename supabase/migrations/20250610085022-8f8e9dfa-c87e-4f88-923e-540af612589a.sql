
-- Corriger les politiques RLS pour treasure_quests
-- Supprimer la politique restrictive pour INSERT
DROP POLICY IF EXISTS "Authenticated users can create quests" ON public.treasure_quests;

-- Créer une nouvelle politique plus permissive pour l'insertion
-- qui permet l'insertion avec ou sans created_by
CREATE POLICY "Allow quest creation" ON public.treasure_quests 
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL OR 
  created_by IS NULL OR 
  created_by = '00000000-0000-0000-0000-000000000000'::uuid
);

-- Mettre à jour la politique de mise à jour pour être cohérente
DROP POLICY IF EXISTS "Creators and admins can update quests" ON public.treasure_quests;

CREATE POLICY "Allow quest updates" ON public.treasure_quests 
FOR UPDATE USING (
  auth.uid() = created_by OR 
  created_by IS NULL OR 
  created_by = '00000000-0000-0000-0000-000000000000'::uuid OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);
