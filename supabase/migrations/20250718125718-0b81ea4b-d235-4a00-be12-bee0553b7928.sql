-- Finaliser l'assignation des codes taxonomiques UNESCO pour tous les symboles restants

-- Symboles amérindiens d'Amérique du Nord
UPDATE public.symbols SET 
  cultural_taxonomy_code = 'AME-NOR',
  temporal_taxonomy_code = 'PRE',
  thematic_taxonomy_codes = ARRAY['REL', 'MYT', 'ART']
WHERE culture ILIKE '%Amérindienne%' OR culture ILIKE '%préhistoriques d''Amérique du Nord%';

-- Symboles français régionaux (Aquitaine, Bourgogne, Dauphiné, etc.)
UPDATE public.symbols SET 
  cultural_taxonomy_code = 'EUR-FRA',
  temporal_taxonomy_code = 'MED',
  thematic_taxonomy_codes = ARRAY['HER', 'REG', 'LEG']
WHERE culture ILIKE '%Aquitaine%' OR culture ILIKE '%Bourgogne%' OR culture ILIKE '%Dauphiné%' OR culture ILIKE '%Franche-Comté%' OR culture ILIKE '%Normandie%' OR culture ILIKE '%Bresse%';

-- Symboles africains (Ashanti)
UPDATE public.symbols SET 
  cultural_taxonomy_code = 'AFR-WES',
  temporal_taxonomy_code = 'MOD',
  thematic_taxonomy_codes = ARRAY['ART', 'SYM', 'COM']
WHERE culture ILIKE '%Ashanti%';

-- Symboles indiens/asiatiques (Bouddhisme, Hindouisme)
UPDATE public.symbols SET 
  cultural_taxonomy_code = 'ASI-IND',
  temporal_taxonomy_code = 'ANT',
  thematic_taxonomy_codes = ARRAY['REL', 'MYT', 'MED']
WHERE culture ILIKE '%Bouddhisme%' OR culture ILIKE '%Hindouisme%' OR culture ILIKE '%Indienne%';

-- Symboles mayas/mésoaméricains
UPDATE public.symbols SET 
  cultural_taxonomy_code = 'AME-CEN',
  temporal_taxonomy_code = 'PRE',
  thematic_taxonomy_codes = ARRAY['REL', 'RIT', 'SAC']
WHERE culture ILIKE '%Maya%' OR culture ILIKE '%Mésoaméricaine%' OR culture ILIKE '%Zapotèque%';

-- Symboles minoens/crétois
UPDATE public.symbols SET 
  cultural_taxonomy_code = 'EUR-MED',
  temporal_taxonomy_code = 'ANT',
  thematic_taxonomy_codes = ARRAY['REL', 'MYT', 'WRI']
WHERE culture ILIKE '%Minoenne%' OR culture ILIKE '%minoenne%';

-- Symboles coréens
UPDATE public.symbols SET 
  cultural_taxonomy_code = 'ASI-KOR',
  temporal_taxonomy_code = 'ANT',
  thematic_taxonomy_codes = ARRAY['MYT', 'LEG', 'FOU']
WHERE culture ILIKE '%Corée%';

-- Symboles moche/péruviens
UPDATE public.symbols SET 
  cultural_taxonomy_code = 'AME-SUD',
  temporal_taxonomy_code = 'PRE',
  thematic_taxonomy_codes = ARRAY['RIT', 'SAC', 'ART']
WHERE culture ILIKE '%Moche%';

-- Symboles ottomans/turcs
UPDATE public.symbols SET 
  cultural_taxonomy_code = 'ASI-TUR',
  temporal_taxonomy_code = 'MED',
  thematic_taxonomy_codes = ARRAY['MYT', 'ART', 'POW']
WHERE culture ILIKE '%Ottoman%' OR culture ILIKE '%turco-persane%';

-- Symboles grecs
UPDATE public.symbols SET 
  cultural_taxonomy_code = 'EUR-GRE',
  temporal_taxonomy_code = 'ANT',
  thematic_taxonomy_codes = ARRAY['ART', 'DEC', 'ARC']
WHERE culture ILIKE '%Grecque%';

-- Symboles japonais
UPDATE public.symbols SET 
  cultural_taxonomy_code = 'ASI-JAP',
  temporal_taxonomy_code = 'MED',
  thematic_taxonomy_codes = ARRAY['ART', 'TEX', 'TRA']
WHERE culture ILIKE '%Japonaise%';

-- Symboles maori/océaniens
UPDATE public.symbols SET 
  cultural_taxonomy_code = 'OCE-NZL',
  temporal_taxonomy_code = 'TRA',
  thematic_taxonomy_codes = ARRAY['ART', 'MYT', 'ANC']
WHERE culture ILIKE '%Maorie%';

-- Symboles nordiques/vikings
UPDATE public.symbols SET 
  cultural_taxonomy_code = 'EUR-NOR',
  temporal_taxonomy_code = 'MED',
  thematic_taxonomy_codes = ARRAY['ART', 'MYT', 'WAR']
WHERE culture ILIKE '%Nordique%' OR culture ILIKE '%Scandinave%';

-- Symboles celtes irlandais
UPDATE public.symbols SET 
  cultural_taxonomy_code = 'EUR-IRL',
  temporal_taxonomy_code = 'MED',
  thematic_taxonomy_codes = ARRAY['REL', 'CHR', 'CEL']
WHERE culture ILIKE '%Irlandaise celtique%';

-- Symboles romains
UPDATE public.symbols SET 
  cultural_taxonomy_code = 'EUR-ROM',
  temporal_taxonomy_code = 'ANT',
  thematic_taxonomy_codes = ARRAY['ART', 'MAT', 'SYM']
WHERE culture ILIKE '%Romain%';