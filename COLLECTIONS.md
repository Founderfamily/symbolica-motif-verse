
# Collections System - Cartographie Complète

## Vue d'ensemble

Le système de collections permet aux utilisateurs d'organiser et de parcourir des symboles culturels selon des thématiques spécifiques. Il s'agit d'un système multilingue avec support complet pour le français et l'anglais.

---

## 📊 BASE DE DONNÉES

### Tables Principales

#### `collections`
```sql
- id: uuid (PK, gen_random_uuid())
- slug: text (NOT NULL, UNIQUE)
- created_by: uuid (FK vers auth.users)
- created_at: timestamp with time zone (DEFAULT now())
- updated_at: timestamp with time zone (DEFAULT now())
- is_featured: boolean (DEFAULT false)
```
**Données actuelles** : 20+ collections, 8 marquées comme `is_featured = true`

#### `collection_translations`
```sql
- id: integer (PK, auto-increment)
- collection_id: uuid (FK vers collections)
- language: text (NOT NULL, 'fr' | 'en')
- title: text (NOT NULL)
- description: text (NULLABLE)
```
**Contraintes** : UNIQUE(collection_id, language)

#### `collection_symbols`
```sql
- collection_id: uuid (FK vers collections)
- symbol_id: uuid (FK vers symbols)
- position: integer (DEFAULT 0)
```
**Contraintes** : Clé primaire composite (collection_id, symbol_id)

### Fonctions SQL Existantes

1. **`update_collection_updated_at()`** - Trigger pour mise à jour automatique
2. **`handle_new_user()`** - Création de profil utilisateur
3. **`moderate_contribution()`** - Modération des contributions
4. **`get_admin_logs_with_profiles()`** - Logs administrateur

### Politiques RLS
- Actuellement **AUCUNE** politique RLS sur les tables collections
- Tables publiquement accessibles
- **PROBLÈME POTENTIEL** : Pas de restriction d'accès

---

## 🏗️ ARCHITECTURE DES FICHIERS

### Pages Principales

#### `src/pages/CollectionsPage.tsx` (73 lignes)
- **Responsabilité** : Page principale listant toutes les collections
- **Composants utilisés** :
  - `CollectionCategories` (composant principal)
  - `CreateCollectionDialog` (pour les admin)
  - `CollectionErrorBoundary` (gestion d'erreur)
  - `CollectionStatsDisplay` (statistiques)
- **Hooks** : `useTranslation`, `useAuth`, `useOptimizedCollections`
- **Sections** :
  - Hero avec statistiques
  - Collections en vedette
  - Onglets par catégories

#### `src/pages/CollectionDetailPage.tsx`
- **Responsabilité** : Page de détail d'une collection
- **Fonctionnalités** : Affichage des symboles, partage, vue carte
- **Hooks** : `useCollection(slug)`

#### `src/components/collections/LazyCollectionDetailPage.tsx`
- **Responsabilité** : Version lazy-loaded de la page détail
- **Optimisation** : Chargement différé pour les performances

### Composants Principaux

#### `src/components/collections/CollectionCategories.tsx` (103 lignes)
- **Responsabilité** : Orchestrateur principal des collections
- **Problèmes identifiés** :
  - Cache invalidé au démarrage
  - Gestion d'erreur complexe
  - Loading states multiples
- **Composants enfants** :
  - `FeaturedCollectionsSection`
  - `CollectionTabs`
  - `EnhancedErrorState`
  - `PerformanceTracker`

#### `src/components/collections/CollectionCard.tsx` (47 lignes)
- **Responsabilité** : Carte d'affichage d'une collection
- **Problèmes identifiés** :
  - Fallbacks de traduction complexes
  - Dépendance à `useCollectionTranslations`
- **Props** : `CollectionWithTranslations`

#### `src/components/collections/sections/FeaturedCollectionsSection.tsx` (25 lignes)
- **Responsabilité** : Section des collections en vedette
- **Logique** : Affichage conditionnel si collections.length > 0

#### `src/components/collections/sections/CollectionTabs.tsx` (97 lignes)
- **Responsabilité** : Onglets de catégorisation
- **Catégories** :
  - Cultures (🌍)
  - Périodes (⏳)
  - Sciences (🔬)
  - Autres (📚)
- **Composant enfant** : `CategoryGrid`

#### `src/components/collections/sections/CategoryGrid.tsx` (25 lignes)
- **Responsabilité** : Grille adaptative pour chaque catégorie
- **Composants** : `AdaptiveGrid`, `EmptyCategory`

#### `src/components/collections/sections/EmptyCategory.tsx` (12 lignes)
- **Responsabilité** : État vide pour catégories sans collections
- **Message** : Traduction via `I18nText`

### Composants d'Optimisation

#### `src/components/collections/AdaptiveGrid.tsx` (156 lignes)
- **Responsabilité** : Grille responsive avec navigation clavier
- **Fonctionnalités** :
  - Calcul adaptatif des colonnes
  - Pagination tactile
  - Gestes swipe
  - Accessibilité clavier
- **Hooks** : `useKeyboardNavigation`

#### `src/components/collections/OptimizedCollectionCard.tsx` (42 lignes)
- **Responsabilité** : Version optimisée de CollectionCard
- **Optimisations** : `useMemo` pour éviter recalculs

#### `src/components/collections/VirtualizedCollectionGrid.tsx`
- **Responsabilité** : Grille virtualisée pour grandes listes
- **Optimisation** : Rendu seulement des éléments visibles

### Composants d'État

#### `src/components/collections/CollectionLoadingSkeleton.tsx` (17 lignes)
- **Responsabilité** : Skeleton loader pendant chargement
- **Props** : `count?: number` (défaut: 6)

#### `src/components/collections/CollectionErrorState.tsx` (15 lignes)
- **Responsabilité** : État d'erreur avec traductions
- **Messages** : `collections.errorLoading`, `collections.errorMessage`

#### `src/components/collections/CollectionEmptyState.tsx` (15 lignes)
- **Responsabilité** : État vide quand aucune collection
- **Messages** : `collections.noFeaturedCollections`

#### `src/components/collections/EnhancedErrorStates.tsx`
- **Responsabilité** : Gestion avancée des erreurs
- **Fonctionnalités** : Retry, logging, contexte

#### `src/components/collections/PerformanceTracker.tsx`
- **Responsabilité** : Monitoring des performances
- **Métriques** : Temps de chargement, erreurs

### Composants Complexes

#### `src/components/collections/CollectionGrid.tsx` (59 lignes)
- **Responsabilité** : Grille standard des collections
- **Props** : `limit?: number`, `featuredOnly?: boolean`
- **Problème** : Doublon avec AdaptiveGrid

#### `src/components/collections/FeaturedCollectionsGrid.tsx` (31 lignes)
- **Responsabilité** : Grille spécialisée pour collections vedette
- **Hook** : `useFeaturedCollections`

#### `src/components/collections/CollectionHero.tsx`
- **Responsabilité** : Section hero de la page collections

#### `src/components/collections/CollectionStatsDisplay.tsx`
- **Responsabilité** : Affichage des statistiques

#### `src/components/collections/CreateCollectionDialog.tsx`
- **Responsabilité** : Dialog de création (admin)

#### `src/components/collections/CollectionErrorBoundary.tsx`
- **Responsabilité** : Error boundary React

#### `src/components/collections/ProgressiveLoader.tsx`
- **Responsabilité** : Chargement progressif

#### `src/components/collections/CollectionAnimations.tsx`
- **Responsabilité** : Animations et transitions

---

## 🔧 HOOKS ET LOGIQUE MÉTIER

### Hooks Principaux

#### `src/hooks/useCollections.ts` (105 lignes)
- **Responsabilité** : Hook principal pour les collections
- **Fonctions exportées** :
  - `useCollections()` - Toutes les collections
  - `useFeaturedCollections()` - Collections vedette
  - `useCollection(slug)` - Collection par slug
  - `useCreateCollection()` - Création
  - `useUpdateCollection()` - Mise à jour
  - `useDeleteCollection()` - Suppression
  - `useUpdateSymbolsOrder()` - Ordre des symboles
- **Configuration React Query** :
  - `staleTime: 10 minutes`
  - `gcTime: 15 minutes`
  - `retry: 2`

#### `src/hooks/useOptimizedCollections.ts` (79 lignes)
- **Responsabilité** : Version optimisée avec cache intelligent
- **Problèmes identifiés** :
  - Cache localStorage complexe
  - Logique de fallback problématique
  - Ne retourne pas tableau vide pendant loading
- **Optimisations** :
  - Prefetch collections populaires
  - Persistance localStorage
  - Cache de 15 minutes

#### `src/hooks/useCollectionCategories.ts` (95 lignes)
- **Responsabilité** : Catégorisation automatique des collections
- **Logique de catégorisation** :
  - **Featured** : `collection.is_featured === true`
  - **Cultures** : slug contient `culture-`, `egyptien`, `chinois`, `celtique`, etc.
  - **Periods** : slug contient `medieval`, `renaissance`, `ancien`, etc.
  - **Sciences** : slug contient `alchimie`, `geometrie`, `sacre`, etc.
  - **Others** : Collections non classées dans les autres catégories
- **Problème** : Logique basée sur les slugs, peut être fragile

#### `src/hooks/useCollectionTranslations.ts` (39 lignes)
- **Responsabilité** : Gestion des traductions des collections
- **Logique** :
  1. Cherche traduction dans langue courante
  2. Fallback vers langue alternative (fr ↔ en)
  3. Fallback vers n'importe quelle traduction
  4. Fallback vers `[${field} missing]`

#### `src/hooks/useCollectionStats.ts`
- **Responsabilité** : Calcul des statistiques collections

---

## 🌐 SYSTÈME DE TRADUCTION

### Fichiers de Traductions

#### `src/i18n/locales/fr/collections.json` (43 clés)
```json
{
  "title": "Collections Culturelles",
  "featured": {
    "title": "Collections en Vedette",
    "description": "Explorez des parcours thématiques...",
    "discoverAll": "Découvrir Toutes les Collections"
  },
  "featuredBadge": "En vedette",
  "categories": {
    "cultures": "Cultures",
    "periods": "Périodes", 
    "sciences": "Sciences",
    "others": "Autres",
    "culturesDescription": "Explorez les symboles organisés par leur origine culturelle",
    "periodsDescription": "Découvrez l'évolution des symboles à travers les époques",
    "sciencesDescription": "Découvrez les symboles liés aux sciences et traditions ésotériques",
    "othersDescription": "Collections thématiques et créations personnalisées",
    "noOthers": "Aucune autre collection pour le moment"
  },
  "heroStats": {
    "cultures": "Cultures du Monde",
    "periods": "Époques Historiques",
    "mythologies": "Mythologies", 
    "art": "Art Symbolique"
  },
  "explore": "Explorer →",
  "loading": "Chargement des collections...",
  "noCollections": "Aucune collection disponible",
  "noCollectionsMessage": "Les collections seront bientôt disponibles...",
  "noFeaturedCollections": "Aucune collection en vedette",
  "noFeaturedCollectionsMessage": "Les collections thématiques arrivent bientôt !",
  "createdOn": "Créée le",
  "symbolsCount": "symboles",
  "culturesCount": "cultures",
  "periodsCount": "périodes",
  "allCollections": "Toutes les Collections",
  "allCollectionsCount": "parcours thématiques disponibles",
  "collectionsUnit": "collections",
  "share": "Partager",
  "viewOnMap": "Voir sur la carte",
  "symbolsInCollection": "Symboles de la collection",
  "noSymbols": "Aucun symbole dans cette collection",
  "backToCollections": "Retour aux collections",
  "notFound": "Collection non trouvée",
  "createCollection": "Créer une Collection"
}
```

#### `src/i18n/locales/en/collections.json` (25 clés)
```json
{
  "collections": {
    "title": "Collections",
    "featured": "Featured Collections",
    "create": "Create Collection",
    "browse": "Browse Collections",
    "myCollections": "My Collections",
    "explore": "Explore",
    "symbols": "symbols",
    "themes": "Themes",
    "loading": "Loading collections...",
    "noCollections": "No collections available",
    "noCollectionsMessage": "Collections will be available soon...",
    "featuredBadge": "Featured"
  },
  "categories": {
    "cultures": "Cultures",
    "periods": "Periods",
    "sciences": "Sciences", 
    "others": "Others",
    "culturesDescription": "Explore symbols organized by their cultural origin",
    "periodsDescription": "Discover the evolution of symbols through the ages",
    "sciencesDescription": "Discover symbols related to sciences and esoteric traditions",
    "othersDescription": "Thematic collections and custom creations",
    "noOthers": "No other collections at the moment"
  }
}
```

### Composants de Traduction

#### `src/components/ui/i18n-text.tsx` (32 lignes)
- **Responsabilité** : Composant de traduction principal
- **Props** : `translationKey`, `params`, `values`, `className`, `as`, `children`
- **Fallback** : Utilise `children` si traduction manquante

#### `src/components/ui/translation-fallback.tsx` (26 lignes)
- **Responsabilité** : Composant de fallback pour traductions
- **Logique** : Fallback seulement si traduction vraiment manquante

---

## 🔄 FLUX DE DONNÉES

### Architecture React Query

```
CollectionsPage
  ├── useOptimizedCollections() 
  │   ├── useQuery(['collections'])
  │   ├── localStorage cache (1h)
  │   └── prefetchFeatured()
  │
  ├── CollectionCategories
  │   ├── useCollections() → collectionsService.getCollections()
  │   ├── useCollectionCategories() → catégorisation
  │   │   ├── featured: is_featured = true
  │   │   ├── cultures: slug matching
  │   │   ├── periods: slug matching  
  │   │   ├── sciences: slug matching
  │   │   └── others: non classées
  │   │
  │   ├── FeaturedCollectionsSection
  │   └── CollectionTabs
  │       ├── CategoryGrid (cultures)
  │       ├── CategoryGrid (periods)
  │       ├── CategoryGrid (sciences)
  │       └── CategoryGrid (others)
  │           └── AdaptiveGrid
  │               └── OptimizedCollectionCard[]
  │                   └── useCollectionTranslations()
```

### Service Layer

#### `src/services/collectionsService.ts` (294 lignes)
- **Pattern** : Singleton
- **Méthodes principales** :
  - `getCollections()` - SELECT avec jointures
  - `getFeaturedCollections()` - WHERE is_featured = true
  - `getCollectionBySlug(slug)` - SELECT avec symbols
  - `createCollection(data)` - INSERT avec traductions
  - `updateCollection(id, updates)` - UPDATE
  - `deleteCollection(id)` - DELETE
  - `updateSymbolsOrder()` - Réorganisation
- **Méthodes privées** :
  - `createTranslations()` - INSERT traductions
  - `updateTranslations()` - UPDATE traductions
  - `addSymbolsToCollection()` - INSERT collection_symbols

**PROBLÈME** : Fichier trop long (294 lignes), candidat au refactoring

---

## 🎨 COMPOSANTS SECTIONS

### `src/components/sections/FeaturedCollections.tsx` (224 lignes)
- **Responsabilité** : Section homepage des collections vedette
- **Composants internes** :
  - `StaticCollections` - Collections hardcodées (fallback)
  - `DynamicCollections` - Collections depuis BDD
- **Logique** : Affiche statique si erreur/vide, sinon dynamique

**PROBLÈME** : Fichier trop long (224 lignes), candidat au refactoring

---

## ❌ PROBLÈMES IDENTIFIÉS

### 1. **Cache React Query**
- **Symptôme** : Collections ne s'affichent pas
- **Cause** : Cache invalidé au démarrage dans `CollectionCategories`
- **Effet** : Rechargement permanent, états instables

### 2. **Structure de données incohérente**
- **Problème** : `useOptimizedCollections` vs `useCollections`
- **Conflit** : Différentes logiques de cache et fallback
- **Impact** : États de loading/error contradictoires

### 3. **Logique de catégorisation fragile**
- **Méthode** : Basée sur matching de slugs
- **Problèmes** :
  - Dépendante de conventions de nommage
  - Pas de validation des slugs
  - Collections mal catégorisées

### 4. **Fallbacks de traduction complexes**
- **Symptôme** : `[title missing]`, `[description missing]`
- **Causes** :
  - Structure `collection_translations` vs attentes
  - Logique de fallback dans `useCollectionTranslations`
  - Titre généré depuis slug en dernier recours

### 5. **Duplication de composants**
- **Problème** : `CollectionGrid` vs `AdaptiveGrid` vs `FeaturedCollectionsGrid`
- **Impact** : Maintenance complexe, comportements incohérents

### 6. **Fichiers trop longs**
- `collectionsService.ts` : 294 lignes
- `FeaturedCollections.tsx` : 224 lignes
- **Impact** : Difficulté de maintenance

### 7. **Gestion d'erreur incohérente**
- **Problèmes** :
  - Multiple error boundaries
  - Fallbacks statiques vs dynamiques
  - Retry logic dispersée

---

## 🔍 LOGS ET DEBUGGING

### Points de Log Identifiés

#### Dans `useOptimizedCollections.ts`
```javascript
console.log('Fetching collections...');
console.log('Collections fetched:', result?.length || 0);
console.log('Cache check:', cached?.length || 0);
console.log('Using local cache:', parsed.data.length);
console.log('Computing optimized collections:', {
  collections: collections?.length || 0,
  isLoading,
  error: !!error
});
```

#### Dans `CollectionCategories.tsx`
```javascript
// Cache invalidé au démarrage pour forcer rechargement frais
queryClient.invalidateQueries({ queryKey: ['collections'] });
```

### Problèmes de Logging
- Logs dispersés dans plusieurs fichiers
- Pas de système centralisé
- Debug difficile en production

---

## 📋 TODO / AMÉLIORATIONS

### Corrections Urgentes
1. **Supprimer l'invalidation de cache** au démarrage
2. **Unifier les hooks** `useCollections` et `useOptimizedCollections`
3. **Simplifier les fallbacks** de traduction
4. **Corriger la catégorisation** basée sur les données réelles

### Refactoring Recommandé
1. **Diviser `collectionsService.ts`** en modules spécialisés
2. **Refactoriser `FeaturedCollections.tsx`** en composants plus petits
3. **Unifier les grilles** : un seul composant `CollectionGrid`
4. **Centraliser la gestion d'erreur**

### Optimisations
1. **Virtualisation** pour grandes listes
2. **Lazy loading** des images
3. **Service Worker** pour cache offline
4. **Prefetch** des collections populaires

---

## 📝 RÉSUMÉ EXÉCUTIF

### État Actuel
- **20+ collections** en base avec 8 featured
- **15+ composants** React spécialisés
- **4 hooks** métier principaux
- **43 clés** de traduction française
- **Système complet** mais instable

### Problème Principal
**Conflit entre systèmes de cache** causant affichage incohérent des collections

### Solution Recommandée
1. **Audit complet** des hooks de données
2. **Unification** de la logique de cache
3. **Simplification** des fallbacks
4. **Refactoring** des gros fichiers

### Prochaine Étape
**Implémentation d'une solution de cache unifiée** avec logs détaillés pour debugging.
