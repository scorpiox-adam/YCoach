# Plan d'execution technique - YCoach

Date de mise a jour: 2026-04-15

Ce document transforme [todo.md](/Users/adam/Desktop/Code/YCoach/todo.md) en backlog d'execution concret.

Objectif:

- decouper le travail en tickets techniques actionnables
- expliciter l'ordre de passage
- rendre visibles les dependances
- definir ce qui doit etre valide avant d'annoncer "ready for customer"

## Regles de pilotage

- on ne traite pas les tickets UI comme termines tant que les lectures/ecritures backend ne sont pas branchees
- tout parcours critique doit etre valide en mode online et offline
- aucun ticket "produit fini" sans criteres d'acceptation et preuve de verification
- on ferme les blockers d'abord, puis les gaps fonctionnels, puis la qualite/release

## Legende

- Priorite: `P0`, `P1`, `P2`
- Taille: `S`, `M`, `L`, `XL`
- Type: `Infra`, `Backend`, `Frontend`, `Data`, `QA`

## Chemin critique

1. Stabiliser l'environnement et la build
2. Brancher la vraie auth Supabase
3. Brancher le moteur de sync Dexie -> Supabase
4. Finaliser l'onboarding et le cadre initial persistant
5. Livrer les parcours critiques complets:
   - se connecter
   - finir l'onboarding
   - logguer une seance offline puis resync
   - ajouter un repas manuel
   - faire un check-in progression
6. Brancher la couche IA produit
7. Ajouter les mecanismes d'engagement
8. Valider la qualite, la perf et la release

## Milestones

### M0 - Repo stable et branchable

Done when:

- `pnpm install`, `pnpm dev`, `pnpm build` et `supabase db reset` passent
- l'app se lance avec un `.env.local` documente
- aucun fallback de demo ne masque un bug de branchement

### M1 - Premier lancement reel

Done when:

- un utilisateur cree un compte
- complete l'onboarding
- arrive sur `Agenda`
- retrouve ses donnees apres refresh

### M2 - Parcours critiques offline-first

Done when:

- une seance complete peut etre loggee offline puis synchronisee
- un repas manuel peut etre ajoute offline puis synchronise
- un check-in progression peut etre ajoute offline puis synchronise
- les statuts de sync sont visibles et veridiques

### M3 - V1 utilisable

Done when:

- entrainement, nutrition, progression et coach sont relies a de vraies donnees utilisateur
- les suggestions IA sont controlees
- les seeds et bibliotheques sont suffisantes pour un premier client

### M4 - Ready for customer

Done when:

- tests, QA mobile, accessibilite, perf et release checklist sont valides
- aucun blocker P0 ou P1 ouvert sur les parcours critiques

## Tickets par phase

## Phase 0 - Stabilisation technique

### YC-001 - Stabiliser l'environnement de dev et de build

- Statut: `Done`
- Priorite: `P0`
- Taille: `M`
- Type: `Infra`
- Dependances: aucune
- But: garantir que le repo s'installe, build et se deploie sans contournement
- Fichiers probables:
  - [package.json](/Users/adam/Desktop/Code/YCoach/package.json)
  - [README.md](/Users/adam/Desktop/Code/YCoach/README.md)
  - [next.config.mjs](/Users/adam/Desktop/Code/YCoach/next.config.mjs)
  - [tsconfig.json](/Users/adam/Desktop/Code/YCoach/tsconfig.json)
- A faire:
  - verifier scripts `dev`, `build`, `start`
  - documenter les versions Node/pnpm cible
  - documenter `.env.local` attendu
  - nettoyer les ecarts lockfile / packageManager / config Vercel
- Criteres d'acceptation:
  - installation reproducible sur machine neuve
  - build local vert
  - build Vercel vert
- Validation:
  - 2026-04-15: utilisateur a confirme qu'aucune erreur n'est remontee apres execution locale des commandes de verification

### YC-002 - Ajouter CI minimale build + typecheck

- Statut: `Backlog`
- Priorite: `P0`
- Taille: `S`
- Type: `Infra`
- Dependances: `YC-001`
- But: empecher les regressions invisibles
- Fichiers probables:
  - `.github/workflows/*`
  - [package.json](/Users/adam/Desktop/Code/YCoach/package.json)
- A faire:
  - ajouter un workflow CI
  - lancer build et verification TypeScript
- Criteres d'acceptation:
  - chaque PR ou push principal echoue si build/typecheck cassent

### YC-003 - Introduire une configuration d'environnement explicite

- Statut: `Backlog`
- Priorite: `P0`
- Taille: `S`
- Type: `Infra`
- Dependances: `YC-001`
- But: supprimer les etats implicites et comportements caches
- Fichiers probables:
  - `.env.example`
  - [README.md](/Users/adam/Desktop/Code/YCoach/README.md)
  - [lib/supabase/client.ts](/Users/adam/Desktop/Code/YCoach/lib/supabase/client.ts)
- A faire:
  - ajouter `.env.example`
  - documenter les variables Next et Supabase
  - clarifier comportement dev vs prod
- Criteres d'acceptation:
  - aucun developpeur n'a besoin de deviner les variables a fournir

## Phase 1 - Auth reelle et bootstrap utilisateur

### YC-004 - Supprimer le fallback auth de demonstration en production

- Statut: `Backlog`
- Priorite: `P0`
- Taille: `M`
- Type: `Frontend`
- Dependances: `YC-003`
- But: rendre le compte reelement obligatoire
- Fichiers probables:
  - [components/cards/auth-card.tsx](/Users/adam/Desktop/Code/YCoach/components/cards/auth-card.tsx)
  - [lib/auth/client-auth.ts](/Users/adam/Desktop/Code/YCoach/lib/auth/client-auth.ts)
  - [components/providers/route-guards.tsx](/Users/adam/Desktop/Code/YCoach/components/providers/route-guards.tsx)
- A faire:
  - retirer ou encapsuler le mode demo derriere un flag dev explicite
  - empecher l'entree dans l'app sans session reelle
- Criteres d'acceptation:
  - en prod, sans Supabase branche, l'app affiche une erreur claire
  - en prod, aucun utilisateur ne passe via une session locale cachee

### YC-005 - Finaliser les flux auth Supabase de bout en bout

- Statut: `Backlog`
- Priorite: `P0`
- Taille: `M`
- Type: `Frontend`
- Dependances: `YC-004`
- But: rendre `signup`, `login`, `forgot password` fiables
- Fichiers probables:
  - [components/cards/auth-card.tsx](/Users/adam/Desktop/Code/YCoach/components/cards/auth-card.tsx)
  - [lib/auth/client-auth.ts](/Users/adam/Desktop/Code/YCoach/lib/auth/client-auth.ts)
  - [lib/supabase/client.ts](/Users/adam/Desktop/Code/YCoach/lib/supabase/client.ts)
- A faire:
  - gerer erreurs de credentials
  - valider persistance de session
  - tester reset password reel
- Criteres d'acceptation:
  - un utilisateur peut creer son compte, se connecter et recuperer son acces

### YC-006 - Rendre le bootstrap local user-aware

- Statut: `Backlog`
- Priorite: `P0`
- Taille: `L`
- Type: `Data`
- Dependances: `YC-005`
- But: sortir du modele `user-demo`
- Fichiers probables:
  - [lib/offline/db.ts](/Users/adam/Desktop/Code/YCoach/lib/offline/db.ts)
  - [components/providers/app-bootstrap.tsx](/Users/adam/Desktop/Code/YCoach/components/providers/app-bootstrap.tsx)
  - [app/(app)/agenda/page.tsx](/Users/adam/Desktop/Code/YCoach/app/(app)/agenda/page.tsx)
  - [app/(app)/profile/page.tsx](/Users/adam/Desktop/Code/YCoach/app/(app)/profile/page.tsx)
- A faire:
  - relier les enregistrements locaux a un vrai `user_id`
  - supprimer les lectures directes de `user-demo`
  - eviter les resets destructifs a l'initialisation
- Criteres d'acceptation:
  - l'app charge les donnees du vrai compte connecte
  - aucun reset silencieux des donnees locales utilisateur

## Phase 2 - Sync reelle et stockage fiable

### YC-007 - Definir le contrat de synchronisation par entite

- Statut: `Backlog`
- Priorite: `P0`
- Taille: `M`
- Type: `Backend`
- Dependances: `YC-006`
- But: fixer une strategie claire avant implementation
- Fichiers probables:
  - [lib/types.ts](/Users/adam/Desktop/Code/YCoach/lib/types.ts)
  - [supabase/migrations/20260415000000_init.sql](/Users/adam/Desktop/Code/YCoach/supabase/migrations/20260415000000_init.sql)
  - documentation a ajouter
- A faire:
  - lister les entites `append-only`
  - lister les entites `last-write-wins`
  - normaliser `clientMutationId`
- Criteres d'acceptation:
  - chaque entite a une regle de sync documentee et testable

### YC-008 - Implementer la vraie sync queue Dexie -> Supabase

- Statut: `Backlog`
- Priorite: `P0`
- Taille: `XL`
- Type: `Backend`
- Dependances: `YC-007`
- But: remplacer la fausse sync locale
- Fichiers probables:
  - [lib/offline/sync-engine.ts](/Users/adam/Desktop/Code/YCoach/lib/offline/sync-engine.ts)
  - [lib/offline/db.ts](/Users/adam/Desktop/Code/YCoach/lib/offline/db.ts)
  - repositories/services a creer
- A faire:
  - envoyer les mutations vers Supabase
  - mettre a jour `queued/syncing/synced/failed`
  - gerer le retry et les erreurs reelles
- Criteres d'acceptation:
  - une mutation offline part bien vers Supabase a la reconnexion
  - l'etat `synced` n'apparait qu'apres confirmation serveur

### YC-009 - Implementer la sync des entites profil/settings/plan

- Statut: `Backlog`
- Priorite: `P0`
- Taille: `L`
- Type: `Backend`
- Dependances: `YC-008`
- But: couvrir les donnees de base utilisateur
- Fichiers probables:
  - services sync a creer
  - [components/cards/onboarding-wizard.tsx](/Users/adam/Desktop/Code/YCoach/components/cards/onboarding-wizard.tsx)
  - [components/cards/settings-card.tsx](/Users/adam/Desktop/Code/YCoach/components/cards/settings-card.tsx)
- Criteres d'acceptation:
  - profil, reglages, training plan et reminders sont persistants apres refresh et reconnexion

### YC-010 - Implementer la sync append-only des logs critiques

- Statut: `Backlog`
- Priorite: `P0`
- Taille: `L`
- Type: `Backend`
- Dependances: `YC-008`
- But: couvrir seances, repas et check-ins
- Fichiers probables:
  - [components/cards/workout-session-logger.tsx](/Users/adam/Desktop/Code/YCoach/components/cards/workout-session-logger.tsx)
  - [components/cards/meal-composer-card.tsx](/Users/adam/Desktop/Code/YCoach/components/cards/meal-composer-card.tsx)
  - [components/cards/progress-checkin-card.tsx](/Users/adam/Desktop/Code/YCoach/components/cards/progress-checkin-card.tsx)
- Criteres d'acceptation:
  - aucune perte silencieuse
  - pas de doublons apres resync

### YC-011 - Afficher les vrais statuts de sync et les erreurs recuperables

- Statut: `Backlog`
- Priorite: `P1`
- Taille: `M`
- Type: `Frontend`
- Dependances: `YC-008`
- But: rendre l'offline visible et comprehensible
- Fichiers probables:
  - [components/providers/app-bootstrap.tsx](/Users/adam/Desktop/Code/YCoach/components/providers/app-bootstrap.tsx)
  - [components/shell/app-header.tsx](/Users/adam/Desktop/Code/YCoach/components/shell/app-header.tsx)
  - composants d'etat a creer/adapter
- Criteres d'acceptation:
  - l'utilisateur voit `offline`, `pending`, `failed`, `synced`
  - une action de reprise est disponible en cas d'echec

## Phase 3 - Onboarding complet et cadre initial

### YC-012 - Persister l'onboarding complet cote backend

- Statut: `Backlog`
- Priorite: `P0`
- Taille: `L`
- Type: `Frontend`
- Dependances: `YC-009`
- But: rendre le cadre initial durable
- Fichiers probables:
  - [components/cards/onboarding-wizard.tsx](/Users/adam/Desktop/Code/YCoach/components/cards/onboarding-wizard.tsx)
  - services onboarding a creer
- A faire:
  - enregistrer le profil
  - enregistrer les objectifs nutritionnels
  - enregistrer le plan actif
  - enregistrer les seances planifiees
  - enregistrer les rappels
- Criteres d'acceptation:
  - l'utilisateur retrouve son cadre initial apres refresh et sur une autre session

### YC-013 - Generer un cadre initial coherent selon le PRD

- Statut: `Backlog`
- Priorite: `P0`
- Taille: `M`
- Type: `Backend`
- Dependances: `YC-012`
- But: produire un onboarding vraiment utile
- Fichiers probables:
  - [lib/formulas.ts](/Users/adam/Desktop/Code/YCoach/lib/formulas.ts)
  - templates/services a creer
- A faire:
  - choisir un template compatible
  - generer semaine type
  - calculer macros
  - preparer rappels initiaux
- Criteres d'acceptation:
  - programme, objectifs nutritionnels et rythme hebdo sont visibles a la sortie de l'onboarding

### YC-014 - Brancher Agenda sur les vraies sorties d'onboarding

- Statut: `Backlog`
- Priorite: `P1`
- Taille: `M`
- Type: `Frontend`
- Dependances: `YC-013`
- But: faire de `Agenda` le vrai centre de l'app
- Fichiers probables:
  - [app/(app)/agenda/page.tsx](/Users/adam/Desktop/Code/YCoach/app/(app)/agenda/page.tsx)
- Criteres d'acceptation:
  - `Agenda` affiche une semaine utile fondee sur des donnees persistantes, pas sur du mock

## Phase 4 - Entrainement complet

### YC-015 - Finaliser la bibliotheque d'exercices et les seeds associees

- Statut: `Backlog`
- Priorite: `P1`
- Taille: `L`
- Type: `Data`
- Dependances: `YC-013`
- But: sortir du sous-ensemble minimal
- Fichiers probables:
  - [supabase/seed.sql](/Users/adam/Desktop/Code/YCoach/supabase/seed.sql)
  - [lib/mock-data.ts](/Users/adam/Desktop/Code/YCoach/lib/mock-data.ts)
- Criteres d'acceptation:
  - base FR exploitable et coherente

### YC-016 - Ajouter le flow de creation d'exercice personnalise

- Statut: `Backlog`
- Priorite: `P1`
- Taille: `M`
- Type: `Frontend`
- Dependances: `YC-015`
- But: satisfaire un cas d'usage critique PRD
- Fichiers probables:
  - [app/(app)/training/page.tsx](/Users/adam/Desktop/Code/YCoach/app/(app)/training/page.tsx)
  - ecrans/forms a creer
- Criteres d'acceptation:
  - un utilisateur cree un exercice avec nom, groupe musculaire, materiel et description
  - l'exercice apparait ensuite dans sa bibliotheque et peut etre utilise

### YC-017 - Ajouter l'edition du programme actif

- Statut: `Backlog`
- Priorite: `P1`
- Taille: `XL`
- Type: `Frontend`
- Dependances: `YC-013`, `YC-016`
- But: permettre la personnalisation libre du plan
- Fichiers probables:
  - [app/(app)/training/page.tsx](/Users/adam/Desktop/Code/YCoach/app/(app)/training/page.tsx)
  - composants d'edition a creer
- Criteres d'acceptation:
  - l'utilisateur peut modifier structure, exercices, series/reps/repos d'un plan actif

### YC-018 - Completer le logger serie par serie

- Statut: `Backlog`
- Priorite: `P1`
- Taille: `M`
- Type: `Frontend`
- Dependances: `YC-010`
- But: rendre la seance vraiment exploitable
- Fichiers probables:
  - [components/cards/workout-session-logger.tsx](/Users/adam/Desktop/Code/YCoach/components/cards/workout-session-logger.tsx)
- A faire:
  - exposer ressenti/effort
  - ameliorer UX de progression intra-seance
  - utiliser des valeurs de depart coherentes
- Criteres d'acceptation:
  - l'utilisateur peut enregistrer reps, charge, repos, ressenti et notes sur 3+ exercices

### YC-019 - Ajouter l'historique de performances et le dernier resultat connu

- Statut: `Backlog`
- Priorite: `P1`
- Taille: `M`
- Type: `Frontend`
- Dependances: `YC-018`
- But: fermer le loop de progression entrainement
- Fichiers probables:
  - [app/(app)/training/page.tsx](/Users/adam/Desktop/Code/YCoach/app/(app)/training/page.tsx)
  - [app/(app)/training/session/[id]/page.tsx](/Users/adam/Desktop/Code/YCoach/app/(app)/training/session/[id]/page.tsx)
- Criteres d'acceptation:
  - chaque exercice de seance expose le dernier resultat connu pertinent
  - l'ecran training permet de consulter les perfs passees

## Phase 5 - Nutrition complete

### YC-020 - Persister les objectifs nutritionnels et les afficher partout

- Statut: `Backlog`
- Priorite: `P1`
- Taille: `M`
- Type: `Frontend`
- Dependances: `YC-012`
- But: aligner la nutrition sur le cadre initial
- Fichiers probables:
  - [app/(app)/nutrition/page.tsx](/Users/adam/Desktop/Code/YCoach/app/(app)/nutrition/page.tsx)
  - repositories/services nutrition a creer
- Criteres d'acceptation:
  - les objectifs calories/macros viennent de `nutrition_targets`

### YC-021 - Refaire le composer de repas en multi-items

- Statut: `Backlog`
- Priorite: `P1`
- Taille: `L`
- Type: `Frontend`
- Dependances: `YC-020`
- But: satisfaire le parcours repas manuel du PRD
- Fichiers probables:
  - [components/cards/meal-composer-card.tsx](/Users/adam/Desktop/Code/YCoach/components/cards/meal-composer-card.tsx)
- Criteres d'acceptation:
  - un repas contient plusieurs aliments
  - les macros se mettent a jour en temps reel avant validation

### YC-022 - Ajouter aliments personnalises et repas favoris

- Statut: `Backlog`
- Priorite: `P1`
- Taille: `L`
- Type: `Frontend`
- Dependances: `YC-021`
- But: rendre la nutrition durable au quotidien
- Fichiers probables:
  - ecrans/forms a creer
  - [supabase/migrations/20260415000000_init.sql](/Users/adam/Desktop/Code/YCoach/supabase/migrations/20260415000000_init.sql)
- Criteres d'acceptation:
  - un utilisateur cree un aliment personnalise
  - un utilisateur sauvegarde et reutilise un repas favori

### YC-023 - Brancher le flow photo repas IA

- Statut: `Backlog`
- Priorite: `P1`
- Taille: `L`
- Type: `Frontend`
- Dependances: `YC-021`, `YC-026`
- But: livrer la photo IA modifiable promise au PRD
- Fichiers probables:
  - [components/cards/meal-composer-card.tsx](/Users/adam/Desktop/Code/YCoach/components/cards/meal-composer-card.tsx)
  - [supabase/functions/analyze-meal-photo/index.ts](/Users/adam/Desktop/Code/YCoach/supabase/functions/analyze-meal-photo/index.ts)
- Criteres d'acceptation:
  - photo analysee en moins de 10s max
  - estimation editable avant validation
  - fallback manuel immediat si IA indisponible

## Phase 6 - Progression complete

### YC-024 - Completer le check-in progression

- Statut: `Backlog`
- Priorite: `P1`
- Taille: `M`
- Type: `Frontend`
- Dependances: `YC-010`
- But: couvrir poids, recup, note et contexte
- Fichiers probables:
  - [components/cards/progress-checkin-card.tsx](/Users/adam/Desktop/Code/YCoach/components/cards/progress-checkin-card.tsx)
- Criteres d'acceptation:
  - l'utilisateur renseigne poids, sommeil, energie, fatigue, courbatures et note libre

### YC-025 - Ajouter les photos de progression privees

- Statut: `Backlog`
- Priorite: `P1`
- Taille: `L`
- Type: `Frontend`
- Dependances: `YC-024`
- But: fermer le scope progression v1
- Fichiers probables:
  - [app/(app)/progress/page.tsx](/Users/adam/Desktop/Code/YCoach/app/(app)/progress/page.tsx)
  - storage services a creer
- Criteres d'acceptation:
  - photo envoyee dans `progress-photos`
  - acces prive via URLs signees

### YC-026 - Ajouter tendances et comparaisons de periodes

- Statut: `Backlog`
- Priorite: `P1`
- Taille: `M`
- Type: `Frontend`
- Dependances: `YC-024`, `YC-025`, `YC-019`
- But: rendre la progression lisible
- Fichiers probables:
  - [app/(app)/progress/page.tsx](/Users/adam/Desktop/Code/YCoach/app/(app)/progress/page.tsx)
- Criteres d'acceptation:
  - l'utilisateur compare au moins deux periodes
  - poids, perfs et recup sont visibles dans la meme lecture

### YC-027 - Brancher la generation et l'historisation du bilan hebdomadaire

- Statut: `Backlog`
- Priorite: `P1`
- Taille: `L`
- Type: `Backend`
- Dependances: `YC-024`, `YC-026`, `YC-029`
- But: livrer le bilan hebdo du PRD
- Fichiers probables:
  - [supabase/functions/generate-weekly-summary/index.ts](/Users/adam/Desktop/Code/YCoach/supabase/functions/generate-weekly-summary/index.ts)
  - [app/(app)/progress/page.tsx](/Users/adam/Desktop/Code/YCoach/app/(app)/progress/page.tsx)
- Criteres d'acceptation:
  - bilan accessible manuellement
  - bilan historise dans l'app
  - suggestions lisibles par un non-expert

## Phase 7 - Coach IA et recommandations controlees

### YC-028 - Enregistrer et chiffrer correctement la cle OpenAI utilisateur

- Statut: `Backlog`
- Priorite: `P1`
- Taille: `M`
- Type: `Backend`
- Dependances: `YC-009`
- But: sortir de la cle masqueee locale
- Fichiers probables:
  - [components/cards/settings-card.tsx](/Users/adam/Desktop/Code/YCoach/components/cards/settings-card.tsx)
  - [supabase/functions/_shared/auth.ts](/Users/adam/Desktop/Code/YCoach/supabase/functions/_shared/auth.ts)
- Criteres d'acceptation:
  - la cle est enregistree chiffree cote backend
  - le frontend n'affiche qu'un masque et un statut

### YC-029 - Brancher le chat Coach IA reel

- Statut: `Backlog`
- Priorite: `P1`
- Taille: `L`
- Type: `Frontend`
- Dependances: `YC-028`
- But: remplacer la reponse simulee
- Fichiers probables:
  - [components/cards/coach-chat-card.tsx](/Users/adam/Desktop/Code/YCoach/components/cards/coach-chat-card.tsx)
  - [supabase/functions/coach-chat/index.ts](/Users/adam/Desktop/Code/YCoach/supabase/functions/coach-chat/index.ts)
- Criteres d'acceptation:
  - le chat appelle la fonction serveur
  - le contexte 7 jours est injecte
  - les messages sont historises

### YC-030 - Brancher les recommandations contextuelles et leur workflow

- Statut: `Backlog`
- Priorite: `P1`
- Taille: `L`
- Type: `Backend`
- Dependances: `YC-028`, `YC-029`
- But: rendre les suggestions reelles, explicables et controlees
- Fichiers probables:
  - [app/(app)/coach/page.tsx](/Users/adam/Desktop/Code/YCoach/app/(app)/coach/page.tsx)
  - [supabase/functions/generate-contextual-recommendation/index.ts](/Users/adam/Desktop/Code/YCoach/supabase/functions/generate-contextual-recommendation/index.ts)
  - [supabase/functions/apply-accepted-recommendation/index.ts](/Users/adam/Desktop/Code/YCoach/supabase/functions/apply-accepted-recommendation/index.ts)
- Criteres d'acceptation:
  - le user voit suggestion + justification + action explicite
  - accepter/refuser produit un etat durable
  - aucune modification n'est appliquee sans validation

## Phase 8 - Engagement et readiness

### YC-031 - Implementer le streak selon les regles produit

- Statut: `Backlog`
- Priorite: `P1`
- Taille: `M`
- Type: `Backend`
- Dependances: `YC-010`, `YC-024`
- But: respecter la logique d'engagement du PRD
- Fichiers probables:
  - [app/(app)/agenda/page.tsx](/Users/adam/Desktop/Code/YCoach/app/(app)/agenda/page.tsx)
  - services metiers a creer
- Criteres d'acceptation:
  - calcul conforme aux regles d'action active et de rattrapage

### YC-032 - Implementer rappels parametables et fallback in-app

- Statut: `Backlog`
- Priorite: `P1`
- Taille: `L`
- Type: `Frontend`
- Dependances: `YC-012`, `YC-031`
- But: livrer le perimetre engagement v1
- Fichiers probables:
  - [app/(app)/settings/page.tsx](/Users/adam/Desktop/Code/YCoach/app/(app)/settings/page.tsx)
  - ecrans/settings a enrichir
- Criteres d'acceptation:
  - l'utilisateur configure ses rappels
  - si le push n'est pas disponible, une bannere in-app prend le relais

### YC-033 - Etendre les seeds aux volumes PRD

- Statut: `Backlog`
- Priorite: `P2`
- Taille: `XL`
- Type: `Data`
- Dependances: `YC-015`, `YC-022`
- But: livrer une base exploitable au premier client
- Fichiers probables:
  - [supabase/seed.sql](/Users/adam/Desktop/Code/YCoach/supabase/seed.sql)
- Criteres d'acceptation:
  - environ 200 exercices FR
  - environ 1 000 aliments FR
  - seeds idempotentes

### YC-034 - Ajouter tests unitaires et e2e des parcours critiques

- Statut: `Backlog`
- Priorite: `P0`
- Taille: `XL`
- Type: `QA`
- Dependances: `YC-005`, `YC-008`, `YC-012`, `YC-018`, `YC-021`, `YC-024`
- But: verrouiller la qualite avant la release
- Fichiers probables:
  - dossier `tests/` a creer
- Criteres d'acceptation:
  - tests unitaires sur formules et utilitaires
  - e2e sur auth, onboarding, agenda, seance offline, repas manuel, check-in

### YC-035 - Valider accessibilite, performance et QA mobile

- Statut: `Backlog`
- Priorite: `P0`
- Taille: `L`
- Type: `QA`
- Dependances: `YC-034`
- But: atteindre un niveau release client
- A faire:
  - audit a11y
  - audit perf
  - QA iPhone et Android
  - verification des etats vides/erreur/offline/pending
- Criteres d'acceptation:
  - aucun blocker critique
  - cibles perf principales respectees ou deviations documentees

### YC-036 - Preparer la release checklist "ready for customer"

- Statut: `Backlog`
- Priorite: `P0`
- Taille: `M`
- Type: `QA`
- Dependances: `YC-035`
- But: formaliser la sortie de v1
- A faire:
  - checklist de build
  - checklist de donnees
  - checklist de securite
  - checklist de support
  - checklist de monitoring post-release
- Criteres d'acceptation:
  - une release candidate peut etre validee avec une checklist signee

## Tickets pouvant etre traites en parallele

- `YC-002` et `YC-003` apres `YC-001`
- `YC-015` en parallele de `YC-012`
- `YC-024` en parallele de `YC-029` une fois la sync stable
- `YC-033` en parallele de `YC-031`

## Tickets a ne pas commencer trop tot

- `YC-023` avant `YC-028`
- `YC-029` avant `YC-028`
- `YC-030` avant `YC-029`
- `YC-034` avant fermeture des principaux blockers de parcours

## Ordre recommande des 10 prochains tickets

1. `YC-001` Stabiliser l'environnement de dev et de build
2. `YC-003` Introduire une configuration d'environnement explicite
3. `YC-004` Supprimer le fallback auth de demonstration en production
4. `YC-005` Finaliser les flux auth Supabase de bout en bout
5. `YC-006` Rendre le bootstrap local user-aware
6. `YC-007` Definir le contrat de synchronisation par entite
7. `YC-008` Implementer la vraie sync queue Dexie -> Supabase
8. `YC-009` Implementer la sync des entites profil/settings/plan
9. `YC-010` Implementer la sync append-only des logs critiques
10. `YC-012` Persister l'onboarding complet cote backend

## Definition "ready for customer"

YCoach est "ready for customer" quand tous les tickets suivants sont fermes:

- `YC-001` a `YC-014`
- `YC-018`, `YC-019`
- `YC-020` a `YC-024`
- `YC-027` a `YC-032`
- `YC-034` a `YC-036`

Et quand les parcours suivants ont ete verifies:

- creation de compte
- onboarding complet
- arrivee sur agenda avec cadre genere
- seance offline puis resync
- repas manuel
- check-in progression
- chat coach IA
- suggestion acceptee/refusee
- bilan hebdomadaire consultable

## Mode d'utilisation recommande

- prendre un ticket a la fois
- ne pas ouvrir un ticket dependant tant que le ticket parent n'est pas valide
- ajouter dans chaque ticket:
  - date de debut
  - date de fin
  - PR liee
  - preuve de validation

Si besoin, ce plan peut ensuite etre decliné en:

- tickets GitHub
- board Linear / Jira / Notion
- sprints hebdomadaires
- plan de delegation par sous-domaines
