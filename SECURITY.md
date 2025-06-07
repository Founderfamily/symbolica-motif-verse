
# Guide de sécurité - Symbolica Museum

## Architecture de sécurité

### Vue d'ensemble
Symbolica Museum implémente une architecture de sécurité multi-niveaux basée sur :
- Authentification Supabase Auth
- Row-Level Security (RLS) PostgreSQL
- Validation côté client et serveur
- Chiffrement des communications

## Authentification et autorisation

### Système d'authentification
```typescript
// Fournisseur: Supabase Auth
// Méthodes supportées:
- Email/Mot de passe
- Réinitialisation par email
- Confirmation d'email obligatoire
```

### Gestion des rôles
```sql
-- Enum des rôles
create type public.app_role as enum ('admin', 'moderator', 'user');

-- Table des rôles utilisateur
create table public.user_roles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    role app_role not null,
    unique (user_id, role)
);
```

### Fonction de vérification des rôles
```sql
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;
```

## Politiques Row-Level Security (RLS)

### Tables avec RLS activé
Toutes les tables principales ont RLS activé :
- `profiles` - Profils utilisateur
- `user_contributions` - Contributions
- `collections` - Collections
- `symbols` - Symboles
- `user_activities` - Activités
- `notifications` - Notifications
- `direct_messages` - Messages privés

### Exemples de politiques

#### Profils utilisateur
```sql
-- Les utilisateurs peuvent voir tous les profils publics
create policy "Public profiles are viewable by everyone"
on profiles for select
using (true);

-- Les utilisateurs ne peuvent modifier que leur propre profil
create policy "Users can update own profile"
on profiles for update
using (auth.uid() = id);
```

#### Contributions
```sql
-- Les utilisateurs peuvent voir les contributions approuvées
create policy "Approved contributions are public"
on user_contributions for select
using (status = 'approved');

-- Les utilisateurs peuvent voir leurs propres contributions
create policy "Users can view own contributions"
on user_contributions for select
using (auth.uid() = user_id);

-- Seuls les admins peuvent approuver/rejeter
create policy "Admins can moderate contributions"
on user_contributions for update
using (public.has_role(auth.uid(), 'admin'));
```

#### Collections
```sql
-- Collections publiques visibles par tous
create policy "Public collections viewable"
on collections for select
using (is_public = true);

-- Propriétaires peuvent gérer leurs collections
create policy "Owners can manage collections"
on collections for all
using (auth.uid() = created_by);
```

### Sécurité des API

#### Validation des entrées
```typescript
// Exemple de validation Zod
const contributionSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  cultural_context: z.string().optional()
});
```

#### Protection CSRF
- Tokens d'authentification Bearer
- Validation des headers Origin
- SameSite cookies

## Sécurité des données

### Chiffrement
- **En transit** : TLS 1.3 pour toutes les communications
- **Au repos** : Chiffrement base de données Supabase
- **Clés API** : Stockage sécurisé des variables d'environnement

### Backup et récupération
- Sauvegardes automatiques quotidiennes
- Réplication multi-région
- Point-in-time recovery disponible

### Anonymisation
```sql
-- Fonction d'anonymisation pour RGPD
create or replace function anonymize_user_data(user_uuid uuid)
returns void as $$
begin
  update profiles 
  set 
    email = 'deleted@symbolica.museum',
    full_name = 'Utilisateur supprimé',
    username = null
  where id = user_uuid;
  
  update user_contributions
  set title = 'Contribution supprimée'
  where user_id = user_uuid;
end;
$$ language plpgsql security definer;
```

## Audit et monitoring

### Logs d'administration
```sql
-- Table des logs admin
create table admin_logs (
    id uuid primary key default gen_random_uuid(),
    admin_id uuid references auth.users(id),
    action text not null,
    entity_type text not null,
    entity_id uuid,
    details jsonb default '{}',
    created_at timestamp with time zone default now()
);
```

### Événements surveillés
- Connexions/déconnexions
- Modifications de rôles
- Approbations/rejets de contributions
- Accès aux données sensibles
- Tentatives d'accès non autorisé

### Alertes de sécurité
- Tentatives de connexion multiples échouées
- Accès admin depuis nouvelles IP
- Modifications de politiques RLS
- Upload de fichiers suspects

## Conformité RGPD

### Droits des utilisateurs
- **Accès** : Export de toutes les données utilisateur
- **Rectification** : Modification des données personnelles
- **Effacement** : Suppression complète du compte
- **Portabilité** : Export des données en format JSON
- **Opposition** : Opt-out des communications

### Base légale
- **Consentement** : Pour newsletters et communications
- **Exécution contractuelle** : Pour l'utilisation du service
- **Intérêt légitime** : Pour amélioration du service

### Conservation des données
```typescript
// Politique de rétention
const dataRetentionPolicy = {
  userProfiles: '5 ans après dernière connexion',
  contributions: 'Conservation permanente (valeur historique)',
  logs: '2 ans maximum',
  analytics: '26 mois (anonymisées)',
  backups: '1 an'
};
```

## Sécurité frontend

### Validation côté client
```typescript
// Sanitization des inputs
const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
};
```

### Protection XSS
- Content Security Policy (CSP)
- Sanitization des données utilisateur
- Échappement automatique React

### Gestion des secrets
```typescript
// Variables d'environnement
const config = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  mapboxToken: import.meta.env.VITE_MAPBOX_TOKEN
};

// Validation de la présence des clés
if (!config.supabaseUrl || !config.supabaseAnonKey) {
  throw new Error('Configuration Supabase manquante');
}
```

## Incident Response

### Procédure d'urgence
1. **Détection** : Monitoring automatique + signalement
2. **Isolation** : Désactivation des comptes compromis
3. **Investigation** : Analyse des logs et impact
4. **Correction** : Patch de sécurité + mise à jour
5. **Communication** : Notification utilisateurs si nécessaire

### Contacts d'urgence
- **Sécurité** : security@symbolica-museum.org
- **Admin système** : admin@symbolica-museum.org
- **RGPD** : privacy@symbolica-museum.org

## Tests de sécurité

### Tests automatisés
```bash
# Audit des dépendances
npm audit

# Tests de sécurité
npm run security-test

# Validation des politiques RLS
npm run test-rls
```

### Tests manuels réguliers
- Penetration testing trimestriel
- Audit des accès utilisateur
- Révision des politiques RLS
- Test de restauration de backup

## Mises à jour de sécurité

### Processus de mise à jour
1. Monitoring des CVE
2. Évaluation de l'impact
3. Test en environnement staging
4. Déploiement progressif
5. Vérification post-déploiement

### Changelog sécurité
Toutes les mises à jour de sécurité sont documentées avec :
- Date et version
- Description de la vulnérabilité
- Actions correctives prises
- Impact sur les utilisateurs
