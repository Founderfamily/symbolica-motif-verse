
# Translation Key Management Guide

This document outlines the conventions and best practices for managing translations in our project. Following these guidelines ensures consistency across the application and makes it easier to maintain translations.

## Key Structure

Translation keys follow this format:

```
namespace.section.element[.qualifier]
```

### Examples:
- `map.labels.culture`
- `faq.questions.general.what`
- `profile.buttons.save`
- `auth.errors.invalidEmail`

## Namespaces

Namespaces are the top-level organization of keys into functional areas of the application:

- `app` - App-wide elements like app name, tagline
- `auth` - Authentication related
- `map` - Map explorer related
- `faq` - FAQ sections and pages
- `profile` - User profile related
- `symbols` - Symbol-related content
- `footer` - Footer sections
- `header` - Header and navigation
- `explore` - Exploration sections
- `about` - About page and sections
- `common` - Common UI elements
- `errors` - Error messages
- `gamification` - Points, achievements, etc.

## Sections

Sections are the second-level organization within a namespace:

- `labels` - Text labels for UI elements
- `buttons` - Button text
- `titles` - Page or section titles
- `subtitles` - Page or section subtitles
- `placeholders` - Input placeholders
- `errors` - Error messages
- `success` - Success messages
- `tooltips` - Tooltip text
- `badges` - Badge text
- `questions` - For FAQ questions
- `answers` - For FAQ answers
- `filters` - Filter options
- `sections` - Page sections

## Best Practices

### 1. Always Use I18nText Component

Instead of direct t() calls:

```jsx
// AVOID
<p>{t('profile.welcome')}</p>

// RECOMMENDED
<I18nText translationKey="profile.welcome" />
```

The `I18nText` component provides better development experience with:
- Visual highlighting of missing translations
- Data attributes for tooling
- Type safety
- Consistent styling

### 2. Keep Keys Consistent

Ensure keys are consistent across similar elements:

```
// GOOD: consistent pattern
header.buttons.login
header.buttons.signup
header.buttons.logout

// BAD: inconsistent pattern
header.loginButton
header.signup.button
header.logout_btn
```

### 3. Dynamic Content

When translating content with dynamic values, use placeholders:

```jsx
// In translation files
{
  "profile.greeting": "Hello, {name}!"
}

// In code
<I18nText 
  translationKey="profile.greeting" 
  params={{ name: user.name }} 
/>
```

### 4. Validation Tools

Use our validation tools to catch issues early:

- Run `translationValidator.validateAndLog()` in the browser console
- Watch for visual indicators of missing translations
- Check the Translation Validator overlay during development

## Translation Workflow

1. Add new keys to both language files (`en.json` and `fr.json`)
2. Follow the key structure conventions
3. Use the `I18nText` component for all user-facing text
4. Run validation during development to catch issues
5. Review translations before merging code

## Common Issues to Avoid

- Missing translations in one language
- Placeholder inconsistencies between languages
- Direct t() function calls
- Hardcoded text without translations
- Inconsistent key naming

## Translation Development Commands

Run these in your browser console during development:

- `translationValidator.validateAndLog()` - Check for missing translations
- `translationValidator.generateReport()` - Generate a detailed report
- Click the "🔍 Check Translations" button - Visual overlay of issues
