
# Symbolica Museum - Documentation complète

## Vue d'ensemble

Symbolica Museum est une plateforme web dédiée à la préservation et à la célébration du patrimoine symbolique mondial. L'application permet aux utilisateurs d'explorer, contribuer et analyser des symboles culturels du monde entier.

## Architecture technique

### Stack technologique
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **State Management**: TanStack Query
- **Internationalisation**: react-i18next
- **Cartes**: Mapbox GL JS
- **Déploiement**: Lovable Platform

### Structure du projet
```
src/
├── components/          # Composants réutilisables
│   ├── layout/         # Layout (Header, Footer, Layout)
│   ├── ui/            # Composants UI de base (shadcn)
│   ├── admin/         # Composants d'administration
│   ├── auth/          # Composants d'authentification
│   ├── collections/   # Composants de collections
│   ├── community/     # Composants communautaires
│   └── ...
├── pages/             # Pages de l'application
├── hooks/             # Hooks personnalisés
├── services/          # Services et API
├── i18n/             # Internationalisation
└── types/            # Types TypeScript
```

## Pages de l'application

### Pages publiques
- **HomePage** (`/`) - Page d'accueil avec héros et sections
- **SymbolsPage** (`/symbols`) - Exploration des symboles
- **CollectionsPage** (`/collections`) - Collections thématiques
- **SearchPage** (`/search`) - Recherche avancée avec filtres
- **CommunityPage** (`/community`) - Hub communautaire
- **TrendingPage** (`/trending`) - Tendances et contenus populaires
- **Auth** (`/auth`) - Authentification (connexion/inscription)

### Pages légales
- **LegalPage** (`/legal`) - Mentions légales
- **PrivacyPage** (`/privacy`) - Politique de confidentialité
- **TermsPage** (`/terms`) - Conditions d'utilisation
- **ContactPage** (`/contact`) - Formulaire de contact

### Pages protégées (authentification requise)
- **MapExplorer** (`/map`) - Carte interactive des symboles
- **AnalysisPage** (`/analysis`) - Outils d'analyse avancée
- **ContributionsPage** (`/contributions`) - Gestion des contributions
- **NewContribution** (`/contribute`) - Nouvelle contribution
- **Profile** (`/profile/:username/edit`) - Édition de profil
- **EnterprisePage** (`/enterprise`) - Fonctionnalités entreprise

### Pages d'administration
- **Dashboard** (`/admin`) - Tableau de bord administrateur
- **UsersManagement** (`/admin/users`) - Gestion des utilisateurs
- **ContributionsManagement** (`/admin/contributions`) - Modération
- **SymbolsManagement** (`/admin/symbols`) - Gestion des symboles
- **CollectionsManagement** (`/admin/collections`) - Gestion des collections
- **SystemSettings** (`/admin/settings`) - Paramètres système

## Système de navigation

### Header
- Logo et navigation principale
- Barre de recherche intégrée
- Menu utilisateur avec notifications
- Sélecteur de langue (FR/EN)
- Menu mobile responsive

### Footer
- Liens organisés par sections (Plateforme, Communauté, Légal)
- Informations de contact
- Liens vers réseaux sociaux
- Copyright et mentions

## Fonctionnalités principales

### Authentification et autorisation
- Inscription/Connexion via Supabase Auth
- Gestion des rôles (user, admin)
- Profils utilisateur personnalisables
- Système de permissions basé sur RLS

### Gestion des symboles
- Upload et annotation d'images
- Métadonnées culturelles et historiques
- Géolocalisation des découvertes
- Classification et taxonomie

### Collections
- Collections publiques et privées
- Organisation thématique
- Collaboration communautaire
- Export et partage

### Recherche et filtres
- Recherche textuelle avancée
- Filtres par culture, période, type
- Suggestions en temps réel
- Résultats paginés

### Analyse et visualisation
- Outils d'analyse d'images
- Visualisations 3D interactives
- Comparaison de symboles
- Export académique

### Communauté
- Groupes d'intérêt
- Discussions et commentaires
- Système de gamification
- Notifications en temps réel

## Sécurité et performances

### Row-Level Security (RLS)
- Politiques de sécurité au niveau base de données
- Isolation des données par utilisateur
- Contrôle d'accès granulaire

### Optimisations
- Lazy loading des images
- Pagination des listes
- Cache des requêtes (TanStack Query)
- Compression des assets

## Configuration et déploiement

### Variables d'environnement
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_MAPBOX_TOKEN=your_mapbox_token
```

### Scripts disponibles
```bash
npm run dev          # Développement
npm run build        # Build de production
npm run preview      # Prévisualisation du build
npm run lint         # Linting
npm run type-check   # Vérification TypeScript
```

## Maintenance et monitoring

### Logs et erreurs
- Logs administrateur (table `admin_logs`)
- Gestion centralisée des erreurs
- Monitoring des performances

### Mises à jour
- Système de versioning des données
- Migrations de base de données
- Tests automatisés

## Support et contribution

### Documentation développeur
- Guide de contribution
- Standards de code
- Conventions de nommage
- Tests et validation

### Contact technique
- Email: support@symbolica-museum.org
- Documentation: Voir fichiers MD du projet
- Issues: Via le repository du projet
