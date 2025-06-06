

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
- username (text) : Nom d'utilisateur unique
- full_name (text) : Nom complet de l'utilisateur
- is_admin (boolean) : Statut administrateur (défaut: false)
- is_banned (boolean) : Statut de bannissement (défaut: false)
- created_at, updated_at (timestamp with time zone)
```

#### `user_points`
Système de points gamifiés par catégorie
```sql
- id (uuid, PK)
- user_id (uuid) : Référence à profiles.id
- total (integer) : Total des points (défaut: 0)
- contribution_points (integer) : Points de contribution (défaut: 0)
- exploration_points (integer) : Points d'exploration (défaut: 0)
- validation_points (integer) : Points de validation (défaut: 0)
- community_points (integer) : Points communautaires (défaut: 0)
- created_at, updated_at (timestamp with time zone)
```

#### `user_levels`
Niveaux d'expérience des utilisateurs
```sql
- id (uuid, PK)
- user_id (uuid) : Référence à profiles.id
- level (integer) : Niveau actuel (défaut: 1)
- xp (integer) : Points d'expérience actuels (défaut: 0)
- next_level_xp (integer) : XP requis pour le niveau suivant (défaut: 100)
- created_at, updated_at (timestamp with time zone)
```

#### `user_activities`
Journal des activités utilisateur pour le système de points
```sql
- id (uuid, PK)
- user_id (uuid) : Référence à profiles.id
- activity_type (text) : Type d'activité (contribution, exploration, etc.)
- entity_id (uuid) : ID de l'entité concernée
- points_earned (integer) : Points gagnés (défaut: 0)
- details (jsonb) : Métadonnées de l'activité
- created_at (timestamp with time zone)
```

#### `user_achievements`
Succès débloqués par les utilisateurs
```sql
- id (uuid, PK)
- user_id (uuid) : Référence à profiles.id
- achievement_id (uuid) : Référence à achievements.id
- progress (integer) : Progression vers le succès (défaut: 0)
- completed (boolean) : Succès débloqué (défaut: false)
- earned_at (timestamp with time zone) : Date d'obtention
- created_at, updated_at (timestamp with time zone)
```

#### `user_badges`
Badges attribués aux utilisateurs
```sql
- id (uuid, PK)
- user_id (uuid) : Référence à profiles.id
- badge_type (text) : Type de badge
- badge_name (text) : Nom du badge
- awarded_at (timestamp with time zone) : Date d'attribution
- created_at (timestamp with time zone)
```

#### `user_follows`
Relations de suivi entre utilisateurs
```sql
- id (uuid, PK)
- follower_id (uuid) : Utilisateur qui suit
- followed_id (uuid) : Utilisateur suivi
- created_at (timestamp with time zone)
```

### Tables de contenu principal

#### `symbols`
Table centrale des symboles culturels
```sql
- id (uuid, PK)
- name (text) : Nom du symbole
- culture (text) : Culture d'origine
- period (text) : Période historique
- description (text) : Description détaillée
- medium (text[]) : Support/matériau (défaut: {})
- technique (text[]) : Techniques utilisées (défaut: {})
- function (text[]) : Fonctions du symbole (défaut: {})
- translations (jsonb) : Traductions multilingues (défaut: {})
- created_at, updated_at (timestamp with time zone)
```

#### `symbol_images`
Images associées aux symboles
```sql
- id (uuid, PK)
- symbol_id (uuid) : Référence à symbols.id
- image_url (text) : URL de l'image
- image_type (user-defined type) : Type d'image (enum avec valeurs définies)
- title (text) : Titre de l'image
- description (text) : Description
- location (text) : Lieu de prise de vue
- source (text) : Source de l'image
- tags (text[]) : Tags descriptifs
- translations (jsonb) : Traductions (défaut: {})
- created_at (timestamp with time zone)
```

#### `symbol_locations`
Géolocalisation des symboles
```sql
- id (uuid, PK)
- symbol_id (uuid) : Référence à symbols.id
- name (text) : Nom du lieu
- culture (text) : Culture associée
- description (text) : Description du lieu
- latitude, longitude (numeric) : Coordonnées GPS
- source (text) : Source de la localisation
- historical_period (text) : Période historique
- is_verified (boolean) : Statut de vérification (défaut: false)
- verification_status (user-defined type) : Statut détaillé
- created_by, verified_by (uuid) : Utilisateurs
- translations (jsonb) : Traductions (défaut: {})
- created_at, updated_at (timestamp with time zone)
```

#### `symbol_connections`
Relations entre symboles
```sql
- id (uuid, PK)
- symbol_id_1, symbol_id_2 (uuid) : Références à symbols.id
- relationship_type (text) : Type de relation
- description (text) : Description de la relation
- created_by (uuid) : Référence à profiles.id
- translations (jsonb) : Traductions (défaut: {})
- created_at, updated_at (timestamp with time zone)
```

#### `symbol_taxonomy`
Classification hiérarchique des symboles
```sql
- id (uuid, PK)
- name (text) : Nom de la catégorie
- description (text) : Description
- parent_id (uuid) : Référence à symbol_taxonomy.id (parent)
- level (integer) : Niveau dans la hiérarchie (défaut: 1)
- translations (jsonb) : Traductions (défaut: {})
- created_at, updated_at (timestamp with time zone)
```

#### `symbol_taxonomy_mapping`
Liaison symboles-taxonomie
```sql
- id (uuid, PK)
- symbol_id (uuid) : Référence à symbols.id
- taxonomy_id (uuid) : Référence à symbol_taxonomy.id
- created_at (timestamp with time zone)
```

#### `patterns`
Motifs extraits des symboles
```sql
- id (uuid, PK)
- name (text) : Nom du motif
- description (text) : Description
- symbol_id (uuid) : Référence à symbols.id
- pattern_type (text) : Type (défaut: 'geometric')
- complexity_level (text) : Niveau de complexité (défaut: 'simple')
- cultural_significance (text) : Signification culturelle
- historical_context (text) : Contexte historique
- created_by (uuid) : Référence à profiles.id
- translations (jsonb) : Traductions (défaut: {"en": {}, "fr": {}})
- created_at, updated_at (timestamp with time zone)
```

### Tables de contributions

#### `user_contributions`
Contributions soumises par les utilisateurs
```sql
- id (uuid, PK)
- user_id (uuid) : Référence à profiles.id
- title (text) : Titre de la contribution
- description (text) : Description
- location_name (text) : Nom du lieu
- latitude, longitude (numeric) : Coordonnées
- cultural_context (text) : Contexte culturel
- period (text) : Période
- status (text) : Statut (défaut: 'pending')
- reviewed_by (uuid) : Référence à profiles.id (modérateur)
- reviewed_at (timestamp with time zone) : Date de révision
- title_translations (jsonb) : Traductions du titre (défaut: {"en": null, "fr": null})
- description_translations (jsonb) : Traductions de la description
- cultural_context_translations (jsonb) : Traductions du contexte
- period_translations (jsonb) : Traductions de la période
- location_name_translations (jsonb) : Traductions du lieu
- created_at, updated_at (timestamp with time zone)
```

#### `contribution_images`
Images des contributions
```sql
- id (uuid, PK)
- contribution_id (uuid) : Référence à user_contributions.id
- image_url (text) : URL de l'image
- image_type (text) : Type d'image (défaut: 'original')
- annotations (jsonb) : Annotations sur l'image
- extracted_pattern_url (text) : URL du motif extrait
- created_at (timestamp with time zone)
```

#### `contribution_tags`
Tags associés aux contributions
```sql
- id (uuid, PK)
- contribution_id (uuid) : Référence à user_contributions.id
- tag (text) : Tag
- tag_translations (jsonb) : Traductions du tag (défaut: {"en": null, "fr": null})
- created_at (timestamp with time zone)
```

#### `contribution_comments`
Commentaires sur les contributions
```sql
- id (uuid, PK)
- contribution_id (uuid) : Référence à user_contributions.id
- user_id (uuid) : Référence à profiles.id
- comment (text) : Contenu du commentaire
- comment_translations (jsonb) : Traductions (défaut: {"en": null, "fr": null})
- created_at (timestamp with time zone)
```

### Tables des collections

#### `collections`
Collections de symboles
```sql
- id (uuid, PK)
- slug (text) : Identifiant URL unique
- created_by (uuid) : Référence à profiles.id
- is_featured (boolean) : Collection mise en avant (défaut: false)
- created_at, updated_at (timestamp with time zone)
```

#### `collection_translations`
Traductions des collections
```sql
- id (integer, PK, auto-increment) : Clé primaire séquentielle
- collection_id (uuid) : Référence à collections.id
- language (text) : Code langue (en, fr)
- title (text) : Titre traduit
- description (text) : Description traduite
```

#### `collection_symbols`
Liaison collections-symboles
```sql
- collection_id (uuid) : Référence à collections.id
- symbol_id (uuid) : Référence à symbols.id
- position (integer) : Position dans la collection (défaut: 0)
Note: Pas de contrainte de clé primaire composite définie actuellement
```

#### `collection_items`
Items dans les collections de groupes
```sql
- id (uuid, PK)
- collection_id (uuid) : Référence à group_symbol_collections.id
- symbol_id (uuid) : Référence à symbols.id
- added_by (uuid) : Référence à profiles.id
- notes (text) : Notes sur l'ajout
- translations (jsonb) : Traductions (défaut: {"en": {}, "fr": {}})
- created_at (timestamp with time zone)
```

### Tables communautaires

#### `interest_groups`
Groupes d'intérêt thématiques
```sql
- id (uuid, PK)
- name (text) : Nom du groupe
- slug (text) : Identifiant URL unique
- description (text) : Description
- icon (text) : Icône du groupe
- banner_image (text) : Image bannière
- theme_color (text) : Couleur thématique
- is_public (boolean) : Groupe public/privé (défaut: true)
- created_by (uuid) : Référence à profiles.id
- members_count (integer) : Nombre de membres (défaut: 0)
- discoveries_count (integer) : Nombre de découvertes (défaut: 0)
- translations (jsonb) : Traductions (défaut: {"en": {}, "fr": {}})
- created_at, updated_at (timestamp with time zone)
```

#### `group_members`
Membres des groupes d'intérêt
```sql
- id (uuid, PK)
- group_id (uuid) : Référence à interest_groups.id
- user_id (uuid) : Référence à profiles.id
- role (text) : Rôle (défaut: 'member')
- joined_at (timestamp with time zone)
```

#### `group_posts`
Publications dans les groupes
```sql
- id (uuid, PK)
- group_id (uuid) : Référence à interest_groups.id
- user_id (uuid) : Référence à profiles.id
- content (text) : Contenu du post
- likes_count (integer) : Nombre de likes (défaut: 0)
- comments_count (integer) : Nombre de commentaires (défaut: 0)
- translations (jsonb) : Traductions (défaut: {"en": {}, "fr": {}})
- created_at, updated_at (timestamp with time zone)
```

#### `group_symbol_collections`
Collections de symboles dans les groupes
```sql
- id (uuid, PK)
- group_id (uuid) : Référence à interest_groups.id
- name (text) : Nom de la collection
- description (text) : Description
- created_by (uuid) : Référence à profiles.id
- translations (jsonb) : Traductions (défaut: {"en": {}, "fr": {}})
- created_at, updated_at (timestamp with time zone)
```

#### `post_likes`
Likes sur les publications
```sql
- id (uuid, PK)
- post_id (uuid) : Référence à group_posts.id
- user_id (uuid) : Référence à profiles.id
- created_at (timestamp with time zone)
```

#### `post_comments`
Commentaires sur les publications
```sql
- id (uuid, PK)
- post_id (uuid) : Référence à group_posts.id
- user_id (uuid) : Référence à profiles.id
- content (text) : Contenu du commentaire
- translations (jsonb) : Traductions (défaut: {"en": {}, "fr": {}})
- created_at, updated_at (timestamp with time zone)
```

#### `direct_messages`
Messages privés entre utilisateurs
```sql
- id (uuid, PK)
- sender_id (uuid) : Référence à profiles.id
- receiver_id (uuid) : Référence à profiles.id
- content (text) : Contenu du message
- read (boolean) : Message lu (défaut: false)
- created_at (timestamp with time zone)
```

### Tables d'administration

#### `admin_logs`
Logs des actions administratives
```sql
- id (uuid, PK)
- admin_id (uuid) : Référence à profiles.id
- action (text) : Action effectuée
- entity_type (text) : Type d'entité concernée
- entity_id (uuid) : ID de l'entité
- details (jsonb) : Détails de l'action (défaut: {})
- created_at (timestamp with time zone)
```

#### `achievements`
Définition des succès disponibles
```sql
- id (uuid, PK)
- name (text) : Nom du succès
- description (text) : Description
- icon (text) : Icône
- points (integer) : Points attribués (défaut: 10)
- type (text) : Type (contribution, exploration, validation, community)
- level (text) : Niveau (bronze, silver, gold, platinum)
- requirement (integer) : Nombre requis pour débloquer (défaut: 1)
- translations (jsonb) : Traductions (défaut: {})
- created_at, updated_at (timestamp with time zone)
```

#### `notifications`
Système de notifications
```sql
- id (uuid, PK)
- user_id (uuid) : Référence à profiles.id
- type (text) : Type de notification
- content (jsonb) : Contenu de la notification
- read (boolean) : Notification lue (défaut: false)
- created_at (timestamp with time zone)
```

### Tables de contenu éditorial

#### `content_sections`
Sections de contenu pour les pages
```sql
- id (uuid, PK)
- section_key (text) : Clé unique de la section
- title (jsonb) : Titre multilingue (défaut: {"en": "", "fr": ""})
- subtitle (jsonb) : Sous-titre multilingue (défaut: {"en": "", "fr": ""})
- content (jsonb) : Contenu multilingue (défaut: {"en": "", "fr": ""})
- created_at, updated_at (timestamp with time zone)
```

#### `roadmap_items`
Éléments de la roadmap produit
```sql
- id (uuid, PK)
- phase (text) : Phase de développement
- title (jsonb) : Titre multilingue (défaut: {"en": "", "fr": ""})
- description (jsonb) : Description multilingue (défaut: {"en": "", "fr": ""})
- is_current (boolean) : Phase actuelle (défaut: false)
- is_completed (boolean) : Phase terminée (défaut: false)
- display_order (integer) : Ordre d'affichage (défaut: 0)
- created_at, updated_at (timestamp with time zone)
```

#### `testimonials`
Témoignages utilisateurs
```sql
- id (uuid, PK)
- name (text) : Nom du témoin
- initials (text) : Initiales
- image_url (text) : Photo de profil
- role (jsonb) : Rôle multilingue (défaut: {"en": "", "fr": ""})
- quote (jsonb) : Citation multilingue (défaut: {"en": "", "fr": ""})
- display_order (integer) : Ordre d'affichage (défaut: 0)
- is_active (boolean) : Témoignage actif (défaut: true)
- created_at, updated_at (timestamp with time zone)
```

#### `partners`
Partenaires de la plateforme
```sql
- id (uuid, PK)
- name (text) : Nom du partenaire
- logo_url (text) : Logo
- website_url (text) : Site web
- description (jsonb) : Description multilingue (défaut: {"en": "", "fr": ""})
- display_order (integer) : Ordre d'affichage (défaut: 0)
- is_active (boolean) : Partenaire actif (défaut: true)
- created_at, updated_at (timestamp with time zone)
```

### Tables techniques et IA

#### `ai_pattern_suggestions`
Suggestions de motifs par IA
```sql
- id (uuid, PK)
- image_id (uuid) : ID de l'image analysée
- image_type (text) : Type d'image (défaut: 'symbol')
- suggested_patterns (jsonb) : Motifs suggérés
- processing_status (text) : Statut du traitement (défaut: 'pending')
- ai_model_version (text) : Version du modèle IA
- processing_time_ms (integer) : Temps de traitement
- error_message (text) : Message d'erreur
- created_at (timestamp with time zone)
- processed_at (timestamp with time zone)
```

#### `image_annotations`
Annotations d'images
```sql
- id (uuid, PK)
- image_id (uuid) : ID de l'image
- image_type (text) : Type d'image (défaut: 'symbol')
- pattern_id (uuid) : Référence à patterns.id
- annotation_data (jsonb) : Données géométriques
- confidence_score (numeric) : Score de confiance (défaut: 0.0)
- validation_status (text) : Statut de validation (défaut: 'pending')
- notes (text) : Notes
- created_by, validated_by (uuid) : Références à profiles.id
- translations (jsonb) : Traductions (défaut: {"en": {}, "fr": {}})
- created_at, updated_at (timestamp with time zone)
```

#### `validation_votes`
Votes de validation des annotations
```sql
- id (uuid, PK)
- annotation_id (uuid) : Référence à image_annotations.id
- user_id (uuid) : Référence à profiles.id
- vote_type (text) : Type de vote (approve, reject, needs_review)
- comment (text) : Commentaire
- created_at (timestamp with time zone)
```

#### `analysis_examples`
Exemples d'analyse pour la documentation
```sql
- id (uuid, PK)
- title (text) : Titre de l'exemple
- description (text) : Description
- original_image_url (text) : Image originale
- detection_image_url (text) : Image avec détection
- extraction_image_url (text) : Image avec extraction
- classification_image_url (text) : Image avec classification
- tags (text[]) : Tags (défaut: {})
- created_at, updated_at (timestamp with time zone)
```

### Tables mobiles

#### `mobile_field_notes`
Notes de terrain prises sur mobile
```sql
- id (uuid, PK)
- user_id (uuid) : Référence à profiles.id
- content (text) : Contenu de la note
- location (jsonb) : Données de géolocalisation
- timestamp (bigint) : Timestamp Unix
- images (jsonb) : URLs des images (défaut: [])
- audio_url (text) : URL de l'enregistrement audio
- synced (boolean) : Synchronisé avec le serveur (défaut: false)
- created_at, updated_at (timestamp with time zone)
```

#### `mobile_sync_queue`
File d'attente de synchronisation mobile
```sql
- id (uuid, PK)
- user_id (uuid) : Référence à profiles.id
- entity_type (text) : Type d'entité à synchroniser
- action_type (text) : Type d'action (create, update, delete)
- local_id (text) : ID local de l'entité
- entity_data (jsonb) : Données de l'entité
- server_id (uuid) : ID serveur après sync
- processed (boolean) : Traitement terminé (défaut: false)
- retry_count (integer) : Nombre de tentatives (défaut: 0)
- error_message (text) : Message d'erreur
- created_at (timestamp with time zone)
- processed_at (timestamp with time zone)
```

#### `mobile_cache_data`
Cache de données pour mode hors ligne
```sql
- id (uuid, PK)
- user_id (uuid) : Référence à profiles.id
- cache_type (text) : Type de cache
- cache_key (text) : Clé de cache
- data (jsonb) : Données mises en cache
- expires_at (timestamp with time zone) : Date d'expiration
- created_at, updated_at (timestamp with time zone)
```

## Types personnalisés et énumérations

### Types USER-DEFINED existants

#### `symbol_location_verification_status`
Énumération pour le statut de vérification des localisations :
- `unverified` : Non vérifié
- `pending` : En cours de vérification
- `verified` : Vérifié
- `disputed` : Contesté

#### Types d'images (symbol_images.image_type)
Énumération pour les types d'images de symboles (à définir selon les besoins métier)

## État actuel de l'intégrité référentielle

### ⚠️ Note importante sur les clés étrangères
**La base de données actuelle ne possède AUCUNE contrainte de clé étrangère définie.** 
Toutes les relations documentées ci-dessus sont des relations logiques mais ne sont pas enforced au niveau de la base de données.

### Recommandations d'amélioration

#### 1. Ajout des contraintes de clés étrangères
```sql
-- Exemples de contraintes à ajouter
ALTER TABLE user_points ADD CONSTRAINT fk_user_points_user_id 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE symbols ADD CONSTRAINT fk_symbols_created_by 
  FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE SET NULL;

ALTER TABLE collection_symbols ADD CONSTRAINT fk_collection_symbols_collection_id 
  FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE;

ALTER TABLE collection_symbols ADD CONSTRAINT fk_collection_symbols_symbol_id 
  FOREIGN KEY (symbol_id) REFERENCES symbols(id) ON DELETE CASCADE;
```

#### 2. Ajout d'index pour les performances
```sql
-- Index sur les colonnes fréquemment utilisées pour les jointures
CREATE INDEX idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX idx_symbol_images_symbol_id ON symbol_images(symbol_id);
CREATE INDEX idx_collection_symbols_collection_id ON collection_symbols(collection_id);
```

#### 3. Contraintes de données manquantes
```sql
-- Contraintes d'unicité
ALTER TABLE profiles ADD CONSTRAINT uk_profiles_username UNIQUE (username);
ALTER TABLE collections ADD CONSTRAINT uk_collections_slug UNIQUE (slug);
ALTER TABLE interest_groups ADD CONSTRAINT uk_interest_groups_slug UNIQUE (slug);

-- Clé primaire composite pour collection_symbols
ALTER TABLE collection_symbols ADD CONSTRAINT pk_collection_symbols 
  PRIMARY KEY (collection_id, symbol_id);
```

## Fonctions de base de données

### Fonctions de gamification

#### `award_user_points(user_id, activity_type, points, entity_id, details)`
Attribue des points à un utilisateur et met à jour son total
- Insère une activité dans `user_activities`
- Met à jour les points par catégorie dans `user_points`
- Gère la création ou mise à jour des enregistrements

#### `get_leaderboard(limit)`
Récupère le classement des utilisateurs
- Retourne les top utilisateurs avec leurs points et niveaux
- Joint `user_points`, `profiles`, et `user_levels`

#### `check_user_achievements(user_id)`
Vérifie les succès non débloqués pour un utilisateur
- Retourne les achievements disponibles non complétés

#### `award_achievement_points(user_id, achievement_id, points)`
Marque un succès comme complété et attribue les points
- Met à jour `user_achievements`
- Ajoute les points via `award_user_points`

### Fonctions d'administration

#### `get_users_for_admin(limit, offset, search, role_filter)`
Récupère la liste des utilisateurs pour l'interface admin
- Filtrage par recherche textuelle et rôle
- Pagination intégrée
- Statistiques d'activité incluses

#### `moderate_contribution(contribution_id, admin_id, status, reason)`
Modère une contribution utilisateur
- Vérifie les permissions admin
- Met à jour le statut de la contribution
- Enregistre l'action dans `admin_logs`

#### `toggle_user_ban(user_id, admin_id, banned)`
Active ou désactive le bannissement d'un utilisateur
- Vérifie les permissions admin
- Met à jour `profiles.is_banned`
- Enregistre l'action dans `admin_logs`

#### `get_admin_logs_with_profiles(limit)`
Récupère les logs admin avec les informations des administrateurs
- Joint `admin_logs` et `profiles`
- Trie par date décroissante

### Fonctions de validation et analyse

#### `calculate_annotation_validation_score(annotation_id)`
Calcule le score de validation d'une annotation
- Compte les votes approve/reject dans `validation_votes`
- Retourne un score entre 0 et 1

#### `update_annotation_validation_status()`
Trigger qui met à jour automatiquement le statut de validation
- Déclenché lors d'ajout de vote dans `validation_votes`
- Met à jour `image_annotations.validation_status`

#### `process_ai_pattern_suggestions(image_id, image_type)`
Lance le traitement IA pour suggestions de motifs
- Crée une entrée dans `ai_pattern_suggestions`
- Statut initial 'pending' pour traitement asynchrone

### Fonctions utilitaires

#### `update_updated_at_column()`
Trigger générique pour mettre à jour `updated_at`
- Utilisé sur plusieurs tables
- Déclenché automatiquement sur UPDATE

#### `get_top_contributors(limit)`
Récupère les meilleurs contributeurs
- Compte les contributions par utilisateur
- Inclut les points totaux

#### `is_admin()`
Vérifie si l'utilisateur connecté est administrateur
- Utilisé dans les RLS policies
- Sécurisé avec SECURITY DEFINER

## Sécurité et audit

### Row Level Security (RLS)
Les tables sont configurées pour RLS mais les politiques ne sont pas encore implémentées.

### Audit et traçabilité
- Table `admin_logs` pour toutes les actions administratives
- Table `user_activities` pour le suivi des actions utilisateur
- Timestamps automatiques sur toutes les tables

## Optimisations et performance

### Stratégies de cache
- Cache mobile via `mobile_cache_data`
- Dénormalisation des compteurs (members_count, etc.)
- Index optimisés pour les requêtes fréquentes (à implémenter)

### Pagination et requêtes
- Support natif de la pagination avec LIMIT/OFFSET
- Requêtes optimisées avec jointures appropriées
- Utilisation de jsonb pour les données semi-structurées

---

*Cette documentation reflète la structure RÉELLE de la base de données Cultural Heritage Symbols.*
*Dernière mise à jour: Décembre 2024*
*Version: 4.7.0 - Corrigée selon l'état actuel de la base*

