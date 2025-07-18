-- Amélioration du système de sources avec signalement selon les normes internationales

-- Ajouter des colonnes pour les types de signalement et validation
ALTER TABLE public.symbol_sources 
ADD COLUMN reliability_tier INTEGER DEFAULT 3 CHECK (reliability_tier BETWEEN 1 AND 4),
ADD COLUMN citation_format TEXT,
ADD COLUMN doi TEXT,
ADD COLUMN isbn TEXT,
ADD COLUMN archive_url TEXT,
ADD COLUMN verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'disputed', 'rejected')),
ADD COLUMN verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN expert_verified BOOLEAN DEFAULT false;

-- Créer une table pour les types de signalement
CREATE TABLE public.source_report_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  severity_level INTEGER DEFAULT 1 CHECK (severity_level BETWEEN 1 AND 4),
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insérer les catégories de signalement standard
INSERT INTO public.source_report_categories (name, description, severity_level, icon) VALUES
('inaccurate', 'Source inexacte ou fausse', 4, 'AlertTriangle'),
('unreliable', 'Source peu fiable', 3, 'AlertCircle'),
('incomplete_citation', 'Citation incomplète', 2, 'FileText'),
('access_issue', 'Lien cassé ou inaccessible', 2, 'LinkOff'),
('bias', 'Source biaisée ou partiale', 3, 'Scale'),
('outdated', 'Information périmée', 2, 'Clock'),
('plagiarism', 'Plagiat ou contenu copié', 4, 'Copy'),
('spam', 'Contenu publicitaire ou spam', 3, 'Ban');

-- Créer une table pour les signalements de sources
CREATE TABLE public.symbol_source_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id UUID NOT NULL REFERENCES public.symbol_sources(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  category_id UUID NOT NULL REFERENCES public.source_report_categories(id),
  reason TEXT,
  evidence_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Créer une table pour les actions demandées sur les sources
CREATE TABLE public.source_action_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id UUID NOT NULL REFERENCES public.symbol_sources(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('complete_citation', 'add_doi', 'verify_expert', 'add_alternative', 'archive_backup')),
  description TEXT,
  priority INTEGER DEFAULT 2 CHECK (priority BETWEEN 1 AND 3),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'dismissed')),
  assigned_to UUID,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Créer une table pour l'historique des validations
CREATE TABLE public.source_validation_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id UUID NOT NULL REFERENCES public.symbol_sources(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  old_status TEXT,
  new_status TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activer RLS sur les nouvelles tables
ALTER TABLE public.source_report_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symbol_source_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_action_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_validation_history ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour source_report_categories
CREATE POLICY "Tous peuvent voir les catégories" ON public.source_report_categories
  FOR SELECT USING (true);

-- Politiques RLS pour symbol_source_reports
CREATE POLICY "Utilisateurs peuvent créer des signalements" ON public.symbol_source_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilisateurs peuvent voir les signalements" ON public.symbol_source_reports
  FOR SELECT USING (true);

CREATE POLICY "Modérateurs peuvent mettre à jour les signalements" ON public.symbol_source_reports
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
    OR auth.uid() = user_id
  );

-- Politiques RLS pour source_action_requests
CREATE POLICY "Utilisateurs peuvent créer des demandes d'action" ON public.source_action_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilisateurs peuvent voir les demandes d'action" ON public.source_action_requests
  FOR SELECT USING (true);

CREATE POLICY "Utilisateurs peuvent mettre à jour leurs demandes" ON public.source_action_requests
  FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = assigned_to);

-- Politiques RLS pour source_validation_history
CREATE POLICY "Utilisateurs peuvent créer l'historique" ON public.source_validation_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Tous peuvent voir l'historique" ON public.source_validation_history
  FOR SELECT USING (true);

-- Fonction pour mettre à jour automatiquement l'historique
CREATE OR REPLACE FUNCTION public.log_source_validation_change()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.source_validation_history (source_id, user_id, action, old_status, new_status, notes)
  VALUES (
    NEW.id,
    auth.uid(),
    'status_change',
    OLD.verification_status,
    NEW.verification_status,
    CASE 
      WHEN NEW.verification_status = 'verified' THEN 'Source verified'
      WHEN NEW.verification_status = 'disputed' THEN 'Source disputed'
      WHEN NEW.verification_status = 'rejected' THEN 'Source rejected'
      ELSE 'Status updated'
    END
  );
  
  IF NEW.verification_status = 'verified' AND OLD.verification_status != 'verified' THEN
    NEW.verified_at = now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger pour l'historique
CREATE TRIGGER source_validation_history_trigger
  BEFORE UPDATE ON public.symbol_sources
  FOR EACH ROW
  WHEN (OLD.verification_status IS DISTINCT FROM NEW.verification_status)
  EXECUTE FUNCTION public.log_source_validation_change();

-- Ajouter des commentaires pour documenter les nouvelles colonnes
COMMENT ON COLUMN public.symbol_sources.reliability_tier IS 'Niveau de fiabilité: 1=Très fiable, 2=Fiable, 3=Acceptable, 4=Peu fiable';
COMMENT ON COLUMN public.symbol_sources.verification_status IS 'Statut de vérification: pending, verified, disputed, rejected';
COMMENT ON COLUMN public.symbol_sources.expert_verified IS 'Source vérifiée par un expert du domaine';