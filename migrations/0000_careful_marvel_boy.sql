CREATE TABLE "accelerator_cohorts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"application_deadline" timestamp NOT NULL,
	"max_participants" integer DEFAULT 100 NOT NULL,
	"current_participants" integer DEFAULT 0 NOT NULL,
	"price" integer DEFAULT 990 NOT NULL,
	"status" varchar DEFAULT 'upcoming' NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "accelerator_enrollments" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"cohort_id" varchar NOT NULL,
	"status" varchar DEFAULT 'applied' NOT NULL,
	"application_data" jsonb,
	"paid_at" timestamp,
	"completed_at" timestamp,
	"milestones_completed" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "accelerator_milestone_progress" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enrollment_id" varchar NOT NULL,
	"milestone_id" varchar NOT NULL,
	"status" varchar DEFAULT 'not_started' NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"notes" text,
	"completed_at" timestamp,
	"started_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "accelerator_milestones" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar NOT NULL,
	"description" text NOT NULL,
	"stage" varchar NOT NULL,
	"week_start" integer NOT NULL,
	"week_end" integer NOT NULL,
	"order" integer NOT NULL,
	"resources" jsonb DEFAULT '[]'::jsonb,
	"required_for" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "achievements" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"achievement_key" varchar NOT NULL,
	"unlocked_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ai_usage" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255),
	"prompt_type" varchar(50) NOT NULL,
	"prompt_version" varchar(10) NOT NULL,
	"model" varchar(50) NOT NULL,
	"prompt_tokens" integer NOT NULL,
	"completion_tokens" integer NOT NULL,
	"total_tokens" integer NOT NULL,
	"cached" boolean DEFAULT false,
	"latency_ms" integer,
	"cost" numeric(10, 6),
	"success" boolean DEFAULT true,
	"error_message" text,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app_atelier_usage" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"message_count" integer DEFAULT 0 NOT NULL,
	"last_message_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255),
	"action" varchar(100) NOT NULL,
	"resource_type" varchar(50) NOT NULL,
	"resource_id" varchar(255) NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cohort_capacity" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cohort_name" varchar NOT NULL,
	"total_spots" integer DEFAULT 10 NOT NULL,
	"taken_spots" integer DEFAULT 0 NOT NULL,
	"next_cohort_date" timestamp,
	"is_active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "cohort_capacity_cohort_name_unique" UNIQUE("cohort_name")
);
--> statement-breakpoint
CREATE TABLE "companion_activities" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"activity_type" varchar NOT NULL,
	"stat_changed" varchar NOT NULL,
	"points_gained" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "companions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"name" varchar DEFAULT 'Muse' NOT NULL,
	"stage" varchar DEFAULT 'seedling' NOT NULL,
	"current_mood" varchar DEFAULT 'curious',
	"growth" integer DEFAULT 0 NOT NULL,
	"inspiration" integer DEFAULT 0 NOT NULL,
	"connection" integer DEFAULT 0 NOT NULL,
	"mastery" integer DEFAULT 0 NOT NULL,
	"last_fed" timestamp,
	"last_played" timestamp,
	"last_socialized" timestamp,
	"unlocked_accessories" jsonb DEFAULT '[]'::jsonb,
	"equipped_accessories" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "companions_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "email_leads" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar NOT NULL,
	"source" varchar DEFAULT 'email_capture_modal',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "email_leads_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "experience_progress" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"experience_id" varchar NOT NULL,
	"completed_sections" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"personalization_answers" jsonb,
	"personalized_content" jsonb,
	"confidence_score" integer,
	"business_impact" text,
	"milestones_achieved" jsonb DEFAULT '[]'::jsonb,
	"started_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"last_updated" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "experience_sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"experience_id" varchar NOT NULL,
	"type" varchar(50) NOT NULL,
	"title" text NOT NULL,
	"content" text,
	"metadata" jsonb,
	"sort_order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "founder_insights" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar NOT NULL,
	"content" text NOT NULL,
	"insight_type" varchar DEFAULT 'voice_note' NOT NULL,
	"audio_url" varchar,
	"video_url" varchar,
	"min_tier_required" varchar DEFAULT 'inner_circle' NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"published_at" timestamp DEFAULT now(),
	"view_count" integer DEFAULT 0 NOT NULL,
	"like_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "glow_up_journal" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"day" integer NOT NULL,
	"gpt_response" text,
	"public_post_draft" text,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "glow_up_profiles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"brand_type" varchar NOT NULL,
	"niche" text NOT NULL,
	"platform" varchar NOT NULL,
	"goal" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "glow_up_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "glow_up_progress" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"completed_days" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"current_day" integer DEFAULT 1 NOT NULL,
	"started_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"last_updated" timestamp DEFAULT now(),
	CONSTRAINT "glow_up_progress_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "group_sessions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"session_type" varchar DEFAULT 'sanctuary_monthly' NOT NULL,
	"scheduled_date" timestamp NOT NULL,
	"duration" integer DEFAULT 90 NOT NULL,
	"max_capacity" integer DEFAULT 30 NOT NULL,
	"current_attendees" integer DEFAULT 0 NOT NULL,
	"zoom_link" varchar,
	"meeting_id" varchar,
	"status" varchar DEFAULT 'scheduled' NOT NULL,
	"recording_url" varchar,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "insight_interactions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"insight_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"has_viewed" boolean DEFAULT false NOT NULL,
	"has_liked" boolean DEFAULT false NOT NULL,
	"viewed_at" timestamp,
	"liked_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "journal_entries" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"date" varchar DEFAULT to_char(now(), 'YYYY-MM-DD') NOT NULL,
	"content" text NOT NULL,
	"structured_content" jsonb,
	"mood" varchar,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"word_count" integer DEFAULT 0 NOT NULL,
	"ai_insights" jsonb,
	"ai_prompt" text,
	"streak" integer DEFAULT 0 NOT NULL,
	"last_saved" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "one_on_one_bookings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"booking_type" varchar NOT NULL,
	"scheduled_date" timestamp NOT NULL,
	"duration" integer DEFAULT 30 NOT NULL,
	"meeting_link" varchar,
	"status" varchar DEFAULT 'scheduled' NOT NULL,
	"agenda" text,
	"notes" text,
	"follow_up_actions" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"token" varchar NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "password_reset_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "personalization_questions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"experience_id" varchar NOT NULL,
	"question_text" text NOT NULL,
	"question_type" varchar NOT NULL,
	"options" jsonb,
	"sort_order" integer NOT NULL,
	"is_required" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "quiz_submissions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"answers" jsonb NOT NULL,
	"matched_ritual" varchar NOT NULL,
	"claimed" boolean DEFAULT false NOT NULL,
	"ritual_completed" boolean DEFAULT false NOT NULL,
	"one_on_one_booked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ritual_progress" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"ritual_slug" varchar NOT NULL,
	"completed_steps" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"last_updated" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "section_completions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"section_id" integer NOT NULL,
	"experience_id" varchar NOT NULL,
	"completed_at" timestamp DEFAULT now() NOT NULL,
	"time_spent_seconds" integer,
	"quiz_score" integer
);
--> statement-breakpoint
CREATE TABLE "section_resources" (
	"id" serial PRIMARY KEY NOT NULL,
	"section_id" integer NOT NULL,
	"type" varchar(50) NOT NULL,
	"title" text NOT NULL,
	"url" text,
	"metadata" jsonb,
	"sort_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session_registrations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"status" varchar DEFAULT 'registered' NOT NULL,
	"registered_at" timestamp DEFAULT now(),
	"cancelled_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "spaces" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"description" text NOT NULL,
	"icon" varchar NOT NULL,
	"color" varchar NOT NULL,
	"sort_order" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "spaces_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"stripe_customer_id" varchar,
	"stripe_subscription_id" varchar,
	"stripe_payment_intent_id" varchar,
	"stripe_price_id" varchar,
	"payment_type" varchar DEFAULT 'subscription' NOT NULL,
	"tier" varchar DEFAULT 'pro_monthly' NOT NULL,
	"status" varchar NOT NULL,
	"current_period_end" timestamp,
	"cancel_at_period_end" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "subscriptions_stripe_customer_id_unique" UNIQUE("stripe_customer_id"),
	CONSTRAINT "subscriptions_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id")
);
--> statement-breakpoint
CREATE TABLE "thought_leadership_posts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"day_number" integer NOT NULL,
	"topic" text NOT NULL,
	"daily_story" text,
	"content_long" text NOT NULL,
	"content_medium" text NOT NULL,
	"content_short" text NOT NULL,
	"status" varchar DEFAULT 'draft' NOT NULL,
	"published_to_metahers" boolean DEFAULT false NOT NULL,
	"published_to_external" boolean DEFAULT false NOT NULL,
	"external_platforms" jsonb DEFAULT '[]'::jsonb,
	"is_public" boolean DEFAULT false NOT NULL,
	"slug" varchar,
	"view_count" integer DEFAULT 0 NOT NULL,
	"like_count" integer DEFAULT 0 NOT NULL,
	"comment_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"published_at" timestamp,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "thought_leadership_progress" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"brand_expertise" text,
	"brand_niche" text,
	"problem_solved" text,
	"unique_story" text,
	"current_goals" text,
	"brand_onboarding_completed" boolean DEFAULT false NOT NULL,
	"current_day" integer DEFAULT 1 NOT NULL,
	"completed_days" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"lessons_completed" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"practices_submitted" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"practice_reflections" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"current_streak" integer DEFAULT 0 NOT NULL,
	"longest_streak" integer DEFAULT 0 NOT NULL,
	"total_posts_generated" integer DEFAULT 0 NOT NULL,
	"total_posts_published" integer DEFAULT 0 NOT NULL,
	"last_activity_date" varchar,
	"journey_status" varchar DEFAULT 'active' NOT NULL,
	"started_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "thought_leadership_progress_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "transformational_experiences" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"space_id" varchar NOT NULL,
	"title" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"description" text NOT NULL,
	"learning_objectives" jsonb NOT NULL,
	"tier" varchar DEFAULT 'free' NOT NULL,
	"estimated_minutes" integer NOT NULL,
	"sort_order" integer NOT NULL,
	"content" jsonb NOT NULL,
	"personalization_enabled" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "transformational_experiences_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar NOT NULL,
	"password_hash" varchar NOT NULL,
	"first_name" varchar,
	"last_name" varchar,
	"is_pro" boolean DEFAULT false NOT NULL,
	"subscription_tier" varchar DEFAULT 'free' NOT NULL,
	"onboarding_completed" boolean DEFAULT false NOT NULL,
	"quiz_unlocked_ritual" varchar,
	"quiz_completed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "accelerator_enrollments" ADD CONSTRAINT "accelerator_enrollments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accelerator_enrollments" ADD CONSTRAINT "accelerator_enrollments_cohort_id_accelerator_cohorts_id_fk" FOREIGN KEY ("cohort_id") REFERENCES "public"."accelerator_cohorts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accelerator_milestone_progress" ADD CONSTRAINT "accelerator_milestone_progress_enrollment_id_accelerator_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."accelerator_enrollments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accelerator_milestone_progress" ADD CONSTRAINT "accelerator_milestone_progress_milestone_id_accelerator_milestones_id_fk" FOREIGN KEY ("milestone_id") REFERENCES "public"."accelerator_milestones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_usage" ADD CONSTRAINT "ai_usage_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_atelier_usage" ADD CONSTRAINT "app_atelier_usage_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companion_activities" ADD CONSTRAINT "companion_activities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companions" ADD CONSTRAINT "companions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experience_progress" ADD CONSTRAINT "experience_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experience_progress" ADD CONSTRAINT "experience_progress_experience_id_transformational_experiences_id_fk" FOREIGN KEY ("experience_id") REFERENCES "public"."transformational_experiences"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experience_sections" ADD CONSTRAINT "experience_sections_experience_id_transformational_experiences_id_fk" FOREIGN KEY ("experience_id") REFERENCES "public"."transformational_experiences"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "glow_up_journal" ADD CONSTRAINT "glow_up_journal_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "glow_up_profiles" ADD CONSTRAINT "glow_up_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "glow_up_progress" ADD CONSTRAINT "glow_up_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insight_interactions" ADD CONSTRAINT "insight_interactions_insight_id_founder_insights_id_fk" FOREIGN KEY ("insight_id") REFERENCES "public"."founder_insights"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insight_interactions" ADD CONSTRAINT "insight_interactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "one_on_one_bookings" ADD CONSTRAINT "one_on_one_bookings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personalization_questions" ADD CONSTRAINT "personalization_questions_experience_id_transformational_experiences_id_fk" FOREIGN KEY ("experience_id") REFERENCES "public"."transformational_experiences"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_submissions" ADD CONSTRAINT "quiz_submissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ritual_progress" ADD CONSTRAINT "ritual_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "section_completions" ADD CONSTRAINT "section_completions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "section_completions" ADD CONSTRAINT "section_completions_section_id_experience_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."experience_sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "section_completions" ADD CONSTRAINT "section_completions_experience_id_transformational_experiences_id_fk" FOREIGN KEY ("experience_id") REFERENCES "public"."transformational_experiences"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "section_resources" ADD CONSTRAINT "section_resources_section_id_experience_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."experience_sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_registrations" ADD CONSTRAINT "session_registrations_session_id_group_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."group_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_registrations" ADD CONSTRAINT "session_registrations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thought_leadership_posts" ADD CONSTRAINT "thought_leadership_posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thought_leadership_progress" ADD CONSTRAINT "thought_leadership_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transformational_experiences" ADD CONSTRAINT "transformational_experiences_space_id_spaces_id_fk" FOREIGN KEY ("space_id") REFERENCES "public"."spaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_enrollment_user" ON "accelerator_enrollments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_enrollment_cohort" ON "accelerator_enrollments" USING btree ("cohort_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_enrollment_user_cohort_unique" ON "accelerator_enrollments" USING btree ("user_id","cohort_id");--> statement-breakpoint
CREATE INDEX "idx_milestone_progress_enrollment" ON "accelerator_milestone_progress" USING btree ("enrollment_id");--> statement-breakpoint
CREATE INDEX "idx_milestone_progress_milestone" ON "accelerator_milestone_progress" USING btree ("milestone_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_milestone_progress_enrollment_milestone_unique" ON "accelerator_milestone_progress" USING btree ("enrollment_id","milestone_id");--> statement-breakpoint
CREATE INDEX "idx_achievement_user" ON "achievements" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_achievement_key" ON "achievements" USING btree ("achievement_key");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_app_atelier_user_unique" ON "app_atelier_usage" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_cohort_capacity_name" ON "cohort_capacity" USING btree ("cohort_name");--> statement-breakpoint
CREATE INDEX "idx_companion_activity_user" ON "companion_activities" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_companion_activity_created" ON "companion_activities" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_companion_user" ON "companions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_email_leads_email" ON "email_leads" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_email_leads_created" ON "email_leads" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_exp_progress_user" ON "experience_progress" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_exp_progress_experience" ON "experience_progress" USING btree ("experience_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_exp_progress_user_experience_unique" ON "experience_progress" USING btree ("user_id","experience_id");--> statement-breakpoint
CREATE INDEX "idx_section_experience" ON "experience_sections" USING btree ("experience_id");--> statement-breakpoint
CREATE INDEX "idx_section_sort" ON "experience_sections" USING btree ("experience_id","sort_order");--> statement-breakpoint
CREATE INDEX "idx_founder_insight_type" ON "founder_insights" USING btree ("insight_type");--> statement-breakpoint
CREATE INDEX "idx_founder_insight_tier" ON "founder_insights" USING btree ("min_tier_required");--> statement-breakpoint
CREATE INDEX "idx_founder_insight_published" ON "founder_insights" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "idx_glowup_journal_user" ON "glow_up_journal" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_glowup_journal_day" ON "glow_up_journal" USING btree ("day");--> statement-breakpoint
CREATE INDEX "idx_glowup_journal_user_day" ON "glow_up_journal" USING btree ("user_id","day");--> statement-breakpoint
CREATE INDEX "idx_glowup_profile_user" ON "glow_up_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_glowup_progress_user" ON "glow_up_progress" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_group_session_date" ON "group_sessions" USING btree ("scheduled_date");--> statement-breakpoint
CREATE INDEX "idx_group_session_type" ON "group_sessions" USING btree ("session_type");--> statement-breakpoint
CREATE INDEX "idx_group_session_status" ON "group_sessions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_insight_int_insight" ON "insight_interactions" USING btree ("insight_id");--> statement-breakpoint
CREATE INDEX "idx_insight_int_user" ON "insight_interactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_journal_user" ON "journal_entries" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_journal_created" ON "journal_entries" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_journal_user_date" ON "journal_entries" USING btree ("user_id","date");--> statement-breakpoint
CREATE INDEX "idx_1on1_user" ON "one_on_one_bookings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_1on1_date" ON "one_on_one_bookings" USING btree ("scheduled_date");--> statement-breakpoint
CREATE INDEX "idx_1on1_status" ON "one_on_one_bookings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_1on1_type" ON "one_on_one_bookings" USING btree ("booking_type");--> statement-breakpoint
CREATE INDEX "idx_reset_token" ON "password_reset_tokens" USING btree ("token");--> statement-breakpoint
CREATE INDEX "idx_reset_user" ON "password_reset_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_personalization_experience" ON "personalization_questions" USING btree ("experience_id");--> statement-breakpoint
CREATE INDEX "idx_quiz_submission_user" ON "quiz_submissions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_quiz_submission_email" ON "quiz_submissions" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_quiz_submission_created" ON "quiz_submissions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_ritual_progress_user" ON "ritual_progress" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_ritual_progress_slug" ON "ritual_progress" USING btree ("ritual_slug");--> statement-breakpoint
CREATE INDEX "idx_completion_user" ON "section_completions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_completion_section" ON "section_completions" USING btree ("section_id");--> statement-breakpoint
CREATE INDEX "idx_completion_experience" ON "section_completions" USING btree ("experience_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_completion_user_section_unique" ON "section_completions" USING btree ("user_id","section_id");--> statement-breakpoint
CREATE INDEX "idx_resource_section" ON "section_resources" USING btree ("section_id");--> statement-breakpoint
CREATE INDEX "idx_session_reg_session" ON "session_registrations" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "idx_session_reg_user" ON "session_registrations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");--> statement-breakpoint
CREATE INDEX "idx_space_slug" ON "spaces" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_space_active" ON "spaces" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_space_active_sort" ON "spaces" USING btree ("is_active","sort_order");--> statement-breakpoint
CREATE INDEX "idx_subscription_user" ON "subscriptions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_subscription_stripe_customer" ON "subscriptions" USING btree ("stripe_customer_id");--> statement-breakpoint
CREATE INDEX "idx_tlp_user" ON "thought_leadership_posts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_tlp_day" ON "thought_leadership_posts" USING btree ("day_number");--> statement-breakpoint
CREATE INDEX "idx_tlp_status" ON "thought_leadership_posts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_tlp_public" ON "thought_leadership_posts" USING btree ("is_public");--> statement-breakpoint
CREATE INDEX "idx_tlp_slug" ON "thought_leadership_posts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_tlp_created" ON "thought_leadership_posts" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_tlprog_user" ON "thought_leadership_progress" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_tlprog_status" ON "thought_leadership_progress" USING btree ("journey_status");--> statement-breakpoint
CREATE INDEX "idx_experience_space" ON "transformational_experiences" USING btree ("space_id");--> statement-breakpoint
CREATE INDEX "idx_experience_tier" ON "transformational_experiences" USING btree ("tier");--> statement-breakpoint
CREATE INDEX "idx_experience_space_active_sort" ON "transformational_experiences" USING btree ("space_id","is_active","sort_order");--> statement-breakpoint
CREATE INDEX "idx_experience_active_sort" ON "transformational_experiences" USING btree ("is_active","sort_order");