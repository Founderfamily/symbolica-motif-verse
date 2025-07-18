
-- Ajouter les colonnes profession et company à la table profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS profession TEXT,
ADD COLUMN IF NOT EXISTS company TEXT;
