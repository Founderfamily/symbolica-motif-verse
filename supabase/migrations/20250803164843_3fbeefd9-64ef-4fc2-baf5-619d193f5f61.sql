-- Create table for storing AI investigations
CREATE TABLE public.ai_investigations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quest_id uuid NOT NULL,
  investigation_type text NOT NULL,
  result_content jsonb NOT NULL,
  evidence_used jsonb DEFAULT '[]'::jsonb,
  created_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_investigations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Investigations are viewable by all users" 
ON public.ai_investigations 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create investigations" 
ON public.ai_investigations 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own investigations" 
ON public.ai_investigations 
FOR UPDATE 
USING (auth.uid() = created_by);

-- Add trigger for updated_at
CREATE TRIGGER update_ai_investigations_updated_at
BEFORE UPDATE ON public.ai_investigations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();