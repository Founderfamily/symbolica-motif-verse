
-- Ajouter les champs taxonomiques aux symboles
ALTER TABLE public.symbols 
ADD COLUMN cultural_taxonomy_code TEXT,
ADD COLUMN temporal_taxonomy_code TEXT,
ADD COLUMN thematic_taxonomy_codes TEXT[];

-- Index pour améliorer les performances des requêtes taxonomiques
CREATE INDEX idx_symbols_cultural_taxonomy ON public.symbols(cultural_taxonomy_code);
CREATE INDEX idx_symbols_temporal_taxonomy ON public.symbols(temporal_taxonomy_code);
CREATE INDEX idx_symbols_thematic_taxonomy ON public.symbols USING GIN(thematic_taxonomy_codes);

-- Fonction pour analyser et assigner automatiquement les codes taxonomiques
CREATE OR REPLACE FUNCTION public.analyze_symbol_taxonomy(p_symbol_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  symbol_record RECORD;
  cultural_code TEXT;
  temporal_code TEXT;
  thematic_codes TEXT[];
BEGIN
  -- Récupérer le symbole
  SELECT * FROM public.symbols WHERE id = p_symbol_id INTO symbol_record;
  
  IF NOT FOUND THEN
    RETURN;
  END IF;
  
  -- Analyse culturelle basée sur le champ culture
  cultural_code := CASE 
    WHEN LOWER(symbol_record.culture) LIKE '%chinois%' OR LOWER(symbol_record.culture) LIKE '%china%' THEN 'ASI-CHN'
    WHEN LOWER(symbol_record.culture) LIKE '%indien%' OR LOWER(symbol_record.culture) LIKE '%india%' OR LOWER(symbol_record.culture) LIKE '%hindou%' THEN 'ASI-IND'
    WHEN LOWER(symbol_record.culture) LIKE '%japonais%' OR LOWER(symbol_record.culture) LIKE '%japan%' THEN 'ASI-JPN'
    WHEN LOWER(symbol_record.culture) LIKE '%français%' OR LOWER(symbol_record.culture) LIKE '%france%' THEN 'EUR-FRA'
    WHEN LOWER(symbol_record.culture) LIKE '%celtique%' OR LOWER(symbol_record.culture) LIKE '%celtic%' THEN 'EUR-CEL'
    WHEN LOWER(symbol_record.culture) LIKE '%grec%' OR LOWER(symbol_record.culture) LIKE '%greek%' THEN 'EUR-GRE'
    WHEN LOWER(symbol_record.culture) LIKE '%romain%' OR LOWER(symbol_record.culture) LIKE '%roman%' THEN 'EUR-ROM'
    WHEN LOWER(symbol_record.culture) LIKE '%egyptien%' OR LOWER(symbol_record.culture) LIKE '%egypt%' THEN 'AFR-EGY'
    WHEN LOWER(symbol_record.culture) LIKE '%amerindien%' OR LOWER(symbol_record.culture) LIKE '%native%' OR LOWER(symbol_record.culture) LIKE '%indigenous%' THEN 'AME-NAT'
    WHEN LOWER(symbol_record.culture) LIKE '%azteque%' OR LOWER(symbol_record.culture) LIKE '%aztec%' THEN 'AME-AZT'
    WHEN LOWER(symbol_record.culture) LIKE '%maya%' THEN 'AME-MAY'
    WHEN LOWER(symbol_record.culture) LIKE '%aborigene%' OR LOWER(symbol_record.culture) LIKE '%aboriginal%' THEN 'OCE-ABO'
    WHEN LOWER(symbol_record.culture) LIKE '%maori%' THEN 'OCE-ABO'
    WHEN LOWER(symbol_record.culture) LIKE '%islamique%' OR LOWER(symbol_record.culture) LIKE '%islamic%' OR LOWER(symbol_record.culture) LIKE '%arabe%' THEN 'ASI'  -- Générique Asie pour l'Islam
    WHEN LOWER(symbol_record.culture) LIKE '%ashanti%' OR LOWER(symbol_record.culture) LIKE '%akan%' THEN 'AFR'
    WHEN LOWER(symbol_record.culture) LIKE '%nordique%' OR LOWER(symbol_record.culture) LIKE '%viking%' THEN 'EUR'
    WHEN LOWER(symbol_record.culture) LIKE '%mesoamerican%' THEN 'AME'
    ELSE NULL
  END;
  
  -- Analyse temporelle basée sur le champ period
  temporal_code := CASE 
    WHEN LOWER(symbol_record.period) LIKE '%prehistoire%' OR LOWER(symbol_record.period) LIKE '%prehistoric%' OR LOWER(symbol_record.period) LIKE '%paleolithique%' OR LOWER(symbol_record.period) LIKE '%neolithique%' THEN 'PRE'
    WHEN LOWER(symbol_record.period) LIKE '%antiquite%' OR LOWER(symbol_record.period) LIKE '%antiquity%' OR LOWER(symbol_record.period) LIKE '%ancient%' OR LOWER(symbol_record.period) LIKE '%classique%' THEN 'ANT'
    WHEN LOWER(symbol_record.period) LIKE '%moyen%' OR LOWER(symbol_record.period) LIKE '%medieval%' OR LOWER(symbol_record.period) LIKE '%middle%' THEN 'MED'
    WHEN LOWER(symbol_record.period) LIKE '%moderne%' OR LOWER(symbol_record.period) LIKE '%renaissance%' OR LOWER(symbol_record.period) LIKE '%baroque%' THEN 'MOD'
    WHEN LOWER(symbol_record.period) LIKE '%contemporain%' OR LOWER(symbol_record.period) LIKE '%contemporary%' OR LOWER(symbol_record.period) LIKE '%actuel%' THEN 'CON'
    WHEN LOWER(symbol_record.period) LIKE '%tradition%' OR LOWER(symbol_record.period) LIKE '%traditional%' THEN 'CON'  -- Les traditions sont considérées comme contemporaines
    WHEN LOWER(symbol_record.period) LIKE '%edo%' THEN 'MOD'  -- Période Edo japonaise
    WHEN LOWER(symbol_record.period) LIKE '%fer%' OR LOWER(symbol_record.period) LIKE '%iron%' THEN 'ANT'  -- Âge du fer
    ELSE 'CON'  -- Par défaut contemporain
  END;
  
  -- Analyse thématique basée sur le nom et la description
  thematic_codes := ARRAY[]::TEXT[];
  
  -- Ajout des codes thématiques selon le contenu
  IF LOWER(symbol_record.name) LIKE '%religieux%' OR LOWER(symbol_record.name) LIKE '%spiritual%' OR 
     LOWER(symbol_record.name) LIKE '%sacred%' OR LOWER(symbol_record.name) LIKE '%divin%' OR
     LOWER(symbol_record.description || '') LIKE '%meditation%' OR LOWER(symbol_record.description || '') LIKE '%spirituel%' THEN
    thematic_codes := array_append(thematic_codes, 'REL');
  END IF;
  
  IF LOWER(symbol_record.name) LIKE '%geometr%' OR LOWER(symbol_record.name) LIKE '%mandala%' OR 
     LOWER(symbol_record.name) LIKE '%pattern%' OR LOWER(symbol_record.name) LIKE '%motif%' THEN
    thematic_codes := array_append(thematic_codes, 'SCI-GEO');
  END IF;
  
  IF LOWER(symbol_record.name) LIKE '%royal%' OR LOWER(symbol_record.name) LIKE '%imperial%' OR 
     LOWER(symbol_record.name) LIKE '%noble%' OR LOWER(symbol_record.name) LIKE '%pouvoir%' THEN
    thematic_codes := array_append(thematic_codes, 'SOC');
  END IF;
  
  IF LOWER(symbol_record.name) LIKE '%nature%' OR LOWER(symbol_record.name) LIKE '%animal%' OR 
     LOWER(symbol_record.name) LIKE '%cosmos%' OR LOWER(symbol_record.name) LIKE '%etoile%' OR
     LOWER(symbol_record.name) LIKE '%lune%' OR LOWER(symbol_record.name) LIKE '%soleil%' THEN
    thematic_codes := array_append(thematic_codes, 'NAT');
  END IF;
  
  -- Si aucun thème spécifique, ajouter un thème par défaut selon la culture
  IF array_length(thematic_codes, 1) IS NULL THEN
    thematic_codes := CASE 
      WHEN cultural_code LIKE 'REL-%' THEN ARRAY['REL']
      WHEN cultural_code LIKE 'EUR-%' AND temporal_code = 'MED' THEN ARRAY['REL', 'SOC']
      ELSE ARRAY['SOC']
    END;
  END IF;
  
  -- Mettre à jour le symbole avec les codes taxonomiques
  UPDATE public.symbols 
  SET 
    cultural_taxonomy_code = cultural_code,
    temporal_taxonomy_code = temporal_code,
    thematic_taxonomy_codes = thematic_codes,
    updated_at = now()
  WHERE id = p_symbol_id;
END;
$$;

-- Fonction pour analyser tous les symboles existants
CREATE OR REPLACE FUNCTION public.analyze_all_symbols_taxonomy()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  symbol_id uuid;
  processed_count INTEGER := 0;
BEGIN
  FOR symbol_id IN SELECT id FROM public.symbols LOOP
    PERFORM public.analyze_symbol_taxonomy(symbol_id);
    processed_count := processed_count + 1;
  END LOOP;
  
  RETURN processed_count;
END;
$$;

-- Exécuter l'analyse pour tous les symboles existants
SELECT public.analyze_all_symbols_taxonomy();

-- Fonction pour redistribuer automatiquement les symboles dans les bonnes collections
CREATE OR REPLACE FUNCTION public.redistribute_symbols_by_taxonomy()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  symbol_record RECORD;
  target_collection_id uuid;
  moved_count INTEGER := 0;
BEGIN
  -- Parcourir tous les symboles avec codes taxonomiques
  FOR symbol_record IN 
    SELECT id, cultural_taxonomy_code, temporal_taxonomy_code, thematic_taxonomy_codes, name, culture
    FROM public.symbols 
    WHERE cultural_taxonomy_code IS NOT NULL
  LOOP
    -- Déterminer la collection cible basée sur la taxonomie culturelle
    target_collection_id := CASE 
      WHEN symbol_record.cultural_taxonomy_code LIKE 'ASI-%' THEN 
        (SELECT id FROM public.collections c JOIN public.collection_translations ct ON c.id = ct.collection_id 
         WHERE LOWER(ct.title) LIKE '%asie%' OR LOWER(ct.title) LIKE '%asia%' LIMIT 1)
      WHEN symbol_record.cultural_taxonomy_code LIKE 'EUR-FRA%' THEN 
        (SELECT id FROM public.collections c JOIN public.collection_translations ct ON c.id = ct.collection_id 
         WHERE LOWER(ct.title) LIKE '%français%' OR LOWER(ct.title) LIKE '%french%' LIMIT 1)
      WHEN symbol_record.cultural_taxonomy_code LIKE 'EUR-CEL%' THEN 
        (SELECT id FROM public.collections c JOIN public.collection_translations ct ON c.id = ct.collection_id 
         WHERE LOWER(ct.title) LIKE '%celt%' LIMIT 1)
      WHEN symbol_record.cultural_taxonomy_code LIKE 'EUR-%' THEN 
        (SELECT id FROM public.collections c JOIN public.collection_translations ct ON c.id = ct.collection_id 
         WHERE LOWER(ct.title) LIKE '%europe%' LIMIT 1)
      WHEN symbol_record.cultural_taxonomy_code LIKE 'AFR-%' THEN 
        (SELECT id FROM public.collections c JOIN public.collection_translations ct ON c.id = ct.collection_id 
         WHERE LOWER(ct.title) LIKE '%afrique%' OR LOWER(ct.title) LIKE '%africa%' LIMIT 1)
      WHEN symbol_record.cultural_taxonomy_code LIKE 'AME-%' THEN 
        (SELECT id FROM public.collections c JOIN public.collection_translations ct ON c.id = ct.collection_id 
         WHERE LOWER(ct.title) LIKE '%amerique%' OR LOWER(ct.title) LIKE '%america%' LIMIT 1)
      WHEN symbol_record.cultural_taxonomy_code LIKE 'OCE-%' THEN 
        (SELECT id FROM public.collections c JOIN public.collection_translations ct ON c.id = ct.collection_id 
         WHERE LOWER(ct.title) LIKE '%ocean%' LIMIT 1)
      ELSE NULL
    END;
    
    -- Si une collection cible est trouvée, déplacer le symbole
    IF target_collection_id IS NOT NULL THEN
      -- Supprimer de toutes les autres collections
      DELETE FROM public.collection_symbols WHERE symbol_id = symbol_record.id;
      
      -- Ajouter à la collection cible s'il n'y est pas déjà
      INSERT INTO public.collection_symbols (collection_id, symbol_id, position)
      SELECT target_collection_id, symbol_record.id, COALESCE(MAX(position), 0) + 1
      FROM public.collection_symbols 
      WHERE collection_id = target_collection_id
      ON CONFLICT (collection_id, symbol_id) DO NOTHING;
      
      moved_count := moved_count + 1;
    END IF;
  END LOOP;
  
  RETURN moved_count;
END;
$$;

-- Exécuter la redistribution
SELECT public.redistribute_symbols_by_taxonomy();
