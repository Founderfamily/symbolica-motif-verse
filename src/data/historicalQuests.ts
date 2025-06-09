
import { TreasureQuest } from '@/types/quests';

export const historicalQuests: Omit<TreasureQuest, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    title: "Le Trésor Perdu des Templiers",
    description: "Suivez les traces des Chevaliers du Temple et découvrez où ils ont caché leur légendaire trésor avant la dissolution de l'Ordre en 1307.",
    story_background: "En 1307, le roi Philippe le Bel ordonne l'arrestation de tous les Templiers de France. Mais la veille, des navires mystérieux quittent La Rochelle avec un trésor considérable. Où ont-ils emmené les richesses accumulées pendant deux siècles de croisades ?",
    quest_type: 'templar',
    difficulty_level: 'expert',
    max_participants: 8,
    min_participants: 2,
    status: 'active',
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    reward_points: 500,
    special_rewards: [
      { type: 'badge', name: 'Gardien du Temple', description: 'Badge exclusif des découvreurs du trésor templier' },
      { type: 'title', name: 'Chevalier Historien', description: 'Titre honorifique pour expertise historique' }
    ],
    clues: [
      {
        id: 1,
        title: "La Commanderie de Paris",
        description: "Tout commence à l'ancien quartier général des Templiers à Paris. Trouvez l'emplacement de l'ancienne commanderie et découvrez le premier indice gravé dans la pierre.",
        hint: "Cherchez près de la station de métro Temple, là où se dressait autrefois la tour du Temple.",
        location: {
          latitude: 48.8670,
          longitude: 2.3616,
          radius: 100
        },
        symbol_reference: "croix_templiere",
        validation_type: 'location',
        validation_data: { required_radius: 100 },
        points: 50,
        unlock_condition: "start"
      },
      {
        id: 2,
        title: "Le Code de Gisors",
        description: "Dans la forteresse normande de Gisors, déchiffrez les symboles gravés dans les cachots où furent emprisonnés les derniers Templiers.",
        hint: "Les graffitis des prisonniers templiers dans la tour de Gisors contiennent un code. Cherchez la croix pattée accompagnée de chiffres romains.",
        location: {
          latitude: 49.2776,
          longitude: 1.7756,
          radius: 50
        },
        symbol_reference: "croix_pattee",
        validation_type: 'symbol',
        validation_data: { required_symbol: "croix_pattee_gisors" },
        points: 75,
        unlock_condition: "clue_1_completed"
      },
      {
        id: 3,
        title: "La Route de La Rochelle",
        description: "Suivez la route qu'ont empruntée les navires templiers depuis La Rochelle. Le port cache encore des indices sur leur destination finale.",
        hint: "Les registres portuaires mentionnent 18 navires partis dans la nuit du 12 octobre 1307. Leur destination était codée sous le nom 'Terre Promise'.",
        location: {
          latitude: 46.1591,
          longitude: -1.1520,
          radius: 200
        },
        validation_type: 'code',
        validation_data: { required_code: "TERRE1307" },
        points: 100,
        unlock_condition: "clue_2_completed"
      },
      {
        id: 4,
        title: "L'Île Mystérieuse",
        description: "Les navires templiers ont fait escale sur une île secrète. Utilisez les coordonnées déchiffrées pour localiser le trésor final.",
        hint: "Oak Island en Nouvelle-Écosse... ou peut-être plus proche ? Les Templiers connaissaient des routes secrètes vers des terres inconnues.",
        validation_type: 'photo',
        validation_data: { required_elements: ["stone_carving", "templar_cross"] },
        points: 275,
        unlock_condition: "clue_3_completed"
      }
    ],
    target_symbols: ["croix_templiere", "croix_pattee", "sceau_templier"],
    created_by: null,
    translations: {
      en: {
        title: "The Lost Treasure of the Templars",
        description: "Follow the traces of the Knights Templar and discover where they hid their legendary treasure before the dissolution of the Order in 1307."
      },
      fr: {
        title: "Le Trésor Perdu des Templiers",
        description: "Suivez les traces des Chevaliers du Temple et découvrez où ils ont caché leur légendaire trésor avant la dissolution de l'Ordre en 1307."
      }
    }
  },
  {
    title: "La Quête de l'Eldorado",
    description: "Partez sur les traces de la légendaire cité d'or des Amériques. Suivez les indices laissés par les conquistadors et les peuples indigènes.",
    story_background: "Depuis le XVIe siècle, l'Eldorado fascine explorateurs et chercheurs de trésors. Entre mythe et réalité, cette quête vous mènera des hauts plateaux colombiens aux forêts amazoniennes.",
    quest_type: 'lost_civilization',
    difficulty_level: 'master',
    max_participants: 6,
    min_participants: 3,
    status: 'upcoming',
    start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    reward_points: 750,
    special_rewards: [
      { type: 'badge', name: 'Conquistador Moderne', description: 'Pour avoir percé le mystère de l\'Eldorado' },
      { type: 'item', name: 'Carte Ancienne', description: 'Reproduction d\'une carte du XVIe siècle' }
    ],
    clues: [
      {
        id: 1,
        title: "Le Lac Guatavita",
        description: "Commencez votre quête au lac sacré des Muiscas, où naissait la légende de l'homme doré.",
        hint: "C'est ici que se déroulait le rituel de l'Eldorado. Cherchez les pétroglyphes autour du lac.",
        location: {
          latitude: 4.9711,
          longitude: -73.7753,
          radius: 500
        },
        validation_type: 'location',
        validation_data: { required_radius: 500 },
        points: 100,
        unlock_condition: "start"
      },
      {
        id: 2,
        title: "Les Chroniques de Gonzalo Pizarro",
        description: "Déchiffrez les notes de l'expédition de Pizarro vers la Canela et l'Eldorado (1541-1542).",
        hint: "Pizarro cherchait la cannelle et trouva l'Amazone. Ses notes mentionnent une 'grande rivière' et des 'palais d'or'.",
        validation_type: 'code',
        validation_data: { required_code: "CANELA1541" },
        points: 150,
        unlock_condition: "clue_1_completed"
      },
      {
        id: 3,
        title: "La Cité Perdue de Paititi",
        description: "Suivez les traces vers la dernière capitale inca cachée dans la jungle péruvienne.",
        hint: "Au-delà de Machu Picchu, dans la région de Madre de Dios, les Incas auraient bâti leur refuge ultime.",
        location: {
          latitude: -12.8333,
          longitude: -69.5000,
          radius: 1000
        },
        validation_type: 'photo',
        validation_data: { required_elements: ["inca_stonework", "jungle_ruins"] },
        points: 500,
        unlock_condition: "clue_2_completed"
      }
    ],
    target_symbols: ["soleil_inca", "or_muisca", "serpent_quetzal"],
    created_by: null,
    translations: {
      en: {
        title: "The Quest for El Dorado",
        description: "Follow the trail of the legendary golden city of the Americas. Trace the clues left by conquistadors and indigenous peoples."
      },
      fr: {
        title: "La Quête de l'Eldorado",
        description: "Partez sur les traces de la légendaire cité d'or des Amériques. Suivez les indices laissés par les conquistadors et les peuples indigènes."
      }
    }
  },
  {
    title: "L'Arche d'Alliance Perdue",
    description: "Retrouvez l'un des objets les plus sacrés de l'humanité. De Jérusalem à l'Éthiopie, suivez sa trace millénaire.",
    story_background: "Depuis la destruction du Premier Temple en 586 av. J.-C., l'Arche d'Alliance a disparu. Les légendes la placent en Éthiopie, mais d'autres pistes mènent vers des cachettes secrètes.",
    quest_type: 'grail',
    difficulty_level: 'master',
    max_participants: 4,
    min_participants: 2,
    status: 'upcoming',
    start_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    reward_points: 1000,
    special_rewards: [
      { type: 'badge', name: 'Gardien de l\'Arche', description: 'Titre le plus prestigieux pour cette découverte historique' },
      { type: 'title', name: 'Archéologue Biblique', description: 'Reconnaissance de vos compétences en archéologie sacrée' }
    ],
    clues: [
      {
        id: 1,
        title: "Le Mont du Temple",
        description: "Commencez là où tout a commencé : le Saint des Saints du Temple de Salomon à Jérusalem.",
        hint: "Sous l'Esplanade des Mosquées se cachent peut-être encore des indices de l'emplacement originel de l'Arche.",
        location: {
          latitude: 31.7781,
          longitude: 35.2360,
          radius: 100
        },
        validation_type: 'location',
        validation_data: { required_radius: 100 },
        points: 150,
        unlock_condition: "start"
      },
      {
        id: 2,
        title: "Les Manuscrits de Qumrân",
        description: "Les Esséniens de Qumrân ont-ils caché des indices sur le sort de l'Arche ? Déchiffrez le Rouleau de Cuivre.",
        hint: "Le Rouleau de Cuivre (3Q15) liste 64 cachettes de trésors. L'une d'elles pourrait concerner l'Arche.",
        validation_type: 'code',
        validation_data: { required_code: "3Q15CUIVRE" },
        points: 200,
        unlock_condition: "clue_1_completed"
      },
      {
        id: 3,
        title: "Axoum et l'Église Sainte-Marie-de-Sion",
        description: "En Éthiopie, l'Église orthodoxe prétend détenir l'Arche depuis 3000 ans. Vérifiez cette affirmation extraordinaire.",
        hint: "Seul le gardien de l'Arche peut la voir. Mais des indices architecturaux et historiques peuvent confirmer sa présence.",
        location: {
          latitude: 14.1319,
          longitude: 38.7203,
          radius: 50
        },
        validation_type: 'symbol',
        validation_data: { required_symbol: "arche_ethiopienne" },
        points: 650,
        unlock_condition: "clue_2_completed"
      }
    ],
    target_symbols: ["arche_alliance", "tables_loi", "cherubins"],
    created_by: null,
    translations: {
      en: {
        title: "The Lost Ark of the Covenant",
        description: "Find one of humanity's most sacred objects. From Jerusalem to Ethiopia, follow its millennial trace."
      },
      fr: {
        title: "L'Arche d'Alliance Perdue",
        description: "Retrouvez l'un des objets les plus sacrés de l'humanité. De Jérusalem à l'Éthiopie, suivez sa trace millénaire."
      }
    }
  }
];
