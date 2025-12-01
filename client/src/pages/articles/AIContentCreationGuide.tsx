import { BookOpen, Sparkles, Video, Zap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { SEO } from "@/components/SEO";

export default function AIContentCreationGuide() {
  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="The Complete Guide to AI Content Creation Mastery | MetaHers Mind Spa"
        description="Master AI tools to create stunning content. Learn ChatGPT, Midjourney, video generation, and copywriting strategies that convert."
      />
      
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-200">WEEK 1 CURRICULUM</Badge>
        <h1 className="text-4xl sm:text-5xl font-bold text-black mb-4">
          AI Content Creation Mastery
        </h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Stop struggling with creative blocks. Learn how to use AI tools to generate high-quality content that resonates with your audience and drives conversions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/learning-hub">
            <Button size="lg" className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
              <Sparkles className="w-4 h-4 mr-2" />
              Start Learning
            </Button>
          </Link>
          <a href="#topics" onClick={(e) => e.preventDefault()}>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <ChevronRight className="w-4 h-4 mr-2" />
              Explore Topics
            </Button>
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Why This Matters */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-6">Why Content Creation Matters for Your Business</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <Card className="p-6">
              <Video className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-black mb-2">Build Authority</h3>
              <p className="text-gray-600">High-quality content positions you as an expert in your field, attracting ideal clients naturally.</p>
            </Card>
            <Card className="p-6">
              <Zap className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-black mb-2">Save Time & Money</h3>
              <p className="text-gray-600">AI tools reduce content creation time by 70% while maintaining quality and consistency.</p>
            </Card>
          </div>
        </section>

        {/* Key Topics */}
        <section id="topics" className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-8">Master These Topics</h2>
          <div className="space-y-6">
            
            <Card className="p-8 border-l-4 border-purple-600">
              <h3 className="text-2xl font-bold text-black mb-3">1. ChatGPT Content Generation</h3>
              <p className="text-gray-600 mb-4">Learn advanced prompting techniques to create:</p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Compelling blog posts and articles</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Sales copy that converts</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Email marketing sequences</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Social media captions</li>
              </ul>
              <Badge variant="outline" className="text-purple-600 border-purple-600">Duration: 2 hours</Badge>
            </Card>

            <Card className="p-8 border-l-4 border-purple-600">
              <h3 className="text-2xl font-bold text-black mb-3">2. AI Image Generation (Midjourney & DALL-E)</h3>
              <p className="text-gray-600 mb-4">Create stunning visuals without hiring a designer:</p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Professional product images</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Social media graphics</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Brand aesthetic development</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Consistent style guides</li>
              </ul>
              <Badge variant="outline" className="text-purple-600 border-purple-600">Duration: 2.5 hours</Badge>
            </Card>

            <Card className="p-8 border-l-4 border-purple-600">
              <h3 className="text-2xl font-bold text-black mb-3">3. Video Content with AI Tools</h3>
              <p className="text-gray-600 mb-4">Produce engaging video content at scale:</p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Script generation with ChatGPT</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> AI avatar creation (Synthesia, HeyGen)</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Auto-subtitle generation</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Video editing with AI</li>
              </ul>
              <Badge variant="outline" className="text-purple-600 border-purple-600">Duration: 3 hours</Badge>
            </Card>

            <Card className="p-8 border-l-4 border-purple-600">
              <h3 className="text-2xl font-bold text-black mb-3">4. Copywriting That Converts</h3>
              <p className="text-gray-600 mb-4">Master the psychology of persuasive content:</p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Understanding your audience deeply</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> AIDA framework for conversions</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> Landing page copywriting</li>
                <li className="flex items-center"><span className="text-purple-600 mr-3">✓</span> A/B testing strategies</li>
              </ul>
              <Badge variant="outline" className="text-purple-600 border-purple-600">Duration: 2 hours</Badge>
            </Card>
          </div>
        </section>

        {/* Action Items */}
        <section className="bg-purple-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-black mb-6">Your Action Plan This Week</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="font-semibold text-black mb-1">Set up AI tools</h3>
                <p className="text-gray-600">Create ChatGPT Plus, Midjourney, and video tool accounts</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="font-semibold text-black mb-1">Create 5 pieces of content</h3>
                <p className="text-gray-600">Test AI on blog post, social captions, and one image</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="font-semibold text-black mb-1">Share in our community</h3>
                <p className="text-gray-600">Post your best AI-generated content and get feedback</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-black mb-4">Ready to Master Content Creation?</h2>
          <p className="text-gray-600 mb-6">Join 500+ women solopreneurs learning to leverage AI for exponential growth.</p>
          <Link href="/learning-hub">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Start Your Learning Journey
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
