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
      status: "locked",
      progress: 0,
      lessons: ["Logo Design", "Color Psychology", "Visual Identity", "Brand Voice"],
      icon: Star,
      color: "from-pink-500 to-orange-500",
      nextSession: "Dec 6, 2024 - 2:00 PM PST",
    },
    {
      week: 3,
      title: "Website Building (No Code)",
      description: "Create websites with AI assistance",
      status: "locked",
      progress: 0,
      lessons: ["Site Structure", "AI Design Tools", "Content Strategy", "Launch Checklist"],
      icon: Rocket,
      color: "from-orange-500 to-yellow-500",
      nextSession: "Dec 9, 2024 - 2:00 PM PST",
    },
    {
      week: 4,
      title: "AI Agents & Automation",
      description: "Deploy autonomous AI agents for your business",
      status: "locked",
      progress: 0,
      lessons: ["AI Assistants", "Workflow Automation", "Customer Service Bots", "Time Freedom"],
      icon: Zap,
      color: "from-yellow-500 to-pink-500",
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

  // Week 1 Lessons - Rich Content with Women Metaphors
  const week1Lessons = {
    "AI Photography": {
      emoji: "📸",
      tagline: "Turn yourself into a one-woman content machine",
      description: "Learn to generate professional, on-brand photos without hiring a photographer. Because your solo business doesn't have a budget for photoshoots, but it does have your vision.",
      objectives: [
        "Master AI image generation tools (Midjourney, DALL-E, Stable Diffusion)",
        "Create consistent brand aesthetics across all content",
        "Generate product photos, portraits, and lifestyle imagery",
        "Edit and refine AI-generated images for maximum impact"
      ],
      keyTopics: [
        { title: "Prompt Engineering 101", desc: "Write prompts like you're directing a photographer—be specific, be visual, be YOU" },
        { title: "Brand Consistency", desc: "Make sure your AI photos look like they belong in YOUR brand universe" },
        { title: "Tool Comparison", desc: "Midjourney vs DALL-E vs Stable Diffusion—which tool is your soulmate?" },
        { title: "Editing & Enhancement", desc: "Polish those AI babies to perfection in Canva or Photoshop" }
      ],
      exercise: {
        title: "Generate Your Hero Shot",
        desc: "Create 5 AI-generated lifestyle photos that represent your brand in action. Write down the exact prompts you used—these are gold for repetition.",
        timeEstimate: "45 minutes"
      },
      resources: [
        { title: "Prompt Template Library", type: "Template" },
        { title: "AI Image Generation Comparison Chart", type: "Guide" },
        { title: "10 Brand Photography Aesthetics to Steal", type: "Inspiration" },
        { title: "Prompt Secrets: How to Get Perfect Results", type: "Video" }
      ]
    },
    "Video Generation": {
      emoji: "🎬",
      tagline: "Be on camera without actually being on camera (introvert approved)",
      description: "Create short-form videos, explainers, and testimonials using AI. No fancy equipment. No awkward takes. Just pure, polished content magic.",
      objectives: [
        "Use AI video generation tools (Synthesia, Runway, D-ID)",
        "Create talking head videos with AI avatars",
        "Generate text-to-video content for social media",
        "Edit and enhance video content for different platforms"
      ],
      keyTopics: [
        { title: "AI Avatar Videos", desc: "Let a digital you do the talking while you're actually building your business" },
        { title: "Text-to-Video Magic", desc: "Turn your best tweets into viral-ready videos in seconds" },
        { title: "Multi-Platform Optimization", desc: "TikTok, Instagram Reels, YouTube Shorts—different sizes, one toolkit" },
        { title: "Voice & Narration", desc: "AI voice or your own? Let's figure out what feels authentic for your brand" }
      ],
      exercise: {
        title: "Create Your First AI Video",
        desc: "Script and generate a 30-60 second explainer video about your top service or product. Post in the community for feedback.",
        timeEstimate: "60 minutes"
      },
      resources: [
        { title: "Script Template: The Perfect 30-Second Hook", type: "Template" },
        { title: "Best AI Video Tools Ranked (Performance + Price)", type: "Comparison" },
        { title: "Video Editing Hacks for Solopreneurs", type: "Tutorial" },
        { title: "5 Viral Video Formulas (Proven to Work)", type: "Masterclass" }
      ]
    },
    "Copy Writing": {
      emoji: "✨",
      tagline: "Write copy that converts while sipping your morning coffee",
      description: "Master AI-assisted copywriting to create sales pages, emails, social posts, and more. Your words will finally feel as good as they sound in your head.",
      objectives: [
        "Use ChatGPT, Claude, and specialized AI writing tools",
        "Write compelling sales copy and product descriptions",
        "Create email sequences that actually get opened",
        "Develop your unique voice while using AI as your co-writer"
      ],
      keyTopics: [
        { title: "Prompting for Copy", desc: "Tell AI your audience, your pain points, your solution—let it amplify your message" },
        { title: "The Art of Iteration", desc: "First draft is never final. Refine, personalize, inject YOURSELF" },
        { title: "Sales Page Formulas", desc: "Problem → Agitation → Solution → Objection Handling → CTA (AI knows these)" },
        { title: "Email Sequences That Convert", desc: "From welcome series to sales sequences—AI can draft them, you make them human" }
      ],
      exercise: {
        title: "Write Your Best Sales Email",
        desc: "Use AI to draft an email sequence (3 emails) for your core offering. Share with the group and get real feedback.",
        timeEstimate: "90 minutes"
      },
      resources: [
        { title: "Swipe File: 50 High-Converting Sales Pages", type: "Swipes" },
        { title: "Email Sequence Template Library", type: "Template" },
        { title: "Power Words That Make People Click", type: "Cheat Sheet" },
        { title: "From Bland to Iconic: Voice & Tone Guide", type: "Workbook" }
      ]
    },
    "Social Media Magic": {
      emoji: "📱",
      tagline: "Post like a content guru, schedule like a boss, engage like you have a team",
      description: "Generate, schedule, and optimize social content for all platforms. Your followers will never know you're doing this in 2 hours a week.",
      objectives: [
        "Generate platform-specific content (captions, hashtags, timing)",
        "Use scheduling tools with AI optimization",
        "Create content calendars that actually work",
        "Analyze what's resonating and double down on wins"
      ],
      keyTopics: [
        { title: "Content Batching", desc: "Create a month's worth of content in one sitting. (Yes, really.)" },
        { title: "Platform-Specific Optimization", desc: "LinkedIn doesn't want what TikTok wants. AI helps you speak each platform's language" },
        { title: "Caption Writing", desc: "Your hook, your story, your CTA—AI drafts, you make it legendary" },
        { title: "Engagement & Community", desc: "Build your 1000 true fans with strategic engagement (spoiler: AI helps)" }
      ],
      exercise: {
        title: "Build Your 4-Week Content Calendar",
        desc: "Use AI to generate content for 4 weeks across 2-3 platforms. Batch record videos, write captions, schedule everything. Welcome to freedom.",
        timeEstimate: "120 minutes"
      },
      resources: [
        { title: "Content Calendar Template (with AI prompts)", type: "Template" },
        { title: "Hashtag Strategy for Each Platform", type: "Guide" },
        { title: "Caption Formula Cheat Sheet", type: "Cheat Sheet" },
        { title: "Best Scheduling Tools (Free + Paid Comparison)", type: "Resource" }
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
                  const isClickable = module.status !== "locked" && module.week === 1;
                  return (
                    <button
                      key={module.week}
                      onClick={() => {
                        console.log('Card clicked:', module.week, 'isClickable:', isClickable);
                        if (isClickable) {
                          console.log('Expanding lesson:', module.lessons[0]);
                          setExpandedLesson(expandedLesson ? null : module.lessons[0]);
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

            {/* Expanded Lesson View - Week 1 Rich Content */}
            {expandedLesson && week1Lessons[expandedLesson as keyof typeof week1Lessons] && (
              <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-2xl p-8 border-2 border-purple-200">
                {(() => {
                  const lesson = week1Lessons[expandedLesson as keyof typeof week1Lessons];
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
                        {modules[0].lessons.map((lessonTitle, idx) => (
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
                        ))}
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
