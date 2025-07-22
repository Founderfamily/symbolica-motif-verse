-- Créer la table des groupes communautaires
CREATE TABLE public.community_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  topic TEXT,
  icon TEXT DEFAULT 'MessageCircle',
  color TEXT DEFAULT 'purple',
  is_welcome_group BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table des membres de groupes
CREATE TABLE public.community_group_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.community_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_online BOOLEAN DEFAULT false,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Enable RLS
ALTER TABLE public.community_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_group_members ENABLE ROW LEVEL SECURITY;

-- Policies pour community_groups
CREATE POLICY "Groups are viewable by everyone" 
ON public.community_groups 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create groups" 
ON public.community_groups 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group creators can update their groups" 
ON public.community_groups 
FOR UPDATE 
TO authenticated
USING (auth.uid() = created_by);

-- Policies pour community_group_members
CREATE POLICY "Users can view group memberships" 
ON public.community_group_members 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Users can join groups" 
ON public.community_group_members 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave groups" 
ON public.community_group_members 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their membership status" 
ON public.community_group_members 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- Insérer le groupe de bienvenue
INSERT INTO public.community_groups (
  id,
  name,
  description,
  topic,
  icon,
  color,
  is_welcome_group,
  is_public
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Bienvenue - Nouveaux Membres',
  'Groupe d''accueil pour tous les nouveaux utilisateurs de la plateforme',
  'Présentation et conseils pour débuter',
  'MessageCircle',
  'purple',
  true,
  true
);

-- Fonction pour ajouter automatiquement les nouveaux utilisateurs au groupe de bienvenue
CREATE OR REPLACE FUNCTION public.add_user_to_welcome_group()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Ajouter l'utilisateur au groupe de bienvenue
  INSERT INTO public.community_group_members (group_id, user_id)
  VALUES ('00000000-0000-0000-0000-000000000001', NEW.id)
  ON CONFLICT (group_id, user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Trigger pour ajouter automatiquement chaque nouvel utilisateur au groupe de bienvenue
CREATE TRIGGER on_auth_user_created_add_to_welcome_group
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.add_user_to_welcome_group();

-- Fonction pour mettre à jour les timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour les timestamps automatiques
CREATE TRIGGER update_community_groups_updated_at
  BEFORE UPDATE ON public.community_groups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();