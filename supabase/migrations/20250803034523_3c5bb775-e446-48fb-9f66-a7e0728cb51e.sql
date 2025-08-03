-- Vérifier et corriger les relations manquantes pour quest_theories et quest_evidence avec profiles

-- Ajouter les foreign keys manquantes si elles n'existent pas
DO $$ 
BEGIN
    -- Vérifier si la foreign key pour quest_theories.author_id existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'quest_theories_author_id_fkey' 
        AND table_name = 'quest_theories'
    ) THEN
        ALTER TABLE public.quest_theories 
        ADD CONSTRAINT quest_theories_author_id_fkey 
        FOREIGN KEY (author_id) REFERENCES public.profiles(id);
    END IF;

    -- Vérifier si la foreign key pour quest_evidence.submitted_by existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'quest_evidence_submitted_by_fkey' 
        AND table_name = 'quest_evidence'
    ) THEN
        ALTER TABLE public.quest_evidence 
        ADD CONSTRAINT quest_evidence_submitted_by_fkey 
        FOREIGN KEY (submitted_by) REFERENCES public.profiles(id);
    END IF;
END $$;