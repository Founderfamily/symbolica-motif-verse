-- Supprimer les collections vides et leurs traductions
-- Identifier et supprimer les collections qui n'ont aucun symbole associé

-- D'abord, supprimer les traductions des collections vides
DELETE FROM collection_translations 
WHERE collection_id IN (
  SELECT c.id 
  FROM collections c 
  LEFT JOIN collection_symbols cs ON c.id = cs.collection_id 
  WHERE cs.collection_id IS NULL
);

-- Ensuite, supprimer les collections vides elles-mêmes
DELETE FROM collections 
WHERE id IN (
  SELECT c.id 
  FROM collections c 
  LEFT JOIN collection_symbols cs ON c.id = cs.collection_id 
  WHERE cs.collection_id IS NULL
);

-- Vérification : Compter les collections restantes
-- Cette requête doit retourner environ 23 collections (54 - 31 = 23)
SELECT 
  COUNT(*) as collections_restantes,
  (SELECT COUNT(*) FROM collection_symbols) as associations_symboles,
  (SELECT COUNT(DISTINCT symbol_id) FROM collection_symbols) as symboles_dans_collections
FROM collections;