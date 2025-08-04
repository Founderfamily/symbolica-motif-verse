-- Corriger le type de quête pour Fontainebleau (trésor découvert)
UPDATE treasure_quests 
SET quest_type = 'found_treasure',
    status = 'completed'
WHERE id = '0b58fcc0-f40e-4762-a4f7-9bc074824820';