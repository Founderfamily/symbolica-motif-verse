-- Add UNESCO taxonomy fields to symbols table
ALTER TABLE public.symbols 
ADD COLUMN cultural_taxonomy_code TEXT,
ADD COLUMN temporal_taxonomy_code TEXT,
ADD COLUMN thematic_taxonomy_codes TEXT[];

-- Add comment to explain the fields
COMMENT ON COLUMN public.symbols.cultural_taxonomy_code IS 'UNESCO cultural taxonomy code for symbol classification';
COMMENT ON COLUMN public.symbols.temporal_taxonomy_code IS 'UNESCO temporal taxonomy code for symbol classification';
COMMENT ON COLUMN public.symbols.thematic_taxonomy_codes IS 'Array of UNESCO thematic taxonomy codes for symbol classification';