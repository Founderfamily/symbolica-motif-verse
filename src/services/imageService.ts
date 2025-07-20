interface ImageCacheEntry {
  url: string;
  isValid: boolean;
  timestamp: number;
  retryCount: number;
}

// Cache en mémoire pour les URLs d'images
const imageCache = new Map<string, ImageCacheEntry>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
const MAX_RETRY_COUNT = 3;

// Mapping MASSIVEMENT élargi des images locales avec plus de variations et correspondances intelligentes
const symbolToLocalImageEnhanced: Record<string, string> = {
  // === SYMBOLES CELTIQUES ===
  "Triskèle Celtique": "/images/symbols/triskelion.png",
  "Triskèle celtique": "/images/symbols/triskelion.png",
  "Triskelion": "/images/symbols/triskelion.png",
  "Triskell": "/images/symbols/triskelion.png",
  "Triskell celtique": "/images/symbols/triskelion.png",
  "Spirale Celtique": "/images/symbols/triskelion.png",
  "Spirale Triple": "/images/symbols/triskelion.png",
  "Triple Spirale": "/images/symbols/triskelion.png",
  "Nœud Celtique": "/images/symbols/triskelion.png",
  "Nœud celtique": "/images/symbols/triskelion.png",
  "Celtic Knot": "/images/symbols/triskelion.png",
  "Croix Celtique": "/images/symbols/triskelion.png",
  "Croix celtique": "/images/symbols/triskelion.png",
  "Celtic Cross": "/images/symbols/triskelion.png",
  "Croix de Brigid": "/images/symbols/triskelion.png",
  "Croix de Saint-Brigitte": "/images/symbols/triskelion.png",
  "Arbre de Vie Celtique": "/images/symbols/triskelion.png",
  "Tree of Life": "/images/symbols/triskelion.png",
  "Claddagh": "/images/symbols/triskelion.png",
  "Shamrock": "/images/symbols/triskelion.png",
  "Trèfle Irlandais": "/images/symbols/triskelion.png",
  
  // === SYMBOLES FRANÇAIS ===
  "Fleur de Lys": "/images/symbols/fleur-de-lys.png",
  "Fleur de lys": "/images/symbols/fleur-de-lys.png",
  "Fleur-de-lys": "/images/symbols/fleur-de-lys.png",
  "Fleur-de-Lys": "/images/symbols/fleur-de-lys.png",
  "Lys Royal": "/images/symbols/fleur-de-lys.png",
  "Lis Royal": "/images/symbols/fleur-de-lys.png",
  "Emblème Royal": "/images/symbols/fleur-de-lys.png",
  "Symbole Monarchique": "/images/symbols/fleur-de-lys.png",
  "Blason Royal": "/images/symbols/fleur-de-lys.png",
  "Armoiries France": "/images/symbols/fleur-de-lys.png",
  
  // === SYMBOLES GRECS ===
  "Méandre Grec": "/images/symbols/greek-meander.png",
  "Méandre grec": "/images/symbols/greek-meander.png",
  "Greek Meander": "/images/symbols/greek-meander.png",
  "Meander": "/images/symbols/greek-meander.png",
  "Frise Grecque": "/images/symbols/greek-meander.png",
  "Motif Grec": "/images/symbols/greek-meander.png",
  "Greek Key": "/images/symbols/greek-meander.png",
  "Clé Grecque": "/images/symbols/greek-meander.png",
  "Labyrinthe Grec": "/images/symbols/greek-meander.png",
  "Spirale Grecque": "/images/symbols/greek-meander.png",
  "Colonne Grecque": "/images/symbols/greek-meander.png",
  "Temple Grec": "/images/symbols/greek-meander.png",
  "Athéna": "/images/symbols/greek-meander.png",
  "Zeus": "/images/symbols/greek-meander.png",
  "Apollon": "/images/symbols/greek-meander.png",
  "Dionysos": "/images/symbols/greek-meander.png",
  
  // === SYMBOLES INDIENS/HINDOUS/BOUDDHISTES ===
  "Mandala": "/images/symbols/mandala.png",
  "Mandala Indien": "/images/symbols/mandala.png",
  "Mandala indien": "/images/symbols/mandala.png",
  "Mandala Bouddhiste": "/images/symbols/mandala.png",
  "Mandala bouddhiste": "/images/symbols/mandala.png",
  "Mandala Tibétain": "/images/symbols/mandala.png",
  "Roue du Dharma": "/images/symbols/mandala.png",
  "Dharmachakra": "/images/symbols/mandala.png",
  "Chakra": "/images/symbols/mandala.png",
  "Om": "/images/symbols/mandala.png",
  "Aum": "/images/symbols/mandala.png",
  "ॐ": "/images/symbols/mandala.png",
  "Lotus": "/images/symbols/mandala.png",
  "Fleur de Lotus": "/images/symbols/mandala.png",
  "Padma": "/images/symbols/mandala.png",
  "Yin Yang": "/images/symbols/mandala.png",
  "Yin et Yang": "/images/symbols/mandala.png",
  "Taijitu": "/images/symbols/mandala.png",
  "Bouddha": "/images/symbols/mandala.png",
  "Stupa": "/images/symbols/mandala.png",
  "Vajra": "/images/symbols/mandala.png",
  "Dorje": "/images/symbols/mandala.png",
  "Ganesh": "/images/symbols/mandala.png",
  "Ganesha": "/images/symbols/mandala.png",
  "Shiva": "/images/symbols/mandala.png",
  "Vishnu": "/images/symbols/mandala.png",
  "Krishna": "/images/symbols/mandala.png",
  "Hamsa": "/images/symbols/mandala.png",
  "Main de Fatma": "/images/symbols/mandala.png",
  "Khamsa": "/images/symbols/mandala.png",
  "Swastika": "/images/symbols/mandala.png",
  "Svastika": "/images/symbols/mandala.png",
  
  // === SYMBOLES AFRICAINS ===
  "Symbole Adinkra": "/images/symbols/adinkra.png",
  "Adinkra": "/images/symbols/adinkra.png",
  "Adinkra Symbol": "/images/symbols/adinkra.png",
  "Gye Nyame": "/images/symbols/adinkra.png",
  "Sankofa": "/images/symbols/adinkra.png",
  "Dwennimmen": "/images/symbols/adinkra.png",
  "Akoben": "/images/symbols/adinkra.png",
  "Bese Saka": "/images/symbols/adinkra.png",
  "Fawohodie": "/images/symbols/adinkra.png",
  "Hye Won Hye": "/images/symbols/adinkra.png",
  "Kintinkantan": "/images/symbols/adinkra.png",
  "Mpatapo": "/images/symbols/adinkra.png",
  "Nea Onnim": "/images/symbols/adinkra.png",
  "Nyame Dua": "/images/symbols/adinkra.png",
  "Odo Nnyew Fie Kwan": "/images/symbols/adinkra.png",
  "Osram Ne Nsoromma": "/images/symbols/adinkra.png",
  "Ankh": "/images/symbols/adinkra.png",
  "Croix de Vie": "/images/symbols/adinkra.png",
  "Œil d'Horus": "/images/symbols/adinkra.png",
  "Eye of Horus": "/images/symbols/adinkra.png",
  "Scarabée": "/images/symbols/adinkra.png",
  "Khépri": "/images/symbols/adinkra.png",
  "Isis": "/images/symbols/adinkra.png",
  "Osiris": "/images/symbols/adinkra.png",
  "Râ": "/images/symbols/adinkra.png",
  "Pyramide": "/images/symbols/adinkra.png",
  "Sphinx": "/images/symbols/adinkra.png",
  "Hiéroglyphe": "/images/symbols/adinkra.png",
  "Cartouche": "/images/symbols/adinkra.png",
  
  // === SYMBOLES JAPONAIS ===
  "Motif Seigaiha": "/images/symbols/seigaiha.png",
  "Seigaiha": "/images/symbols/seigaiha.png",
  "Vagues Japonaises": "/images/symbols/seigaiha.png",
  "Vagues Bleues": "/images/symbols/seigaiha.png",
  "Mer Bleue": "/images/symbols/seigaiha.png",
  "Sashiko": "/images/symbols/seigaiha.png",
  "Asanoha": "/images/symbols/seigaiha.png",
  "Temari": "/images/symbols/seigaiha.png",
  "Shippo": "/images/symbols/seigaiha.png",
  "Kumiko": "/images/symbols/seigaiha.png",
  "Kamon": "/images/symbols/seigaiha.png",
  "Mon": "/images/symbols/seigaiha.png",
  "Torii": "/images/symbols/seigaiha.png",
  "Enso": "/images/symbols/seigaiha.png",
  "Cercle Zen": "/images/symbols/seigaiha.png",
  "Kanji": "/images/symbols/seigaiha.png",
  "Calligraphie Japonaise": "/images/symbols/seigaiha.png",
  "Origami": "/images/symbols/seigaiha.png",
  "Grue": "/images/symbols/seigaiha.png",
  "Samouraï": "/images/symbols/seigaiha.png",
  "Katana": "/images/symbols/seigaiha.png",
  "Bushido": "/images/symbols/seigaiha.png",
  "Dragon Japonais": "/images/symbols/seigaiha.png",
  "Koi": "/images/symbols/seigaiha.png",
  "Cerisier": "/images/symbols/seigaiha.png",
  "Sakura": "/images/symbols/seigaiha.png",
  "Bambou": "/images/symbols/seigaiha.png",
  "Take": "/images/symbols/seigaiha.png",
  
  // === SYMBOLES NORDIQUES/VIKINGS ===
  "Motif viking": "/images/symbols/viking.png",
  "Motif Viking": "/images/symbols/viking.png",
  "Viking": "/images/symbols/viking.png",
  "Rune Viking": "/images/symbols/viking.png",
  "Runes": "/images/symbols/viking.png",
  "Futhark": "/images/symbols/viking.png",
  "Elder Futhark": "/images/symbols/viking.png",
  "Younger Futhark": "/images/symbols/viking.png",
  "Mjöllnir": "/images/symbols/viking.png",
  "Mjolnir": "/images/symbols/viking.png",
  "Marteau de Thor": "/images/symbols/viking.png",
  "Thor": "/images/symbols/viking.png",
  "Valknut": "/images/symbols/viking.png",
  "Nœud des Occis": "/images/symbols/viking.png",
  "Odin": "/images/symbols/viking.png",
  "Gungnir": "/images/symbols/viking.png",
  "Sleipnir": "/images/symbols/viking.png",
  "Yggdrasil": "/images/symbols/viking.png",
  "Arbre Monde": "/images/symbols/viking.png",
  "Aegishjalmur": "/images/symbols/viking.png",
  "Heaume de Terreur": "/images/symbols/viking.png",
  "Vegvisir": "/images/symbols/viking.png",
  "Boussole Runique": "/images/symbols/viking.png",
  "Fenrir": "/images/symbols/viking.png",
  "Jormungandr": "/images/symbols/viking.png",
  "Ragnarök": "/images/symbols/viking.png",
  "Valhalla": "/images/symbols/viking.png",
  "Valkyrie": "/images/symbols/viking.png",
  "Berserker": "/images/symbols/viking.png",
  "Drakkar": "/images/symbols/viking.png",
  "Longship": "/images/symbols/viking.png",
  
  // === SYMBOLES AMÉRINDIENS/ABORIGÈNES ===
  "Art aborigène": "/images/symbols/aboriginal.png",
  "Art Aborigène": "/images/symbols/aboriginal.png",
  "Aboriginal Art": "/images/symbols/aboriginal.png",
  "Peinture Rupestre": "/images/symbols/aboriginal.png",
  "Rock Art": "/images/symbols/aboriginal.png",
  "Petroglyphe": "/images/symbols/aboriginal.png",
  "Pictogramme": "/images/symbols/aboriginal.png",
  "Dreamtime": "/images/symbols/aboriginal.png",
  "Temps du Rêve": "/images/symbols/aboriginal.png",
  "Serpent Arc-en-ciel": "/images/symbols/aboriginal.png",
  "Rainbow Serpent": "/images/symbols/aboriginal.png",
  "Boomerang": "/images/symbols/aboriginal.png",
  "Didgeridoo": "/images/symbols/aboriginal.png",
  "Attrape-rêves": "/images/symbols/aboriginal.png",
  "Attrape-Rêves": "/images/symbols/aboriginal.png",
  "Dreamcatcher": "/images/symbols/aboriginal.png",
  "Dream Catcher": "/images/symbols/aboriginal.png",
  "Plume Sacrée": "/images/symbols/aboriginal.png",
  "Sacred Feather": "/images/symbols/aboriginal.png",
  "Totem": "/images/symbols/aboriginal.png",
  "Mât Totémique": "/images/symbols/aboriginal.png",
  "Totem Pole": "/images/symbols/aboriginal.png",
  "Aigle": "/images/symbols/aboriginal.png",
  "Eagle": "/images/symbols/aboriginal.png",
  "Loup": "/images/symbols/aboriginal.png",
  "Wolf": "/images/symbols/aboriginal.png",
  "Ours": "/images/symbols/aboriginal.png",
  "Bear": "/images/symbols/aboriginal.png",
  "Tortue": "/images/symbols/aboriginal.png",
  "Turtle": "/images/symbols/aboriginal.png",
  "Buffalo": "/images/symbols/aboriginal.png",
  "Bison": "/images/symbols/aboriginal.png",
  "Calumet": "/images/symbols/aboriginal.png",
  "Peace Pipe": "/images/symbols/aboriginal.png",
  "Tipí": "/images/symbols/aboriginal.png",
  "Tipi": "/images/symbols/aboriginal.png",
  "Teepee": "/images/symbols/aboriginal.png",
  
  // === SYMBOLES AZTÈQUES/MAYAS ===
  "Motif aztèque": "/images/symbols/aztec.png",
  "Motif Aztèque": "/images/symbols/aztec.png",
  "Aztèque": "/images/symbols/aztec.png",
  "Aztec": "/images/symbols/aztec.png",
  "Maya": "/images/symbols/aztec.png",
  "Mayan": "/images/symbols/aztec.png",
  "Inca": "/images/symbols/aztec.png",
  "Inti": "/images/symbols/aztec.png",
  "Soleil Inca": "/images/symbols/aztec.png",
  "Quetzalcoatl": "/images/symbols/aztec.png",
  "Serpent à Plumes": "/images/symbols/aztec.png",
  "Feathered Serpent": "/images/symbols/aztec.png",
  "Calendrier Aztèque": "/images/symbols/aztec.png",
  "Calendrier Maya": "/images/symbols/aztec.png",
  "Aztec Calendar": "/images/symbols/aztec.png",
  "Maya Calendar": "/images/symbols/aztec.png",
  "Pierre du Soleil": "/images/symbols/aztec.png",
  "Sun Stone": "/images/symbols/aztec.png",
  "Tonatiuh": "/images/symbols/aztec.png",
  "Tezcatlipoca": "/images/symbols/aztec.png",
  "Xochiquetzal": "/images/symbols/aztec.png",
  "Tlaloc": "/images/symbols/aztec.png",
  "Coatlicue": "/images/symbols/aztec.png",
  "Huitzilopochtli": "/images/symbols/aztec.png",
  "Pyramide Maya": "/images/symbols/aztec.png",
  "Pyramide Aztèque": "/images/symbols/aztec.png",
  "Chichen Itza": "/images/symbols/aztec.png",
  "Teotihuacan": "/images/symbols/aztec.png",
  "Machu Picchu": "/images/symbols/aztec.png",
  "Jaguar": "/images/symbols/aztec.png",
  "Condor": "/images/symbols/aztec.png",
  "Colibri": "/images/symbols/aztec.png",
  "Hummingbird": "/images/symbols/aztec.png",
  
  // === SYMBOLES ISLAMIQUES/ARABES ===
  "Arabesque": "/images/symbols/arabesque.png",
  "Calligraphie Arabe": "/images/symbols/arabesque.png",
  "Arabic Calligraphy": "/images/symbols/arabesque.png",
  "Géométrie Islamique": "/images/symbols/arabesque.png",
  "Islamic Geometry": "/images/symbols/arabesque.png",
  "Motif Islamique": "/images/symbols/arabesque.png",
  "Islamic Pattern": "/images/symbols/arabesque.png",
  "Étoile à 8 branches": "/images/symbols/arabesque.png",
  "Khatam": "/images/symbols/arabesque.png",
  "Girih": "/images/symbols/arabesque.png",
  "Zellige": "/images/symbols/arabesque.png",
  "Moucharabieh": "/images/symbols/arabesque.png",
  "Mashrabiya": "/images/symbols/arabesque.png",
  "Minaret": "/images/symbols/arabesque.png",
  "Dôme": "/images/symbols/arabesque.png",
  "Dome": "/images/symbols/arabesque.png",
  "Mihrab": "/images/symbols/arabesque.png",
  "Qibla": "/images/symbols/arabesque.png",
  "Croissant": "/images/symbols/arabesque.png",
  "Crescent": "/images/symbols/arabesque.png",
  "Croissant et Étoile": "/images/symbols/arabesque.png",
  "Crescent and Star": "/images/symbols/arabesque.png",
  "Allah": "/images/symbols/arabesque.png",
  "الله": "/images/symbols/arabesque.png",
  "Muhammad": "/images/symbols/arabesque.png",
  "محمد": "/images/symbols/arabesque.png",
  "Basmala": "/images/symbols/arabesque.png",
  "بسم الله": "/images/symbols/arabesque.png",
  "Shahada": "/images/symbols/arabesque.png",
  "شهادة": "/images/symbols/arabesque.png",
  "Kaaba": "/images/symbols/arabesque.png",
  "Kaabah": "/images/symbols/arabesque.png",
  "Mecca": "/images/symbols/arabesque.png",
  "La Mecque": "/images/symbols/arabesque.png",
  
  // === SYMBOLES CHINOIS ===
  "Dragon Chinois": "/images/symbols/mandala.png",
  "Chinese Dragon": "/images/symbols/mandala.png",
  "Long": "/images/symbols/mandala.png",
  "Phénix Chinois": "/images/symbols/mandala.png",
  "Chinese Phoenix": "/images/symbols/mandala.png",
  "Fenghuang": "/images/symbols/mandala.png",
  "Caractère Chinois": "/images/symbols/mandala.png",
  "Chinese Character": "/images/symbols/mandala.png",
  "Hanzi": "/images/symbols/mandala.png",
  "Calligraphie Chinoise": "/images/symbols/mandala.png",
  "Chinese Calligraphy": "/images/symbols/mandala.png",
  "Shufa": "/images/symbols/mandala.png",
  "Feng Shui": "/images/symbols/mandala.png",
  "Bagua": "/images/symbols/mandala.png",
  "Pa Kua": "/images/symbols/mandala.png",
  "I Ching": "/images/symbols/mandala.png",
  "Yi Jing": "/images/symbols/mandala.png",
  "Trigramme": "/images/symbols/mandala.png",
  "Trigram": "/images/symbols/mandala.png",
  "Wuxing": "/images/symbols/mandala.png",
  "Cinq Éléments": "/images/symbols/mandala.png",
  "Five Elements": "/images/symbols/mandala.png",
  "Tao": "/images/symbols/mandala.png",
  "Dao": "/images/symbols/mandala.png",
  "Laozi": "/images/symbols/mandala.png",
  "Confucius": "/images/symbols/mandala.png",
  "Kongzi": "/images/symbols/mandala.png",
  "Shou": "/images/symbols/mandala.png",
  "Longévité": "/images/symbols/mandala.png",
  "Fu": "/images/symbols/mandala.png",
  "Bonheur": "/images/symbols/mandala.png",
  "Lu": "/images/symbols/mandala.png",
  "Richesse": "/images/symbols/mandala.png",
  "Double Bonheur": "/images/symbols/mandala.png",
  "Double Happiness": "/images/symbols/mandala.png",
  "Xi": "/images/symbols/mandala.png",
  "Nœud Chinois": "/images/symbols/mandala.png",
  "Chinese Knot": "/images/symbols/mandala.png",
  "Panda": "/images/symbols/mandala.png",
  "Tigre": "/images/symbols/mandala.png",
  "Tiger": "/images/symbols/mandala.png",
  "Grue Couronnée": "/images/symbols/mandala.png",
  "Crowned Crane": "/images/symbols/mandala.png",
  
  // === FALLBACKS GÉNÉRIQUES PAR MOTS-CLÉS ===
  // Spiritualité
  "Spirituel": "/images/symbols/mandala.png",
  "Spiritual": "/images/symbols/mandala.png",
  "Sacré": "/images/symbols/mandala.png",
  "Sacred": "/images/symbols/mandala.png",
  "Divin": "/images/symbols/mandala.png",
  "Divine": "/images/symbols/mandala.png",
  "Méditation": "/images/symbols/mandala.png",
  "Meditation": "/images/symbols/mandala.png",
  "Prière": "/images/symbols/mandala.png",
  "Prayer": "/images/symbols/mandala.png",
  "Temple": "/images/symbols/mandala.png",
  "Sanctuaire": "/images/symbols/mandala.png",
  "Sanctuary": "/images/symbols/mandala.png",
  
  // Royauté/Noblesse
  "Royal": "/images/symbols/fleur-de-lys.png",
  "Royauté": "/images/symbols/fleur-de-lys.png",
  "Royalty": "/images/symbols/fleur-de-lys.png",
  "Noble": "/images/symbols/fleur-de-lys.png",
  "Noblesse": "/images/symbols/fleur-de-lys.png",
  "Nobility": "/images/symbols/fleur-de-lys.png",
  "Couronne": "/images/symbols/fleur-de-lys.png",
  "Crown": "/images/symbols/fleur-de-lys.png",
  "Sceptre": "/images/symbols/fleur-de-lys.png",
  "Scepter": "/images/symbols/fleur-de-lys.png",
  "Blason": "/images/symbols/fleur-de-lys.png",
  "Coat of Arms": "/images/symbols/fleur-de-lys.png",
  "Armoiries": "/images/symbols/fleur-de-lys.png",
  "Héraldique": "/images/symbols/fleur-de-lys.png",
  "Heraldry": "/images/symbols/fleur-de-lys.png",
  
  // Nature
  "Arbre": "/images/symbols/triskelion.png",
  "Tree": "/images/symbols/triskelion.png",
  "Forêt": "/images/symbols/triskelion.png",
  "Forest": "/images/symbols/triskelion.png",
  "Feuille": "/images/symbols/triskelion.png",
  "Leaf": "/images/symbols/triskelion.png",
  "Fleur": "/images/symbols/fleur-de-lys.png",
  "Flower": "/images/symbols/fleur-de-lys.png",
  "Rose": "/images/symbols/fleur-de-lys.png",
  "Soleil": "/images/symbols/aztec.png",
  "Sun": "/images/symbols/aztec.png",
  "Lune": "/images/symbols/mandala.png",
  "Moon": "/images/symbols/mandala.png",
  "Étoile": "/images/symbols/arabesque.png",
  "Star": "/images/symbols/arabesque.png",
  "Eau": "/images/symbols/seigaiha.png",
  "Water": "/images/symbols/seigaiha.png",
  "Mer": "/images/symbols/seigaiha.png",
  "Sea": "/images/symbols/seigaiha.png",
  "Océan": "/images/symbols/seigaiha.png",
  "Ocean": "/images/symbols/seigaiha.png",
  "Rivière": "/images/symbols/seigaiha.png",
  "River": "/images/symbols/seigaiha.png",
  "Montagne": "/images/symbols/aboriginal.png",
  "Mountain": "/images/symbols/aboriginal.png",
  "Terre": "/images/symbols/aboriginal.png",
  "Earth": "/images/symbols/aboriginal.png",
  "Feu": "/images/symbols/aztec.png",
  "Fire": "/images/symbols/aztec.png",
  "Air": "/images/symbols/mandala.png",
  "Vent": "/images/symbols/mandala.png",
  "Wind": "/images/symbols/mandala.png",
  
  // Animaux
  "Animal": "/images/symbols/aboriginal.png",
  "Cheval": "/images/symbols/viking.png",
  "Horse": "/images/symbols/viking.png",
  "Chien": "/images/symbols/aboriginal.png",
  "Dog": "/images/symbols/aboriginal.png",
  "Chat": "/images/symbols/adinkra.png",
  "Cat": "/images/symbols/adinkra.png",
  "Serpent": "/images/symbols/aztec.png",
  "Snake": "/images/symbols/aztec.png",
  "Oiseau": "/images/symbols/aboriginal.png",
  "Bird": "/images/symbols/aboriginal.png",
  "Poisson": "/images/symbols/seigaiha.png",
  "Fish": "/images/symbols/seigaiha.png",
  "Lion": "/images/symbols/fleur-de-lys.png",
  "Taureau": "/images/symbols/greek-meander.png",
  "Bull": "/images/symbols/greek-meander.png",
  "Éléphant": "/images/symbols/mandala.png",
  "Elephant": "/images/symbols/mandala.png",
  
  // Géométrie
  "Cercle": "/images/symbols/mandala.png",
  "Circle": "/images/symbols/mandala.png",
  "Triangle": "/images/symbols/aztec.png",
  "Carré": "/images/symbols/greek-meander.png",
  "Square": "/images/symbols/greek-meander.png",
  "Losange": "/images/symbols/arabesque.png",
  "Diamond": "/images/symbols/arabesque.png",
  "Hexagone": "/images/symbols/arabesque.png",
  "Hexagon": "/images/symbols/arabesque.png",
  "Octogone": "/images/symbols/arabesque.png",
  "Octagon": "/images/symbols/arabesque.png",
  "Spirale": "/images/symbols/triskelion.png",
  "Spiral": "/images/symbols/triskelion.png",
  "Labyrinthe": "/images/symbols/greek-meander.png",
  "Labyrinth": "/images/symbols/greek-meander.png",
  "Maze": "/images/symbols/greek-meander.png"
};

// Fallbacks par culture ENCORE PLUS étendus
const culturalFallbacks: Record<string, string> = {
  "Celtique": "/images/symbols/triskelion.png",
  "Celtic": "/images/symbols/triskelion.png",
  "Irlandais": "/images/symbols/triskelion.png",
  "Irish": "/images/symbols/triskelion.png",
  "Écossais": "/images/symbols/triskelion.png",
  "Scottish": "/images/symbols/triskelion.png",
  "Gallois": "/images/symbols/triskelion.png",
  "Welsh": "/images/symbols/triskelion.png",
  "Breton": "/images/symbols/triskelion.png",
  
  "Japonaise": "/images/symbols/seigaiha.png",
  "Japanese": "/images/symbols/seigaiha.png",
  "Nippon": "/images/symbols/seigaiha.png",
  
  "Grecque": "/images/symbols/greek-meander.png",
  "Greek": "/images/symbols/greek-meander.png",
  "Hellénique": "/images/symbols/greek-meander.png",
  "Hellenic": "/images/symbols/greek-meander.png",
  "Antique": "/images/symbols/greek-meander.png",
  "Ancient": "/images/symbols/greek-meander.png",
  
  "Indienne": "/images/symbols/mandala.png",
  "Indian": "/images/symbols/mandala.png",
  "Hindoue": "/images/symbols/mandala.png",
  "Hindu": "/images/symbols/mandala.png",
  "Bouddhiste": "/images/symbols/mandala.png",
  "Buddhist": "/images/symbols/mandala.png",
  "Tibétaine": "/images/symbols/mandala.png",
  "Tibetan": "/images/symbols/mandala.png",
  "Népalaise": "/images/symbols/mandala.png",
  "Nepalese": "/images/symbols/mandala.png",
  "Thaï": "/images/symbols/mandala.png",
  "Thai": "/images/symbols/mandala.png",
  "Birmane": "/images/symbols/mandala.png",
  "Burmese": "/images/symbols/mandala.png",
  "Cambodgienne": "/images/symbols/mandala.png",
  "Cambodian": "/images/symbols/mandala.png",
  "Khmer": "/images/symbols/mandala.png",
  
  "Africaine": "/images/symbols/adinkra.png",
  "African": "/images/symbols/adinkra.png",
  "Ghanéenne": "/images/symbols/adinkra.png",
  "Ghanaian": "/images/symbols/adinkra.png",
  "Akan": "/images/symbols/adinkra.png",
  "Yoruba": "/images/symbols/adinkra.png",
  "Dogon": "/images/symbols/adinkra.png",
  "Bantou": "/images/symbols/adinkra.png",
  "Bantu": "/images/symbols/adinkra.png",
  "Éthiopienne": "/images/symbols/adinkra.png",
  "Ethiopian": "/images/symbols/adinkra.png",
  "Marocaine": "/images/symbols/adinkra.png",
  "Moroccan": "/images/symbols/adinkra.png",
  "Égyptienne": "/images/symbols/adinkra.png",
  "Egyptian": "/images/symbols/adinkra.png",
  "Pharaonique": "/images/symbols/adinkra.png",
  "Pharaonic": "/images/symbols/adinkra.png",
  
  "Française": "/images/symbols/fleur-de-lys.png",
  "French": "/images/symbols/fleur-de-lys.png",
  "Européenne": "/images/symbols/fleur-de-lys.png",
  "European": "/images/symbols/fleur-de-lys.png",
  "Occidentale": "/images/symbols/fleur-de-lys.png",
  "Western": "/images/symbols/fleur-de-lys.png",
  
  "Nordique": "/images/symbols/viking.png",
  "Nordic": "/images/symbols/viking.png",
  "Scandinave": "/images/symbols/viking.png",
  "Scandinavian": "/images/symbols/viking.png",
  "Norvégienne": "/images/symbols/viking.png",
  "Norwegian": "/images/symbols/viking.png",
  "Suédoise": "/images/symbols/viking.png",
  "Swedish": "/images/symbols/viking.png",
  "Danoise": "/images/symbols/viking.png",
  "Danish": "/images/symbols/viking.png",
  "Islandaise": "/images/symbols/viking.png",
  "Icelandic": "/images/symbols/viking.png",
  "Germanique": "/images/symbols/viking.png",
  "Germanic": "/images/symbols/viking.png",
  
  "Aztèque": "/images/symbols/aztec.png",
  "Aztec": "/images/symbols/aztec.png",
  "Maya": "/images/symbols/aztec.png",
  "Mayan": "/images/symbols/aztec.png",
  "Inca": "/images/symbols/aztec.png",
  "Incan": "/images/symbols/aztec.png",
  "Précolombienne": "/images/symbols/aztec.png",
  "Pre-Columbian": "/images/symbols/aztec.png",
  "Mésoaméricaine": "/images/symbols/aztec.png",
  "Mesoamerican": "/images/symbols/aztec.png",
  "Olmèque": "/images/symbols/aztec.png",
  "Olmec": "/images/symbols/aztec.png",
  "Zapotèque": "/images/symbols/aztec.png",
  "Zapotec": "/images/symbols/aztec.png",
  "Toltèque": "/images/symbols/aztec.png",
  "Toltec": "/images/symbols/aztec.png",
  
  "Islamique": "/images/symbols/arabesque.png",
  "Islamic": "/images/symbols/arabesque.png",
  "Arabe": "/images/symbols/arabesque.png",
  "Arabic": "/images/symbols/arabesque.png",
  "Musulmane": "/images/symbols/arabesque.png",
  "Muslim": "/images/symbols/arabesque.png",
  "Perse": "/images/symbols/arabesque.png",
  "Persian": "/images/symbols/arabesque.png",
  "Iranienne": "/images/symbols/arabesque.png",
  "Iranian": "/images/symbols/arabesque.png",
  "Turque": "/images/symbols/arabesque.png",
  "Turkish": "/images/symbols/arabesque.png",
  "Ottomane": "/images/symbols/arabesque.png",
  "Ottoman": "/images/symbols/arabesque.png",
  "Moyen-Orientale": "/images/symbols/arabesque.png",
  "Middle Eastern": "/images/symbols/arabesque.png",
  "Maghrébine": "/images/symbols/arabesque.png",
  "Maghrebi": "/images/symbols/arabesque.png",
  "Mauresque": "/images/symbols/arabesque.png",
  "Moorish": "/images/symbols/arabesque.png",
  "Andalouse": "/images/symbols/arabesque.png",
  "Andalusian": "/images/symbols/arabesque.png",
  
  "Chinoise": "/images/symbols/mandala.png",
  "Chinese": "/images/symbols/mandala.png",
  "Coréenne": "/images/symbols/mandala.png",
  "Korean": "/images/symbols/mandala.png",
  "Vietnamienne": "/images/symbols/mandala.png",
  "Vietnamese": "/images/symbols/mandala.png",
  "Asiatique": "/images/symbols/mandala.png",
  "Asian": "/images/symbols/mandala.png",
  
  "Amérindienne": "/images/symbols/aboriginal.png",
  "Native American": "/images/symbols/aboriginal.png",
  "Aborigène": "/images/symbols/aboriginal.png",
  "Aboriginal": "/images/symbols/aboriginal.png",
  "Australienne": "/images/symbols/aboriginal.png",
  "Australian": "/images/symbols/aboriginal.png",
  "Indigène": "/images/symbols/aboriginal.png",
  "Indigenous": "/images/symbols/aboriginal.png",
  "Première Nation": "/images/symbols/aboriginal.png",
  "First Nation": "/images/symbols/aboriginal.png",
  "Cherokee": "/images/symbols/aboriginal.png",
  "Apache": "/images/symbols/aboriginal.png",
  "Navajo": "/images/symbols/aboriginal.png",
  "Sioux": "/images/symbols/aboriginal.png",
  "Lakota": "/images/symbols/aboriginal.png",
  "Hopi": "/images/symbols/aboriginal.png",
  "Pueblo": "/images/symbols/aboriginal.png",
  "Iroquois": "/images/symbols/aboriginal.png",
  "Huron": "/images/symbols/aboriginal.png",
  "Inuit": "/images/symbols/aboriginal.png",
  "Maori": "/images/symbols/aboriginal.png"
};

export class ImageService {
  /**
   * Trouve la meilleure image locale pour un symbole avec une recherche ULTRA élargie
   */
  static findBestLocalImage(symbolName: string, culture: string): string {
    console.log(`🔍 [ImageService] Recherche ÉLARGIE pour "${symbolName}" (culture: ${culture})`);
    
    // 1. Recherche exacte par nom (insensible à la casse)
    const exactMatch = symbolToLocalImageEnhanced[symbolName];
    if (exactMatch) {
      console.log(`✅ [ImageService] Correspondance exacte: ${exactMatch}`);
      return exactMatch;
    }
    
    // 2. Recherche insensible à la casse
    const lowerName = symbolName.toLowerCase();
    for (const [key, value] of Object.entries(symbolToLocalImageEnhanced)) {
      if (key.toLowerCase() === lowerName) {
        console.log(`✅ [ImageService] Correspondance insensible à la casse: ${value}`);
        return value;
      }
    }
    
    // 3. Recherche par nom normalisé (sans accents, sans ponctuation)
    const normalizedName = this.normalizeString(symbolName);
    for (const [key, value] of Object.entries(symbolToLocalImageEnhanced)) {
      if (this.normalizeString(key) === normalizedName) {
        console.log(`✅ [ImageService] Correspondance normalisée: ${value}`);
        return value;
      }
    }
    
    // 4. Recherche partielle - le nom du symbole contient un mot-clé
    const symbolWords = symbolName.toLowerCase().split(/[\s\-_]+/);
    for (const word of symbolWords) {
      if (word.length >= 3) { // Ignorer les mots trop courts
        for (const [key, value] of Object.entries(symbolToLocalImageEnhanced)) {
          if (key.toLowerCase().includes(word) || word.includes(key.toLowerCase())) {
            console.log(`✅ [ImageService] Correspondance partielle par mot "${word}": ${value}`);
            return value;
          }
        }
      }
    }
    
    // 5. Recherche par mots-clés dans le nom du symbole
    const keywords = [
      // Extraire les mots-clés potentiels du nom
      ...symbolWords.filter(word => word.length >= 4),
      // Ajouter des synonymes courants
      ...(symbolName.toLowerCase().includes('croix') ? ['cross', 'cruz'] : []),
      ...(symbolName.toLowerCase().includes('fleur') ? ['flower', 'bloom'] : []),
      ...(symbolName.toLowerCase().includes('arbre') ? ['tree', 'árbol'] : []),
      ...(symbolName.toLowerCase().includes('soleil') ? ['sun', 'sol'] : []),
      ...(symbolName.toLowerCase().includes('eau') ? ['water', 'agua'] : []),
      ...(symbolName.toLowerCase().includes('spirale') ? ['spiral', 'espiral'] : []),
      ...(symbolName.toLowerCase().includes('cercle') ? ['circle', 'círculo'] : []),
      ...(symbolName.toLowerCase().includes('étoile') ? ['star', 'estrella'] : [])
    ];
    
    for (const keyword of keywords) {
      for (const [key, value] of Object.entries(symbolToLocalImageEnhanced)) {
        if (key.toLowerCase().includes(keyword.toLowerCase())) {
          console.log(`✅ [ImageService] Correspondance par mot-clé "${keyword}": ${value}`);
          return value;
        }
      }
    }
    
    // 6. Recherche par culture élargie
    const cultureVariants = [
      culture,
      culture.toLowerCase(),
      culture.replace(/e$/, ''), // Supprimer le 'e' final (ex: "Grecque" -> "Grec")
      culture.replace(/aise$/, 'ais'), // Transformer "aise" en "ais"
      culture.replace(/ienne$/, 'ien'), // Transformer "ienne" en "ien"
      culture.replace(/que$/, '') // Supprimer "que" final
    ];
    
    for (const cultureVariant of cultureVariants) {
      if (culturalFallbacks[cultureVariant]) {
        console.log(`✅ [ImageService] Fallback culturel "${cultureVariant}": ${culturalFallbacks[cultureVariant]}`);
        return culturalFallbacks[cultureVariant];
      }
    }
    
    // 7. Recherche par fonction/catégorie (basée sur des mots dans le nom)
    const categoryMappings: Record<string, string> = {
      // Spiritualité/Religion
      'dieu': '/images/symbols/mandala.png',
      'god': '/images/symbols/mandala.png',
      'divinité': '/images/symbols/mandala.png',
      'deity': '/images/symbols/mandala.png',
      'temple': '/images/symbols/mandala.png',
      'église': '/images/symbols/fleur-de-lys.png',
      'church': '/images/symbols/fleur-de-lys.png',
      'prière': '/images/symbols/mandala.png',
      'prayer': '/images/symbols/mandala.png',
      'méditation': '/images/symbols/mandala.png',
      'meditation': '/images/symbols/mandala.png',
      
      // Guerre/Protection
      'guerre': '/images/symbols/viking.png',
      'war': '/images/symbols/viking.png',
      'guerrier': '/images/symbols/viking.png',
      'warrior': '/images/symbols/viking.png',
      'bataille': '/images/symbols/viking.png',
      'battle': '/images/symbols/viking.png',
      'protection': '/images/symbols/viking.png',
      'bouclier': '/images/symbols/viking.png',
      'shield': '/images/symbols/viking.png',
      'épée': '/images/symbols/viking.png',
      'sword': '/images/symbols/viking.png',
      'lance': '/images/symbols/viking.png',
      'spear': '/images/symbols/viking.png',
      
      // Royauté/Pouvoir
      'roi': '/images/symbols/fleur-de-lys.png',
      'king': '/images/symbols/fleur-de-lys.png',
      'reine': '/images/symbols/fleur-de-lys.png',
      'queen': '/images/symbols/fleur-de-lys.png',
      'empereur': '/images/symbols/fleur-de-lys.png',
      'emperor': '/images/symbols/fleur-de-lys.png',
      'impératrice': '/images/symbols/fleur-de-lys.png',
      'empress': '/images/symbols/fleur-de-lys.png',
      'pouvoir': '/images/symbols/fleur-de-lys.png',
      'power': '/images/symbols/fleur-de-lys.png',
      'autorité': '/images/symbols/fleur-de-lys.png',
      'authority': '/images/symbols/fleur-de-lys.png',
      
      // Nature
      'nature': '/images/symbols/triskelion.png',
      'naturel': '/images/symbols/triskelion.png',
      'natural': '/images/symbols/triskelion.png',
      'plante': '/images/symbols/triskelion.png',
      'plant': '/images/symbols/triskelion.png',
      'végétal': '/images/symbols/triskelion.png',
      'végétation': '/images/symbols/triskelion.png',
      'vegetation': '/images/symbols/triskelion.png',
      
      // Astronomie
      'cosmique': '/images/symbols/aztec.png',
      'cosmic': '/images/symbols/aztec.png',
      'céleste': '/images/symbols/aztec.png',
      'celestial': '/images/symbols/aztec.png',
      'astronomie': '/images/symbols/aztec.png',
      'astronomy': '/images/symbols/aztec.png',
      'astrologie': '/images/symbols/aztec.png',
      'astrology': '/images/symbols/aztec.png',
      'planète': '/images/symbols/aztec.png',
      'planet': '/images/symbols/aztec.png',
      'constellation': '/images/symbols/aztec.png',
      
      // Géométrie/Mathématiques
      'mathématique': '/images/symbols/greek-meander.png',
      'mathematical': '/images/symbols/greek-meander.png',
      'géométrique': '/images/symbols/greek-meander.png',
      'geometric': '/images/symbols/greek-meander.png',
      'symétrie': '/images/symbols/greek-meander.png',
      'symmetry': '/images/symbols/greek-meander.png',
      'proportion': '/images/symbols/greek-meander.png',
      'proportions': '/images/symbols/greek-meander.png',
      
      // Artisanat/Art
      'artisanat': '/images/symbols/seigaiha.png',
      'craft': '/images/symbols/seigaiha.png',
      'textile': '/images/symbols/seigaiha.png',
      'tissu': '/images/symbols/seigaiha.png',
      'fabric': '/images/symbols/seigaiha.png',
      'broderie': '/images/symbols/seigaiha.png',
      'embroidery': '/images/symbols/seigaiha.png',
      'poterie': '/images/symbols/aboriginal.png',
      'pottery': '/images/symbols/aboriginal.png',
      'céramique': '/images/symbols/aboriginal.png',
      'ceramic': '/images/symbols/aboriginal.png'
    };
    
    const lowerSymbolName = symbolName.toLowerCase();
    for (const [keyword, image] of Object.entries(categoryMappings)) {
      if (lowerSymbolName.includes(keyword)) {
        console.log(`✅ [ImageService] Correspondance par catégorie "${keyword}": ${image}`);
        return image;
      }
    }
    
    // 8. Fallback par défaut selon la culture
    const defaultCulturalFallback = culturalFallbacks[culture] || culturalFallbacks[culture.toLowerCase()];
    if (defaultCulturalFallback) {
      console.log(`✅ [ImageService] Fallback culturel par défaut: ${defaultCulturalFallback}`);
      return defaultCulturalFallback;
    }
    
    // 9. Dernier recours - choisir selon le type de symbole
    if (symbolName.length <= 5) {
      // Symboles courts -> probablement des caractères ou des formes simples
      console.log(`✅ [ImageService] Symbole court -> mandala: /images/symbols/mandala.png`);
      return "/images/symbols/mandala.png";
    } else if (symbolName.includes(' ')) {
      // Symboles composés -> probablement des concepts complexes
      console.log(`✅ [ImageService] Symbole composé -> greek-meander: /images/symbols/greek-meander.png`);
      return "/images/symbols/greek-meander.png";
    } else {
      // Défaut final
      console.log(`✅ [ImageService] Fallback final -> triskelion: /images/symbols/triskelion.png`);
      return "/images/symbols/triskelion.png";
    }
  }
  
  /**
   * Normalise une chaîne pour la comparaison (méthode améliorée)
   */
  private static normalizeString(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
      .replace(/[^\w\s]/g, ' ') // Remplace la ponctuation par des espaces
      .replace(/\s+/g, ' ') // Consolide les espaces multiples
      .trim();
  }
  
  /**
   * Vérifie si une URL d'image est en cache et valide
   */
  static getCachedImageUrl(key: string): string | null {
    const cached = imageCache.get(key);
    if (!cached) return null;
    
    const now = Date.now();
    if (now - cached.timestamp > CACHE_DURATION) {
      imageCache.delete(key);
      return null;
    }
    
    return cached.isValid ? cached.url : null;
  }
  
  /**
   * Met en cache le résultat d'une vérification d'URL
   */
  static setCachedImageUrl(key: string, url: string, isValid: boolean): void {
    imageCache.set(key, {
      url,
      isValid,
      timestamp: Date.now(),
      retryCount: 0
    });
  }
  
  /**
   * Précharge une image de manière asynchrone
   */
  static async preloadImage(url: string): Promise<boolean> {
    if (!url || url === "/placeholder.svg") return true;
    
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
      
      // Timeout de 8 secondes pour le preloading
      setTimeout(() => resolve(false), 8000);
    });
  }
  
  /**
   * Vérifie si une URL d'image est accessible avec retry
   */
  static async verifyImageUrl(url: string, maxRetries: number = MAX_RETRY_COUNT): Promise<boolean> {
    if (!url || url.startsWith('/')) return true; // Images locales supposées valides
    
    const cacheKey = `verify_${url}`;
    const cached = this.getCachedImageUrl(cacheKey);
    if (cached !== null) return true;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const success = await this.preloadImage(url);
        if (success) {
          this.setCachedImageUrl(cacheKey, url, true);
          return true;
        }
      } catch (error) {
        console.warn(`[ImageService] Tentative ${attempt + 1}/${maxRetries} échouée pour ${url}:`, error);
      }
      
      // Attendre avant le prochain essai (backoff exponentiel)
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
    
    this.setCachedImageUrl(cacheKey, url, false);
    return false;
  }
  
  /**
   * Nettoie le cache des images expirées
   */
  static cleanupCache(): void {
    const now = Date.now();
    for (const [key, entry] of imageCache.entries()) {
      if (now - entry.timestamp > CACHE_DURATION) {
        imageCache.delete(key);
      }
    }
  }
}

// Nettoyage automatique du cache toutes les 10 minutes
setInterval(() => ImageService.cleanupCache(), 10 * 60 * 1000);
