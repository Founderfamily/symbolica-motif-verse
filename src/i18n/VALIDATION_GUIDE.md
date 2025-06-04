
# Guide de Validation i18n

## Script de Validation Automatique

Le script `validate-i18n.js` vérifie automatiquement l'intégrité des traductions dans le projet.

### Installation

```bash
# Ajouter les scripts npm (à exécuter une fois)
node src/i18n/scripts/add-npm-script.js
```

### Utilisation

```bash
# Validation simple
npm run validate-i18n

# Validation avec corrections automatiques
npm run validate-i18n:fix

# Validation avec rapport CSV
npm run validate-i18n:report
```

### Ce que vérifie le script

1. **Clés manquantes** : Clés présentes dans une langue mais pas dans l'autre
2. **Problèmes de format** : Placeholders `{variable}` incohérents entre langues
3. **Clés non définies** : Clés utilisées dans le code (`t('...')`) mais non définies
4. **Clés inutilisées** : Clés définies mais jamais utilisées dans le code

### Exemple de sortie

```
🔍 Validation automatique des traductions i18n
===============================================

📊 RÉSUMÉ
=========
Clés EN: 245
Clés FR: 242
Clés utilisées dans le code: 198
Clés manquantes: 3
Problèmes de format: 1
Clés non définies: 2
Clés inutilisées: 49

❌ MANQUANT EN FR (3 clés):
   auth.resetPassword.invalidToken
   auth.welcome.getStarted
   profile.settings.theme

⚠️ PROBLÈMES DE FORMAT (1):
   auth.welcome.title:
     EN: Welcome {userName} to Symbolica
     FR: Bienvenue sur Symbolica
     Manquant en FR: {userName}

🔍 CLÉS UTILISÉES MAIS NON DÉFINIES (2):
   dashboard.stats.overview
   search.filters.advanced
```

### Intégration CI/CD

Le script retourne un code d'erreur (exit code 1) si des problèmes critiques sont détectés :
- Clés manquantes
- Clés non définies

Idéal pour bloquer les déploiements avec des traductions incomplètes.

### Corrections automatiques

L'option `--fix` ajoute automatiquement les clés manquantes avec un marqueur `[TODO]` :

```json
{
  "auth": {
    "welcome": {
      "getStarted": "[TODO] Get Started"
    }
  }
}
```

⚠️ **Important** : Les clés `[TODO]` doivent être traduites manuellement.

### Rapport CSV

L'option `--report=fichier.csv` génère un rapport détaillé au format CSV avec :
- Type de problème
- Clé concernée
- Description
- Valeurs EN/FR
- Action recommandée

Utile pour suivre les corrections dans un tableur.
