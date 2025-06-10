
export const historicalQuests = [
  {
    title: "Le Trésor Perdu des Templiers",
    description: "Découvrez les secrets cachés de l'Ordre du Temple et suivez les indices laissés par les derniers Templiers avant leur dissolution en 1307.",
    story_background: "En 1307, le roi Philippe IV de France ordonne l'arrestation de tous les Templiers. Avant leur capture, les derniers membres de l'ordre cachent leur immense trésor dans des lieux secrets, protégés par des codes et des symboles mystérieux. Votre mission est de déchiffrer ces indices millénaires pour retrouver l'un des plus grands trésors perdus de l'Histoire.",
    quest_type: "templar",
    difficulty_level: "intermediate",
    max_participants: 6,
    min_participants: 2,
    status: "active",
    start_date: "2024-01-15T10:00:00Z",
    end_date: "2024-12-31T23:59:59Z",
    reward_points: 500,
    special_rewards: [
      "Badge Templier Maître",
      "Accès aux archives secrètes",
      "Certificat d'expertise historique"
    ],
    clues: [
      {
        id: 1,
        title: "Le Sceau du Grand Maître",
        description: "Trouvez le sceau perdu de Jacques de Molay, dernier Grand Maître des Templiers",
        hint: "Cherchez où la justice fut rendue, mais l'innocence ignorée",
        location: {
          latitude: 48.8566,
          longitude: 2.3522,
          radius: 100
        },
        symbol_reference: "templar_seal",
        validation_type: "symbol",
        validation_data: { expected_symbol: "cross_pattee" },
        points: 100,
        unlock_condition: "start"
      },
      {
        id: 2,
        title: "L'Énigme de la Commanderie",
        description: "Déchiffrez le message secret gravé dans la pierre",
        hint: "Là où les chevaliers priaient, les pierres parlent encore",
        location: {
          latitude: 48.8606,
          longitude: 2.3376,
          radius: 50
        },
        symbol_reference: "templar_cross",
        validation_type: "code",
        validation_data: { expected_code: "TEMPLUM_DEI" },
        points: 150,
        unlock_condition: "clue_1_completed"
      },
      {
        id: 3,
        title: "Le Trésor Final",
        description: "Utilisez tous les indices pour localiser le trésor",
        hint: "Sous la protection de la Dame Blanche, l'or sommeille",
        location: {
          latitude: 48.8534,
          longitude: 2.3488,
          radius: 25
        },
        symbol_reference: "templar_treasure",
        validation_type: "location",
        validation_data: { treasure_marker: true },
        points: 250,
        unlock_condition: "all_previous_completed"
      }
    ],
    target_symbols: ["cross_pattee", "templar_seal", "baphomet"],
    created_by: "00000000-0000-0000-0000-000000000000",
    translations: {
      en: {
        title: "The Lost Treasure of the Templars",
        description: "Discover the hidden secrets of the Order of the Temple and follow the clues left by the last Templars before their dissolution in 1307."
      },
      fr: {
        title: "Le Trésor Perdu des Templiers",
        description: "Découvrez les secrets cachés de l'Ordre du Temple et suivez les indices laissés par les derniers Templiers avant leur dissolution en 1307."
      }
    }
  },
  {
    title: "Les Mystères de la Civilisation Perdue d'Atlantide",
    description: "Explorez les vestiges supposés de la légendaire Atlantide et déchiffrez les symboles d'une civilisation avancée disparue.",
    story_background: "Selon Platon, l'Atlantide était une île située au-delà des colonnes d'Hercule, habitée par une civilisation technologiquement avancée qui disparut en une seule journée et une nuit. Des indices suggèrent que certains survivants auraient laissé des traces de leur savoir dans des monuments à travers le monde. Votre quête consiste à retrouver ces vestiges et à percer les secrets de leur technologie perdue.",
    quest_type: "lost_civilization",
    difficulty_level: "expert",
    max_participants: 8,
    min_participants: 3,
    status: "active",
    start_date: "2024-02-01T10:00:00Z",
    end_date: "2024-12-31T23:59:59Z",
    reward_points: 750,
    special_rewards: [
      "Badge Archéologue Légendaire",
      "Cristal d'Atlantide (réplique)",
      "Accès aux théories avancées"
    ],
    clues: [
      {
        id: 1,
        title: "Le Premier Cristal",
        description: "Découvrez le cristal de navigation atlante",
        hint: "Où les étoiles guident les navigateurs depuis des millénaires",
        location: {
          latitude: 48.8738,
          longitude: 2.2950,
          radius: 150
        },
        symbol_reference: "atlantis_crystal",
        validation_type: "symbol",
        validation_data: { crystal_frequency: "432hz" },
        points: 200,
        unlock_condition: "start"
      },
      {
        id: 2,
        title: "Les Colonnes de la Sagesse",
        description: "Trouvez les colonnes où était gravée la connaissance atlante",
        hint: "Entre deux mondes, la sagesse fut préservée",
        location: {
          latitude: 48.8606,
          longitude: 2.3376,
          radius: 75
        },
        symbol_reference: "atlantis_columns",
        validation_type: "photo",
        validation_data: { required_symbols: ["spiral", "trident"] },
        points: 250,
        unlock_condition: "clue_1_completed"
      },
      {
        id: 3,
        title: "Le Cœur de l'Atlantide",
        description: "Localisez le dernier vestige du pouvoir atlante",
        hint: "Au centre de la cité de lumière, le cœur bat encore",
        location: {
          latitude: 48.8566,
          longitude: 2.3522,
          radius: 50
        },
        symbol_reference: "atlantis_heart",
        validation_type: "code",
        validation_data: { expected_code: "POSEIDON_ETERNAL" },
        points: 300,
        unlock_condition: "all_previous_completed"
      }
    ],
    target_symbols: ["trident", "spiral", "atlantis_crystal"],
    created_by: "00000000-0000-0000-0000-000000000000",
    translations: {
      en: {
        title: "The Mysteries of the Lost Civilization of Atlantis",
        description: "Explore the supposed remains of legendary Atlantis and decipher the symbols of an advanced civilization that disappeared."
      },
      fr: {
        title: "Les Mystères de la Civilisation Perdue d'Atlantide",
        description: "Explorez les vestiges supposés de la légendaire Atlantide et déchiffrez les symboles d'une civilisation avancée disparue."
      }
    }
  },
  {
    title: "La Quête du Saint Graal",
    description: "Suivez les traces des chevaliers de la Table Ronde dans leur quête éternelle du Saint Graal, le calice utilisé lors de la Cène.",
    story_background: "Le Saint Graal, selon la légende chrétienne et arthurienne, est le calice dans lequel Joseph d'Arimathie recueillit le sang du Christ. Cette relique sacrée aurait des pouvoirs de guérison et d'immortalité. De nombreux chevaliers, notamment ceux de la Table Ronde, ont consacré leur vie à sa recherche. Votre mission est de suivre leurs traces et de résoudre les énigmes qu'ils ont laissées derrière eux.",
    quest_type: "grail",
    difficulty_level: "master",
    max_participants: 4,
    min_participants: 2,
    status: "active",
    start_date: "2024-03-01T10:00:00Z",
    end_date: "2024-12-31T23:59:59Z",
    reward_points: 1000,
    special_rewards: [
      "Badge Chevalier du Graal",
      "Calice commémoratif",
      "Titre de Gardien des Mystères"
    ],
    clues: [
      {
        id: 1,
        title: "L'Épée dans la Pierre",
        description: "Trouvez l'épée d'Arthur et prouvez votre valeur",
        hint: "Là où le roi fut couronné, l'épée attend encore",
        location: {
          latitude: 48.8529,
          longitude: 2.3499,
          radius: 100
        },
        symbol_reference: "excalibur",
        validation_type: "symbol",
        validation_data: { sword_inscription: "rex_quondam_rexque_futurus" },
        points: 300,
        unlock_condition: "start"
      },
      {
        id: 2,
        title: "La Table Ronde",
        description: "Assemblez les chevaliers et résolvez l'énigme de la Table Ronde",
        hint: "Douze sièges pour douze élus, mais un reste vide",
        location: {
          latitude: 48.8606,
          longitude: 2.3376,
          radius: 80
        },
        symbol_reference: "round_table",
        validation_type: "code",
        validation_data: { expected_code: "SIEGE_PERILLEUX" },
        points: 350,
        unlock_condition: "clue_1_completed"
      },
      {
        id: 3,
        title: "Le Saint Graal",
        description: "Découvrez l'emplacement final du Saint Graal",
        hint: "Dans la chapelle cachée, sous la protection de Marie",
        location: {
          latitude: 48.8534,
          longitude: 2.3488,
          radius: 30
        },
        symbol_reference: "holy_grail",
        validation_type: "location",
        validation_data: { sacred_vessel: true },
        points: 350,
        unlock_condition: "all_previous_completed"
      }
    ],
    target_symbols: ["grail", "excalibur", "round_table"],
    created_by: "00000000-0000-0000-0000-000000000000",
    translations: {
      en: {
        title: "The Quest for the Holy Grail",
        description: "Follow in the footsteps of the Knights of the Round Table in their eternal quest for the Holy Grail, the chalice used at the Last Supper."
      },
      fr: {
        title: "La Quête du Saint Graal",
        description: "Suivez les traces des chevaliers de la Table Ronde dans leur quête éternelle du Saint Graal, le calice utilisé lors de la Cène."
      }
    }
  }
];
