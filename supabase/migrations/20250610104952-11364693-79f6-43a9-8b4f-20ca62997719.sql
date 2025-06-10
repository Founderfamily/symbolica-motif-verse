
-- Ajouter le rôle master_explorer à l'enum existant si ce n'est pas déjà fait
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'app_role' AND e.enumlabel = 'master_explorer') THEN
        ALTER TYPE public.app_role ADD VALUE 'master_explorer';
    END IF;
END $$;
