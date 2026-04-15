# PRD - YCoach

## 1. Informations générales

- Produit: `YCoach`
- Format: application mobile `PWA` installable
- Langue de lancement: français
- Plateforme prioritaire: smartphone
- Type de produit: coach personnel solo pour entraînement, nutrition et progression
- Statut du document: version de cadrage produit avant implémentation

## 2. Résumé exécutif

YCoach est une application mobile au format PWA qui aide un utilisateur à structurer son entraînement, suivre son alimentation et comprendre sa progression dans un seul produit. L'ambition n'est pas seulement de stocker des données, mais d'accompagner l'utilisateur dans la durée avec une expérience simple, cohérente et motivante.

Le produit vise en priorité les pratiquants intermédiaires motivés qui ont déjà commencé à s'entraîner, mais manquent d'un système central pour planifier leurs séances, tenir leurs objectifs nutritionnels et relier leurs efforts à des résultats visibles. YCoach doit devenir leur point d'entrée quotidien.

La v1 doit être suffisamment solide pour être utilisée tous les jours sur mobile, avec un compte obligatoire, un mode hors ligne important pour les actions critiques, et une couche IA qui conseille et explique sans jamais imposer de changement sans validation explicite de l'utilisateur.

## 3. Problème à résoudre

Aujourd'hui, beaucoup d'utilisateurs répartissent leur suivi sur plusieurs outils:

- une app ou des notes pour les séances
- une autre app pour les calories ou les macros
- des photos, un tableur ou leur mémoire pour la progression
- aucun système fiable pour relier charge d'entraînement, alimentation et résultats

Cette fragmentation crée plusieurs problèmes:

- manque de clarté sur ce qu'il faut faire aujourd'hui
- difficulté à rester régulier sur plusieurs semaines
- surcharge cognitive pour créer un plan et le faire évoluer
- faible compréhension des liens entre entraînement, nutrition, récupération et progression
- perte de motivation quand les données sont dispersées ou peu actionnables

## 4. Vision produit

YCoach doit devenir un coach personnel mobile-first qui centralise la semaine de l'utilisateur, ses séances, ses repas, sa progression et ses recommandations dans une expérience unique.

La promesse produit est la suivante:

> aider l'utilisateur à tenir un objectif concret dans le temps grâce à un cadre clair, un suivi simple et des recommandations utiles.

YCoach ne doit pas ressembler à un simple tableau de bord passif. Le produit doit guider l'action quotidienne:

- quoi faire aujourd'hui
- quoi manger ou quoi corriger
- comment mesurer ses progrès
- quand ajuster le plan

## 5. Objectifs produit

### 5.1 Objectifs principaux

- Permettre à l'utilisateur de planifier et suivre son entraînement dans la semaine.
- Permettre à l'utilisateur de suivre ses calories et macros sans friction excessive.
- Donner une vision claire de la progression physique et sportive.
- Fournir des recommandations intelligentes qui renforcent la régularité.
- Créer une expérience suffisamment fiable pour un usage quotidien sur mobile.

### 5.2 Objectifs business et produit secondaires

- Créer une base produit extensible vers des fonctionnalités plus avancées en `V1.5` et `V2`.
- Poser des fondations compatibles avec une future monétisation, sans en faire une contrainte de la v1.
- Construire une expérience différenciante grâce à la combinaison entraînement + nutrition + suivi + IA.

### 5.3 Non-objectifs de la v1

- Construire un réseau social fitness.
- Créer un produit coach-client.
- Intégrer des wearables ou applications tierces.
- Fournir des plans repas complets multi-jours très avancés.
- Fournir des vidéos riches pour toute la bibliothèque d'exercices.
- Permettre un auto-ajustement silencieux du plan par l'IA.

## 6. Public cible

### 6.1 Persona principal

Le persona principal est un pratiquant intermédiaire motivé:

- il s'entraîne déjà ou a déjà essayé de s'organiser
- il veut progresser sans construire tout son système à la main
- il a besoin d'une structure, pas d'un outil expert complexe
- il utilise principalement son téléphone
- il agit seul, sans coach humain ni logique sociale forte

### 6.2 Objectifs utilisateurs supportés

L'utilisateur doit pouvoir choisir un objectif principal au sein des catégories suivantes:

- perte de poids
- prise de muscle
- recomposition corporelle
- performance sportive

### 6.3 Jobs-to-be-done

- "Je veux ouvrir l'app et savoir immédiatement quoi faire aujourd'hui."
- "Je veux suivre mes séances série par série sans me perdre."
- "Je veux garder le contrôle de mon alimentation sans trop de friction."
- "Je veux voir si ce que je fais fonctionne vraiment."
- "Je veux des conseils utiles, mais je ne veux pas que l'app décide à ma place."

## 7. Principes produit

- `Action first`: chaque écran doit aider l'utilisateur à agir, pas seulement à observer.
- `Mobile native feel`: même en PWA, l'expérience doit paraître fluide, rapide et pensée pour le téléphone.
- `Local-first pour le critique`: les actions clés doivent rester robustes même avec un réseau instable.
- `IA sous contrôle`: l'IA peut suggérer, estimer, expliquer, jamais imposer.
- `Friction utile`: on demande les informations nécessaires, mais on évite toute complexité gratuite.
- `Régularité avant perfection`: le produit récompense la continuité plus que la précision absolue.

## 8. Positionnement

YCoach se positionne comme un coach perso numérique du quotidien, à mi-chemin entre:

- un tracker flexible
- un planificateur d'entraînement
- un journal nutritionnel
- un assistant coaching intelligent

Le produit doit être plus guidant qu'une simple app de tracking, mais moins rigide qu'un système expert réservé aux utilisateurs très avancés.

## 9. Proposition de valeur

### 9.1 Valeur cœur

- une seule app pour suivre entraînement, alimentation et progression
- une vision hebdomadaire claire
- un suivi simple des séances et des repas
- des recommandations contextuelles utiles
- une expérience conçue pour durer

### 9.2 Pourquoi un utilisateur resterait

- il gagne du temps
- il comprend mieux ses habitudes
- il voit ses progrès
- il sait quoi faire ensuite
- il garde le contrôle malgré l'aide de l'IA

## 10. Portée du produit

### 10.1 Ce que YCoach est

- une PWA mobile-first installable
- un produit centré sur l'usage individuel
- un compagnon quotidien d'organisation et de suivi
- un système qui relie action, mesure et recommandation

### 10.2 Ce que YCoach n'est pas

- un réseau social
- une place de marché de coachs
- un outil clinique ou médical
- un simple compteur de calories
- un simple journal de musculation

## 11. Architecture produit globale

La navigation principale repose sur 5 sections:

1. `Agenda`
2. `Entraînement`
3. `Nutrition`
4. `Progression`
5. `Coach IA`

Les surfaces hors navigation principale sont:

- `Auth`
- `Onboarding`
- `Profil`
- `Réglages`

## 12. Structure détaillée de l'app

### 12.1 Agenda

#### Rôle

Point d'entrée principal de l'application. L'utilisateur doit comprendre sa semaine et son jour en cours en moins de quelques secondes.

#### Écran principal

Vue semaine avec focus sur aujourd'hui.

#### Informations affichées

- séances planifiées
- statut des tâches du jour
- progression du streak
- résumé nutritionnel du jour
- rappels à venir
- éventuelles recommandations importantes

#### Actions clés

- ouvrir la séance du jour
- enregistrer un repas ou une collation
- marquer une tâche comme faite
- consulter un rappel ou un conseil
- accéder au bilan hebdo

#### Lien avec les autres sections

- ouvre la séance dans `Entraînement`
- ouvre le journal du jour dans `Nutrition`
- ouvre le bilan dans `Progression`
- affiche des conseils venant du `Coach IA`

### 12.2 Entraînement

#### Rôle

Permettre de créer, planifier, suivre et ajuster l'entraînement.

#### Écran principal

Vue programme actif et prochaines séances.

#### Informations affichées

- programme actuel
- prochaines séances
- historique récent
- progression par exercice
- suggestions d'ajustement en attente

#### Actions clés

- choisir un template
- créer ou modifier un programme
- démarrer une séance
- enregistrer séries, reps, charge, repos, ressenti
- créer un exercice personnalisé
- consulter les performances passées

#### Lien avec les autres sections

- l'agenda alimente les séances du jour
- les résultats de séance alimentent `Progression`
- le `Coach IA` peut suggérer un ajustement

### 12.3 Nutrition

#### Rôle

Aider l'utilisateur à suivre ses apports sans rendre la saisie trop lourde.

#### Écran principal

Journal alimentaire du jour avec résumé calories/macros.

#### Informations affichées

- total du jour
- objectifs calories/macros
- répartition par repas
- suggestions ou écarts simples
- historique récent

#### Actions clés

- ajouter un repas manuellement
- capturer un repas en photo pour estimation IA
- corriger la proposition IA
- enregistrer un aliment ou repas favori
- créer un aliment personnalisé

#### Lien avec les autres sections

- `Agenda` montre le résumé du jour
- `Progression` exploite les tendances nutritionnelles
- `Coach IA` contextualise les écarts et corrections

### 12.4 Progression

#### Rôle

Montrer si les efforts produisent des résultats, sous forme compréhensible et motivante.

#### Écran principal

Tableau de progression combinant poids, performances, check-ins et photos.

#### Informations affichées

- évolution du poids
- performances clés
- photos de progression
- check-ins récupération
- bilans hebdomadaires

#### Actions clés

- enregistrer un check-in
- ajouter poids et ressenti
- déposer une photo de progression
- comparer deux périodes
- consulter les tendances hebdomadaires

#### Lien avec les autres sections

- récupère les données de `Entraînement` et `Nutrition`
- expose au `Coach IA` des signaux pour recommandations

### 12.5 Coach IA

#### Rôle

Offrir une assistance intelligente sans devenir la seule interface du produit.

#### Écran principal

Espace de chat dédié avec historique, complété par recommandations contextuelles dans le reste de l'app.

#### Informations affichées

- recommandations proposées
- explications associées
- historique des conseils acceptés ou refusés
- messages de coaching

#### Actions clés

- poser une question
- demander une explication
- valider ou refuser une suggestion
- consulter le contexte d'une recommandation

#### Lien avec les autres sections

- injecte des suggestions dans `Agenda`, `Entraînement`, `Nutrition`, `Progression`
- récupère les données d'usage pour contextualiser ses réponses

### 12.6 Auth, Onboarding, Profil, Réglages

#### Auth

- création de compte (email/password)
- connexion
- récupération de compte (lien email)

#### Onboarding

Flux limité à 5 étapes maximum pour éviter l'abandon:

1. Objectif principal + niveau perçu
2. Fréquence souhaitée + matériel disponible
3. Poids + taille + âge
4. Habitudes alimentaires + préférences de base
5. Contraintes physiques éventuelles (optionnel, skippable)

Toutes les données optionnelles peuvent être complétées plus tard dans Profil.

#### Profil

- résumé utilisateur
- préférences globales
- informations personnelles utiles au coaching

#### Réglages

- notifications
- confidentialité
- unités
- préférences d'affichage
- gestion compte
- **clé API OpenAI** (champ texte masqué, requis pour activer les fonctionnalités IA)

### 12.7 États UI requis par écran

Pour chaque écran principal, les états suivants doivent être conçus et implémentés:

| État | Description |
|------|-------------|
| `empty` | Premier lancement ou absence de données — message d'invitation à l'action, jamais d'écran blanc |
| `loading` | Skeleton screens uniquement (pas de spinners centraux) — les données locales s'affichent immédiatement |
| `error` | Erreur réseau ou erreur IA — message explicite + action de récupération disponible |
| `offline` | Badge visible dans le header, actions disponibles hors ligne marquées, actions bloquées grisées |
| `sync_pending` | Indicateur de synchronisation en attente visible — l'utilisateur sait que ses données seront envoyées |

## 13. Flux utilisateurs principaux

### 13.1 Premier lancement

1. L'utilisateur crée un compte.
2. L'utilisateur complète l'onboarding.
3. YCoach génère un cadre initial:
   - objectif
   - programme de départ
   - objectifs nutritionnels
   - rythme hebdomadaire
4. L'utilisateur arrive sur `Agenda`.

### 13.2 Démarrer et finir une séance

1. L'utilisateur ouvre la séance du jour depuis `Agenda` ou `Entraînement`.
2. Il suit chaque exercice.
3. Il enregistre série par série:
   - reps
   - charge
   - repos
   - ressenti
4. Il termine la séance.
5. La séance alimente la progression et peut générer une recommandation.

### 13.3 Enregistrer un repas

1. L'utilisateur ouvre `Nutrition`.
2. Il choisit une saisie manuelle ou photo.
3. Si photo:
   - l'IA estime le repas
   - l'utilisateur corrige si besoin
   - il valide l'enregistrement
4. Le journal et les macros sont mis à jour.

### 13.4 Faire un bilan hebdomadaire

1. L'utilisateur ouvre `Progression` ou suit une invitation depuis `Agenda`.
2. Il voit:
   - entraînements réalisés
   - nutrition globale
   - poids
   - performances
   - récupération perçue
3. Le `Coach IA` peut formuler une suggestion.
4. L'utilisateur accepte ou refuse la suite proposée.

## 14. Fonctionnalités détaillées par domaine

### 14.1 Onboarding

#### But

Collecter les informations nécessaires pour créer un cadre initial utile sans transformer l'entrée dans l'app en tunnel trop long.

#### Données demandées

- objectif principal
- niveau perçu
- fréquence d'entraînement souhaitée
- matériel disponible
- éventuelles contraintes physiques
- poids
- taille
- habitudes alimentaires
- préférences alimentaires de base
- disponibilités hebdomadaires

#### Résultats attendus

- génération d'un programme initial
- génération d'objectifs nutritionnels
- configuration d'une semaine type
- personnalisation du ton et des conseils

### 14.2 Entraînement

#### Périmètre

- templates de démarrage
- création de programme personnalisé
- modification du programme actif
- planification hebdomadaire
- log complet des séances
- historique des performances
- exercices personnalisés

#### Détails fonctionnels

- Les templates doivent servir de point de départ, pas de carcan.
- L'utilisateur peut ajuster sa structure de semaine.
- Une séance doit pouvoir être suivie hors ligne.
- Chaque exercice doit pouvoir être loggé série par série.
- L'utilisateur peut créer un exercice personnalisé si la base ne suffit pas.
- Le contenu d'exercice est textuel en v1:
  - nom
  - groupe musculaire
  - matériel
  - consignes courtes
  - variantes simples

#### Suivi de séance

Chaque séance doit permettre:

- démarrage rapide
- suivi de progression intra-séance
- validation d'exercice
- saisie de notes
- vue du dernier résultat connu

### 14.3 Nutrition

#### Périmètre

- objectifs calories/macros
- journal quotidien
- saisie manuelle
- photo IA
- aliments personnalisés
- repas/favoris
- historique simple

#### Détails fonctionnels

- L'utilisateur doit voir son état nutritionnel de la journée sans effort.
- La saisie manuelle doit rester possible partout.
- La photo IA doit proposer une estimation modifiable, jamais enregistrée automatiquement.
- Les préférences alimentaires de base doivent pouvoir influencer les suggestions.
- L'utilisateur peut créer ses propres aliments et repas.

#### Formules nutritionnelles

Calcul du TDEE (Total Daily Energy Expenditure):

```
TDEE = BMR × facteur d'activité

BMR (Mifflin-St Jeor):
  Homme: (10 × poids_kg) + (6.25 × taille_cm) − (5 × âge) + 5
  Femme: (10 × poids_kg) + (6.25 × taille_cm) − (5 × âge) − 161

Facteurs d'activité (selon fréquence déclarée à l'onboarding):
  Sédentaire (0-1 j/sem):         × 1.2
  Légèrement actif (1-3 j/sem):   × 1.375
  Modérément actif (3-5 j/sem):   × 1.55
  Très actif (6-7 j/sem):         × 1.725
```

Répartition macros par objectif:

| Objectif | Calories | Protéines | Lipides | Glucides |
|----------|----------|-----------|---------|----------|
| Perte de poids | TDEE − 350 kcal | 2 g/kg | 25% | reste |
| Prise de muscle | TDEE + 250 kcal | 2 g/kg | 25% | reste |
| Recomposition | TDEE | 2.3 g/kg | 30% | reste |
| Performance | TDEE + 150 kcal | 1.8 g/kg | 20% | 50-55% |

Les objectifs nutritionnels sont recalculés automatiquement si le poids change de ±2 kg (avec validation utilisateur).

Photos repas: la photo envoyée à l'IA est transmise pour analyse uniquement et n'est pas persistée côté serveur. L'estimation retournée est toujours modifiable avant enregistrement.

#### Ce que la v1 ne fait pas

- barcode scan
- planification avancée de menus sur plusieurs jours
- recommandations cliniques ou médicales

### 14.4 Progression

#### Périmètre

- poids
- photos corporelles
- performances
- check-ins
- bilans hebdomadaires

#### Détails fonctionnels

- Le suivi doit relier données physiques et performance sportive.
- L'utilisateur peut enregistrer un check-in simple de récupération:
  - sommeil perçu
  - énergie
  - fatigue
  - courbatures
- Les photos servent à la comparaison privée dans le temps.
- Les bilans hebdomadaires doivent être compréhensibles même pour un utilisateur non expert.

### 14.5 Coach IA

#### Périmètre

- chat dédié
- recommandations contextuelles
- explications
- suggestions d'ajustement soumises à validation

#### Cas d'usage visés

- expliquer un écart nutritionnel
- suggérer une correction simple
- proposer un ajustement de charge ou de volume
- résumer une semaine
- répondre à une question contextuelle sur le plan actuel

#### Règles impératives

- aucune action structurelle sans validation utilisateur
- aucune posture médicale
- aucune promesse de résultat
- explication claire de la recommandation
- historique des suggestions acceptées et refusées

### 14.6 Engagement

#### Périmètre

- rappels utiles
- streaks
- relances douces
- bilan hebdomadaire

#### Logique streak

Une journée compte comme "active" si l'utilisateur réalise au moins **une** des actions suivantes:

- séance complétée (≥ 50% des exercices loggés)
- journal nutritionnel rempli (≥ 2 repas enregistrés)
- check-in récupération effectué

Le streak se casse si aucune action active n'est détectée la veille (évaluation à minuit).

Tolérance: 1 rattrapage possible par semaine — l'utilisateur peut logger une action pour J-1 jusqu'au lendemain 10h sans casser son streak.

Affichage: compteur de jours consécutifs en cours + record personnel.

#### Bilan hebdomadaire

- **Déclenchement**: automatique chaque dimanche soir à 20h (push notification) + accessible à tout moment depuis `Progression`
- **Contenu généré par GPT-4o**:
  - résumé des séances (réalisé vs planifié)
  - évolution du poids sur la semaine
  - moyennes nutritionnelles (calories, protéines)
  - note de récupération moyenne
  - 1 à 3 suggestions concrètes pour la semaine suivante
- Toute modification du plan suggérée par le bilan nécessite la validation explicite de l'utilisateur
- Les anciens bilans sont consultables dans l'historique de `Progression`

#### Intentions produit

- encourager la régularité
- éviter le spam ou la culpabilisation
- rendre le retour dans l'app naturel

### 14.7 Offline et synchronisation

#### Périmètre

- consultation des données critiques hors ligne
- log séance hors ligne
- log nutrition manuel hors ligne
- stockage local temporaire des actions
- synchronisation différée

#### Règles produit

- Les actions saisies hors ligne ne doivent pas être perdues.
- L'utilisateur doit comprendre si une action est en attente de synchronisation.
- La reprise réseau doit synchroniser sans confusion.
- Une capture photo destinée à l'IA peut être mise en attente si le réseau est absent.

## 15. Règles produit transverses

- Compte obligatoire dès le départ.
- Produit solo uniquement en v1.
- Aucune intégration externe en v1.
- PWA mobile-first installable.
- Support smartphone prioritaire.
- Contenu d'exercices en texte seulement en v1.
- Les photos de repas et de progression sont privées par défaut.
- L'utilisateur garde toujours la main sur les décisions qui modifient son plan.
- Les recommandations IA sont des suggestions produit, pas des prescriptions médicales.

## 16. Exigences fonctionnelles

### 16.1 Exigences obligatoires

| Exigence | Done when |
|----------|-----------|
| Création de compte et connexion | L'utilisateur peut créer un compte email/password, se connecter, et recevoir un lien de récupération |
| Onboarding initial | L'utilisateur complète les 5 étapes en moins de 3 minutes et arrive sur Agenda avec un programme et des objectifs nutritionnels générés |
| Cadre de départ cohérent | À la fin de l'onboarding, un programme initial, des objectifs macros et une semaine type sont visibles dans Agenda |
| Visualisation de la semaine | L'utilisateur voit ses séances, le statut du jour et son résumé nutritionnel sur la vue Agenda sans charger de données réseau |
| Séance complète série par série | L'utilisateur peut logger 3+ exercices avec N séries chacun, hors ligne, et retrouver les données synchronisées à la reconnexion |
| Exercice personnalisé | L'utilisateur peut créer un exercice avec nom, groupe musculaire, matériel et description, et l'ajouter à une séance |
| Repas manuel | L'utilisateur peut ajouter un repas avec plusieurs aliments et voir les macros mises à jour en temps réel |
| Photo repas + correction IA | L'IA retourne une estimation en < 5s, l'utilisateur peut modifier chaque item et valider — aucun enregistrement automatique |
| Aliment personnalisé | L'utilisateur peut créer un aliment avec nom, calories et macros, et le retrouver dans sa bibliothèque |
| Check-in progression | L'utilisateur peut enregistrer poids, photos et note de récupération depuis Progression |
| Bilan hebdomadaire | Le bilan est lisible sans connaissances fitness avancées, inclut au moins 1 suggestion IA et est consultable depuis l'historique |
| Suggestion IA contrôlée | L'utilisateur voit la suggestion, son explication et peut l'accepter ou la refuser — aucune modification silencieuse |
| Parcours critiques hors ligne | Séance, log repas manuel et check-in fonctionnent sans réseau et synchronisent sans perte à la reconnexion |

### 16.2 Exigences secondaires importantes

- Les rappels sont paramétrables.
- Les streaks sont visibles et compréhensibles.
- Les historiques récents sont faciles à consulter.
- Les statuts de synchronisation sont visibles au bon moment.

## 17. Exigences non fonctionnelles

### 17.1 Expérience

- L'app doit être pensée d'abord pour un usage à une main sur smartphone.
- Les actions fréquentes doivent être accessibles en peu d'étapes.
- Les parcours quotidiens doivent être rapides.

### 17.2 Performance

Core Web Vitals cibles (mesurés sur connexion mobile 4G):

| Métrique | Cible |
|----------|-------|
| LCP (Largest Contentful Paint) | < 2.5 s |
| INP (Interaction to Next Paint) | < 200 ms |
| CLS (Cumulative Layout Shift) | < 0.1 |

Temps de réponse par action critique:

| Action | Cible | Source |
|--------|-------|--------|
| Affichage écran Agenda | < 1 s | Données locales d'abord (offline-first) |
| Log d'une série | < 200 ms | Local uniquement, pas de réseau |
| Réponse Coach IA chat | < 3 s | Streaming activé si possible |
| Estimation photo repas | < 5 s | GPT-4o Vision |
| Génération bilan hebdo | < 10 s | Background, non bloquant |

### 17.3 Fiabilité

- Aucune perte silencieuse de données utilisateur.
- Gestion explicite des états offline, pending, synced, failed.
- Sync queue: maximum 200 actions en attente.
- Retry automatique à la reconnexion avec exponential backoff (1s, 2s, 4s, 8s, max 5 essais).
- Données des 7 derniers jours toujours disponibles hors ligne.

### 17.4 Sécurité et confidentialité

- Les données sensibles sont privées par défaut.
- Les photos ne sont pas exposées publiquement.
- L'utilisateur doit pouvoir comprendre ce qui est utilisé par l'IA.

## 18. Entités produit à verrouiller

### 18.1 `UserProfile`

Contient:

- identité produit minimale
- objectif principal
- niveau
- matériel disponible
- contraintes
- préférences nutritionnelles
- planning hebdomadaire
- unités

### 18.2 `TrainingTemplate`

Contient:

- type de programme
- niveau cible
- objectif compatible
- fréquence
- structure de séances

### 18.3 `TrainingPlan`

Contient:

- plan actif
- semaine type
- séances planifiées
- version du plan
- statut

### 18.4 `WorkoutSession`

Contient:

- date
- statut
- exercices
- résumé
- notes

### 18.5 `SetLog`

Contient:

- exercice
- numéro de série
- reps
- charge
- repos
- ressenti
- validation

### 18.6 `Exercise`

Contient:

- nom
- catégorie
- groupe musculaire
- matériel
- description texte
- origine standard ou personnalisée

### 18.7 `NutritionTarget`

Contient:

- calories
- protéines
- glucides
- lipides
- date ou période de validité

### 18.8 `FoodItem`

Contient:

- nom
- portion
- calories
- macros
- origine standard ou personnalisée

### 18.9 `MealEntry`

Contient:

- repas
- date
- liste d'items
- totaux nutritionnels
- source manuelle ou IA
- niveau de confiance
- validation utilisateur

### 18.10 `ProgressCheckin`

Contient:

- date
- poids
- photos
- notes
- contexte

### 18.11 `RecoveryCheckin`

Contient:

- sommeil perçu
- énergie
- fatigue
- courbatures
- commentaire libre

### 18.12 `AIRecommendation`

Contient:

- contexte
- suggestion
- justification
- impact attendu
- statut proposé, accepté ou refusé

### 18.13 `Reminder`

Contient:

- type
- horaire
- fréquence
- activation

### 18.14 `SyncQueueItem`

Contient:

- type d'action
- payload
- date de mise en file
- statut de synchronisation
- dernière tentative

## 19. Cas d'usage clés

### 19.1 Génération du cadre initial

À la fin de l'onboarding, l'utilisateur reçoit:

- un programme initial cohérent
- des objectifs nutritionnels
- une semaine structurée
- des premiers rappels adaptés

### 19.2 Vue agenda utile au quotidien

En ouvrant l'app, l'utilisateur sait:

- s'il a une séance aujourd'hui
- où il en est dans ses objectifs du jour
- quelles tâches restent à faire

### 19.3 Séance complète hors ligne

L'utilisateur peut:

- ouvrir sa séance
- enregistrer toutes ses séries
- terminer la séance
- retrouver ensuite les données synchronisées

### 19.4 Log repas avec correction IA

L'utilisateur peut:

- prendre une photo
- recevoir une estimation
- corriger l'estimation
- valider l'enregistrement final

### 19.5 Personnalisation libre

L'utilisateur peut:

- créer un exercice non présent dans la base
- créer un aliment ou repas sur mesure

### 19.6 Suivi de progression lisible

L'utilisateur peut:

- voir l'évolution de son poids
- comparer ses performances
- consulter ses photos
- relier ses efforts à ses résultats

### 19.7 Recommandation IA contrôlée

L'utilisateur peut:

- comprendre pourquoi une suggestion apparaît
- l'accepter ou la refuser
- garder un historique de décision

### 19.8 Expérience stable malgré le réseau

L'utilisateur garde une expérience cohérente même si:

- il perd le réseau à la salle
- il logge un repas en déplacement
- une analyse IA doit attendre la reconnexion

## 20. Métriques de succès

### 20.1 Métrique principale

- nombre de séances loggées par utilisateur actif

### 20.2 Métriques secondaires

- rétention hebdomadaire
- taux de complétion de l'onboarding
- nombre de jours avec journal nutritionnel rempli
- part des utilisateurs réalisant au moins un check-in progression par semaine
- taux d'acceptation des recommandations IA
- taux d'échec de synchronisation

### 20.3 Signaux qualitatifs

- perception de clarté sur "quoi faire aujourd'hui"
- sentiment de progression
- confiance dans les suggestions IA
- perception de faible friction au quotidien

## 21. Contraintes et risques

### 21.1 Contraintes

- la PWA doit offrir une expérience mobile crédible
- certaines capacités natives peuvent varier selon la plateforme
- le mode hors ligne doit être conçu dès le départ
- la couche IA ne doit pas créer d'opacité ou de perte de contrôle

### 21.2 Risques produit

- trop de périmètre en v1 et expérience confuse
- saisie nutritionnelle perçue comme trop lourde
- estimation photo IA jugée peu fiable si mal encadrée
- complexité offline/sync sous-estimée
- recommandations IA perçues comme gadgets si trop génériques

### 21.3 Réponses produit prévues

- recentrer la v1 sur les parcours quotidiens cœur
- toujours permettre la correction manuelle
- rendre les suggestions explicables
- exposer clairement les statuts de synchronisation

## 22. Périmètre par phase

### 22.1 V1

#### In scope

- compte obligatoire
- onboarding complet
- agenda semaine
- programme initial et templates
- création et édition de programme de base
- log séance complet série par série
- exercices personnalisés
- nutrition avec saisie manuelle
- photo repas avec estimation IA et validation utilisateur
- aliments et repas personnalisés
- objectifs calories/macros
- progression poids + performances + photos
- check-in récupération simple
- bilans hebdomadaires
- coach IA contextuel + chat dédié
- rappels utiles et modérés
- offline pour les parcours critiques
- synchronisation différée visible

#### Out of scope

- social
- coach-client
- intégrations Apple Health / Google Fit / wearables
- monétisation
- barcode scan
- bibliothèque vidéo riche
- plans repas complets multi-jours
- auto-ajustement silencieux du plan

#### Future scope proche

- amélioration du scoring de récupération
- suggestions repas plus intelligentes
- contenu pédagogique enrichi

### 22.2 V1.5

#### In scope visé

- enrichissement des bilans hebdomadaires
- meilleures suggestions nutritionnelles
- favoris et raccourcis plus poussés
- recommandations IA plus personnalisées selon historique
- amélioration de la visualisation des tendances
- règles plus fines de rappels et de relances

#### Out of scope maintenu

- social complet
- marketplace coach
- intégrations complexes

#### Future scope

- scan code-barres
- contenu d'exercices enrichi
- meilleure personnalisation multi-objectifs

### 22.3 V2

#### In scope visé

- intégrations externes santé et activité
- logique sociale légère ou accountability
- contenu d'exercices plus riche
- recommandations plus prédictives
- parcours nutrition plus avancés
- éventuelle monétisation

#### À traiter avec prudence

- automatisation plus poussée des ajustements
- expansion à des profils utilisateurs plus variés

## 23. Recommandations de cadrage

- Faire de `Agenda` le vrai centre du produit.
- Traiter `offline + sync` comme une fonctionnalité visible et non comme un détail technique.
- Ajouter dès la v1 les `exercices personnalisés` et `aliments personnalisés`.
- Garder la couche IA utile, explicable et contrôlée.
- Introduire le `check-in récupération` simple dès le départ pour mieux connecter ressenti et recommandations.

## 24. Questions à arbitrer plus tard

Ces sujets ne bloquent pas le démarrage du développement mais devront être précisés avant d'implémenter les features concernées:

- **Ton précis du Coach IA**: formel ou proche, tutoyement, niveau d'humour, gestion des mauvaises semaines
- **Politique de suppression et export de données**: conformité RGPD, délais de suppression, format d'export
- **Niveau de personnalisation des notifications**: granularité par type de rappel, fenêtres horaires autorisées, fréquence max

## 25. Conclusion

YCoach doit être conçu comme un compagnon quotidien qui unifie agenda, entraînement, nutrition, progression et assistance IA dans une seule expérience mobile. La réussite de la v1 dépendra moins du volume total de fonctionnalités que de la qualité des parcours cœur: ouvrir l'app, savoir quoi faire, exécuter sa séance, suivre ses repas, voir ses progrès et recevoir des recommandations utiles sans perdre le contrôle.

Le PRD doit servir de référence commune pour la suite du projet. Toute décision produit ou technique future devra préserver cette priorité: rendre la régularité simple, visible et soutenue par des outils concrets.

---

## 26. Stack technique

### 26.1 Frontend

- **Framework**: Next.js 14 (App Router)
- **PWA**: `next-pwa` + Workbox (Service Worker généré automatiquement)
- **Styling**: Tailwind CSS + shadcn/ui (composants accessibles, personnalisables)
- **Animations**: Framer Motion pour les transitions et micro-interactions
- **State management**: Zustand (état global léger) + TanStack Query (server state, cache, sync)

### 26.2 Backend / BaaS

- **Provider**: Supabase
  - Auth (email/password + magic link de récupération)
  - PostgreSQL (base de données principale)
  - Storage (photos de progression — privées par défaut, pas d'accès public)
  - Realtime (mises à jour live optionnelles)
- **Hosting frontend**: Vercel
- **Edge functions**: Supabase Edge Functions (Deno) pour les appels IA — chaque fonction lit la clé API OpenAI de l'utilisateur connecté depuis son profil chiffré, jamais depuis une variable d'environnement partagée

### 26.3 Offline et synchronisation

- **Stockage local**: IndexedDB via `Dexie.js`
- **Stratégie cache**: Cache-first pour les assets statiques, Network-first pour les données fraîches, Stale-while-revalidate pour les listes
- **Sync queue**: Actions créées hors ligne stockées dans IndexedDB (`SyncQueueItem`), synchronisées à la reconnexion
- **Conflict resolution**: Last-write-wins pour les logs utilisateur (les données de séance et repas sont append-only)
- **Données offline garanties**: 7 derniers jours de séances, repas, check-ins + programme actif + bibliothèque exercices/aliments

### 26.4 Authentification

- Email/password (Supabase Auth)
- Récupération de compte par lien email
- Session persistante (refresh token automatique)
- Row Level Security (RLS) Supabase pour l'isolation des données par utilisateur

---

## 27. Spécifications IA

### 27.1 Provider et modèle de clé API

- **Provider**: OpenAI GPT-4o (vision + text)
- **Modèle de facturation**: chaque utilisateur fournit sa propre clé API OpenAI dans Réglages
- **Stockage de la clé**: chiffrée dans la colonne `openai_api_key` du profil Supabase (chiffrement Supabase at-rest + RLS)
- **Utilisation**: les appels IA passent par une Supabase Edge Function qui lit la clé de l'utilisateur authentifié — la clé n'est jamais exposée côté client ni dans les logs
- **Si la clé est absente ou invalide**: les fonctionnalités IA affichent un message invitant à renseigner la clé dans Réglages — aucun parcours critique n'est bloqué

### 27.2 Photo estimation repas

- **Modèle**: GPT-4o Vision
- **Prompt template** (system): contexte nutritionnel de l'utilisateur (objectifs macros du jour) + instructions pour retourner une liste structurée d'aliments avec portions et macros estimées
- **Contrat**: l'estimation est toujours retournée comme proposition modifiable, jamais enregistrée automatiquement
- **Timeout**: 10s max, avec fallback vers saisie manuelle si dépassé
- **Photo**: transmise à l'API pour analyse uniquement, non persistée côté serveur

### 27.3 Coach IA chat

- **Modèle**: GPT-4o
- **Contexte injecté dans chaque message**:
  - Profil utilisateur (objectif, niveau, contraintes)
  - 7 derniers jours: séances réalisées, macros moyennes, poids, check-ins récupération
  - Historique des 10 derniers messages de la conversation
- **Limites**: réponse max ~500 tokens, streaming activé pour la perception de vitesse
- **Règles impératives dans le system prompt**: aucune posture médicale, aucune promesse de résultat, toujours expliquer le raisonnement

### 27.4 Bilan hebdomadaire

- **Modèle**: GPT-4o
- **Déclenchement**: cron Supabase chaque dimanche à 20h + accès manuel depuis Progression
- **Données injectées**: semaine complète (séances, nutrition, poids, check-ins, streak)
- **Output structuré**:
  - Résumé factuel de la semaine (3-5 phrases)
  - 1 à 3 suggestions concrètes et actionnables
  - Chaque suggestion inclut une justification courte
- **Validation requise**: toute modification du plan issue du bilan est soumise à validation utilisateur

### 27.5 Recommandations contextuelles

- **Modèle**: GPT-4o
- **Déclenchement** (règles, pas de polling): écart nutritionnel > 20% sur 2j consécutifs, séance manquée depuis 3j+, plateau de poids > 2 semaines, récupération faible 3j de suite
- **Rôle de GPT-4o**: génère l'explication contextuelle (pas juste la règle brute affichée)
- **Format**: message court (max 2 phrases) + bouton d'action ou de refus

### 27.6 Fallback IA

- Si l'API OpenAI est indisponible: afficher "Coach IA temporairement indisponible" dans les sections concernées
- Aucun parcours critique (log séance, log repas, check-in) ne dépend de l'IA
- La photo repas peut être mise en attente si le réseau est absent — l'utilisateur peut saisir manuellement en attendant

---

## 28. Données initiales (seed data V1)

### 28.1 Exercices (~200)

**Taxonomie**:

| Catégorie | Exemples |
|-----------|----------|
| Force | Squat barre, Développé couché, Soulevé de terre, Tractions |
| Isolation | Curl biceps, Extension triceps, Élévations latérales |
| Cardio | Course, Vélo, Rameur, Corde à sauter |
| Mobilité | Fente basse, Pigeon, Mobilisation thoracique |
| Fonctionnel | Burpee, Kettlebell swing, Turkish get-up |

**Groupes musculaires** (12): pectoraux, dos, épaules, biceps, triceps, abdominaux, quadriceps, ischio-jambiers, fessiers, mollets, avant-bras, corps entier

**Matériel**: haltères, barre olympique, machine guidée, poids du corps, élastiques, câbles, kettlebell, banc, barre de traction

**Données par exercice**: nom (FR), catégorie, groupe musculaire principal, groupes secondaires, matériel requis, description texte courte, variantes simples, origine `standard`

### 28.2 Aliments (~1 000)

**Catégories**:

| Catégorie | Exemples |
|-----------|----------|
| Viandes et volailles | Poulet (blanc), Bœuf haché 5%, Dinde |
| Poissons et fruits de mer | Saumon, Thon en boîte, Cabillaud |
| Œufs et produits laitiers | Œuf entier, Blanc d'œuf, Fromage blanc 0%, Lait écrémé |
| Légumes | Brocoli, Épinards, Courgette, Tomate |
| Féculents et céréales | Riz basmati, Pâtes, Avoine, Pain complet |
| Légumineuses | Lentilles, Pois chiches, Haricots rouges |
| Fruits | Banane, Pomme, Baies, Orange |
| Matières grasses | Huile d'olive, Beurre, Avocats, Noix |
| Boissons | Eau, Café, Thé, Lait végétal |
| Compléments courants | Whey protéine, Créatine |

**Données par aliment**: nom (FR), calories/100g, protéines/100g, glucides/100g (dont sucres), lipides/100g (dont saturés), fibres/100g, portion standard (g), origine `standard`

### 28.3 Templates d'entraînement (5 programmes)

Chaque template définit: nom, objectif compatible, niveau cible, fréquence, structure de la semaine type, et liste des séances avec exercices, séries, reps et temps de repos indicatifs.

| # | Nom | Objectif | Niveau | Fréquence |
|---|-----|----------|--------|-----------|
| 1 | Full Body Fondation | Prise de muscle / Recomposition | Débutant–Intermédiaire | 3 j/sem |
| 2 | Push Pull Legs | Prise de muscle | Intermédiaire–Avancé | 6 j/sem |
| 3 | Upper Lower | Prise de muscle / Performance | Intermédiaire | 4 j/sem |
| 4 | Cardio Endurance | Performance / Perte de poids | Tous niveaux | 4 j/sem |
| 5 | Mobilité Récupération | Recomposition / Santé générale | Tous niveaux | 3 j/sem |

Les templates servent de point de départ — l'utilisateur peut modifier n'importe quel exercice, série ou repos après sélection.

