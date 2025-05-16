
# Translation Best Practices

This document provides guidelines for managing translations in our application.

## Key Problems We're Solving

1. **Direct `t()` Usage**: Using `t()` directly in JSX is error-prone and harder to track.
2. **Missing Translations**: Keys that exist in one language but not another.
3. **Format Inconsistencies**: Different placeholders between languages.
4. **Naming Conventions**: Inconsistent key naming patterns.

## Best Practices

### 1. Always Use I18nText Component

**CORRECT:**
```jsx
<p><I18nText translationKey="welcome.message" /></p>
```

**AVOID:**
```jsx
<p>{t('welcome.message')}</p>
```

### 2. For JSX Attributes

When you need translations in attributes like `placeholder`, `title`, etc:

**CORRECT:**
```jsx
const placeholderText = t('form.email.placeholder');
return <input placeholder={placeholderText} />;
```

**AVOID:**
```jsx
<input placeholder={t('form.email.placeholder')} />
```

### 3. Key Naming Convention

Follow the pattern: `namespace.section.element[.qualifier]`

Examples:
- `auth.form.email.label`
- `profile.settings.notifications.title`
- `dashboard.stats.users.count`

### 4. File-by-File Migration Strategy

When converting existing code:
1. Run scan on a specific file: `node src/i18n/directUsageScanner.js path/to/file.tsx`
2. Replace all direct `t()` calls with `<I18nText>`
3. For attributes, extract to local constants
4. Verify with another scan before committing

### 5. Ensuring Completeness

- Add all keys to **both** language files
- Run the translation validator regularly:
```js
translationValidator.validateAndLog();
```

### 6. Handling New Features

When developing new features:
1. Add all translation keys upfront
2. Use placeholder text in non-primary languages if translations aren't available yet
3. Mark temporary translations with `.pending` qualifier

### 7. Translation Workflow

1. Developer adds new text with `<I18nText>`
2. Keys are added to all language files
3. Translation team reviews and updates non-primary languages
4. CI checks ensure no missing translations are deployed

### 8. Using the Pre-commit Hook

Our pre-commit hook automatically checks for direct `t()` usage:

```bash
# Make the hook executable
chmod +x src/i18n/pre-commit-hook.js

# Link it to git hooks
ln -sf ../../src/i18n/pre-commit-hook.js .git/hooks/pre-commit
```

### 9. CI/CD Integration

Our CI workflow includes automated checks for:
- Direct `t()` usage
- Missing translation keys
- Format inconsistencies between languages

### 10. Converting Legacy Code

Use the directUsageScanner and convert-t-to-i18ntext:

```bash
# Find all direct t() usage
node src/i18n/directUsageScanner.js

# Convert a specific file
node src/i18n/convert-t-to-i18ntext.js path/to/file.tsx

# Verify conversion
node src/i18n/directUsageScanner.js path/to/file.tsx
```

## Tools Available

- **I18nText Component**: Smart component that handles translations with validation
- **translationValidator**: Validates all translations across languages
- **directUsageScanner**: Scans for direct `t()` usage that should be replaced
- **convert-t-to-i18ntext**: Assists with converting direct usage to component usage
- **pre-commit-hook**: Prevents committing code with direct `t()` usage
- **ci-translation-scanner**: Runs in CI pipelines to enforce translation quality
- **ci-translation-validator**: Ensures all translations exist in all languages

Remember: Quality translations are everyone's responsibility!
