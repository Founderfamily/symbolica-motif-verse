-- Ajouter un champ pour marquer l'image par défaut
ALTER TABLE public.symbol_images 
ADD COLUMN is_primary boolean DEFAULT false;

-- Ajouter un index pour améliorer les performances des requêtes
CREATE INDEX idx_symbol_images_primary ON public.symbol_images(symbol_id, is_primary) WHERE is_primary = true;

-- Fonction pour s'assurer qu'il n'y a qu'une seule image principale par symbole
CREATE OR REPLACE FUNCTION ensure_single_primary_image()
RETURNS TRIGGER AS $$
BEGIN
  -- Si la nouvelle image est marquée comme principale
  IF NEW.is_primary = true THEN
    -- Marquer toutes les autres images de ce symbole comme non principales
    UPDATE public.symbol_images 
    SET is_primary = false 
    WHERE symbol_id = NEW.symbol_id 
    AND id != NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger
CREATE TRIGGER trigger_ensure_single_primary_image
  BEFORE INSERT OR UPDATE ON public.symbol_images
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_primary_image();