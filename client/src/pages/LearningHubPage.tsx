import { useState } from "react";
import { useLocation } from "wouter";
import { BookOpen, Calendar, Users, MessageSquare, CheckCircle2, Lock, Clock, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";

export default function LearningHubPage() {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Redirect if not authenticated
  if (!isAuthenticated) {
    setLocation("/ai-mastery");
    return null;
  }

  const modules = [
    {
      week: 1,
      title: "AI Content Creation",
      description: "Master AI tools to create stunning content",
      lessons: 8,
      completed: 3,
      topics: ["ChatGPT Mastery", "Prompt Engineering", "Content Ideas"],
      color: "from-purple-500 to-purple-600",
    },
    {
      week: 2,
      title: "Brand Identity",
      description: "Build your unique AI-powered personal brand",
      lessons: 7,
      completed: 0,
      topics: ["Brand Strategy", "Visual Identity", "Voice & Tone"],
      color: "from-pink-500 to-pink-600",
      locked: true,
    },
    {
      week: 3,
      title: "Website Building",
      description: "Create websites with AI assistance",
      lessons: 9,
      completed: 0,
      topics: ["No-Code Tools", "Design Principles", "SEO"],
      color: "from-orange-500 to-orange-600",
      locked: true,
    },
    {
      week: 4,
      title: "AI Agents",
      description: "Deploy autonomous AI agents for your business",
      lessons: 6,
      completed: 0,
      topics: ["Agent Architecture", "Automation", "Scaling"],
      color: "from-yellow-500 to-yellow-600",
      locked: true,
    },
  ];

  const upcomingSessions = [
    {
      id: 1,
      title: "ChatGPT Advanced Prompts Workshop",
      date: "December 3, 2024",
      time: "7:00 PM EST",
      attendees: 245,
      hosted_by: "Nadia",
      duration: "90 min",
    },
    {
      id: 2,
      title: "Building Your AI Brand Story",
      date: "December 6, 2024",
      time: "6:00 PM EST",
      attendees: 312,
      hosted_by: "Nadia",
      duration: "75 min",
    },
    {
      id: 3,
      title: "AI Website Launch Masterclass",
      date: "December 9, 2024",
      time: "7:30 PM EST",
      attendees: 189,
      hosted_by: "Nadia",
      duration: "90 min",
    },
    {
      id: 4,
      title: "AI Agents for Solo Entrepreneurs",
      date: "December 12, 2024",
      time: "6:00 PM EST",
      attendees: 267,
      hosted_by: "Nadia",
      duration: "90 min",
    },
  ];

  const communityFeatures = [
    {
      icon: Users,
      title: "Private Community",
      description: "Connect with 500+ women solopreneurs",
    },
    {
      icon: MessageSquare,
      title: "Direct Message Nadia",
      description: "Get personal guidance and support",
    },
    {
      icon: Calendar,
      title: "Exclusive Events",
      description: "Monthly mastermind sessions",
    },
    {
      icon: Sparkles,
      title: "Resource Library",
      description: "Templates and AI prompts",
    },
  ];

  const progressPercentage = Math.round((3 / 30) * 100);

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 py-12 sm:py-16">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Your AI Mastery Journey
              </h1>
              <p className="text-purple-100">Welcome back, {user?.firstName || "Master"}!</p>
            </div>
            <div className="hidden sm:block">
              <div className="text-right">
                <p className="text-sm text-purple-100 mb-1">Overall Progress</p>
                <p className="text-3xl font-bold text-white">{progressPercentage}%</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-sm text-purple-100 mb-1">Lessons Completed</p>
              <p className="text-2xl font-bold text-white">3 of 30</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-sm text-purple-100 mb-1">Current Module</p>
              <p className="text-2xl font-bold text-white">Week 1</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-sm text-purple-100 mb-1">Streak Days</p>
              <p className="text-2xl font-bold text-white">5 🔥</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-sm text-purple-100 mb-1">Community</p>
              <p className="text-2xl font-bold text-white">500+</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Live Sessions</span>
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Community</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-8">
            {/* Learning Modules */}
            <div>
              <h2 className="text-2xl font-bold text-black mb-6">4-Week Learning Path</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {modules.map((module) => (
                  <Card
                    key={module.week}
                    className={`overflow-hidden border-0 ${
                      module.locked ? "opacity-60" : ""
                    }`}
                  >
                    <div className={`bg-gradient-to-r ${module.color} h-2`} />
                    <div className="p-6">
                      {module.locked && (
                        <div className="absolute top-4 right-4">
                          <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-3">
                        <Badge className="bg-black text-white">
                          Week {module.week}
                        </Badge>
                        {!module.locked && module.completed > 0 && (
                          <Badge className="bg-green-100 text-green-700 border-0">
                            {module.completed}/{module.lessons} Done
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-black mb-2">
                        {module.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {module.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-semibold text-black">
                            {Math.round(
                              (module.completed / module.lessons) * 100
                            )}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`bg-gradient-to-r ${module.color} h-2 rounded-full transition-all`}
                            style={{
                              width: `${(module.completed / module.lessons) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Topics */}
                      <div className="mb-4">
                        <p className="text-xs text-gray-600 font-semibold mb-2">
                          Topics Covered
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {module.topics.map((topic, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs"
                            >
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button
                        className={`w-full mt-4 ${
                          module.locked
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-black text-white hover:bg-gray-900"
                        }`}
                        disabled={module.locked}
                      >
                        {module.locked ? (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Coming Soon
                          </>
                        ) : (
                          <>
                            Continue Learning
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Upcoming Sessions Alert */}
            <Card className="border-purple-200 bg-purple-50">
              <div className="p-6">
                <h3 className="text-lg font-bold text-black mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Next Live Session in 3 Days!
                </h3>
                <p className="text-gray-700 mb-4">
                  Join Nadia for "ChatGPT Advanced Prompts Workshop" on December 3rd
                </p>
                <Button className="bg-black text-white hover:bg-gray-900">
                  Set Reminder
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Live Sessions Tab */}
          <TabsContent value="sessions" className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-black mb-6">
                Upcoming Live Sessions
              </h2>
              <p className="text-gray-600 mb-6">
                Join every 3 days for interactive training with Nadia
              </p>

              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <Card key={session.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-2 mb-2">
                          <Badge className="bg-purple-600">Live</Badge>
                          <Badge variant="outline">{session.duration}</Badge>
                        </div>
                        <h3 className="text-lg font-bold text-black mb-2">
                          {session.title}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {session.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {session.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {session.attendees} attending
                          </div>
                        </div>
                      </div>
                      <Button className="bg-black text-white hover:bg-gray-900 whitespace-nowrap">
                        Join Session
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Session Guidelines */}
            <Card className="bg-gray-50 p-6">
              <h3 className="font-bold text-black mb-4">Session Guidelines</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  Join 5 minutes early to test your audio
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  Camera optional but recommended for networking
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  Have notebook ready for action items
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  Recordings available for 30 days
                </li>
              </ul>
            </Card>
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-black mb-6">
                Your Community
              </h2>

              {/* Community Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {communityFeatures.map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <Card key={idx} className="p-6 text-center hover:shadow-lg transition-shadow">
                      <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <h3 className="font-bold text-black mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </Card>
                  );
                })}
              </div>

              {/* Direct Message CTA */}
              <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-0 p-8 text-center">
                <MessageSquare className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-black mb-2">
                  Direct Access to Nadia
                </h3>
                <p className="text-gray-700 mb-6">
                  As a program member, you have direct messaging access to get personalized guidance
                </p>
                <Button className="bg-black text-white hover:bg-gray-900 mx-auto">
                  Message Nadia
                </Button>
              </Card>

              {/* Community Stats */}
              <Card className="p-6">
                <h3 className="font-bold text-black mb-4">Community Stats</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-purple-600">500+</p>
                    <p className="text-sm text-gray-600">Members</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-pink-600">48</p>
                    <p className="text-sm text-gray-600">Active Daily</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600">12</p>
                    <p className="text-sm text-gray-600">Countries</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
