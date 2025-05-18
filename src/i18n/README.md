
# Translation System Architecture

This document outlines the architecture and best practices for the project's translation system.

## Core Components

1. **TranslationProvider**: Acts as a global provider that initializes and maintains language consistency
2. **useTranslation Hook**: Enhanced version of the react-i18next hook with better error handling and validation
3. **I18nText Component**: React component for safely displaying translated text with visual indicators for missing translations
4. **Translation Validation**: Tools to check for missing or improperly formatted translations

## Flow Diagram

```
main.tsx → i18n/config.ts (initialization)
   ↓
TranslationProvider (global state)
   ↓
useTranslation Hook (consumed by components)
   ↓
I18nText Component (rendering)
```

## Best Practices

### Always Use I18nText Component

```jsx
// CORRECT
<I18nText translationKey="namespace.section.element" />

// AVOID
<p>{t('welcome.message')}</p>
```

### Centralized Language Management

Language changes should only happen via:
- `changeLanguage()` from the useTranslation hook
- `switchLanguage()` utility function
- User explicit action via UI

### Error Handling

The system handles missing translations by:
1. Logging warnings in development
2. Providing formatted fallbacks in production
3. Visual indicators for missing translations in development mode

### Performance Considerations

- All hook functions are memoized to prevent unnecessary re-renders
- The TranslationProvider centralizes language handling
- Language detection happens only once at app initialization

## Debugging Tools

In development mode:
- Press `Ctrl+Alt+L` to toggle between languages
- Open browser console to see translation validation reports
- Missing translations are highlighted with a red outline
- Run `window.i18nTools.checkMissingTranslations()` in the console to validate current page

## Known Issues

- Some older component might still use direct `t()` calls instead of `I18nText`
- Certain dynamic keys may not be properly validated

## Future Improvements

- Complete migration to I18nText for all text elements
- Add automated testing for translation completeness
- Implement translation management UI for non-technical users
