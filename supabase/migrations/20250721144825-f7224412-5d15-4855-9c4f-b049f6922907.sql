-- Assigner les symboles persans à la collection perse-iranienne
INSERT INTO collection_symbols (collection_id, symbol_id)
SELECT 
  (SELECT id FROM collections WHERE slug = 'perse-iranienne'),
  s.id
FROM symbols s
WHERE s.culture = 'Perse'
  AND s.name IN ('Faravahar', 'Lion et Soleil', 'Simurgh', 'Homa', 'Cyrus cylindre', 'Rosette persane');

-- Assigner les symboles océaniens à la collection oceanie-pacifique
INSERT INTO collection_symbols (collection_id, symbol_id)
SELECT 
  (SELECT id FROM collections WHERE slug = 'oceanie-pacifique'),
  s.id
FROM symbols s
WHERE s.culture IN ('Polynésienne', 'Maorie', 'Océanienne')
  AND s.name IN ('Tiki', 'Hameçon maori', 'Tortue polynésienne', 'Spirale maorie', 'Masque tapa', 'Pirogue sacrée');

-- Assigner les symboles médiévaux à la collection europe-medievale
INSERT INTO collection_symbols (collection_id, symbol_id)
SELECT 
  (SELECT id FROM collections WHERE slug = 'europe-medievale'),
  s.id
FROM symbols s
WHERE s.culture IN ('Celte médiévale', 'Française médiévale', 'Européenne médiévale', 'Irlandaise médiévale', 'Galloise médiévale')
  AND s.name IN ('Croix celtique', 'Fleur de lys', 'Aigle bicéphale', 'Rose des vents', 'Trèfle irlandais', 'Dragon gallois');