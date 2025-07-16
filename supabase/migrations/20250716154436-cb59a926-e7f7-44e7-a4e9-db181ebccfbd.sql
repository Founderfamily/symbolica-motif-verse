-- Ajouter un champ sources à la table symbols pour les références externes
ALTER TABLE public.symbols ADD COLUMN sources jsonb DEFAULT '[]'::jsonb;

-- Ajouter un commentaire pour expliquer le champ
COMMENT ON COLUMN public.symbols.sources IS 'Tableau de sources/liens de référence pour aider à la vérification du symbole. Format: [{"title": "Titre", "url": "URL", "type": "article|academic|museum|official"}]';

-- Mettre à jour l'aigle de Reims avec la source France Bleu
UPDATE public.symbols 
SET sources = '[
  {
    "title": "Les mystères de la cathédrale de Reims : l''aigle caché - Episode 10",
    "url": "https://www.francebleu.fr/emissions/les-mysteres-de-la-cathedrale-de-reims/champagne-ardenne/les-mysteres-de-la-cathedrale-de-reims-l-aigle-cache-episode-10",
    "type": "article",
    "description": "France Bleu Champagne-Ardenne - Article sur l''aigle caché de la cathédrale de Reims"
  }
]'::jsonb
WHERE id = '7d3510db-5f3f-448e-83f3-d87cf6397372';