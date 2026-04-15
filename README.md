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

## Ce qui est déjà implémenté

- Shell mobile-first avec navigation basse et badges `offline / sync_pending / synced`
- Parcours `Auth`, `Onboarding`, `Agenda`, `Training`, `Nutrition`, `Progress`, `Coach`, `Profile`, `Settings`
- Types métier alignés sur le PRD
- Cache local Dexie avec seed de démonstration
- File de synchronisation locale avec statuts et backoff de base
- Schéma Supabase initial avec RLS et bucket privé `progress-photos`
- Edge Functions IA structurées pour l'analyse repas, le chat, les bilans et les recommandations

## À brancher pour le rendre exécutable

1. Installer Node.js puis les dépendances.
2. Renseigner `.env.local` à partir de `.env.example`.
3. Lancer Supabase local ou connecter un projet distant.
4. Appliquer la migration et le seed.
5. Brancher les formulaires du scaffold aux vrais appels Supabase/Edge Functions.

## Commandes prévues

```bash
pnpm install
pnpm dev
supabase start
supabase db reset
```

## Limites actuelles

- Le repo a été scaffoldé sans runtime Node disponible dans cet environnement, donc les dépendances n'ont pas été installées et aucun build n'a pu être exécuté ici.
- Le frontend est fonctionnel côté structure et interactions locales, mais plusieurs flux restent branchés à des données seed/mock plutôt qu'à Supabase temps réel.
- Le seed Supabase charge un sous-ensemble représentatif des données standard; la structure est prête pour monter vers les volumes cibles du PRD.

