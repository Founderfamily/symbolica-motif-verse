-- Phase 1: Safe Consolidation - Step by step approach
-- First, let's clean up and consolidate safely

-- 1. Remove empty collections first
DELETE FROM collection_translations WHERE collection_id IN (
  SELECT c.id FROM collections c
  LEFT JOIN collection_symbols cs ON c.id = cs.collection_id
  WHERE cs.symbol_id IS NULL
);

DELETE FROM collections WHERE id IN (
  SELECT c.id FROM collections c
  LEFT JOIN collection_symbols cs ON c.id = cs.collection_id
  WHERE cs.symbol_id IS NULL
);

-- 2. Create consolidated communities first
-- Delete communities with only 1 member that are not essential
DELETE FROM group_members WHERE group_id IN (
  SELECT ig.id FROM interest_groups ig
  LEFT JOIN group_members gm ON ig.id = gm.group_id
  GROUP BY ig.id, ig.name
  HAVING COUNT(gm.user_id) <= 1 AND ig.name NOT IN ('Culture Égyptienne', 'Culture Française', 'Symboles Celtiques', 'Archéologie et Pétroglyphes')
);

DELETE FROM interest_groups WHERE id IN (
  SELECT ig.id FROM interest_groups ig
  LEFT JOIN group_members gm ON ig.id = gm.group_id
  GROUP BY ig.id, ig.name
  HAVING COUNT(gm.user_id) <= 1 AND ig.name NOT IN ('Culture Égyptienne', 'Culture Française', 'Symboles Celtiques', 'Archéologie et Pétroglyphes')
);

-- 3. Create new consolidated communities
INSERT INTO interest_groups (id, name, slug, description, is_public, created_at, updated_at) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Patrimoine Français', 'patrimoine-francais', 'Traditions et symboles des régions françaises', true, now(), now()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Civilisations Antiques', 'civilisations-antiques', 'Cultures de l''antiquité mondiale', true, now(), now()),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Traditions Celtiques', 'traditions-celtiques', 'Héritage et symboles celtiques', true, now(), now()),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Cultures Asiatiques', 'cultures-asiatiques', 'Traditions de l''Asie', true, now(), now()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Peuples Autochtones', 'peuples-autochtones', 'Cultures indigènes du monde', true, now(), now());

-- 4. Migrate existing active members to new communities
-- Migrate Culture Égyptienne members to Civilisations Antiques
INSERT INTO group_members (group_id, user_id, role, joined_at)
SELECT 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', gm.user_id, gm.role, now()
FROM group_members gm
JOIN interest_groups ig ON gm.group_id = ig.id
WHERE ig.name = 'Culture Égyptienne'
ON CONFLICT (group_id, user_id) DO NOTHING;

-- Migrate Culture Française members to Patrimoine Français
INSERT INTO group_members (group_id, user_id, role, joined_at)
SELECT 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', gm.user_id, gm.role, now()
FROM group_members gm
JOIN interest_groups ig ON gm.group_id = ig.id
WHERE ig.name = 'Culture Française'
ON CONFLICT (group_id, user_id) DO NOTHING;

-- Migrate Symboles Celtiques members to Traditions Celtiques
INSERT INTO group_members (group_id, user_id, role, joined_at)
SELECT 'cccccccc-cccc-cccc-cccc-cccccccccccc', gm.user_id, gm.role, now()
FROM group_members gm
JOIN interest_groups ig ON gm.group_id = ig.id
WHERE ig.name = 'Symboles Celtiques'
ON CONFLICT (group_id, user_id) DO NOTHING;

-- Migrate Archéologie et Pétroglyphes members to Peuples Autochtones (since they focus on ancient cultures)
INSERT INTO group_members (group_id, user_id, role, joined_at)
SELECT 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', gm.user_id, gm.role, now()
FROM group_members gm
JOIN interest_groups ig ON gm.group_id = ig.id
WHERE ig.name = 'Archéologie et Pétroglyphes'
ON CONFLICT (group_id, user_id) DO NOTHING;

-- 5. Create constraints for future growth
-- Add a function to check minimum members before creating new communities
CREATE OR REPLACE FUNCTION check_community_viability()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent creation of new communities without admin approval in the future
  IF NEW.created_by IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = NEW.created_by AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'New communities require admin approval';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for community creation control
CREATE TRIGGER community_viability_check
  BEFORE INSERT ON interest_groups
  FOR EACH ROW
  EXECUTE FUNCTION check_community_viability();