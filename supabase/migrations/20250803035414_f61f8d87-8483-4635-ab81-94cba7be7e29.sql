-- Vérifier et corriger les relations manquantes IMMÉDIATEMENT
-- D'abord, vérifier si les colonnes existent bien
DO $$ 
BEGIN
    -- Vérifier si la colonne quest_evidence.submitted_by existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'quest_evidence' 
        AND column_name = 'submitted_by'
    ) THEN
        RAISE NOTICE 'Colonne quest_evidence.submitted_by n''existe pas - création nécessaire';
        ALTER TABLE public.quest_evidence ADD COLUMN submitted_by UUID;
    END IF;

    -- Vérifier si la colonne quest_theories.author_id existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'quest_theories' 
        AND column_name = 'author_id'
    ) THEN
        RAISE NOTICE 'Colonne quest_theories.author_id n''existe pas - création nécessaire';
        ALTER TABLE public.quest_theories ADD COLUMN author_id UUID;
    END IF;

    -- Maintenant créer les foreign keys avec des noms explicites
    BEGIN
        ALTER TABLE public.quest_evidence 
        ADD CONSTRAINT quest_evidence_submitted_by_fkey 
        FOREIGN KEY (submitted_by) REFERENCES public.profiles(id);
        RAISE NOTICE 'Foreign key quest_evidence_submitted_by_fkey créée';
    EXCEPTION 
        WHEN duplicate_object THEN 
            RAISE NOTICE 'Foreign key quest_evidence_submitted_by_fkey existe déjà';
        WHEN OTHERS THEN
            RAISE NOTICE 'Erreur création FK quest_evidence: %', SQLERRM;
    END;

    BEGIN
        ALTER TABLE public.quest_theories 
        ADD CONSTRAINT quest_theories_author_id_fkey 
        FOREIGN KEY (author_id) REFERENCES public.profiles(id);
        RAISE NOTICE 'Foreign key quest_theories_author_id_fkey créée';
    EXCEPTION 
        WHEN duplicate_object THEN 
            RAISE NOTICE 'Foreign key quest_theories_author_id_fkey existe déjà';
        WHEN OTHERS THEN
            RAISE NOTICE 'Erreur création FK quest_theories: %', SQLERRM;
    END;
    
    RAISE NOTICE 'Migration des foreign keys terminée';
END $$;