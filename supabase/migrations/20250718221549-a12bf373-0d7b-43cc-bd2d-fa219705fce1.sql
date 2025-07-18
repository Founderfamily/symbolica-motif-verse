
-- Supprimer définitivement la contribution TEST1 et toutes ses données associées
-- ID de la contribution: c9f1f40e-5782-4a71-a93d-b26d3aca179e

-- 1. Supprimer les tags associés
DELETE FROM public.contribution_tags 
WHERE contribution_id = 'c9f1f40e-5782-4a71-a93d-b26d3aca179e';

-- 2. Supprimer les images associées (les fichiers du storage devront être supprimés manuellement)
DELETE FROM public.contribution_images 
WHERE contribution_id = 'c9f1f40e-5782-4a71-a93d-b26d3aca179e';

-- 3. Supprimer la contribution principale
DELETE FROM public.user_contributions 
WHERE id = 'c9f1f40e-5782-4a71-a93d-b26d3aca179e' 
AND title = 'TEST1';

-- Vérification: afficher le nombre de contributions restantes pour cet utilisateur
SELECT COUNT(*) as remaining_contributions 
FROM public.user_contributions 
WHERE user_id = (
  SELECT user_id 
  FROM public.user_contributions 
  WHERE title LIKE '%TEST%' 
  LIMIT 1
);
