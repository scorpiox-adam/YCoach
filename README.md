# YCoach

Socle `v1` mobile-first pour une PWA de coaching personnel qui unifie agenda, entraînement, nutrition, progression et assistance IA.

## Stack

- Next.js App Router
- Tailwind CSS
- Dexie pour le cache local et la file de synchronisation
- Zustand pour l'état UI léger
- TanStack Query pour le server state
- Supabase pour Auth / Postgres / Storage / Edge Functions
- PWA via `next-pwa`

## État du repo

Le repo contient aujourd'hui une base produit solide, mais pas encore une V1 totalement branchée de bout en bout.

- socle Next.js / PWA / Supabase / Dexie en place
- écrans métier présents
- schéma de données et Edge Functions structurés
- plusieurs parcours encore partiellement locaux, seedés ou simulés

## Ce qui est déjà implémenté

- Shell mobile-first avec navigation basse et badges `offline / sync_pending / synced`
- Parcours `Auth`, `Onboarding`, `Agenda`, `Training`, `Nutrition`, `Progress`, `Coach`, `Profile`, `Settings`
- Types métier alignés sur le PRD
- Cache local Dexie avec seed de démonstration
- File de synchronisation locale avec statuts et backoff de base
- Schéma Supabase initial avec RLS et bucket privé `progress-photos`
- Edge Functions IA structurées pour l'analyse repas, le chat, les bilans et les recommandations

## Pré-requis

- Node.js `20.20.x`
- `corepack` activé
- `pnpm` `10.x`
- Supabase CLI pour le mode local

Le repo versionne aussi `.nvmrc` pour aligner la version Node attendue.

## Démarrage rapide

```bash
corepack enable
corepack prepare pnpm@10.0.0 --activate
cp .env.example .env.local
pnpm install
pnpm typecheck
pnpm build
pnpm dev
```

L'application démarre ensuite sur `http://localhost:3000`.

## Variables d'environnement

Variables nécessaires pour le frontend Next.js:

- `NEXT_PUBLIC_APP_ENV`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_ENABLE_LOCAL_DEMO_AUTH`

Variables utiles pour les workflows Supabase / Edge Functions:

- `SUPABASE_PROJECT_ID`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ENCRYPTION_KEY`

Important:

- ne mets jamais `SUPABASE_SERVICE_ROLE_KEY` dans des variables publiques côté navigateur
- pour les Edge Functions déployées, préfère `supabase secrets set ...`
- `NEXT_PUBLIC_ENABLE_LOCAL_DEMO_AUTH=true` active explicitement un mode démo local UI-only
- ce mode démo n'est autorisé qu'en `development`, jamais en `preview` ou `production`

## Comportement de configuration

- si `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont présents: l'app utilise Supabase
- si Supabase n'est pas configuré et que `NEXT_PUBLIC_ENABLE_LOCAL_DEMO_AUTH=false`: l'app affiche une erreur de configuration claire
- si Supabase n'est pas configuré et que `NEXT_PUBLIC_ENABLE_LOCAL_DEMO_AUTH=true`: l'app autorise explicitement un mode démo local en `development` uniquement

Le endpoint `GET /api/health` expose aussi un diagnostic non sensible du mode courant:

- `mode` (`configured`, `demo`, `misconfigured`)
- `appEnv`
- `supabaseConfigured`
- `localDemoAuthEnabled`
- `missingPublicEnvVars`

## Supabase local

```bash
supabase start
supabase db reset
```

Ports configurés dans `supabase/config.toml`:

- API: `54321`
- DB: `54322`
- Studio: `54323`

Auth local autorise actuellement:

- `http://localhost:3000`
- `http://localhost:3000/login`
- `http://localhost:3000/auth/callback`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:3000/login`
- `http://127.0.0.1:3000/auth/callback`

Pour les environnements heberges, pense aussi a autoriser dans le dashboard Supabase Auth les URLs de retour utilisees par l'app:

- `https://ton-domaine.com/auth/callback`
- `https://ton-domaine.vercel.app/auth/callback`

Sans ces URLs autorisees, les emails de confirmation et de recuperation de mot de passe ne pourront pas revenir correctement dans l'application.

## Commandes utiles

```bash
pnpm install
pnpm typecheck
pnpm build
pnpm dev
supabase start
supabase db reset
```

## CI

Une GitHub Action minimale est versionnée dans `.github/workflows/ci.yml`.

Elle s'exécute sur `push`, `pull_request` et `workflow_dispatch`, avec:

- installation via `pnpm install --frozen-lockfile`
- `pnpm typecheck`
- `pnpm build`

## Limites actuelles

- Le frontend est fonctionnel côté structure et interactions locales, mais plusieurs flux restent branchés à des données seed/mock plutôt qu'à Supabase temps réel.
- Le moteur de synchronisation offline n'est pas encore finalisé côté serveur.
- Le seed Supabase charge un sous-ensemble représentatif des données standard; la structure est prête pour monter vers les volumes cibles du PRD.
- Les parcours critiques doivent encore être validés de bout en bout après branchement réel de Supabase et de l'IA.
