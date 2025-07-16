-- Corriger l'URL de la source France Bleu pour l'aigle de Reims
UPDATE public.symbols 
SET sources = jsonb_set(
  sources,
  '{0,url}',
  '"https://www.francebleu.fr/culture/patrimoine/les-mysteres-de-la-cathedrale-de-reims-l-aigle-cache-episode-10-1607433913"'
)
WHERE id = '7d3510db-5f3f-448e-83f3-d87cf6397372';