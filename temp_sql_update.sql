
-- Marquer plus de collections comme featured pour avoir un bon affichage
UPDATE collections SET is_featured = true 
WHERE slug IN (
  'culture-egyptienne',
  'culture-chinoise', 
  'culture-celtique',
  'culture-grecque',
  'culture-japonaise',
  'geometrie-sacree',
  'mysteres-anciens',
  'alchimie-medievale'
);
