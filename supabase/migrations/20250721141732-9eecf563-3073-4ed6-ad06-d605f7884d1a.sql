
-- Créer une table générale pour les événements historiques de toutes les cultures
CREATE TABLE IF NOT EXISTS public.historical_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_slug TEXT NOT NULL,
  culture_region TEXT NOT NULL,
  year INTEGER NOT NULL,
  date_text TEXT NOT NULL,
  event_name TEXT NOT NULL,
  description TEXT,
  period_category TEXT NOT NULL,
  importance_level INTEGER DEFAULT 5 CHECK (importance_level >= 1 AND importance_level <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migrer les événements français existants vers la nouvelle table
INSERT INTO public.historical_events (
  collection_slug, culture_region, year, date_text, event_name, description, period_category, importance_level
)
SELECT 
  'patrimoine-francais' as collection_slug,
  'France' as culture_region,
  year,
  date_text,
  event_name,
  description,
  period_category,
  importance_level
FROM public.french_historical_events;

-- Ajouter quelques événements pour d'autres collections
INSERT INTO public.historical_events (collection_slug, culture_region, year, date_text, event_name, description, period_category, importance_level) VALUES
-- Égypte antique
('patrimoine-egyptien', 'Égypte', -3100, '3100 av. J.-C.', 'Unification de l''Égypte', 'Narmer unifie la Haute et la Basse-Égypte', 'Antiquité', 9),
('patrimoine-egyptien', 'Égypte', -2686, '2686 av. J.-C.', 'Ancien Empire', 'Début de l''Ancien Empire égyptien', 'Antiquité', 8),
('patrimoine-egyptien', 'Égypte', -2580, '2580 av. J.-C.', 'Grande Pyramide', 'Construction de la Grande Pyramide de Gizeh', 'Antiquité', 10),
('patrimoine-egyptien', 'Égypte', -2055, '2055 av. J.-C.', 'Moyen Empire', 'Début du Moyen Empire égyptien', 'Antiquité', 7),
('patrimoine-egyptien', 'Égypte', -1550, '1550 av. J.-C.', 'Nouvel Empire', 'Début du Nouvel Empire égyptien', 'Antiquité', 8),
('patrimoine-egyptien', 'Égypte', -1353, '1353 av. J.-C.', 'Akhenaton', 'Règne d''Akhenaton et révolution religieuse', 'Antiquité', 9),
('patrimoine-egyptien', 'Égypte', -1332, '1332 av. J.-C.', 'Toutânkhamon', 'Règne de Toutânkhamon', 'Antiquité', 8),
('patrimoine-egyptien', 'Égypte', -30, '30 av. J.-C.', 'Fin de l''Égypte pharaonique', 'Conquête romaine de l''Égypte', 'Antiquité', 9),

-- Grèce antique
('patrimoine-grec', 'Grèce', -800, '800 av. J.-C.', 'Époque archaïque', 'Début de l''époque archaïque grecque', 'Antiquité', 7),
('patrimoine-grec', 'Grèce', -776, '776 av. J.-C.', 'Premiers Jeux olympiques', 'Premiers Jeux olympiques à Olympie', 'Antiquité', 8),
('patrimoine-grec', 'Grèce', -508, '508 av. J.-C.', 'Démocratie athénienne', 'Réformes de Clisthène à Athènes', 'Antiquité', 9),
('patrimoine-grec', 'Grèce', -490, '490 av. J.-C.', 'Bataille de Marathon', 'Victoire grecque contre les Perses', 'Antiquité', 8),
('patrimoine-grec', 'Grèce', -480, '480 av. J.-C.', 'Bataille de Salamine', 'Victoire navale grecque', 'Antiquité', 8),
('patrimoine-grec', 'Grèce', -447, '447 av. J.-C.', 'Construction du Parthénon', 'Début de la construction du Parthénon', 'Antiquité', 10),
('patrimoine-grec', 'Grèce', -336, '336 av. J.-C.', 'Alexandre le Grand', 'Début du règne d''Alexandre le Grand', 'Antiquité', 10),
('patrimoine-grec', 'Grèce', -323, '323 av. J.-C.', 'Mort d''Alexandre', 'Mort d''Alexandre et début de l''époque hellénistique', 'Antiquité', 9),

-- Rome antique
('patrimoine-romain', 'Rome', -753, '753 av. J.-C.', 'Fondation de Rome', 'Fondation légendaire de Rome', 'Antiquité', 9),
('patrimoine-romain', 'Rome', -509, '509 av. J.-C.', 'République romaine', 'Début de la République romaine', 'Antiquité', 8),
('patrimoine-romain', 'Rome', -264, '264 av. J.-C.', 'Guerres puniques', 'Début des guerres puniques', 'Antiquité', 8),
('patrimoine-romain', 'Rome', -49, '49 av. J.-C.', 'César traverse le Rubicon', 'Début de la guerre civile', 'Antiquité', 9),
('patrimoine-romain', 'Rome', -44, '44 av. J.-C.', 'Assassinat de César', 'Mort de Jules César', 'Antiquité', 9),
('patrimoine-romain', 'Rome', -27, '27 av. J.-C.', 'Empire romain', 'Auguste devient empereur', 'Antiquité', 10),
('patrimoine-romain', 'Rome', 80, '80 ap. J.-C.', 'Inauguration du Colisée', 'Ouverture du Colisée', 'Antiquité', 9),
('patrimoine-romain', 'Rome', 476, '476 ap. J.-C.', 'Chute de l''Empire romain d''Occident', 'Fin de l''Empire romain d''Occident', 'Antiquité', 10);

-- Activer RLS
ALTER TABLE public.historical_events ENABLE ROW LEVEL SECURITY;

-- Politique RLS pour permettre la lecture publique
CREATE POLICY "Les événements historiques sont visibles par tous" ON public.historical_events FOR SELECT USING (true);

-- Politique RLS pour permettre aux admins de gérer les événements
CREATE POLICY "Seuls les admins peuvent modifier les événements historiques" ON public.historical_events FOR ALL USING (is_admin());

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_historical_events_collection_slug ON public.historical_events(collection_slug);
CREATE INDEX IF NOT EXISTS idx_historical_events_year ON public.historical_events(year);
CREATE INDEX IF NOT EXISTS idx_historical_events_culture_region ON public.historical_events(culture_region);
