-- Correction complète des tags pour tous les symboles en fonction de leur contenu

-- Adi Shakti
UPDATE public.symbols 
SET tags = ARRAY['Hindouisme', 'Déesse', 'Énergie', 'Création', 'Féminin']
WHERE name = 'Adi Shakti';

-- Aigle de Reims caché
UPDATE public.symbols 
SET tags = ARRAY['Héraldique', 'Royal', 'Cathédrale', 'France', 'Monarchie']
WHERE name = 'Aigle de Reims caché';

-- Akan Goldweight (Abrammuo)
UPDATE public.symbols 
SET tags = ARRAY['Or', 'Commerce', 'Proverbes', 'Afrique Ouest', 'Akan']
WHERE name = 'Akan Goldweight (Abrammuo)';

-- Arabesque
UPDATE public.symbols 
SET tags = ARRAY['Islamique', 'Géométrique', 'Ornemental', 'Architecture', 'Calligraphie']
WHERE name = 'Arabesque';

-- Art aborigène
UPDATE public.symbols 
SET tags = ARRAY['Dreamtime', 'Spirituel', 'Ancestral', 'Australie', 'Peinture']
WHERE name = 'Art aborigène';

-- Awen
UPDATE public.symbols 
SET tags = ARRAY['Druidique', 'Inspiration', 'Celtique', 'Spirituel', 'Gallois']
WHERE name = 'Awen';

-- Bâton de Tohono O'odham
UPDATE public.symbols 
SET tags = ARRAY['Amérindien', 'Rituel', 'Astronomie', 'Désert', 'Cérémonie']
WHERE name = 'Bâton de Tohono O''odham';

-- Blason des Comtes de Champagne
UPDATE public.symbols 
SET tags = ARRAY['Héraldique', 'Noblesse', 'Fleur de lys', 'Champagne', 'Médiéval']
WHERE name = 'Blason des Comtes de Champagne';

-- Blason des Comtes de Foix
UPDATE public.symbols 
SET tags = ARRAY['Héraldique', 'Blason', 'Noblesse', 'Gascogne', 'Médiéval']
WHERE name = 'Blason des Comtes de Foix';

-- Boli
UPDATE public.symbols 
SET tags = ARRAY['Animisme', 'Rituel', 'Afrique Ouest', 'Société secrète', 'Bamana']
WHERE name = 'Boli';

-- Boule de Niort
UPDATE public.symbols 
SET tags = ARRAY['Architecture', 'Sculpture', 'Poitou', 'Artisanat', 'Pierre']
WHERE name = 'Boule de Niort';

-- Caducée de Montpellier
UPDATE public.symbols 
SET tags = ARRAY['Médical', 'Serpent', 'Héraldique', 'Montpellier', 'Guérison']
WHERE name = 'Caducée de Montpellier';

-- Chakana
UPDATE public.symbols 
SET tags = ARRAY['Inca', 'Cosmologie', 'Croix', 'Andes', 'Sacré']
WHERE name = 'Chakana';

-- Chêne des Druides
UPDATE public.symbols 
SET tags = ARRAY['Druidique', 'Arbre', 'Sacré', 'Gaulois', 'Nature']
WHERE name = 'Chêne des Druides';

-- Chêne des Druides de Tronçais
UPDATE public.symbols 
SET tags = ARRAY['Druidique', 'Forêt', 'Sacré', 'Bourbonnais', 'Arbre']
WHERE name = 'Chêne des Druides de Tronçais';

-- Chêne des Druides de Tronjoly
UPDATE public.symbols 
SET tags = ARRAY['Druidique', 'Bretagne', 'Forêt', 'Brocéliande', 'Sacré']
WHERE name = 'Chêne des Druides de Tronjoly';

-- Chêne des Sorcières
UPDATE public.symbols 
SET tags = ARRAY['Sorcellerie', 'Folklore', 'Bretagne', 'Paganisme', 'Arbre']
WHERE name = 'Chêne des Sorcières';

-- Cheval Bayard
UPDATE public.symbols 
SET tags = ARRAY['Légende', 'Cheval', 'Ardennes', 'Héroïsme', 'Épopée']
WHERE name = 'Cheval Bayard';

-- Chèvre d'Or des Baux-de-Provence
UPDATE public.symbols 
SET tags = ARRAY['Légende', 'Trésor', 'Provence', 'Fées', 'Or']
WHERE name = 'Chèvre d''Or des Baux-de-Provence';

-- Churinga
UPDATE public.symbols 
SET tags = ARRAY['Australie', 'Sacré', 'Ancestral', 'Totémisme', 'Aranda']
WHERE name = 'Churinga';

-- Compas du Compagnon Charpentier
UPDATE public.symbols 
SET tags = ARRAY['Compagnonnage', 'Artisanat', 'Charpentier', 'Précision', 'Outil']
WHERE name = 'Compas du Compagnon Charpentier';

-- Coq de Barcelonette
UPDATE public.symbols 
SET tags = ARRAY['Coq', 'Ubaye', 'Clocher', 'Vigilance', 'Identité']
WHERE name = 'Coq de Barcelonette';

-- Coq Gaulois
UPDATE public.symbols 
SET tags = ARRAY['Gaulois', 'Fierté', 'Résistance', 'Oiseau', 'Identité']
WHERE name = 'Coq Gaulois';

-- Croc de Gargantua
UPDATE public.symbols 
SET tags = ARRAY['Géant', 'Normandie', 'Folklore', 'Légende', 'Fossile']
WHERE name = 'Croc de Gargantua';

-- Croix de Brigid
UPDATE public.symbols 
SET tags = ARRAY['Celtique', 'Protection', 'Chrétien', 'Irlande', 'Tressage']
WHERE name = 'Croix de Brigid';

-- Croix de Camargue
UPDATE public.symbols 
SET tags = ARRAY['Christianisme', 'Camargue', 'Provence', 'Croix', 'Pastoral']
WHERE name = 'Croix de Camargue';

-- Croix de Charavines
UPDATE public.symbols 
SET tags = ARRAY['Christianisme', 'Dauphiné', 'Pierre', 'Architecture', 'Religieux']
WHERE name = 'Croix de Charavines';

-- Croix de Lorraine
UPDATE public.symbols 
SET tags = ARRAY['Résistance', 'France Libre', 'Lorraine', 'Croix', 'Guerre']
WHERE name = 'Croix de Lorraine';

-- Dangun
UPDATE public.symbols 
SET tags = ARRAY['Corée', 'Fondation', 'Mythologie', 'Chamanisme', 'Roi']
WHERE name = 'Dangun';

-- Disque de Phaistos
UPDATE public.symbols 
SET tags = ARRAY['Minoen', 'Mystère', 'Écriture', 'Crète', 'Archéologie']
WHERE name = 'Disque de Phaistos';

-- Double Hache Minoenne
UPDATE public.symbols 
SET tags = ARRAY['Minoen', 'Labrys', 'Religion', 'Pouvoir', 'Bronze']
WHERE name = 'Double Hache Minoenne';

-- Drac de Valence
UPDATE public.symbols 
SET tags = ARRAY['Dragon', 'Rhône', 'Folklore', 'Dauphiné', 'Monstre']
WHERE name = 'Drac de Valence';

-- Dreamcatcher
UPDATE public.symbols 
SET tags = ARRAY['Amérindien', 'Protection', 'Rêves', 'Ojibwé', 'Rituel']
WHERE name = 'Dreamcatcher';

-- Fleur de Lys
UPDATE public.symbols 
SET tags = ARRAY['Royal', 'France', 'Héraldique', 'Monarchie', 'Lys']
WHERE name = 'Fleur de Lys';

-- Fleur de Lys Dauphinoise
UPDATE public.symbols 
SET tags = ARRAY['Dauphiné', 'Lys', 'Héraldique', 'Régional', 'Médiéval']
WHERE name = 'Fleur de Lys Dauphinoise';

-- Graoully
UPDATE public.symbols 
SET tags = ARRAY['Dragon', 'Metz', 'Christianisme', 'Légende', 'Lorraine']
WHERE name = 'Graoully';

-- Hacha
UPDATE public.symbols 
SET tags = ARRAY['Maya', 'Jade', 'Hache', 'Cérémonie', 'Mésoamérique']
WHERE name = 'Hacha';

-- Hamsa
UPDATE public.symbols 
SET tags = ARRAY['Protection', 'Main', 'Mauvais œil', 'Amulette', 'Orient']
WHERE name = 'Hamsa';

-- Hathorique
UPDATE public.symbols 
SET tags = ARRAY['Égypte', 'Hathor', 'Déesse', 'Vache', 'Féminin']
WHERE name = 'Hathorique';

-- Hermine
UPDATE public.symbols 
SET tags = ARRAY['Bretagne', 'Animal', 'Pureté', 'Noblesse', 'Héraldique']
WHERE name = 'Hermine';

-- Huchuetl
UPDATE public.symbols 
SET tags = ARRAY['Aztèque', 'Tambour', 'Musique', 'Rituel', 'Mésoamérique']
WHERE name = 'Huchuetl';

-- Huma
UPDATE public.symbols 
SET tags = ARRAY['Ottoman', 'Oiseau', 'Feu', 'Mythologie', 'Sultan']
WHERE name = 'Huma';

-- Kolovrat
UPDATE public.symbols 
SET tags = ARRAY['Slave', 'Solaire', 'Roue', 'Païen', 'Cyclique']
WHERE name = 'Kolovrat';

-- Lion de Belfort
UPDATE public.symbols 
SET tags = ARRAY['Lion', 'Résistance', 'Belfort', 'Monument', 'Guerre']
WHERE name = 'Lion de Belfort';

-- Lion des Flandres
UPDATE public.symbols 
SET tags = ARRAY['Flandre', 'Lion', 'Héraldique', 'Comté', 'Belgique']
WHERE name = 'Lion des Flandres';

-- Mandala
UPDATE public.symbols 
SET tags = ARRAY['Spirituel', 'Méditation', 'Géométrique', 'Bouddhisme', 'Univers']
WHERE name = 'Mandala';

-- Marteau de Vulcain
UPDATE public.symbols 
SET tags = ARRAY['Vulcain', 'Forge', 'Artisanat', 'Bretagne', 'Mythologie']
WHERE name = 'Marteau de Vulcain';

-- Méandre grec
UPDATE public.symbols 
SET tags = ARRAY['Grec', 'Géométrique', 'Infini', 'Architecture', 'Motif']
WHERE name = 'Méandre grec';

-- Mélusine
UPDATE public.symbols 
SET tags = ARRAY['Sirène', 'Folklore', 'Poitou', 'Femme', 'Légende']
WHERE name = 'Mélusine';

-- Meule de Saint-Symphorien
UPDATE public.symbols 
SET tags = ARRAY['Moulin', 'Agriculture', 'Artisanat', 'Pierre', 'Médiéval']
WHERE name = 'Meule de Saint-Symphorien';

-- Motif aztèque
UPDATE public.symbols 
SET tags = ARRAY['Aztèque', 'Géométrique', 'Calendrier', 'Rituels', 'Mésoamérique']
WHERE name = 'Motif aztèque';

-- Motif Seigaiha
UPDATE public.symbols 
SET tags = ARRAY['Japonais', 'Vagues', 'Textile', 'Harmonie', 'Seigaiha']
WHERE name = 'Motif Seigaiha';

-- Motif viking
UPDATE public.symbols 
SET tags = ARRAY['Viking', 'Nordique', 'Guerrier', 'Entrelacs', 'Dragon']
WHERE name = 'Motif viking';

-- Nœud celtique
UPDATE public.symbols 
SET tags = ARRAY['Celtique', 'Entrelacs', 'Infini', 'Manuscrit', 'Éternité']
WHERE name = 'Nœud celtique';

-- Nœud de Salomon
UPDATE public.symbols 
SET tags = ARRAY['Salomon', 'Protection', 'Entrelacs', 'Éternité', 'Géométrique']
WHERE name = 'Nœud de Salomon';

-- Om
UPDATE public.symbols 
SET tags = ARRAY['Hindouisme', 'Mantra', 'Sacré', 'Méditation', 'Son']
WHERE name = 'Om';

-- Ouroboros
UPDATE public.symbols 
SET tags = ARRAY['Serpent', 'Cycle', 'Éternité', 'Égypte', 'Infini']
WHERE name = 'Ouroboros';

-- Pétroglyph Maori
UPDATE public.symbols 
SET tags = ARRAY['Maori', 'Gravure', 'Spirale', 'Nouvelle-Zélande', 'Ancestral']
WHERE name = 'Pétroglyph Maori';

-- Poulain de Pézenas
UPDATE public.symbols 
SET tags = ARRAY['Poulain', 'Pézenas', 'Folklore', 'Procession', 'Totémique']
WHERE name = 'Poulain de Pézenas';

-- Poulette Noire de Bresse
UPDATE public.symbols 
SET tags = ARRAY['Bresse', 'Poule', 'Gastronomie', 'Terroir', 'AOC']
WHERE name = 'Poulette Noire de Bresse';

-- Quetzalcoatl
UPDATE public.symbols 
SET tags = ARRAY['Aztèque', 'Serpent', 'Plumes', 'Divinité', 'Mésoamérique']
WHERE name = 'Quetzalcoatl';

-- Quincunx
UPDATE public.symbols 
SET tags = ARRAY['Romain', 'Géométrie', 'Sacré', 'Urbanisme', 'Cosmologie']
WHERE name = 'Quincunx';

-- Rhombe des Aborigènes d'Australie
UPDATE public.symbols 
SET tags = ARRAY['Australie', 'Aborigène', 'Son', 'Rituel', 'Initiation']
WHERE name = 'Rhombe des Aborigènes d''Australie';

-- Roue de Sainte-Foy
UPDATE public.symbols 
SET tags = ARRAY['Chrétien', 'Roue', 'Sainte-Foy', 'Cycle', 'Aquitaine']
WHERE name = 'Roue de Sainte-Foy';

-- Salamandre de François Ier
UPDATE public.symbols 
SET tags = ARRAY['François Ier', 'Salamandre', 'Royal', 'Renaissance', 'Feu']
WHERE name = 'Salamandre de François Ier';

-- Sankofa
UPDATE public.symbols 
SET tags = ARRAY['Akan', 'Mémoire', 'Oiseau', 'Proverbe', 'Afrique']
WHERE name = 'Sankofa';

-- Sashiko
UPDATE public.symbols 
SET tags = ARRAY['Japonais', 'Broderie', 'Géométrique', 'Réparation', 'Textile']
WHERE name = 'Sashiko';

-- Scarabée sacré
UPDATE public.symbols 
SET tags = ARRAY['Égypte', 'Scarabée', 'Renaissance', 'Solaire', 'Amulette']
WHERE name = 'Scarabée sacré';

-- Sceau des Ducs de Bourgogne
UPDATE public.symbols 
SET tags = ARRAY['Bourgogne', 'Sceau', 'Duc', 'Héraldique', 'Médiéval']
WHERE name = 'Sceau des Ducs de Bourgogne';

-- Sema
UPDATE public.symbols 
SET tags = ARRAY['Égypte', 'Union', 'Hiéroglyphe', 'Papyrus', 'Lotus']
WHERE name = 'Sema';

-- Semeuse de Libourne
UPDATE public.symbols 
SET tags = ARRAY['Agriculture', 'Semeuse', 'Libourne', 'Travail', 'Femme']
WHERE name = 'Semeuse de Libourne';

-- Shenou
UPDATE public.symbols 
SET tags = ARRAY['Égypte', 'Éternité', 'Protection', 'Cartouche', 'Royal']
WHERE name = 'Shenou';

-- Shou
UPDATE public.symbols 
SET tags = ARRAY['Chine', 'Longévité', 'Calligraphie', 'Fortune', 'Caractère']
WHERE name = 'Shou';

-- Shrivatsa
UPDATE public.symbols 
SET tags = ARRAY['Bouddhisme', 'Nœud', 'Bouddha', 'Spirituel', 'Infini']
WHERE name = 'Shrivatsa';

-- Srivatsa
UPDATE public.symbols 
SET tags = ARRAY['Hindouisme', 'Vishnou', 'Prospérité', 'Lakshmi', 'Nœud']
WHERE name = 'Srivatsa';

-- Symbole Adinkra
UPDATE public.symbols 
SET tags = ARRAY['Adinkra', 'Akan', 'Proverbe', 'Ghana', 'Philosophie']
WHERE name = 'Symbole Adinkra';

-- Tarasque
UPDATE public.symbols 
SET tags = ARRAY['Tarasque', 'Dragon', 'Provence', 'Monstre', 'Légende']
WHERE name = 'Tarasque';

-- Tigre à dents de sabre
UPDATE public.symbols 
SET tags = ARRAY['Préhistoire', 'Smilodon', 'Félin', 'Amérique', 'Fossile']
WHERE name = 'Tigre à dents de sabre';

-- Tjurunga
UPDATE public.symbols 
SET tags = ARRAY['Australie', 'Aborigène', 'Sacré', 'Aranda', 'Totémique']
WHERE name = 'Tjurunga';

-- Toile de Jouy
UPDATE public.symbols 
SET tags = ARRAY['Textile', 'Toile', 'Jouy', 'Artisanat', 'Français']
WHERE name = 'Toile de Jouy';

-- Totem
UPDATE public.symbols 
SET tags = ARRAY['Amérindien', 'Totem', 'Ancestral', 'Clan', 'Sculpture']
WHERE name = 'Totem';

-- Triskell celtique
UPDATE public.symbols 
SET tags = ARRAY['Celtique', 'Spirale', 'Triskell', 'Trois', 'Bretagne']
WHERE name = 'Triskell celtique';

-- Truie de Dol
UPDATE public.symbols 
SET tags = ARRAY['Truie', 'Dol', 'Fertilité', 'Bretagne', 'Païen']
WHERE name = 'Truie de Dol';

-- Tumi
UPDATE public.symbols 
SET tags = ARRAY['Pérou', 'Moche', 'Couteau', 'Or', 'Rituel']
WHERE name = 'Tumi';

-- Uraeus
UPDATE public.symbols 
SET tags = ARRAY['Égypte', 'Cobra', 'Royal', 'Protection', 'Pharaon']
WHERE name = 'Uraeus';

-- Yin et Yang
UPDATE public.symbols 
SET tags = ARRAY['Chinois', 'Équilibre', 'Dualité', 'Tao', 'Harmonie']
WHERE name = 'Yin et Yang';

-- Zibu (Adinkra)
UPDATE public.symbols 
SET tags = ARRAY['Adinkra', 'Destinée', 'Ghana', 'Akan', 'Étoile']
WHERE name = 'Zibu' AND culture LIKE '%Adinkra%';

-- Zibu (Zapotèque)  
UPDATE public.symbols 
SET tags = ARRAY['Zapotèque', 'Mésoamérique', 'Cosmologie', 'Glyphe', 'Oaxaca']
WHERE name = 'Zibu' AND culture LIKE '%Zapotèque%';