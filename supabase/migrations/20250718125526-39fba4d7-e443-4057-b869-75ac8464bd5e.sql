-- Assigner des codes taxonomiques UNESCO à tous les symboles restants
-- Basé sur leur culture, période et thématique

-- Symboles européens médiévaux et modernes
UPDATE public.symbols SET 
  cultural_taxonomy_code = 'EUR-FRA',
  temporal_taxonomy_code = 'MED',
  thematic_taxonomy_codes = ARRAY['HER', 'POL', 'REL']
WHERE culture ILIKE '%Champagne%' OR culture ILIKE '%Gascogne%' OR culture ILIKE '%Poitou%' OR culture ILIKE '%Occitanie%' OR culture ILIKE '%Bourbonnais%' OR culture ILIKE '%Provence%' OR culture ILIKE '%Bretagne%' OR culture ILIKE '%Ardennes%';

-- Symboles africains 
UPDATE public.symbols SET 
  cultural_taxonomy_code = 'AFR-WES',
  temporal_taxonomy_code = 'MED',
  thematic_taxonomy_codes = ARRAY['REL', 'ART', 'ECO']
WHERE culture ILIKE '%Akan%' OR culture ILIKE '%Bamana%';

-- Symboles islamiques
UPDATE public.symbols SET 
  cultural_taxonomy_code = 'AFR-NOR',
  temporal_taxonomy_code = 'MED',
  thematic_taxonomy_codes = ARRAY['REL', 'ART', 'DEC']
WHERE culture ILIKE '%Islamique%';

-- Symboles aborigènes australiens
UPDATE public.symbols SET 
  cultural_taxonomy_code = 'OCE-AUS',
  temporal_taxonomy_code = 'PRE',
  thematic_taxonomy_codes = ARRAY['REL', 'MYT', 'ART']
WHERE culture ILIKE '%Aborigène%' OR culture ILIKE '%Aborigènes%';

-- Symboles celtes/druidiques
UPDATE public.symbols SET 
  cultural_taxonomy_code = 'EUR-CEL',
  temporal_taxonomy_code = 'ANT',
  thematic_taxonomy_codes = ARRAY['REL', 'MYT', 'NAT']
WHERE culture ILIKE '%Celtes%' OR culture ILIKE '%druidisme%' OR culture ILIKE '%gauloise%' OR culture ILIKE '%druides%';

-- Symboles amérindiens
UPDATE public.symbols SET 
  cultural_taxonomy_code = 'AME-NOR',
  temporal_taxonomy_code = 'PRE',
  thematic_taxonomy_codes = ARRAY['REL', 'RIT', 'NAT']
WHERE culture ILIKE '%Tohono O''odham%';

-- Symboles incas/andins
UPDATE public.symbols SET 
  cultural_taxonomy_code = 'AME-SUD',
  temporal_taxonomy_code = 'PRE',
  thematic_taxonomy_codes = ARRAY['REL', 'MYT', 'COS']
WHERE culture ILIKE '%Inca%';

-- Symboles du compagnonnage
UPDATE public.symbols SET 
  cultural_taxonomy_code = 'EUR-FRA',
  temporal_taxonomy_code = 'MOD',
  thematic_taxonomy_codes = ARRAY['ART', 'SOC', 'TRA']
WHERE culture ILIKE '%Compagnonnage%';