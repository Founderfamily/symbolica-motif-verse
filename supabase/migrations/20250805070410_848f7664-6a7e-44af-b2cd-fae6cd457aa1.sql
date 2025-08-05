-- Mettre à jour l'entrée existante de François Ier avec les bonnes informations
UPDATE public.historical_figures_metadata 
SET 
  description = 'Roi de France de 1515 à 1547, grand mécène de la Renaissance française et protecteur des arts.',
  wikipedia_url = 'https://fr.wikipedia.org/wiki/Fran%C3%A7ois_Ier_(roi_de_France)',
  figure_period = 'Renaissance (1515-1547)',
  status = 'verified',
  updated_at = now()
WHERE quest_id = '0b58fcc0-f40e-4762-a4f7-9bc074824820' 
  AND figure_name = 'François Ier';

-- Insérer Napoléon Bonaparte
INSERT INTO public.historical_figures_metadata (
  quest_id,
  figure_name,
  figure_role,
  figure_period,
  wikipedia_url,
  description,
  status
) VALUES 
(
  '0b58fcc0-f40e-4762-a4f7-9bc074824820',
  'Napoléon Bonaparte',
  'Empereur des Français',
  'Premier Empire (1804-1814, 1815)',
  'https://fr.wikipedia.org/wiki/Napol%C3%A9on_Ier',
  'Empereur des Français de 1804 à 1814 puis en 1815, figure majeure de l''histoire européenne.',
  'verified'
);