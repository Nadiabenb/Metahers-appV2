import { useState } from "react";
import { useLocation } from "wouter";
import { BookOpen, Calendar, Users, MessageCircle, CheckCircle2, Lock, Clock, Sparkles, ArrowRight, Heart, Video, Star, Rocket, Zap, Trophy, Brain, Send, ChevronDown, ChevronUp, Lightbulb, Target, Code, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { SEO } from "@/components/SEO";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function LearningHubPage() {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [messageText, setMessageText] = useState("");
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

  // Fetch user progress
  const { data: progressData, isLoading: progressLoading } = useQuery({
    queryKey: ['/api/learning-hub/progress'],
    enabled: false,
  });

  // Fetch live sessions
  const { data: sessionsData, isLoading: sessionsLoading } = useQuery({
    queryKey: ['/api/learning-hub/sessions'],
    enabled: false,
  });

  // Fetch community activity
  const { data: activityData, isLoading: activityLoading } = useQuery({
    queryKey: ['/api/learning-hub/community/activity'],
    enabled: false,
  });

  // Fetch messages
  const { data: messagesData, isLoading: messagesLoading } = useQuery({
    queryKey: ['/api/learning-hub/messages'],
    enabled: false,
  });

  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/learning-hub/progress/update', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/learning-hub/progress'] });
    }
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => apiRequest('POST', '/api/learning-hub/messages', { content }),
    onSuccess: () => {
      setMessageText("");
      queryClient.invalidateQueries({ queryKey: ['/api/learning-hub/messages'] });
    }
  });

  // Redirect if not authenticated
  if (!isAuthenticated) {
    setLocation("/ai-mastery");
    return null;
  }

  const modules = [
    {
      week: 1,
      title: "AI Content Creation Mastery",
      description: "Master AI tools to create stunning content",
      status: "active",
      progress: 65,
      lessons: ["AI Photography", "Video Generation", "Copy Writing", "Social Media Magic"],
      icon: Sparkles,
      color: "from-purple-500 to-pink-500",
      nextSession: "Dec 3, 2024 - 2:00 PM PST",
    },
    {
      week: 2,
      title: "Brand Identity & Design",
      description: "Build your unique AI-powered personal brand",
      status: "active",
      progress: 0,
      lessons: ["Logo Design", "Color Psychology", "Typography", "Brand Kit Assembly"],
      icon: Star,
      color: "from-pink-500 to-orange-500",
      nextSession: "Dec 6, 2024 - 2:00 PM PST",
    },
    {
      week: 3,
      title: "Website Building (No Code)",
      description: "Create websites with AI assistance",
      status: "active",
      progress: 0,
      lessons: ["Website Platform Selection", "Homepage Design", "Essential Pages", "SEO & Launch"],
      icon: Rocket,
      color: "from-orange-500 to-yellow-500",
      nextSession: "Dec 9, 2024 - 2:00 PM PST",
    },
    {
      week: 4,
      title: "AI Agents & Automation",
      description: "Deploy autonomous AI agents for your business",
      status: "active",
      progress: 0,
      lessons: ["AI Chatbots", "Workflow Automation", "Email Automation", "Social Media Scheduling"],
      icon: Zap,
      color: "from-purple-600 to-pink-500",
      nextSession: "Dec 12, 2024 - 2:00 PM PST",
    },
  ];

  const upcomingSessions = [
    {
      date: "Dec 3",
      time: "2:00 PM PST",
      title: "Live Q&A: AI Content Creation",
      type: "Group Session",
      attendees: 245,
    },
    {
      date: "Dec 6",
      time: "2:00 PM PST",
      title: "Brand Showcase & Feedback",
      type: "Group Session",
      attendees: 312,
    },
  ];

  const recentActivity = [
    { user: "Sarah M.", action: "shared her AI-generated brand photos", time: "2 hours ago" },
    { user: "Nadia", action: "replied to your question about ChatGPT prompts", time: "5 hours ago" },
    { user: "Jessica K.", action: "completed Website Building module", time: "1 day ago" },
    { user: "Maria L.", action: "started AI Agents & Automation", time: "1 day ago" },
  ];

  const progressPercentage = 65;

  // Week 1 & 2 Lessons - Rich Content with Women Metaphors
  const week1Lessons = {
    "AI Photography": {
      emoji: "📸",
      tagline: "Create Stunning Brand Photos Without a Camera",
      description: "Master AI image generation to create professional, consistent brand photography. Learn the secret prompts that get you exactly what you want every time—and how to polish them to perfection.",
      objectives: [
        "Master AI image generation with Midjourney, DALL-E 3, Leonardo.AI, and Magnific AI",
        "Write prompts that produce exactly the photos you envision using the Subject + Style + Lighting + Composition + Quality formula",
        "Create consistent brand photography across all platforms and marketing materials",
        "Polish AI-generated images with advanced editing techniques for professional results"
      ],
      keyTopics: [
        { title: "The Prompt Formula", desc: "[Subject] + [Style] + [Lighting] + [Composition] + [Quality Tags]—your blueprint for perfect shots" },
        { title: "Tool Comparison: Midjourney vs DALL-E vs Leonardo", desc: "Ultra-realistic brand photography, quick quality images, or product-focused results—choose your weapon" },
        { title: "Creating Brand Consistency", desc: "Use the same style keywords and seed numbers to ensure all your AI photos look like they belong together" },
        { title: "Making It Look Real", desc: "Add imperfections, specify camera settings, include environmental details—avoid the obvious AI tells" }
      ],
      exercise: {
        title: "Create Your 3-Image Instagram Carousel",
        desc: "Generate: 1) You/your brand story, 2) Your product/service in action, 3) The transformation/result. Write down the exact prompts you used—these become your gold standard templates.",
        timeEstimate: "45 minutes"
      },
      resources: [
        { title: "Ultimate AI Photography Prompt Template", type: "Template" },
        { title: "Professional Headshot Prompt Examples", type: "Swipes" },
        { title: "Product Photography Prompt Library", type: "Swipes" },
        { title: "Advanced Consistency Techniques (Seed Numbers)", type: "Guide" }
      ]
    },
    "Video Generation": {
      emoji: "🎬",
      tagline: "Create Scroll-Stopping Videos in Minutes",
      description: "Transform your AI images into dynamic videos, create talking head videos without filming a single take, and master AI-powered video editing. No expensive equipment needed—just pure video magic.",
      objectives: [
        "Use Runway ML to convert static images into engaging motion videos with custom prompts",
        "Create professional talking head videos using HeyGen with AI avatars or your own likeness",
        "Generate text-to-video content optimized for TikTok, Instagram Reels, and YouTube Shorts",
        "Master CapCut's AI features: auto-captions, auto-subtitles, auto-effects, and intelligent editing"
      ],
      keyTopics: [
        { title: "Image-to-Video with Runway ML", desc: "Turn your hero shot into a dynamic video: camera zoom, subtle movements, motion effects—in seconds" },
        { title: "Talking Head Videos (HeyGen)", desc: "Record your voice or use AI voice, pick an avatar or use your photo—boom, professional video without the awkward takes" },
        { title: "AI Video Editing Mastery", desc: "Auto-captions, auto-transitions, background removal, speed changes—CapCut's AI does the heavy lifting" },
        { title: "Multi-Platform Optimization", desc: "Different aspect ratios and lengths for each platform: TikTok (9:16), Reels (9:16), Shorts (9:16), LinkedIn (1:1)" }
      ],
      exercise: {
        title: "Create Your First Complete AI Video",
        desc: "Choose: 30-second brand intro (HeyGen), product showcase (image-to-video), or tips video (auto-captions). Script, generate, edit, post. Own it.",
        timeEstimate: "60 minutes"
      },
      resources: [
        { title: "The Perfect 30-Second Hook Script Template", type: "Template" },
        { title: "AI Video Tools Ranked: Performance + Speed + Price", type: "Comparison" },
        { title: "HeyGen Avatar + Voice Setup Guide", type: "Tutorial" },
        { title: "5 Viral Video Formulas Proven to Work", type: "Swipes" }
      ]
    },
    "Copy Writing": {
      emoji: "✨",
      tagline: "Write Copy That Converts While Sipping Your Morning Coffee",
      description: "Master ChatGPT and AI copywriting to craft sales pages, email sequences, social captions, and product descriptions that actually convert. AI drafts it, you make it legendary with your unique voice.",
      objectives: [
        "Use ChatGPT prompts to generate high-converting sales copy, email sequences, and product descriptions",
        "Create your personal brand voice guide so AI knows how to sound like YOU",
        "Build email sequences that get opened, read, and convert (welcome, value, soft pitch)",
        "Write social media copy that hooks, engages, and drives action—using the PAS framework"
      ],
      keyTopics: [
        { title: "The Ultimate ChatGPT Prompt Formula", desc: "Tell it your audience, pain points, transformation, and unique angle—watch it amplify your message" },
        { title: "Sales Page Framework", desc: "Problem → Agitate → Solution → Objection Handling → Strong CTA (PAS framework AI knows cold)" },
        { title: "5-Email Welcome Sequence Template", desc: "Email 1: Welcome + expectations, Email 2: Story + connection, Email 3: Massive value, Email 4: Social proof, Email 5: Soft pitch" },
        { title: "The Art of Iteration", desc: "AI's first draft is never final. Edit, personalize, inject yourself, test, repeat until it converts" }
      ],
      exercise: {
        title: "Write Your Best Sales Email Sequence",
        desc: "Use AI to draft 3 emails for your core offering. Edit for your voice. Share with community for feedback. This is your template forever.",
        timeEstimate: "90 minutes"
      },
      resources: [
        { title: "Sales Page Copy Swipe File (50 High-Converters)", type: "Swipes" },
        { title: "Email Sequence Templates (Welcome + Upsell)", type: "Templates" },
        { title: "Power Words That Make People Click", type: "Cheat Sheet" },
        { title: "Brand Voice Definition Worksheet", type: "Workbook" }
      ]
    },
    "Social Media Magic": {
      emoji: "📱",
      tagline: "Never Run Out of Content Ideas Again",
      description: "Create 30 days of social media content in one sitting using AI. Learn the content calendar system, repurposing framework, and viral formulas that actually work. Your followers will think you have a team.",
      objectives: [
        "Generate 5 sustainable content pillars specific to your business using ChatGPT",
        "Create a complete 30-day content calendar with specific posts, times, hashtags, and hooks",
        "Master the repurposing framework: turn 1 piece of content into 10 different formats",
        "Use proven viral frameworks and scheduling tools to maximize reach without extra work"
      ],
      keyTopics: [
        { title: "Your 5 Content Pillars", desc: "Expertise showcase, value delivery, behind-the-scenes, community building, promotional—balanced sustainability" },
        { title: "The Repurposing Framework", desc: "Turn 1 blog post into: Instagram post, Reel script, Carousel, LinkedIn post, Twitter thread, Pinterest pin, Email, YouTube Short" },
        { title: "Viral Content Frameworks", desc: "Transformation posts, Listicles, Story hooks, Myth-busters—proven patterns that get engagement" },
        { title: "Content Batching & Scheduling", desc: "Create a month of content in 2-3 hours, schedule with Buffer/Later, set and forget" }
      ],
      exercise: {
        title: "Build Your 30-Day Content Calendar",
        desc: "AI-generate your content pillars, create 30 days of specific posts with hooks, times, hashtags. Batch create assets. Schedule everything. Welcome to the freedom zone.",
        timeEstimate: "120 minutes"
      },
      resources: [
        { title: "30-Day Content Calendar Template (AI-Integrated)", type: "Template" },
        { title: "The Complete Repurposing Framework", type: "System" },
        { title: "Hashtag Strategy by Platform", type: "Guide" },
        { title: "Best Scheduling Tools Comparison (Free + Paid)", type: "Resource" }
      ]
    }
  };

  // Week 2 Lessons - Brand Identity & Design
  const week2Lessons = {
    "Logo Design": {
      emoji: "🎨",
      tagline: "Create Professional Logos (Without Hiring a Designer)",
      description: "Master AI-powered logo creation using Looka, ChatGPT, and Midjourney. Design multiple professional logo concepts and convert them to scalable vector formats. Your brand identity starts here.",
      objectives: [
        "Understand the 5 types of logos and when to use each",
        "Use Looka.com for quick, professional logo generation",
        "Create custom logos with ChatGPT + DALL-E 3 prompts",
        "Convert logos to vector format (SVG) for any size",
        "Design 3 distinct logo variations (conservative, bold, personal)"
      ],
      keyTopics: [
        { title: "Logo Types & Strategy", desc: "Wordmark, lettermark, icon, combination, emblem—choose the right type for your brand story" },
        { title: "AI Logo Tools", desc: "Looka (beginner-friendly), ChatGPT + DALL-E (custom), Midjourney (artistic), Vectorizer.AI (conversion)" },
        { title: "Logo Refinement", desc: "Adjust colors, fonts, placement, and scale. Create horizontal, vertical, and icon-only versions" },
        { title: "Vector Conversion", desc: "Upload to Vectorizer.AI, download as SVG, test at all sizes—from favicon to billboards" }
      ],
      exercise: {
        title: "Design 3 Logo Concepts",
        desc: "Create three completely different logos using your preferred tool. Share each with #Week2Logo and get community feedback before choosing your final design.",
        timeEstimate: "90 minutes"
      },
      resources: [
        { title: "Logo Brief Template (Fill-in-the-Blank)", type: "Template" },
        { title: "Looka Step-by-Step Guide", type: "Tutorial" },
        { title: "ChatGPT Logo Prompt Formulas", type: "Swipes" },
        { title: "Midjourney Logo Prompts (Advanced)", type: "Guide" }
      ]
    },
    "Color Psychology": {
      emoji: "🎭",
      tagline: "Choose Colors That Attract Your Dream Clients",
      description: "Master color psychology to select the perfect brand palette. Learn why colors matter, test for accessibility, and create a cohesive color system that represents your brand personality.",
      objectives: [
        "Understand color psychology and emotional associations",
        "Apply the 60-30-10 color rule for brand harmony",
        "Use Coolors.co and Adobe Color for palette generation",
        "Test color combinations for WCAG accessibility",
        "Create a complete color palette guide with hex codes"
      ],
      keyTopics: [
        { title: "Color Psychology Basics", desc: "Red (passion), Blue (trust), Purple (luxury), Green (growth), Pink (feminine), Yellow (optimism)—each color tells a story" },
        { title: "The 60-30-10 Rule", desc: "60% primary, 30% secondary, 10% accent. Add neutrals (white, black, grays) for balance and readability" },
        { title: "AI Palette Tools", desc: "ChatGPT for psychology recommendations, Coolors.co for generation, Adobe Color for harmony testing" },
        { title: "Accessibility Testing", desc: "Use WebAIM contrast checker. Ensure 4.5:1 ratio minimum for text on backgrounds (WCAG AA compliance)" }
      ],
      exercise: {
        title: "Create Your Brand Color Palette",
        desc: "Define 5 adjectives for your brand, choose primary/secondary/accent colors with psychology reasoning, create 8-10 total color variations, test contrast, share with #Week2Colors.",
        timeEstimate: "60 minutes"
      },
      resources: [
        { title: "Color Psychology Chart", type: "Guide" },
        { title: "Coolors.co Tutorial", type: "Tutorial" },
        { title: "Adobe Color Harmony Guide", type: "Guide" },
        { title: "Accessible Color Palette Generator", type: "Tool" }
      ]
    },
    "Typography": {
      emoji: "🔤",
      tagline: "Choose Fonts That Speak Your Brand Language",
      description: "Master font psychology and pairing. Select headline and body fonts that reflect your brand personality and ensure perfect readability across all platforms.",
      objectives: [
        "Understand font categories (serif, sans-serif, script, display, monospace)",
        "Learn proven font pairing formulas that work",
        "Find free commercial fonts on Google Fonts and Font Squirrel",
        "Use ChatGPT to recommend fonts for your brand",
        "Create a complete typography system with sizing and spacing"
      ],
      keyTopics: [
        { title: "Font Psychology", desc: "Serif (trustworthy), Sans-serif (modern), Script (elegant), Display (bold), Monospace (technical)—match fonts to your brand personality" },
        { title: "Font Pairing Rules", desc: "Contrast styles (serif + sans-serif), limit to 2-3 fonts, use one font family with different weights" },
        { title: "Perfect Pairings", desc: "Playfair + Lato (elegant), Montserrat + Open Sans (modern), Bebas + Roboto (bold), Space Grotesk + Inter (tech)" },
        { title: "Typography System", desc: "Define H1-H3 sizes (48-72px), body text (16-18px), line height (1.5-1.7), letter spacing rules" }
      ],
      exercise: {
        title: "Design Your Typography System",
        desc: "Choose 2 Google Fonts, create sample headlines and body copy, define sizing hierarchy (H1/H2/H3/body), test readability at different sizes, share with #Week2Typography.",
        timeEstimate: "45 minutes"
      },
      resources: [
        { title: "Font Pairing Combinations (Tested)", type: "Guide" },
        { title: "Google Fonts Best Fonts for Brands", type: "Curated List" },
        { title: "Typography Scale Calculator", type: "Tool" },
        { title: "Font Psychology Deep Dive", type: "Guide" }
      ]
    },
    "Brand Kit Assembly": {
      emoji: "✨",
      tagline: "Create Your Complete Brand Identity Package",
      description: "Bring it all together! Assemble your logo, colors, fonts, and messaging into a professional brand guidelines document and create reusable branded templates.",
      objectives: [
        "Create a complete logo package (6+ versions)",
        "Assemble your color palette guide with hex codes",
        "Document your typography system",
        "Write brand voice and messaging guidelines",
        "Design 5+ branded templates ready to use"
      ],
      keyTopics: [
        { title: "Logo Package Requirements", desc: "Full color, black, white, transparent, favicon, social profile, horizontal + vertical layouts" },
        { title: "Brand Guidelines Document", desc: "8-page PDF: logo usage, colors, typography, photography style, brand voice, applications, do's/don'ts" },
        { title: "Branded Templates", desc: "Instagram post/story, LinkedIn, email header, presentation slides, one-pager, Zoom background—all on-brand" },
        { title: "Consistency Checklist", desc: "Every piece uses approved colors, fonts, includes logo (when appropriate), matches personality, follows spacing guidelines" }
      ],
      exercise: {
        title: "Build Your Complete Brand Kit",
        desc: "Create: logo package (all versions), color guide, typography guide, 8-page brand guidelines PDF, 5 branded templates. Use Canva for documents and templates.",
        timeEstimate: "90 minutes"
      },
      resources: [
        { title: "Brand Guidelines Template (8-Page)", type: "Template" },
        { title: "Canva Brand Kit Setup Guide", type: "Tutorial" },
        { title: "Brand Consistency Checklist", type: "Checklist" },
        { title: "Instagram Template Bundle", type: "Templates" }
      ]
    }
  };

  // Week 4 Lessons - AI Agents & Automation Masterclass
  const week4Lessons = {
    "AI Chatbots": {
      emoji: "🤖",
      tagline: "Your 24/7 Customer Support Team",
      description: "Set up AI chatbots that handle FAQs, qualify leads, and book appointments—saving you 5-10 hours per week. No coding required.",
      objectives: [
        "Understand why chatbots are essential for your business",
        "Choose the right chatbot platform (Chatbase recommended)",
        "Train your chatbot with your business information",
        "Integrate chatbots with your website and messaging platforms",
        "Build advanced flows for lead qualification and booking"
      ],
      keyTopics: [
        { title: "Chatbot Basics", desc: "Save time answering FAQs, respond 24/7, qualify leads automatically, capture customer info while you sleep" },
        { title: "Platform Comparison", desc: "Chatbase (fastest), Tidio (e-commerce), ManyChat (social), Voiceflow (advanced). Start with Chatbase!" },
        { title: "Training Your Chatbot", desc: "Create knowledge base document with services, FAQs, pricing, policies. Chatbase learns from your website & docs." },
        { title: "Advanced Flows", desc: "Lead qualification conversations, appointment booking integration, product recommendations, smart escalation to you" }
      ],
      exercise: {
        title: "Build & Deploy Your AI Chatbot",
        desc: "Sign up on Chatbase, gather all business info, create knowledge base, train chatbot, customize appearance, test 20+ questions, install on website, set up notifications.",
        timeEstimate: "90 minutes"
      },
      resources: [
        { title: "Chatbot Platform Comparison Guide", type: "Guide" },
        { title: "Knowledge Base Template", type: "Template" },
        { title: "Lead Qualification Conversation Flows", type: "Template" },
        { title: "Chatbot Training Prompt", type: "Prompt" }
      ]
    },
    "Workflow Automation": {
      emoji: "⚡",
      tagline: "Connect Your Apps & Automate Everything",
      description: "Use Zapier or Make to create workflows that automatically manage leads, send emails, update databases, and run your business while you sleep.",
      objectives: [
        "Understand workflow automation and why it matters",
        "Choose between Zapier (easier) and Make (more powerful)",
        "Create your first automation (lead capture)",
        "Set up multi-step workflows with conditions",
        "Integrate AI (ChatGPT) into your workflows"
      ],
      keyTopics: [
        { title: "Workflow Automation Concept", desc: "When [Trigger] in App A, do [Actions] in App B—automatically. No coding. Saves massive time & errors." },
        { title: "Essential Automations", desc: "Lead capture, social to email, content distribution, calendar management, client onboarding, invoice follow-up, social proof collection, content repurposing" },
        { title: "Zapier vs Make", desc: "Zapier: 6,000 integrations, easy, more expensive. Make: more powerful, cheaper, steeper learning curve. Start with Zapier!" },
        { title: "Advanced Workflows", desc: "Multi-step sequences, conditional logic (if/then), delays, ChatGPT integration, complex nurture sequences running on autopilot" }
      ],
      exercise: {
        title: "Set Up 3 Essential Automations",
        desc: "Create lead capture workflow, booking confirmation automation, content distribution automation. Bonus: 1 advanced multi-step workflow with conditions.",
        timeEstimate: "90 minutes"
      },
      resources: [
        { title: "Zapier Setup Guide", type: "Tutorial" },
        { title: "8 Essential Automation Templates", type: "Templates" },
        { title: "Lead Nurture Workflow Example", type: "Template" },
        { title: "Workflow Planning Prompt", type: "Prompt" }
      ]
    },
    "Email Automation": {
      emoji: "📧",
      tagline: "Nurture Leads While You Sleep",
      description: "Create automated email sequences that welcome subscribers, build connection, showcase expertise, provide social proof, and convert them into paying clients.",
      objectives: [
        "Choose the right email marketing platform (ConvertKit or Klaviyo)",
        "Create a powerful welcome sequence (5-7 emails)",
        "Write emails that build connection and trust",
        "Segment your audience for personalized campaigns",
        "Automate your entire customer nurture journey"
      ],
      keyTopics: [
        { title: "Email Marketing Stats", desc: "4x higher ROI than social, 119% higher click rates on automations, 74% expect welcome emails, nurtured leads buy 47% more" },
        { title: "Platform Comparison", desc: "ConvertKit (creators), Mailchimp (most popular), ActiveCampaign (powerful), Klaviyo (e-commerce). Use ConvertKit or Klaviyo." },
        { title: "Welcome Sequence Formula", desc: "Email 1: Welcome + deliver promise. Email 2: Your story. Email 3: Massive value. Email 4: Social proof. Email 5: The offer." },
        { title: "Advanced Email Strategies", desc: "Segmentation based on behavior, personalization with dynamic fields, A/B testing subject lines, re-engagement campaigns, win-back sequences" }
      ],
      exercise: {
        title: "Create Your Welcome Sequence",
        desc: "Sign up on ConvertKit/Klaviyo, write 5-email welcome sequence (welcome, story, value, case study, offer), set up automation triggers, test with yourself, monitor performance.",
        timeEstimate: "90 minutes"
      },
      resources: [
        { title: "Perfect Welcome Sequence Template", type: "Template" },
        { title: "5-Email Sequence Copy Prompts", type: "Prompts" },
        { title: "Email Subject Line Swipes", type: "Swipes" },
        { title: "Segmentation Strategy Guide", type: "Guide" }
      ]
    },
    "Social Media Scheduling": {
      emoji: "📱",
      tagline: "Post Consistently Without Daily Effort",
      description: "Schedule content weeks in advance, auto-post to all platforms, analyze performance, and maintain consistent presence while you focus on business growth.",
      objectives: [
        "Choose social media scheduling tools (Buffer or Later recommended)",
        "Create a content calendar and batch-create posts",
        "Schedule posts for optimal times (AI-powered recommendations)",
        "Repurpose content across multiple platforms",
        "Analyze performance and refine your strategy"
      ],
      keyTopics: [
        { title: "Why Scheduling Matters", desc: "Post consistently without daily stress, schedule for best times, reach more people, maintain presence while busy, save hours weekly" },
        { title: "Scheduling Tools", desc: "Buffer (simple), Later (visual), Hootsuite (all-in-one), Meta Business Suite (Meta platforms). Start with Buffer!" },
        { title: "Content Batching", desc: "Create week's worth of content in 2-3 hours, schedule all at once, repurpose 1 piece across multiple formats and platforms" },
        { title: "AI-Powered Optimization", desc: "Best time to post, auto-generate captions with AI, analyze which content resonates, smart recommendations for content types" }
      ],
      exercise: {
        title: "Set Up Social Media Automation",
        desc: "Choose scheduling tool, create 2-week content calendar, batch-create 20+ posts, schedule across all platforms, set up performance analytics, create monthly posting routine.",
        timeEstimate: "90 minutes"
      },
      resources: [
        { title: "Content Calendar Template", type: "Template" },
        { title: "Caption Generator Prompts", type: "Prompts" },
        { title: "Posting Schedule by Platform", type: "Guide" },
        { title: "Content Batching Workflow", type: "Tutorial" }
      ]
    }
  };

  // Week 3 Lessons - No-Code Website Building
  const week3Lessons = {
    "Website Platform Selection": {
      emoji: "🌐",
      tagline: "Choose Your Perfect No-Code Website Builder",
      description: "Master the top website builders and choose the right one for your business. Learn about domains, hosting, and plan your complete website structure before building.",
      objectives: [
        "Compare top no-code platforms (Wix, Squarespace, Framer, Webflow, Carrd)",
        "Understand domains and hosting fundamentals",
        "Choose the right platform for your business type",
        "Plan your complete website structure and sitemap",
        "Set up your domain and begin building"
      ],
      keyTopics: [
        { title: "Platform Comparison", desc: "Wix (beginners), Squarespace (creatives), Framer (modern design), Webflow (advanced), Carrd (simple)" },
        { title: "Domain & Hosting", desc: "Understanding domain names, where to buy (.com, .co, .io), hosting basics, and free domain first-year offers" },
        { title: "Website Structure", desc: "Essential pages: homepage, about, services, contact. Optional: portfolio, blog, testimonials, FAQ, resources" },
        { title: "User Journey Planning", desc: "Map out how visitors move through your site, identify conversion points, and plan CTA placement" }
      ],
      exercise: {
        title: "Setup Your Website Foundation",
        desc: "Choose your platform, generate 10 domain options with AI, purchase domain, plan your sitemap with all pages, sketch basic navigation menu.",
        timeEstimate: "60 minutes"
      },
      resources: [
        { title: "Website Builder Comparison Chart", type: "Guide" },
        { title: "Domain Name Generator Prompt", type: "Template" },
        { title: "Website Sitemap Planning Template", type: "Worksheet" },
        { title: "Platform Setup Video Tutorials", type: "Videos" }
      ]
    },
    "Homepage Design": {
      emoji: "🎯",
      tagline: "Create a Homepage That Converts Visitors Into Clients",
      description: "Design a stunning homepage using the proven conversion formula. Learn the anatomy of high-converting homepages and how to write copy that sells.",
      objectives: [
        "Understand the homepage conversion formula (7-section structure)",
        "Create compelling hero sections with strong CTAs",
        "Address pain points and agitate customer problems",
        "Build trust with social proof and testimonials",
        "Write benefit-focused copy that converts"
      ],
      keyTopics: [
        { title: "Hero Section Formula", desc: "Headline (value prop) + Subheadline (transformation) + Image + CTA + Trust indicators—what visitors see first" },
        { title: "Problem/Agitation Section", desc: "Connect with pain points, show understanding, position yourself as the solution—the emotional sell" },
        { title: "Social Proof & Trust", desc: "Testimonials, case studies, numbers, media mentions, certifications—build credibility and reduce objections" },
        { title: "Final CTA & Footer", desc: "Last conversion opportunity, complete navigation, contact info, legal pages, newsletter signup" }
      ],
      exercise: {
        title: "Design Your High-Converting Homepage",
        desc: "Create hero section, problem statement, 3-step solution process, 3 testimonials, features grid, final CTA, complete footer. Use AI to write all copy.",
        timeEstimate: "90 minutes"
      },
      resources: [
        { title: "Homepage Template (7-Section Formula)", type: "Template" },
        { title: "Hero Section Copy Generator Prompt", type: "Prompt" },
        { title: "High-Converting Homepage Examples", type: "Swipes" },
        { title: "Testimonial Format & Placeholders", type: "Template" }
      ]
    },
    "Essential Pages": {
      emoji: "📄",
      tagline: "Build Pages That Connect and Sell",
      description: "Create complete, professional pages for About, Services/Products, and Contact. Each page has a specific formula for maximum impact and conversions.",
      objectives: [
        "Write an authentic About page that builds connection",
        "Create Services/Products pages that sell without being salesy",
        "Design Contact pages that make it easy to get in touch",
        "Showcase your portfolio/work with before-and-after impact",
        "Use AI to write compelling page copy"
      ],
      keyTopics: [
        { title: "About Page Formula", desc: "Opening hook, your journey, credentials & proof, personal touch, clear next step—tell your story authentically" },
        { title: "Services/Products Pages", desc: "What's included, who it's for, benefits & outcomes, pricing, FAQ, strong CTA—sell the transformation" },
        { title: "Contact Page Best Practices", desc: "Easy contact form, multiple contact methods, response time expectations, what happens next after submission" },
        { title: "Portfolio/Work Showcase", desc: "Hero image, project details, the challenge, your solution, the results—demonstrate your value with proof" }
      ],
      exercise: {
        title: "Build Your Essential Pages",
        desc: "Create About page (500-800 words), one Services/Products page, Contact page with form, Portfolio section with 3 examples (real or placeholder).",
        timeEstimate: "90 minutes"
      },
      resources: [
        { title: "About Page Template with Prompts", type: "Template" },
        { title: "Services/Products Page Template", type: "Template" },
        { title: "Contact Page Setup Guide", type: "Tutorial" },
        { title: "Portfolio Case Study Template", type: "Template" }
      ]
    },
    "SEO & Launch": {
      emoji: "🚀",
      tagline: "Get Found on Google & Launch Your Website",
      description: "Master SEO basics to get found on Google. Optimize your content, fix technical issues, and launch your website with confidence to the world.",
      objectives: [
        "Understand SEO fundamentals and the 3 pillars (on-page, technical, off-page)",
        "Research and target the right keywords for your business",
        "Optimize your website pages for search engines",
        "Complete technical SEO checklist",
        "Launch your website and promote it"
      ],
      keyTopics: [
        { title: "SEO Fundamentals", desc: "What is SEO, the 3 pillars (on-page content, technical setup, external signals), how Google ranks websites" },
        { title: "Keyword Research", desc: "Brain dump keywords, use AI for ideas, check difficulty, choose targets: 1-2 for homepage, 1 per service/page" },
        { title: "On-Page Optimization", desc: "Title tags (60 chars), meta descriptions (150-160 chars), H1/H2 headers, keyword density, internal links" },
        { title: "Technical SEO Checklist", desc: "Mobile-friendly, fast loading, HTTPS security, clean structure, sitemap, robots.txt, Google Search Console setup" }
      ],
      exercise: {
        title: "Optimize & Launch Your Website",
        desc: "Research 30+ keywords with AI, choose target keywords by page, optimize all titles/descriptions/headers, run technical SEO checklist, submit to Google Search Console, launch website!",
        timeEstimate: "90 minutes"
      },
      resources: [
        { title: "SEO Keywords Research Prompt", type: "Prompt" },
        { title: "Technical SEO Checklist", type: "Checklist" },
        { title: "Meta Description & Title Examples", type: "Swipes" },
        { title: "Launch Preparation Checklist", type: "Checklist" }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="AI Mastery Program Learning Hub | MetaHers Mind Spa"
        description="Welcome to your AI Mastery Program dashboard. Complete 4-week curriculum, join live sessions, and connect with 500+ women solopreneurs in our exclusive community."
      />
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="dashboard" className="flex items-center gap-2" data-testid="tab-dashboard">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="sessions" className="flex items-center gap-2" data-testid="tab-sessions">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Live Sessions</span>
              </TabsTrigger>
              <TabsTrigger value="community" className="flex items-center gap-2" data-testid="tab-community">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Community</span>
              </TabsTrigger>
            </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Hero Welcome */}
            <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-2xl p-8 text-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">
                    Welcome Back, Queen! 👑
                  </h1>
                  <p className="text-purple-100 text-lg mb-6">
                    You're making incredible progress. Keep shining!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-3">
                      <div className="text-2xl font-bold">{progressPercentage}%</div>
                      <div className="text-sm text-purple-100">Overall Progress</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-3">
                      <div className="text-2xl font-bold">12</div>
                      <div className="text-sm text-purple-100">Lessons Completed</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-3">
                      <div className="text-2xl font-bold">3</div>
                      <div className="text-sm text-purple-100">Live Sessions</div>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:flex w-32 h-32 bg-white/20 backdrop-blur rounded-full flex-shrink-0 items-center justify-center">
                  <Heart className="w-16 h-16 text-white" fill="currentColor" />
                </div>
              </div>
            </div>

            {/* Next Live Session Alert */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-4">
                <Video className="w-12 h-12 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-pink-100">NEXT LIVE SESSION</div>
                  <div className="text-xl font-bold mb-1">AI Content Creation Q&A with Nadia</div>
                  <div className="text-pink-100">December 3, 2024 at 2:00 PM PST</div>
                </div>
                <Button className="bg-white text-pink-600 hover:bg-pink-50 whitespace-nowrap flex-shrink-0" data-testid="button-join-next-session">
                  Join Session
                </Button>
              </div>
            </div>

            {/* Learning Modules */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Learning Journey</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modules.map((module) => {
                  const Icon = module.icon;
                  const isClickable = module.status !== "locked" && (module.week === 1 || module.week === 2 || module.week === 3 || module.week === 4);
                  return (
                    <button
                      key={module.week}
                      onClick={() => {
                        if (isClickable) {
                          const newLesson = expandedLesson ? null : module.lessons[0];
                          setExpandedLesson(newLesson);
                          // Scroll to expanded lesson when opened
                          if (newLesson) {
                            setTimeout(() => {
                              document.querySelector('[data-lesson-expanded]')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 0);
                          }
                        }
                      }}
                      type="button"
                      className={`border-2 p-6 rounded-lg transition-all text-left w-full ${
                        module.status === "locked"
                          ? "border-gray-200 opacity-60 bg-white pointer-events-none"
                          : "border-purple-200 hover:border-purple-400 hover:shadow-lg bg-white"
                      }`}
                      data-testid={`card-module-week-${module.week}`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-3 rounded-lg ${
                              module.status === "locked"
                                ? "bg-gray-100"
                                : "bg-purple-100"
                            }`}
                          >
                            {module.status === "locked" ? (
                              <Lock className="w-6 h-6 text-gray-400" />
                            ) : (
                              <Icon className="w-6 h-6 text-purple-600" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Week {module.week}</div>
                            <div className="font-bold text-gray-800">{module.title}</div>
                          </div>
                        </div>
                      </div>

                      {module.status !== "locked" && (
                        <>
                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Progress</span>
                              <span className="text-purple-600 font-semibold">
                                {module.progress}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`bg-gradient-to-r ${module.color} h-2 rounded-full transition-all`}
                                style={{ width: `${module.progress}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {module.lessons.map((lesson, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded"
                              >
                                {lesson}
                              </span>
                            ))}
                          </div>
                        </>
                      )}

                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {module.nextSession}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Expanded Lesson View - Week 1, 2, 3 & 4 Rich Content */}
            {expandedLesson && (week1Lessons[expandedLesson as keyof typeof week1Lessons] || week2Lessons[expandedLesson as keyof typeof week2Lessons] || week3Lessons[expandedLesson as keyof typeof week3Lessons] || week4Lessons[expandedLesson as keyof typeof week4Lessons]) && (
              <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-2xl p-8 border-2 border-purple-200 mt-8" data-lesson-expanded>
                {(() => {
                  const lesson = week1Lessons[expandedLesson as keyof typeof week1Lessons] || week2Lessons[expandedLesson as keyof typeof week2Lessons] || week3Lessons[expandedLesson as keyof typeof week3Lessons] || week4Lessons[expandedLesson as keyof typeof week4Lessons];
                  return (
                    <div>
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="text-5xl mb-3">{lesson.emoji}</div>
                          <h3 className="text-3xl font-bold text-gray-900 mb-2">{expandedLesson}</h3>
                          <p className="text-lg text-purple-600 font-semibold italic mb-4">{lesson.tagline}</p>
                          <p className="text-gray-700 leading-relaxed text-lg">{lesson.description}</p>
                        </div>
                        <button 
                          onClick={() => setExpandedLesson(null)}
                          className="flex-shrink-0 ml-4"
                          data-testid="button-close-lesson"
                        >
                          <ChevronUp className="w-8 h-8 text-purple-600 hover:text-purple-800" />
                        </button>
                      </div>

                      {/* Learning Objectives */}
                      <div className="mb-8">
                        <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Target className="w-6 h-6 text-purple-600" />
                          What You'll Learn
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {lesson.objectives.map((obj, idx) => (
                            <div key={idx} className="flex gap-3 bg-white p-4 rounded-lg border-2 border-purple-100">
                              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700">{obj}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Key Topics */}
                      <div className="mb-8">
                        <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Lightbulb className="w-6 h-6 text-orange-600" />
                          Key Concepts
                        </h4>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {lesson.keyTopics.map((topic, idx) => (
                            <div key={idx} className="bg-white p-5 rounded-lg border-l-4 border-pink-500">
                              <h5 className="font-bold text-gray-900 mb-2">{topic.title}</h5>
                              <p className="text-gray-600 text-sm italic">{topic.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Interactive Exercise */}
                      <div className="mb-8 bg-white rounded-xl p-6 border-2 border-purple-300">
                        <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Zap className="w-6 h-6 text-yellow-500" />
                          Your Challenge
                        </h4>
                        <div className="bg-purple-50 rounded-lg p-5 mb-4">
                          <p className="text-lg font-semibold text-gray-900 mb-2">{lesson.exercise.title}</p>
                          <p className="text-gray-700 mb-3">{lesson.exercise.desc}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>Time to complete: {lesson.exercise.timeEstimate}</span>
                          </div>
                        </div>
                        <Button className="bg-purple-600 text-white hover:bg-purple-700 w-full" data-testid={`button-start-exercise-${expandedLesson}`}>
                          Start This Challenge
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>

                      {/* Resources */}
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Award className="w-6 h-6 text-pink-600" />
                          Resources & Templates
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {lesson.resources.map((resource, idx) => (
                            <button
                              key={idx}
                              className="text-left bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-purple-400 hover:shadow-md transition-all"
                              data-testid={`button-resource-${resource.title.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-semibold text-gray-900">{resource.title}</p>
                                  <p className="text-xs text-purple-600 font-medium mt-1">{resource.type}</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-purple-600 flex-shrink-0 mt-1" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Lesson Navigation */}
                      <div className="mt-8 flex flex-wrap gap-3 pt-6 border-t-2 border-gray-200">
                        {(() => {
                          const currentModule = modules.find(m => (m.week === 1 && week1Lessons[expandedLesson as keyof typeof week1Lessons]) || (m.week === 2 && week2Lessons[expandedLesson as keyof typeof week2Lessons]) || (m.week === 3 && week3Lessons[expandedLesson as keyof typeof week3Lessons]) || (m.week === 4 && week4Lessons[expandedLesson as keyof typeof week4Lessons]));
                          return (currentModule?.lessons || []).map((lessonTitle, idx) => (
                            <button
                              key={idx}
                              onClick={() => setExpandedLesson(lessonTitle)}
                              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                expandedLesson === lessonTitle
                                  ? "bg-purple-600 text-white"
                                  : "bg-white text-purple-600 border-2 border-purple-200 hover:border-purple-400"
                              }`}
                              data-testid={`button-lesson-nav-${lessonTitle.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                              {lessonTitle}
                            </button>
                          ));
                        })()}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Community Activity & Ask Nadia */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl p-6 border-2 border-gray-200">
                <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                  <Users className="w-6 h-6 text-purple-600" />
                  Community Activity
                </h3>
                <div className="space-y-3">
                  {recentActivity.map((activity, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {activity.user[0]}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">
                          <span className="font-semibold">{activity.user}</span>{" "}
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-purple-600 text-white hover:bg-purple-700" data-testid="button-view-private-group">
                  View Private Group
                </Button>
              </div>

              <div className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MessageCircle className="w-6 h-6" />
                  Ask Nadia
                </h3>
                <p className="text-white/90 mb-4 text-sm">
                  Have a question? I'm here to help! Get direct answers from me in the
                  private group.
                </p>
                <Button className="w-full bg-white text-pink-600 hover:bg-pink-50" data-testid="button-message-nadia-dashboard">
                  Message Nadia
                </Button>
                <div className="mt-4 p-3 bg-white/20 backdrop-blur rounded-lg">
                  <div className="text-sm font-semibold mb-1">Average Response Time</div>
                  <div className="text-2xl font-bold" data-testid="text-response-time">{"<"} 2 hours</div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Live Sessions Tab */}
          <TabsContent value="sessions" className="space-y-6">
            <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Upcoming Live Sessions</h2>
              <div className="space-y-4">
                {upcomingSessions.map((session, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200"
                  >
                    <div className="text-center sm:text-left">
                      <div className="text-3xl font-bold text-purple-600">
                        {session.date.split(" ")[1]}
                      </div>
                      <div className="text-sm text-gray-600">{session.date.split(" ")[0]}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-lg text-gray-800">{session.title}</div>
                      <div className="text-gray-600 text-sm flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                        <span className="flex items-center gap-1">
                          <Video className="w-4 h-4" />
                          {session.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {session.attendees} attending
                        </span>
                        <span>{session.time}</span>
                      </div>
                    </div>
                    <Button className="bg-purple-600 text-white hover:bg-purple-700 flex-shrink-0 whitespace-nowrap" data-testid={`button-join-session-${idx}`}>
                      Join Session
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Session Guidelines</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                  <div className="font-bold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Share Your Work
                  </div>
                  <p className="text-sm text-purple-100">
                    Show off what you've created! We celebrate every win together.
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                  <div className="font-bold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Ask Questions
                  </div>
                  <p className="text-sm text-purple-100">
                    No question is too small. I'm here to help you succeed.
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                  <div className="font-bold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Network & Collaborate
                  </div>
                  <p className="text-sm text-purple-100">
                    Connect with fellow women solopreneurs and build lasting friendships.
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                  <div className="font-bold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Get Recorded
                  </div>
                  <p className="text-sm text-purple-100">
                    All sessions are recorded. Catch up on replays anytime.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-black mb-6">Your Community</h2>

              {/* Community Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2 border-gray-200">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="font-bold text-black mb-2">Private Community</h3>
                  <p className="text-sm text-gray-600">
                    Connect with 500+ women solopreneurs
                  </p>
                </Card>

                <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2 border-gray-200">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-orange-500 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="font-bold text-black mb-2">Direct Message Nadia</h3>
                  <p className="text-sm text-gray-600">
                    Get personal guidance and support
                  </p>
                </Card>

                <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2 border-gray-200">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-yellow-500 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="font-bold text-black mb-2">Exclusive Events</h3>
                  <p className="text-sm text-gray-600">
                    Monthly mastermind sessions
                  </p>
                </Card>

                <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2 border-gray-200">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="font-bold text-black mb-2">Resource Library</h3>
                  <p className="text-sm text-gray-600">
                    Templates and AI prompts
                  </p>
                </Card>
              </div>

              {/* Community Stats */}
              <Card className="p-6 border-2 border-gray-200 mb-6">
                <h3 className="font-bold text-black mb-6">Community Stats</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-bold text-purple-600">500+</p>
                    <p className="text-sm text-gray-600">Members</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-pink-600">48</p>
                    <p className="text-sm text-gray-600">Active Daily</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-orange-600">12</p>
                    <p className="text-sm text-gray-600">Countries</p>
                  </div>
                </div>
              </Card>

              {/* Message Nadia CTA */}
              <Card className="bg-gradient-to-r from-orange-400 to-pink-500 border-0 p-8 text-white">
                <MessageCircle className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-center mb-2">
                  Direct Access to Nadia
                </h3>
                <p className="text-center text-white/90 mb-6">
                  As a program member, you have direct messaging access to get personalized
                  guidance
                </p>
                <Button className="bg-white text-pink-600 hover:bg-pink-50 mx-auto block" data-testid="button-message-nadia-community">
                  Message Nadia
                </Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
