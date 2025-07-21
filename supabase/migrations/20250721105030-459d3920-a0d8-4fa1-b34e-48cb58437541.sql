-- Création d'un référentiel temporel standardisé
CREATE TABLE public.temporal_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL, -- Ex: 'PREHISTORY', 'ANTIQUITY', 'MEDIEVAL', etc.
  start_year INTEGER, -- Année de début (peut être négative pour av. J.-C.)
  end_year INTEGER, -- Année de fin
  order_index INTEGER NOT NULL, -- Pour l'ordre chronologique
  translations JSONB DEFAULT '{"en": {}, "fr": {}}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertion des périodes principales standardisées
INSERT INTO public.temporal_periods (code, start_year, end_year, order_index, translations) VALUES
('PREHISTORY', -3000000, -3000, 1, '{"fr": {"name": "Préhistoire", "description": "Avant l''invention de l''écriture"}, "en": {"name": "Prehistory", "description": "Before the invention of writing"}}'),
('ANTIQUITY', -3000, 476, 2, '{"fr": {"name": "Antiquité", "description": "De l''invention de l''écriture à la chute de l''Empire romain d''Occident"}, "en": {"name": "Antiquity", "description": "From invention of writing to fall of Western Roman Empire"}}'),
('MEDIEVAL', 476, 1453, 3, '{"fr": {"name": "Moyen Âge", "description": "De la chute de Rome à la prise de Constantinople"}, "en": {"name": "Medieval Period", "description": "From fall of Rome to fall of Constantinople"}}'),
('RENAISSANCE', 1453, 1648, 4, '{"fr": {"name": "Renaissance", "description": "Renaissance européenne et découvertes"}, "en": {"name": "Renaissance", "description": "European Renaissance and discoveries"}}'),
('EARLY_MODERN', 1648, 1789, 5, '{"fr": {"name": "Époque moderne", "description": "De la paix de Westphalie à la Révolution française"}, "en": {"name": "Early Modern Period", "description": "From Peace of Westphalia to French Revolution"}}'),
('MODERN', 1789, 1914, 6, '{"fr": {"name": "Époque contemporaine", "description": "De la Révolution française à la Première Guerre mondiale"}, "en": {"name": "Modern Period", "description": "From French Revolution to World War I"}}'),
('CONTEMPORARY', 1914, NULL, 7, '{"fr": {"name": "Époque contemporaine récente", "description": "Depuis la Première Guerre mondiale"}, "en": {"name": "Contemporary Period", "description": "Since World War I"}}');

-- Table pour les périodes spécifiques par culture/région
CREATE TABLE public.cultural_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cultural_taxonomy_code TEXT NOT NULL, -- Référence aux codes culturels existants
  temporal_period_id UUID REFERENCES public.temporal_periods(id),
  specific_name TEXT NOT NULL, -- Nom spécifique (ex: "Période Edo" pour le Japon)
  start_year INTEGER,
  end_year INTEGER,
  translations JSONB DEFAULT '{"en": {}, "fr": {}}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exemples pour la France
INSERT INTO public.cultural_periods (cultural_taxonomy_code, temporal_period_id, specific_name, start_year, end_year, translations) VALUES
('EUR-FRA', (SELECT id FROM public.temporal_periods WHERE code = 'ANTIQUITY'), 'Gaule romaine', -50, 476, '{"fr": {"name": "Gaule romaine", "description": "Période gallo-romaine"}, "en": {"name": "Roman Gaul", "description": "Gallo-Roman period"}}'),
('EUR-FRA', (SELECT id FROM public.temporal_periods WHERE code = 'MEDIEVAL'), 'Royaume de France médiéval', 843, 1453, '{"fr": {"name": "Royaume de France médiéval", "description": "Du traité de Verdun à la fin de la guerre de Cent Ans"}, "en": {"name": "Medieval Kingdom of France", "description": "From Treaty of Verdun to end of Hundred Years War"}}'),
('EUR-FRA', (SELECT id FROM public.temporal_periods WHERE code = 'RENAISSANCE'), 'Renaissance française', 1453, 1598, '{"fr": {"name": "Renaissance française", "description": "Renaissance et guerres de religion"}, "en": {"name": "French Renaissance", "description": "Renaissance and Wars of Religion"}}'),
('EUR-FRA', (SELECT id FROM public.temporal_periods WHERE code = 'EARLY_MODERN'), 'Ancien Régime', 1598, 1789, '{"fr": {"name": "Ancien Régime", "description": "Monarchie absolue française"}, "en": {"name": "Ancien Régime", "description": "French absolute monarchy"}}'),
('EUR-FRA', (SELECT id FROM public.temporal_periods WHERE code = 'MODERN'), 'France révolutionnaire et napoléonienne', 1789, 1815, '{"fr": {"name": "France révolutionnaire et napoléonienne", "description": "Révolution française et Premier Empire"}, "en": {"name": "Revolutionary and Napoleonic France", "description": "French Revolution and First Empire"}}'),
('EUR-FRA', (SELECT id FROM public.temporal_periods WHERE code = 'MODERN'), 'France du XIXe siècle', 1815, 1914, '{"fr": {"name": "France du XIXe siècle", "description": "Restauration, Monarchie de Juillet, Second Empire, Troisième République"}, "en": {"name": "19th century France", "description": "Restoration, July Monarchy, Second Empire, Third Republic"}}'),
('EUR-FRA', (SELECT id FROM public.temporal_periods WHERE code = 'CONTEMPORARY'), 'France moderne', 1914, NULL, '{"fr": {"name": "France moderne", "description": "XXe et XXIe siècles"}, "en": {"name": "Modern France", "description": "20th and 21st centuries"}}');

-- Activer RLS
ALTER TABLE public.temporal_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cultural_periods ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
CREATE POLICY "Anyone can view temporal periods" ON public.temporal_periods FOR SELECT USING (true);
CREATE POLICY "Anyone can view cultural periods" ON public.cultural_periods FOR SELECT USING (true);
CREATE POLICY "Admins can manage temporal periods" ON public.temporal_periods FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage cultural periods" ON public.cultural_periods FOR ALL USING (is_admin());

-- Fonction pour déterminer la période d'un symbole
CREATE OR REPLACE FUNCTION public.get_symbol_temporal_period(symbol_period TEXT, cultural_code TEXT)
RETURNS TABLE(
  period_code TEXT,
  period_name TEXT,
  period_order INTEGER,
  specific_name TEXT
) 
LANGUAGE plpgsql
AS $$
BEGIN
  -- Pour l'instant, on fait un mapping basique basé sur des mots-clés
  -- Plus tard, on pourra améliorer avec des dates précises
  
  RETURN QUERY
  SELECT 
    tp.code,
    (tp.translations->>'fr')::jsonb->>'name' as period_name,
    tp.order_index,
    COALESCE(cp.specific_name, (tp.translations->>'fr')::jsonb->>'name') as specific_name
  FROM public.temporal_periods tp
  LEFT JOIN public.cultural_periods cp ON cp.temporal_period_id = tp.id 
    AND cp.cultural_taxonomy_code = cultural_code
  WHERE 
    CASE 
      WHEN symbol_period ILIKE '%préhistoire%' OR symbol_period ILIKE '%préhistorique%' THEN tp.code = 'PREHISTORY'
      WHEN symbol_period ILIKE '%antiquité%' OR symbol_period ILIKE '%antique%' OR symbol_period ILIKE '%av. j.-c%' THEN tp.code = 'ANTIQUITY'
      WHEN symbol_period ILIKE '%moyen%âge%' OR symbol_period ILIKE '%médiéval%' OR symbol_period ILIKE '%medieval%' THEN tp.code = 'MEDIEVAL'
      WHEN symbol_period ILIKE '%renaissance%' THEN tp.code = 'RENAISSANCE'
      WHEN symbol_period ILIKE '%moderne%' OR symbol_period ILIKE '%xvii%' OR symbol_period ILIKE '%xviii%' THEN tp.code = 'EARLY_MODERN'
      WHEN symbol_period ILIKE '%xix%' OR symbol_period ILIKE '%19%' THEN tp.code = 'MODERN'
      WHEN symbol_period ILIKE '%xx%' OR symbol_period ILIKE '%20%' OR symbol_period ILIKE '%guerre%' THEN tp.code = 'CONTEMPORARY'
      ELSE tp.code = 'CONTEMPORARY' -- par défaut
    END
  ORDER BY tp.order_index
  LIMIT 1;
END;
$$;