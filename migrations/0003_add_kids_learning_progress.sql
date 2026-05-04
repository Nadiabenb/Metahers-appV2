CREATE TABLE IF NOT EXISTS "kids_learning_progress" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" varchar NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "completed_weeks" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "badges" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "completed_projects" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "notes" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "reflections" jsonb DEFAULT '{"confidence":3,"favActivity":"","whatWasHard":"","nextPractice":""}'::jsonb NOT NULL,
  "selected_week" integer DEFAULT 1 NOT NULL,
  "selected_session" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now(),
  CONSTRAINT "kids_learning_progress_user_id_unique" UNIQUE ("user_id")
);

CREATE INDEX IF NOT EXISTS "idx_kids_learning_progress_user" ON "kids_learning_progress" ("user_id");
