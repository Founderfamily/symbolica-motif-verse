-- Continuer l'assignation des codes taxonomiques UNESCO pour les symboles restants

-- Symboles français (Fleur de Lys, Salamandre, etc.)
UPDATE public.symbols SET 
  cultural_taxonomy_code = 'EUR-FRA',
  temporal_taxonomy_code = 'MED',
  thematic_taxonomy_codes = ARRAY['HER', 'POL', 'REL']
WHERE culture ILIKE '%Française%' OR culture ILIKE '%France%' OR culture ILIKE '%Lorraine%';

-- Symboles chinois (Yin Yang)
UPDATE public.symbols SET 
  cultural_taxonomy_code = 'ASI-CHI',
  temporal_taxonomy_code = 'ANT',
  thematic_taxonomy_codes = ARRAY['REL', 'PHI', 'COS']
WHERE culture ILIKE '%Chinoise%';

-- Symboles égyptiens antiques
UPDATE public.symbols SET 
  cultural_taxonomy_code = 'AFR-EGY',
  temporal_taxonomy_code = 'ANT',
  thematic_taxonomy_codes = ARRAY['REL', 'MYT', 'FUN']
WHERE culture ILIKE '%Égypte%' OR culture ILIKE '%Égyptienne%' OR culture ILIKE '%Ancienne Égypte%';

-- Symboles aztèques/mésoaméricains
UPDATE public.symbols SET 
  cultural_taxonomy_code = 'AME-CEN',
  temporal_taxonomy_code = 'PRE',
  thematic_taxonomy_codes = ARRAY['REL', 'RIT', 'MUS']
WHERE culture ILIKE '%Aztèque%';

-- Symboles slaves
UPDATE public.symbols SET 
  cultural_taxonomy_code = 'EUR-SLA',
  temporal_taxonomy_code = 'MED',
  thematic_taxonomy_codes = ARRAY['REL', 'MYT', 'SOL']
WHERE culture ILIKE '%Slave%';