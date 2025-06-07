
# Documentation Administrative - Cultural Heritage Symbols

## Vue d'ensemble du système

Cultural Heritage Symbols est une plateforme collaborative de documentation et d'analyse des symboles du patrimoine culturel mondial, construite avec React, TypeScript, Supabase et une architecture moderne.

## Architecture technique

### Stack technologique
- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, Shadcn/UI, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **State Management**: TanStack Query, React Context
- **Internationalisation**: i18next, react-i18next
- **Cartes**: Mapbox GL JS
- **Mobile**: Capacitor (iOS/Android)

### Structure du projet
```
src/
├── components/          # Composants UI réutilisables
│   ├── admin/          # Interface d'administration
│   ├── auth/           # Authentification
│   ├── collections/    # Gestion des collections
│   ├── community/      # Hub communautaire
│   ├── social/         # Intégrations sociales
│   └── ui/             # Composants de base
├── hooks/              # Hooks React personnalisés
├── services/           # Services API et business logic
├── types/              # Définitions TypeScript
├── i18n/               # Configuration des traductions
└── pages/              # Pages principales
```

## Architecture de la base de données

### Vue d'ensemble
La base de données PostgreSQL est organisée en plusieurs groupes de tables liées :
- **Gestion des utilisateurs** : Profils, points, niveaux, badges
- **Contenu principal** : Symboles, images, localisations
- **Contributions** : Soumissions utilisateur et modération
- **Collections** : Regroupements thématiques de symboles
- **Communauté** : Groupes d'intérêt, posts, interactions
- **Administration** : Logs, modération, analytics
- **Système technique** : IA, annotations, mobile

### Tables de gestion des utilisateurs

#### `profiles`
Table principale des profils utilisateur étendant auth.users
```sql
- id (uuid, PK) : Référence à auth.users.id
- username (text, nullable) : Nom d'utilisateur unique
- full_name (text, nullable) : Nom complet de l'utilisateur
- is_admin (boolean, défaut: false) : Statut administrateur
- is_banned (boolean, défaut: false) : Statut de bannissement
- created_at, updated_at (timestamp with time zone)
```

#### `user_points`
Système de points gamifiés par catégorie d'activité
```sql
- id (uuid, PK)
- user_id (uuid, NOT NULL) : Référence à profiles.id
- total (integer, défaut: 0) : Total des points accumulés
- contribution_points (integer, défaut: 0) : Points de contribution de contenu
- exploration_points (integer, défaut: 0) : Points d'exploration de la plateforme
- validation_points (integer, défaut: 0) : Points de validation communautaire
- community_points (integer, défaut: 0) : Points d'activité communautaire
- created_at, updated_at (timestamp with time zone)
```

#### `user_levels`
Système de niveaux d'expérience des utilisateurs
```sql
- id (uuid, PK)
- user_id (uuid, NOT NULL) : Référence à profiles.id
- level (integer, défaut: 1) : Niveau actuel de l'utilisateur
- xp (integer, défaut: 0) : Points d'expérience actuels
- next_level_xp (integer, défaut: 100) : XP requis pour le niveau suivant
- created_at, updated_at (timestamp with time zone)
```

#### `user_activities`
Journal complet des activités utilisateur pour traçabilité et attribution de points
```sql
- id (uuid, PK)
- user_id (uuid, NOT NULL) : Référence à profiles.id
- activity_type (text, NOT NULL) : Type d'activité (contribution, exploration, validation, community)
- entity_id (uuid, nullable) : ID de l'entité concernée par l'activité
- points_earned (integer, défaut: 0) : Points gagnés pour cette activité
- details (jsonb, nullable) : Métadonnées de l'activité (contexte, paramètres)
- created_at (timestamp with time zone)
```

#### `user_achievements`
Gestion des succès et réalisations des utilisateurs
```sql
- id (uuid, PK)
- user_id (uuid, NOT NULL) : Référence à profiles.id
- achievement_id (uuid, NOT NULL) : Référence à achievements.id
- progress (integer, défaut: 0) : Progression actuelle vers le succès
- completed (boolean, défaut: false) : Succès débloqué ou non
- earned_at (timestamp with time zone, nullable) : Date d'obtention du succès
- created_at, updated_at (timestamp with time zone)
```

#### `user_badges`
Badges spéciaux attribués aux utilisateurs pour reconnaître leurs contributions
```sql
- id (uuid, PK)
- user_id (uuid, NOT NULL) : Référence à profiles.id
- badge_type (text, NOT NULL) : Type de badge (contributor, expert, moderator, etc.)
- badge_name (text, NOT NULL) : Nom descriptif du badge
- awarded_at (timestamp with time zone, NOT NULL) : Date d'attribution
- created_at (timestamp with time zone)
```

#### `user_follows`
Système de suivi entre utilisateurs pour créer des réseaux sociaux
```sql
- id (uuid, PK)
- follower_id (uuid, NOT NULL) : Utilisateur qui suit
- followed_id (uuid, NOT NULL) : Utilisateur suivi
- created_at (timestamp with time zone)
```

### Tables de contenu principal

#### `symbols`
Table centrale contenant tous les symboles culturels de la plateforme
```sql
- id (uuid, PK)
- name (text, NOT NULL) : Nom principal du symbole
- culture (text, NOT NULL) : Culture d'origine du symbole
- period (text, NOT NULL) : Période historique
- description (text, nullable) : Description détaillée du symbole
- medium (text[], défaut: {}) : Support/matériau (pierre, bois, métal, etc.)
- technique (text[], défaut: {}) : Techniques de création utilisées
- function (text[], défaut: {}) : Fonctions symboliques et pratiques
- translations (jsonb, défaut: {}) : Traductions multilingues de tous les champs
- created_at, updated_at (timestamp with time zone)
```

#### `symbol_images`
Images et médias visuels associés aux symboles
```sql
- id (uuid, PK)
- symbol_id (uuid, NOT NULL) : Référence à symbols.id
- image_url (text, NOT NULL) : URL de stockage de l'image
- image_type (user-defined type, NOT NULL) : Type d'image (original, pattern, reuse, context)
- title (text, nullable) : Titre descriptif de l'image
- description (text, nullable) : Description détaillée de l'image
- location (text, nullable) : Lieu de prise de vue ou contexte géographique
- source (text, nullable) : Source ou attribution de l'image
- tags (text[], nullable) : Tags descriptifs pour la recherche
- translations (jsonb, défaut: {}) : Traductions multilingues
- created_at (timestamp with time zone)
```

#### `symbol_locations`
Géolocalisation précise des symboles dans le monde
```sql
- id (uuid, PK)
- symbol_id (uuid, NOT NULL) : Référence à symbols.id
- name (text, NOT NULL) : Nom du lieu où se trouve le symbole
- culture (text, NOT NULL) : Culture associée à ce lieu
- description (text, nullable) : Description du contexte géographique
- latitude, longitude (numeric, NOT NULL) : Coordonnées GPS précises
- source (text, nullable) : Source de vérification de la localisation
- historical_period (text, nullable) : Période historique spécifique au lieu
- is_verified (boolean, défaut: false) : Statut de vérification par les experts
- verification_status (user-defined type) : Statut détaillé (unverified, pending, verified, disputed)
- created_by, verified_by (uuid, nullable) : Utilisateurs ayant créé/vérifié
- translations (jsonb, défaut: {}) : Traductions multilingues
- created_at, updated_at (timestamp with time zone)
```

#### `symbol_connections`
Relations et connexions entre différents symboles
```sql
- id (uuid, PK)
- symbol_id_1, symbol_id_2 (uuid, NOT NULL) : Références aux symboles connectés
- relationship_type (text, NOT NULL) : Type de relation (similar, derived, influences, etc.)
- description (text, nullable) : Description détaillée de la relation
- created_by (uuid, nullable) : Référence à profiles.id (créateur de la relation)
- translations (jsonb, défaut: {}) : Traductions multilingues
- created_at, updated_at (timestamp with time zone)
```

#### `symbol_taxonomy`
Classification hiérarchique et taxonomique des symboles
```sql
- id (uuid, PK)
- name (text, NOT NULL) : Nom de la catégorie taxonomique
- description (text, nullable) : Description de la catégorie
- parent_id (uuid, nullable) : Référence à symbol_taxonomy.id (catégorie parent)
- level (integer, défaut: 1) : Niveau dans la hiérarchie (1=racine, 2=sous-catégorie, etc.)
- translations (jsonb, défaut: {}) : Traductions multilingues
- created_at, updated_at (timestamp with time zone)
```

#### `symbol_taxonomy_mapping`
Table de liaison entre symboles et catégories taxonomiques
```sql
- id (uuid, PK)
- symbol_id (uuid, NOT NULL) : Référence à symbols.id
- taxonomy_id (uuid, NOT NULL) : Référence à symbol_taxonomy.id
- created_at (timestamp with time zone)
```

#### `patterns`
Motifs et patterns extraits ou identifiés dans les symboles
```sql
- id (uuid, PK)
- name (text, NOT NULL) : Nom descriptif du motif
- description (text, nullable) : Description détaillée du pattern
- symbol_id (uuid, nullable) : Référence au symbole source
- pattern_type (text, défaut: 'geometric') : Type de motif (geometric, organic, abstract, etc.)
- complexity_level (text, défaut: 'simple') : Niveau de complexité (simple, medium, complex)
- cultural_significance (text, nullable) : Signification culturelle du motif
- historical_context (text, nullable) : Contexte historique d'utilisation
- created_by (uuid, nullable) : Référence à profiles.id (créateur)
- translations (jsonb, défaut: {"en": {}, "fr": {}}) : Traductions multilingues
- created_at, updated_at (timestamp with time zone)
```

### Tables de contributions utilisateur

#### `user_contributions`
Contributions soumises par la communauté pour enrichir la base de données
```sql
- id (uuid, PK)
- user_id (uuid, NOT NULL) : Référence à profiles.id (contributeur)
- title (text, NOT NULL) : Titre de la contribution
- description (text, nullable) : Description détaillée de la découverte
- location_name (text, nullable) : Nom du lieu de découverte
- latitude, longitude (numeric, nullable) : Coordonnées GPS si applicable
- cultural_context (text, nullable) : Contexte culturel de la contribution
- period (text, nullable) : Période historique estimée
- status (text, défaut: 'pending') : Statut de modération (pending, approved, rejected)
- reviewed_by (uuid, nullable) : Référence à profiles.id (modérateur)
- reviewed_at (timestamp with time zone, nullable) : Date de révision
- title_translations (jsonb, défaut: {"en": null, "fr": null}) : Traductions du titre
- description_translations (jsonb, défaut: {"en": null, "fr": null}) : Traductions de la description
- cultural_context_translations (jsonb, défaut: {"en": null, "fr": null}) : Traductions du contexte
- period_translations (jsonb, défaut: {"en": null, "fr": null}) : Traductions de la période
- location_name_translations (jsonb, défaut: {"en": null, "fr": null}) : Traductions du lieu
- created_at, updated_at (timestamp with time zone)
```

#### `contribution_images`
Images accompagnant les contributions utilisateur
```sql
- id (uuid, PK)
- contribution_id (uuid, NOT NULL) : Référence à user_contributions.id
- image_url (text, NOT NULL) : URL de stockage de l'image
- image_type (text, défaut: 'original') : Type d'image (original, detail, context)
- annotations (jsonb, nullable) : Annotations visuelles sur l'image
- extracted_pattern_url (text, nullable) : URL du motif extrait automatiquement
- created_at (timestamp with time zone)
```

#### `contribution_tags`
Tags descriptifs associés aux contributions pour améliorer la recherche
```sql
- id (uuid, PK)
- contribution_id (uuid, NOT NULL) : Référence à user_contributions.id
- tag (text, NOT NULL) : Tag descriptif
- tag_translations (jsonb, défaut: {"en": null, "fr": null}) : Traductions du tag
- created_at (timestamp with time zone)
```

#### `contribution_comments`
Système de commentaires pour les contributions en cours de modération
```sql
- id (uuid, PK)
- contribution_id (uuid, NOT NULL) : Référence à user_contributions.id
- user_id (uuid, NOT NULL) : Référence à profiles.id (commentateur)
- comment (text, NOT NULL) : Contenu du commentaire
- comment_translations (jsonb, défaut: {"en": null, "fr": null}) : Traductions du commentaire
- created_at (timestamp with time zone)
```

### Tables des collections thématiques

#### `collections`
Collections organisées de symboles par thème ou critère
```sql
- id (uuid, PK)
- slug (text, NOT NULL, UNIQUE) : Identifiant URL unique pour la collection
- created_by (uuid, nullable) : Référence à profiles.id (créateur)
- is_featured (boolean, défaut: false) : Collection mise en avant sur la page d'accueil
- created_at, updated_at (timestamp with time zone)
```

#### `collection_translations`
Traductions multilingues des métadonnées des collections
```sql
- id (integer, PK, auto-increment) : Clé primaire séquentielle
- collection_id (uuid, nullable) : Référence à collections.id
- language (text, NOT NULL) : Code langue ISO (en, fr, es, etc.)
- title (text, NOT NULL) : Titre traduit de la collection
- description (text, nullable) : Description traduite de la collection
```

#### `collection_symbols`
Table de liaison entre collections et symboles avec ordre de présentation
```sql
- collection_id (uuid, NOT NULL) : Référence à collections.id
- symbol_id (uuid, NOT NULL) : Référence à symbols.id
- position (integer, défaut: 0) : Position d'affichage dans la collection
Note: Pas de clé primaire composite actuellement définie
```

#### `collection_items`
Items spécifiques dans les collections de groupes d'intérêt
```sql
- id (uuid, PK)
- collection_id (uuid, NOT NULL) : Référence à group_symbol_collections.id
- symbol_id (uuid, NOT NULL) : Référence à symbols.id
- added_by (uuid, NOT NULL) : Référence à profiles.id (utilisateur ayant ajouté)
- notes (text, nullable) : Notes personnelles sur l'ajout
- translations (jsonb, défaut: {"en": {}, "fr": {}}) : Traductions des notes
- created_at (timestamp with time zone)
```

### Tables communautaires et sociales

#### `interest_groups`
Groupes d'intérêt thématiques pour organiser la communauté
```sql
- id (uuid, PK)
- name (text, NOT NULL) : Nom du groupe
- slug (text, NOT NULL, UNIQUE) : Identifiant URL unique
- description (text, nullable) : Description des objectifs du groupe
- icon (text, nullable) : Icône représentative du groupe
- banner_image (text, nullable) : Image bannière du groupe
- theme_color (text, nullable) : Couleur thématique personnalisée
- is_public (boolean, défaut: true) : Groupe public ou privé
- created_by (uuid, NOT NULL) : Référence à profiles.id (fondateur)
- members_count (integer, défaut: 0) : Nombre de membres (dénormalisé)
- discoveries_count (integer, défaut: 0) : Nombre de découvertes du groupe
- translations (jsonb, défaut: {"en": {}, "fr": {}}) : Traductions multilingues
- created_at, updated_at (timestamp with time zone)
```

#### `group_members`
Membres appartenant aux groupes d'intérêt
```sql
- id (uuid, PK)
- group_id (uuid, NOT NULL) : Référence à interest_groups.id
- user_id (uuid, NOT NULL) : Référence à profiles.id
- role (text, défaut: 'member') : Rôle dans le groupe (member, moderator, admin)
- joined_at (timestamp with time zone, NOT NULL) : Date d'adhésion
```

#### `group_posts`
Publications et discussions dans les groupes d'intérêt
```sql
- id (uuid, PK)
- group_id (uuid, NOT NULL) : Référence à interest_groups.id
- user_id (uuid, NOT NULL) : Référence à profiles.id (auteur)
- content (text, NOT NULL) : Contenu de la publication
- likes_count (integer, défaut: 0) : Nombre de likes (dénormalisé)
- comments_count (integer, défaut: 0) : Nombre de commentaires (dénormalisé)
- translations (jsonb, défaut: {"en": {}, "fr": {}}) : Traductions du contenu
- created_at, updated_at (timestamp with time zone)
```

#### `group_symbol_collections`
Collections spécialisées créées au sein des groupes d'intérêt
```sql
- id (uuid, PK)
- group_id (uuid, NOT NULL) : Référence à interest_groups.id
- name (text, NOT NULL) : Nom de la collection de groupe
- description (text, nullable) : Description de la collection
- created_by (uuid, NOT NULL) : Référence à profiles.id (créateur)
- translations (jsonb, défaut: {"en": {}, "fr": {}}) : Traductions multilingues
- created_at, updated_at (timestamp with time zone)
```

#### `post_likes`
Système de likes sur les publications des groupes
```sql
- id (uuid, PK)
- post_id (uuid, NOT NULL) : Référence à group_posts.id
- user_id (uuid, NOT NULL) : Référence à profiles.id
- created_at (timestamp with time zone, NOT NULL) : Date du like
```

#### `post_comments`
Commentaires sur les publications des groupes
```sql
- id (uuid, PK)
- post_id (uuid, NOT NULL) : Référence à group_posts.id
- user_id (uuid, NOT NULL) : Référence à profiles.id (commentateur)
- content (text, NOT NULL) : Contenu du commentaire
- translations (jsonb, défaut: {"en": {}, "fr": {}}) : Traductions du commentaire
- created_at, updated_at (timestamp with time zone)
```

#### `direct_messages`
Système de messagerie privée entre utilisateurs
```sql
- id (uuid, PK)
- sender_id (uuid, NOT NULL) : Référence à profiles.id (expéditeur)
- receiver_id (uuid, NOT NULL) : Référence à profiles.id (destinataire)
- content (text, NOT NULL) : Contenu du message
- read (boolean, défaut: false) : Statut de lecture du message
- created_at (timestamp with time zone, NOT NULL) : Date d'envoi
```

### Tables d'administration et modération

#### `admin_logs`
Journal complet des actions administratives pour audit et traçabilité
```sql
- id (uuid, PK)
- admin_id (uuid, NOT NULL) : Référence à profiles.id (administrateur)
- action (text, NOT NULL) : Action effectuée (moderate_contribution, ban_user, etc.)
- entity_type (text, NOT NULL) : Type d'entité concernée (user, contribution, symbol, etc.)
- entity_id (uuid, nullable) : ID de l'entité concernée
- details (jsonb, défaut: {}) : Détails contextuels de l'action
- created_at (timestamp with time zone, NOT NULL) : Horodatage de l'action
```

#### `achievements`
Définition de tous les succès disponibles dans le système de gamification
```sql
- id (uuid, PK)
- name (text, NOT NULL) : Nom du succès
- description (text, NOT NULL) : Description des conditions d'obtention
- icon (text, NOT NULL) : Icône représentative du succès
- points (integer, défaut: 10) : Points attribués lors de l'obtention
- type (text, NOT NULL) : Type d'activité (contribution, exploration, validation, community)
- level (text, NOT NULL) : Niveau de difficulté (bronze, silver, gold, platinum)
- requirement (integer, défaut: 1) : Nombre d'actions requises pour débloquer
- translations (jsonb, défaut: {}) : Traductions multilingues
- created_at, updated_at (timestamp with time zone)
```

#### `notifications`
Système de notifications pour informer les utilisateurs des événements
```sql
- id (uuid, PK)
- user_id (uuid, NOT NULL) : Référence à profiles.id (destinataire)
- type (text, NOT NULL) : Type de notification (achievement, contribution_approved, etc.)
- content (jsonb, NOT NULL) : Contenu structuré de la notification
- read (boolean, défaut: false) : Statut de lecture
- created_at (timestamp with time zone, NOT NULL) : Date de création
```

### Tables de contenu éditorial

#### `content_sections`
Sections de contenu dynamique pour les pages statiques
```sql
- id (uuid, PK)
- section_key (text, NOT NULL, UNIQUE) : Clé unique d'identification de la section
- title (jsonb, défaut: {"en": "", "fr": ""}) : Titre multilingue de la section
- subtitle (jsonb, défaut: {"en": "", "fr": ""}) : Sous-titre multilingue
- content (jsonb, défaut: {"en": "", "fr": ""}) : Contenu principal multilingue
- created_at, updated_at (timestamp with time zone)
```

#### `roadmap_items`
Éléments de la roadmap produit pour transparence sur le développement
```sql
- id (uuid, PK)
- phase (text, NOT NULL) : Phase de développement (alpha, beta, v1, etc.)
- title (jsonb, défaut: {"en": "", "fr": ""}) : Titre multilingue de l'élément
- description (jsonb, défaut: {"en": "", "fr": ""}) : Description multilingue détaillée
- is_current (boolean, défaut: false) : Phase actuellement en cours
- is_completed (boolean, défaut: false) : Phase terminée
- display_order (integer, défaut: 0) : Ordre d'affichage dans la roadmap
- created_at, updated_at (timestamp with time zone)
```

#### `testimonials`
Témoignages d'utilisateurs pour promotion et crédibilité
```sql
- id (uuid, PK)
- name (text, NOT NULL) : Nom du témoin
- initials (text, nullable) : Initiales pour affichage anonymisé
- image_url (text, nullable) : Photo de profil du témoin
- role (jsonb, défaut: {"en": "", "fr": ""}) : Rôle/titre multilingue
- quote (jsonb, défaut: {"en": "", "fr": ""}) : Citation multilingue
- display_order (integer, défaut: 0) : Ordre d'affichage
- is_active (boolean, défaut: true) : Témoignage actif/visible
- created_at, updated_at (timestamp with time zone)
```

#### `partners`
Partenaires institutionnels et organisationnels de la plateforme
```sql
- id (uuid, PK)
- name (text, NOT NULL) : Nom officiel du partenaire
- logo_url (text, nullable) : Logo du partenaire
- website_url (text, nullable) : Site web officiel
- description (jsonb, défaut: {"en": "", "fr": ""}) : Description multilingue du partenariat
- display_order (integer, défaut: 0) : Ordre d'affichage
- is_active (boolean, défaut: true) : Partenariat actif/visible
- created_at, updated_at (timestamp with time zone)
```

### Tables techniques et IA

#### `ai_pattern_suggestions`
Suggestions automatiques de motifs générées par l'intelligence artificielle
```sql
- id (uuid, PK)
- image_id (uuid, NOT NULL) : ID de l'image analysée
- image_type (text, défaut: 'symbol') : Type d'image analysée
- suggested_patterns (jsonb, NOT NULL) : Motifs suggérés par l'IA
- processing_status (text, défaut: 'pending') : Statut du traitement (pending, processing, completed, failed)
- ai_model_version (text, nullable) : Version du modèle IA utilisé
- processing_time_ms (integer, nullable) : Temps de traitement en millisecondes
- error_message (text, nullable) : Message d'erreur en cas d'échec
- created_at (timestamp with time zone, NOT NULL) : Date de création de la demande
- processed_at (timestamp with time zone, nullable) : Date de fin de traitement
```

#### `image_annotations`
Annotations visuelles sur les images pour identifier motifs et zones d'intérêt
```sql
- id (uuid, PK)
- image_id (uuid, NOT NULL) : ID de l'image annotée
- image_type (text, défaut: 'symbol') : Type d'image (symbol, contribution, pattern)
- pattern_id (uuid, nullable) : Référence à patterns.id si annotation liée à un motif
- annotation_data (jsonb, NOT NULL) : Données géométriques de l'annotation (coordonnées, forme)
- confidence_score (numeric, défaut: 0.0) : Score de confiance de l'annotation (0.0-1.0)
- validation_status (text, défaut: 'pending') : Statut de validation (pending, validated, rejected)
- notes (text, nullable) : Notes explicatives sur l'annotation
- created_by (uuid, nullable) : Référence à profiles.id (créateur de l'annotation)
- validated_by (uuid, nullable) : Référence à profiles.id (validateur)
- translations (jsonb, défaut: {"en": {}, "fr": {}}) : Traductions des notes
- created_at, updated_at (timestamp with time zone)
```

#### `validation_votes`
Système de votes communautaires pour validation des annotations
```sql
- id (uuid, PK)
- annotation_id (uuid, nullable) : Référence à image_annotations.id
- user_id (uuid, nullable) : Référence à profiles.id (votant)
- vote_type (text, NOT NULL) : Type de vote (approve, reject, needs_review)
- comment (text, nullable) : Commentaire explicatif du vote
- created_at (timestamp with time zone, NOT NULL) : Date du vote
```

#### `analysis_examples`
Exemples d'analyse pour documentation et formation des utilisateurs
```sql
- id (uuid, PK)
- title (text, NOT NULL) : Titre de l'exemple d'analyse
- description (text, nullable) : Description pédagogique de l'exemple
- original_image_url (text, nullable) : URL de l'image originale
- detection_image_url (text, nullable) : URL de l'image avec détection automatique
- extraction_image_url (text, nullable) : URL de l'image avec extraction de motifs
- classification_image_url (text, nullable) : URL de l'image avec classification
- tags (text[], défaut: {}) : Tags descriptifs pour catégorisation
- created_at, updated_at (timestamp with time zone)
```

### Tables mobile et synchronisation

#### `mobile_field_notes`
Notes de terrain prises via l'application mobile en mode hors ligne
```sql
- id (uuid, PK)
- user_id (uuid, NOT NULL) : Référence à profiles.id
- content (text, NOT NULL) : Contenu textuel de la note
- location (jsonb, nullable) : Données de géolocalisation complètes
- timestamp (bigint, NOT NULL) : Timestamp Unix de prise de note
- images (jsonb, défaut: []) : URLs des images associées
- audio_url (text, nullable) : URL de l'enregistrement audio
- synced (boolean, défaut: false) : Statut de synchronisation avec le serveur
- created_at, updated_at (timestamp with time zone)
```

#### `mobile_sync_queue`
File d'attente pour synchronisation des données mobile vers serveur
```sql
- id (uuid, PK)
- user_id (uuid, NOT NULL) : Référence à profiles.id
- entity_type (text, NOT NULL) : Type d'entité à synchroniser
- action_type (text, NOT NULL) : Type d'action (create, update, delete)
- local_id (text, nullable) : ID local de l'entité sur l'appareil
- entity_data (jsonb, NOT NULL) : Données complètes de l'entité
- server_id (uuid, nullable) : ID serveur après synchronisation réussie
- processed (boolean, défaut: false) : Traitement terminé
- retry_count (integer, défaut: 0) : Nombre de tentatives de synchronisation
- error_message (text, nullable) : Message d'erreur en cas d'échec
- created_at (timestamp with time zone, NOT NULL) : Date de création de la demande
- processed_at (timestamp with time zone, nullable) : Date de traitement
```

#### `mobile_cache_data`
Cache de données pour fonctionnement hors ligne de l'application mobile
```sql
- id (uuid, PK)
- user_id (uuid, nullable) : Référence à profiles.id (nullable pour cache global)
- cache_type (text, NOT NULL) : Type de cache (symbols, collections, user_data, etc.)
- cache_key (text, NOT NULL) : Clé unique d'identification du cache
- data (jsonb, NOT NULL) : Données mises en cache
- expires_at (timestamp with time zone, nullable) : Date d'expiration du cache
- created_at, updated_at (timestamp with time zone)
```

## Types personnalisés et énumérations

### Types USER-DEFINED existants

#### `symbol_location_verification_status`
Énumération pour le statut de vérification des localisations de symboles :
- `unverified` : Localisation non vérifiée par les experts
- `pending` : En cours de vérification par la communauté
- `verified` : Vérifiée et validée par les experts
- `disputed` : Localisation contestée ou incertaine

#### Types d'images pour `symbol_images.image_type`
Énumération définissant les types d'images de symboles :
- `original` : Image originale du symbole in situ
- `pattern` : Image focalisée sur les motifs
- `reuse` : Exemples de réutilisation contemporaine
- `context` : Image du contexte environnant

## Contraintes et validations manquantes

### Contraintes de clés étrangères à ajouter
```sql
-- Contraintes principales utilisateurs
ALTER TABLE user_points ADD CONSTRAINT fk_user_points_user_id 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE user_levels ADD CONSTRAINT fk_user_levels_user_id 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE user_activities ADD CONSTRAINT fk_user_activities_user_id 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE user_achievements ADD CONSTRAINT fk_user_achievements_user_id 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE user_achievements ADD CONSTRAINT fk_user_achievements_achievement_id 
  FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE;

-- Contraintes symboles et contenu
ALTER TABLE symbol_images ADD CONSTRAINT fk_symbol_images_symbol_id 
  FOREIGN KEY (symbol_id) REFERENCES symbols(id) ON DELETE CASCADE;

ALTER TABLE symbol_locations ADD CONSTRAINT fk_symbol_locations_symbol_id 
  FOREIGN KEY (symbol_id) REFERENCES symbols(id) ON DELETE CASCADE;

ALTER TABLE symbol_connections ADD CONSTRAINT fk_symbol_connections_symbol_1 
  FOREIGN KEY (symbol_id_1) REFERENCES symbols(id) ON DELETE CASCADE;

ALTER TABLE symbol_connections ADD CONSTRAINT fk_symbol_connections_symbol_2 
  FOREIGN KEY (symbol_id_2) REFERENCES symbols(id) ON DELETE CASCADE;

-- Contraintes collections
ALTER TABLE collection_symbols ADD CONSTRAINT fk_collection_symbols_collection_id 
  FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE;

ALTER TABLE collection_symbols ADD CONSTRAINT fk_collection_symbols_symbol_id 
  FOREIGN KEY (symbol_id) REFERENCES symbols(id) ON DELETE CASCADE;

ALTER TABLE collection_translations ADD CONSTRAINT fk_collection_translations_collection_id 
  FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE;

-- Contraintes communauté
ALTER TABLE group_members ADD CONSTRAINT fk_group_members_group_id 
  FOREIGN KEY (group_id) REFERENCES interest_groups(id) ON DELETE CASCADE;

ALTER TABLE group_members ADD CONSTRAINT fk_group_members_user_id 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE group_posts ADD CONSTRAINT fk_group_posts_group_id 
  FOREIGN KEY (group_id) REFERENCES interest_groups(id) ON DELETE CASCADE;

ALTER TABLE group_posts ADD CONSTRAINT fk_group_posts_user_id 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Contraintes contributions
ALTER TABLE user_contributions ADD CONSTRAINT fk_user_contributions_user_id 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE contribution_images ADD CONSTRAINT fk_contribution_images_contribution_id 
  FOREIGN KEY (contribution_id) REFERENCES user_contributions(id) ON DELETE CASCADE;

ALTER TABLE contribution_tags ADD CONSTRAINT fk_contribution_tags_contribution_id 
  FOREIGN KEY (contribution_id) REFERENCES user_contributions(id) ON DELETE CASCADE;
```

### Index de performance à créer
```sql
-- Index sur les colonnes de jointure fréquentes
CREATE INDEX idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX idx_user_activities_created_at ON user_activities(created_at DESC);
CREATE INDEX idx_symbol_images_symbol_id ON symbol_images(symbol_id);
CREATE INDEX idx_symbol_locations_symbol_id ON symbol_locations(symbol_id);
CREATE INDEX idx_collection_symbols_collection_id ON collection_symbols(collection_id);
CREATE INDEX idx_collection_symbols_symbol_id ON collection_symbols(symbol_id);
CREATE INDEX idx_group_members_group_id ON group_members(group_id);
CREATE INDEX idx_group_members_user_id ON group_members(user_id);
CREATE INDEX idx_group_posts_group_id ON group_posts(group_id);
CREATE INDEX idx_user_contributions_status ON user_contributions(status);
CREATE INDEX idx_user_contributions_user_id ON user_contributions(user_id);

-- Index de recherche textuelle
CREATE INDEX idx_symbols_name_gin ON symbols USING gin(to_tsvector('english', name));
CREATE INDEX idx_symbols_description_gin ON symbols USING gin(to_tsvector('english', description));
CREATE INDEX idx_interest_groups_name_gin ON interest_groups USING gin(to_tsvector('english', name));

-- Index géospatiaux
CREATE INDEX idx_symbol_locations_coordinates ON symbol_locations USING gist(ll_to_earth(latitude, longitude));
CREATE INDEX idx_user_contributions_coordinates ON user_contributions USING gist(ll_to_earth(latitude, longitude)) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
```

### Contraintes d'intégrité à ajouter
```sql
-- Contraintes d'unicité
ALTER TABLE profiles ADD CONSTRAINT uk_profiles_username UNIQUE (username);
ALTER TABLE collections ADD CONSTRAINT uk_collections_slug UNIQUE (slug);
ALTER TABLE interest_groups ADD CONSTRAINT uk_interest_groups_slug UNIQUE (slug);
ALTER TABLE content_sections ADD CONSTRAINT uk_content_sections_section_key UNIQUE (section_key);

-- Clés primaires composites manquantes
ALTER TABLE collection_symbols ADD CONSTRAINT pk_collection_symbols 
  PRIMARY KEY (collection_id, symbol_id);

ALTER TABLE user_follows ADD CONSTRAINT uk_user_follows_unique 
  UNIQUE (follower_id, followed_id);

ALTER TABLE post_likes ADD CONSTRAINT uk_post_likes_unique 
  UNIQUE (post_id, user_id);

ALTER TABLE validation_votes ADD CONSTRAINT uk_validation_votes_unique 
  UNIQUE (annotation_id, user_id);

-- Contraintes de validation
ALTER TABLE user_points ADD CONSTRAINT ck_user_points_positive 
  CHECK (total >= 0 AND contribution_points >= 0 AND exploration_points >= 0 AND validation_points >= 0 AND community_points >= 0);

ALTER TABLE user_levels ADD CONSTRAINT ck_user_levels_positive 
  CHECK (level > 0 AND xp >= 0 AND next_level_xp > xp);

ALTER TABLE symbol_locations ADD CONSTRAINT ck_symbol_locations_coordinates 
  CHECK (latitude BETWEEN -90 AND 90 AND longitude BETWEEN -180 AND 180);

ALTER TABLE achievements ADD CONSTRAINT ck_achievements_positive_points 
  CHECK (points > 0 AND requirement > 0);
```

## Fonctions de base de données

### Fonctions de gamification

#### `award_user_points(user_id, activity_type, points, entity_id, details)`
Attribue des points à un utilisateur et met à jour automatiquement son total par catégorie
- **Paramètres** : ID utilisateur, type d'activité, points à attribuer, ID entité optionnel, détails JSON
- **Fonctionnalité** : Insère une activité dans `user_activities` et met à jour `user_points`
- **Logique** : Création automatique de l'enregistrement utilisateur si inexistant
- **Sécurité** : SECURITY DEFINER pour accès privilégié

#### `get_leaderboard(limit)`
Récupère le classement des utilisateurs par points totaux
- **Paramètres** : Limite de résultats (défaut: 10)
- **Retour** : Table avec utilisateur, nom, avatar, niveau, points par catégorie
- **Performance** : Jointures optimisées entre `user_points`, `profiles`, `user_levels`

#### `check_user_achievements(user_id)`
Identifie les succès non encore débloqués pour un utilisateur donné
- **Paramètres** : ID utilisateur
- **Retour** : Liste des achievements disponibles
- **Logique** : Exclusion des achievements déjà complétés

#### `award_achievement_points(user_id, achievement_id, points)`
Marque un succès comme complété et attribue les points correspondants
- **Paramètres** : ID utilisateur, ID achievement, points à attribuer
- **Fonctionnalité** : Met à jour `user_achievements` et appelle `award_user_points`
- **Atomicité** : Transaction garantie pour cohérence des données

### Fonctions d'administration

#### `get_users_for_admin(limit, offset, search, role_filter)`
Interface administrative pour la gestion des utilisateurs
- **Paramètres** : Pagination, recherche textuelle, filtrage par rôle
- **Retour** : Liste enrichie avec statistiques d'activité
- **Fonctionnalité** : Recherche dans username et full_name, filtres admin/banned/user
- **Performance** : Pagination efficace avec LIMIT/OFFSET

#### `moderate_contribution(contribution_id, admin_id, status, reason)`
Modération des contributions utilisateur par les administrateurs
- **Paramètres** : ID contribution, ID admin, nouveau statut, raison optionnelle
- **Validation** : Vérification des permissions administrateur
- **Audit** : Enregistrement automatique dans `admin_logs`
- **Statuts** : approved, rejected, pending

#### `toggle_user_ban(user_id, admin_id, banned)`
Gestion du bannissement/débannissement des utilisateurs
- **Paramètres** : ID utilisateur, ID admin, statut de bannissement
- **Sécurité** : Vérification des permissions admin obligatoire
- **Audit** : Traçabilité complète dans les logs administratifs

#### `get_admin_logs_with_profiles(limit)`
Récupération des logs administratifs avec informations des administrateurs
- **Paramètres** : Limite de résultats
- **Retour** : Logs enrichis avec noms des administrateurs
- **Tri** : Chronologique décroissant pour suivi des actions récentes

### Fonctions de validation et analyse

#### `calculate_annotation_validation_score(annotation_id)`
Calcul du score de validation communautaire pour les annotations
- **Paramètres** : ID annotation
- **Algorithme** : Ratio votes positifs/total des votes
- **Retour** : Score entre 0.0 et 1.0
- **Gestion** : Retourne 0.0 si aucun vote

#### `update_annotation_validation_status()`
Trigger automatique de mise à jour du statut de validation
- **Déclenchement** : Insertion/modification dans `validation_votes`
- **Logique** : Validation automatique si score ≥ 0.7 avec minimum 3 votes
- **Seuils** : Rejet automatique si score ≤ 0.3 avec minimum 3 votes

#### `process_ai_pattern_suggestions(image_id, image_type)`
Initialisation du traitement IA pour suggestions de motifs
- **Paramètres** : ID image, type d'image
- **Fonctionnalité** : Crée une entrée en attente dans `ai_pattern_suggestions`
- **Intégration** : Préparation pour traitement asynchrone via Edge Functions

### Fonctions utilitaires

#### `update_updated_at_column()`
Trigger générique de mise à jour automatique des timestamps
- **Usage** : Appliqué sur plusieurs tables sensibles aux modifications
- **Fonctionnalité** : Met à jour `updated_at` automatiquement sur UPDATE

#### `get_top_contributors(limit)`
Classement des meilleurs contributeurs de la plateforme
- **Paramètres** : Limite de résultats
- **Critères** : Nombre de contributions et points totaux
- **Exclusion** : Utilisateurs sans contributions

#### `is_admin()`
Vérification sécurisée du statut administrateur de l'utilisateur actuel
- **Sécurité** : SECURITY DEFINER pour accès aux profils
- **Usage** : Intégration dans les politiques RLS
- **Performance** : Fonction stable pour optimisation

### Fonctions de gestion communautaire

#### `increment_group_members_count()` / `decrement_group_members_count()`
Triggers de maintenance automatique des compteurs de membres
- **Déclenchement** : INSERT/DELETE dans `group_members`
- **Fonctionnalité** : Synchronisation du champ `members_count` dénormalisé
- **Performance** : Évite les requêtes COUNT coûteuses

#### `handle_new_user()`
Trigger de création automatique du profil lors de l'inscription
- **Déclenchement** : INSERT dans auth.users
- **Fonctionnalité** : Extraction et insertion des métadonnées utilisateur
- **Intégration** : Synchronisation avec le système d'authentification Supabase

## Sécurité et politiques d'accès

### Row Level Security (RLS)
- **État actuel** : Tables configurées pour RLS mais politiques non implémentées
- **Recommandation** : Implémentation urgente des politiques pour sécurisation
- **Portée** : Toutes les tables contenant des données utilisateur

### Politiques RLS recommandées

#### Tables utilisateur
```sql
-- Profils : accès lecture public, modification propriétaire uniquement
CREATE POLICY "Profiles are publicly readable" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Points : lecture par propriétaire et admins
CREATE POLICY "Users can view own points" ON user_points FOR SELECT USING (auth.uid() = user_id OR is_admin());

-- Activités : accès propriétaire uniquement
CREATE POLICY "Users can view own activities" ON user_activities FOR SELECT USING (auth.uid() = user_id);
```

#### Tables de contenu
```sql
-- Symboles : lecture publique, modification admin
CREATE POLICY "Symbols are publicly readable" ON symbols FOR SELECT USING (true);
CREATE POLICY "Admins can manage symbols" ON symbols FOR ALL USING (is_admin());

-- Contributions : créateur et admins
CREATE POLICY "Users can view own contributions" ON user_contributions FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users can create contributions" ON user_contributions FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Audit et traçabilité

#### Logs administratifs
- **Couverture** : Toutes les actions sensibles d'administration
- **Rétention** : Conservation permanente pour conformité
- **Accès** : Administrateurs uniquement avec fonction dédiée

#### Activités utilisateur
- **Granularité** : Enregistrement détaillé par type d'activité
- **Performance** : Index optimisés pour requêtes fréquentes
- **Analytics** : Base pour tableaux de bord et rapports

## Optimisations et performance

### Stratégies de cache et dénormalisation

#### Compteurs dénormalisés
- `interest_groups.members_count` : Évite COUNT(*) sur group_members
- `interest_groups.discoveries_count` : Cache des métriques d'activité
- `group_posts.likes_count` : Performance d'affichage des posts
- `group_posts.comments_count` : Évite jointures complexes

#### Cache mobile
- `mobile_cache_data` : Stockage structuré pour mode hors ligne
- `mobile_sync_queue` : File d'attente robuste avec retry automatique
- Expiration automatique des caches périmés

### Index de performance critique

#### Index de recherche
- **GIN sur texte** : Recherche full-text sur noms et descriptions
- **GiST géospatial** : Requêtes de proximité géographique
- **B-tree composites** : Jointures multi-tables optimisées

#### Index de tri et filtrage
- Timestamps pour tri chronologique
- Statuts pour filtrage des contributions
- User_id pour isolation des données par utilisateur

### Pagination et requêtes optimisées

#### Stratégies de pagination
- LIMIT/OFFSET pour pagination simple
- Cursor-based pour grandes collections
- Compteurs précalculés pour métadonnées

#### Requêtes avec jointures
- LEFT JOIN systématique pour données optionnelles
- Projection limitée aux colonnes nécessaires
- Sous-requêtes optimisées pour agrégations

## Architecture des données multilingues

### Stratégie de traduction

#### Tables principales
- Champ `translations` JSONB avec structure `{"en": {...}, "fr": {...}}`
- Support extensible pour nouvelles langues
- Fallback automatique vers langue par défaut

#### Tables spécialisées
- `collection_translations` : Traductions dédiées pour collections
- Triggers automatiques de synchronisation des traductions
- Validation de la structure JSON pour cohérence

### Gestion des langues

#### Langues supportées
- **Principale** : Français (fr) - langue de référence
- **Secondaire** : Anglais (en) - traduction systématique
- **Extension** : Architecture prête pour nouvelles langues

#### Validation et cohérence
- Triggers de vérification de la structure JSON
- Création automatique des champs traduits
- Synchronisation bidirectionnelle champs natifs ↔ traductions

## Mobile et synchronisation

### Architecture hors ligne

#### Stratégie de cache
- Cache intelligent par type de contenu
- Expiration basée sur la fréquence d'usage
- Synchronisation différentielle pour optimisation bande passante

#### File de synchronisation
- Queue robuste avec gestion d'erreurs
- Retry automatique avec backoff exponentiel
- Résolution de conflits pour modifications concurrentes

### Performance mobile

#### Optimisations spécifiques
- Compression des données JSON pour transfert
- Pagination adaptative selon la connexion
- Cache prédictif basé sur les habitudes utilisateur

## Recommandations d'amélioration urgentes

### 1. Sécurité critique
- **Implémentation RLS** : Politiques manquantes sur toutes les tables
- **Audit complet** : Vérification des permissions et accès
- **Chiffrement** : Données sensibles et communications

### 2. Performance
- **Index manquants** : Création des index de performance listés
- **Requêtes lentes** : Optimisation des jointures complexes
- **Cache applicatif** : Implémentation Redis pour données fréquentes

### 3. Intégrité des données
- **Contraintes FK** : Ajout de toutes les clés étrangères manquantes
- **Validations** : Contraintes CHECK pour cohérence métier
- **Triggers** : Automatisation de la maintenance des données

### 4. Monitoring
- **Métriques** : Suivi des performances et utilisation
- **Alertes** : Notifications des problèmes critiques
- **Logs** : Centralisation et analyse des événements

Cette documentation complète reflète l'état réel de la base de données avec 42 tables actives et constitue la référence technique définitive pour le développement et la maintenance de la plateforme Cultural Heritage Symbols.
