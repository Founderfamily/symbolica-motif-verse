
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
- is_admin (boolean) : Statut administrateur
- is_banned (boolean) : Statut de bannissement
- created_at, updated_at (timestamptz)
```

#### `user_points`
Système de points gamifiés par catégorie
```sql
- id (uuid, PK)
- user_id (uuid, FK profiles.id)
- total (integer) : Total des points
- contribution_points (integer) : Points de contribution
- exploration_points (integer) : Points d'exploration
- validation_points (integer) : Points de validation
- community_points (integer) : Points communautaires
- created_at, updated_at (timestamptz)
```

#### `user_levels`
Niveaux d'expérience des utilisateurs
```sql
- id (uuid, PK)
- user_id (uuid, FK profiles.id)
- level (integer) : Niveau actuel (1-∞)
- xp (integer) : Points d'expérience actuels
- next_level_xp (integer) : XP requis pour le niveau suivant
- created_at, updated_at (timestamptz)
```

#### `user_activities`
Journal des activités utilisateur pour le système de points
```sql
- id (uuid, PK)
- user_id (uuid, FK profiles.id)
- activity_type (text) : Type d'activité (contribution, exploration, etc.)
- entity_id (uuid) : ID de l'entité concernée
- points_earned (integer) : Points gagnés
- details (jsonb) : Métadonnées de l'activité
- created_at (timestamptz)
```

#### `user_achievements`
Succès débloqués par les utilisateurs
```sql
- id (uuid, PK)
- user_id (uuid, FK profiles.id)
- achievement_id (uuid, FK achievements.id)
- progress (integer) : Progression vers le succès
- completed (boolean) : Succès débloqué
- earned_at (timestamptz) : Date d'obtention
- created_at, updated_at (timestamptz)
```

#### `user_badges`
Badges attribués aux utilisateurs
```sql
- id (uuid, PK)
- user_id (uuid, FK profiles.id)
- badge_type (text) : Type de badge
- badge_name (text) : Nom du badge
- awarded_at (timestamptz) : Date d'attribution
- created_at (timestamptz)
```

#### `user_follows`
Relations de suivi entre utilisateurs
```sql
- id (uuid, PK)
- follower_id (uuid, FK profiles.id) : Utilisateur qui suit
- followed_id (uuid, FK profiles.id) : Utilisateur suivi
- created_at (timestamptz)
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
- medium (text[]) : Support/matériau
- technique (text[]) : Techniques utilisées
- function (text[]) : Fonctions du symbole
- translations (jsonb) : Traductions multilingues
- created_at, updated_at (timestamptz)
```

#### `symbol_images`
Images associées aux symboles
```sql
- id (uuid, PK)
- symbol_id (uuid, FK symbols.id)
- image_url (text) : URL de l'image
- image_type (enum) : Type (original, pattern, reuse)
- title (text) : Titre de l'image
- description (text) : Description
- location (text) : Lieu de prise de vue
- source (text) : Source de l'image
- tags (text[]) : Tags descriptifs
- translations (jsonb) : Traductions
- created_at (timestamptz)
```

#### `symbol_locations`
Géolocalisation des symboles
```sql
- id (uuid, PK)
- symbol_id (uuid, FK symbols.id)
- name (text) : Nom du lieu
- culture (text) : Culture associée
- description (text) : Description du lieu
- latitude, longitude (numeric) : Coordonnées GPS
- source (text) : Source de la localisation
- historical_period (text) : Période historique
- is_verified (boolean) : Statut de vérification
- verification_status (enum) : Statut détaillé
- created_by, verified_by (uuid) : Utilisateurs
- translations (jsonb)
- created_at, updated_at (timestamptz)
```

#### `symbol_connections`
Relations entre symboles
```sql
- id (uuid, PK)
- symbol_id_1, symbol_id_2 (uuid, FK symbols.id)
- relationship_type (text) : Type de relation
- description (text) : Description de la relation
- created_by (uuid, FK profiles.id)
- translations (jsonb)
- created_at, updated_at (timestamptz)
```

#### `symbol_taxonomy`
Classification hiérarchique des symboles
```sql
- id (uuid, PK)
- name (text) : Nom de la catégorie
- description (text) : Description
- parent_id (uuid, FK symbol_taxonomy.id) : Catégorie parent
- level (integer) : Niveau dans la hiérarchie
- translations (jsonb)
- created_at, updated_at (timestamptz)
```

#### `symbol_taxonomy_mapping`
Liaison symboles-taxonomie
```sql
- id (uuid, PK)
- symbol_id (uuid, FK symbols.id)
- taxonomy_id (uuid, FK symbol_taxonomy.id)
- created_at (timestamptz)
```

#### `patterns`
Motifs extraits des symboles
```sql
- id (uuid, PK)
- name (text) : Nom du motif
- description (text) : Description
- symbol_id (uuid, FK symbols.id)
- pattern_type (text) : Type (geometric, figurative, abstract, decorative)
- complexity_level (text) : Niveau de complexité
- cultural_significance (text) : Signification culturelle
- historical_context (text) : Contexte historique
- created_by (uuid, FK profiles.id)
- translations (jsonb)
- created_at, updated_at (timestamptz)
```

### Tables de contributions

#### `user_contributions`
Contributions soumises par les utilisateurs
```sql
- id (uuid, PK)
- user_id (uuid, FK profiles.id)
- title (text) : Titre de la contribution
- description (text) : Description
- location_name (text) : Nom du lieu
- latitude, longitude (numeric) : Coordonnées
- cultural_context (text) : Contexte culturel
- period (text) : Période
- status (text) : Statut (pending, approved, rejected)
- reviewed_by (uuid, FK profiles.id) : Modérateur
- reviewed_at (timestamptz) : Date de révision
- title_translations, description_translations (jsonb) : Traductions
- cultural_context_translations, period_translations (jsonb)
- location_name_translations (jsonb)
- created_at, updated_at (timestamptz)
```

#### `contribution_images`
Images des contributions
```sql
- id (uuid, PK)
- contribution_id (uuid, FK user_contributions.id)
- image_url (text) : URL de l'image
- image_type (text) : Type d'image
- annotations (jsonb) : Annotations sur l'image
- extracted_pattern_url (text) : URL du motif extrait
- created_at (timestamptz)
```

#### `contribution_tags`
Tags associés aux contributions
```sql
- id (uuid, PK)
- contribution_id (uuid, FK user_contributions.id)
- tag (text) : Tag
- tag_translations (jsonb) : Traductions du tag
- created_at (timestamptz)
```

#### `contribution_comments`
Commentaires sur les contributions
```sql
- id (uuid, PK)
- contribution_id (uuid, FK user_contributions.id)
- user_id (uuid, FK profiles.id)
- comment (text) : Contenu du commentaire
- comment_translations (jsonb) : Traductions
- created_at (timestamptz)
```

### Tables des collections

#### `collections`
Collections de symboles
```sql
- id (uuid, PK)
- slug (text) : Identifiant URL unique
- created_by (uuid, FK profiles.id)
- is_featured (boolean) : Collection mise en avant
- created_at, updated_at (timestamptz)
```

#### `collection_translations`
Traductions des collections
```sql
- id (serial, PK)
- collection_id (uuid, FK collections.id)
- language (text) : Code langue (en, fr)
- title (text) : Titre traduit
- description (text) : Description traduite
```

#### `collection_symbols`
Liaison collections-symboles
```sql
- collection_id (uuid, FK collections.id)
- symbol_id (uuid, FK symbols.id)
- position (integer) : Position dans la collection
- PK(collection_id, symbol_id)
```

#### `collection_items`
Items dans les collections de groupes
```sql
- id (uuid, PK)
- collection_id (uuid, FK group_symbol_collections.id)
- symbol_id (uuid, FK symbols.id)
- added_by (uuid, FK profiles.id)
- notes (text) : Notes sur l'ajout
- translations (jsonb)
- created_at (timestamptz)
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
- is_public (boolean) : Groupe public/privé
- created_by (uuid, FK profiles.id)
- members_count (integer) : Nombre de membres
- discoveries_count (integer) : Nombre de découvertes
- translations (jsonb)
- created_at, updated_at (timestamptz)
```

#### `group_members`
Membres des groupes d'intérêt
```sql
- id (uuid, PK)
- group_id (uuid, FK interest_groups.id)
- user_id (uuid, FK profiles.id)
- role (text) : Rôle (member, admin, moderator)
- joined_at (timestamptz)
```

#### `group_posts`
Publications dans les groupes
```sql
- id (uuid, PK)
- group_id (uuid, FK interest_groups.id)
- user_id (uuid, FK profiles.id)
- content (text) : Contenu du post
- likes_count (integer) : Nombre de likes
- comments_count (integer) : Nombre de commentaires
- translations (jsonb)
- created_at, updated_at (timestamptz)
```

#### `group_symbol_collections`
Collections de symboles dans les groupes
```sql
- id (uuid, PK)
- group_id (uuid, FK interest_groups.id)
- name (text) : Nom de la collection
- description (text) : Description
- created_by (uuid, FK profiles.id)
- translations (jsonb)
- created_at, updated_at (timestamptz)
```

#### `post_likes`
Likes sur les publications
```sql
- id (uuid, PK)
- post_id (uuid, FK group_posts.id)
- user_id (uuid, FK profiles.id)
- created_at (timestamptz)
```

#### `post_comments`
Commentaires sur les publications
```sql
- id (uuid, PK)
- post_id (uuid, FK group_posts.id)
- user_id (uuid, FK profiles.id)
- content (text) : Contenu du commentaire
- translations (jsonb)
- created_at, updated_at (timestamptz)
```

#### `direct_messages`
Messages privés entre utilisateurs
```sql
- id (uuid, PK)
- sender_id (uuid, FK profiles.id)
- receiver_id (uuid, FK profiles.id)
- content (text) : Contenu du message
- read (boolean) : Message lu
- created_at (timestamptz)
```

### Tables d'administration

#### `admin_logs`
Logs des actions administratives
```sql
- id (uuid, PK)
- admin_id (uuid, FK profiles.id)
- action (text) : Action effectuée
- entity_type (text) : Type d'entité concernée
- entity_id (uuid) : ID de l'entité
- details (jsonb) : Détails de l'action
- created_at (timestamptz)
```

#### `achievements`
Définition des succès disponibles
```sql
- id (uuid, PK)
- name (text) : Nom du succès
- description (text) : Description
- icon (text) : Icône
- points (integer) : Points attribués
- type (text) : Type (contribution, exploration, validation, community)
- level (text) : Niveau (bronze, silver, gold, platinum)
- requirement (integer) : Nombre requis pour débloquer
- translations (jsonb)
- created_at, updated_at (timestamptz)
```

#### `notifications`
Système de notifications
```sql
- id (uuid, PK)
- user_id (uuid, FK profiles.id)
- type (text) : Type de notification
- content (jsonb) : Contenu de la notification
- read (boolean) : Notification lue
- created_at (timestamptz)
```

### Tables de contenu éditorial

#### `content_sections`
Sections de contenu pour les pages
```sql
- id (uuid, PK)
- section_key (text) : Clé unique de la section
- title (jsonb) : Titre multilingue
- subtitle (jsonb) : Sous-titre multilingue
- content (jsonb) : Contenu multilingue
- created_at, updated_at (timestamptz)
```

#### `roadmap_items`
Éléments de la roadmap produit
```sql
- id (uuid, PK)
- phase (text) : Phase de développement
- title (jsonb) : Titre multilingue
- description (jsonb) : Description multilingue
- is_current (boolean) : Phase actuelle
- is_completed (boolean) : Phase terminée
- display_order (integer) : Ordre d'affichage
- created_at, updated_at (timestamptz)
```

#### `testimonials`
Témoignages utilisateurs
```sql
- id (uuid, PK)
- name (text) : Nom du témoin
- initials (text) : Initiales
- image_url (text) : Photo de profil
- role (jsonb) : Rôle multilingue
- quote (jsonb) : Citation multilingue
- display_order (integer) : Ordre d'affichage
- is_active (boolean) : Témoignage actif
- created_at, updated_at (timestamptz)
```

#### `partners`
Partenaires de la plateforme
```sql
- id (uuid, PK)
- name (text) : Nom du partenaire
- logo_url (text) : Logo
- website_url (text) : Site web
- description (jsonb) : Description multilingue
- display_order (integer) : Ordre d'affichage
- is_active (boolean) : Partenaire actif
- created_at, updated_at (timestamptz)
```

### Tables techniques et IA

#### `ai_pattern_suggestions`
Suggestions de motifs par IA
```sql
- id (uuid, PK)
- image_id (uuid) : ID de l'image analysée
- image_type (text) : Type d'image (symbol, contribution)
- suggested_patterns (jsonb) : Motifs suggérés
- processing_status (text) : Statut du traitement
- ai_model_version (text) : Version du modèle IA
- processing_time_ms (integer) : Temps de traitement
- error_message (text) : Message d'erreur
- created_at (timestamptz)
- processed_at (timestamptz)
```

#### `image_annotations`
Annotations d'images
```sql
- id (uuid, PK)
- image_id (uuid) : ID de l'image
- image_type (text) : Type d'image
- pattern_id (uuid, FK patterns.id) : Motif associé
- annotation_data (jsonb) : Données géométriques
- confidence_score (numeric) : Score de confiance
- validation_status (text) : Statut de validation
- notes (text) : Notes
- created_by, validated_by (uuid, FK profiles.id)
- translations (jsonb)
- created_at, updated_at (timestamptz)
```

#### `validation_votes`
Votes de validation des annotations
```sql
- id (uuid, PK)
- annotation_id (uuid, FK image_annotations.id)
- user_id (uuid, FK profiles.id)
- vote_type (text) : Type de vote (approve, reject, needs_review)
- comment (text) : Commentaire
- created_at (timestamptz)
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
- tags (text[]) : Tags
- created_at, updated_at (timestamptz)
```

### Tables mobiles

#### `mobile_field_notes`
Notes de terrain prises sur mobile
```sql
- id (uuid, PK)
- user_id (uuid, FK profiles.id)
- content (text) : Contenu de la note
- location (jsonb) : Données de géolocalisation
- timestamp (bigint) : Timestamp Unix
- images (jsonb) : URLs des images
- audio_url (text) : URL de l'enregistrement audio
- synced (boolean) : Synchronisé avec le serveur
- created_at, updated_at (timestamptz)
```

#### `mobile_sync_queue`
File d'attente de synchronisation mobile
```sql
- id (uuid, PK)
- user_id (uuid, FK profiles.id)
- entity_type (text) : Type d'entité à synchroniser
- action_type (text) : Type d'action (create, update, delete)
- local_id (text) : ID local de l'entité
- entity_data (jsonb) : Données de l'entité
- server_id (uuid) : ID serveur après sync
- processed (boolean) : Traitement terminé
- retry_count (integer) : Nombre de tentatives
- error_message (text) : Message d'erreur
- created_at (timestamptz)
- processed_at (timestamptz)
```

#### `mobile_cache_data`
Cache de données pour mode hors ligne
```sql
- id (uuid, PK)
- user_id (uuid, FK profiles.id)
- cache_type (text) : Type de cache
- cache_key (text) : Clé de cache
- data (jsonb) : Données mises en cache
- expires_at (timestamptz) : Date d'expiration
- created_at, updated_at (timestamptz)
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

## Types et énumérations

### Types personnalisés

#### `symbol_location_verification_status`
Énumération pour le statut de vérification des localisations :
- `unverified` : Non vérifié
- `pending` : En cours de vérification
- `verified` : Vérifié
- `disputed` : Contesté

### Index et contraintes

#### Index principaux
- Index sur `user_id` dans toutes les tables utilisateur
- Index sur `symbol_id` dans les tables liées aux symboles
- Index sur `created_at` pour les requêtes temporelles
- Index composite sur `(group_id, user_id)` pour les membres
- Index unique sur les slugs des collections et groupes

#### Contraintes de données
- Contraintes d'unicité sur les relations many-to-many
- Contraintes de vérification sur les énumérations
- Clés étrangères avec CASCADE DELETE approprié

## Sécurité et RLS

### Politiques Row Level Security
La plupart des tables sont protégées par RLS mais les politiques ne sont pas encore implémentées. Les fonctions `SECURITY DEFINER` permettent un accès contrôlé aux données sensibles.

### Audit et traçabilité
- Table `admin_logs` pour toutes les actions administratives
- Table `user_activities` pour le suivi des actions utilisateur
- Timestamps automatiques sur toutes les tables

## Optimisations et performance

### Stratégies de cache
- Cache mobile via `mobile_cache_data`
- Dénormalisation des compteurs (members_count, etc.)
- Index optimisés pour les requêtes fréquentes

### Pagination et requêtes
- Support natif de la pagination avec LIMIT/OFFSET
- Requêtes optimisées avec jointures appropriées
- Utilisation de jsonb pour les données semi-structurées

---

*Cette documentation reflète la structure actuelle de la base de données Cultural Heritage Symbols.*
*Dernière mise à jour: Décembre 2024*
*Version: 4.6.0*
