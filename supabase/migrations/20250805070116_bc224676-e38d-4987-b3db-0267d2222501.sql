-- Insert historical figures metadata for the quest
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
  'François Ier',
  'Roi de France',
  'Renaissance (1515-1547)',
  'https://fr.wikipedia.org/wiki/Fran%C3%A7ois_Ier_(roi_de_France)',
  'Roi de France de 1515 à 1547, grand mécène de la Renaissance française et protecteur des arts.',
  'verified'
),
(
  '0b58fcc0-f40e-4762-a4f7-9bc074824820',
  'Napoléon Bonaparte',
  'Empereur des Français',
  'Premier Empire (1804-1814, 1815)',
  'https://fr.wikipedia.org/wiki/Napol%C3%A9on_Ier',
  'Empereur des Français de 1804 à 1814 puis en 1815, figure majeure de l''histoire européenne.',
  'verified'
);