-- Create table to store symbol verification results
CREATE TABLE public.symbol_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol_id UUID NOT NULL REFERENCES public.symbols(id) ON DELETE CASCADE,
  api TEXT NOT NULL,
  status TEXT NOT NULL,
  confidence INTEGER NOT NULL DEFAULT 0,
  summary TEXT,
  details TEXT,
  sources JSONB DEFAULT '[]'::jsonb,
  verified_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.symbol_verifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view verification results"
ON public.symbol_verifications
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert verification results"
ON public.symbol_verifications
FOR INSERT
WITH CHECK (auth.uid() = verified_by);

CREATE POLICY "Users can update their own verification results"
ON public.symbol_verifications
FOR UPDATE
USING (auth.uid() = verified_by);

-- Create index for faster queries
CREATE INDEX idx_symbol_verifications_symbol_id ON public.symbol_verifications(symbol_id);
CREATE INDEX idx_symbol_verifications_created_at ON public.symbol_verifications(created_at DESC);

-- Add trigger for updated_at
CREATE TRIGGER update_symbol_verifications_updated_at
BEFORE UPDATE ON public.symbol_verifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();