-- Create functions to handle community verification comments
CREATE OR REPLACE FUNCTION public.get_community_verification_comments(p_symbol_id UUID)
RETURNS TABLE(
  id UUID,
  user_id UUID,
  comment TEXT,
  verification_rating TEXT,
  expertise_level TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  profiles JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    svc.id,
    svc.user_id,
    svc.comment,
    svc.verification_rating,
    svc.expertise_level,
    svc.created_at,
    jsonb_build_object(
      'username', p.username,
      'full_name', p.full_name,
      'is_admin', p.is_admin
    ) as profiles
  FROM public.symbol_verification_community svc
  LEFT JOIN public.profiles p ON svc.user_id = p.id
  WHERE svc.symbol_id = p_symbol_id
  ORDER BY svc.created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.add_community_verification_comment(
  p_symbol_id UUID,
  p_user_id UUID,
  p_comment TEXT,
  p_verification_rating TEXT,
  p_expertise_level TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_comment_id UUID;
BEGIN
  INSERT INTO public.symbol_verification_community (
    symbol_id,
    user_id,
    comment,
    verification_rating,
    expertise_level
  ) VALUES (
    p_symbol_id,
    p_user_id,
    p_comment,
    p_verification_rating,
    p_expertise_level
  ) RETURNING id INTO new_comment_id;
  
  RETURN new_comment_id;
END;
$$;