
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
  },
  {
    title: "Le Trésor de Napoléon en Corse",
    description: "Découvrez le trésor personnel de Napoléon Bonaparte caché dans sa Corse natale avant son exil définitif.",
    story_background: "En 1815, avant son exil définitif à Sainte-Hélène, Napoléon aurait confié à des proches corses une partie de sa fortune personnelle. Ce trésor, composé d'or, de bijoux et de documents secrets, aurait été dissimulé dans les montagnes corses selon un code élaboré par l'Empereur lui-même.",
    quest_type: "templar",
    difficulty_level: "intermediate",
    max_participants: 6,
    min_participants: 3,
    status: "active",
    start_date: "2024-04-01T10:00:00Z",
    end_date: "2024-12-31T23:59:59Z",
    reward_points: 600,
    special_rewards: [
      "Badge Garde Impériale",
      "Réplique de l'Aigle Napoléonien",
      "Accès aux archives corses"
    ],
    clues: [
      {
        id: 1,
        title: "La Maison Bonaparte",
        description: "Trouvez l'indice caché dans la maison natale de Napoléon",
        hint: "Là où naquit l'Empereur, le premier secret sommeille",
        location: {
          latitude: 41.9196,
          longitude: 8.7386,
          radius: 50
        },
        symbol_reference: "napoleon_eagle",
        validation_type: "symbol",
        validation_data: { expected_symbol: "imperial_eagle" },
        points: 150,
        unlock_condition: "start"
      },
      {
        id: 2,
        title: "Le Code des Montagnes",
        description: "Déchiffrez le code secret dans les montagnes corses",
        hint: "Où les bergers gardent leurs troupeaux, l'Empereur cacha ses secrets",
        location: {
          latitude: 42.1469,
          longitude: 9.0233,
          radius: 200
        },
        symbol_reference: "corsican_mountains",
        validation_type: "code",
        validation_data: { expected_code: "AJACCIO_1769" },
        points: 200,
        unlock_condition: "clue_1_completed"
      },
      {
        id: 3,
        title: "L'Héritage Impérial",
        description: "Localisez le trésor final de l'Empereur",
        hint: "Sous l'œil de l'aigle, l'or de l'Empire repose",
        location: {
          latitude: 41.8919,
          longitude: 8.7386,
          radius: 100
        },
        symbol_reference: "imperial_treasure",
        validation_type: "location",
        validation_data: { treasure_marker: true },
        points: 250,
        unlock_condition: "all_previous_completed"
      }
    ],
    target_symbols: ["imperial_eagle", "corsican_cross", "napoleon_n"],
    created_by: "00000000-0000-0000-0000-000000000000",
    translations: {
      en: {
        title: "Napoleon's Treasure in Corsica",
        description: "Discover Napoleon Bonaparte's personal treasure hidden in his native Corsica before his final exile."
      },
      fr: {
        title: "Le Trésor de Napoléon en Corse",
        description: "Découvrez le trésor personnel de Napoléon Bonaparte caché dans sa Corse natale avant son exil définitif."
      }
    }
  },
  {
    title: "Les Secrets de Versailles",
    description: "Percez les mystères cachés dans les appartements secrets du château de Versailles à l'époque de Louis XIV.",
    story_background: "Le château de Versailles recèle de nombreux passages secrets et cachettes utilisés par Louis XIV et sa cour. Ces espaces dissimulaient correspondances secrètes, trésors royaux et documents d'État. Votre mission est de retrouver ces passages oubliés et leurs secrets.",
    quest_type: "templar",
    difficulty_level: "expert",
    max_participants: 8,
    min_participants: 4,
    status: "active",
    start_date: "2024-05-01T10:00:00Z",
    end_date: "2024-12-31T23:59:59Z",
    reward_points: 800,
    special_rewards: [
      "Badge Courtisan Royal",
      "Clé dorée de Versailles",
      "Accès aux archives royales"
    ],
    clues: [
      {
        id: 1,
        title: "La Galerie des Glaces",
        description: "Trouvez le miroir secret dans la célèbre galerie",
        hint: "Parmi 357 miroirs, un seul révèle la vérité",
        location: {
          latitude: 48.8048,
          longitude: 2.1203,
          radius: 50
        },
        symbol_reference: "versailles_mirror",
        validation_type: "symbol",
        validation_data: { expected_symbol: "royal_fleur_de_lys" },
        points: 200,
        unlock_condition: "start"
      },
      {
        id: 2,
        title: "L'Appartement de Madame de Maintenon",
        description: "Découvrez la cachette secrète de la favorite royale",
        hint: "Là où l'épouse secrète priait, les lettres d'amour reposent",
        location: {
          latitude: 48.8041,
          longitude: 2.1204,
          radius: 100
        },
        symbol_reference: "maintenon_secret",
        validation_type: "code",
        validation_data: { expected_code: "MADAME_ROYALE" },
        points: 300,
        unlock_condition: "clue_1_completed"
      },
      {
        id: 3,
        title: "La Chambre du Roi-Soleil",
        description: "Accédez au secret ultime de Louis XIV",
        hint: "Où le soleil se couche, le roi-soleil cache son trésor",
        location: {
          latitude: 48.8047,
          longitude: 2.1202,
          radius: 30
        },
        symbol_reference: "sun_king_treasure",
        validation_type: "location",
        validation_data: { royal_seal: true },
        points: 300,
        unlock_condition: "all_previous_completed"
      }
    ],
    target_symbols: ["fleur_de_lys", "sun_symbol", "versailles_key"],
    created_by: "00000000-0000-0000-0000-000000000000",
    translations: {
      en: {
        title: "The Secrets of Versailles",
        description: "Uncover the mysteries hidden in the secret apartments of the Palace of Versailles during the time of Louis XIV."
      },
      fr: {
        title: "Les Secrets de Versailles",
        description: "Percez les mystères cachés dans les appartements secrets du château de Versailles à l'époque de Louis XIV."
      }
    }
  },
  {
    title: "Le Mystère des Cathares du Languedoc",
    description: "Suivez les traces des derniers Cathares et découvrez leurs trésors spirituels cachés dans les Corbières.",
    story_background: "Au 13ème siècle, les Cathares du Languedoc furent persécutés lors de la croisade des Albigeois. Avant leur disparition, ils auraient caché leurs textes sacrés et leurs trésors dans les forteresses des Corbières. Ces 'Parfaits' ont laissé des indices codés pour les générations futures.",
    quest_type: "lost_civilization",
    difficulty_level: "expert",
    max_participants: 6,
    min_participants: 3,
    status: "active",
    start_date: "2024-06-01T10:00:00Z",
    end_date: "2024-12-31T23:59:59Z",
    reward_points: 750,
    special_rewards: [
      "Badge Parfait Cathare",
      "Manuscrit enluminé (réplique)",
      "Accès aux archives occitanes"
    ],
    clues: [
      {
        id: 1,
        title: "La Forteresse de Montségur",
        description: "Trouvez l'indice laissé par les derniers Parfaits",
        hint: "Là où 225 Parfaits choisirent le feu, leur secret survit",
        location: {
          latitude: 42.8747,
          longitude: 1.8311,
          radius: 100
        },
        symbol_reference: "cathar_cross",
        validation_type: "symbol",
        validation_data: { expected_symbol: "occitan_cross" },
        points: 200,
        unlock_condition: "start"
      },
      {
        id: 2,
        title: "Les Grottes d'Ornolac",
        description: "Découvrez les textes cachés dans les grottes sacrées",
        hint: "Dans les entrailles de la terre, la lumière pure brille",
        location: {
          latitude: 42.8156,
          longitude: 1.8789,
          radius: 150
        },
        symbol_reference: "cathar_manuscript",
        validation_type: "code",
        validation_data: { expected_code: "LUX_LUCET" },
        points: 250,
        unlock_condition: "clue_1_completed"
      },
      {
        id: 3,
        title: "Le Trésor des Parfaits",
        description: "Localisez le trésor spirituel des Cathares",
        hint: "Où la croix occitane veille, l'esprit cathare demeure",
        location: {
          latitude: 42.9167,
          longitude: 1.8833,
          radius: 75
        },
        symbol_reference: "cathar_treasure",
        validation_type: "location",
        validation_data: { spiritual_treasure: true },
        points: 300,
        unlock_condition: "all_previous_completed"
      }
    ],
    target_symbols: ["occitan_cross", "cathar_dove", "languedoc_symbol"],
    created_by: "00000000-0000-0000-0000-000000000000",
    translations: {
      en: {
        title: "The Mystery of the Languedoc Cathars",
        description: "Follow the traces of the last Cathars and discover their spiritual treasures hidden in the Corbières."
      },
      fr: {
        title: "Le Mystère des Cathares du Languedoc",
        description: "Suivez les traces des derniers Cathares et découvrez leurs trésors spirituels cachés dans les Corbières."
      }
    }
  },
  {
    title: "Les Souterrains Secrets de Lyon",
    description: "Explorez les traboules et souterrains secrets de Lyon utilisés par la Résistance pendant la Seconde Guerre mondiale.",
    story_background: "Pendant l'Occupation, la Résistance lyonnaise utilisait un réseau complexe de traboules et de souterrains pour échapper aux nazis. Ces passages secrets reliaient les quartiers et cachaient armes, documents et trésors de guerre. Jean Moulin lui-même utilisa certains de ces passages.",
    quest_type: "templar",
    difficulty_level: "intermediate",
    max_participants: 8,
    min_participants: 4,
    status: "active",
    start_date: "2024-07-01T10:00:00Z",
    end_date: "2024-12-31T23:59:59Z",
    reward_points: 650,
    special_rewards: [
      "Badge Résistant Lyonnais",
      "Carte secrète des traboules",
      "Accès aux archives de la Résistance"
    ],
    clues: [
      {
        id: 1,
        title: "La Traboule du Vieux Lyon",
        description: "Trouvez l'entrée secrète utilisée par Jean Moulin",
        hint: "Là où la soie se tissait, la liberté se tramait",
        location: {
          latitude: 45.7640,
          longitude: 4.8276,
          radius: 75
        },
        symbol_reference: "lyon_traboule",
        validation_type: "symbol",
        validation_data: { expected_symbol: "resistance_cross" },
        points: 150,
        unlock_condition: "start"
      },
      {
        id: 2,
        title: "Le Code de la Croix-Rousse",
        description: "Déchiffrez le message secret des canuts résistants",
        hint: "Sur la colline qui travaille, les messages se cachent",
        location: {
          latitude: 45.7740,
          longitude: 4.8320,
          radius: 100
        },
        symbol_reference: "canuts_code",
        validation_type: "code",
        validation_data: { expected_code: "VIVRE_LIBRE" },
        points: 200,
        unlock_condition: "clue_1_completed"
      },
      {
        id: 3,
        title: "Le Refuge de la Résistance",
        description: "Découvrez la cache secrète finale",
        hint: "Sous les pavés de la presqu'île, l'espoir se cache",
        location: {
          latitude: 45.7578,
          longitude: 4.8320,
          radius: 50
        },
        symbol_reference: "resistance_cache",
        validation_type: "location",
        validation_data: { resistance_symbol: true },
        points: 300,
        unlock_condition: "all_previous_completed"
      }
    ],
    target_symbols: ["resistance_cross", "lyon_lion", "french_flag"],
    created_by: "00000000-0000-0000-0000-000000000000",
    translations: {
      en: {
        title: "The Secret Underground of Lyon",
        description: "Explore the traboules and secret underground passages of Lyon used by the Resistance during World War II."
      },
      fr: {
        title: "Les Souterrains Secrets de Lyon",
        description: "Explorez les traboules et souterrains secrets de Lyon utilisés par la Résistance pendant la Seconde Guerre mondiale."
      }
    }
  },
  {
    title: "Le Trésor des Ducs de Bourgogne",
    description: "Retrouvez le fabuleux trésor des Ducs de Bourgogne dissimulé lors des guerres de succession du 15ème siècle.",
    story_background: "Au 15ème siècle, les Ducs de Bourgogne rivalisaient en richesse avec les rois de France. Lors des guerres de succession, le dernier duc, Charles le Téméraire, aurait fait cacher le trésor ducal dans les vignobles bourguignons. Ce trésor légendaire comprend des joyaux, des manuscrits précieux et des pièces d'or.",
    quest_type: "templar",
    difficulty_level: "expert",
    max_participants: 6,
    min_participants: 3,
    status: "active",
    start_date: "2024-08-01T10:00:00Z",
    end_date: "2024-12-31T23:59:59Z",
    reward_points: 900,
    special_rewards: [
      "Badge Duc de Bourgogne",
      "Coupe ducale (réplique)",
      "Accès aux archives ducales"
    ],
    clues: [
      {
        id: 1,
        title: "Le Palais des Ducs de Dijon",
        description: "Trouvez l'indice caché dans l'ancienne résidence ducale",
        hint: "Où les ducs régnaient, leur secret première étape",
        location: {
          latitude: 47.3220,
          longitude: 5.0415,
          radius: 100
        },
        symbol_reference: "burgundy_cross",
        validation_type: "symbol",
        validation_data: { expected_symbol: "ducal_cross" },
        points: 250,
        unlock_condition: "start"
      },
      {
        id: 2,
        title: "Les Vignobles de Beaune",
        description: "Découvrez le code caché dans les caves des Hospices",
        hint: "Là où le vin divin coule, l'or ducal repose",
        location: {
          latitude: 47.0202,
          longitude: 4.8370,
          radius: 150
        },
        symbol_reference: "burgundy_wine",
        validation_type: "code",
        validation_data: { expected_code: "CHARLES_TEMERAIRE" },
        points: 300,
        unlock_condition: "clue_1_completed"
      },
      {
        id: 3,
        title: "La Toison d'Or",
        description: "Localisez le trésor final de l'Ordre de la Toison d'Or",
        hint: "Sous l'emblème de la toison, la richesse ducale sommeille",
        location: {
          latitude: 47.0473,
          longitude: 4.8742,
          radius: 75
        },
        symbol_reference: "golden_fleece",
        validation_type: "location",
        validation_data: { ducal_treasure: true },
        points: 350,
        unlock_condition: "all_previous_completed"
      }
    ],
    target_symbols: ["golden_fleece", "burgundy_cross", "ducal_crown"],
    created_by: "00000000-0000-0000-0000-000000000000",
    translations: {
      en: {
        title: "The Treasure of the Dukes of Burgundy",
        description: "Find the fabulous treasure of the Dukes of Burgundy hidden during the 15th century succession wars."
      },
      fr: {
        title: "Le Trésor des Ducs de Bourgogne",
        description: "Retrouvez le fabuleux trésor des Ducs de Bourgogne dissimulé lors des guerres de succession du 15ème siècle."
      }
    }
  },
  {
    title: "Les Mystères de Carnac",
    description: "Percez les secrets des alignements mégalithiques de Carnac et découvrez la sagesse des anciens Bretons.",
    story_background: "Les alignements de Carnac, érigés il y a plus de 6000 ans, restent l'une des énigmes archéologiques les plus fascinantes d'Europe. Ces milliers de menhirs alignés cacheraient un savoir astronomique et spirituel ancestral, ainsi que des trésors rituels des druides celtes.",
    quest_type: "lost_civilization",
    difficulty_level: "master",
    max_participants: 8,
    min_participants: 4,
    status: "active",
    start_date: "2024-09-01T10:00:00Z",
    end_date: "2024-12-31T23:59:59Z",
    reward_points: 1000,
    special_rewards: [
      "Badge Druide de Carnac",
      "Pierre sacrée (réplique)",
      "Accès aux archives celtiques"
    ],
    clues: [
      {
        id: 1,
        title: "Les Alignements du Ménec",
        description: "Déchiffrez le code astronomique des anciens",
        hint: "Où 1000 pierres dressées montrent le chemin des étoiles",
        location: {
          latitude: 47.5853,
          longitude: -3.0608,
          radius: 200
        },
        symbol_reference: "carnac_menhir",
        validation_type: "symbol",
        validation_data: { expected_symbol: "celtic_spiral" },
        points: 300,
        unlock_condition: "start"
      },
      {
        id: 2,
        title: "Le Tumulus Saint-Michel",
        description: "Explorez la chambre funéraire néolithique",
        hint: "Sous la colline sacrée, les ancêtres gardent leurs secrets",
        location: {
          latitude: 47.5744,
          longitude: -3.0747,
          radius: 100
        },
        symbol_reference: "tumulus_chamber",
        validation_type: "code",
        validation_data: { expected_code: "BELTANE_SAMHAIN" },
        points: 350,
        unlock_condition: "clue_1_completed"
      },
      {
        id: 3,
        title: "Le Sanctuaire Druidique",
        description: "Découvrez le lieu de pouvoir des druides",
        hint: "Où la terre et le ciel se rejoignent, la sagesse éternelle demeure",
        location: {
          latitude: 47.5819,
          longitude: -3.0656,
          radius: 50
        },
        symbol_reference: "druidic_sanctuary",
        validation_type: "location",
        validation_data: { sacred_site: true },
        points: 350,
        unlock_condition: "all_previous_completed"
      }
    ],
    target_symbols: ["celtic_spiral", "druid_sickle", "carnac_stone"],
    created_by: "00000000-0000-0000-0000-000000000000",
    translations: {
      en: {
        title: "The Mysteries of Carnac",
        description: "Uncover the secrets of the Carnac megalithic alignments and discover the wisdom of the ancient Bretons."
      },
      fr: {
        title: "Les Mystères de Carnac",
        description: "Percez les secrets des alignements mégalithiques de Carnac et découvrez la sagesse des anciens Bretons."
      }
    }
  },
  {
    title: "Le Trésor des Comtes de Toulouse",
    description: "Retrouvez la fortune cachée des Comtes de Toulouse lors des guerres contre Simon de Montfort au 13ème siècle.",
    story_background: "Raymond VII, dernier grand Comte de Toulouse, face aux armées de Simon de Montfort et aux croisés, aurait dissimulé le trésor comtal dans les souterrains de la Ville Rose. Ce trésor contient l'or, les reliques et les documents secrets du comté de Toulouse.",
    quest_type: "templar",
    difficulty_level: "intermediate",
    max_participants: 6,
    min_participants: 3,
    status: "active",
    start_date: "2024-10-01T10:00:00Z",
    end_date: "2024-12-31T23:59:59Z",
    reward_points: 700,
    special_rewards: [
      "Badge Comte de Toulouse",
      "Sceau comtal (réplique)",
      "Accès aux archives toulousaines"
    ],
    clues: [
      {
        id: 1,
        title: "Le Capitole de Toulouse",
        description: "Trouvez l'entrée secrète sous l'hôtel de ville",
        hint: "Là où les capitouls gouvernaient, le comte cacha son premier secret",
        location: {
          latitude: 43.6043,
          longitude: 1.4437,
          radius: 75
        },
        symbol_reference: "toulouse_cross",
        validation_type: "symbol",
        validation_data: { expected_symbol: "occitan_cross" },
        points: 200,
        unlock_condition: "start"
      },
      {
        id: 2,
        title: "La Basilique Saint-Sernin",
        description: "Déchiffrez l'énigme gravée dans la pierre romane",
        hint: "Sur le chemin de Compostelle, les pèlerins gardent le secret",
        location: {
          latitude: 43.6082,
          longitude: 1.4414,
          radius: 100
        },
        symbol_reference: "saint_sernin",
        validation_type: "code",
        validation_data: { expected_code: "RAYMOND_VII" },
        points: 250,
        unlock_condition: "clue_1_completed"
      },
      {
        id: 3,
        title: "Les Souterrains de la Garonne",
        description: "Localisez le trésor dans les caves médiévales",
        hint: "Sous les eaux de la Garonne, l'or du comte brille encore",
        location: {
          latitude: 43.6010,
          longitude: 1.4395,
          radius: 80
        },
        symbol_reference: "toulouse_treasure",
        validation_type: "location",
        validation_data: { comtal_treasure: true },
        points: 250,
        unlock_condition: "all_previous_completed"
      }
    ],
    target_symbols: ["occitan_cross", "toulouse_violet", "garonne_wave"],
    created_by: "00000000-0000-0000-0000-000000000000",
    translations: {
      en: {
        title: "The Treasure of the Counts of Toulouse",
        description: "Find the hidden fortune of the Counts of Toulouse during the wars against Simon de Montfort in the 13th century."
      },
      fr: {
        title: "Le Trésor des Comtes de Toulouse",
        description: "Retrouvez la fortune cachée des Comtes de Toulouse lors des guerres contre Simon de Montfort au 13ème siècle."
      }
    }
  },
  {
    title: "Les Secrets de l'Abbaye de Cluny",
    description: "Découvrez les manuscrits perdus et les reliques sacrées de la plus puissante abbaye médiévale d'Occident.",
    story_background: "L'abbaye de Cluny, au faîte de sa puissance au 12ème siècle, possédait des manuscrits uniques, des reliques précieuses et un trésor considérable. Avant les destructions révolutionnaires, les moines auraient dissimulé leurs biens les plus précieux dans des cachettes secrètes.",
    quest_type: "templar",
    difficulty_level: "expert",
    max_participants: 8,
    min_participants: 4,
    status: "active",
    start_date: "2024-11-01T10:00:00Z",
    end_date: "2024-12-31T23:59:59Z",
    reward_points: 850,
    special_rewards: [
      "Badge Moine de Cluny",
      "Manuscrit enluminé (réplique)",
      "Accès aux archives monastiques"
    ],
    clues: [
      {
        id: 1,
        title: "La Grande Église",
        description: "Trouvez l'indice dans les ruines de la plus grande église du monde chrétien",
        hint: "Où 1000 moines priaient, l'écho de leurs secrets résonne encore",
        location: {
          latitude: 46.4342,
          longitude: 4.6580,
          radius: 100
        },
        symbol_reference: "cluny_church",
        validation_type: "symbol",
        validation_data: { expected_symbol: "benedictine_cross" },
        points: 250,
        unlock_condition: "start"
      },
      {
        id: 2,
        title: "Le Scriptorium Secret",
        description: "Découvrez la bibliothèque cachée des moines copistes",
        hint: "Là où la sagesse s'écrivait, les livres sacrés se cachent",
        location: {
          latitude: 46.4328,
          longitude: 4.6575,
          radius: 75
        },
        symbol_reference: "cluny_manuscript",
        validation_type: "code",
        validation_data: { expected_code: "ORA_ET_LABORA" },
        points: 300,
        unlock_condition: "clue_1_completed"
      },
      {
        id: 3,
        title: "Le Trésor de l'Abbé",
        description: "Localisez la cache finale des reliques sacrées",
        hint: "Sous la protection de saint Pierre, les trésors de Cluny reposent",
        location: {
          latitude: 46.4335,
          longitude: 4.6578,
          radius: 50
        },
        symbol_reference: "cluny_treasure",
        validation_type: "location",
        validation_data: { monastic_treasure: true },
        points: 300,
        unlock_condition: "all_previous_completed"
      }
    ],
    target_symbols: ["benedictine_cross", "cluny_tower", "sacred_book"],
    created_by: "00000000-0000-0000-0000-000000000000",
    translations: {
      en: {
        title: "The Secrets of Cluny Abbey",
        description: "Discover the lost manuscripts and sacred relics of the most powerful medieval abbey in the West."
      },
      fr: {
        title: "Les Secrets de l'Abbaye de Cluny",
        description: "Découvrez les manuscrits perdus et les reliques sacrées de la plus puissante abbaye médiévale d'Occident."
      }
    }
  },
  {
    title: "Le Mystère du Masque de Fer",
    description: "Élucidez l'identité du mystérieux prisonnier au masque de fer et découvrez les secrets qu'il emporta dans sa tombe.",
    story_background: "Le prisonnier au masque de fer, détenu dans plusieurs forteresses françaises dont la Bastille, fut l'un des plus grands mystères de l'Ancien Régime. Son identité, gardée secrète par ordre du Roi-Soleil, et les documents qu'il aurait cachés avant sa mort continuent d'intriguer les historiens.",
    quest_type: "templar",
    difficulty_level: "master",
    max_participants: 4,
    min_participants: 2,
    status: "active",
    start_date: "2024-12-01T10:00:00Z",
    end_date: "2024-12-31T23:59:59Z",
    reward_points: 1200,
    special_rewards: [
      "Badge Gardien du Secret",
      "Masque de fer (réplique)",
      "Accès aux archives royales secrètes"
    ],
    clues: [
      {
        id: 1,
        title: "La Forteresse de Pignerol",
        description: "Trouvez les premières traces du prisonnier mystérieux",
        hint: "Dans les Alpes, où l'homme masqué fut d'abord enfermé",
        location: {
          latitude: 44.8906,
          longitude: 7.3333,
          radius: 150
        },
        symbol_reference: "iron_mask",
        validation_type: "symbol",
        validation_data: { expected_symbol: "royal_seal" },
        points: 300,
        unlock_condition: "start"
      },
      {
        id: 2,
        title: "La Prison de Sainte-Marguerite",
        description: "Découvrez les indices cachés sur l'île prison",
        hint: "Sur l'île où le masque contemplait la mer, son secret git",
        location: {
          latitude: 43.5089,
          longitude: 7.0411,
          radius: 100
        },
        symbol_reference: "sainte_marguerite",
        validation_type: "code",
        validation_data: { expected_code: "EUSTACHE_DANGER" },
        points: 400,
        unlock_condition: "clue_1_completed"
      },
      {
        id: 3,
        title: "Le Secret de la Bastille",
        description: "Percez le mystère final dans l'ancienne prison royale",
        hint: "Où la Bastille se dressait, la vérité du masque sommeille",
        location: {
          latitude: 48.8534,
          longitude: 2.3688,
          radius: 75
        },
        symbol_reference: "bastille_secret",
        validation_type: "location",
        validation_data: { royal_secret: true },
        points: 500,
        unlock_condition: "all_previous_completed"
      }
    ],
    target_symbols: ["iron_mask", "royal_seal", "bastille_key"],
    created_by: "00000000-0000-0000-0000-000000000000",
    translations: {
      en: {
        title: "The Mystery of the Iron Mask",
        description: "Elucidate the identity of the mysterious prisoner with the iron mask and discover the secrets he took to his grave."
      },
      fr: {
        title: "Le Mystère du Masque de Fer",
        description: "Élucidez l'identité du mystérieux prisonnier au masque de fer et découvrez les secrets qu'il emporta dans sa tombe."
      }
    }
  },
  {
    title: "Les Trésors Cachés de Fontainebleau",
    description: "Explorez les passages secrets du château de Fontainebleau et découvrez les trésors dissimulés par les rois de France.",
    story_background: "Le château de Fontainebleau, résidence favorite de nombreux rois de France, recèle de nombreux passages secrets et cachettes. François Ier, Napoléon et d'autres souverains y ont dissimulé des trésors, des documents secrets et des œuvres d'art pour les protéger des troubles politiques. Cette quête nécessite une autorisation spéciale du château (contact : guide@chateaudefontainebleau.fr) et doit être effectuée uniquement lors des créneaux réservés aux explorateurs (mardis et jeudis, 14h-17h).",
    quest_type: "templar",
    difficulty_level: "intermediate",
    max_participants: 8,
    min_participants: 4,
    status: "active",
    start_date: "2024-12-15T10:00:00Z",
    end_date: "2024-12-31T23:59:59Z",
    reward_points: 600,
    special_rewards: [
      "Badge Garde Royale authentique",
      "Clé du château (réplique métal précieux)",
      "Accès aux appartements secrets avec guide privé",
      "Document historique authentifié",
      "Médaille commémorative gravée"
    ],
    clues: [
      {
        id: 1,
        title: "La Galerie François Ier",
        description: "Trouvez le panneau secret dans la célèbre galerie Renaissance. Placez-vous face à la fresque centrale représentant 'l'Éducation d'Achille'. Cherchez la salamandre dorée située à droite de la troisième fenêtre, à exactement 1m20 de hauteur. Appuyez fermement sur l'œil de la créature mythologique pendant 3 secondes jusqu'à entendre un déclic.",
        hint: "La salamandre de François Ier garde ses secrets. Son regard doré révèle le premier mystère quand on sait où regarder. Photo de référence disponible au bureau d'accueil.",
        location: {
          latitude: 48.4024,
          longitude: 2.7004,
          radius: 50
        },
        symbol_reference: "fontainebleau_fresco",
        validation_type: "photo",
        validation_data: { 
          expected_symbol: "salamander_francois",
          photo_required: true,
          qr_code_location: "derrière_panneau_secret"
        },
        points: 150,
        unlock_condition: "start",
        intermediate_steps: [
          "Localisez la fresque 'Éducation d'Achille'",
          "Trouvez la salamandre dorée (3ème fenêtre)",
          "Vérifiez la hauteur : 1m20 exactement",
          "Appuyez sur l'œil pendant 3 secondes",
          "Photographiez le panneau qui s'ouvre",
          "Scannez le QR code révélé"
        ]
      },
      {
        id: 2,
        title: "Le Bureau de Napoléon",
        description: "Découvrez la cachette secrète de l'Empereur dans son bureau privé. Dirigez-vous vers le bureau en acajou massif au centre de la pièce. Sous le plateau, côté droit, se trouve une serrure dissimulée dans un compartiment secret. Le code à composer est EMPEREUR suivi de l'année de l'abdication. Tournez la clé trois fois dans le sens horaire après validation.",
        hint: "L'Aigle a caché ses derniers secrets là où il signait ses décrets. La date de sa chute déverrouille son héritage. Attention : seules 3 tentatives sont autorisées.",
        location: {
          latitude: 48.4020,
          longitude: 2.7008,
          radius: 75
        },
        symbol_reference: "napoleon_desk",
        validation_type: "code",
        validation_data: { 
          expected_code: "EMPEREUR1814",
          mechanism: "serrure_numerique",
          max_attempts: 3
        },
        points: 200,
        unlock_condition: "clue_1_completed",
        intermediate_steps: [
          "Entrez dans le bureau privé de Napoléon",
          "Localisez le bureau en acajou central",
          "Cherchez le compartiment sous le plateau (côté droit)",
          "Composez le code : EMPEREUR + année abdication",
          "Tournez la clé 3 fois dans le sens horaire",
          "Récupérez le document caché",
          "Photographiez le sceau impérial révélé"
        ]
      },
      {
        id: 3,
        title: "L'Escalier Secret",
        description: "Accédez au trésor final dans l'escalier dérobé situé derrière la tapisserie des appartements royaux. Tirez simultanément sur les deux glands dorés de la tapisserie 'Les Saisons'. L'escalier se révèle derrière le mur. Descendez 12 marches exactement. Dans la niche murette, appuyez sur la pierre gravée d'une fleur de lys pour découvrir le coffre royal.",
        hint: "Par l'escalier que seuls les rois empruntaient, la fortune royale attend celui qui connaît le geste ancestral. Les quatre saisons gardent l'entrée du dernier secret.",
        location: {
          latitude: 48.4022,
          longitude: 2.7006,
          radius: 30
        },
        symbol_reference: "royal_staircase",
        validation_type: "location",
        validation_data: { 
          royal_cache: true,
          physical_proof: "medaille_or",
          coordinates_precise: true
        },
        points: 250,
        unlock_condition: "all_previous_completed",
        intermediate_steps: [
          "Trouvez la tapisserie 'Les Saisons' (appartements royaux)",
          "Tirez simultanément les deux glands dorés",
          "Pénétrez dans l'escalier secret révélé",
          "Descendez exactement 12 marches (comptez-les)",
          "Localisez la niche murette à mi-hauteur",
          "Appuyez sur la pierre à fleur de lys",
          "Ouvrez le coffre royal",
          "Récupérez la médaille d'or authentique",
          "Photographiez l'inscription gravée à l'intérieur"
        ]
      }
    ],
    target_symbols: ["salamander_francois", "napoleon_eagle", "royal_crown"],
    created_by: "00000000-0000-0000-0000-000000000000",
    translations: {
      en: {
        title: "The Hidden Treasures of Fontainebleau",
        description: "Explore the secret passages of Fontainebleau castle and discover the treasures hidden by the kings of France."
      },
      fr: {
        title: "Les Trésors Cachés de Fontainebleau",
        description: "Explorez les passages secrets du château de Fontainebleau et découvrez les trésors dissimulés par les rois de France."
      }
    }
  }
];
