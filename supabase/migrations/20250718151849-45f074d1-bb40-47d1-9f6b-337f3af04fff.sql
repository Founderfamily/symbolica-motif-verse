
-- Plan de correction de la répartition des symboles selon la taxonomie UNESCO

-- 1. Audit et nettoyage des mauvaises attributions actuelles
-- Supprimer toutes les associations collection-symboles existantes pour recommencer proprement
DELETE FROM collection_symbols;

-- 2. Assigner les codes taxonomiques UNESCO manquants
-- Mettre à jour les symboles avec les codes taxonomiques appropriés selon leur culture

UPDATE symbols SET cultural_taxonomy_code = 'AFR-EGY', temporal_taxonomy_code = 'ANT'
WHERE culture ILIKE '%égyptien%' OR culture ILIKE '%egypt%' 
   OR name ILIKE '%ankh%' OR name ILIKE '%horus%' OR name ILIKE '%scarabée%' OR name ILIKE '%cartouche%';

UPDATE symbols SET cultural_taxonomy_code = 'EUR-GRE', temporal_taxonomy_code = 'ANT'
WHERE culture ILIKE '%grec%' OR culture ILIKE '%greece%'
   OR name ILIKE '%caducée%' OR name ILIKE '%athéna%' OR name ILIKE '%ionique%' OR name ILIKE '%laurier%';

UPDATE symbols SET cultural_taxonomy_code = 'EUR-ROM', temporal_taxonomy_code = 'ANT'
WHERE culture ILIKE '%romain%' OR culture ILIKE '%roman%'
   OR name ILIKE '%aigle romain%' OR name ILIKE '%fasces%' OR name ILIKE '%spqr%' OR name ILIKE '%louve%';

UPDATE symbols SET cultural_taxonomy_code = 'ASI-CHN', temporal_taxonomy_code = 'CON'
WHERE culture ILIKE '%chinois%' OR culture ILIKE '%china%'
   OR name ILIKE '%dragon chinois%' OR name ILIKE '%phénix chinois%' OR name ILIKE '%nœud chinois%';

UPDATE symbols SET cultural_taxonomy_code = 'ASI-IND', temporal_taxonomy_code = 'CON'
WHERE culture ILIKE '%indien%' OR culture ILIKE '%india%' OR culture ILIKE '%hindou%'
   OR name ILIKE '%lotus%' OR name ILIKE '%ganesha%' OR name ILIKE '%dharma%' OR name ILIKE '%tilaka%';

UPDATE symbols SET cultural_taxonomy_code = 'ASI-JPN', temporal_taxonomy_code = 'CON'
WHERE culture ILIKE '%japonais%' OR culture ILIKE '%japan%'
   OR name ILIKE '%torii%' OR name ILIKE '%cerisier%' OR name ILIKE '%koï%' OR name ILIKE '%mon%';

UPDATE symbols SET cultural_taxonomy_code = 'EUR-FRA', temporal_taxonomy_code = 'MED'
WHERE culture ILIKE '%français%' OR culture ILIKE '%france%'
   OR name ILIKE '%fleur de lys%' OR name ILIKE '%coq%' OR name ILIKE '%marianne%';

UPDATE symbols SET cultural_taxonomy_code = 'EUR-CEL', temporal_taxonomy_code = 'ANT'
WHERE culture ILIKE '%celtique%' OR culture ILIKE '%celtic%'
   OR name ILIKE '%triskèle%' OR name ILIKE '%nœud celtique%' OR name ILIKE '%croix celtique%';

UPDATE symbols SET cultural_taxonomy_code = 'EUR-NOR', temporal_taxonomy_code = 'MED'
WHERE culture ILIKE '%nordique%' OR culture ILIKE '%viking%'
   OR name ILIKE '%mjöllnir%' OR name ILIKE '%runes%' OR name ILIKE '%valknut%' OR name ILIKE '%yggdrasil%';

UPDATE symbols SET cultural_taxonomy_code = 'AFR', temporal_taxonomy_code = 'CON'
WHERE culture ILIKE '%ashanti%' OR culture ILIKE '%africain%'
   OR name ILIKE '%adinkra%' OR name ILIKE '%sankofa%';

UPDATE symbols SET cultural_taxonomy_code = 'AME-AZT', temporal_taxonomy_code = 'MED'
WHERE culture ILIKE '%aztèque%' OR culture ILIKE '%aztec%'
   OR name ILIKE '%quetzalcoatl%' OR name ILIKE '%calendrier aztèque%';

UPDATE symbols SET cultural_taxonomy_code = 'AME-NAT', temporal_taxonomy_code = 'CON'
WHERE culture ILIKE '%amérindien%' OR culture ILIKE '%native%'
   OR name ILIKE '%roue de médecine%' OR name ILIKE '%kokopelli%' OR name ILIKE '%turtle island%';

UPDATE symbols SET cultural_taxonomy_code = 'ASI', temporal_taxonomy_code = 'MED'
WHERE culture ILIKE '%arabe%' OR culture ILIKE '%islamique%'
   OR name ILIKE '%calligraphie arabe%' OR name ILIKE '%croissant%' OR name ILIKE '%mihrab%';

-- 3. Fonction de redistribution automatique selon les codes taxonomiques UNESCO
CREATE OR REPLACE FUNCTION redistribute_symbols_by_unesco_taxonomy()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  symbol_record RECORD;
  target_collection_id uuid;
  redistributed_count INTEGER := 0;
BEGIN
  -- Parcourir tous les symboles avec codes taxonomiques
  FOR symbol_record IN 
    SELECT id, cultural_taxonomy_code, name, culture
    FROM symbols 
    WHERE cultural_taxonomy_code IS NOT NULL
  LOOP
    -- Déterminer la collection cible basée sur la taxonomie culturelle UNESCO
    target_collection_id := CASE 
      WHEN symbol_record.cultural_taxonomy_code = 'AFR-EGY' THEN 
        (SELECT id FROM collections WHERE slug = 'egypte-antique')
      WHEN symbol_record.cultural_taxonomy_code = 'EUR-GRE' THEN 
        (SELECT id FROM collections WHERE slug = 'grece-antique')
      WHEN symbol_record.cultural_taxonomy_code = 'EUR-ROM' THEN 
        (SELECT id FROM collections WHERE slug = 'rome-antique')
      WHEN symbol_record.cultural_taxonomy_code = 'ASI-CHN' THEN 
        (SELECT id FROM collections WHERE slug = 'chine-traditionnelle')
      WHEN symbol_record.cultural_taxonomy_code = 'ASI-IND' THEN 
        (SELECT id FROM collections WHERE slug = 'inde-hindoue')
      WHEN symbol_record.cultural_taxonomy_code = 'ASI-JPN' THEN 
        (SELECT id FROM collections WHERE slug = 'japon-traditionnel')
      WHEN symbol_record.cultural_taxonomy_code = 'EUR-FRA' THEN 
        (SELECT id FROM collections WHERE slug = 'patrimoine-francais')
      WHEN symbol_record.cultural_taxonomy_code = 'EUR-CEL' THEN 
        (SELECT id FROM collections WHERE slug = 'monde-celtique')
      WHEN symbol_record.cultural_taxonomy_code = 'EUR-NOR' THEN 
        (SELECT id FROM collections WHERE slug = 'nordique-viking')
      WHEN symbol_record.cultural_taxonomy_code = 'AFR' THEN 
        (SELECT id FROM collections WHERE slug = 'afrique-traditionnelle')
      WHEN symbol_record.cultural_taxonomy_code = 'AME-AZT' THEN 
        (SELECT id FROM collections WHERE slug = 'maya-azteque')
      WHEN symbol_record.cultural_taxonomy_code = 'AME-NAT' THEN 
        (SELECT id FROM collections WHERE slug = 'ameriques-indigenes')
      WHEN symbol_record.cultural_taxonomy_code = 'ASI' THEN 
        (SELECT id FROM collections WHERE slug = 'monde-arabe-islamique')
      ELSE NULL
    END;
    
    -- Si une collection cible est trouvée, ajouter le symbole
    IF target_collection_id IS NOT NULL THEN
      INSERT INTO collection_symbols (collection_id, symbol_id, position)
      VALUES (
        target_collection_id, 
        symbol_record.id, 
        COALESCE((SELECT MAX(position) FROM collection_symbols WHERE collection_id = target_collection_id), 0) + 1
      )
      ON CONFLICT (collection_id, symbol_id) DO NOTHING;
      
      redistributed_count := redistributed_count + 1;
    END IF;
  END LOOP;
  
  RETURN redistributed_count;
END;
$$;

-- 4. Exécuter la redistribution automatique
SELECT redistribute_symbols_by_unesco_taxonomy();

-- 5. Validation : vérifier la cohérence des collections
-- Créer une vue pour diagnostiquer les problèmes de répartition
CREATE OR REPLACE VIEW collection_taxonomy_audit AS
SELECT 
  c.slug as collection_slug,
  ct.title as collection_title,
  s.name as symbol_name,
  s.culture as symbol_culture,
  s.cultural_taxonomy_code,
  CASE 
    WHEN c.slug = 'egypte-antique' AND s.cultural_taxonomy_code != 'AFR-EGY' THEN 'MISMATCH'
    WHEN c.slug = 'grece-antique' AND s.cultural_taxonomy_code != 'EUR-GRE' THEN 'MISMATCH'
    WHEN c.slug = 'rome-antique' AND s.cultural_taxonomy_code != 'EUR-ROM' THEN 'MISMATCH'
    WHEN c.slug = 'chine-traditionnelle' AND s.cultural_taxonomy_code != 'ASI-CHN' THEN 'MISMATCH'
    WHEN c.slug = 'inde-hindoue' AND s.cultural_taxonomy_code != 'ASI-IND' THEN 'MISMATCH'
    WHEN c.slug = 'japon-traditionnel' AND s.cultural_taxonomy_code != 'ASI-JPN' THEN 'MISMATCH'
    WHEN c.slug = 'patrimoine-francais' AND s.cultural_taxonomy_code != 'EUR-FRA' THEN 'MISMATCH'
    WHEN c.slug = 'monde-celtique' AND s.cultural_taxonomy_code != 'EUR-CEL' THEN 'MISMATCH'
    WHEN c.slug = 'nordique-viking' AND s.cultural_taxonomy_code != 'EUR-NOR' THEN 'MISMATCH'
    WHEN c.slug = 'afrique-traditionnelle' AND s.cultural_taxonomy_code != 'AFR' THEN 'MISMATCH'
    WHEN c.slug = 'maya-azteque' AND s.cultural_taxonomy_code != 'AME-AZT' THEN 'MISMATCH'
    WHEN c.slug = 'ameriques-indigenes' AND s.cultural_taxonomy_code != 'AME-NAT' THEN 'MISMATCH'
    WHEN c.slug = 'monde-arabe-islamique' AND s.cultural_taxonomy_code != 'ASI' THEN 'MISMATCH'
    ELSE 'CORRECT'
  END as taxonomy_status
FROM collections c
JOIN collection_translations ct ON c.id = ct.collection_id AND ct.language = 'fr'
JOIN collection_symbols cs ON c.id = cs.collection_id
JOIN symbols s ON cs.symbol_id = s.id
ORDER BY c.slug, s.name;

-- 6. Nettoyer les symboles orphelins (sans codes taxonomiques appropriés)
-- Les placer dans une collection par défaut ou les supprimer si nécessaire
INSERT INTO collection_symbols (collection_id, symbol_id, position)
SELECT 
  (SELECT id FROM collections WHERE slug = 'symboles-universels'),
  s.id,
  ROW_NUMBER() OVER (ORDER BY s.created_at)
FROM symbols s
WHERE s.cultural_taxonomy_code IS NULL
  AND NOT EXISTS (SELECT 1 FROM collection_symbols cs WHERE cs.symbol_id = s.id)
ON CONFLICT DO NOTHING;

-- 7. Rapport final de la redistribution
SELECT 
  'Redistribution UNESCO terminée' as status,
  COUNT(*) as total_symbols_redistributed
FROM collection_symbols;
