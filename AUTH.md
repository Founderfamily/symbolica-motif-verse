
# Système d'Authentification - Documentation Complète

## Vue d'ensemble

Le système d'authentification de Symbolica est basé sur Supabase Auth avec une architecture React complète incluant gestion des profils utilisateur, protection des routes, et fonctionnalités avancées de sécurité.

**État actuel** : ✅ **STABLE** - Système complet et opérationnel

---

## 📊 BASE DE DONNÉES

### Structure de la Table Principale

#### `profiles` (Table des profils utilisateur)
```sql
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NULL,
  full_name text NULL,
  is_admin boolean NULL DEFAULT false,
  is_banned boolean NULL DEFAULT false,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  PRIMARY KEY (id)
);
```

**Colonnes détaillées** :
- `id` : UUID référençant `auth.users` (clé primaire)
- `username` : Nom d'utilisateur unique (nullable)
- `full_name` : Nom complet de l'utilisateur (nullable)
- `is_admin` : Statut administrateur (défaut: false)
- `is_banned` : Statut de bannissement (défaut: false)
- `created_at` : Date de création du profil
- `updated_at` : Date de dernière modification

### Politiques RLS (Row Level Security)

**Note importante** : Actuellement, aucune politique RLS n'est configurée sur la table `profiles`, ce qui signifie que l'accès est ouvert. Ceci pourrait nécessiter une révision pour la sécurité.

### Fonctions SQL Dédiées

#### `handle_new_user()`
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    username,
    full_name,
    avatar_url
  ) VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```
**Usage** : Trigger automatique sur création d'utilisateur dans `auth.users`

#### `update_modified_column()`
```sql
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```
**Usage** : Mise à jour automatique du timestamp `updated_at`

### Relations avec Autres Tables

La table `profiles` est référencée par de nombreuses autres tables :
- `user_contributions` → `profiles.id`
- `user_activities` → `profiles.id` 
- `user_points` → `profiles.id`
- `user_follows` → `profiles.id`
- `admin_logs` → `profiles.id`
- `collections` → `profiles.id` (created_by)
- Et bien d'autres...

---

## 🏗️ ARCHITECTURE FRONTEND

### Hook Principal d'Authentification

#### `src/hooks/useAuth.tsx` ✅
- **Pattern** : Context Provider avec React Hook
- **Responsabilités** :
  - Gestion de l'état d'authentification
  - Suivi des sessions Supabase
  - Gestion des profils utilisateur
  - Fonctions CRUD pour l'authentification

**Interface AuthContext** :
```typescript
interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, userData?: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
}
```

**Fonctionnalités clés** :
- ✅ Récupération automatique de session au démarrage
- ✅ Écoute des changements d'état d'authentification
- ✅ Synchronisation profil utilisateur/auth
- ✅ Gestion des erreurs d'authentification
- ✅ Mise à jour de profil en temps réel

### Types d'Authentification

#### `src/types/auth.ts` ✅
**UserProfile Interface** :
```typescript
export interface UserProfile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  contributions_count?: number;
  symbols_count?: number;
  verified_uploads?: number;
  favorite_cultures?: string[] | null;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
  email_verified?: boolean | null;
  email?: string | null;
  user_metadata?: Record<string, any> | null;
}
```

**AuthState Interface** :
```typescript
export interface AuthState {
  isLoading: boolean;
  user: UserProfile | null;
  error: string | null;
}
```

---

## 🔐 COMPOSANTS D'AUTHENTIFICATION

### Formulaire Principal d'Authentification

#### `src/components/auth/AuthForm.tsx` ⚠️ (449 lignes)
- **Responsabilité** : Formulaire unifié connexion/inscription
- **Fonctionnalités** :
  - Validation avec React Hook Form + Zod
  - Onglets connexion/inscription
  - Indicateur de force de mot de passe
  - Gestion d'erreurs contextuelle
  - Icônes de validation en temps réel
  - Modal de bienvenue post-inscription

**Schémas de validation** :
```typescript
// Connexion
const loginSchema = z.object({
  email: z.string().email('Veuillez entrer un email valide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

// Inscription
const registerSchema = z.object({
  email: z.string().email('Veuillez entrer un email valide'),
  username: z.string().min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères').max(50),
  fullName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100).optional(),
  password: z.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/\d/, 'Le mot de passe doit contenir au moins un chiffre'),
  passwordConfirm: z.string().min(6),
});
```

### Protection des Routes

#### `src/components/auth/ProtectedRoute.tsx` ✅
- **Responsabilité** : HOC de protection des routes authentifiées
- **Fonctionnalités** :
  - Vérification automatique d'authentification
  - Redirection vers `/auth` si non connecté
  - Skeleton loader pendant vérification
  - Gestion des états de chargement

### Composants de Support

#### `src/components/auth/PasswordStrengthIndicator.tsx` ✅
- **Responsabilité** : Indicateur visuel de force du mot de passe
- **Critères** : Longueur, majuscules, minuscules, chiffres
- **Interface** : Barre de progression + checklist

#### `src/components/auth/SecurityBadges.tsx` ✅
- **Responsabilité** : Badges de confiance sécuritaire
- **Éléments** : SSL, RGPD, Anti-spam, Gratuit

#### `src/components/auth/WelcomeModal.tsx` (non-visible mais référencé)
- **Responsabilité** : Modal d'accueil post-inscription
- **Fonctionnalités** : Message personnalisé avec nom d'utilisateur

---

## 🎯 PAGE D'AUTHENTIFICATION

#### `src/pages/Auth.tsx` ⚠️ (215 lignes)
- **Responsabilité** : Page principale d'authentification
- **Fonctionnalités** :
  - Design en deux colonnes (formulaire + informations)
  - Redirection automatique si connecté
  - Statistiques communauté en temps réel
  - Témoignages utilisateurs
  - Features highlights avec icônes
  - Design responsive complet

**Statistiques affichées** :
- **1,234** chercheurs actifs
- **89** pays représentés  
- **2,847** symboles documentés
- **156** traditions culturelles

**Features mises en avant** :
- **Sécurisé & Privé** : Chiffrement bancaire
- **IA Avancée** : Outils d'analyse intelligents
- **Certifié Académique** : Reconnu par institutions

---

## 🔄 FLUX D'AUTHENTIFICATION

### Inscription (Sign Up)
```
1. Utilisateur remplit formulaire inscription
   ├── Email + Mot de passe + Username + Nom complet
   ├── Validation Zod en temps réel
   └── Indicateur force mot de passe

2. Soumission vers Supabase Auth
   ├── signUp() via useAuth hook
   ├── Vérification email unique
   └── Création compte dans auth.users

3. Trigger SQL handle_new_user()
   ├── Création entrée dans profiles
   └── Copie des métadonnées

4. Modal de bienvenue
```

### Connexion (Sign In)
```
1. Utilisateur remplit formulaire connexion
   ├── Email + Mot de passe
   └── Validation Zod

2. Soumission vers Supabase Auth
   ├── signIn() via useAuth hook
   └── Vérification identifiants

3. Si succès:
   ├── Récupération session JWT
   ├── Chargement profil utilisateur
   └── Redirection vers page d'accueil

4. Si échec:
   └── Affichage message d'erreur contextualisé
```

### Déconnexion (Sign Out)
```
1. Utilisateur clique bouton déconnexion
2. signOut() via useAuth hook
3. Suppression session côté client
4. Redirection vers page d'accueil ou authentification
```

---

## 🌐 INTERNATIONALISATION

### Fichiers de Traduction

#### `src/i18n/locales/en/auth.json` (50+ clés) ✅
```json
{
  "auth": {
    "login": "Log in",
    "register": "Register",
    "loginToAccount": "Log in to your account",
    "createAccount": "Create an account",
    "forgotPassword": "Forgot password?",
    // etc.
  }
}
```

#### `src/i18n/locales/fr/auth.json` (50+ clés) ✅
**État** : 100% de couverture des traductions

### Intégration via I18nText

**Exemple** :
```tsx
<h2 className="text-2xl font-bold text-white">
  <I18nText translationKey="app.name">Symbolica</I18nText>
</h2>
```

---

## ⚡ PERFORMANCES ET OPTIMISATIONS

### Optimisations de Chargement
- **Mise en cache** des données de profil
- **Memoization** des fonctions d'authentification
- **Preloading** des modals et composants secondaires
- **Skeleton loaders** pendant le chargement

### Sécurité
- **Chiffrement SSL** des communications
- **Hachage des mots de passe** via Supabase Auth
- **Validation des entrées** avec Zod
- **Protection CSRF** native Supabase
- **RLS** à activer (recommandé)

### Expérience Utilisateur
- **Animations fluides** avec transitions CSS
- **Indicateurs visuels** pour validation des champs
- **Messages d'erreur** contextualisés
- **Témoignages** d'utilisateurs
- **Badges** de confiance et sécurité

---

## ✅ POINTS FORTS / ⚠️ POINTS D'ATTENTION

### ✅ Points Forts
- **Architecture solide** : Context Provider pattern
- **UX soignée** : Design responsive et feedback visuels
- **Validation robuste** : Schémas Zod complets
- **Internationalisation** : Support complet FR/EN
- **Sécurité** : Validations front/back

### ⚠️ Points d'Attention
- **Fichiers volumineux** : AuthForm.tsx (449 lignes) et Auth.tsx (215 lignes)
- **RLS manquantes** : Aucune politique RLS sur profiles
- **États globaux** : État auth pourrait être centralisé via React Query
- **Redondance** : Double définition UserProfile (useAuth.tsx et auth.ts)

---

## 📊 STATISTIQUES ACTUELLES

### Utilisateurs (Base de données)
- **Total** : Statistiques réelles non disponibles
- **Administrateurs** : Mécanisme prêt via `is_admin`
- **Bannis** : Mécanisme prêt via `is_banned`

### Code Frontend
- **Hooks** : 1 hook principal (useAuth)
- **Components** : 5 composants dédiés
- **Pages** : 1 page Auth + intégration ProtectedRoute
- **Tests** : Non disponibles / À implémenter

### Intégrations
- **Supabase Auth** : Complètement intégré
- **Row Level Security** : À implémenter
- **Gamification** : Intégration prête (via user_points)
- **Profiles** : Intégration complète avec User

---

## 📝 RÉSUMÉ EXÉCUTIF

### État Actuel ✅ STABLE
- **Authentification complète** avec inscription/connexion
- **Gestion de profils** synchronisée avec auth
- **UX soignée** avec validation et feedback
- **Architecture robuste** basée sur Context API
- **Multilingue** avec traductions complètes FR/EN

### Recommandations
1. ✅ **Activer les politiques RLS** sur la table profiles
2. ✅ **Refactorer AuthForm.tsx** (trop volumineux)
3. ✅ **Centraliser les types** UserProfile
4. ✅ **Ajouter des tests** pour les flows critiques
5. ✅ **Implémenter la vérification d'email** (optionnel)

Ce document sert de référence complète pour le système d'authentification, son état actuel, et ses perspectives d'évolution.
