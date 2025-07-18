
-- Créer la table pour les signalements de modération (commentaires, etc.)
CREATE TABLE IF NOT EXISTS public.symbol_moderation_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_type TEXT NOT NULL, -- 'comment', 'post', etc.
  item_id UUID NOT NULL, -- ID du commentaire/post signalé
  reported_by UUID NOT NULL REFERENCES auth.users(id),
  reason TEXT NOT NULL,
  evidence_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'resolved', 'dismissed'
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer les index pour les performances
CREATE INDEX IF NOT EXISTS idx_symbol_moderation_items_reported_by ON public.symbol_moderation_items(reported_by);
CREATE INDEX IF NOT EXISTS idx_symbol_moderation_items_item_id ON public.symbol_moderation_items(item_id);
CREATE INDEX IF NOT EXISTS idx_symbol_moderation_items_status ON public.symbol_moderation_items(status);

-- Activer RLS
ALTER TABLE public.symbol_moderation_items ENABLE ROW LEVEL SECURITY;

-- Politique pour que les utilisateurs puissent créer des signalements
CREATE POLICY "Users can create moderation reports" 
  ON public.symbol_moderation_items 
  FOR INSERT 
  WITH CHECK (auth.uid() = reported_by);

-- Politique pour que les utilisateurs puissent voir leurs propres signalements
CREATE POLICY "Users can view their own moderation reports" 
  ON public.symbol_moderation_items 
  FOR SELECT 
  USING (auth.uid() = reported_by);

-- Politique pour que les modérateurs/admins puissent tout voir et modifier
CREATE POLICY "Admins can manage all moderation reports" 
  ON public.symbol_moderation_items 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Politique pour que les utilisateurs puissent voir les signalements concernant leurs contenus
CREATE POLICY "Users can view reports about their content" 
  ON public.symbol_moderation_items 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM post_comments pc 
      WHERE pc.id = item_id AND pc.user_id = auth.uid()
    )
  );
