
-- Ajouter les colonnes manquantes à la table profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Mettre à jour la colonne updated_at pour refléter les changements
UPDATE public.profiles SET updated_at = now() WHERE updated_at IS NULL;
