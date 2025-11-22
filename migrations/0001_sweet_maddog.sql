CREATE TABLE "direct_messages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender_id" varchar NOT NULL,
	"recipient_id" varchar NOT NULL,
	"message" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "opportunities" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"poster_id" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" text NOT NULL,
	"type" varchar NOT NULL,
	"compensation" varchar,
	"featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "profile_activity_feed" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" varchar NOT NULL,
	"activity_type" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"visibility" varchar DEFAULT 'public' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "profile_services" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" text NOT NULL,
	"category" varchar NOT NULL,
	"rate" varchar,
	"featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "profile_skills" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" varchar NOT NULL,
	"skill_name" varchar NOT NULL,
	"proficiency" varchar DEFAULT 'intermediate' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "retro_camera_photos" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"image_url" text NOT NULL,
	"filter_name" varchar NOT NULL,
	"caption" text,
	"like_count" integer DEFAULT 0 NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "skills_trades" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" varchar NOT NULL,
	"having_skill" varchar NOT NULL,
	"wanting_skill" varchar NOT NULL,
	"description" text,
	"status" varchar DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "women_profiles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"headline" varchar,
	"bio" text,
	"location" varchar,
	"profile_image" varchar,
	"visibility" varchar DEFAULT 'public' NOT NULL,
	"looking_for" jsonb DEFAULT '[]'::jsonb,
	"availability" varchar DEFAULT 'active' NOT NULL,
	"verified_member" boolean DEFAULT false NOT NULL,
	"completion_percentage" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "stripe_customer_id" varchar;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "stripe_subscription_id" varchar;--> statement-breakpoint
ALTER TABLE "direct_messages" ADD CONSTRAINT "direct_messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "direct_messages" ADD CONSTRAINT "direct_messages_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_poster_id_users_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_activity_feed" ADD CONSTRAINT "profile_activity_feed_profile_id_women_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."women_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_services" ADD CONSTRAINT "profile_services_profile_id_women_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."women_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_skills" ADD CONSTRAINT "profile_skills_profile_id_women_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."women_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "retro_camera_photos" ADD CONSTRAINT "retro_camera_photos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skills_trades" ADD CONSTRAINT "skills_trades_profile_id_women_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."women_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "women_profiles" ADD CONSTRAINT "women_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_message_sender" ON "direct_messages" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX "idx_message_recipient" ON "direct_messages" USING btree ("recipient_id");--> statement-breakpoint
CREATE INDEX "idx_opportunity_poster" ON "opportunities" USING btree ("poster_id");--> statement-breakpoint
CREATE INDEX "idx_activity_profile" ON "profile_activity_feed" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "idx_activity_type" ON "profile_activity_feed" USING btree ("activity_type");--> statement-breakpoint
CREATE INDEX "idx_service_profile" ON "profile_services" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "idx_skill_profile" ON "profile_skills" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "idx_retro_photo_user" ON "retro_camera_photos" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_retro_photo_created" ON "retro_camera_photos" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_retro_photo_public" ON "retro_camera_photos" USING btree ("is_public");--> statement-breakpoint
CREATE INDEX "idx_trade_profile" ON "skills_trades" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "idx_trade_status" ON "skills_trades" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_profile_user" ON "women_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_profile_visibility" ON "women_profiles" USING btree ("visibility");