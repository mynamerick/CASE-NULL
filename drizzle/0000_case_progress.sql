CREATE TABLE IF NOT EXISTS "case_progress" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" text NOT NULL,
  "case_id" text NOT NULL,
  "state" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "status" text DEFAULT 'in_progress' NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "case_progress_user_case_idx"
  ON "case_progress" ("user_id", "case_id");
