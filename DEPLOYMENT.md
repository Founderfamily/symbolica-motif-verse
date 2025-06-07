
# Guide de déploiement - Symbolica Museum

## Configuration de l'environnement

### Variables d'environnement requises

#### Production
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Mapbox Configuration
VITE_MAPBOX_TOKEN=your-mapbox-token

# Application Configuration
VITE_APP_URL=https://symbolica-museum.com
VITE_ENV=production
```

#### Développement
```env
# Supabase Configuration (local/staging)
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your-local-anon-key

# Mapbox Configuration
VITE_MAPBOX_TOKEN=your-mapbox-token

# Application Configuration
VITE_APP_URL=http://localhost:5173
VITE_ENV=development
```

## Déploiement sur Lovable Platform

### 1. Préparation du build
```bash
# Installation des dépendances
npm ci

# Build de production
npm run build

# Vérification du build
npm run preview
```

### 2. Configuration Lovable
- Connecter le repository GitHub
- Configurer les variables d'environnement
- Activer le déploiement automatique

### 3. Domaine personnalisé
1. Aller dans Project > Settings > Domains
2. Ajouter votre domaine
3. Configurer les DNS selon les instructions
4. Activer HTTPS automatique

## Configuration Supabase

### 1. Base de données
```sql
-- Activation de l'extension PostGIS pour la géolocalisation
create extension if not exists postgis;

-- Activation de l'extension UUID
create extension if not exists "uuid-ossp";

-- Configuration des schémas
create schema if not exists public;
create schema if not exists auth;
```

### 2. Row-Level Security
```sql
-- Activation RLS sur toutes les tables
alter table profiles enable row level security;
alter table user_contributions enable row level security;
alter table collections enable row level security;
alter table symbols enable row level security;
-- ... autres tables
```

### 3. Stockage des fichiers
```sql
-- Configuration du bucket de stockage
insert into storage.buckets (id, name, public) 
values ('symbols', 'symbols', true);

-- Politiques de stockage
create policy "Public read access"
on storage.objects for select
using (bucket_id = 'symbols');

create policy "Authenticated users can upload"
on storage.objects for insert
with check (bucket_id = 'symbols' and auth.role() = 'authenticated');
```

### 4. Fonctions serverless
Déployer les Edge Functions :
```bash
# Fonction de reconnaissance de motifs IA
supabase functions deploy ai-pattern-recognition

# Fonction de recherche MCP
supabase functions deploy mcp-search

# Fonction d'analyse prédictive
supabase functions deploy predictive-ai-analysis
```

## Configuration DNS

### Enregistrements requis
```
# Domaine principal
symbolica-museum.com    A     123.456.789.10
www.symbolica-museum.com CNAME symbolica-museum.com

# Sous-domaines (si nécessaire)
api.symbolica-museum.com CNAME your-supabase-url
cdn.symbolica-museum.com CNAME your-cdn-url
```

### Configuration SSL/TLS
- Certificats Let's Encrypt automatiques
- HSTS activé
- Redirection HTTP vers HTTPS

## Monitoring et observabilité

### 1. Métriques Supabase
- Connexions base de données
- Requêtes par seconde
- Latence des requêtes
- Utilisation du stockage

### 2. Métriques application
```typescript
// Configuration analytics
const analytics = {
  // Métriques custom
  pageViews: 'track page visits',
  userActions: 'track user interactions',
  errors: 'track application errors',
  performance: 'track loading times'
};
```

### 3. Alertes
Configuration des alertes pour :
- Erreurs 5xx > 1%
- Temps de réponse > 2s
- Utilisation CPU > 80%
- Espace disque < 20%

## Backup et récupération

### 1. Backup automatique
```sql
-- Configuration backup Supabase
-- Backup quotidien automatique
-- Rétention 30 jours
-- Point-in-time recovery 7 jours
```

### 2. Backup des assets
```bash
# Script de backup des images
#!/bin/bash
supabase storage download symbols/ ./backup/symbols/
tar -czf backup-$(date +%Y%m%d).tar.gz ./backup/
```

### 3. Plan de récupération
1. **RTO** (Recovery Time Objective) : 4 heures
2. **RPO** (Recovery Point Objective) : 1 heure
3. **Procédure** : Restauration automatique ou manuelle

## Sécurité en production

### 1. Firewall et protection DDoS
- Protection automatique Lovable
- Rate limiting API
- Blocage IP malveillantes

### 2. Audit de sécurité
```bash
# Audit des dépendances
npm audit --audit-level=moderate

# Scan de sécurité
npm run security-scan

# Test des politiques RLS
npm run test-rls-policies
```

### 3. Logs de sécurité
```sql
-- Table des logs de sécurité
create table security_logs (
    id uuid primary key default gen_random_uuid(),
    event_type text not null,
    user_id uuid references auth.users(id),
    ip_address inet,
    user_agent text,
    details jsonb,
    created_at timestamp with time zone default now()
);
```

## Performance en production

### 1. Optimisations build
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          maps: ['mapbox-gl']
        }
      }
    },
    minify: 'terser',
    cssMinify: true
  }
});
```

### 2. Optimisations images
- Compression automatique
- Formats WebP/AVIF
- Lazy loading
- CDN pour les assets statiques

### 3. Cache configuration
```typescript
// Configuration TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
    }
  }
});
```

## Processus de déploiement

### 1. Environnements
- **Development** : Local + Supabase local
- **Staging** : Lovable staging + Supabase staging
- **Production** : Lovable production + Supabase production

### 2. Pipeline CI/CD
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
      - name: Deploy to Lovable
        run: # Lovable deployment steps
```

### 3. Tests de déploiement
```bash
# Tests automatisés avant déploiement
npm run test:unit
npm run test:integration
npm run test:e2e
npm run test:security
```

## Maintenance

### 1. Mises à jour régulières
```bash
# Mise à jour des dépendances
npm update
npm audit fix

# Mise à jour Supabase
supabase db migrate up
```

### 2. Monitoring continu
- Uptime monitoring (99.9% SLA)
- Performance monitoring
- Error tracking
- User feedback monitoring

### 3. Support utilisateur
- **Email** : support@symbolica-museum.org
- **Documentation** : /docs
- **FAQ** : /faq
- **Status page** : status.symbolica-museum.org

## Checklist de déploiement

### Pré-déploiement
- [ ] Tests passent (unit, integration, e2e)
- [ ] Build réussi sans warnings
- [ ] Variables d'environnement configurées
- [ ] Base de données migrée
- [ ] Assets optimisés

### Déploiement
- [ ] Backup de la base de données
- [ ] Déploiement du code
- [ ] Vérification santé des services
- [ ] Tests de fumée
- [ ] Monitoring activé

### Post-déploiement
- [ ] Vérification des métriques
- [ ] Tests fonctionnels
- [ ] Notification équipe
- [ ] Documentation mise à jour
- [ ] Rollback plan préparé
