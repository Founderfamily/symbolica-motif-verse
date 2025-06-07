
# Système d'internationalisation (i18n)

## Vue d'ensemble

Symbolica Museum utilise react-i18next pour la gestion de l'internationalisation avec support des langues française (FR) et anglaise (EN).

## Structure des fichiers

### Organisation des traductions
```
src/i18n/
├── locales/
│   ├── en/                 # Traductions anglaises
│   │   ├── admin.json
│   │   ├── app.json
│   │   ├── auth.json
│   │   ├── navigation.json # Navigation et menus
│   │   ├── search.json     # Interface de recherche
│   │   └── ...
│   ├── fr/                 # Traductions françaises
│   │   ├── admin.json
│   │   ├── app.json
│   │   ├── auth.json
│   │   ├── navigation.json # Navigation et menus
│   │   ├── search.json     # Interface de recherche
│   │   └── ...
│   └── fr.json            # Fichier legacy
├── config.ts              # Configuration i18next
├── useTranslation.ts      # Hook personnalisé
└── components/
    └── i18n-text.tsx      # Composant I18nText
```

## Nouvelles traductions ajoutées

### 1. Interface de recherche (`search.json`)

#### Anglais (`en/search.json`)
```json
{
  "title": "Search",
  "subtitle": "Explore our collection of symbols and cultural collections",
  "placeholder": "Search symbols, collections...",
  "filters": "Filters",
  "search": "Search",
  "advancedFilters": "Advanced filters",
  "noResults": "No results found",
  "resultsCount": "results found"
}
```

#### Français (`fr/search.json`)
```json
{
  "title": "Recherche",
  "subtitle": "Explorez notre collection de symboles et collections culturelles",
  "placeholder": "Rechercher des symboles, collections...",
  "filters": "Filtres",
  "search": "Rechercher",
  "advancedFilters": "Filtres avancés",
  "noResults": "Aucun résultat trouvé",
  "resultsCount": "résultats trouvés"
}
```

### 2. Navigation mise à jour (`fr/navigation.json`)

Ajout des nouvelles sections :
- Liens du header (search, trending, analysis)
- Liens du footer (search, trending, legal, contact)
- Métadonnées pour toutes les pages

## Convention de nommage des clés

### Format standard
```
namespace.section.element[.qualifier]
```

### Exemples pratiques
```javascript
// Navigation
"header.search"          // Texte de recherche dans le header
"footer.legal"           // Lien mentions légales du footer

// Pages
"search.title"           // Titre de la page de recherche
"search.filters"         // Section filtres
"search.noResults"       // Message aucun résultat

// Actions
"search.search"          // Bouton rechercher
"contact.send"           // Bouton envoyer
```

## Utilisation dans les composants

### Composant I18nText (recommandé)
```jsx
import { I18nText } from '@/components/ui/i18n-text';

// Usage simple
<I18nText translationKey="search.title">Recherche</I18nText>

// Avec paramètres
<I18nText 
  translationKey="search.resultsCount" 
  params={{ count: 42 }}
>
  42 résultats trouvés
</I18nText>
```

### Hook useTranslation
```jsx
import { useTranslation } from '@/i18n/useTranslation';

const { t, changeLanguage, currentLanguage } = useTranslation();

// Utilisation
const title = t('search.title');
const subtitle = t('search.subtitle');

// Changement de langue
changeLanguage('en'); // ou 'fr'
```

## Gestion des traductions manquantes

### Validation automatique
Le système détecte automatiquement :
- Clés manquantes dans une langue
- Incohérences de format
- Placeholders non concordants

### Outils de développement
```bash
# Vérification de complétude
npm run validate-translations

# Conversion des usages directs
npm run convert-file <path>

# Scan des usages non conformes
npm run scan-direct-usage
```

### Indicateurs visuels
En mode développement :
- Contour rouge : traduction manquante
- Contour jaune : problème de format
- Tooltip : détails de l'erreur

## Ajout de nouvelles traductions

### 1. Créer les clés dans les deux langues
```json
// en/filename.json
{
  "newSection": {
    "title": "New Feature",
    "description": "This is a new feature"
  }
}

// fr/filename.json
{
  "newSection": {
    "title": "Nouvelle fonctionnalité", 
    "description": "Ceci est une nouvelle fonctionnalité"
  }
}
```

### 2. Utiliser dans les composants
```jsx
<I18nText translationKey="filename.newSection.title">
  Nouvelle fonctionnalité
</I18nText>
```

### 3. Validation
```bash
npm run validate-translations
```

## Bonnes pratiques

### 1. Toujours utiliser I18nText
❌ **Incorrect**
```jsx
<div>{t('key')}</div>
```

✅ **Correct**
```jsx
<I18nText translationKey="key">Texte par défaut</I18nText>
```

### 2. Structurer les clés logiquement
```json
{
  "page": {
    "title": "Titre de page",
    "sections": {
      "hero": "Section héros",
      "features": "Fonctionnalités"
    },
    "buttons": {
      "save": "Sauvegarder",
      "cancel": "Annuler"
    }
  }
}
```

### 3. Utiliser des paramètres pour le contenu dynamique
```jsx
<I18nText 
  translationKey="user.welcome" 
  params={{ name: user.name }}
>
  Bienvenue {user.name}
</I18nText>
```

### 4. Tester sur les deux langues
- Vérifier la longueur des textes
- S'assurer de la cohérence terminologique
- Valider l'expérience utilisateur

## Migration et maintenance

### Versioning des traductions
- Version actuelle : 1.0.0
- Changements majeurs documentés
- Backward compatibility maintenue

### Processus de mise à jour
1. Ajouter nouvelles clés dans les deux langues
2. Valider avec `npm run validate-translations`
3. Tester sur les deux langues
4. Commit avec message descriptif

### Contribution communautaire
- Guidelines pour contributeurs
- Processus de review des traductions
- Validation par locuteurs natifs
