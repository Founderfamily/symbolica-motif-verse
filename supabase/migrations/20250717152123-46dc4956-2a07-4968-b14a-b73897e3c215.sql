-- Supprimer la contrainte de clé étrangère dupliquée
ALTER TABLE public.collection_symbols 
DROP CONSTRAINT IF EXISTS collection_symbols_symbol_id_fkey;

-- Vérifier et supprimer d'autres contraintes dupliquées potentielles
ALTER TABLE public.collection_symbols 
DROP CONSTRAINT IF EXISTS collection_symbols_collection_id_fkey;

-- Garder seulement les contraintes avec des noms explicites
-- fk_collection_symbols_symbol_id et fk_collection_symbols_collection_id restent actives