# TODO - YCoach

Date de mise à jour: 2026-04-15

Ce document synthétise l'état réel du projet en croisant:

- le `prd.md`
- le code actuellement présent dans le repo
- l'audit fonctionnel et technique réalisé sur l'application

Objectif:

- dire clairement ce qui est déjà en place
- dire ce qui est seulement partiellement implémenté
- dire ce qui manque encore pour être conforme au PRD
- définir les phases d'implémentation pour atteindre une version réellement utilisable par un client final

Important:

- le repo actuel est un scaffold avancé, pas une V1 complète
- plusieurs flux fonctionnent en local avec Dexie, mais pas encore de bout en bout avec Supabase
- aucun test automatisé n'a été trouvé dans le repo
- le runtime local n'a pas pu être revalidé ici avec `pnpm`, donc ce document s'appuie sur l'inspection du code

## Légende de statut

- `DONE`: présent et globalement en place
- `PARTIAL`: présent mais incomplet, local-only, simulé ou non conforme au PRD
- `TODO`: absent ou non branché
- `BLOCKER`: point bloquant pour une version réellement prête client

## Vue d'ensemble

### Ce qui est déjà solide

- `DONE` Shell Next.js App Router mobile-first
- `DONE` navigation principale `Agenda`, `Entraînement`, `Nutrition`, `Progression`, `Coach IA`
- `DONE` surfaces `Auth`, `Onboarding`, `Profil`, `Réglages`
- `DONE` design system de base et composants UI
- `DONE` cache local Dexie
- `DONE` schéma Supabase initial avec tables métier, RLS et bucket `progress-photos`
- `DONE` Edge Functions structurées pour l'IA
- `DONE` garde de navigation `login -> onboarding -> app`
- `DONE` PWA et manifest de base

### Ce qui n'est pas prêt pour un client final

- `BLOCKER` la synchronisation offline n'envoie pas vraiment les données vers Supabase
- `BLOCKER` les données métier sont encore largement seed/mock/local
- `BLOCKER` plusieurs flux critiques sont simulés ou partiellement implémentés
- `BLOCKER` l'auth peut retomber sur une session locale de démonstration si Supabase n'est pas branché
- `BLOCKER` pas de validation automatisée fiable de build, tests, qualité et non-régression

## Audit complet par domaine PRD

### 1. Socle produit et architecture

- `DONE` stack frontend cohérente avec le PRD: Next.js, Tailwind, Dexie, Zustand, Supabase, PWA
- `DONE` routes principales posées
- `DONE` shell mobile-first avec bottom nav et header
- `PARTIAL` états UI `offline` et `sync_pending` visibles
- `PARTIAL` états `loading` et `error` pas uniformément implémentés selon le PRD
- `PARTIAL` plusieurs pages affichent surtout des données locales seedées
- `TODO` analytics, monitoring et budgets de perf réellement branchés

Reste à faire:

- uniformiser tous les états `empty/loading/error/offline/sync_pending`
- ajouter de vrais skeletons partout au lieu d'états statiques
- brancher analytics produit, erreurs runtime et observabilité
- mesurer les Core Web Vitals réels

### 2. Auth, session et sécurité d'accès

- `DONE` pages `login`, `signup`, `forgot-password`
- `DONE` guards de navigation selon auth et onboarding
- `PARTIAL` support Supabase auth côté client
- `PARTIAL` fallback local de démonstration si Supabase n'est pas configuré
- `PARTIAL` récupération de mot de passe dépend du branchement réel Supabase
- `TODO` expérience auth 100% backend sans fallback démo
- `TODO` validation complète des erreurs auth côté UX

Reste à faire:

- supprimer le fallback auth local pour la prod
- rendre le compte réellement obligatoire dès le premier lancement
- brancher complètement `signup`, `login`, `reset password` et persistance de session Supabase
- tester les cas limites: mot de passe invalide, email déjà pris, session expirée, reconnect

### 3. Onboarding

- `DONE` flow onboarding en 5 étapes conforme dans sa structure
- `DONE` collecte des champs principaux demandés
- `PARTIAL` génération locale d'un plan initial
- `PARTIAL` calcul local des objectifs nutritionnels
- `PARTIAL` redirection vers `Agenda` en fin d'onboarding
- `PARTIAL` écritures locales dans Dexie
- `TODO` persistance complète du cadre initial côté Supabase
- `TODO` création réelle des `nutrition_targets`
- `TODO` création réelle des rappels initiaux
- `TODO` personnalisation durable du ton, de la semaine type et des préférences

Reste à faire:

- enregistrer `UserProfile`, `NutritionTarget`, `TrainingPlan`, `PlannedWorkouts` et `Reminders` côté backend
- lier toutes les données à l'utilisateur authentifié réel
- garantir que l'utilisateur arrive sur `Agenda` avec un cadre complet visible
- ajouter validation métier et robustesse des valeurs saisies

### 4. Agenda

- `DONE` page `Agenda` présente
- `DONE` focus du jour, tâches utiles, navigation vers séance/nutrition/progression
- `PARTIAL` affichage basé sur données locales
- `PARTIAL` résumé nutritionnel simplifié
- `PARTIAL` recommandations affichées mais non réellement pilotées par moteur IA branché
- `TODO` vraie agrégation cross-domain depuis données utilisateur réelles
- `TODO` statut du jour et tâches calculés selon les règles produit
- `TODO` lien fiable vers bilan hebdo réel

Reste à faire:

- hydrater `Agenda` depuis Dexie + Supabase réel
- calculer le streak réel et les tâches du jour réelles
- afficher rappels, recommandations et état nutritionnel à partir de données persistées
- garantir le chargement local en moins de 1 seconde sur données des 7 derniers jours

### 5. Entraînement

- `DONE` page `Entraînement`
- `DONE` vue des séances planifiées
- `DONE` logger de séance local série par série
- `DONE` stockage local des séances terminées
- `PARTIAL` templates visibles
- `PARTIAL` historique de performances seulement esquissé
- `PARTIAL` saisie des séries limitée et générée à partir de defaults
- `PARTIAL` notes de séance présentes
- `TODO` création d'exercice personnalisé
- `TODO` modification du programme actif
- `TODO` création de programme personnalisé
- `TODO` vraie planification hebdomadaire
- `TODO` vue du dernier résultat connu par exercice
- `TODO` historique récent et progression par exercice
- `TODO` synchro réelle des `workout_sessions` et `set_logs`

Reste à faire:

- brancher les boutons d'action actuellement statiques
- ajouter écran et flux pour créer un exercice personnalisé
- ajouter édition d'un programme actif
- ajouter vraie lecture des perfs passées
- enregistrer `WorkoutSession` et `SetLog` côté backend avec `clientMutationId`
- alimenter `Progression` et `Coach IA` à partir des séances réelles

### 6. Nutrition

- `DONE` page `Nutrition`
- `DONE` journal du jour et totaux affichés
- `DONE` recherche locale d'aliments
- `DONE` ajout manuel d'un repas simple en local
- `PARTIAL` calcul des totaux nutritionnels
- `PARTIAL` objectifs calories/macros non réellement branchés à une table `nutrition_targets`
- `PARTIAL` UX de saisie manuelle limitée à un aliment à la fois
- `TODO` repas multi-aliments complet
- `TODO` création d'aliment personnalisé
- `TODO` repas favoris / sauvegardés
- `TODO` historique enrichi
- `TODO` flow photo IA réel avec estimation modifiable
- `TODO` timeout 10s et fallback manuel immédiat
- `TODO` mise en attente locale des photos si offline
- `TODO` synchro backend des `meal_entries` et `meal_entry_items`

Reste à faire:

- permettre plusieurs items par repas
- créer bibliothèque d'aliments personnalisés
- créer système de repas favoris
- brancher l'analyse photo à l'Edge Function correspondante
- afficher les écarts du jour par rapport à des objectifs persistés
- garantir que l'absence de clé IA n'empêche jamais la saisie manuelle

### 7. Progression

- `DONE` page `Progression`
- `DONE` création locale d'un check-in simple
- `DONE` affichage historique local
- `PARTIAL` poids et récupération présents
- `PARTIAL` bilan hebdo affichable si données locales présentes
- `TODO` upload et stockage privé des photos de progression
- `TODO` comparaisons entre périodes
- `TODO` tendances de performance
- `TODO` bilans hebdomadaires générés réellement par IA et archivés
- `TODO` lecture combinée entraînement + nutrition + récupération + poids

Reste à faire:

- ajouter dépôt de photo de progression
- brancher la comparaison de périodes
- montrer l'évolution de perfs clés
- générer et stocker les bilans hebdomadaires réels
- sécuriser l'accès aux photos via URLs signées

### 8. Coach IA

- `DONE` page `Coach IA`
- `DONE` historique visuel des recommandations
- `PARTIAL` chat UI présent
- `PARTIAL` recommandations UI présentes
- `PARTIAL` Edge Functions serveur présentes
- `PARTIAL` backend IA structuré pour `coach-chat`, `weekly-summary`, `contextual-recommendation`, `apply-accepted-recommendation`
- `TODO` brancher le frontend aux Edge Functions
- `TODO` streaming réel du chat
- `TODO` contexte 7 jours injecté réellement
- `TODO` gestion réelle de l'acceptation/refus d'une suggestion
- `TODO` historique durable des suggestions acceptées/refusées
- `TODO` déclencheurs automatiques sur écarts nutrition, séance manquée, plateau et récupération faible

Reste à faire:

- remplacer la réponse simulée du chat par un appel réel
- enregistrer les messages dans `coach_threads` et `coach_messages`
- rendre les boutons `Accepter` et `Refuser` fonctionnels
- brancher les règles de déclenchement des recommandations
- garantir qu'aucune modification structurelle n'est appliquée sans validation utilisateur

### 9. Réglages, profil et confidentialité

- `DONE` pages `Profil` et `Réglages`
- `DONE` affichage de préférences de base dans le profil
- `DONE` champ masqué pour la clé OpenAI
- `PARTIAL` sauvegarde locale de la clé sous forme masquée
- `PARTIAL` informations de confidentialité présentes dans l'UI
- `TODO` chiffrement réel de la clé côté backend lors de l'enregistrement depuis le frontend
- `TODO` réglages complets: unités, affichage, rappels, confidentialité, préférences
- `TODO` édition réelle du profil utilisateur
- `TODO` statuts de clé IA valides: `ready`, `missing_key`, `invalid_key`, `offline`, `degraded`

Reste à faire:

- créer de vrais formulaires d'édition du profil
- enregistrer les réglages dans Supabase
- implémenter le chiffrement côté fonction serveur
- afficher au frontend le vrai statut de disponibilité IA

### 10. Offline et synchronisation

- `DONE` Dexie et file locale présents
- `DONE` badge de synchronisation de base présent
- `DONE` enqueuing local des actions
- `PARTIAL` stratégie de statuts et backoff définie dans le code
- `BLOCKER` aucune vraie synchronisation vers Supabase aujourd'hui
- `BLOCKER` risque de faux positif `synced` côté UI
- `PARTIAL` certaines données critiques sont consultables hors ligne
- `PARTIAL` les 7 derniers jours ne sont pas garantis comme source de vérité locale complète
- `TODO` moteur de replay réel
- `TODO` résolution de conflits selon règles PRD
- `TODO` gestion fine des erreurs `failed`
- `TODO` persistance locale des blobs repas en attente
- `TODO` instrumentation de la taille de queue et purge contrôlée

Reste à faire:

- connecter `flushSyncQueue()` à Supabase
- gérer `append-only` pour séances, repas, check-ins
- gérer `last-write-wins` pour profil, settings, rappels, métadonnées de plan
- afficher les vrais statuts `queued`, `syncing`, `failed`, `synced`
- garantir zéro perte silencieuse

### 11. Seed data et bibliothèques

- `DONE` seed SQL initiale
- `DONE` 5 templates côté seed SQL
- `PARTIAL` sous-ensemble d'exercices
- `PARTIAL` sous-ensemble d'aliments
- `PARTIAL` données mock frontend séparées des seeds backend
- `TODO` monter vers les volumes PRD
- `TODO` unifier les conventions entre mock frontend, seed SQL et tables backend

Reste à faire:

- fournir environ 200 exercices FR
- fournir environ 1 000 aliments FR
- vérifier la qualité, cohérence et idempotence des seeds
- éviter les divergences entre seeds SQL et données locales de démonstration

### 12. Qualité, tests et livraison

- `PARTIAL` structure de build Next.js présente
- `PARTIAL` plusieurs erreurs Vercel ont déjà été corrigées au fil des itérations
- `TODO` batterie de tests automatisés
- `TODO` tests d'intégration des parcours critiques
- `TODO` tests offline/reconnect
- `TODO` tests mobile réels iPhone/Android
- `TODO` audit accessibilité complet
- `TODO` audit performance complet
- `TODO` checklist release

Reste à faire:

- ajouter tests unitaires des formules et utilitaires
- ajouter tests e2e auth/onboarding/agenda/training/nutrition/progress/coach
- ajouter tests de sync différée
- exécuter build, typecheck, tests et QA avant toute release client

## Relecture par exigences obligatoires du PRD

| Exigence PRD | Statut | Commentaire |
|---|---|---|
| Création de compte et connexion | `PARTIAL` | UI présente, Supabase côté client présent, fallback local encore actif |
| Onboarding initial < 3 min | `PARTIAL` | structure en place, mais cadre généré incomplet et surtout local |
| Cadre de départ cohérent visible dans Agenda | `PARTIAL` | programme visible, macros et semaine type pas encore correctement persistés |
| Visualisation de la semaine offline-first | `PARTIAL` | structure présente, mais données locales de démo et agrégation simplifiée |
| Séance complète série par série hors ligne + resync | `PARTIAL` | log local présent, resync réelle absente |
| Exercice personnalisé | `TODO` | bouton présent mais pas de flow complet |
| Repas manuel multi-aliments | `TODO` | un seul aliment par saisie actuelle |
| Photo repas + correction IA | `TODO` | Edge Function existe, frontend non branché |
| Aliment personnalisé | `TODO` | non implémenté |
| Check-in progression avec poids, photos et récupération | `PARTIAL` | poids/récup présents, photos absentes |
| Bilan hebdomadaire lisible avec suggestion IA | `PARTIAL` | structure présente, génération réelle non branchée côté produit |
| Suggestion IA contrôlée | `PARTIAL` | UI visible, actions non branchées |
| Parcours critiques hors ligne sans perte | `BLOCKER` | la vraie sync et la garantie de non-perte ne sont pas livrées |

## Ce qui est fait vs pas fait

### Fait

- shell applicatif et navigation principale
- composants UI de base
- route guards
- pages pour tous les domaines du PRD
- modèle de données TypeScript globalement aligné
- schéma Supabase initial
- RLS et bucket privé de progression
- Edge Functions IA de base
- Dexie et file locale
- onboarding 5 étapes
- logger de séance local
- ajout de repas manuel local simple
- check-in progression local simple
- champ de clé OpenAI dans les réglages

### Fait mais incomplet

- authentification
- génération du cadre initial
- agenda quotidien
- templates d'entraînement
- progression et bilans
- recommandations IA
- stockage offline
- affichage des statuts de sync
- seed data
- UX mobile-ready globale

### Pas fait ou pas terminé

- suppression du mode démo local pour la prod
- persistance métier complète Supabase
- moteur de sync réel
- exercice personnalisé
- programme personnalisé et édition du plan actif
- vue du dernier résultat connu
- repas multi-aliments
- aliments personnalisés
- repas favoris
- photo repas IA avec correction
- photos de progression
- comparaison de périodes
- historique coach durable
- acceptation/refus réels des recommandations
- rappels paramétrables et fallback in-app complet
- streak réel selon règles PRD
- bilans hebdomadaires réellement générés et historisés
- analytics, monitoring, tests, QA mobile

## Phases d'implémentation jusqu'à "ready for customer"

### Phase 0 - Stabilisation technique

Objectif:

- avoir un repo installable, buildable, déployable et branchable proprement

À livrer:

- build local et Vercel verts
- variables d'environnement documentées
- branchement Supabase local et distant validé
- cleanup du mode démo partout où il pollue la logique produit
- scripts d'installation et README à jour

Definition of done:

- `pnpm install`
- `pnpm build`
- `pnpm dev`
- `supabase db reset`
- aucune erreur TypeScript ou Vercel bloquante

### Phase 1 - Auth réelle et bootstrap utilisateur

Objectif:

- garantir le vrai parcours `login -> onboarding -> agenda`

À livrer:

- auth Supabase complète
- récupération mot de passe réelle
- session persistée
- suppression du fallback local pour la prod
- bootstrap d'un vrai utilisateur côté local et backend

Definition of done:

- un nouvel utilisateur crée son compte, se reconnecte, récupère son mot de passe et n'entre jamais dans un mode démo caché

### Phase 2 - Données métier et sync réelle

Objectif:

- rendre le produit fiable et réellement offline-first

À livrer:

- mapping Dexie <-> Supabase
- file de sync réelle
- politiques de conflit
- `clientMutationId` partout
- statuts `queued/syncing/synced/failed`
- reprise à la reconnexion

Definition of done:

- séance, repas manuel et check-in saisis offline réapparaissent correctement après reconnexion sans doublon ni perte

### Phase 3 - Onboarding complet et cadre initial cohérent

Objectif:

- livrer une première expérience utile dès la sortie de l'onboarding

À livrer:

- génération réelle du programme initial
- création des objectifs nutritionnels
- création de la semaine type
- création des rappels de départ
- affichage complet dans `Agenda`, `Entraînement` et `Nutrition`

Definition of done:

- l'utilisateur termine l'onboarding en moins de 3 minutes et voit immédiatement un cadre crédible et persistant

### Phase 4 - Entraînement complet

Objectif:

- faire de YCoach un vrai outil d'entraînement utilisable tous les jours

À livrer:

- bibliothèque d'exercices réelle
- création d'exercice personnalisé
- programme actif éditable
- planification hebdomadaire
- logger série par série complet
- historique de performances
- dernier résultat connu visible

Definition of done:

- un utilisateur peut créer, suivre et retrouver son entraînement sans dépendre d'une donnée mock

### Phase 5 - Nutrition complète

Objectif:

- rendre le suivi alimentaire réellement utile et suffisamment fluide

À livrer:

- objectifs macros persistés
- repas multi-aliments
- aliments personnalisés
- repas favoris
- historique simple
- photo IA éditable
- fallback manuel instantané

Definition of done:

- un utilisateur peut gérer une journée nutrition complète, avec ou sans IA, sans friction bloquante

### Phase 6 - Progression complète

Objectif:

- montrer clairement si le plan fonctionne

À livrer:

- check-ins complets
- photos de progression privées
- comparaisons de périodes
- tendances poids + perfs + récupération
- bilans hebdomadaires historisés

Definition of done:

- l'utilisateur peut comprendre son évolution sans expertise technique ni tableur externe

### Phase 7 - Coach IA et recommandations contrôlées

Objectif:

- brancher l'assistance IA sans perdre le contrôle utilisateur

À livrer:

- chat réel
- contexte 7 jours
- recommandations contextuelles réelles
- acceptation/refus persistés
- application explicite des suggestions validées seulement

Definition of done:

- chaque recommandation est justifiée, traçable, contrôlée et jamais imposée

### Phase 8 - Engagement, qualité et release client

Objectif:

- transformer le produit en V1 utilisable par un client final

À livrer:

- streak réel
- rappels paramétrables et fallback in-app
- analytics et monitoring
- tests automatisés
- audits a11y et perf
- QA mobile réelle
- checklist de release

Definition of done:

- la V1 respecte les exigences obligatoires du PRD, les parcours critiques sont stables et la release peut être assumée côté client final

## Ordre de priorité recommandé

1. `BLOCKER` Auth réelle sans mode démo
2. `BLOCKER` Sync réelle Dexie -> Supabase
3. `BLOCKER` Onboarding complet avec cadre initial persistant
4. `P1` Entraînement complet
5. `P1` Nutrition complète
6. `P1` Progression complète
7. `P1` Coach IA réellement branché
8. `P1` Engagement, rappels, streak
9. `P2` Seeds enrichies
10. `P2` Tests, perf, a11y, monitoring, QA

## Définition "ready to use by end customer"

YCoach peut être considéré prêt pour un client final quand:

- un utilisateur peut créer un compte réel et se reconnecter sans friction
- l'onboarding génère un cadre initial complet et persistant
- `Agenda` reflète réellement la journée et la semaine de l'utilisateur
- une séance complète peut être faite hors ligne et synchronisée sans perte
- un repas manuel et un repas photo IA peuvent être enregistrés proprement
- les check-ins poids/récupération/photos sont privés et lisibles dans le temps
- le `Coach IA` répond avec contexte réel et n'applique rien sans validation
- les rappels, streaks et bilans hebdos sont fiables et compréhensibles
- le produit passe build, tests, QA mobile et audit de base avant release

## Backlog prioritaire immédiat

### Sprint 1

- brancher Supabase auth de bout en bout
- supprimer le fallback local de démonstration en mode prod
- lier toutes les données locales à l'utilisateur réel
- corriger le bootstrap qui peut reset des données utilisateur

### Sprint 2

- implémenter la vraie sync queue
- synchroniser `user_profiles`, `training_plans`, `planned_workouts`, `workout_sessions`, `meal_entries`, `progress_checkins`
- afficher les vrais statuts de sync

### Sprint 3

- finaliser onboarding complet
- rendre `Agenda` utile avec vraies données
- livrer exercice personnalisé + historique de perfs

### Sprint 4

- livrer nutrition complète: multi-items, custom foods, favoris, photo IA
- livrer progression complète: photos, comparaisons, bilans

### Sprint 5

- brancher Coach IA réel
- brancher recommandations contrôlées
- livrer streaks, rappels, QA et release checklist

## Conclusion

Le projet est bien avancé en structure et en intentions produit, mais il n'est pas encore "full PRD implemented".

Le bon diagnostic est:

- très bonne base technique et UX
- plusieurs domaines visibles et déjà amorcés
- encore trop de logique locale, seedée ou simulée pour parler d'une V1 prête client

La priorité absolue n'est pas d'ajouter plus d'écrans.

La priorité est de:

- brancher le vrai backend
- rendre les parcours critiques fiables
- supprimer les comportements de démonstration
- fermer les écarts PRD sur entraînement, nutrition, progression et IA
