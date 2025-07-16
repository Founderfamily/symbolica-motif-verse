-- Add reliable sources for Akan Goldweight symbol
UPDATE symbols 
SET sources = '[
  {
    "description": "Les poids Akan (appelés \"abrammuo\") étaient utilisés pour peser la poudre d''or dans le commerce en Afrique de l''Ouest.",
    "citation": "British Museum Collection Online - Akan Goldweights from Ghana, Collection Database"
  },
  {
    "description": "Système complexe de poids en laiton utilisé par les peuples Akan du Ghana pour le commerce de l''or du 15e au 19e siècle.",
    "citation": "Metropolitan Museum of Art - Akan Goldweights, Heilbrunn Timeline of Art History"
  },
  {
    "description": "Les poids Akan constituent l''un des systèmes de mesure les plus sophistiqués d''Afrique précoloniale.",
    "citation": "National Museum of African Art, Smithsonian Institution - Akan Goldweights Collection"
  }
]'::jsonb
WHERE id = '0b3cfb1d-5c1e-4866-abd8-e8a0bbe4045e';