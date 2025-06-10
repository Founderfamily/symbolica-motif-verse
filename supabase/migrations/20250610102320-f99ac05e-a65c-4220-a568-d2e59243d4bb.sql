
-- Créer un enum pour les rôles étendus incluant master_explorer
CREATE TYPE public.app_role AS ENUM ('user', 'admin', 'master_explorer', 'banned');

-- Créer la table des rôles utilisateur
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Activer RLS sur la table user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Fonction pour vérifier si un utilisateur a un rôle spécifique
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Fonction pour obtenir le rôle le plus élevé d'un utilisateur
CREATE OR REPLACE FUNCTION public.get_user_highest_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT CASE 
    WHEN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'admin') THEN 'admin'::app_role
    WHEN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'master_explorer') THEN 'master_explorer'::app_role
    WHEN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'banned') THEN 'banned'::app_role
    ELSE 'user'::app_role
  END
$$;

-- Fonction pour obtenir tous les rôles d'un utilisateur
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id UUID)
RETURNS TABLE (role app_role, assigned_at TIMESTAMP WITH TIME ZONE)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT ur.role, ur.assigned_at
  FROM public.user_roles ur
  WHERE ur.user_id = _user_id
  ORDER BY ur.assigned_at DESC
$$;

-- Politique RLS pour que les utilisateurs puissent voir leurs propres rôles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Politique RLS pour que les admins puissent tout voir et modifier
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Créer la table pour les permissions spéciales des Maîtres Explorateurs
CREATE TABLE public.master_explorer_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  permission_type TEXT NOT NULL,
  quest_id UUID REFERENCES public.treasure_quests(id) ON DELETE CASCADE,
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  UNIQUE (user_id, permission_type, quest_id)
);

-- Activer RLS sur la table des permissions
ALTER TABLE public.master_explorer_permissions ENABLE ROW LEVEL SECURITY;

-- Politique pour que les utilisateurs voient leurs propres permissions
CREATE POLICY "Users can view their own permissions"
ON public.master_explorer_permissions
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Politique pour que les admins gèrent toutes les permissions
CREATE POLICY "Admins can manage all permissions"
ON public.master_explorer_permissions
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Fonction pour assigner le rôle de Maître Explorateur
CREATE OR REPLACE FUNCTION public.assign_master_explorer_role(
  _target_user_id UUID,
  _admin_user_id UUID,
  _quest_ids UUID[] DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Vérifier que l'utilisateur qui assigne est admin
  IF NOT public.has_role(_admin_user_id, 'admin') THEN
    RAISE EXCEPTION 'Only admins can assign master explorer roles';
  END IF;
  
  -- Assigner le rôle de master_explorer
  INSERT INTO public.user_roles (user_id, role, assigned_by)
  VALUES (_target_user_id, 'master_explorer', _admin_user_id)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Si des quêtes spécifiques sont mentionnées, donner des permissions
  IF _quest_ids IS NOT NULL THEN
    INSERT INTO public.master_explorer_permissions (user_id, permission_type, quest_id, granted_by)
    SELECT _target_user_id, 'quest_management', unnest(_quest_ids), _admin_user_id
    ON CONFLICT (user_id, permission_type, quest_id) DO NOTHING;
  ELSE
    -- Donner des permissions globales
    INSERT INTO public.master_explorer_permissions (user_id, permission_type, granted_by)
    VALUES (_target_user_id, 'global_quest_management', _admin_user_id)
    ON CONFLICT (user_id, permission_type, quest_id) DO NOTHING;
  END IF;
  
  -- Logger l'action
  INSERT INTO public.admin_logs (admin_id, action, entity_type, entity_id, details)
  VALUES (
    _admin_user_id,
    'assign_master_explorer_role',
    'user',
    _target_user_id,
    jsonb_build_object('quest_ids', _quest_ids)
  );
END;
$$;

-- Mettre à jour la table profiles pour inclure des informations sur les Maîtres Explorateurs
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS expertise_areas TEXT[],
ADD COLUMN IF NOT EXISTS specialization TEXT,
ADD COLUMN IF NOT EXISTS credentials TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Créer une vue pour obtenir facilement les informations complètes des utilisateurs avec leurs rôles
CREATE OR REPLACE VIEW public.user_profiles_with_roles AS
SELECT 
  p.*,
  COALESCE(array_agg(ur.role) FILTER (WHERE ur.role IS NOT NULL), ARRAY[]::app_role[]) as roles,
  public.get_user_highest_role(p.id) as highest_role,
  CASE WHEN public.has_role(p.id, 'master_explorer') THEN true ELSE false END as is_master_explorer
FROM public.profiles p
LEFT JOIN public.user_roles ur ON p.id = ur.user_id
GROUP BY p.id;
