
# Symbolica Museum 🏛️

> Plateforme dédiée à la préservation et à la célébration du patrimoine symbolique mondial

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green.svg)](https://supabase.com/)

## 🌟 Vue d'ensemble

Symbolica Museum est une plateforme web moderne qui permet aux utilisateurs du monde entier d'explorer, documenter et analyser les symboles culturels. L'application combine technologies avancées, intelligence artificielle et collaboration communautaire pour préserver notre héritage symbolique.

### ✨ Fonctionnalités principales

- **🔍 Exploration interactive** : Recherche avancée avec filtres multicritères
- **🗺️ Cartographie mondiale** : Géolocalisation des symboles avec Mapbox
- **🤖 IA intégrée** : Reconnaissance automatique de motifs et classification
- **👥 Communauté active** : Collaboration, discussions et validation collaborative
- **📊 Analyse avancée** : Outils de visualisation 3D et comparaison
- **🏛️ Collections curées** : Thématiques organisées par experts
- **🌐 Multilingue** : Support français et anglais avec i18n complet
- **🔒 Sécurité renforcée** : Row-Level Security et conformité RGPD

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+ et npm
- Compte Supabase
- Token Mapbox (optionnel pour les cartes)

### Installation

```bash
# Cloner le repository
git clone https://github.com/your-org/symbolica-museum.git
cd symbolica-museum

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés

# Lancer en développement
npm run dev
```

### Variables d'environnement

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_MAPBOX_TOKEN=your_mapbox_token
```

## 🏗️ Architecture

### Stack technologique

- **Frontend** : React 18 + TypeScript + Vite
- **UI/UX** : Tailwind CSS + shadcn/ui + Framer Motion
- **Backend** : Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **Cartes** : Mapbox GL JS
- **State Management** : TanStack Query
- **Internationalisation** : react-i18next
- **Déploiement** : Lovable Platform

### Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── ui/             # Composants UI de base
│   ├── layout/         # Layout et navigation
│   ├── auth/           # Authentification
│   ├── collections/    # Gestion des collections
│   ├── community/      # Fonctionnalités sociales
│   └── ...
├── pages/              # Pages de l'application
├── hooks/              # Hooks personnalisés
├── services/           # Services et API
├── i18n/              # Internationalisation
├── types/             # Types TypeScript
└── utils/             # Utilitaires
```

## 📱 Fonctionnalités

### Pages principales

#### 🏠 Publiques
- **Accueil** (`/`) - Hero et présentation des fonctionnalités
- **Exploration** (`/symbols`) - Catalogue des symboles
- **Collections** (`/collections`) - Collections thématiques
- **Recherche** (`/search`) - Recherche avancée avec filtres
- **Communauté** (`/community`) - Hub communautaire
- **Tendances** (`/trending`) - Contenus populaires

#### 🔐 Protégées (authentification requise)
- **Carte interactive** (`/map`) - Exploration géographique
- **Analyse** (`/analysis`) - Outils d'analyse avancée
- **Contributions** (`/contributions`) - Gestion des contributions
- **Profil** (`/profile/:username`) - Profils utilisateur

#### ⚖️ Légales
- **Mentions légales** (`/legal`)
- **Confidentialité** (`/privacy`) 
- **Conditions d'utilisation** (`/terms`)
- **Contact** (`/contact`)

#### 🛡️ Administration
- **Dashboard** (`/admin`) - Tableau de bord
- **Modération** (`/admin/moderation`) - Validation des contributions
- **Utilisateurs** (`/admin/users`) - Gestion des comptes
- **Paramètres** (`/admin/settings`) - Configuration système

### Fonctionnalités avancées

#### 🤖 Intelligence artificielle
- Reconnaissance automatique de motifs
- Classification intelligente des symboles
- Suggestions de tags et métadonnées
- Analyse comparative automatisée

#### 👥 Social et collaboration
- Groupes d'intérêt thématiques
- Système de notifications en temps réel
- Messages privés entre utilisateurs
- Validation collaborative des contributions

#### 🎮 Gamification
- Système de points et achievements
- Niveaux d'expertise utilisateur
- Badges de reconnaissance
- Classements communautaires

## 🌐 Internationalisation

Support complet français/anglais avec :
- 15+ fichiers de traduction organisés par domaine
- Composant I18nText pour la cohérence
- Détection automatique de langue
- Outils de validation des traductions

```jsx
// Utilisation dans les composants
<I18nText translationKey="search.title">Recherche</I18nText>
```

## 🔒 Sécurité

### Architecture sécurisée
- **Authentification** : Supabase Auth avec confirmation email
- **Autorisation** : Row-Level Security (RLS) PostgreSQL
- **Rôles** : Système granulaire admin/moderator/user
- **Chiffrement** : TLS 1.3 + chiffrement base de données
- **Conformité** : RGPD compliant avec droits utilisateur

### Politiques RLS
```sql
-- Exemple : accès aux contributions
create policy "Users can view approved contributions"
on user_contributions for select
using (status = 'approved');
```

## 📊 Performance et monitoring

### Optimisations
- **Code splitting** automatique
- **Lazy loading** des images et composants  
- **Cache intelligent** avec TanStack Query
- **Compression** des assets et images
- **CDN** pour les ressources statiques

### Monitoring
- Métriques temps réel via Supabase
- Logs d'erreurs centralisés
- Analytics d'usage anonymisées
- Alertes automatiques

## 🚀 Déploiement

### Production (Lovable Platform)
```bash
# Build optimisé
npm run build

# Déploiement automatique via Git
git push origin main
```

### Configuration requise
- Variables d'environnement en production
- Base de données Supabase configurée
- Domaine personnalisé (optionnel)
- SSL/TLS automatique

## 🤝 Contribution

### Workflow de développement
1. Fork du repository
2. Branche feature (`git checkout -b feature/amazing-feature`)
3. Commit des changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Pull Request

### Standards de code
- **TypeScript strict** obligatoire
- **ESLint + Prettier** pour la cohérence
- **Tests unitaires** pour les fonctions critiques
- **Documentation** des composants complexes

### Guidelines
- Suivre les conventions de nommage
- Utiliser I18nText pour tous les textes
- Valider les traductions avant commit
- Tester sur les deux langues

## 📚 Documentation

- **[DOCUMENTATION.md](./DOCUMENTATION.md)** - Architecture complète
- **[FEATURES.md](./FEATURES.md)** - Guide des fonctionnalités
- **[SECURITY.md](./SECURITY.md)** - Guide de sécurité
- **[TRANSLATIONS.md](./TRANSLATIONS.md)** - Système i18n
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Guide de déploiement

## 🗺️ Roadmap

### 🎯 Court terme (Q1 2025)
- [ ] API mobile native
- [ ] Notifications push
- [ ] Amélioration IA de classification
- [ ] Performance optimizations

### 🚀 Moyen terme (Q2-Q3 2025)
- [ ] Réalité augmentée pour reconnaissance
- [ ] Blockchain pour traçabilité
- [ ] Marketplace de données symboliques
- [ ] Partenariats institutions culturelles

### 🌟 Long terme (Q4 2025+)
- [ ] Reconnaissance vocale multilingue
- [ ] IA générative pour restauration
- [ ] Intégration métaverse
- [ ] Réseau global des musées

## 📄 Licence

Distribué sous licence MIT. Voir `LICENSE` pour plus d'informations.

## 🙏 Remerciements

- **Équipe Symbolica** - Vision et développement
- **Communauté open source** - Contributions et feedback
- **Institutions partenaires** - Contenus et expertise
- **Lovable Platform** - Infrastructure et déploiement

## 📞 Support

- **Email** : support@symbolica-museum.org
- **Documentation** : [docs.symbolica-museum.org](https://docs.symbolica-museum.org)
- **Issues** : [GitHub Issues](https://github.com/your-org/symbolica-museum/issues)
- **Discord** : [Communauté Symbolica](https://discord.gg/symbolica)

---

<div align="center">

**[🌐 Site web](https://symbolica-museum.org) • [📖 Documentation](./DOCUMENTATION.md) • [🚀 Démo live](https://demo.symbolica-museum.org)**

*Préserver le passé, inspirer l'avenir* ✨

</div>
