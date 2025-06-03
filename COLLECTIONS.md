
# Collections System Documentation

## Vue d'ensemble

Le système de collections permet aux utilisateurs d'organiser et de parcourir des symboles culturels selon des thématiques spécifiques. Il s'agit d'un système multilingue avec support complet pour le français et l'anglais.

## Architecture

### Structure des fichiers

```
src/
├── pages/
│   ├── CollectionsPage.tsx          # Page principale des collections
│   └── CollectionDetailPage.tsx     # Page de détail d'une collection
├── components/collections/
│   ├── CollectionCard.tsx           # Carte d'affichage d'une collection
│   ├── CollectionGrid.tsx           # Grille de collections
│   ├── FeaturedCollectionsGrid.tsx  # Grille des collections en vedette
│   └── CreateCollectionDialog.tsx   # Dialog de création de collection
├── hooks/
│   └── useCollections.ts            # Hooks pour les collections
├── services/
│   └── collectionsService.ts        # Service de gestion des collections
├── types/
│   └── collections.ts               # Types TypeScript
└── i18n/locales/
    ├── fr/collections.json          # Traductions françaises
    └── en/collections.json          # Traductions anglaises
```

### Base de données

#### Table `collections`
- `id`: UUID primaire
- `slug`: Identifiant URL unique
- `created_by`: UUID de l'utilisateur créateur
- `created_at`: Date de création
- `updated_at`: Date de modification
- `is_featured`: Booléen pour les collections en vedette

#### Table `collection_translations`
- `id`: Clé primaire
- `collection_id`: Référence vers la collection
- `language`: Code langue (fr/en)
- `title`: Titre de la collection
- `description`: Description de la collection

#### Table `collection_symbols`
- `collection_id`: Référence vers la collection
- `symbol_id`: Référence vers le symbole
- `position`: Ordre d'affichage dans la collection

## Composants

### CollectionsPage.tsx
Page principale listant toutes les collections avec :
- Section héro avec statistiques
- Collections en vedette
- Grille de toutes les collections
- Support complet de l'internationalisation

### CollectionDetailPage.tsx
Page de détail d'une collection avec :
- Informations de la collection
- Statistiques (symboles, cultures, périodes)
- Grille des symboles de la collection
- Actions (partage, vue carte)

### CollectionCard.tsx
Composant de carte d'affichage avec :
- Image de la collection
- Titre et description traduits
- Badge "En vedette" si applicable
- Lien vers la page de détail

## Internationalisation

### Structure des traductions

Les fichiers de traduction suivent une structure hiérarchique :

```json
{
  "title": "Collections",
  "featured": {
    "title": "Collections en Vedette",
    "description": "Description...",
    "discoverAll": "Découvrir Toutes"
  },
  "heroStats": {
    "mysteries": "Mystères & Secrets",
    "geometry": "Géométrie Sacrée"
  }
}
```

### Utilisation dans les composants

```tsx
import { I18nText } from '@/components/ui/i18n-text';

// Utilisation simple
<I18nText translationKey="collections.title">Collections</I18nText>

// Avec fallback
<I18nText translationKey="collections.notFound">
  Collection non trouvée
</I18nText>
```

## Hooks

### useCollections
- `data`: Liste des collections
- `isLoading`: État de chargement
- `error`: Erreur éventuelle

### useFeaturedCollections
Variante spécialisée pour les collections en vedette.

### useCollection(slug)
Récupère une collection spécifique par son slug.

## Services

### collectionsService
Service centralisé pour toutes les opérations :

- `getCollections()`: Récupère toutes les collections
- `getFeaturedCollections()`: Récupère les collections en vedette
- `getCollectionBySlug(slug)`: Récupère une collection par slug
- `createCollection(data)`: Crée une nouvelle collection
- `updateCollection(id, updates)`: Met à jour une collection
- `deleteCollection(id)`: Supprime une collection

## Routing

```
/collections              → CollectionsPage
/collections/:slug        → CollectionDetailPage
```

## États et erreurs

### États de chargement
- Loading skeletons avec `<Skeleton />` pendant le chargement
- Messages d'état vide avec traductions appropriées

### Gestion d'erreur
- Messages d'erreur traduits
- États de fallback gracieux
- Logs détaillés dans la console

## Bonnes pratiques

### Composants
1. **Séparation des responsabilités** : Chaque composant a une responsabilité claire
2. **Réutilisabilité** : Les composants sont conçus pour être réutilisés
3. **Props typées** : Utilisation de TypeScript pour la sécurité des types

### Traductions
1. **Clés descriptives** : Noms de clés explicites (`collections.featured.title`)
2. **Fallbacks** : Toujours fournir un fallback en cas de traduction manquante
3. **Hiérarchie** : Structure organisée des clés de traduction

### Performance
1. **Lazy loading** : Chargement différé des images
2. **Mise en cache** : Utilisation de React Query pour la mise en cache
3. **Optimisations** : Éviter les re-rendus inutiles

## Problèmes résolus

### 1. Fichiers de traduction manquants
- **Problème** : `src/i18n/locales/fr/collections.json` manquant
- **Solution** : Création du fichier avec toutes les clés nécessaires

### 2. Texte hardcodé
- **Problème** : Texte en français hardcodé dans les composants
- **Solution** : Remplacement par des composants `I18nText`

### 3. Routes manquantes
- **Problème** : Route `/collections/:slug` absente
- **Solution** : Ajout de la route dans `App.tsx`

### 4. Gestion d'erreur
- **Problème** : Messages d'erreur non traduits
- **Solution** : Ajout de clés de traduction pour tous les états

## Évolutions futures

1. **Filtres avancés** : Ajout de filtres par culture, période, etc.
2. **Recherche** : Fonctionnalité de recherche dans les collections
3. **Partage social** : Intégration des boutons de partage
4. **Collections privées** : Support des collections privées utilisateur
5. **Drag & drop** : Réorganisation des symboles par glisser-déposer

## Dépendances

- React Query pour la gestion d'état
- React Router pour le routing
- Tailwind CSS pour le styling
- Shadcn/ui pour les composants UI
- i18next pour l'internationalisation
