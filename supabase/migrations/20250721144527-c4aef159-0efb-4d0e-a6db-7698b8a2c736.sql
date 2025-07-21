-- Ajouter des symboles slaves typiques pour la collection monde-slave
INSERT INTO symbols (name, culture, period, description) VALUES
('Croix orthodoxe', 'Orthodoxe slave', 'Moyen Âge', 'Symbole du christianisme orthodoxe avec trois barres horizontales'),
('Étoile à huit branches', 'Slave', 'Moyen Âge', 'Symbole traditionnel slave représentant l''harmonie cosmique'),
('Triskel slave', 'Slave', 'Époque païenne', 'Symbole à trois branches représentant les trois mondes slaves'),
('Arbre de vie slave', 'Slave', 'Tradition ancienne', 'Représentation de l''arbre cosmique dans la mythologie slave'),
('Rune slave Zhivete', 'Slave', 'Époque pré-chrétienne', 'Rune représentant la vie et la prospérité');

-- Assigner tous ces symboles à la collection monde-slave
INSERT INTO collection_symbols (collection_id, symbol_id)
SELECT 
  (SELECT id FROM collections WHERE slug = 'monde-slave'),
  s.id
FROM symbols s
WHERE s.culture IN ('Orthodoxe slave', 'Slave')
  AND s.name IN ('Croix orthodoxe', 'Étoile à huit branches', 'Triskel slave', 'Arbre de vie slave', 'Rune slave Zhivete');