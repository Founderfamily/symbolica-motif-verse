
-- Create notifications table if it doesn't exist properly
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'contribution', 'community', 'achievement', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  action_url TEXT,
  entity_id UUID,
  entity_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" 
  ON public.notifications 
  FOR INSERT 
  WITH CHECK (true);

-- Create function to create notifications
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
    user_id, type, title, message, action_url, entity_id, entity_type
  ) VALUES (
    p_user_id, p_type, p_title, p_message, p_action_url, p_entity_id, p_entity_type
  ) RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Create trigger function for contribution notifications
CREATE OR REPLACE FUNCTION public.notify_contribution_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only create notification when status changes to approved or rejected
  IF NEW.status != OLD.status AND NEW.status IN ('approved', 'rejected') THEN
    PERFORM public.create_notification(
      NEW.user_id,
      'contribution',
      CASE 
        WHEN NEW.status = 'approved' THEN 'Contribution approuvée'
        ELSE 'Contribution rejetée'
      END,
      CASE 
        WHEN NEW.status = 'approved' THEN 'Votre contribution "' || NEW.title || '" a été approuvée'
        ELSE 'Votre contribution "' || NEW.title || '" a été rejetée'
      END,
      '/contributions',
      NEW.id,
      'contribution'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for contribution status changes
DROP TRIGGER IF EXISTS trigger_contribution_status_notification ON public.user_contributions;
CREATE TRIGGER trigger_contribution_status_notification
  AFTER UPDATE ON public.user_contributions
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_contribution_status_change();

-- Enable realtime for notifications
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.notifications;
