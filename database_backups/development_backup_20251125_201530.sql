--
-- PostgreSQL database dump
--

\restrict Ch607wgYOX2rm4fNmbWb7jz7eifZjHLqaC9iR6e29Mu4cVilEx3FYG9McMc8jGr

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

SET default_tablespace = '';

SET default_table_access_method = heap;

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
\.


--
-- Data for Name: companions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.companions (id, user_id, name, stage, current_mood, growth, inspiration, connection, mastery, last_fed, last_played, last_socialized, unlocked_accessories, equipped_accessories, created_at, updated_at) FROM stdin;
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
\.


--
-- Data for Name: glow_up_profiles; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.glow_up_profiles (id, user_id, name, brand_type, niche, platform, goal, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: glow_up_progress; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.glow_up_progress (id, user_id, completed_days, current_day, started_at, completed_at, last_updated) FROM stdin;
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
we7ummx6cwfotk9XfiyfptlTGrwLv_KZ	{"cookie": {"path": "/", "secure": false, "expires": "2025-11-15T01:30:20.619Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 86400000}, "userId": "cf5ac169-579c-4b22-9652-7cc0a270c80d"}	2025-11-15 01:30:21
tFkuqggPMRu0NBkVBgjpsnO_jgRODtMW	{"cookie": {"path": "/", "secure": false, "expires": "2025-10-26T18:22:04.380Z", "httpOnly": true, "originalMaxAge": 604800000}, "passport": {"user": {"claims": {"aud": "a55e7587-9107-4fc5-bc17-de915e2014e9", "exp": 1760901724, "iat": 1760898124, "iss": "https://replit.com/oidc", "sub": "48741358", "email": "nadia.benbr@gmail.com", "at_hash": "P8LaH8o9gTyWMUcWJWYtGw", "username": "nadiabb", "auth_time": 1760765827, "last_name": "Ma", "first_name": "Nadia"}, "expires_at": 1760901724, "access_token": "ecPtCw22eYUKfJ8JzzBiflJttbV497ABUhejal3qA_i", "refresh_token": "zTUk5kkw_cvS7jHwuoKlCiqmiwWyOXFpFNJSQxDppDe"}}}	2025-10-27 17:10:11
dt4boCsNX7gQ3CtDpc17hSjzvoPAqfh2	{"cookie": {"path": "/", "secure": false, "expires": "2025-10-26T18:40:37.562Z", "httpOnly": true, "originalMaxAge": 604800000}, "replit.com": {"code_verifier": "FqLVm0-HBNgAy2QvqEclMfohfkJOazZA_TlM2e3mtaw"}}	2025-10-26 18:40:38
_FfudDpNwAJw6WKQPH2WH0hppyiT54j0	{"cookie": {"path": "/", "secure": false, "expires": "2025-10-26T18:40:39.779Z", "httpOnly": true, "originalMaxAge": 604800000}, "replit.com": {"code_verifier": "Hv_aj5GXp0YD4MOgVSjImZcXBjZi0s1RPWuBXcgSVxc"}}	2025-10-26 18:40:40
H1h-24-O11_qJd1kiX5j-1GrHlZGeeQG	{"cookie": {"path": "/", "secure": false, "expires": "2025-10-26T21:03:11.910Z", "httpOnly": true, "originalMaxAge": 604800000}, "passport": {"user": {"claims": {"aud": "a55e7587-9107-4fc5-bc17-de915e2014e9", "exp": 1760911391, "iat": 1760907791, "iss": "https://replit.com/oidc", "sub": "48741358", "email": "nadia.benbr@gmail.com", "at_hash": "B2aiP-ijReU6S0SYz6KKkg", "username": "nadiabb", "auth_time": 1760768348, "last_name": "Ma", "first_name": "Nadia"}, "expires_at": 1760911391, "access_token": "c03edeelvbkuO6fmg7ZvPEWxIp-SUVmPVB1Dv3-MJ0b", "refresh_token": "9fRhPZhj-kPM0mXeVxSnajx38oFaZLiXr3V-CmXCsGb"}}}	2025-11-02 05:09:29
LY5IilaGI9ahvhD54IOtaByodUAoEn6F	{"cookie": {"path": "/", "secure": false, "expires": "2025-10-26T22:32:09.651Z", "httpOnly": true, "originalMaxAge": 604800000}, "replit.com": {"code_verifier": "h3Z_NIIfjHSEhNo4ndcnAR_8-5GHVgFSTSYDviGs1r8"}}	2025-10-26 22:32:10
O_VWEEyWgWTBU391OLyWDfP6dvo9BIFN	{"cookie": {"path": "/", "secure": false, "expires": "2025-10-26T22:37:04.064Z", "httpOnly": true, "originalMaxAge": 604800000}, "replit.com": {"code_verifier": "12TpYn6x-CIkqK7mcd72AyOJBpxuSzRPvOeTgcyHi_0"}}	2025-10-26 22:37:05
cnD_Di5JND6p43fzQjg2YHqEw0t3lS_9	{"cookie": {"path": "/", "secure": false, "expires": "2025-10-26T22:37:04.736Z", "httpOnly": true, "originalMaxAge": 604800000}, "replit.com": {"code_verifier": "MjfnFPz9HJbSJ-yLKaMYqfO_Gz-35SmlhTL6BlCA0go"}}	2025-10-26 22:37:05
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
web3	Web3	web3	Master decentralized technologies and understand the future of the internet. Build your Web3 fluency from fundamentals to real-world applications.	Globe	hyper-violet	1	t	2025-11-03 03:23:39.592115	2025-11-20 17:28:38.031557
crypto	NFT/Blockchain/Crypto	crypto	Navigate the world of digital assets with confidence. From NFTs to blockchain basics to cryptocurrency trading—understand it all and leverage it for your future.	Coins	magenta-quartz	2	t	2025-11-06 14:09:01.399451	2025-11-20 17:28:40.163437
ai	AI	ai	Transform how you work with AI tools. From custom GPTs to AI-powered content creation, become fluent in the language of artificial intelligence.	Sparkles	cyber-fuchsia	3	t	2025-11-03 03:23:39.626439	2025-11-20 17:28:40.188357
metaverse	Metaverse	metaverse	Navigate virtual worlds with confidence. Discover opportunities in immersive digital spaces and build your presence in the metaverse.	Boxes	aurora-teal	4	t	2025-11-03 03:23:39.649504	2025-11-20 17:28:40.212736
nfts	NFTs	nfts	Create, buy, sell, and leverage NFTs. Understand digital ownership and how to build value in the NFT economy.	Image	liquid-gold	5	t	2025-11-15 01:07:54.846862	2025-11-20 17:28:40.234643
branding	Branding	branding	Build your personal and professional brand with AI-powered tools. Master content creation, community building, and thought leadership for the digital age.	Megaphone	liquid-gold	6	t	2025-11-03 03:23:39.724292	2025-11-20 17:28:40.25868
moms	Moms	moms	A dedicated space for mothers navigating tech careers and entrepreneurship. Balance, growth, and community for moms building in AI and Web3.	Heart	hyper-violet	7	t	2025-11-06 14:08:04.812778	2025-11-20 17:28:40.281149
app-atelier	App Atelier	app-atelier	Build apps without code. Master no-code tools and ship your first product in weeks, not months.	Hammer	cyber-fuchsia	8	t	2025-11-07 00:33:56.990779	2025-11-20 17:28:40.305033
founders-club	Founder's Club	founders-club	Launch and scale your business. From idea validation to first revenue—build a profitable company.	Rocket	liquid-gold	9	t	2025-11-07 03:13:23.686109	2025-11-20 17:28:40.327977
digital-sales	Digital Sales Accelerator	digital-sales	Launch your online sales in 3 days. Shopify, Instagram Shopping, TikTok Shop, and more—all live workshops.	ShoppingCart	magenta-quartz	10	t	2025-11-10 03:21:16.950689	2025-11-20 17:28:40.352408
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
\.


--
-- Data for Name: thought_leadership_progress; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.thought_leadership_progress (id, user_id, current_day, completed_days, current_streak, longest_streak, total_posts_generated, total_posts_published, last_activity_date, journey_status, started_at, completed_at, updated_at, brand_expertise, brand_niche, problem_solved, unique_story, current_goals, brand_onboarding_completed, lessons_completed, practices_submitted, practice_reflections) FROM stdin;
\.


--
-- Data for Name: transformational_experiences; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.transformational_experiences (id, space_id, title, slug, description, learning_objectives, tier, estimated_minutes, sort_order, content, personalization_enabled, is_active, created_at, updated_at) FROM stdin;
73e13f33-3ed4-4a47-80e4-aaf2528c2226	moms	Teaching Your Kids About AI & Tech	teaching-kids-ai	Prepare your children for the AI-powered future. Learn age-appropriate ways to introduce AI concepts, coding basics, and digital literacy to kids from preschool to teens.	["Introduce AI concepts to kids ages 4-18 in fun, accessible ways", "Teach basic coding and computational thinking", "Help kids use AI tools safely and responsibly", "Create AI-powered projects together as a family", "Build digital literacy and critical thinking skills"]	free	50	2	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Teaching Your Kids About AI & Tech. You're here because you're ready to master prepare your children for the ai-powered future. learn age-appropriate ways to introduce ai concepts, coding basics, and digital literacy to kids from preschool to teens.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Introduce AI concepts to kids ages 4-18 in fun, accessible ways. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master teaching your kids about ai & tech."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Teach basic coding and computational thinking. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Introduce AI concepts to kids ages 4-18 in fun, accessible ways. Week 2 - Practice and refine. Week 3 - Teach basic coding and computational thinking. Week 4 - Help kids use AI tools safely and responsibly. Stay consistent and watch your skills compound."}]}	t	t	2025-11-14 01:54:49.378075	2025-11-15 02:33:49.774
web3-3-smart-contracts	web3	Smart Contracts 101	smart-contracts-101	Understand how smart contracts work and how they're revolutionizing business agreements, payments, and automation.	["Explain smart contracts in simple terms", "Identify use cases for your industry", "Understand the benefits and limitations"]	pro	35	3	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Smart Contracts 101. You're here because you're ready to master understand how smart contracts work and how they're revolutionizing business agreements, payments, and automation.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Explain smart contracts in simple terms. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master smart contracts 101."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Identify use cases for your industry. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Explain smart contracts in simple terms. Week 2 - Practice and refine. Week 3 - Identify use cases for your industry. Week 4 - Understand the benefits and limitations. Stay consistent and watch your skills compound."}]}	t	t	2025-11-03 17:44:34.296647	2025-11-20 17:28:40.434162
metaverse-6-brand	metaverse	Build Your Metaverse Presence	metaverse-presence	Establish your brand in the metaverse. Create immersive experiences that people remember.	["Design your metaverse brand strategy", "Create immersive experiences", "Build community in virtual spaces"]	pro	45	6	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Build Your Metaverse Presence. You're here because you're ready to master establish your brand in the metaverse. create immersive experiences that people remember.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Design your metaverse brand strategy. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master build your metaverse presence."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Create immersive experiences. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Design your metaverse brand strategy. Week 2 - Practice and refine. Week 3 - Create immersive experiences. Week 4 - Build community in virtual spaces. Stay consistent and watch your skills compound."}]}	t	t	2025-11-03 17:44:34.660173	2025-11-20 17:28:40.784671
web3-2-wallets	web3	Digital Wallets Decoded	digital-wallets-decoded	Set up and secure your first crypto wallet. Understand private keys, seed phrases, and how to stay safe in Web3.	["Create your first secure crypto wallet", "Understand private keys and seed phrases", "Implement security best practices"]	pro	30	2	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Digital Wallets Decoded. You're here because you're ready to master set up and secure your first crypto wallet. understand private keys, seed phrases, and how to stay safe in web3.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Create your first secure crypto wallet. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master digital wallets decoded."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Understand private keys and seed phrases. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Create your first secure crypto wallet. Week 2 - Practice and refine. Week 3 - Understand private keys and seed phrases. Week 4 - Implement security best practices. Stay consistent and watch your skills compound."}]}	t	t	2025-11-03 17:44:34.270695	2025-11-20 17:28:40.4059
branding-2-content	branding	LinkedIn Authority System: Get Found by Opportunities	linkedin-authority-system	Build a LinkedIn presence so strong that opportunities find YOU. Master the content formats, engagement strategies, and growth tactics that turn your profile into a client-attracting machine.	["Create a LinkedIn content system that runs on 3 hours/week", "Write posts that generate 10X+ engagement using proven frameworks", "Build strategic relationships with decision-makers in your industry", "Use AI to multiply your content output without losing your voice", "Turn LinkedIn connections into $5K+ consulting contracts"]	pro	90	2	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to LinkedIn Authority System: Get Found by Opportunities. You're here because you're ready to master build a linkedin presence so strong that opportunities find you. master the content formats, engagement strategies, and growth tactics that turn your profile into a client-attracting machine.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Create a LinkedIn content system that runs on 3 hours/week. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master linkedin authority system: get found by opportunities."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Write posts that generate 10X+ engagement using proven frameworks. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Create a LinkedIn content system that runs on 3 hours/week. Week 2 - Practice and refine. Week 3 - Write posts that generate 10X+ engagement using proven frameworks. Week 4 - Build strategic relationships with decision-makers in your industry. Stay consistent and watch your skills compound."}]}	t	t	2025-11-03 17:44:34.994197	2025-11-20 17:28:41.113855
branding-3-social	branding	AI-Powered Social Media	ai-social-media	Grow your audience with AI. Create engaging content, optimize posting, and build community.	["Generate social content with AI", "Optimize posting times and frequency", "Grow your following strategically"]	pro	30	3	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to AI-Powered Social Media. You're here because you're ready to master grow your audience with ai. create engaging content, optimize posting, and build community.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Generate social content with AI. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master ai-powered social media."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Optimize posting times and frequency. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Generate social content with AI. Week 2 - Practice and refine. Week 3 - Optimize posting times and frequency. Week 4 - Grow your following strategically. Stay consistent and watch your skills compound."}]}	t	t	2025-11-03 17:44:35.017025	2025-11-20 17:28:41.243268
web3-1-foundations	web3	Web3 Foundations	web3-foundations	Demystify Web3 basics - understand blockchain, decentralization, and why it matters for your business. No tech degree required.	["Understand what Web3 actually means in plain English", "Explain blockchain to clients and colleagues confidently", "Identify real-world Web3 opportunities for your business"]	free	25	1	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Web3 Foundations. You're here because you're ready to master demystify web3 basics - understand blockchain, decentralization, and why it matters for your business. no tech degree required.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Understand what Web3 actually means in plain English. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master web3 foundations."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Explain blockchain to clients and colleagues confidently. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Understand what Web3 actually means in plain English. Week 2 - Practice and refine. Week 3 - Explain blockchain to clients and colleagues confidently. Week 4 - Identify real-world Web3 opportunities for your business. Stay consistent and watch your skills compound."}]}	t	t	2025-11-03 17:44:34.228789	2025-11-20 17:28:40.375588
crypto-4-security	crypto	Crypto Security & Safety	crypto-security	Protect your assets. Master wallet security, avoid scams, and implement best practices.	["Secure your crypto holdings", "Identify and avoid common scams", "Implement multi-layer security"]	pro	30	4	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Crypto Security & Safety. You're here because you're ready to master protect your assets. master wallet security, avoid scams, and implement best practices.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Secure your crypto holdings. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master crypto security & safety."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Identify and avoid common scams. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Secure your crypto holdings. Week 2 - Practice and refine. Week 3 - Identify and avoid common scams. Week 4 - Implement multi-layer security. Stay consistent and watch your skills compound."}]}	t	t	2025-11-10 03:21:26.87713	2025-11-20 17:28:40.877271
branding-1-strategy	branding	Build Your Thought Leadership Foundation	thought-leadership-foundation	Establish yourself as an industry authority without quitting your job. Create the strategic foundation that attracts premium consulting clients, speaking opportunities, and media features.	["Define your unique thought leadership positioning in your industry", "Identify your 3 core expertise pillars that differentiate you", "Create your signature framework that makes you quotable and searchable", "Build your authority roadmap from unknown to AI-searchable expert"]	free	45	1	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Build Your Thought Leadership Foundation. You're here because you're ready to master establish yourself as an industry authority without quitting your job. create the strategic foundation that attracts premium consulting clients, speaking opportunities, and media features.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Define your unique thought leadership positioning in your industry. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master build your thought leadership foundation."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Identify your 3 core expertise pillars that differentiate you. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Define your unique thought leadership positioning in your industry. Week 2 - Practice and refine. Week 3 - Identify your 3 core expertise pillars that differentiate you. Week 4 - Create your signature framework that makes you quotable and searchable. Stay consistent and watch your skills compound."}]}	t	t	2025-11-03 17:44:34.970591	2025-11-20 17:28:41.087195
metaverse-3-events	metaverse	Virtual Events & Experiences	virtual-events	Host conferences, workshops, and networking events in virtual spaces. Reach a global audience.	["Plan and host virtual events", "Engage attendees in 3D spaces", "Monetize virtual experiences"]	pro	30	3	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Virtual Events & Experiences. You're here because you're ready to master host conferences, workshops, and networking events in virtual spaces. reach a global audience.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Plan and host virtual events. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master virtual events & experiences."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Engage attendees in 3D spaces. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Plan and host virtual events. Week 2 - Practice and refine. Week 3 - Engage attendees in 3D spaces. Week 4 - Monetize virtual experiences. Stay consistent and watch your skills compound."}]}	t	t	2025-11-03 17:44:34.584837	2025-11-20 17:28:40.714383
moms-1-ai-foundations	moms	AI for Busy Moms: Your Digital Life Assistant	ai-for-busy-moms	Learn how to use AI tools like ChatGPT to streamline meal planning, homework help, scheduling, and household management. Free up 10+ hours per week.	["Use ChatGPT to create weekly meal plans and grocery lists in minutes", "Generate educational activities and homework support for your kids", "Automate family schedules, reminders, and to-do lists", "Create personalized bedtime stories and learning games with AI", "Use AI to plan birthday parties, vacations, and family events"]	free	45	1	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to AI for Busy Moms: Your Digital Life Assistant. You're here because you're ready to master learn how to use ai tools like chatgpt to streamline meal planning, homework help, scheduling, and household management. free up 10+ hours per week.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Use ChatGPT to create weekly meal plans and grocery lists in minutes. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master ai for busy moms: your digital life assistant."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Generate educational activities and homework support for your kids. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Use ChatGPT to create weekly meal plans and grocery lists in minutes. Week 2 - Practice and refine. Week 3 - Generate educational activities and homework support for your kids. Week 4 - Automate family schedules, reminders, and to-do lists. Stay consistent and watch your skills compound."}]}	t	t	2025-11-11 22:45:41.089091	2025-11-15 02:33:50.67
app-atelier-4-ai-integration	app-atelier	AI-Powered Features	ai-powered-features	Integrate AI capabilities into your app. Add chatbots, content generation, image creation, and smart recommendations.	["Connect OpenAI API to your no-code app", "Build AI-powered features and workflows", "Create personalized user experiences"]	pro	50	4	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to AI-Powered Features. You're here because you're ready to master integrate ai capabilities into your app. add chatbots, content generation, image creation, and smart recommendations.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Connect OpenAI API to your no-code app. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master ai-powered features."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Build AI-powered features and workflows. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Connect OpenAI API to your no-code app. Week 2 - Practice and refine. Week 3 - Build AI-powered features and workflows. Week 4 - Create personalized user experiences. Stay consistent and watch your skills compound."}]}	t	t	2025-11-11 01:42:48.16709	2025-11-20 17:28:41.402584
crypto-6-business	crypto	Accept Crypto in Your Business	accept-crypto	Start accepting cryptocurrency payments. Integrate crypto into your business model.	["Set up crypto payment processing", "Manage crypto business accounting", "Market your crypto-friendly business"]	pro	40	6	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Accept Crypto in Your Business. You're here because you're ready to master start accepting cryptocurrency payments. integrate crypto into your business model.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Set up crypto payment processing. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master accept crypto in your business."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Manage crypto business accounting. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Set up crypto payment processing. Week 2 - Practice and refine. Week 3 - Manage crypto business accounting. Week 4 - Market your crypto-friendly business. Stay consistent and watch your skills compound."}]}	t	t	2025-11-10 03:21:26.922381	2025-11-20 17:28:40.924775
nfts-2-collecting	crypto	NFT Collecting & Investing	nft-collecting	Start your NFT collection strategically. Learn how to evaluate projects, spot quality, and build value.	["Evaluate NFT projects and communities", "Buy your first NFT safely", "Build a strategic NFT portfolio"]	pro	35	2	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to NFT Collecting & Investing. You're here because you're ready to master start your nft collection strategically. learn how to evaluate projects, spot quality, and build value.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Evaluate NFT projects and communities. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master nft collecting & investing."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Buy your first NFT safely. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Evaluate NFT projects and communities. Week 2 - Practice and refine. Week 3 - Buy your first NFT safely. Week 4 - Build a strategic NFT portfolio. Stay consistent and watch your skills compound."}]}	t	t	2025-11-10 03:22:04.747442	2025-11-20 17:28:40.971435
digital-sales-5-operations	digital-sales	Operations & Analytics	operations-analytics	Build systems that scale. Set up inventory sync, order management, customer service automation, and analytics dashboards so you can handle 50+ orders per day smoothly.	["Sync inventory across all platforms automatically", "Set up order management and shipping workflows", "Build analytics dashboard to track key metrics", "Automate customer service with templates and FAQs"]	pro	120	5	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Operations & Analytics. You're here because you're ready to master build systems that scale. set up inventory sync, order management, customer service automation, and analytics dashboards so you can handle 50+ orders per day smoothly.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Sync inventory across all platforms automatically. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master operations & analytics."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Set up order management and shipping workflows. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Sync inventory across all platforms automatically. Week 2 - Practice and refine. Week 3 - Set up order management and shipping workflows. Week 4 - Build analytics dashboard to track key metrics. Stay consistent and watch your skills compound."}]}	t	t	2025-11-10 03:22:05.080087	2025-11-20 17:28:41.715106
branding-4-newsletter	branding	Newsletter as Authority Engine	newsletter-authority	Launch and grow a newsletter that builds your email list and positions you as an industry expert.	["Launch your thought leadership newsletter", "Grow your subscriber base organically", "Monetize your expertise through email"]	pro	35	4	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Newsletter as Authority Engine. You're here because you're ready to master launch and grow a newsletter that builds your email list and positions you as an industry expert.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Launch your thought leadership newsletter. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master newsletter as authority engine."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Grow your subscriber base organically. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Launch your thought leadership newsletter. Week 2 - Practice and refine. Week 3 - Grow your subscriber base organically. Week 4 - Monetize your expertise through email. Stay consistent and watch your skills compound."}]}	t	t	2025-11-20 17:28:41.173238	2025-11-20 17:28:41.173238
app-atelier-1-foundations	app-atelier	No-Code App Foundations	no-code-foundations	Discover how to build professional apps without writing code. Understand the tools, platforms, and mindset shift needed to become a no-code creator.	["Understand the no-code movement and its potential", "Compare major no-code platforms (Bubble, Glide, Adalo)", "Identify which platform fits your app idea"]	free	25	1	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to No-Code App Foundations. You're here because you're ready to master discover how to build professional apps without writing code. understand the tools, platforms, and mindset shift needed to become a no-code creator.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Understand the no-code movement and its potential. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master no-code app foundations."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Compare major no-code platforms (Bubble, Glide, Adalo). This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Understand the no-code movement and its potential. Week 2 - Practice and refine. Week 3 - Compare major no-code platforms (Bubble, Glide, Adalo). Week 4 - Identify which platform fits your app idea. Stay consistent and watch your skills compound."}]}	t	t	2025-11-11 01:42:48.088489	2025-11-20 17:28:41.334381
branding-6-monetize	branding	Monetize Your Thought Leadership	monetize-thought-leadership	Turn your personal brand into revenue: consulting, coaching, courses, and premium content.	["Create premium offers from your expertise", "Build a funnel from content to clients", "Price and package your knowledge"]	pro	50	6	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Monetize Your Thought Leadership. You're here because you're ready to master turn your personal brand into revenue: consulting, coaching, courses, and premium content.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Create premium offers from your expertise. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master monetize your thought leadership."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Build a funnel from content to clients. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Create premium offers from your expertise. Week 2 - Practice and refine. Week 3 - Build a funnel from content to clients. Week 4 - Price and package your knowledge. Stay consistent and watch your skills compound."}]}	t	t	2025-11-20 17:28:41.220109	2025-11-20 17:28:41.220109
66524631-9454-4b5d-95ea-592e0c137602	moms	Building Your Tech Career While Parenting	tech-career-for-moms	Navigate the unique challenges of building a tech career while being a mom. Learn strategies for flexible work, skill-building, networking, and advancing your career without sacrificing family time.	["Identify flexible tech career paths perfect for moms", "Build in-demand skills on your own schedule", "Create a 'mom-friendly' job search strategy", "Network effectively with limited time", "Negotiate for flexibility and work-life balance"]	pro	60	3	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Building Your Tech Career While Parenting. You're here because you're ready to master navigate the unique challenges of building a tech career while being a mom. learn strategies for flexible work, skill-building, networking, and advancing your career without sacrificing family time.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Identify flexible tech career paths perfect for moms. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master building your tech career while parenting."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Build in-demand skills on your own schedule. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Identify flexible tech career paths perfect for moms. Week 2 - Practice and refine. Week 3 - Build in-demand skills on your own schedule. Week 4 - Create a 'mom-friendly' job search strategy. Stay consistent and watch your skills compound."}]}	t	t	2025-11-14 01:54:49.427531	2025-11-15 02:33:49.798
web3-6-build	web3	Build Your Web3 Project	build-web3-project	Launch your first Web3 initiative - whether it's a community, product, or service. Get hands-on and ship it.	["Plan your Web3 project roadmap", "Choose the right tools and platforms", "Launch and iterate with confidence"]	pro	50	6	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Build Your Web3 Project. You're here because you're ready to master launch your first web3 initiative - whether it's a community, product, or service. get hands-on and ship it.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Plan your Web3 project roadmap. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master build your web3 project."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Choose the right tools and platforms. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Plan your Web3 project roadmap. Week 2 - Practice and refine. Week 3 - Choose the right tools and platforms. Week 4 - Launch and iterate with confidence. Stay consistent and watch your skills compound."}]}	t	t	2025-11-03 17:44:34.370781	2025-11-20 17:28:40.505836
ai-2-chatgpt	ai	Master ChatGPT & Custom GPTs	master-chatgpt	Go beyond basic prompts. Create custom GPTs, build AI assistants, and automate your workflow.	["Write advanced prompts that get results", "Build your first custom GPT", "Automate repetitive tasks with AI"]	pro	35	2	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Master ChatGPT & Custom GPTs. You're here because you're ready to master go beyond basic prompts. create custom gpts, build ai assistants, and automate your workflow.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Write advanced prompts that get results. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master master chatgpt & custom gpts."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Build your first custom GPT. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Write advanced prompts that get results. Week 2 - Practice and refine. Week 3 - Build your first custom GPT. Week 4 - Automate repetitive tasks with AI. Stay consistent and watch your skills compound."}]}	t	t	2025-11-03 17:44:34.417892	2025-11-20 17:28:40.552269
web3-5-daos	web3	DAOs & Community	daos-community	Join or create decentralized autonomous organizations. Build communities that run themselves.	["Understand how DAOs work", "Join your first DAO community", "Explore DAO governance and voting"]	pro	30	5	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to DAOs & Community. You're here because you're ready to master join or create decentralized autonomous organizations. build communities that run themselves.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Understand how DAOs work. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master daos & community."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Join your first DAO community. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Understand how DAOs work. Week 2 - Practice and refine. Week 3 - Join your first DAO community. Week 4 - Explore DAO governance and voting. Stay consistent and watch your skills compound."}]}	t	t	2025-11-03 17:44:34.346574	2025-11-20 17:28:40.482202
nfts-4-marketing	crypto	NFT Marketing & Community	nft-marketing	Build hype and community around your NFT project. From Discord to Twitter to launch success.	["Build an engaged NFT community", "Market your NFT project effectively", "Plan successful NFT launches"]	pro	35	4	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to NFT Marketing & Community. You're here because you're ready to master build hype and community around your nft project. from discord to twitter to launch success.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Build an engaged NFT community. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master nft marketing & community."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Market your NFT project effectively. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Build an engaged NFT community. Week 2 - Practice and refine. Week 3 - Market your NFT project effectively. Week 4 - Plan successful NFT launches. Stay consistent and watch your skills compound."}]}	t	t	2025-11-10 03:22:04.792064	2025-11-20 17:28:41.017676
nfts-5-utility	crypto	Utility NFTs & Memberships	utility-nfts	Create NFTs that unlock access, benefits, or experiences. Build membership and loyalty programs.	["Design utility-based NFT projects", "Create token-gated experiences", "Build NFT membership programs"]	pro	40	5	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Utility NFTs & Memberships. You're here because you're ready to master create nfts that unlock access, benefits, or experiences. build membership and loyalty programs.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Design utility-based NFT projects. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master utility nfts & memberships."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Create token-gated experiences. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Design utility-based NFT projects. Week 2 - Practice and refine. Week 3 - Create token-gated experiences. Week 4 - Build NFT membership programs. Stay consistent and watch your skills compound."}]}	t	t	2025-11-10 03:22:04.814415	2025-11-20 17:28:41.041193
app-atelier-6-launch	app-atelier	Launch & Scale Your App	launch-scale-app	Go from prototype to production. Launch strategy, user acquisition, and scaling best practices for no-code apps.	["Prepare your app for public launch", "Set up analytics and user feedback loops", "Scale your app as users grow"]	pro	60	6	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Launch & Scale Your App. You're here because you're ready to master go from prototype to production. launch strategy, user acquisition, and scaling best practices for no-code apps.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Prepare your app for public launch. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master launch & scale your app."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Set up analytics and user feedback loops. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Prepare your app for public launch. Week 2 - Practice and refine. Week 3 - Set up analytics and user feedback loops. Week 4 - Scale your app as users grow. Stay consistent and watch your skills compound."}]}	t	t	2025-11-11 01:42:48.211788	2025-11-20 17:28:41.447604
537037c1-ff6d-4db1-8d18-49b430126bbe	moms	The Working Mom's AI Productivity System	working-mom-productivity	Design your perfect productivity system using AI tools. Learn how to manage work, family, and personal goals without burning out. Get more done in less time while staying present for what matters.	["Build a personalized AI-powered productivity system", "Use time-blocking and batching to maximize efficiency", "Automate repetitive work and life tasks", "Manage overwhelm and prevent burnout", "Achieve work-life integration (not just balance)"]	pro	50	6	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to The Working Mom's AI Productivity System. You're here because you're ready to master design your perfect productivity system using ai tools. learn how to manage work, family, and personal goals without burning out. get more done in less time while staying present for what matters.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Build a personalized AI-powered productivity system. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master the working mom's ai productivity system."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Use time-blocking and batching to maximize efficiency. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Build a personalized AI-powered productivity system. Week 2 - Practice and refine. Week 3 - Use time-blocking and batching to maximize efficiency. Week 4 - Automate repetitive work and life tasks. Stay consistent and watch your skills compound."}]}	t	t	2025-11-14 01:54:49.513733	2025-11-15 02:33:49.874
crypto-3-trading	crypto	Crypto Trading Basics	crypto-trading	Learn trading fundamentals, technical analysis, and how to use exchanges like a pro.	["Read crypto charts and indicators", "Execute trades on major exchanges", "Understand trading strategies and timing"]	pro	45	3	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Crypto Trading Basics. You're here because you're ready to master learn trading fundamentals, technical analysis, and how to use exchanges like a pro.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Read crypto charts and indicators. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master crypto trading basics."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Execute trades on major exchanges. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Read crypto charts and indicators. Week 2 - Practice and refine. Week 3 - Execute trades on major exchanges. Week 4 - Understand trading strategies and timing. Stay consistent and watch your skills compound."}]}	t	t	2025-11-10 03:21:26.856203	2025-11-20 17:28:40.853544
metaverse-4-land	metaverse	Virtual Real Estate	virtual-real-estate	Understand virtual land, digital property, and how to buy, sell, or lease metaverse real estate.	["Evaluate virtual land opportunities", "Understand digital property rights", "Explore metaverse real estate platforms"]	pro	35	4	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Virtual Real Estate. You're here because you're ready to master understand virtual land, digital property, and how to buy, sell, or lease metaverse real estate.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Evaluate virtual land opportunities. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master virtual real estate."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Understand digital property rights. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Evaluate virtual land opportunities. Week 2 - Practice and refine. Week 3 - Understand digital property rights. Week 4 - Explore metaverse real estate platforms. Stay consistent and watch your skills compound."}]}	t	t	2025-11-03 17:44:34.610773	2025-11-20 17:28:40.738183
app-atelier-5-monetization	app-atelier	Monetize Your App	monetize-app	Turn your app into a revenue stream. Implement subscriptions, one-time payments, and freemium models using Stripe.	["Set up Stripe payments in no-code apps", "Design pricing tiers and subscription models", "Create upgrade flows and paywalls"]	pro	45	5	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Monetize Your App. You're here because you're ready to master turn your app into a revenue stream. implement subscriptions, one-time payments, and freemium models using stripe.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Set up Stripe payments in no-code apps. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master monetize your app."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Design pricing tiers and subscription models. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Set up Stripe payments in no-code apps. Week 2 - Practice and refine. Week 3 - Design pricing tiers and subscription models. Week 4 - Create upgrade flows and paywalls. Stay consistent and watch your skills compound."}]}	t	t	2025-11-11 01:42:48.189342	2025-11-20 17:28:41.424308
founders-club-2-business-model	founders-club	Design Your Business Model	design-business-model	Map out how you'll make money. From pricing strategy to revenue streams—build a sustainable business model.	["Create your business model canvas", "Define pricing and revenue streams", "Calculate unit economics and break-even"]	pro	45	2	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Design Your Business Model. You're here because you're ready to master map out how you'll make money. from pricing strategy to revenue streams—build a sustainable business model.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Create your business model canvas. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master design your business model."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Define pricing and revenue streams. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Create your business model canvas. Week 2 - Practice and refine. Week 3 - Define pricing and revenue streams. Week 4 - Calculate unit economics and break-even. Stay consistent and watch your skills compound."}]}	t	t	2025-11-11 01:42:48.254969	2025-11-20 17:28:41.496464
founders-club-3-mvp-build	founders-club	Build Your MVP in 30 Days	build-mvp-30-days	Ship fast, iterate faster. Build a working MVP in 30 days using no-code tools and lean methodology.	["Scope your MVP features ruthlessly", "Build with no-code/low-code tools", "Launch before you're ready (and why that's good)"]	pro	90	3	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Build Your MVP in 30 Days. You're here because you're ready to master ship fast, iterate faster. build a working mvp in 30 days using no-code tools and lean methodology.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Scope your MVP features ruthlessly. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master build your mvp in 30 days."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Build with no-code/low-code tools. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Scope your MVP features ruthlessly. Week 2 - Practice and refine. Week 3 - Build with no-code/low-code tools. Week 4 - Launch before you're ready (and why that's good). Stay consistent and watch your skills compound."}]}	t	t	2025-11-11 01:42:48.276355	2025-11-20 17:28:41.525088
nfts-3-creating	crypto	Create & Mint Your NFTs	create-mint-nfts	Turn your art, photos, or content into NFTs. Launch your first collection on OpenSea or Rarible.	["Create NFT-ready digital assets", "Mint your first NFT collection", "Set up royalties and smart contracts"]	pro	40	3	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Create & Mint Your NFTs. You're here because you're ready to master turn your art, photos, or content into nfts. launch your first collection on opensea or rarible.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Create NFT-ready digital assets. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master create & mint your nfts."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Mint your first NFT collection. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Create NFT-ready digital assets. Week 2 - Practice and refine. Week 3 - Mint your first NFT collection. Week 4 - Set up royalties and smart contracts. Stay consistent and watch your skills compound."}]}	t	t	2025-11-10 03:22:04.770138	2025-11-20 17:28:40.994513
nfts-6-launch	crypto	Launch Your NFT Project	launch-nft-project	Take your NFT project from concept to successful launch. Plan, build, and sell your collection.	["Plan your complete NFT launch", "Build community pre-launch", "Execute a successful mint and beyond"]	pro	50	6	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Launch Your NFT Project. You're here because you're ready to master take your nft project from concept to successful launch. plan, build, and sell your collection.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Plan your complete NFT launch. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master launch your nft project."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Build community pre-launch. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Plan your complete NFT launch. Week 2 - Practice and refine. Week 3 - Build community pre-launch. Week 4 - Execute a successful mint and beyond. Stay consistent and watch your skills compound."}]}	t	t	2025-11-10 03:22:04.835801	2025-11-20 17:28:41.06548
digital-sales-1-shopify	digital-sales	Launch Your Shopify Store	launch-shopify-store	Build and launch your Shopify store LIVE in 2 hours. Set up payments, add products, and start taking orders. By the end, your store is live and ready to sell.	["Create and configure your Shopify store", "Set up payment processing and shipping zones", "Add your first 5 products with optimized descriptions", "Launch your store and make it live"]	free	120	1	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Launch Your Shopify Store. You're here because you're ready to master build and launch your shopify store live in 2 hours. set up payments, add products, and start taking orders. by the end, your store is live and ready to sell.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Create and configure your Shopify store. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master launch your shopify store."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Set up payment processing and shipping zones. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Create and configure your Shopify store. Week 2 - Practice and refine. Week 3 - Set up payment processing and shipping zones. Week 4 - Add your first 5 products with optimized descriptions. Stay consistent and watch your skills compound."}]}	t	t	2025-11-10 03:22:04.988333	2025-11-20 17:28:41.621284
branding-5-community	branding	AI Community Building	ai-community-building	Build and nurture an engaged community. Use AI to manage conversations, create experiences, and grow together.	["Design your community strategy", "Use AI to engage and moderate", "Create community-driven growth"]	pro	35	5	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to AI Community Building. You're here because you're ready to master build and nurture an engaged community. use ai to manage conversations, create experiences, and grow together.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Design your community strategy. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master ai community building."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Use AI to engage and moderate. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Design your community strategy. Week 2 - Practice and refine. Week 3 - Use AI to engage and moderate. Week 4 - Create community-driven growth. Stay consistent and watch your skills compound."}]}	t	t	2025-11-03 17:44:35.0755	2025-11-20 17:28:41.288936
moms-3-side-hustles	moms	Mom-Friendly Side Hustles	mom-side-hustles	Launch a flexible side hustle that fits your life. Explore AI-powered business ideas you can start during nap time, with minimal startup costs and maximum schedule flexibility.	["Identify profitable side hustles that fit mom life", "Use AI to create digital products in hours (not months)", "Set up simple sales systems that run on autopilot", "Balance business goals with family priorities"]	pro	60	3	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Mom-Friendly Side Hustles. You're here because you're ready to master launch a flexible side hustle that fits your life. explore ai-powered business ideas you can start during nap time, with minimal startup costs and maximum schedule flexibility.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Identify profitable side hustles that fit mom life. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master mom-friendly side hustles."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Use AI to create digital products in hours (not months). This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Identify profitable side hustles that fit mom life. Week 2 - Practice and refine. Week 3 - Use AI to create digital products in hours (not months). Week 4 - Set up simple sales systems that run on autopilot. Stay consistent and watch your skills compound."}]}	t	t	2025-11-11 22:45:41.089091	2025-11-15 02:33:50.573
moms-4-content-creation	moms	AI Content for Mom Creators	ai-content-mom-creators	Build your personal brand without the overwhelm. Use AI to create authentic content, grow your Instagram/TikTok, and connect with other moms—all while staying true to yourself.	["Create 30 days of social content in one afternoon with AI", "Find your authentic voice and niche as a mom creator", "Batch create content during kid-free hours", "Grow your following with AI-optimized captions and hashtags"]	pro	50	4	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to AI Content for Mom Creators. You're here because you're ready to master build your personal brand without the overwhelm. use ai to create authentic content, grow your instagram/tiktok, and connect with other moms—all while staying true to yourself.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Create 30 days of social content in one afternoon with AI. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master ai content for mom creators."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Find your authentic voice and niche as a mom creator. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Create 30 days of social content in one afternoon with AI. Week 2 - Practice and refine. Week 3 - Find your authentic voice and niche as a mom creator. Week 4 - Batch create content during kid-free hours. Stay consistent and watch your skills compound."}]}	t	t	2025-11-11 22:45:41.089091	2025-11-15 02:33:50.597
moms-2-time-automation	moms	Time-Saving Automation	time-saving-automation	Build your automated home office. Set up AI tools that handle repetitive tasks, manage your email, organize photos, and keep your digital life running smoothly.	["Automate email inbox management and responses", "Set up AI photo organization and family memory books", "Create automated shopping lists and reorder systems", "Build digital systems for household routines"]	pro	45	2	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Time-Saving Automation. You're here because you're ready to master build your automated home office. set up ai tools that handle repetitive tasks, manage your email, organize photos, and keep your digital life running smoothly.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Automate email inbox management and responses. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master time-saving automation."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Set up AI photo organization and family memory books. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Automate email inbox management and responses. Week 2 - Practice and refine. Week 3 - Set up AI photo organization and family memory books. Week 4 - Create automated shopping lists and reorder systems. Stay consistent and watch your skills compound."}]}	t	t	2025-11-11 22:45:41.089091	2025-11-15 02:33:50.548
crypto-1-basics	crypto	Crypto Foundations	crypto-foundations	Understand cryptocurrency beyond the hype. Learn how Bitcoin, Ethereum, and digital money actually work.	["Explain cryptocurrency clearly", "Understand blockchain and mining", "Navigate the crypto landscape safely"]	free	25	1	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Crypto Foundations. You're here because you're ready to master understand cryptocurrency beyond the hype. learn how bitcoin, ethereum, and digital money actually work.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Explain cryptocurrency clearly. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master crypto foundations."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Understand blockchain and mining. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Explain cryptocurrency clearly. Week 2 - Practice and refine. Week 3 - Understand blockchain and mining. Week 4 - Navigate the crypto landscape safely. Stay consistent and watch your skills compound."}]}	t	t	2025-11-10 03:21:26.80922	2025-11-20 17:28:40.807172
digital-sales-4-email-ads	digital-sales	Email Marketing & Paid Ads	email-marketing-paid-ads	Activate email marketing automation and launch your first ad campaign. Set up welcome emails, abandoned cart recovery, and a $10/day Meta ad—all live during the workshop.	["Set up email marketing platform with 3 essential automations", "Create email templates and pop-ups for list building", "Launch your first Meta ad campaign with AI-written copy", "Use AI to create 20 product descriptions and 14 days of captions"]	pro	120	4	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Email Marketing & Paid Ads. You're here because you're ready to master activate email marketing automation and launch your first ad campaign. set up welcome emails, abandoned cart recovery, and a $10/day meta ad—all live during the workshop.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Set up email marketing platform with 3 essential automations. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master email marketing & paid ads."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Create email templates and pop-ups for list building. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Set up email marketing platform with 3 essential automations. Week 2 - Practice and refine. Week 3 - Create email templates and pop-ups for list building. Week 4 - Launch your first Meta ad campaign with AI-written copy. Stay consistent and watch your skills compound."}]}	t	t	2025-11-10 03:22:05.05752	2025-11-20 17:28:41.692651
nfts-1-basics	crypto	NFT Essentials	nft-essentials	Understand NFTs beyond the hype. Learn about digital ownership, utility, and real-world applications.	["Explain NFTs in simple terms", "Understand use cases beyond art", "Navigate NFT marketplaces confidently"]	free	25	1	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to NFT Essentials. You're here because you're ready to master understand nfts beyond the hype. learn about digital ownership, utility, and real-world applications.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Explain NFTs in simple terms. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master nft essentials."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Understand use cases beyond art. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Explain NFTs in simple terms. Week 2 - Practice and refine. Week 3 - Understand use cases beyond art. Week 4 - Navigate NFT marketplaces confidently. Stay consistent and watch your skills compound."}]}	t	t	2025-11-10 03:22:04.725341	2025-11-20 17:28:40.947329
branding-3-authority	branding	Build AI-Searchable Authority	ai-searchable-authority	Become so visible that AI models reference your work. Long-form content, media features, and speaking opportunities.	["Create long-form content that builds lasting authority", "Get featured in media and publications", "Position yourself for speaking opportunities"]	pro	45	3	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Build AI-Searchable Authority. You're here because you're ready to master become so visible that ai models reference your work. long-form content, media features, and speaking opportunities.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Create long-form content that builds lasting authority. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master build ai-searchable authority."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Get featured in media and publications. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Create long-form content that builds lasting authority. Week 2 - Practice and refine. Week 3 - Get featured in media and publications. Week 4 - Position yourself for speaking opportunities. Stay consistent and watch your skills compound."}]}	t	t	2025-11-20 17:28:41.138669	2025-11-20 17:28:41.138669
metaverse-1-intro	metaverse	Metaverse Basics	metaverse-basics	Navigate virtual worlds, understand spatial computing, and see where digital experiences are heading.	["Understand what the metaverse actually is", "Explore major metaverse platforms", "Identify opportunities in virtual spaces"]	free	25	1	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Metaverse Basics. You're here because you're ready to master navigate virtual worlds, understand spatial computing, and see where digital experiences are heading.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Understand what the metaverse actually is. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master metaverse basics."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Explore major metaverse platforms. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Understand what the metaverse actually is. Week 2 - Practice and refine. Week 3 - Explore major metaverse platforms. Week 4 - Identify opportunities in virtual spaces. Stay consistent and watch your skills compound."}]}	t	t	2025-11-03 17:44:34.536944	2025-11-20 17:28:40.669432
crypto-2-investing	crypto	Smart Crypto Investing	crypto-investing	Start investing in crypto safely. Understand risk management, portfolio strategy, and how to avoid common mistakes.	["Build a balanced crypto portfolio", "Understand market cycles and trends", "Implement risk management strategies"]	pro	40	2	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Smart Crypto Investing. You're here because you're ready to master start investing in crypto safely. understand risk management, portfolio strategy, and how to avoid common mistakes.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Build a balanced crypto portfolio. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master smart crypto investing."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Understand market cycles and trends. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Build a balanced crypto portfolio. Week 2 - Practice and refine. Week 3 - Understand market cycles and trends. Week 4 - Implement risk management strategies. Stay consistent and watch your skills compound."}]}	t	t	2025-11-10 03:21:26.835409	2025-11-20 17:28:40.831434
web3-4-defi	web3	DeFi Demystified	defi-demystified	Navigate decentralized finance - understand lending, staking, and liquidity pools without the overwhelm.	["Understand DeFi fundamentals", "Evaluate DeFi opportunities and risks", "Start with safe, beginner-friendly platforms"]	pro	40	4	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to DeFi Demystified. You're here because you're ready to master navigate decentralized finance - understand lending, staking, and liquidity pools without the overwhelm.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Understand DeFi fundamentals. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master defi demystified."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Evaluate DeFi opportunities and risks. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Understand DeFi fundamentals. Week 2 - Practice and refine. Week 3 - Evaluate DeFi opportunities and risks. Week 4 - Start with safe, beginner-friendly platforms. Stay consistent and watch your skills compound."}]}	t	t	2025-11-03 17:44:34.321792	2025-11-20 17:28:40.458704
ai-1-foundations	ai	AI Essentials	ai-essentials	Understand AI, machine learning, and how to use these tools to multiply your productivity and creativity.	["Explain AI and machine learning clearly", "Identify AI tools for your workflow", "Start using AI ethically and effectively"]	free	20	1	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to AI Essentials. You're here because you're ready to master understand ai, machine learning, and how to use these tools to multiply your productivity and creativity.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Explain AI and machine learning clearly. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master ai essentials."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Identify AI tools for your workflow. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Explain AI and machine learning clearly. Week 2 - Practice and refine. Week 3 - Identify AI tools for your workflow. Week 4 - Start using AI ethically and effectively. Stay consistent and watch your skills compound."}]}	t	t	2025-11-03 17:44:34.395056	2025-11-20 17:28:40.527866
ai-3-content	ai	AI-Powered Content Creation	ai-content-creation	Create blog posts, social media, newsletters, and more - faster and better than ever with AI as your co-pilot.	["Generate high-quality content with AI", "Maintain your unique voice and style", "Build a content system that scales"]	pro	30	3	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to AI-Powered Content Creation. You're here because you're ready to master create blog posts, social media, newsletters, and more - faster and better than ever with ai as your co-pilot.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Generate high-quality content with AI. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master ai-powered content creation."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Maintain your unique voice and style. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Generate high-quality content with AI. Week 2 - Practice and refine. Week 3 - Maintain your unique voice and style. Week 4 - Build a content system that scales. Stay consistent and watch your skills compound."}]}	t	t	2025-11-03 17:44:34.44243	2025-11-20 17:28:40.574896
founders-club-1-ideation	founders-club	Validate Your Business Idea	validate-business-idea	Turn your idea into a viable business. Learn validation frameworks, customer research, and how to avoid building something nobody wants.	["Test your business idea with real customers", "Identify your ideal customer and their pain points", "Decide if your idea is worth pursuing"]	free	30	1	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Validate Your Business Idea. You're here because you're ready to master turn your idea into a viable business. learn validation frameworks, customer research, and how to avoid building something nobody wants.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Test your business idea with real customers. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master validate your business idea."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Identify your ideal customer and their pain points. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Test your business idea with real customers. Week 2 - Practice and refine. Week 3 - Identify your ideal customer and their pain points. Week 4 - Decide if your idea is worth pursuing. Stay consistent and watch your skills compound."}]}	t	t	2025-11-11 01:42:48.233399	2025-11-20 17:28:41.473494
a90ae1b9-15e5-45d9-a3ce-eeeec9520f69	moms	AI Home Automation for Busy Families	ai-home-automation	Use AI and smart home technology to automate household tasks, create efficient routines, and give yourself back hours each week. From meal planning to cleaning schedules to family coordination.	["Set up AI-powered smart home devices", "Automate repetitive household tasks", "Create voice-activated family routines", "Use AI for grocery shopping, meal prep, and budgeting", "Build a family command center with automation"]	pro	45	5	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to AI Home Automation for Busy Families. You're here because you're ready to master use ai and smart home technology to automate household tasks, create efficient routines, and give yourself back hours each week. from meal planning to cleaning schedules to family coordination.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Set up AI-powered smart home devices. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master ai home automation for busy families."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Automate repetitive household tasks. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Set up AI-powered smart home devices. Week 2 - Practice and refine. Week 3 - Automate repetitive household tasks. Week 4 - Create voice-activated family routines. Stay consistent and watch your skills compound."}]}	t	t	2025-11-14 01:54:49.486329	2025-11-15 02:33:49.849
digital-sales-2-instagram	digital-sales	Instagram Shopping Activation	instagram-shopping	Turn Instagram into a sales channel. Set up Instagram Shopping, create shoppable posts, and start selling where your customers already are.	["Activate Instagram Shopping for your account", "Connect your Shopify catalog to Instagram", "Create 3 shoppable posts with product tags", "Use AI to generate captions and content ideas"]	free	120	2	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Instagram Shopping Activation. You're here because you're ready to master turn instagram into a sales channel. set up instagram shopping, create shoppable posts, and start selling where your customers already are.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Activate Instagram Shopping for your account. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master instagram shopping activation."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Connect your Shopify catalog to Instagram. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Activate Instagram Shopping for your account. Week 2 - Practice and refine. Week 3 - Connect your Shopify catalog to Instagram. Week 4 - Create 3 shoppable posts with product tags. Stay consistent and watch your skills compound."}]}	t	t	2025-11-10 03:22:05.013329	2025-11-20 17:28:41.644852
founders-club-5-operations	founders-club	Set Up Business Operations	business-operations	Legal, finance, and systems. Set up your LLC, business bank account, accounting software, and essential tools.	["Choose the right business structure (LLC, C-Corp, etc.)", "Set up business banking and accounting", "Implement essential tools and workflows"]	pro	60	5	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Set Up Business Operations. You're here because you're ready to master legal, finance, and systems. set up your llc, business bank account, accounting software, and essential tools.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Choose the right business structure (LLC, C-Corp, etc.). We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master set up business operations."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Set up business banking and accounting. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Choose the right business structure (LLC, C-Corp, etc.). Week 2 - Practice and refine. Week 3 - Set up business banking and accounting. Week 4 - Implement essential tools and workflows. Stay consistent and watch your skills compound."}]}	t	t	2025-11-11 01:42:48.318341	2025-11-20 17:28:41.575334
founders-club-6-scaling	founders-club	Scale from $0 to $10K MRR	scale-to-10k-mrr	Growth strategies that work. Marketing, sales systems, and scaling operations to hit your first $10K monthly recurring revenue.	["Build repeatable marketing and sales systems", "Hire your first team member or contractor", "Scale without burning out"]	pro	75	6	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Scale from $0 to $10K MRR. You're here because you're ready to master growth strategies that work. marketing, sales systems, and scaling operations to hit your first $10k monthly recurring revenue.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Build repeatable marketing and sales systems. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master scale from $0 to $10k mrr."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Hire your first team member or contractor. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Build repeatable marketing and sales systems. Week 2 - Practice and refine. Week 3 - Hire your first team member or contractor. Week 4 - Scale without burning out. Stay consistent and watch your skills compound."}]}	t	t	2025-11-11 01:42:48.339263	2025-11-20 17:28:41.598988
branding-6-launch	branding	Launch Your Brand with AI	launch-brand-ai	Take your brand from concept to market. Build your complete brand ecosystem with AI assistance.	["Create your complete brand identity", "Build your online presence", "Launch and grow your brand"]	pro	50	6	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Launch Your Brand with AI. You're here because you're ready to master take your brand from concept to market. build your complete brand ecosystem with ai assistance.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Create your complete brand identity. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master launch your brand with ai."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Build your online presence. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Create your complete brand identity. Week 2 - Practice and refine. Week 3 - Build your online presence. Week 4 - Launch and grow your brand. Stay consistent and watch your skills compound."}]}	t	t	2025-11-03 17:44:35.09963	2025-11-20 17:28:41.311941
moms-5-kids-education	moms	AI for Kids Education	ai-kids-education	Support your child's learning with AI. Get homework help, create custom learning materials, make school projects easier, and give your kids an edge in their education.	["Use AI as a homework tutor (without doing the work for them)", "Create custom learning materials for your child's level", "Make school projects more creative with AI tools", "Teach your kids safe, responsible AI use"]	pro	40	5	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to AI for Kids Education. You're here because you're ready to master support your child's learning with ai. get homework help, create custom learning materials, make school projects easier, and give your kids an edge in their education.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Use AI as a homework tutor (without doing the work for them). We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master ai for kids education."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Create custom learning materials for your child's level. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Use AI as a homework tutor (without doing the work for them). Week 2 - Practice and refine. Week 3 - Create custom learning materials for your child's level. Week 4 - Make school projects more creative with AI tools. Stay consistent and watch your skills compound."}]}	t	t	2025-11-11 22:45:41.089091	2025-11-15 02:33:50.622
app-atelier-3-build	app-atelier	Build Your First App	build-first-app	Hands-on workshop: Build a functional app in 2 hours using Bubble or Glide. From blank canvas to working prototype.	["Set up your no-code development environment", "Build core features and user interface", "Deploy your first app to the web"]	pro	120	3	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Build Your First App. You're here because you're ready to master hands-on workshop: build a functional app in 2 hours using bubble or glide. from blank canvas to working prototype.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Set up your no-code development environment. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master build your first app."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Build core features and user interface. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Set up your no-code development environment. Week 2 - Practice and refine. Week 3 - Build core features and user interface. Week 4 - Deploy your first app to the web. Stay consistent and watch your skills compound."}]}	t	t	2025-11-11 01:42:48.145189	2025-11-20 17:28:41.379718
digital-sales-6-growth	digital-sales	Growth Systems & Scaling	growth-systems-scaling	Scale what works. Review your results, optimize winning strategies, build customer loyalty programs, and create your 90-day growth roadmap.	["Analyze first week results and identify what's working", "Optimize ads and content that perform best", "Build loyalty programs and referral systems", "Create your personalized 90-day growth roadmap"]	pro	120	6	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Growth Systems & Scaling. You're here because you're ready to master scale what works. review your results, optimize winning strategies, build customer loyalty programs, and create your 90-day growth roadmap.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Analyze first week results and identify what's working. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master growth systems & scaling."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Optimize ads and content that perform best. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Analyze first week results and identify what's working. Week 2 - Practice and refine. Week 3 - Optimize ads and content that perform best. Week 4 - Build loyalty programs and referral systems. Stay consistent and watch your skills compound."}]}	t	t	2025-11-10 03:22:05.100517	2025-11-20 17:28:41.744492
metaverse-2-platforms	metaverse	Platform Deep Dive	platform-deep-dive	Explore Decentraland, The Sandbox, Spatial, and more. Find the right virtual home for your brand.	["Compare major metaverse platforms", "Create your first avatar and presence", "Navigate virtual spaces confidently"]	pro	35	2	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Platform Deep Dive. You're here because you're ready to master explore decentraland, the sandbox, spatial, and more. find the right virtual home for your brand.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Compare major metaverse platforms. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master platform deep dive."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Create your first avatar and presence. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Compare major metaverse platforms. Week 2 - Practice and refine. Week 3 - Create your first avatar and presence. Week 4 - Navigate virtual spaces confidently. Stay consistent and watch your skills compound."}]}	t	t	2025-11-03 17:44:34.562286	2025-11-20 17:28:40.692779
ai-6-product	ai	Build Your AI-Powered Product	build-ai-product	Launch an AI tool, service, or product. From idea to MVP - ship something people will pay for.	["Validate your AI product idea", "Build an MVP with no-code tools", "Launch and get your first customers"]	pro	60	6	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Build Your AI-Powered Product. You're here because you're ready to master launch an ai tool, service, or product. from idea to mvp - ship something people will pay for.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Validate your AI product idea. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master build your ai-powered product."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Build an MVP with no-code tools. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Validate your AI product idea. Week 2 - Practice and refine. Week 3 - Build an MVP with no-code tools. Week 4 - Launch and get your first customers. Stay consistent and watch your skills compound."}]}	t	t	2025-11-03 17:44:34.513972	2025-11-20 17:28:40.646141
23e2a32f-6ee0-40bc-bf51-d07f7e52ce61	moms	Side Hustle School: Digital Income for Moms	side-hustle-for-moms	Build a profitable side hustle or business using AI and tech tools. Learn practical strategies for creating digital products, services, or content that generate income on your schedule.	["Identify profitable side hustle ideas for moms", "Use AI to create digital products in hours, not months", "Set up sales systems that run on autopilot", "Market your business with minimal time investment", "Scale from side hustle to full-time income (if desired)"]	pro	55	4	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Side Hustle School: Digital Income for Moms. You're here because you're ready to master build a profitable side hustle or business using ai and tech tools. learn practical strategies for creating digital products, services, or content that generate income on your schedule.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Identify profitable side hustle ideas for moms. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master side hustle school: digital income for moms."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Use AI to create digital products in hours, not months. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Identify profitable side hustle ideas for moms. Week 2 - Practice and refine. Week 3 - Use AI to create digital products in hours, not months. Week 4 - Set up sales systems that run on autopilot. Stay consistent and watch your skills compound."}]}	t	t	2025-11-14 01:54:49.458584	2025-11-15 02:33:49.824
metaverse-5-commerce	metaverse	Metaverse Commerce	metaverse-commerce	Sell products and services in virtual worlds. From digital goods to virtual storefronts.	["Set up a virtual storefront", "Sell digital and physical goods", "Accept crypto payments seamlessly"]	pro	40	5	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Metaverse Commerce. You're here because you're ready to master sell products and services in virtual worlds. from digital goods to virtual storefronts.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Set up a virtual storefront. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master metaverse commerce."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Sell digital and physical goods. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Set up a virtual storefront. Week 2 - Practice and refine. Week 3 - Sell digital and physical goods. Week 4 - Accept crypto payments seamlessly. Stay consistent and watch your skills compound."}]}	t	t	2025-11-03 17:44:34.63468	2025-11-20 17:28:40.760544
founders-club-4-first-customers	founders-club	Get Your First 10 Customers	first-10-customers	Customer acquisition from zero. Learn scrappy, founder-led sales tactics that work before you have a marketing budget.	["Find your first customers without ads", "Perfect your pitch and close sales", "Build word-of-mouth and referrals"]	pro	50	4	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Get Your First 10 Customers. You're here because you're ready to master customer acquisition from zero. learn scrappy, founder-led sales tactics that work before you have a marketing budget.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Find your first customers without ads. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master get your first 10 customers."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Perfect your pitch and close sales. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Find your first customers without ads. Week 2 - Practice and refine. Week 3 - Perfect your pitch and close sales. Week 4 - Build word-of-mouth and referrals. Stay consistent and watch your skills compound."}]}	t	t	2025-11-11 01:42:48.297902	2025-11-20 17:28:41.553588
branding-4-thought-leadership	branding	AI Thought Leadership	ai-thought-leadership	Position yourself as an authority. Use AI to research, write, and publish thought leadership content.	["Develop your unique point of view", "Create high-quality thought leadership", "Build authority in your niche"]	pro	40	4	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to AI Thought Leadership. You're here because you're ready to master position yourself as an authority. use ai to research, write, and publish thought leadership content.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Develop your unique point of view. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master ai thought leadership."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Create high-quality thought leadership. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Develop your unique point of view. Week 2 - Practice and refine. Week 3 - Create high-quality thought leadership. Week 4 - Build authority in your niche. Stay consistent and watch your skills compound."}]}	t	t	2025-11-03 17:44:35.051997	2025-11-20 17:28:41.267418
moms-6-community	moms	Build Your Mom Tribe Online	build-mom-tribe	Find and grow your support network. Use AI tools to build an engaged community of like-minded moms, whether it's a Facebook group, Discord server, or local meetup group.	["Start and grow an online community of supportive moms", "Use AI to moderate, engage, and create community content", "Plan virtual and in-person events that people actually show up to", "Monetize your community (if you want to)"]	pro	55	6	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Build Your Mom Tribe Online. You're here because you're ready to master find and grow your support network. use ai tools to build an engaged community of like-minded moms, whether it's a facebook group, discord server, or local meetup group.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Start and grow an online community of supportive moms. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master build your mom tribe online."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Use AI to moderate, engage, and create community content. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Start and grow an online community of supportive moms. Week 2 - Practice and refine. Week 3 - Use AI to moderate, engage, and create community content. Week 4 - Plan virtual and in-person events that people actually show up to. Stay consistent and watch your skills compound."}]}	t	t	2025-11-11 22:45:41.089091	2025-11-15 02:33:50.646
crypto-5-taxes	crypto	Crypto Taxes & Compliance	crypto-taxes	Navigate crypto taxes and regulations. Stay compliant while maximizing your gains.	["Understand crypto tax obligations", "Track transactions for tax reporting", "Work with crypto-savvy accountants"]	pro	35	5	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Crypto Taxes & Compliance. You're here because you're ready to master navigate crypto taxes and regulations. stay compliant while maximizing your gains.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Understand crypto tax obligations. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master crypto taxes & compliance."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Track transactions for tax reporting. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Understand crypto tax obligations. Week 2 - Practice and refine. Week 3 - Track transactions for tax reporting. Week 4 - Work with crypto-savvy accountants. Stay consistent and watch your skills compound."}]}	t	t	2025-11-10 03:21:26.900309	2025-11-20 17:28:40.900694
branding-5-speaking	branding	From Thought Leader to Speaker	thought-leader-speaker	Get booked for podcasts, panels, and stages. Turn your expertise into speaking opportunities.	["Create your signature talk framework", "Pitch podcasts and speaking events", "Deliver compelling presentations"]	pro	40	5	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to From Thought Leader to Speaker. You're here because you're ready to master get booked for podcasts, panels, and stages. turn your expertise into speaking opportunities.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Create your signature talk framework. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master from thought leader to speaker."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Pitch podcasts and speaking events. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Create your signature talk framework. Week 2 - Practice and refine. Week 3 - Pitch podcasts and speaking events. Week 4 - Deliver compelling presentations. Stay consistent and watch your skills compound."}]}	t	t	2025-11-20 17:28:41.196339	2025-11-20 17:28:41.196339
app-atelier-2-mvp	app-atelier	Design Your MVP	design-mvp	Plan your Minimum Viable Product. Learn to identify core features, create user flows, and wireframe your first app.	["Define your MVP scope and features", "Create user flows and wireframes", "Validate your app idea with potential users"]	pro	40	2	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to Design Your MVP. You're here because you're ready to master plan your minimum viable product. learn to identify core features, create user flows, and wireframe your first app.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Define your MVP scope and features. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master design your mvp."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Create user flows and wireframes. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Define your MVP scope and features. Week 2 - Practice and refine. Week 3 - Create user flows and wireframes. Week 4 - Validate your app idea with potential users. Stay consistent and watch your skills compound."}]}	t	t	2025-11-11 01:42:48.123396	2025-11-20 17:28:41.357977
ai-4-automation	ai	AI Automation & Workflows	ai-automation	Connect AI tools to automate your business processes. From email to social media to client onboarding.	["Map your automation opportunities", "Connect AI tools with no-code platforms", "Build workflows that run on autopilot"]	pro	40	4	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to AI Automation & Workflows. You're here because you're ready to master connect ai tools to automate your business processes. from email to social media to client onboarding.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Map your automation opportunities. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master ai automation & workflows."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Connect AI tools with no-code platforms. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Map your automation opportunities. Week 2 - Practice and refine. Week 3 - Connect AI tools with no-code platforms. Week 4 - Build workflows that run on autopilot. Stay consistent and watch your skills compound."}]}	t	t	2025-11-03 17:44:34.466621	2025-11-20 17:28:40.598914
ai-5-image-gen	ai	AI Image & Video Generation	ai-image-video	Create stunning visuals with Midjourney, DALL-E, and AI video tools. Design like a pro, no design skills required.	["Generate professional images with AI", "Create video content faster", "Build a visual content library"]	pro	35	5	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to AI Image & Video Generation. You're here because you're ready to master create stunning visuals with midjourney, dall-e, and ai video tools. design like a pro, no design skills required.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Generate professional images with AI. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master ai image & video generation."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Create video content faster. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Generate professional images with AI. Week 2 - Practice and refine. Week 3 - Create video content faster. Week 4 - Build a visual content library. Stay consistent and watch your skills compound."}]}	t	t	2025-11-03 17:44:34.489938	2025-11-20 17:28:40.622812
digital-sales-3-tiktok	digital-sales	TikTok Shop & Content Creation	tiktok-shop-content	Launch TikTok Shop and create content that sells. Film your first 3 TikToks together using viral formulas, go LIVE, and plan 30 days of content with AI.	["Set up TikTok Business and TikTok Shop", "Film and post 3 TikToks using proven selling formulas", "Complete your first TikTok Live selling session", "Generate 30 days of content ideas with AI in 5 minutes"]	pro	120	3	{"sections": [{"id": "section-1", "type": "text", "title": "Why You Belong Here: Mindset & Confidence", "content": "Welcome to TikTok Shop & Content Creation. You're here because you're ready to master launch tiktok shop and create content that sells. film your first 3 tiktoks together using viral formulas, go live, and plan 30 days of content with ai.. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation."}, {"id": "section-2", "type": "text", "title": "Core Concepts That Actually Matter", "content": "Understanding the fundamentals: Set up TikTok Business and TikTok Shop. We'll break down complex topics into actionable insights you can apply immediately to your business or career."}, {"id": "section-3", "type": "interactive", "title": "Real Women, Real Results: Case Studies", "content": "See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master tiktok shop & content creation."}, {"id": "section-4", "type": "interactive", "title": "Your 15-Minute Quick Win Challenge", "content": "Take action right now with this hands-on exercise. In just 15 minutes, you'll Film and post 3 TikToks using proven selling formulas. This quick win builds confidence and momentum."}, {"id": "section-5", "type": "text", "title": "Your Implementation Roadmap", "content": "Your 30-day action plan: Week 1 - Set up TikTok Business and TikTok Shop. Week 2 - Practice and refine. Week 3 - Film and post 3 TikToks using proven selling formulas. Week 4 - Complete your first TikTok Live selling session. Stay consistent and watch your skills compound."}]}	t	t	2025-11-10 03:22:05.036497	2025-11-20 17:28:41.66748
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, email, first_name, last_name, is_pro, created_at, updated_at, onboarding_completed, password_hash, quiz_unlocked_ritual, quiz_completed_at, subscription_tier, stripe_customer_id, stripe_subscription_id) FROM stdin;
5bd500ff-4d05-482d-9c20-cd2a08d1ad8a	nadia@metahers.ai	Nadia	\N	t	2025-11-13 20:26:17.971356	2025-11-17 21:35:18.332	t	$2b$12$mT37I5ZOp4m6ooPrPtPK5eRHax1QUymeA/Gm4FKZAoFVBk1WSaNNW	\N	\N	founders_circle	\N	\N
cf5ac169-579c-4b22-9652-7cc0a270c80d	salmouch50@yahoo.fr	Beta	Tester	t	2025-11-14 01:30:20.599161	2025-11-14 01:30:20.599161	f	$2b$12$IIsFxSm13M8hJRcuAT9mJeFG0OSpXmuis0SfXvv7GfxzoA6tQbZsm	\N	\N	executive	\N	\N
332236c5-5e90-4a2a-aa9e-f9777d684ec7	testuser.tu12@gmail.com	Test	User	f	2025-11-25 18:56:09.392768	2025-11-25 18:56:09.392768	f	$2b$12$BA8JK.3Vr3q4k4ecFE0eGu82OGcltxAl/vnqNB44WaUo.32XfPcZW	\N	\N	free	\N	\N
\.


--
-- Data for Name: women_profiles; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.women_profiles (id, user_id, headline, bio, location, profile_image, visibility, looking_for, availability, verified_member, completion_percentage, created_at, updated_at) FROM stdin;
\.


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

\unrestrict Ch607wgYOX2rm4fNmbWb7jz7eifZjHLqaC9iR6e29Mu4cVilEx3FYG9McMc8jGr

