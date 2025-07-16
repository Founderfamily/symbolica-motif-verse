-- Create symbol_verification_community table for community-based verification
CREATE TABLE public.symbol_verification_community (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol_id UUID NOT NULL REFERENCES public.symbols(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  comment TEXT NOT NULL,
  verification_rating TEXT NOT NULL CHECK (verification_rating IN ('verified', 'disputed', 'unverified')),
  expertise_level TEXT NOT NULL DEFAULT 'community' CHECK (expertise_level IN ('admin', 'expert', 'community')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.symbol_verification_community ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Admins can manage community verifications"
ON public.symbol_verification_community
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Anyone can view community verifications"
ON public.symbol_verification_community
FOR SELECT
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_symbol_verification_community_updated_at
  BEFORE UPDATE ON public.symbol_verification_community
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for performance
CREATE INDEX idx_symbol_verification_community_symbol_id 
ON public.symbol_verification_community(symbol_id);

CREATE INDEX idx_symbol_verification_community_created_at 
ON public.symbol_verification_community(created_at DESC);