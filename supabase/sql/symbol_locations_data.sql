
-- Insert sample locations with French culture names if they don't exist yet
INSERT INTO public.symbol_locations (symbol_id, name, culture, latitude, longitude, description, is_verified, verification_status)
SELECT 
  s.id,
  'Site de ' || s.name,
  s.culture,
  -- Generate semi-random but plausible coordinates based on culture
  CASE
    WHEN s.culture = 'Celtique' THEN 53.0 + (random() * 5) -- Ireland/Scotland area
    WHEN s.culture = 'Grec' THEN 38.0 + (random() * 3) -- Greece area
    WHEN s.culture = 'Nordique' THEN 60.0 + (random() * 5) -- Scandinavia
    WHEN s.culture = 'Aborigène' THEN -25.0 - (random() * 10) -- Australia
    WHEN s.culture = 'Aztèque' THEN 19.0 + (random() * 3) -- Mexico
    WHEN s.culture = 'Japonais' THEN 36.0 + (random() * 4) -- Japan
    WHEN s.culture = 'Indien' THEN 20.0 + (random() * 8) -- India
    WHEN s.culture = 'Islamique' THEN 25.0 + (random() * 10) -- Middle East
    WHEN s.culture = 'Perse' THEN 32.0 + (random() * 5) -- Iran
    WHEN s.culture = 'Français' THEN 46.0 + (random() * 4) -- France
    WHEN s.culture = 'Égyptien' THEN 26.0 + (random() * 4) -- Egypt
    WHEN s.culture = 'Africain' THEN 5.0 + (random() * 20) -- Africa
    ELSE (random() * 70) - 35 -- Random global position
  END,
  CASE
    WHEN s.culture = 'Celtique' THEN -7.0 + (random() * 8) -- Ireland/Scotland area
    WHEN s.culture = 'Grec' THEN 23.0 + (random() * 3) -- Greece area
    WHEN s.culture = 'Nordique' THEN 15.0 + (random() * 10) -- Scandinavia
    WHEN s.culture = 'Aborigène' THEN 135.0 + (random() * 10) -- Australia
    WHEN s.culture = 'Aztèque' THEN -99.0 + (random() * 5) -- Mexico
    WHEN s.culture = 'Japonais' THEN 138.0 + (random() * 5) -- Japan
    WHEN s.culture = 'Indien' THEN 77.0 + (random() * 10) -- India
    WHEN s.culture = 'Islamique' THEN 45.0 + (random() * 20) -- Middle East
    WHEN s.culture = 'Perse' THEN 53.0 + (random() * 5) -- Iran
    WHEN s.culture = 'Français' THEN 2.0 + (random() * 5) -- France
    WHEN s.culture = 'Égyptien' THEN 30.0 + (random() * 3) -- Egypt
    WHEN s.culture = 'Africain' THEN 20.0 + (random() * 30) -- Africa
    ELSE (random() * 360) - 180 -- Random global longitude
  END,
  'Site historique avec ' || s.name || ' datant de la période ' || s.period,
  random() > 0.7, -- About 30% are verified
  CASE WHEN random() > 0.7 THEN 'verified' ELSE 'unverified' END
FROM public.symbols s
WHERE NOT EXISTS (
  SELECT 1 FROM public.symbol_locations WHERE symbol_id = s.id
)
AND s.id IS NOT NULL
LIMIT 50;

-- Insert additional locations for some symbols to demonstrate clustering
WITH symbols_sample AS (
  SELECT id, name, culture
  FROM public.symbols 
  ORDER BY random() 
  LIMIT 5
)
INSERT INTO public.symbol_locations (symbol_id, name, culture, latitude, longitude, description, is_verified, verification_status)
SELECT 
  s.id,
  'Site additionnel de ' || s.name || ' #' || generate_series(1, 3),
  s.culture,
  -- Generate coordinates close to existing points for the same culture
  CASE
    WHEN s.culture = 'Celtique' THEN 53.0 + (random() * 5)
    WHEN s.culture = 'Grec' THEN 38.0 + (random() * 3)
    WHEN s.culture = 'Nordique' THEN 60.0 + (random() * 5)
    WHEN s.culture = 'Aborigène' THEN -25.0 - (random() * 10)
    WHEN s.culture = 'Aztèque' THEN 19.0 + (random() * 3)
    WHEN s.culture = 'Japonais' THEN 36.0 + (random() * 4)
    WHEN s.culture = 'Indien' THEN 20.0 + (random() * 8)
    WHEN s.culture = 'Islamique' THEN 25.0 + (random() * 10)
    WHEN s.culture = 'Perse' THEN 32.0 + (random() * 5)
    WHEN s.culture = 'Français' THEN 46.0 + (random() * 4)
    WHEN s.culture = 'Égyptien' THEN 26.0 + (random() * 4)
    WHEN s.culture = 'Africain' THEN 5.0 + (random() * 20)
    ELSE (random() * 70) - 35
  END,
  CASE
    WHEN s.culture = 'Celtique' THEN -7.0 + (random() * 8)
    WHEN s.culture = 'Grec' THEN 23.0 + (random() * 3)
    WHEN s.culture = 'Nordique' THEN 15.0 + (random() * 10)
    WHEN s.culture = 'Aborigène' THEN 135.0 + (random() * 10)
    WHEN s.culture = 'Aztèque' THEN -99.0 + (random() * 5)
    WHEN s.culture = 'Japonais' THEN 138.0 + (random() * 5)
    WHEN s.culture = 'Indien' THEN 77.0 + (random() * 10)
    WHEN s.culture = 'Islamique' THEN 45.0 + (random() * 20)
    WHEN s.culture = 'Perse' THEN 53.0 + (random() * 5)
    WHEN s.culture = 'Français' THEN 2.0 + (random() * 5)
    WHEN s.culture = 'Égyptien' THEN 30.0 + (random() * 3)
    WHEN s.culture = 'Africain' THEN 20.0 + (random() * 30)
    ELSE (random() * 360) - 180
  END,
  'Site additionnel avec ' || s.name,
  random() > 0.5,
  CASE WHEN random() > 0.7 THEN 'verified' ELSE 'unverified' END
FROM symbols_sample s, generate_series(1, 3);
