-- Supprimer l'assignation incorrecte du Caducée de Montpellier à la collection Japon traditionnel
DELETE FROM collection_symbols 
WHERE collection_id = (SELECT id FROM collections WHERE slug = 'japon-traditionnel')
  AND symbol_id = (SELECT id FROM symbols WHERE name = 'Caducée de Montpellier');

-- Vérifier si le Caducée de Montpellier devrait être dans une collection française
-- L'ajouter à la collection patrimoine-francais s'il n'y est pas déjà
INSERT INTO collection_symbols (collection_id, symbol_id)
SELECT 
  (SELECT id FROM collections WHERE slug = 'patrimoine-francais'),
  (SELECT id FROM symbols WHERE name = 'Caducée de Montpellier')
WHERE NOT EXISTS (
  SELECT 1 FROM collection_symbols cs
  JOIN collections c ON cs.collection_id = c.id
  JOIN symbols s ON cs.symbol_id = s.id
  WHERE c.slug = 'patrimoine-francais' AND s.name = 'Caducée de Montpellier'
);