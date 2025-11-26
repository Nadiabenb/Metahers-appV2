--
-- PostgreSQL database dump
--

\restrict ANHkICKHQ5Sm1TRApIeFbdLnFo1879ayuaD9qbk2zxSYuN8UjEXLWX7nI4E2nno

-- Dumped from database version 16.9 (415ebe8)
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: _system; Type: SCHEMA; Schema: -; Owner: neondb_owner
--

CREATE SCHEMA _system;


ALTER SCHEMA _system OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: replit_database_migrations_v1; Type: TABLE; Schema: _system; Owner: neondb_owner
--

CREATE TABLE _system.replit_database_migrations_v1 (
    id bigint NOT NULL,
    build_id text NOT NULL,
    deployment_id text NOT NULL,
    statement_count bigint NOT NULL,
    applied_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE _system.replit_database_migrations_v1 OWNER TO neondb_owner;

--
-- Name: replit_database_migrations_v1_id_seq; Type: SEQUENCE; Schema: _system; Owner: neondb_owner
--

CREATE SEQUENCE _system.replit_database_migrations_v1_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE _system.replit_database_migrations_v1_id_seq OWNER TO neondb_owner;

--
-- Name: replit_database_migrations_v1_id_seq; Type: SEQUENCE OWNED BY; Schema: _system; Owner: neondb_owner
--

ALTER SEQUENCE _system.replit_database_migrations_v1_id_seq OWNED BY _system.replit_database_migrations_v1.id;


--
-- Name: accelerator_cohorts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.accelerator_cohorts (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name character varying NOT NULL,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone NOT NULL,
    application_deadline timestamp without time zone NOT NULL,
    max_participants integer DEFAULT 100 NOT NULL,
    current_participants integer DEFAULT 0 NOT NULL,
    price integer DEFAULT 990 NOT NULL,
    status character varying DEFAULT 'upcoming'::character varying NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.accelerator_cohorts OWNER TO neondb_owner;

--
-- Name: accelerator_enrollments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.accelerator_enrollments (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    cohort_id character varying NOT NULL,
    status character varying DEFAULT 'applied'::character varying NOT NULL,
    application_data jsonb,
    paid_at timestamp without time zone,
    completed_at timestamp without time zone,
    milestones_completed integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.accelerator_enrollments OWNER TO neondb_owner;

--
-- Name: accelerator_milestone_progress; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.accelerator_milestone_progress (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    milestone_id character varying NOT NULL,
    status character varying DEFAULT 'not_started'::character varying NOT NULL,
    progress integer DEFAULT 0 NOT NULL,
    notes text,
    completed_at timestamp without time zone,
    started_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    enrollment_id character varying NOT NULL
);


ALTER TABLE public.accelerator_milestone_progress OWNER TO neondb_owner;

--
-- Name: accelerator_milestones; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.accelerator_milestones (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title character varying NOT NULL,
    description text NOT NULL,
    stage character varying NOT NULL,
    week_start integer NOT NULL,
    week_end integer NOT NULL,
    "order" integer NOT NULL,
    resources jsonb DEFAULT '[]'::jsonb,
    required_for jsonb DEFAULT '[]'::jsonb,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.accelerator_milestones OWNER TO neondb_owner;

--
-- Name: achievements; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.achievements (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    achievement_key character varying NOT NULL,
    unlocked_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.achievements OWNER TO neondb_owner;

--
-- Name: ai_usage; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.ai_usage (
    id integer NOT NULL,
    user_id character varying(255),
    prompt_type character varying(50) NOT NULL,
    prompt_version character varying(10) NOT NULL,
    model character varying(50) NOT NULL,
    prompt_tokens integer NOT NULL,
    completion_tokens integer NOT NULL,
    total_tokens integer NOT NULL,
    cached boolean DEFAULT false,
    latency_ms integer,
    cost numeric(10,6),
    success boolean DEFAULT true,
    error_message text,
    "timestamp" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.ai_usage OWNER TO neondb_owner;

--
-- Name: ai_usage_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.ai_usage_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ai_usage_id_seq OWNER TO neondb_owner;

--
-- Name: ai_usage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.ai_usage_id_seq OWNED BY public.ai_usage.id;


--
-- Name: app_atelier_usage; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.app_atelier_usage (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    message_count integer DEFAULT 0 NOT NULL,
    last_message_at timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.app_atelier_usage OWNER TO neondb_owner;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.audit_logs (
    id character varying(255) NOT NULL,
    user_id character varying(255),
    action character varying(100) NOT NULL,
    resource_type character varying(50) NOT NULL,
    resource_id character varying(255) NOT NULL,
    metadata jsonb,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO neondb_owner;

--
-- Name: cohort_capacity; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.cohort_capacity (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    cohort_name character varying NOT NULL,
    total_spots integer DEFAULT 10 NOT NULL,
    taken_spots integer DEFAULT 0 NOT NULL,
    next_cohort_date timestamp without time zone,
    is_active boolean DEFAULT true NOT NULL,
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.cohort_capacity OWNER TO neondb_owner;

--
-- Name: companion_activities; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.companion_activities (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    activity_type character varying NOT NULL,
    stat_changed character varying NOT NULL,
    points_gained integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.companion_activities OWNER TO neondb_owner;

--
-- Name: companions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.companions (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    name character varying DEFAULT 'Muse'::character varying NOT NULL,
    stage character varying DEFAULT 'seedling'::character varying NOT NULL,
    current_mood character varying DEFAULT 'curious'::character varying,
    growth integer DEFAULT 0 NOT NULL,
    inspiration integer DEFAULT 0 NOT NULL,
    connection integer DEFAULT 0 NOT NULL,
    mastery integer DEFAULT 0 NOT NULL,
    last_fed timestamp without time zone,
    last_played timestamp without time zone,
    last_socialized timestamp without time zone,
    unlocked_accessories jsonb DEFAULT '[]'::jsonb,
    equipped_accessories jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.companions OWNER TO neondb_owner;

--
-- Name: direct_messages; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.direct_messages (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    sender_id character varying NOT NULL,
    recipient_id character varying NOT NULL,
    message text NOT NULL,
    read boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.direct_messages OWNER TO neondb_owner;

--
-- Name: email_leads; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.email_leads (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    email character varying NOT NULL,
    source character varying DEFAULT 'email_capture_modal'::character varying,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.email_leads OWNER TO neondb_owner;

--
-- Name: experience_progress; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.experience_progress (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    experience_id character varying NOT NULL,
    completed_sections jsonb DEFAULT '[]'::jsonb NOT NULL,
    personalization_answers jsonb,
    personalized_content jsonb,
    started_at timestamp without time zone DEFAULT now(),
    completed_at timestamp without time zone,
    last_updated timestamp without time zone DEFAULT now(),
    confidence_score integer,
    business_impact text,
    milestones_achieved jsonb DEFAULT '[]'::jsonb
);


ALTER TABLE public.experience_progress OWNER TO neondb_owner;

--
-- Name: experience_sections; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.experience_sections (
    id integer NOT NULL,
    experience_id character varying NOT NULL,
    type character varying(50) NOT NULL,
    title text NOT NULL,
    content text,
    metadata jsonb,
    sort_order integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.experience_sections OWNER TO neondb_owner;

--
-- Name: experience_sections_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.experience_sections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.experience_sections_id_seq OWNER TO neondb_owner;

--
-- Name: experience_sections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.experience_sections_id_seq OWNED BY public.experience_sections.id;


--
-- Name: founder_insights; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.founder_insights (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title character varying NOT NULL,
    content text NOT NULL,
    insight_type character varying DEFAULT 'voice_note'::character varying NOT NULL,
    audio_url character varying,
    video_url character varying,
    min_tier_required character varying DEFAULT 'inner_circle'::character varying NOT NULL,
    is_published boolean DEFAULT true NOT NULL,
    published_at timestamp without time zone DEFAULT now(),
    view_count integer DEFAULT 0 NOT NULL,
    like_count integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.founder_insights OWNER TO neondb_owner;

--
-- Name: glow_up_journal; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.glow_up_journal (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    day integer NOT NULL,
    gpt_response text,
    public_post_draft text,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.glow_up_journal OWNER TO neondb_owner;

--
-- Name: glow_up_profiles; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.glow_up_profiles (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    name character varying NOT NULL,
    brand_type character varying NOT NULL,
    niche text NOT NULL,
    platform character varying NOT NULL,
    goal character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.glow_up_profiles OWNER TO neondb_owner;

--
-- Name: glow_up_progress; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.glow_up_progress (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    completed_days jsonb DEFAULT '[]'::jsonb NOT NULL,
    current_day integer DEFAULT 1 NOT NULL,
    started_at timestamp without time zone DEFAULT now(),
    completed_at timestamp without time zone,
    last_updated timestamp without time zone DEFAULT now()
);


ALTER TABLE public.glow_up_progress OWNER TO neondb_owner;

--
-- Name: group_sessions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.group_sessions (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title character varying NOT NULL,
    description text,
    session_type character varying DEFAULT 'sanctuary_monthly'::character varying NOT NULL,
    scheduled_date timestamp without time zone NOT NULL,
    duration integer DEFAULT 90 NOT NULL,
    max_capacity integer DEFAULT 30 NOT NULL,
    current_attendees integer DEFAULT 0 NOT NULL,
    zoom_link character varying,
    meeting_id character varying,
    status character varying DEFAULT 'scheduled'::character varying NOT NULL,
    recording_url character varying,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.group_sessions OWNER TO neondb_owner;

--
-- Name: insight_interactions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.insight_interactions (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    insight_id character varying NOT NULL,
    user_id character varying NOT NULL,
    has_viewed boolean DEFAULT false NOT NULL,
    has_liked boolean DEFAULT false NOT NULL,
    viewed_at timestamp without time zone,
    liked_at timestamp without time zone
);


ALTER TABLE public.insight_interactions OWNER TO neondb_owner;

--
-- Name: journal_entries; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.journal_entries (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    content text NOT NULL,
    streak integer DEFAULT 0 NOT NULL,
    last_saved timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now(),
    mood character varying,
    tags jsonb DEFAULT '[]'::jsonb,
    word_count integer DEFAULT 0 NOT NULL,
    ai_insights jsonb,
    ai_prompt text,
    structured_content jsonb,
    date character varying DEFAULT to_char(now(), 'YYYY-MM-DD'::text) NOT NULL
);


ALTER TABLE public.journal_entries OWNER TO neondb_owner;

--
-- Name: one_on_one_bookings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.one_on_one_bookings (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    booking_type character varying NOT NULL,
    scheduled_date timestamp without time zone NOT NULL,
    duration integer DEFAULT 30 NOT NULL,
    meeting_link character varying,
    status character varying DEFAULT 'scheduled'::character varying NOT NULL,
    agenda text,
    notes text,
    follow_up_actions jsonb DEFAULT '[]'::jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.one_on_one_bookings OWNER TO neondb_owner;

--
-- Name: opportunities; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.opportunities (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    poster_id character varying NOT NULL,
    title character varying NOT NULL,
    description text NOT NULL,
    type character varying NOT NULL,
    compensation character varying,
    featured boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.opportunities OWNER TO neondb_owner;

--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.password_reset_tokens (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    token character varying NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.password_reset_tokens OWNER TO neondb_owner;

--
-- Name: personalization_questions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.personalization_questions (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    experience_id character varying NOT NULL,
    question_text text NOT NULL,
    question_type character varying NOT NULL,
    options jsonb,
    sort_order integer NOT NULL,
    is_required boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.personalization_questions OWNER TO neondb_owner;

--
-- Name: profile_activity_feed; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.profile_activity_feed (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    profile_id character varying NOT NULL,
    activity_type character varying NOT NULL,
    title character varying NOT NULL,
    description text,
    visibility character varying DEFAULT 'public'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.profile_activity_feed OWNER TO neondb_owner;

--
-- Name: profile_services; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.profile_services (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    profile_id character varying NOT NULL,
    title character varying NOT NULL,
    description text NOT NULL,
    category character varying NOT NULL,
    rate character varying,
    featured boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.profile_services OWNER TO neondb_owner;

--
-- Name: profile_skills; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.profile_skills (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    profile_id character varying NOT NULL,
    skill_name character varying NOT NULL,
    proficiency character varying DEFAULT 'intermediate'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.profile_skills OWNER TO neondb_owner;

--
-- Name: quiz_submissions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.quiz_submissions (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying,
    name character varying NOT NULL,
    email character varying NOT NULL,
    answers jsonb NOT NULL,
    matched_ritual character varying NOT NULL,
    claimed boolean DEFAULT false NOT NULL,
    ritual_completed boolean DEFAULT false NOT NULL,
    one_on_one_booked boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.quiz_submissions OWNER TO neondb_owner;

--
-- Name: retro_camera_photos; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.retro_camera_photos (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    image_url text NOT NULL,
    filter_name character varying NOT NULL,
    caption text,
    like_count integer DEFAULT 0 NOT NULL,
    is_public boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.retro_camera_photos OWNER TO neondb_owner;

--
-- Name: ritual_progress; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.ritual_progress (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    ritual_slug character varying NOT NULL,
    completed_steps jsonb DEFAULT '[]'::jsonb NOT NULL,
    last_updated timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.ritual_progress OWNER TO neondb_owner;

--
-- Name: section_completions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.section_completions (
    id integer NOT NULL,
    user_id character varying NOT NULL,
    section_id integer NOT NULL,
    experience_id character varying NOT NULL,
    completed_at timestamp without time zone DEFAULT now() NOT NULL,
    time_spent_seconds integer,
    quiz_score integer
);


ALTER TABLE public.section_completions OWNER TO neondb_owner;

--
-- Name: section_completions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.section_completions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.section_completions_id_seq OWNER TO neondb_owner;

--
-- Name: section_completions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.section_completions_id_seq OWNED BY public.section_completions.id;


--
-- Name: section_resources; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.section_resources (
    id integer NOT NULL,
    section_id integer NOT NULL,
    type character varying(50) NOT NULL,
    title text NOT NULL,
    url text,
    metadata jsonb,
    sort_order integer NOT NULL
);


ALTER TABLE public.section_resources OWNER TO neondb_owner;

--
-- Name: section_resources_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.section_resources_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.section_resources_id_seq OWNER TO neondb_owner;

--
-- Name: section_resources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.section_resources_id_seq OWNED BY public.section_resources.id;


--
-- Name: session_registrations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.session_registrations (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    session_id character varying NOT NULL,
    user_id character varying NOT NULL,
    status character varying DEFAULT 'registered'::character varying NOT NULL,
    registered_at timestamp without time zone DEFAULT now(),
    cancelled_at timestamp without time zone
);


ALTER TABLE public.session_registrations OWNER TO neondb_owner;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess jsonb NOT NULL,
    expire timestamp without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO neondb_owner;

--
-- Name: skills_trades; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.skills_trades (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    profile_id character varying NOT NULL,
    having_skill character varying NOT NULL,
    wanting_skill character varying NOT NULL,
    description text,
    status character varying DEFAULT 'active'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.skills_trades OWNER TO neondb_owner;

--
-- Name: spaces; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.spaces (
    id character varying NOT NULL,
    name character varying NOT NULL,
    slug character varying NOT NULL,
    description text NOT NULL,
    icon character varying NOT NULL,
    color character varying NOT NULL,
    sort_order integer NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.spaces OWNER TO neondb_owner;

--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.subscriptions (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    stripe_customer_id character varying,
    stripe_subscription_id character varying,
    stripe_price_id character varying,
    status character varying NOT NULL,
    current_period_end timestamp without time zone,
    cancel_at_period_end boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    stripe_payment_intent_id character varying,
    payment_type character varying DEFAULT 'subscription'::character varying NOT NULL,
    tier character varying DEFAULT 'pro_monthly'::character varying NOT NULL
);


ALTER TABLE public.subscriptions OWNER TO neondb_owner;

--
-- Name: thought_leadership_posts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.thought_leadership_posts (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    day_number integer NOT NULL,
    topic text NOT NULL,
    content_long text NOT NULL,
    content_medium text NOT NULL,
    content_short text NOT NULL,
    status character varying DEFAULT 'draft'::character varying NOT NULL,
    published_to_metahers boolean DEFAULT false NOT NULL,
    published_to_external boolean DEFAULT false NOT NULL,
    external_platforms jsonb DEFAULT '[]'::jsonb,
    is_public boolean DEFAULT false NOT NULL,
    slug character varying,
    view_count integer DEFAULT 0 NOT NULL,
    like_count integer DEFAULT 0 NOT NULL,
    comment_count integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    published_at timestamp without time zone,
    updated_at timestamp without time zone DEFAULT now(),
    daily_story text
);


ALTER TABLE public.thought_leadership_posts OWNER TO neondb_owner;

--
-- Name: thought_leadership_progress; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.thought_leadership_progress (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    current_day integer DEFAULT 1 NOT NULL,
    completed_days jsonb DEFAULT '[]'::jsonb NOT NULL,
    current_streak integer DEFAULT 0 NOT NULL,
    longest_streak integer DEFAULT 0 NOT NULL,
    total_posts_generated integer DEFAULT 0 NOT NULL,
    total_posts_published integer DEFAULT 0 NOT NULL,
    last_activity_date character varying,
    journey_status character varying DEFAULT 'active'::character varying NOT NULL,
    started_at timestamp without time zone DEFAULT now(),
    completed_at timestamp without time zone,
    updated_at timestamp without time zone DEFAULT now(),
    brand_expertise text,
    brand_niche text,
    problem_solved text,
    unique_story text,
    current_goals text,
    brand_onboarding_completed boolean DEFAULT false NOT NULL,
    lessons_completed jsonb DEFAULT '[]'::jsonb NOT NULL,
    practices_submitted jsonb DEFAULT '[]'::jsonb NOT NULL,
    practice_reflections jsonb DEFAULT '{}'::jsonb NOT NULL
);


ALTER TABLE public.thought_leadership_progress OWNER TO neondb_owner;

--
-- Name: transformational_experiences; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.transformational_experiences (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    space_id character varying NOT NULL,
    title character varying NOT NULL,
    slug character varying NOT NULL,
    description text NOT NULL,
    learning_objectives jsonb NOT NULL,
    tier character varying DEFAULT 'free'::character varying NOT NULL,
    estimated_minutes integer NOT NULL,
    sort_order integer NOT NULL,
    content jsonb NOT NULL,
    personalization_enabled boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.transformational_experiences OWNER TO neondb_owner;

--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    email character varying NOT NULL,
    first_name character varying,
    last_name character varying,
    is_pro boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    onboarding_completed boolean DEFAULT false NOT NULL,
    password_hash character varying NOT NULL,
    quiz_unlocked_ritual character varying,
    quiz_completed_at timestamp without time zone,
    subscription_tier character varying DEFAULT 'free'::character varying NOT NULL,
    stripe_customer_id character varying,
    stripe_subscription_id character varying
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: women_profiles; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.women_profiles (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    headline character varying,
    bio text,
    location character varying,
    profile_image character varying,
    visibility character varying DEFAULT 'public'::character varying NOT NULL,
    looking_for jsonb DEFAULT '[]'::jsonb,
    availability character varying DEFAULT 'active'::character varying NOT NULL,
    verified_member boolean DEFAULT false NOT NULL,
    completion_percentage integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.women_profiles OWNER TO neondb_owner;

--
-- Name: replit_database_migrations_v1 id; Type: DEFAULT; Schema: _system; Owner: neondb_owner
--

ALTER TABLE ONLY _system.replit_database_migrations_v1 ALTER COLUMN id SET DEFAULT nextval('_system.replit_database_migrations_v1_id_seq'::regclass);


--
-- Name: ai_usage id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ai_usage ALTER COLUMN id SET DEFAULT nextval('public.ai_usage_id_seq'::regclass);


--
-- Name: experience_sections id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.experience_sections ALTER COLUMN id SET DEFAULT nextval('public.experience_sections_id_seq'::regclass);


--
-- Name: section_completions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.section_completions ALTER COLUMN id SET DEFAULT nextval('public.section_completions_id_seq'::regclass);


--
-- Name: section_resources id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.section_resources ALTER COLUMN id SET DEFAULT nextval('public.section_resources_id_seq'::regclass);


--
-- Data for Name: replit_database_migrations_v1; Type: TABLE DATA; Schema: _system; Owner: neondb_owner
--

COPY _system.replit_database_migrations_v1 (id, build_id, deployment_id, statement_count, applied_at) FROM stdin;
1	bbea4041-f310-4348-8467-f648e98e4ee0	177bab6c-95c2-45d4-ab8d-c4edf19a813b	10	2025-10-19 20:20:04.682269+00
2	933cdbce-b5e1-436c-93f5-aaaf6128e075	177bab6c-95c2-45d4-ab8d-c4edf19a813b	5	2025-10-20 00:04:39.199339+00
3	023145bb-603a-43c0-a267-17c9af176fef	177bab6c-95c2-45d4-ab8d-c4edf19a813b	1	2025-10-20 17:32:53.444288+00
4	2d70c3b2-5dd6-43e4-98bd-3c66e665d5e1	177bab6c-95c2-45d4-ab8d-c4edf19a813b	2	2025-10-20 18:39:52.424267+00
5	942092c4-112f-4b86-8c61-2e6fbb1c2383	177bab6c-95c2-45d4-ab8d-c4edf19a813b	15	2025-10-24 00:23:55.975212+00
6	81675c2b-1093-40fc-a17e-29c7aa08020f	177bab6c-95c2-45d4-ab8d-c4edf19a813b	3	2025-10-24 04:27:24.09868+00
7	3f9173fd-60ad-4044-83eb-5bf4c6e1afee	177bab6c-95c2-45d4-ab8d-c4edf19a813b	7	2025-10-25 04:40:09.824915+00
8	a39d24aa-e808-4a5b-9822-79e033eaf3c9	177bab6c-95c2-45d4-ab8d-c4edf19a813b	4	2025-10-27 05:16:32.705546+00
9	3429ca99-4362-4a2f-84a4-7b88603e4682	177bab6c-95c2-45d4-ab8d-c4edf19a813b	2	2025-10-29 02:57:19.695305+00
10	c7252075-be4c-494d-911e-80853240b582	177bab6c-95c2-45d4-ab8d-c4edf19a813b	12	2025-10-30 00:35:58.74734+00
11	5f413eb0-e453-4450-aeb7-d041b09859cd	177bab6c-95c2-45d4-ab8d-c4edf19a813b	7	2025-10-30 14:47:34.240134+00
12	e9d3054a-77cf-4a49-a170-084b924debf3	177bab6c-95c2-45d4-ab8d-c4edf19a813b	3	2025-10-30 17:11:58.203024+00
13	bf3db136-5233-467e-b4cb-bb1dd7822f7e	177bab6c-95c2-45d4-ab8d-c4edf19a813b	24	2025-11-01 04:01:44.104918+00
14	84cc334a-63d0-4c03-a159-59e2da98924b	177bab6c-95c2-45d4-ab8d-c4edf19a813b	16	2025-11-03 03:45:38.771781+00
15	4be472f0-bf46-4d57-8e92-962d9e5b5bd5	177bab6c-95c2-45d4-ab8d-c4edf19a813b	3	2025-11-07 02:21:06.001645+00
16	a96db834-8f7f-414b-9c0b-99532564d32d	177bab6c-95c2-45d4-ab8d-c4edf19a813b	19	2025-11-07 03:54:13.299907+00
17	c4aea699-62b4-4ac3-9604-14d05d7b7de4	177bab6c-95c2-45d4-ab8d-c4edf19a813b	63	2025-11-22 01:47:27.865726+00
\.


--
-- Data for Name: accelerator_cohorts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.accelerator_cohorts (id, name, start_date, end_date, application_deadline, max_participants, current_participants, price, status, description, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: accelerator_enrollments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.accelerator_enrollments (id, user_id, cohort_id, status, application_data, paid_at, completed_at, milestones_completed, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: accelerator_milestone_progress; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.accelerator_milestone_progress (id, milestone_id, status, progress, notes, completed_at, started_at, created_at, updated_at, enrollment_id) FROM stdin;
\.


--
-- Data for Name: accelerator_milestones; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.accelerator_milestones (id, title, description, stage, week_start, week_end, "order", resources, required_for, created_at) FROM stdin;
\.


--
-- Data for Name: achievements; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.achievements (id, user_id, achievement_key, unlocked_at) FROM stdin;
9404fd92-07a1-450c-ac57-dc42187a3e3d	5c7d757c-297b-4a84-978e-814855be88c5	first_entry	2025-10-20 17:39:26.135885
4cc8c200-fd70-4a90-b752-8327ebea0093	5c7d757c-297b-4a84-978e-814855be88c5	consistent_writer	2025-11-13 02:49:43.330731
\.


--
-- Data for Name: ai_usage; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.ai_usage (id, user_id, prompt_type, prompt_version, model, prompt_tokens, completion_tokens, total_tokens, cached, latency_ms, cost, success, error_message, "timestamp") FROM stdin;
\.


--
-- Data for Name: app_atelier_usage; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.app_atelier_usage (id, user_id, message_count, last_message_at, created_at) FROM stdin;
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.audit_logs (id, user_id, action, resource_type, resource_id, metadata, created_at) FROM stdin;
\.


--
-- Data for Name: cohort_capacity; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.cohort_capacity (id, cohort_name, total_spots, taken_spots, next_cohort_date, is_active, updated_at) FROM stdin;
\.


--
-- Data for Name: companion_activities; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.companion_activities (id, user_id, activity_type, stat_changed, points_gained, created_at) FROM stdin;
18dfa14e-a902-465b-9561-cb7f57a07204	f1e9a5f7-8d05-4f62-84bb-eb29bb99e247	socialize	connection	5	2025-11-14 02:31:53.064614
9cfce9e1-ddec-4c73-8bf7-79154776f88b	f1e9a5f7-8d05-4f62-84bb-eb29bb99e247	learn	growth	8	2025-11-14 02:31:55.853477
a9974982-fde2-4544-81d0-cf7ec16ae0b1	f1e9a5f7-8d05-4f62-84bb-eb29bb99e247	journal	inspiration	5	2025-11-14 02:31:57.534026
\.


--
-- Data for Name: companions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.companions (id, user_id, name, stage, current_mood, growth, inspiration, connection, mastery, last_fed, last_played, last_socialized, unlocked_accessories, equipped_accessories, created_at, updated_at) FROM stdin;
10897381-3d88-4a50-87f2-f9e31ce409ce	f1e9a5f7-8d05-4f62-84bb-eb29bb99e247	Muse	seedling	curious	5	5	5	3	2025-11-14 02:31:57.5	2025-11-14 02:31:55.819	2025-11-14 02:31:53.018	[]	{}	2025-11-08 01:28:35.955265	2025-11-14 02:31:57.5
\.


--
-- Data for Name: direct_messages; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.direct_messages (id, sender_id, recipient_id, message, read, created_at) FROM stdin;
\.


--
-- Data for Name: email_leads; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.email_leads (id, email, source, created_at) FROM stdin;
\.


--
-- Data for Name: experience_progress; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.experience_progress (id, user_id, experience_id, completed_sections, personalization_answers, personalized_content, started_at, completed_at, last_updated, confidence_score, business_impact, milestones_achieved) FROM stdin;
debe2260-3a96-42c3-a829-1070875b0f0a	5c7d757c-297b-4a84-978e-814855be88c5	ai-1-foundations	["ai-intro"]	\N	\N	2025-11-13 02:32:25.445167	2025-11-13 02:32:25.434	2025-11-13 02:32:25.445167	\N	\N	[]
08a2205f-5b77-4eab-8a71-7b6a01279f65	f1e9a5f7-8d05-4f62-84bb-eb29bb99e247	web3-1-foundations	["what-is-web3"]	\N	\N	2025-11-13 16:31:07.010464	\N	2025-11-13 16:31:07.010464	\N	\N	[]
71527d6c-0795-4bdf-aee4-c23753485219	f1e9a5f7-8d05-4f62-84bb-eb29bb99e247	branding-1-strategy	["branding-intro"]	\N	\N	2025-11-13 21:20:40.901474	2025-11-13 21:20:40.886	2025-11-13 21:20:40.901474	\N	\N	[]
30ec3cbe-54a0-414f-b781-5e97e13bfacd	f1e9a5f7-8d05-4f62-84bb-eb29bb99e247	crypto-1-foundations	["blockchain-intro"]	\N	\N	2025-11-14 03:42:38.190671	2025-11-14 03:42:38.179	2025-11-14 03:42:38.190671	\N	\N	[]
\.


--
-- Data for Name: experience_sections; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.experience_sections (id, experience_id, type, title, content, metadata, sort_order, created_at) FROM stdin;
\.


--
-- Data for Name: founder_insights; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.founder_insights (id, title, content, insight_type, audio_url, video_url, min_tier_required, is_published, published_at, view_count, like_count, created_at) FROM stdin;
\.


--
-- Data for Name: glow_up_journal; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.glow_up_journal (id, user_id, day, gpt_response, public_post_draft, notes, created_at, updated_at) FROM stdin;
11814f09-3fcc-4382-8a98-a50cbb6c29c6	b44cda71-8852-4d29-b0a4-4af0017b0298	1	Growing up between cultures and creativity, I always believed stories could bridge worlds. When I became a mother, that belief came alive in a new way. Watching my son Dylan’s endless curiosity — his questions about stars, numbers, and how the world works — awakened something in me. I realized how powerful stories can be when they reflect the wonder of a child’s mind. I didn’t want just another book on the shelf; I wanted stories that spoke to him, not at him — stories where learning felt like magic and where every child could see themselves as the hero. That’s how my journey into creating personalized, educational kids’ books began.\n\nMy mission is to spark that same light in other families — to transform reading from a passive activity into a shared adventure of discovery, laughter, and connection. Through imaginative storytelling, vivid visuals, and real-life curiosity, I want to help parents nurture confidence and creativity in their children. Each book I create is designed not just to entertain, but to inspire questions, deepen bonds, and celebrate the beauty of learning together.\n\nThis work matters deeply to me because it blends everything I love: motherhood, imagination, and impact. Every time I see Dylan’s eyes light up when he recognizes himself in a story, I’m reminded why I do this — for the children who dream big, for the parents who want to nurture that spark, and for the belief that learning can be joyful, personal, and full of wonder. My books are my way of saying to every child: you matter, your story matters, and the world is brighter because you’re in it.	Day 1 of my AI Glow-Up ✨ I’m sharing the truth about why I started.\nIt began with my son Dylan asking questions that lit up our days — about stars, numbers, and everything in between. Those little moments made me realize how stories could become bridges — between curiosity and learning, between kids and parents.\nSo I started building books that make learning feel like magic. And that’s what this brand is all about.	\N	2025-10-24 04:06:22.105186	2025-10-24 04:06:22.105186
403c1b73-91da-449b-acd1-ebb1141a4aff	5c7d757c-297b-4a84-978e-814855be88c5	3	**1. Bold & Confident**\n*Sample caption:*\nA new week means a new chance to take the lead. Stop waiting for permission—your power is already in your hands. Make the decision, take the step, and build the life you keep thinking about. Women who move with conviction change everything. Let’s begin.\n\n---\n\n**2. Warm & Nurturing**\n*Sample caption:*\nA new week is a gentle reminder that you don’t have to rush—you just have to show up for yourself. Breathe, reset, and choose one thing that will move you forward with love. You’re growing beautifully, and you’re not doing it alone. I’m right here with you.\n\n---\n\n**3. Luxurious & Aspirational**\n*Sample caption:*\nStep into this week like a woman who knows her future is premium. Slow mornings, aligned goals, elevated energy. Every choice you make is an investment in your evolution. Rise with intention and let your power feel opulent.\n\n---\n\n### Which Voice Fits You Best\n\nYour personality and brand lean toward **Luxurious & Aspirational** combined with elements of **Bold & Confident**.\n\nYou position women’s empowerment as *high-fashion, high-frequency, futuristic, feminine*, and rooted in *elevation*—not hustle culture. Your visuals, rituals, MetaHers Mind Spa concept, and AI guidance all reflect an elevated, refined, editorial feeling. Your audience resonates with empowerment that feels **exclusive, visionary, and transformative**, not soft or overly nurturing.\n\nSo your best fit is:\n**Primary Voice: Luxurious & Aspirational**\n**Secondary Support: Bold & Confident**\n\nThis combination captures your leadership energy, your creative vision, your aesthetic, and your mission to elevate women into the digital future with style and power.\n	\N	\N	2025-11-13 02:47:52.766042	2025-11-13 02:47:52.766042
\.


--
-- Data for Name: glow_up_profiles; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.glow_up_profiles (id, user_id, name, brand_type, niche, platform, goal, created_at, updated_at) FROM stdin;
0f2fdad4-6f60-4c14-8d03-1843b1b8b65e	5c7d757c-297b-4a84-978e-814855be88c5	Nadia	personal	Women empowerment	Instagram	new	2025-10-24 00:34:54.794319	2025-10-24 00:34:54.794319
823d6551-0fae-41fc-927f-c4aeca5714e2	b44cda71-8852-4d29-b0a4-4af0017b0298	Salma Mathlouthi	personal	Kids book	TikTok	new	2025-10-24 03:46:25.250617	2025-10-24 03:46:25.250617
24ff6e44-2733-47d5-866b-2a6a12f74464	2201893e-c248-40b2-95d3-3278cfa2de25	Yassine 	business	Organic Mediterranean dips and yogurt sold in farmers market   	Instagram	rebrand	2025-10-25 04:15:14.514718	2025-10-25 04:15:14.514718
2a914158-848b-4a10-b383-7ae24c7758c7	9a770e1c-268e-4d4c-9fdd-7f73ee91ad5f	Rabiaa 	business	Avocate  a la cour de cassation 	LinkedIn	rebrand	2025-10-27 20:36:47.447331	2025-10-27 20:36:47.447331
69f3416e-4d7d-4617-ba06-7901215ed2cb	e8e7d006-1890-465c-ab3f-4485d5d52e0d	Emna C	personal	support and advice in tech	X	new	2025-11-07 15:46:59.181778	2025-11-07 15:46:59.181778
\.


--
-- Data for Name: glow_up_progress; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.glow_up_progress (id, user_id, completed_days, current_day, started_at, completed_at, last_updated) FROM stdin;
470510dc-689a-40f1-b3ae-ff442457b405	2201893e-c248-40b2-95d3-3278cfa2de25	[]	1	2025-10-25 04:15:14.649665	\N	2025-10-25 04:15:14.649665
e1e55cb9-8e6d-44b5-b0a1-cd95b34d5bd0	b44cda71-8852-4d29-b0a4-4af0017b0298	[1, 2]	3	2025-10-24 03:46:25.334668	\N	2025-10-27 09:06:17.186
378d168f-d8b3-42c8-9e12-2852ce303f82	9a770e1c-268e-4d4c-9fdd-7f73ee91ad5f	[]	1	2025-10-27 20:36:47.534421	\N	2025-10-27 20:36:47.534421
e7d31b05-4fe0-47a1-a745-24024216141b	e8e7d006-1890-465c-ab3f-4485d5d52e0d	[1]	2	2025-11-07 15:46:59.279283	\N	2025-11-07 16:09:56.605
cd2553e7-fc7d-43cf-851d-5b85b2c1fb3f	5c7d757c-297b-4a84-978e-814855be88c5	[1, 2, 3]	4	2025-10-24 00:34:54.878998	\N	2025-11-13 02:47:53.72
\.


--
-- Data for Name: group_sessions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.group_sessions (id, title, description, session_type, scheduled_date, duration, max_capacity, current_attendees, zoom_link, meeting_id, status, recording_url, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: insight_interactions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.insight_interactions (id, insight_id, user_id, has_viewed, has_liked, viewed_at, liked_at) FROM stdin;
\.


--
-- Data for Name: journal_entries; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.journal_entries (id, user_id, content, streak, last_saved, created_at, mood, tags, word_count, ai_insights, ai_prompt, structured_content, date) FROM stdin;
1f1c050a-7130-4a79-8d87-74136257139e	5c7d757c-297b-4a84-978e-814855be88c5		0	2025-10-24 05:51:20.707	2025-10-23 19:23:59.114104	inspired	[]	0	\N	\N	{"wins": ["metahers app"], "todos": [], "events": [{"id": "1761283134481", "time": "17:30", "title": "metahers"}], "gratitude": ["Life"], "waterIntake": 5, "fitnessGoals": "", "freeformNotes": "today I kept code vibing developing metahers APP after watching aws transform seminar about their AI agents how they can handle millions of data and codes on their own in short time doing full migration, data analysis, for 70% of fortune 500 companies.\\n", "fitnessTracking": "Rest day"}	2025-10-23
5633e784-e661-4396-b555-ea028a11ee25	5c7d757c-297b-4a84-978e-814855be88c5		0	2025-11-03 23:01:20.110581	2025-11-03 23:01:20.110581		[]	0	\N	\N	{"wins": [], "todos": [{"id": "1762210877666", "text": "Metahers", "completed": false}], "events": [], "gratitude": [], "waterIntake": 0, "fitnessGoals": "", "freeformNotes": "", "fitnessTracking": ""}	2025-11-03
6c5df6a8-ca88-4edd-967c-7db32fe6412d	5c7d757c-297b-4a84-978e-814855be88c5		0	2025-10-24 20:25:23.01	2025-10-24 00:27:20.828448	happy	[]	0	\N	\N	{"wins": ["MetaHers app"], "todos": [{"id": "1761337456914", "text": "MetaHers App", "completed": false}], "events": [{"id": "1761337493889", "time": "14:30", "title": "Naya pick up"}], "gratitude": ["Life"], "waterIntake": 4, "fitnessGoals": "Rest day", "freeformNotes": "today I kept code vibing developing metahers APP after watching aws transform seminar about their AI agents how they can handle millions of data and codes on their own in short time doing full migration, data analysis, for 70% of fortune 500 companies.", "fitnessTracking": ""}	2025-10-24
ae61d40a-2dc9-46a5-b9f3-75d185fcd43d	5c7d757c-297b-4a84-978e-814855be88c5		0	2025-10-25 20:57:43.251767	2025-10-25 20:57:43.251767	happy	[]	0	\N	\N	{"wins": [], "todos": [], "events": [], "gratitude": [], "waterIntake": 0, "fitnessGoals": "", "freeformNotes": "", "fitnessTracking": ""}	2025-10-25
a9d79cb8-0b6f-4420-bdcb-ef89dc8fee1c	5c7d757c-297b-4a84-978e-814855be88c5		0	2025-10-21 19:29:00.56	2025-10-21 19:24:54.151433	\N	[]	0	\N	\N	{"wins": ["Ai"], "todos": [{"id": "1761074826196", "text": "Prep lunch", "completed": false}], "events": [{"id": "1761074853281", "time": "13:27", "notes": "", "title": "MetaHers"}], "gratitude": ["Life"], "reminders": ["Drink water"], "highlights": "", "waterIntake": 5, "fitnessGoals": "", "freeformNotes": "", "fitnessTracking": ""}	2025-10-21
020fe627-a5a9-4462-a1ed-0006b6c9a312	ff6043fd-c659-404e-aa9d-cd2a98deabe6		0	2025-10-26 19:21:40.782356	2025-10-26 19:21:40.782356	inspired	[]	0	\N	\N	{"wins": [], "todos": [], "events": [], "gratitude": [], "waterIntake": 0, "fitnessGoals": "", "freeformNotes": "", "fitnessTracking": ""}	2025-10-26
5321378b-68e3-47ac-821b-a39b051df8f1	5c7d757c-297b-4a84-978e-814855be88c5		0	2025-10-20 20:12:14.444	2025-10-20 17:37:30.942479	\N	[]	0	\N	\N	{"wins": ["metahers"], "todos": [{"id": "1760986410498", "text": "metahers", "completed": false}], "events": [{"id": "1760986414181", "notes": "", "title": "metahers"}], "gratitude": ["life"], "reminders": ["win"], "highlights": "grateful", "waterIntake": 3, "fitnessGoals": "", "freeformNotes": "", "fitnessTracking": ""}	2025-10-20
eb3c3847-8a82-487e-9b41-ab2c6218a381	33e5dd9e-c288-4e81-8e72-787c9977c165		0	2025-10-21 19:23:04.650366	2025-10-21 19:23:04.650366	\N	[]	0	\N	\N	{"wins": [], "todos": [], "events": [], "gratitude": [], "reminders": [], "highlights": "", "waterIntake": 0, "fitnessGoals": "", "freeformNotes": "", "fitnessTracking": ""}	2025-10-21
35c02a8d-bdc7-4981-8318-25c52edd9010	5c7d757c-297b-4a84-978e-814855be88c5		0	2025-10-29 19:10:34.3	2025-10-29 19:10:03.740373		[]	0	\N	\N	{"wins": ["AI"], "todos": [{"id": "1761765001248", "text": "MetaHers", "completed": true}], "events": [], "gratitude": ["Life"], "waterIntake": 3, "fitnessGoals": "", "freeformNotes": "", "fitnessTracking": ""}	2025-10-29
b0115337-20b2-4de0-9403-3868180e6b53	5c7d757c-297b-4a84-978e-814855be88c5		0	2025-10-27 05:23:48.94	2025-10-27 05:23:13.160568	inspired	[]	0	\N	\N	{"wins": [], "todos": [], "events": [], "gratitude": [], "waterIntake": 8, "fitnessGoals": "", "freeformNotes": "Taught Tunisians open mind community about MetaHers ", "fitnessTracking": ""}	2025-10-26
382d1c19-f16f-4227-8565-71a8a4dbe4c6	5c7d757c-297b-4a84-978e-814855be88c5		0	2025-11-08 21:08:03.492	2025-11-08 21:07:53.641475	\N	[]	0	\N	\N	{"wins": [], "todos": [{"id": "1762636071331", "text": "Ai", "completed": true}], "events": [], "gratitude": [], "waterIntake": 8, "fitnessGoals": "", "freeformNotes": "", "fitnessTracking": ""}	2025-11-08
71f44707-010d-41b4-afa3-f56487d643f5	b44cda71-8852-4d29-b0a4-4af0017b0298		0	2025-10-30 00:33:21.625	2025-10-30 00:33:08.073068	tired	[]	0	\N	\N	{"wins": [], "todos": [{"id": "1761784395122", "text": "Dylan", "completed": false}], "events": [], "gratitude": [], "waterIntake": 0, "fitnessGoals": "", "freeformNotes": "", "fitnessTracking": ""}	2025-10-29
48b4002e-c1e3-4c35-a7d3-165d1505c706	5c7d757c-297b-4a84-978e-814855be88c5		0	2025-11-02 23:59:55.998357	2025-11-02 23:59:55.998357	happy	[]	0	\N	\N	{"wins": [], "todos": [], "events": [], "gratitude": [], "waterIntake": 0, "fitnessGoals": "", "freeformNotes": "", "fitnessTracking": ""}	2025-11-02
5e33c19c-1cd7-4709-bec7-b0d53bc9b3b3	5c7d757c-297b-4a84-978e-814855be88c5		0	2025-11-13 02:49:26.863	2025-11-13 02:48:24.861895	happy	[]	0	\N	\N	{"wins": ["app progress"], "todos": [{"id": "1763002157122", "text": "kimi k2", "completed": false}], "events": [], "gratitude": ["life"], "waterIntake": 6, "fitnessGoals": "", "freeformNotes": "", "fitnessTracking": ""}	2025-11-12
\.


--
-- Data for Name: one_on_one_bookings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.one_on_one_bookings (id, user_id, booking_type, scheduled_date, duration, meeting_link, status, agenda, notes, follow_up_actions, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: opportunities; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.opportunities (id, poster_id, title, description, type, compensation, featured, created_at) FROM stdin;
\.


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.password_reset_tokens (id, user_id, token, expires_at, created_at) FROM stdin;
51a45e7b-56b6-49d4-89a8-ae169017a4e1	a22f1ca1-bf8e-4f54-84d0-07d980d81c6e	4c6a2d4b4c45141f40690d4f5e1d91560272148a0cc9405dbadcabc0cf34f0cc	2025-10-30 19:05:19.285	2025-10-30 18:05:19.299549
68c44d7a-7317-485b-a224-1e0d6491dc94	5c7d757c-297b-4a84-978e-814855be88c5	0f36f60970c6fd89372555ab8014182ada059353dca737b3da2e1d5680bb813f	2025-10-30 22:42:25.32	2025-10-30 21:42:25.335202
0a2d0994-2a30-4a5e-83ec-d01f99fa68bf	b44cda71-8852-4d29-b0a4-4af0017b0298	922df79472f88c05bc8783d3087ba0837c2f18874f33ed800612d807d8e678b8	2025-11-14 02:14:18.835	2025-11-14 01:14:18.847861
\.


--
-- Data for Name: personalization_questions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.personalization_questions (id, experience_id, question_text, question_type, options, sort_order, is_required, created_at) FROM stdin;
\.


--
-- Data for Name: profile_activity_feed; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.profile_activity_feed (id, profile_id, activity_type, title, description, visibility, created_at) FROM stdin;
\.


--
-- Data for Name: profile_services; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.profile_services (id, profile_id, title, description, category, rate, featured, created_at) FROM stdin;
\.


--
-- Data for Name: profile_skills; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.profile_skills (id, profile_id, skill_name, proficiency, created_at) FROM stdin;
\.


--
-- Data for Name: quiz_submissions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.quiz_submissions (id, user_id, name, email, answers, matched_ritual, claimed, ritual_completed, one_on_one_booked, created_at) FROM stdin;
f46004c1-9a62-4490-a568-68f3235b7d2f	5c7d757c-297b-4a84-978e-814855be88c5	nadia maazaoui	nadia.maazaoui@hotmail.com	{"q1": "advanced", "q2": "creating", "q3": "creative", "q4": "build", "q5": "architect"}	metaverse-meditation	t	f	f	2025-10-25 04:50:23.301325
1a8fd263-33b7-4b85-b7d2-2d34ed1c1b1d	5c7d757c-297b-4a84-978e-814855be88c5	nadia maazaoui	nadia.maazaoui@hotmail.com	{"q1": "learning", "q2": "foundation", "q3": "handson", "q4": "invest", "q5": "innovator"}	blockchain-detox-ritual	t	f	f	2025-10-25 15:35:52.697834
2145c019-ce14-4c7f-8638-39ef05e44ab0	5c7d757c-297b-4a84-978e-814855be88c5	nadia maazaoui	nadia.maazaoui@hotmail.com	{"q1": "beginner", "q2": "finance", "q3": "handson", "q4": "invest", "q5": "innovator"}	crypto-confidence-bath	t	f	f	2025-10-27 19:56:21.301715
ccacc23c-51c9-4f82-853c-0c9b43c7f1b5	\N	salma	salmagharbi97@gmail.com	{"q1": "learning", "q2": "creating", "q3": "conceptual", "q4": "productivity", "q5": "architect"}	ai-glow-up-facial	f	f	f	2025-11-01 22:37:26.347881
\.


--
-- Data for Name: retro_camera_photos; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.retro_camera_photos (id, user_id, image_url, filter_name, caption, like_count, is_public, created_at) FROM stdin;
\.


--
-- Data for Name: ritual_progress; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.ritual_progress (id, user_id, ritual_slug, completed_steps, last_updated, created_at) FROM stdin;
a36aef36-eb23-4609-a95e-e4328044b343	a22f1ca1-bf8e-4f54-84d0-07d980d81c6e	ai-glow-up-facial	[]	2025-10-20 00:06:39.131	2025-10-20 00:06:38.373503
0757a84c-d451-4240-9149-453ddfc2fe04	02456fd9-27f7-4699-94c1-b035fb00acb6	ai-glow-up-facial	[1, 0]	2025-10-20 01:04:18.347	2025-10-20 01:04:02.151912
68dd09c2-64cf-41c2-bedb-bf40da302f9b	e8e7d006-1890-465c-ab3f-4485d5d52e0d	ai-glow-up-facial	[]	2025-10-24 02:19:11.149	2025-10-24 02:19:09.718374
f6cce719-1230-409b-bfd2-f7a30a0d287b	5c7d757c-297b-4a84-978e-814855be88c5	metaverse-meditation	[]	2025-10-25 04:50:56.373	2025-10-25 04:50:55.197748
6e188189-c72d-4ef9-8f49-e7496329030b	5c7d757c-297b-4a84-978e-814855be88c5	blockchain-detox-ritual	[]	2025-10-25 15:36:40.382	2025-10-25 15:36:39.574135
247370d0-e220-4651-8a69-1ce2d4d8391d	994ac7fe-a41b-4241-907c-83474f5c5dad	ai-glow-up-facial	[]	2025-11-01 22:41:53.934	2025-11-01 22:41:50.910588
\.


--
-- Data for Name: section_completions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.section_completions (id, user_id, section_id, experience_id, completed_at, time_spent_seconds, quiz_score) FROM stdin;
\.


--
-- Data for Name: section_resources; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.section_resources (id, section_id, type, title, url, metadata, sort_order) FROM stdin;
\.


--
-- Data for Name: session_registrations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.session_registrations (id, session_id, user_id, status, registered_at, cancelled_at) FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.sessions (sid, sess, expire) FROM stdin;
2N54PmO_KtTuQA2vj-Lv78R6WsXspfHD	{"cookie": {"path": "/", "secure": true, "expires": "2025-11-19T18:49:03.909Z", "httpOnly": true, "sameSite": "strict", "originalMaxAge": 86400000}, "userId": "f1e9a5f7-8d05-4f62-84bb-eb29bb99e247"}	2025-11-19 18:55:23
zW0Y0KxkSThDslMruErDipzySN_WDw42	{"cookie": {"path": "/", "secure": true, "expires": "2025-11-18T21:38:30.718Z", "httpOnly": true, "sameSite": "strict", "originalMaxAge": 86400000}, "userId": "f1e9a5f7-8d05-4f62-84bb-eb29bb99e247"}	2025-11-19 21:52:04
\.


--
-- Data for Name: skills_trades; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.skills_trades (id, profile_id, having_skill, wanting_skill, description, status, created_at) FROM stdin;
\.


--
-- Data for Name: spaces; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.spaces (id, name, slug, description, icon, color, sort_order, is_active, created_at, updated_at) FROM stdin;
web3	Web3	web3	Master decentralized technologies and understand the future of the internet. Build your Web3 fluency from fundamentals to real-world applications.	Globe	hyper-violet	1	t	2025-11-06 03:19:01.731421	2025-11-15 20:54:34.016098
crypto	NFT/Blockchain/Crypto	crypto	Navigate the world of digital assets with confidence. From NFTs to blockchain basics to cryptocurrency trading—understand it all and leverage it for your future.	Coins	magenta-quartz	2	t	2025-11-06 03:19:01.762072	2025-11-15 20:54:34.052288
ai	AI	ai	Transform how you work with AI tools. From custom GPTs to AI-powered content creation, become fluent in the language of artificial intelligence.	Sparkles	cyber-fuchsia	3	t	2025-11-06 03:19:01.785287	2025-11-15 20:54:34.074306
metaverse	Metaverse	metaverse	Navigate virtual worlds with confidence. Discover opportunities in immersive digital spaces and build your presence in the metaverse.	Boxes	aurora-teal	4	t	2025-11-06 03:19:01.807835	2025-11-15 20:54:34.103728
branding	Branding	branding	Build your personal and professional brand with AI-powered tools. Master content creation, community building, and thought leadership for the digital age.	Megaphone	liquid-gold	5	t	2025-11-06 03:19:01.853321	2025-11-15 20:54:34.125819
moms	Moms	moms	A dedicated space for mothers navigating tech careers and entrepreneurship. Balance, growth, and community for moms building in AI and Web3.	Heart	hyper-violet	6	t	2025-11-06 03:19:01.876026	2025-11-15 20:54:34.150016
app-atelier	App Atelier	app-atelier	Build apps with AI assistance. Turn your ideas into reality with AI-powered development tools and no-code solutions.	Code	aurora-teal	7	t	2025-11-07 04:39:40.152779	2025-11-15 20:54:34.173181
founders-club	Founder's Club	founders-club	The 12-week accelerator where women turn business ideas into reality using AI, no-code tools, and Web3 mindset. Personal mentorship, community support, and everything you need to launch.	Crown	cyber-fuchsia	8	t	2025-11-07 04:39:40.179514	2025-11-15 20:54:34.198482
digital-sales	Digital Boutique	digital-boutique	Launch your online store and start selling in 3 days. Master Shopify, Instagram Shopping, TikTok Shop, and automated marketing. Learn by DOING—not watching—in hands-on workshops where you build your e-commerce business in real-time.	ShoppingBag	liquid-gold	9	t	2025-11-10 18:21:58.252566	2025-11-15 20:54:34.221332
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.subscriptions (id, user_id, stripe_customer_id, stripe_subscription_id, stripe_price_id, status, current_period_end, cancel_at_period_end, created_at, updated_at, stripe_payment_intent_id, payment_type, tier) FROM stdin;
\.


--
-- Data for Name: thought_leadership_posts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.thought_leadership_posts (id, user_id, day_number, topic, content_long, content_medium, content_short, status, published_to_metahers, published_to_external, external_platforms, is_public, slug, view_count, like_count, comment_count, created_at, published_at, updated_at, daily_story) FROM stdin;
f23c0164-9e1b-44d3-863e-4889ad9d62f5	5c7d757c-297b-4a84-978e-814855be88c5	1	"Unlocking AI's Potential: How Web3 Revolutionizes Data Ownership"	# Unlocking AI's Potential: How Web3 Revolutionizes Data Ownership\n\n## Embracing the Future with a Personal Touch\n\nImagine a world where you own your personal data. Growing up, I've always believed in the power of technology to transform lives. My journey into the world of AI and Web3 was fueled by a desire to give power back to individuals—especially women—who often feel sidelined in tech discussions.\n\n## The Intersection of AI and Web3\n\nFast forward to today, Web3 and AI are redefining how we think about data ownership. These technologies offer the potential for individuals to regain control over their personal information, fostering a sense of autonomy and empowerment that was once a distant dream.\n\n### Insight 1: Empowering Individuals with True Ownership\n\nIn traditional models, data is often hoarded by tech giants, leaving little room for personal control. With Web3, the paradigm shifts towards decentralization, allowing individuals to claim ownership of their data. This transformation is particularly significant for women in tech, offering a platform to assert control and drive innovation.\n\n### Insight 2: Enhancing AI with Transparent Data\n\nWeb3 enhances AI capabilities by providing transparent and verifiable data sources. This transparency not only improves the accuracy of AI systems but also builds trust among users. As a woman leading in tech, I see this as a golden opportunity to create AI solutions that resonate with authenticity and integrity.\n\n### Insight 3: Fostering Collaboration and Innovation\n\nWeb3's decentralized nature fosters collaboration across borders, creating a vibrant ecosystem where ideas flourish. Women in tech can harness this collaborative spirit to spearhead innovative projects, further breaking down traditional barriers.\n\n## Actionable Takeaways\n\n1. **Embrace Decentralization**: Dive into platforms that support data ownership and explore how they can benefit your projects.\n2. **Prioritize Transparency**: Ensure AI solutions remain transparent to build user trust.\n3. **Collaborate Broadly**: Leverage the global nature of Web3 to collaborate on diverse projects.\n\n## Powerful Conclusion\n\nAs we stand on the cusp of a new digital era, the fusion of AI and Web3 presents unparalleled opportunities. By embracing these technologies, we can create a world where data ownership is democratized, and innovation knows no bounds. Let's lead this revolution with confidence, compassion, and creativity.\n\n**Join the conversation and share your stories of empowerment in the world of AI and Web3.**	Unlocking AI's potential doesn't just mean smarter algorithms; it means rethinking data ownership.\n\n🔍 Web3 introduces a revolutionary way of thinking, offering true data ownership—especially empowering for women in tech.\n\n🌐 Through decentralization, Web3 enables individuals to own their data, shifting power dynamics in a traditionally male-dominated industry.\n\n🤝 The synergy of AI and Web3 fosters collaboration and innovation, breaking down barriers and building trust.\n\nHow are you leveraging AI and Web3 to innovate in your field? Share your insights! 👩‍💻💡	Web3 + AI = a new era of data ownership! 🌟 With Web3, individuals reclaim their data, empowering innovation and transparency in AI. Let's lead this revolution with confidence! 💪 [TWEET BREAK] Women in tech: seize the opportunity to innovate with AI and Web3. The future is decentralized and collaborative. Let's build it together! 🌐 [TWEET BREAK] How do you see AI and Web3 transforming your industry? Join the conversation and share your innovative ideas! 🤝 #WomenInTech #AI #Web3	published_metahers	t	f	[]	t	unlocking-ai-s-potential-how-web3-revolutionizes-data-ownership-f23c0164	0	0	0	2025-10-30 02:30:24.196507	2025-10-30 02:41:02.913	2025-10-30 02:41:02.913	\N
33b0d8a8-ad04-4ea4-9e1a-f14a638546d1	5c7d757c-297b-4a84-978e-814855be88c5	2	"Building Your Personal Brand in the Age of AI and Web3"	## Building Your Personal Brand in the Age of AI and Web3\n\nIn a world where technology rapidly evolves, crafting a personal brand that resonates can feel like a daunting task. Yet, as women in tech, embracing these changes not only opens doors but also empowers us to shape the future of AI and Web3.\n\n### A Personal Journey into Tech\n\nA few years ago, I found myself at a crossroads—do I stick with conventional tech roles or dive into the uncharted waters of AI and Web3? I chose the latter, driven by a desire to innovate and a curiosity about how these technologies could redefine our lives. This decision wasn’t just about career advancement; it was about authenticity and aligning my work with my values.\n\n### Insights for Building Your Brand\n\n1. **Embrace Your Unique Voice**: The AI and Web3 fields are burgeoning with diverse opportunities. Your unique perspective is your power. Share your journey, insights, and challenges authentically. Your voice adds richness to these evolving narratives.\n\n2. **Engage with Your Community**: Technology is about building connections. Engage in communities, both online and offline. Be it through Twitter spaces or local meetups, these interactions not only widen your network but also keep you informed of the latest trends and opportunities.\n\n3. **Leverage AI and Web3 Tools**: Use AI-driven analytics or blockchain-based platforms to evaluate your brand’s reach and impact. These tools provide data-driven insights, helping you fine-tune your strategies and maximize your influence.\n\n4. **Continuous Learning and Adaptation**: Stay curious and adaptable. The pace of change in AI and Web3 is relentless. Enroll in online courses, attend webinars, and read extensively to keep your skills and knowledge sharp.\n\n### Actionable Takeaways\n\n- **Start a Blog or Newsletter**: Share your thoughts on AI and Web3 developments. Platforms like Medium or Substack can amplify your voice.\n- **Host or Participate in Tech Webinars**: Use your expertise to educate others while enhancing your own understanding.\n- **Network Relentlessly**: Connect with thought leaders in AI and Web3 to exchange ideas and foster collaborations.\n\n### Conclusion\n\nCrafting a personal brand in the age of AI and Web3 is not merely about visibility; it’s about impact. By intertwining your personal story with these revolutionary technologies, you not only define your own path but also inspire others to envision the future. As women in tech, we hold the pen—let’s write this next chapter with confidence and purpose.	In today’s rapidly evolving tech landscape, standing out requires more than just expertise in AI and Web3. It’s about crafting a personal brand that resonates and inspires.\n\n- **Embrace Your Unique Voice**: Share your journey authentically in the AI and Web3 space. Your experiences and insights are invaluable.\n- **Engage with Your Community**: Connect with like-minded individuals to share knowledge and stay current with tech trends.\n- **Leverage Tools**: Use AI and Web3 tools to enhance your brand’s reach and impact.\n\nHow are you using AI and Web3 to shape your personal brand?	Building a brand? 🎯 Embrace your unique voice in AI & Web3. Engage with communities & leverage tech tools for impact. #WomenInTech #PersonalBranding [TWEET BREAK] Personal branding in tech isn’t just visibility, it's impact. Share your story & inspire others! #AI #Web3 [TWEET BREAK] How are you using AI & Web3 to craft your brand narrative? Let's discuss! #TechLeadership #Innovation	draft	f	f	[]	f	\N	0	0	0	2025-10-30 02:57:17.507541	\N	2025-10-30 02:57:17.507541	\N
5b56f45c-a4cd-4d1c-b0eb-0c87f0f91fa9	b44cda71-8852-4d29-b0a4-4af0017b0298	1	Your Brand Introduction	## Crafting Magic: My Journey into Personalized Educational Storytelling\n\nAs a former university teacher, I found myself yearning for something more magical, something that would light up a child's eyes and spark their imagination. My own son became my muse, inspiring a creative pivot that would blend the power of storytelling with cutting-edge technology. Today, I'm thrilled to share with you the essence of my brand—a fusion of personalized children's books and AI-driven videos that put your child at the heart of their own educational adventures.\n\n### The Beginning of a Magical Journey\n\nI started by creating videos for my son, crafting stories where he played the starring role, complete with his own voiceovers. Some were whimsical, others educational, but all were designed to entertain while providing learning experiences. This personal project soon evolved into a larger mission: creating customized books and short movies for other children, merging fun with education and technology.\n\n### Insights from Today's Lesson\n\nToday's lesson revolves around introducing your brand essence—sharing not just what you do, but why you do it, and what you stand for. This resonates deeply with me because my journey is driven by a passion for creating magical, educational experiences for children. I want parents, particularly moms weary of non-educational screen time, to know that my products are crafted with their child's learning and enjoyment in mind.\n\n### Actionable Takeaways\n\n- **Personalization is Key:** Every child deserves to see themselves as the hero of their own story. My books and videos are tailored to include the child's name, their voice, and even appearances by their relatives, making learning an engaging and personal experience.\n- **Blend Education with Entertainment:** By infusing humor and intelligent storytelling into educational content, children are more likely to engage and retain information.\n- **Embrace Technology:** Introducing AI into storytelling not only captivates young minds but also familiarizes them with the technology that will shape their future.\n- **Build in Public:** Sharing my journey openly not only humanizes my brand but also helps me connect with other parents and educators who share my vision.\n\n### Conclusion\n\nAs I put the finishing touches on my first book, I remain committed to offering a unique blend of personalized books and AI-enhanced videos that educate and entertain. I'm excited about the endless possibilities ahead and the potential to expand into more products and services. Join me on this magical journey as we redefine what educational storytelling can be for the next generation, one personalized adventure at a time.	Today, I reflected on the power of introducing my brand's essence—personalized, educational storytelling for kids aged 4-8 through books and AI-enhanced videos. [BREAK] The key insight: personalization makes learning magical and memorable. [BREAK] 1. **Personalization is Key:** My products put your child at the center of their story, engaging them in a unique way. [BREAK] 2. **Education Meets Entertainment:** By blending humor and learning, I create content kids love and learn from. [BREAK] 3. **Embrace Technology:** Utilizing AI not only captivates but also prepares children for the tech-driven world. [BREAK] How do you personalize learning for your kids?	Every child deserves to be the hero of their own story. Personalized books & AI videos make learning magical! [TWEET BREAK] Personalization + Education = Engaged Learning 🌟 How do you make learning fun for your kids? [TWEET BREAK] Join me in redefining educational storytelling with tech & imagination! 🚀	draft	f	f	[]	f	\N	0	0	0	2025-10-31 03:37:10.294949	\N	2025-10-31 03:37:10.294949	I want to be know as the only business that offer personalized book for kids with their relative ai video, with educational purposes. \nI want to see more  kids entertained by the story telling of my book and the videos. I want them to learn and be educated and be more familiar with ai.  My oerspective is unique because not only it s personalized book but also personalzed movie so the child is the actor of his or her own movie and later maybe i want to offer more products and services
f842b735-be05-4728-9ba1-4a51801c0f8d	b44cda71-8852-4d29-b0a4-4af0017b0298	2	Your Origin Story	## Finding Magic in the Mundane: My Journey from Academia to AI Storytelling\n\nBeing a university teacher was supposed to be the pinnacle of my career—an aspiration achieved, a mark of success. But as I stood before a class, chalk in hand, I quickly realized that something was missing. The daily routine felt monotonous, devoid of the magic and excitement I craved. It wasn’t until I became a mom that I discovered where my true passion lay.\n\n**The Catalyst for Change**\n\nBecoming a mother was a transformative experience. Along with the joy and love came a financial burden and a desire to create something meaningful for my son and others. I found myself brainstorming ways to combine my skills with my newfound inspiration. That’s when AI entered my life—a tool that promised to transform my vision into reality.\n\nAs my mentor, the mompreneur, always says, "The best time to learn AI was yesterday; the second-best time is today." I dedicated the past week to mastering AI's capabilities. It’s the essence of my work—enabling me to write books in languages that aren’t my first or second, generate 3D images, and create personalized videos that feature my son’s voice and face.\n\n**From Concept to Creation**\n\nMy unique story now takes shape as educational books for kids aged 4-8, with a funny, smart twist, blending visuals and narratives. This venture isn’t just about the books; it’s about creating a personalized experience for children, making learning fun while reducing non-educational screen time.\n\n**Actionable Takeaways**\n\n1. **Embrace AI**: Whether it's writing in new languages or creating 3D visuals, AI can be a game-changer. Start with online courses or find a mentor to guide you.\n   \n2. **Build in Public**: Share your journey openly. Transparency not only builds trust with your audience but also creates a community around your mission.\n   \n3. **Leverage Personal Stories**: Your unique experiences and motivations can connect with others on a deeper level. Use your origin story to inspire and engage.\n   \n4. **Focus on Dual Benefits**: Solve personal challenges while also addressing broader societal issues, like I did by combining my passion for education with my desire to reduce screen time.\n\n**Conclusion**\n\nFrom the classroom to creating magic for my son and countless others, this journey is just beginning. AI has opened doors to possibilities I hadn’t imagined. As I near the completion of my first book, I am filled with excitement. My story is one of transformation, driven by the desire to weave magic into everyday learning. I invite you to join me as I continue to build this dream, one page, one video, and one child’s smile at a time.	Today, I reflected on the transformative power of AI in my journey from academia to storytelling. When I became a mom, I realized my need to create something magical for my son. AI became my tool. It allowed me to write books and create videos that educate and entertain.\n\n**Key Insights**:\n\n1. **AI as a Catalyst**: AI can bring your wildest ideas to life, even when working in languages you're not fluent in.\n\n2. **Share Your Journey**: Building in public fosters trust and community. Let others learn from your experiences.\n\n3. **Solve with Purpose**: Address personal and societal issues simultaneously, as I did by creating educational content that reduces non-educational screen time.\n\nWhat’s one challenge you’re facing that AI could help solve?	AI changed everything for me. From uni to creating personalized stories for kids, AI fuels my passion project. It helps me write, generate visuals, and create engaging content. What's one way AI could transform your life? #AI #Mompreneur [TWEET BREAK] Embracing AI was the best decision. It's more than tech; it's a tool for magic and meaningful impact. Share your journey, inspire others, and solve challenges with purpose. #AIInnovation #Storytelling [TWEET BREAK] Let's revolutionize learning together. How are you using AI to make a difference in your field? #AIForGood #Education	draft	f	f	[]	f	\N	0	0	0	2025-10-31 04:17:51.022977	\N	2025-10-31 04:17:51.022977	We experienced financial burden add the fact that i became a mom and i want to throw 2 birds with one stone. Something for my son and for others. ai changed everything that s why i dedicated the past week learning it and as my mentor the mompreneur says the best time to learn ai was yesterday the second best time is today. It fuels me because ai is the essence of my work. Without it i wouldnt be able to write books in  a language that is not my first nor my second, i would nt be able to generate 3d photos of the charcters and transform them and include them in the story then use and clone their voices et use their faces in the videos. 
47aeb382-09a1-4f0a-bb4b-156d170212a7	5c7d757c-297b-4a84-978e-814855be88c5	3	Your Platform Strategy	## Navigating the Digital Frontier: My Platform Strategy as a Solopreneur\n\nLife threw me quite the curveball when I was terminated from a six-figure corporate job. Yet, like many women at a crossroads, I found strength in reinvention. I got married, had a baby, and channeled my passion for technology into founding MetaHers. My mission? To simplify complex digital tools for women solopreneurs, empowering them to thrive in a tech-driven world.\n\nToday, I'm excited to share a key part of my journey—my platform strategy. It's not just about being present online; it's about choosing the right spaces to tell your story and engage authentically with your audience.\n\n### Discovering the Right Platforms\n\nIn today's digital ecosystem, the choices can be overwhelming. But I've found that each platform offers unique opportunities to connect and share insights:  \n\n1. **Substack/Medium for In-Depth Exploration**: These platforms allow me to craft long-form articles, providing a canvas to delve deeper into topics like blockchain and women empowerment. Here, I can share my story, lessons learned, and insights in a narrative that resonates with women solopreneurs.\n\n2. **LinkedIn for Professional Networking**: LinkedIn is where I connect with like-minded women, potential collaborators, and industry experts. It's a space to share thought leadership pieces and engage in meaningful conversations about innovations in web3 and AI.\n\n3. **TikTok and Instagram for Visual Storytelling**: These are my go-to for vibrant, visual storytelling. Short videos and reels offer a chance to break down complex tech concepts into digestible and relatable content.\n\n### Key Takeaways from My Platform Strategy\n\n1. **Be Authentic**: Share your genuine experiences and insights. Authenticity builds trust and connects you to your audience on a personal level.\n\n2. **Engage with Purpose**: Choose platforms that align with your goals and where your audience spends their time. Engagement is not just about likes but meaningful interactions.\n\n3. **Stay Flexible and Updated**: The digital world is ever-evolving. Staying updated with the latest trends ensures your content remains relevant and valuable.\n\n4. **Build Community**: Foster a space where women solopreneurs can learn, share, and grow together. Community is at the heart of empowerment.\n\nMy journey in building MetaHers has been one of learning, adapting, and sharing. As I launch the MVP of MetaHers, I invite you to join me on these platforms where we can continue to learn and grow together. Let's make technology accessible, understandable, and empowering for all women.\n\n**Join me on this journey—together, we can turn tech challenges into opportunities.**	Today, I want to share an insight from my journey as a solopreneur: your platform strategy is key to building authentic connections.\n\nAs I prepare to launch the MetaHers MVP, I've focused on where my voice can best resonate: \n\n- **Substack/Medium** for in-depth storytelling and insights on blockchain and women empowerment.\n- **LinkedIn** for professional networking and thought leadership.\n- **TikTok and Instagram** for vibrant, visual content that simplifies complex tech concepts.\n\n**Key takeaways for your platform strategy:**\n\n- **Be authentic**: Share genuine experiences that resonate. \n- **Engage with purpose**: Choose platforms that align with your audience and goals.\n- **Stay updated**: Embrace trends to keep content relevant.\n\nHow are you aligning your platform strategy with your goals? Let's discuss! #WomenInTech #Solopreneur	Your platform strategy is vital! 📱 Choose spaces that amplify your voice. Substack/Medium for stories, LinkedIn for connections, TikTok/IG for visuals. Be authentic, stay updated, and engage with purpose. How are you leveraging digital platforms? #WomenInTech [TWEET BREAK] Building MetaHers taught me the power of the right platform. It's not about being everywhere but being where your voice truly resonates. #Solopreneur [TWEET BREAK] Empowerment through tech is my mission. Let's turn complex into simple and create opportunities together. Join me in this journey! #Web3	draft	f	f	[]	f	\N	0	0	0	2025-11-01 17:05:44.230606	\N	2025-11-01 17:05:44.230606	substacl X linked in TikTok and IG
c24cc87b-04e1-4d36-b9a2-11259dced30b	5c7d757c-297b-4a84-978e-814855be88c5	4	Educational Content	## My Journey from Corporate to Web3: Empowering Women in Tech\n\nI still vividly remember the day I was terminated from my six-figure corporate job. It was a moment of uncertainty, yet it sparked a fire within me. I got married, had a baby, and during those transformative times, I discovered my passion for helping women navigate the complex world of tech—something I had to learn on my own. Today, I'm here to share a piece of that journey and offer insights into how women can confidently embrace digital tools like AI, Web3, and blockchain.\n\n### Learning AI as a Non-Tech Woman\n\nAI can seem daunting, especially for those of us who don't come from a technical background. But the good news is, you don't need to be a data scientist to understand or leverage AI. Start small. Learn to use everyday AI tools that can simplify your work processes. For example, AI-driven writing assistants can help with content creation, while AI analytics tools can offer insights into your business data.\n\n### Simplifying Complex Tech for Women\n\nOne of the main goals at MetaHers is to demystify tech for women solopreneurs. Here's how you can start embracing these tools without feeling overwhelmed:\n\n1. **Identify Your Needs:** Not every tech tool is essential for your business. Pinpoint where tech can save you time or increase efficiency.\n\n2. **Start with Familiarity:** Use platforms you're already on, like social media, to explore how AI and Web3 are being integrated. Follow influencers for insights.\n\n3. **Join a Community:** Being part of a community of like-minded women can accelerate your learning. Communities provide support, share resources, and offer encouragement.\n\n### Building in Public: My Approach\n\nI'm a firm believer in 'building in public.' Sharing my journey openly—both victories and struggles—has not only kept me accountable but also inspired other women to take their first steps into tech. Transparency builds trust and fosters a learning environment where we lift each other up.\n\n### Conclusion: Embrace the Challenge\n\nThe world of tech is ever-evolving, but that's what makes it exciting. As women, we have the opportunity to redefine our roles and create spaces for ourselves in these innovative fields. Let's embrace the challenge, support one another, and continue to learn and grow together.\n\nBy sharing my own experience, I hope to empower other women to take control of their tech journeys. Remember, it's not about mastering everything at once; it's about taking consistent, small steps towards your goals.	Today, I want to share a key insight I've gained from my journey in tech: AI and Web3 aren't as intimidating as they seem. They're tools that can empower us as women solopreneurs, not barriers. [BREAK] Understanding these technologies starts with recognizing your needs and matching them with the right tools. For instance, AI can simplify tasks you find repetitive, freeing up time for strategic thinking. [BREAK] Here are a few practical takeaways: [BREAK] 1. **Start with What You Know:** Explore how tech is being used in platforms you're familiar with. [BREAK] 2. **Leverage Community:** Join groups that focus on learning and support. [BREAK] How are you integrating these tools into your business? Let's discuss! #WomenInTech #AIForWomen	Tech doesn't have to be scary! Start with tools you know, join a community for support, and build in public to share your journey. Empowerment through AI is just one click away! 💪 #WomenInTech [TWEET BREAK] Are you leveraging AI in your solopreneur journey? Start small, stay consistent, and remember, support is just a community away! #Empowerment [TWEET BREAK] What tech tool has made the biggest impact on your business? Let's share insights. #WomenSupportingWomen	draft	f	f	[]	f	\N	0	0	0	2025-11-01 17:08:03.28507	\N	2025-11-01 17:08:03.28507	I teach AI to non tech women web3 NFTs metaverse crypto blockchain branding. I am self taught and started metahers community as a stay home mom I have taught over 1000 women for the first time about these topics and continue to do so daily through calls content and IRL events.selling metahers membership 
67bfaefc-4244-48d9-b260-45cd1d13b2fa	5c7d757c-297b-4a84-978e-814855be88c5	5	Your Unique Perspective	## Redefining the Tech Experience: A Spa for the Mind\n\nWhen I began my journey into the world of Web3, AI, and blockchain, I felt like I was entering a realm that was guarded by invisible gates. As a woman solopreneur, the landscape seemed cold, intimidating, and often unwelcoming. But then, a pivotal moment occurred—I realized I could transform these complex digital tools into something much more inviting and relatable.\n\nMy journey began after facing the challenge of losing a six-figure corporate job, getting married, and having a baby, all amidst the global pandemic. This upheaval fueled my passion to create MetaHers, a sanctuary for women like me who wish to navigate and thrive in the tech space without feeling overwhelmed. My unique perspective is rooted in the belief that technology should be a liberating experience, akin to entering a spa for the mind—a place for growth, renewal, and self-discovery.\n\n### A New Perspective on Emerging Technology\n\n**1. Blending Experiences**\nHaving honed my skills in luxury branding and high-end hospitality, I learned to create personal and sensory experiences. Now, I apply this philosophy to technology. Imagine learning about AI and blockchain in an environment that feels as soothing as a spa, where women can recharge and reconnect with their potential, rather than feeling pressured.\n\n**2. Merging Beauty with Logic**\nI am both visionary and structured, intuitive yet grounded in precision. My approach is to design experiences that are visually and emotionally elevated, inspiring women to become confident creators in the tech world. Tech should not be a daunting challenge but an elegant, empowering tool.\n\n**3. Tech as a Tool for Liberation**\nI challenge the stereotype of tech being a masculine domain. Instead, I see it as a tool for liberation. Through MetaHers, I help women embrace innovation with grace and self-awareness, showing them that technology can be as empowering as it is efficient.\n\n### Actionable Takeaways\n\n1. **Create Tech-Friendly Spaces:** Transform your learning environment into a space that inspires and relaxes—use calming colors, soft lighting, and ambient music to create a desirable learning atmosphere.\n\n2. **Personalize Your Learning:** Tailor your tech journey to your interests and strengths. This personal connection makes the learning process more engaging and less intimidating.\n\n3. **Embrace Your Unique Path:** Understand that there’s no one-size-fits-all approach. Celebrate your progress and recognize that your journey is distinctly yours.\n\n### Conclusion\nAs I launch MetaHers' MVP, my mission remains clear—to redefine what it means to be a modern, tech-literate woman. I aim to inspire women to approach technology with confidence and style, transforming it into a powerful ally in their personal and professional lives. Let us redefine tech not as a barrier, but as a bridge to our fullest potential.	Today, I’m reflecting on how we perceive technology. Traditionally seen as cold and intimidating, I believe tech should be akin to a spa for the mind—a place where women can recharge and grow.\n\nMy journey from losing a corporate job to founding MetaHers taught me that technology can be empowering, not daunting. Merging my hospitality background with tech, I create learning experiences that are personal and inviting.\n\n**Practical Takeaways:**\n1. Transform your learning space into an oasis—use calming elements to make learning enjoyable.\n2. Tailor tech learning to your interests for a more engaging experience.\n3. Celebrate your unique journey; tech isn't a one-size-fits-all.\n\nHow do you create tech-friendly environments for yourself?	Tech isn't just codes and circuits; it's a spa for the mind. My journey taught me tech can be relaxing & empowering. 🌿 [TWEET BREAK] Embrace tech in your own way. Personalize your learning space, connect it to your strengths, and celebrate your unique journey. 👩‍💻✨ [TWEET BREAK] How are you redefining your relationship with technology? #WomenInTech #TechForWomen	draft	f	f	[]	f	\N	0	0	0	2025-11-02 15:28:06.650335	\N	2025-11-02 15:28:06.650335	**My Unique Angle – Intersection Framework**\n\n**1. My Expertise**\nI blend three worlds that rarely meet: luxury branding, hospitality, and emerging technology. My background in high-end hospitality taught me how to design experiences that feel personal, sensory, and memorable. Now I apply that same philosophy to AI, Web3, and blockchain—making complex digital tools feel effortless, elegant, and human. I don’t just teach tech; I transform it into something women can *feel* and *own*.\n\n**2. My Personality**\nI’m visionary, calm, and structured, but also deeply intuitive. I lead with empathy and design everything with intention. I love merging beauty with logic—creating systems that are not only smart but visually and emotionally elevated. My approach is grounded in warmth, precision, and a quiet confidence that inspires women to see themselves as powerful creators, not outsiders in tech.\n\n**3. My Perspective**\nI challenge the old idea that technology is cold, masculine, and intimidating. To me, learning AI and Web3 should feel like entering a spa for the mind—a place where women can recharge, grow, and reconnect with their potential. I see tech as a tool for liberation, not pressure. Through MetaHers, I’m redefining what it means to be a modern, tech-literate woman—one who embraces innovation with grace, style, and self-awareness.\n
a6b95baa-d506-466d-a79d-66b82bcdf6df	5c7d757c-297b-4a84-978e-814855be88c5	6	Your Consistency Commitment	## Building Your Consistency Commitment\n\n6 days into the journey of Metahers, I find myself reflecting on the importance of consistency in our ever-evolving digital world. As a solopreneur who once navigated the maze of blockchain and crypto, I know firsthand how daunting it can be. Yet, through commitment and consistency, I have not only mastered these tools but also built a community around them. Today, I want to share insights on how you, too, can harness the power of consistency to transform your digital journey.\n\n**The Power of Consistency**\n\nConsistency is not just a buzzword; it's the backbone of success, especially in the fast-paced world of web3, metaverse, and AI technologies. Whether you're learning a new tech tool or building your brand, showing up regularly is crucial. For me, consistency began with small, manageable steps—integrating AI tools into my daily routine, and gradually, it became second nature.\n\n**Takeaways for Your Journey**\n\n### 1. Start Small, Think Big\n\nBegin with a daily or weekly ritual that aligns with your goals. For instance, dedicate time each week to explore a new digital tool or strategy. This approach helped me stay on top of industry trends without feeling overwhelmed.\n\n### 2. Leverage AI for Consistency\n\nAI tools can be your best allies in maintaining consistency. They can help automate tasks, provide insights, and even suggest new learning opportunities. By incorporating AI into my workflow, I've been able to focus more on creative and strategic tasks.\n\n### 3. Share Your Journey\n\nBuilding in public has been a game-changer for me. By sharing my experiences and challenges, I've built trust and authority within my niche. Don't be afraid to share your learnings, mistakes, and successes with your audience. It not only builds connection but also holds you accountable.\n\n**Conclusion**\n\nConsistency is more than just a commitment—it's a catalyst for growth and innovation. As we move forward in this 30-day journey, I invite you to commit to your own consistency ritual. Together, we'll embrace the power of digital tools and transform our businesses and lives.\n\nStay tuned for more insights, and let's continue building a future where women are empowered by technology.	As I dive deeper into the Metahers journey, I'm reminded of the profound impact consistency has on navigating the digital landscape. 6 days into this path, the lesson is clear: consistency is key to mastering new tools and building your brand.\n\n**Takeaways:**\n\n- **Start Small:** Focus on one tool or strategy weekly. This prevents overwhelm and fosters mastery.\n\n- **Use AI:** Automate tasks to maintain consistency while freeing up time for creativity.\n\n- **Share Your Journey:** Build trust and accountability by sharing your experiences and insights.\n\nHow do you plan to incorporate consistency into your digital journey? Let's grow together!	Consistency is your secret weapon in mastering web3 and AI. Start small, use AI to automate, and share your journey. How will you commit to consistency today? #WomenInTech #DigitalEmpowerment [TWEET BREAK] Day 6 in building Metahers: Consistency transforms the complex into the manageable. Start your ritual today and watch the magic unfold. [TWEET BREAK] Embrace consistency as a catalyst for growth. What's your ritual? #ConsistencyCommitment	draft	f	f	[]	f	\N	0	0	0	2025-11-08 17:38:46.710663	\N	2025-11-08 17:38:46.710663	3 times a week, any day is fine i want to use ai tools
0c692a70-740c-4706-a656-0c3728c081ad	f1e9a5f7-8d05-4f62-84bb-eb29bb99e247	1	Your Brand Introduction	## Embracing the Journey: Building Metahers and Empowering Women in Web3\n\nAs I sit down today to reflect on my journey as the founder of Metahers, I'm reminded of the immense potential that lies within the intersection of women, technology, and innovation. My name is Nadia Ben Brahim Maazaoui, and I'm passionate about enabling women to confidently navigate the web3 space, even without a tech background. This journey is not just about launching an app; it's about fostering a movement where women feel empowered to harness the power of online tools to save time, money, and energy.\n\n### Embracing the Challenge\n\nStarting Metahers was born out of a desire to solve a problem that I myself faced—a lack of accessible resources for women in the fast-evolving world of web3, crypto, and NFTs. I understood the frustration of feeling excluded from technological conversations and wanted to create a space where women could thrive without feeling intimidated by tech jargon.\n\n### Insights from Today's Lesson\n\nToday's lesson on articulating my brand essence resonated deeply. It reminded me of the importance of authenticity in building a brand. My journey isn't just about Metahers; it's about my own experiences, struggles, and victories as a woman navigating this space. **Authenticity and relatability are my guiding stars**, and they should shine through every facet of Metahers.\n\n### Actionable Takeaways\n\n1. **Share Your Story**: People connect with stories, not just products. As I continue to build Metahers, sharing my personal journey will be key in building trust and authority within the community.\n\n2. **Create Accessible Content**: My mission is to make web3 accessible to all women, regardless of their tech expertise. By breaking down complex concepts into simple, relatable content, I hope to eliminate barriers and empower more women to join the conversation.\n\n3. **Build in Public**: Transparency is my mantra. Building in public not only keeps me accountable but also invites others to learn and grow alongside me. It's a reminder that anyone can start where they are and create something meaningful.\n\n4. **Foster a Community**: Metahers is more than an app; it's a community. By fostering connections and collaborations, we can amplify each other's voices and create a supportive network for women in web3.\n\n### Conclusion\n\nAs I embark on this 30-day journey, I invite you to join me. Let's celebrate the successes, learn from the failures, and continue to build a space where women feel empowered and equipped to navigate the digital future. Together, we can redefine what's possible.\n\nThank you for being a part of this journey. Let's make the web3 space a welcoming place for all women.	Today, I embraced a key insight: authenticity is the foundation of my brand, Metahers. As I share my journey as a woman in web3, I'm reminded of the power of relatable storytelling in building trust and authority.\n\nHere are my takeaways:\n\n1. Sharing personal experiences can transform your brand into a relatable and trusted source.\n\n2. Simplifying complex tech concepts makes web3 more accessible for women.\n\n3. Building in public fosters transparency and invites community growth.\n\nWhat stories have shaped your journey? Let's connect and empower each other in the world of web3. 🌐💪	Authenticity is my brand's core. By sharing my journey in web3, I'm building trust and empowering women in tech. Simplify, connect, grow. What's your story? #WomenInTech #Web3[TWEET BREAK]Sharing my challenges & triumphs makes Metahers relatable. We need accessible tools for women in web3. Let's break barriers together! #EmpowerWomen[TWEET BREAK]Building in public is key! Transparency invites community growth. Join me in redefining web3 for all women. 💪 #BuildingInPublic	draft	f	f	[]	f	\N	0	0	0	2025-11-12 22:40:35.791398	\N	2025-11-12 22:40:35.791398	please fill this out for me nadia ben brahim maazaoui founder of metahers 
4d57d5dd-41a3-4d6e-912a-6adc5bfdceba	5c7d757c-297b-4a84-978e-814855be88c5	7	Community Building	## Building Meaningful Connections in the Digital Age  \n\nThe digital world often feels like a vast, overwhelming sea, especially for women solopreneurs exploring web3, NFTs, and the metaverse. Seven days into my 30-day community-building ritual, I’ve been dedicating two hours daily to engage and connect with women who, like me, have ventured into this evolving digital landscape. Here’s why I believe genuine connections online are more essential than ever.  \n\n### My Journey into Community Building  \n\nAfter leaving a high-flying corporate job, getting married, and having a baby, I embarked on a new journey—one where I could empower women by making technology accessible. As the founder of Metahers, my mission is to help women navigate tech spaces that often feel exclusive and complex. Building a community was not just an option; it was a necessity.  \n\nWhat surprised me the most was the warmth and openness I encountered from women who were eager to learn, share, and grow together. **Community building is not just about numbers; it's about nurturing relationships.**  \n\n### Lessons from My Journey  \n\n1. **Personalization is Key:**  \n   Every woman has a unique story, and by taking the time to craft personalized replies, I have fostered a sense of belonging. It’s not just about responding; it’s about genuinely engaging.  \n\n2. **Value-Driven Interactions:**  \n   Providing value through content is essential. I focus on creating insights that resonate deeply with my community and solve real problems, especially for those new to web3 and blockchain.  \n\n3. **Consistency Builds Trust:**  \n   My daily practice of engaging for two hours is not just routine—it's a commitment. It demonstrates reliability and dedication, essential components of trust in any relationship.  \n\n### Actionable Takeaways  \n\n- **Dedicate a Daily Ritual:** Even if it's just 30 minutes a day, commit to engaging with your community. Consistency fosters trust.  \n- **Listen Actively:** Don’t just hear—listen. Understand the struggles and aspirations within your community, and let these insights guide your interactions.  \n- **Create Value-Rich Content:** Share content that educates, inspires, and uplifts. Tailor it to the needs and language of your community.  \n\n### Conclusion: Building a Community of Empowerment  \n\nIn a world that's rapidly shifting towards digital realities, there’s immense power in building genuine connections. This journey of community building is just the beginning, and I’m eager to continue empowering women to thrive in tech spaces. Let’s build, connect, and grow—together.	Today, as I dive deeper into my 30-day community-building journey, I've discovered the profound impact of genuine online connections. 🌐 Here's what I've learned:  \n\n1. **Personalization is Key:** Each member of my community deserves a unique touch. Personalized replies foster a sense of belonging and are the foundation of meaningful relationships.  \n\n2. **Consistency Matters:** Dedicating two hours daily to engage isn’t just a routine—it's a trust-building exercise. It shows commitment and reliability.  \n\n3. **Value-Driven Content:** Crafting content that resonates and solves real problems empowers and uplifts my community.  \n\nHow do you build genuine connections online? 💬 Let's share our strategies!	Building genuine connections online means personalizing interactions and providing consistent value. Each reply & piece of content is a chance to foster community. 🌐 #WomenInTech #CommunityBuilding [TWEET BREAK] Consistency is key! Dedicating time daily to engage shows commitment and builds trust. How are you connecting online with your community? 🤝 #WomenEmpowerment [TWEET BREAK] Personalize, engage, and provide value—these are the pillars of meaningful digital connections. Let's make tech accessible together. ✨ #Metaverse #Web3	draft	f	f	[]	f	\N	0	0	0	2025-11-16 01:59:55.038211	\N	2025-11-16 01:59:55.038211	2 hours daily, content for women, peronalized replies
\.


--
-- Data for Name: thought_leadership_progress; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.thought_leadership_progress (id, user_id, current_day, completed_days, current_streak, longest_streak, total_posts_generated, total_posts_published, last_activity_date, journey_status, started_at, completed_at, updated_at, brand_expertise, brand_niche, problem_solved, unique_story, current_goals, brand_onboarding_completed, lessons_completed, practices_submitted, practice_reflections) FROM stdin;
738a134a-5c01-4f52-9ac9-bfc52ea29a8a	f1e9a5f7-8d05-4f62-84bb-eb29bb99e247	2	[1]	1	1	1	0	2025-11-12	active	2025-11-08 17:36:56.736132	\N	2025-11-12 22:40:35.818	i am the founder of metahers answer this on my behalf 	women in web3 crypto NFTs metaverse AI 	i help women leverage online tools with no tech background to save money time and energy 	i am nadia ben brahim maazaoui please find this	launching metahes app	t	[]	[1]	{"1": "please fill this out for me nadia ben brahim maazaoui founder of metahers "}
6b8c444c-0f89-45c3-86cf-cd02b80e4f04	b44cda71-8852-4d29-b0a4-4af0017b0298	3	[1, 2]	1	1	2	0	2025-10-31	active	2025-10-30 00:42:02.875557	\N	2025-10-31 04:17:51.054	I just lern how to use ai in writing books for kids. I am inspired by my child, so I am interested in educational books for 4-8 years old. Followed by personalized video for each kid	Moms whos kids aRe between 4-8 years old who are tired of screen time being used not for educational reasons	I help create a personalized book and short movie experience for the child, while educating them on the whys and hows 	I was teaching at the university and found out that it was a boring job for me, i would love to make something magical for my son and make others take advantages of it. I started making him videos and I created a chanel for him with him doing all the voice overs, some videos are funny, other educationals. and now I am aiming in specialize in writing educational book with a funny and smart twist, with lots of viduals for the kids so they can learn in an entertaining way. Ans who doenst want to see his face and his relative's in a book and their names, or their voices in the video. 	Few more days until I finish the book. I am working on the visual and printing. I already finished with the video	t	[]	[1, 2]	{"1": "I want to be know as the only business that offer personalized book for kids with their relative ai video, with educational purposes. \\nI want to see more  kids entertained by the story telling of my book and the videos. I want them to learn and be educated and be more familiar with ai.  My oerspective is unique because not only it s personalized book but also personalzed movie so the child is the actor of his or her own movie and later maybe i want to offer more products and services", "2": "We experienced financial burden add the fact that i became a mom and i want to throw 2 birds with one stone. Something for my son and for others. ai changed everything that s why i dedicated the past week learning it and as my mentor the mompreneur says the best time to learn ai was yesterday the second best time is today. It fuels me because ai is the essence of my work. Without it i wouldnt be able to write books in  a language that is not my first nor my second, i would nt be able to generate 3d photos of the charcters and transform them and include them in the story then use and clone their voices et use their faces in the videos. "}
b7ecab27-a1c3-46e4-87ab-9b03d6cf8104	5c7d757c-297b-4a84-978e-814855be88c5	8	[1, 2, 3, 4, 5, 6, 7]	1	2	7	1	2025-11-16	active	2025-10-30 00:41:53.700595	\N	2025-11-16 01:59:55.066	I am a woman expert in web3 metaverse NFTs blockchain crypto AI, branding and women empowerment I have a certificate in blockchain technology understand all the tools I mentioned I use them daily built with them I am the founder of metahers 	women solopreneurs who want to leverage digital tools for business and daily life 	I help women avoid the struggle of learning tech things that are gate kept new and complicated in a simple easy way that relates to them 	I was terminated from my 6 figures corporate job before corona got married had a baby and decided to start my own startup to help women because I struggled myself to learn and now thrive to do so and am passionate about staying updated and use all new tools	laughing metahers MVP	t	[]	[3, 4, 5, 6, 7]	{"3": "substacl X linked in TikTok and IG", "4": "I teach AI to non tech women web3 NFTs metaverse crypto blockchain branding. I am self taught and started metahers community as a stay home mom I have taught over 1000 women for the first time about these topics and continue to do so daily through calls content and IRL events.selling metahers membership ", "5": "**My Unique Angle – Intersection Framework**\\n\\n**1. My Expertise**\\nI blend three worlds that rarely meet: luxury branding, hospitality, and emerging technology. My background in high-end hospitality taught me how to design experiences that feel personal, sensory, and memorable. Now I apply that same philosophy to AI, Web3, and blockchain—making complex digital tools feel effortless, elegant, and human. I don’t just teach tech; I transform it into something women can *feel* and *own*.\\n\\n**2. My Personality**\\nI’m visionary, calm, and structured, but also deeply intuitive. I lead with empathy and design everything with intention. I love merging beauty with logic—creating systems that are not only smart but visually and emotionally elevated. My approach is grounded in warmth, precision, and a quiet confidence that inspires women to see themselves as powerful creators, not outsiders in tech.\\n\\n**3. My Perspective**\\nI challenge the old idea that technology is cold, masculine, and intimidating. To me, learning AI and Web3 should feel like entering a spa for the mind—a place where women can recharge, grow, and reconnect with their potential. I see tech as a tool for liberation, not pressure. Through MetaHers, I’m redefining what it means to be a modern, tech-literate woman—one who embraces innovation with grace, style, and self-awareness.\\n", "6": "3 times a week, any day is fine i want to use ai tools", "7": "2 hours daily, content for women, peronalized replies"}
\.


--
-- Data for Name: transformational_experiences; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.transformational_experiences (id, space_id, title, slug, description, learning_objectives, tier, estimated_minutes, sort_order, content, personalization_enabled, is_active, created_at, updated_at) FROM stdin;
branding-1-strategy	branding	AI Branding Fundamentals	ai-branding-fundamentals	Build a powerful brand with AI tools. From positioning to messaging to visual identity.	["Define your brand strategy with AI", "Create compelling brand messaging", "Position yourself in the market"]	free	25	1	{"sections": [{"id": "branding-intro", "type": "text", "title": "Brand Strategy with AI", "content": "Build a brand that stands out with AI power."}]}	t	t	2025-11-06 03:19:02.058003	2025-11-15 02:30:02.897462
branding-4-thought-leadership	branding	AI Thought Leadership	ai-thought-leadership	Position yourself as an authority. Use AI to research, write, and publish thought leadership content.	["Develop your unique point of view", "Create high-quality thought leadership", "Build authority in your niche"]	pro	40	4	{"sections": [{"id": "thought-leadership", "type": "text", "title": "Becoming a Thought Leader", "content": "Build authority with AI-assisted content."}]}	t	t	2025-11-06 03:19:02.130481	2025-11-15 02:30:04.794674
ai-6-product	ai	Build Your AI-Powered Product	build-ai-product	Launch an AI tool, service, or product. From idea to MVP - ship something people will pay for.	["Validate your AI product idea", "Build an MVP with no-code tools", "Launch and get your first customers"]	pro	60	6	{"sections": [{"id": "product-planning", "type": "hands_on_lab", "title": "AI Product Strategy", "content": "Time to build and ship your AI product."}]}	t	t	2025-11-06 03:19:02.034945	2025-11-15 02:29:58.795776
metaverse-4-land	metaverse	Virtual Real Estate	virtual-real-estate	Understand virtual land, digital property, and how to buy, sell, or lease metaverse real estate.	["Evaluate virtual land opportunities", "Understand digital property rights", "Explore metaverse real estate platforms"]	pro	35	4	{"sections": [{"id": "land-intro", "type": "text", "title": "Virtual Land Explained", "content": "Digital property is real business."}]}	t	t	2025-11-06 16:46:19.193539	2025-11-15 02:29:59.694615
ai-1-foundations	ai	AI Essentials	ai-essentials	Understand AI, machine learning, and how to use these tools to multiply your productivity and creativity.	["Explain AI and machine learning clearly", "Identify AI tools for your workflow", "Start using AI ethically and effectively"]	free	20	1	{"sections": [{"id": "ai-intro", "type": "text", "title": "AI Demystified", "content": "AI isn't magic - it's a powerful tool you can master."}]}	t	t	2025-11-06 03:19:01.899217	2025-11-15 02:29:54.894676
ai-3-content	ai	AI-Powered Content Creation	ai-content-creation	Create blog posts, social media, newsletters, and more - faster and better than ever with AI as your co-pilot.	["Generate high-quality content with AI", "Maintain your unique voice and style", "Build a content system that scales"]	pro	30	3	{"sections": [{"id": "content-intro", "type": "text", "title": "AI as Your Content Partner", "content": "Create more, stress less - AI handles the heavy lifting."}]}	t	t	2025-11-06 03:19:01.957945	2025-11-15 02:29:55.59456
ai-4-automation	ai	AI Automation & Workflows	ai-automation	Connect AI tools to automate your business processes. From email to social media to client onboarding.	["Map your automation opportunities", "Connect AI tools with no-code platforms", "Build workflows that run on autopilot"]	pro	40	4	{"sections": [{"id": "automation-intro", "type": "text", "title": "Automation Foundations", "content": "Work smarter, not harder - let AI handle the busywork."}]}	t	t	2025-11-06 03:19:01.989168	2025-11-15 02:29:55.794532
branding-2-content	branding	AI Content Strategy	ai-content-strategy	Create a content system that builds your brand on autopilot. Blog, social, email, and more.	["Build your AI content engine", "Create content pillars and calendars", "Maintain consistency across platforms"]	pro	35	2	{"sections": [{"id": "content-strategy", "type": "interactive", "title": "Content System Building", "content": "Create content that builds your brand."}]}	t	t	2025-11-06 03:19:02.081218	2025-11-15 02:30:02.997413
ai-2-chatgpt	ai	Master ChatGPT & Custom GPTs	master-chatgpt	Go beyond basic prompts. Create custom GPTs, build AI assistants, and automate your workflow.	["Write advanced prompts that get results", "Build your first custom GPT", "Automate repetitive tasks with AI"]	pro	35	2	{"sections": [{"id": "prompting", "type": "interactive", "title": "Prompt Engineering Mastery", "content": "The art and science of talking to AI."}]}	t	t	2025-11-06 03:19:01.935086	2025-11-15 02:29:55.394557
branding-3-social	branding	AI-Powered Social Media	ai-social-media	Grow your audience with AI. Create engaging content, optimize posting, and build community.	["Generate social content with AI", "Optimize posting times and frequency", "Grow your following strategically"]	pro	30	3	{"sections": [{"id": "social-media", "type": "text", "title": "Social Media with AI", "content": "Grow your social presence efficiently."}]}	t	t	2025-11-06 03:19:02.104875	2025-11-15 02:30:03.297665
ai-5-image-gen	ai	AI Image & Video Generation	ai-image-video	Create stunning visuals with Midjourney, DALL-E, and AI video tools. Design like a pro, no design skills required.	["Generate professional images with AI", "Create video content faster", "Build a visual content library"]	pro	35	5	{"sections": [{"id": "image-gen", "type": "interactive", "title": "AI Visual Creation", "content": "Turn your ideas into stunning visuals instantly."}]}	t	t	2025-11-06 03:19:02.01215	2025-11-15 02:29:55.896013
metaverse-5-commerce	metaverse	Metaverse Commerce	metaverse-commerce	Sell products and services in virtual worlds. From digital goods to virtual storefronts.	["Set up a virtual storefront", "Sell digital and physical goods", "Accept crypto payments seamlessly"]	pro	40	5	{"sections": [{"id": "commerce", "type": "interactive", "title": "Virtual Commerce Basics", "content": "Build your business in virtual worlds."}]}	t	t	2025-11-06 16:46:19.215988	2025-11-15 02:29:59.894693
crypto-2-wallets	crypto	Digital Wallets & Security	digital-wallets-security	Set up and secure your crypto wallet. Learn best practices for protecting your digital assets and avoiding common pitfalls.	["Create and secure a crypto wallet", "Understand private keys and seed phrases", "Protect yourself from scams"]	pro	30	2	{"sections": [{"id": "wallet-setup", "type": "interactive", "title": "Your First Wallet", "content": "Security first, always."}]}	t	t	2025-11-06 16:46:19.017108	2025-11-11 18:27:30.809073
crypto-3-nfts	crypto	NFT Creation & Trading	nft-creation-trading	Create, buy, and sell NFTs. Understand marketplaces, gas fees, and how to build or invest in digital collectibles.	["Create your first NFT", "Navigate NFT marketplaces", "Understand NFT valuation"]	pro	35	3	{"sections": [{"id": "nft-creation", "type": "interactive", "title": "Launch Your NFT", "content": "Turn your creativity into digital assets."}]}	t	t	2025-11-06 16:46:19.038649	2025-11-11 18:27:30.831264
crypto-4-defi	crypto	DeFi Fundamentals	defi-fundamentals	Explore decentralized finance. Learn about lending, staking, yield farming, and how to make your crypto work for you.	["Understand DeFi protocols", "Learn about staking and yield", "Assess DeFi risks and rewards"]	pro	40	4	{"sections": [{"id": "defi-intro", "type": "text", "title": "Banking Without Banks", "content": "Financial freedom through DeFi."}]}	t	t	2025-11-06 16:46:19.060902	2025-11-11 18:27:30.853037
crypto-5-trading	crypto	Crypto Trading Basics	crypto-trading-basics	Learn to trade cryptocurrency safely and strategically. Understand market analysis, risk management, and trading psychology.	["Read crypto charts and indicators", "Develop a trading strategy", "Manage risk effectively"]	pro	35	5	{"sections": [{"id": "trading-intro", "type": "interactive", "title": "Trading Smart", "content": "Strategy over speculation."}]}	t	t	2025-11-06 16:46:19.082503	2025-11-11 18:27:30.875421
crypto-6-portfolio	crypto	Build Your Crypto Portfolio	build-crypto-portfolio	Create a diversified crypto investment strategy. Learn portfolio management, tax considerations, and long-term wealth building.	["Build a balanced crypto portfolio", "Understand crypto taxes", "Plan for long-term success"]	pro	40	6	{"sections": [{"id": "portfolio-building", "type": "text", "title": "Your Crypto Future", "content": "Build wealth, not just holdings."}]}	t	t	2025-11-06 16:46:19.106245	2025-11-11 18:27:30.897531
branding-6-launch	branding	Launch Your Brand with AI	launch-brand-ai	Take your brand from concept to market. Build your complete brand ecosystem with AI assistance.	["Create your complete brand identity", "Build your online presence", "Launch and grow your brand"]	pro	50	6	{"sections": [{"id": "brand-launch", "type": "hands_on_lab", "title": "Brand Launch Strategy", "content": "Launch your brand into the world."}]}	t	t	2025-11-06 16:46:18.974219	2025-11-15 02:30:07.594455
metaverse-1-intro	metaverse	Metaverse Basics	metaverse-basics	Navigate virtual worlds, understand spatial computing, and see where digital experiences are heading.	["Understand what the metaverse actually is", "Explore major metaverse platforms", "Identify opportunities in virtual spaces"]	free	25	1	{"sections": [{"id": "metaverse-intro", "type": "text", "title": "Welcome to the Metaverse", "content": "Virtual worlds where real business happens."}]}	t	t	2025-11-06 16:46:19.127853	2025-11-15 02:29:59.094667
metaverse-2-platforms	metaverse	Platform Deep Dive	platform-deep-dive	Explore Decentraland, The Sandbox, Spatial, and more. Find the right virtual home for your brand.	["Compare major metaverse platforms", "Create your first avatar and presence", "Navigate virtual spaces confidently"]	pro	35	2	{"sections": [{"id": "platforms", "type": "interactive", "title": "Metaverse Platforms", "content": "Find your virtual home base."}]}	t	t	2025-11-06 16:46:19.14808	2025-11-15 02:29:59.311036
moms-1-foundations	moms	AI for Busy Moms	ai-for-busy-moms	Discover how AI can give you back hours every week. From meal planning to homework help, learn the tools that make motherhood easier.	["Use AI for daily mom tasks", "Automate family scheduling", "Save 10+ hours weekly"]	free	20	1	{"sections": [{"id": "mom-ai-intro", "type": "text", "title": "Your AI Mom Assistant", "content": "Technology that understands your chaos."}]}	t	t	2025-11-06 16:46:19.259061	2025-11-11 18:27:31.052994
metaverse-3-events	metaverse	Virtual Events & Experiences	virtual-events	Host conferences, workshops, and networking events in virtual spaces. Reach a global audience.	["Plan and host virtual events", "Engage attendees in 3D spaces", "Monetize virtual experiences"]	pro	30	3	{"sections": [{"id": "events", "type": "text", "title": "Hosting Virtual Events", "content": "Bring people together in immersive spaces."}]}	t	t	2025-11-06 16:46:19.172137	2025-11-15 02:29:59.499459
crypto-1-foundations	crypto	NFT & Blockchain Basics	nft-blockchain-basics	Understand blockchain technology and NFTs from the ground up. Learn what they are, how they work, and why they matter for your future.	["Explain blockchain in simple terms", "Understand how NFTs work", "Identify real-world use cases"]	free	25	1	{"sections": [{"id": "blockchain-intro", "type": "text", "title": "Blockchain Demystified", "content": "The technology that is changing everything."}]}	t	t	2025-11-06 16:46:18.995604	2025-11-11 18:27:30.787942
metaverse-6-brand	metaverse	Build Your Metaverse Presence	metaverse-presence	Establish your brand in the metaverse. Create immersive experiences that people remember.	["Design your metaverse brand strategy", "Create immersive experiences", "Build community in virtual spaces"]	pro	45	6	{"sections": [{"id": "brand-strategy", "type": "hands_on_lab", "title": "Metaverse Branding", "content": "Establish your presence in virtual worlds."}]}	t	t	2025-11-06 16:46:19.237354	2025-11-15 02:30:00.09467
web3-4-defi	web3	DeFi Demystified	defi-demystified	Navigate decentralized finance - understand lending, staking, and liquidity pools without the overwhelm.	["Understand DeFi fundamentals", "Evaluate DeFi opportunities and risks", "Start with safe, beginner-friendly platforms"]	pro	40	4	{"sections": [{"id": "defi-basics", "type": "text", "title": "What is DeFi?", "content": "Banking without banks - learn how decentralized finance is changing money."}]}	t	t	2025-11-06 16:46:19.453899	2025-11-15 02:29:54.195116
web3-3-smart-contracts	web3	Smart Contracts 101	smart-contracts-101	Understand how smart contracts work and how they're revolutionizing business agreements, payments, and automation.	["Explain smart contracts in simple terms", "Identify use cases for your industry", "Understand the benefits and limitations"]	pro	35	3	{"sections": [{"id": "contracts-intro", "type": "text", "title": "What are Smart Contracts?", "content": "Self-executing agreements that live on the blockchain - no middlemen needed."}]}	t	t	2025-11-06 16:46:19.432481	2025-11-15 02:29:53.653849
branding-5-community	branding	AI Community Building	ai-community-building	Build and nurture an engaged community. Use AI to manage conversations, create experiences, and grow together.	["Design your community strategy", "Use AI to engage and moderate", "Create community-driven growth"]	pro	35	5	{"sections": [{"id": "community", "type": "interactive", "title": "Community Building Basics", "content": "Build community with AI tools."}]}	t	t	2025-11-06 16:46:18.947957	2025-11-15 02:30:06.794677
web3-6-build	web3	Build Your Web3 Project	build-web3-project	Launch your first Web3 initiative - whether it's a community, product, or service. Get hands-on and ship it.	["Plan your Web3 project roadmap", "Choose the right tools and platforms", "Launch and iterate with confidence"]	pro	50	6	{"sections": [{"id": "project-planning", "type": "hands_on_lab", "title": "Planning Your Project", "content": "Time to build something real. We'll guide you step-by-step."}]}	t	t	2025-11-06 16:46:19.496939	2025-11-15 02:29:54.694662
crypto-1-basics	crypto	Crypto Foundations	crypto-foundations	Understand cryptocurrency beyond the hype. Learn how Bitcoin, Ethereum, and digital money actually work.	["Explain cryptocurrency clearly", "Understand blockchain and mining", "Navigate the crypto landscape safely"]	free	25	1	{"sections": [{"id": "crypto-intro", "type": "text", "title": "Crypto 101", "content": "Digital money explained without the jargon."}]}	t	t	2025-11-11 18:40:38.664397	2025-11-15 02:30:00.295011
moms-2-time	moms	Time-Saving Automation	time-saving-automation	Automate the repetitive tasks that drain your energy. Set up systems for meal planning, grocery ordering, and household management.	["Build AI meal planning systems", "Automate household tasks", "Create time for what matters"]	pro	30	2	{"sections": [{"id": "automation-setup", "type": "interactive", "title": "Reclaim Your Time", "content": "Less managing, more living."}]}	t	t	2025-11-06 16:46:19.280336	2025-11-11 18:27:31.076092
moms-3-business	moms	Mom-Friendly Side Hustles	mom-side-hustles	Launch a flexible business that works around your family. Learn what sells, how to market, and how to scale without sacrificing family time.	["Identify profitable mom businesses", "Market during naptime", "Scale without overwhelm"]	pro	35	3	{"sections": [{"id": "side-hustle", "type": "interactive", "title": "Mompreneur Launch", "content": "Build income on your terms."}]}	t	t	2025-11-06 16:46:19.301963	2025-11-11 18:27:31.097021
moms-4-content	moms	AI Content for Mom Creators	ai-content-mom-creators	Create blogs, social media, and newsletters with AI. Build your mom brand and monetize your parenting expertise.	["Use AI to create mom content", "Build a following fast", "Monetize your mom journey"]	pro	30	4	{"sections": [{"id": "mom-content", "type": "text", "title": "Share Your Story", "content": "Your experience is valuable."}]}	t	t	2025-11-06 16:46:19.323539	2025-11-11 18:27:31.118801
moms-5-education	moms	AI for Kids Education	ai-kids-education	Use AI to support your children learning. Homework help, personalized tutoring, and educational activities powered by AI.	["Get AI homework assistance", "Create personalized learning", "Support your kids education"]	pro	25	5	{"sections": [{"id": "kids-learning", "type": "interactive", "title": "AI Tutoring", "content": "Better learning outcomes for your kids."}]}	t	t	2025-11-06 16:46:19.345215	2025-11-11 18:27:31.140965
moms-6-community	moms	Build Your Mom Tribe Online	build-mom-tribe	Create and grow an online community of moms. Use AI to manage, engage, and monetize your mom community.	["Build an engaged mom community", "Use AI for community management", "Create income from community"]	pro	35	6	{"sections": [{"id": "community-building", "type": "text", "title": "Your Mom Network", "content": "Together we are stronger."}]}	t	t	2025-11-06 16:46:19.36815	2025-11-11 18:27:31.162942
web3-2-wallets	web3	Digital Wallets Decoded	digital-wallets-decoded	Set up and secure your first crypto wallet. Understand private keys, seed phrases, and how to stay safe in Web3.	["Create your first secure crypto wallet", "Understand private keys and seed phrases", "Implement security best practices"]	pro	30	2	{"sections": [{"id": "wallet-basics", "type": "text", "title": "What is a Digital Wallet?", "content": "Your gateway to Web3 - learn how wallets work and why they're essential."}]}	t	t	2025-11-06 16:46:19.411148	2025-11-15 02:29:53.628691
web3-5-daos	web3	DAOs & Community	daos-community	Join or create decentralized autonomous organizations. Build communities that run themselves.	["Understand how DAOs work", "Join your first DAO community", "Explore DAO governance and voting"]	pro	30	5	{"sections": [{"id": "dao-intro", "type": "text", "title": "What are DAOs?", "content": "Organizations run by code and community, not CEOs."}]}	t	t	2025-11-06 16:46:19.475377	2025-11-15 02:29:54.295896
crypto-6-business	crypto	Accept Crypto in Your Business	accept-crypto	Start accepting cryptocurrency payments. Integrate crypto into your business model.	["Set up crypto payment processing", "Manage crypto business accounting", "Market your crypto-friendly business"]	pro	40	6	{"sections": [{"id": "business", "type": "hands_on_lab", "title": "Crypto for Business", "content": "Accept crypto payments in your business."}]}	t	t	2025-11-11 18:40:40.664517	2025-11-15 02:30:01.499064
nfts-3-creating	crypto	Create & Mint Your NFTs	create-mint-nfts	Turn your art, photos, or content into NFTs. Launch your first collection on OpenSea or Rarible.	["Create NFT-ready digital assets", "Mint your first NFT collection", "Set up royalties and smart contracts"]	pro	40	3	{"sections": [{"id": "creating", "type": "hands_on_lab", "title": "Creating Your NFTs", "content": "Bring your creative work into Web3."}]}	t	t	2025-11-11 18:40:41.464402	2025-11-15 02:30:02.094609
crypto-3-trading	crypto	Crypto Trading Basics	crypto-trading	Learn trading fundamentals, technical analysis, and how to use exchanges like a pro.	["Read crypto charts and indicators", "Execute trades on major exchanges", "Understand trading strategies and timing"]	pro	45	3	{"sections": [{"id": "trading", "type": "text", "title": "Trading Fundamentals", "content": "Trade with confidence and strategy."}]}	t	t	2025-11-11 18:40:39.264507	2025-11-15 02:30:00.794591
nfts-6-launch	crypto	Launch Your NFT Project	launch-nft-project	Take your NFT project from concept to successful launch. Plan, build, and sell your collection.	["Plan your complete NFT launch", "Build community pre-launch", "Execute a successful mint and beyond"]	pro	50	6	{"sections": [{"id": "launch", "type": "hands_on_lab", "title": "NFT Project Launch", "content": "Launch your NFT project successfully."}]}	t	t	2025-11-11 18:40:42.164091	2025-11-15 02:30:02.694657
crypto-4-security	crypto	Crypto Security & Safety	crypto-security	Protect your assets. Master wallet security, avoid scams, and implement best practices.	["Secure your crypto holdings", "Identify and avoid common scams", "Implement multi-layer security"]	pro	30	4	{"sections": [{"id": "security", "type": "text", "title": "Crypto Security Essentials", "content": "Keep your crypto safe and sound."}]}	t	t	2025-11-11 18:40:39.564495	2025-11-15 02:30:00.995888
nfts-4-marketing	crypto	NFT Marketing & Community	nft-marketing	Build hype and community around your NFT project. From Discord to Twitter to launch success.	["Build an engaged NFT community", "Market your NFT project effectively", "Plan successful NFT launches"]	pro	35	4	{"sections": [{"id": "marketing", "type": "text", "title": "NFT Marketing Strategy", "content": "Build community and drive sales."}]}	t	t	2025-11-11 18:40:41.764182	2025-11-15 02:30:02.294825
nfts-1-basics	crypto	NFT Essentials	nft-essentials	Understand NFTs beyond the hype. Learn about digital ownership, utility, and real-world applications.	["Explain NFTs in simple terms", "Understand use cases beyond art", "Navigate NFT marketplaces confidently"]	free	25	1	{"sections": [{"id": "nft-intro", "type": "text", "title": "What Are NFTs?", "content": "Digital ownership explained simply."}]}	t	t	2025-11-11 18:40:40.964501	2025-11-15 02:30:01.69456
nfts-2-collecting	crypto	NFT Collecting & Investing	nft-collecting	Start your NFT collection strategically. Learn how to evaluate projects, spot quality, and build value.	["Evaluate NFT projects and communities", "Buy your first NFT safely", "Build a strategic NFT portfolio"]	pro	35	2	{"sections": [{"id": "collecting", "type": "interactive", "title": "Strategic NFT Collecting", "content": "Collect with purpose and strategy."}]}	t	t	2025-11-11 18:40:41.065697	2025-11-15 02:30:01.89462
crypto-5-taxes	crypto	Crypto Taxes & Compliance	crypto-taxes	Navigate crypto taxes and regulations. Stay compliant while maximizing your gains.	["Understand crypto tax obligations", "Track transactions for tax reporting", "Work with crypto-savvy accountants"]	pro	35	5	{"sections": [{"id": "taxes", "type": "text", "title": "Crypto Tax Basics", "content": "Stay compliant and keep more of your gains."}]}	t	t	2025-11-11 18:40:39.964427	2025-11-15 02:30:01.299249
nfts-5-utility	crypto	Utility NFTs & Memberships	utility-nfts	Create NFTs that unlock access, benefits, or experiences. Build membership and loyalty programs.	["Design utility-based NFT projects", "Create token-gated experiences", "Build NFT membership programs"]	pro	40	5	{"sections": [{"id": "utility", "type": "interactive", "title": "Utility NFTs Explained", "content": "NFTs that do more than look pretty."}]}	t	t	2025-11-11 18:40:41.964208	2025-11-15 02:30:02.494585
app-atelier-2-mvp	app-atelier	Design Your MVP	design-mvp	Plan your Minimum Viable Product. Learn to identify core features, create user flows, and wireframe your first app.	["Define your MVP scope and features", "Create user flows and wireframes", "Validate your app idea with potential users"]	pro	40	2	{"sections": [{"id": "mvp-planning", "type": "interactive", "title": "MVP Strategy", "content": "Start with the essentials. What's the ONE problem your app solves?"}]}	t	t	2025-11-11 18:40:44.363275	2025-11-15 02:30:09.594715
app-atelier-3-build	app-atelier	Build Your First App	build-first-app	Hands-on workshop: Build a functional app in 2 hours using Bubble or Glide. From blank canvas to working prototype.	["Set up your no-code development environment", "Build core features and user interface", "Deploy your first app to the web"]	pro	120	3	{"sections": [{"id": "building", "type": "hands_on_lab", "title": "Build Workshop", "content": "Let's build together. You'll leave with a live, functional app."}]}	t	t	2025-11-11 18:40:44.663217	2025-11-15 02:30:09.974967
founders-club-4-first-customers	founders-club	Get Your First 10 Customers	first-10-customers	Customer acquisition from zero. Learn scrappy, founder-led sales tactics that work before you have a marketing budget.	["Find your first customers without ads", "Perfect your pitch and close sales", "Build word-of-mouth and referrals"]	pro	50	4	{"sections": [{"id": "first-customers", "type": "interactive", "title": "Customer Acquisition", "content": "Get scrappy. Let's find your first paying customers."}]}	t	t	2025-11-11 18:40:47.063314	2025-11-15 02:30:10.130685
app-atelier-6-launch	app-atelier	Launch & Scale Your App	launch-scale-app	Go from prototype to production. Launch strategy, user acquisition, and scaling best practices for no-code apps.	["Prepare your app for public launch", "Set up analytics and user feedback loops", "Scale your app as users grow"]	pro	60	6	{"sections": [{"id": "launch", "type": "hands_on_lab", "title": "Launch Strategy", "content": "Time to ship. Let's get your app in front of users."}]}	t	t	2025-11-11 18:40:45.363239	2025-11-15 02:30:10.042352
founders-club-5-operations	founders-club	Set Up Business Operations	business-operations	Legal, finance, and systems. Set up your LLC, business bank account, accounting software, and essential tools.	["Choose the right business structure (LLC, C-Corp, etc.)", "Set up business banking and accounting", "Implement essential tools and workflows"]	pro	60	5	{"sections": [{"id": "operations", "type": "text", "title": "Business Foundations", "content": "Set up your business infrastructure the right way."}]}	t	t	2025-11-11 18:40:47.263382	2025-11-15 02:30:10.194548
app-atelier-4-ai-integration	app-atelier	AI-Powered Features	ai-powered-features	Integrate AI capabilities into your app. Add chatbots, content generation, image creation, and smart recommendations.	["Connect OpenAI API to your no-code app", "Build AI-powered features and workflows", "Create personalized user experiences"]	pro	50	4	{"sections": [{"id": "ai-features", "type": "interactive", "title": "AI Integration", "content": "Make your app intelligent with AI-powered features."}]}	t	t	2025-11-11 18:40:44.863311	2025-11-15 02:30:09.997243
founders-club-1-ideation	founders-club	Validate Your Business Idea	validate-business-idea	Turn your idea into a viable business. Learn validation frameworks, customer research, and how to avoid building something nobody wants.	["Test your business idea with real customers", "Identify your ideal customer and their pain points", "Decide if your idea is worth pursuing"]	free	30	1	{"sections": [{"id": "validation", "type": "text", "title": "Idea Validation", "content": "Before you build, validate. Learn how to test ideas fast and cheap."}]}	t	t	2025-11-11 18:40:45.763209	2025-11-15 02:30:10.064373
founders-club-2-business-model	founders-club	Design Your Business Model	design-business-model	Map out how you'll make money. From pricing strategy to revenue streams—build a sustainable business model.	["Create your business model canvas", "Define pricing and revenue streams", "Calculate unit economics and break-even"]	pro	45	2	{"sections": [{"id": "business-model", "type": "interactive", "title": "Revenue Strategy", "content": "How will you make money? Let's figure it out."}]}	t	t	2025-11-11 18:40:46.263398	2025-11-15 02:30:10.086571
founders-club-6-scaling	founders-club	Scale from $0 to $10K MRR	scale-to-10k-mrr	Growth strategies that work. Marketing, sales systems, and scaling operations to hit your first $10K monthly recurring revenue.	["Build repeatable marketing and sales systems", "Hire your first team member or contractor", "Scale without burning out"]	pro	75	6	{"sections": [{"id": "scaling", "type": "hands_on_lab", "title": "Growth Playbook", "content": "From traction to growth. Let's scale your business."}]}	t	t	2025-11-11 18:40:47.667012	2025-11-15 02:30:10.794714
founders-club-3-mvp-build	founders-club	Build Your MVP in 30 Days	build-mvp-30-days	Ship fast, iterate faster. Build a working MVP in 30 days using no-code tools and lean methodology.	["Scope your MVP features ruthlessly", "Build with no-code/low-code tools", "Launch before you're ready (and why that's good)"]	pro	90	3	{"sections": [{"id": "mvp-build", "type": "hands_on_lab", "title": "30-Day Build Sprint", "content": "You have 30 days. Let's build something real."}]}	t	t	2025-11-11 18:40:46.763267	2025-11-15 02:30:10.108699
app-atelier-5-monetization	app-atelier	Monetize Your App	monetize-app	Turn your app into a revenue stream. Implement subscriptions, one-time payments, and freemium models using Stripe.	["Set up Stripe payments in no-code apps", "Design pricing tiers and subscription models", "Create upgrade flows and paywalls"]	pro	45	5	{"sections": [{"id": "monetization", "type": "text", "title": "Revenue Models", "content": "Your app can generate income. Let's set up payments."}]}	t	t	2025-11-11 18:40:45.06372	2025-11-15 02:30:10.020336
crypto-2-investing	crypto	Smart Crypto Investing	crypto-investing	Start investing in crypto safely. Understand risk management, portfolio strategy, and how to avoid common mistakes.	["Build a balanced crypto portfolio", "Understand market cycles and trends", "Implement risk management strategies"]	pro	40	2	{"sections": [{"id": "investing", "type": "interactive", "title": "Crypto Investment Strategy", "content": "Invest smart, not scared."}]}	t	t	2025-11-11 18:40:38.864892	2025-11-15 02:30:00.494707
digital-sales-2-instagram	digital-sales	Instagram Shopping Activation	instagram-shopping	Turn Instagram into a sales channel. Set up Instagram Shopping, create shoppable posts, and start selling where your customers already are.	["Activate Instagram Shopping for your account", "Connect your Shopify catalog to Instagram", "Create 3 shoppable posts with product tags", "Use AI to generate captions and content ideas"]	free	120	2	{"sections": [{"id": "instagram-business", "type": "hands_on_lab", "title": "Instagram Business Setup", "content": "Convert to a Business account, connect your Facebook Page, link your Shopify catalog, and submit for Instagram Shopping approval."}, {"id": "shoppable-content", "type": "interactive", "title": "Create Shoppable Posts", "content": "Use proven content formulas to create 3 posts, tag products, and publish them live. Plus learn AI prompts for writing captions in 30 seconds.", "resources": [{"url": "/resources/caption-templates.pdf", "type": "pdf", "title": "Caption Templates"}, {"url": "/resources/ai-prompts.pdf", "type": "pdf", "title": "AI Prompt Library"}]}]}	t	t	2025-11-11 18:40:48.064594	2025-11-15 02:30:11.594748
digital-sales-6-growth	digital-sales	Growth Systems & Scaling	growth-systems-scaling	Scale what works. Review your results, optimize winning strategies, build customer loyalty programs, and create your 90-day growth roadmap.	["Analyze first week results and identify what's working", "Optimize ads and content that perform best", "Build loyalty programs and referral systems", "Create your personalized 90-day growth roadmap"]	pro	120	6	{"sections": [{"id": "scaling-what-works", "type": "interactive", "title": "Scaling What Works", "content": "Review everyone's first week results together. Identify winning ads, viral content, and best-selling products. Make data-driven optimization decisions."}, {"id": "community-loyalty", "type": "hands_on_lab", "title": "Building Community & Loyalty", "content": "Create simple loyalty programs, user-generated content strategies, customer referral programs, VIP perks, and Instagram engagement tactics.", "resources": [{"url": "/resources/loyalty-templates.pdf", "type": "pdf", "title": "Loyalty Program Templates"}, {"url": "/resources/referral-guide.pdf", "type": "pdf", "title": "Referral Program Guide"}]}, {"id": "long-term-plan", "type": "interactive", "title": "Your 90-Day Roadmap", "content": "Build your personalized 90-day roadmap together. Plan when to hire help, seasonal strategies, work-life balance, and staying ahead of trends."}]}	t	t	2025-11-11 18:40:49.164338	2025-11-15 02:30:13.994751
digital-sales-4-email-ads	digital-sales	Email Marketing & Paid Ads	email-marketing-paid-ads	Activate email marketing automation and launch your first ad campaign. Set up welcome emails, abandoned cart recovery, and a $10/day Meta ad—all live during the workshop.	["Set up email marketing platform with 3 essential automations", "Create email templates and pop-ups for list building", "Launch your first Meta ad campaign with AI-written copy", "Use AI to create 20 product descriptions and 14 days of captions"]	pro	120	4	{"sections": [{"id": "email-setup", "type": "hands_on_lab", "title": "Email Marketing Activation", "content": "Choose your platform (Klaviyo or Mailchimp), create templates, and build 3 automations: Welcome, Abandoned Cart, and Thank You emails."}, {"id": "first-ad", "type": "hands_on_lab", "title": "Launch Your First Ad", "content": "Set up Meta Business Manager, install Facebook Pixel, create ad copy with AI, select your audience, and launch a $10/day campaign live.", "resources": [{"url": "/resources/email-templates.pdf", "type": "pdf", "title": "Email Marketing Templates"}, {"url": "/resources/ad-setup.pdf", "type": "pdf", "title": "Ad Campaign Setup Guide"}]}, {"id": "ai-automation", "type": "interactive", "title": "AI Content Automation Power Hour", "content": "Use AI together to create 20 product descriptions (5 min), 14 days of captions (5 min), 5 email subject lines (2 min), and 10 ad variations (3 min)."}]}	t	t	2025-11-11 18:40:48.464755	2025-11-15 02:30:12.994704
digital-sales-3-tiktok	digital-sales	TikTok Shop & Content Creation	tiktok-shop-content	Launch TikTok Shop and create content that sells. Film your first 3 TikToks together using viral formulas, go LIVE, and plan 30 days of content with AI.	["Set up TikTok Business and TikTok Shop", "Film and post 3 TikToks using proven selling formulas", "Complete your first TikTok Live selling session", "Generate 30 days of content ideas with AI in 5 minutes"]	pro	120	3	{"sections": [{"id": "tiktok-setup", "type": "hands_on_lab", "title": "TikTok Business & Shop Launch", "content": "Create your TikTok Business account, apply for TikTok Shop, and connect your product catalog."}, {"id": "viral-content", "type": "hands_on_lab", "title": "Film Content That Sells", "content": "Learn 3 viral formulas (style/try-on, GRWM, behind-the-scenes), film your TikToks RIGHT NOW, edit them, and post them live during the workshop.", "resources": [{"url": "/resources/tiktok-formulas.pdf", "type": "pdf", "title": "TikTok Viral Formulas"}, {"url": "/resources/trending-sounds.pdf", "type": "pdf", "title": "Trending Sounds List"}]}, {"id": "content-planning", "type": "interactive", "title": "30-Day Content Plan with AI", "content": "Use AI to generate 30 days of content ideas in 5 minutes. Save your content calendar and never run out of ideas."}]}	t	t	2025-11-11 18:40:48.363584	2025-11-15 02:30:12.494768
digital-sales-1-shopify	digital-sales	Launch Your Shopify Store	launch-shopify-store	Build and launch your Shopify store LIVE in 2 hours. Set up payments, add products, and start taking orders. By the end, your store is live and ready to sell.	["Create and configure your Shopify store", "Set up payment processing and shipping zones", "Add your first 5 products with optimized descriptions", "Launch your store and make it live"]	free	120	1	{"sections": [{"id": "shopify-setup", "type": "hands_on_lab", "title": "Shopify Quick Wins Setup", "content": "Follow along step-by-step as we build your Shopify store together. You'll sign up, pick a theme, configure essentials, and add products in real-time.", "resources": [{"url": "/resources/shopify-checklist.pdf", "type": "pdf", "title": "Shopify Setup Checklist"}, {"url": "/resources/product-templates.pdf", "type": "pdf", "title": "Product Description Templates"}]}, {"id": "store-polish", "type": "interactive", "title": "Polish & Launch", "content": "Customize your homepage, set up navigation, and do a mobile preview check. Then we celebrate—your store is LIVE!"}]}	t	t	2025-11-11 18:40:47.969922	2025-11-15 02:30:11.194994
digital-sales-5-operations	digital-sales	Operations & Analytics	operations-analytics	Build systems that scale. Set up inventory sync, order management, customer service automation, and analytics dashboards so you can handle 50+ orders per day smoothly.	["Sync inventory across all platforms automatically", "Set up order management and shipping workflows", "Build analytics dashboard to track key metrics", "Automate customer service with templates and FAQs"]	pro	120	5	{"sections": [{"id": "inventory-fulfillment", "type": "hands_on_lab", "title": "Inventory & Fulfillment Systems", "content": "Set up inventory sync, order management workflow, packaging strategy, shipping optimization, and return processes."}, {"id": "analytics-money", "type": "interactive", "title": "Analytics & Money Tracking", "content": "Create your dashboard using our template. Connect all platforms to see revenue by channel, best-sellers, CAC, and profit margins in one place.", "resources": [{"url": "/resources/dashboard-template.pdf", "type": "pdf", "title": "Analytics Dashboard Template"}, {"url": "/resources/key-metrics.pdf", "type": "pdf", "title": "Key Metrics Guide"}]}, {"id": "customer-service", "type": "text", "title": "Customer Service Automation", "content": "Build FAQs, automated responses, DM templates, and review response systems. Handle difficult customers with confidence."}]}	t	t	2025-11-11 18:40:48.763825	2025-11-15 02:30:13.494781
web3-1-foundations	web3	Web3 Foundations	web3-foundations	Demystify Web3 basics - understand blockchain, decentralization, and why it matters for your business. No tech degree required.	["Understand what Web3 actually means in plain English", "Explain blockchain to clients and colleagues confidently", "Identify real-world Web3 opportunities for your business"]	free	25	1	{"sections": [{"id": "intro", "type": "text", "title": "Welcome to Web3", "content": "Let's cut through the jargon and understand what Web3 really means for you as a woman building in tech."}, {"id": "what-is-web3", "type": "interactive", "title": "What is Web3?", "content": "Web3 is the internet where you own your data, your content, and your digital assets. Think of it as the difference between renting vs. owning."}]}	t	t	2025-11-06 16:46:19.389578	2025-11-15 02:29:53.601515
app-atelier-1-foundations	app-atelier	No-Code App Foundations	no-code-foundations	Discover how to build professional apps without writing code. Understand the tools, platforms, and mindset shift needed to become a no-code creator.	["Understand the no-code movement and its potential", "Compare major no-code platforms (Bubble, Glide, Adalo)", "Identify which platform fits your app idea"]	free	25	1	{"sections": [{"id": "intro", "type": "text", "title": "Welcome to No-Code", "content": "You don't need to be a programmer to build powerful applications. No-code tools democratize app development for everyone."}]}	t	t	2025-11-11 18:40:44.063324	2025-11-15 02:30:08.89519
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, email, first_name, last_name, is_pro, created_at, updated_at, onboarding_completed, password_hash, quiz_unlocked_ritual, quiz_completed_at, subscription_tier, stripe_customer_id, stripe_subscription_id) FROM stdin;
a22f1ca1-bf8e-4f54-84d0-07d980d81c6e	nadia@metahers.xyz	naya	maazaoui	f	2025-10-20 00:05:57.66681	2025-10-20 00:06:24.978	t	$2b$12$VeWi.lCvyZkTwdfbRj5DsOYLWBHkkWPwbDvYhauX3fuMDWZ4kwEMy	\N	\N	free	\N	\N
02456fd9-27f7-4699-94c1-b035fb00acb6	nesrinebenbb@gmail.com	Nesrine	Ben brahim	f	2025-10-20 01:02:24.080323	2025-10-20 01:02:28.716	t	$2b$12$BBQfMuIjSrTfMbYLuR5kE.i8/RvQ59v0NfyiIGr6tgbaP7bGSJJ4O	\N	\N	free	\N	\N
13485a43-bcd0-4471-a636-58de1bfeb9d9	benarab.jihene@gmail.com	Jihene	Minasyan	f	2025-11-05 20:10:51.127147	2025-11-05 20:11:09.015	t	$2b$12$0pUT0wEi43jttD6q4e8E3.drLAzWJAzA3a.ea3caDCVDBLbwyNaIC	\N	\N	free	\N	\N
dcfbd2f0-1557-4a76-83de-49ef07a4d8cf	lamis.hassoun@gmail.com	Lamis	Abou hassoun	f	2025-11-06 15:00:55.046717	2025-11-06 15:01:08.282	t	$2b$12$yjiX5uQnj8sw/SabuDTA2ORQSKzaId4Z23A7Vk9/CqzM6UkbwjeIS	\N	\N	free	\N	\N
33e5dd9e-c288-4e81-8e72-787c9977c165	magouri.yousra@gmail.com	YOUSRA	magouri	f	2025-10-21 19:21:21.031043	2025-10-21 19:21:36.252	t	$2b$12$mc5t9uQ3IzhNUYcQC3EhW.akTYhcx3d0XFaw.W8h5YU37OS.Co//u	\N	\N	free	\N	\N
13f896b8-f93b-437e-acb3-e4836891042c	ilhemn11@gmail.com	Ilhem	Nemri	f	2025-10-21 19:34:02.020564	2025-10-21 19:34:13.526	t	$2b$12$/CYT6bCeeftdNwZDmE7IjOi2fzzdLNGacmRkw3mBh7q7x19yArVTW	\N	\N	free	\N	\N
b44cda71-8852-4d29-b0a4-4af0017b0298	smathlouthi@hotmail.fr	Salma	Mathlouthi	t	2025-10-20 18:33:11.946509	2025-10-24 02:05:41.759	t	$2b$12$F5ct.zgrWal7cv7Yst0QqOQ6FypQ4jdHYso/HrjD3VBWV3fuf7aeW	\N	\N	free	\N	\N
e8e7d006-1890-465c-ab3f-4485d5d52e0d	emna.chaieb@yahoo.fr	Emna	Chaieb	t	2025-10-24 02:14:43.630388	2025-10-24 02:18:26.155	t	$2b$12$J43reGrk2dwmiHButnbbM.YKnm1bzn3zHFpt0vffVvwO8IXmCp92S	\N	\N	free	\N	\N
2201893e-c248-40b2-95d3-3278cfa2de25	autonomyllc9@gmail.com	Yassine	Maazaoui	t	2025-10-20 01:19:31.807339	2025-10-25 04:13:32.596	t	$2b$12$6lNH3DtFzueV6YwYuRgsIu/dGsixTCp9dAaHyFYg30Ed6qtBJgjXu	\N	\N	free	\N	\N
8d185f2a-c70f-4d11-b160-d7eb82b689f5	doniadbs@gmail.com	donia	Ben Salah 	f	2025-11-07 16:28:08.406401	2025-11-07 16:29:05.407	t	$2b$12$EXBzy8KhY9d/7vwlnbZFCOtUvdoR1zu9ooeUnvWzQSZV6UZeb5HDq	\N	\N	free	\N	\N
ff6043fd-c659-404e-aa9d-cd2a98deabe6	siwikiwi0@gmail.com	siwar	dhawadi	t	2025-10-26 19:19:35.009701	2025-10-26 19:31:24.895	t	$2b$12$sa.qlJZGXGqUuSG3UaLwROAzVG60DRXAhP60sK7Cna10GQCAnxpQC	\N	\N	free	\N	\N
5c7d757c-297b-4a84-978e-814855be88c5	nadia.maazaoui@hotmail.com	nadia	maazaoui	t	2025-10-20 17:11:58.787	2025-10-27 19:56:21.365	t	$2b$12$0UqyjLP8BqGWyXP2dIkPMeZ3QxfCa92rmOSj2yLgLAvazjLFdnU8W	crypto-confidence-bath	2025-10-27 19:56:21.364	free	\N	\N
9a770e1c-268e-4d4c-9fdd-7f73ee91ad5f	chaouch.rabiaa@yahoo.fr	Rabiaa 	Chaouch 	t	2025-10-27 20:32:39.901586	2025-10-27 20:34:07.248	t	$2b$12$0/EAHDe6XScaEKJ/0.vu/e0hpjnAdNnukIgt.Tu.xtuASWLKY6Av2	\N	\N	free	\N	\N
31281f64-8e51-4fa6-9712-b76b8cef2f4c	ayhathaway@gmail.com	Sara	H	f	2025-10-28 17:27:40.092229	2025-10-28 17:27:59.819	t	$2b$12$hZsHNBCTzVoTHq7y18hVTu31090CIrQkFB523NcLdOweTKuoFb7/2	\N	\N	free	\N	\N
994ac7fe-a41b-4241-907c-83474f5c5dad	salmagharbi97@gmail.com	salma	gharbi	f	2025-11-01 22:38:45.497181	2025-11-01 22:38:45.497181	f	$2b$12$4rA8WfmdQDaGC3rFy5TBa.f5CVIuXJpDta5HwfRfNIzVjF1GhxdlS	ai-glow-up-facial	2025-11-01 22:38:45.486	free	\N	\N
c353ec4a-ea32-4bcf-bb20-6e72f965469e	carlasophiaco@gmail.com	Carla 	Sophia	f	2025-11-04 05:56:48.22435	2025-11-04 05:56:57.403	t	$2b$12$cQEuM.Jfg.53AhR5zRZyHO1Q.m.twcX4v/VTHXktbtRSRfQ/c0OtS	\N	\N	free	\N	\N
24d5845d-06c9-46f9-a168-5cdd2e16d35f	hbetabessi@gmail.com	hajer	betabessi	f	2025-11-04 21:49:44.033734	2025-11-04 21:50:35.188	t	$2b$12$Fgzp46Sr.u7Zx5aWGVyVmuI1d4IFrEo2VCIEwpHAfcIelL2jIu476	\N	\N	free	\N	\N
9eb036b4-b1b0-4998-ba1d-14b975f7cb49	salmouch50@yahoo.fr	Salma	Mathlouthi	t	2025-11-14 01:18:43.296479	2025-11-14 01:18:55.439	t	$2b$12$Zimtlai83Ls6dTBQ25S.xOW1GBSFuW1jRLxrxYhLEaryqEwHjRyHW	\N	\N	free	\N	\N
f1e9a5f7-8d05-4f62-84bb-eb29bb99e247	nadia@metahers.ai	NadDev	DevNad	t	2025-11-06 16:22:10.81567	2025-11-06 16:22:32.274	t	$2b$12$lSCzXmLCgxC2/YABm0lMGufM0eO1WGN7F/pKGBBH9BJpP5rqjEwYS	\N	\N	free	\N	\N
5babd0bc-ee1e-498a-9929-d360e4ce4b50	nadia.benbr@gmail.com	Nadtest	Test	f	2025-11-23 17:35:21.665182	2025-11-23 17:35:21.665182	f	$2b$12$biKyt1JlulSV5v4t/ZaVdebFN204qXd0FrKozrHGk4Q3hz57GdtRe	\N	\N	free	\N	\N
903daee1-3a75-4e43-971b-2d67b46fab8b	testuser.tu12@gmail.com	Test	User	f	2025-11-25 18:47:13.190781	2025-11-25 18:47:13.190781	f	$2b$12$H.jcGv0XPyg.nzKqAY9IjuFa01LB4CAIkSubC0E5VukMp6Krg3Sa6	\N	\N	free	\N	\N
\.


--
-- Data for Name: women_profiles; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.women_profiles (id, user_id, headline, bio, location, profile_image, visibility, looking_for, availability, verified_member, completion_percentage, created_at, updated_at) FROM stdin;
\.


--
-- Name: replit_database_migrations_v1_id_seq; Type: SEQUENCE SET; Schema: _system; Owner: neondb_owner
--

SELECT pg_catalog.setval('_system.replit_database_migrations_v1_id_seq', 17, true);


--
-- Name: ai_usage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.ai_usage_id_seq', 1, false);


--
-- Name: experience_sections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.experience_sections_id_seq', 1, false);


--
-- Name: section_completions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.section_completions_id_seq', 1, false);


--
-- Name: section_resources_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.section_resources_id_seq', 1, false);


--
-- Name: replit_database_migrations_v1 replit_database_migrations_v1_pkey; Type: CONSTRAINT; Schema: _system; Owner: neondb_owner
--

ALTER TABLE ONLY _system.replit_database_migrations_v1
    ADD CONSTRAINT replit_database_migrations_v1_pkey PRIMARY KEY (id);


--
-- Name: accelerator_cohorts accelerator_cohorts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.accelerator_cohorts
    ADD CONSTRAINT accelerator_cohorts_pkey PRIMARY KEY (id);


--
-- Name: accelerator_enrollments accelerator_enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.accelerator_enrollments
    ADD CONSTRAINT accelerator_enrollments_pkey PRIMARY KEY (id);


--
-- Name: accelerator_milestone_progress accelerator_milestone_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.accelerator_milestone_progress
    ADD CONSTRAINT accelerator_milestone_progress_pkey PRIMARY KEY (id);


--
-- Name: accelerator_milestones accelerator_milestones_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.accelerator_milestones
    ADD CONSTRAINT accelerator_milestones_pkey PRIMARY KEY (id);


--
-- Name: achievements achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_pkey PRIMARY KEY (id);


--
-- Name: ai_usage ai_usage_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ai_usage
    ADD CONSTRAINT ai_usage_pkey PRIMARY KEY (id);


--
-- Name: app_atelier_usage app_atelier_usage_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.app_atelier_usage
    ADD CONSTRAINT app_atelier_usage_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: cohort_capacity cohort_capacity_cohort_name_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cohort_capacity
    ADD CONSTRAINT cohort_capacity_cohort_name_unique UNIQUE (cohort_name);


--
-- Name: cohort_capacity cohort_capacity_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cohort_capacity
    ADD CONSTRAINT cohort_capacity_pkey PRIMARY KEY (id);


--
-- Name: companion_activities companion_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.companion_activities
    ADD CONSTRAINT companion_activities_pkey PRIMARY KEY (id);


--
-- Name: companions companions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.companions
    ADD CONSTRAINT companions_pkey PRIMARY KEY (id);


--
-- Name: companions companions_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.companions
    ADD CONSTRAINT companions_user_id_unique UNIQUE (user_id);


--
-- Name: direct_messages direct_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.direct_messages
    ADD CONSTRAINT direct_messages_pkey PRIMARY KEY (id);


--
-- Name: email_leads email_leads_email_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.email_leads
    ADD CONSTRAINT email_leads_email_unique UNIQUE (email);


--
-- Name: email_leads email_leads_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.email_leads
    ADD CONSTRAINT email_leads_pkey PRIMARY KEY (id);


--
-- Name: experience_progress experience_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.experience_progress
    ADD CONSTRAINT experience_progress_pkey PRIMARY KEY (id);


--
-- Name: experience_sections experience_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.experience_sections
    ADD CONSTRAINT experience_sections_pkey PRIMARY KEY (id);


--
-- Name: founder_insights founder_insights_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.founder_insights
    ADD CONSTRAINT founder_insights_pkey PRIMARY KEY (id);


--
-- Name: glow_up_journal glow_up_journal_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.glow_up_journal
    ADD CONSTRAINT glow_up_journal_pkey PRIMARY KEY (id);


--
-- Name: glow_up_profiles glow_up_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.glow_up_profiles
    ADD CONSTRAINT glow_up_profiles_pkey PRIMARY KEY (id);


--
-- Name: glow_up_profiles glow_up_profiles_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.glow_up_profiles
    ADD CONSTRAINT glow_up_profiles_user_id_unique UNIQUE (user_id);


--
-- Name: glow_up_progress glow_up_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.glow_up_progress
    ADD CONSTRAINT glow_up_progress_pkey PRIMARY KEY (id);


--
-- Name: glow_up_progress glow_up_progress_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.glow_up_progress
    ADD CONSTRAINT glow_up_progress_user_id_unique UNIQUE (user_id);


--
-- Name: group_sessions group_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.group_sessions
    ADD CONSTRAINT group_sessions_pkey PRIMARY KEY (id);


--
-- Name: insight_interactions insight_interactions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.insight_interactions
    ADD CONSTRAINT insight_interactions_pkey PRIMARY KEY (id);


--
-- Name: journal_entries journal_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.journal_entries
    ADD CONSTRAINT journal_entries_pkey PRIMARY KEY (id);


--
-- Name: one_on_one_bookings one_on_one_bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.one_on_one_bookings
    ADD CONSTRAINT one_on_one_bookings_pkey PRIMARY KEY (id);


--
-- Name: opportunities opportunities_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.opportunities
    ADD CONSTRAINT opportunities_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_token_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_token_unique UNIQUE (token);


--
-- Name: personalization_questions personalization_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.personalization_questions
    ADD CONSTRAINT personalization_questions_pkey PRIMARY KEY (id);


--
-- Name: profile_activity_feed profile_activity_feed_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.profile_activity_feed
    ADD CONSTRAINT profile_activity_feed_pkey PRIMARY KEY (id);


--
-- Name: profile_services profile_services_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.profile_services
    ADD CONSTRAINT profile_services_pkey PRIMARY KEY (id);


--
-- Name: profile_skills profile_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.profile_skills
    ADD CONSTRAINT profile_skills_pkey PRIMARY KEY (id);


--
-- Name: quiz_submissions quiz_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quiz_submissions
    ADD CONSTRAINT quiz_submissions_pkey PRIMARY KEY (id);


--
-- Name: retro_camera_photos retro_camera_photos_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.retro_camera_photos
    ADD CONSTRAINT retro_camera_photos_pkey PRIMARY KEY (id);


--
-- Name: ritual_progress ritual_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ritual_progress
    ADD CONSTRAINT ritual_progress_pkey PRIMARY KEY (id);


--
-- Name: section_completions section_completions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.section_completions
    ADD CONSTRAINT section_completions_pkey PRIMARY KEY (id);


--
-- Name: section_resources section_resources_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.section_resources
    ADD CONSTRAINT section_resources_pkey PRIMARY KEY (id);


--
-- Name: session_registrations session_registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.session_registrations
    ADD CONSTRAINT session_registrations_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: skills_trades skills_trades_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.skills_trades
    ADD CONSTRAINT skills_trades_pkey PRIMARY KEY (id);


--
-- Name: spaces spaces_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.spaces
    ADD CONSTRAINT spaces_pkey PRIMARY KEY (id);


--
-- Name: spaces spaces_slug_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.spaces
    ADD CONSTRAINT spaces_slug_unique UNIQUE (slug);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_stripe_customer_id_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_stripe_customer_id_unique UNIQUE (stripe_customer_id);


--
-- Name: subscriptions subscriptions_stripe_subscription_id_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_stripe_subscription_id_unique UNIQUE (stripe_subscription_id);


--
-- Name: thought_leadership_posts thought_leadership_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.thought_leadership_posts
    ADD CONSTRAINT thought_leadership_posts_pkey PRIMARY KEY (id);


--
-- Name: thought_leadership_progress thought_leadership_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.thought_leadership_progress
    ADD CONSTRAINT thought_leadership_progress_pkey PRIMARY KEY (id);


--
-- Name: thought_leadership_progress thought_leadership_progress_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.thought_leadership_progress
    ADD CONSTRAINT thought_leadership_progress_user_id_unique UNIQUE (user_id);


--
-- Name: transformational_experiences transformational_experiences_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transformational_experiences
    ADD CONSTRAINT transformational_experiences_pkey PRIMARY KEY (id);


--
-- Name: transformational_experiences transformational_experiences_slug_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transformational_experiences
    ADD CONSTRAINT transformational_experiences_slug_unique UNIQUE (slug);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: women_profiles women_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.women_profiles
    ADD CONSTRAINT women_profiles_pkey PRIMARY KEY (id);


--
-- Name: idx_replit_database_migrations_v1_build_id; Type: INDEX; Schema: _system; Owner: neondb_owner
--

CREATE UNIQUE INDEX idx_replit_database_migrations_v1_build_id ON _system.replit_database_migrations_v1 USING btree (build_id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "IDX_session_expire" ON public.sessions USING btree (expire);


--
-- Name: idx_1on1_date; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_1on1_date ON public.one_on_one_bookings USING btree (scheduled_date);


--
-- Name: idx_1on1_status; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_1on1_status ON public.one_on_one_bookings USING btree (status);


--
-- Name: idx_1on1_type; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_1on1_type ON public.one_on_one_bookings USING btree (booking_type);


--
-- Name: idx_1on1_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_1on1_user ON public.one_on_one_bookings USING btree (user_id);


--
-- Name: idx_achievement_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_achievement_key ON public.achievements USING btree (achievement_key);


--
-- Name: idx_achievement_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_achievement_user ON public.achievements USING btree (user_id);


--
-- Name: idx_activity_profile; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_activity_profile ON public.profile_activity_feed USING btree (profile_id);


--
-- Name: idx_activity_type; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_activity_type ON public.profile_activity_feed USING btree (activity_type);


--
-- Name: idx_app_atelier_user_unique; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX idx_app_atelier_user_unique ON public.app_atelier_usage USING btree (user_id);


--
-- Name: idx_cohort_capacity_name; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_cohort_capacity_name ON public.cohort_capacity USING btree (cohort_name);


--
-- Name: idx_companion_activity_created; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_companion_activity_created ON public.companion_activities USING btree (created_at);


--
-- Name: idx_companion_activity_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_companion_activity_user ON public.companion_activities USING btree (user_id);


--
-- Name: idx_companion_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_companion_user ON public.companions USING btree (user_id);


--
-- Name: idx_completion_experience; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_completion_experience ON public.section_completions USING btree (experience_id);


--
-- Name: idx_completion_section; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_completion_section ON public.section_completions USING btree (section_id);


--
-- Name: idx_completion_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_completion_user ON public.section_completions USING btree (user_id);


--
-- Name: idx_completion_user_section_unique; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX idx_completion_user_section_unique ON public.section_completions USING btree (user_id, section_id);


--
-- Name: idx_email_leads_created; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_email_leads_created ON public.email_leads USING btree (created_at);


--
-- Name: idx_email_leads_email; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_email_leads_email ON public.email_leads USING btree (email);


--
-- Name: idx_enrollment_cohort; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_enrollment_cohort ON public.accelerator_enrollments USING btree (cohort_id);


--
-- Name: idx_enrollment_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_enrollment_user ON public.accelerator_enrollments USING btree (user_id);


--
-- Name: idx_enrollment_user_cohort_unique; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX idx_enrollment_user_cohort_unique ON public.accelerator_enrollments USING btree (user_id, cohort_id);


--
-- Name: idx_exp_progress_experience; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_exp_progress_experience ON public.experience_progress USING btree (experience_id);


--
-- Name: idx_exp_progress_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_exp_progress_user ON public.experience_progress USING btree (user_id);


--
-- Name: idx_exp_progress_user_experience_unique; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX idx_exp_progress_user_experience_unique ON public.experience_progress USING btree (user_id, experience_id);


--
-- Name: idx_experience_active_sort; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_experience_active_sort ON public.transformational_experiences USING btree (is_active, sort_order);


--
-- Name: idx_experience_space; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_experience_space ON public.transformational_experiences USING btree (space_id);


--
-- Name: idx_experience_space_active_sort; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_experience_space_active_sort ON public.transformational_experiences USING btree (space_id, is_active, sort_order);


--
-- Name: idx_experience_tier; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_experience_tier ON public.transformational_experiences USING btree (tier);


--
-- Name: idx_founder_insight_published; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_founder_insight_published ON public.founder_insights USING btree (published_at);


--
-- Name: idx_founder_insight_tier; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_founder_insight_tier ON public.founder_insights USING btree (min_tier_required);


--
-- Name: idx_founder_insight_type; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_founder_insight_type ON public.founder_insights USING btree (insight_type);


--
-- Name: idx_glowup_journal_day; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_glowup_journal_day ON public.glow_up_journal USING btree (day);


--
-- Name: idx_glowup_journal_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_glowup_journal_user ON public.glow_up_journal USING btree (user_id);


--
-- Name: idx_glowup_journal_user_day; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_glowup_journal_user_day ON public.glow_up_journal USING btree (user_id, day);


--
-- Name: idx_glowup_profile_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_glowup_profile_user ON public.glow_up_profiles USING btree (user_id);


--
-- Name: idx_glowup_progress_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_glowup_progress_user ON public.glow_up_progress USING btree (user_id);


--
-- Name: idx_group_session_date; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_group_session_date ON public.group_sessions USING btree (scheduled_date);


--
-- Name: idx_group_session_status; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_group_session_status ON public.group_sessions USING btree (status);


--
-- Name: idx_group_session_type; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_group_session_type ON public.group_sessions USING btree (session_type);


--
-- Name: idx_insight_int_insight; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_insight_int_insight ON public.insight_interactions USING btree (insight_id);


--
-- Name: idx_insight_int_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_insight_int_user ON public.insight_interactions USING btree (user_id);


--
-- Name: idx_journal_created; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_journal_created ON public.journal_entries USING btree (created_at);


--
-- Name: idx_journal_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_journal_user ON public.journal_entries USING btree (user_id);


--
-- Name: idx_journal_user_date; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_journal_user_date ON public.journal_entries USING btree (user_id, date);


--
-- Name: idx_message_recipient; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_message_recipient ON public.direct_messages USING btree (recipient_id);


--
-- Name: idx_message_sender; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_message_sender ON public.direct_messages USING btree (sender_id);


--
-- Name: idx_milestone_progress_enrollment; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_milestone_progress_enrollment ON public.accelerator_milestone_progress USING btree (enrollment_id);


--
-- Name: idx_milestone_progress_enrollment_milestone_unique; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX idx_milestone_progress_enrollment_milestone_unique ON public.accelerator_milestone_progress USING btree (enrollment_id, milestone_id);


--
-- Name: idx_milestone_progress_milestone; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_milestone_progress_milestone ON public.accelerator_milestone_progress USING btree (milestone_id);


--
-- Name: idx_opportunity_poster; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_opportunity_poster ON public.opportunities USING btree (poster_id);


--
-- Name: idx_personalization_experience; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_personalization_experience ON public.personalization_questions USING btree (experience_id);


--
-- Name: idx_profile_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_profile_user ON public.women_profiles USING btree (user_id);


--
-- Name: idx_profile_visibility; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_profile_visibility ON public.women_profiles USING btree (visibility);


--
-- Name: idx_quiz_submission_created; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_quiz_submission_created ON public.quiz_submissions USING btree (created_at);


--
-- Name: idx_quiz_submission_email; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_quiz_submission_email ON public.quiz_submissions USING btree (email);


--
-- Name: idx_quiz_submission_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_quiz_submission_user ON public.quiz_submissions USING btree (user_id);


--
-- Name: idx_reset_token; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_reset_token ON public.password_reset_tokens USING btree (token);


--
-- Name: idx_reset_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_reset_user ON public.password_reset_tokens USING btree (user_id);


--
-- Name: idx_resource_section; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_resource_section ON public.section_resources USING btree (section_id);


--
-- Name: idx_retro_photo_created; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_retro_photo_created ON public.retro_camera_photos USING btree (created_at);


--
-- Name: idx_retro_photo_public; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_retro_photo_public ON public.retro_camera_photos USING btree (is_public);


--
-- Name: idx_retro_photo_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_retro_photo_user ON public.retro_camera_photos USING btree (user_id);


--
-- Name: idx_ritual_progress_slug; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_ritual_progress_slug ON public.ritual_progress USING btree (ritual_slug);


--
-- Name: idx_ritual_progress_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_ritual_progress_user ON public.ritual_progress USING btree (user_id);


--
-- Name: idx_section_experience; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_section_experience ON public.experience_sections USING btree (experience_id);


--
-- Name: idx_section_sort; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_section_sort ON public.experience_sections USING btree (experience_id, sort_order);


--
-- Name: idx_service_profile; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_service_profile ON public.profile_services USING btree (profile_id);


--
-- Name: idx_session_reg_session; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_session_reg_session ON public.session_registrations USING btree (session_id);


--
-- Name: idx_session_reg_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_session_reg_user ON public.session_registrations USING btree (user_id);


--
-- Name: idx_skill_profile; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_skill_profile ON public.profile_skills USING btree (profile_id);


--
-- Name: idx_space_active; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_space_active ON public.spaces USING btree (is_active);


--
-- Name: idx_space_active_sort; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_space_active_sort ON public.spaces USING btree (is_active, sort_order);


--
-- Name: idx_space_slug; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_space_slug ON public.spaces USING btree (slug);


--
-- Name: idx_subscription_stripe_customer; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_subscription_stripe_customer ON public.subscriptions USING btree (stripe_customer_id);


--
-- Name: idx_subscription_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_subscription_user ON public.subscriptions USING btree (user_id);


--
-- Name: idx_tlp_created; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_tlp_created ON public.thought_leadership_posts USING btree (created_at);


--
-- Name: idx_tlp_day; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_tlp_day ON public.thought_leadership_posts USING btree (day_number);


--
-- Name: idx_tlp_public; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_tlp_public ON public.thought_leadership_posts USING btree (is_public);


--
-- Name: idx_tlp_slug; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_tlp_slug ON public.thought_leadership_posts USING btree (slug);


--
-- Name: idx_tlp_status; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_tlp_status ON public.thought_leadership_posts USING btree (status);


--
-- Name: idx_tlp_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_tlp_user ON public.thought_leadership_posts USING btree (user_id);


--
-- Name: idx_tlprog_status; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_tlprog_status ON public.thought_leadership_progress USING btree (journey_status);


--
-- Name: idx_tlprog_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_tlprog_user ON public.thought_leadership_progress USING btree (user_id);


--
-- Name: idx_trade_profile; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_trade_profile ON public.skills_trades USING btree (profile_id);


--
-- Name: idx_trade_status; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_trade_status ON public.skills_trades USING btree (status);


--
-- Name: accelerator_enrollments accelerator_enrollments_cohort_id_accelerator_cohorts_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.accelerator_enrollments
    ADD CONSTRAINT accelerator_enrollments_cohort_id_accelerator_cohorts_id_fk FOREIGN KEY (cohort_id) REFERENCES public.accelerator_cohorts(id) ON DELETE CASCADE;


--
-- Name: accelerator_enrollments accelerator_enrollments_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.accelerator_enrollments
    ADD CONSTRAINT accelerator_enrollments_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: accelerator_milestone_progress accelerator_milestone_progress_enrollment_id_accelerator_enroll; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.accelerator_milestone_progress
    ADD CONSTRAINT accelerator_milestone_progress_enrollment_id_accelerator_enroll FOREIGN KEY (enrollment_id) REFERENCES public.accelerator_enrollments(id) ON DELETE CASCADE;


--
-- Name: accelerator_milestone_progress accelerator_milestone_progress_milestone_id_accelerator_milesto; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.accelerator_milestone_progress
    ADD CONSTRAINT accelerator_milestone_progress_milestone_id_accelerator_milesto FOREIGN KEY (milestone_id) REFERENCES public.accelerator_milestones(id) ON DELETE CASCADE;


--
-- Name: achievements achievements_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: ai_usage ai_usage_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ai_usage
    ADD CONSTRAINT ai_usage_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: app_atelier_usage app_atelier_usage_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.app_atelier_usage
    ADD CONSTRAINT app_atelier_usage_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: audit_logs audit_logs_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: companion_activities companion_activities_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.companion_activities
    ADD CONSTRAINT companion_activities_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: companions companions_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.companions
    ADD CONSTRAINT companions_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: direct_messages direct_messages_recipient_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.direct_messages
    ADD CONSTRAINT direct_messages_recipient_id_users_id_fk FOREIGN KEY (recipient_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: direct_messages direct_messages_sender_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.direct_messages
    ADD CONSTRAINT direct_messages_sender_id_users_id_fk FOREIGN KEY (sender_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: experience_progress experience_progress_experience_id_transformational_experiences_; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.experience_progress
    ADD CONSTRAINT experience_progress_experience_id_transformational_experiences_ FOREIGN KEY (experience_id) REFERENCES public.transformational_experiences(id) ON DELETE CASCADE;


--
-- Name: experience_progress experience_progress_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.experience_progress
    ADD CONSTRAINT experience_progress_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: experience_sections experience_sections_experience_id_transformational_experiences_; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.experience_sections
    ADD CONSTRAINT experience_sections_experience_id_transformational_experiences_ FOREIGN KEY (experience_id) REFERENCES public.transformational_experiences(id) ON DELETE CASCADE;


--
-- Name: glow_up_journal glow_up_journal_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.glow_up_journal
    ADD CONSTRAINT glow_up_journal_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: glow_up_profiles glow_up_profiles_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.glow_up_profiles
    ADD CONSTRAINT glow_up_profiles_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: glow_up_progress glow_up_progress_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.glow_up_progress
    ADD CONSTRAINT glow_up_progress_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: insight_interactions insight_interactions_insight_id_founder_insights_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.insight_interactions
    ADD CONSTRAINT insight_interactions_insight_id_founder_insights_id_fk FOREIGN KEY (insight_id) REFERENCES public.founder_insights(id) ON DELETE CASCADE;


--
-- Name: insight_interactions insight_interactions_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.insight_interactions
    ADD CONSTRAINT insight_interactions_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: journal_entries journal_entries_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.journal_entries
    ADD CONSTRAINT journal_entries_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: one_on_one_bookings one_on_one_bookings_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.one_on_one_bookings
    ADD CONSTRAINT one_on_one_bookings_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: opportunities opportunities_poster_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.opportunities
    ADD CONSTRAINT opportunities_poster_id_users_id_fk FOREIGN KEY (poster_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: password_reset_tokens password_reset_tokens_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: personalization_questions personalization_questions_experience_id_transformational_experi; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.personalization_questions
    ADD CONSTRAINT personalization_questions_experience_id_transformational_experi FOREIGN KEY (experience_id) REFERENCES public.transformational_experiences(id) ON DELETE CASCADE;


--
-- Name: profile_activity_feed profile_activity_feed_profile_id_women_profiles_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.profile_activity_feed
    ADD CONSTRAINT profile_activity_feed_profile_id_women_profiles_id_fk FOREIGN KEY (profile_id) REFERENCES public.women_profiles(id) ON DELETE CASCADE;


--
-- Name: profile_services profile_services_profile_id_women_profiles_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.profile_services
    ADD CONSTRAINT profile_services_profile_id_women_profiles_id_fk FOREIGN KEY (profile_id) REFERENCES public.women_profiles(id) ON DELETE CASCADE;


--
-- Name: profile_skills profile_skills_profile_id_women_profiles_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.profile_skills
    ADD CONSTRAINT profile_skills_profile_id_women_profiles_id_fk FOREIGN KEY (profile_id) REFERENCES public.women_profiles(id) ON DELETE CASCADE;


--
-- Name: quiz_submissions quiz_submissions_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.quiz_submissions
    ADD CONSTRAINT quiz_submissions_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: retro_camera_photos retro_camera_photos_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.retro_camera_photos
    ADD CONSTRAINT retro_camera_photos_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: ritual_progress ritual_progress_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ritual_progress
    ADD CONSTRAINT ritual_progress_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: section_completions section_completions_experience_id_transformational_experiences_; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.section_completions
    ADD CONSTRAINT section_completions_experience_id_transformational_experiences_ FOREIGN KEY (experience_id) REFERENCES public.transformational_experiences(id) ON DELETE CASCADE;


--
-- Name: section_completions section_completions_section_id_experience_sections_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.section_completions
    ADD CONSTRAINT section_completions_section_id_experience_sections_id_fk FOREIGN KEY (section_id) REFERENCES public.experience_sections(id) ON DELETE CASCADE;


--
-- Name: section_completions section_completions_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.section_completions
    ADD CONSTRAINT section_completions_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: section_resources section_resources_section_id_experience_sections_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.section_resources
    ADD CONSTRAINT section_resources_section_id_experience_sections_id_fk FOREIGN KEY (section_id) REFERENCES public.experience_sections(id) ON DELETE CASCADE;


--
-- Name: session_registrations session_registrations_session_id_group_sessions_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.session_registrations
    ADD CONSTRAINT session_registrations_session_id_group_sessions_id_fk FOREIGN KEY (session_id) REFERENCES public.group_sessions(id) ON DELETE CASCADE;


--
-- Name: session_registrations session_registrations_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.session_registrations
    ADD CONSTRAINT session_registrations_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: skills_trades skills_trades_profile_id_women_profiles_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.skills_trades
    ADD CONSTRAINT skills_trades_profile_id_women_profiles_id_fk FOREIGN KEY (profile_id) REFERENCES public.women_profiles(id) ON DELETE CASCADE;


--
-- Name: subscriptions subscriptions_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: thought_leadership_posts thought_leadership_posts_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.thought_leadership_posts
    ADD CONSTRAINT thought_leadership_posts_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: thought_leadership_progress thought_leadership_progress_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.thought_leadership_progress
    ADD CONSTRAINT thought_leadership_progress_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: transformational_experiences transformational_experiences_space_id_spaces_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transformational_experiences
    ADD CONSTRAINT transformational_experiences_space_id_spaces_id_fk FOREIGN KEY (space_id) REFERENCES public.spaces(id) ON DELETE CASCADE;


--
-- Name: women_profiles women_profiles_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.women_profiles
    ADD CONSTRAINT women_profiles_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

\unrestrict ANHkICKHQ5Sm1TRApIeFbdLnFo1879ayuaD9qbk2zxSYuN8UjEXLWX7nI4E2nno

