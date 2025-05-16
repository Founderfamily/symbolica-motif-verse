
# Translation Key Style Guide

This document outlines the standardized approach to managing translation keys within our application.

## Key Structure

All translation keys MUST follow this structure:

```
namespace.section.element[.qualifier]
```

Where:
- **namespace**: The functional area (e.g., `auth`, `faq`, `profile`)
- **section**: The component or section type (e.g., `buttons`, `labels`, `questions`)
- **element**: The specific element being translated (e.g., `login`, `email`, `password`)
- **qualifier** (optional): Additional context or variant (e.g., `success`, `error`, `placeholder`)

## Examples

✅ **Good examples:**
```
auth.buttons.login
auth.labels.email
faq.questions.general.what
profile.messages.save.success
```

❌ **Bad examples:**
```
login_button          // Missing structure
authEmailLabel        // Camel case and missing dots
faq.question1         // Not descriptive, uses numbers
save_success_message  // Uses underscores
```

## Standard Namespaces

Use these established namespaces:

- `app` - App-wide elements like app name, tagline
- `auth` - Authentication related
- `common` - Shared UI elements (buttons, labels, etc)
- `errors` - Error messages
- `faq` - FAQ related content
- `map` - Map explorer related
- `profile` - User profile related
- `explore` - Exploration features
- `about` - About page and sections
- `footer` - Footer content
- `header` - Header and navigation

## Standard Sections

Common section types include:
- `buttons` - Button text
- `labels` - Form labels and UI text
- `titles` - Page or section titles
- `subtitles` - Secondary titles
- `messages` - Feedback messages
- `placeholder` - Input placeholders
- `questions` - FAQ questions
- `answers` - FAQ answers

## Best Practices

1. **ALWAYS use the I18nText component**
   ```jsx
   // CORRECT
   <I18nText translationKey="auth.buttons.login" />
   
   // INCORRECT - Never do this!
   <span>{t('auth.buttons.login')}</span>
   ```

2. **Be consistent with related keys**
   Group related translations under the same namespace and section.
   
3. **Use descriptive element names**
   The element part should clearly describe what is being translated.
   
4. **Handle dynamic content with parameters**
   ```jsx
   // In translation file
   { "profile.welcome": "Welcome, {name}!" }
   
   // In component
   <I18nText translationKey="profile.welcome" params={{ name: user.name }} />
   ```

5. **Never hardcode text directly in components**
   All user-facing text must use the translation system.
   
6. **Run validation before committing**
   Use `translationValidator.validateAndLog()` to check for issues.

## Validation Tools

Our project includes tools to help maintain translation quality:
- Visual indicators in development for missing keys
- Automated CI/CD validation for missing translations
- Console commands for checking translations

Remember: Translation management is everyone's responsibility!

