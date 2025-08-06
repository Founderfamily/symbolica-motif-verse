// Simulation de conversations réalistes pour la quête "Les Trésors Cachés de Fontainebleau"
// Cette conversation montre comment une équipe a progressivement découvert tous les indices et trésors

export interface SimulatedMessage {
  id: string;
  quest_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles: {
    id: string;
    username: string;
    full_name: string;
    avatar_url?: string;
  };
}

export const simulatedFontainebleauMessages: SimulatedMessage[] = [
  // Phase 1: Arrivée et organisation (9h30)
  {
    id: "msg_001",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_marie",
    content: "Salut l'équipe ! Je viens d'arriver au château de Fontainebleau. Il fait beau, parfait pour notre quête ! 😊 Qui d'autre est déjà sur place ?",
    created_at: "2024-01-20T09:30:00Z",
    profiles: {
      id: "user_marie",
      username: "marie_historienne",
      full_name: "Marie Dubois",
      avatar_url: "/avatars/marie.jpg"
    }
  },
  {
    id: "msg_002",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_julien",
    content: "Moi j'arrive dans 10 minutes ! J'ai pris contact avec le guide au bureau d'accueil comme indiqué. Il nous attend à 10h pile pour nous donner l'autorisation spéciale.",
    created_at: "2024-01-20T09:32:15Z",
    profiles: {
      id: "user_julien",
      username: "julien_tech",
      full_name: "Julien Martinez",
      avatar_url: "/avatars/julien.jpg"
    }
  },
  {
    id: "msg_003",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_claire",
    content: "Je suis là ! Déjà impressionnée par la grandeur du lieu... On va vraiment chercher des trésors royaux dans ce château ? C'est dingue ! 🏰",
    created_at: "2024-01-20T09:35:42Z",
    profiles: {
      id: "user_claire",
      username: "claire_aventure",
      full_name: "Claire Moreau",
      avatar_url: "/avatars/claire.jpg"
    }
  },
  {
    id: "msg_004",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_thomas",
    content: "Présent ! J'ai étudié les plans du château hier soir. La Galerie François Ier est notre premier objectif. C'est dans l'aile Renaissance, au premier étage.",
    created_at: "2024-01-20T09:38:20Z",
    profiles: {
      id: "user_thomas",
      username: "thomas_archi",
      full_name: "Thomas Bernard",
      avatar_url: "/avatars/thomas.jpg"
    }
  },

  // Phase 2: Début de la quête - Galerie François Ier (10h15)
  {
    id: "msg_005",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_marie",
    content: "OK les amis, on a l'autorisation ! Direction la Galerie François Ier. Je relis l'indice : 'Trouvez le panneau secret dans la célèbre galerie Renaissance. Placez-vous face à la fresque centrale représentant l'Éducation d'Achille.'",
    created_at: "2024-01-20T10:15:00Z",
    profiles: {
      id: "user_marie",
      username: "marie_historienne",
      full_name: "Marie Dubois",
      avatar_url: "/avatars/marie.jpg"
    }
  },
  {
    id: "msg_006",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_claire",
    content: "Waouh ! Cette galerie est magnifique ! Il y a des fresques partout... Comment on trouve 'l'Éducation d'Achille' ?",
    created_at: "2024-01-20T10:18:30Z",
    profiles: {
      id: "user_claire",
      username: "claire_aventure",
      full_name: "Claire Moreau",
      avatar_url: "/avatars/claire.jpg"
    }
  },
  {
    id: "msg_007",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_thomas",
    content: "Là ! Au centre, la grande fresque avec le héros grec et son mentor centaure. C'est bien l'Éducation d'Achille. Maintenant on cherche 'la salamandre dorée à droite de la troisième fenêtre'.",
    created_at: "2024-01-20T10:20:45Z",
    profiles: {
      id: "user_thomas",
      username: "thomas_archi",
      full_name: "Thomas Bernard",
      avatar_url: "/avatars/thomas.jpg"
    }
  },
  {
    id: "msg_008",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_julien",
    content: "J'ai compté les fenêtres depuis l'entrée... 1, 2, 3 ! À droite de celle-ci je vois effectivement des détails dorés. Il faut chercher à 1m20 de hauteur exactement.",
    created_at: "2024-01-20T10:22:10Z",
    profiles: {
      id: "user_julien",
      username: "julien_tech",
      full_name: "Julien Martinez",
      avatar_url: "/avatars/julien.jpg"
    }
  },
  {
    id: "msg_009",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_marie",
    content: "Je l'ai ! Il y a bien une petite salamandre dorée, l'emblème de François Ier ! Elle a l'air sculptée dans le bois doré. Ses yeux brillent différemment...",
    created_at: "2024-01-20T10:24:35Z",
    profiles: {
      id: "user_marie",
      username: "marie_historienne",
      full_name: "Marie Dubois",
      avatar_url: "/avatars/marie.jpg"
    }
  },
  {
    id: "msg_010",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_claire",
    content: "Allez Marie, appuie sur l'œil comme dit l'indice ! '3 secondes jusqu'à entendre un déclic'",
    created_at: "2024-01-20T10:25:50Z",
    profiles: {
      id: "user_claire",
      username: "claire_aventure",
      full_name: "Claire Moreau",
      avatar_url: "/avatars/claire.jpg"
    }
  },
  {
    id: "msg_011",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_marie",
    content: "OH MON DIEU ! 😱 J'ai appuyé et j'ai entendu un petit 'clic' ! Un panneau de bois s'est légèrement ouvert à côté ! Il y a quelque chose derrière...",
    created_at: "2024-01-20T10:26:15Z",
    profiles: {
      id: "user_marie",
      username: "marie_historienne",
      full_name: "Marie Dubois",
      avatar_url: "/avatars/marie.jpg"
    }
  },
  {
    id: "msg_012",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_julien",
    content: "Incroyable ! Il y a un QR code à l'intérieur ! Et un petit parchemin avec le sceau de François Ier ! Je prends une photo de tout !",
    created_at: "2024-01-20T10:27:00Z",
    profiles: {
      id: "user_julien",
      username: "julien_tech",
      full_name: "Julien Martinez",
      avatar_url: "/avatars/julien.jpg"
    }
  },
  {
    id: "msg_013",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_thomas",
    content: "Premier indice validé ! 150 points ! Sur le parchemin il y a écrit : 'L'Aigle vous attend dans son antre, où les décrets changeaient le monde.' Ça parle du bureau de Napoléon !",
    created_at: "2024-01-20T10:28:20Z",
    profiles: {
      id: "user_thomas",
      username: "thomas_archi",
      full_name: "Thomas Bernard",
      avatar_url: "/avatars/thomas.jpg"
    }
  },

  // Phase 3: Transition et recherche du Bureau de Napoléon (10h45)
  {
    id: "msg_014",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_claire",
    content: "On a réussi le premier ! 🎉 Direction le bureau de Napoléon maintenant. Le guide nous a dit que c'était dans les appartements impériaux, 2ème étage.",
    created_at: "2024-01-20T10:45:30Z",
    profiles: {
      id: "user_claire",
      username: "claire_aventure",
      full_name: "Claire Moreau",
      avatar_url: "/avatars/claire.jpg"
    }
  },
  {
    id: "msg_015",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_marie",
    content: "Je relis l'indice 2 : 'Dirigez-vous vers le bureau en acajou massif au centre de la pièce. Sous le plateau, côté droit, se trouve une serrure dissimulée dans un compartiment secret.'",
    created_at: "2024-01-20T10:47:15Z",
    profiles: {
      id: "user_marie",
      username: "marie_historienne",
      full_name: "Marie Dubois",
      avatar_url: "/avatars/marie.jpg"
    }
  },
  {
    id: "msg_016",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_julien",
    content: "Nous voilà dans le bureau ! Impressionnant... Ce bureau en acajou massif au centre, c'est vraiment là que Napoléon signait ses décrets ? L'histoire qu'on touche du doigt !",
    created_at: "2024-01-20T10:52:40Z",
    profiles: {
      id: "user_julien",
      username: "julien_tech",
      full_name: "Julien Martinez",
      avatar_url: "/avatars/julien.jpg"
    }
  },
  {
    id: "msg_017",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_thomas",
    content: "Thomas, aide-moi à chercher sous le plateau côté droit. Il faut qu'on trouve ce compartiment secret... Attention à ne rien abîmer !",
    created_at: "2024-01-20T10:54:10Z",
    profiles: {
      id: "user_thomas",
      username: "thomas_archi",
      full_name: "Thomas Bernard",
      avatar_url: "/avatars/thomas.jpg"
    }
  },
  {
    id: "msg_018",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_thomas",
    content: "Je sens quelque chose ! Il y a bien un petit panneau mobile sous le plateau ! Et... oui ! Une serrure numérique très discrète ! On dirait qu'elle a été ajoutée récemment pour la quête.",
    created_at: "2024-01-20T10:55:25Z",
    profiles: {
      id: "user_thomas",
      username: "thomas_archi",
      full_name: "Thomas Bernard",
      avatar_url: "/avatars/thomas.jpg"
    }
  },
  {
    id: "msg_019",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_marie",
    content: "Le code c'est 'EMPEREUR' suivi de l'année de l'abdication. Napoléon a abdiqué en 1814 après la campagne de France. Donc : EMPEREUR1814",
    created_at: "2024-01-20T10:56:45Z",
    profiles: {
      id: "user_marie",
      username: "marie_historienne",
      full_name: "Marie Dubois",
      avatar_url: "/avatars/marie.jpg"
    }
  },
  {
    id: "msg_020",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_julien",
    content: "Attention, seulement 3 tentatives ! Je tape lentement... E-M-P-E-R-E-U-R-1-8-1-4... Validation !",
    created_at: "2024-01-20T10:57:30Z",
    profiles: {
      id: "user_julien",
      username: "julien_tech",
      full_name: "Julien Martinez",
      avatar_url: "/avatars/julien.jpg"
    }
  },
  {
    id: "msg_021",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_claire",
    content: "ÇA MARCHE ! 🎊 Un petit tiroir s'est ouvert ! Il y a une clé dorée à l'intérieur ! Et un nouveau parchemin avec le sceau impérial !",
    created_at: "2024-01-20T10:58:00Z",
    profiles: {
      id: "user_claire",
      username: "claire_aventure",
      full_name: "Claire Moreau",
      avatar_url: "/avatars/claire.jpg"
    }
  },
  {
    id: "msg_022",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_thomas",
    content: "Maintenant il faut 'tourner la clé trois fois dans le sens horaire'... Un tour... deux tours... trois tours... et... CLIC ! Quelque chose d'autre s'est ouvert !",
    created_at: "2024-01-20T10:58:45Z",
    profiles: {
      id: "user_thomas",
      username: "thomas_archi",
      full_name: "Thomas Bernard",
      avatar_url: "/avatars/thomas.jpg"
    }
  },
  {
    id: "msg_023",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_marie",
    content: "Un document historique ! C'est incroyable ! Il y a écrit : 'Par l'escalier que seuls les rois empruntaient, la fortune royale attend. Cherchez où les quatre saisons gardent l'entrée du dernier secret.'",
    created_at: "2024-01-20T10:59:30Z",
    profiles: {
      id: "user_marie",
      username: "marie_historienne",
      full_name: "Marie Dubois",
      avatar_url: "/avatars/marie.jpg"
    }
  },

  // Phase 4: Pause déjeuner et réflexion (12h30)
  {
    id: "msg_024",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_julien",
    content: "Deuxième indice validé ! +200 points ! 💪 On fait une pause déjeuner ? J'ai besoin de réfléchir à cette histoire de 'quatre saisons' et d'escalier secret...",
    created_at: "2024-01-20T12:30:00Z",
    profiles: {
      id: "user_julien",
      username: "julien_tech",
      full_name: "Julien Martinez",
      avatar_url: "/avatars/julien.jpg"
    }
  },
  {
    id: "msg_025",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_claire",
    content: "Bonne idée ! On se retrouve dans une heure ? J'ai vu un café sympa dans la ville. Ça nous donnera le temps de digérer nos découvertes ! 😄",
    created_at: "2024-01-20T12:32:15Z",
    profiles: {
      id: "user_claire",
      username: "claire_aventure",
      full_name: "Claire Moreau",
      avatar_url: "/avatars/claire.jpg"
    }
  },

  // Phase 5: Reprise et recherche de l'escalier secret (13h45)
  {
    id: "msg_026",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_thomas",
    content: "J'ai réfléchi pendant le déjeuner ! Les 'quatre saisons'... ça pourrait être une tapisserie ! Il y a beaucoup de tapisseries dans les appartements royaux qui représentent les saisons.",
    created_at: "2024-01-20T13:45:20Z",
    profiles: {
      id: "user_thomas",
      username: "thomas_archi",
      full_name: "Thomas Bernard",
      avatar_url: "/avatars/thomas.jpg"
    }
  },
  {
    id: "msg_027",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_marie",
    content: "Excellente déduction ! Je relis l'indice 3 : 'Tirez simultanément sur les deux glands dorés de la tapisserie Les Saisons. L'escalier se révèle derrière le mur.'",
    created_at: "2024-01-20T13:47:00Z",
    profiles: {
      id: "user_marie",
      username: "marie_historienne",
      full_name: "Marie Dubois",
      avatar_url: "/avatars/marie.jpg"
    }
  },
  {
    id: "msg_028",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_julien",
    content: "Allons dans les appartements royaux ! Il faut qu'on trouve cette fameuse tapisserie 'Les Saisons' avec des glands dorés...",
    created_at: "2024-01-20T13:50:30Z",
    profiles: {
      id: "user_julien",
      username: "julien_tech",
      full_name: "Julien Martinez",
      avatar_url: "/avatars/julien.jpg"
    }
  },
  {
    id: "msg_029",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_claire",
    content: "Je crois que je l'ai trouvée ! Dans le salon Louis XVI ! Une magnifique tapisserie avec quatre panneaux représentant le printemps, l'été, l'automne et l'hiver !",
    created_at: "2024-01-20T14:05:45Z",
    profiles: {
      id: "user_claire",
      username: "claire_aventure",
      full_name: "Claire Moreau",
      avatar_url: "/avatars/claire.jpg"
    }
  },
  {
    id: "msg_030",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_thomas",
    content: "Parfait ! Je vois les deux glands dorés en bas de la tapisserie ! Ils ont l'air de pouvoir être tirés... Claire, tu prends celui de gauche, moi celui de droite ?",
    created_at: "2024-01-20T14:07:10Z",
    profiles: {
      id: "user_thomas",
      username: "thomas_archi",
      full_name: "Thomas Bernard",
      avatar_url: "/avatars/thomas.jpg"
    }
  },
  {
    id: "msg_031",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_claire",
    content: "OK ! On tire en même temps... 3, 2, 1... MAINTENANT !",
    created_at: "2024-01-20T14:08:00Z",
    profiles: {
      id: "user_claire",
      username: "claire_aventure",
      full_name: "Claire Moreau",
      avatar_url: "/avatars/claire.jpg"
    }
  },
  {
    id: "msg_032",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_marie",
    content: "INCROYABLE ! 😲 La tapisserie a pivoté ! Il y a effectivement un escalier secret derrière ! On voit des marches en pierre qui descendent dans l'obscurité !",
    created_at: "2024-01-20T14:08:30Z",
    profiles: {
      id: "user_marie",
      username: "marie_historienne",
      full_name: "Marie Dubois",
      avatar_url: "/avatars/marie.jpg"
    }
  },
  {
    id: "msg_033",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_julien",
    content: "J'allume ma lampe torche ! On descend ? L'indice dit 'Descendez 12 marches exactement'. Il faut compter précisément !",
    created_at: "2024-01-20T14:09:15Z",
    profiles: {
      id: "user_julien",
      username: "julien_tech",
      full_name: "Julien Martinez",
      avatar_url: "/avatars/julien.jpg"
    }
  },
  {
    id: "msg_034",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_thomas",
    content: "Une marche... deux marches... trois... ça descend bien ! L'escalier est en pierre taillée, vraiment ancien ! ... onze... douze ! Voilà, on s'arrête ici !",
    created_at: "2024-01-20T14:10:30Z",
    profiles: {
      id: "user_thomas",
      username: "thomas_archi",
      full_name: "Thomas Bernard",
      avatar_url: "/avatars/thomas.jpg"
    }
  },
  {
    id: "msg_035",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_claire",
    content: "Je vois une niche dans le mur à mi-hauteur ! Et... oui ! Il y a une pierre différente des autres avec une fleur de lys gravée ! C'est exactement ce que dit l'indice !",
    created_at: "2024-01-20T14:11:45Z",
    profiles: {
      id: "user_claire",
      username: "claire_aventure",
      full_name: "Claire Moreau",
      avatar_url: "/avatars/claire.jpg"
    }
  },
  {
    id: "msg_036",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_marie",
    content: "Moment de vérité ! J'appuie sur la pierre à fleur de lys... Elle s'enfonce légèrement... et... OH ! Un petit coffre s'ouvre dans la niche !",
    created_at: "2024-01-20T14:12:20Z",
    profiles: {
      id: "user_marie",
      username: "marie_historienne",
      full_name: "Marie Dubois",
      avatar_url: "/avatars/marie.jpg"
    }
  },

  // Phase 6: Découverte du trésor final (14h15)
  {
    id: "msg_037",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_julien",
    content: "QU'EST-CE QU'IL Y A DEDANS ?! 😱 Le suspense me tue !",
    created_at: "2024-01-20T14:15:00Z",
    profiles: {
      id: "user_julien",
      username: "julien_tech",
      full_name: "Julien Martinez",
      avatar_url: "/avatars/julien.jpg"
    }
  },
  {
    id: "msg_038",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_marie",
    content: "Il y a... une magnifique médaille en or ! Elle a l'air authentique ! Et un parchemin avec une inscription en latin : 'Regni Francorum Thesaurus' - Le Trésor des Rois de France !",
    created_at: "2024-01-20T14:15:30Z",
    profiles: {
      id: "user_marie",
      username: "marie_historienne",
      full_name: "Marie Dubois",
      avatar_url: "/avatars/marie.jpg"
    }
  },
  {
    id: "msg_039",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_thomas",
    content: "Incroyable ! La médaille porte les armoiries royales de France ! Et regardez, il y a aussi un petit rouleau de parchemin avec les signatures de François Ier et Napoléon !",
    created_at: "2024-01-20T14:16:15Z",
    profiles: {
      id: "user_thomas",
      username: "thomas_archi",
      full_name: "Thomas Bernard",
      avatar_url: "/avatars/thomas.jpg"
    }
  },
  {
    id: "msg_040",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_claire",
    content: "ON A RÉUSSI ! 🏆🎉 Troisième et dernier indice validé ! +250 points ! On a trouvé le trésor des rois de France ! Je n'arrive pas à y croire !",
    created_at: "2024-01-20T14:17:00Z",
    profiles: {
      id: "user_claire",
      username: "claire_aventure",
      full_name: "Claire Moreau",
      avatar_url: "/avatars/claire.jpg"
    }
  },
  {
    id: "msg_041",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_julien",
    content: "Total : 600 points ! Tous les indices résolus ! Cette quête était juste ÉPIQUE ! On a vraiment touché à l'histoire de France ! Merci l'équipe ! 👑",
    created_at: "2024-01-20T14:18:30Z",
    profiles: {
      id: "user_julien",
      username: "julien_tech",
      full_name: "Julien Martinez",
      avatar_url: "/avatars/julien.jpg"
    }
  },

  // Phase 7: Célébration et conclusion (14h30)
  {
    id: "msg_042",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_marie",
    content: "Quelle aventure extraordinaire ! On a vraiment suivi les traces des rois ! François Ier, Napoléon... et nous voilà détenteurs de leurs secrets ! 👸",
    created_at: "2024-01-20T14:30:00Z",
    profiles: {
      id: "user_marie",
      username: "marie_historienne",
      full_name: "Marie Dubois",
      avatar_url: "/avatars/marie.jpg"
    }
  },
  {
    id: "msg_043",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_thomas",
    content: "Le plus impressionnant c'est que tout était vraiment là ! Les mécanismes secrets, les cachettes... Le château de Fontainebleau a vraiment servi de décor à nos rois ! Histoire et réalité mélangées ! 🏰",
    created_at: "2024-01-20T14:32:45Z",
    profiles: {
      id: "user_thomas",
      username: "thomas_archi",
      full_name: "Thomas Bernard",
      avatar_url: "/avatars/thomas.jpg"
    }
  },
  {
    id: "msg_044",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_claire",
    content: "Je garde la médaille en souvenir (après validation bien sûr) ! Cette quête restera gravée dans ma mémoire ! Prochaine aventure quand vous voulez ! 😍",
    created_at: "2024-01-20T14:35:20Z",
    profiles: {
      id: "user_claire",
      username: "claire_aventure",
      full_name: "Claire Moreau",
      avatar_url: "/avatars/claire.jpg"
    }
  },
  {
    id: "msg_045",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_julien",
    content: "On forme une super équipe ! Marie l'historienne, Thomas l'architecte, Claire l'aventurière, et moi le tech ! Ensemble on peut résoudre n'importe quel mystère ! 🚀",
    created_at: "2024-01-20T14:37:00Z",
    profiles: {
      id: "user_julien",
      username: "julien_tech",
      full_name: "Julien Martinez",
      avatar_url: "/avatars/julien.jpg"
    }
  },
  {
    id: "msg_046",
    quest_id: "0b58fcc0-f40e-4762-a4f7-9bc074824820",
    user_id: "user_marie",
    content: "Merci à tous ! Cette expérience nous a vraiment rapprochés de l'histoire ! Et maintenant, champagne pour célébrer notre victoire sur les trésors cachés de Fontainebleau ! 🥂",
    created_at: "2024-01-20T14:40:00Z",
    profiles: {
      id: "user_marie",
      username: "marie_historienne",
      full_name: "Marie Dubois",
      avatar_url: "/avatars/marie.jpg"
    }
  }
];