# YCoach Sync Contract

Ce document fige la strategie de synchronisation pour les entites actuellement actives dans l'app.

## Last-write-wins

- `user_profiles`
  - La derniere version locale remplace l'etat distant.
- `user_settings`
  - La derniere configuration locale remplace l'etat distant par `user_id`.
- `training_plans`
  - Le ou les plans locaux remplacent l'etat distant de l'utilisateur comme un snapshot complet.
- `planned_workouts`
  - Les seances planifiees et la composition de leurs exercices remplacent le snapshot distant courant.
- `reminders`
  - Les rappels sont synchronises comme une configuration mutable remplacee en entier.

## Append-only

- `workout_sessions`
  - Chaque seance est un evenement idempotent rattache a `clientMutationId`.
- `meal_entries`
  - Chaque repas est historise avec ses items detailes.
- `progress_checkins`
  - Chaque check-in est historise avec son bloc de recuperation.

## Regles communes

- Toute mutation locale cree un `clientMutationId` UUID.
- L'etat `synced` n'est applique qu'apres confirmation Supabase.
- Les ecritures append-only doivent etre idempotentes.
- Les ecritures last-write-wins doivent etre reappliquables sans effet de bord.
- En cas d'echec, l'item reste `queued` ou `failed` avec un message recuperable visible dans l'UI.
- Les bibliotheques locales standard doivent utiliser les memes UUID que les seeds SQL pour garantir des references valides lors de la sync.
