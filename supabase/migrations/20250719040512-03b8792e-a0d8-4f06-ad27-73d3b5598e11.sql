
-- Update the create_notification function to use the correct table structure
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_action_url TEXT DEFAULT NULL,
  p_entity_id UUID DEFAULT NULL,
  p_entity_type TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (
    user_id, type, content, read
  ) VALUES (
    p_user_id, 
    p_type, 
    jsonb_build_object(
      'title', p_title,
      'message', p_message,
      'action_url', p_action_url,
      'entity_id', p_entity_id,
      'entity_type', p_entity_type
    ),
    false
  ) RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Update moderation created notification function
CREATE OR REPLACE FUNCTION public.notify_moderation_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create notification for all admins when a new moderation item is created
  INSERT INTO public.notifications (user_id, type, content, read)
  SELECT 
    p.id,
    'system',
    jsonb_build_object(
      'title', 'Nouveau signalement',
      'message', 'Un nouveau signalement a été soumis pour modération sur le symbole "' || s.name || '".',
      'action_url', '/admin/moderation',
      'entity_id', NEW.id::text,
      'entity_type', 'moderation_item'
    ),
    false
  FROM public.profiles p
  CROSS JOIN public.symbols s
  WHERE p.is_admin = true 
    AND s.id = NEW.symbol_id;
    
  RETURN NEW;
END;
$$;

-- Update moderation resolved notification function
CREATE OR REPLACE FUNCTION public.notify_moderation_resolved()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only notify when status changes from pending to approved/rejected
  IF OLD.status = 'pending' AND NEW.status IN ('approved', 'rejected') THEN
    -- Notify the user who reported using the updated create_notification function
    PERFORM public.create_notification(
      NEW.reported_by,
      'system',
      CASE 
        WHEN NEW.status = 'approved' THEN 'Signalement approuvé'
        ELSE 'Signalement rejeté'
      END,
      CASE 
        WHEN NEW.status = 'approved' THEN 'Votre signalement a été approuvé et les mesures appropriées ont été prises.'
        ELSE 'Votre signalement a été examiné mais n''a pas nécessité d''action.'
      END,
      '/notifications',
      NEW.id,
      'moderation_item'
    );
  END IF;
  
  RETURN NEW;
END;
$$;
