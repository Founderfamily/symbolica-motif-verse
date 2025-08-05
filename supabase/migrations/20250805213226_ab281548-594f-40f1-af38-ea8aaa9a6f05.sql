-- Ajouter les personnages historiques des archives à la quête de Fontainebleau
INSERT INTO public.historical_figures_metadata (
  quest_id,
  figure_name,
  figure_role,
  figure_period,
  description,
  wikipedia_url,
  status,
  verified_at
) VALUES 
(
  '0b58fcc0-f40e-4762-a4f7-9bc074824820',
  'Pierre Bontemps',
  'Sculpteur et architecte',
  'Renaissance (1505-1568)',
  'Sculpteur français de la Renaissance, créateur du tombeau de François Ier à Saint-Denis et de nombreuses œuvres à Fontainebleau.',
  'https://fr.wikipedia.org/wiki/Pierre_Bontemps',
  'verified',
  now()
),
(
  '0b58fcc0-f40e-4762-a4f7-9bc074824820',
  'Henri II',
  'Roi de France',
  'Renaissance (1519-1559)',
  'Roi de France de 1547 à 1559, fils de François Ier, qui poursuivit les travaux d''embellissement du château de Fontainebleau.',
  'https://fr.wikipedia.org/wiki/Henri_II_(roi_de_France)',
  'verified',
  now()
),
(
  '0b58fcc0-f40e-4762-a4f7-9bc074824820',
  'Pierre de Bourdeille',
  'Chroniqueur et écrivain',
  'Renaissance (1540-1614)',
  'Seigneur de Brantôme, chroniqueur français connu pour ses mémoires sur la cour de France et les grands personnages de son époque.',
  'https://fr.wikipedia.org/wiki/Pierre_de_Bourdeille',
  'verified',
  now()
),
(
  '0b58fcc0-f40e-4762-a4f7-9bc074824820',
  'André Le Nôtre',
  'Architecte paysagiste',
  'Classique (1613-1700)',
  'Célèbre architecte paysagiste français, créateur des jardins à la française, notamment ceux de Versailles et de Fontainebleau.',
  'https://fr.wikipedia.org/wiki/André_Le_Nôtre',
  'verified',
  now()
),
(
  '0b58fcc0-f40e-4762-a4f7-9bc074824820',
  'Jules Hardouin-Mansart',
  'Architecte',
  'Classique (1646-1708)',
  'Premier architecte du roi Louis XIV, il dirigea de nombreux travaux royaux incluant des modifications au château de Fontainebleau.',
  'https://fr.wikipedia.org/wiki/Jules_Hardouin-Mansart',
  'verified',
  now()
),
(
  '0b58fcc0-f40e-4762-a4f7-9bc074824820',
  'Louis XIV',
  'Roi de France',
  'Classique (1638-1715)',
  'Le Roi-Soleil, qui entreprit de nombreux travaux de restauration et d''embellissement au château de Fontainebleau.',
  'https://fr.wikipedia.org/wiki/Louis_XIV',
  'verified',
  now()
),
(
  '0b58fcc0-f40e-4762-a4f7-9bc074824820',
  'Claude-François Ménestrier',
  'Jésuite et érudit',
  'Classique (1631-1705)',
  'Père jésuite français, spécialiste de l''héraldique et des symboles, auteur de mémoires sur la symbolique des châteaux royaux.',
  'https://fr.wikipedia.org/wiki/Claude-François_Ménestrier',
  'verified',
  now()
);