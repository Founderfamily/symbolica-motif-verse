
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

### 4. Ensuring Completeness

- Add all keys to **both** language files
- Run the translation validator regularly:
```js
translationValidator.validateAndLog();
```

### 5. Handling New Features

When developing new features:
1. Add all translation keys upfront
2. Use placeholder text in non-primary languages if translations aren't available yet
3. Mark temporary translations with `.pending` qualifier

### 6. Translation Workflow

1. Developer adds new text with `<I18nText>`
2. Keys are added to all language files
3. Translation team reviews and updates non-primary languages
4. CI checks ensure no missing translations are deployed

### 7. Converting Legacy Code

Use the directUsageScanner:
```
node src/i18n/directUsageScanner.js
```

## Tools Available

- **I18nText Component**: Smart component that handles translations with validation
- **translationValidator**: Validates all translations across languages
- **directUsageScanner**: Scans for direct `t()` usage that should be replaced
- **Pre-commit Hook**: Prevents committing code with direct `t()` usage
- **CI Validation**: Ensures all translations exist in all languages

Remember: Quality translations are everyone's responsibility!
