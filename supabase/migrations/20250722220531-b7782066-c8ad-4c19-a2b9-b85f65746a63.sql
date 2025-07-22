-- Reset the counters to match real data
UPDATE interest_groups 
SET 
  members_count = (
    SELECT COUNT(*) 
    FROM group_members gm 
    WHERE gm.group_id = interest_groups.id
  ),
  discoveries_count = (
    SELECT COUNT(*) 
    FROM group_discoveries gd 
    WHERE gd.group_id = interest_groups.id
  );

-- Verify the update
SELECT name, members_count, discoveries_count FROM interest_groups ORDER BY name;