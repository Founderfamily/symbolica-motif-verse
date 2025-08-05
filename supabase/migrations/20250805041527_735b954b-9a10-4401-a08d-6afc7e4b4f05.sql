-- Créer une table pour les métadonnées des personnages historiques
CREATE TABLE public.historical_figures_metadata (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quest_id UUID NOT NULL,
  figure_name TEXT NOT NULL,
  figure_role TEXT NOT NULL,
  figure_period TEXT NOT NULL,
  wikipedia_url TEXT,
  wikidata_id TEXT,
  description TEXT,
  image_url TEXT,
  verified_by UUID,
  verified_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  suggested_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Index pour les recherches fréquentes
  UNIQUE(quest_id, figure_name, figure_role)
);

-- Créer les index pour optimiser les performances
CREATE INDEX idx_historical_figures_metadata_quest_id ON public.historical_figures_metadata(quest_id);
CREATE INDEX idx_historical_figures_metadata_status ON public.historical_figures_metadata(status);
CREATE INDEX idx_historical_figures_metadata_suggested_by ON public.historical_figures_metadata(suggested_by);

-- Activer RLS
ALTER TABLE public.historical_figures_metadata ENABLE ROW LEVEL SECURITY;

-- Politique pour la lecture - tous peuvent voir les figures vérifiées
CREATE POLICY "Anyone can view verified historical figures metadata"
  ON public.historical_figures_metadata
  FOR SELECT
  USING (status = 'verified');

-- Politique pour voir ses propres suggestions
CREATE POLICY "Users can view their own suggested figures"
  ON public.historical_figures_metadata
  FOR SELECT
  USING (auth.uid() = suggested_by);

-- Politique pour les admins - accès complet
CREATE POLICY "Admins can manage all historical figures metadata"
  ON public.historical_figures_metadata
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Politique pour suggérer - utilisateurs authentifiés
CREATE POLICY "Authenticated users can suggest historical figures metadata"
  ON public.historical_figures_metadata
  FOR INSERT
  WITH CHECK (auth.uid() = suggested_by);

-- Politique pour modifier ses propres suggestions non encore vérifiées
CREATE POLICY "Users can update their own pending suggestions"
  ON public.historical_figures_metadata
  FOR UPDATE
  USING (auth.uid() = suggested_by AND status = 'pending');

-- Créer une fonction pour automatiquement mettre à jour updated_at
CREATE OR REPLACE FUNCTION public.update_historical_figures_metadata_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger
CREATE TRIGGER update_historical_figures_metadata_updated_at
  BEFORE UPDATE ON public.historical_figures_metadata
  FOR EACH ROW
  EXECUTE FUNCTION public.update_historical_figures_metadata_updated_at();