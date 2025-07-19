
-- Create trigger function for moderation notifications
CREATE OR REPLACE FUNCTION public.notify_moderation_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create notification for all admins when a new moderation item is created
  INSERT INTO public.notifications (user_id, type, title, message, action_url, entity_id, entity_type)
  SELECT 
    p.id,
    'system',
    'Nouveau signalement',
    'Un nouveau signalement a été soumis pour modération sur le symbole "' || s.name || '".',
    '/admin/moderation',
    NEW.id,
    'moderation_item'
  FROM public.profiles p
  CROSS JOIN public.symbols s
  WHERE p.is_admin = true 
    AND s.id = NEW.symbol_id;
    
  RETURN NEW;
END;
$$;

-- Create trigger function for moderation status updates
CREATE OR REPLACE FUNCTION public.notify_moderation_resolved()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only notify when status changes from pending to approved/rejected
  IF OLD.status = 'pending' AND NEW.status IN ('approved', 'rejected') THEN
    -- Notify the user who reported
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

-- Create triggers
DROP TRIGGER IF EXISTS trigger_moderation_created ON public.symbol_moderation_items;
CREATE TRIGGER trigger_moderation_created
  AFTER INSERT ON public.symbol_moderation_items
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_moderation_created();

DROP TRIGGER IF EXISTS trigger_moderation_resolved ON public.symbol_moderation_items;
CREATE TRIGGER trigger_moderation_resolved
  AFTER UPDATE ON public.symbol_moderation_items
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_moderation_resolved();
