-- Ajouter les traductions pour les nouveaux groupes d'intérêt
UPDATE interest_groups SET translations = jsonb_build_object(
  'fr', jsonb_build_object('name', name, 'description', description),
  'en', jsonb_build_object('name', 
    CASE 
      WHEN name = 'Égypte Antique' THEN 'Ancient Egypt'
      WHEN name = 'Japon Traditionnel' THEN 'Traditional Japan'
      WHEN name = 'Monde Celtique' THEN 'Celtic World'
      WHEN name = 'Chine Traditionnelle' THEN 'Traditional China'
      WHEN name = 'Grèce Antique' THEN 'Ancient Greece'
      WHEN name = 'Nordique-Viking' THEN 'Nordic-Viking'
      WHEN name = 'Monde Arabe-Islamique' THEN 'Arab-Islamic World'
      WHEN name = 'Amériques Indigènes' THEN 'Indigenous Americas'
      WHEN name = 'Afrique Traditionnelle' THEN 'Traditional Africa'
      WHEN name = 'Monde Slave' THEN 'Slavic World'
      WHEN name = 'Océanie-Pacifique' THEN 'Pacific-Oceania'
      WHEN name = 'Europe Médiévale' THEN 'Medieval Europe'
      WHEN name = 'Perse-Iranienne' THEN 'Persian-Iranian'
    END,
    'description', 
    CASE 
      WHEN description LIKE '%Hiéroglyphes%' THEN 'Hieroglyphs, deities and funerary symbols of ancient Egypt'
      WHEN description LIKE '%Zen%' THEN 'Zen, traditional art and imperial symbols of Japan'
      WHEN description LIKE '%Nœuds celtiques%' THEN 'Celtic knots, druids and mythology of Celtic peoples'
      WHEN description LIKE '%Taoïsme%' THEN 'Taoism, Feng Shui and Chinese traditional calligraphy'
      WHEN description LIKE '%Mythologie%' THEN 'Mythology, architecture and philosophy of classical Greece'
      WHEN description LIKE '%Runes%' THEN 'Runes and Nordic mythology of Scandinavian peoples'
      WHEN description LIKE '%Géométrie sacrée%' THEN 'Sacred geometry and calligraphy of the Arab-Islamic world'
      WHEN description LIKE '%Totems%' THEN 'Totems, medicine wheel and symbols of Native American peoples'
      WHEN description LIKE '%Adinkra%' THEN 'Adinkra, tribal art and masks of African cultures'
      WHEN description LIKE '%Art orthodoxe%' THEN 'Orthodox art and folklore of Slavic peoples'
      WHEN description LIKE '%Art maori%' THEN 'Maori, Polynesian and Aboriginal art of the Pacific'
      WHEN description LIKE '%Héraldique%' THEN 'Heraldry, alchemy and Gothic art of the Middle Ages'
      WHEN description LIKE '%Zoroastrisme%' THEN 'Zoroastrianism and Persian art of ancient Iran'
    END
  )
);