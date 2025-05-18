
# Translation Migration Checklist (t() → I18nText)

This document tracks the progress of migrating from the `t()` translation function to the `<I18nText>` component throughout the codebase.

## 🚀 Migration Status

- Total files to migrate: 78
- Currently migrated: 32 (41%)
- Remaining: 46 files

## 🌟 Benefits of Migration

- Visual indicators for missing translations in development mode
- Better fallback behavior
- Type safety for translation parameters
- Consistent styling for translated text
- Automatic key validation

## 📋 Checklist

### ✅ Already Migrated Files

#### Components: Layout
- [x] `src/components/layout/Header.tsx`
- [x] `src/components/layout/Footer.tsx`
- [x] `src/components/layout/Layout.tsx`
- [x] `src/components/layout/Sidebar.tsx`

#### Components: UI
- [x] `src/components/ui/LanguageSelector.tsx`
- [x] `src/components/ui/open-source-badge.tsx`
- [x] `src/components/ui/NotFound.tsx`
- [x] `src/components/ui/TranslatedInput.tsx`
- [x] `src/components/ui/i18n-text.tsx`

#### Components: Sections
- [x] `src/components/sections/Hero.tsx`
- [x] `src/components/sections/Features.tsx`
- [x] `src/components/sections/Community.tsx`
- [x] `src/components/sections/CallToAction.tsx`
- [x] `src/components/sections/SymbolTriptychSection.tsx`

#### Components: Symbols
- [x] `src/components/symbols/SymbolCard.tsx`
- [x] `src/components/symbols/SymbolGrid.tsx`
- [x] `src/components/symbols/SymbolListEmpty.tsx`

#### Pages
- [x] `src/pages/HomePage.tsx`
- [x] `src/pages/AboutPage.tsx`
- [x] `src/pages/MapExplorerPage.tsx`
- [x] `src/pages/SymbolExplorer.tsx`
- [x] `src/pages/SymbolDetail.tsx`
- [x] `src/pages/ContributionsPage.tsx`
- [x] `src/pages/Profile.tsx`
- [x] `src/pages/NotFound.tsx`

#### Pages: Groups
- [x] `src/pages/Groups/GroupCreatePage.tsx`
- [x] `src/pages/Groups/GroupDetailPage.tsx`
- [x] `src/pages/Groups/GroupsPage.tsx`

### 🚧 Files to Migrate

#### Components: Forms
- [ ] `src/components/forms/SymbolUploadForm.tsx`
- [ ] `src/components/forms/ContactForm.tsx`
- [ ] `src/components/forms/CommentForm.tsx`

#### Components: Search
- [ ] `src/components/search/SearchFilters.tsx` 
- [ ] `src/components/search/SymbolGrid.tsx`
- [ ] `src/components/search/SearchBar.tsx`

#### Components: Symbols
- [ ] `src/components/symbols/SymbolForm.tsx`
- [ ] `src/components/symbols/SymbolMetadata.tsx`
- [ ] `src/components/symbols/SymbolTriptych.tsx`
- [ ] `src/components/symbols/SymbolUploader.tsx`

#### Components: Admin
- [ ] `src/components/admin/SymbolsManagement.tsx`
- [ ] `src/components/admin/ContentManagement.tsx`
- [ ] `src/components/admin/UserManagement.tsx`
- [ ] `src/components/admin/AnalysisExampleForm.tsx`
- [ ] `src/components/admin/AnalysisExamplesList.tsx`

#### Components: UI
- [ ] `src/components/ui/UploadForm.tsx`
- [ ] `src/components/ui/SearchFilters.tsx`
- [ ] `src/components/ui/SearchResultItem.tsx`
- [ ] `src/components/ui/TaxonomySelector.tsx`

#### Pages: Admin
- [ ] `src/pages/Admin/Dashboard.tsx`
- [ ] `src/pages/Admin/SymbolEditor.tsx`
- [ ] `src/pages/Admin/ContributionsManagement.tsx`
- [ ] `src/pages/Admin/AdminLayout.tsx`

#### Other Files
- [ ] `src/components/upload/ImageUpload.tsx`
- [ ] `src/components/upload/ImageDropzone.tsx`

## 🛠️ How to Migrate

1. Install the script runner:
   ```bash
   npm install -g ts-node
   ```

2. Run the migration check script:
   ```bash
   node src/scripts/check-i18n-progress.js
   ```

3. For each file with t() usage:
   - Replace `{t('key')}` with `<I18nText translationKey="key" />`
   - For attributes like `placeholder={t('key')}`:
     ```jsx
     // Before
     placeholder={t('form.placeholder.email')}
     
     // After
     placeholder={t('form.placeholder.email')}
     ```
   
4. Re-run the check script to verify your changes:
   ```bash
   node src/scripts/check-i18n-progress.js
   ```

## 📈 Progress Tracking

- [ ] Forms (0/3)
- [ ] Search Components (0/3)
- [ ] Symbol Components (0/4)
- [ ] Admin Components (0/5)
- [ ] UI Components (0/4)
- [ ] Admin Pages (0/4)
- [ ] Other Files (0/2)

**Last updated:** 2025-05-18
