-- Créer une table pour les dates importantes de l'histoire de France
CREATE TABLE IF NOT EXISTS public.french_historical_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  year integer NOT NULL,
  date_text text NOT NULL,
  event_name text NOT NULL,
  description text,
  period_category text NOT NULL,
  importance_level integer DEFAULT 5 CHECK (importance_level BETWEEN 1 AND 10),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Insérer les 30 dates importantes de l'histoire de France
INSERT INTO public.french_historical_events (year, date_text, event_name, description, period_category, importance_level) VALUES
-- Antiquité et époque gauloise
(-52, '52 av. J.-C.', 'Bataille d''Alésia', 'Défaite de Vercingétorix face à César, fin de l''indépendance gauloise', 'Antiquité', 10),
(496, '496', 'Baptême de Clovis', 'Conversion du roi des Francs au christianisme', 'Haut Moyen Âge', 9),

-- Moyen Âge
(800, '25 décembre 800', 'Couronnement de Charlemagne', 'Charlemagne couronné empereur d''Occident', 'Moyen Âge', 10),
(987, '987', 'Avènement d''Hugues Capet', 'Début de la dynastie capétienne', 'Moyen Âge', 9),
(1066, '14 octobre 1066', 'Bataille d''Hastings', 'Guillaume le Conquérant envahit l''Angleterre', 'Moyen Âge', 8),
(1095, '1095', 'Première Croisade', 'Appel du pape Urbain II à Clermont', 'Moyen Âge', 7),
(1214, '27 juillet 1214', 'Bataille de Bouvines', 'Victoire de Philippe Auguste', 'Moyen Âge', 8),
(1337, '1337', 'Début de la Guerre de Cent Ans', 'Conflit franco-anglais', 'Moyen Âge', 9),
(1429, '8 mai 1429', 'Libération d''Orléans par Jeanne d''Arc', 'Tournant de la Guerre de Cent Ans', 'Moyen Âge', 10),
(1453, '1453', 'Fin de la Guerre de Cent Ans', 'Bataille de Castillon', 'Moyen Âge', 8),

-- Renaissance et époque moderne
(1515, '13-14 septembre 1515', 'Bataille de Marignan', 'Victoire de François Ier en Italie', 'Renaissance', 7),
(1572, '24 août 1572', 'Massacre de la Saint-Barthélemy', 'Massacre des protestants à Paris', 'Renaissance', 9),
(1598, '13 avril 1598', 'Édit de Nantes', 'Henri IV accorde la liberté de culte aux protestants', 'Renaissance', 8),
(1661, '1661', 'Règne personnel de Louis XIV', 'Début du règne absolu du Roi-Soleil', 'Époque Moderne', 9),
(1685, '22 octobre 1685', 'Révocation de l''Édit de Nantes', 'Louis XIV supprime la liberté religieuse', 'Époque Moderne', 8),

-- Révolution et Empire
(1789, '14 juillet 1789', 'Prise de la Bastille', 'Début de la Révolution française', 'Révolution', 10),
(1792, '20 septembre 1792', 'Bataille de Valmy', 'Première victoire de la République', 'Révolution', 8),
(1793, '21 janvier 1793', 'Exécution de Louis XVI', 'Fin de la monarchie absolue', 'Révolution', 10),
(1804, '2 décembre 1804', 'Sacre de Napoléon Ier', 'Napoléon devient empereur', 'Empire', 9),
(1815, '18 juin 1815', 'Bataille de Waterloo', 'Défaite définitive de Napoléon', 'Empire', 9),

-- XIXe siècle
(1830, '27-29 juillet 1830', 'Révolution de Juillet', 'Chute de Charles X, avènement de Louis-Philippe', 'XIXe siècle', 7),
(1848, '24 février 1848', 'Révolution de 1848', 'Chute de la monarchie de Juillet', 'XIXe siècle', 8),
(1870, '2 septembre 1870', 'Bataille de Sedan', 'Défaite face à la Prusse, chute du Second Empire', 'XIXe siècle', 9),
(1871, '18 mars-28 mai 1871', 'Commune de Paris', 'Insurrection parisienne', 'XIXe siècle', 8),

-- XXe siècle
(1914, '3 août 1914', 'Début de la Première Guerre mondiale', 'La France entre en guerre', 'XXe siècle', 10),
(1918, '11 novembre 1918', 'Armistice de 1918', 'Fin de la Première Guerre mondiale', 'XXe siècle', 10),
(1940, '18 juin 1940', 'Appel du 18 juin', 'Appel à la résistance du général de Gaulle', 'XXe siècle', 10),
(1944, '6 juin 1944', 'Débarquement de Normandie', 'Libération de la France', 'XXe siècle', 10),
(1958, '1958', 'Naissance de la Ve République', 'Retour de de Gaulle au pouvoir', 'XXe siècle', 9),
(1968, 'mai 1968', 'Mai 68', 'Mouvement étudiant et grèves générales', 'XXe siècle', 8);

-- Activer RLS
ALTER TABLE public.french_historical_events ENABLE ROW LEVEL SECURITY;

-- Politique RLS : lecture publique
CREATE POLICY "Les événements historiques sont visibles par tous" 
ON public.french_historical_events 
FOR SELECT 
USING (true);

-- Politique RLS : seuls les admins peuvent modifier
CREATE POLICY "Seuls les admins peuvent modifier les événements historiques" 
ON public.french_historical_events 
FOR ALL 
USING (is_admin());