-- Créer la table pour les archives historiques
CREATE TABLE public.historical_archives (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  author TEXT,
  date TEXT,
  source TEXT,
  type TEXT,
  document_url TEXT,
  archive_link TEXT,
  physical_location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Activer RLS
ALTER TABLE public.historical_archives ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
CREATE POLICY "Archives historiques visibles par tous" 
ON public.historical_archives 
FOR SELECT 
USING (true);

CREATE POLICY "Seuls les admins peuvent modifier les archives" 
ON public.historical_archives 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Créer un bucket pour les images d'archives
INSERT INTO storage.buckets (id, name, public) 
VALUES ('historical-archives', 'historical-archives', true);

-- Politiques pour le storage
CREATE POLICY "Admins peuvent uploader des images d'archives" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'historical-archives' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Images d'archives publiques" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'historical-archives');

CREATE POLICY "Admins peuvent mettre à jour les images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'historical-archives' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Admins peuvent supprimer les images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'historical-archives' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION public.update_historical_archives_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_historical_archives_updated_at
BEFORE UPDATE ON public.historical_archives
FOR EACH ROW
EXECUTE FUNCTION public.update_historical_archives_updated_at();

-- Insérer les données de Fontainebleau
INSERT INTO public.historical_archives (title, description, author, date, source, type, document_url, archive_link, physical_location) VALUES
('Plan du château de Fontainebleau', 'Plan détaillé du château royal de Fontainebleau montrant l''évolution architecturale sous différents règnes', 'Architecte royal', '1528-04-15', 'Archives Nationales - O1 1363', 'manuscript', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', 'https://www.siv.archives-nationales.culture.gouv.fr/siv/rechercheconsultation/consultation/ir/consultationIR.action?irId=FRAN_IR_002066', 'Pierrefitte-sur-Seine'),

('Ordonnance royale de François Ier', 'Ordonnance royale établissant les règles de construction et d''aménagement du château de Fontainebleau', 'François Ier', '1530-08-22', 'Archives Nationales - K 73', 'official', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', 'https://www.siv.archives-nationales.culture.gouv.fr/siv/rechercheconsultation/consultation/ir/consultationIR.action?irId=FRAN_IR_002067', 'Pierrefitte-sur-Seine'),

('Inventaire des œuvres d''art', 'Inventaire détaillé des œuvres d''art et mobilier du château sous le règne de Henri II', 'Pierre Bontemps', '1547-03-10', 'Archives Nationales - KK 524', 'inventory', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800', 'https://www.siv.archives-nationales.culture.gouv.fr/siv/rechercheconsultation/consultation/ir/consultationIR.action?irId=FRAN_IR_002068', 'Pierrefitte-sur-Seine'),

('Chronique de la cour', 'Chronique des événements de la cour de France au château de Fontainebleau', 'Pierre de Bourdeille', '1560-12-03', 'Bibliothèque Nationale - Ms. Fr. 20485', 'chronicle', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800', 'https://gallica.bnf.fr/ark:/12148/btv1b84192311', 'Paris'),

('Carte des jardins', 'Carte détaillée des jardins à la française du château de Fontainebleau', 'André Le Nôtre', '1664-06-18', 'Archives Nationales - N III Seine-et-Marne', 'map', 'https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=800', 'https://www.siv.archives-nationales.culture.gouv.fr/siv/rechercheconsultation/consultation/ir/consultationIR.action?irId=FRAN_IR_002069', 'Pierrefitte-sur-Seine'),

('Registre des travaux', 'Registre détaillé des travaux de restauration effectués sous Louis XIV', 'Jules Hardouin-Mansart', '1685-09-14', 'Archives Nationales - O1 1792', 'registry', 'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=800', 'https://www.siv.archives-nationales.culture.gouv.fr/siv/rechercheconsultation/consultation/ir/consultationIR.action?irId=FRAN_IR_002070', 'Pierrefitte-sur-Seine'),

('Mémoire sur les symboles', 'Mémoire détaillé sur la symbolique des décorations et emblèmes royaux du château', 'Père Claude-François Ménestrier', '1694-11-27', 'Archives de la Société des Jésuites', 'memoir', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800', 'https://www.siv.archives-nationales.culture.gouv.fr/siv/rechercheconsultation/consultation/ir/consultationIR.action?irId=FRAN_IR_002071', 'Vanves');