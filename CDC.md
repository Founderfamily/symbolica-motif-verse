# Symbolica – Cahier des charges fonctionnel et technique

## 1. Contexte du projet & justification du nom **Symbolica**

Symbolica est une initiative open-source qui naît du constat que les **symboles et motifs culturels** du monde entier méritent une plateforme dédiée à leur découverte et à leur partage. Dans un contexte où les musées numérisent leurs collections et où les communautés s’organisent en ligne pour documenter le patrimoine immatériel, il existe un besoin d’**unifier ces efforts** sur une plateforme collaborative unique. La France, riche de son patrimoine et de son écosystème culturel, servira de point de départ avant une ouverture rapide à l’international. Le choix du nom *Symbolica* s’appuie sur plusieurs justifications stratégiques :

* **Évocateur & universel :** *Symbolica* évoque l’univers des symboles et de la “symbolique” de manière immédiate. Le terme est compréhensible dans de nombreuses langues (proche de *symbol*, *symbolique*, etc.), ce qui facilite l’internationalisation.
* **Dimension culturelle et imaginaire :** Le suffixe “-ica” rappelle des mots comme *encyclopædia* ou *Musica*, conférant une tonalité à la fois **encyclopédique** (base de connaissances) et **ludique** (monde imaginaire). *Symbolica* suggère un *“royaume des symboles”*, propice à la découverte et à l’exploration créative.
* **Stratégie de marque :** Le nom est court, mémorable, et sonne de façon harmonieuse. Il peut facilement être décliné en logo et supporte une identité visuelle forte. De plus, sa neutralité culturelle (n’appartenant à aucune langue spécifique) reflète l’objectif du projet de rassembler des cultures diverses sans parti pris.

En résumé, *Symbolica* se positionne comme **la première plateforme open-source** dédiée aux motifs et symboles culturels, où la technologie (IA, géolocalisation, open data) est mise au service d’une communauté mondiale passionnée de patrimoine. Ce cahier des charges décrit en détail la vision, les fonctionnalités et l’architecture prévues pour concrétiser ce projet ambitieux.

## 2. Vision à long terme & mission de la plateforme

**Vision (long terme) :** *Symbolica* aspire à devenir la **référence mondiale** en matière de collection et d’interprétation des symboles et motifs culturels. À long terme, la plateforme sera un **musée numérique collaboratif planétaire**, où chaque motif – qu’il s’agisse d’une frise architecturale antique, d’un symbole religieux, d’un motif textile traditionnel ou d’un graffiti contemporain – pourra être découvert, contextualisé et réinventé. La vision est d’**éliminer les frontières** entre les cultures via leurs symboles, en offrant un espace où un motif Celte peut côtoyer un symbole Africain ou un mandala Asiatique, créant ainsi un dialogue interculturel vivant et évolutif.

**Mission (court/moyen terme) :** La mission de *Symbolica* est d’**outiller et fédérer une communauté** de passionnés, d’experts et de curieux autour des symboles :

* **Documenter** les motifs culturels (par la photo, l’annotation, les récits historiques) pour préserver cette richesse collective.
* **Apprendre & échanger** : permettre aux utilisateurs d’enrichir leurs connaissances mutuellement (ex : un étudiant apprend d’un historien, un artiste s’inspire d’un motif ancien pour créer du neuf).
* **Innover dans la création** : grâce à l’IA et aux outils numériques, faciliter la création de nouveaux designs inspirés du patrimoine, participant ainsi à la *transmission vivante* de ces symboles vers les nouvelles générations.
* **Rayonner mondialement dès le départ** : même si le pilote est en France, la mission inclut l’internationalisation immédiate. Contenus bilingues (français/anglais) dès le lancement et ouverture à d’autres langues par la suite, partenariats avec des communautés à l’étranger, etc., pour refléter la vocation universelle du projet.

En somme, *Symbolica* se donne pour mission de **connecter le passé et le futur**, la tradition et l’innovation, via une plateforme où la **communauté construit un patrimoine commun** et le fait vivre au quotidien.

## 3. Valeurs fondamentales du projet

Le projet Symbolica est guidé par des valeurs fortes qui orienteront toutes ses décisions, du développement logiciel à la gestion de la communauté :

* **Open Source & Open Data :** La plateforme sera développée de manière ouverte (code source publié sous licence libre) et adhérera aux principes d’**open data** pour les contenus. Cette philosophie garantit **transparence, pérennité et partage**. Tout un chacun pourra auditer, contribuer au code, ou réutiliser les données (par exemple via des API ou des exports sous licence libre). Cela s’inscrit dans le mouvement global où “du partage se crée la valeur”. Nous ambitionnons ainsi de faire de Symbolica un commun numérique appartenant à tous, à l’image d’autres outils patrimoniaux ouverts (par ex. la plateforme Mukurtu conçue avec des communautés autochtones pour partager un patrimoine numérique de façon éthique).

* **Collaboration & Communauté :** Au cœur de Symbolica se trouve l’idée de **co-création**. Chaque utilisateur, du néophyte au spécialiste, peut apporter sa pierre à l’édifice. La plateforme encouragera l’entraide, la bienveillance et le **travail collaboratif**. Les contenus (annotations, descriptions, identifications) seront modérés et améliorés par les pairs (modèle proche de Wikipédia ou d’autres plateformes contributives). La communauté sera impliquée dans l’évolution du projet, conformément à une approche “community-driven” où les utilisateurs peuvent même influencer les prochaines fonctionnalités. Cette valeur de collaboration s’aligne avec l’objectif de “**maintenir une approche ouverte et pilotée par la communauté**” pour le développement continu.

* **Culture partagée & diversité :** Symbolica célèbre la **diversité culturelle**. Chaque symbole est porteur d’une histoire, d’une identité. La plateforme valorisera toutes les cultures de manière équitable, en veillant à inclure des motifs d’origines variées (par ex. art islamique, arts pré-colombiens, symboles polynésiens, etc.). Le terme *culture partagée* signifie que l’on considère le patrimoine culturel comme un bien commun de l’humanité. Chacun est invité à découvrir et respecter le patrimoine de l’autre. Aucune appropriation culturelle abusive ne sera tolérée : au contraire, nous travaillerons en concertation avec les communautés concernées, notamment pour les motifs sensibles ou sacrés, afin de toujours les présenter de manière respectueuse et avec le **contexte approprié**.

* **Éducation & Transmission :** La plateforme a une vocation pédagogique. Nous valorisons le **savoir libre** et la transmission intergénérationnelle. Symbolica pourra servir d’outil éducatif (pour des cours d’histoire de l’art, d’anthropologie visuelle, etc.), avec un contenu vulgarisé à destination du grand public mais aussi des ressources pointues pour les chercheurs. L’important est de **rendre accessible** un domaine parfois réservé aux experts (symbologie, iconographie) et d’encourager la **curiosité intellectuelle**.

* **Innovation & Créativité :** Enfin, Symbolica marie la tradition et l’innovation. Être open source ne signifie pas être figé dans le passé : au contraire, nous prônons l’**innovation ouverte**. L’utilisation de l’IA pour reconnaître des motifs ou en générer de nouveaux est au service de la créativité humaine. La valeur d’innovation se reflète dans notre stack technologique moderne (voir section 5) et dans la volonté d’**explorer de nouvelles approches** pour valoriser la culture (ex : réalité augmentée à terme, visualisations interactives, etc.). Nous croyons que la technologie, bien employée, peut amplifier l’impact de la culture (par ex. un modèle de diffusion **open-source** comme Stable Diffusion a démocratisé la création visuelle, ouvrant la voie à des usages créatifs pour le patrimoine).

En synthèse, ces valeurs (ouverture, collaboration, partage culturel, éducation, innovation) formeront la **charte éthique** de Symbolica. Elles devront transparaître tant dans l’expérience utilisateur (UX) que dans la gouvernance du projet et ses choix techniques.

## 4. **Architecture fonctionnelle** de la plateforme

L’architecture fonctionnelle décrit les **grands modules** et fonctionnalités que Symbolica offrira à ses utilisateurs. La plateforme combinera des fonctionnalités classiques de réseaux collaboratifs (profil, contributions, fil d’actualité) avec des outils spécialisés (annotation d’images, carte interactive, IA de reconnaissance et génération). Ci-dessous, nous détaillons chaque composant clé :

### 4.1. Upload & géolocalisation de photos

**Description :** Les utilisateurs pourront **téléverser des photos** de symboles ou motifs qu’ils rencontrent (sur un monument, un objet d’art, une affiche, etc.). Chaque upload comprendra la possibilité d’indiquer *où* la photo a été prise. La géolocalisation se fera soit automatiquement (si les métadonnées GPS de l’image sont présentes), soit via une interface de carte où l’utilisateur clique pour placer un marqueur. Des champs de métadonnées accompagnent l’upload : titre de la photo, description libre, date (éventuellement importée des EXIF), culture ou origine supposée du motif, etc.

**Objectifs :** Constituer une **base de données participative d’images** géoréférencées de motifs culturels. La localisation ajoute une dimension essentielle : elle permet de cartographier la diffusion des motifs (ex: un motif “triskèle celtique” apparaîtra sur la carte en Bretagne mais aussi ailleurs via la diaspora Celte, etc.). Cela ouvre la porte à des analyses géographiques et historiques.

**Spécifications :**

* Un **formulaire d’upload** intuitif (drag & drop) avec prévisualisation de l’image. Possibilité de charger depuis un mobile (progressive web app ou application native ultérieurement).
* La géolocalisation utilisera un fond de carte (OpenStreetMap via Leaflet ou Mapbox) pour sélectionner le lieu. Stockage en base de la coordonnée GPS (latitude/longitude) et éventuellement d’une adresse ou toponyme (via reverse geocoding).
* Support de divers formats d’image (JPEG, PNG, etc.) et compression côté serveur pour optimiser le stockage. Les images originales seront stockées sur un service type S3 (voir stack) et des vignettes générées pour l’affichage web.
* **Contraintes** : modération des contenus à l’upload (filtre contre images inappropriées via un outil automatique type AWS Rekognition ou Modération IA, + validation communautaire si nécessaire). Limite de taille (p.ex. 20MB par image) pour assurer une performance stable.
* **Évolution prévue** : à terme, permettre aussi l’upload de **modèles 3D ou scans** (pour motifs en bas-relief, objets, etc.) et leur localisation.

### 4.2. Annotation participative avec zones cliquables sur images

**Description :** Une fois une photo publiée, la communauté peut y **annoter** les motifs visibles. L’annotation se fait via une interface d’édition d’image : l’utilisateur peut dessiner une **zone cliquable** (par exemple un rectangle ou un polygone) autour d’un motif particulier dans l’image, puis y associer une information. Cette information peut être :

* Une **identification** du motif (nom, description, éventuellement lien vers une fiche de motif s’il existe déjà dans la base – voir plus loin base de connaissances).
* Des **tags** ou catégories (ex : *#animal*, *#art-déco*, *#religieux*).
* Des références ou une explication contextuelle (ex : *“Ce motif est un motif floral fréquent dans l’art roman du XIIe siècle.”*).

Plusieurs annotations peuvent être placées sur la même image, si celle-ci contient plusieurs motifs d’intérêt.

**Objectifs :** Permettre l’enrichissement **collaboratif** de l’image brute par de la connaissance. Là où l’image seule montre, l’annotation explique. Ce mécanisme est central pour construire une **base de savoir** sur les symboles. L’approche participative offre une **intelligence collective** : un historien identifie un motif, un utilisateur local ajoute le nom vernaculaire, un autre ajoute un lien Wikipédia, etc.

**Spécifications :**

* Outil d’annotation ergonomique sur le front-end (on pourra intégrer une librairie existante comme **Annotorious** ou développer un module custom Canvas/JS). Il doit permettre de créer au moins des **bounding boxes** (rectangles) sur l’image, voire des polygones libres pour épouser des formes complexes.
* Chaque annotation (zone) est liée en base à une entité “Annotation” comportant : référence de l’image, coordonnées de la zone (par ex. en pourcentage de x/y ou format JSON), texte de l’annotation, références éventuelles, auteur de l’annotation, date.
* Les annotations seront **cliquables au survol** de l’image : l’utilisateur naviguant voit les zones soulignées/translucides et en cliquant obtient les détails (popup ou panneau latéral).
* Système de **versionning/modération** des annotations : étant donné qu’il s’agit d’un wiki d’annotations en quelque sorte, il sera possible de suggérer une correction, ou de valider/invalider une annotation. Un utilisateur peut par exemple voter pour dire “cette identification est correcte” ou au contraire signaler une erreur. Un mécanisme de vote et de karma lié (voir gamification) aidera à fiabiliser le contenu.
* **Liens vers base de connaissances** : idéalement, l’annotation pourra lier le motif à une fiche dédiée (ex : fiche “Triskèle” dans la base Symbolica, ou un item Wikidata). Si l’annotateur ne trouve pas le motif dans la base existante, il peut proposer la création d’une nouvelle entrée.
* Accessibilité : veiller à ce que l’annotation soit utilisable via clavier et lecteur d’écran (normes W3C si possible, comme le fait CrowdHeritage avec le modèle d’annotation W3C).

### 4.3. Reconnaissance automatique de motifs (IA + apprentissage collaboratif)

**Description :** Symbolica intégrera un système de **reconnaissance d’image par IA** afin de détecter automatiquement les motifs connus dans les photos uploadées. Concrètement, lorsqu’un utilisateur charge une image, l’IA va analyser celle-ci et proposer éventuellement : *“Ce motif semble être un X (confiance 80%)”*. Cette reconnaissance se base sur un modèle de vision entraîné sur un corpus de motifs (initialement, peut-être un modèle généraliste affiné sur notre domaine). En complément, la plateforme apprend *en continu* grâce aux retours des utilisateurs : chaque confirmation ou infirmation des suggestions de l’IA améliore le modèle (apprentissage supervisé continu ou récolte de données pour re-entraînement périodique).

**Objectifs :**

* **Faciliter la contribution :** un non-expert qui charge une photo pourrait bénéficier de l’aide de l’IA pour nommer le motif. Cela réduit la barrière à la participation.
* **Accélérer l’indexation :** avec potentiellement des milliers d’images, l’IA aide à pré-classer et taguer les contenus, que la communauté n’a plus qu’à valider. C’est un mode *semi-automatique* efficace pour bâtir la base de connaissances.
* **Valoriser la donnée** : plus tard, une IA performante peut permettre à un visiteur de chercher “motif type rosace gothique” et de retrouver toutes les images correspondantes automatiquement.

**Spécifications :**

* Utilisation d’**algorithmes de vision par ordinateur**. Deux approches complémentaires peuvent être envisagées :

  * Un modèle de **classification**/détection entraîné spécifiquement (par ex. un CNN détectant une liste de motifs prédéfinis). Limité aux motifs connus et présents dans son jeu de données d’entraînement.
  * Un modèle de **recherche par similarité** (ex : utilisation d’un réseau type ResNet ou d’un modèle *feature extractor* comme CLIP pour générer des embeddings, puis comparaison avec les embeddings d’images déjà annotées dans la base pour trouver des similitudes). Ceci permet de suggérer *“image similaire trouvée : motif X”* même pour motifs non dans une liste fermée.
* Pipeline d’analyse à l’upload : dès qu’une image est postée, un service backend (en Python/PyTorch) la traite. Les résultats (tags probables, coordonnées de motif détecté éventuellement) sont renvoyés et stockés comme *“annotations suggérées par IA”*, visibles par l’utilisateur qui peut les accepter ou non.
* **Interface UX :** l’utilisateur voit, après upload, un message du type « L’IA pense que cette image contient peut-être *un dragon celte*. Confirmez-vous ? (Oui / Non / Pas sûr) ». En cas de oui, l’annotation correspondante est créée (avec mention qu’elle a été assistée par IA). En cas de non, l’info est envoyée au modèle comme un faux positif à éviter (dans la mesure du possible).
* **Apprentissage collaboratif :** toutes les images confirmées alimentent un **dataset d’entraînement**. Prévoir un mécanisme pour périodiquement ré-entraîner le modèle (hors ligne, versionning du modèle). On pourra exploiter les *labels* validés par la communauté pour augmenter les données. Par exemple, un motif identifié 50 fois par différents utilisateurs devient un *concept* solide pour l’IA.
* **Technologies IA :** PyTorch sera privilégié (voir stack). OpenCV peut aider pour des tâches de pré-traitement (détection de contours, filtrage) pour améliorer la qualité des inputs. On pourra tirer parti de modèles pré-entraînés (ex : on peut fine-tuner un modèle de classification sur ImageNet pour qu’il distingue nos catégories de motifs). À terme, entraîner un modèle sur **plus de 2 millions de photos géolocalisées** comme l’a fait une étude récente (119 motifs identifiés via 2,1M de photos Flickr) n’est pas exclu, mais pour le MVP on restera sur un périmètre réduit.
* **Performances** : le modèle doit répondre en temps raisonnable (quelques secondes). Si usage intensif, prévoir de mettre en place une file de tâches asynchrones (ex : Celery + Redis si backend Python) pour traiter les images en parallèle et notifier l’utilisateur quand c’est prêt.

### 4.4. Carte interactive & navigation par filtres (culture, époque, pays, style)

**Description :** Une fonctionnalité phare sera une **carte du monde interactive** où sont positionnés tous les motifs collectés. Chaque photo/motif géolocalisé apparaît sous forme de point (avec clustering visuel si trop de points proches). L’utilisateur peut zoomer/dézoomer, et surtout filtrer l’affichage selon des critères *culturels ou thématiques*. Par exemple : afficher uniquement les motifs de la période Renaissance, ou les motifs appartenant à la culture Maori, ou encore les motifs de type “animaliers”. Une couche temporelle pourrait permettre de **faire glisser une frise chronologique** pour voir l’apparition/disparition de motifs à travers le temps.

&#x20;*Exemple d’une carte de répartition de motifs culturels (ici, résultats d’une recherche universitaire sur des motifs photographiés en Europe) : les points orange/verts/violets indiquent des catégories de motifs identifiés automatiquement. Symbolica proposera une carte interactive similaire, où chaque point est cliquable pour voir le motif et ses informations.*

**Objectifs :** La carte permet une **exploration géographique intuitive** du contenu. C’est un outil d’analyse puissant pour repérer des **concentrations de symboles** (ex : forte présence de motifs “art nouveau” à Bruxelles), ou au contraire suivre des itinéraires culturels (ex : route de motifs caravansérails de la route de la soie). Les filtres offrent une **navigation thématique croisée**: l’utilisateur peut explorer par **culture** (p. ex. *“tout l’héritage Viking”*), par **époque** (p. ex. *“motifs du 18e siècle en Amérique du Sud”*), par **type de motif** (géométrique, figuratif, religieux, etc.), ou combiner (ex: motifs géométriques islamiques du Moyen-Âge).

**Spécifications :**

* Basée sur un fond de carte mondial (OpenStreetMap ou autre open data). Intégration via un composant type LeafletJS ou Mapbox GL JS dans le front-end.
* **Points dynamiques** : chargés depuis la base via API. Utilisation de **PostGIS** côté base pour effectuer des requêtes spatiales si l’utilisateur filtre par zone visible. On pourra par exemple n’envoyer que les points dans le cadre de la carte courant (bbox) pour réduire la charge.
* **Clustering** : utiliser un algorithme de clustering (ex: **MarkerCluster** plugin) pour agréger les motifs proches quand zoom out, évitant une sur-saturation de points.
* Clic sur un point : affiche un petit **aperçu** (thumbnail de la photo, nom du motif si connu). Un second clic ou une action “ouvrir” permet de voir la page détaillée de ce point (avec l’image annotée, les infos, etc.).
* **Filtres multicritères** : interface UI (barre latérale ou bandeau en haut) avec plusieurs facettes :

  * **Culture / Origine** (liste de cultures ou aires géographiques culturelles : Europe, Asie, ou plus précis comme *culture Maya*, *culture Persane*… ces valeurs proviennent soit de la fiche motif associée soit des tags).
  * **Époque / Période** (proposer des tranches : Antiquité, Moyen-Âge, Moderne, Contemporain… ou par siècles, en convertissant les dates si disponibles).
  * **Pays** (selon la localisation géographique précise, on peut filtrer par pays actuel dans lequel la photo a été prise, en se basant sur la coordonnée et un service de géocodage inverse pour connaître le pays).
  * **Style/Type** (ex : *architectural*, *textile*, *peinture murale*, etc. ou *abstrait*, *figuratif*… Ces catégories restent à définir dans la base de connaissances, possiblement multi-valuées).
* **Timeline** (optionnel MVP, potentiellement en phase ultérieure) : un slider chronologique permettant de filtrer par date de création du motif (si connu). Ce champ “date de création” ferait partie de la fiche motif, pas forcément de la photo (une photo de 2021 peut représenter un motif créé en 1600). Donc, cela impliquerait qu’une image liée à un motif daté hérite de ce filtre.
* **Performances & UX** : Doit rester fluide malgré potentiellement des dizaines de milliers de points. D’où importance du clustering et du chargement dynamique par tuiles. Possibilité de remplacer les marqueurs par un calque *Canvas/WebGL* pour performance si nécessaire.
* **Multilingue** : les libellés sur la carte (noms de pays, etc.) seront dans la langue de l’interface (via fonds de cartes localisés ou calques appropriés).
* **Mobile** : La carte devra être utilisable sur mobile (zoom tactile, etc.), avec peut-être une version simplifiée (liste des résultats proche de la position de l’utilisateur, etc. – fonctionnalité “autour de moi”).

### 4.5. Système de gamification (niveaux, badges, contributions)

**Description :** Pour encourager la participation, Symbolica mettra en place un **système ludique de gamification**. Chaque action utile de l’utilisateur lui rapporte des points d’**expérience** ou des **“contributions”**. En accumulant ces points, l’utilisateur progresse en **niveau** (par exemple du niveau *Apprenti symboliste* jusqu’à *Grand Maître des Symboles*). Parallèlement, des **badges** distinctifs pourront être obtenus en accomplissant certains jalons ou actions spécifiques.

**Exemples de gamification :**

* Un utilisateur gagne +5 points par photo uploadée, +2 par annotation ajoutée, +1 par vote de validation, etc.
* Des badges tels que **“Explorateur”** (avoir géolocalisé des motifs dans au moins 5 pays différents), **“Conservateur”** (10 motifs rares documentés), **“Mentor”** (avoir reçu 50 upvotes sur ses annotations d’autrui, signe de qualité)…
* Un classement hebdomadaire des contributeurs les plus actifs peut être affiché pour stimuler une saine compétition, ainsi qu’un **tableau de bord personnel** où l’utilisateur voit ses progrès et prochains objectifs (ex: *“Encore 3 annotations pour atteindre le niveau 5”*).

**Objectifs :** Motiver et fidéliser les utilisateurs en rendant l’expérience contributive plus **ludique et gratifiante**. La gamification doit créer un cercle vertueux : plus on contribue, plus on gagne en reconnaissance dans la communauté (points, badges, statut), ce qui incite à contribuer davantage. Cela aide à atteindre l’objectif de 50 000 utilisateurs actifs en stimulant l’engagement continu de chacun.

**Spécifications :**

* **Points & niveaux :** Mettre en place une table de scoring. Définir une *formule de niveau* (par ex. niveau = sqrt(total points/100) \* 10, ou une échelle fixe). Chaque type d’action aura un poids prédéfini, ajustable via configuration.
* **Badges :** Définir une liste de badges avec critères. Le système doit vérifier après chaque action si un badge est débloqué. Badges de différents types (bronze, argent, or) à la manière de Stack Overflow pour inciter à diversifier les contributions.
* **Profil utilisateur enrichi :** Sur la page de profil (voir section 4.8), afficher clairement les badges obtenus et le niveau. C’est valorisant pour l’utilisateur et visible pour les autres (prestige dans la communauté). Par exemple, un encadré *“Contributeur niveau 7 – 3 badges or, 5 argent, 10 bronze”*.
* **Peer review et réputation :** Au-delà des points “quantité”, intégrer une notion de **qualité**. Par exemple, utiliser un système de *karma* inspiré de CrowdHeritage : les annotations peuvent être upvotées/downvotées par les pairs, et un score de karma est calculé pour chaque utilisateur en fonction de la fiabilité de ses contributions. Un utilisateur avec haut karma sera mis en avant, et possiblement gagnera des privilèges (par ex, modération simplifiée, droit de valider sans relecture).
* **Interface** : un **dashboard de gamification** doit être accessible, avec l’historique des points gagnés, les prochains objectifs (ex: badges manquants proche d’être obtenus), et des explications sur chaque badge (pour encourager l’utilisateur à tenter de les obtenir tous).
* **Notifications** : chaque gain important (niveau up, badge obtenu) doit déclencher une notification félicitant l’utilisateur, voire un email hebdo récapitulant ses accomplissements pour le fidéliser.
* **Équilibre** : veiller à équilibrer le système pour qu’il reste motivant sur le long terme (les premiers niveaux faciles pour accrocher, puis progression plus lente). S’assurer que cela ne crée pas un climat de compétition négative ou de spam (ex: éviter que les gens postent du contenu de moindre qualité juste pour des points – d’où l’intérêt du karma qualitatif).

### 4.6. Défis, concours, hackathons en ligne

**Description :** Au-delà des contributions quotidiennes, Symbolica organisera périodiquement des **événements communautaires en ligne** pour dynamiser l’activité et attirer de nouveaux publics. Il y a plusieurs formats possibles :

* **Défis thématiques** (par ex. *“Défi de la semaine : les animaux mythiques”* – objectif d’uploader/annoter un maximum de motifs liés aux animaux légendaires, avec un compteur collectif et un badge spécial à la clé).
* **Concours créatifs** (par ex. concours de création de motif via l’IA Stable Diffusion intégrée : les participants soumettent leurs images générées sur un thème donné, la communauté vote pour la plus belle, le gagnant reçoit une récompense symbolique, ex: son motif mis en avant sur la page d’accueil, ou un badge “Artiste”).
* **Hackathons en ligne** (orientés développeurs / data : par exemple un hackathon pour utiliser l’API ouverte de Symbolica et créer des visualisations originales, ou pour entraîner un modèle de reconnaissance sur un type de motif particulier, ou encore améliorer la plateforme – ce genre d’événement peut se faire en partenariat avec des écoles d’ingénieurs ou design).

**Objectifs :** Ces événements servent à **animer la communauté** et à la faire grandir. Un défi thématique peut ramener de l’attention médiatique (ex: un musée partenaire relaie le défi sur ses réseaux). Un hackathon attire des contributeurs techniques qui peuvent ensuite continuer à aider en open source. Les concours créatifs positionnent Symbolica non seulement comme un site de collecte de données, mais aussi comme un **laboratoire d’innovation culturelle**, stimulant la créativité autour du patrimoine.

**Spécifications :**

* **Module de gestion d’événements** : prévoir dans l’interface admin la possibilité de créer un événement avec une page dédiée. La page décrit le thème, les règles, la durée (dates de début/fin) et affiche éventuellement un **classement en temps réel** pour les défis quantitatifs.
* Pour les défis de contribution : un compteur de contributions liées (ex: nombre de motifs d’une certaine catégorie ajoutés, progression vers un but collectif) et un listing des top contributeurs du défi.
* Pour les concours : système de **soumission** (upload spécifique au concours, éventuellement marquage spécial), puis **vote** de la communauté (ou jury si partenariat). Assurer une vote par utilisateur (contrôler double vote, etc.). À la fin, afficher les résultats, contacter les gagnants.
* Pour les hackathons : possiblement une intégration avec un forum ou chat (Discord) pour les échanges, et publication des projets gagnants sur le blog de Symbolica. Les hackathons peuvent aussi servir d’**incubateur de fonctionnalités** pour la plateforme elle-même.
* **Récompenses** : principalement des distinctions sur la plateforme (badges spéciaux exclusifs liés à l’événement remporté, mention dans la newsletter, etc.). Éventuellement dotation de prix via partenaires (livres, invitations…) si on s’associe avec des institutions.
* **Calendrier** : envisager un rythme (par ex. un petit défi bimensuel, un concours créatif trimestriel, un hackathon annuel). Un calendrier public peut informer les utilisateurs des prochains rendez-vous.

### 4.7. Génération assistée de motifs via IA créative (Stable Diffusion)

**Description :** Symbolica incorporera un **outil de génération d’images par IA** pour permettre aux utilisateurs de **créer de nouveaux motifs** inspirés de ceux de la base. Concrètement, en utilisant un modèle de type *Stable Diffusion* (ou équivalent), l’utilisateur pourra entrer une description textuelle – par exemple *“générer un motif floral dans le style Art Nouveau avec des éléments celtiques”* – et l’IA produira une ou plusieurs images correspondantes. Il pourra également être possible de **partir d’un motif existant** (image de la base) pour générer des variantes (via des techniques d’*image-to-image* ou de *ControlNet*, par exemple). Ce générateur sera une sorte d’atelier créatif virtuel, à la disposition des designers, artistes ou simples curieux.

**Objectifs :**

* **Stimuler la créativité** et la réutilisation des patrimoines iconographiques. Un designer peut s’inspirer de motifs traditionnels pour en créer de nouveaux, participant ainsi à la *revitalisation du patrimoine culturel par l’innovation* (comme l’a démontré une étude récente où un modèle de diffusion a été entraîné pour générer de nouveaux designs de cerfs-volants traditionnels).
* **Attirer un public créatif** qui n’est pas forcément intéressé par l’aspect encyclopédique mais qui le sera par l’outil de création (par ex. des graphistes, des artistes numériques).
* **Enrichir la base** : les meilleurs motifs générés pourraient, avec l’accord de leurs auteurs, être ajoutés à la collection Symbolica sous licence libre, créant ainsi un pont entre tradition et création contemporaine.

**Spécifications :**

* L’IA utilisée sera **Stable Diffusion** (modèle open source d’inférence d’images) ou un dérivé fine-tuné. Avantage : pas de dépendance à une API payante tierce, on peut l’héberger nous-mêmes et même la spécialiser sur nos données de motifs.
* **Infrastructure** : la génération d’image est coûteuse en calcul (GPU nécessaire). On mettra en place un micro-service dédié (ex: un serveur Python avec l’IA sur GPU). Les requêtes de génération seront asynchrones (l’utilisateur fait sa demande, voit un indicateur de progression, et reçoit l’image une fois prête).
* **Interface** : un module *“Atelier”* ou *“Laboratoire créatif”* accessible depuis le menu. Interface simple avec un champ texte pour le prompt, éventuellement des options (taille de l’image, style artistique parmi des presets, curseur de variation si on part d’une image existante). Un bouton *“Générer”* lance le processus.
* **Fonctionnalités avancées** :

  * *Image-to-image* : l’utilisateur peut choisir une image de motif existante comme point de départ. L’IA conservera la structure du motif mais pourra le re-styliser selon une consigne.
  * *Styles pré-entraînés* : on peut fine-tuner Stable Diffusion sur des ensembles de motifs d’une culture pour avoir des *modes* spécifiques (par ex. “générer dans le style maori”). Alternativement, proposer des embeddings/Lora prêts pour certains styles.
  * **Génération tuileable** : option pour que le motif généré soit seamless (repetition possible en motif de texture), ce qui est utile pour du design textile ou wallpaper.
* **Modération et éthique** : on intégrera des garde-fous pour éviter les usages abusifs (génération de symboles offensants, etc.). Stable Diffusion a des filtres NSFW qu’on activera. Un contrôle manuel des outputs peut être envisagé si on craint des dérapages (mais c’est plutôt limité aux images de personnes/explicit, ce qui est moins le sujet ici).
* **Stockage des créations** : Les images générées pourront être enregistrées dans le profil de l’utilisateur (galerie personnelle) et éventuellement partagées sur la plateforme (soit dans une section “créations”, soit en les associant à un motif existant comme variante contemporaine).
* **Performances** : pour 50 000 utilisateurs, tout le monde ne génère pas en même temps, mais il faut prévoir une mise à l’échelle si l’usage décolle (peut-être limiter le nombre de générations gratuites par jour par utilisateur, ou mettre en place un système de “crédits” liés aux contributions : plus on contribue, plus on peut générer en retour). En cas de forte demande, possibilité de brancher sur une solution cloud temporaire (ex: API Stable Horde ou autres).

### 4.8. Profil utilisateur riche & page collection / “musée” personnel

**Description :** Chaque inscrit disposera d’un **profil utilisateur détaillé** ainsi que d’un espace personnel pour organiser ses trouvailles ou créations. Le profil comportera les informations classiques (pseudo, avatar, bio, localisation, langues parlées, centres d’intérêt culturels…) et des indicateurs publics de contribution (voir gamification : niveau, badges, karma). Outre cela, chaque utilisateur aura la possibilité de **constituer sa collection personnelle de motifs** : un peu comme un *musée virtuel* qu’il peut organiser à sa guise.

**Objectifs :**

* **Valoriser le contributeur** : Le profil riche permet de mettre en avant son investissement. C’est motivant (on a “sa vitrine”) et ça facilite les interactions sociales (on peut suivre d’autres membres, voir leurs collections, etc.).
* **Personnalisation & appropriation** : l’espace collection donne à l’utilisateur un sentiment de propriété intellectuelle et d’engagement. Chacun peut raconter *sa* vision des symboles en sélectionnant ceux qui le touchent. C’est aussi un outil pédagogique (un professeur peut se créer une collection de motifs pour un cours, un étudiant pour un exposé…).
* **Réseau social thématique** : via les profils, Symbolica tisse un réseau de passionnés. On peut découvrir des utilisateurs aux goûts proches, échanger via commentaires ou messages, etc., renforçant la dimension communautaire.

**Spécifications :**

* **Page de profil** : URL dédiée (ex: symbolica.org/u/username). Montre avatar + pseudo, éventuellement vrai nom si l’utilisateur l’a fourni (optionnel, on respecte l’anonymat/pseudonymat). Affiche la bio (champ libre), la localisation (pays ou ville si le user souhaite), les langues (pour faciliter l’échange ou le mentorat dans une langue commune).
* **Stats de contributions** : nombre de photos uploadées, annotations faites, validations, défis gagnés, etc. Niveau actuel et badges (sous forme d’icônes cliquables pour voir la description du badge).
* **Collections** : l’utilisateur peut créer une ou plusieurs collections thématiques. Par ex. *“Mes motifs préferés d’Amérique Latine”*, *“Inspiration pour mon projet de design 2025”*, etc. Une collection est essentiellement une liste d’éléments (motifs ou images présentes sur Symbolica) avec éventuellement un titre et une description pour contextualiser. Techniquement, cela peut être réalisé via une table de “favoris” ou “collections” reliant l’utilisateur et les items.
* Sur la page profil, les collections de l’utilisateur sont listées, chacun pouvant être ouvert comme une mini-galerie.
* **Musée personnel** : on peut envisager une présentation plus immersive des collections, par ex. un mode diaporama ou même un affichage sur carte si la collection a un aspect géographique (pourquoi pas laisser l’utilisateur choisir un mode d’affichage).
* **Interactions sociales** : permettre de **suivre** un utilisateur (s’abonner à ses nouvelles contributions/collections), aimer/commenter une image ou une collection. Une messagerie interne de base ou l’intégration de contact via un forum/Discord peut être prévue, mais pour le MVP des commentaires publics suffiront.
* **Paramètres de confidentialité** : l’utilisateur choisit ce qui est public sur son profil. Par défaut tout est public sauf email. Mais on peut offrir l’option de garder certaines collections privées (juste pour soi ou partageable via lien).
* **Moderation** : en lien avec la gouvernance, il faudra des outils admin pour éditer/supprimer un profil si comportement inapproprié, ou modérer des contenus de collection (par ex. si quelqu’un ajoute un contenu qui ne respecte pas les licences).
* **Internationalisation** : un champ “langue” permet d’afficher le profil dans la langue de l’UI, mais aussi de signaler quelles langues l’utilisateur parle (utile pour pairer les gens dans des projets, etc.).

### 4.9. Multilingue dès le départ (français, anglais)

**Description :** La plateforme sera conçue **nativement pour le multilinguisme**. L’interface utilisateur sera disponible au lancement en français et en anglais, et dès la première version l’architecture supportera l’ajout d’autres langues (espagnol, arabe, chinois, etc.) sans refonte majeure. Cela concerne non seulement les menus et textes de l’UI, mais aussi le **contenu communautaire** (annotations, descriptions) pour lequel il faudra trouver des solutions de traduction ou de coexistence linguistique.

**Objectifs :**

* Toucher immédiatement un public international (francophone et anglophone représentent déjà une large base).
* Éviter de “verrouiller” le projet dans une langue source, car le sujet même – les symboles culturels – est global. Une approche multilingue renforce l’idée de partage interculturel.
* Permettre la croissance organique de communautés linguistiques autour de Symbolica (ex : si la base grandit, avoir des modérateurs par langue, etc.).

**Spécifications :**

* **Interface localisée** : utilisation de frameworks de **traduction** (par ex. i18next en JS, ou le système i18n de Next.js, ou Django internationalization s’il est utilisé en backend). Toutes les chaînes de caractères de l’UI seront dans des fichiers de langue séparés.
* Détection de la langue du navigateur pour choisir la locale par défaut, avec possibilité de la changer manuellement (sélecteur de langue en menu).
* **Contenu multilingue** : Pour les contenus structurés comme les *fiches de motifs* (voir base de données plus loin), on pourra prévoir des champs multilingues (par ex. description\_fr, description\_en). Ainsi, si une fiche “Dragon” existe, elle pourra avoir un texte explicatif en plusieurs langues. On s’inspirera de Wikidata/Wikipedia où chaque concept est décliné par langue. Cependant, toutes les traductions ne seront pas disponibles dès le début, cela reposera aussi sur la communauté (inciter les bilingues à traduire des fiches clés).
* **Traduction communautaire** : Mettre en place un **système de traduction participative** pour le contenu généré par les utilisateurs. Par exemple, un outil simple “Traduire cette annotation dans une autre langue”. Cela crée une copie liée de l’annotation dans l’autre langue. Un utilisateur voyant une annotation non disponible en sa langue pourrait au moins la voir en anglais par défaut, et si possible contribuer à la traduire.
* **Filtrage par langue** : Permettre à l’utilisateur de choisir dans ses préférences s’il veut voir le contenu multilingue (par ex afficher toutes les annotations, quelle que soit la langue, avec possibilité de traduction à la demande) ou seulement celles dans sa langue (pour ne pas être noyé dans du texte non compréhensible). Cependant, la plupart des motifs n’ayant pas 50 langues, on peut par défaut tout montrer avec une indication de langue.
* **Documentation et support** : Fournir les pages d’aide, CGU, etc., en français et anglais dès le début.
* **Évolutivité** : ajouter une langue = ajouter un fichier de locale + faire traduire l’interface. Prévoir cela dans le planning (peut-être via une plateforme de traduction type Transifex pour impliquer la communauté dans les futures traductions de l’UI).

En assurant un multilinguisme robuste dès le départ, Symbolica pourra, comme CrowdHeritage, impliquer des citoyens de divers pays et améliorer la réutilisation internationale du patrimoine.

## 5. Stack technologique recommandée (modulaire & scalable)

Pour réaliser ces fonctionnalités, nous préconisons une **stack technologique moderne** qui assure **performance, évolutivité et maintenabilité**. Voici les choix recommandés pour chaque couche, en soulignant les alternatives possibles :

* **Front-end (client)** : **React** est recommandé, idéalement avec le framework **Next.js**. Next.js permettra le rendu côté serveur (SSR) des pages pour un SEO optimisé (utile si on veut que les pages de motifs soient bien indexées par Google) et de bonnes performances initiales. De plus, Next.js gère nativement l’internationalisation et offre la possibilité d’héberger des API routes si nécessaire. Le front-end sera une application web responsive (mobile-first design) pour toucher autant les utilisateurs desktop que mobiles dès le lancement.

  * *Pourquoi React ?* Large communauté, nombreux composants existants (par ex. librairies d’annotation d’images, cartes interactives via React-Leaflet, etc.), facilitant le développement. C’est également en phase avec une architecture API-first (React consommant des APIs REST/GraphQL).
  * On utilisera TypeScript pour fiabiliser le code front, et des outils comme Redux ou React Query pour la gestion d’état/caching des données selon les besoins.

* **Back-end (serveur applicatif)** : Deux options viables ont été identifiées : **Node.js** (JavaScript/TypeScript) ou **Django (Python)**. Chacune a ses avantages, mais voici la recommandation :

  * Opter pour **Node.js avec un framework type Express** ou **NestJS**. Cela permet d’avoir un même langage (JS/TS) côté front et back, ce qui peut faciliter le partage de modèles de données, et bénéficier de la haute performance de Node pour les requêtes I/O (utile pour servir l’API, uploader des fichiers, etc.). NestJS en particulier offre une structure modulaire et intègre TypeScript, ce qui aide à construire une API maintenable (avec des modules pour utilisateurs, motifs, etc.).
  * Alternativement, **Django (Python)** est très pertinent pour sa maturité, son ORM puissant et ses modules intégrés (admin auto-généré, gestion auth, i18n). De plus, Python serait nécessaire pour la partie IA (reconnaissance de motif, stable diffusion). Une approche hybride pourrait être adoptée : Django ou FastAPI pour les endpoints liés à l’IA et aux tâches de fond, et Node/Next pour servir le front. Toutefois, pour réduire la complexité, on peut débuter 100% Django (monolithique) car il peut gérer à la fois le front (via Django templates ou Graphene GraphQL si on fait un SPA) et le back. Cependant, comme on souhaite utiliser React/Next en front séparé, le back pourrait être pure API REST.
  * **API** : Quoi qu’il en soit, le backend exposera une API (REST JSON, ou GraphQL si on veut plus de flexibilité dans les requêtes du front, GraphQL pouvant être pratique pour récupérer par ex une image avec ses annotations et motifs liés en une seule requête). Initialement, une API REST RESTful suffira (avec endpoints pour /users, /photos, /motifs, etc.).

* **Base de données** : **PostgreSQL** est un choix solide, accompagné de son extension **PostGIS** pour la gestion des données géospatiales. PostgreSQL est robuste et open source, adapté à nos données relationnelles (utilisateurs, contributions, etc.), et PostGIS nous donne les types geometry et les index spatiaux pour effectuer des requêtes performantes sur les coordonnées (ex: trouver tous les motifs dans un rayon de X km, requête pour la carte etc.). De plus, Postgres peut servir pour stocker des JSON (utile pour stocker les shapes d’annotation si on veut, ou d’autres métadonnées flexibles) et permet d’utiliser des vues matérialisées ou des fonctions pour des besoins avancés (agrégations de contributions, etc.).

  * Schéma détaillé proposé en section 6.

* **Stockage de fichiers** : Pour les photos uploadées et images générées, on évitera de stocker en base de données (inefficace pour les blobs binaires). On préconise un stockage objet type **S3** (Amazon S3 ou une alternative open-source comme **MinIO** si on auto-héberge). Cela permet un stockage scalable, avec distribution via CDN potentielle si la charge augmente (50k utilisateurs pouvant générer beaucoup de trafic image). Chaque fichier image aura un URL sécurisé. Les backups et la durabilité sont gérés par le fournisseur (S3 standard propose 99.999999999% de durabilité).

* **Recherche plein-texte** : Si on souhaite une recherche puissante (par nom de motif, description, etc.), on pourrait intégrer **ElasticSearch** ou **OpenSearch**. Cependant, Postgres offre déjà des capacités de recherche texte (Full Text Search avec des index GIN sur des colonnes TSVECTOR). Pour le MVP, on peut s’en tenir à Postgres FTS pour éviter la complexité d’un cluster Elastic de plus. Si la base de connaissances grossit et qu’on veut suggérer des contenus par pertinence sémantique, ElasticSearch pourrait être ajouté en module (par ex. pour permettre des recherches plus complexes, ou une autocomplétion rapide).

  * À noter qu’un moteur comme Elastic pourrait aussi servir pour les recherches géospatiales et agrégations, mais PostGIS fait très bien l’affaire déjà.

* **Composante IA** : Pour la reconnaissance de motifs et la génération IA, le choix est clairement **Python** (librairies PyTorch, OpenCV, etc.). On aura donc une partie du back en Python, soit intégrée au même service (si on part sur Django, c’est naturel), soit en **microservice séparé**.

  * Microservice IA : Par exemple, un service Python (FastAPI ou Flask) qui expose des endpoints internes du type `/predict_motif` (qui reçoit une image ou un ID d’image et retourne les prédictions) et `/generate_image` (qui reçoit un prompt et renvoie une image générée). Le front ou le back principal appelle ces services en interne. Cela permet de scaler indépendamment la partie IA (qui demande du GPU).
  * **OpenCV** sera utilisé pour certains traitements (détection de contours pour aider l’annotation auto, etc.). **PyTorch** pour entraîner/faire tourner nos modèles (classifieurs de motif, Stable Diffusion via Diffusers lib).
  * On peut containeriser ces services (Docker avec une image incluant CUDA etc. pour l’IA).

* **Serveur & déploiement** : Prévoir une architecture modulable. En phase initiale, tout peut tenir sur un même serveur (web + bdd + service IA si faible charge). Mais on vise 50k utilisateurs actifs, il faudra probablement séparer les rôles :

  * Serveur web principal (Node ou Django) – scalable horizontalement en ajoutant plus d’instances derrière un load balancer.
  * Serveur(s) de base de données – possiblement un master et un read-replica pour diviser lecture/écriture.
  * Serveur de fichiers (S3 externalisé, ou un NAS si local).
  * Serveur IA avec GPU – potentiellement un pour la reconnaissance (peut être CPU si modèle léger) et un pour la génération (GPU requis). On peut aussi utiliser des services cloud on-demand pour la génération si ponctuel.
  * Utilisation de **Docker/Kubernetes** est conseillée à terme pour orchestrer tout ça, surtout si on déploie sur cloud. Mais pour le MVP, Docker Compose suffira pour packager les services (web, db, etc.) facilement.

* **Évolutivité (scalabilité)** : La stack proposée est choisie pour **monter en charge facilement**. Next.js/Node supporte un grand nombre de requêtes non-bloquantes. PostgreSQL gère bien des millions d’enregistrements (avec index appropriés). S3 peut absorber de très hauts volumes. En cas de succès au-delà de 50k utilisateurs, on pourrait migrer le backend vers une architecture microservices plus poussée (découper par domaines : service user, service content, etc.) et utiliser Kubernetes pour auto-scaling. Également, mettre en cache certains contenus statiques ou très lus (par ex: page d’accueil, ou pages de motifs très populaires) via un CDN ou un cache HTTP (Varnish, Cloudflare) pour soulager le serveur.

* **Sécurité & Authentification** : Utilisation de **JWT** pour les API (si SPA séparée) ou des sessions sécurisées (si SSR). Stockage des mots de passe hashés (bcrypt). Protection contre les classiques (SQL injection gérée par ORM, rate limiting sur les endpoints sensibles pour éviter spam, captcha pour bot si inscriptions massives, etc.). Le caractère open source du projet impose d’être vigilant sur la sécurisation (code revu par la communauté, corrections rapides).

* **Tests & CI** : Mettre en place des tests unitaires (Jest pour front/Node, PyTest pour Python) et potentiellement des tests d’intégration. Un pipeline CI (GitHub Actions par ex) pour lancer les tests et déployer sur un environnement de staging, puis production.

En résumé, la stack technique centrale serait : **Next.js (React)** pour le front, **Node.js/Express ou NestJS** pour l’API, **Python (PyTorch, OpenCV)** pour l’IA, **PostgreSQL/PostGIS** pour les données relationnelles et spatiales, **S3** pour les fichiers, le tout dans une architecture **API-first** modulaire, conteneurisée, prête à monter en charge pour servir 50k utilisateurs et plus.

## 6. Structure de base de données (schéma principal & liens sémantiques)

Pour soutenir les fonctionnalités décrites, la base de données relationnelle sera au cœur du système. On décrit ici les principales **entités (tables)**, leurs champs essentiels et leurs relations. L’approche se veut **relationnelle enrichie de sémantique**, c’est-à-dire structurée mais avec la possibilité de lier nos données à des référentiels externes (Wikidata, etc.) pour interopérabilité.

**Principales tables envisagées :**

* **Utilisateur** (`utilisateur`): représente un membre inscrit.

  * *Champs:* `id` (PK), `pseudo`, `email`, `mot_de_passe_hash`, `bio`, `langue_principale`, `date_inscription`, etc.
  * *Relations:* Un utilisateur peut avoir plusieurs photos, annotations, etc. (relation 1-n vers autres tables).
  * *Remarque:* stocker aussi `role`/`statut` (ex: admin, modérateur, utilisateur standard) pour la gouvernance.

* **Photo** (`photo`): représente une image téléversée.

  * *Champs:* `id` (PK), `utilisateur_id` (FK vers Utilisateur, l’auteur de l’upload), `url` (chemin S3), `titre`, `description`, `date_upload`, `latitude`, `longitude`, `lieu_nom` (nom du lieu/ville si disponible), `validation_status` (statut de modération, ex: en attente, approuvé).
  * *Relations:* reliée à Utilisateur (auteur). Pour la géolocalisation, `POINT(latitude, longitude)` sera indexé via PostGIS.
  * *Remarque:* on pourrait découpler la notion de “Photo” brute et “Motif repéré” – mais dans notre modèle, chaque photo peut contenir plusieurs motifs via annotations, donc on garde photo distinct.

* **Annotation** (`annotation`): représente un bloc d’annotation sur une image.

  * *Champs:* `id` (PK), `photo_id` (FK vers Photo), `utilisateur_id` (FK vers Utilisateur ayant fait l’annotation), `motif_id` (FK optionnelle vers table Motif, si l’annotation identifie un motif précis de la base de connaissances), `texte` (contenu descriptif libre, multilingue potentiellement), `shape` (zone sur l’image, par ex. coordonnées JSON ou encodage type “x,y,width,height”), `date_annotation`.
  * *Relations:* appartient à une Photo; pointe éventuellement vers un Motif (si l’annotateur a lié à un motif existant ou créé).
  * *Remarque:* Cette table stocke le *contenu utilisateur* des annotations. On pourrait la normaliser plus (une table séparée pour les *tags* par ex.), mais on peut aussi mettre dans `texte` un mélange de description et de tags structurés (ou JSON). Mieux vaut ajouter une table Tag séparée.

* **Motif** (`motif`): c’est la table de **base de connaissances** des motifs/symboles en tant que *concepts* distincts des images. Par ex., il y aura une entrée “Triskèle” qui agrège toutes les annotations/images de triskèles.

  * *Champs:* `id` (PK), `nom` (peut être multilingue, donc on peut faire une table séparée motif\_traduction ou utiliser un type JSONB pour stocker noms en plusieurs langues), `description` (idem multilingue), `culture_principale` (FK vers table Culture par ex.), `periode` (FK ou champ texte pour période historique), `wikidata_id` (pour référence sémantique externe, ex: Q12345), `image_exemple` (FK optionnelle vers une Photo qui sert d’illustration principale), etc.
  * *Relations:* Ce qui lie Motif aux autres : une annotation peut pointer vers un motif (comme dit plus haut). On peut donc retrouver toutes les photos liées à un motif via join Annotation->Motif. Un motif peut appartenir à une culture ou plusieurs (relation motif-culture n-n, voir table Culture).
  * *Remarque:* Cette table est cruciale pour les filtres. Par exemple la table aura des champs comme `style` (ou une table Style n-n), etc., qui permettent de filtrer. On peut normaliser Culture, Style, Époque en tables séparées reliées par des tables de liaison, ou bien stocker des identifiants (ex: `culture_id` vers Culture). Une approche normalisée est préférable pour maintenir un référentiel cohérent.

* **Culture** (`culture`): table listant les cultures/aires culturelles.

  * *Champs:* `id`, `nom` (multilingue), éventuellement `region_geo` (aire géographique, ex: Europe, Asie du Sud-Est… si on veut hiérarchiser), `wikidata_id` (beaucoup de cultures ont des items Wikidata).
  * *Relations:* Un motif peut avoir un ou plusieurs cultures associées (certains motifs sont partagés par plusieurs cultures). Donc possiblement une table de jointure `motif_culture` (motif\_id, culture\_id).
  * *Remarque:* on peut commencer simple en assignant une culture principale par motif (champ direct), et plus tard permettre n-n.

* **Époque/Période** (`periode`): table pour les périodes historiques ou styles temporels (Antiquité, XVIe siècle, etc.).

  * *Champs:* `id`, `nom`, `annee_debut`, `annee_fin` (approx), type (par ex. “période” vs “mouvement artistique”).
  * *Relations:* Liée à motif (un motif peut avoir une période d’origine). Une table n-n n’est pas nécessaire si on décide qu’un motif a une période principale. Mais un motif trans-historique (ex: croix occitane utilisée du Moyen-Âge à nos jours) pourrait avoir plusieurs périodes d’influence, on restera simple pour l’instant.

* **Tag** (`tag`): pour les mots-clés libres (par ex “floral”, “animal”, “géométrique”).

  * *Champs:* `id`, `label` (nom du tag).
  * *Relations:* beaucoup-à-beaucoup avec Motif (un motif peut avoir plusieurs tags, ex: *floral* et *religieux*), et potentiellement aussi avec Photo indépendamment. Mais mieux vaut taguer au niveau motif, pour pas dupliquer. On aura une table `motif_tag` (motif\_id, tag\_id).
  * *Remarque:* on peut prévoir un champ type ou catégorie de tag pour les distinguer (ex: un tag de *forme* vs un tag de *thème*).

* **Contribution** (`contribution`): pour tracer toutes les actions effectuées (log d’activité, utile pour gamification/historique).

  * *Champs:* `id`, `utilisateur_id`, `type` (enum: upload\_photo, ajout\_annotation, validation\_annotation, etc.), `cible_type` (photo, annotation, motif…), `cible_id`, `points` (points gagnés pour cette action), `date`.
  * *Utilité:* servir de base au calcul des points, faire un historique utilisateur. Aussi pour la transparence (on peut lister toutes les contributions d’une personne).

* **Badge** (`badge`): liste des badges disponibles.

  * *Champs:* `id`, `nom`, `description`, `niveau` (bronze/argent/or par ex), `critere` (règle d’obtention, potentiellement une expression ou juste du texte).
  * *Relation:* `user_badge` table de jointure (utilisateur\_id, badge\_id, date\_obtention).

* **Défi/Concours** (`evenement`): pour les événements communautaires.

  * *Champs:* `id`, `type` (defi, concours, hackathon), `titre`, `description`, `date_debut`, `date_fin`, `parametres` (ex: thème du défi, cible de quantité, etc.), `statut` (en cours, terminé).
  * *Relations:* Peut avoir une relation avec les contributions (par ex: contributions marquées de l’ID de l’événement si faites pendant).
  * *Remarque:* la gestion peut aussi être plus algorithmique (on check la date et on filtre contributions sur période), mais table dédiée simplifie pour afficher l’historique d’événements.

* **Message/Commentaire** (`commentaire`): si on a des commentaires sur les images, ou messagerie.

  * *Champs:* `id`, `auteur_id`, soit `photo_id` ou `collection_id` etc selon où c’est attaché, `texte`, `date`.
  * *Relation:* vers utilisateur et vers l’entité commentée.
  * *Remarque:* pour MVP, les commentaires pourraient être limités, mais il est bien d’avoir la structure prête.

Cela fait déjà beaucoup, mais on peut démarrer avec les plus essentiels : Utilisateur, Photo, Annotation, Motif (et tables liées comme Culture, Tag) et graduellement étendre.

**Schéma relationnel simplifié :**

```
Utilisateur (1) --- (N) Photo --- (N) Annotation (N) --- (1) Motif --- (N) motif_tag (N) --- (1) Tag
                   |             |
                   |             -- (N) AnnotationValide (pour votes/upvotes) [optionnel]
                   |
                   -- (N) photo_tag (N) --- (1) Tag  [si on tag direct les photos aussi]

Motif --- (N) motif_culture (N) --- Culture
Motif --- (N) motif_periode (N) --- Periode   [ou champ direct periode_id dans Motif]

Utilisateur --- (N) contribution (N) --- [liée à Photo/Annotation etc via champs cible]
Utilisateur --- (N) user_badge (N) --- Badge

```

*(Le schéma ci-dessus indique les cardinalités principales. Par exemple, un Utilisateur a plusieurs Photos, chaque Photo peut avoir plusieurs Annotations, chaque Annotation peut référencer un Motif. Les tags et cultures lient plusieurs motifs.)*

**Liens sémantiques (type Wikidata) :**
Nous souhaitons que Symbolica ne soit pas une *silo* de données. Chaque concept de la base peut être lié à des identifiants externes pour enrichir le contexte et faciliter l’échange de données ouvertes :

* Le champ `wikidata_id` dans Motif permettra de faire le lien avec l’élément Wikidata correspondant si existant. Par ex., notre motif “Triskèle” pourrait être lié à *Q123456*. Ainsi, on pourrait à terme importer des données (descriptions multilingues, images d’archive) ou exporter vers Wikidata les informations nouvelles collectées.
* De même pour Culture (`wikidata_id`) et peut-être Période (`wikidata_id` si correspond à un item).
* On peut utiliser ces identifiants pour construire des **liens** vers Wikipedia (via Wikidata sitelinks) ou d’autres bases (Europeana, etc.).
* La structure de base devra être compatible avec une conversion éventuelle en **données liées (Linked Open Data)**. Par exemple, chaque Motif peut être vu comme une entité RDF de type “Concept” reliée à des “ConceptSchemes” (thésaurus de motifs). Sans aller trop loin ici, on garde en tête de ne pas enfermer la donnée dans des champs non réutilisables : d’où l’importance de normaliser cultures, périodes, etc., et d’utiliser des identifiants standards (ISO codes, Wikidata Qcodes, etc.) dès que possible.

**Évolutivité du schéma :**

* Prévoir des index sur les champs de recherche importants (texte des motifs, etc.) et sur les FK bien sûr pour performance.
* Prévoir la possibilité d’ajouter des champs supplémentaires sans trop de douleur (par ex: un champ `importance` sur motif, un champ `license` sur photo pour la licence de l’image).
* On pourra aussi ajouter une table pour les “collections” utilisateurs : `collection` (id, utilisateur\_id, titre) et une table `collection_item` (collection\_id, type\_entite, entite\_id, ordre) pour stocker les éléments (photos ou motifs) qu’un user a mis dans une collection.

En résumé, la base de données sera **relationnelle** avec une couche sémantique. Elle stockera proprement les informations afin de répondre aux besoins fonctionnels (rechercher par critère, afficher la carte, calculer les contributions…) tout en permettant de **tisser des liens externes** vers le web de données culturelles (exemple : un motif sur Symbolica pourra être aligné à un motif dans une base muséale via un identifiant partagé). Cette structuration soignée est essentielle pour bâtir un écosystème pérenne autour de Symbolica, où les données contribuent au bien commun du patrimoine (données qui, à terme, pourraient être partagées sous forme d’open data vers des projets comme Wikimedia Commons ou Europeana).

## 7. Charte graphique & direction artistique initiale

L’identité visuelle de Symbolica doit refléter ses valeurs : un projet à la fois **culturel, collaboratif et moderne**. La charte graphique servira de boussole pour concevoir l’UI et les communications (site web, réseaux sociaux, éventuels supports print). Voici les axes directeurs proposés :

* **Logo :** On imagine un logo symbolisant le concept de *“symbole”* de manière stylisée et universelle. Par exemple, un **logotype** combinant une forme géométrique emblématique et le nom *Symbolica*. Une idée pourrait être de jouer avec la lettre "S" de Symbolica pour en faire un entrelacs ou un motif celtique simplifié, indiquant par la même un symbole culturel. Une autre piste est un motif circulaire rappelant un mandala ou une rosace (représentant la pluralité des cultures se rejoignant). Le logo devra être utilisable en monochrome et en petite taille (favicon) – opter pour un design **simplifié, mémorable**. Couplé au nom “Symbolica” dans une typographie spécifique (voir typo).

* **Palette de couleurs :** Opter pour une palette évoquant la **richesse culturelle** tout en restant moderne. On peut combiner :

  * Une couleur principale chaude et accueillante, par ex. un **orange ambré** ou **ocre** rappelant les teintes de l’art ancien (pigments, terres) mais aussi l’énergie créative.
  * Une couleur secondaire contrastante plus froide, par ex. un **bleu nuit** ou **turquoise profond**, évoquant le numérique, l’exploration (ciel, mer sur une carte) et apportant du contraste.
  * Des couleurs d’accent pour les catégories : par exemple, on peut assigner une couleur par grande aire culturelle (sans tomber dans les stéréotypes mais pour donner un code visuel : ex. violet pour l’Orient, vert pour l’Europe, rouge pour l’Amérique latine, etc.) – ces couleurs pourraient être utilisées sur la carte ou les tags.
  * Veiller à l’**accessibilité** des contrastes (texte suffisamment lisible sur fond coloré, etc.). Un fond global plutôt clair (blanc cassé ou gris très pâle) pour un site aéré qui rappelle les pages d’un livre ou d’un musée, avec des touches de couleurs pour les éléments interactifs et visuels.

* **Typographie :** Choisir deux polices complémentaires :

  * Une **typographie sans-serif moderne** pour l’interface (boutons, menus, textes courants) – ex. *Roboto, Open Sans, Nunito Sans* (cette dernière a un aspect un peu arrondi et convivial), ou *Source Sans Pro*. Elle doit être très lisible à l’écran.
  * Pour les titres ou le logo, on peut introduire une **typo avec plus de caractère**, éventuellement avec une touche d’inspiration historique. Par exemple, une fonte sérif élégante rappelant les livres anciens, ou une fonte affichage qui a des glyphes un peu ornementés pour évoquer la culture. Attention à ne pas sacrifier la lisibilité, surtout que le site sera multilingue (il faut des fontes qui supportent les caractères spéciaux, diacritiques, éventuellement non-latin). Une alternative est d’utiliser la sans-serif partout pour la cohérence, et de styliser le logo séparément.
  * Bien sûr, utiliser des fontes libres (Google Fonts ou autres) pour rester dans l’esprit open source.

* **Style général UI :**

  * On vise un design **sobre, épuré et élégant**, afin de mettre en valeur les images de motifs (qui elles seront souvent riches visuellement). Un fond clair, des sections bien délimitées, pas d’éléments graphiques superflus. On peut s’inspirer de sites culturels contemporains ou de produits collaboratifs modernes.
  * Penser *“design système”* : définir à l’avance les composants UI communs (boutons, cartes, modales, badges, icônes, etc.) avec leurs styles. Par exemple, des boutons arrondis de couleur principale pour les actions importantes, des badges sous forme de petites pastilles colorées pour les catégories, etc.
  * Intégrer des **touches graphiques rappelant les motifs** : par ex, utiliser en filigrane ou en illustration de fond un motif vectoriel discret dérivé du logo ou d’un symbole typique (comme un motif géométrique transparent dans le header). Ces rappels ne doivent pas surcharger mais peuvent donner du caractère au site.
  * **Icônes :** Utiliser un jeu d’icônes cohérent (librairie open source d’icônes type Feather Icons ou FontAwesome) pour représenter les actions (upload, annotation, like, profil, etc.). Potentiellement créer des icônes custom pour certaines catégories de motifs ou sections, en style ligne claire.

* **Inspiration visuelle :** On peut prendre inspiration de **sites de musées** (qui équilibrent patrimoine et modernité), ou de **plateformes collaboratives** (simplicité efficace). Par exemple, le site de Google Arts & Culture propose une interface épurée mettant en avant les œuvres. Des plateformes comme DeviantArt ou Behance montrent aussi comment présenter des œuvres/images de manière attrayante, tout en offrant des interactions communautaires.

  * On peut également se référer à des **chartes graphiques existantes** de projets culturels open source. Par ex, le projet Wikimedia Commons (bien que très textuel) ou des sites comme Arches Project qui a sa propre identité. Cependant, il faut que Symbolica se démarque : plus coloré et chaleureux qu’un site institutionnel pur, car on a l’aspect ludique/gamification.

* **Logo favicon et variantes :** Prévoir le logo en différentes variantes (complète, icône seule, monochrome inversé pour fonds sombres). Favicon pour navigateur, icône mobile (si PWA).

* **Charte éditoriale liée :** Sur le plan éditorial, adopter un ton **accessible et passionné**. Ni trop académique, ni trop désinvolte. La charte graphique devra aller de pair avec ce ton : le design doit inviter tant le prof d’université que l’ado curieux. C’est un équilibre à trouver entre sérieux (fiabilité) et fun (créativité, jeu). Par ex, utiliser éventuellement de légères touches de fantaisie dans le design (illustrations stylisées de symboles en background, etc.) pour ne pas être austère.

Une fois validée, cette charte graphique servira de base pour créer une **bibliothèque de composants UI** (boutons, cartes, menus, etc.) garantissant l’uniformité visuelle. Elle guidera aussi le travail des contributeurs front-end et designers amenés à faire évoluer le site. Le tout doit rendre l’expérience Symbolica immédiatement reconnaissable et agréable, renforçant l’attractivité du projet dès le prototype.

## 8. Roadmap produit par phase

Le développement de Symbolica se fera par étapes successives, en itérant rapidement et en impliquant les utilisateurs tests à chaque phase. Voici la **feuille de route** prévisionnelle, découpée en phases avec les objectifs et périmètres associés :

* **Phase 0 : Prototype (P0)** – *Durée estimée : 1-2 mois*
  *Objectif :* Démontrer la faisabilité du concept sur un cas d’usage réduit, recueillir les premiers retours.
  *Périmètre :*

  * Mise en place d’un squelette d’application (front + back + base) avec authentification simple.
  * Permettre l’upload d’images et leur affichage.
  * Intégrer un tout premier jet de la carte interactive (par ex afficher juste l’emplacement des images uploadées sur un map).
  * Pas encore d’annotation sophistiquée : on peut simuler ce qui n’est pas implémenté (ex: mettre en légende textuelle ce que serait une annotation).
  * Pas d’IA intégrée encore, mais éventuellement un *proof of concept* offline montrant qu’on peut détecter un motif (par ex. un petit script séparé OpenCV qui détecte un motif simple, juste pour démonstration).
  * Ce prototype peut être montré à quelques experts ou partenaires potentiels pour valider l’idée et obtenir un soutien initial.

* **Phase 1 : Minimum Viable Product (MVP)** – *Durée : \~4-6 mois*
  *Objectif :* Lancer une version utilisable par un cercle restreint d’utilisateurs (bêta privée ou petit public) couvrant les **fonctionnalités de base**.
  *Périmètre :*

  * **Upload & géolocalisation** complets.
  * **Annotation manuelle** sur images opérationnelle (outil d’annotation avec au moins les rectangles, stockage et affichage).
  * **Profil utilisateur** basique (compte avec ses uploads listés).
  * **Carte interactive** avec marqueurs filtrables par catégorie simple (ex: par tag).
  * **Bilingue FR/EN** sur l’interface.
  * **Gamification légère** : comptage de contributions et affichage d’un score global sur le profil, sans forcément tous les badges dès cette phase (peut-être 2-3 badges simples pour tester le concept).
  * **Pas encore d’IA** ou alors très limitée (ex: usage d’une API existante pour tester la reconnaissance d’un motif simple, mais ce n’est pas primordial pour MVP).
  * **Design/charte** : UI fonctionnelle mais pas définitive – on peut utiliser un thème existant Bootstrap/Material au départ, en attendant d’affiner le design. Cependant, on aura le logo et la palette définis pour donner une identité minimale.
  * **Infrastructure** : déploiement sur un serveur test.
  * Collecte des premiers retours des bêta-testeurs (on peut inviter une communauté: étudiants en histoire de l’art, amis développeurs, etc. pour essuyer les plâtres).

* **Phase 2 : Alpha publique** – *Durée : 3 mois*
  *Objectif :* Ouvrir la plateforme à un public plus large (communauté en ligne, premiers partenaires) tout en considérant le statut “alpha” (instable).
  *Périmètre :*

  * **Stabilisation** des fonctions MVP (correction des bugs majeurs d’upload, annotation, etc.).
  * **Enrichissement** : ajouter la **base de connaissances Motifs** et permettre de lier les annotations à des motifs (introduire la table Motif et une page de consultation d’un motif avec sa description, ses images). Par exemple, lorsqu’une annotation est créée, on peut créer en même temps un motif de référence ou en sélectionner un existant.
  * **Reconnaissance IA (beta)** : intégrer un premier modèle de reconnaissance automatique sur quelques motifs simples pour tester en conditions réelles. L’interface proposera les suggestions de l’IA aux utilisateurs qui pourront les valider/infirmer.
  * **Gamification** : étendre le système de points et introduire quelques badges automatiques. Afficher un leaderboard (même simple).
  * **Charte graphique** : Affiner l’UI selon la charte (si ce n’est pas fait au MVP). Possiblement, travailler avec un designer pour améliorer l’ergonomie et l’esthétique.
  * **Documentation** : Commencer à documenter (FAQ utilisateur, guide de contribution, mention des licences open data).
  * Cette phase se conclut par une plateforme où on peut inviter par exemple \~100 utilisateurs actifs (y compris des experts) pour remplir un peu la base de motifs et s’assurer que tout est fonctionnel avant un lancement plus large.

* **Phase 3 : Bêta publique** – *Durée : 3 mois*
  *Objectif :* Lancement public officiel en version bêta (ouverte à tous), avec communication plus large. L’accent est mis sur la **scalabilité** et l’**engagement communautaire**.
  *Périmètre :*

  * **Optimisations performances** (caching, index, éventuellement mise en place d’un CDN pour images, etc.) pour supporter l’afflux d’utilisateurs (objectif de se rapprocher des 50k utilisateurs actifs).
  * **Moderation & qualité** : outils de modération communautaire (signalement de contenu, promotion de certains users en modérateurs), implémentation plus poussée du système de vote sur annotations et du calcul de karma.
  * **Multilingue++** : ajouter au moins une ou deux langues supplémentaires si la communauté bénévole le permet (espagnol, etc.), ou au minimum traduire plus de contenu statique. Veiller à l’expérience des non-francophones dans la contribution.
  * **Événements** : lancer le **premier défi officiel ou concours** sur la plateforme pour stimuler l’usage (par ex. concours de photo de motifs locaux, en partenariat avec un musée local).
  * **Génération IA (beta)** : intégrer le module de génération Stable Diffusion de manière expérimentale pour les utilisateurs curieux (peut-être d’abord réservé aux utilisateurs de niveau élevé pour limiter la charge). Observer l’usage et ajuster.
  * **Feedback loop** : mettre en place des sondages ou un forum de discussion pour recueillir les suggestions d’amélioration de la communauté durant la bêta.

* **Phase 4 : Version 1.0 (Lancement officiel)** – *Durée : 1-2 mois (après bêta)*
  *Objectif :* Considérer le produit comme suffisamment abouti pour sortir de “bêta” et communiquer comme une v1 stable.
  *Périmètre :*

  * **Corrections** de tous les bugs bloquants découverts en bêta.
  * **UI/UX** polie : application cohérente de la charte graphique, expérience utilisateur fluide (onboarding des nouveaux utilisateurs guidé, tutoriels d’annotation intégrés, etc.).
  * **Fonctionnalités complètes** : tous les modules de base mentionnés en section 4 devraient être présents en V1 (annotation, carte, profil, gamification, IA reconnaissance, IA génération, événements...). Si certains manquent, décider s’ils sont indispensables ou s’ils passent en backlog futur.
  * Préparation d’un **plan de communication** pour le lancement (communiqué de presse, évènements de lancement en partenariat avec institutions culturelles, etc.).
  * **Scalabilité** : déployer l’infra définitive (ex: passer sur des serveurs cloud auto-scalables si on était sur un petit VPS durant la bêta).
  * **Open Source publication** : s’assurer que le code est publiable (nettoyage, ajout d’un README, instructions d’install) et lancer le dépôt GitHub officiel en version 1.0 pour accueillir d’éventuels contributeurs développeurs du monde entier.

* **Phase 5 : Extensions futures et maintenance** – *Ongoing*
  Après la V1, le travail continue en mode amélioration continue, piloté par les retours de la communauté et les opportunités. Quelques pistes d’extensions futures déjà identifiées :

  * **Application mobile native** (iOS/Android) ou amélioration de la PWA pour profiter des capteurs (appareil photo pour uploads instantanés, géoloc en temps réel pour découvrir les motifs autour de soi via AR par ex).
  * **Réalité augmentée (AR)** : permettrait en pointant son smartphone sur un monument de voir les annotations Symbolica apparaître sur l’écran, ou de chasser des motifs via des indices géolocalisés, etc. Cela pourrait être un projet de hackathon.
  * **Intégration muséale** : offrir aux musées ou institutions un moyen d’intégrer un *widget* Symbolica sur leur site (montrant par ex les motifs de leurs collections et les contributions liées).
  * **Analyse de données** : Outils pour visualiser des statistiques (ex: carte chaleur des régions les plus contributrices, graphiques sur les types de motifs les plus communs, etc.), utile pour la recherche scientifique.
  * **Marketplace ou impression** : éventuellement, à très long terme, si la question du modèle économique se pose, imaginer un module où des designers pourraient vendre des designs de motifs inspirés (mais ça serait délicat vis-à-vis de l’esprit open, donc à réfléchir prudemment).
  * **Plus de langues** : atteindre 5, 10 langues selon les communautés volontaires.
  * **Réseau social** : améliorer les interactions (groupes d’intérêts, chat entre membres).
  * **Gouvernance outillée** : développer un module interne pour les votes de la communauté sur des décisions (voir section 9, gouvernance participative).

  Pendant cette phase longue, l’équipe devra aussi assurer la **maintenance** (corrections, mises à jour de sécurité, adaptation aux nouvelles versions de dépendances), et la **formation/transfert** si de nouveaux bénévoles ou équipes s’ajoutent (d’où l’importance d’une bonne documentation technique et fonctionnelle).

Chaque phase se termine idéalement par une **validation** avec les parties prenantes (utilisateurs, partenaires). La roadmap reste adaptable en fonction des retours : par exemple si on constate en bêta que l’IA de génération est très populaire, on peut prioriser des améliorations dessus plus tôt ; ou inversement si l’annotation est trop complexe pour les novices, retravailler l’UX en priorité.

Le calendrier précis dépendra des ressources (développeurs, budget). Il sera affiné en méthodologie agile, avec des sprints de réalisation. L’important est d’avoir dès le MVP une base qui fonctionne et d’ajouter ensuite couche par couche les fonctionnalités avancées, en s’assurant à chaque étape de la **cohérence d’ensemble**.

## 9. Enjeux communautaires, partenariats culturels & gouvernance associatif

Au-delà de la technique, la réussite de Symbolica repose sur sa **communauté** et son insertion dans l’écosystème culturel. Plusieurs enjeux doivent être adressés dès la conception du projet :

### Communauté & modération

* **Recrutement des contributeurs :** Atteindre 50 000 utilisateurs actifs nécessitera de mobiliser différents cercles. On visera d’abord les communautés existantes : amateurs d’histoire, d’art, étudiants en design, archéologues, etc. via forums, réseaux sociaux, événements (salons, conférences). La proposition de valeur communautaire (apprendre, échanger, gagner des badges) sera mise en avant.
* **Onboarding & rétention :** Soigner l’expérience des nouveaux utilisateurs (tutoriels interactifs sur comment ajouter une photo, comment annoter – possiblement une première mission guidée pour débloquer le badge “Premiers pas”). Puis maintenir l’engagement via newsletters, notifications pertinentes (ex: “quelqu’un a commenté votre annotation”, “nouveau défi lancé cette semaine”).
* **Modération participative :** Avec un grand nombre d’utilisateurs, il faut anticiper les **risques de dérive** (contenu hors-sujet, vandalisme, appropriation culturelle irrespectueuse, querelles éditoriales). On s’inspirera de modèles comme Wikipédia pour la gouvernance du contenu : tout le monde peut contribuer mais en cas de désaccord, discussion et consensus. Des **modérateurs** volontaires (utilisateurs de confiance avec haut karma) auront des outils pour éditer ou masquer du contenu problématique. Le système de vote/karma repérera les contributeurs fiables vs ceux dont les contributions sont souvent rejetées, ce qui aidera à cibler la modération.
* **Chartes et règles :** Dès l’inscription, l’utilisateur devra accepter une **charte de contribution** précisant les règles : respect d’autrui, pas de plagiat de contenu soumis, citer ses sources, respecter les cultures (par ex, ne pas poster un symbole sacré détourné offensivement). Des guides seront fournis (ex: si une communauté indigène demande que tel motif ne soit pas partagé publiquement, en tenir compte).
* **Reconnaissance de la communauté :** Valoriser les top contributeurs (page “Hall of Fame”), éventuellement instaurer un système de **mentor** où des membres expérimentés guident les nouveaux. Organiser de temps en temps des rencontres virtuelles (ou physiques si possible, ex: ateliers dans un fablab ou musée partenaire).

### Partenariats culturels & scientifiques

* **Institutions patrimoniales :** Nouer des partenariats avec des musées, archives, centres culturels. Par exemple,### Partenariats culturels & scientifiques

* **Institutions patrimoniales :** Nous chercherons des alliances avec des musées, archives et centres culturels. Par exemple, collaborer avec un musée national pour mettre en valeur certains motifs de ses collections sous forme de défis ou de contenus éditoriaux sur Symbolica. Ces institutions y gagnent une visibilité en ligne et une implication du public dans leurs collections (logique de crowdsourcing culturel évoquée par le Ministère de la Culture). Des organismes comme l’UNESCO (notamment pour le patrimoine culturel immatériel) ou des réseaux comme **Europeana** pourraient soutenir Symbolica en fournissant de la donnée ouverte (images, métadonnées) ou en co-organisant des campagnes contributives. Un partenariat avec **Wikimédia** (programmes GLAM) serait également stratégique : aligner nos motifs avec Wikidata, ou encourager des transferts d’images vers Wikimedia Commons, et vice-versa, pour enrichir mutuellement les plateformes.

* **Universités et laboratoires de recherche :** Le projet, à la croisée de la culture et de la tech, intéressera des chercheurs en histoire de l’art, en anthropologie mais aussi en vision par ordinateur, en sciences de l’information, etc. On pourra monter un comité scientifique incluant des universitaires pour valider le sérieux historique des contenus. Des laboratoires pourront utiliser Symbolica comme base de cas d’étude (par ex. tester de nouveaux algorithmes de reconnaissance de formes sur nos données annotées, ou étudier les dynamiques de collaboration dans la communauté). En retour, leurs retours amélioreront la plateforme (ex : conseils sur l’ontologie des motifs, ou contributions de thésaurus). Des étudiants pourraient être intégrés via des stages (informatique, design, médiation culturelle).

* **Communautés en ligne existantes :** Plutôt que de repartir de zéro, on se rapprochera de communautés déjà actives sur des thématiques connexes. Par exemple, les forums d’héraldique (fans de blasons), communautés d’**OpenStreetMap** (dont l’expérience en contribution géolocalisée et en gouvernance ouverte sera précieuse), groupes Facebook sur l’art roman, etc. L’idée est de les inviter à rejoindre Symbolica et à y trouver une extension de leur passion dans un cadre outillé et global.

* **Partenaires financement et sponsors :** Pour soutenir financièrement le projet (serveurs, développements, événements), l’association Symbolica pourra candidater à des **appels à projets** (ex : fonds pour le numérique culturel, subventions de la BnF, de la Commission Européenne – programme Europe Créative). Des fondations privées ou mécènes technologiques (par ex. fondation Wikimedia, fondation Mozilla, etc.) pourraient être approchés compte tenu du caractère open source et éducatif du projet. On veillera à une diversité de sources de financement pour préserver l’indépendance et éviter la capture par un acteur privé.

### Modèle de gouvernance associatif

Symbolica adoptera une **gouvernance ouverte de type associatif** (loi 1901 en France). L’idée est de gérer le projet comme un bien commun, dans la lignée de projets comme Wikipedia ou OpenStreetMap :

* **Création d’une association** : Dès le lancement public, on pourra formaliser l’Association *Symbolica*. Elle aura des statuts définissant sa mission (conforme à la vision et aux valeurs évoquées plus haut) et son fonctionnement démocratique. Les membres pourront être des individus (contributeurs actifs, mécènes) ou des personnes morales (partenaires institutionnels) souhaitant soutenir le projet.

* **Gouvernance interne** : L’association sera dirigée par un Conseil d’Administration élu par les membres, incluant idéalement des profils variés (ex : un historien d’art, un développeur open source, un représentant d’utilisateurs “grand public”, un partenaire musée). Ce conseil prendra les décisions stratégiques (orientations, budgets). Un bureau exécutif plus restreint (président, trésorier, secrétaire) gérera le quotidien administratif. La transparence sera de mise : comptes rendus publiés, finances transparentes, etc.

* **Rôle de la communauté** : On impliquera les contributeurs dans la gouvernance via des consultations en ligne, des groupes de travail ouverts. Par exemple, l’association pourrait organiser une assemblée générale annuelle où chacun (membre) peut voter sur les grandes orientations ou élire les représentants. Même en dehors de l’asso formelle, la **voix de la communauté** sera entendue dans les choix d’évolution du produit (via un système de vote des fonctionnalités souhaitées, ou un “council” consultatif d’utilisateurs actifs).

* **Cadre juridique & éthique** : L’association garantira que le projet reste non-lucratif et fidèle à ses valeurs d’ouverture. Le code restera libre (sous gouvernance de l’asso, avec une licence type MIT ou GPL), les contenus produits par la communauté seront placés sous licence ouverte (ex: CC-BY-SA pour les textes, éventuellement CC BY pour les données, et encourager CC0 pour les données structurées afin de maximiser la réutilisation – à discuter avec la communauté). L’association devra peut-être gérer la question des droits d’auteur des photos : inciter à ce que les contributions d’images soient sous licence ouverte (CC-BY ou CC0) pour l’open data, tout en respectant les contributeurs.

* **Expansion internationale** : Si la communauté grandit dans d’autres pays, on pourra envisager des antennes locales ou chapters de l’association (à l’image des chapitres Wikimedia) pour gérer les spécificités linguistiques ou juridiques locales, tout en gardant une coordination globale.

* **Évolution à long terme** : Le modèle associatif assure que, même si les initiateurs du projet se désengagent un jour, la communauté pourra reprendre le flambeau. Tout sera documenté (charte, code de conduite, etc.) pour permettre une passation. L’association, en tant qu’entité juridique, pourra signer des conventions avec des partenaires, recevoir des dons défiscalisés, et assurer la pérennité du projet au-delà des individus.

En somme, ces mesures visent à créer un **écosystème vertueux** autour de Symbolica, où communauté, experts et institutions œuvrent ensemble. La plateforme n’est pas qu’un site web, c’est un **mouvement collaboratif** pour la préservation et la réinvention des symboles culturels, et sa gouvernance ouverte en est le socle garant de confiance.

## 10. Scénarios d’usage concrets (par profil d’utilisateur)

Pour illustrer comment différents publics pourront tirer parti de Symbolica, voici quelques **scénarios d’utilisation** représentatifs :

* **Historien d’art (Jean, 45 ans)** : Jean est chercheur en histoire de l’art, spécialiste des motifs médiévaux. Il utilise Symbolica pour documenter finement un motif de gargouille qu’il a repéré sur plusieurs cathédrales. Après avoir uploadé ses propres photos de gargouilles, il annote les zones correspondantes et lie ces annotations au motif “Gargouille” dans la base de connaissances. Il ajoute dans la description du motif des informations historiques (signification, évolution au fil des siècles) et cite ses sources académiques. Grâce à la plateforme, il découvre via la carte qu’en dehors de la France, il existe des gargouilles similaires en Espagne et en Angleterre, ce qui l’intéresse pour une étude comparative. Il entre en contact sur Symbolica avec un autre membre, Maria, qui est historienne locale en Catalogne et avait contribué des photos. Ensemble, ils organisent un mini-projet sur la plateforme pour rassembler un corpus de gargouilles européennes. Symbolica lui facilite la tâche en centralisant ces contributions et en lui offrant un espace pour collaborer. À terme, Jean publie un article scientifique en s’appuyant sur les données collectées (qu’il peut exporter facilement puisque tout est en open data), et mentionne Symbolica comme outil collaboratif ayant permis sa recherche.

* **Curieux passionné (Alice, 28 ans)** : Alice n’est pas une experte, elle est développeuse web le jour, mais très curieuse des symboles ésotériques la nuit. En voyage à Prague, elle photographie une étrange marque alchimique sur la façade d’une vieille maison. Elle la poste sur Symbolica via l’appli mobile, en quelques clics. Immédiatement, l’IA lui suggère *“Symbole probable : Ouroboros (serpent qui se mord la queue)”*. Elle ne connaît pas, mais en lisant la fiche du motif Ouroboros sur Symbolica, elle apprend qu’il symbolise le cycle infini de la vie et qu’il apparaît dans de nombreuses cultures. Fascinée, elle valide l’identification et complète la description avec ce qu’elle a appris. Cela lui fait gagner des points de contribution. En explorant plus, Alice tombe de fil en aiguille sur d’autres motifs liés (le dragon, le phénix via les liens de symbolique cyclique). Elle utilise la fonction de génération IA pour s’amuser à créer un motif combinant un ouroboros et un style art déco, juste pour voir. Elle partage sa création dans sa collection personnelle intitulée “Inspirations ésotériques”, visible sur son profil. Quelques semaines plus tard, elle reçoit une notification : une autre utilisatrice a commenté sa photo de Prague en ajoutant qu’on retrouve ce symbole sur une autre maison de la ville, donnant lieu à un échange enrichissant. Alice apprécie comment Symbolica lui permet de **satisfaire sa curiosité**, d’apprendre des anecdotes culturelles, et de contribuer sans être une scientifique – le tout de manière ludique (elle est fière de son badge “Globe-trotter” obtenu après avoir uploadé des motifs de 3 pays différents).

* **Étudiant en design (Leo, 21 ans)** : Léo étudie le design graphique et doit créer un motif original pour un projet d’école, en s’inspirant d’un style traditionnel. Il vient sur Symbolica chercher des références visuelles de motifs Japonais **Seigaiha** (vagues bleues). En tapant “motif vague Japon”, il trouve une fiche motif avec plusieurs images. Il utilise le filtre par époque pour voir les motifs japonais Edo dans la base. Sur la plateforme, il découvre aussi des motifs d’autres cultures maritimes (motifs de vagues en Grèce antique, par ex.) qu’il n’aurait pas connus autrement. Il compile ses motifs préférés dans une collection privée. Ensuite, avec l’outil de génération IA, il essaye de fusionner le motif Seigaiha avec une palette de couleurs moderne – cela lui donne des idées qu’il exporte et retravaille dans Photoshop. En parallèle, Léo contribue à la plateforme en remerciement : comme il parle japonais, il propose une traduction en japonais de la fiche du motif Seigaiha sur Symbolica et y ajoute une anecdote historique apprise en cours. Ses professeurs, intrigués, voient d’un bon œil l’utilisation de Symbolica pour ses recherches, et envisagent même de faire contribuer toute la classe lors d’un workshop où les étudiants documenteraient chacun un motif de leur culture d’origine. Ainsi, Léo utilise Symbolica à la fois comme **base documentaire visuelle** et comme **espace de partage de connaissances** dans son milieu académique.

* **Professionnel de musée (Camille, 50 ans)** : Camille est chargée des publics dans un musée ethnographique. Elle voit dans Symbolica une opportunité d’**impliquer le public** de manière innovante. Le musée de Camille organise une exposition sur les “Motifs du monde” – elle s’associe avec Symbolica pour lancer un concours de contributions : les visiteurs sont invités à photographier des motifs de leur quotidien qui résonnent avec les œuvres du musée et à les poster sur Symbolica avec le tag de l’expo. Camille crée un **compte “Musée” vérifié** sur Symbolica et y upload des images d’œuvres des collections permanentes qui comportent des symboles (par ex. un tissu kente ghanéen à motif géométrique). Ces images officielles enrichissent la base Symbolica (sous licence ouverte, conformément à la politique Open Content du musée). Pendant l’expo, un écran interactif affiche la carte Symbolica filtrée sur les motifs de l’exposition, montrant en temps réel les contributions du public dans le monde. Les visiteurs jouent le jeu et ajoutent plein de motifs, fiers de contribuer à la recherche. À la fin, Camille organise avec l’équipe de Symbolica un événement en ligne où des experts commentent quelques contributions marquantes. Ce partenariat réussi donne des idées à d’autres institutions : Symbolica commence à être reconnu comme un outil participatif pour les musées souhaitant **connecter leurs collections avec le terrain et le numérique**.

* **Designer / Créatrice textile (Sofia, 34 ans)** : Sofia est designer textile freelance, toujours en quête d’inspiration pour ses motifs de tissus. Elle utilise Symbolica comme une **bibliothèque vivante de motifs**. Elle adore parcourir la plateforme par style visuel : grâce aux tags, elle filtre sur *“floral”* et *“art nouveau”* pour voir un panorama d’ornements Art Nouveau du monde entier. En quelques clics, elle trouve des motifs de grille de Gaudi à Barcelone, des imprimés de Mucha, etc., qu’elle enregistre en inspiration. Elle peut télécharger (dans la limite des licences) certaines images libres de droit pour les étudier de près – ou sinon elle suit les liens Wikidata fournis pour en savoir plus. Lorsqu’elle crée un nouveau motif pour une collection de mode, elle décide de le partager sur Symbolica dans son profil. Elle poste l’image de son motif original en expliquant qu’il est inspiré de motifs traditionnels Maori tout en incorporant des formes contemporaines. La communauté apprécie cette démarche et engage la discussion sur comment respecter l’héritage culturel dans la création moderne (conversation saine qu’elle modère avec l’aide de l’asso). Par la suite, une marque voit son motif sur Symbolica et la contacte pour une collaboration – preuve que sa participation lui a aussi donné de la visibilité. Pour Sofia, Symbolica est un **réseau créatif** qui lui permet d’explorer, de se faire connaître et de se ressourcer artistiquement en respectant les cultures.

---

**Conclusion :** Ce cahier des charges détaillé pose les bases de *Symbolica*, une plateforme open-source ambitieuse mêlant culture, collaboration et technologies de pointe. Toutes les spécifications ci-dessus (fonctionnelles et techniques) fournissent suffisamment d’éléments pour entamer la constitution d’un **backlog produit** clair (user stories dérivées des scénarios d’usage, tâches techniques correspondantes) et la création d’un **design système** conforme à la charte graphique. L’équipe de développement pourra s’appuyer sur ce document pour lancer la première itération du projet en ayant une vision globale cohérente, tandis que les partenaires et la communauté disposent d’une feuille de route transparente pour s’engager dans l’aventure Symbolica. Le défi est lancé pour donner vie à cet outil au service du patrimoine symbolique mondial !
