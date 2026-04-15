-- Starter seed for v1 scaffolding.
-- The schema is ready for the full target volume (~200 exercises / ~1000 foods).
-- This seed intentionally loads a representative subset plus the 5 required templates.

insert into public.exercises (id, name, category, muscle_group, secondary_muscles, equipment, description, variants, origin)
values
  ('00000000-0000-0000-0000-000000000101', 'Squat barre', 'Force', 'Quadriceps', array['Fessiers', 'Abdominaux'], 'barre olympique', 'Descends contrôlé, remonte fort en gardant le tronc gainé.', array['Front squat', 'Goblet squat'], 'standard'),
  ('00000000-0000-0000-0000-000000000102', 'Développé couché', 'Force', 'Pectoraux', array['Triceps', 'Épaules'], 'barre olympique', 'Toucher léger poitrine, trajectoire stable, pieds ancrés.', array['Développé haltères'], 'standard'),
  ('00000000-0000-0000-0000-000000000103', 'Soulevé de terre roumain', 'Force', 'Ischio-jambiers', array['Fessiers', 'Dos'], 'barre olympique', 'Hanches en arrière, dos long, amplitude contrôlée.', array['RDL haltères'], 'standard'),
  ('00000000-0000-0000-0000-000000000104', 'Tractions', 'Force', 'Dos', array['Biceps', 'Avant-bras'], 'barre de traction', 'Traction complète, contrôle scapulaire.', array['Tractions assistées'], 'standard'),
  ('00000000-0000-0000-0000-000000000105', 'Rowing unilatéral', 'Force', 'Dos', array['Biceps'], 'haltères', 'Tire le coude vers la hanche.', array['Rowing poitrine appuyée'], 'standard'),
  ('00000000-0000-0000-0000-000000000106', 'Développé incliné haltères', 'Force', 'Pectoraux', array['Triceps', 'Épaules'], 'haltères', 'Angle modéré, trajectoire contrôlée.', array['Développé incliné barre'], 'standard'),
  ('00000000-0000-0000-0000-000000000107', 'Élévations latérales', 'Isolation', 'Épaules', array[]::text[], 'haltères', 'Monte jusqu''à l''horizontale sans tricher.', array['Câbles'], 'standard'),
  ('00000000-0000-0000-0000-000000000108', 'Curl biceps', 'Isolation', 'Biceps', array['Avant-bras'], 'haltères', 'Amplitude complète et tempo contrôlé.', array['Curl pupitre'], 'standard'),
  ('00000000-0000-0000-0000-000000000109', 'Extension triceps câble', 'Isolation', 'Triceps', array[]::text[], 'câbles', 'Verrouille les coudes, extension pleine.', array['Barre EZ'], 'standard'),
  ('00000000-0000-0000-0000-000000000110', 'Vélo zone 2', 'Cardio', 'Corps entier', array[]::text[], 'vélo', 'Effort conversationnel stable 30 à 45 minutes.', array['Rameur zone 2'], 'standard'),
  ('00000000-0000-0000-0000-000000000111', 'Rameur', 'Cardio', 'Corps entier', array[]::text[], 'rameur', 'Cadence stable, respiration contrôlée.', array['Ski erg'], 'standard'),
  ('00000000-0000-0000-0000-000000000112', 'Planche', 'Fonctionnel', 'Abdominaux', array['Épaules'], 'poids du corps', 'Gainage global, respiration lente.', array['Planche latérale'], 'standard')
on conflict (id) do nothing;

insert into public.food_items (id, name, calories, protein, carbs, fats, fiber, portion_grams, origin)
values
  ('00000000-0000-0000-0000-000000000201', 'Poulet grillé', 165, 31, 0, 3.6, 0, 150, 'standard'),
  ('00000000-0000-0000-0000-000000000202', 'Riz basmati cuit', 130, 2.7, 28, 0.3, 0.4, 180, 'standard'),
  ('00000000-0000-0000-0000-000000000203', 'Saumon', 208, 20, 0, 13, 0, 150, 'standard'),
  ('00000000-0000-0000-0000-000000000204', 'Flocons d''avoine', 372, 13, 58, 7, 8, 50, 'standard'),
  ('00000000-0000-0000-0000-000000000205', 'Skyr nature', 64, 11, 3.6, 0.2, 0, 150, 'standard'),
  ('00000000-0000-0000-0000-000000000206', 'Banane', 89, 1.1, 20, 0.3, 2.6, 120, 'standard'),
  ('00000000-0000-0000-0000-000000000207', 'Brocoli', 35, 2.8, 4.4, 0.4, 3.3, 150, 'standard'),
  ('00000000-0000-0000-0000-000000000208', 'Œuf entier', 143, 13, 1.1, 9.5, 0, 60, 'standard'),
  ('00000000-0000-0000-0000-000000000209', 'Lentilles cuites', 116, 9, 20, 0.4, 8, 150, 'standard'),
  ('00000000-0000-0000-0000-000000000210', 'Huile d''olive', 884, 0, 0, 100, 0, 10, 'standard'),
  ('00000000-0000-0000-0000-000000000211', 'Pain complet', 247, 13, 41, 4.2, 6.8, 60, 'standard'),
  ('00000000-0000-0000-0000-000000000212', 'Fromage blanc 0%', 46, 8.5, 3.9, 0.2, 0, 150, 'standard'),
  ('00000000-0000-0000-0000-000000000213', 'Bœuf haché 5%', 137, 21, 0, 5, 0, 125, 'standard'),
  ('00000000-0000-0000-0000-000000000214', 'Pâtes cuites', 158, 5.8, 30, 0.9, 1.8, 180, 'standard'),
  ('00000000-0000-0000-0000-000000000215', 'Whey protéine', 400, 78, 8, 6, 0, 30, 'standard')
on conflict (id) do nothing;

insert into public.training_templates (id, name, goal, level, frequency, structure, origin)
values
  ('00000000-0000-0000-0000-000000000301', 'Full Body Fondation', 'muscle_gain', 'beginner', 3, '[{"day":"Lun","focus":"Full body A"},{"day":"Mer","focus":"Full body B"},{"day":"Ven","focus":"Full body C"}]'::jsonb, 'standard'),
  ('00000000-0000-0000-0000-000000000302', 'Push Pull Legs', 'muscle_gain', 'advanced', 6, '[{"day":"Lun","focus":"Push"},{"day":"Mar","focus":"Pull"},{"day":"Mer","focus":"Legs"}]'::jsonb, 'standard'),
  ('00000000-0000-0000-0000-000000000303', 'Upper Lower', 'recomposition', 'intermediate', 4, '[{"day":"Lun","focus":"Upper"},{"day":"Mar","focus":"Lower"},{"day":"Jeu","focus":"Upper"},{"day":"Sam","focus":"Lower"}]'::jsonb, 'standard'),
  ('00000000-0000-0000-0000-000000000304', 'Cardio Endurance', 'performance', 'all', 4, '[{"day":"Lun","focus":"Zone 2"},{"day":"Mer","focus":"Intervalles"},{"day":"Ven","focus":"Tempo"},{"day":"Dim","focus":"Long"}]'::jsonb, 'standard'),
  ('00000000-0000-0000-0000-000000000305', 'Mobilité Récupération', 'recomposition', 'all', 3, '[{"day":"Mar","focus":"Mobilité hanches"},{"day":"Jeu","focus":"Thoracique"},{"day":"Dim","focus":"Flow récupération"}]'::jsonb, 'standard')
on conflict (id) do nothing;

