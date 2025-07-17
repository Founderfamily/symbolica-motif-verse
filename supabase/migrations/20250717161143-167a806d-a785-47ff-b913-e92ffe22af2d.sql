-- Ajout des tags manquants pour les symboles identifiés

-- Arabesque
UPDATE public.symbols 
SET tags = ARRAY['Motif', 'Ornemental', 'Islamique', 'Géométrique']
WHERE name = 'Arabesque';

-- Art aborigène australien
UPDATE public.symbols 
SET tags = ARRAY['Ancestral', 'Spirituel', 'Dreamtime', 'Australie']
WHERE name = 'Art aborigène australien';

-- Croix de Brigid
UPDATE public.symbols 
SET tags = ARRAY['Protection', 'Celtique', 'Chrétien', 'Fertilité']
WHERE name = 'Croix de Brigid';

-- Dreamcatcher
UPDATE public.symbols 
SET tags = ARRAY['Protection', 'Rêves', 'Amérindien', 'Rituel']
WHERE name = 'Dreamcatcher';

-- Fleur de Lys
UPDATE public.symbols 
SET tags = ARRAY['Royal', 'Héraldique', 'France', 'Noblesse']
WHERE name = 'Fleur de Lys';

-- Hamsa
UPDATE public.symbols 
SET tags = ARRAY['Protection', 'Mauvais œil', 'Amulette', 'Main']
WHERE name = 'Hamsa';

-- Mandala
UPDATE public.symbols 
SET tags = ARRAY['Méditation', 'Spirituel', 'Géométrique', 'Univers']
WHERE name = 'Mandala';

-- Méandre grec
UPDATE public.symbols 
SET tags = ARRAY['Motif', 'Géométrique', 'Architecture', 'Classique']
WHERE name = 'Méandre grec';

-- Motif aztèque
UPDATE public.symbols 
SET tags = ARRAY['Géométrique', 'Rituels', 'Calendrier', 'Mésoamérique']
WHERE name = 'Motif aztèque';

-- Motif Seigaiha (vagues)
UPDATE public.symbols 
SET tags = ARRAY['Vagues', 'Motif', 'Textile', 'Harmonie']
WHERE name = 'Motif Seigaiha (vagues)';

-- Motif viking
UPDATE public.symbols 
SET tags = ARRAY['Guerrier', 'Runique', 'Dragon', 'Nordique']
WHERE name = 'Motif viking';

-- Nœud celtique
UPDATE public.symbols 
SET tags = ARRAY['Entrelacs', 'Infini', 'Manuscrit', 'Bijoux']
WHERE name = 'Nœud celtique';

-- Om
UPDATE public.symbols 
SET tags = ARRAY['Sacré', 'Mantra', 'Méditation', 'Création']
WHERE name = 'Om';

-- Pétroglyphe maori
UPDATE public.symbols 
SET tags = ARRAY['Gravure', 'Rupestre', 'Narratif', 'Tribal']
WHERE name = 'Pétroglyphe maori';

-- Sashiko
UPDATE public.symbols 
SET tags = ARRAY['Broderie', 'Géométrique', 'Artisanat', 'Réparation']
WHERE name = 'Sashiko';

-- Symboles Adinkra
UPDATE public.symbols 
SET tags = ARRAY['Proverbes', 'Philosophie', 'Funéraire', 'Akan']
WHERE name = 'Symboles Adinkra';

-- Totem
UPDATE public.symbols 
SET tags = ARRAY['Ancestral', 'Clan', 'Mémoire', 'Protecteur']
WHERE name = 'Totem';

-- Triskell
UPDATE public.symbols 
SET tags = ARRAY['Spirales', 'Cyclique', 'Nature', 'Trois']
WHERE name = 'Triskell';

-- Yin et Yang
UPDATE public.symbols 
SET tags = ARRAY['Équilibre', 'Dualité', 'Philosophie', 'Harmonie']
WHERE name = 'Yin et Yang';