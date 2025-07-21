-- Assigner le symbole Kolovrat à la collection monde-slave
INSERT INTO collection_symbols (collection_id, symbol_id)
SELECT 
  (SELECT id FROM collections WHERE slug = 'monde-slave'),
  (SELECT id FROM symbols WHERE name = 'Kolovrat')
WHERE NOT EXISTS (
  SELECT 1 FROM collection_symbols cs
  JOIN collections c ON cs.collection_id = c.id
  JOIN symbols s ON cs.symbol_id = s.id
  WHERE c.slug = 'monde-slave' AND s.name = 'Kolovrat'
);

-- Ajouter quelques événements historiques pour la région slave
INSERT INTO historical_events (collection_slug, culture_region, year, date_text, event_name, description, period_category, importance_level)
VALUES 
  ('monde-slave', 'Monde Slave', 863, '863 après J.-C.', 'Mission de Cyrille et Méthode', 'Création de l''alphabet cyrillique et christianisation des Slaves', 'Moyen Âge', 8),
  ('monde-slave', 'Monde Slave', 988, '988 après J.-C.', 'Baptême de la Rus de Kiev', 'Vladimir Ier adopte le christianisme orthodoxe', 'Moyen Âge', 7),
  ('monde-slave', 'Monde Slave', 1054, '1054 après J.-C.', 'Grand Schisme', 'Séparation entre Église catholique et orthodoxe', 'Moyen Âge', 6),
  ('monde-slave', 'Monde Slave', 1240, '1240 après J.-C.', 'Invasion mongole', 'Destruction de Kiev par les Mongols', 'Moyen Âge', 7);