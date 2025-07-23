-- Diversifier les types de quêtes existantes
UPDATE treasure_quests 
SET quest_type = 'found_treasure' 
WHERE title LIKE '%Versailles%' OR title LIKE '%Napoléon%' OR title LIKE '%Cathares%';

UPDATE treasure_quests 
SET quest_type = 'unfound_treasure' 
WHERE title LIKE '%Fontainebleau%' OR title LIKE '%Cluny%' OR title LIKE '%Templiers%';