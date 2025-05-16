
# Translation Implementation Guide

This guide provides practical steps for implementing translations in your components.

## Using the I18nText Component

The `I18nText` component is the primary way to display translated content:

```jsx
import { I18nText } from '@/components/ui/i18n-text';

// Basic usage
<I18nText translationKey="namespace.section.element" />

// With parameters
<I18nText 
  translationKey="profile.greeting.welcome" 
  params={{ name: user.name }}
/>

// With custom element type
<I18nText 
  translationKey="page.title.main" 
  as="h1" 
  className="text-2xl font-bold"
/>
```

## Component Props

| Prop | Type | Description |
|------|------|-------------|
| `translationKey` | string | The translation key (required) |
| `params` | object | Parameters for variable substitution |
| `as` | string | HTML element type (default: 'span') |
| `className` | string | Additional CSS classes |
| `highlightMissing` | boolean | Whether to highlight missing translations |

## Handling Complex Cases

### Dynamic Translation Keys

When the key needs to be dynamic:

```jsx
const dynamicKey = `features.${featureType}.title`;
<I18nText translationKey={dynamicKey} />
```

### Translations in Attributes

For attributes like placeholder, title, etc.:

```jsx
// Create a variable with the translated text
const placeholderText = t('form.input.email.placeholder');

// Use the variable in the attribute
<input placeholder={placeholderText} />
```

### Interpolating Values

To include dynamic values in translations:

```jsx
// In translation file (en.json)
{
  "profile.points.count": "You have {points} points"
}

// In component
<I18nText 
  translationKey="profile.points.count" 
  params={{ points: user.points }}
/>
```

### Pluralization

For content that changes based on count:

```jsx
// In translation file (en.json)
{
  "items.count": "{{count}} item",
  "items.count_plural": "{{count}} items"
}

// In component
<I18nText 
  translationKey="items.count" 
  params={{ count: itemCount }}
/>
```

## Working with the Translation System

### Adding New Keys

1. Identify the appropriate namespace and section
2. Add the key to BOTH language files (en.json and fr.json)
3. Follow the naming convention: `namespace.section.element[.qualifier]`

### Converting Direct t() Calls

Use the conversion utility:

```bash
# Convert a specific file
node src/i18n/convert-t-to-i18ntext.js src/components/MyComponent.tsx

# Run all fixes across the project
node src/i18n/scripts/run-all-fixes.js --auto-fix
```

### Validating Translations

```bash
# Check for issues
npm run validate-translations

# Auto-fix simple issues
npm run validate-translations:fix

# Generate a report
npm run validate-translations:report
```

### Visual Cues in Development

- **Red outline**: Missing translation
- **Yellow outline**: Format mismatch
- **Tooltip on hover**: Shows the specific issue
- **Check button**: In the bottom right of your app in development mode

## Best Practices

1. **Use I18nText for all visible text**
   Even for small text bits or seemingly "unchangeable" content

2. **Keep translations organized by feature**
   Group related keys under the same namespace

3. **Be descriptive with key names**
   Keys should be self-explanatory and follow conventions

4. **Add translations to all languages at once**
   Don't leave keys missing in any language

5. **Test with different languages**
   Verify that your UI adapts well to different text lengths

6. **Review the automated reports**
   Fix issues highlighted in validation reports

7. **Use the CI/CD integration**
   Set up pre-commit hooks to catch issues early

## Common Pitfalls

- **Direct string concatenation**  
  ❌ `t('common.hello') + ' ' + username`  
  ✅ `<I18nText translationKey="common.hello.user" params={{ name: username }} />`

- **Inconsistent placeholders**  
  ❌ Different parameter names between languages  
  ✅ Use the same parameter names in all languages

- **Forgotten translation keys**  
  ❌ Only adding keys to the primary language  
  ✅ Always add to all language files

- **Manual HTML in translations**  
  ❌ Including HTML tags directly in translations  
  ✅ Use React components for structure and translations for text
