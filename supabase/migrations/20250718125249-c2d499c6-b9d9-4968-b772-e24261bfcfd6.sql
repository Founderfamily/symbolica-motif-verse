
-- Mettre à jour le symbole "Adi Shakti" avec les codes taxonomiques UNESCO
UPDATE public.symbols 
SET 
  cultural_taxonomy_code = 'ASI-IND',
  temporal_taxonomy_code = 'ANT',
  thematic_taxonomy_codes = ARRAY['REL', 'MYT', 'RIT']
WHERE id = '93149524-2bfd-4bf2-abf1-ba786e0b4c6e';
