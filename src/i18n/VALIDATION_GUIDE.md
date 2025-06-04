
# Guide de Validation i18n

## Script de Validation Automatique

Le script `validate-i18n.js` vérifie automatiquement l'intégrité des traductions dans le projet.

### Utilisation Directe

```bash
# Validation simple
node src/i18n/scripts/validate-i18n.js

# Validation avec propositions de corrections
node src/i18n/scripts/validate-i18n.js --fix

# Validation avec rapport CSV
node src/i18n/scripts/validate-i18n.js --report=i18n-report.csv
```

### Installation des Scripts NPM (Optionnel)

Pour utiliser avec `npm run`, ajoutez ces lignes dans votre `package.json` :

```json
{
  "scripts": {
    "validate-i18n": "node src/i18n/scripts/validate-i18n.js",
    "validate-i18n:fix": "node src/i18n/scripts/validate-i18n.js --fix",
    "validate-i18n:report": "node src/i18n/scripts/validate-i18n.js --report=i18n-report.csv"
  }
}
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

### Propositions de corrections

L'option `--fix` propose automatiquement l'ajout des clés manquantes :

```
🔧 Proposition de corrections automatiques...

Proposition d'ajout de 3 clés manquantes en FR:
  + "auth.resetPassword.invalidToken": "[TODO] Traduction requise"
  + "auth.welcome.getStarted": "[TODO] Traduction requise"
  + "profile.settings.theme": "[TODO] Traduction requise"

💡 3 corrections automatiques proposées
⚠️ Les clés [TODO] doivent être traduites manuellement
📝 Ajoutez-les aux fichiers de traduction appropriés
```

### Rapport CSV

L'option `--report=fichier.csv` génère un rapport détaillé au format CSV avec :
- Type de problème
- Clé concernée
- Description
- Valeurs EN/FR
- Action recommandée

Utile pour suivre les corrections dans un tableur.

### Commandes disponibles

```bash
# Validation simple
node src/i18n/scripts/validate-i18n.js

# Avec propositions de corrections
node src/i18n/scripts/validate-i18n.js --fix

# Avec rapport CSV
node src/i18n/scripts/validate-i18n.js --report=rapport.csv
```
