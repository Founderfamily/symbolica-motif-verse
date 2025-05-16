
# Complete Translation System Reference

## System Architecture

Our internationalization (i18n) system is built on these key components:

1. **i18next & react-i18next**: Core libraries powering our translation functionality
2. **I18nText Component**: Wrapper component that properly handles translations with validation
3. **useTranslation Hook**: Custom hook that wraps the base i18next hooks with validation
4. **Validation Tools**: Scripts to check translation completeness and consistency
5. **Language Files**: JSON files containing all translated strings by language

## File Structure

```
src/i18n/
├── config.ts                    # i18next configuration
├── locales/                     # Translation files
│   ├── en.json                  # English translations
│   └── fr.json                  # French translations
├── useTranslation.ts            # Custom hook with validation
├── components/
│   └── i18n-text.tsx            # I18nText component
├── translationValidator.ts      # Translation validation utility
├── translationKeyConventions.ts # Key format standards
├── directUsageScanner.ts        # Tool to find direct t() calls
├── ci-translation-validator.ts  # CI/CD validation
└── scripts/                     # Utility scripts
    ├── convert-t-to-i18ntext.js # Conversion utility
    └── check-translation-completeness.js # Validation
```

## Key Naming Convention

All translation keys MUST follow this structure:
```
namespace.section.element[.qualifier]
```

Where:
- **namespace**: Functional area (auth, faq, profile)
- **section**: Component or section type (buttons, labels)
- **element**: Specific element being translated
- **qualifier** (optional): Additional context or variant

Example: `auth.buttons.login.success`

## Translation Process

1. **Adding New Text**:
   ```jsx
   // ✅ CORRECT - Always use I18nText
   <I18nText translationKey="namespace.section.element" />
   
   // ❌ INCORRECT - Never use direct t() calls
   <div>{t('key')}</div>
   ```

2. **Adding Translation Keys**:
   - Always add keys to ALL language files
   - Maintain identical nested structure in all files
   - Follow the key naming convention
   
3. **Validation**:
   - Run `npm run validate-translations` before commits
   - Visual indicators in dev mode highlight issues
   - CI/CD pipeline validates translations

## Common Issues and Solutions

1. **Direct t() Usage**:
   - Problem: Using `{t('key')}` directly in JSX
   - Solution: Replace with `<I18nText translationKey="key" />`
   - Tool: Run `node src/i18n/convert-t-to-i18ntext.js <file_path>`

2. **Missing Keys**:
   - Problem: Keys exist in one language but not another
   - Solution: Add missing keys to all language files
   - Tool: Run `node src/i18n/check-translation-completeness.js`

3. **Format Inconsistencies**:
   - Problem: Placeholder differences between languages
   - Solution: Ensure identical placeholders in all translations
   - Example: `{name}` should be in all language versions if used

4. **Non-Standard Key Format**:
   - Problem: Keys not following convention
   - Solution: Refactor to match `namespace.section.element[.qualifier]`

## Developer Tools

### Validation Commands

- `npm run validate-translations`: Check all translations
- `npm run scan-direct-usage`: Find direct t() calls
- `npm run convert-file <path>`: Convert a file to use I18nText

### Visual Aids in Development

- Missing translations: Red outline
- Format mismatches: Yellow outline
- Hover tooltip shows the issue
- Translation check button in bottom right

### Console Utilities

In development console, these utilities are available:
- `window.checkTranslations()`: Validate current page
- `translationValidator.validateAndLog()`: Check all translations
- Press `Ctrl+Alt+T` to run validation on current page

## Best Practices

1. **Always use I18nText component**
2. **Never hardcode text** in components
3. **Add translations to all languages** simultaneously
4. **Run validation** before committing changes
5. **Use consistent namespaces** for related features
6. **Parameterize dynamic content** with the params prop
7. **Review translation validation** in PR reviews

## Versioning

Current Translation System Version: **1.0.0**

Major changes:
- Complete replacement of direct t() calls with I18nText
- Standardized key naming convention
- Automated validation tools
- Developer visual aids
