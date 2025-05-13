
# Symbolica – Cahier des charges fonctionnel et technique

## 1. Contexte du projet & justification du nom Symbolica

Symbolica est une initiative open-source qui naît du constat que les symboles et motifs culturels du monde entier méritent une plateforme dédiée à leur découverte et à leur partage. Dans un contexte où les musées numérisent leurs collections et où les communautés s'organisent en ligne pour documenter le patrimoine immatériel, il existe un besoin d'unifier ces efforts sur une plateforme collaborative unique. La France, riche de son patrimoine et de son écosystème culturel, servira de point de départ avant une ouverture rapide à l'international. Le choix du nom Symbolica s'appuie sur plusieurs justifications stratégiques :

- **Évocateur & universel** : Symbolica évoque l'univers des symboles et de la "symbolique" de manière immédiate. Le terme est compréhensible dans de nombreuses langues (proche de symbol, symbolique, etc.), ce qui facilite l'internationalisation.

- **Dimension culturelle et imaginaire** : Le suffixe "-ica" rappelle des mots comme encyclopædia ou Musica, conférant une tonalité à la fois encyclopédique (base de connaissances) et ludique (monde imaginaire). Symbolica suggère un "royaume des symboles", propice à la découverte et à l'exploration créative.

- **Stratégie de marque** : Le nom est court, mémorable, et sonne de façon harmonieuse. Il peut facilement être décliné en logo et supporte une identité visuelle forte. De plus, sa neutralité culturelle (n'appartenant à aucune langue spécifique) reflète l'objectif du projet de rassembler des cultures diverses sans parti pris.

En résumé, Symbolica se positionne comme la première plateforme open-source dédiée aux motifs et symboles culturels, où la technologie (IA, géolocalisation, open data) est mise au service d'une communauté mondiale passionnée de patrimoine. Ce cahier des charges décrit en détail la vision, les fonctionnalités et l'architecture prévues pour concrétiser ce projet ambitieux.

## 2. Vision à long terme & mission de la plateforme

**Vision (long terme)** : Symbolica aspire à devenir la référence mondiale en matière de collection et d'interprétation des symboles et motifs culturels. À long terme, la plateforme sera un musée numérique collaboratif planétaire, où chaque motif – qu'il s'agisse d'une frise architecturale antique, d'un symbole religieux, d'un motif textile traditionnel ou d'un graffiti contemporain – pourra être découvert, contextualisé et réinventé. La vision est d'éliminer les frontières entre les cultures via leurs symboles, en offrant un espace où un motif Celte peut côtoyer un symbole Africain ou un mandala Asiatique, créant ainsi un dialogue interculturel vivant et évolutif.

**Mission (court/moyen terme)** : La mission de Symbolica est d'outiller et fédérer une communauté de passionnés, d'experts et de curieux autour des symboles :

1. **Documenter** les motifs culturels (par la photo, l'annotation, les récits historiques) pour préserver cette richesse collective.

2. **Apprendre & échanger** : permettre aux utilisateurs d'enrichir leurs connaissances mutuellement (ex : un étudiant apprend d'un historien, un artiste s'inspire d'un motif ancien pour créer du neuf).

3. **Innover dans la création** : grâce à l'IA et aux outils numériques, faciliter la création de nouveaux designs inspirés du patrimoine, participant ainsi à la transmission vivante de ces symboles vers les nouvelles générations.

4. **Rayonner mondialement** dès le départ : même si le pilote est en France, la mission inclut l'internationalisation immédiate. Contenus bilingues (français/anglais) dès le lancement et ouverture à d'autres langues par la suite, partenariats avec des communautés à l'étranger, etc., pour refléter la vocation universelle du projet.

En somme, Symbolica se donne pour mission de connecter le passé et le futur, la tradition et l'innovation, via une plateforme où la communauté construit un patrimoine commun et le fait vivre au quotidien.

## 3. Valeurs fondamentales du projet

Le projet Symbolica est guidé par des valeurs fortes qui orienteront toutes ses décisions, du développement logiciel à la gestion de la communauté :

**Open Source & Open Data** : La plateforme sera développée de manière ouverte (code source publié sous licence libre) et adhérera aux principes d'open data pour les contenus. Cette philosophie garantit transparence, pérennité et partage. Tout un chacun pourra auditer, contribuer au code, ou réutiliser les données (par exemple via des API ou des exports sous licence libre). Cela s'inscrit dans le mouvement global où "du partage se crée la valeur".

**Collaboration & Communauté** : Au cœur de Symbolica se trouve l'idée de co-création. Chaque utilisateur, du néophyte au spécialiste, peut apporter sa pierre à l'édifice. La plateforme encouragera l'entraide, la bienveillance et le travail collaboratif. Les contenus (annotations, descriptions, identifications) seront modérés et améliorés par les pairs (modèle proche de Wikipédia ou d'autres plateformes contributives). La communauté sera impliquée dans l'évolution du projet, conformément à une approche "community-driven" où les utilisateurs peuvent même influencer les prochaines fonctionnalités.

**Culture partagée & diversité** : Symbolica célèbre la diversité culturelle. Chaque symbole est porteur d'une histoire, d'une identité. La plateforme valorisera toutes les cultures de manière équitable, en veillant à inclure des motifs d'origines variées (par ex. art islamique, arts pré-colombiens, symboles polynésiens, etc.). Le terme culture partagée signifie que l'on considère le patrimoine culturel comme un bien commun de l'humanité. Chacun est invité à découvrir et respecter le patrimoine de l'autre. Aucune appropriation culturelle abusive ne sera tolérée : au contraire, nous travaillerons en concertation avec les communautés concernées, notamment pour les motifs sensibles ou sacrés, afin de toujours les présenter de manière respectueuse et avec le contexte approprié.

**Éducation & Transmission** : La plateforme a une vocation pédagogique. Nous valorisons le savoir libre et la transmission intergénérationnelle. Symbolica pourra servir d'outil éducatif (pour des cours d'histoire de l'art, d'anthropologie visuelle, etc.), avec un contenu vulgarisé à destination du grand public mais aussi des ressources pointues pour les chercheurs. L'important est de rendre accessible un domaine parfois réservé aux experts (symbologie, iconographie) et d'encourager la curiosité intellectuelle.

**Innovation & Créativité** : Enfin, Symbolica marie la tradition et l'innovation. Être open source ne signifie pas être figé dans le passé : au contraire, nous prônons l'innovation ouverte. L'utilisation de l'IA pour reconnaître des motifs ou en générer de nouveaux est au service de la créativité humaine. La valeur d'innovation se reflète dans notre stack technologique moderne et dans la volonté d'explorer de nouvelles approches pour valoriser la culture (ex : réalité augmentée à terme, visualisations interactives, etc.). Nous croyons que la technologie, bien employée, peut amplifier l'impact de la culture.

En synthèse, ces valeurs (ouverture, collaboration, partage culturel, éducation, innovation) formeront la charte éthique de Symbolica. Elles devront transparaître tant dans l'expérience utilisateur (UX) que dans la gouvernance du projet et ses choix techniques.

## 4. Architecture fonctionnelle de la plateforme

L'architecture fonctionnelle décrit les grands modules et fonctionnalités que Symbolica offrira à ses utilisateurs. La plateforme combinera des fonctionnalités classiques de réseaux collaboratifs (profil, contributions, fil d'actualité) avec des outils spécialisés (annotation d'images, carte interactive, IA de reconnaissance et génération). Ci-dessous, nous détaillons chaque composant clé :

### 4.1. Upload & géolocalisation de photos

**Description** : Les utilisateurs pourront téléverser des photos de symboles ou motifs qu'ils rencontrent (sur un monument, un objet d'art, une affiche, etc.). Chaque upload comprendra la possibilité d'indiquer où la photo a été prise. La géolocalisation se fera soit automatiquement (si les métadonnées GPS de l'image sont présentes), soit via une interface de carte où l'utilisateur clique pour placer un marqueur. Des champs de métadonnées accompagnent l'upload : titre de la photo, description libre, date (éventuellement importée des EXIF), culture ou origine supposée du motif, etc.

**Objectifs** : Constituer une base de données participative d'images géoréférencées de motifs culturels. La localisation ajoute une dimension essentielle : elle permet de cartographier la diffusion des motifs (ex: un motif "triskèle celtique" apparaîtra sur la carte en Bretagne mais aussi ailleurs via la diaspora Celte, etc.). Cela ouvre la porte à des analyses géographiques et historiques.

**Spécifications** :
- Un formulaire d'upload intuitif (drag & drop) avec prévisualisation de l'image. Possibilité de charger depuis un mobile (progressive web app ou application native ultérieurement).
- La géolocalisation utilisera un fond de carte (OpenStreetMap via Leaflet ou Mapbox) pour sélectionner le lieu. Stockage en base de la coordonnée GPS (latitude/longitude) et éventuellement d'une adresse ou toponyme (via reverse geocoding).
- Support de divers formats d'image (JPEG, PNG, etc.) et compression côté serveur pour optimiser le stockage. Les images originales seront stockées sur un service type S3 (voir stack) et des vignettes générées pour l'affichage web.
- Contraintes : modération des contenus à l'upload (filtre contre images inappropriées via un outil automatique, + validation communautaire si nécessaire). Limite de taille (p.ex. 20MB par image) pour assurer une performance stable.
- Évolution prévue : à terme, permettre aussi l'upload de modèles 3D ou scans (pour motifs en bas-relief, objets, etc.) et leur localisation.

### 4.2. Annotation participative avec zones cliquables sur images

**Description** : Une fois une photo publiée, la communauté peut y annoter les motifs visibles. L'annotation se fait via une interface d'édition d'image : l'utilisateur peut dessiner une zone cliquable (par exemple un rectangle ou un polygone) autour d'un motif particulier dans l'image, puis y associer une information. Cette information peut être :
- Une identification du motif (nom, description, éventuellement lien vers une fiche de motif s'il existe déjà dans la base de connaissances).
- Des tags ou catégories (ex : #animal, #art-déco, #religieux).
- Des références ou une explication contextuelle (ex : "Ce motif est un motif floral fréquent dans l'art roman du XIIe siècle.").

Plusieurs annotations peuvent être placées sur la même image, si celle-ci contient plusieurs motifs d'intérêt.

**Objectifs** : Permettre l'enrichissement collaboratif de l'image brute par de la connaissance. Là où l'image seule montre, l'annotation explique. Ce mécanisme est central pour construire une base de savoir sur les symboles. L'approche participative offre une intelligence collective : un historien identifie un motif, un utilisateur local ajoute le nom vernaculaire, un autre ajoute un lien Wikipédia, etc.

**Spécifications** :
- Outil d'annotation ergonomique sur le front-end (on pourra intégrer une librairie existante comme Annotorious ou développer un module custom Canvas/JS). Il doit permettre de créer au moins des bounding boxes (rectangles) sur l'image, voire des polygones libres pour épouser des formes complexes.
- Chaque annotation (zone) est liée en base à une entité "Annotation" comportant : référence de l'image, coordonnées de la zone (par ex. en pourcentage de x/y ou format JSON), texte de l'annotation, références éventuelles, auteur de l'annotation, date.
- Les annotations seront cliquables au survol de l'image : l'utilisateur naviguant voit les zones soulignées/translucides et en cliquant obtient les détails (popup ou panneau latéral).
- Système de versionning/modération des annotations : étant donné qu'il s'agit d'un wiki d'annotations en quelque sorte, il sera possible de suggérer une correction, ou de valider/invalider une annotation. Un utilisateur peut par exemple voter pour dire "cette identification est correcte" ou au contraire signaler une erreur. Un mécanisme de vote et de karma lié (voir gamification) aidera à fiabiliser le contenu.
- Liens vers base de connaissances : idéalement, l'annotation pourra lier le motif à une fiche dédiée. Si l'annotateur ne trouve pas le motif dans la base existante, il peut proposer la création d'une nouvelle entrée.
- Accessibilité : veiller à ce que l'annotation soit utilisable via clavier et lecteur d'écran (normes W3C si possible).

### 4.3. Reconnaissance automatique de motifs (IA + apprentissage collaboratif)

**Description** : Symbolica intégrera un système de reconnaissance d'image par IA afin de détecter automatiquement les motifs connus dans les photos uploadées. Concrètement, lorsqu'un utilisateur charge une image, l'IA va analyser celle-ci et proposer éventuellement : "Ce motif semble être un X (confiance 80%)". Cette reconnaissance se base sur un modèle de vision entraîné sur un corpus de motifs. En complément, la plateforme apprend en continu grâce aux retours des utilisateurs : chaque confirmation ou infirmation des suggestions de l'IA améliore le modèle (apprentissage supervisé continu ou récolte de données pour re-entraînement périodique).

**Objectifs** :
- Faciliter la contribution : un non-expert qui charge une photo pourrait bénéficier de l'aide de l'IA pour nommer le motif. Cela réduit la barrière à la participation.
- Accélérer l'indexation : avec potentiellement des milliers d'images, l'IA aide à pré-classer et taguer les contenus, que la communauté n'a plus qu'à valider.
- Valoriser la donnée : plus tard, une IA performante peut permettre à un visiteur de chercher "motif type rosace gothique" et de retrouver toutes les images correspondantes automatiquement.

**Spécifications** :
- Utilisation d'algorithmes de vision par ordinateur. Deux approches complémentaires peuvent être envisagées:
  - Un modèle de classification/détection entraîné spécifiquement (par ex. un CNN détectant une liste de motifs prédéfinis).
  - Un modèle de recherche par similarité (embeddings d'images pour trouver des similitudes).
- Pipeline d'analyse à l'upload : dès qu'une image est postée, un service backend la traite. Les résultats sont renvoyés et stockés comme "annotations suggérées par IA".
- Interface UX : l'utilisateur voit, après upload, un message du type « L'IA pense que cette image contient peut-être un dragon celte. Confirmez-vous ? »
- Apprentissage collaboratif : toutes les images confirmées alimentent un dataset d'entraînement pour améliorer continuellement le modèle.
- Technologies IA : PyTorch sera privilégié. OpenCV peut aider pour des tâches de pré-traitement.
- Performances : le modèle doit répondre en temps raisonnable (quelques secondes).

### 4.4. Carte interactive & navigation par filtres (culture, époque, pays, style)

**Description** : Une fonctionnalité phare sera une carte du monde interactive où sont positionnés tous les motifs collectés. Chaque photo/motif géolocalisé apparaît sous forme de point (avec clustering visuel si trop de points proches). L'utilisateur peut zoomer/dézoomer, et surtout filtrer l'affichage selon des critères culturels ou thématiques. Par exemple : afficher uniquement les motifs de la période Renaissance, ou les motifs appartenant à la culture Maori, ou encore les motifs de type "animaliers". Une couche temporelle pourrait permettre de faire glisser une frise chronologique pour voir l'apparition/disparition de motifs à travers le temps.

**Objectifs** : La carte permet une exploration géographique intuitive du contenu. C'est un outil d'analyse puissant pour repérer des concentrations de symboles, ou au contraire suivre des itinéraires culturels. Les filtres offrent une navigation thématique croisée: l'utilisateur peut explorer par culture, par époque, par type de motif, ou combiner ces critères.

**Spécifications** :
- Basée sur un fond de carte mondial (OpenStreetMap ou autre open data). Intégration via un composant type LeafletJS ou Mapbox GL JS.
- Points dynamiques : chargés depuis la base via API. Utilisation de PostGIS côté base pour effectuer des requêtes spatiales.
- Clustering : algorithme de clustering pour agréger les motifs proches quand zoom out, évitant une sur-saturation.
- Clic sur un point : affiche un aperçu (thumbnail de la photo, nom du motif si connu).
- Filtres multicritères : interface UI avec plusieurs facettes (Culture/Origine, Époque/Période, Pays, Style/Type).
- Timeline (optionnel MVP) : slider chronologique pour filtrer par date de création du motif.
- Performances & UX : doit rester fluide malgré potentiellement des dizaines de milliers de points.
- Multilingue : les libellés sur la carte (noms de pays, etc.) seront dans la langue de l'interface.
- Mobile : La carte devra être utilisable sur mobile (zoom tactile, etc.).

### 4.5. Système de gamification (niveaux, badges, contributions)

**Description** : Pour encourager la participation, Symbolica mettra en place un système ludique de gamification. Chaque action utile de l'utilisateur lui rapporte des points d'expérience ou des "contributions". En accumulant ces points, l'utilisateur progresse en niveau. Parallèlement, des badges distinctifs pourront être obtenus en accomplissant certains jalons ou actions spécifiques.

**Exemples de gamification** :
- Un utilisateur gagne +5 points par photo uploadée, +2 par annotation ajoutée, +1 par vote de validation, etc.
- Des badges tels que "Explorateur" (avoir géolocalisé des motifs dans au moins 5 pays différents), "Conservateur" (10 motifs rares documentés), "Mentor" (avoir reçu 50 upvotes sur ses annotations)...
- Un classement hebdomadaire des contributeurs les plus actifs peut être affiché.

**Objectifs** : Motiver et fidéliser les utilisateurs en rendant l'expérience contributive plus ludique et gratifiante. La gamification doit créer un cercle vertueux : plus on contribue, plus on gagne en reconnaissance dans la communauté, ce qui incite à contribuer davantage.

**Spécifications** :
- Points & niveaux : Table de scoring avec une formule de niveau définie.
- Badges : Liste de badges avec critères, système vérifiant si un badge est débloqué après chaque action.
- Profil utilisateur enrichi : Afficher clairement les badges obtenus et le niveau sur la page de profil.
- Peer review et réputation : Système de karma basé sur les votes des pairs pour mesurer la qualité des contributions.
- Interface : Dashboard de gamification accessible, montrant l'historique des points et les prochains objectifs.
- Notifications : Alertes pour chaque gain important (niveau up, badge obtenu).
- Équilibre : Système calibré pour rester motivant sur le long terme sans encourager le spam.

### 4.6. Défis, concours, hackathons en ligne

**Description** : Au-delà des contributions quotidiennes, Symbolica organisera périodiquement des événements communautaires en ligne pour dynamiser l'activité et attirer de nouveaux publics. Il y a plusieurs formats possibles :
- Défis thématiques (par ex. "Défi de la semaine : les animaux mythiques")
- Concours créatifs (par ex. concours de création de motif via l'IA Stable Diffusion)
- Hackathons en ligne (orientés développeurs / data)

**Objectifs** : Ces événements servent à animer la communauté et à la faire grandir. Un défi thématique peut ramener de l'attention médiatique. Un hackathon attire des contributeurs techniques. Les concours créatifs positionnent Symbolica comme un laboratoire d'innovation culturelle.

**Spécifications** :
- Module de gestion d'événements : interface admin pour créer un événement avec une page dédiée.
- Pour les défis : compteur de contributions liées et listing des top contributeurs.
- Pour les concours : système de soumission puis vote de la communauté.
- Pour les hackathons : intégration avec un forum ou chat pour les échanges.
- Récompenses : distinctions sur la plateforme (badges spéciaux exclusifs).
- Calendrier : définir un rythme (par ex. un petit défi bimensuel, un concours créatif trimestriel, un hackathon annuel).

### 4.7. Génération assistée de motifs via IA créative (Stable Diffusion)

**Description** : Symbolica incorporera un outil de génération d'images par IA pour permettre aux utilisateurs de créer de nouveaux motifs inspirés de ceux de la base. En utilisant un modèle de type Stable Diffusion, l'utilisateur pourra entrer une description textuelle (par exemple "générer un motif floral dans le style Art Nouveau avec des éléments celtiques") et l'IA produira une ou plusieurs images correspondantes. Il pourra également être possible de partir d'un motif existant pour générer des variantes.

**Objectifs** :
- Stimuler la créativité et la réutilisation des patrimoines iconographiques.
- Attirer un public créatif qui n'est pas forcément intéressé par l'aspect encyclopédique.
- Enrichir la base : les meilleurs motifs générés pourraient être ajoutés à la collection.

**Spécifications** :
- L'IA utilisée sera Stable Diffusion ou un dérivé fine-tuné.
- Infrastructure : serveur dédié pour la génération d'image (GPU nécessaire).
- Interface : module "Atelier" ou "Laboratoire créatif" avec champ texte pour le prompt.
- Fonctionnalités avancées : Image-to-image, styles pré-entraînés, génération tuileable.
- Modération et éthique : garde-fous pour éviter les usages abusifs.
- Stockage des créations : galerie personnelle et partage possible.
- Performances : système de crédits ou limites pour gérer les ressources.

### 4.8. Profil utilisateur riche & page collection / "musée" personnel

**Description** : Chaque inscrit disposera d'un profil utilisateur détaillé ainsi que d'un espace personnel pour organiser ses trouvailles ou créations. Le profil comportera les informations classiques (pseudo, avatar, bio, localisation, langues parlées, centres d'intérêt culturels…) et des indicateurs publics de contribution. Chaque utilisateur aura la possibilité de constituer sa collection personnelle de motifs, comme un musée virtuel.

**Objectifs** :
- Valoriser le contributeur : mettre en avant son investissement pour le motiver.
- Personnalisation & appropriation : donner à l'utilisateur un sentiment d'engagement.
- Réseau social thématique : tisser un réseau de passionnés via les profils.

**Spécifications** :
- Page de profil avec URL dédiée, montrant avatar, pseudo, bio, localisation, langues.
- Stats de contributions : nombre de photos uploadées, annotations faites, badges obtenus.
- Collections : possibilité de créer des collections thématiques de motifs.
- Musée personnel : présentation immersive des collections (diaporama, carte).
- Interactions sociales : suivre un utilisateur, aimer/commenter une collection.
- Paramètres de confidentialité : contrôle de ce qui est public sur le profil.
- Modération : outils admin pour la gestion des profils.
- Internationalisation : support multilingue des profils.

### 4.9. Multilingue dès le départ (français, anglais)

**Description** : La plateforme sera conçue nativement pour le multilinguisme. L'interface utilisateur sera disponible au lancement en français et en anglais, et dès la première version l'architecture supportera l'ajout d'autres langues sans refonte majeure.

**Objectifs** :
- Toucher immédiatement un public international (francophone et anglophone).
- Éviter de "verrouiller" le projet dans une langue source.
- Permettre la croissance organique de communautés linguistiques.

**Spécifications** :
- Interface localisée : utilisation de frameworks de traduction.
- Détection de la langue du navigateur pour choisir la locale par défaut.
- Contenu multilingue : champs traduits pour les fiches de motifs.
- Traduction communautaire : système permettant aux utilisateurs de traduire le contenu.
- Filtrage par langue : options de préférence d'affichage des contenus.
- Documentation et support : disponibles en français et anglais.
- Évolutivité : architecture permettant l'ajout facile de nouvelles langues.

## 5. Stack technologique recommandée (modulaire & scalable)

Pour réaliser ces fonctionnalités, nous préconisons une stack technologique moderne qui assure performance, évolutivité et maintenabilité. Voici les choix recommandés pour chaque couche, en soulignant les alternatives possibles :

### Front-end (client)
React est recommandé, idéalement avec le framework Next.js. Next.js permettra le rendu côté serveur (SSR) des pages pour un SEO optimisé (utile si on veut que les pages de motifs soient bien indexées par Google) et de bonnes performances initiales. De plus, Next.js gère nativement l'internationalisation et offre la possibilité d'héberger des API routes si nécessaire. Le front-end sera une application web responsive (mobile-first design) pour toucher autant les utilisateurs desktop que mobiles dès le lancement.

Pourquoi React ? Large communauté, nombreux composants existants (par ex. librairies d'annotation d'images, cartes interactives via React-Leaflet, etc.), facilitant le développement. C'est également en phase avec une architecture API-first (React consommant des APIs REST/GraphQL).

On utilisera TypeScript pour fiabiliser le code front, et des outils comme Redux ou React Query pour la gestion d'état/caching des données selon les besoins.

### Back-end (serveur applicatif)
Deux options viables ont été identifiées : Node.js (JavaScript/TypeScript) ou Django (Python). Chacune a ses avantages, mais voici la recommandation :

Opter pour Node.js avec un framework type Express ou NestJS. Cela permet d'avoir un même langage (JS/TS) côté front et back, ce qui peut faciliter le partage de modèles de données, et bénéficier de la haute performance de Node pour les requêtes I/O (utile pour servir l'API, uploader des fichiers, etc.). NestJS en particulier offre une structure modulaire et intègre TypeScript, ce qui aide à construire une API maintenable (avec des modules pour utilisateurs, motifs, etc.).

Alternativement, Django (Python) est très pertinent pour sa maturité, son ORM puissant et ses modules intégrés (admin auto-généré, gestion auth, i18n). De plus, Python serait nécessaire pour la partie IA (reconnaissance de motif, stable diffusion). Une approche hybride pourrait être adoptée : Django ou FastAPI pour les endpoints liés à l'IA et aux tâches de fond, et Node/Next pour servir le front.

### API
Quoi qu'il en soit, le backend exposera une API (REST JSON, ou GraphQL si on veut plus de flexibilité dans les requêtes du front, GraphQL pouvant être pratique pour récupérer par ex une image avec ses annotations et motifs liés en une seule requête). Initialement, une API REST RESTful suffira (avec endpoints pour /users, /photos, /motifs, etc.).

### Base de données
PostgreSQL est un choix solide, accompagné de son extension PostGIS pour la gestion des données géospatiales. PostgreSQL est robuste et open source, adapté à nos données relationnelles (utilisateurs, contributions, etc.), et PostGIS nous donne les types geometry et les index spatiaux pour effectuer des requêtes performantes sur les coordonnées (ex: trouver tous les motifs dans un rayon de X km, requête pour la carte etc.). De plus, Postgres peut servir pour stocker des JSON (utile pour stocker les shapes d'annotation si on veut, ou d'autres métadonnées flexibles) et permet d'utiliser des vues matérialisées ou des fonctions pour des besoins avancés (agrégations de contributions, etc.).

### Stockage de fichiers
Pour les photos uploadées et images générées, on évitera de stocker en base de données (inefficace pour les blobs binaires). On préconise un stockage objet type S3 (Amazon S3 ou une alternative open-source comme MinIO si on auto-héberge). Cela permet un stockage scalable, avec distribution via CDN potentielle si la charge augmente (50k utilisateurs pouvant générer beaucoup de trafic image). Chaque fichier image aura un URL sécurisé. Les backups et la durabilité sont gérés par le fournisseur (S3 standard propose 99.999999999% de durabilité).

### Recherche plein-texte
Si on souhaite une recherche puissante (par nom de motif, description, etc.), on pourrait intégrer ElasticSearch ou OpenSearch. Cependant, Postgres offre déjà des capacités de recherche texte (Full Text Search avec des index GIN sur des colonnes TSVECTOR). Pour le MVP, on peut s'en tenir à Postgres FTS pour éviter la complexité d'un cluster Elastic de plus. Si la base de connaissances grossit et qu'on veut suggérer des contenus par pertinence sémantique, ElasticSearch pourrait être ajouté en module (par ex. pour permettre des recherches plus complexes, ou une autocomplétion rapide).

### Composante IA
Pour la reconnaissance de motifs et la génération IA, le choix est clairement Python (librairies PyTorch, OpenCV, etc.). On aura donc une partie du back en Python, soit intégrée au même service (si on part sur Django, c'est naturel), soit en microservice séparé.

Microservice IA : Par exemple, un service Python (FastAPI ou Flask) qui expose des endpoints internes du type /predict_motif (qui reçoit une image ou un ID d'image et retourne les prédictions) et /generate_image (qui reçoit un prompt et renvoie une image générée). Le front ou le back principal appelle ces services en interne. Cela permet de scaler indépendamment la partie IA (qui demande du GPU).

OpenCV sera utilisé pour certains traitements (détection de contours pour aider l'annotation auto, etc.). PyTorch pour entraîner/faire tourner nos modèles (classifieurs de motif, Stable Diffusion via Diffusers lib).

### Serveur & déploiement
Prévoir une architecture modulable. En phase initiale, tout peut tenir sur un même serveur (web + bdd + service IA si faible charge). Mais on vise 50k utilisateurs actifs, il faudra probablement séparer les rôles :
- Serveur web principal (Node ou Django) – scalable horizontalement
- Serveur(s) de base de données – possiblement un master et un read-replica
- Serveur de fichiers (S3 externalisé, ou un NAS si local).
- Serveur IA avec GPU – pour reconnaissance et génération

Utilisation de Docker/Kubernetes est conseillée à terme pour orchestrer tout ça, surtout si on déploie sur cloud. Mais pour le MVP, Docker Compose suffira pour packager les services (web, db, etc.) facilement.

### Évolutivité (scalabilité)
La stack proposée est choisie pour monter en charge facilement. Next.js/Node supporte un grand nombre de requêtes non-bloquantes. PostgreSQL gère bien des millions d'enregistrements (avec index appropriés). S3 peut absorber de très hauts volumes. En cas de succès au-delà de 50k utilisateurs, on pourrait migrer le backend vers une architecture microservices plus poussée et utiliser Kubernetes pour auto-scaling. Également, mettre en cache certains contenus statiques ou très lus via un CDN ou un cache HTTP (Varnish, Cloudflare) pour soulager le serveur.

### Sécurité & Authentification
Utilisation de JWT pour les API (si SPA séparée) ou des sessions sécurisées (si SSR). Stockage des mots de passe hashés (bcrypt). Protection contre les classiques (SQL injection gérée par ORM, rate limiting sur les endpoints sensibles pour éviter spam, captcha pour bot si inscriptions massives, etc.). Le caractère open source du projet impose d'être vigilant sur la sécurisation (code revu par la communauté, corrections rapides).

### Tests & CI
Mettre en place des tests unitaires (Jest pour front/Node, PyTest pour Python) et potentiellement des tests d'intégration. Un pipeline CI (GitHub Actions par ex) pour lancer les tests et déployer sur un environnement de staging, puis production.

En résumé, la stack technique centrale serait : Next.js (React) pour le front, Node.js/Express ou NestJS pour l'API, Python (PyTorch, OpenCV) pour l'IA, PostgreSQL/PostGIS pour les données relationnelles et spatiales, S3 pour les fichiers, le tout dans une architecture API-first modulaire, conteneurisée, prête à monter en charge pour servir 50k utilisateurs et plus.

## 6. Structure de base de données (schéma principal & liens sémantiques)

Pour soutenir les fonctionnalités décrites, la base de données relationnelle sera au cœur du système. On décrit ici les principales entités (tables), leurs champs essentiels et leurs relations. L'approche se veut relationnelle enrichie de sémantique, c'est-à-dire structurée mais avec la possibilité de lier nos données à des référentiels externes (Wikidata, etc.) pour interopérabilité.

### Principales tables envisagées :

#### Utilisateur (utilisateur)
- **Champs**: id (PK), pseudo, email, mot_de_passe_hash, bio, langue_principale, date_inscription, etc.
- **Relations**: Un utilisateur peut avoir plusieurs photos, annotations, etc. (relation 1-n vers autres tables).
- **Remarque**: stocker aussi role/statut (ex: admin, modérateur, utilisateur standard) pour la gouvernance.

#### Photo (photo)
- **Champs**: id (PK), utilisateur_id (FK vers Utilisateur), url (chemin S3), titre, description, date_upload, latitude, longitude, lieu_nom, validation_status.
- **Relations**: reliée à Utilisateur (auteur). Pour la géolocalisation, POINT(latitude, longitude) sera indexé via PostGIS.
- **Remarque**: chaque photo peut contenir plusieurs motifs via annotations.

#### Annotation (annotation)
- **Champs**: id (PK), photo_id (FK vers Photo), utilisateur_id (FK vers Utilisateur), motif_id (FK optionnelle vers Motif), texte, shape (coordonnées de zone), date_annotation.
- **Relations**: appartient à une Photo; pointe éventuellement vers un Motif.
- **Remarque**: stocke le contenu utilisateur des annotations.

#### Motif (motif)
- **Champs**: id (PK), nom (multilingue), description, culture_principale (FK), periode, wikidata_id, image_exemple, etc.
- **Relations**: Une annotation peut pointer vers un motif. Un motif peut appartenir à une ou plusieurs cultures.
- **Remarque**: Cruciale pour les filtres (style, culture, époque).

#### Culture (culture)
- **Champs**: id, nom (multilingue), region_geo, wikidata_id.
- **Relations**: Un motif peut avoir une ou plusieurs cultures associées.
- **Remarque**: On peut commencer simple avec une culture principale par motif.

#### Époque/Période (periode)
- **Champs**: id, nom, annee_debut, annee_fin, type.
- **Relations**: Liée à motif (un motif peut avoir une période d'origine).
- **Remarque**: Simplifié initialement, peut être enrichi plus tard.

#### Tag (tag)
- **Champs**: id, label (nom du tag).
- **Relations**: beaucoup-à-beaucoup avec Motif via table motif_tag.
- **Remarque**: Peut avoir un champ type pour distinguer différentes catégories de tags.

#### Contribution (contribution)
- **Champs**: id, utilisateur_id, type, cible_type, cible_id, points, date.
- **Utilité**: Base du calcul des points, historique utilisateur, transparence.

#### Badge (badge)
- **Champs**: id, nom, description, niveau, critere.
- **Relation**: user_badge table de jointure (utilisateur_id, badge_id, date_obtention).

#### Défi/Concours (evenement)
- **Champs**: id, type, titre, description, date_debut, date_fin, parametres, statut.
- **Relations**: Peut avoir une relation avec les contributions.
- **Remarque**: Simplifie l'affichage de l'historique d'événements.

#### Message/Commentaire (commentaire)
- **Champs**: id, auteur_id, référence (photo_id, collection_id, etc.), texte, date.
- **Relation**: vers utilisateur et vers l'entité commentée.
- **Remarque**: Pour MVP, peut être simplifié.

### Schéma relationnel simplifié

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

### Liens sémantiques (type Wikidata)

Nous souhaitons que Symbolica ne soit pas un silo de données. Chaque concept de la base peut être lié à des identifiants externes pour enrichir le contexte et faciliter l'échange de données ouvertes :

- Le champ wikidata_id dans Motif permettra de faire le lien avec l'élément Wikidata correspondant.
- De même pour Culture et Période.
- On peut utiliser ces identifiants pour construire des liens vers Wikipedia ou d'autres bases (Europeana, etc.).
- La structure de base devra être compatible avec une conversion éventuelle en données liées (Linked Open Data).

### Évolutivité du schéma

- Prévoir des index sur les champs de recherche importants et sur les FK pour performance.
- Prévoir la possibilité d'ajouter des champs supplémentaires sans trop de difficulté.
- Pour les collections : tables collection et collection_item à développer ultérieurement.

En résumé, la base de données sera relationnelle avec une couche sémantique. Elle stockera proprement les informations tout en permettant de tisser des liens externes vers le web de données culturelles. Cette structuration soignée est essentielle pour bâtir un écosystème pérenne autour de Symbolica, où les données contribuent au bien commun du patrimoine.

## 7. Charte graphique & direction artistique initiale

L'identité visuelle de Symbolica doit refléter ses valeurs : un projet à la fois culturel, collaboratif et moderne. La charte graphique servira de boussole pour concevoir l'UI et les communications (site web, réseaux sociaux, éventuels supports print). Voici les axes directeurs proposés :

### Logo
On imagine un logo symbolisant le concept de "symbole" de manière stylisée et universelle. Par exemple, un logotype combinant une forme géométrique emblématique et le nom Symbolica. Une idée pourrait être de jouer avec la lettre "S" de Symbolica pour en faire un entrelacs ou un motif celtique simplifié, indiquant par la même un symbole culturel. Une autre piste est un motif circulaire rappelant un mandala ou une rosace (représentant la pluralité des cultures se rejoignant). Le logo devra être utilisable en monochrome et en petite taille (favicon) – opter pour un design simplifié, mémorable. Couplé au nom "Symbolica" dans une typographie spécifique.

### Palette de couleurs
Opter pour une palette évoquant la richesse culturelle tout en restant moderne. On peut combiner :
- Une couleur principale chaude et accueillante, par ex. un orange ambré ou ocre rappelant les teintes de l'art ancien.
- Une couleur secondaire contrastante plus froide, par ex. un bleu nuit ou turquoise profond.
- Des couleurs d'accent pour les catégories : possibilité d'assigner une couleur par grande aire culturelle.

Veiller à l'accessibilité des contrastes. Un fond global plutôt clair (blanc cassé ou gris très pâle) pour un site aéré, avec des touches de couleurs pour les éléments interactifs et visuels.

### Typographie
Choisir deux polices complémentaires :
- Une typographie sans-serif moderne pour l'interface (boutons, menus, textes courants).
- Pour les titres ou le logo, une typo avec plus de caractère, éventuellement avec une touche historique.

Bien sûr, utiliser des fontes libres (Google Fonts ou autres) pour rester dans l'esprit open source.

### Style général UI
- Design sobre, épuré et élégant, mettant en valeur les images de motifs.
- Penser "design système" : définir à l'avance les composants UI communs.
- Intégrer des touches graphiques rappelant les motifs : filigrane ou illustration de fond discrète.

### Icônes
Utiliser un jeu d'icônes cohérent (librairie open source d'icônes type Feather Icons ou FontAwesome) pour représenter les actions (upload, annotation, like, profil, etc.). Potentiellement créer des icônes custom pour certaines catégories de motifs ou sections.

### Inspiration visuelle
On peut prendre inspiration de sites de musées, ou de plateformes collaboratives comme DeviantArt ou Behance qui montrent comment présenter des images de manière attrayante, tout en offrant des interactions communautaires.

### Logo favicon et variantes
Prévoir le logo en différentes variantes (complète, icône seule, monochrome inversé pour fonds sombres). Favicon pour navigateur, icône mobile.

### Charte éditoriale liée
Sur le plan éditorial, adopter un ton accessible et passionné. Ni trop académique, ni trop désinvolte. La charte graphique devra aller de pair avec ce ton : le design doit inviter tant le prof d'université que l'ado curieux.

Une fois validée, cette charte graphique servira de base pour créer une bibliothèque de composants UI garantissant l'uniformité visuelle. Elle guidera aussi le travail des contributeurs front-end et designers amenés à faire évoluer le site. Le tout doit rendre l'expérience Symbolica immédiatement reconnaissable et agréable.

## 8. Roadmap produit par phase

Le développement de Symbolica se fera par étapes successives, en itérant rapidement et en impliquant les utilisateurs tests à chaque phase. Voici la feuille de route prévisionnelle :

### Phase 0 : Prototype (P0) – Durée estimée : 1-2 mois
**Objectif** : Démontrer la faisabilité du concept sur un cas d'usage réduit.
**Périmètre** :
- Squelette d'application avec authentification simple
- Upload d'images et affichage
- Premier jet de carte interactive
- Version simplifiée des annotations
- POC d'IA hors-ligne pour démonstration

### Phase 1 : Minimum Viable Product (MVP) – Durée : ~4-6 mois
**Objectif** : Version utilisable par un cercle restreint (bêta privée).
**Périmètre** :
- Upload & géolocalisation complets
- Annotation manuelle fonctionnelle
- Profil utilisateur basique
- Carte interactive avec filtres simples
- Interface bilingue FR/EN
- Gamification légère
- UI fonctionnelle mais pas définitive

### Phase 2 : Alpha publique – Durée : 3 mois
**Objectif** : Ouvrir à un public plus large tout en considérant le statut "alpha".
**Périmètre** :
- Stabilisation des fonctions MVP
- Ajout de la base de connaissances Motifs
- Première version de reconnaissance IA
- Extension du système de gamification
- Affinement de la charte graphique
- Documentation utilisateur

### Phase 3 : Bêta publique – Durée : 3 mois
**Objectif** : Lancement public officiel en version bêta.
**Périmètre** :
- Optimisations de performance
- Outils de modération communautaire
- Extension multilingue
- Premier défi/concours officiel
- Version bêta de génération IA
- Système de feedback utilisateur

### Phase 4 : Version 1.0 (Lancement officiel) – Durée : 1-2 mois
**Objectif** : Version stable pour sortie officielle.
**Périmètre** :
- Correction des bugs majeurs
- UI/UX finalisée
- Toutes fonctionnalités de base présentes
- Plan de communication pour le lancement
- Infrastructure définitive
- Publication du code source

### Phase 5 : Extensions futures et maintenance – Ongoing
Après la V1, poursuite du développement avec :
- Application mobile native ou PWA améliorée
- Fonctionnalités de réalité augmentée
- Intégrations pour institutions culturelles
- Outils d'analyse de données
- Expansion linguistique
- Améliorations des fonctionnalités sociales
- Outils de gouvernance communautaire

Chaque phase se termine par une validation avec les parties prenantes. La roadmap reste adaptable selon les retours utilisateurs et les ressources disponibles.

## 9. Enjeux communautaires, partenariats culturels & gouvernance associatif

Au-delà de la technique, la réussite de Symbolica repose sur sa communauté et son insertion dans l'écosystème culturel.

### Communauté & modération
- **Recrutement des contributeurs** : Cibler d'abord les communautés existantes (amateurs d'histoire, d'art, étudiants, archéologues).
- **Onboarding & rétention** : Tutoriels interactifs, missions guidées, newsletters pour maintenir l'engagement.
- **Modération participative** : Système inspiré de Wikipédia, avec modérateurs volontaires et mécanismes de vote/karma.
- **Chartes et règles** : Conditions claires dès l'inscription concernant le respect, la propriété intellectuelle, la sensibilité culturelle.
- **Reconnaissance** : Valoriser les contributeurs via un "Hall of Fame" et système de mentorat.

### Partenariats culturels & scientifiques
- **Institutions patrimoniales** : Collaborations avec musées, archives, UNESCO, Europeana, Wikimédia.
- **Universités et laboratoires** : Comité scientifique, projets de recherche, stages étudiants.
- **Communautés en ligne existantes** : Rapprochement avec forums spécialisés et groupes thématiques.
- **Financement et sponsors** : Appels à projets culturels, mécénat technologique, subventions.

### Modèle de gouvernance associatif
- **Association loi 1901** : Structure formelle avec statuts définissant mission et fonctionnement démocratique.
- **Gouvernance interne** : Conseil d'Administration élu représentant des profils divers, et bureau exécutif.
- **Rôle de la communauté** : Consultations, groupes de travail, votes sur les orientations.
- **Cadre juridique & éthique** : Garantie du caractère non-lucratif, licences ouvertes pour code et contenus.
- **Expansion internationale** : Possibilité d'antennes locales ou chapters pour spécificités régionales.
- **Pérennité** : Documentation complète pour assurer la continuité du projet même en cas de changement d'équipe.

En somme, ces mesures visent à créer un écosystème vertueux autour de Symbolica, où communauté, experts et institutions œuvrent ensemble pour la préservation et la réinvention des symboles culturels.
