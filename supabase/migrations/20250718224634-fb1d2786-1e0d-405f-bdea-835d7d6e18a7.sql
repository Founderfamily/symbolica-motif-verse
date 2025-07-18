
-- Créer une fonction pour récupérer les contributions en attente avec les profils utilisateur
CREATE OR REPLACE FUNCTION get_pending_contributions_with_profiles()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  status text,
  title text,
  description text,
  location_name text,
  latitude numeric,
  longitude numeric,
  cultural_context text,
  period text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  reviewed_by uuid,
  reviewed_at timestamp with time zone,
  username text,
  full_name text
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    uc.id,
    uc.user_id,
    uc.status,
    uc.title,
    uc.description,
    uc.location_name,
    uc.latitude,
    uc.longitude,
    uc.cultural_context,
    uc.period,
    uc.created_at,
    uc.updated_at,
    uc.reviewed_by,
    uc.reviewed_at,
    p.username,
    p.full_name
  FROM user_contributions uc
  LEFT JOIN profiles p ON uc.user_id = p.id
  WHERE uc.status = 'pending'
  ORDER BY uc.created_at DESC;
$$;

-- Créer une fonction pour récupérer toutes les contributions avec les profils utilisateur
CREATE OR REPLACE FUNCTION get_all_contributions_with_profiles(p_status text DEFAULT NULL)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  status text,
  title text,
  description text,
  location_name text,
  latitude numeric,
  longitude numeric,
  cultural_context text,
  period text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  reviewed_by uuid,
  reviewed_at timestamp with time zone,
  username text,
  full_name text
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    uc.id,
    uc.user_id,
    uc.status,
    uc.title,
    uc.description,
    uc.location_name,
    uc.latitude,
    uc.longitude,
    uc.cultural_context,
    uc.period,
    uc.created_at,
    uc.updated_at,
    uc.reviewed_by,
    uc.reviewed_at,
    p.username,
    p.full_name
  FROM user_contributions uc
  LEFT JOIN profiles p ON uc.user_id = p.id
  WHERE (p_status IS NULL OR uc.status = p_status)
  ORDER BY uc.created_at DESC;
$$;
