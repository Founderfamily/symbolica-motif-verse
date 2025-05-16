
# Translation Workflow Guide

This document explains our translation management process from development to production.

## Development Workflow

### 1. Adding New Text to Components

When adding new user-facing text to components:

- **ALWAYS** use the `<I18nText>` component:
  ```jsx
  <I18nText translationKey="namespace.section.element" />
  ```

- **NEVER** use direct `t()` calls:
  ```jsx
  // ❌ AVOID THIS
  <div>{t('key')}</div>
  ```

- **Follow the key naming convention**:
  ```
  namespace.section.element[.qualifier]
  ```
  
  Examples:
  - `auth.buttons.login`
  - `profile.messages.save.success`

### 2. Adding New Keys to Translation Files

- Add ALL new keys to BOTH language files:
  - `src/i18n/locales/en.json`
  - `src/i18n/locales/fr.json`
  
- Maintain the same nested structure in both files

Example:
```json
// en.json
{
  "auth": {
    "buttons": {
      "login": "Log in",
      "register": "Sign up"
    }
  }
}

// fr.json
{
  "auth": {
    "buttons": {
      "login": "Connexion",
      "register": "S'inscrire"
    }
  }
}
```

### 3. Checking for Translation Issues

During development:
- Missing translations are highlighted with a red outline
- Format mismatches are highlighted with an amber outline
- Run `translationValidator.validateAndLog()` in the console to check for issues
- Use the "Check Translations" button that appears in development mode

## Pull Request Checklist

Before submitting a PR, ensure:

- [ ] All new text uses the `<I18nText>` component
- [ ] All translation keys follow the naming convention
- [ ] New keys are added to both language files
- [ ] No direct `t()` calls are introduced
- [ ] Run `translationValidator.validateAndLog()` to verify no issues

## CI/CD Integration

Our continuous integration:
1. Validates that all translations exist in both languages
2. Checks for format inconsistencies between languages
3. Warns about keys not following naming conventions
4. Prevents merging if critical translation issues are found

## Refactoring Legacy Code

When working with existing code:
1. Replace direct `t()` calls with `<I18nText>`
2. Update keys to follow the naming convention
3. Use the direct usage scanner to find t() calls

Run this command to generate a report of direct t() usage:

```bash
npx ts-node src/i18n/directUsageScanner.ts
```

## Requesting Translations

When new features require substantial new text:
1. Add the keys with English placeholders in both files
2. Mark keys pending translation with the qualifier `.pending`
3. Submit a translation request to the localization team

Remember: **Quality translations are everyone's responsibility!**
