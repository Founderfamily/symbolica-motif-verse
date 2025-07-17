-- Ajouter les contraintes de clés étrangères avec CASCADE pour les suppressions de symboles

-- 1. symbol_images : ajouter contrainte FK avec CASCADE
ALTER TABLE public.symbol_images 
ADD CONSTRAINT fk_symbol_images_symbol_id 
FOREIGN KEY (symbol_id) REFERENCES public.symbols(id) ON DELETE CASCADE;

-- 2. symbol_verifications : ajouter contrainte FK avec CASCADE  
ALTER TABLE public.symbol_verifications 
ADD CONSTRAINT fk_symbol_verifications_symbol_id 
FOREIGN KEY (symbol_id) REFERENCES public.symbols(id) ON DELETE CASCADE;

-- 3. symbol_verification_community : ajouter contrainte FK avec CASCADE
ALTER TABLE public.symbol_verification_community 
ADD CONSTRAINT fk_symbol_verification_community_symbol_id 
FOREIGN KEY (symbol_id) REFERENCES public.symbols(id) ON DELETE CASCADE;

-- 4. symbol_connections : ajouter contraintes FK avec CASCADE pour les deux références
ALTER TABLE public.symbol_connections 
ADD CONSTRAINT fk_symbol_connections_symbol_id_1 
FOREIGN KEY (symbol_id_1) REFERENCES public.symbols(id) ON DELETE CASCADE;

ALTER TABLE public.symbol_connections 
ADD CONSTRAINT fk_symbol_connections_symbol_id_2 
FOREIGN KEY (symbol_id_2) REFERENCES public.symbols(id) ON DELETE CASCADE;

-- 5. collection_symbols : ajouter contrainte FK avec CASCADE
ALTER TABLE public.collection_symbols 
ADD CONSTRAINT fk_collection_symbols_symbol_id 
FOREIGN KEY (symbol_id) REFERENCES public.symbols(id) ON DELETE CASCADE;

-- 6. symbol_taxonomy_mapping : ajouter contrainte FK avec CASCADE
ALTER TABLE public.symbol_taxonomy_mapping 
ADD CONSTRAINT fk_symbol_taxonomy_mapping_symbol_id 
FOREIGN KEY (symbol_id) REFERENCES public.symbols(id) ON DELETE CASCADE;

-- 7. symbol_locations : ajouter contrainte FK avec CASCADE
ALTER TABLE public.symbol_locations 
ADD CONSTRAINT fk_symbol_locations_symbol_id 
FOREIGN KEY (symbol_id) REFERENCES public.symbols(id) ON DELETE CASCADE;

-- 8. Fonction de suppression en cascade avec mode dry_run
CREATE OR REPLACE FUNCTION public.delete_symbol_cascade(
  p_symbol_id UUID,
  p_admin_id UUID,
  p_dry_run BOOLEAN DEFAULT TRUE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deletion_report JSONB;
  symbol_record RECORD;
  images_count INTEGER;
  verifications_count INTEGER;
  community_comments_count INTEGER;
  connections_count INTEGER;
  collection_refs_count INTEGER;
  taxonomy_refs_count INTEGER;
  locations_count INTEGER;
  storage_files TEXT[];
  file_path TEXT;
BEGIN
  -- Vérifier que l'admin a les permissions
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_admin_id AND is_admin = true) THEN
    RAISE EXCEPTION 'Insufficient permissions';
  END IF;
  
  -- Vérifier que le symbole existe
  SELECT * FROM public.symbols WHERE id = p_symbol_id INTO symbol_record;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Symbol not found';
  END IF;
  
  -- Compter les éléments à supprimer
  SELECT COUNT(*) FROM public.symbol_images WHERE symbol_id = p_symbol_id INTO images_count;
  SELECT COUNT(*) FROM public.symbol_verifications WHERE symbol_id = p_symbol_id INTO verifications_count;
  SELECT COUNT(*) FROM public.symbol_verification_community WHERE symbol_id = p_symbol_id INTO community_comments_count;
  SELECT COUNT(*) FROM public.symbol_connections WHERE symbol_id_1 = p_symbol_id OR symbol_id_2 = p_symbol_id INTO connections_count;
  SELECT COUNT(*) FROM public.collection_symbols WHERE symbol_id = p_symbol_id INTO collection_refs_count;
  SELECT COUNT(*) FROM public.symbol_taxonomy_mapping WHERE symbol_id = p_symbol_id INTO taxonomy_refs_count;
  SELECT COUNT(*) FROM public.symbol_locations WHERE symbol_id = p_symbol_id INTO locations_count;
  
  -- Récupérer les chemins des fichiers de storage à supprimer
  SELECT ARRAY_AGG(image_url) FROM public.symbol_images WHERE symbol_id = p_symbol_id INTO storage_files;
  
  -- Construire le rapport
  deletion_report := jsonb_build_object(
    'symbol_id', p_symbol_id,
    'symbol_name', symbol_record.name,
    'dry_run', p_dry_run,
    'items_to_delete', jsonb_build_object(
      'symbol_images', images_count,
      'symbol_verifications', verifications_count,
      'community_comments', community_comments_count,
      'symbol_connections', connections_count,
      'collection_references', collection_refs_count,
      'taxonomy_mappings', taxonomy_refs_count,
      'symbol_locations', locations_count,
      'storage_files', COALESCE(array_length(storage_files, 1), 0)
    ),
    'storage_files_paths', COALESCE(storage_files, ARRAY[]::TEXT[])
  );
  
  -- Si ce n'est pas un dry run, effectuer les suppressions
  IF NOT p_dry_run THEN
    -- Les contraintes FK avec CASCADE s'occuperont automatiquement des suppressions liées
    -- On supprime juste le symbole principal
    DELETE FROM public.symbols WHERE id = p_symbol_id;
    
    -- Logger l'action
    INSERT INTO public.admin_logs (admin_id, action, entity_type, entity_id, details)
    VALUES (
      p_admin_id,
      'delete_symbol_cascade',
      'symbol',
      p_symbol_id,
      deletion_report
    );
    
    -- Mettre à jour le rapport pour indiquer que la suppression a été effectuée
    deletion_report := jsonb_set(deletion_report, '{executed}', 'true');
  END IF;
  
  RETURN deletion_report;
END;
$$;